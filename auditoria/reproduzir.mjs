// Diagnóstico exploratório: registra o comportamento atual; não substitui regressões.
// Execute: node auditoria/reproduzir.mjs
import * as E from '../engine.js';
import {roadmap} from '../roadmap.js';
import {writeFileSync} from 'node:fs';
const reports=[];
function probe(id,fn){try{reports.push({id,...fn()});}catch(e){reports.push({id,erro:e.message});}}
probe('B01-backup-array',()=>{const s=E.createState('2026-11-09');s.records=[];const accepted=E.validateState(s);E.complete(s,'read','2026-11-09','normal',roadmap);E.validateState(s);const restored=JSON.parse(JSON.stringify(s));let reload;try{E.validateState(restored);reload='aceito';}catch(e){reload=e.message;}return {backupInicialAceito:accepted,registrosAntesSerializar:Object.keys(s.records),registrosDepoisSerializar:Object.keys(restored.records),reabertura:reload,bugConfirmado:accepted&&reload!=='aceito'};});
probe('B02-horario-fim-semana',()=>{const s=E.createState();s.config.missions.find(m=>m.id==='exercise').time='10:30';const actual=E.missionsFor(s,'2026-11-07').find(m=>m.id==='exercise').time;return {horarioEditado:'10:30',horarioEfetivo:actual,bugConfirmado:actual!=='10:30'};});
probe('B03-evento-sem-registro',()=>{const s=E.createState('2026-11-09');s.events.push({id:crypto.randomUUID(),at:'2026-11-09T12:00:00Z',day:'2026-11-09',type:'mission',title:'Registro danificado',xp:50,coins:20});const accepted=E.validateState(s);return {aceito:accepted,total:E.totals(s),habilidades:E.skillTotals(s),bugConfirmado:accepted};});
probe('B04-fim-trilha',()=>{const s=E.createState('2026-01-01');for(let i=0;i<roadmap.length;i++)E.complete(s,'python',E.addDays(s.created,i),'normal',roadmap);E.validateState(s);let result;try{E.complete(s,'python',E.addDays(s.created,roadmap.length),'normal',roadmap);result='concluiu';}catch(e){result=e.message;}return {fasesConcluidas:s.lessons.length,proximaSessao:result,bugConfirmado:result!=='concluiu'};});
probe('D01-120-fases',()=>{const code=roadmap.filter(l=>l.code).length;return {fases:roadmap.length,desafios:roadmap.reduce((a,l)=>a+(l.practice?.length||0),0),fasesComExemploCodigo:code,observacao:'Inventário de conteúdo, não prova de qualidade pedagógica ou bug.'};});
console.log(JSON.stringify(reports,null,2));
if(process.argv.includes('--save'))writeFileSync(new URL('reproducoes.json',import.meta.url),JSON.stringify(reports,null,2)+'\n');
