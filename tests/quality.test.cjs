const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.htm'), 'utf8');
const scripts = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)];
const source = scripts.at(-1)[1];
const schedule = `TRIP #258 M302W (OL) [1,1,0,0] YUL: _2_____ effective DEC 08-DEC 29 except DEC 22
 RPT 08:00
 Tu 1 02986 YUL RIH 09:00 15:10 6h10
 ---- RIH hotel TBD / Hotel Shuttle ---- 73h00
 Fr 4 02987 RIH YUL 17:25 23:15 5h50
 RLS 23:30
 TAFB: 87h30 Credit Time: 23h20(T) PERDIEM: 789.25
TRIP #258 M302W (OL) [1,1,0,0] YUL: _2_____ effective DEC 22-DEC 22 no exceptions.
 RPT 08:00
 Tu 1 02986 YUL RIH 09:00 15:10 6h10
 ---- RIH hotel TBD / Hotel Shuttle ---- 73h00
 Fr 4 02987 RIH YUL 17:25 23:15 5h50
 RLS 23:30
 TAFB: 87h30 Credit Time: 23h20(T) PERDIEM: 789.25`;

function harness() {
  class BidMonthDate extends Date {
    constructor(...args) { super(...(args.length ? args : ['2026-11-09T17:00:00Z'])); }
    static now() { return Date.parse('2026-11-09T17:00:00Z'); }
  }
  const elements = new Map();
  let activeElement = null;
  const element = id => {
    if (!elements.has(id)) elements.set(id, {value:id === 'prefer-days' ? '0' : id === 'ranking-profile-name' ? 'Example' : '', checked:false, dataset:{}, style:{}, textContent:'', innerHTML:'',
      classList:{add(){},remove(){},contains(){return false;}}, addEventListener(){}, click(){}, appendChild(){}, append(){}, replaceChildren(){}, setAttribute(){},
      querySelector(){return element('child');},querySelectorAll(){return [];},contains(){return false;},closest(){return null;},focus(){activeElement=this;}});
    return elements.get(id);
  };
  class Table {
    constructor(selector, options) {this.options=options;this.events={};this.filters=[];this.data=options.data;this.destroyed=false;}
    on(name, fn){this.events[name]=fn;}
    destroy(){this.destroyed=true;}
    clearFilter(){this.filters=[];}
    addFilter(...args){this.filters.push(args);}
    setSort(){}
    getRows(){return this.data.map(data => ({getData:()=>data,update:patch=>Object.assign(data,patch)}));}
  }
  const stored = new Map();
  const document = {getElementById:element,querySelector:()=>element('query'),querySelectorAll:()=>[],addEventListener(){},body:element('body'),documentElement:element('html'),createElement:()=>element(Symbol())};
  Object.defineProperty(document,'activeElement',{get:()=>activeElement,set:value=>{activeElement=value;}});
  const context = vm.createContext({console,Intl,Date:BidMonthDate,Set,Map,Tabulator:Table,window:{},document,
    localStorage:{setItem:(k,v)=>stored.set(k,v),getItem:k=>stored.get(k),removeItem:k=>stored.delete(k)},lucide:{createIcons(){}},setTimeout(){},requestAnimationFrame(){},confirm:()=>true,prompt:()=> 'Example',schedule});
  vm.runInContext(fs.readFileSync(path.join(root,'airport-metadata.js'),'utf8'),context);
  vm.runInContext(source,context);
  vm.runInContext("renderBidSlots=()=>{}; showToast=(msg)=>globalThis.lastToast=msg; allPairings=parseFullText(schedule);",context);
  const run = code => vm.runInContext(code,context);
  return {run,element,stored,getActiveElement:()=>activeElement};
}

test('all inline scripts compile',()=>{for(const s of scripts) new vm.Script(s[1]);});
test('PDF text reconstruction preserves column positions from the source coordinates',()=>{const {run}=harness();const text=run("reconstructPdfPageText([{str:'DAY',width:18,transform:[1,0,0,1,30,100]},{str:'FLT#',width:24,transform:[1,0,0,1,90,100]},{str:'MON',width:18,transform:[1,0,0,1,30,88]},{str:'02986',width:30,transform:[1,0,0,1,90,88]}])");assert.equal(text,'     DAY       FLT#\n     MON       02986');});
test('older saved source text prompts for one PDF re-upload to restore columns',()=>{const {run,element}=harness();run("localStorage.setItem('westjet_bid_data',JSON.stringify({allPairings:parseFullText(schedule)})); loadData()");assert.equal(element('upload-zone-title').textContent,'Re-upload the bid PDF to restore schedule columns');assert.match(element('upload-zone-help').textContent,/saved text does not include the original column positions/i);});
test('all airports in the December network have a region and valid IANA time zone',()=>{const {run}=harness();const codes='ANU ATL AUA AZS BGI BON BZE CDG CUN CUR CZM FLL FPO GCM GND GRU HNL HUX IAH JFK KIN KOA LAS LAX LHR LIR LRM LTO MBJ MCO MEX MGA MIA MID MSP MZT NAS NRT OGG PHX PLS POP POS PSP PTY PUJ PVR PXM RIH RSW RTB SAN SEA SFO SJD SJU SNA SXM TPA TPQ TQO UVF YBG YEG YFI YHM YHZ YKF YLW YOW YQB YQG YQM YQQ YQR YQT YUL YVR YWG YXE YXS YXU YXX YYC YYJ YYT YYZ YZF ZIH ZLO'.split(' ');const metadata=run('window.AIRPORT_METADATA');const missing=codes.filter(code=>!metadata[code]?.region||!metadata[code]?.timeZone);assert.deepEqual(missing,[]);for(const code of codes)assert.doesNotThrow(()=>new Intl.DateTimeFormat('en-US',{timeZone:metadata[code].timeZone}));assert.equal(metadata.YZF.city,'Yellowknife');assert.equal(metadata.BZE.region,'Caribbean');});
test('fatigue scoring profiles explain and calculate pairing-only exposure',()=>{const {run}=harness();assert.equal(run('Object.keys(FATIGUE_SCORING_PROFILES).length'),5);assert.equal(run("pairingFatigueComponents(expandPairingOccurrences(allPairings)[0]).recovery"),0);assert.equal(run("pairingFatigueComponents(expandPairingOccurrences(allPairings)[0]).nightTiming"),25);assert.equal(run("pairingFatigueComponents(expandPairingOccurrences(allPairings)[0]).workload"),25);assert.equal(run("pairingFatigueScore(expandPairingOccurrences(allPairings)[0],'balanced').score"),12.5);assert.equal(run("pairingFatigueScore(expandPairingOccurrences(allPairings)[0],'circadian').score"),25);});
test('fatigue scores preserve unknown factors and disclose score coverage',()=>{const {run}=harness();run("const p=expandPairingOccurrences(allPairings)[0]; p.layovers=[]; p.max_timezone_shift=null; globalThis.fatiguePartial=pairingFatigueScore(p,'balanced')");assert.equal(run('fatiguePartial.score'),25);assert.equal(run('fatiguePartial.knownComponents'),2);assert.equal(run("pairingFatigueScore({...fatiguePartial.pairing,layovers:[]},'recovery').score"),null);});
test('fatigue profile and ranking weight are saved with ranking setups',()=>{const {run,element}=harness();element('fatigue-profile').value='recovery';element('weight-fatigue').value='7';run("bidWeights.fatigue=7; setFatigueScoringMethod('recovery'); savePreferenceProfile(); setFatigueScoringMethod('balanced'); bidWeights.fatigue=0; loadPreferenceProfile('Example')");assert.equal(run('fatigueScoringMethod'),'recovery');assert.equal(run('bidWeights.fatigue'),7);assert.equal(element('fatigue-profile').value,'recovery');});
test('fatigue exposure lowers ranking only when its weight is above zero',()=>{const {run}=harness();assert.equal(run("(()=>{const base=expandPairingOccurrences(allPairings)[0]; const high={...base,layovers:[{duration:'00h00'}],days:{1:[{}, {}, {}, {}]},total_legs:4}; fatigueScoringMethod='recovery'; bidWeights.fatigue=5; const weighted=scorePairing(high); bidWeights.fatigue=0; return weighted<scorePairing(high)})()"),true);assert.equal(run("(()=>{const base=expandPairingOccurrences(allPairings)[0]; bidWeights.fatigue=0; fatigueScoringMethod='recovery'; const a=scorePairing(base); fatigueScoringMethod='balanced'; return a===scorePairing(base)})()"),true);});
test('M302W has exactly four independently identified dates',()=>{const {run}=harness();assert.equal(run('expandPairingOccurrences(allPairings).length'),4);assert.equal(run('new Set(expandPairingOccurrences(allPairings).map(p=>p.occurrence_id)).size'),4);assert.equal(run("expandPairingOccurrences(allPairings).map(p=>p.occurrence_date).sort().join(',')"),'2026-12-08,2026-12-15,2026-12-22,2026-12-29');});
test('favorite state persists by operating-date occurrence and older data loads without favorites',()=>{const {run,stored}=harness();run("const dates=expandPairingOccurrences(allPairings); togglePairingFavorite(dates[0].occurrence_id); saveData()");const saved=JSON.parse(stored.get('westjet_bid_data'));assert.deepEqual(saved.favoriteOccurrenceIds,[run('expandPairingOccurrences(allPairings)[0].occurrence_id')]);run('favoriteOccurrenceIds.clear(); loadData()');assert.equal(run('favoriteOccurrenceIds.size'),1);run("localStorage.setItem('westjet_bid_data',JSON.stringify({allPairings})); loadData()");assert.equal(run('favoriteOccurrenceIds.size'),0);});
test('favorite column toggles only its occurrence and never adds it to the bid',()=>{const {run}=harness();run('renderPairingTable(); globalThis.favoriteColumn=pairingTable.options.columns.find(c=>c.title===\'Favorite\'); globalThis.favoriteOccurrence=pairingTable.data[0]');assert.ok(run('favoriteColumn'));run('togglePairingFavorite(favoriteOccurrence.occurrence_id)');assert.equal(run('favoriteOccurrenceIds.has(favoriteOccurrence.occurrence_id)'),true);assert.equal(run('favoriteOccurrenceIds.has(pairingTable.data[1].occurrence_id)'),false);assert.equal(run('bidList.length'),0);assert.match(run("favoriteColumn.formatter({getRow:()=>({getData:()=>favoriteOccurrence})})"),/aria-pressed="true"/);});
test('chosen occurrence has its own duty dates including year rollover',()=>{const {run}=harness();assert.equal(run("expandPairingOccurrences(allPairings)[0].all_dates.join(',')"),'2026-12-08,2026-12-11');assert.equal(run("expandPairingOccurrences(allPairings).find(p=>p.occurrence_date==='2026-12-29').all_dates.join(',')"),'2026-12-29,2027-01-01');});
test('parsing preserves shortest and average layover',()=>{const {run}=harness();assert.equal(run('allPairings[0].shortest_layover'),73);assert.equal(run('allPairings[0].average_layover'),73);});
test('flights per workday uses actual flight days, not calendar duration',()=>{const {run}=harness();run('renderPairingTable()');assert.equal(run('pairingTable.data[0].legs_per_day'),1);});
test('opening Bid Builder preserves manual selections',()=>{const {run}=harness();run('bidList=[expandPairingOccurrences(allPairings)[0]]; initBidTable()');assert.equal(run('bidList.length'),1);assert.equal(run('bidList[0].occurrence_date'),'2026-12-08');});
test('opening Bid Builder preserves a saved empty selection',()=>{const {run}=harness();run('initBidTable()');assert.equal(run('bidList.length'),0);});
test('Viewer adds only through the explicit Add action',()=>{const {run}=harness();run('renderPairingTable()');assert.equal(run("typeof pairingTable.events.rowClick"),'undefined');assert.ok(run("pairingTable.options.columns.some(c=>c.title==='Add'&&typeof c.cellClick==='function')"));});
test('Bid Builder adds only through the explicit Add action',()=>{const {run}=harness();run('runBidBuilder(false)');assert.equal(run("typeof bidTable.events.rowClick"),'undefined');assert.ok(run("bidTable.options.columns.some(c=>c.title==='Add'&&typeof c.cellClick==='function')"));});
test('manual selection respects GDOs selected in the planner',()=>{const {run}=harness();run("gdoDays.add('2026-12-08'); addToBid(expandPairingOccurrences(allPairings)[0])");assert.equal(run('bidList.length'),0);});
test('manual selection prevents duplicate dates but allows another recurrence',()=>{const {run}=harness();run('const choices=expandPairingOccurrences(allPairings); addToBid(choices[0]); addToBid(choices[0]); addToBid(choices[1]);');assert.equal(run('bidList.length'),2);});
test('manual selection enforces the credit limit',()=>{const {run}=harness();run('const p=expandPairingOccurrences(allPairings)[0]; p.correctedcredit=76; addToBid(p)');assert.equal(run('bidList.length'),0);});
test('manual selection enforces the workday limit',()=>{const {run}=harness();run('const p=expandPairingOccurrences(allPairings)[0]; p.days_of_work=17; addToBid(p)');assert.equal(run('bidList.length'),0);});
test('a pairing cannot overlap the layover of another selected pairing',()=>{const {run}=harness();run("const first=expandPairingOccurrences(allPairings)[0]; addToBid(first); const other=expandPairingOccurrences([{...allPairings[0],pairing_number:'OTHER',operating_dates:['2026-12-09']}])[0]; addToBid(other)");assert.equal(run('bidList.length'),1);});
test('minimum layover hard filter evaluates every known break',()=>{const {run,element}=harness();element('filter-min-lay').value='74';assert.equal(run('getEligiblePairings().length'),0);element('filter-min-lay').value='24';assert.equal(run('getEligiblePairings().length'),4);});
test('time-zone context uses December and summer offsets',()=>{const {run}=harness();assert.equal(run("expandPairingOccurrences(allPairings)[0].max_timezone_shift"),0);assert.equal(run("timezoneOffsetMinutes('2026-07-10','12:00','America/Toronto')"),-240);assert.equal(run("timezoneOffsetMinutes('2026-12-10','12:00','America/Toronto')"),-300);});
test('a partially unknown route has no fabricated maximum time-zone value',()=>{const {run}=harness();run("const p=expandPairingOccurrences(allPairings)[0]; p.days['4'][0].arr_station='ZZZ'; enrichOccurrenceAirportContext(p,p.occurrence_date); globalThis.unknown=p");assert.equal(run('unknown.max_timezone_shift'),null);});
test('saved ranking targets and weights survive load',()=>{const {run}=harness();run('rankingTargets={flightsPerDay:1,minimumLayoverHours:24}; bidWeights.workload=12; saveData(); rankingTargets={}; bidWeights.workload=0; loadData()');assert.equal(run('rankingTargets.minimumLayoverHours'),24);assert.equal(run('rankingTargets.flightsPerDay'),1);assert.equal(run('bidWeights.workload'),12);});
test('ranking presets expose their selected state accessibly and clear it for custom weights',()=>{assert.match(html,/data-mode="lazy"[^>]*aria-pressed="false"/);assert.match(html,/data-mode="efficient"[^>]*aria-pressed="true"/);assert.match(source,/b\.setAttribute\('aria-pressed',\s*b\.dataset\.mode === mode \? 'true' : 'false'\)/);assert.match(source,/b\.setAttribute\('aria-pressed',\s*'false'\)/);});
test('legacy recurring selections are visibly retained',()=>{const {run}=harness();run('bidList=[allPairings[0]]; saveData(); bidList=[]; loadData()');assert.equal(run('bidList[0].is_legacy_multi_date'),true);assert.equal(run('bidList[0].operating_dates.length'),3);});
test('reset clears targets and restores default ranking',()=>{const {run}=harness();run('rankingTargets.flightsPerDay=3; resetPreferenceProfile()');assert.equal(run('rankingTargets.flightsPerDay'),0);assert.equal(run('bidWeights.credit'),8);});
test('pairing details use a structured itinerary independent of source PDF text',()=>{const {run,element}=harness();run('showPairingDetails(expandPairingOccurrences(allPairings)[0])');assert.match(element('pairing-details-title').textContent,/M302W/);assert.match(element('pairing-details-subtitle').textContent,/2026-12-08/);const html=element('pairing-details-content').innerHTML;assert.match(html,/Per diem/);assert.match(html,/Day-by-day itinerary/);assert.match(html,/<table/);for(const heading of ['Flight','From','To','Departure','Arrival','Block','Time zone'])assert.ok(html.includes(heading),`missing ${heading} column`);assert.match(html,/Day 1 · 2026-12-08/);assert.match(html,/6h 10m block/);assert.match(html,/Rest \/ layover at RIH/);assert.match(html,/02986/);assert.match(html,/YUL/);assert.doesNotMatch(html,/View original schedule text|Original pairing schedule/);assert.ok(!html.includes(run('allPairings[0].original_text')));assert.equal(run("escapeHtml('<img src=x onerror=alert(1)>')"),'&lt;img src=x onerror=alert(1)&gt;');});
test('pairing number and Details open two different modals',()=>{const {run,element}=harness();run("renderPairingTable(); globalThis.testPairingData=pairingTable.data[0]._raw; globalThis.pairingColumn=pairingTable.options.columns.find(c=>c.field==='pairing'); globalThis.detailsColumn=pairingTable.options.columns.find(c=>c.title==='Details'); pairingColumn.cellClick({stopPropagation(){}},{getRow:()=>({getData:()=>({_raw:testPairingData})})})");const original=element('pairing-source-content').innerHTML;assert.match(original,/TRIP #258 M302W/);assert.match(original,/<pre/);assert.doesNotMatch(original,/<table/);run("detailsColumn.cellClick({stopPropagation(){}},{getRow:()=>({getData:()=>({_raw:testPairingData})})})");const details=element('pairing-details-content').innerHTML;assert.match(details,/Day-by-day itinerary/);assert.match(details,/<table/);assert.doesNotMatch(details,/TRIP #258 M302W/);assert.notEqual(element('pairing-source-modal'),element('pairing-details-modal'));});

test('auto-fill rejects trips that overlap during layovers',()=>{const {run}=harness();run("allPairings=[{...allPairings[0],operating_dates:['2026-12-08']},{...allPairings[0],pairing_number:'OTHER',operating_dates:['2026-12-09']}]; runBidBuilder(true)");assert.equal(run('bidList.filter(p=>!p.is_gdo).length'),1);});
test('replacement rejects trips that overlap during layovers',()=>{const {run}=harness();run("const original=expandPairingOccurrences(allPairings); bidList=[original[0],original[3]]; allPairings=[{...allPairings[0],operating_dates:['2026-12-09']}]; replaceBid(1)");assert.equal(run('bidList[1].occurrence_date'),'2026-12-22');});
test('GDO during a layover excludes the trip from automatic candidates',()=>{const {run}=harness();run("gdoDays.add('2026-12-09')");assert.equal(run('getEligiblePairings().length'),3);});
test('older saved records acquire the new layover metrics',()=>{const {run}=harness();run('allPairings.forEach(p=>{delete p.shortest_layover; delete p.average_layover;}); saveData(); loadData()');assert.equal(run('expandPairingOccurrences(allPairings)[0].shortest_layover'),73);});
test('a missing break duration cannot pass a minimum-every-layover filter',()=>{const {run,element}=harness();run("allPairings[0].layovers.push({location:'YVR',duration:'N/A'})");element('filter-min-lay').value='24';assert.equal(run('getEligiblePairings().length'),1);});

test('Viewer Add action selects exactly the clicked date',()=>{const {run}=harness();run("renderPairingTable(); const col=pairingTable.options.columns.find(c=>c.title==='Add'); const row=pairingTable.getRows()[1]; col.cellClick({stopPropagation(){}},{getRow:()=>row})");assert.equal(run('bidList.length'),1);assert.equal(run('bidList[0].occurrence_date'),'2026-12-15');});
test('inspecting a pairing does not add it to the bid',()=>{const {run}=harness();run("renderPairingTable(); const col=pairingTable.options.columns.find(c=>c.field==='pairing'); col.cellClick({stopPropagation(){}},{getRow:()=>pairingTable.getRows()[0]})");assert.equal(run('bidList.length'),0);});
test('ranking re-evaluates scores after changing credit weight',()=>{const {run}=harness();run('renderPairingTable(); globalThis.before=pairingTable.data[0].rank_score; bidWeights.credit=15; refreshViewerRanking()');assert.ok(run('pairingTable.data[0].rank_score > before'));});
test('one flight per duty day fits a target of one better than two',()=>{const {run}=harness();assert.ok(run('const p=expandPairingOccurrences(allPairings)[0]; rankingTargets.flightsPerDay=1; scorePairing(p)>scorePairing({...p,total_legs:4})'));});
test('known larger time-zone shifts lower the score',()=>{const {run}=harness();assert.ok(run('const p=expandPairingOccurrences(allPairings)[0]; scorePairing({...p,max_timezone_shift:0})>scorePairing({...p,max_timezone_shift:3})'));});
test('manual slot cap is enforced',()=>{const {run}=harness();run("bidList=Array.from({length:16},()=>({is_gdo:true,date:'2026-11-01'})); addToBid(expandPairingOccurrences(allPairings)[0])");assert.equal(run('bidList.length'),16);});
test('saved profile restores weights, targets, and preferred duration',()=>{const {run,element}=harness();element('prefer-days').value='4';run("rankingTargets.flightsPerDay=1; rankingTargets.minimumLayoverHours=24; bidWeights.timezone=9; savePreferenceProfile(); resetPreferenceProfile(); loadPreferenceProfile('Example')");assert.equal(run('rankingTargets.minimumLayoverHours'),24);assert.equal(run('bidWeights.timezone'),9);assert.equal(element('prefer-days').value,'4');});
test('maximum layover filter rejects missing durations in the Viewer',()=>{const {run,element}=harness();run("allPairings[0].layovers.push({location:'YVR',duration:'N/A'}); renderPairingTable()");element('filter-max-lay').value='80';run('applyFilters()');assert.equal(run('pairingTable.filters.every(([fn,params])=>typeof fn!=="function" || fn(pairingTable.data[0],params))'),false);});

test('Viewer separates filters that remove results from ranking-only preferences',()=>{assert.ok(html.includes('id="viewer-filter-controls"')&&html.includes('Remove results'));assert.ok(html.includes('id="viewer-ranking-controls"')&&html.includes('Change ranking'));assert.ok(html.includes('prefer-days'));assert.ok(html.includes('Ranking-only preferences reorder')&&html.includes('they do not remove pairings'));});
test('top-level navigation has readable mobile labels and current-page state',()=>{const nav=html.match(/<nav[^>]*id="main-tabs"[\s\S]*?<\/nav>/)?.[0]||'';for(const name of ['Viewer','GDO Planner','Bid Builder'])assert.match(nav,new RegExp(`aria-label="${name}"`));assert.match(nav,/aria-current="page"/);});
test('search, filters, and ranking sliders have persistent labels',()=>{for(const id of ['search-input','filter-base','filter-days','filter-layover-region','filter-min-lay','filter-max-lay','filter-min-credit','filter-rpt-after','filter-rls-before','fatigue-profile','weight-fatigue','weight-credit','weight-layover','weight-commutable','weight-redeye','weight-workload','weight-short-layover','weight-timezone'])assert.match(html,new RegExp(`<label[^>]*for="${id}"`),`${id} needs a persistent label`);});
test('pairing inspection and bid addition are separate accessible buttons',()=>{const {run}=harness();run('renderPairingTable(); runBidBuilder(false)');assert.ok(run("pairingTable.options.columns.some(c=>c.title==='Add')"));assert.ok(run("bidTable.options.columns.some(c=>c.title==='Add')"));const pairingCol=run("pairingTable.options.columns.find(c=>c.field==='pairing')");assert.match(pairingCol.formatter({getValue:()=> 'M302W',getRow:()=>({getData:()=>({pairing:'M302W',date:'2026-12-15'})})}),/<button[^>]*aria-label="View original schedule for M302W on 2026-12-15"/);});
test('pairing details include compact phone legs and the aligned wide table',()=>{const {run,element}=harness();run('showPairingDetails(expandPairingOccurrences(allPairings)[0])');const content=element('pairing-details-content').innerHTML;assert.match(content,/class="sm:hidden/);assert.match(content,/class="hidden sm:block/);assert.match(content,/Day 1 · 2026-12-08/);assert.match(content,/Rest \/ layover at RIH/);assert.match(content,/02986/);});
test('pairing dialogs expose focus return and keyboard trap behavior',()=>{assert.match(source,/function openAccessiblePairingDialog/);assert.match(source,/function closeAccessiblePairingDialog/);assert.match(source,/function trapPairingDialogFocus/);assert.match(html,/id="pairing-source-modal"[^>]*tabindex="-1"/);assert.match(html,/id="pairing-details-modal"[^>]*tabindex="-1"/);});
test('pairing dialog traps Tab and returns focus to its opener',()=>{const {run,element,getActiveElement}=harness();const opener=element('details-opener'),first=element('dialog-first'),last=element('dialog-last'),dialog=element('pairing-details-modal');dialog.querySelectorAll=()=>[first,last];dialog.contains=target=>[dialog,first,last].includes(target);opener.focus();run('showPairingDetails(expandPairingOccurrences(allPairings)[0])');last.focus();run("trapPairingDialogFocus({key:'Tab',shiftKey:false,preventDefault(){globalThis.tabWasTrapped=true}})");assert.equal(run('tabWasTrapped'),true);assert.equal(getActiveElement(),first);run('closePairingDetails()');assert.equal(getActiveElement(),opener);});
test('ranking setup saves in an in-app dialog and confirms the saved profile',()=>{const {run,element}=harness();assert.match(html,/id="ranking-profile-save-dialog"/);assert.match(html,/id="toast"[^>]*role="status"[^>]*aria-live="polite"/);assert.doesNotMatch(source,/function savePreferenceProfile\(\)\s*\{\s*const name = prompt/);run('openPreferenceSaveDialog()');element('ranking-profile-name').value='One flight a day';run('savePreferenceProfile()');assert.ok(run("preferenceProfiles['One flight a day']"));assert.match(run('lastToast'),/saved/i);});
test('blank ranking profile names are rejected without changing saved profiles',()=>{const {run,element}=harness();run('openPreferenceSaveDialog()');element('ranking-profile-name').value='   ';run('savePreferenceProfile()');assert.equal(run('Object.keys(preferenceProfiles).length'),0);});
test('cancelling ranking setup leaves profiles unchanged and restores focus',()=>{const {run,element,getActiveElement}=harness();const opener=element('save-setup-opener');opener.focus();run('openPreferenceSaveDialog()');element('ranking-profile-name').value='Do not save';run('closePreferenceSaveDialog()');assert.equal(run('Object.keys(preferenceProfiles).length'),0);assert.equal(getActiveElement(),opener);});
test('ranking profile dialog traps keyboard focus at its boundaries',()=>{const {run,element,getActiveElement}=harness();const dialog=element('ranking-profile-save-dialog'),first=element('ranking-profile-name'),last=element('profile-save-button');dialog.querySelectorAll=()=>[first,last];dialog.contains=target=>[dialog,first,last].includes(target);last.focus();run("trapPreferenceSaveDialogFocus({key:'Tab',shiftKey:false,preventDefault(){globalThis.profileTabTrapped=true}})");assert.equal(run('profileTabTrapped'),true);assert.equal(getActiveElement(),first);});

if (process.env.WJA_PDF_TEXT) test('actual December PDF extraction preserves schedule columns and valid instances',()=>{
  const {run}=harness();
  const text=fs.readFileSync(process.env.WJA_PDF_TEXT,'utf8');
  run(`allPairings=parseFullText(${JSON.stringify(text)}); globalThis.instances=expandPairingOccurrences(allPairings)`);
  assert.equal(run("instances.filter(p=>p.pairing_number==='M302W').map(p=>p.occurrence_date).sort().join(',')"),'2026-12-08,2026-12-15,2026-12-22,2026-12-29');
  const yulExample=run("allPairings.find(p=>p.trip_number==='232'&&p.pairing_number==='M3026')");
  assert.ok(yulExample);
  const scheduleLines=yulExample.original_text.split('\n');
  const headings=scheduleLines.find(line=>line.includes('DAY')&&line.includes('FLT#'));
  const flightLine=scheduleLines.find(line=>line.includes('09445')&&line.includes('YUL YQB'));
  assert.ok(headings&&flightLine);
  assert.ok(Math.abs(headings.indexOf('DEP')-flightLine.indexOf('YUL'))<=2,'origin airport should stay under the departure heading');
  assert.ok(run('instances.length > 100'));
  assert.equal(run('new Set(instances.map(p=>p.occurrence_id)).size'),run('instances.length'));
  assert.equal(run('instances.every(p=>Number.isFinite(scorePairing(p)))'),true);
  run('runBidBuilder(true)');
  assert.ok(run('bidList.reduce((sum,p)=>sum+(p.correctedcredit||0),0)<=75'));
  assert.ok(run('bidList.reduce((sum,p)=>sum+(p.days_of_work||0),0)<=16'));
  assert.ok(run('bidList.length<=16'));
  assert.equal(run('const occupied=bidList.filter(p=>!p.is_gdo).flatMap(pairingOccupiedDates); occupied.length===new Set(occupied).size'),true);
  console.log(`December PDF: ${run('allPairings.length')} source blocks, ${run('instances.length')} operating-date choices`);
});
