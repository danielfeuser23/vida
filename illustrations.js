// Arte vetorial autoral do Entre Trilhas. Sem rede, fontes ou recursos externos.
// Somente opções conhecidas chegam ao SVG; nenhum valor recebido vira markup.
const cloakPalette = {
  forest: {base:'#416b55',shade:'#2c4e3e',light:'#7d9975',name:'verde da floresta'},
  clay: {base:'#a2664b',shade:'#774833',light:'#cf9d76',name:'argila'},
  night: {base:'#4f607f',shade:'#35445f',light:'#889bb5',name:'azul noturno'}
};
const skinPalette = {
  warm: {base:'#ca946a',shade:'#a66e49',name:'pele dourada'},
  light: {base:'#ecc5a2',shade:'#cf9f79',name:'pele clara'},
  deep: {base:'#85533d',shade:'#603b2d',name:'pele escura'}
};
const hairNames = {short:'cabelo curto',curly:'cabelos cacheados',bob:'cabelo na altura do queixo'};
const accessoryNames = {none:'sem acessório',leaf:'broche de folha',scarf:'lenço de trilha',star:'estrela de projeto',charm:'pingente de retomada'};
const known = (options,value,fallback) => typeof value==='string'&&Object.hasOwn(options,value)?value:fallback;
function drawingOptions(appearance) {
  const a=appearance&&typeof appearance==='object'?appearance:{};
  return {
    cloak:known(cloakPalette,a.cloak,'forest'),skin:known(skinPalette,a.skin,'warm'),
    hair:known(hairNames,a.hair,'short'),accessory:known(accessoryNames,a.accessory,'none'),
    decor:Array.isArray(a.decor)?['books','lamp','rug'].filter(id=>a.decor.includes(id)):[],
    simplified:a.simplified===true
  };
}

export function avatarIllustration(appearance,{small=false}={}) {
  const a=drawingOptions(appearance),cloak=cloakPalette[a.cloak],skin=skinPalette[a.skin];
  const hairBack=a.hair==='bob'?'<path d="M48 78C44 33 126 25 132 76L134 132Q116 144 108 122H72Q54 143 46 129Z" fill="#39352e"/>':a.hair==='curly'?'<path d="M49 80Q41 49 65 39Q90 21 118 42Q141 55 130 88L117 111H63Z" fill="#39352e"/>':'';
  const hairFront=a.hair==='short'?'<path d="M58 76Q53 43 85 41Q115 37 125 67L118 79L113 60Q91 71 67 61L65 79Z" fill="#39352e"/>':a.hair==='curly'?'<g fill="#39352e"><circle cx="59" cy="66" r="13"/><circle cx="67" cy="49" r="13"/><circle cx="85" cy="43" r="13"/><circle cx="104" cy="46" r="13"/><circle cx="120" cy="58" r="13"/><circle cx="126" cy="75" r="10"/></g>':'<path d="M56 78Q51 43 87 40Q118 38 127 73L119 80L114 59Q94 74 69 61L63 84Z" fill="#39352e"/>';
  const accessory={
    none:'',
    leaf:'<g transform="translate(116 136)"><path d="M-7 6Q-10-9 8-11Q12 5-7 6Z" fill="#e4c075" stroke="#6f5228" stroke-width="1.6"/><path d="M-7 7L5-7" stroke="#6f5228" stroke-width="1.6"/></g>',
    scarf:'<path d="M69 116Q90 126 111 116L115 127Q93 141 66 129Z" fill="#d6a067"/><path d="M103 128L113 148L103 153L94 132Z" fill="#c48b52"/>',
    star:'<path d="M119 125L122 132L130 133L124 139L126 147L119 143L112 147L113 139L107 133L115 132Z" fill="#e4c075" stroke="#6f5228" stroke-width="1.6"/>',
    charm:'<path d="M73 122L90 142L107 122" fill="none" stroke="#ddc49a" stroke-width="2.5"/><path d="M90 137L97 145L90 153L83 145Z" fill="#e4c075" stroke="#6f5228" stroke-width="1.6"/><path d="M90 141V149M87 145H93" stroke="#6f5228" stroke-width="1.3"/>'
  }[a.accessory];
  const label=`Viajante com capa ${cloak.name}, ${skin.name}, ${hairNames[a.hair]} e ${accessoryNames[a.accessory]}.`;
  return `<svg class="avatar-illustration${small?' avatar-illustration-small':''}" viewBox="0 0 180 180" role="img" aria-label="${label}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg"><circle cx="90" cy="90" r="86" fill="#e9eedf"/>${a.simplified||small?'':'<path d="M17 138L42 97L63 126L83 100L117 143Z" fill="#cbd6bc"/><path d="M116 137L139 94L165 140Z" fill="#d5dec8"/><circle cx="140" cy="42" r="13" fill="#e3c88f"/>'}${hairBack}<path d="M27 172Q31 131 68 121L90 131L112 121Q150 132 153 172Z" fill="${cloak.base}"/><path d="M27 172Q31 139 57 129L68 171ZM112 171L122 129Q149 141 153 172Z" fill="${cloak.shade}"/><path d="M77 102H103V126Q90 137 77 126Z" fill="${skin.shade}"/><ellipse cx="60" cy="87" rx="6" ry="9" fill="${skin.shade}"/><ellipse cx="120" cy="87" rx="6" ry="9" fill="${skin.shade}"/><path d="M59 73Q59 45 90 46Q121 45 121 73V92Q119 117 90 124Q61 117 59 92Z" fill="${skin.base}"/>${hairFront}<g fill="#302d28"><circle cx="77" cy="86" r="2.6"/><circle cx="103" cy="86" r="2.6"/></g><path d="M87 87L84 98H91" fill="none" stroke="${skin.shade}" stroke-width="2" stroke-linecap="round"/><path d="M81 106Q90 112 99 106" fill="none" stroke="#5d392c" stroke-width="2.4" stroke-linecap="round"/><path d="M68 122L88 136L72 148L58 129ZM112 122L92 136L108 148L122 129Z" fill="${cloak.light}"/><path d="M90 139V171" stroke="${cloak.shade}" stroke-width="2.5"/>${accessory}</svg>`;
}

export function refugeIllustration(appearance) {
  const a=drawingOptions(appearance),cloak=cloakPalette[a.cloak];
  const books=a.decor.includes('books'),lamp=a.decor.includes('lamp'),rug=a.decor.includes('rug');
  const description=['Refúgio ilustrado com estante, bancada e um cachorro descansando.',books?'Livros na estante.':'Estante pronta para receber livros.',lamp?'Luminária de projeto na bancada.':'Bancada de estudo disponível.',rug?'Tapete do companheiro no chão.':'Espaço do companheiro disponível.'].join(' ');
  const background=a.simplified?'':`<g fill="none" stroke="#dedbc9" stroke-width="2"><path d="M40 76H170M198 76H520M548 76H680M40 108H162M552 108H680M40 140H156M557 140H680"/><path d="M89 285L75 331M204 285L199 331M345 285V331M489 285L495 331M626 285L643 331"/></g><path d="M80 36L72 20H648L640 36Z" fill="#987a58"/><path d="M92 35H628" stroke="#c5ad85" stroke-width="4"/>`;
  const windowArt=a.simplified?'<rect x="268" y="65" width="184" height="112" rx="9" fill="#dce6d0"/>':'<rect x="268" y="65" width="184" height="112" rx="9" fill="#dfe9db"/><circle cx="411" cy="91" r="14" fill="#ddbd75"/><path d="M275 164L316 107L352 143L382 111L445 168Z" fill="#bacab3"/><path d="M275 169L315 138L350 160L391 128L445 169Z" fill="#8eaa8b"/>';
  const bookArt=books?'<g stroke="#f4ead2" stroke-width="2"><path d="M85 128H98V174H85Z" fill="#a9684c"/><path d="M101 117H115V174H101Z" fill="#4e7358"/><path d="M118 134H132V174H118Z" fill="#c2a56b"/><path d="M140 128L154 124L168 170L154 174Z" fill="#627492"/><path d="M86 209H147V222H86Z" fill="#627492"/><path d="M91 196H158V208H91Z" fill="#c2a56b"/><path d="M95 185H153V195H95Z" fill="#a9684c"/></g>':'';
  const lampArt=lamp?'<g><path d="M398 211H438" stroke="#664e35" stroke-width="6" stroke-linecap="round"/><path d="M419 211V178L401 160" stroke="#664e35" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M401 150L421 170L391 181L382 171Z" fill="#d9b362" stroke="#8d6e3d" stroke-width="2"/><path d="M393 175L409 169" stroke="#f5df9a" stroke-width="3" stroke-linecap="round"/></g>':'';
  const rugArt=rug?`<ellipse cx="575" cy="292" rx="84" ry="24" fill="${cloak.base}"/><ellipse cx="575" cy="292" rx="73" ry="17" fill="none" stroke="${cloak.light}" stroke-width="2"/><path d="M485 286L496 287M483 292H494M485 299L496 297M655 287L666 285M657 293H669M655 298L666 301" stroke="${cloak.base}" stroke-width="3" stroke-linecap="round"/>`:'';
  const plants=a.simplified?'':'<g><path d="M183 259H213L208 285H188Z" fill="#b7805a"/><path d="M198 260V224" stroke="#6e8655" stroke-width="3"/><path d="M198 242Q176 236 182 222Q199 224 198 242ZM198 233Q218 227 216 214Q198 217 198 233Z" fill="#819b67"/></g>';
  return `<svg class="refuge-illustration" viewBox="0 0 720 360" role="img" aria-label="${description}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg"><rect x="16" y="16" width="688" height="328" rx="24" fill="#f1eddd"/><path d="M16 285H704V320Q704 344 680 344H40Q16 344 16 320Z" fill="#d9c6a5"/>${background}<path d="M44 44H676M44 44V285M676 44V285" fill="none" stroke="#b69d78" stroke-width="10" stroke-linecap="round"/>${windowArt}<rect x="260" y="57" width="200" height="128" rx="13" fill="none" stroke="#a88d65" stroke-width="9"/><path d="M360 63V179M268 121H452" stroke="#b2986f" stroke-width="5"/><path d="M249 185H471" stroke="#a88d65" stroke-width="8" stroke-linecap="round"/><rect x="68" y="94" width="112" height="191" rx="5" fill="#a88c66"/><rect x="78" y="104" width="92" height="69" fill="#e4dcc5"/><rect x="78" y="181" width="92" height="41" fill="#e4dcc5"/><rect x="78" y="230" width="92" height="43" fill="#e4dcc5"/>${bookArt}<path d="M74 177H175M74 226H175" stroke="#8f7451" stroke-width="5"/>${plants}<path d="M277 232H447V244H277Z" fill="#9a7c54"/><path d="M290 243V301M434 243V301" stroke="#8d714f" stroke-width="10"/><rect x="268" y="215" width="188" height="19" rx="6" fill="#b6976b"/><path d="M299 210L311 193H354L369 210Z" fill="${cloak.base}"/><path d="M311 194L320 202L353 194" fill="none" stroke="${cloak.light}" stroke-width="2"/><path d="M326 265H394L389 302H331Z" fill="${cloak.base}"/><path d="M337 302V316M383 302V316" stroke="#8d714f" stroke-width="6"/>${lampArt}${rugArt}<g><path d="M531 283Q509 272 519 252Q529 242 544 248" fill="none" stroke="#a77c50" stroke-width="11" stroke-linecap="round"/><ellipse cx="571" cy="273" rx="43" ry="24" fill="#b58d62"/><path d="M550 259Q566 253 585 260" fill="none" stroke="#cfab80" stroke-width="10" stroke-linecap="round"/><ellipse cx="610" cy="272" rx="23" ry="20" fill="#c7a079"/><path d="M592 259Q584 248 591 244Q604 247 607 260Z" fill="#785638"/><ellipse cx="626" cy="280" rx="12" ry="8" fill="#dfc4a3"/><ellipse cx="635" cy="277" rx="4" ry="3" fill="#45392d"/><path d="M606 271Q611 274 616 271" stroke="#45392d" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M563 290H585M599 288H617" stroke="#dfc4a3" stroke-width="8" stroke-linecap="round"/></g>${a.simplified?'':'<path d="M489 141Q498 129 509 141Q499 153 489 141Z" fill="#d9bd83"/><path d="M499 141V122" stroke="#ac9165" stroke-width="2"/>'}</svg>`;
}
