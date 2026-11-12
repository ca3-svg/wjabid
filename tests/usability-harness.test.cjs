const test = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const harnessPath = path.join(repoRoot, 'usability', 'harness.mjs');

function runHarness(args) {
  return execFileSync(process.execPath, [harnessPath, ...args], {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

test('usability harness validates its task and device packs', () => {
  const output = runHarness(['check']);
  assert.match(output, /Usability pack: 7 tasks, 6 platform profiles/);
  assert.match(output, /Valid/);
});

test('preparing a run creates separate agent and evaluator briefs', () => {
  const outputDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'wja-usability-'));
  try {
    const output = runHarness([
      'prepare',
      '--platform',
      'iphone-portrait',
      '--task',
      'pairing-date-choices',
      '--out',
      outputDirectory,
    ]);
    const runPath = output.match(/Run bundle: (.+)/)?.[1];
    assert.ok(runPath, output);
    assert.equal(path.dirname(runPath), outputDirectory);

    const agentBrief = fs.readFileSync(path.join(runPath, 'AGENT-RUN.md'), 'utf8');
    const evaluatorBrief = fs.readFileSync(path.join(runPath, 'EVALUATOR-NOTES.md'), 'utf8');
    const metadata = JSON.parse(fs.readFileSync(path.join(runPath, 'run.json'), 'utf8'));
    const findings = JSON.parse(fs.readFileSync(path.join(runPath, 'findings.json'), 'utf8'));

    assert.match(agentBrief, /M302W/);
    assert.match(agentBrief, /iphone-portrait/);
    assert.doesNotMatch(agentBrief, /Expected outcome|Evaluator checks/);
    assert.match(evaluatorBrief, /Expected outcome/);
    assert.equal(metadata.platform, 'iphone-portrait');
    assert.deepEqual(metadata.tasks, ['pairing-date-choices']);
    assert.deepEqual(findings, []);
  } finally {
    fs.rmSync(outputDirectory, { recursive: true, force: true });
  }
});

test('preparing a run rejects unknown platform or task names', () => {
  assert.throws(
    () => runHarness(['prepare', '--platform', 'galaxy-unknown', '--task', 'pairing-date-choices']),
    /Unknown platform/,
  );
  assert.throws(
    () => runHarness(['prepare', '--platform', 'iphone-portrait', '--task', 'invented-task']),
    /Unknown task/,
  );
});

test('local device server serves the app but blocks other project files', async (t) => {
  const server = spawn(process.execPath, [harnessPath, 'serve', '--host', '127.0.0.1', '--port', '0'], {
    cwd: repoRoot,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  t.after(() => server.kill());

  let output = '';
  const url = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(`Server did not start: ${output}`)), 5000);
    server.stdout.setEncoding('utf8');
    server.stdout.on('data', (chunk) => {
      output += chunk;
      const match = output.match(/Listening at (http:\/\/127\.0\.0\.1:\d+)/);
      if (match) {
        clearTimeout(timeout);
        resolve(match[1]);
      }
    });
    server.once('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    server.once('exit', (code) => {
      clearTimeout(timeout);
      reject(new Error(`Server exited with ${code}: ${output}`));
    });
  });

  const app = await fetch(url);
  assert.equal(app.status, 200);
  assert.match(app.headers.get('content-type'), /text\/html/);
  assert.match(await app.text(), /WestJet Bid Builder/);

  const metadata = await fetch(`${url}/airport-metadata.js`);
  assert.equal(metadata.status, 200);
  assert.match(metadata.headers.get('content-type'), /javascript/);
  assert.equal((await fetch(`${url}/README.md`)).status, 404);
  assert.equal((await fetch(`${url}/docs/CHANGE-LIST.md`)).status, 404);
  assert.equal((await fetch(url, { method: 'POST' })).status, 405);
});
