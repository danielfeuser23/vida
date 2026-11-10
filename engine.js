import {defaultMissions,defaultRewards} from './data.js';
import {createId} from './ids.js';
import {roadmap} from './roadmap.js';
import * as A from './agenda.js';
import * as R from './refuge.js';
export const TIMEZONE='America/Sao_Paulo';
export const dayKey=(now=new Date())=>new Intl.DateTimeFormat('sv-SE',{timeZone:TIMEZONE,year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
export const weekday=day=>new Date(day+'T12:00:00Z').getUTCDay();
export const addDays=(day,n)=>new Date(new Date(day+'T12:00:00Z').getTime()+n*86400000).toISOString().slice(0,10);
export function weekKey(day){return addDays(day,-((weekday(day)+6)%7));}
export function createState(day=dayKey()) {return {version:1,revision:0,created:day,config:{name:'Viajante',xpStep:100,paused:false,sounds:false,missions:structuredClone(defaultMissions),rewards:structuredClone(defaultRewards)},records:{},events:[],purchases:[],lessons:[],overrides:{},difficult:{}};}
export const totals=s=>s.events.reduce((t,e)=>({xp:t.xp+e.xp,coins:t.coins+e.coins}),{xp:0,coins:0});
// Corrections belong to their posting day; originalDay identifies the corrected occurrence.
export function dailyXp(s,day){return s.events.reduce((xp,e)=>xp+(e.day===day?e.xp:0),0);}
export function levelInfo(xp,step=100){return {level:1+Math.floor(xp/step),current:xp%step,next:step};}
export function skillTotals(s){const r={reading:0,fitness:0,home:0,dog:0,python:0};for(const e of s.events)for(const [k,v]of Object.entries(e.skills||{}))r[k]+=v;return r;}
export function missionDay(s,m,day){return s.overrides[day+':'+m.id]||{};}
export function defaultWeekendTime(m){
 if(m.weekendTime!==undefined)return m.weekendTime;
 // Older v1 backups had one clock: keep untouched defaults, honor saved custom clocks.
 const original=defaultMissions.find(item=>item.id===m.id);
 return ['exercise','house'].includes(m.id)&&m.time===original?.time?'09:00':m.time;
}
export function missionsFor(s,day){return s.config.missions.filter(m=>{const o=missionDay(s,m,day);return !o.skip&&(o.include||m.days.includes(weekday(day)));}).map(m=>{const o=missionDay(s,m,day),time=o.time||([0,6].includes(weekday(day))?defaultWeekendTime(m):m.time);return {...m,time};}).sort((a,b)=>a.time.localeCompare(b.time));}
function event(s,day,type,title,xp,coins,extra,eventId){s.events.push({id:eventId,at:new Date().toISOString(),day,type,title,xp,coins,...extra});}
export function complete(s,id,day,mode='normal',roadmap=[]){
 if(s.version===2&&id==='python')throw Error('Registre uma sessão de Python. A conclusão da fase é uma ação separada.');
 if(s.config.paused)throw Error('A jornada está em pausa. Retome nas configurações para registrar missões. Os cuidados essenciais continuam.');
 const m=missionsFor(s,day).find(m=>m.id===id);if(!m)throw Error('Missão indisponível neste dia.');
 const key=day+':'+id,old=s.records[key],rank=mode==='minimum'?1:2;
 if(old&&old.rank>=rank)return false;
 const xp=rank===1?m.minXp:m.xp,coins=rank===1?m.minCoins:m.coins;
 if(old&&(xp<old.xp||coins<old.coins))throw Error('A pontuação foi reduzida após o registro mínimo. Corrija a marcação anterior antes de concluir novamente.');
 let lesson=old?.lesson||null,newLesson=null;
 if(id==='python'&&rank===2&&!lesson){
  if(s.lessons.some(l=>l.day===day))throw Error('Uma nova fase por dia. Amanhã a trilha continua; hoje você pode revisar.');
  if(s.lessons.some(l=>l.day>day))throw Error('Corrija primeiro as fases posteriores no histórico.');
  const next=roadmap[s.lessons.length];if(!next)throw Error('Trilha concluída. Você pode criar uma missão de revisão nas configurações.');
  lesson=next.id;newLesson={id:lesson,day,exercises:next.exercises,project:next.project};
 }
 const split=m.secondary?{[m.skill]:Math.ceil(xp/2),[m.secondary]:Math.floor(xp/2)}:{[m.skill]:xp};
 const delta={};for(const k of new Set([...Object.keys(split),...Object.keys(old?.skills||{})]))delta[k]=(split[k]||0)-(old?.skills[k]||0);
 const operationId=createId();
 if(newLesson)s.lessons.push(newLesson);
 event(s,day,old?'upgrade':'mission',m.title,xp-(old?.xp||0),coins-(old?.coins||0),{key,skills:delta,lesson},operationId);
 s.records[key]={id,day,rank,xp,coins,skills:split,lesson,title:m.title};return true;
}
export function undo(s,key,day){const r=s.records[key];if(!r)return false;
 if(totals(s).coins<r.coins)throw Error('Para desfazer sem saldo negativo, cancele resgates ainda não usados ou reponha as moedas já gastas.');
 if(s.version===2&&r.id==='python'&&studySessions(s).some(item=>!item.corrected&&item.day===r.day))throw Error('Corrija primeiro as sessões novas desse dia antes de corrigir o registro antigo. A fase será preservada.');
 if(s.version===1&&r.lesson&&s.lessons.at(-1)?.id!==r.lesson)throw Error('Corrija primeiro a fase mais recente; as próximas dependem desta.');
 const operationId=createId();
 if(s.version===1&&r.lesson)s.lessons=s.lessons.filter(l=>l.id!==r.lesson);
 event(s,day,'undo','Correção: '+r.title,-r.xp,-r.coins,{key,skills:Object.fromEntries(Object.entries(r.skills).map(([k,v])=>[k,-v])),originalDay:r.day},operationId);
 delete s.records[key];return true;}
export function windows(day){return A.baseExtraWindows(day);}
export const minutes=t=>Number(t.slice(0,2))*60+Number(t.slice(3));
export const timeString=n=>String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0');
export function timeNow(now=new Date()){return new Intl.DateTimeFormat('en-GB',{timeZone:TIMEZONE,hour:'2-digit',minute:'2-digit',hour12:false}).format(now);}
export function reservation(s,r,day,start,nowMinute=0){
 const st=minutes(start),en=st+r.minutes;
 if(st<nowMinute)throw Error('Esse horário já passou. Escolha uma janela que ainda esteja disponível hoje.');
 if(!windows(day).some(([a,b])=>st>=minutes(a)&&en<=minutes(b)))throw Error('A recompensa precisa caber inteira em uma janela livre, antes de desacelerar.');
 if(s.purchases.some(p=>p.day===day&&p.status!=='cancelled'&&st<minutes(p.end)&&en>minutes(p.start)))throw Error('Já existe uma recompensa reservada nesse horário.');
 if(s.version===2){
  if(!availableRewardWindows(s,day,nowMinute).some(([a,b])=>st>=minutes(a)&&en<=minutes(b)))throw Error('Há uma missão, pausa ou bloco reservado nesse horário da agenda. Escolha outra janela livre.');
  return timeString(en);
 }
 if(missionsFor(s,day).some(m=>{const end=minutes(m.time)+m.minutes;return st<end&&en>minutes(m.time);}))throw Error('Há uma missão nesse horário. Ajuste a missão ou escolha outra janela.');
 return timeString(en);
}
export function buy(s,id,day,start,requestId,nowMinute=0){
 if(s.purchases.some(p=>p.requestId===requestId))return false;
 const r=s.config.rewards.find(r=>r.id===id);if(!r)throw Error('Recompensa não encontrada.');
 if(r.weekend&&![0,6].includes(weekday(day)))throw Error('A sessão de filme é reservada para sábado ou domingo.');
 if(s.purchases.some(p=>p.rewardId===id&&p.status!=='cancelled'&&(r.limit==='week'?weekKey(p.day)===weekKey(day):p.day===day)))throw Error('Limite de resgate atingido para esse período.');
 if(totals(s).coins<r.price)throw Error('Ainda faltam moedas para este extra. Seu descanso e lazer básico continuam livres.');
 const end=reservation(s,r,day,start,nowMinute),p={id:createId(),requestId,rewardId:id,title:r.title,day,start,end,price:r.price,status:'reserved'};
 const operationId=createId();
 s.purchases.push(p);event(s,day,'purchase','Reserva: '+r.title,0,-r.price,{purchaseId:p.id},operationId);return true;
}
export function cancel(s,id,day){const p=s.purchases.find(p=>p.id===id);if(!p||p.status==='cancelled')return false;if(p.status==='used')throw Error('Uma recompensa já utilizada não pode ser cancelada.');const operationId=createId();p.status='cancelled';event(s,day,'refund','Cancelamento: '+p.title,0,p.price,{purchaseId:p.id},operationId);return true;}
export function usePurchase(s,id){const p=s.purchases.find(p=>p.id===id);if(!p||p.status!=='reserved')return false;p.status='used';return true;}
export function reschedule(s,id,from,to,time){const m=s.config.missions.find(m=>m.id===id);if(!m)throw Error('Missão inexistente.');if(m.essential)throw Error('Cuidados essenciais não são adiados; combine ajuda e ajuste o horário.');if(s.records[from+':'+id])throw Error('Desfaça o registro antes de reagendar.');if(s.version===2&&id==='python'&&studySessions(s).some(item=>!item.corrected&&item.day===from))throw Error('Corrija as sessões ativas deste dia antes de reagendar.');if(to<from)throw Error('Escolha hoje ou uma data posterior.');if(s.version===2){if(!dateValid(from)||!dateValid(to)||!clock(time))throw Error('Escolha uma data e um horário válidos.');const next=structuredClone(s);next.overrides[from+':'+id]={skip:true};next.overrides[to+':'+id]={include:true,time};for(const day of new Set([from,to]))checkScheduleChange(s,next,day,1);s.overrides=next.overrides;}else{s.overrides[from+':'+id]={skip:true};s.overrides[to+':'+id]={include:true,time};}}
function scheduleDay(day){
 if(!dateValid(day))throw Error('Escolha uma data válida para consultar a agenda.');
}
function scheduleMinute(value){
 if(!int(value,1439))throw Error('Escolha um horário válido, em minutos entre 0 e 1439.');
}
function scheduledMissions(s,day){
 return missionsFor(s,day).map(m=>{
  if(m.id!=='python'||s.version!==2)return m;
  const progress=studyProgress(s,day);
  return {...m,minutes:progress.goal,minMinutes:progress.minMinutes,remainingMinutes:Math.max(0,progress.goal-progress.minutes)};
 });
}
export function agendaFor(s,day){
 scheduleDay(day);
 const agenda=A.buildAgenda(s,day,scheduledMissions(s,day));
 return {...agenda,conflicts:agenda.conflicts.map(c=>({...c,day,message:c.reason}))};
}
export function availableRewardWindows(s,day,nowMinute=0){
 scheduleDay(day);scheduleMinute(nowMinute);
 return A.availableExtra(s,day,scheduledMissions(s,day),nowMinute);
}
export function nextAction(s,day,nowMinute){
 scheduleDay(day);scheduleMinute(nowMinute);
 const missions=scheduledMissions(s,day),statuses={};
 for(const m of missions){
  if(m.id==='python'&&s.version===2){
   const progress=studyProgress(s,day);
   statuses[m.id]=progress.normal?'normal':progress.minimum||progress.legacy?'minimum':null;
  }else{
   const record=s.records[day+':'+m.id];
   statuses[m.id]=record?(record.rank===2?'normal':'minimum'):null;
  }
 }
 return A.nextAgendaAction(s,day,missions,nowMinute,statuses);
}
export function rewardOptions(s,id,day,nowMinute=0){
 scheduleDay(day);scheduleMinute(nowMinute);
 const r=s.config.rewards.find(item=>item.id===id);
 if(!r)throw Error('Recompensa não encontrada.');
 const neededCoins=Math.max(0,r.price-totals(s).coins);
 const slots=availableRewardWindows(s,day,nowMinute).flatMap(([a,b])=>
  minutes(b)-minutes(a)>=r.minutes?[{start:a,end:timeString(minutes(a)+r.minutes)}]:[]);
 const common={neededCoins,slots,price:r.price,minutes:r.minutes};
 if(r.weekend&&![0,6].includes(weekday(day)))return {...common,allowed:false,reason:'Esta recompensa é reservada para sábado ou domingo.'};
 const limited=s.purchases.some(p=>p.rewardId===id&&p.status!=='cancelled'&&(r.limit==='week'?weekKey(p.day)===weekKey(day):p.day===day));
 if(limited)return {...common,allowed:false,reason:'Limite de resgate atingido neste período. Cancelar uma reserva não usada libera o limite.'};
 if(neededCoins)return {...common,allowed:false,reason:'Faltam '+neededCoins+' moedas para este extra. Descanso e lazer básico continuam livres.'};
 if(!slots.length)return {...common,allowed:false,reason:'Não há janela livre para '+r.minutes+' minutos de extra neste dia, respeitando a agenda e o horário de dormir.'};
 return {...common,allowed:true,reason:'Cabe em '+slots[0].start+'–'+slots[0].end+'; depois da reserva restam '+(totals(s).coins-r.price)+' moedas.'};
}
export function schedulePreview(s,id,values,fromDay=dayKey()){
 scheduleDay(fromDay);
 const next=structuredClone(s),m=next.config.missions.find(item=>item.id===id);
 if(!m)throw Error('Missão não encontrada para a prévia.');
 Object.assign(m,values);
 if(!m.secondary)delete m.secondary;
 if(!m.secondTime)delete m.secondTime;
 validateState(next);
 const days=Array.from({length:7},(_,i)=>{
  const day=addDays(fromDay,i);return {day,agenda:agendaFor(next,day)};
 });
 return {days,conflicts:days.flatMap(item=>item.agenda.conflicts)};
}
export function checkScheduleChange(before,next,fromDay=dayKey(),days=7){
 scheduleDay(fromDay);
 if(!int(days,14)||days<1)throw Error('Escolha entre 1 e 14 dias para conferir a agenda.');
 for(let i=0;i<days;i++){
  const day=addDays(fromDay,i),previous=new Set(agendaFor(before,day).conflicts.map(c=>c.id));
  const added=agendaFor(next,day).conflicts.find(c=>!previous.has(c.id));
  if(added)throw Error('Conflito de horários em '+day.split('-').reverse().join('/')+': '+added.reason+' ('+added.start+'–'+added.end+').');
 }
 return true;
}
const dateValid=d=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d)&&!isNaN(Date.parse(d+'T12:00:00Z'))&&new Date(d+'T12:00:00Z').toISOString().slice(0,10)===d;
const int=(n,max=1000000)=>Number.isSafeInteger(n)&&n>=0&&n<=max;
const signed=n=>Number.isSafeInteger(n)&&Math.abs(n)<=1000000;
const text=v=>typeof v==='string'&&v.length<10000;
const clock=t=>typeof t==='string'&&/^([01]\d|2[0-3]):[0-5]\d$/.test(t);
const skillIds=['reading','fitness','home','dog','python'];
const forbidden=new Set(['__proto__','prototype','constructor','toJSON']);
const identifier=v=>text(v)&&/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(v)&&!forbidden.has(v);
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
const map=o=>o!==null&&typeof o==='object'&&!Array.isArray(o)&&(Object.getPrototypeOf(o)===Object.prototype||Object.getPrototypeOf(o)===null);
function requireValid(condition){if(!condition)throw Error('Dados inconsistentes');}
function shape(o,required,optional=[]){
 requireValid(map(o)&&required.every(k=>own(o,k))&&Object.keys(o).every(k=>required.includes(k)||optional.includes(k)));
}

// Reject values JSON would omit or transform before accepting them for storage.
// Shared arrays in the original defaults are allowed; cycles and exotic objects are not.
function jsonStable(value,ancestors=new Set(),depth=0){
 requireValid(depth<=20);
 if(value===null||typeof value==='string'||typeof value==='boolean')return;
 if(typeof value==='number'){requireValid(Number.isFinite(value));return;}
 requireValid(typeof value==='object'&&!ancestors.has(value));
 const array=Array.isArray(value);
 requireValid(array?Object.getPrototypeOf(value)===Array.prototype:map(value));
 const keys=Reflect.ownKeys(value);
 if(array)requireValid(keys.length===value.length+1);
 ancestors.add(value);
 for(const key of keys){
  if(array&&key==='length')continue;
  requireValid(typeof key==='string'&&!forbidden.has(key));
  const property=Object.getOwnPropertyDescriptor(value,key);
  requireValid(property.enumerable&&own(property,'value'));
  if(array)requireValid(/^(0|[1-9]\d*)$/.test(key)&&Number(key)<value.length);
  jsonStable(property.value,ancestors,depth+1);
 }
 ancestors.delete(value);
}
function skillsValid(skills,xp,negative=false){
 requireValid(map(skills));
 const entries=Object.entries(skills);
 requireValid(entries.length>0&&entries.length<=5&&entries.every(([k,v])=>skillIds.includes(k)&&(negative?signed(v):int(v))));
 requireValid(entries.reduce((sum,[,v])=>sum+v,0)===xp);
}
function sameSkills(a,b,sign=1){return skillIds.every(k=>(a[k]||0)===sign*(b[k]||0));}
function occurrence(key,missionIds){
 requireValid(typeof key==='string'&&key[10]===':'&&dateValid(key.slice(0,10))&&missionIds.has(key.slice(11)));
 return {day:key.slice(0,10),id:key.slice(11)};
}
const backupError=()=>Error('Backup inválido ou inconsistente. Seus dados atuais foram preservados.');

export function validateState(s){
 try{
  jsonStable(s);
  shape(s,['version','revision','created','config','records','events','purchases','lessons','overrides','difficult',...(s.version===2?['study']:[])]);
  shape(s.config,['name','xpStep','paused','sounds','missions','rewards'],['appearance']);
  if(own(s.config,'appearance'))R.validateAppearance(s.config.appearance);
  requireValid([1,2].includes(s.version)&&int(s.revision)&&dateValid(s.created)&&text(s.config.name)&&int(s.config.xpStep,10000)&&s.config.xpStep>=10&&typeof s.config.paused==='boolean'&&typeof s.config.sounds==='boolean');
  requireValid(Array.isArray(s.config.missions)&&s.config.missions.length>=1&&s.config.missions.length<=100&&Array.isArray(s.config.rewards)&&s.config.rewards.length<=100);
  const missionIds=new Set(),rewardIds=new Set();
  for(const m of s.config.missions){
   shape(m,['id','title','action','minimum','criterion','time','days','skill','xp','coins','minXp','minCoins','minutes','minMinutes'],['secondary','essential','weekendTime','secondTime']);
   requireValid(identifier(m.id)&&!missionIds.has(m.id)&&['title','action','minimum','criterion'].every(k=>text(m[k]))&&clock(m.time)&&Array.isArray(m.days)&&m.days.length<=7&&m.days.every(d=>int(d,6))&&new Set(m.days).size===m.days.length&&skillIds.includes(m.skill));
   requireValid((!own(m,'secondary')||skillIds.includes(m.secondary))&&m.skill!==m.secondary&&(!own(m,'essential')||typeof m.essential==='boolean'));
   requireValid(!own(m,'weekendTime')||clock(m.weekendTime));
   requireValid(!own(m,'secondTime')||m.id==='weekend-walk'&&clock(m.secondTime));
   requireValid(['xp','coins','minXp','minCoins','minutes','minMinutes'].every(k=>int(m[k],10000))&&m.minXp<=m.xp&&m.minCoins<=m.coins&&m.minutes>=1&&m.minMinutes>=1);
   missionIds.add(m.id);
  }
  // The phase dialog relies on this built-in mission; all v1 exports include it.
  requireValid(missionIds.has('python'));
  for(const r of s.config.rewards){
   shape(r,['id','title','description','price','minutes','limit'],['weekend','icon']);
   requireValid(identifier(r.id)&&!rewardIds.has(r.id)&&text(r.title)&&text(r.description)&&int(r.price,100000)&&int(r.minutes,120)&&r.minutes>=1&&['day','week'].includes(r.limit)&&(!own(r,'weekend')||typeof r.weekend==='boolean')&&(!own(r,'icon')||text(r.icon)));
   rewardIds.add(r.id);
  }
  requireValid(map(s.records)&&map(s.overrides)&&map(s.difficult)&&Array.isArray(s.events)&&s.events.length<=100000&&Array.isArray(s.purchases)&&s.purchases.length<=100000&&Array.isArray(s.lessons)&&s.lessons.length<=100000);
  const study=s.version===2?studyModel(s):null,studySteps=study?[...study.steps.values()]:[],studyAwards=new Map(),studyLiveMinutes=new Map();
  let studyIndex=0;
  const purchases=new Map(),requestIds=new Set();
  for(const p of s.purchases){
   shape(p,['id','requestId','rewardId','title','day','start','end','price','status']);
   requireValid(identifier(p.id)&&!purchases.has(p.id)&&identifier(p.requestId)&&!requestIds.has(p.requestId)&&rewardIds.has(p.rewardId)&&text(p.title)&&dateValid(p.day)&&clock(p.start)&&clock(p.end)&&minutes(p.end)>minutes(p.start)&&minutes(p.end)-minutes(p.start)<=120&&int(p.price)&&['reserved','used','cancelled'].includes(p.status));
   purchases.set(p.id,{snapshot:p,bought:false,refunded:false});requestIds.add(p.requestId);
  }

  // Rebuild every live occurrence and transaction in ledger order. Historical
  // awards use their snapshots: editing today's mission never rewrites history.
  const active=new Map(),eventIds=new Set(),phases=[],skillBalances=Object.fromEntries(skillIds.map(k=>[k,0]));
  let xp=0,coins=0;
  for(const [eventIndex,e] of s.events.entries()){
   const task=['mission','upgrade','undo'].includes(e.type);
   const studyEvent=e.type==='study'&&study,inLegacy=!study||eventIndex<s.study.legacyEventCount;
   const base=['id','at','day','type','title','xp','coins'];
   shape(e,[...base,...(studyEvent?['studyAction','skills','originalDay']:task?(e.type==='undo'?['key','skills','originalDay']:['key','skills','lesson']):['purchaseId'])]);
   requireValid(identifier(e.id)&&!eventIds.has(e.id)&&dateValid(e.day)&&text(e.title)&&text(e.at)&&/^\d{4}-\d{2}-\d{2}T/.test(e.at)&&Number.isFinite(Date.parse(e.at))&&['mission','upgrade','undo','purchase','refund',...(study?['study']:[])].includes(e.type)&&signed(e.xp)&&signed(e.coins));
   eventIds.add(e.id);
   if(studyEvent){
    const step=studySteps[studyIndex++];
    requireValid(!inLegacy&&step&&step.action.id===e.studyAction&&step.action.at===e.at&&step.action.day===e.day&&e.originalDay===step.day);
    const b=s.study.budgets[step.day],legacy=active.get(step.day+':python'),points=studyPoints(b,step.after),previous=studyAwards.get(step.day)||{xp:0,coins:0,skills:{}};
    const targetXp=Math.max(0,points.xp-(legacy?.xp||0)),targetCoins=Math.max(0,points.coins-(legacy?.coins||0)),desired=studySplit(b,targetXp),delta={};
    for(const key of new Set([...Object.keys(desired),...Object.keys(previous.skills)]))delta[key]=(desired[key]||0)-(previous.skills[key]||0);
    skillsValid(e.skills,e.xp,true);
    requireValid(e.xp===targetXp-previous.xp&&e.coins===targetCoins-previous.coins&&sameSkills(e.skills,delta)&&Object.keys(e.skills).every(k=>own(delta,k))&&e.title===(step.action.type==='session'?'Sessão de Python: ':'Correção de sessão de Python: ')+step.original.goal);
    studyAwards.set(step.day,{xp:targetXp,coins:targetCoins,skills:desired});
    studyLiveMinutes.set(step.day,step.after);
    for(const k of skillIds){skillBalances[k]+=e.skills[k]||0;requireValid(Number.isSafeInteger(skillBalances[k])&&skillBalances[k]>=0);}
   }else if(task){
    const {id,day}=occurrence(e.key,missionIds),previous=active.get(e.key);
    skillsValid(e.skills,e.xp,true);
    if(e.type==='undo'){
     requireValid(previous&&dateValid(e.originalDay)&&e.originalDay===day&&e.xp===-previous.xp&&e.coins===-previous.coins&&sameSkills(e.skills,previous.skills,-1)&&e.title==='Correção: '+previous.title);
     requireValid(!study||inLegacy||id!=='python'||!(studyLiveMinutes.get(day)>0));
     if(previous.lesson&&inLegacy){requireValid(phases.at(-1)?.id===previous.lesson);phases.pop();}
     active.delete(e.key);
    }else{
     requireValid(e.day===day&&e.xp>=0&&e.coins>=0&&(e.lesson===null||(id==='python'&&int(e.lesson)&&e.lesson>0)));
     requireValid(!study||inLegacy||id!=='python');
     requireValid(e.type==='mission'?!previous&&Object.keys(e.skills).length<=2:previous&&!previous.upgraded&&!previous.lesson);
     const current={xp:(previous?.xp||0)+e.xp,coins:(previous?.coins||0)+e.coins,skills:{},lesson:e.lesson,title:e.title,upgraded:e.type==='upgrade'};
     for(const k of skillIds){const value=(previous?.skills[k]||0)+(e.skills[k]||0);requireValid(int(value));if(value||own(e.skills,k)||own(previous?.skills||{},k))current.skills[k]=value;}
     requireValid(int(current.xp)&&int(current.coins));
     if(e.lesson&&inLegacy){requireValid(e.lesson===phases.length+1&&(!phases.length||phases.at(-1).day<day));phases.push({id:e.lesson,day});}
     active.set(e.key,current);
    }
    for(const k of skillIds){skillBalances[k]+=e.skills[k]||0;requireValid(Number.isSafeInteger(skillBalances[k])&&skillBalances[k]>=0);}
   }else{
    const transaction=purchases.get(e.purchaseId);requireValid(transaction&&e.xp===0);
    if(e.type==='purchase'){
     requireValid(!transaction.bought&&!transaction.refunded&&e.day===transaction.snapshot.day&&e.coins===-transaction.snapshot.price&&e.title==='Reserva: '+transaction.snapshot.title);transaction.bought=true;
    }else{
     requireValid(e.type==='refund'&&transaction.bought&&!transaction.refunded&&e.coins===transaction.snapshot.price&&e.title==='Cancelamento: '+transaction.snapshot.title);transaction.refunded=true;
    }
   }
   xp+=e.xp;coins+=e.coins;
   requireValid(Number.isSafeInteger(xp)&&Number.isSafeInteger(coins)&&xp>=0&&coins>=0);
  }
  requireValid(Object.keys(s.records).length===active.size);
  for(const [key,r] of Object.entries(s.records)){
   shape(r,['id','day','rank','xp','coins','skills','lesson','title']);
   const ref=occurrence(key,missionIds),ledger=active.get(key);
   requireValid(ledger&&r.id===ref.id&&r.day===ref.day&&[1,2].includes(r.rank)&&int(r.xp)&&int(r.coins)&&text(r.title));
   skillsValid(r.skills,r.xp);requireValid(Object.keys(r.skills).length<=2);
   requireValid(r.xp===ledger.xp&&r.coins===ledger.coins&&sameSkills(r.skills,ledger.skills)&&r.lesson===ledger.lesson&&r.title===ledger.title&&(!ledger.upgraded||r.rank===2));
   requireValid(r.id==='python'?(r.rank===2?int(r.lesson)&&r.lesson>0:r.lesson===null):r.lesson===null);
  }
  for(const {snapshot:p,bought,refunded} of purchases.values())requireValid(bought&&refunded===(p.status==='cancelled'));
  if(study){
   requireValid(studyIndex===studySteps.length&&[...study.actionIds].every(id=>!eventIds.has(id))&&s.study.legacyLessons.length===phases.length);
   s.study.legacyLessons.forEach((l,i)=>requireValid(l.id===phases[i].id&&l.day===phases[i].day));
   requireValid(s.lessons.length===study.phases.length);
   s.lessons.forEach((l,i)=>{
    shape(l,['id','day','exercises','project']);
    const expected=study.phases[i];
    requireValid(['id','day','exercises','project'].every(k=>l[k]===expected[k]));
   });
  }else{
   requireValid(s.lessons.length===phases.length);
   s.lessons.forEach((l,i)=>{
   shape(l,['id','day','exercises','project']);
   requireValid(l.id===i+1&&l.id===phases[i].id&&l.day===phases[i].day&&int(l.exercises,100)&&typeof l.project==='boolean');
   const r=s.records[l.day+':python'];requireValid(r&&r.rank===2&&r.lesson===l.id);
   });
  }
  for(const [key,o] of Object.entries(s.overrides)){
   occurrence(key,missionIds);shape(o,[],['skip','include','time']);
   requireValid((!own(o,'skip')||typeof o.skip==='boolean')&&(!own(o,'include')||typeof o.include==='boolean')&&(!own(o,'time')||clock(o.time))&&!(o.skip&&o.include));
  }
  for(const [day,value] of Object.entries(s.difficult))requireValid(dateValid(day)&&typeof value==='boolean');
  return true;
 }catch{throw backupError();}
}

// Schema 1 remains readable without rewriting its original evidence. Schema 2
// adds an independent study log; all money/XP still belongs to the main ledger.
export function migrateStudyState(state){
 validateState(state);
 const next=structuredClone(state);
 if(next.version===2)return next;
 next.version=2;
 next.study={legacyEventCount:next.events.length,legacyLessons:structuredClone(next.lessons),budgets:{},actions:[]};
 validateState(next);
 return next;
}
export function createStudyState(day=dayKey()){return migrateStudyState(createState(day));}

// Cosmetic availability uses active evidence only. Saved choices are preferences,
// not financial purchases or claims of ownership; correction can change the view
// without making an otherwise valid backup invalid.
function refugeStudy(s){return {sessions:studySessions(s),projects:studyProjects(s).filter(project=>project.completed!==null).length};}
export function refugeProgress(s){return R.refugeProgress(s,refugeStudy(s));}
export function appearanceFor(s){return R.appearanceFor(s,refugeStudy(s));}
export function updateAppearance(s,values){
 validateState(s);
 R.validateAppearance(values);
 const progress=refugeProgress(s),preferred=appearanceFor(s).preferred;
 const chosen=structuredClone(values);
 chosen.decor=R.appearanceOptions.decor.map(item=>item.id).filter(id=>chosen.decor.includes(id));
 const selected=[chosen.accessory,...chosen.decor];
 for(const id of selected){
  const item=progress.items.find(item=>item.id===id);
  const previous=item.slot==='accessory'?preferred.accessory===id:preferred.decor.includes(id);
  if(!item.unlocked&&!previous)throw Error(item.title+' ainda não está disponível. Marco: '+item.requirement);
 }
 if(['cloak','skin','hair','accessory','simplified'].every(field=>chosen[field]===preferred[field])&&
    chosen.decor.length===preferred.decor.length&&chosen.decor.every(id=>preferred.decor.includes(id)))return false;
 const next=structuredClone(s);
 next.config.appearance=chosen;
 validateState(next);
 s.config.appearance=chosen;
 return true;
}

function studyBudget(s){
 const m=s.config.missions.find(item=>item.id==='python');
 return {minutes:m.minutes,minMinutes:Math.min(m.minMinutes,m.minutes),xp:m.xp,minXp:m.minXp,coins:m.coins,minCoins:m.minCoins,skill:m.skill,...(m.secondary?{secondary:m.secondary}:{})};
}
function studyPoints(b,amount){
 const duration=Math.min(amount,b.minutes);
 if(duration>=b.minutes)return {xp:b.xp,coins:b.coins};
 if(duration<b.minMinutes)return {xp:Math.floor(b.minXp*duration/b.minMinutes),coins:Math.floor(b.minCoins*duration/b.minMinutes)};
 const extra=duration-b.minMinutes,span=b.minutes-b.minMinutes;
 return {xp:b.minXp+Math.floor((b.xp-b.minXp)*extra/span),coins:b.minCoins+Math.floor((b.coins-b.minCoins)*extra/span)};
}
function studySplit(b,xp){return b.secondary?{[b.skill]:Math.ceil(xp/2),[b.secondary]:Math.floor(xp/2)}:{[b.skill]:xp};}
function timestamp(value){return text(value)&&/^\d{4}-\d{2}-\d{2}T/.test(value)&&Number.isFinite(Date.parse(value));}
function studyModel(s){
 const st=s.study;
 shape(st,['legacyEventCount','legacyLessons','budgets','actions']);
 requireValid(int(st.legacyEventCount,100000)&&st.legacyEventCount<=s.events.length&&Array.isArray(st.legacyLessons)&&st.legacyLessons.length<=100000&&map(st.budgets)&&Array.isArray(st.actions)&&st.actions.length<=100000);
 const phases=structuredClone(st.legacyLessons),projects=new Map(),sessions=new Map(),steps=new Map(),actionIds=new Set(),requests=new Set(),minutesByDay=new Map(),budgetDays=new Set();
 phases.forEach((l,i)=>{
  shape(l,['id','day','exercises','project']);
  requireValid(l.id===i+1&&dateValid(l.day)&&(!i||phases[i-1].day<l.day)&&int(l.exercises,100)&&typeof l.project==='boolean');
  if(l.project)projects.set('legacy-project-'+l.id,{id:'legacy-project-'+l.id,title:'Projeto histórico da fase '+l.id,lessonId:l.id,created:l.day,completed:l.day,legacy:true});
 });
 for(const [day,b] of Object.entries(st.budgets)){
  requireValid(dateValid(day));
  shape(b,['minutes','minMinutes','xp','minXp','coins','minCoins','skill'],['secondary']);
  requireValid(['minutes','minMinutes','xp','minXp','coins','minCoins'].every(k=>int(b[k],10000))&&b.minutes>=1&&b.minMinutes>=1&&b.minMinutes<=b.minutes&&b.minXp<=b.xp&&b.minCoins<=b.coins&&skillIds.includes(b.skill)&&(!own(b,'secondary')||skillIds.includes(b.secondary)&&b.secondary!==b.skill));
 }
 for(const a of st.actions){
  const base=['id','requestId','at','day','type'];
  const fields={session:['minutes','goal','kind','lessonId','projectId','exercises'],'session-undo':['sessionId'],phase:['lessonId'],'phase-undo':['lessonId'],'project-create':['title','lessonId'],'project-finish':['projectId'],'project-reopen':['projectId']};
  requireValid(own(fields,a.type));
  shape(a,[...base,...fields[a.type]]);
  requireValid(identifier(a.id)&&!actionIds.has(a.id)&&identifier(a.requestId)&&!requests.has(a.requestId)&&timestamp(a.at)&&dateValid(a.day));
  actionIds.add(a.id);requests.add(a.requestId);
  const lessonRef=id=>id===null||int(id)&&id>=1&&id<=roadmap.length&&id<=phases.length+1;
  if(a.type==='session'){
   const allowedLesson=a.kind==='project'?(a.lessonId===null||int(a.lessonId)&&a.lessonId>=1&&a.lessonId<=roadmap.length):lessonRef(a.lessonId);
   requireValid(int(a.minutes,1440)&&a.minutes>=1&&typeof a.goal==='string'&&a.goal.trim().length>0&&a.goal.length<=500&&['phase','review','project'].includes(a.kind)&&allowedLesson&&int(a.exercises,1000)&&own(st.budgets,a.day));
   requireValid(a.kind==='phase'?a.lessonId!==null:a.kind==='review'?a.projectId===null:identifier(a.projectId)&&projects.has(a.projectId)&&projects.get(a.projectId).completed===null&&a.day>=projects.get(a.projectId).created&&a.lessonId===projects.get(a.projectId).lessonId);
   requireValid(a.kind==='project'||a.projectId===null);
   const before=minutesByDay.get(a.day)||0,after=before+a.minutes;
   requireValid(after<=1440);
   sessions.set(a.id,{...a,corrected:false,correctedDay:null});
   minutesByDay.set(a.day,after);budgetDays.add(a.day);
   steps.set(a.id,{action:a,original:a,day:a.day,before,after});
  }else if(a.type==='session-undo'){
   const original=sessions.get(a.sessionId);
   requireValid(original&&!original.corrected&&a.day>=original.day);
   const before=minutesByDay.get(original.day),after=before-original.minutes;
   original.corrected=true;original.correctedDay=a.day;
   minutesByDay.set(original.day,after);
   steps.set(a.id,{action:a,original,day:original.day,before,after});
  }else if(a.type==='phase'){
   requireValid(int(a.lessonId)&&a.lessonId===phases.length+1&&a.lessonId<=roadmap.length&&(!phases.length||phases.at(-1).day<a.day));
   phases.push({id:a.lessonId,day:a.day,exercises:0,project:false});
  }else if(a.type==='phase-undo'){
   requireValid(phases.length>0&&a.lessonId===phases.at(-1).id&&a.day>=phases.at(-1).day);
   phases.pop();
  }else if(a.type==='project-create'){
   requireValid(!projects.has(a.id)&&typeof a.title==='string'&&a.title.trim().length>0&&a.title.length<=100&&lessonRef(a.lessonId));
   projects.set(a.id,{id:a.id,title:a.title,lessonId:a.lessonId,created:a.day,completed:null,legacy:false});
  }else{
   const project=projects.get(a.projectId);
   requireValid(project&&a.day>=project.created);
   if(a.type==='project-finish'){requireValid(project.completed===null);project.completed=a.day;}
   else{requireValid(project.completed!==null&&a.day>=project.completed);project.completed=null;}
  }
 }
 requireValid(Object.keys(st.budgets).length===budgetDays.size);
 return {phases,projects,sessions,steps,actionIds,requests,minutesByDay};
}
export function studySessions(s){return s.version===2?[...studyModel(s).sessions.values()]:[];}
export function studyProjects(s){
 if(s.version===2)return [...studyModel(s).projects.values()];
 return s.lessons.filter(l=>l.project).map(l=>({id:'legacy-project-'+l.id,title:'Projeto histórico da fase '+l.id,lessonId:l.id,created:l.day,completed:l.day,legacy:true}));
}
export function studyStats(s){
 const sessions=studySessions(s).filter(item=>!item.corrected);
 const legacy=s.version===2?s.study.legacyLessons.filter(l=>s.records[l.day+':python']?.lesson===l.id):s.lessons;
 return {minutes:sessions.reduce((sum,item)=>sum+item.minutes,0),exercises:legacy.reduce((sum,l)=>sum+l.exercises,0)+sessions.reduce((sum,item)=>sum+item.exercises,0),projects:studyProjects(s).filter(item=>item.completed!==null).length};
}
export function studyProgress(s,day){
 const b=s.version===2?s.study.budgets[day]||studyBudget(s):studyBudget(s),legacy=s.records[day+':python'];
 const duration=studySessions(s).filter(item=>item.day===day&&!item.corrected).reduce((sum,item)=>sum+item.minutes,0);
 const earned=s.events.filter(e=>e.type==='study'&&e.originalDay===day).reduce((sum,e)=>({xp:sum.xp+e.xp,coins:sum.coins+e.coins}),{xp:legacy?.xp||0,coins:legacy?.coins||0});
 return {minutes:duration,goal:b.minutes,minMinutes:b.minMinutes,xp:b.xp,coins:b.coins,minXp:b.minXp,minCoins:b.minCoins,earnedXp:earned.xp,earnedCoins:earned.coins,legacy:!!legacy,normal:duration>=b.minutes||legacy?.rank===2,minimum:duration>=b.minMinutes||!!legacy};
}
function studyReady(s,correction=false){
 validateState(s);
 if(s.version!==2)throw Error('Ative as sessões independentes de Python para registrar esta prática. Seu progresso antigo será preservado.');
 if(s.config.paused&&!correction)throw Error('A jornada está em pausa. Retome nas configurações para registrar estudo.');
}
function studyRequest(s,requestId){
 if(!identifier(requestId))throw Error('Não foi possível identificar esta ação. Abra o formulário novamente.');
 return s.study.actions.some(a=>a.requestId===requestId);
}
function studyIds(s,financial){
 const id=createId(),eventId=financial?createId():null,used=new Set([...s.events.map(e=>e.id),...s.study.actions.map(a=>a.id)]);
 if(used.has(id)||eventId&&(used.has(eventId)||eventId===id))throw Error('Não foi possível gerar identificadores únicos. Tente novamente.');
 return {id,eventId};
}
function appendStudy(s,values,requestId,financial=false,budget=null){
 const {id,eventId}=studyIds(s,financial),next=structuredClone(s),action={id,requestId,at:new Date().toISOString(),...values};
 if(budget&&!own(next.study.budgets,values.day))next.study.budgets[values.day]=budget;
 next.study.actions.push(action);
 const model=studyModel(next);
 next.lessons=model.phases;
 if(financial){
  const step=model.steps.get(id),b=next.study.budgets[step.day],legacy=next.records[step.day+':python'],points=studyPoints(b,step.after);
  const targetXp=Math.max(0,points.xp-(legacy?.xp||0)),targetCoins=Math.max(0,points.coins-(legacy?.coins||0));
  const previous=s.events.filter(e=>e.type==='study'&&e.originalDay===step.day);
  const oldXp=previous.reduce((sum,e)=>sum+e.xp,0),oldCoins=previous.reduce((sum,e)=>sum+e.coins,0),oldSkills={};
  for(const e of previous)for(const [key,value] of Object.entries(e.skills))oldSkills[key]=(oldSkills[key]||0)+value;
  const desired=studySplit(b,targetXp),delta={};
  for(const key of new Set([...Object.keys(desired),...Object.keys(oldSkills)]))delta[key]=(desired[key]||0)-(oldSkills[key]||0);
  const xp=targetXp-oldXp,coins=targetCoins-oldCoins;
  if(totals(s).coins+coins<0)throw Error('Para corrigir sem saldo negativo, cancele resgates ainda não usados ou reponha as moedas já gastas.');
  const title=(values.type==='session'?'Sessão de Python: ':'Correção de sessão de Python: ')+step.original.goal;
  next.events.push({id:eventId,at:action.at,day:values.day,type:'study',title,xp,coins,studyAction:id,skills:delta,originalDay:step.day});
 }
 validateState(next);
 Object.assign(s,next);
 return true;
}
export function recordStudySession(s,day,options){
 studyReady(s);
 if(studyRequest(s,options?.requestId))return false;
 if(!dateValid(day)||!int(options.minutes,1440)||options.minutes<1)throw Error('Informe de 1 a 1440 minutos inteiros de estudo.');
 if(typeof options.goal!=='string'||!options.goal.trim()||options.goal.length>500)throw Error('Descreva o objetivo da sessão em até 500 caracteres.');
 if(!int(options.exercises,1000))throw Error('Informe de 0 a 1000 exercícios realmente resolvidos.');
 if(!['phase','review','project'].includes(options.kind))throw Error('Escolha prática de fase, revisão ou projeto.');
 const model=studyModel(s),project=options.kind==='project'?model.projects.get(options.projectId):null;
 if(options.kind==='project'&&(!project||project.completed!==null))throw Error('Escolha um projeto em andamento para esta sessão.');
 if(project&&day<project.created)throw Error('A sessão não pode ser anterior à criação do projeto. Confira a data.');
 const lessonId=options.kind==='project'?project.lessonId:options.lessonId??null;
 if(options.kind==='phase'&&lessonId===null||lessonId!==null&&(!int(lessonId)||lessonId<1||lessonId>roadmap.length||options.kind!=='project'&&lessonId>s.lessons.length+1))throw Error('Escolha uma fase já disponível ou registre uma revisão livre.');
 if((model.minutesByDay.get(day)||0)+options.minutes>1440)throw Error('A soma das sessões ativas de um dia não pode superar 1440 minutos. Confira as marcações.');
 if(!missionsFor(s,day).some(item=>item.id==='python'))throw Error('Python não está disponível na frequência deste dia. Ajuste a frequência antes de registrar.');
 return appendStudy(s,{day,type:'session',minutes:options.minutes,goal:options.goal.trim(),kind:options.kind,lessonId,projectId:project?.id||null,exercises:options.exercises},options.requestId,true,studyBudget(s));
}
export function undoStudySession(s,id,day,requestId){
 studyReady(s,true);
 if(studyRequest(s,requestId))return false;
 const session=studyModel(s).sessions.get(id);
 if(!session||session.corrected)return false;
 if(!dateValid(day)||day<session.day)throw Error('A data da correção deve ser igual ou posterior à sessão.');
 return appendStudy(s,{day,type:'session-undo',sessionId:id},requestId,true);
}
export function completePhase(s,id,day,requestId){
 studyReady(s);
 if(studyRequest(s,requestId))return false;
 if(s.lessons.some(l=>l.id===id))return false;
 if(!int(id)||id!==s.lessons.length+1||id>roadmap.length)throw Error('Conclua o critério da fase atual antes de avançar.');
 if(!dateValid(day))throw Error('Informe uma data válida para concluir a fase.');
 if(s.lessons.at(-1)?.day>=day)throw Error('Uma nova fase por dia. A próxima abre amanhã; você pode continuar estudando.');
 return appendStudy(s,{day,type:'phase',lessonId:id},requestId);
}
export function undoPhase(s,id,day,requestId){
 studyReady(s,true);
 if(studyRequest(s,requestId))return false;
 const phase=s.lessons.find(l=>l.id===id);
 if(!phase)return false;
 if(s.lessons.at(-1)?.id!==id)throw Error('Corrija primeiro a fase mais recente; as próximas dependem desta. A prática será preservada.');
 if(!dateValid(day)||day<phase.day)throw Error('A data da correção deve ser igual ou posterior à fase.');
 return appendStudy(s,{day,type:'phase-undo',lessonId:id},requestId);
}
export function createStudyProject(s,title,lessonId,day,requestId){
 studyReady(s);
 if(studyRequest(s,requestId))return false;
 if(typeof title!=='string'||!title.trim()||title.length>100)throw Error('Informe um nome de projeto com até 100 caracteres.');
 if(!dateValid(day)||lessonId!==null&&(!int(lessonId)||lessonId<1||lessonId>roadmap.length||lessonId>s.lessons.length+1))throw Error('Escolha uma fase disponível ou deixe o projeto livre.');
 return appendStudy(s,{day,type:'project-create',title:title.trim(),lessonId},requestId);
}
export function completeStudyProject(s,id,day,requestId){
 studyReady(s);
 if(studyRequest(s,requestId))return false;
 const project=studyModel(s).projects.get(id);
 if(!project||project.completed!==null)return false;
 if(!dateValid(day)||day<project.created)throw Error('Informe uma data válida para a conclusão do projeto.');
 return appendStudy(s,{day,type:'project-finish',projectId:id},requestId);
}
export function reopenStudyProject(s,id,day,requestId){
 studyReady(s,true);
 if(studyRequest(s,requestId))return false;
 const project=studyModel(s).projects.get(id);
 if(!project||project.completed===null)return false;
 if(!dateValid(day)||day<project.completed)throw Error('Informe uma data válida para a correção do projeto.');
 return appendStudy(s,{day,type:'project-reopen',projectId:id},requestId);
}

export function parseState(raw){
 try{requireValid(typeof raw==='string');const state=JSON.parse(raw);validateState(state);return state;}catch{throw backupError();}
}
export function serializeState(state){
 validateState(state);
 try{const raw=JSON.stringify(state);parseState(raw);return raw;}catch{throw backupError();}
}
