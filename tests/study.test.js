import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {webcrypto} from 'node:crypto';
import * as E from '../engine.js';
import * as P from '../storage.js';
import {roadmap} from '../roadmap.js';

const MON='2026-11-09',TUE='2026-11-10',WED='2026-11-11';
let request=0;
const req=()=>`study-request-${++request}`;
const clone=structuredClone;
const state=()=>E.createStudyState(MON);
const valid=s=>assert.equal(E.validateState(s),true);
const invalid=s=>assert.throws(()=>E.validateState(s),/inválido|inconsistente/i);
const roundtrip=s=>E.parseState(E.serializeState(s));
function add(s,minutes=60,options={}) {
  const {day=MON,...rest}=options;
  return E.recordStudySession(s,day,{minutes,goal:'Praticar condicionais no editor',
    kind:'phase',lessonId:1,projectId:null,exercises:0,requestId:req(),...rest});
}
const sessions=s=>E.studySessions(s);
const lastSession=s=>sessions(s).at(-1);
const progress=(s,day=MON)=>E.studyProgress(s,day);
const old=(mode='normal')=>{
  const s=E.createState(MON);
  E.complete(s,'python',MON,mode,roadmap);
  return s;
};
function project(s,title='Diário de pontos',lessonId=1,day=MON,requestId=req()) {
  assert.equal(E.createStudyProject(s,title,lessonId,day,requestId),true);
  return E.studyProjects(s).at(-1);
}
function unchanged(s,run,pattern) {
  const before=clone(s);
  assert.throws(run,pattern);
  assert.deepEqual(s,before,'Uma operação recusada não deve deixar alterações parciais.');
  valid(s);
}
function withCrypto(provider,run) {
  const previous=Object.getOwnPropertyDescriptor(globalThis,'crypto');
  Object.defineProperty(globalThis,'crypto',{configurable:true,value:provider});
  try {return run();}
  finally {if(previous)Object.defineProperty(globalThis,'crypto',previous);else delete globalThis.crypto;}
}
class MemoryStorage {
  values=new Map();
  failKey=null;
  getItem(key){return this.values.get(key)??null;}
  setItem(key,value){if(key===this.failKey)throw new DOMException('quota','QuotaExceededError');this.values.set(key,value);}
  removeItem(key){if(key===this.failKey)throw new DOMException('quota','QuotaExceededError');this.values.delete(key);}
}

test('sessões: estado v2 novo é válido sem prática, fase ou duração inventada',()=>{
  const s=state();
  assert.equal(s.version,2);
  assert.deepEqual(sessions(s),[]);
  assert.equal(s.lessons.length,0);
  assert.equal(E.studyStats(s).minutes,0);
  assert.deepEqual(E.totals(s),{xp:0,coins:0});
  valid(s);
  assert.deepEqual(roundtrip(s),s);
});

test('migração: v1 e fixture anterior preservam todos os campos históricos sem inventar sessões',()=>{
  for(const original of [old(),E.parseState(readFileSync(new URL('./fixtures/legacy-v1.json',import.meta.url),'utf8'))]){
    const before=clone(original),s=E.migrateStudyState(original);
    assert.deepEqual(original,before);
    assert.equal(s.version,2);
    for(const [key,value] of Object.entries(before))if(key!=='version')assert.deepEqual(s[key],value,key);
    assert.equal(s.study.legacyEventCount,before.events.length);
    assert.deepEqual(s.study.legacyLessons,before.lessons);
    assert.deepEqual(sessions(s),[]);
    assert.equal(E.studyStats(s).minutes,0);
    assert.deepEqual(E.totals(s),E.totals(before));
    valid(s);
    assert.deepEqual(roundtrip(s),s);
  }
});

test('migração: repetição é idempotente e backup inválido é recusado antes de transformar',()=>{
  const s=state(),before=clone(s);
  assert.deepEqual(E.migrateStudyState(s),before);
  assert.deepEqual(s,before);
  const bad=old();bad.records=[];
  const snapshot=clone(bad);
  assert.throws(()=>E.migrateStudyState(bad),/inválido|inconsistente/i);
  assert.deepEqual(bad,snapshot);
});

test('sessões: duas sessões de 60 minutos registram 120 sem concluir fase',()=>{
  const s=state();
  assert.equal(add(s,60,{exercises:2}),true);
  assert.deepEqual(E.totals(s),{xp:60,coins:18});
  assert.equal(add(s,60,{exercises:3}),true);
  assert.deepEqual(E.totals(s),{xp:120,coins:36});
  assert.equal(progress(s).minutes,120);
  assert.equal(progress(s).normal,true);
  assert.equal(s.lessons.length,0);
  assert.equal(E.studyStats(s).exercises,5);
  assert.equal(sessions(s).filter(x=>!x.corrected).length,2);
  valid(s);
});

test('sessões: mínima 5 e complemento 115 pagam somente a diferença até normal',()=>{
  const s=state();
  add(s,5);
  assert.deepEqual(E.totals(s),{xp:5,coins:2});
  assert.equal(progress(s).minimum,true);
  assert.equal(progress(s).normal,false);
  add(s,115);
  assert.deepEqual(E.totals(s),{xp:120,coins:36});
  assert.deepEqual(s.events.map(e=>[e.xp,e.coins]),[[5,2],[115,34]]);
  valid(s);
});

test('sessões: prática extra mantém minutos e exercícios sem ultrapassar orçamento diário',()=>{
  const s=state();
  add(s,120,{exercises:3});add(s,45,{exercises:4});
  assert.deepEqual(E.totals(s),{xp:120,coins:36});
  assert.equal(progress(s).minutes,165);
  assert.equal(E.studyStats(s).exercises,7);
  assert.deepEqual([s.events.at(-1).xp,s.events.at(-1).coins],[0,0]);
  valid(s);
});

test('sessões: fracionar a prática não aumenta a recompensa de cinco minutos',()=>{
  const single=state(),fragmented=state();
  add(single,5);
  for(const minutes of [1,1,3])add(fragmented,minutes);
  assert.deepEqual(E.totals(fragmented),E.totals(single));
  assert.equal(progress(fragmented).minutes,5);
  valid(fragmented);
});

test('sessões: cada minuto de 1 a 120 rende XP exato e fracionamento não altera moedas',()=>{
  const fragmented=state();
  for(let amount=1;amount<=120;amount++){
    const single=state();add(single,amount);
    add(fragmented,1);
    assert.equal(E.totals(single).xp,amount,`XP de uma sessão de ${amount} minutos`);
    assert.equal(E.totals(fragmented).xp,amount,`XP de ${amount} sessões de um minuto`);
    assert.equal(E.totals(fragmented).coins,E.totals(single).coins,`Moedas aos ${amount} minutos`);
    assert.ok(E.totals(single).coins<=36);
  }
  assert.deepEqual(E.totals(fragmented),{xp:120,coins:36});
  valid(fragmented);
});

test('sessões: orçamento congela no primeiro registro e edição só altera dia seguinte',()=>{
  const s=state();
  add(s,60);
  const m=s.config.missions.find(x=>x.id==='python');
  Object.assign(m,{minutes:60,xp:60,coins:18,minXp:5,minCoins:2});
  add(s,60);
  assert.equal(progress(s).goal,120);
  assert.deepEqual(E.totals(s),{xp:120,coins:36});
  add(s,60,{day:TUE});
  assert.equal(progress(s,TUE).goal,60);
  assert.deepEqual(E.totals(s),{xp:180,coins:54});
  valid(s);
});

test('sessões: duas habilidades dividem o XP e correções não alteram o total indevidamente',()=>{
  const s=state(),m=s.config.missions.find(x=>x.id==='python');
  m.secondary='reading';
  add(s,5);
  assert.equal(E.skillTotals(s).python,3);
  assert.equal(E.skillTotals(s).reading,2);
  add(s,115);
  assert.equal(E.skillTotals(s).python,60);
  assert.equal(E.skillTotals(s).reading,60);
  E.undoStudySession(s,lastSession(s).id,TUE,req());
  assert.deepEqual(E.totals(s),{xp:5,coins:2});
  assert.equal(Object.values(E.skillTotals(s)).reduce((sum,x)=>sum+x,0),5);
  valid(s);
});

test('sessões: orçamento zero ainda registra prática e não fabrica pontos',()=>{
  const s=state(),m=s.config.missions.find(x=>x.id==='python');
  Object.assign(m,{xp:0,coins:0,minXp:0,minCoins:0});
  add(s,120,{exercises:2});
  assert.equal(progress(s).minutes,120);
  assert.equal(E.studyStats(s).exercises,2);
  assert.deepEqual(E.totals(s),{xp:0,coins:0});
  valid(s);
});

test('sessões: requestId repetido não duplica registro nem volta a pagar depois de corrigido',()=>{
  const s=state(),requestId=req();
  assert.equal(add(s,60,{requestId}),true);
  const before=clone(s),id=lastSession(s).id;
  assert.equal(add(s,60,{requestId}),false);
  assert.deepEqual(s,before);
  E.undoStudySession(s,id,TUE,req());
  const corrected=clone(s);
  assert.equal(add(s,60,{requestId}),false);
  assert.deepEqual(s,corrected);
  assert.deepEqual(E.totals(s),{xp:0,coins:0});
  valid(s);
});

test('sessões: duração, objetivo, exercícios e referências inválidas não deixam estado parcial',()=>{
  for(const changes of [
    {minutes:0},{minutes:-1},{minutes:1.5},{minutes:NaN},{minutes:Infinity},
    {goal:''},{exercises:-1},{exercises:1.5},{lessonId:9999},{projectId:'inexistente',kind:'project'}
  ]){
    const s=state();
    unchanged(s,()=>add(s,60,changes));
  }
});

test('sessões: pausa impede novo registro sem remover os cuidados essenciais',()=>{
  const s=state();s.config.paused=true;
  unchanged(s,()=>add(s),/pausa/i);
  assert.equal(s.config.missions.find(m=>m.id==='dog-am').essential,true);
});

test('sessões: limites de duração, exercícios e projeto encerrado são validados antes de salvar',()=>{
  for(const changes of [{minutes:1441},{exercises:1001}]){
    const s=state();unchanged(s,()=>add(s,60,changes));
  }
  const full=state();add(full,1440);
  unchanged(full,()=>add(full,1),/minut|dia|1440|duração/i);
  const s=state(),p=project(s);
  E.completeStudyProject(s,p.id,MON,req());
  unchanged(s,()=>add(s,60,{kind:'project',projectId:p.id}),/projeto|conclu|encerr/i);
});

test('sessões: reagendamento não retira de Hoje uma prática ativa e correção libera a ocorrência',()=>{
  const s=state();add(s,1);
  unchanged(s,()=>E.reschedule(s,'python',MON,TUE,'18:00'),/desfaça|corrij|registro|sess/i);
  assert.equal(E.missionsFor(s,MON).some(m=>m.id==='python'),true);
  E.undoStudySession(s,lastSession(s).id,TUE,req());
  E.reschedule(s,'python',MON,TUE,'18:00');
  assert.equal(E.missionsFor(s,MON).some(m=>m.id==='python'),false);
  assert.equal(E.missionsFor(s,TUE).some(m=>m.id==='python'),true);
  assert.equal(progress(s).minutes,0);
  valid(s);
});

test('fases: marcos são sequenciais, um por dia, e não concedem XP adicional',()=>{
  const s=state();
  add(s,120,{exercises:3});
  unchanged(s,()=>E.completePhase(s,2,MON,req()),/fase|pré|sequ/i);
  assert.equal(E.completePhase(s,1,MON,req()),true);
  assert.deepEqual(E.totals(s),{xp:120,coins:36});
  unchanged(s,()=>E.completePhase(s,2,MON,req()),/dia|amanhã/i);
  assert.equal(E.completePhase(s,2,TUE,req()),true);
  assert.equal(s.lessons.length,2);
  assert.deepEqual(E.totals(s),{xp:120,coins:36});
  assert.equal(E.studyStats(s).exercises,3);
  valid(s);
});

test('fases: terminar em outro dia não exige fingir nova sessão nem reconta exercícios',()=>{
  const s=state();
  add(s,120,{exercises:4});
  assert.equal(E.completePhase(s,1,TUE,req()),true);
  assert.equal(progress(s,TUE).minutes,0);
  assert.equal(E.studyStats(s).exercises,4);
  assert.deepEqual(E.totals(s),{xp:120,coins:36});
  const before=clone(s);
  assert.equal(E.completePhase(s,1,TUE,req()),false);
  assert.deepEqual(s,before);
  valid(s);
});

test('fases: corrigir apenas a mais recente mantém prática e exercícios registrados',()=>{
  const s=state();
  add(s,120,{exercises:3});E.completePhase(s,1,MON,req());E.completePhase(s,2,TUE,req());
  unchanged(s,()=>E.undoPhase(s,1,WED,req()),/recente|posterior|depend/i);
  assert.equal(E.undoPhase(s,2,WED,req()),true);
  assert.equal(s.lessons.length,1);
  assert.equal(progress(s).minutes,120);
  assert.equal(E.studyStats(s).exercises,3);
  assert.deepEqual(E.totals(s),{xp:120,coins:36});
  valid(s);
});

test('correção: desfazer sessão preserva fase, corrige minutos e não estorna duas vezes',()=>{
  const s=state();
  add(s,60,{exercises:2});
  const id=lastSession(s).id;
  E.completePhase(s,1,MON,req());
  assert.equal(E.undoStudySession(s,id,TUE,req()),true);
  assert.equal(s.lessons.length,1);
  assert.equal(progress(s).minutes,0);
  assert.equal(E.studyStats(s).exercises,0);
  assert.equal(lastSession(s).corrected,true);
  assert.equal(lastSession(s).correctedDay,TUE);
  assert.deepEqual(E.totals(s),{xp:0,coins:0});
  const before=clone(s);
  assert.equal(E.undoStudySession(s,id,TUE,req()),false);
  assert.deepEqual(s,before);
  valid(s);
});

test('correção: com prática acima do teto remove somente a diferença efetiva',()=>{
  const s=state();
  add(s,120);
  const first=lastSession(s).id;
  add(s,60);
  assert.equal(E.undoStudySession(s,first,TUE,req()),true);
  assert.equal(progress(s).minutes,60);
  assert.deepEqual(E.totals(s),{xp:60,coins:18});
  assert.deepEqual([s.events.at(-1).xp,s.events.at(-1).coins],[-60,-18]);
  valid(s);
});

test('correção: moedas gastas impedem saldo negativo e cancelamento permite corrigir',()=>{
  const s=state();add(s,120);
  E.buy(s,'video',MON,'21:30',req());
  const id=lastSession(s).id;
  unchanged(s,()=>E.undoStudySession(s,id,TUE,req()),/saldo|moedas|cancele/i);
  E.cancel(s,s.purchases[0].id,TUE);
  E.undoStudySession(s,id,TUE,req());
  assert.deepEqual(E.totals(s),{xp:0,coins:0});
  valid(s);
});

test('correção: débito de sessão antiga pertence ao dia da correção',()=>{
  const s=state();add(s,60);
  E.undoStudySession(s,lastSession(s).id,TUE,req());
  assert.equal(E.dailyXp(s,MON),60);
  assert.equal(E.dailyXp(s,TUE),-60);
  assert.deepEqual(E.totals(s),{xp:0,coins:0});
  valid(s);
});

test('correção: sessão precisa existir antes da correção e a data não antecede a prática',()=>{
  const s=state();add(s,60,{day:TUE});
  const id=lastSession(s).id;
  unchanged(s,()=>E.undoStudySession(s,id,MON,req()),/data|posterior|sessão/i);
  unchanged(s,()=>E.undoStudySession(s,id,'2026-02-30',req()),/data/i);
  const altered=state();add(altered,60);
  E.undoStudySession(altered,lastSession(altered).id,TUE,req());
  const beforePractice=clone(altered);
  beforePractice.study.actions[1].day=E.addDays(MON,-1);
  beforePractice.events.at(-1).day=E.addDays(MON,-1);
  invalid(beforePractice);
  altered.study.actions.reverse();
  invalid(altered);
});

test('correção: pausa permite corrigir sessão, fase e projeto sem conceder novos ganhos',()=>{
  const s=state(),p=project(s);
  add(s,60,{kind:'project',projectId:p.id,exercises:2});
  const session=lastSession(s);
  E.completePhase(s,1,MON,req());
  E.completeStudyProject(s,p.id,MON,req());
  s.config.paused=true;
  assert.equal(E.undoStudySession(s,session.id,TUE,req()),true);
  assert.equal(E.undoPhase(s,1,TUE,req()),true);
  assert.equal(E.reopenStudyProject(s,p.id,TUE,req()),true);
  assert.deepEqual(E.totals(s),{xp:0,coins:0});
  assert.equal(E.studyStats(s).minutes,0);
  assert.equal(E.studyStats(s).exercises,0);
  assert.equal(E.studyStats(s).projects,0);
  assert.equal(s.lessons.length,0);
  unchanged(s,()=>add(s,60),/pausa/i);
  valid(s);
});

test('projetos: um projeto continua em vários dias e concluir não repete pontos nem exercícios',()=>{
  const s=state(),p=project(s);
  add(s,60,{kind:'project',projectId:p.id,exercises:2});
  add(s,60,{kind:'project',projectId:p.id,day:TUE,exercises:3});
  assert.equal(E.completeStudyProject(s,p.id,TUE,req()),true);
  assert.equal(E.studyStats(s).projects,1);
  assert.equal(E.studyStats(s).exercises,5);
  assert.deepEqual(E.totals(s),{xp:120,coins:36});
  const before=clone(s);
  assert.equal(E.completeStudyProject(s,p.id,TUE,req()),false);
  assert.deepEqual(s,before);
  valid(s);
});

test('projetos: corrigir conclusão e fase preserva sessões e não concede recompensa adicional',()=>{
  const s=state(),p=project(s);
  add(s,120,{kind:'project',projectId:p.id,exercises:4});
  E.completePhase(s,1,MON,req());E.completeStudyProject(s,p.id,MON,req());
  E.undoPhase(s,1,TUE,req());
  assert.equal(E.studyStats(s).projects,1);
  assert.equal(E.reopenStudyProject(s,p.id,TUE,req()),true);
  assert.equal(E.studyStats(s).projects,0);
  assert.equal(E.studyStats(s).minutes,120);
  assert.equal(E.studyStats(s).exercises,4);
  assert.deepEqual(E.totals(s),{xp:120,coins:36});
  E.completeStudyProject(s,p.id,WED,req());
  assert.equal(E.studyStats(s).projects,1);
  assert.deepEqual(E.totals(s),{xp:120,coins:36});
  valid(s);
});

test('projetos: requestId de criação repetido não cria cópias do projeto',()=>{
  const s=state(),requestId=req();
  project(s,'Diário de pontos',1,MON,requestId);
  const before=clone(s);
  assert.equal(E.createStudyProject(s,'Diário de pontos',1,MON,requestId),false);
  assert.deepEqual(s,before);
  assert.equal(E.studyProjects(s).length,1);
  valid(s);
});

test('projetos: projeto existente continua estudável após corrigir a fase anterior',()=>{
  const s=state();
  E.completePhase(s,1,MON,req());
  const p=project(s,'Projeto da segunda fase',2);
  E.undoPhase(s,1,TUE,req());
  assert.equal(E.studyProjects(s)[0].id,p.id);
  assert.equal(add(s,60,{kind:'project',projectId:p.id,lessonId:2,day:TUE,exercises:2}),true);
  assert.equal(lastSession(s).projectId,p.id);
  assert.equal(lastSession(s).lessonId,2);
  assert.equal(E.studyStats(s).minutes,60);
  assert.equal(s.lessons.length,0);
  assert.deepEqual(E.totals(s),{xp:60,coins:18});
  unchanged(s,()=>E.createStudyProject(s,'Projeto futuro novo',2,TUE,req()),/fase|disponível|livre/i);
  valid(s);
});

test('projetos: sessão não pode anteceder a criação e backup com essa incoerência é recusado',()=>{
  const s=state(),p=project(s,'Projeto criado amanhã',1,TUE);
  unchanged(s,()=>add(s,60,{kind:'project',projectId:p.id}),/data|projeto|cria/i);
  const altered=state(),existing=project(altered);
  add(altered,60,{kind:'project',projectId:existing.id});
  altered.study.actions.find(a=>a.type==='project-create').day=TUE;
  invalid(altered);
});

test('legado: mínima anterior não inventa minutos e novos estudos pagam apenas o complemento',()=>{
  const s=E.migrateStudyState(old('minimum'));
  assert.equal(progress(s).minutes,0);
  assert.equal(progress(s).legacy,true);
  add(s,5);
  assert.deepEqual(E.totals(s),{xp:5,coins:2});
  add(s,115);
  assert.deepEqual(E.totals(s),{xp:120,coins:36});
  assert.equal(progress(s).minutes,120);
  valid(s);
});

test('legado: normal já paga impede um segundo pagamento e conserva exercícios históricos',()=>{
  const original=old(),before=clone(original);
  original.lessons[0].exercises=4;
  const s=E.migrateStudyState(original);
  assert.equal(E.studyStats(s).minutes,0);
  assert.equal(E.studyStats(s).exercises,4);
  add(s,120,{exercises:3});
  assert.deepEqual(E.totals(s),E.totals(before));
  assert.equal(E.studyStats(s).exercises,7);
  assert.equal(s.lessons.length,1);
  valid(s);
});

test('legado: corrigir pagamento histórico mantém fase e não inventa nova prática',()=>{
  const s=E.migrateStudyState(old());
  E.undo(s,MON+':python',TUE);
  assert.equal(s.lessons.length,1);
  assert.equal(E.studyStats(s).minutes,0);
  assert.deepEqual(E.totals(s),{xp:0,coins:0});
  valid(s);
});

test('legado: correção do registro anterior exige corrigir sessões novas daquele dia primeiro',()=>{
  const s=E.migrateStudyState(old());
  add(s,60);
  unchanged(s,()=>E.undo(s,MON+':python',TUE),/sess|estud|primeiro/i);
  E.undoStudySession(s,lastSession(s).id,TUE,req());
  assert.equal(E.undo(s,MON+':python',TUE),true);
  assert.equal(s.lessons.length,1);
  assert.deepEqual(E.totals(s),{xp:0,coins:0});
  valid(s);
});

test('B05: depois das 120 fases revisão e projeto livre continuam registráveis',()=>{
  const legacy=E.createState(MON);
  for(let i=0;i<roadmap.length;i++)E.complete(legacy,'python',E.addDays(MON,i),'normal',roadmap);
  const s=E.migrateStudyState(legacy),day=E.addDays(MON,roadmap.length),before=E.totals(s);
  const historicalProjects=legacy.lessons.filter(l=>l.project).length;
  const historicalExercises=legacy.lessons.reduce((sum,l)=>sum+l.exercises,0);
  assert.equal(s.lessons.length,120);
  assert.equal(E.studyStats(s).projects,historicalProjects);
  assert.equal(E.studyStats(s).exercises,historicalExercises);
  add(s,60,{day,kind:'review',lessonId:null});
  const p=project(s,'Projeto depois da trilha',null,day);
  add(s,60,{day,kind:'project',lessonId:null,projectId:p.id});
  E.completeStudyProject(s,p.id,day,req());
  assert.equal(s.lessons.length,120);
  assert.equal(progress(s,day).minutes,120);
  assert.deepEqual(E.totals(s),{xp:before.xp+120,coins:before.coins+36});
  assert.equal(E.studyStats(s).projects,historicalProjects+1);
  assert.equal(E.studyStats(s).exercises,historicalExercises);
  const historical=E.studyProjects(s).find(p=>p.legacy);
  assert.ok(historical);
  E.reopenStudyProject(s,historical.id,day,req());
  assert.equal(E.studyStats(s).projects,historicalProjects);
  assert.equal(s.lessons.length,120);
  assert.deepEqual(E.totals(s),{xp:before.xp+120,coins:before.coins+36});
  valid(s);
});

test('backup v2: prática, fases, projetos e correções sobrevivem a serializar e salvar/reabrir',()=>{
  const s=state(),p=project(s);
  add(s,5,{exercises:1});add(s,115,{kind:'project',projectId:p.id,exercises:3});
  E.completePhase(s,1,TUE,req());E.completeStudyProject(s,p.id,TUE,req());
  E.undoStudySession(s,sessions(s)[0].id,WED,req());
  const before=clone(s),store=new MemoryStorage();
  assert.deepEqual(roundtrip(s),before);
  assert.deepEqual(P.saveState(store,s,null),before);
  assert.deepEqual(E.parseState(store.getItem(P.STORAGE_KEY)),before);
  assert.deepEqual(s,before);
});

test('migração recuperável: preservar bytes v1 e recuperar permite voltar e refazer a troca',()=>{
  const store=new MemoryStorage(),original=' \n'+JSON.stringify(old(),null,2);
  store.setItem(P.STORAGE_KEY,original);
  const migrated=E.migrateStudyState(E.parseState(original));
  P.restoreBackup(store,E.serializeState(migrated),original);
  assert.equal(P.readRecovery(store).raw,original);
  const v2raw=store.getItem(P.STORAGE_KEY);
  assert.equal(E.parseState(v2raw).version,2);
  P.recoverBackup(store,v2raw,store.getItem(P.RECOVERY_KEY));
  assert.equal(store.getItem(P.STORAGE_KEY),original);
  assert.equal(P.readRecovery(store).raw,v2raw);
  assert.equal(P.recoverBackup(store).version,2);
});

test('armazenamento: falhas na cópia, migração e gravação normal preservam dados salvos',()=>{
  for(const failKey of [P.RECOVERY_KEY,P.STORAGE_KEY]){
    const store=new MemoryStorage(),v1raw=E.serializeState(old());
    store.setItem(P.STORAGE_KEY,v1raw);
    store.failKey=failKey;
    assert.throws(()=>P.restoreBackup(store,E.serializeState(E.migrateStudyState(old())),v1raw),/sem espaço/i);
    assert.equal(store.getItem(P.STORAGE_KEY),v1raw);
    if(failKey===P.STORAGE_KEY)assert.equal(P.readRecovery(store).raw,v1raw);
  }
  const store=new MemoryStorage(),s=state();
  P.saveState(store,s,null);
  const saved=store.getItem(P.STORAGE_KEY);
  add(s,60);store.failKey=P.STORAGE_KEY;
  assert.throws(()=>P.saveState(store,s,saved),/sem espaço/i);
  assert.equal(store.getItem(P.STORAGE_KEY),saved);
});

test('migração: prévia desatualizada não troca nem o progresso nem a recuperação',()=>{
  const store=new MemoryStorage(),v1raw=E.serializeState(old());
  store.setItem(P.STORAGE_KEY,v1raw);
  const migrated=E.migrateStudyState(E.parseState(v1raw)),changed=old();
  E.complete(changed,'read',MON);
  store.setItem(P.STORAGE_KEY,E.serializeState(changed));
  const before=new Map(store.values);
  assert.throws(()=>P.restoreBackup(store,E.serializeState(migrated),v1raw),/mudou/i);
  assert.deepEqual(store.values,before);
});

test('IDs: sem API criptográfica sessões e marcos falham antes de mutar',()=>{
  const s=state();
  withCrypto(undefined,()=>{
    unchanged(s,()=>add(s),/identificadores|criptograf|navegador/i);
    unchanged(s,()=>E.completePhase(s,1,MON,req()),/identificadores|criptograf|navegador/i);
    unchanged(s,()=>E.createStudyProject(s,'Projeto',1,MON,req()),/identificadores|criptograf|navegador/i);
  });
});

test('IDs: falhar no segundo identificador não deixa sessão sem evento financeiro',()=>{
  const s=state();let calls=0;
  withCrypto({randomUUID(){if(++calls===2)throw Error('Falha simulada');return webcrypto.randomUUID();}},()=>{
    unchanged(s,()=>add(s),/identificadores|criptograf|navegador/i);
  });
  assert.equal(calls,2);
});

test('integridade v2: contêineres e valores não estáveis em JSON são recusados sem executar getters',()=>{
  for(const mutate of [
    s=>{s.study.budgets=[];},s=>{s.study.actions={};},s=>{s.study.legacyLessons={};},
    s=>{s.study.actions.extra=1;},s=>{s.study.budgets=new Date();},
    s=>{s.study.extra='campo não declarado';}
  ]){const s=state();mutate(s);invalid(s);}
  const s=state();let called=false;
  Object.defineProperty(s.study,'trap',{enumerable:true,get(){called=true;return 1;}});
  invalid(s);assert.equal(called,false);
});

test('integridade v2: IDs e requestIds repetidos não são aceitos em ações',()=>{
  const first=state();add(first,60);
  first.study.actions.push(clone(first.study.actions[0]));invalid(first);
  const second=state();add(second,60);add(second,60);
  second.study.actions[1].requestId=second.study.actions[0].requestId;invalid(second);
});

test('integridade v2: eventos órfãos ou recompensa diferente dos minutos são recusados',()=>{
  const orphan=state();add(orphan,60);
  orphan.events.at(-1).studyAction='acao-ausente';invalid(orphan);
  const altered=state();add(altered,60);
  altered.events.at(-1).xp++;
  altered.events.at(-1).skills.python++;
  invalid(altered);
  const changed=state();add(changed,60);
  changed.study.actions[0].minutes=30;invalid(changed);
});

test('integridade v2: fase materializada e marco de migração precisam corresponder ao histórico',()=>{
  const s=state();add(s,60);E.completePhase(s,1,MON,req());
  s.lessons[0].id=2;invalid(s);
  const legacy=E.migrateStudyState(old());
  legacy.study.legacyEventCount=0;invalid(legacy);
  const boundary=state();add(boundary,60);
  boundary.study.legacyEventCount=1;invalid(boundary);
});

test('integridade v2: sessão de projeto exige projeto existente e não aceita referência órfã',()=>{
  const s=state(),p=project(s);
  add(s,60,{kind:'project',projectId:p.id});
  const action=s.study.actions.find(x=>Object.hasOwn(x,'minutes'));
  action.projectId='projeto-ausente';invalid(s);
});

test('integridade v2: projeto novo não pode sobrescrever o ID de um projeto histórico',()=>{
  const legacy=E.createState(MON),firstProject=roadmap.findIndex(l=>l.project);
  assert.ok(firstProject>=0);
  for(let i=0;i<=firstProject;i++)E.complete(legacy,'python',E.addDays(MON,i),'normal',roadmap);
  const s=E.migrateStudyState(legacy),historical=E.studyProjects(s)[0];
  project(s,'Projeto novo',null,E.addDays(MON,firstProject+1));
  assert.equal(E.studyStats(s).projects,1);
  s.study.actions.find(a=>a.type==='project-create').id=historical.id;
  invalid(s);
});
