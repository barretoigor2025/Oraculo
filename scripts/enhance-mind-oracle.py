from pathlib import Path
r=Path(__file__).resolve().parent.parent
base=r/'public/MindRolePlay'
for name in ['conversation','director','combat','equipment','identity','dice-visual','presentation']:
 (base/(name+'.js')).write_text((r/'MindRolePlay/engine'/(name+'.js')).read_text().replace("from '../src/gurps.js'","from './gurps.js?v=9'"))
(base/'gurps.js').write_text((r/'MindRolePlay/src/gurps.js').read_text())
# Canonical maintained screens are copied last, after legacy conversion.
for name in ['narration.html','arena.html']:
 (base/name).write_text((r/'MindRolePlay/screens'/name).read_text())

(base/'catalogo/kagehama/direction.js').write_text((r/'MindRolePlay/src/campaigns/kagehama/direction.js').read_text())

(r/'MindRolePlay/src/oraculoEntry.js').write_text((r/'MindRolePlay/screens/entry.js').read_text())
