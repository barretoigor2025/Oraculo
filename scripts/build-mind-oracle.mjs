/** Build the Mind cartridge using the actual Oráculo screens and engines.
 * Run from the repository root. Sources remain the Oráculo originals plus Kagehama data.
 */
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const root=process.cwd(), dest='public/MindRolePlay', cart=dest+'/catalogo/kagehama';
const write=(p,s)=>{fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,s);};
const json=v=>JSON.stringify(v,null,2);
async function seed(file,name){
  let source=fs.readFileSync('MindRolePlay/src/campaigns/kagehama/'+file+'.js','utf8');
  source=source.replace(/import (\w+) from '([^']+)';/g,(_,variable,url)=>{
    const file=url.split('/').at(-1);return `const ${variable} = ${JSON.stringify('catalogo/kagehama/assets/'+file)};`;
  });
  return (await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64')))[name];
}
const classes=await seed('classes','KAGEHAMA_CLASSES'), npcs=await seed('npcs','KAGEHAMA_NPCS'), scenes=await seed('scenes','KAGEHAMA_SCENES'), bestiary=await seed('bestiary','KAGEHAMA_BESTIARY'), story=await seed('story','KAGEHAMA_STORY');
const classData={};
for(const c of classes)for(const g of ['m','f']){
  const id=c.id+(g==='f'?'_f':''),a=c.attributes;
  classData[id]={id,nome:c.name+(g==='f'?' · Feminino':' · Masculino'),name:c.name,icon:c.icon,gender:g,
    maxHp:a.ST,sp:a.HT,mov:Math.floor((a.DX+a.HT)/4),movement:Math.floor((a.DX+a.HT)/4),attack:c.skills[0]?.level||a.DX,
    attrs:{ST:a.ST,DX:a.DX,IQ:a.IQ,HT:a.HT,STR:a.ST,DEX:a.DX,INT:a.IQ,CON:a.HT,WIS:a.IQ,CHA:a.IQ},attributes:a,
    skills:c.skills,feat:c.description,habs:c.skills.map(s=>({icon:'🎲',nome:s.name,desc:s.description+' · NH '+s.level,dano:'—',tipo:'teste',sp:0})),
    portrait:c.portraits[g==='m'?'male':'female'],standee:c.portraits[g==='m'?'male':'female'],cor:'#aaa',color:'#aaa'};
  const file={...classData[id],ia:c.roleplayProfile,descricao:c.description};
  write(cart+'/classes/'+id+'/dados.json',json(file));
}
write(cart+'/classes.js','export const CLASSES_DATA = '+json(classData)+';\n');
const registry={},NPCS={};
for(const n of npcs){const p=n.behaviorProfile;
  const name=n.title.replace(/^NPC — /,'');
  const ia={papel:n.description,personalidade:p.voice+' '+p.methods,forma_de_falar:p.voice,objetivos:[p.goal],segredos:[p.secret],estado_emocional_base:p.fear,reacoes_especiais:{ameaca:p.ifPressured},disposicao_inicial:'neutro',prompt_sistema:`Você é ${name}, em Kagehama, Japão medieval fantástico. ${n.description}\nVOZ: ${p.voice}\nOBJETIVO: ${p.goal}\nMEDO: ${p.fear}\nMÉTODOS: ${p.methods}\nSEGREDO (não revele sem justificativa): ${p.secret}\nSE PRESSIONADO: ${p.ifPressured}\nLIMITE: ${p.narratorGuardrail}\nResponda à pergunta específica. Você pode recusar, negociar, mentir por motivo e agir por iniciativa própria. Não decida pelo jogador.`};
  registry[n.id]={id:n.id,nome:name,img:n.portrait,avatar:n.id.endsWith('-10')?'🐕':'🔷',altura_cm:n.id.endsWith('-10')?55:175,zBase:5,offsetPx:0,reatividade:.2,personalidade:ia.personalidade,formaDeFalar:p.voice,conhecimentos:p.secret,promptSistema:ia.prompt_sistema};
  NPCS[n.id]={...registry[n.id],descricao:n.description,categoria:'neutro',ia,_retrato:n.portrait};
  write(cart+'/npcs/'+n.id+'/dados.json',json(NPCS[n.id]));
}
write(cart+'/npcs_registry.js','export const NPCS_REGISTRY = '+json(registry)+';\n');
const enemies=bestiary.map(b=>({id:b.id,nome:b.name,tipo:b.role,descricao:b.sign+' '+b.behavior,habilidades:[{nome:b.role,desc:b.behavior}],fraqueza:b.weakness,nivel:b.level,maxHp:8+b.level*2,hp:8+b.level*2,atkMod:11+b.level,mov:4,sp:10,ac:0}));
for(const en of enemies)write(cart+'/inimigos/'+en.id+'/dados.json',json(en));
write(cart+'/loader.js','export const NPCS = '+json(NPCS)+';\nexport const INIMIGOS_DATA = '+json(enemies)+';\n');
const CENAS={};
for(const [i,s]of scenes.entries()){
  const opening=(s.beats||[]).find(b=>b.type==='dialogue'&&s.presentNpcIds?.includes(b.speakerId));
  CENAS[s.id]={id:s.id,ato:i<3?1:i<8?2:i<11?3:4,titulo:s.title,subtitulo:s.chapter||'As Sete Lanternas',tipo:s.presentNpcIds?.length?'dialogo':'exploracao',textoIntro:s.openingPrompt||s.beats?.[0]?.text||s.description,
    npcsPresentes:s.presentNpcIds||[],npcEntrada:opening?.speakerId||null,falaEntrada:opening?.text||'',semIntro:false,avancarEmGrupo:true,
    imgExterior:s.image,imgInterior:s.image,beatNarrativo:s.objective||s.description,contextoInvestigacao:s.description,
    percepcao:s.perception?{dc:12,descricaoContexto:s.perception.success||s.perception.clue,textoFallback:s.perception.failure}:null,
    investigacao:!s.presentNpcIds?.length,temBatalha:false,nodeId:s.id,proximaCena:null};
}
write(cart+'/campanha/roteiro/campaign.js','export const CENAS = '+json(CENAS)+';\nexport const CENAS_ORDEM = '+json(scenes.map(s=>s.id))+';\n');
write(cart+'/campanha/roteiro/roteiro_jogavel.md',story);
write(cart+'/campanha/config_campanha.json',json({id:'kagehama',nome:'As Sete Lanternas de Kagehama',sistema:'GURPS 4e',versao:2,origem:'Oráculo: docs/o_oraculo.md',arte:'Mangá preto e branco'}));
write(cart+'/narracao.js',`import { NPCS_REGISTRY } from './npcs_registry.js';\nexport const NARRACAO_NPCS=Object.values(NPCS_REGISTRY);\nexport const NARRACAO_CENAS=${json(Object.fromEntries(scenes.map(s=>[s.id,{bg:s.image,titulo:s.title}])))};\nexport const NARRACAO_FLUXO=[];\n`);
const positions=[[15,76],[29,65],[41,77],[55,56],[82,69],[79,47],[87,49],[44,38],[29,57],[35,23],[52,24],[71,34],[86,22]];
const NOS=Object.fromEntries(scenes.map((s,i)=>[s.id,{titulo:s.title,subtitulo:s.chapter||'Kagehama',x:positions[i][0],y:positions[i][1],icon:'⛩',estadoInicial:i===0?'descoberto':i<3?'ouviu_falar':'desconhecido',desc:s.description}]));
const edges=[[0,1],[0,2],[1,3],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,11],[11,12],[1,8],[3,7],[5,10]];
const CAMINHOS=edges.filter(([a,b])=>scenes[a]&&scenes[b]).map(([a,b])=>({de:scenes[a].id,ate:scenes[b].id,perigo:a<2?0:1,dist:a<2?'curta':'media',encontros:[]}));
write(cart+'/mapa.js',`export const MAPA_IMG='catalogo/kagehama/mapa/mapa_kagehama.svg';\nexport const NOS=${json(NOS)};\nexport const CAMINHOS=${json(CAMINHOS)};\n`);
write(cart+'/mapa/mapa_kagehama.svg',`<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="900" viewBox="0 0 1800 900"><defs><pattern id="paper" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M0 7L7 0" stroke="#888" stroke-width=".2"/></pattern></defs><rect width="1800" height="900" fill="#ddd"/><rect width="1800" height="900" fill="url(#paper)"/><path d="M0 650Q180 520 370 680T740 700T1100 650T1450 620T1800 700V900H0Z" fill="#555"/><path d="M160 800Q310 650 650 590T1000 400T1530 230" stroke="#888" stroke-width="50" fill="none"/><g fill="#777" stroke="#333" stroke-width="2">${[[400,330],[650,140],[1100,80],[1370,160],[800,220]].map(([x,y])=>`<path d="M${x} ${y+170}l100 -170 100 170 -65 -40 -35 30 -35 -30Z"/>`).join('')}</g><g fill="none" stroke="#555" stroke-width="4" stroke-dasharray="7 9">${CAMINHOS.map(e=>`<path d="M${NOS[e.de].x*18} ${NOS[e.de].y*9}L${NOS[e.ate].x*18} ${NOS[e.ate].y*9}"/>`).join('')}</g><g fill="#444">${Array.from({length:55},(_,i)=>{const x=140+(i*127)%1400,y=240+(i*83)%320;return `<path d="M${x} ${y}l-18 45h36Z"/>`}).join('')}</g></svg>`);
write(cart+'/encontros.js',`export const ENCONTROS={}; export const EMBOSCADAS={}; export const MAPAS_BATALHA={}; export const MAPA_FALLBACK={mapa:${JSON.stringify(scenes[0].image)}}; export function rosterDaKey(){return [];} export function mapaDaKey(){return MAPA_FALLBACK;}\n`);
// Existing art is reused byte-for-byte, not regenerated or replaced.
function copyAssets(dir){for(const d of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,d.name);if(d.isDirectory())copyAssets(p);else{fs.mkdirSync(cart+'/assets',{recursive:true});fs.copyFileSync(p,cart+'/assets/'+d.name);}}}
copyAssets('MindRolePlay/assets/campaigns/kagehama');
write(cart+'/data.js',`export const REGRAS=${json({sistema:'GURPS',teste:'3d6 <= nível efetivo',arte:'Mangá japonês em preto e branco'})};\n`);
// Original engines, with isolated campaign/session/storage paths.
function adapt(source){return source.replaceAll('oraculo.groqKey','__GROQ_KEY__').replaceAll('oraculo.','mindRolePlay.').replaceAll('__GROQ_KEY__','oraculo.groqKey')
  .replaceAll("doc(db,'rooms',", "doc(db,'mindRooms',").replaceAll("doc(db, 'rooms',", "doc(db, 'mindRooms',")
  .replaceAll('catalogo/mhoried/','catalogo/kagehama/').replaceAll("'mhoried_market'","'kagehama-scene-0'").replaceAll('Oráculo —','Mind RolePlay —').replaceAll('Oráculo RPG','Mind RolePlay');}
for(const page of ['narration.html','mapa.html','catalog.html'])write(dest+'/'+page,adapt(fs.readFileSync('public/'+page,'utf8')));
// Shared rules module for static pages: one deterministic resolver across UI surfaces.
write(dest+'/gurps.js',fs.readFileSync('MindRolePlay/src/gurps.js','utf8')+`\nexport function test3d6(skill=12){return resolveSuccessTest({...roll3d6(),skill});}\n`);
// Original home markup and styles, same screen IDs, layout, four slots and lobby.
let html=fs.readFileSync('index.html','utf8').replace('src="/src/main.js"','src="./src/oraculoEntry.js"').replaceAll('Oráculo RPG','Mind RolePlay').replace('ORÁCULO','MIND ROLEPLAY').replace('RPG · Tático','RPG · GURPS').replace('Mapa tático · Multiplayer · Turno sincronizado','Campanha japonesa · Multiplayer · GURPS 3d6');
html=html.replace(/<button class="camp-card camp-mhoried[\s\S]*?<\/button>\s*<button class="camp-card camp-dn[\s\S]*?<\/button>/,`<button class="camp-card camp-mhoried selecionado" id="camp-kagehama" data-camp="kagehama"><span class="camp-icon">⛩</span><span class="camp-name">Kagehama</span><span class="camp-sub">As Sete Lanternas</span></button>`)
  .replace('catalogo/mhoried/checklist/checklist.html','catalog.html#checklist').replace('v11</div>','Mind · Oráculo v2</div>');
write('MindRolePlay/index.html',html);
write('MindRolePlay/src/oraculoStyles.css',fs.readFileSync('src/styles.css','utf8')+'\n/* Kagehama keeps the Oráculo layout; monochrome ink palette. */\n:root{--gold:#ddd;--gold2:#fff;--bg:#090909} .isc-logo-wrap,.isc-slot-card,.isc-cls-chip,.isc-class-detail{filter:grayscale(1)}\n');
let entry=adapt(fs.readFileSync('src/main.js','utf8')).replace("import './styles.css';","import './oraculoStyles.css';")
 .replace("from './data/classes.js'","from './oraculoClasses.js'").replace("from './firebase/roomService.js'","from './oraculoRooms.js'")
 .replace("from './firebase/config.js'","from '../../src/firebase/config.js'")
 .replace("import { startGame } from './game/turnSystem.js';",'')
 .replaceAll("'barbaro'","'ronin'").replaceAll("'Mhoried'","'Kagehama'").replaceAll("'mhoried'","'kagehama'")
 .replace("['FOR', cls.attrs.STR], ['DES', cls.attrs.DEX], ['CON', cls.attrs.CON],\n    ['INT', cls.attrs.INT], ['SAB', cls.attrs.WIS], ['CAR', cls.attrs.CHA],", "['ST', cls.attrs.ST], ['DX', cls.attrs.DX], ['IQ', cls.attrs.IQ], ['HT', cls.attrs.HT],")
 .replace("⚡ <strong>${cls.movement}</strong> MOV &nbsp;⚔️ <strong>${cls.attack}</strong> ATQ", "⚡ <strong>${cls.sp}</strong> PF &nbsp;🚶 <strong>${cls.movement}</strong> MOV")
 .replace("await startNarration(session.roomId, 'prologo');", "await startNarration(session.roomId, 'kagehama-scene-0');")
 .replace("await joinRoom(session.roomId, session.playerId, { name: session.playerName || 'Viajante', classId: session.classId });", "await joinRoom(session.roomId, session.playerId, { name: session.playerName || 'Viajante', classId: session.classId }, isHost);")
 .replace("const isHost = isMe && session.isHost;","const isHost = p.id === room.hostId;")
 .replace("session.room = room;", "session.room = room;\n    session.isHost = room.hostId === session.playerId;\n    _persistSession();")
 .replace("    if (btnIniciar) btnIniciar.style.display = hostCanStart ? '' : 'none';", "    if (btnIniciar) btnIniciar.style.display = 'none';")
 .replace("const result = startGame(session.room);", "const result = {error:'Os confrontos desta campanha usam GURPS na cena narrativa.'};")
 .replace("if (_urlParams.get('sim') === '1')", "if (_urlParams.get('sim') === '1')");
// Membership is stable across characters, as in Oráculo. Save the selected sheet separately.
entry=entry.replace("    level: 1, campaign: 'Kagehama',", "    id: crypto.randomUUID(), level: 1, campaign: 'Kagehama', attributes:cls.attributes, skills:cls.skills, gender:cls.gender,")
 .replace("  if (firebaseApp) localStorage", "  if (firebaseApp) localStorage");
write('MindRolePlay/src/oraculoEntry.js',entry);
write('MindRolePlay/src/oraculoClasses.js',`import { CLASSES_DATA } from '../../public/MindRolePlay/catalogo/kagehama/classes.js';\nexport const CLASSES=Object.fromEntries(Object.entries(CLASSES_DATA).map(([id,c])=>[id,{...c,name:c.nome}]));\nexport const standeeUrl=id=>CLASSES[id]?.standee||'';\nexport const retratoUrl=id=>CLASSES[id]?.portrait||'';\n`);
console.log('Generated Oráculo entry, narrator, world map, catalogue and Kagehama cartridge.');

execFileSync('python3',['scripts/adapt-mind-oracle.py'],{stdio:'inherit'});
