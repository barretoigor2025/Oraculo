export const CLASSES = {
  barbaro: {
    id: 'barbaro',
    name: 'Barbaro',
    icon: '🪓',
    maxHp: 14,
    attack: 4,
    movement: 5,
  },
  ladino: {
    id: 'ladino',
    name: 'Ladino',
    icon: '🗡️',
    maxHp: 10,
    attack: 3,
    movement: 6,
  },
  mago: {
    id: 'mago',
    name: 'Mago',
    icon: '🔮',
    maxHp: 8,
    attack: 5,
    movement: 3,
  },
};

export function getClassById(classId) {
  return CLASSES[classId] ?? CLASSES.barbaro;
}
