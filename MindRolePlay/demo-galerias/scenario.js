// A bounded encounter from the installed Kagehama adaptation of Mhoried.
export const SCENARIO={
 id:'kagehama-kobold-town',title:'A entrada das Galerias',enemyType:'guarda-kappa',sourceMhoried:'kobold_town',
 intro:'Vocês procuram Renkei nas Galerias dos Kappa, entre troncos ocos e passarelas de Aokiri. Quatro guardas de Bunkin bloqueiam a entrada.',
 facts:['Povoação improvisada entre árvores, com torres em troncos ocos e plataformas de corda.','Guardas patrulham em grupos e podem flanquear ou recuar quando perdem metade da patrulha.','Há dissidentes entre os kappa: negociação e discrição são alternativas ao confronto.','O encontro é um recorte da adaptação; não confirma o resgate dos prisioneiros.'],
 covers:[
 {id:'palisada',aliases:['palicada','palisada','cerca','barreira','muro'],name:'paliçada baixa',x:292,depth:28,behindX:285,behindDepth:43,material:'madeira',blocksSight:true,uses:['agachar','contornar','cobertura']},
 {id:'tronco',aliases:['tronco','arvore','cedro'],name:'tronco de cedro caído',x:650,depth:59,behindX:615,behindDepth:67,material:'madeira e musgo',blocksSight:true,uses:['agachar','contornar','cobertura']},
 {id:'caixas',aliases:['caixa','barril','barris','carga','suprimento'],name:'caixas de suprimentos',x:980,depth:24,behindX:952,behindDepth:39,material:'madeira',blocksSight:true,uses:['agachar','contornar','examinar']}
 ]
};
export function initialActors(){
 const players=[
 {id:'mage',name:'Você · Mago',short:'Mago',cm:182,x:140,depth:15,hp:18,max:18,fp:13,maxFp:13,speed:6.5,dx:13,order:0,skill:14,dodge:10,dr:1,enemy:false,cover:null,prepared:false,art:'mago',trait:'Aptidão Mágica incluída na perícia; Reflexos em Combate incluído na esquiva.'},
 {id:'archer',name:'Rei · Arqueira',short:'Rei',cm:176,x:165,depth:48,hp:17,max:17,speed:6.25,dx:14,order:1,skill:13,dodge:9,dr:1,enemy:false,cover:null,prepared:false,art:'arqueira',trait:'Visão Aguçada nos testes de percepção.'},
 {id:'warrior',name:'Akira · Guerreira',short:'Akira',cm:169,x:205,depth:66,hp:24,max:24,speed:6,dx:13,order:2,skill:14,dodge:9,dr:3,enemy:false,cover:null,prepared:false,art:'guerreira',trait:'Excesso de Confiança orienta sua escolha na simulação.'}
 ];
 const guards=[{x:370,depth:20},{x:785,depth:35},{x:1135,depth:42},{x:1000,depth:88}].map((p,i)=>({...p,id:'e'+(i+1),name:'Guarda Kappa '+(i+1),short:'K'+(i+1),cm:125,hp:10,max:10,speed:5.5,dx:11,order:i+3,skill:11,dodge:8,dr:0,enemy:true,cover:null}));
 return [...players,...guards];
}
