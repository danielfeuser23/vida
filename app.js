import {skills} from './data.js';
import {roadmap} from './roadmap.js';
import {pythonContent} from './python-content.js';
import * as E from './engine.js';
import * as P from './storage.js';
import {createId} from './ids.js';
const KEY=P.STORAGE_KEY, app=document.querySelector('#app'), modal=document.querySelector('#modal');
let state, storageError=false, hasValidMemory=false, knownRaw=null, pendingImport=null, pendingRecovery=null, pendingMigration=null;
let recoveryInfo=null, recoveryProblem='';
try {
  knownRaw=P.readStoredRaw(localStorage);
  state=knownRaw===null?E.createStudyState():E.parseState(knownRaw);
  hasValidMemory=true;
} catch {
  state=E.createStudyState();
  storageError=true;
}
function refreshRecovery() {
  try { recoveryInfo=P.readRecovery(localStorage); recoveryProblem=''; }
  catch(error) { recoveryInfo=null; recoveryProblem=error.message; }
}
refreshRecovery();
let page='today',world=0,currentDay=E.dayKey(),timer=null,toastTimeout;
let modalOpener=null,lastInteraction=null,completedExpanded=false,lastActionMinute='';
let todayAgenda=null,selectedAgendaDay=E.dayKey();
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const paths={mountain:'m2 18 7-13 5 8 3-5 5 10H2Z M7 9l2 2 2-2',sun:'M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6 7 7m10 10 1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4 M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0',home:'m3 10 9-7 9 7v10H3V10Zm6 10v-7h6v7',book:'M3 4c4-1 7 0 9 2 2-2 5-3 9-2v15c-4-1-7 0-9 2-2-2-5-3-9-2V4Zm9 2v15',code:'m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18',heart:'M20 5c-3-3-6-1-8 1-2-2-5-4-8-1-5 5 2 10 8 15 6-5 13-10 8-15Z',paw:'M8 13c3-4 5-4 8 0 4 5 1 8-4 6-5 2-8-1-4-6ZM4 8c0-4 4-4 4 0s-4 4-4 0Zm5-4c0-4 4-4 4 0s-4 4-4 0Zm6 2c0-4 4-4 4 0s-4 4-4 0Zm4 5c0-4 4-4 4 0s-4 4-4 0',star:'m12 2 3 7 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1 3-7Z',check:'m5 12 4 4L19 6',clock:'M12 6v6l4 2 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',shop:'M3 9h18l-2-6H5L3 9Zm1 0v12h16V9M9 21v-8h6v8',history:'M3 11a9 9 0 1 1 2 7M3 4v7h7m2-5v6l4 2',settings:'M9 3h6l1 4 4 1 1 6-4 2-1 5h-6l-1-4-5-1-1-6 4-2 2-5ZM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0',user:'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 22v-3a8 8 0 0 1 16 0v3',arrow:'M4 12h16m-6-6 6 6-6 6',play:'m8 4 12 8-12 8V4Z',game:'M6 7h12l4 11c1 4-4 4-6 0H8c-2 4-7 4-6 0L6 7Zm1 3v6m-3-3h6m6-1h.01m3 3h.01',film:'M3 3h18v18H3V3Zm4 0v18M17 3v18M3 8h4m-4 8h4m10-8h4m-4 8h4',moon:'M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z',leaf:'M4 21c0-9 7-15 16-18 1 12-4 18-13 15m0-1 9-9',download:'M12 3v12m-5-5 5 5 5-5M3 16v5h18v-5',pause:'M8 5v14M16 5v14',redo:'M20 11a8 8 0 1 0-1 7M20 4v7h-7',calendar:'M4 5h16v16H4V5Zm3-3v6m10-6v6M4 11h16',lock:'M6 10h12v11H6V10Zm2 0V6a4 4 0 0 1 8 0v4',spark:'m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Z'};
const icon=(name,cls='')=>`<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[name]||paths.star}"/></svg>`;
const coin='<span class="coin" aria-hidden="true">✦</span>';
const fmt=d=>new Intl.DateTimeFormat('pt-BR',{timeZone:E.TIMEZONE,day:'numeric',month:'short'}).format(new Date(d+'T12:00:00Z'));
function toast(msg,error=false){const el=document.querySelector('#toast');el.textContent=msg;el.className='show'+(error?' error':'');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>el.className='',6000);}
function focusSnapshot(element=document.activeElement) {
  if(!element||element===document.body||!element.matches)return null;
  const form=element.closest('form'),mission=element.closest('.mission');
  return {
    id:element.id,tag:element.tagName,name:element.getAttribute('name'),
    type:element.getAttribute('type'),form:form?.id,
    mission:mission?.id,studySession:element.closest('[data-study-session]')?.id,studyProject:element.closest('[data-study-project]')?.id,inNav:!!element.closest('.nav'),inTimer:!!element.closest('.timer'),
    avatar:element.matches('.avatar-small'),check:element.matches('.complete-check'),
    data:Object.fromEntries(Object.entries(element.dataset).filter(([key])=>['nav','action','id','key','mode','world','lesson'].includes(key)))
  };
}
function focusHeading() {
  const heading=app.querySelector('h1');
  if(heading&&!modal.open)heading.focus({preventScroll:true});
}
function restoreFocus(snapshot) {
  if(modal.open)return;
  if(!snapshot){focusHeading();return;}
  const focusContext=snapshot.mission?document.getElementById(snapshot.mission):null;
  for(let ancestor=focusContext?.parentElement;ancestor;ancestor=ancestor.parentElement)if(ancestor.matches('details')&&!ancestor.open){ancestor.open=true;if(ancestor.matches('.completed-missions'))completedExpanded=true;}
  const usable=element=>element&&element.isConnected&&!element.disabled&&!element.hidden&&element.getClientRects().length>0;
  let target=snapshot.id?document.getElementById(snapshot.id):null;
  const root=snapshot.inTimer?document.querySelector('.timer'):snapshot.studySession?document.getElementById(snapshot.studySession):snapshot.studyProject?document.getElementById(snapshot.studyProject):snapshot.mission?document.getElementById(snapshot.mission)
    :snapshot.form?document.getElementById(snapshot.form)
    :snapshot.inNav?app.querySelector('.nav'):app;
  if(!usable(target)&&root) {
    target=Array.from(root.querySelectorAll('button,input,select,textarea,a,summary')).find(element=>{
      if(!usable(element)||element.tagName!==snapshot.tag)return false;
      if(snapshot.avatar&&!element.matches('.avatar-small'))return false;
      if(snapshot.check&&!element.matches('.complete-check'))return false;
      if(snapshot.name&&element.getAttribute('name')!==snapshot.name)return false;
      if(snapshot.type&&element.getAttribute('type')!==snapshot.type)return false;
      return Object.entries(snapshot.data).every(([key,value])=>element.dataset[key]===value);
    });
    if(!usable(target)&&(snapshot.studySession||snapshot.studyProject))target=root.querySelector('button:not(:disabled)');
    if(!usable(target)&&snapshot.mission) {
      target=root.querySelector(snapshot.check?'.complete-check':'.mission-actions [data-action="complete"],.mission-actions [data-action="undo"]');
    }
  }
  if(usable(target)){target.focus({preventScroll:true});if(target.closest('.completed-missions'))target.scrollIntoView({block:'nearest'});}
  else focusHeading();
}
function formError(form,message,fields=[]) {
  let error=form.querySelector('[data-form-error]');
  if(!error) {
    error=document.createElement('p');
    error.id=form.id+'-errors';
    error.dataset.formError='';
    error.className='form-error';
    error.setAttribute('role','alert');
    form.prepend(error);
  }
  if(!error.id)error.id=form.id+'-errors';
  error.textContent=message;
  for(const name of fields) {
    const input=form.elements.namedItem(name);
    if(input instanceof HTMLElement) {
      input.setAttribute('aria-invalid','true');
      input.setAttribute('aria-describedby',[...(input.getAttribute('aria-describedby')||'').split(' ').filter(Boolean),error.id].filter((value,index,all)=>all.indexOf(value)===index).join(' '));
    }
  }
  const first=form.elements.namedItem(fields[0]);
  if(first instanceof HTMLElement)first.focus();
}
function clearFormError(form) {
  const error=form.querySelector('[data-form-error]');
  const errorId=error?.id||form.id+'-errors';
  if(error)error.textContent='';
  form.querySelectorAll('[aria-invalid]').forEach(input=>{
    input.removeAttribute('aria-invalid');
    const descriptions=(input.getAttribute('aria-describedby')||'').split(' ').filter(value=>value&&value!==errorId);
    if(descriptions.length)input.setAttribute('aria-describedby',descriptions.join(' '));else input.removeAttribute('aria-describedby');
  });
}
function updateSkillChoices(form) {
  const primary=form.elements.namedItem('skill'),secondary=form.elements.namedItem('secondary');
  if(!primary||!secondary)return;
  for(const option of primary.options)option.disabled=option.value===secondary.value;
  for(const option of secondary.options)option.disabled=option.value!==''&&option.value===primary.value;
}
function missionUpdate(form,fields) {
  clearFormError(form);
  const reject=(message,names)=>{formError(form,message,names);return null;};
  const values={};
  for(const [name,label] of [['title','o título'],['action','a ação normal'],['minimum','a versão mínima'],['criterion','a condição de conclusão']]) {
    values[name]=String(fields.get(name)||'').trim();
    if(!values[name])return reject('Informe '+label+' da missão.',[name]);
    const maximum=name==='title'?100:9999;
    if(values[name].length>maximum)return reject('Use até '+maximum+' caracteres para '+label+'.',[name]);
  }
  for(const name of ['time','weekendTime']) {
    values[name]=fields.get(name);
    if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(values[name]||''))return reject('Informe um horário válido no formato HH:mm.',[name]);
  }
  if(form.dataset.id==='weekend-walk'){values.secondTime=fields.get('secondTime');if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(values.secondTime||''))return reject('Informe um horário válido para o segundo passeio.',['secondTime']);}
  for(const name of ['time','weekendTime',...(form.dataset.id==='weekend-walk'?['secondTime']:[])])if(values[name]<'05:30'||values[name]>'22:30')return reject('Escolha um horário entre 05:30 e 22:30.',[''+name]);
  values.skill=fields.get('skill');
  values.secondary=fields.get('secondary')||'';
  if(!skills.some(item=>item.id===values.skill))return reject('Escolha uma habilidade principal válida.',['skill']);
  if(values.secondary&&!skills.some(item=>item.id===values.secondary))return reject('Escolha uma habilidade secundária válida.',['secondary']);
  if(values.secondary===values.skill)return reject('Escolha habilidades diferentes para a principal e a secundária.',['skill','secondary']);
  for(const [name,label] of [['minutes','Minutos normal'],['minMinutes','Minutos mínima'],['xp','XP normal'],['minXp','XP mínima'],['coins','Moedas normal'],['minCoins','Moedas mínima']]) {
    const raw=fields.get(name),minimum=name==='minutes'||name==='minMinutes'?1:0;
    values[name]=Number(raw);
    if(raw===null||raw===''||!Number.isInteger(values[name])||values[name]<minimum||values[name]>10000) {
      return reject(label+': informe um número inteiro entre '+minimum+' e 10000.',[name]);
    }
  }
  if(values.minXp>values.xp)return reject('O XP da versão mínima não pode ser maior que o XP normal.',['minXp','xp']);
  if(values.minCoins>values.coins)return reject('As moedas da versão mínima não podem ser maiores que as moedas da normal.',['minCoins','coins']);
  values.days=fields.getAll('days').map(Number);
  if(values.days.some(day=>!Number.isInteger(day)||day<0||day>6))return reject('Escolha dias válidos para a frequência.',['days']);
  return values;
}
async function withStorageLock(run) {
  return navigator.locks?await navigator.locks.request(KEY,run):run();
}
async function transact(fn) {
  try {
    if(storageError) throw Error('O armazenamento não pôde ser lido. Exporte os dados existentes ou restaure um backup antes de continuar.');
    return await withStorageLock(()=>{
      const raw=P.readStoredRaw(localStorage);
      if(raw===null&&knownRaw!==null) throw Error('O progresso salvo foi removido em outra aba. Exporte sua cópia em memória ou recarregue antes de continuar.');
      const next=raw===null?E.parseState(E.serializeState(state)):E.parseState(raw);
      const changed=fn(next);
      if(changed===false)return false;
      next.revision++;
      const saved=P.saveState(localStorage,next,raw);
      knownRaw=P.readStoredRaw(localStorage);
      state=saved;
      hasValidMemory=true;
      render();
      return true;
    });
  } catch(error) {
    refreshRecovery();
    toast(error.message||'Não foi possível salvar.',true);
    return false;
  }
}
function downloadBackup(raw,name) {
  const url=URL.createObjectURL(new Blob([raw],{type:'application/json'}));
  const link=document.createElement('a');
  link.href=url;
  link.download=name;
  link.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function recoveryControls() {
  if(recoveryProblem) return `<p class="requirements">${esc(recoveryProblem)}</p><button class="btn secondary" data-action="export-recovery-file">Exportar arquivo de recuperação</button>`;
  if(!recoveryInfo) return '<p class="requirements">Ao restaurar, a cópia atual será preservada antes da substituição. Se não houver espaço para preservar as cópias, a restauração será cancelada.</p>';
  return `<div class="notice" style="margin-top:16px"><strong>Cópia anterior disponível</strong><p class="small">Preservada antes da última restauração ou recuperação. Uma nova restauração substituirá esta cópia.</p><div class="form-actions" style="justify-content:flex-start"><button class="btn secondary" data-action="recover">Recuperar cópia anterior</button><button class="btn ghost" data-action="export-recovery">Exportar cópia anterior</button></div></div>`;
}
function storageNotice() {
  if(!storageError)return '';
  const message=hasValidMemory
    ?'Os dados locais não puderam ser lidos. Uma cópia válida permanece na memória desta aba: use Exportar backup antes de recarregar. O arquivo original também pode ser exportado em Ajustes.'
    :'Os dados locais estão ilegíveis e foram preservados. Exporte o arquivo original em Ajustes para análise ou restaure um backup válido.';
  return `<div class="notice warning">${message}</div>`;
}
const skill=id=>skills.find(s=>s.id===id)||skills[0];
function landscape(){return `<svg class="landscape" viewBox="0 0 700 300" preserveAspectRatio="xMaxYMax slice" aria-hidden="true"><defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#385943"/><stop offset="1" stop-color="#294837"/></linearGradient><linearGradient id="fade"><stop stop-color="#294c3d"/><stop offset="1" stop-color="#294c3d00"/></linearGradient></defs><path fill="url(#sky)" d="M0 0h700v300H0z"/><circle cx="520" cy="59" r="27" fill="#d5dba2"/><circle cx="510" cy="51" r="24" fill="#385943"/><g fill="#d6ddb0" opacity=".6"><circle cx="407" cy="42" r="1.5"/><circle cx="598" cy="35" r="1"/><circle cx="650" cy="84" r="1.5"/><circle cx="448" cy="89" r="1"/></g><path fill="#61715a" d="m200 210 175-145 55 61 43-35 151 139Z"/><path fill="#87917a" d="m375 65-37 48 32-13 12 7 13-14 35 33Z"/><path fill="#4d674e" d="m360 220 190-116 135 119Z"/><path fill="#416047" d="M90 245q150-133 300-39 200-95 350 16v100H90Z"/><g fill="#284b37"><path d="m490 251 22-68 22 68h-44Zm-9-22 31-71 31 71Z"/><path d="m567 254 22-71 22 71Zm-10-23 32-77 32 77Z"/><path d="m627 256 27-85 27 85Zm-10-28 37-84 37 84Z"/></g><path fill="#263e30" d="M0 281q200-71 385-18 122-37 315 4v33H0Z"/><path fill="#6c7651" d="M430 300q-56-45-4-61h18q-58 24 39 61Z"/><path fill="#b49662" d="M361 206h83v57h-83z"/><path fill="#263b2f" d="m345 207 55-51 60 51Z"/><path fill="#687352" d="m347 206 53-46 57 46-12-5-45-35-42 39Z"/><path fill="#e6c47c" d="M375 220h17v18h-17zM411 218h15v18h-15z"/><path stroke="#65573e" stroke-width="2" d="M383 220v18m-8-9h17m26-11v18m-7-9h15"/><path fill="#4d4c36" d="M396 239h15v24h-15z"/><path fill="#405b40" d="M330 271h125v8H330z"/><g fill="#213d2d"><path d="m178 286 27-92 29 92Zm-10-30 37-99 38 99Z"/><path d="m99 290 30-109 31 109Zm-11-38 41-112 42 112Z"/></g><g fill="#9aa77a"><circle cx="489" cy="280" r="2"/><circle cx="539" cy="267" r="2"/><circle cx="310" cy="283" r="2"/><circle cx="581" cy="285" r="2"/></g><path fill="url(#fade)" d="M0 0h380v300H0z"/></svg>`;}
const nav=[['today','sun','Hoje'],['character','user','Personagem'],['python','code','Trilha Python'],['shop','shop','Loja'],['history','history','Histórico'],['settings','settings','Ajustes']];
function render({headingFocus=false}={}){todayAgenda=null;const priorFocus=modal.open?null:focusSnapshot();const total=E.totals(state),lvl=E.levelInfo(total.xp,state.config.xpStep);app.innerHTML=`<div class="shell"><aside class="sidebar"><div class="brand"><div class="brand-mark">${icon('mountain')}</div><div><strong>Entre Trilhas</strong><small>SUA JORNADA COTIDIANA</small></div></div><div class="nav-label">SEU REFÚGIO</div><nav class="nav" aria-label="Navegação principal">${nav.map(([id,i,n])=>`<button data-nav="${id}" class="${page===id?'active':''}" ${page===id?'aria-current="page"':''}>${icon(i)}<span>${n}</span>${id==='python'?'<span class="tag">120 fases</span>':''}</button>`).join('')}</nav><div class="side-bottom"><div class="side-quote">“Grandes caminhos<br>começam com<br>pequenos passos.”</div><div class="local-badge"><span class="dot"></span> Salvo neste navegador</div></div></aside><main class="main"><header class="topbar"><div class="breadcrumb">Seu refúgio <span>/</span> <span>${nav.find(n=>n[0]===page)[2]}</span></div><div class="mobile-brand">${icon('mountain')} Entre Trilhas</div><div class="top-right"><span class="balance">${coin} ${total.coins} <span class="small">moedas</span></span><button class="avatar-small" data-nav="character" aria-label="Ver personagem">${icon('user')}</button></div></header>${storageNotice()}${migrationNotice()}${state.config.paused?'<div class="notice warning">Jornada em pausa. Sem perdas ou tarefas acumuladas. Os cuidados essenciais do cachorro continuam: combine ajuda se necessário. Retome em Ajustes.</div>':''}${({today:todayView,character:characterView,python:pythonView,shop:shopView,history:historyView,settings:settingsView})[page]()}<footer class="footer"><span>Feito para a vida real. Um passo de cada vez.</span><span>America/Sao_Paulo · dados locais</span></footer></main></div>`;renderTimer();if(!modal.open){if(headingFocus)focusHeading();else if(priorFocus)restoreFocus(priorFocus);}}
function heading(title,subtitle,action=''){return `<div class="greeting"><div><h1 id="page-heading" tabindex="-1">${title}</h1><p>${subtitle}</p></div>${action}</div>`;}
function migrationNotice() {
  if(state.version!==1)return '';
  return `<div class="notice study-migration"><div><strong>Seu progresso anterior está preservado.</strong><p class="small">Ative as sessões independentes de Python para registrar estudo sem concluir fases. Uma cópia anterior será guardada antes da mudança.</p></div><button class="btn secondary" data-action="migrate-study">Ativar sessões de Python</button></div>`;
}
function pythonStats() {
  return state.version===2?E.studyStats(state):{minutes:0,exercises:state.lessons.reduce((sum,item)=>sum+item.exercises,0),projects:state.lessons.filter(item=>item.project).length};
}
function missionStatus(mission) {
  if(mission.id!=='python'||state.version!==2)return state.records[currentDay+':'+mission.id];
  const progress=E.studyProgress(state,currentDay);
  return progress.normal?{rank:2}:progress.minimum||progress.legacy?{rank:1}:null;
}
function studyMissionCard(m,difficult) {
  const progress=E.studyProgress(state,currentDay),done=progress.normal||progress.minimum||progress.legacy;
  return `<article class="mission ${done?'done':''}" id="mission-python"><div class="mission-icon">${icon('code')}</div><div class="mission-body"><h3>${esc(m.title)} ${progress.legacy&&progress.minutes<progress.goal?'<span class="chip">Registro anterior</span>':progress.normal?'<span class="chip">Meta registrada</span>':progress.minimum?'<span class="chip">Mínima registrada</span>':''}</h3><p>${esc(difficult?(m.minimum.startsWith('Revisar por 5 minutos')||m.minimum.startsWith('Revisar um exercício por 5 minutos')?`Revisar um exercício por ${progress.minMinutes} minutos. A fase pode continuar em outro dia.`:m.minimum):(m.action.startsWith('Estudar das 18:00')?`Pratique Python e registre o tempo de cada sessão. Meta: ${progress.goal} minutos líquidos; a pausa fica fora da contagem.`:m.action))}</p>${missionTiming(m)}<div class="mission-meta"><span>${icon('clock')} ${esc(missionTimeLabel(m))} · <span data-study-minutes>${progress.minutes}/${progress.goal} min registrados</span></span><span>${esc(skill(m.skill).name)}</span>${m.secondary?`<span>+ ${esc(skill(m.secondary).name)} (XP dividido)</span>`:''}<span class="reward">${progress.earnedXp}/${progress.xp} XP · ${progress.earnedCoins}/${progress.coins} moedas do estudo</span></div>${progress.legacy?'<p class="small muted">Há prática do formato anterior neste dia, sem duração registrada. Os pontos já recebidos são considerados no limite diário.</p>':''}<div class="mission-actions"><button class="btn small" data-action="session" data-id="python" data-mode="${difficult?'minimum':'normal'}">${icon('check')}${difficult?'Registrar mínima':'Registrar sessão'}</button><button class="btn ghost small" data-action="session" data-id="python" data-mode="${difficult?'normal':'minimum'}">${difficult?'Registrar sessão':'Versão mínima'}</button><button class="btn ghost small" data-action="lesson">Ver fase</button><button class="btn ghost small" data-action="timer" data-id="python" aria-label="Cronômetro para ${esc(m.title)}">${icon('clock')}</button>${!progress.minutes&&!progress.legacy?`<button class="btn ghost small" data-action="reschedule" data-id="python" aria-label="Reagendar ${esc(m.title)}">${icon('calendar')}</button>`:''}</div><p class="small muted">Sessões somam o tempo do dia. Fases e projetos são marcos separados, sem segundo pagamento.</p></div></article>`;
}
function currentAgenda() {
  if(!todayAgenda)todayAgenda=E.agendaFor(state,currentDay);
  return todayAgenda;
}
function missionBlocks(mission,agenda=currentAgenda()) {
  return agenda.blocks.filter(block=>block.kind==='mission'&&block.missionId===mission.id);
}
function missionTimeLabel(mission,agenda=currentAgenda()) {
  const blocks=missionBlocks(mission,agenda);
  return blocks.length?blocks.map(block=>`${block.start}–${block.end}`).join(' / '):`${mission.time} · ${mission.minutes} min`;
}
function timingText(mission,nowMinute) {
  const status=missionStatus(mission);
  if(status)return status.rank===1?'Mínima registrada · normal opcional':'Registrada';
  const blocks=missionBlocks(mission);
  if(blocks.some(block=>nowMinute>=E.minutes(block.start)&&nowMinute<E.minutes(block.end)))return 'No bloco de agora';
  const future=blocks.find(block=>E.minutes(block.start)>nowMinute);
  if(future)return `${blocks.length>1?'Próximo trecho':'Programada'} às ${future.start}`;
  return 'Horário passou · ajuste se precisar';
}
function missionTiming(mission) {
  const nowMinute=E.minutes(E.timeNow()),blocks=missionBlocks(mission),past=!missionStatus(mission)&&blocks.length&&blocks.every(block=>E.minutes(block.end)<=nowMinute);
  return `<p class="mission-timing ${past?'timing-past':''}" data-mission-timing="${esc(mission.id)}">${esc(timingText(mission,nowMinute))}</p>`;
}
function nextActionPanel() {
  const action=E.nextAction(state,currentDay,E.minutes(E.timeNow()));
  const statusNames={available:'Cabe agora',upcoming:'A seguir',busy:'Seu bloco de agora',rest:'Um respiro no caminho',paused:'Jornada em pausa',conflict:'Um horário para ajustar'};
  const label=statusNames[action.status]||'Próximo passo';
  return `<section id="next-action" class="next-action-card" aria-labelledby="next-action-title" data-status="${esc(action.status)}" data-mission-id="${esc(action.missionId||'')}"><div class="next-action-copy"><div class="next-action-top"><span class="eyebrow" data-next-label>${label}</span><button class="link-btn" data-action="schedule">Ver agenda</button></div><h2 id="next-action-title" data-next-title>${esc(action.title)}</h2><p class="next-action-time" data-next-time>${action.start&&action.end?`${esc(action.start)}–${esc(action.end)}${action.minutes?' · '+action.minutes+' min':''}`:''}</p><p id="next-action-reason" class="small" data-next-reason>${esc(action.reason||'')}</p><button class="btn" data-action="next-action" data-id="${esc(action.missionId||'')}" data-mode="${esc(action.mode||'normal')}" data-minutes="${action.minutes||0}" aria-describedby="next-action-reason"><span data-next-button>${action.missionId?(action.missionId==='python'?'Registrar sessão':action.mode==='minimum'?'Ver versão mínima':'Ver missão'):'Ver este dia'}</span>${icon('arrow')}</button></div><div class="today-horizon" aria-hidden="true">${landscape()}</div></section>`;
}
function refreshNextAction() {
  const panel=document.querySelector('#next-action');if(!panel)return;
  const action=E.nextAction(state,currentDay,E.minutes(E.timeNow())),names={available:'Cabe agora',upcoming:'A seguir',busy:'Seu bloco de agora',rest:'Um respiro no caminho',paused:'Jornada em pausa',conflict:'Um horário para ajustar'};
  panel.dataset.status=action.status;panel.dataset.missionId=action.missionId||'';
  panel.querySelector('[data-next-label]').textContent=names[action.status]||'Próximo passo';
  panel.querySelector('[data-next-title]').textContent=action.title;
  panel.querySelector('[data-next-time]').textContent=action.start&&action.end?`${action.start}–${action.end}${action.minutes?' · '+action.minutes+' min':''}`:'';
  panel.querySelector('[data-next-reason]').textContent=action.reason||'';
  const button=panel.querySelector('[data-action="next-action"]');
  button.dataset.id=action.missionId||'';button.dataset.mode=action.mode||'normal';button.dataset.minutes=String(action.minutes||0);
  button.querySelector('[data-next-button]').textContent=action.missionId?(action.missionId==='python'?'Registrar sessão':action.mode==='minimum'?'Ver versão mínima':'Ver missão'):'Ver este dia';
  for(const label of document.querySelectorAll('[data-mission-timing]')) {
    const mission=E.missionsFor(state,currentDay).find(item=>item.id===label.dataset.missionTiming);if(!mission)continue;
    label.textContent=timingText(mission,E.minutes(E.timeNow()));
    label.classList.toggle('timing-past',label.textContent.startsWith('Horário passou'));
  }
}
function todayView() {
  const missions=E.missionsFor(state,currentDay),agenda=currentAgenda(),done=missions.filter(mission=>missionStatus(mission)),difficult=state.difficult[currentDay],total=E.totals(state),level=E.levelInfo(total.xp,state.config.xpStep),earned=E.dailyXp(state,currentDay);
  const completed=missions.filter(mission=>!mission.essential&&missionStatus(mission)?.rank===2),visible=missions.filter(mission=>mission.essential||missionStatus(mission)?.rank!==2);
  const date=new Intl.DateTimeFormat('pt-BR',{timeZone:E.TIMEZONE,weekday:'long',day:'numeric',month:'long'}).format(new Date());
  const periods=['Manhã','Tarde','Noite'].map((period,index)=>{
    const entries=visible.filter(mission=>{const hour=Number((missionBlocks(mission,agenda)[0]?.start||mission.time).slice(0,2));return index===0?hour<12:index===1?hour>=12&&hour<18:hour>=18;});
    return entries.length?`<section class="mission-period" aria-label="${period}"><div class="period-title">${icon(index===0?'sun':index===1?'leaf':'moon')}${period}</div>${entries.map(mission=>missionCard(mission,difficult)).join('')}</section>`:'';
  }).join('');
  return `<div class="today-page">${heading('Seu dia, sua jornada.',`<span class="today-date">${esc(date)}</span>`,`<button class="btn secondary" data-action="difficult" aria-pressed="${!!difficult}">${icon('leaf')}${difficult?'Dia difícil ativado':'Dia difícil'}</button>`)}${nextActionPanel()}<div class="stats today-stats"><div class="stat"><div><span class="stat-label">MISSÕES DE HOJE</span><strong>${done.length} <small>de ${missions.length} realizadas</small></strong></div></div><div class="stat"><div><span class="stat-label">XP LÍQUIDO DO DIA</span><strong>${earned>0?'+':''}${earned} <small>XP no dia</small></strong></div></div><div class="stat"><div><span class="stat-label">SEU PERSONAGEM</span><strong>Nível ${level.level} <small>· ${level.current}/${level.next} XP</small></strong></div></div></div>${E.addDays(state.created,7)<=currentDay?'<details class="review"><summary id="weekly-review-summary">Uma semana de caminho · revisar no seu ritmo</summary><p>Reserve dez minutos para conferir o que coube na vida real. Você pode manter ou ajustar as metas; elas não aumentam sozinhas.</p></details>':''}<div class="section-head today-missions-head"><h2>Suas missões</h2><span class="small muted">Horários ajudam a organizar; não criam dívida.</span></div>${difficult?'<div class="notice">Use o mínimo para continuar. Alimentação, água, higiene, passeios e interação do cachorro são preservados.</div>':''}${agenda.conflicts.length?`<div class="notice warning">Há ${agenda.conflicts.length} ${agenda.conflicts.length===1?'ajuste de horário':'ajustes de horário'} neste dia. <button class="link-btn" data-action="schedule">Conferir conflitos na agenda</button></div>`:''}${periods||'<div class="panel empty">Suas missões opcionais estão registradas. Um respiro também faz parte do caminho.</div>'}${completed.length?`<details class="completed-missions" ${completedExpanded?'open':''}><summary id="completed-missions-summary">${completed.length} ${completed.length===1?'missão opcional concluída':'missões opcionais concluídas'} <span>Rever ou corrigir</span></summary><div class="completed-list">${completed.map(mission=>missionCard(mission,difficult)).join('')}</div></details>`:''}<p class="gentle today-gentle">Descanso, alimentação e lazer básico continuam livres. Os cuidados essenciais permanecem visíveis.</p></div>`;
}
function missionCard(m,difficult){if(m.id==='python'&&state.version===2)return studyMissionCard(m,difficult);const r=state.records[currentDay+':'+m.id],sk=skill(m.skill),min=difficult&&!r;return `<article class="mission ${r?'done':''}" id="mission-${esc(m.id)}"><div class="mission-icon" style="--tint:${sk.color}22;--accent:${sk.color}">${icon(sk.icon)}</div><div class="mission-body"><h3>${esc(m.title)} ${r?'<span class="chip">'+(r.rank===1?'Mínima feita':'Concluída')+'</span>':''}</h3><p>${esc(min?m.minimum:m.action)}</p>${missionTiming(m)}<div class="mission-meta"><span>${icon('clock')} ${esc(missionTimeLabel(m))} · ${m.essential?missionBlocks(m).reduce((sum,block)=>sum+block.effortMinutes,0):(min?m.minMinutes:m.minutes)} min${missionBlocks(m).length>1?' no total':''}</span><span>·</span><span>${esc(sk.name)}</span>${m.secondary?'<span>+ '+esc(skill(m.secondary).name)+' (XP dividido)</span>':''}<span class="reward">+${min?m.minXp:m.xp} XP · ${min?m.minCoins:m.coins} moedas</span></div><div class="mission-actions">${!r||r.rank<2?`<button class="btn small ${r?'secondary':''}" data-action="complete" data-id="${esc(m.id)}" data-mode="${min?'minimum':'normal'}">${icon('check')}${r?'Completar normal (só a diferença)':min?'Fazer o essencial':'Concluir'}</button>`:''}${!r&&!m.essential?`<button class="btn ghost small" data-action="complete" data-id="${esc(m.id)}" data-mode="${min?'normal':'minimum'}">${min?'Versão normal':'Versão mínima'}</button>`:''}${m.id==='python'?'<button class="btn ghost small" data-action="lesson">Ver fase</button>':''}${!r?`<button class="btn ghost small" data-action="timer" data-id="${esc(m.id)}" aria-label="Cronômetro para ${esc(m.title)}">${icon('clock')}</button><button class="btn ghost small" data-action="reschedule" data-id="${esc(m.id)}" aria-label="Reagendar ${esc(m.title)}">${icon('calendar')}</button>`:`<button class="btn ghost small" data-action="undo" data-key="${currentDay+':'+esc(m.id)}">Corrigir</button>`}</div></div><button class="complete-check ${r?'checked':''}" data-action="${r?'undo':'complete'}" data-id="${esc(m.id)}" data-key="${currentDay+':'+esc(m.id)}" data-mode="${min?'minimum':'normal'}" aria-label="${r?'Desfazer':'Concluir'} ${esc(m.title)}">${r?icon('check'):''}</button></article>`;}
function skillsMini(){const xp=E.skillTotals(state);return skills.map(sk=>{const l=E.levelInfo(xp[sk.id],state.config.xpStep);return `<div class="skill-row"><div>${icon(sk.icon)} ${sk.name}<small>NÍV. ${l.level}</small></div><div class="progress"><span style="width:${l.current/l.next*100}%;background:${sk.color}"></span></div></div>`;}).join('');}
function characterView(){const study=pythonStats(),practiceDays=[...new Set([...Object.values(state.records).map(record=>record.day),...(state.version===2?E.studySessions(state).filter(session=>!session.corrected).map(session=>session.day):[])])];const t=E.totals(state),l=E.levelInfo(t.xp,state.config.xpStep),count=Object.keys(state.records).length+(state.version===2?E.studySessions(state).filter(session=>!session.corrected).length:0),weekDays=practiceDays.filter(day=>E.weekKey(day)===E.weekKey(currentDay)).length,days=practiceDays.sort(),returned=days.some((d,i)=>i&&E.addDays(days[i-1],1)<d);const achievements=[['Primeiro passo','Registre sua primeira missão.',count>0,'leaf'],['Uma semana possível','Pratique em três dias na mesma semana.',practiceDays.some(day=>practiceDays.filter(other=>E.weekKey(other)===E.weekKey(day)).length>=3),'calendar'],['Bem-vindo de volta','Retome depois de um intervalo.',returned,'redo'],['Primeiro programa','Conclua sua primeira fase de Python.',state.lessons.length>0,'code'],['Construtor de mundos','Conclua um projeto da trilha.',study.projects>0,'star']];return `${heading('Seu personagem','Os níveis representam prática registrada, não uma avaliação de domínio.')}<div class="panel profile"><div class="avatar-big" aria-label="Personagem explorador">🧙</div><div style="flex:1"><span class="eyebrow muted">EXPLORADOR DA VIDA REAL</span><h1 style="margin-top:8px">${esc(state.config.name)}</h1><p class="small muted">Nível ${l.level} · ${t.xp} XP acumulados · ${t.coins} moedas disponíveis</p><div class="progress"><span style="width:${l.current/l.next*100}%"></span></div><p class="small muted">${l.current}/${l.next} XP para o próximo nível</p></div></div><div class="settings-grid"><div class="panel"><h2>Suas cinco habilidades</h2>${skillsMini()}</div><div class="panel"><h2>Prática que fica</h2><div class="stats" style="grid-template-columns:1fr 1fr"><div><h1>${state.lessons.length}</h1><p class="small muted">fases concluídas</p></div><div><h1>${study.projects}</h1><p class="small muted">projetos concluídos</p></div></div><p class="small muted">${study.exercises} exercícios registrados · ${weekDays} dias de prática nesta semana.</p><p class="small muted" style="margin-top:12px">Nível = 1 + ⌊XP ÷ ${state.config.xpStep}⌋. Exemplo: ${state.config.xpStep+35} XP → nível 2, com 35/${state.config.xpStep} para o próximo. Gastar moedas nunca reduz XP.</p></div></div><h2 style="margin:24px 0 16px">Conquistas</h2><div class="cards">${achievements.map(([n,d,ok,i])=>`<div class="panel achievement ${ok?'':'locked'}"><div class="tile-icon gold">${icon(ok?i:'lock')}</div><div><h3>${n}</h3><p>${d}</p><span class="chip ${ok?'gold':''}" style="margin-top:8px">${ok?'Conquistada':'Ainda pela frente'}</span></div></div>`).join('')}</div><div class="notice">A consistência é semanal, sem sequência obrigatória. Faltar ou pausar preserva todo o progresso. Corrigir um registro pode ajustar uma conquista ligada a ele.</div>`;}
function pythonStudyPanel() {
  if(state.version!==2)return '';
  const progress=E.studyProgress(state,currentDay),stats=pythonStats(),python=state.config.missions.find(mission=>mission.id==='python'),blocks=missionBlocks(python,E.agendaFor(state,currentDay));
  const sessions=E.studySessions(state).slice().reverse(),projects=E.studyProjects(state);
  return `<section class="panel" aria-labelledby="python-progress-heading"><div class="section-head"><h2 id="python-progress-heading">Seu estudo hoje</h2><span id="python-minutes" class="chip">${progress.minutes}/${progress.goal} min registrados</span></div><div class="progress study-progress"><span style="width:${Math.min(100,progress.minutes/progress.goal*100)}%"></span></div><p class="small muted">${progress.earnedXp}/${progress.xp} XP · ${progress.earnedCoins}/${progress.coins} moedas do estudo. Sessões somam o esforço; o ganho tem limite diário.</p><p class="requirements">${blocks.length?'Blocos de hoje: '+blocks.map(block=>block.start+'–'+block.end).join(' e ')+'.':'Hoje não há bloco de Python na frequência atual.'} A pausa de dez minutos fica fora da prática. Meta e pontos são editáveis em Ajustes; o combinado do dia é preservado após a primeira sessão.</p>${progress.legacy?'<p class="requirements">O registro anterior deste dia não informa minutos. Seus pontos já contam no limite; não estimamos duração.</p>':''}<div class="study-toolbar"><button class="btn" data-action="session" data-id="python" data-mode="normal">${icon('check')} Registrar sessão</button><button class="btn secondary" data-action="session" data-id="python" data-mode="minimum">Versão mínima · ${progress.minMinutes} min</button><button class="btn ghost" data-action="timer" data-id="python">${icon('clock')} Cronômetro opcional</button></div><p class="small muted">${stats.exercises} exercícios registrados · ${stats.projects} projetos concluídos · ${stats.minutes} minutos com duração registrada. Marcar uma fase ou projeto não paga novos pontos.</p></section>
  <section class="panel" aria-labelledby="python-sessions-heading"><h2 id="python-sessions-heading">Sessões registradas</h2><div id="python-sessions">${sessions.length?sessions.map(session=>`<article class="study-entry ${session.corrected?'study-corrected':''}" data-study-session id="study-session-${esc(session.id)}"><div><strong>${esc(session.goal)}</strong><p class="small muted"><time datetime="${session.day}">${fmt(session.day)}</time> · ${session.minutes} min · ${session.exercises} exercícios${session.lessonId?' · fase '+session.lessonId:''}${session.projectId?' · '+esc(projects.find(project=>project.id===session.projectId)?.title||'Projeto'):''}</p>${session.corrected?`<p class="small muted">Corrigida em ${fmt(session.correctedDay)}; minutos e pontos recalculados. A fase foi preservada.</p>`:''}</div>${session.corrected?'<button class="btn ghost small" data-action="session" data-id="python">Registrar nova sessão</button>':`<button class="btn ghost small" data-action="undo-session" data-id="${esc(session.id)}" aria-label="Corrigir sessão ${esc(session.goal)}">Corrigir</button>`}</article>`).join(''):'<p class="requirements">Registre a prática realizada. Você pode continuar a mesma fase amanhã ou revisar depois do fim da trilha.</p>'}</div></section>
  <section class="panel" aria-labelledby="python-projects-heading"><div class="section-head"><h2 id="python-projects-heading">Projetos em seu ritmo</h2><button class="btn secondary small" data-action="create-project">Criar projeto</button></div><p class="small muted">Associe várias sessões ao mesmo projeto. Concluir ou reabrir o marco não altera o tempo estudado nem concede XP extra.</p><div id="python-projects">${projects.length?projects.map(project=>`<article class="study-entry" data-study-project id="study-project-${esc(project.id)}"><div><strong>${esc(project.title)}</strong><p class="small muted">${project.lessonId?'Relacionado à fase '+project.lessonId+' · ':''}${project.completed?'Concluído em '+fmt(project.completed):'Em prática'}${project.legacy?' · registro anterior':''}</p></div><button class="btn ghost small" data-action="${project.completed?'reopen-project':'complete-project'}" data-id="${esc(project.id)}">${project.completed?'Corrigir conclusão':'Concluir projeto'}</button></article>`).join(''):'<p class="requirements">Crie um projeto pequeno ou livre, inclusive depois da fase 120. O trabalho pode durar vários dias.</p>'}</div></section>`;
}
function pythonView() {
  const worlds=[...new Set(roadmap.map(lesson=>lesson.world))],next=roadmap[state.lessons.length],last=state.lessons.at(-1),ready=!last||last.day<currentDay;
  return `${heading('Uma trilha. Muitos mundos.','Registre a prática; avance quando cumprir o critério da fase.',`<button class="btn" data-action="session" data-id="python">Registrar sessão</button>`)}${pythonStudyPanel()}<div class="hero" style="min-height:190px"><div class="hero-copy"><div class="eyebrow">PYTHON · ${roadmap.length} FASES EM ${worlds.length} MUNDOS</div><h2>${esc(next?.title||'Você percorreu a trilha!')}</h2><p>${!next?'Sua prática continua: registre revisões e projetos livres.':ready?'Se precisar de mais tempo, continue esta fase em várias sessões.':'Seu marco de hoje está registrado. Revise ou continue o projeto; a próxima fase abre amanhã.'}</p><button class="btn secondary small" data-action="lesson" style="margin-top:15px">${!next?'Revisar a última fase':ready?'Abrir fase atual':'Revisar a última fase'} ${icon('arrow')}</button></div>${landscape()}</div><div class="notice" style="margin-top:20px">${state.lessons.length}/${roadmap.length} fases concluídas · Prática, fase e projeto têm registros separados. A fase avança pelo critério, sem novo pagamento e sem depender do cronômetro. No máximo uma nova fase por dia.</div><div class="tabs">${worlds.map((name,index)=>`<button data-world="${index}" class="${world===index?'active':''}">${index+1}. ${esc(name)}</button>`).join('')}</div><div class="journey-world"><div class="world-title"><h2>${esc(worlds[world])}</h2><span class="small muted">Pratique. Revise. Retome.</span></div>${roadmap.filter(lesson=>lesson.world===worlds[world]).map(lesson=>{const done=state.lessons.some(item=>item.id===lesson.id),current=lesson.id===next?.id;return `<button class="phase ${done?'done':current?'current':'locked'}" data-lesson="${lesson.id}" ${!done&&!current?'disabled':''}><span class="phase-num">${done?icon('check'):lesson.id}</span><span><strong>${esc(lesson.title)}</strong><small>${esc(lesson.action)}</small></span><span class="chip">${done?'Concluída':current?(ready?'Sua próxima fase':'Amanhã'):icon('lock')}</span></button>`;}).join('')}</div><p class="small muted">A trilha não substitui documentação e projetos reais. Níveis representam prática registrada, sem promessa de domínio em 120 dias.</p>`;
}
function rewardAvailability(reward,day=currentDay) {
  return E.rewardOptions(state,reward.id,day,day===currentDay?E.minutes(E.timeNow()):0);
}
function rewardAvailabilityText(options) {
  const first=options.slots?.[0];
  if(options.allowed&&first)return `Cabe hoje: ${first.start}–${first.end}.`;
  return options.reason||'Não há um horário disponível para este extra hoje.';
}
function shopView() {
  const windows=E.availableRewardWindows(state,currentDay,E.minutes(E.timeNow()));
  return `${heading('Lojinha de dopamina','Extras que cabem no seu combinado, com preço e horário claros.')}<div class="notice">Descanso, refeições e lazer básico não custam moedas. As recompensas são extras: moedas não criam horas e o aplicativo não bloqueia outros apps.</div><div class="cards">${state.config.rewards.map(reward=>{
    const options=rewardAvailability(reward);
    return `<article class="panel reward-card" data-reward-id="${esc(reward.id)}"><div class="tile-icon gold">${icon(reward.icon||'star')}</div><h3>${esc(reward.title)}</h3><p>${esc(reward.description)}</p><div class="price-row"><strong class="balance">${coin} ${reward.price}</strong><span class="small muted">${reward.minutes} min · 1/${reward.limit==='week'?'semana':'dia'}</span></div><p class="reward-availability ${options.allowed?'availability-ready':''}" data-reward-availability data-id="${esc(reward.id)}" data-needed-coins="${options.neededCoins}">${esc(rewardAvailabilityText(options))}</p><button class="btn secondary" data-action="buy" data-id="${esc(reward.id)}">${options.allowed?'Reservar recompensa':'Ver condições'} ${icon('arrow')}</button></article>`;
  }).join('')}</div><h2 style="margin:25px 0 16px">Seus resgates</h2><p class="requirements">${windows.length?'Janelas livres restantes: '+windows.map(window=>window.join('–')).join(' e ')+'.':'Não há janelas extras livres restantes hoje.'} Cancelar uma compra ainda não usada devolve as moedas uma vez.</p>${state.purchases.length?state.purchases.slice().reverse().map(purchase=>`<div class="panel inline" style="flex-wrap:wrap"><div class="tile-icon gold">${icon('shop')}</div><div style="flex:1;min-width:160px"><h3 style="margin:0">${esc(purchase.title)}</h3><p class="small muted">${fmt(purchase.day)} · ${purchase.start}–${purchase.end} · ${purchase.price} moedas · ${purchase.status==='reserved'?'Reservada':purchase.status==='used'?'Utilizada':'Cancelada'}</p></div>${purchase.status==='reserved'?`<button class="btn small" data-action="use" data-id="${esc(purchase.id)}">Marcar utilizada</button><button class="btn ghost small" data-action="cancel" data-id="${esc(purchase.id)}">Cancelar</button>`:''}</div>`).join(''):'<div class="panel empty">'+icon('shop')+'<p>Seu primeiro extra pode começar pequeno.</p></div>'}`;
}
function studyMilestones() {
  if(state.version!==2)return '';
  const actions=state.study.actions.filter(action=>!['session','session-undo'].includes(action.type)).slice().reverse(),projects=E.studyProjects(state);
  if(!actions.length)return '';
  const label=action=>{
    if(action.type==='phase'||action.type==='phase-undo')return `${action.type==='phase'?'Fase concluída':'Conclusão de fase corrigida'}: ${action.lessonId} · ${roadmap.find(lesson=>lesson.id===action.lessonId)?.title||'Python'}`;
    const title=action.title||projects.find(project=>project.id===action.projectId)?.title||'Projeto de Python';
    return `${action.type==='project-create'?'Projeto criado':action.type==='project-finish'?'Projeto concluído':'Projeto reaberto'}: ${title}`;
  };
  return `<div class="panel"><h2>Marcos do estudo</h2><p class="requirements">Fases e projetos são marcos sem novo pagamento. As sessões e seus pontos aparecem no diário.</p>${actions.map(action=>`<div class="history-row"><div class="tile-icon">${icon(['phase-undo','project-reopen'].includes(action.type)?'redo':'code')}</div><div class="text"><strong>${esc(label(action))}</strong><small><time datetime="${action.day}">${fmt(action.day)}</time> · marco sem XP ou moedas</small></div></div>`).join('')}</div>`;
}
function historyEventRow(event,fullDate,signed) {
  const action=state.version===2&&event.studyAction?state.study.actions.find(item=>item.id===event.studyAction):null;
  const correction=event.type==='undo'||action?.type==='session-undo';
  const session=action?.type==='session'?E.studySessions(state).find(item=>item.id===action.id):null;
  const label=correction?'Correção registrada':event.type==='refund'?'Moedas devolvidas':event.type==='purchase'?'Resgate registrado':action?'Sessão de estudo registrada':'Prática registrada';
  return `<div class="history-row"><div class="tile-icon ${event.coins<0?'gold':''}">${icon(event.type==='purchase'?'shop':correction?'redo':'check')}</div><div class="text"><strong>${esc(event.title)}</strong><small><time datetime="${event.day}">${fullDate(event.day)}</time> · ${label}${correction&&event.originalDay!==event.day?` · atividade de <time datetime="${event.originalDay}">${fullDate(event.originalDay)}</time>`:''}</small></div><div class="amount ${event.xp>=0&&event.coins>=0?'positive':''}">${event.xp?`${signed(event.xp)} XP<br>`:''}${signed(event.coins)} moedas</div>${event.key&&state.records[event.key]&&event.type!=='undo'?`<button class="btn ghost small" data-action="undo" data-key="${esc(event.key)}" aria-label="Corrigir ${esc(event.title)}">${icon('redo')}</button>`:session&&!session.corrected?`<button class="btn ghost small" data-action="undo-session" data-id="${esc(session.id)}" aria-label="Corrigir sessão ${esc(session.goal)}">${icon('redo')}</button>`:''}</div>`;
}
function historyView() {
  const week=E.weekKey(currentDay),days=Array.from({length:7},(_,i)=>E.addDays(week,i));
  const xp=days.map(day=>E.dailyXp(state,day)),maximum=Math.max(1,...xp.map(Math.abs));
  const fullDate=day=>new Intl.DateTimeFormat('pt-BR',{timeZone:E.TIMEZONE,day:'2-digit',month:'2-digit',year:'numeric'}).format(new Date(day+'T12:00:00Z'));
  const signed=value=>(value>0?'+':'')+value;
  const description=days.map((day,i)=>`${fullDate(day)}: ${signed(xp[i])} XP`).join('; ');
  return `${heading('Tudo o que você construiu','Seu progresso permanece, mesmo quando um dia pede uma pausa.')}
    <div class="panel"><div class="section-head"><h2>Esta semana</h2><span class="small muted">${fmt(week)} – ${fmt(E.addDays(week,6))} · XP líquido por lançamento</span></div>
    <p class="small muted">Correções entram no dia em que são feitas. Um valor negativo representa correção, sem penalidade por faltar; os lançamentos anteriores permanecem no histórico.</p>
    <div class="week-chart" role="img" aria-label="${esc('XP líquido por data de lançamento. '+description)}">${days.map((day,i)=>`
      <div class="week-col" data-day="${day}" data-xp="${xp[i]}"><span class="week-value">${signed(xp[i])} XP</span>
        <div class="week-plot"><div class="week-credit"><div class="week-bar" style="height:${Math.max(0,xp[i])/maximum*45}px"></div></div><div class="week-debit"><div class="week-bar week-negative" style="height:${Math.max(0,-xp[i])/maximum*45}px"></div></div></div>
        <span>${['SEG','TER','QUA','QUI','SEX','SÁB','DOM'][i]}</span>
      </div>`).join('')}</div></div>
    <div class="panel"><h2>Diário da jornada</h2>${state.events.length?state.events.slice().reverse().map(event=>historyEventRow(event,fullDate,signed)).join(''):'<div class="empty">'+icon('leaf')+'<p>Sua história começa com a primeira missão.</p></div>'}</div>${studyMilestones()}`;
}
function settingsView(){return `${heading('A jornada é sua','Ajuste o combinado à vida real. Nenhuma meta aumenta automaticamente.')}<div class="settings-grid"><form class="panel" id="profile-form"><h2>Seu combinado</h2><label for="name">Nome do personagem</label><input id="name" name="name" value="${esc(state.config.name)}" maxlength="40" required><label for="xpStep">XP por nível (personagem e habilidades)</label><input id="xpStep" name="xpStep" type="number" min="10" max="10000" value="${state.config.xpStep}" required><label><input name="sounds" type="checkbox" ${state.config.sounds?'checked':''}> Som discreto ao concluir (opcional)</label><p class="requirements">Pontuações editadas valem para próximos registros. Conclusões anteriores preservam seu valor.</p><button class="btn" type="submit">Salvar preferências</button><button class="btn secondary" type="button" data-action="pause" style="margin-top:10px">${icon(state.config.paused?'play':'pause')}${state.config.paused?'Retomar jornada':'Pausar jornada'}</button></form><div class="panel"><h2>Seu progresso, com você</h2><p class="small muted" style="margin-top:13px">Os dados ficam somente neste navegador e aparelho. Limpar os dados do navegador remove o progresso. Não há sincronização ou conta.</p><div class="form-actions" style="justify-content:flex-start"><button class="btn" data-action="export">${icon('download')} Exportar backup</button><button class="btn secondary" data-action="import">Restaurar backup</button>${storageError?'<button class="btn secondary" data-action="export-raw">Exportar arquivo original</button>':''}</div><input id="import-file" type="file" accept="application/json,.json" hidden>${recoveryControls()}<p class="requirements">A restauração valida o backup e preserva uma cópia anterior antes de substituir os dados locais. Guarde um backup antes de trocar de aparelho. Use o mesmo endereço ao reabrir. Backups do formato novo precisam desta versão do aplicativo; backups anteriores continuam aceitos e podem ativar as sessões pela prévia.</p><button class="link-btn" data-action="schedule">Ver agenda</button><p class="requirements">Fuso fixo: America/Sao_Paulo. As missões renovam por data e frequência; dias perdidos não geram dívida.</p></div></div><div class="panel"><div class="section-head"><h2>Missões e horários</h2><span class="small muted">Frequência, versões e recompensas editáveis</span></div><div class="table-wrap"><table><thead><tr><th>Missão</th><th>Horário</th><th>Normal / mínima</th><th></th></tr></thead><tbody>${state.config.missions.map(m=>`<tr><td>${esc(m.title)}</td><td>${m.time}</td><td>${m.xp} / ${m.minXp} XP · ${m.coins} / ${m.minCoins} moedas</td><td><button class="link-btn" data-action="edit-mission" data-id="${esc(m.id)}">Editar</button></td></tr>`).join('')}</tbody></table></div></div><div class="panel"><h2>Preços e limites da loja</h2><div class="table-wrap"><table><thead><tr><th>Recompensa</th><th>Preço</th><th>Duração</th><th></th></tr></thead><tbody>${state.config.rewards.map(r=>`<tr><td>${esc(r.title)}</td><td>${r.price} moedas</td><td>${r.minutes} min</td><td><button class="link-btn" data-action="edit-reward" data-id="${esc(r.id)}">Editar</button></td></tr>`).join('')}</tbody></table></div></div><details class="panel"><summary>Identidade e referências</summary><p class="small muted" style="margin-top:12px">Entre Trilhas tem identidade própria: um refúgio de fantasia natural, sem competição ou punições. Inspirações solicitadas: <a href="https://wiki.lifeupapp.fun/" target="_blank" rel="noopener">LifeUp</a>, <a href="https://habitica.com/" target="_blank" rel="noopener">Habitica</a> e <a href="https://finchcare.com/about-finch" target="_blank" rel="noopener">Finch</a>. A consulta às páginas oficiais foi bloqueada pela rede durante o desenvolvimento; suas funcionalidades não foram verificadas. XP, loja, missões e abordagem acolhedora aqui são propostas implementadas para este projeto.</p><p class="small"><a href="PLANO.md" target="_blank">Ler o planejamento completo</a> · <a href="README.md" target="_blank">Instruções de uso</a></p></details>`;}
function openModal(title,body) {
  if(!modal.open)modalOpener=focusSnapshot(lastInteraction?.isConnected?lastInteraction:document.activeElement);
  modal.setAttribute('aria-labelledby','modal-title');
  modal.innerHTML=`<div class="modal-head"><h2 id="modal-title" tabindex="-1">${title}</h2><button data-close aria-label="Fechar">×</button></div>${body}`;
  if(!modal.open)modal.showModal();
  modal.querySelector('#modal-title').focus({preventScroll:true});
}
function closeModal() {
  if(!modal.open)return;
  modal.close();
  restoreFocus(modalOpener);
}
function migrationModal() {
  if(state.version===2){toast('As sessões independentes já estão ativas.');return;}
  if(storageError)throw Error('Restaure um backup válido antes de ativar as sessões.');
  const raw=P.readStoredRaw(localStorage);
  if(raw===null&&knownRaw!==null)throw Error('O progresso mudou em outra aba. Exporte sua cópia antes de continuar.');
  const source=raw??E.serializeState(state),before=E.parseState(source);
  const migrated=E.migrateStudyState(before);
  E.serializeState(migrated);
  pendingMigration={source,expectedRaw:raw};
  openModal('Ativar sessões independentes',`<p>Seu progresso tem <strong>${Object.keys(before.records).length} registros</strong>, ${before.lessons.length} fases, ${E.totals(before).xp} XP e ${E.totals(before).coins} moedas. Esses valores serão preservados.</p><div class="notice"><p>O formato novo separa prática, fases e projetos. Registros anteriores não informam duração: nenhum minuto será inventado. Pontos já recebidos continuam contando no limite do dia.</p></div><p class="requirements">Antes de gravar, uma cópia do formato anterior será preservada em Ajustes. Ela substituirá o slot de cópia anterior, se houver. Backups novos precisam desta versão do aplicativo; exporte o arquivo atual se quiser guardá-lo fora do navegador.</p><div class="form-actions"><button class="btn secondary" data-action="export">Exportar backup atual</button><button class="btn secondary" data-close>Cancelar</button><button class="btn" data-action="confirm-migrate-study">Ativar e preservar cópia anterior</button></div>`);
}
function sessionModal(mode='normal',suggestedMinutes=null) {
  if(state.version!==2){migrationModal();return;}
  const progress=E.studyProgress(state,currentDay),next=roadmap[state.lessons.length],projects=E.studyProjects(state).filter(project=>project.completed===null);
  const duration=Math.min(1440,Number.isInteger(suggestedMinutes)&&suggestedMinutes>0?suggestedMinutes:mode==='minimum'?progress.minMinutes:progress.minutes>=progress.goal?60:Math.max(1,progress.goal-progress.minutes));
  const defaultKind=mode==='minimum'?'review':next?'phase':'review';
  const requestId=createId(),available=roadmap.filter(lesson=>lesson.id<=(next?.id||roadmap.length));
  const goal=mode==='minimum'?'Revisar um exercício por alguns minutos':next?'Praticar fase '+next.id+': '+next.title:'Revisar Python ou continuar um projeto livre';
  openModal('Registrar sessão de Python',`<form id="session-form" data-request="${requestId}" novalidate><p class="small muted">Registre somente o tempo de prática realizado, sem pausas. Você pode fazer várias sessões e terminar a fase em outro dia.</p><p id="session-form-errors" data-form-error role="alert"></p><div class="field-row"><div><label for="session-minutes">Minutos estudados nesta sessão</label><input id="session-minutes" name="minutes" type="number" min="1" max="1440" step="1" value="${duration}" required></div><div><label for="session-exercises">Exercícios resolvidos nesta sessão</label><input id="session-exercises" name="exercises" type="number" min="0" max="1000" step="1" value="0" required></div></div><label for="session-goal">O que você praticou?</label><input id="session-goal" name="goal" value="${esc(goal)}" maxlength="500" required><label for="session-kind">Tipo de prática</label><select id="session-kind" name="kind"><option value="phase" ${defaultKind==='phase'?'selected':''}>Prática de fase</option><option value="review" ${defaultKind==='review'?'selected':''}>Revisão livre</option><option value="project">Projeto</option></select><div class="field-row"><div><label for="session-lesson">Fase relacionada (opcional na revisão)</label><select id="session-lesson" name="lessonId"><option value="">Sem fase</option>${available.map(lesson=>`<option value="${lesson.id}" ${next?.id===lesson.id?'selected':''}>${lesson.id}. ${esc(lesson.title)}</option>`).join('')}</select></div><div><label for="session-project">Projeto relacionado</label><select id="session-project" name="projectId"><option value="">Sem projeto</option>${projects.map(project=>`<option value="${esc(project.id)}">${esc(project.title)}${project.completed?' (concluído)':''}</option>`).join('')}</select></div></div><p class="requirements">Escolha Projeto e um projeto existente para associar a prática. Você pode criar um em Trilha Python antes do registro. Exercícios já registrados em outra sessão não devem ser contados novamente.</p><div class="notice">Hoje: ${progress.minutes}/${progress.goal} min · ${progress.earnedXp}/${progress.xp} XP · ${progress.earnedCoins}/${progress.coins} moedas do estudo. A recompensa acompanha a soma diária até o limite; marcar uma fase ou projeto não paga de novo.</div><p class="requirements">${progress.minMinutes} min são a versão mínima. Ela mantém a prática, sem equivaler à meta de ${progress.goal} min. A pausa de dez minutos fica fora da contagem.</p><div class="form-actions"><button class="btn secondary" type="button" data-close>Cancelar</button><button class="btn" type="submit">Salvar sessão</button></div></form>`);
}
function projectModal() {
  if(state.version!==2){migrationModal();return;}
  const next=roadmap[state.lessons.length],requestId=createId();
  openModal('Criar projeto de Python',`<form id="project-form" data-request="${requestId}" novalidate><p class="small muted">Um projeto pode reunir várias sessões e continuar por vários dias, inclusive depois da fase 120.</p><p id="project-form-errors" data-form-error role="alert"></p><label for="project-title">Nome do projeto</label><input id="project-title" name="title" required maxlength="100" placeholder="Ex.: meu diário de pontos"><label for="project-lesson">Fase relacionada (opcional)</label><select id="project-lesson" name="lessonId"><option value="">Projeto livre</option>${roadmap.filter(lesson=>lesson.id<=(next?.id||roadmap.length)).map(lesson=>`<option value="${lesson.id}">${lesson.id}. ${esc(lesson.title)}</option>`).join('')}</select><p class="requirements">Criar ou concluir um projeto não gera recompensa extra. O XP vem do tempo de prática registrado nas sessões.</p><div class="form-actions"><button class="btn secondary" type="button" data-close>Cancelar</button><button class="btn" type="submit">Criar projeto</button></div></form>`);
}
function lessonCode(code,label,attribute='') {
  return `<pre tabindex="0" role="region" aria-label="${esc(label)}" ${attribute}><code>${esc(code)}</code></pre>`;
}
function lessonCase(example,label='Exemplo') {
  return `<div class="lesson-case"><h4>${esc(label)} · entrada</h4>${example.stdin?lessonCode(example.stdin,`${label}: entrada`,'data-stdin'):'<p class="small muted">Sem entrada pelo teclado.</p>'}<h4>${esc(label)} · saída esperada</h4>${example.stdout?lessonCode(example.stdout,`${label}: saída esperada`,'data-stdout'):'<p class="small muted">Nenhum texto é exibido antes do resultado.</p>'}${example.error?`<p class="notice warning" data-expected-error><strong>Erro esperado nesta investigação:</strong> ${esc(example.error)}. Confira o nome e a linha indicados na mensagem; este caso demonstra um limite do programa.</p>`:''}<p class="small muted">A saída inclui as perguntas exibidas por input, quando houver. O texto digitado não faz parte da saída do programa.</p></div>`;
}
function lessonHints(exercise,index=0) {
  if(index>=exercise.hints.length)return '';
  const prefix=`exercise-${exercise.id}-hint-${index+1}`;
  return `<details class="lesson-hint" data-hint="${index+1}"><summary id="${esc(prefix)}-summary">Dica ${index+1}${index?' · mais uma ajuda':''}</summary><p>${esc(exercise.hints[index])}</p>${lessonHints(exercise,index+1)}</details>`;
}
function lessonExercise(exercise,index) {
  const prefix=`exercise-${exercise.id}`;
  return `<details class="lesson-exercise" id="lesson-${esc(prefix)}" data-exercise-id="${esc(exercise.id)}"><summary id="${esc(prefix)}-summary">${index+1}. ${esc(exercise.title)}</summary><div class="lesson-exercise-body"><p>${esc(exercise.prompt)}</p>${exercise.cases?.length?`<details class="lesson-check"><summary id="${esc(prefix)}-cases-summary">Entradas e resultados para conferir</summary>${exercise.cases.map((item,i)=>lessonCase(item,`Teste ${i+1}`)).join('')}</details>`:''}${lessonHints(exercise)}<details class="lesson-solution" data-solution><summary id="${esc(prefix)}-solution-summary">Consultar solução comentada</summary><p class="small muted">Compare com sua tentativa e explique cada linha. Consultar a solução não registra um exercício nem concede pontos.</p>${lessonCode(exercise.solution,`Solução comentada: ${exercise.title}`,'data-solution-code')}</details></div></details>`;
}
function deepLessonContent(lesson,content) {
  const id=lesson.id,basic=content.exercises.filter(exercise=>exercise.kind==='basic'),extra=content.exercises.filter(exercise=>exercise.kind==='extra');
  const list=items=>`<ul>${items.map(item=>`<li>${esc(item)}</li>`).join('')}</ul>`;
  return `<article class="lesson-content" data-content-phase="${id}" aria-label="Conteúdo da fase ${id}"><p class="lesson-objective"><strong>Seu objetivo:</strong> ${esc(content.objective)}</p><div class="lesson-prerequisites"><h3>Antes de começar</h3>${list(content.prerequisites)}</div><p class="small muted">Uma fase pode ocupar vários dias. Abra uma parte por vez e continue de onde parou nas suas anotações.</p>${content.preparation?.length?`<details class="lesson-section" id="lesson-${id}-preparation"><summary id="lesson-${id}-preparation-summary">Preparar o ambiente</summary><div class="lesson-section-body">${list(content.preparation)}<p class="requirements">Preparação não é exercício de programação resolvido. Registre apenas as soluções que você realmente praticou.</p></div></details>`:''}<details class="lesson-section" id="lesson-${id}-review"><summary id="lesson-${id}-review-summary">Revisão curta · relembre antes de seguir</summary><div class="lesson-section-body">${list(content.review)}</div></details><details class="lesson-section" id="lesson-${id}-explanation"><summary id="lesson-${id}-explanation-summary">Entenda e execute · explicação e exemplo</summary><div class="lesson-section-body">${content.explanation.map(paragraph=>`<p>${esc(paragraph)}</p>`).join('')}<h3>Exemplo completo</h3><p class="small muted">Copie o programa para seu arquivo de estudo, salve e execute no Python do seu computador.</p>${lessonCode(content.example.code,`Código do exemplo da fase ${id}`,'data-example-code')}${lessonCase(content.example)}</div></details><details class="lesson-section" id="lesson-${id}-basic"><summary id="lesson-${id}-basic-summary">Prática básica · ${basic.length} exercícios</summary><div class="lesson-section-body"><p class="small muted">Tente antes de abrir as dicas. Confira o resultado no seu editor e conte cada exercício uma única vez no autorregistro da sessão.</p>${basic.map(lessonExercise).join('')}</div></details><details class="lesson-section" id="lesson-${id}-extra"><summary id="lesson-${id}-extra-summary">Se quiser praticar mais · ${extra.length} extras opcionais</summary><div class="lesson-section-body"><p class="small muted">Escolha os desafios que ajudarem você. Os extras não são obrigatórios para concluir a fase e não ampliam a meta de estudo.</p>${extra.map(lessonExercise).join('')}</div></details><details class="lesson-section" id="lesson-${id}-mistakes"><summary id="lesson-${id}-mistakes-summary">Algo deu errado? · como investigar</summary><div class="lesson-section-body"><dl>${content.mistakes.map(item=>`<dt>${esc(item.symptom)}</dt><dd>${esc(item.investigate)}</dd>`).join('')}</dl></div></details>${content.sources?.length?`<details class="lesson-section" id="lesson-${id}-sources"><summary id="lesson-${id}-sources-summary">Consultar fontes oficiais</summary><div class="lesson-section-body"><ul>${content.sources.map(source=>`<li><a href="${esc(source)}" target="_blank" rel="noopener noreferrer">${esc(source)}</a></li>`).join('')}</ul><p class="small muted">Links externos precisam de internet. As fontes e os limites da consulta estão no relatório desta entrega.</p></div></details>`:''}<div class="notice lesson-criterion"><strong>Como saber se concluiu:</strong> ${esc(content.criterion)}</div><p class="requirements">Proposta de prática: dois blocos de 60 minutos, com dez minutos de pausa fora da contagem; sua meta permanece editável. Em um dia difícil, a mínima é uma alternativa de retomada. Ler, abrir dicas, consultar soluções e marcar uma fase não pagam XP ou moedas adicionais.</p></article>`;
}
function lessonModal(id) {
  const last=state.lessons.at(-1),next=roadmap[state.lessons.length],lesson=roadmap.find(item=>item.id===Number(id))||((last?.day===currentDay)?roadmap.find(item=>item.id===last.id):next)||roadmap.at(-1);
  const done=state.lessons.some(item=>item.id===lesson.id),available=lesson.id===next?.id&&(!last||last.day<currentDay),requestId=state.version===2?createId():'';
  const content=pythonContent[lesson.id];
  openModal(`Fase ${lesson.id} · ${esc(lesson.title)}`,`<span class="chip">${esc(lesson.world)}</span>${content?deepLessonContent(lesson,content):`<p style="margin-top:16px">${esc(lesson.tip)}</p>${lesson.code?`<pre><code>${esc(lesson.code)}</code></pre>`:''}<h3 style="margin:20px 0 10px">Sua missão</h3><p>${esc(lesson.action)}</p><div class="notice" style="margin-top:14px"><strong>Como saber se concluiu:</strong> ${esc(lesson.criterion)}</div><h3>Prática para ir além</h3><ol>${(lesson.practice||[]).map(practice=>`<li>${esc(practice)}</li>`).join('')}</ol><p class="small muted">Confira o resultado no seu editor Python. O aplicativo não executa ou corrige seu código automaticamente. Registre minutos e exercícios somente nas sessões, sem repeti-los ao marcar este marco.</p>`}${state.version===2?`${available?'<label><input id="criterion-check" type="checkbox"> Executei o desafio e conferi o critério desta fase, mesmo que a prática tenha ocupado vários dias.</label>':''}<p class="requirements">Concluir a fase não declara uma nova sessão de duas horas e não concede XP ou moedas. Você pode continuar registrando prática após concluir a trilha.</p><div class="form-actions"><button class="btn secondary" data-action="session" data-id="python">Registrar sessão</button><button class="btn secondary" data-action="timer" data-id="python">${icon('clock')} Cronômetro</button>${available?`<button class="btn" data-action="finish-lesson" data-lesson-id="${lesson.id}" data-request="${requestId}">Concluir fase</button>`:done?`<span class="small muted">Fase registrada; revise à vontade.</span><button class="btn ghost" data-action="undo-phase" data-id="${lesson.id}">Corrigir conclusão da fase</button>`:'<span class="small muted">A próxima fase abre em outro dia, sem cobrança por faltas.</span>'}</div>`:'<div class="form-actions"><button class="btn" data-action="migrate-study">Ativar sessões independentes</button></div>'}`);
}
function scheduleFields(form) {
  return ['time','weekendTime','minutes',...(form.dataset.id==='weekend-walk'?['secondTime']:[])];
}
function showSchedulePreview(form,values) {
  const target=form.querySelector('#schedule-preview');if(!target)return null;
  try {
    const preview=E.schedulePreview(state,form.dataset.id,values,currentDay);
    target.innerHTML=`<h3>Próximos sete dias</h3><p class="small ${preview.conflicts.length?'preview-warning':'muted'}">${preview.conflicts.length?`${preview.conflicts.length} ${preview.conflicts.length===1?'sobreposição ou ajuste':'sobreposições ou ajustes'} neste cenário. Novos conflitos precisam ser resolvidos antes de salvar; conflitos já existentes permanecem sinalizados.`:'Sem sobreposições detectadas neste cenário.'}</p><div class="table-wrap"><table><caption>Preferências propostas · sem gravar alterações</caption><thead><tr><th scope="col">Dia</th><th scope="col">Horários da missão</th></tr></thead><tbody>${preview.days.map(entry=>`<tr data-preview-day="${entry.day}"><td>${esc(fmt(entry.day))}</td><td>${entry.agenda.blocks.filter(block=>block.kind==='mission'&&block.missionId===form.dataset.id).map(block=>`${block.start}–${block.end}`).join(' / ')||'Sem ocorrência na frequência escolhida'}</td></tr>`).join('')}</tbody></table></div>${preview.conflicts.length?`<ul class="preview-conflicts">${preview.conflicts.map(conflict=>`<li>${conflict.day?esc(fmt(conflict.day))+': ':''}${esc(conflictMessage(conflict))}</li>`).join('')}</ul>`:''}`;
    target.dataset.stale='false';
    return preview;
  }catch(error){target.innerHTML='<p class="preview-warning">A prévia não pôde ser calculada. Confira os horários e a frequência antes de salvar.</p>';formError(form,error.message,scheduleFields(form));return null;}
}
function missionEditor(id) {
  const mission=state.config.missions.find(item=>item.id===id);
  const option=(item,selected)=>`<option value="${item.id}" ${item.id===selected?'selected':''}>${item.name}</option>`;
  openModal('Editar missão',`<form id="mission-form" data-id="${esc(id)}" novalidate>
    <p id="mission-errors" class="form-error" data-form-error role="alert"></p>
    <label for="mission-title">Título</label><input id="mission-title" name="title" value="${esc(mission.title)}" required maxlength="100">
    <label for="mission-action">Ação normal</label><textarea id="mission-action" name="action" required>${esc(mission.action)}</textarea>
    <label for="mission-minimum">Versão mínima</label><textarea id="mission-minimum" name="minimum" required>${esc(mission.minimum)}</textarea>
    <label for="mission-criterion">Condição de conclusão</label><textarea id="mission-criterion" name="criterion" required>${esc(mission.criterion)}</textarea>
    <div class="field-row"><label for="mission-time">Horário seg–sex<input id="mission-time" type="time" name="time" min="05:30" max="22:30" value="${mission.time}" required></label>
      <label for="mission-weekend-time">Horário sáb/dom<input id="mission-weekend-time" type="time" name="weekendTime" min="05:30" max="22:30" value="${E.defaultWeekendTime(mission)}" required></label></div>
    ${id==='weekend-walk'?`<label for="mission-second-time">Segundo passeio<input id="mission-second-time" type="time" name="secondTime" min="05:30" max="22:30" value="${mission.secondTime||'17:00'}" required></label><p class="requirements">Os minutos representam o total dos dois passeios. Cada trecho continua visível na agenda; concluir a missão confirma os dois cuidados combinados.</p>`:''}
    ${id==='python'?'<p class="requirements">O horário inicia o primeiro bloco. A agenda divide os minutos normais em dois blocos, com dez minutos de pausa fora da prática. O orçamento de estudo já iniciado no dia permanece preservado; alterações passam a valer nos dias seguintes.</p>':''}
    <div class="field-row"><label for="mission-skill">Habilidade principal<select id="mission-skill" name="skill" aria-describedby="mission-skills-help">${skills.map(item=>option(item,mission.skill)).join('')}</select></label>
      <label for="mission-secondary">Habilidade secundária<select id="mission-secondary" name="secondary" aria-describedby="mission-skills-help"><option value="">Nenhuma</option>${skills.map(item=>option(item,mission.secondary)).join('')}</select></label></div>
    <p id="mission-skills-help" class="requirements">Escolha habilidades diferentes. Quando houver duas, o XP total é dividido entre elas, sem duplicar a recompensa.</p>
    <fieldset class="frequency-fields"><legend>Frequência</legend><div class="check-days">${['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map((day,index)=>`<label><input type="checkbox" name="days" value="${index}" ${mission.days.includes(index)?'checked':''}>${day}</label>`).join('')}</div></fieldset>
    <div class="field-row">${[['minutes','Minutos normal'],['minMinutes','Minutos mínima'],['xp','XP normal'],['minXp','XP mínima'],['coins','Moedas normal'],['minCoins','Moedas mínima']].map(([key,name])=>`<label for="mission-${key}">${name}<input id="mission-${key}" name="${key}" type="number" min="${key==='minutes'||key==='minMinutes'?1:0}" max="10000" value="${mission[key]}" required></label>`).join('')}</div>
    ${mission.essential?'<div class="notice warning" style="margin-top:12px">Preserve alimentação, água, higiene, passeios e interação. Ajustar horários não reduz os cuidados necessários; combine ajuda real quando precisar.</div>':''}
    <p class="requirements">Hoje, Agenda e Loja usam o mesmo planejamento. Reagendamentos pontuais prevalecem. Salvar verifica os próximos sete dias e recusa novos conflitos com refeições, trabalho, transições, cuidados e descanso.</p>
    <button type="button" class="btn secondary" data-action="preview-schedule">Atualizar prévia da semana</button><div id="schedule-preview" class="schedule-preview" aria-live="polite"></div>
    <div class="form-actions"><button type="button" class="btn secondary" data-close>Cancelar</button><button class="btn" type="submit">Salvar missão</button></div></form>`);
  const form=modal.querySelector('#mission-form');updateSkillChoices(form);showSchedulePreview(form,mission);
}
function rewardEditor(id){const r=state.config.rewards.find(r=>r.id===id);openModal('Editar recompensa',`<form id="reward-form" data-id="${esc(id)}"><label>Nome<input name="title" value="${esc(r.title)}" required maxlength="100"></label><label>Descrição<textarea name="description" required>${esc(r.description)}</textarea></label><div class="field-row"><label>Preço em moedas<input type="number" name="price" value="${r.price}" min="0" max="100000" required></label><label>Duração (minutos)<input type="number" name="minutes" value="${r.minutes}" min="1" max="120" required></label></div><label>Limite de resgate<select name="limit"><option value="day" ${r.limit==='day'?'selected':''}>Uma vez por dia</option><option value="week" ${r.limit==='week'?'selected':''}>Uma vez por semana</option></select></label><label><input name="weekend" type="checkbox" ${r.weekend?'checked':''}> Apenas no fim de semana</label><p class="requirements">O preço é virtual. O aplicativo registra seu combinado; não bloqueia jogos, vídeos ou outros apps. Recompensas precisam caber em uma janela livre.</p><div class="form-actions"><button type="button" class="btn secondary" data-close>Cancelar</button><button class="btn" type="submit">Salvar recompensa</button></div></form>`);}
function buyModal(id) {
  const reward=state.config.rewards.find(item=>item.id===id),requestId=createId(),options=rewardAvailability(reward),first=options.slots?.[0];
  openModal('Reserve seu extra',`<h3>${esc(reward.title)}</h3><p class="small muted" style="margin:10px 0">${reward.price} moedas · ${reward.minutes} minutos · limite 1/${reward.limit==='week'?'semana':'dia'}</p><div class="notice" id="buy-availability">${esc(rewardAvailabilityText(options))} A reserva precisa terminar dentro da janela e respeitar seus compromissos.</div><form id="buy-form" data-id="${esc(id)}" data-request="${requestId}" novalidate><p data-form-error role="alert"></p><label for="reward-start">Horário de início hoje</label><input type="time" id="reward-start" name="start" value="${esc(first?.start||'')}" required aria-describedby="buy-availability"><p class="requirements">As moedas são descontadas uma única vez. Você pode cancelar antes de utilizar para receber o valor de volta.</p><div class="form-actions"><button type="button" class="btn secondary" data-close>Voltar</button><button class="btn" type="submit" ${options.allowed?'':'disabled'}>${coin} Reservar por ${reward.price}</button></div></form>`);
}
function nextRestDay(from=currentDay) {
  for(let offset=0;offset<7;offset++){const day=E.addDays(from,offset);if([0,6].includes(E.weekday(day)))return day;}
  return from;
}
function agendaDateLabel(day) {
  return new Intl.DateTimeFormat('pt-BR',{timeZone:E.TIMEZONE,weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date(day+'T12:00:00Z'));
}
function conflictMessage(conflict) {
  return typeof conflict==='string'?conflict:conflict.message||conflict.reason||'Há horários sobrepostos. Confira os blocos deste dia.';
}
function agendaContent(day) {
  const agenda=E.agendaFor(state,day),windows=E.availableRewardWindows(state,day,day===currentDay?E.minutes(E.timeNow()):0),kinds={mission:'Missão',fixed:'Rotina reservada',break:'Pausa',free:'Tempo livre',reward:'Extra reservado'};
  return `<p class="small muted agenda-date-label" aria-live="polite">${esc(agendaDateLabel(day))}</p>${day<currentDay?'<div class="notice">Preferências atuais: esta visualização calcula a agenda com o combinado de agora. O histórico dos registros não foi reescrito.</div>':'<p class="requirements">Planejamento atual: os horários das missões e os compromissos da rotina vêm da mesma agenda.</p>'}<div id="agenda-conflicts" ${agenda.conflicts.length?'class="notice warning"':'class="requirements"'}>${agenda.conflicts.length?`<strong>${agenda.conflicts.length} ${agenda.conflicts.length===1?'ajuste de horário':'ajustes de horário'}</strong><ul>${agenda.conflicts.map(conflict=>`<li>${esc(conflictMessage(conflict))}</li>`).join('')}</ul>`:'Sem sobreposições detectadas nos blocos desta agenda.'}</div><div class="table-wrap"><table id="agenda-table"><caption>${esc(agendaDateLabel(day))} · preferências atuais</caption><thead><tr><th scope="col">Horário</th><th scope="col">Atividade</th><th scope="col">Duração</th></tr></thead><tbody>${agenda.blocks.map(block=>`<tr data-block-id="${esc(block.id)}" data-mission-id="${esc(block.missionId||'')}" data-kind="${esc(block.kind)}"><td>${esc(block.start)}–${esc(block.end)}</td><td><strong>${esc(block.title)}</strong><span class="agenda-block-kind">${esc(kinds[block.kind]||'Atividade')}${block.parts>1?' · parte '+block.part+' de '+block.parts:''}</span></td><td>${block.kind==='mission'?block.effortMinutes:Number.isFinite(block.endMinute)&&Number.isFinite(block.startMinute)?Math.max(0,block.endMinute-block.startMinute):Math.max(0,E.minutes(block.end)-E.minutes(block.start))} min</td></tr>`).join('')}</tbody></table></div><p class="requirements">${windows.length?'Janelas livres para extras: '+windows.map(window=>window.join('–')).join(' e ')+'.':'Sem janela extra livre neste dia.'} A disponibilidade de cada recompensa considera também moedas, duração e limite de resgate.</p><p class="requirements">Alimentação, higiene, descanso, lazer básico e cuidados essenciais continuam reservados. Edite as missões em Ajustes; nenhum bloco muda sozinho por uma pendência.</p>`;
}
function updateAgendaDay(day) {
  const form=document.querySelector('#agenda-form');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(day||'')||Number.isNaN(Date.parse(day+'T12:00:00Z'))||new Date(day+'T12:00:00Z').toISOString().slice(0,10)!==day){if(form)formError(form,'Escolha uma data válida.',['day']);return;}
  selectedAgendaDay=day;
  if(form){clearFormError(form);form.elements.day.value=day;for(const button of form.querySelectorAll('[data-agenda-shift]'))button.dataset.day=E.addDays(day,Number(button.dataset.agendaShift));}
  const content=document.querySelector('#agenda-content');if(content)content.innerHTML=agendaContent(day);
}
function scheduleModal(day=currentDay) {
  selectedAgendaDay=day;
  openModal('Sua agenda',`<form id="agenda-form" novalidate><p data-form-error role="alert"></p><label for="agenda-day">Dia da agenda</label><div class="agenda-date-controls"><button class="btn secondary" type="button" data-action="agenda-day" data-agenda-shift="-1" data-day="${E.addDays(day,-1)}" aria-label="Dia anterior">←</button><input id="agenda-day" name="day" type="date" value="${day}" required><button class="btn secondary" type="button" data-action="agenda-day" data-agenda-shift="1" data-day="${E.addDays(day,1)}" aria-label="Próximo dia">→</button><button class="btn" type="submit">Ver dia</button></div><div class="agenda-shortcuts"><button class="link-btn" type="button" data-action="agenda-day" data-day="${currentDay}">Hoje</button><button class="link-btn" type="button" data-action="agenda-day" data-day="${E.addDays(currentDay,1)}">Amanhã</button><button class="link-btn" type="button" data-action="agenda-day" data-day="${nextRestDay()}">Próxima folga</button></div></form><div id="agenda-content">${agendaContent(day)}</div>`);
}
function sound(){if(!state.config.sounds)return;try{const ctx=new AudioContext(),o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(ctx.destination);o.frequency.value=660;g.gain.setValueAtTime(.035,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.18);o.start();o.stop(ctx.currentTime+.18);o.onended=()=>ctx.close();}catch{}}
async function finish(id,mode){if(id==='python'){sessionModal(mode);return;}if(await transact(s=>E.complete(s,id,currentDay,mode,roadmap))){toast(mode==='minimum'?'O mínimo também conta. Progresso salvo.':'Mais um passo registrado. Progresso salvo.');sound();}}
function timerStart(id) {
  const mission=state.config.missions.find(item=>item.id===id);
  if(!mission)return;
  const seconds=(state.difficult[currentDay]?mission.minMinutes:mission.minutes)*60;
  timer={title:mission.title,remaining:seconds,ends:Date.now()+seconds*1000,running:true,opener:focusSnapshot(lastInteraction?.isConnected?lastInteraction:document.activeElement)};
  renderTimer();
}
function renderTimer() {
  let element=document.querySelector('.timer');
  if(!timer){element?.remove();return;}
  const remaining=timer.running?Math.max(0,Math.ceil((timer.ends-Date.now())/1000)):timer.remaining;
  if(remaining===0&&timer.running) {
    timer.running=false;timer.remaining=0;
    toast('Tempo concluído. Confira a tarefa antes de marcá-la.');sound();
  }
  if(!element) {
    element=document.createElement('div');
    element.className='timer';
    element.setAttribute('role','group');
    element.innerHTML=`${icon('clock')}<div><span class="small" data-timer-title></span><br><strong data-timer-time role="timer" aria-live="off"></strong></div><button data-action="timer-pause"></button><button data-action="timer-close" aria-label="Fechar cronômetro">×</button>`;
    document.body.append(element);
  }
  element.setAttribute('aria-label','Cronômetro: '+timer.title);
  element.querySelector('[data-timer-title]').textContent=timer.title;
  element.querySelector('[data-timer-time]').textContent=String(Math.floor(remaining/60)).padStart(2,'0')+':'+String(remaining%60).padStart(2,'0');
  const pause=element.querySelector('[data-action="timer-pause"]');
  pause.setAttribute('aria-label',timer.running?'Pausar cronômetro':'Continuar cronômetro');
  if(pause.dataset.running!==String(timer.running)) {
    pause.dataset.running=String(timer.running);
    pause.innerHTML=icon(timer.running?'pause':'play');
  }
}
document.addEventListener('click',async ev=>{const b=ev.target.closest('button');if(!b)return;lastInteraction=b;if(b.matches('[data-close]')){closeModal();return;}if(b.dataset.nav){page=b.dataset.nav;render({headingFocus:true});window.scrollTo(0,0);return;}if(b.dataset.world!==undefined){world=Number(b.dataset.world);render();return;}if(b.dataset.lesson){try{lessonModal(b.dataset.lesson);}catch(error){toast(error.message,true);}return;}const a=b.dataset.action,id=b.dataset.id;if(!a)return;try{switch(a){
case 'next-action':if(id==='python')sessionModal(b.dataset.mode||'normal',Number(b.dataset.minutes)||null);else if(id){const mission=document.querySelector('#mission-'+id);mission?.scrollIntoView({behavior:'smooth',block:'center'});mission?.querySelector('[data-mode="'+(b.dataset.mode||'normal')+'"]')?.focus({preventScroll:true});}else scheduleModal(currentDay);break;
case 'complete':try{await finish(id,b.dataset.mode||'normal');}catch(error){toast(error.message,true);}break;
case 'session':try{sessionModal(b.dataset.mode||'normal');}catch(error){toast(error.message,true);}break;
case 'create-project':try{projectModal();}catch(error){toast(error.message,true);}break;
case 'migrate-study':try{migrationModal();}catch(error){toast(error.message,true);}break;
case 'confirm-migrate-study':{
  b.disabled=true;
  try {
    if(!pendingMigration)throw Error('Abra a prévia de ativação novamente.');
    const pending=pendingMigration;
    await withStorageLock(()=>{
      const next=E.migrateStudyState(E.parseState(pending.source));
      state=P.restoreBackup(localStorage,E.serializeState(next),pending.expectedRaw);
      knownRaw=P.readStoredRaw(localStorage);storageError=false;hasValidMemory=true;
    });
    pendingMigration=null;refreshRecovery();closeModal();render();
    toast('Sessões independentes ativadas. A cópia anterior está disponível em Ajustes.');
  } catch(error){refreshRecovery();b.disabled=false;toast(error.message,true);}
  break;
}
case 'finish-lesson':{
  const check=document.querySelector('#criterion-check'),lessonId=Number(b.dataset.lessonId);
  if(!check?.checked){toast('Confira o critério e marque a confirmação antes de avançar.',true);check?.focus();break;}
  b.disabled=true;
  const changed=await transact(s=>E.completePhase(s,lessonId,currentDay,b.dataset.request));
  if(changed){closeModal();toast('Fase registrada. Sua prática permanece separada, sem novo pagamento.');sound();}else b.disabled=false;
  break;
}
case 'undo-session':{
  const session=E.studySessions(state).find(item=>item.id===id);if(!session||session.corrected)break;
  const requestId=createId();
  openModal('Corrigir sessão de Python',`<p>Corrigir <strong>${esc(session.goal)}</strong> remove ${session.minutes} minutos e ${session.exercises} exercícios dessa sessão. Os pontos do dia serão recalculados, mantendo o histórico.</p><p class="requirements">A fase e o projeto não serão apagados. Se faltarem moedas para retirar um ganho já gasto, cancele antes os resgates ainda não utilizados.</p><div class="form-actions"><button class="btn secondary" data-close>Voltar</button><button class="btn danger" data-action="confirm-undo-session" data-id="${esc(id)}" data-request="${requestId}">Corrigir sessão</button></div>`);
  break;
}
case 'confirm-undo-session':{
  b.disabled=true;const changed=await transact(s=>E.undoStudySession(s,id,currentDay,b.dataset.request));
  if(changed){closeModal();toast('Sessão corrigida; minutos e pontos atualizados. A fase foi preservada.');}else b.disabled=false;
  break;
}
case 'undo-phase':{
  const requestId=createId();
  openModal('Corrigir conclusão de fase',`<p>Corrigir a fase ${Number(id)} preserva suas sessões, exercícios, projetos e pontos. As fases posteriores dependem dela: corrija primeiro a mais recente.</p><div class="form-actions"><button class="btn secondary" data-close>Voltar</button><button class="btn danger" data-action="confirm-undo-phase" data-id="${Number(id)}" data-request="${requestId}">Corrigir fase</button></div>`);
  break;
}
case 'confirm-undo-phase':{
  b.disabled=true;const changed=await transact(s=>E.undoPhase(s,Number(id),currentDay,b.dataset.request));
  if(changed){closeModal();toast('Marco da fase corrigido. A prática e os pontos foram preservados.');}else b.disabled=false;
  break;
}
case 'complete-project':case 'reopen-project':{
  const project=E.studyProjects(state).find(item=>item.id===id);if(!project)break;
  const reopen=a==='reopen-project',requestId=createId();
  openModal(reopen?'Corrigir conclusão de projeto':'Concluir projeto de Python',`<p>${reopen?'Reabrir':'Marcar como concluído'} <strong>${esc(project.title)}</strong>?</p><p class="requirements">Confira o resultado no seu editor antes de concluir. Esse marco não concede pontos extras. Reabrir preserva as sessões, os exercícios e o histórico.</p><div class="form-actions"><button class="btn secondary" data-close>Voltar</button><button class="btn" data-action="${reopen?'confirm-reopen-project':'confirm-complete-project'}" data-id="${esc(id)}" data-request="${requestId}">${reopen?'Reabrir projeto':'Concluir projeto'}</button></div>`);
  break;
}
case 'confirm-complete-project':case 'confirm-reopen-project':{
  b.disabled=true;const changed=await transact(s=>a==='confirm-complete-project'?E.completeStudyProject(s,id,currentDay,b.dataset.request):E.reopenStudyProject(s,id,currentDay,b.dataset.request));
  if(changed){closeModal();toast(a==='confirm-complete-project'?'Projeto concluído, sem novo pagamento.':'Projeto reaberto; prática preservada.');}else b.disabled=false;
  break;
}
case 'difficult':await transact(s=>{s.difficult[currentDay]=!s.difficult[currentDay];});break;
case 'undo':openModal('Corrigir registro',`<p>Desfazer remove o XP e as moedas dessa missão, preservando a correção no histórico. Se as moedas já foram gastas, cancele resgates não usados ou reponha o saldo antes.</p>${state.version===2&&b.dataset.key?.endsWith(':python')?'<p class="requirements">Este é um registro do formato anterior. As fases serão preservadas; se houver sessões novas ativas no mesmo dia, corrija essas sessões primeiro.</p>':''}<div class="form-actions"><button class="btn secondary" data-close>Voltar</button><button class="btn danger" data-action="confirm-undo" data-key="${esc(b.dataset.key)}">Desfazer missão</button></div>`);break;
case 'confirm-undo':if(await transact(s=>E.undo(s,b.dataset.key,currentDay))){closeModal();toast('Registro corrigido; saldos atualizados.');}break;
case 'lesson':try{lessonModal();}catch(error){toast(error.message,true);}break;
case 'focus':document.querySelector('#mission-'+id)?.scrollIntoView({behavior:'smooth',block:'center'});break;
case 'timer':timerStart(id);break;
case 'timer-pause':if(timer){if(timer.running)timer.remaining=Math.max(0,Math.ceil((timer.ends-Date.now())/1000));else timer.ends=Date.now()+timer.remaining*1000;timer.running=!timer.running;renderTimer();}break;
case 'timer-close':{const opener=timer?.opener;timer=null;renderTimer();restoreFocus(opener);break;}
case 'buy':try{buyModal(id);}catch(error){toast(error.message,true);}break;
case 'cancel':if(await transact(s=>E.cancel(s,id,currentDay)))toast('Reserva cancelada. Moedas devolvidas.');break;
case 'use':if(await transact(s=>E.usePurchase(s,id)))toast('Recompensa marcada como utilizada. Aproveite seu tempo.');break;
case 'pause':await transact(s=>{s.config.paused=!s.config.paused;});break;
case 'schedule':scheduleModal(currentDay);break;
case 'agenda-day':updateAgendaDay(b.dataset.day);break;
case 'preview-schedule':{const form=b.closest('form'),values=missionUpdate(form,new FormData(form));if(values)showSchedulePreview(form,values);break;}
case 'edit-mission':missionEditor(id);break;
case 'edit-reward':rewardEditor(id);break;
case 'reschedule':{const m=state.config.missions.find(m=>m.id===id);openModal(m.essential?'Ajustar cuidado essencial':'Reagendar sem cobrança',`<form id="reschedule-form" data-id="${esc(id)}" novalidate><p class="small muted">${m.essential?'Os cuidados essenciais continuam hoje. Ajuste o horário e combine ajuda, sem adiar as necessidades do cachorro.':'Mover a missão não gera XP, moedas ou punição. A versão mínima continua sendo uma opção.'}</p>${m.essential?'':`<label>Nova data<input type="date" name="day" min="${currentDay}" value="${E.addDays(currentDay,1)}" required></label>`}<label>${m.id==='python'||m.id==='weekend-walk'?'Início do primeiro bloco':'Horário'}<input type="time" name="time" min="05:30" max="22:30" value="${m.time}" required></label>${m.id==='python'?'<p class="requirements">Os dois blocos de estudo e a pausa de dez minutos acompanham esse início. A duração líquida permanece a combinada.</p>':m.id==='weekend-walk'?'<p class="requirements">O segundo passeio permanece no horário salvo em Ajustes. Preserve os dois cuidados do dia.</p>':''}<p data-form-error role="alert"></p><div class="form-actions"><button class="btn secondary" data-close type="button">Voltar</button><button class="btn" type="submit">Salvar horário</button></div></form>`);break;}
case 'export':{
  try {
    if(storageError&&hasValidMemory) {
      downloadBackup(E.serializeState(state),'entre-trilhas-memoria-'+currentDay+'.json');
      toast('Cópia válida da memória exportada. Guarde antes de recarregar.');
    } else {
      const raw=P.readStoredRaw(localStorage)??E.serializeState(state);
      if(hasValidMemory)E.parseState(raw);
      downloadBackup(raw,'entre-trilhas-'+currentDay+'.json');
      toast(storageError?'Arquivo original exportado para análise; não é um backup validado.':'Backup exportado. Guarde em um lugar seguro.');
    }
  } catch(error) {
    if(hasValidMemory) {
      try {
        downloadBackup(E.serializeState(state),'entre-trilhas-memoria-'+currentDay+'.json');
        toast('Cópia válida da memória exportada. O arquivo local não pôde ser lido; guarde antes de recarregar.');
      } catch(exportError) {toast(exportError.message,true);}
    } else toast(error.message,true);
  }
  break;
}
case 'export-raw':{
  try {
    const raw=P.readStoredRaw(localStorage);
    if(raw===null)throw Error('Não há arquivo original salvo neste navegador.');
    downloadBackup(raw,'entre-trilhas-arquivo-original-'+currentDay+'.json');
    toast('Arquivo original exportado sem alterações para análise.');
  } catch(error) {toast(error.message,true);}
  break;
}
case 'export-recovery-file':{
  try {
    const raw=localStorage.getItem(P.RECOVERY_KEY);
    if(raw===null)throw Error('Não há arquivo de recuperação disponível.');
    downloadBackup(raw,'entre-trilhas-recuperacao-para-analise-'+currentDay+'.json');
    toast('Arquivo de recuperação exportado para análise; não é um backup de importação direta.');
  } catch(error) {toast(error.message,true);}
  break;
}
case 'export-recovery':{
  try {
    const copy=P.readRecovery(localStorage);
    if(!copy||copy.raw===null) throw Error('A cópia anterior não tinha progresso salvo.');
    downloadBackup(copy.raw,'entre-trilhas-copia-anterior-'+currentDay+'.json');
    toast('Cópia anterior exportada sem alterações.');
  } catch(error) { toast(error.message,true); }
  break;
}
case 'import':document.querySelector('#import-file').click();break;
case 'confirm-import':{
  b.disabled=true;
  try {
    if(!pendingImport) throw Error('Selecione o backup novamente para conferir a prévia.');
    const pending=pendingImport;
    await withStorageLock(()=>{
      state=P.restoreBackup(localStorage,pending.raw,pending.expectedRaw);
      knownRaw=P.readStoredRaw(localStorage);
      storageError=false;
      hasValidMemory=true;
    });
    pendingImport=null;
    timer=null;
    refreshRecovery();
    closeModal();
    render();
    toast('Backup restaurado com sucesso. A cópia anterior foi preservada.');
  } catch(error) {
    refreshRecovery();
    render();
    b.disabled=false;
    toast(error.message,true);
  }
  break;
}
case 'recover':{
  try {
    await withStorageLock(()=>{
      const copy=P.readRecovery(localStorage);
      if(!copy) throw Error('Não há cópia anterior disponível.');
      const target=copy.raw===null?E.createState():E.parseState(copy.raw);
      pendingRecovery={expectedRaw:P.readStoredRaw(localStorage),expectedRecoveryRaw:localStorage.getItem(P.RECOVERY_KEY)};
      openModal('Recuperar cópia anterior',`<p>A cópia anterior contém <strong>${Object.keys(target.records).length} registros</strong>, ${E.totals(target).xp} XP e ${E.totals(target).coins} moedas. ${copy.raw===null?'Ela não tinha progresso salvo.':''}</p><p class="small muted" style="margin-top:12px">O progresso atual será preservado no lugar da cópia anterior, permitindo desfazer esta recuperação. Dados de outra aba serão conferidos novamente antes da troca.</p><div class="form-actions"><button class="btn secondary" data-close>Cancelar</button><button class="btn" data-action="confirm-recover">Confirmar recuperação</button></div>`);
    });
  } catch(error) { toast(error.message+' Você pode exportar a cópia anterior para análise.',true); }
  break;
}
case 'confirm-recover':{
  b.disabled=true;
  try {
    if(!pendingRecovery) throw Error('Abra a recuperação novamente.');
    const pending=pendingRecovery;
    await withStorageLock(()=>{
      state=P.recoverBackup(localStorage,pending.expectedRaw,pending.expectedRecoveryRaw);
      knownRaw=P.readStoredRaw(localStorage);
      storageError=false;
      hasValidMemory=true;
    });
    pendingRecovery=null;
    timer=null;
    refreshRecovery();
    closeModal();
    render();
    toast('Cópia anterior recuperada. O progresso substituído continua disponível.');
  } catch(error) {
    refreshRecovery();
    render();
    b.disabled=false;
    toast(error.message,true);
  }
  break;
}
}}catch(error){toast(error.message||'Não foi possível abrir esta ação.',true);}});
function sessionValues(form,fields) {
  clearFormError(form);
  const reject=(message,names)=>{formError(form,message,names);return null;};
  const minutes=Number(fields.get('minutes')),exercises=Number(fields.get('exercises')),goal=String(fields.get('goal')||'').trim(),kind=fields.get('kind');
  if(fields.get('minutes')===''||!Number.isInteger(minutes)||minutes<1||minutes>1440)return reject('Informe de 1 a 1440 minutos inteiros de prática, sem incluir pausas.',['minutes']);
  if(E.studyProgress(state,currentDay).minutes+minutes>1440)return reject('A soma das sessões do dia não pode ultrapassar 1440 minutos. Confira os registros anteriores.',['minutes']);
  if(fields.get('exercises')===''||!Number.isInteger(exercises)||exercises<0||exercises>1000)return reject('Informe de 0 a 1000 exercícios resolvidos nesta sessão, sem repetir os anteriores.',['exercises']);
  if(!goal||goal.length>500)return reject('Descreva o que praticou em até 500 caracteres.',['goal']);
  if(!['phase','review','project'].includes(kind))return reject('Escolha um tipo de prática válido.',['kind']);
  const lessonId=fields.get('lessonId')?Number(fields.get('lessonId')):null;
  if(lessonId!==null&&(!Number.isInteger(lessonId)||!roadmap.some(lesson=>lesson.id===lessonId)||lessonId>state.lessons.length+1))return reject('Escolha uma fase concluída ou a fase atual.',['lessonId']);
  if(kind==='phase'&&lessonId===null)return reject('Escolha a fase que você praticou ou use Revisão livre.',['lessonId','kind']);
  const projectId=kind==='project'?String(fields.get('projectId')||''):null;
  if(kind==='project'&&!E.studyProjects(state).some(project=>project.id===projectId&&project.completed===null))return reject('Escolha um projeto existente. Você pode criar um em Trilha Python.',['projectId']);
  return {minutes,exercises,goal,kind,lessonId,projectId,requestId:form.dataset.request};
}
document.addEventListener('submit',async ev=>{ev.preventDefault();const form=ev.target,fd=new FormData(form),id=form.dataset.id;try{if(form.id==='agenda-form'){updateAgendaDay(fd.get('day'));return;}if(form.id==='profile-form'){const ok=await transact(s=>{s.config.name=fd.get('name').trim()||'Viajante';s.config.xpStep=Number(fd.get('xpStep'));s.config.sounds=fd.has('sounds');});if(ok)toast('Preferências salvas.');}
if(form.id==='session-form'){
  const values=sessionValues(form,fd);if(!values)return;
  const button=form.querySelector('[type=submit]');button.disabled=true;
  const changed=await transact(s=>E.recordStudySession(s,currentDay,values));
  if(changed){closeModal();toast('Sessão registrada. O estudo e os pontos do dia foram atualizados.');sound();}else{button.disabled=false;formError(form,document.querySelector('#toast').textContent||'A sessão não foi gravada. Confira o progresso antes de tentar novamente.');}
}
if(form.id==='project-form'){
  clearFormError(form);const title=String(fd.get('title')||'').trim(),lessonId=fd.get('lessonId')?Number(fd.get('lessonId')):null;
  if(!title||title.length>100){formError(form,'Informe um nome de até 100 caracteres para o projeto.',['title']);return;}
  if(lessonId!==null&&(!Number.isInteger(lessonId)||!roadmap.some(lesson=>lesson.id===lessonId)||lessonId>state.lessons.length+1)){formError(form,'Escolha a fase atual ou uma fase concluída.',['lessonId']);return;}
  const button=form.querySelector('[type=submit]');button.disabled=true;
  const changed=await transact(s=>E.createStudyProject(s,title,lessonId,currentDay,form.dataset.request));
  if(changed){closeModal();toast('Projeto criado. Associe as próximas sessões a ele.');}else{button.disabled=false;formError(form,document.querySelector('#toast').textContent||'O projeto não foi gravado.');}
}
if(form.id==='mission-form'){const values=missionUpdate(form,fd);if(!values)return;showSchedulePreview(form,values);const ok=await transact(s=>{const before=structuredClone(s),mission=s.config.missions.find(item=>item.id===id);Object.assign(mission,values);if(!values.secondary)delete mission.secondary;try{E.checkScheduleChange(before,s,currentDay,7);}catch(error){formError(form,error.message,scheduleFields(form));throw error;}});if(ok){closeModal();toast('Missão e agenda atualizadas. Os registros anteriores foram preservados.');}}
if(form.id==='reward-form'){const ok=await transact(s=>{const r=s.config.rewards.find(r=>r.id===id);for(const key of ['title','description','limit'])r[key]=fd.get(key);r.price=Number(fd.get('price'));r.minutes=Number(fd.get('minutes'));r.weekend=fd.has('weekend');});if(ok){closeModal();toast('Recompensa atualizada.');}}
if(form.id==='buy-form'){clearFormError(form);if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(fd.get('start')||'')){formError(form,'Escolha um horário de início válido.',['start']);return;}form.querySelector('[type=submit]').disabled=true;const ok=await transact(s=>{if(s.purchases.some(purchase=>purchase.requestId===form.dataset.request))return false;const reward=s.config.rewards.find(item=>item.id===id);if(!reward)throw Error('A recompensa mudou. Feche a reserva e confira a loja novamente.');const now=E.minutes(E.timeNow()),start=E.minutes(fd.get('start')),end=start+reward.minutes,windows=E.availableRewardWindows(s,currentDay,now);if(!windows.some(([from,to])=>start>=E.minutes(from)&&end<=E.minutes(to))){const error=Error('A recompensa precisa caber inteira em uma janela livre da agenda, sem sobrepor missões, passeios ou descanso. Escolha outro horário.');formError(form,error.message,['start']);throw error;}return E.buy(s,id,currentDay,fd.get('start'),form.dataset.request,now);});if(ok){closeModal();toast('Reserva salva e moedas descontadas uma única vez.');}else{form.querySelector('[type=submit]').disabled=!rewardAvailability(state.config.rewards.find(item=>item.id===id)).allowed;formError(form,document.querySelector('#toast').textContent||'A reserva não foi gravada. Confira o saldo e a janela disponível.',['start']);}}
if(form.id==='reschedule-form'){clearFormError(form);const time=fd.get('time');if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(time||'')||time<'05:30'||time>'22:30'){formError(form,'Escolha um horário entre 05:30 e 22:30.',['time']);return;}const ok=await transact(s=>{const before=structuredClone(s),mission=s.config.missions.find(item=>item.id===id);try{if(mission.essential){s.overrides[currentDay+':'+id]={...s.overrides[currentDay+':'+id],time};E.checkScheduleChange(before,s,currentDay,7);}else{E.reschedule(s,id,currentDay,fd.get('day'),time);for(const day of new Set([currentDay,fd.get('day')]))E.checkScheduleChange(before,s,day,1);}}catch(error){formError(form,error.message,['time',...(mission.essential?[]:['day'])]);throw error;}});if(ok){closeModal();toast('Horário e agenda atualizados, sem punições.');}}}catch(e){toast(e.message,true);}});
document.addEventListener('change',async ev=>{
  const form=ev.target.closest('form');
  if(form?.id==='mission-form'){clearFormError(form);if(ev.target.name==='skill'||ev.target.name==='secondary')updateSkillChoices(form);const preview=form.querySelector('#schedule-preview');if(preview){preview.dataset.stale='true';preview.innerHTML='<p class="requirements">Os valores mudaram. Atualize a prévia para conferir os próximos sete dias; salvar também verifica conflitos.</p>';}}
  if(form&&['session-form','project-form','reschedule-form','buy-form'].includes(form.id))clearFormError(form);
  if(form?.id==='agenda-form'&&ev.target.name==='day'){updateAgendaDay(ev.target.value);return;}
  if(ev.target.id!=='import-file')return;
  const input=ev.target,file=input.files[0];
  if(!file)return;
  pendingImport=null;
  try {
    if(file.size>15*1024*1024)throw Error('O backup deve ter menos de 15 MB.');
    const raw=await file.text();
    const parsed=E.parseState(raw);
    E.serializeState(parsed);
    pendingImport={raw,expectedRaw:P.readStoredRaw(localStorage)};
    openModal('Restaurar seu progresso',`<p>Este backup contém <strong>${Object.keys(parsed.records).length} registros</strong>, ${E.totals(parsed).xp} XP e ${E.totals(parsed).coins} moedas. A restauração substitui o progresso deste navegador.</p><p class="small muted" style="margin-top:12px">Antes da substituição, o progresso atual será preservado em uma cópia recuperável neste navegador. Ela substituirá a cópia anterior, se houver. Exporte também um arquivo para guardar fora do navegador.</p><div class="form-actions"><button class="btn secondary" data-close>Cancelar</button><button class="btn" data-action="confirm-import">Substituir e restaurar</button></div>`);
  } catch(error) { toast(error.message,true); }
  input.value='';
});
window.addEventListener('storage',ev=>{
  if(ev.key===P.RECOVERY_KEY) {refreshRecovery();return;}
  if(ev.key!==KEY&&ev.key!==null)return;
  try {
    const raw=P.readStoredRaw(localStorage);
    if(raw===null) throw Error('O progresso salvo foi removido em outra aba.');
    state=E.parseState(raw);
    knownRaw=raw;
    storageError=false;
    hasValidMemory=true;
    refreshRecovery();
    render();
  } catch(error) {
    storageError=true;
    refreshRecovery();
    render();
    toast(error.message+' Exporte sua cópia em memória ou restaure um backup válido.',true);
  }
});
document.addEventListener('toggle',event=>{if(event.target.matches?.('.completed-missions'))completedExpanded=event.target.open;},true);
setInterval(()=>{const now=E.dayKey();if(now!==currentDay){currentDay=now;todayAgenda=null;closeModal();render();toast('Um novo dia começa. O progresso anterior está no histórico.');}const minute=E.timeNow();if(minute!==lastActionMinute){lastActionMinute=minute;if(page==='today'&&!modal.open)refreshNextAction();}renderTimer();},1000);
render();

modal.addEventListener('keydown',event=>{
  if(event.key!=='Tab'||!modal.open||event.altKey||event.ctrlKey||event.metaKey)return;
  const controls=Array.from(modal.querySelectorAll('button,input,select,textarea,a[href],summary,[tabindex]'))
    .filter(element=>element.tabIndex>=0&&!element.matches(':disabled')&&!element.hidden&&element.getClientRects().length&&getComputedStyle(element).visibility!=='hidden');
  const first=controls[0],last=controls.at(-1),active=document.activeElement;
  if(!first){event.preventDefault();modal.focus();return;}
  if(event.shiftKey&&(active===first||!controls.includes(active))){event.preventDefault();last.focus();}
  else if(!event.shiftKey&&(active===last||!controls.includes(active))){event.preventDefault();first.focus();}
});
modal.addEventListener('close',()=>{if(modal.open)return;restoreFocus(modalOpener);modalOpener=null;pendingImport=null;pendingRecovery=null;pendingMigration=null;});
