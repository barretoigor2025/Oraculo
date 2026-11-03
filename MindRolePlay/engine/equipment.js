// Explicit starting equipment for this cartridge. No hidden d20 bonuses.
const gear = {
 ronin:{dr:2,weapon:{name:'Nodachi',skill:13,damage:'2d6+3',type:'cut',ranged:false}},
 samurai:{dr:4,weapon:{name:'Katana',skill:13,damage:'1d6+3',type:'cut',ranged:false}},
 kyudoka:{dr:0,weapon:{name:'Yumi (ST 11)',skill:14,damage:'1d6+1',type:'imp',ranged:true,reload:2}},
 shinobi:{dr:1,weapon:{name:'Tantō (nível por omissão DX-4)',skill:10,damage:'1d6-3',type:'imp',ranged:false}},
 onmyoji:{dr:0,weapon:{name:'Bastão (nível por omissão DX-5)',skill:6,damage:'1d6+1',type:'cr',ranged:false}},
 miko:{dr:0,weapon:{name:'Bastão (nível por omissão DX-5)',skill:6,damage:'1d6+2',type:'cr',ranged:false}},
};
export function equipmentFor(classId){return structuredClone(gear[classId?.replace(/_f$/,'')]||{});}
