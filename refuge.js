// Cosméticos autorais: disponibilidade deriva da prática registrada, nunca do saldo.
// A preferência pode sobreviver a uma correção; o visual efetivo usa uma opção livre.
function freezeTree(value) {
  if(value&&typeof value==='object') {
    for(const item of Object.values(value))freezeTree(item);
    Object.freeze(value);
  }
  return value;
}

export const appearanceDefaults=freezeTree({
  cloak:'forest',skin:'warm',hair:'short',accessory:'none',
  decor:['books','lamp','rug'],simplified:false
});

export const appearanceOptions=freezeTree({
  cloak:[
    {id:'forest',title:'Musgo',color:'#315c49'},
    {id:'clay',title:'Argila',color:'#9b5d43'},
    {id:'night',title:'Noite',color:'#425b79'}
  ],
  skin:[
    {id:'warm',title:'Dourado',color:'#be8962'},
    {id:'light',title:'Claro',color:'#efc4a0'},
    {id:'deep',title:'Escuro',color:'#79513d'}
  ],
  hair:[
    {id:'short',title:'Curto'},
    {id:'curly',title:'Cacheado'},
    {id:'bob',title:'Médio'}
  ],
  accessory:[
    {id:'none',title:'Sem acessório'},
    {id:'leaf',title:'Broche de folha'},
    {id:'scarf',title:'Lenço dos caminhos'},
    {id:'star',title:'Estrela de criação'},
    {id:'charm',title:'Amuleto de retorno'}
  ],
  decor:[
    {id:'books',title:'Livros da jornada'},
    {id:'lamp',title:'Luminária da bancada'},
    {id:'rug',title:'Manta do companheiro'}
  ]
});

const fields=['cloak','skin','hair','accessory','decor','simplified'];
const plain=value=>value!==null&&typeof value==='object'&&!Array.isArray(value)&&
  (Object.getPrototypeOf(value)===Object.prototype||Object.getPrototypeOf(value)===null);
const dataProperty=(value,key)=>{
  const descriptor=Object.getOwnPropertyDescriptor(value,key);
  return !!descriptor&&descriptor.enumerable&&Object.hasOwn(descriptor,'value');
};

export function validateAppearance(value) {
  if(!plain(value)||Reflect.ownKeys(value).length!==fields.length||
      !fields.every(field=>dataProperty(value,field))) {
    throw Error('Confira os campos da aparência: cor, tom, cabelo, acessório, objetos e visual simples.');
  }
  const labels={cloak:'Escolha uma cor de roupa disponível.',skin:'Escolha um tom de pele disponível.',
    hair:'Escolha um cabelo disponível.',accessory:'Escolha um acessório do catálogo.'};
  for(const field of ['cloak','skin','hair','accessory']) {
    if(!appearanceOptions[field].some(option=>option.id===value[field]))throw Error(labels[field]);
  }
  const decor=value.decor;
  if(!Array.isArray(decor)||Object.getPrototypeOf(decor)!==Array.prototype||decor.length>3||
      Reflect.ownKeys(decor).length!==decor.length+1||
      !Array.from({length:decor.length},(_,index)=>String(index)).every(key=>dataProperty(decor,key))||
      !decor.every(id=>appearanceOptions.decor.some(option=>option.id===id))||
      new Set(decor).size!==decor.length) {
    throw Error('Escolha cada objeto do refúgio uma única vez entre livros, luminária e manta.');
  }
  if(typeof value.simplified!=='boolean')throw Error('Escolha se deseja usar o visual simples.');
  return true;
}

function weekStart(day) {
  const date=new Date(day+'T12:00:00Z');
  date.setUTCDate(date.getUTCDate()-((date.getUTCDay()+6)%7));
  return date.toISOString().slice(0,10);
}

export function refugeProgress(state,study={sessions:[],projects:0}) {
  const records=Object.values(state.records);
  const sessions=(study.sessions||[]).filter(session=>!session.corrected);
  const dates=[...new Set([...records.map(record=>record.day),...sessions.map(session=>session.day)])].sort();
  const skillDays=skill=>new Set(records.filter(record=>Object.hasOwn(record.skills,skill)).map(record=>record.day)).size;
  const weeks=new Map();
  for(const day of dates) {
    const week=weekStart(day);
    weeks.set(week,(weeks.get(week)||0)+1);
  }
  const stats={
    practiceDays:dates.length,practiceDates:dates,readingDays:skillDays('reading'),
    dogDays:skillDays('dog'),homeDays:skillDays('home'),projects:study.projects||0,
    phases:state.lessons.length,weeklyBest:Math.max(0,...weeks.values()),
    returned:dates.some((day,index)=>index>0&&
      (Date.parse(day+'T12:00:00Z')-Date.parse(dates[index-1]+'T12:00:00Z'))>=2*86400000)
  };
  const achievements=[
    {id:'first-step',title:'Primeiro passo',description:'Registre sua primeira missão ou sessão de estudo.',earned:stats.practiceDays>0,icon:'leaf'},
    {id:'possible-week',title:'Uma semana possível',description:'Pratique em três dias na mesma semana, sem exigir sequência.',earned:stats.weeklyBest>=3,icon:'calendar'},
    {id:'welcome-back',title:'Bem-vindo de volta',description:'Retome depois de um intervalo, sem cobrança acumulada.',earned:stats.returned,icon:'redo'},
    {id:'first-program',title:'Primeiro programa',description:'Conclua sua primeira fase de Python.',earned:stats.phases>0,icon:'code'},
    {id:'world-builder',title:'Construtor de mundos',description:'Conclua um projeto da trilha.',earned:stats.projects>0,icon:'star'},
    {id:'reading-companion',title:'Leitura que acompanha',description:'Registre leitura em três dias, sem exigir sequência.',earned:stats.readingDays>=3,icon:'book'},
    {id:'care-companion',title:'Companheiro de caminho',description:'Registre cuidados do cachorro em três dias, sem exigir sequência.',earned:stats.dogDays>=3,icon:'paw'}
  ];
  const items=[
    {id:'none',slot:'accessory',title:'Sem acessório',description:'O começo da jornada já é seu.',requirement:'Sempre disponível.',unlocked:true},
    {id:'leaf',slot:'accessory',title:'Broche de folha',description:'Uma pequena folha para o primeiro passo.',requirement:'Uma missão ou sessão de estudo registrada.',unlocked:stats.practiceDays>0},
    {id:'scarf',slot:'accessory',title:'Lenço dos caminhos',description:'Lembra uma semana possível, sem sequência obrigatória.',requirement:'Prática em três dias de uma mesma semana.',unlocked:stats.weeklyBest>=3},
    {id:'star',slot:'accessory',title:'Estrela de criação',description:'Reconhecimento por uma criação concluída.',requirement:'Um projeto de Python concluído.',unlocked:stats.projects>0},
    {id:'charm',slot:'accessory',title:'Amuleto de retorno',description:'Voltar também faz parte do caminho.',requirement:'Retomar a prática após pelo menos um dia sem registro.',unlocked:stats.returned},
    {id:'books',slot:'decor',title:'Livros da jornada',description:'Uma pequena biblioteca no refúgio.',requirement:'Leitura registrada em três dias.',unlocked:stats.readingDays>=3},
    {id:'lamp',slot:'decor',title:'Luminária da bancada',description:'Uma luz para os próximos projetos.',requirement:'Um projeto de Python concluído.',unlocked:stats.projects>0},
    {id:'rug',slot:'decor',title:'Manta do companheiro',description:'Um detalhe acolhedor para o companheiro ilustrado.',requirement:'Cuidados do cachorro registrados em três dias.',unlocked:stats.dogDays>=3}
  ];
  return {achievements,items,stats};
}

export function appearanceFor(state,study={sessions:[],projects:0}) {
  const preferred=structuredClone(state.config.appearance||appearanceDefaults);
  const {items}=refugeProgress(state,study),unlocked=new Set(items.filter(item=>item.unlocked).map(item=>item.id));
  const effective=structuredClone(preferred),unavailable=[];
  if(!unlocked.has(preferred.accessory)) {
    unavailable.push(preferred.accessory);
    effective.accessory='none';
  }
  for(const id of preferred.decor)if(!unlocked.has(id))unavailable.push(id);
  effective.decor=preferred.decor.filter(id=>unlocked.has(id));
  return {preferred,effective,unavailable};
}
