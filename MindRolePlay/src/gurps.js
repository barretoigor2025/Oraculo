function numberOr(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function roll3d6(random = Math.random) {
  const dice = Array.from({ length: 3 }, () => Math.floor(random() * 6) + 1);
  return { dice, total: dice.reduce((sum, die) => sum + die, 0) };
}

export function resolveSuccessTest({ dice, skill, conditionModifier = 0, situationalModifier = 0 }) {
  if (!Array.isArray(dice) || dice.length !== 3 || dice.some(die => die < 1 || die > 6)) {
    throw new TypeError('A jogada precisa ter exatamente três dados de seis faces.');
  }

  const total = dice.reduce((sum, die) => sum + die, 0);
  const baseSkill = numberOr(skill);
  const modifiers = numberOr(conditionModifier) + numberOr(situationalModifier);
  const effectiveSkill = baseSkill + modifiers;

  const criticalSuccess =
    total === 3 ||
    total === 4 ||
    (total === 5 && effectiveSkill >= 15) ||
    (total === 6 && effectiveSkill >= 16);

  const criticalFailure =
    total === 18 ||
    (total === 17 && effectiveSkill <= 15) ||
    total >= effectiveSkill + 10;

  const success = !criticalFailure && total <= effectiveSkill;
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
