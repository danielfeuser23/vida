// One pure schedule model for Hoje, the agenda and reward availability.
// Times here are local wall clocks for the already resolved São Paulo day.
const WAKE=330,SLEEP=1350;
const minute=value=>Number(value.slice(0,2))*60+Number(value.slice(3));
const clock=value=>{
  const wrapped=((value%1440)+1440)%1440;
  return String(Math.floor(wrapped/60)).padStart(2,'0')+':'+String(wrapped%60).padStart(2,'0');
};
const isWeekend=day=>[0,6].includes(new Date(day+'T12:00:00Z').getUTCDay());
const workFixed=[
  ['morning-hygiene','05:30','05:45','Acordar e higiene','hygiene'],
  ['breakfast','06:00','06:25','Café da manhã e preparar refeição','meal'],
  ['prepare-leaving','06:45','07:05','Banho, roupa, bolsa e preparar saída','transition'],
  ['departure-margin','07:15','07:20','Margem para sair','transition'],
  ['arrival-margin','07:50','08:00','Chegada e transição para o trabalho','transition'],
  ['work-morning','08:00','12:00','Trabalho','work'],
  ['lunch','12:00','13:00','Almoço e descanso no intervalo','meal'],
  ['work-afternoon','13:00','17:00','Trabalho','work'],
  ['arrival-rest','17:30','17:50','Chegada, água, lanche e descanso','rest'],
  ['prepare-study','17:50','18:00','Preparar o estudo e organizar materiais','transition'],
  ['dinner','20:10','20:50','Preparar jantar e comer','meal'],
  ['basic-leisure','21:00','21:30','Lazer básico e convivência','leisure'],
  ['evening-hygiene','21:50','22:00','Higiene e preparar amanhã','hygiene'],
  ['wind-down','22:00','22:30','Desacelerar para dormir às 22:30','wind-down']
];
const offFixed=[
  ['morning-hygiene','05:30','05:45','Acordar e higiene','hygiene'],
  ['breakfast','06:00','06:30','Café da manhã','meal'],
  ['prepare-walk-am','07:15','07:20','Preparar o passeio da manhã','transition'],
  ['lunch','11:30','13:00','Preparar almoço, comer e organizar','meal'],
  ['afternoon-rest','13:00','14:00','Descanso e lazer básico','rest'],
  ['snack-rest','16:00','16:45','Lanche, água, interação e descanso','rest'],
  ['prepare-walk-pm','16:45','17:00','Margem e preparar passeio','transition'],
  ['arrival-rest','17:30','17:50','Água e descanso após o passeio','rest'],
  ['prepare-study','17:50','18:00','Preparar o estudo','transition'],
  ['dinner','20:10','20:50','Preparar jantar e comer','meal'],
  ['basic-leisure','21:00','21:30','Lazer básico e convivência','leisure'],
  ['evening-hygiene','21:50','22:00','Higiene e preparar amanhã','hygiene'],
  ['wind-down','22:00','22:30','Desacelerar para dormir às 22:30','wind-down']
];
function block(id,title,start,end,kind,extra={}) {
  return {id,title,start:clock(start),end:clock(end),startMinute:start,endMinute:end,
    endDayOffset:Math.floor(end/1440),kind,missionId:null,part:1,parts:1,effortMinutes:0,...extra};
}
function missionBlock(m,start,duration,part=1,parts=1) {
  return block('mission:'+m.id+':'+part,m.title+(parts>1?' · parte '+part+'/'+parts:''),start,start+duration,'mission',{
    missionId:m.id,part,parts,effortMinutes:duration,essential:!!m.essential,
    minimumMinutes:Math.max(1,Number(m.minMinutes)||1),action:m.action,minimum:m.minimum
  });
}
function occupiedBlocks(s,day,missions) {
  const weekend=isWeekend(day);
  const blocks=(weekend?offFixed:workFixed).map(([id,start,end,title,role])=>
    block('fixed:'+id,title,minute(start),minute(end),'fixed',{protected:true,role}));
  if(weekend&&!missions.some(m=>m.id==='exercise'))blocks.push(
    block('fixed:off-shower','Banho e transição da manhã',minute('09:20'),minute('09:40'),'fixed',{protected:true,role:'hygiene'})
  );
  for(const m of missions) {
    const start=minute(m.time),duration=Math.max(1,Number(m.minutes)||1,m.essential?Number(m.minMinutes)||1:1);
    if(m.id==='python'&&duration>1) {
      const first=Math.ceil(duration/2),second=duration-first;
      blocks.push(missionBlock(m,start,first,1,2));
      blocks.push(block('break:python','Pausa do estudo — fora da contagem de Python',start+first,start+first+10,'break',{parentMissionId:m.id,protected:true,role:'study-break'}));
      blocks.push(missionBlock(m,start+first+10,second,2,2));
    }else if(m.id==='weekend-walk'&&duration>1) {
      const first=Math.ceil(duration/2),second=duration-first;
      blocks.push(missionBlock(m,start,first,1,2));
      blocks.push(missionBlock(m,minute(m.secondTime||'17:00'),second,2,2));
    }else blocks.push(missionBlock(m,start,duration));
    if(weekend&&m.id==='exercise') {
      blocks.push(block('fixed:exercise-shower','Banho e transição após exercício',start+duration,start+duration+20,'fixed',{
        parentMissionId:m.id,protected:true,role:'hygiene'
      }));
    }
  }
  for(const p of s.purchases||[])if(p.day===day&&p.status!=='cancelled') {
    blocks.push(block('reward:'+p.id,p.title,minute(p.start),minute(p.end),'reward',{purchaseId:p.id,role:'extra'}));
  }
  return blocks.sort(compareBlocks);
}
function compareBlocks(a,b){return a.startMinute-b.startMinute||a.endMinute-b.endMinute||a.id.localeCompare(b.id);}
function merged(intervals) {
  const result=[];
  for(const [start,end] of intervals.filter(([a,b])=>b>a).sort((a,b)=>a[0]-b[0]||a[1]-b[1])) {
    const last=result.at(-1);
    if(last&&start<=last[1])last[1]=Math.max(last[1],end);
    else result.push([start,end]);
  }
  return result;
}
function subtract(intervals,busy) {
  const occupied=merged(busy),result=[];
  for(const [start,end] of intervals) {
    let cursor=start;
    for(const [a,b] of occupied) {
      if(b<=cursor)continue;
      if(a>=end)break;
      if(a>cursor)result.push([cursor,Math.min(a,end)]);
      cursor=Math.max(cursor,b);
      if(cursor>=end)break;
    }
    if(cursor<end)result.push([cursor,end]);
  }
  return result;
}
function summary(b) {
  return {id:b.id,title:b.title,kind:b.kind,missionId:b.missionId,parentMissionId:b.parentMissionId||null,start:b.start,end:b.end};
}
function conflictsFor(blocks) {
  const conflicts=[];
  for(let i=0;i<blocks.length;i++) {
    const first=blocks[i];
    if(first.startMinute<WAKE||first.endMinute>SLEEP) {
      const start=first.startMinute<WAKE?first.startMinute:Math.max(SLEEP,first.startMinute);
      const end=first.startMinute<WAKE?Math.min(WAKE,first.endMinute):first.endMinute;
      conflicts.push({id:first.id+':outside:'+start+':'+end,first:summary(first),second:null,
        start:clock(start),end:clock(end),startMinute:start,endMinute:end,
        missionIds:[first.missionId||first.parentMissionId].filter(Boolean),reason:'Horário fora da janela de 05:30 a 22:30. Preserve o sono e ajuste o planejamento.'});
    }
    for(let j=i+1;j<blocks.length&&blocks[j].startMinute<first.endMinute;j++) {
      const second=blocks[j],start=Math.max(first.startMinute,second.startMinute),end=Math.min(first.endMinute,second.endMinute);
      if(end<=start)continue;
      conflicts.push({id:[first.id,second.id].sort().join('|')+':'+start+':'+end,
        first:summary(first),second:summary(second),start:clock(start),end:clock(end),startMinute:start,endMinute:end,
        missionIds:[...new Set([first.missionId||first.parentMissionId,second.missionId||second.parentMissionId].filter(Boolean))],
        reason:'Há sobreposição de horários entre '+first.title+' e '+second.title+'. Confira o planejamento antes de escolher uma ação.'});
    }
  }
  return conflicts;
}
export function baseExtraWindows(day) {
  return isWeekend(day)?[['14:00','16:00'],['21:30','21:50']]:[['21:30','21:50']];
}
function extraFromBlocks(day,blocks,now=0) {
  const windows=baseExtraWindows(day).map(([a,b])=>[Math.max(minute(a),now),minute(b)]).filter(([a,b])=>a<b);
  return subtract(windows,blocks.map(b=>[b.startMinute,b.endMinute])).map(([a,b])=>[clock(a),clock(b)]);
}
export function buildAgenda(s,day,missions) {
  const occupied=occupiedBlocks(s,day,missions);
  const free=subtract([[WAKE,SLEEP]],occupied.map(b=>[b.startMinute,b.endMinute]))
    .map(([a,b])=>block('free:'+a+':'+b,'Tempo flexível, descanso ou margem',a,b,'free',{role:'free'}));
  return {day,blocks:[...occupied,...free].sort(compareBlocks),conflicts:conflictsFor(occupied),extraWindows:extraFromBlocks(day,occupied)};
}
export function availableExtra(s,day,missions,nowMinute=0) {
  const agenda=buildAgenda(s,day,missions);
  return agenda.extraWindows.map(([a,b])=>[Math.max(minute(a),nowMinute),minute(b)])
    .filter(([a,b])=>a<b).map(([a,b])=>[clock(a),clock(b)]);
}
function result(status,title,reason,extra={}) {
  return {status,missionId:null,title,start:null,end:null,startMinute:null,endMinute:null,minutes:0,mode:null,reason,...extra};
}
function missionResult(status,b,mode,minutes,start,reason) {
  return result(status,b.title,reason,{missionId:b.missionId,blockId:b.id,part:b.part,parts:b.parts,
    start:clock(start),end:clock(start+minutes),startMinute:start,endMinute:start+minutes,minutes,mode});
}
function completed(m,statuses,difficult) {
  const status=statuses[m.id];
  return status==='normal'||status==='minimum'&&(m.id!=='python'||difficult);
}
function plannedMode(b,difficult) {
  return difficult&&!b.essential&&b.minimumMinutes<=b.effortMinutes?'minimum':'normal';
}
function plannedMinutes(b,difficult){return plannedMode(b,difficult)==='minimum'?b.minimumMinutes:b.effortMinutes;}
function upcoming(agenda,missionsById,statuses,difficult,now) {
  return agenda.blocks.find(b=>b.kind==='mission'&&b.startMinute>now&&b.endMinute<=SLEEP&&
    !completed(missionsById.get(b.missionId),statuses,difficult));
}
export function nextAgendaAction(s,day,missions,nowMinute,statuses={}) {
  const agenda=buildAgenda(s,day,missions),now=Math.max(0,Math.min(1440,nowMinute)),difficult=!!s.difficult?.[day];
  const missionsById=new Map(missions.map(m=>[m.id,m]));
  if(s.config?.paused)return result('paused','Jornada em pausa','Sem cobrança ou perda de progresso. Os cuidados essenciais do cachorro continuam: confira a agenda e combine ajuda quando necessário.');
  if(now<WAKE||now>=SLEEP)return result('rest','Hora de descansar','O planejamento preserva o sono. Retome dentro da janela de 05:30 a 22:30.');
  const collision=agenda.conflicts.find(c=>c.startMinute<=now&&c.endMinute>now);
  if(collision)return result('conflict','Conferir horários',collision.reason,{conflictId:collision.id,start:collision.start,end:collision.end,startMinute:collision.startMinute,endMinute:collision.endMinute});
  const current=agenda.blocks.find(b=>b.kind!=='free'&&b.startMinute<=now&&b.endMinute>now);
  if(current&&current.kind!=='mission') {
    const rest=current.kind==='break'||current.kind==='reward'||['rest','leisure','wind-down'].includes(current.role);
    return result(rest?'rest':'busy',current.title,current.kind==='break'?
      'Esta pausa fica fora dos minutos de estudo. Levante, beba água e descanse.':
      'Este período já está reservado. Não é preciso encaixar outra tarefa aqui.',{
      start:current.start,end:current.end,startMinute:current.startMinute,endMinute:current.endMinute,blockId:current.id
    });
  }
  if(current) {
    const m=missionsById.get(current.missionId),remaining=current.endMinute-now;
    if(completed(m,statuses,difficult))return result('rest',current.title,'Este bloco já foi registrado. Use a margem para descanso e preserve as próximas transições.',{
      start:current.start,end:current.end,startMinute:current.startMinute,endMinute:current.endMinute,blockId:current.id
    });
    if(current.essential) {
      if(remaining<current.effortMinutes)return missionResult('conflict',current,'normal',current.effortMinutes,current.startMinute,
        'O cuidado essencial não deve ser encurtado. Confira se já foi feito; se ainda precisa começar, combine ajuda ou ajuste os horários com segurança.');
      return missionResult('available',current,'normal',current.effortMinutes,now,'Este é o bloco de cuidado essencial previsto. Preserve toda a duração necessária.');
    }
    if(m.id==='python') {
      const mode=plannedMode(current,difficult),duration=mode==='minimum'?current.minimumMinutes:Math.min(remaining,Number.isFinite(m.remainingMinutes)?m.remainingMinutes:remaining);
      if(duration>0&&duration<=remaining)return missionResult('available',current,mode,duration,now,
        mode==='minimum'?'Uma prática mínima cabe neste bloco. A meta de duas horas continua separada, sem obrigação de avançar a fase.':
        'Este bloco é de prática de Python. Registre somente os minutos realmente estudados; a pausa não conta.');
    }else {
      const mode=difficult||remaining<current.effortMinutes?'minimum':'normal',duration=mode==='minimum'?current.minimumMinutes:current.effortMinutes;
      if(duration<=remaining)return missionResult('available',current,mode,duration,now,mode==='minimum'?
        'A versão mínima cabe no restante deste bloco; não é necessário cumprir uma meta maior hoje.':'A missão cabe no bloco que você reservou.');
    }
    const future=upcoming(agenda,missionsById,statuses,difficult,now);
    if(future)return missionResult('upcoming',future,plannedMode(future,difficult),plannedMinutes(future,difficult),
      future.startMinute,'O restante deste bloco é curto. A próxima missão permanece no horário planejado; não foi antecipada.');
    return result('rest','Um respiro','Não há tempo suficiente para esta versão no bloco atual. Preserve a transição e retome depois, sem dívida.');
  }
  const free=agenda.blocks.find(b=>b.kind==='free'&&b.startMinute<=now&&b.endMinute>now);
  if(free) {
    const past=agenda.blocks.filter(b=>b.kind==='mission'&&b.endMinute<=now&&!completed(missionsById.get(b.missionId),statuses,difficult))
      .sort((a,b)=>b.endMinute-a.endMinute);
    const essential=past.find(b=>b.essential);
    if(essential)return missionResult('conflict',essential,'normal',essential.effortMinutes,essential.startMinute,
      'Há um cuidado essencial com horário anterior. Confira se já aconteceu ou combine ajuda; não reduza a duração e não acumule uma cobrança automática.');
    const candidate=past.find(b=>!b.essential&&b.minimumMinutes<=free.endMinute-now);
    if(candidate)return missionResult('available',candidate,'minimum',candidate.minimumMinutes,now,
      'O horário original passou. Se ajudar, a versão mínima cabe neste tempo flexível; é uma sugestão, sem reagendamento automático ou dívida.');
  }
  const future=upcoming(agenda,missionsById,statuses,difficult,now);
  if(future) {
    const conflict=agenda.conflicts.find(c=>c.missionIds.includes(future.missionId)&&c.startMinute<future.endMinute&&c.endMinute>future.startMinute);
    if(conflict)return result('conflict','Conferir a próxima missão',conflict.reason,{missionId:future.missionId,conflictId:conflict.id,start:future.start,end:future.end,startMinute:future.startMinute,endMinute:future.endMinute,minutes:future.effortMinutes});
    return missionResult('upcoming',future,plannedMode(future,difficult),plannedMinutes(future,difficult),future.startMinute,
      'Esta é uma missão futura. O horário continua reservado; aproveite o tempo flexível sem antecipar tarefas automaticamente.');
  }
  return result('rest','Tempo para respirar','As missões registradas e o descanso têm seu lugar. Não há obrigação de preencher este intervalo.');
}
