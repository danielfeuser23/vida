import * as E from '../engine.js';
import {writeFileSync} from 'node:fs';
import {roadmap} from '../roadmap.js';
for(const n of [30,365,1095]){
 const s=E.createState('2023-01-01');
 for(let i=0;i<n;i++){
  const d=E.addDays(s.created,i);
  for(const m of E.missionsFor(s,d))E.complete(s,m.id,d,m.id==='python'?'minimum':'normal',roadmap);
  E.buy(s,'video',d,'21:30','benchmark-'+i);
 }
 const start=performance.now();E.validateState(s);const ms=performance.now()-start;
 const json=JSON.stringify(s);writeFileSync('/tmp/vida-audit-'+n+'.json',json);
 console.log(JSON.stringify({days:n,events:s.events.length,purchases:s.purchases.length,records:Object.keys(s.records).length,jsonBytes:Buffer.byteLength(json),validateMs:+ms.toFixed(2)}));
}
writeFileSync('/tmp/vida-roadmap-examples.json',JSON.stringify(roadmap.map(l=>({id:l.id,code:l.code}))));
