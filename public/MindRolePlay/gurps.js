function numberOr(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function roll3d6(random = Math.random) {
  const dice = Array.from({ length: 3 }, () => Math.floor(random() * 6) + 1);
  return { dice, total: dice.reduce((sum, die) => sum + die, 0) };
}

export function resolveSuccessTest({ dice, skill, conditionModifier = 0, situationalModifier = 0, allowLowSkill = false }) {
  if (!Array.isArray(dice) || dice.length !== 3 || dice.some(die => !Number.isInteger(die) || die < 1 || die > 6)) {
    throw new TypeError('A jogada precisa ter exatamente três dados de seis faces.');
  }

  const total = dice.reduce((sum, die) => sum + die, 0);
  const baseSkill = numberOr(skill);
  const modifiers = numberOr(conditionModifier) + numberOr(situationalModifier);
  const effectiveSkill = baseSkill + modifiers;
  if(effectiveSkill<3&&!allowLowSkill)throw new RangeError('O nível efetivo é menor que 3. Altere a abordagem ou os modificadores antes de rolar.');

  const criticalSuccess =
    total === 3 ||
    total === 4 ||
    (total === 5 && effectiveSkill >= 15) ||
    (total === 6 && effectiveSkill >= 16);

  const criticalFailure =
    total === 18 ||
    (total === 17 && effectiveSkill <= 15) ||
    (!criticalSuccess && total >= effectiveSkill + 10);

  const success = criticalSuccess || (!criticalFailure && total < 17 && total <= effectiveSkill);
  const margin = success ? effectiveSkill - total : total - effectiveSkill;

  return {
    dice,
    total,
    baseSkill,
    modifiers,
    effectiveSkill,
    success,
    criticalSuccess: criticalSuccess && success,
    criticalFailure,
    margin,
    outcome: criticalFailure ? 'falha crítica' :
      criticalSuccess && success ? 'sucesso crítico' :
      success ? 'sucesso' : 'falha',
  };
}

export function derivedStats(sheet) {
  const a = sheet.attributes || sheet.attrs || sheet;
  const ST = numberOr(a.ST, 10), DX = numberOr(a.DX, 10), IQ = numberOr(a.IQ, 10), HT = numberOr(a.HT, 10);
  const speed = (DX + HT) / 4;
  return { ST, DX, IQ, HT, HP: numberOr(sheet.maxHp, ST), FP: numberOr(sheet.maxFp ?? sheet.sp, HT), Will: numberOr(a.Will, IQ), Per: numberOr(a.Per, IQ), speed, move: Math.floor(speed), dodge: Math.floor(speed) + 3 };
}
export function sheetSkills(sheet) {
  const stats = derivedStats(sheet);
  return [...(sheet.skills || []), ...['ST','DX','IQ','HT','Will','Per'].map(name=>({name,level:stats[name]})), {name:'Percepção',level:stats.Per}];
}
export function skillLevel(sheet, name) {
  const norm = s => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  const skill = sheetSkills(sheet).find(s=>norm(s.name)===norm(name));
  return skill ? Number(skill.level) : null;
}
export function conditionModifier(sheet, skillName) {
  return (sheet.conditions || []).filter(c=>c.active!==false && (!c.skills?.length || c.skills.includes(skillName)))
    .reduce((sum,c)=>sum+numberOr(c.modifier),0);
}
export function test3d6(skill = 12, options = {}) {
  return resolveSuccessTest({ ...roll3d6(options.random), skill, ...options });
}
export function quickContest(first, second) {
  if (first.success !== second.success) return first.success ? 1 : -1;
  const a = first.effectiveSkill - first.total, b = second.effectiveSkill - second.total;
  return Math.sign(a-b);
}
