import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../engine.js';
import * as P from '../storage.js';
import {roadmap} from '../roadmap.js';

const MON='2026-11-09',TUE='2026-11-10',WED='2026-11-11';
let sequence=0;
const request=()=>`refuge-${++sequence}`;
const appearance=(values={})=>({cloak:'forest',skin:'warm',hair:'short',accessory:'none',decor:['books','lamp','rug'],simplified:false,...values});
const valid=s=>assert.equal(E.validateState(s),true);
const roundtrip=s=>E.parseState(E.serializeState(s));
const item=(s,id)=>E.refugeProgress(s).items.find(entry=>entry.id===id);
const unlocked=(s,id)=>{const entry=item(s,id);assert.ok(entry,`item ${id}`);return entry.unlocked;};
function study(s,day=MON,minutes=5,options={}) {
  E.recordStudySession(s,day,{minutes,goal:'Praticar no editor local',kind:'review',lessonId:null,projectId:null,exercises:0,requestId:request(),...options});
  return E.studySessions(s).at(-1);
}
function project(s,day=MON) {
  E.createStudyProject(s,'Diário de hábitos',null,day,request());
  const created=E.studyProjects(s).at(-1);
  E.completeStudyProject(s,created.id,day,request());
  return created.id;
}
function unchanged(s,run,pattern) {
  const before=structuredClone(s);
  assert.throws(run,pattern);
  assert.deepEqual(s,before);
  valid(s);
}
class MemoryStorage {
  values=new Map();failKey=null;
  getItem(key){return this.values.get(key)??null;}
  setItem(key,value){if(key===this.failKey)throw new DOMException('quota','QuotaExceededError');this.values.set(key,value);}
  removeItem(key){if(key===this.failKey)throw new DOMException('quota','QuotaExceededError');this.values.delete(key);}
}

test('refúgio: abrir o estado inicial deriva básicos sem gravar preferências ou moedas',()=>{
  for(const s of [E.createState(MON),E.createStudyState(MON)]) {
    const before=structuredClone(s),raw=E.serializeState(s),view=E.appearanceFor(s);
    assert.equal(view.effective.accessory,'none');
    assert.deepEqual(view.effective.decor,[]);
    assert.equal(view.preferred.cloak,'forest');
    assert.equal(E.refugeProgress(s).stats.practiceDays,0);
    assert.equal(unlocked(s,'leaf'),false);
    assert.deepEqual(s,before);
    assert.equal(E.serializeState(s),raw);
    assert.deepEqual(E.totals(s),{xp:0,coins:0});
    assert.equal(Object.hasOwn(s.config,'appearance'),false);
  }
});

test('refúgio: a primeira mínima libera cosmético sem um segundo pagamento',()=>{
  const s=E.createStudyState(MON);
  E.complete(s,'read',MON,'minimum',roadmap);
  const before=structuredClone(s);
  assert.equal(unlocked(s,'leaf'),true);
  assert.equal(E.refugeProgress(s).stats.practiceDays,1);
  assert.equal(E.updateAppearance(s,appearance({accessory:'leaf',cloak:'clay'})),true);
  assert.deepEqual(E.totals(s),{xp:5,coins:2});
  assert.deepEqual(s.events,before.events);
  assert.deepEqual(s.records,before.records);
  assert.deepEqual(s.study,before.study);
  assert.equal(E.appearanceFor(s).effective.accessory,'leaf');
  valid(s);
});

test('refúgio: mínimos, upgrades e várias sessões no mesmo dia contam um único dia',()=>{
  const s=E.createStudyState(MON);
  E.complete(s,'read',MON,'minimum',roadmap);
  E.complete(s,'read',MON,'normal',roadmap);
  E.complete(s,'dog-am',MON,'normal',roadmap);
  study(s,MON);study(s,MON);
  const stats=E.refugeProgress(s).stats;
  assert.equal(stats.practiceDays,1);
  assert.equal(stats.readingDays,1);
  assert.equal(stats.dogDays,1);
  assert.equal(unlocked(s,'scarf'),false);
  assert.equal(unlocked(s,'books'),false);
  assert.equal(unlocked(s,'rug'),false);
});

test('refúgio: dias da habilidade usam o snapshot, inclusive pontuação zero',()=>{
  const s=E.createStudyState(MON),reading=s.config.missions.find(m=>m.id==='read');
  reading.xp=0;reading.minXp=0;
  for(const day of [MON,TUE,WED])E.complete(s,'read',day,'minimum',roadmap);
  reading.skill='home';
  const stats=E.refugeProgress(s).stats;
  assert.equal(stats.readingDays,3);
  assert.equal(stats.homeDays,0);
  assert.equal(unlocked(s,'books'),true);
  valid(s);
});

test('refúgio: três dias de cuidado liberam tapete sem transformar ilustração em cuidado',()=>{
  const s=E.createStudyState(MON);
  for(const day of [MON,TUE,WED])E.complete(s,'dog-am',day,'minimum',roadmap);
  const before=structuredClone(s),view=E.appearanceFor(s);
  assert.equal(unlocked(s,'rug'),true);
  assert.ok(view.effective.decor.includes('rug'));
  assert.deepEqual(s,before);
  assert.equal(Object.keys(s.records).length,3);
  assert.equal(E.refugeProgress(s).stats.dogDays,3);
});

test('refúgio: semana possível aceita três dias não consecutivos e permanece histórica',()=>{
  const s=E.createStudyState(MON);
  for(const day of [MON,WED,E.addDays(MON,4)])study(s,day);
  assert.equal(unlocked(s,'scarf'),true);
  assert.equal(unlocked(s,'charm'),true);
  E.updateAppearance(s,appearance({accessory:'scarf'}));
  const before=structuredClone(s);
  // A consulta não depende do dia atual nem exige renovar a conquista semanal.
  assert.equal(unlocked(roundtrip(s),'scarf'),true);
  assert.equal(E.appearanceFor(s).effective.accessory,'scarf');
  assert.deepEqual(s,before);
});

test('refúgio: dois dias de uma semana e um de outra não formam três na mesma semana',()=>{
  const s=E.createStudyState(MON);
  for(const day of [E.addDays(MON,5),E.addDays(MON,6),E.addDays(MON,7)])study(s,day);
  assert.equal(E.refugeProgress(s).stats.practiceDays,3);
  assert.equal(unlocked(s,'scarf'),false);
});

test('refúgio: a retomada requer um dia sem registro entre duas práticas ativas',()=>{
  const s=E.createStudyState(MON);
  study(s,MON);study(s,TUE);
  assert.equal(unlocked(s,'charm'),false);
  const resumed=study(s,E.addDays(MON,3));
  assert.equal(unlocked(s,'charm'),true);
  E.undoStudySession(s,resumed.id,E.addDays(MON,3),request());
  assert.equal(unlocked(s,'charm'),false);
});

test('refúgio: fase e projeto continuam independentes, com desbloqueio apenas por projeto concluído',()=>{
  const s=E.createStudyState(MON);
  E.completePhase(s,1,MON,request());
  assert.equal(unlocked(s,'star'),false);
  assert.equal(unlocked(s,'lamp'),false);
  const id=project(s);
  assert.equal(unlocked(s,'star'),true);
  assert.equal(unlocked(s,'lamp'),true);
  assert.equal(E.refugeProgress(s).stats.projects,1);
  assert.deepEqual(E.totals(s),{xp:0,coins:0});
  E.reopenStudyProject(s,id,TUE,request());
  assert.equal(unlocked(s,'lamp'),false);
  assert.equal(E.refugeProgress(s).stats.projects,0);
});

test('refúgio: corrigir o marco equipado usa básico sem invalidar estado ou apagar preferência',()=>{
  const s=E.createStudyState(MON);
  E.complete(s,'read',MON,'minimum',roadmap);
  E.updateAppearance(s,appearance({accessory:'leaf'}));
  E.undo(s,`${MON}:read`,TUE);
  const before=structuredClone(s),view=E.appearanceFor(s);
  assert.equal(view.preferred.accessory,'leaf');
  assert.equal(view.effective.accessory,'none');
  assert.ok(view.unavailable.includes('leaf'));
  valid(s);assert.deepEqual(roundtrip(s),s);assert.deepEqual(s,before);
  assert.equal(E.updateAppearance(s,appearance({accessory:'leaf',cloak:'night'})),true);
  assert.equal(E.appearanceFor(s).effective.cloak,'night');
  assert.equal(E.appearanceFor(s).effective.accessory,'none');
  E.complete(s,'read',WED,'minimum',roadmap);
  assert.equal(E.appearanceFor(s).effective.accessory,'leaf');
});

test('refúgio: um item bloqueado novo é recusado com erro específico e sem alterações',()=>{
  const s=E.createStudyState(MON);
  unchanged(s,()=>E.updateAppearance(s,appearance({accessory:'star'})),/projeto|disponível|liber|marco|conquist/i);
  assert.equal(E.updateAppearance(s,appearance({cloak:'clay',skin:'deep',hair:'curly',simplified:true})),true);
  assert.deepEqual(E.totals(s),{xp:0,coins:0});
});

test('refúgio: salvar a mesma aparência repetidamente é idempotente',()=>{
  const s=E.createStudyState(MON),values=appearance({cloak:'night',skin:'light',hair:'bob',decor:[],simplified:true});
  assert.equal(E.updateAppearance(s,values),true);
  const before=structuredClone(s);
  assert.equal(E.updateAppearance(s,structuredClone(values)),false);
  assert.deepEqual(s,before);
  values.decor.push('books');
  assert.deepEqual(s.config.appearance.decor,[],'a configuração salva não compartilha arrays do formulário');
});

test('refúgio: preferências básicas continuam editáveis durante pausa sem criar prática',()=>{
  const s=E.createStudyState(MON);s.config.paused=true;
  assert.equal(E.updateAppearance(s,appearance({skin:'deep',hair:'curly'})),true);
  assert.equal(s.config.paused,true);
  assert.equal(E.refugeProgress(s).stats.practiceDays,0);
  assert.equal(s.study.actions.length,0);
  assert.equal(s.events.length,0);
});

test('refúgio: leituras históricas válidas não recebem campo appearance ao abrir',()=>{
  for(const original of [E.createState(MON),E.createStudyState(MON)]){
    const store=new MemoryStorage(),raw=' \n'+JSON.stringify(original,null,2);
    store.setItem(P.STORAGE_KEY,raw);
    const read=E.parseState(P.readStoredRaw(store));
    E.refugeProgress(read);E.appearanceFor(read);
    assert.equal(store.getItem(P.STORAGE_KEY),raw);
    assert.equal(Object.hasOwn(read.config,'appearance'),false);
  }
});

test('refúgio: aparência opcional é estável ao serializar e na migração recuperável v1→v2',()=>{
  const legacy=E.createState(MON);
  E.complete(legacy,'read',MON,'normal',roadmap);
  E.updateAppearance(legacy,appearance({accessory:'leaf',skin:'deep',hair:'bob'}));
  const raw=E.serializeState(legacy),migrated=E.migrateStudyState(legacy),store=new MemoryStorage();
  store.setItem(P.STORAGE_KEY,raw);
  assert.deepEqual(migrated.config.appearance,legacy.config.appearance);
  assert.deepEqual(E.totals(migrated),E.totals(legacy));
  assert.deepEqual(roundtrip(legacy),legacy);assert.deepEqual(roundtrip(migrated),migrated);
  P.restoreBackup(store,E.serializeState(migrated),raw);
  assert.equal(P.readRecovery(store).raw,raw);
  P.recoverBackup(store);
  assert.equal(store.getItem(P.STORAGE_KEY),raw);
  assert.equal(E.parseState(store.getItem(P.STORAGE_KEY)).version,1);
});

test('refúgio: restauração com aparência preserva anterior e erro de quota não anuncia substituição',()=>{
  const old=E.createStudyState(MON),incoming=E.createStudyState(MON),store=new MemoryStorage();
  E.updateAppearance(incoming,appearance({cloak:'clay',decor:[]}));
  const original=E.serializeState(old);store.setItem(P.STORAGE_KEY,original);
  store.failKey=P.STORAGE_KEY;
  assert.throws(()=>P.restoreBackup(store,E.serializeState(incoming),original),/espaço/i);
  assert.equal(store.getItem(P.STORAGE_KEY),original);
  assert.equal(P.readRecovery(store).raw,original);
  store.failKey=null;
  P.restoreBackup(store,E.serializeState(incoming),original);
  assert.deepEqual(E.parseState(store.getItem(P.STORAGE_KEY)).config.appearance,incoming.config.appearance);
});

for(const [label,mutate] of [
  ['array em vez de mapa',s=>s.config.appearance=[]],
  ['null em vez de mapa',s=>s.config.appearance=null],
  ['campo desconhecido',s=>s.config.appearance.owned=['star']],
  ['campo obrigatório ausente',s=>delete s.config.appearance.skin],
  ['cor não pertencente ao catálogo',s=>s.config.appearance.cloak='gold'],
  ['tom de pele inválido',s=>s.config.appearance.skin='<script>'],
  ['cabelo inválido',s=>s.config.appearance.hair='invalid'],
  ['acessório desconhecido',s=>s.config.appearance.accessory='paid-power'],
  ['decor repetido',s=>s.config.appearance.decor=['books','books']],
  ['decor desconhecido',s=>s.config.appearance.decor=['coins']],
  ['decor não é lista',s=>s.config.appearance.decor={books:true}],
  ['modo simplificado não é booleano',s=>s.config.appearance.simplified='false'],
])test(`refúgio: backup recusa ${label} em v1 e v2`,()=>{
  for(const s of [E.createState(MON),E.createStudyState(MON)]){
    s.config.appearance=appearance();mutate(s);
    assert.throws(()=>E.validateState(s),/inválido|inconsistente/i);
    assert.throws(()=>E.parseState(JSON.stringify(s)),/inválido|inconsistente/i);
  }
});

test('refúgio: JSON que transformaria o decor não é aceito e erro de formulário não vira backup inválido',()=>{
  const s=E.createStudyState(MON);s.config.appearance=appearance();
  s.config.appearance.decor.extra='books';
  assert.throws(()=>E.validateState(s),/inválido|inconsistente/i);
  const clean=E.createStudyState(MON),before=structuredClone(clean);
  for(const values of [appearance({cloak:'invalid'}),appearance({hair:'unknown'}),appearance({decor:['books','books']})]){
    assert.throws(()=>E.updateAppearance(clean,values),error=>{
      assert.doesNotMatch(error.message,/backup inválido/i);return true;
    });
    assert.deepEqual(clean,before);
  }
});

test('refúgio: preferências de item ainda indisponível são válidas em backup e não falsificam inventário',()=>{
  const s=E.createStudyState(MON);s.config.appearance=appearance({accessory:'star'});
  valid(s);
  assert.equal(unlocked(s,'star'),false);
  const view=E.appearanceFor(roundtrip(s));
  assert.equal(view.preferred.accessory,'star');
  assert.equal(view.effective.accessory,'none');
  assert.deepEqual(E.totals(s),{xp:0,coins:0});
});

test('refúgio: projetos históricos e continuação após fase120 mantêm marcos sem inventar exercícios',()=>{
  const legacy=E.createState('2026-01-01');
  for(let i=0;i<roadmap.length;i++)E.complete(legacy,'python',E.addDays(legacy.created,i),'normal',roadmap);
  const s=E.migrateStudyState(legacy),before=E.studyStats(s),day=E.addDays(legacy.created,121);
  assert.equal(unlocked(s,'star'),true);
  assert.equal(unlocked(s,'lamp'),true);
  study(s,day,60,{exercises:3});
  assert.equal(E.studyStats(s).exercises,before.exercises+3);
  assert.equal(E.refugeProgress(s).stats.phases,120);
  assert.equal(E.refugeProgress(s).stats.practiceDays,121);
  assert.equal(unlocked(s,'charm'),true);
  valid(s);
});
