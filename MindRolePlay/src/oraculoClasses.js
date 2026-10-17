import { CLASSES_DATA } from '../../public/MindRolePlay/catalogo/kagehama/classes.js';
export const CLASSES=Object.fromEntries(Object.entries(CLASSES_DATA).map(([id,c])=>[id,{...c,name:c.nome}]));
export const standeeUrl=id=>CLASSES[id]?.standee||'';
export const retratoUrl=id=>CLASSES[id]?.portrait||'';
