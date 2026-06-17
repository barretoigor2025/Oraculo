#!/usr/bin/env python3
"""
Migration script: Steps 1-3 of the Oráculo catalog data migration.
- Step 1: Add profile fields (descFisica, personalidade, etc.) to NPC dados.json files
- Step 2: Add historia/interacao to enemy dados.json files
- Step 3: Rebuild loader.js
"""

import re
import json
import os

CATALOGO_BASE = '/home/user/Oraculo/public/catalogo/mhoried'
CAMPAIGN_JS = os.path.join(CATALOGO_BASE, 'campanha/roteiro/campaign.js')
LOADER_JS = os.path.join(CATALOGO_BASE, 'loader.js')

# ─── Parsing helpers ───────────────────────────────────────────────────────────

def parse_template_literals(content):
    """
    Parse a JS file and extract NPC/enemy objects with their backtick string fields.
    Returns a dict: npc_id -> {field: value}
    """
    results = {}

    # Find each top-level object key inside NPCS = { ... }
    # Strategy: find each "npc_xxx: {" block and parse fields within it

    # We'll iterate through the content extracting per-NPC blocks
    # Find the NPCS object
    npcs_start = content.find('export const NPCS = {')
    if npcs_start == -1:
        return results

    # Find the end of NPCS (the closing }; before CENAS)
    # We look for the comment that starts CENAS
    cenas_marker = content.find('// ─────', npcs_start + 100)
    if cenas_marker == -1:
        cenas_marker = len(content)

    npcs_block = content[npcs_start:cenas_marker]

    # Find each NPC entry: "  npc_xxx: {"
    npc_pattern = re.compile(r'\n  (npc_\w+):\s*\{')

    for m in npc_pattern.finditer(npcs_block):
        npc_id = m.group(1)
        block_start = m.start() + 1  # position of "  npc_xxx: {"

        # Find the matching closing brace for this NPC block
        # Count braces starting from the opening {
        open_brace_pos = npcs_block.find('{', block_start)
        depth = 0
        i = open_brace_pos
        while i < len(npcs_block):
            if npcs_block[i] == '{':
                depth += 1
            elif npcs_block[i] == '}':
                depth -= 1
                if depth == 0:
                    block_end = i + 1
                    break
            elif npcs_block[i] == '`':
                # Skip backtick string
                i += 1
                while i < len(npcs_block):
                    if npcs_block[i] == '\\':
                        i += 2
                        continue
                    if npcs_block[i] == '`':
                        break
                    i += 1
            i += 1

        npc_block = npcs_block[block_start:block_end]

        # Parse fields from this block
        fields = parse_npc_fields(npc_block)
        results[npc_id] = fields

    return results


def parse_npc_fields(block):
    """Parse individual fields from a single NPC block."""
    fields = {}

    # Parse backtick string fields
    # Pattern: fieldName: `...multi-line content...`
    # We need to handle multi-line backtick strings

    field_names = ['descFisica', 'personalidade', 'conhecimentos', 'formaDeFalar',
                   'historia', 'interacao', 'id', 'nome', 'sprite', 'categoria']

    for field in field_names:
        # Try backtick string
        pattern = re.compile(
            r'\b' + re.escape(field) + r'\s*:\s*`((?:[^`\\]|\\.)*)`',
            re.DOTALL
        )
        m = pattern.search(block)
        if m:
            # Unescape any escaped backticks
            value = m.group(1).replace('\\`', '`')
            fields[field] = value
            continue

        # Try single-quoted string
        pattern2 = re.compile(
            r'\b' + re.escape(field) + r"\s*:\s*'((?:[^'\\]|\\.)*)'",
        )
        m = pattern2.search(block)
        if m:
            fields[field] = m.group(1)
            continue

        # Try double-quoted string
        pattern3 = re.compile(
            r'\b' + re.escape(field) + r'\s*:\s*"((?:[^"\\]|\\.)*)"',
        )
        m = pattern3.search(block)
        if m:
            fields[field] = m.group(1)
            continue

    return fields


def parse_inimigos_from_loader(content):
    """
    Parse INIMIGOS_DATA from loader.js to extract historia and interacao for each enemy.
    """
    results = {}

    # Find INIMIGOS_DATA array
    data_start = content.find('export const INIMIGOS_DATA = [')
    if data_start == -1:
        return results

    # Find the end of the array
    array_start = content.find('[', data_start)
    depth = 0
    i = array_start
    while i < len(content):
        c = content[i]
        if c == '[' or c == '{':
            depth += 1
        elif c == ']' or c == '}':
            depth -= 1
            if depth == 0:
                array_end = i + 1
                break
        elif c == '`':
            i += 1
            while i < len(content):
                if content[i] == '\\':
                    i += 2
                    continue
                if content[i] == '`':
                    break
                i += 1
        elif c == "'":
            i += 1
            while i < len(content):
                if content[i] == '\\':
                    i += 2
                    continue
                if content[i] == "'":
                    break
                i += 1
        elif c == '"':
            i += 1
            while i < len(content):
                if content[i] == '\\':
                    i += 2
                    continue
                if content[i] == '"':
                    break
                i += 1
        i += 1

    array_content = content[array_start:array_end]

    # Find each enemy object starting with {id:'xxx'
    # We'll find each {id:'...' and parse the id, historia, interacao
    obj_pattern = re.compile(r'\{id:\'(\w+)\'')

    for m in obj_pattern.finditer(array_content):
        enemy_id = m.group(1)
        obj_start = m.start()

        # Find matching closing brace
        depth = 0
        i = obj_start
        while i < len(array_content):
            c = array_content[i]
            if c == '{':
                depth += 1
            elif c == '}':
                depth -= 1
                if depth == 0:
                    obj_end = i + 1
                    break
            elif c == "'":
                i += 1
                while i < len(array_content):
                    if array_content[i] == '\\':
                        i += 2
                        continue
                    if array_content[i] == "'":
                        break
                    i += 1
            elif c == "`":
                i += 1
                while i < len(array_content):
                    if array_content[i] == '\\':
                        i += 2
                        continue
                    if array_content[i] == "`":
                        break
                    i += 1
            i += 1

        obj_block = array_content[obj_start:obj_end]

        # Extract historia and interacao (single-quoted strings)
        fields = {}
        for field in ['historia', 'interacao']:
            # Single-quoted
            p = re.compile(r'\b' + re.escape(field) + r":'((?:[^'\\]|\\.)*)'")
            fm = p.search(obj_block)
            if fm:
                fields[field] = fm.group(1)
                continue
            # Double-quoted
            p2 = re.compile(r'\b' + re.escape(field) + r':"((?:[^"\\]|\\.)*)"')
            fm = p2.search(obj_block)
            if fm:
                fields[field] = fm.group(1)

        results[enemy_id] = fields

    return results


# ─── Step 1: Update NPC dados.json files ──────────────────────────────────────

def step1_update_npc_dados():
    print("=== Step 1: Updating NPC dados.json files ===")

    with open(CAMPAIGN_JS, 'r', encoding='utf-8') as f:
        campaign_content = f.read()

    npc_data = parse_template_literals(campaign_content)

    profile_fields = ['descFisica', 'personalidade', 'conhecimentos', 'formaDeFalar',
                      'historia', 'interacao']

    updated = 0
    for npc_id, fields in npc_data.items():
        dados_path = os.path.join(CATALOGO_BASE, 'npcs', npc_id, 'dados.json')
        if not os.path.exists(dados_path):
            print(f"  MISSING: {dados_path}")
            continue

        with open(dados_path, 'r', encoding='utf-8') as f:
            dados = json.load(f)

        changed = False
        for field in profile_fields:
            if field in fields:
                if dados.get(field) != fields[field]:
                    dados[field] = fields[field]
                    changed = True
            else:
                print(f"  WARNING: {npc_id} missing field {field} in campaign.js")

        if changed:
            with open(dados_path, 'w', encoding='utf-8') as f:
                json.dump(dados, f, ensure_ascii=False, indent=2)
            print(f"  Updated: {npc_id}")
            updated += 1
        else:
            print(f"  No change: {npc_id}")

    print(f"Step 1 complete: {updated} files updated\n")
    return npc_data


# ─── Step 2: Update enemy dados.json files ────────────────────────────────────

def step2_update_enemy_dados():
    print("=== Step 2: Updating enemy dados.json files ===")

    with open(LOADER_JS, 'r', encoding='utf-8') as f:
        loader_content = f.read()

    enemy_data = parse_inimigos_from_loader(loader_content)

    updated = 0
    for enemy_id, fields in enemy_data.items():
        dados_path = os.path.join(CATALOGO_BASE, 'inimigos', enemy_id, 'dados.json')
        if not os.path.exists(dados_path):
            print(f"  MISSING: {dados_path}")
            continue

        with open(dados_path, 'r', encoding='utf-8') as f:
            dados = json.load(f)

        changed = False
        for field in ['historia', 'interacao']:
            if field in fields and fields[field]:
                if dados.get(field) != fields[field]:
                    dados[field] = fields[field]
                    changed = True
            else:
                print(f"  WARNING: {enemy_id} missing field {field} in loader.js")

        if changed:
            with open(dados_path, 'w', encoding='utf-8') as f:
                json.dump(dados, f, ensure_ascii=False, indent=2)
            print(f"  Updated: {enemy_id}")
            updated += 1
        else:
            print(f"  No change: {enemy_id}")

    print(f"Step 2 complete: {updated} files updated\n")


# ─── Step 3: Rebuild loader.js ────────────────────────────────────────────────

def js_value(v):
    """Convert a Python value to a valid JS literal string."""
    if isinstance(v, bool):
        return 'true' if v else 'false'
    if v is None:
        return 'null'
    if isinstance(v, str):
        # Use JSON encoding which gives proper double-quoted strings
        return json.dumps(v, ensure_ascii=False)
    if isinstance(v, (int, float)):
        # Handle special float strings like '∞'
        return json.dumps(v)
    if isinstance(v, list):
        items = ', '.join(js_value(item) for item in v)
        return f'[{items}]'
    if isinstance(v, dict):
        lines = []
        for k, val in v.items():
            lines.append(f'    {k}: {js_value(val)}')
        return '{\n' + ',\n'.join(lines) + '\n  }'
    return json.dumps(v, ensure_ascii=False)


def dict_to_js_object(d, indent='  ', inner_indent='    '):
    """Convert a Python dict to a JS object literal string."""
    lines = []
    for k, v in d.items():
        js_val = value_to_js(v, inner_indent)
        lines.append(f'{inner_indent}{k}: {js_val}')
    return '{\n' + ',\n'.join(lines) + f',\n{indent}}}'


def value_to_js(v, indent='    '):
    """Recursively convert Python value to JS literal."""
    if isinstance(v, bool):
        return 'true' if v else 'false'
    if v is None:
        return 'null'
    if isinstance(v, str):
        return json.dumps(v, ensure_ascii=False)
    if isinstance(v, (int, float)):
        return json.dumps(v)
    if isinstance(v, list):
        if not v:
            return '[]'
        items = [value_to_js(item, indent + '  ') for item in v]
        inner = ', '.join(items)
        if len(inner) < 60 and '\n' not in inner:
            return f'[{inner}]'
        return '[\n' + ''.join(f'{indent}  {item},\n' for item in items) + f'{indent}]'
    if isinstance(v, dict):
        if not v:
            return '{}'
        lines = []
        for k, val in v.items():
            js_val = value_to_js(val, indent + '  ')
            lines.append(f'{indent}  {k}: {js_val}')
        return '{\n' + ',\n'.join(lines) + f',\n{indent}}}'
    return json.dumps(v, ensure_ascii=False)


def step3_rebuild_loader():
    print("=== Step 3: Rebuilding loader.js ===")

    # Read all enemy dados.json files
    enemy_ids = []
    enemy_dir = os.path.join(CATALOGO_BASE, 'inimigos')
    for d in sorted(os.listdir(enemy_dir)):
        dados_path = os.path.join(enemy_dir, d, 'dados.json')
        if os.path.exists(dados_path):
            enemy_ids.append(d)

    enemies = []
    for eid in enemy_ids:
        dados_path = os.path.join(enemy_dir, eid, 'dados.json')
        with open(dados_path, 'r', encoding='utf-8') as f:
            dados = json.load(f)
        enemies.append(dados)

    # Read all NPC dados.json files
    npc_dir = os.path.join(CATALOGO_BASE, 'npcs')
    npc_ids = []
    for d in sorted(os.listdir(npc_dir)):
        dados_path = os.path.join(npc_dir, d, 'dados.json')
        if os.path.exists(dados_path):
            npc_ids.append(d)

    npcs = {}
    for nid in npc_ids:
        dados_path = os.path.join(npc_dir, nid, 'dados.json')
        with open(dados_path, 'r', encoding='utf-8') as f:
            dados = json.load(f)
        npcs[nid] = dados

    # Build INIMIGOS_DATA array JS
    inimigos_items = []
    for e in enemies:
        # Exclude computed asset path fields if already in dados (they get added by forEach)
        # Build a clean copy without _retrato, _frente, _costas, _peca (those are computed)
        e_clean = {k: v for k, v in e.items()
                   if k not in ('_retrato', '_frente', '_costas', '_peca')}

        lines = []
        for k, v in e_clean.items():
            js_val = value_to_js(v, '    ')
            lines.append(f'    {k}: {js_val}')

        obj_str = '  {\n' + ',\n'.join(lines) + ',\n  }'
        inimigos_items.append(obj_str)

    inimigos_js = 'export const INIMIGOS_DATA = [\n' + ',\n'.join(inimigos_items) + '\n];\n'

    # Build NPCS object JS
    npc_items = []
    for nid, dados in npcs.items():
        # Remove fields that are derived/don't belong in JS inline version
        # We'll include everything from dados.json plus calculated asset paths
        dados_clean = {k: v for k, v in dados.items()
                       if k not in ('assets',)}  # assets are replaced by individual fields

        lines = []
        for k, v in dados_clean.items():
            js_val = value_to_js(v, '    ')
            lines.append(f'    {k}: {js_val}')

        # Add calculated asset paths using template literal format
        lines.append(f'    sprite: `${{BASE_CATALOGO}}/npcs/{nid}/sprites/frente/{nid}_frente.png`')
        lines.append(f'    retrato: `${{BASE_CATALOGO}}/npcs/{nid}/retrato/{nid}_retrato.png`')
        lines.append(f'    costas: `${{BASE_CATALOGO}}/npcs/{nid}/sprites/costas/{nid}_costas.png`')
        lines.append(f'    peca: `${{BASE_CATALOGO}}/npcs/{nid}/peca_tabuleiro/{nid}_peca.png`')

        obj_str = f'  {nid}: {{\n' + ',\n'.join(lines) + ',\n  }'
        npc_items.append(obj_str)

    npcs_js = 'export const NPCS = {\n' + ',\n'.join(npc_items) + '\n};\n'

    # Build the complete loader.js
    loader_content = '''// ══════════════════════════════════════════════════════════════════════
//  Oráculo — Loader da Campanha mhoried
//  Carrega dados do catálogo autocontido em catalogo/mhoried/
//  Exporta INIMIGOS_DATA e NPCS compatíveis com arena.html e catalog.html
// ══════════════════════════════════════════════════════════════════════

const CAMPANHA_ID = 'mhoried';
const BASE_CATALOGO = `catalogo/${CAMPANHA_ID}`;

// ── Helpers de caminho ────────────────────────────────────────────────

export function caminhoRetrato(tipo, id) {
  if (tipo === 'inimigo') {
    return `${BASE_CATALOGO}/inimigos/${id}/retrato/${id}_retrato.png`;
  }
  if (tipo === 'npc') {
    return `${BASE_CATALOGO}/npcs/${id}/retrato/${id}_retrato.png`;
  }
  if (tipo === 'classe') {
    return (genero) =>
      `${BASE_CATALOGO}/classes/${id}/retrato/${id}_${genero}_retrato.png`;
  }
  return '';
}

export function caminhoSpriteFrente(tipo, id) {
  if (tipo === 'inimigo') {
    return `${BASE_CATALOGO}/inimigos/${id}/sprites/frente/${id}_frente.png`;
  }
  if (tipo === 'npc') {
    return `${BASE_CATALOGO}/npcs/${id}/sprites/frente/${id}_frente.png`;
  }
  return '';
}

export function caminhoSpriteCostas(tipo, id) {
  if (tipo === 'inimigo') {
    return `${BASE_CATALOGO}/inimigos/${id}/sprites/costas/${id}_costas.png`;
  }
  if (tipo === 'npc') {
    return `${BASE_CATALOGO}/npcs/${id}/sprites/costas/${id}_costas.png`;
  }
  return '';
}

export function caminhoPeca(tipo, id) {
  if (tipo === 'inimigo') {
    return `${BASE_CATALOGO}/inimigos/${id}/peca_tabuleiro/${id}_peca.png`;
  }
  if (tipo === 'npc') {
    return `${BASE_CATALOGO}/npcs/${id}/peca_tabuleiro/${id}_peca.png`;
  }
  return '';
}

// ── Dados de inimigos ─────────────────────────────────────────────────

''' + inimigos_js + '''
// Adiciona caminhos de assets calculados automaticamente
INIMIGOS_DATA.forEach(e => {
  e._retrato    = caminhoRetrato('inimigo', e.id);
  e._frente     = caminhoSpriteFrente('inimigo', e.id);
  e._costas     = caminhoSpriteCostas('inimigo', e.id);
  e._peca       = caminhoPeca('inimigo', e.id);
});

// ── NPCs ──────────────────────────────────────────────────────────────

''' + npcs_js + '''
export default { INIMIGOS_DATA, NPCS, caminhoRetrato, caminhoSpriteFrente, caminhoSpriteCostas, caminhoPeca };
'''

    # Fix template literals in loader content - the JS template literals for asset paths
    # need to use actual backticks, not escaped ones. The Python string above already has
    # ${BASE_CATALOGO} which needs to be in backtick strings in the output.
    # Let's verify the asset paths lines look right - they should have backticks

    with open(LOADER_JS, 'w', encoding='utf-8') as f:
        f.write(loader_content)

    print(f"  Written: {LOADER_JS}")
    print(f"  Enemies: {len(enemies)}, NPCs: {len(npcs)}")
    print("Step 3 complete\n")


if __name__ == '__main__':
    step1_update_npc_dados()
    step2_update_enemy_dados()
    step3_rebuild_loader()
    print("All steps complete!")
