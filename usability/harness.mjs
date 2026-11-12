#!/usr/bin/env node
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const taskFile = path.join(path.dirname(fileURLToPath(import.meta.url)), 'tasks.json');
const platformFile = path.join(path.dirname(fileURLToPath(import.meta.url)), 'platforms.json');
const appFiles = new Map([
  ['/', ['index.htm', 'text/html; charset=utf-8']],
  ['/index.htm', ['index.htm', 'text/html; charset=utf-8']],
  ['/airport-metadata.js', ['airport-metadata.js', 'text/javascript; charset=utf-8']],
]);

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function requireValue(condition, message) {
  if (!condition) throw new Error(message);
}

function validatePack(tasksPack, platformsPack) {
  requireValue(Array.isArray(tasksPack.tasks) && tasksPack.tasks.length > 0, 'tasks.json must contain at least one task.');
  requireValue(Array.isArray(platformsPack.platforms) && platformsPack.platforms.length > 0, 'platforms.json must contain at least one platform.');
  const taskIds = new Set();
  for (const task of tasksPack.tasks) {
    requireValue(typeof task.id === 'string' && task.id.trim(), 'Every task needs a non-empty id.');
    requireValue(!taskIds.has(task.id), `Duplicate task id: ${task.id}`);
    taskIds.add(task.id);
    requireValue(typeof task.title === 'string' && typeof task.prompt === 'string' && task.prompt.trim(), `Task ${task.id} needs a title and prompt.`);
    requireValue(Array.isArray(task.preconditions) && task.preconditions.length > 0, `Task ${task.id} needs preconditions.`);
    requireValue(Array.isArray(task.successCriteria) && task.successCriteria.length > 0, `Task ${task.id} needs evaluator success criteria.`);
    requireValue(Array.isArray(task.riskAreas), `Task ${task.id} needs a riskAreas array.`);
  }
  const platformIds = new Set();
  for (const platform of platformsPack.platforms) {
    requireValue(typeof platform.id === 'string' && platform.id.trim(), 'Every platform needs a non-empty id.');
    requireValue(!platformIds.has(platform.id), `Duplicate platform id: ${platform.id}`);
    platformIds.add(platform.id);
    requireValue(['emulated', 'actual-device'].includes(platform.mode), `Platform ${platform.id} has an invalid mode.`);
    requireValue(typeof platform.device === 'string' && typeof platform.browser === 'string', `Platform ${platform.id} needs device and browser names.`);
    if (platform.mode === 'emulated') {
      requireValue(Number.isInteger(platform.viewport?.width) && Number.isInteger(platform.viewport?.height), `Emulated platform ${platform.id} needs an integer viewport.`);
      requireValue(typeof platform.viewport.orientation === 'string' && typeof platform.viewport.touch === 'boolean', `Emulated platform ${platform.id} needs orientation and touch settings.`);
    }
  }
  return { taskCount: taskIds.size, platformCount: platformIds.size };
}

function parseOptions(args) {
  const options = { tasks: [] };
  for (let index = 0; index < args.length; index += 1) {
    const key = args[index];
    if (!key.startsWith('--')) throw new Error(`Unexpected argument: ${key}`);
    const value = args[index + 1];
    if (!value || value.startsWith('--')) throw new Error(`Missing value for ${key}`);
    index += 1;
    if (key === '--task') options.tasks.push(value);
    else if (key === '--platform') options.platform = value;
    else if (key === '--out') options.out = value;
    else if (key === '--url') options.url = value;
    else if (key === '--host') options.host = value;
    else if (key === '--port') options.port = value;
    else throw new Error(`Unknown option: ${key}`);
  }
  return options;
}

function timestampSlug(date = new Date()) {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

function createRunBundle(tasksPack, platformsPack, options) {
  requireValue(options.platform, 'Choose a platform with --platform.');
  const platform = platformsPack.platforms.find((item) => item.id === options.platform);
  requireValue(platform, `Unknown platform: ${options.platform}`);
  const selectedIds = options.tasks.length ? options.tasks : tasksPack.tasks.map((task) => task.id);
  const uniqueIds = [...new Set(selectedIds)];
  requireValue(uniqueIds.length === selectedIds.length, 'Do not repeat the same --task value.');
  const tasks = uniqueIds.map((id) => {
    const task = tasksPack.tasks.find((item) => item.id === id);
    requireValue(task, `Unknown task: ${id}`);
    return task;
  });

  const outputRoot = path.resolve(options.out || path.join(path.dirname(taskFile), 'runs'));
  fs.mkdirSync(outputRoot, { recursive: true });
  const runName = `${timestampSlug()}-${platform.id}`;
  let runDirectory = path.join(outputRoot, runName);
  let suffix = 1;
  while (fs.existsSync(runDirectory)) {
    runDirectory = path.join(outputRoot, `${runName}-${suffix}`);
    suffix += 1;
  }
  fs.mkdirSync(runDirectory, { recursive: false });

  const metadata = {
    formatVersion: 1,
    generatedAt: new Date().toISOString(),
    appUrl: options.url || 'http://127.0.0.1:4173/',
    platform: platform.id,
    platformProfile: platform,
    tasks: tasks.map((task) => task.id),
    agent: { name: '', model: '', runId: '' },
    notes: 'Emulation and actual-device sessions are different evidence; do not merge their results without labeling the platform.'
  };
  const agentBrief = [
    '# Agent usability session',
    '',
    `Run: ${path.basename(runDirectory)}`,
    `App: ${metadata.appUrl}`,
    `Platform: ${platform.id} — ${platform.device}, ${platform.browser} (${platform.mode})`,
    platform.viewport ? `Viewport: ${platform.viewport.width} × ${platform.viewport.height}, ${platform.viewport.orientation}, touch ${platform.viewport.touch ? 'on' : 'off'}` : 'Device setup: use the named physical device and browser.',
    `Platform note: ${platform.notes}`,
    '',
    '## Session rules',
    '',
    '- Use the rendered screen and accessibility tree as needed to operate controls. Do not inspect application source, raw DOM with developer tools, browser storage, or network logs during the task run.',
    '- Start from the stated preconditions. Do not silently repair a failed setup or use an undocumented shortcut.',
    '- Work toward the task goal without being told which controls to click. If stuck, try one reasonable recovery, then report the obstacle.',
    '- Record concise visible observations and actions; do not provide hidden chain-of-thought.',
    '- Capture screenshots or short recordings for unexpected behavior when the environment allows it. Reference evidence by relative path in findings.json.',
    '- Do not invent missing app behavior or data. Mark uncertain observations as uncertain.',
    '- Report what happened, not whether the interface is generally good or bad. Keep each issue tied to a task and a reproducible step.',
    '- Do not read EVALUATOR-NOTES.md during the session. It contains criteria used to assess the run.',
    '',
    '## Starting state',
    '',
    '- Use a fresh browser profile or clear the app state before setup, unless the task says otherwise.',
    '- Use only a redacted or synthetic bid PDF for this run.',
    '- Complete each task in its own clean app state if earlier changes could affect later tasks.',
    '',
    '## Bidder tasks',
    '',
    ...tasks.map((task, index) => [
      `### ${index + 1}. ${task.title}`,
      '',
      `Precondition: ${task.preconditions.join(' ')}`,
      '',
      `Task: ${task.prompt}`,
      '',
      'At the end, record completion as complete, partial, or blocked and note the last meaningful action.',
      ''
    ].join('\n')),
    '## Submit',
    '',
    'Fill in findings.json using the supplied finding schema. Include successful task attempts too, with no finding if there was no usability issue. Keep the agent run distinct from later human pilot validation.'
  ].join('\n');

  const evaluatorBrief = [
    '# Evaluator notes — do not include in the agent prompt',
    '',
    'Compare observed task behavior with these checks. A mismatch is a review lead, not automatically a confirmed defect.',
    ...tasks.map((task, index) => [
      `## ${index + 1}. ${task.id}: ${task.title}`,
      '',
      '**Expected outcome / evaluator checks**',
      ...task.successCriteria.map((criterion) => `- ${criterion}`),
      '',
      '**Risk areas to inspect**',
      ...task.riskAreas.map((risk) => `- ${risk}`),
      ''
    ].join('\n')),
    '## Review discipline',
    '',
    '- Confirm each reported issue from the evidence before changing the app.',
    '- Mark agent-only findings `needs-pilot-validation` when the issue depends on human perception, domain preference, or trust.',
    '- Do not treat completion time from an LLM agent as comparable to a person’s task time.'
  ].join('\n');

  const report = [
    '# Usability run report',
    '',
    `- Run: ${path.basename(runDirectory)}`,
    `- Platform: ${platform.id} (${platform.mode})`,
    `- App URL: ${metadata.appUrl}`,
    '- Agent/model:',
    '- Bid fixture label (no personal path):',
    '- Reviewer:',
    '',
    '## Summary',
    '',
    '| Task | Outcome (complete/partial/blocked) | Issues | Notes |',
    '| --- | --- | ---: | --- |',
    ...tasks.map((task) => `| ${task.id} |  | 0 |  |`),
    '',
    '## Findings',
    '',
    'Add one entry per issue to findings.json. Record agent observations separately from human validation.',
    '',
    '## Follow-up',
    '',
    '- Findings confirmed by rerun:',
    '- Findings needing pilot validation:',
    '- Candidate product changes:'
  ].join('\n');

  fs.writeFileSync(path.join(runDirectory, 'run.json'), `${JSON.stringify(metadata, null, 2)}\n`, 'utf8');
  fs.writeFileSync(path.join(runDirectory, 'AGENT-RUN.md'), `${agentBrief}\n`, 'utf8');
  fs.writeFileSync(path.join(runDirectory, 'EVALUATOR-NOTES.md'), `${evaluatorBrief}\n`, 'utf8');
  fs.writeFileSync(path.join(runDirectory, 'RUN-REPORT.md'), `${report}\n`, 'utf8');
  fs.writeFileSync(path.join(runDirectory, 'findings.json'), '[]\n', 'utf8');
  fs.copyFileSync(path.join(path.dirname(taskFile), 'finding-schema.json'), path.join(runDirectory, 'finding-schema.json'));
  console.log(`Run bundle: ${runDirectory}`);
}

function startServer(options) {
  const host = options.host || '127.0.0.1';
  const port = options.port === undefined ? 4173 : Number(options.port);
  requireValue(Number.isInteger(port) && port >= 0 && port <= 65535, 'Port must be an integer from 0 to 65535.');
  const server = http.createServer((request, response) => {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      response.writeHead(405, { Allow: 'GET, HEAD', 'Content-Length': '0' });
      response.end();
      return;
    }
    let pathname;
    try {
      pathname = new URL(request.url, 'http://localhost').pathname;
    } catch {
      response.writeHead(400, { 'Content-Length': '0' });
      response.end();
      return;
    }
    const served = appFiles.get(pathname);
    if (!served) {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8', 'Content-Length': '9' });
      response.end(request.method === 'HEAD' ? undefined : 'Not found');
      return;
    }
    const [fileName, contentType] = served;
    const content = fs.readFileSync(path.join(root, fileName));
    response.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': content.length,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    });
    response.end(request.method === 'HEAD' ? undefined : content);
  });
  server.listen(port, host, () => {
    const address = server.address();
    console.log(`Listening at http://${host}:${address.port}/`);
    if (host === '0.0.0.0' || host === '::') {
      const addresses = Object.values(os.networkInterfaces()).flat().filter((item) => item && item.family === 'IPv4' && !item.internal).map((item) => item.address);
      for (const addressText of [...new Set(addresses)]) console.log(`LAN device URL: http://${addressText}:${address.port}/`);
      console.log('This server has no login or encryption. Use only on a trusted private network and with synthetic or redacted test data.');
    }
  });
  server.on('error', (error) => {
    console.error(`Unable to start local server: ${error.message}`);
    process.exitCode = 1;
  });
}

function printHelp() {
  console.log([
    'WJA Bid usability harness',
    '',
    'Commands:',
    '  node usability/harness.mjs check',
    '  node usability/harness.mjs prepare --platform <id> [--task <id> ...] [--url <app-url>] [--out <directory>]',
    '  node usability/harness.mjs serve [--host 127.0.0.1] [--port 4173]',
    '',
    'Run "prepare" once for each device context. Use actual-device profiles only while testing on the named physical device.'
  ].join('\n'));
}

function main() {
  const [command, ...args] = process.argv.slice(2);
  if (!command || command === 'help' || command === '--help') return printHelp();
  const tasksPack = readJson(taskFile);
  const platformsPack = readJson(platformFile);
  if (command === 'check') {
    const counts = validatePack(tasksPack, platformsPack);
    readJson(path.join(path.dirname(taskFile), 'finding-schema.json'));
    console.log(`Usability pack: ${counts.taskCount} tasks, ${counts.platformCount} platform profiles`);
    console.log('Valid');
    return;
  }
  const options = parseOptions(args);
  if (command === 'prepare') {
    validatePack(tasksPack, platformsPack);
    createRunBundle(tasksPack, platformsPack, options);
    return;
  }
  if (command === 'serve') {
    startServer(options);
    return;
  }
  throw new Error(`Unknown command: ${command}`);
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
