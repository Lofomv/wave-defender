/**
 * WAVE DEFENDER — Game Engine (V4 - AUDITED & FIXED)
 * Audited by: @game-developer @frontend-specialist @product-owner @debugger
 */

// ══════════════════════════════════════════════
// DATA: STRUCTURES
// ══════════════════════════════════════════════

const STRUCTS = {
    archer: {
        name: 'Arqueiro', icon: '🏹', color: '#2ecc71', rgb: '46, 204, 113', type: 'physical',
        tags: ['ranged', 'physical'],
        levels: [
            { atk: 5, spd: 5, desc: 'Tiro rápido' },
            { atk: 10, spd: 4, desc: 'Tiro duplo', targets: 2 },
            { atk: 16, spd: 3, desc: 'Chuva de flechas (3 alvos)', targets: 3 },
            { atk: 24, spd: 2, desc: '[EVO] Rajada (5 alvos)', targets: 5 }
        ]
    },
    sniper: {
        name: 'Atirador', icon: '🎯', color: '#34495e', rgb: '52, 73, 94', type: 'physical',
        tags: ['ranged', 'heavy', 'physical'],
        levels: [
            { atk: 18, spd: 14, desc: 'Foca no mais forte', focusStrongest: true },
            { atk: 32, spd: 12, desc: 'Perfura 50% armadura', focusStrongest: true, armorPen: 0.5 },
            { atk: 50, spd: 10, desc: 'Execução: 1.5x HP<30%', focusStrongest: true, execute: 0.3 },
            { atk: 80, spd: 8, desc: '[EVO] Headshot <15%', focusStrongest: true, armorPen: 0.8, execute: 0.3, instakill: 0.15 }
        ]
    },
    barricade: {
        name: 'Muralha', icon: '🛡️', color: '#7f8c8d', rgb: '127, 140, 141', type: 'physical',
        passive: true, isBarricade: true, tags: ['defense', 'heavy', 'physical'],
        levels: [
            { hp: 50, thorns: 0, desc: 'Absorve 50 de dano' },
            { hp: 120, thorns: 5, desc: '120 HP + Espinhos(5)' },
            { hp: 220, thorns: 12, regen: 10, desc: '220 HP + Espinhos + Regen' },
            { hp: 450, thorns: 30, regen: 25, desc: '[EVO] Bastião Intransponível' }
        ]
    },
    forge: {
        name: 'Forja', icon: '⚒️', color: '#95a5a6', rgb: '149, 165, 166', type: 'physical',
        passive: true, tags: ['buff', 'industrial', 'physical'],
        levels: [
            { desc: 'Torres adj. +25% vel.', spdBuff: 0.25 },
            { desc: '+40% vel.', spdBuff: 0.40 },
            { desc: '+40% vel. + 10% dano', spdBuff: 0.40, atkBuff: 0.1 },
            { desc: '[EVO] +60% vel. +25% dano', spdBuff: 0.60, atkBuff: 0.25 }
        ]
    },
    mage: {
        name: 'Mago', icon: '🧙', color: '#9b59b6', rgb: '155, 89, 182', type: 'magical',
        tags: ['magic', 'elemental'],
        levels: [
            { atk: 9, spd: 10, desc: 'Projétil arcano' },
            { atk: 16, spd: 8, desc: 'Congela (2 turnos)', freeze: 2 },
            { atk: 28, spd: 7, desc: 'Ignora armadura + congela', freeze: 3, noArmor: true },
            { atk: 44, spd: 5, desc: '[EVO] Vórtice Arcano', freeze: 4, noArmor: true }
        ]
    },
    fire: {
        name: 'Torre Fogo', icon: '🔥', color: '#e67e22', rgb: '230, 126, 34', type: 'magical',
        tags: ['elemental', 'aoe', 'magic'],
        levels: [
            { atk: 3, spd: 7, desc: 'Chama + DOT', targets: 1, dot: 2 },
            { atk: 6, spd: 6, desc: 'Queima 2 alvos', targets: 2, dot: 3 },
            { atk: 11, spd: 5, desc: 'Inferno 3 alvos', targets: 3, dot: 5 },
            { atk: 20, spd: 4, desc: '[EVO] Imolação', targets: 5, dot: 10 }
        ]
    },
    tesla: {
        name: 'Tesla', icon: '⚡', color: '#f1c40f', rgb: '241, 196, 15', type: 'magical',
        tags: ['magic', 'electric'],
        levels: [
            { atk: 5, spd: 8, desc: 'Raio cadeia (2)', targets: 2 },
            { atk: 10, spd: 7, desc: 'Raio cadeia (3)', targets: 3 },
            { atk: 16, spd: 6, desc: 'Tempestade (todos)', targets: 99 },
            { atk: 30, spd: 5, desc: '[EVO] Plasma', targets: 99 }
        ]
    },
    library: {
        name: 'Biblioteca', icon: '📚', color: '#3498db', rgb: '52, 152, 219', type: 'magical',
        passive: true, tags: ['buff', 'knowledge', 'magic'],
        levels: [
            { desc: 'Torres adj. +1 nível', levelBuff: 1 },
            { desc: '+1 nível + 20% dano', levelBuff: 1, atkBuff: 0.2 },
            { desc: '+2 níveis + 20% dano', levelBuff: 2, atkBuff: 0.2 },
            { desc: '[EVO] Desperta LV5 Deus', levelBuff: 2, atkBuff: 0.4, godAwaken: true }
        ]
    },
    venom: {
        name: 'Lab. Químico', icon: '🧪', color: '#8e44ad', rgb: '142, 68, 173', type: 'magical',
        passive: true, tags: ['buff', 'poison', 'magic'],
        levels: [
            { desc: 'Torres adj. DOT: 2', poisonGrant: 2 },
            { desc: 'DOT: 4', poisonGrant: 4 },
            { desc: 'DOT: 7', poisonGrant: 7 },
            { desc: '[EVO] DOT: 15 -30% arm.', poisonGrant: 15, armorReduce: 0.3 }
        ]
    },
    shrine: {
        name: 'Santuário', icon: '⛩️', color: '#1abc9c', rgb: '26, 188, 156', type: 'magical',
        passive: true, tags: ['heal', 'magic'],
        levels: [
            { heal: 4, maxhp: 2, desc: '+4 HP +2 MaxHP/wave' },
            { heal: 8, maxhp: 3, desc: '+8 HP +3 MaxHP/wave' },
            { heal: 14, maxhp: 6, desc: 'Restauração divina' },
            { heal: 30, maxhp: 12, desc: '[EVO] Fonte Eterna' }
        ]
    },
    obelisk: {
        name: 'Obelisco', icon: '🗿', color: '#e74c3c', rgb: '231, 76, 60', type: 'magical',
        passive: true, tags: ['buff', 'magic'],
        levels: [
            { desc: 'Mágicas adj. +30% dano', boostMagical: 0.3 },
            { desc: '+60% dano mágico', boostMagical: 0.6 },
            { desc: '+60% + Congela', boostMagical: 0.6, freezeAura: true },
            { desc: '[EVO] +120% dano mágico', boostMagical: 1.2, freezeAura: true }
        ]
    }
};

const COMBOS = [
    { tags: [['elemental'], ['magic']], name: 'FLUXO MÁGICO', desc: '+40% Elemental adj. Mágico', bonus: 'dmg', val: 0.4 },
    { tags: [['electric'], ['knowledge']], name: 'HIPER-PROCESSAMENTO', desc: 'Tesla adj. Biblioteca +40% vel.', bonus: 'spd', val: 0.4 },
    { tags: [['heavy'], ['defense']], name: 'BALUARTE', desc: 'Pesadas adj. Muralha +30%', bonus: 'dmg', val: 0.3 },
    { tags: [['poison'], ['aoe']], name: 'NUVEM TÓXICA', desc: 'DOT dobrado', bonus: 'dot', val: 1.0 },
    { tags: [['ranged'], ['industrial']], name: 'MECANISMO AUTO.', desc: 'Ranged adj. Forja +60% vel.', bonus: 'spd', val: 0.6 },
    { tags: [['magic'], ['heal']], name: 'REGEN. ARCANA', desc: 'Cura do Santuário +50%', bonus: 'heal', val: 0.5 },
    { tags: [['defense'], ['elemental']], name: 'ESCUDO ELEMENTAL', desc: 'Muralha adj. Elemental +50% HP', bonus: 'wall_hp', val: 0.5 },
    { tags: [['physical'], ['knowledge']], name: 'TÁTICA AVANÇADA', desc: 'Físicas adj. Biblioteca +25%', bonus: 'dmg_phys', val: 0.25 },
];

const ENEMIES_DB = [
    { name: 'Slime',           icon: '💧', hp: 12,  atk: 1,  armor: 0,  tier: 0 },
    { name: 'Goblin',          icon: '👺', hp: 24,  atk: 3,  armor: 0,  tier: 1 },
    { name: 'Orc Guerreiro',   icon: '🪓', hp: 50,  atk: 6,  armor: 1,  tier: 2 },
    { name: 'Mago Sombrio',    icon: '🔮', hp: 90,  atk: 11, armor: 1,  tier: 3 },
    { name: 'Cavaleiro Morto', icon: '🏇', hp: 160, atk: 20, armor: 3,  tier: 4 },
    { name: 'Wyvern',          icon: '🐉', hp: 320, atk: 30, armor: 6,  tier: 5 },
    { name: 'General Kolossus',icon: '🧱', hp: 750, atk: 55, armor: 12, tier: 6 },
];

// ══════════════════════════════════════════════
// STATE
// ══════════════════════════════════════════════

let G = {
    wave: 1, hp: 30, maxHp: 30, coins: 0, gridSize: 3,
    cells: [], phase: 'idle', placing: null, placingName: null,
    isStarterPick: false, timer: null, activeCombos: [],
    kills: 0, pendingReward: false,
    highScore: parseInt(localStorage.getItem('wdHS') || '1'),
    highKills: parseInt(localStorage.getItem('wdHK') || '0'),
};

// ══════════════════════════════════════════════
// CORE
// ══════════════════════════════════════════════

function initGrid() {
    G.cells = [];
    for (let i = 0; i < G.gridSize * G.gridSize; i++) G.cells.push({ struct: null, level: 0, hp: null });
}
function resetGame() {
    clearInterval(G.timer);
    G = {
        wave: 1, hp: 30, maxHp: 30, coins: 0, gridSize: 3,
        cells: [], phase: 'idle', placing: null, placingName: null,
        isStarterPick: false, timer: null, activeCombos: [],
        kills: 0, pendingReward: false,
        highScore: parseInt(localStorage.getItem('wdHS') || '1'),
        highKills: parseInt(localStorage.getItem('wdHK') || '0'),
    };
    initGrid();
    document.getElementById('game-over').classList.remove('active');
    document.getElementById('battle-log').innerHTML = '';
    closeShop();
    addLog('// SISTEMA REINICIADO', 'info');
    updateHUD(); renderGrid(); showStarter();
}
function saveRecord() {
    if (G.wave > G.highScore) { G.highScore = G.wave; localStorage.setItem('wdHS', String(G.highScore)); }
    if (G.kills > G.highKills) { G.highKills = G.kills; localStorage.setItem('wdHK', String(G.highKills)); }
}
function getAdj(idx) {
    const n = G.gridSize, r = Math.floor(idx / n), c = idx % n, a = [];
    if (r > 0) a.push(idx - n); if (r < n - 1) a.push(idx + n);
    if (c > 0) a.push(idx - 1); if (c < n - 1) a.push(idx + 1);
    return a;
}
function clampLevel(lv) { return Math.min(lv, 3); }

function getEffLevel(idx) {
    const cell = G.cells[idx];
    if (!cell || !cell.struct) return 0;
    let base = clampLevel(cell.level);
    let eff = base, adjLibLv = -1;
    getAdj(idx).forEach(n => {
        const nc = G.cells[n];
        if (nc && nc.struct === 'library') {
            const bl = clampLevel(nc.level);
            eff += STRUCTS.library.levels[bl].levelBuff || 0;
            if (bl > adjLibLv) adjLibLv = bl;
        }
    });
    if (base === 3 && adjLibLv === 3) return 4; // God Mode
    return Math.min(eff, 3);
}
function getPoisonInfusion(idx) {
    let p = 0;
    getAdj(idx).forEach(n => {
        const nc = G.cells[n];
        if (nc && nc.struct === 'venom') p = Math.max(p, STRUCTS.venom.levels[clampLevel(nc.level)].poisonGrant || 0);
    });
    return p;
}
function getPoisonArmorReduce(idx) {
    let r = 0;
    getAdj(idx).forEach(n => {
        const nc = G.cells[n];
        if (nc && nc.struct === 'venom') r = Math.max(r, STRUCTS.venom.levels[clampLevel(nc.level)].armorReduce || 0);
    });
    return r;
}

// ══════════════════════════════════════════════
// COMBO DETECTION (FIXED: requires tags from DIFFERENT towers)
// ══════════════════════════════════════════════

function detectCombos() {
    G.activeCombos = [];
    const seen = new Set();
    G.cells.forEach((cell, i) => {
        if (!cell.struct) return;
        const tagsA = STRUCTS[cell.struct].tags;
        getAdj(i).forEach(j => {
            const nc = G.cells[j];
            if (!nc || !nc.struct) return;
            const tagsB = STRUCTS[nc.struct].tags;
            COMBOS.forEach(combo => {
                // combo.tags is [[tagSet1], [tagSet2]] — first must come from one tower, second from the other
                const [req1, req2] = combo.tags;
                const match = (req1.every(t => tagsA.includes(t)) && req2.every(t => tagsB.includes(t))) ||
                              (req1.every(t => tagsB.includes(t)) && req2.every(t => tagsA.includes(t)));
                if (match) {
                    const key = Math.min(i, j) + '-' + Math.max(i, j) + combo.name;
                    if (!seen.has(key)) { seen.add(key); G.activeCombos.push({ ...combo, cells: [i, j] }); }
                }
            });
        });
    });
}

// ══════════════════════════════════════════════
// HUD
// ══════════════════════════════════════════════

function updateHUD() {
    document.getElementById('h-wave').textContent = G.wave;
    document.getElementById('h-hp').textContent = Math.max(0, Math.ceil(G.hp));
    document.getElementById('h-maxhp').textContent = G.maxHp;
    document.getElementById('h-record').textContent = G.highScore;
    document.getElementById('h-kills').textContent = G.kills;
    document.getElementById('h-coins').textContent = Math.floor(G.coins);
    const sv = document.getElementById('shop-coins-val');
    if (sv) sv.textContent = Math.floor(G.coins);

    const hpPct = Math.max(0, (G.hp / G.maxHp) * 100);
    const fill = document.getElementById('h-hp-fill');
    fill.style.width = hpPct + '%';
    fill.style.backgroundColor = hpPct > 60 ? 'var(--green)' : hpPct > 30 ? 'var(--gold)' : 'var(--accent2)';

    const b = document.getElementById('phase-badge');
    const labels = { idle: 'PREPARAÇÃO', wave: 'EM BATALHA', pick: 'ESCOLHA', place: 'POSICIONANDO', shop: 'MERCADO' };
    b.textContent = labels[G.phase] || G.phase.toUpperCase();
    b.className = `badge badge-phase-${G.phase}`;

    document.getElementById('btn-start').disabled = G.phase !== 'idle';
    document.getElementById('btn-start').textContent = `▶ WAVE ${G.wave}`;
    document.getElementById('btn-shop').disabled = G.phase === 'wave';
}

function addLog(msg, type = '') {
    const el = document.getElementById('battle-log');
    const d = document.createElement('div');
    d.className = 'log-entry' + (type ? ` log-${type}` : '');
    d.textContent = msg;
    el.prepend(d);
    while (el.childNodes.length > 50) el.removeChild(el.lastChild);
}
function flash(c) { const e = document.getElementById(`flash-${c}`); e.classList.add('active-flash'); setTimeout(() => e.classList.remove('active-flash'), 120); }
function showToast(m) { const t = document.getElementById('toast'); t.textContent = m; t.classList.add('show'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), 2200); }
function spawnText(x, y, text, type) {
    const c = document.getElementById('particles-container'), d = document.createElement('div');
    d.className = `float-text float-${type}`;
    d.style.left = `${x + Math.random()*30 - 15}px`; d.style.top = `${y}px`;
    d.textContent = text; c.appendChild(d); setTimeout(() => d.remove(), 1000);
}

// ══════════════════════════════════════════════
// GRID RENDER
// ══════════════════════════════════════════════

function renderGrid() {
    const c = document.getElementById('grid-container');
    c.style.gridTemplateColumns = `repeat(${G.gridSize}, 85px)`;
    c.innerHTML = '';
    detectCombos();
    const comboSet = new Set(G.activeCombos.flatMap(x => x.cells));

    G.cells.forEach((cell, i) => {
        const div = document.createElement('div');
        div.className = 'cell';

        if (cell.struct) {
            const s = STRUCTS[cell.struct];
            const baseLv = clampLevel(cell.level);
            const effLv = getEffLevel(i);
            div.classList.add('occupied', `type-${s.type}`);
            if (comboSet.has(i)) div.classList.add('combo-active');
            if (baseLv >= 3) div.classList.add('evo-lv4');
            if (effLv >= 4) div.classList.add('evo-lv5');
            div.style.setProperty('--sc', s.color);
            div.style.setProperty('--sr', s.rgb);

            const poisonInf = getPoisonInfusion(i);
            let html = '';
            if (poisonInf > 0 && !s.tags.includes('poison')) html += '<div class="poison-aura"></div>';

            const typeBadge = s.type === 'physical' ? '🗡️' : '✨';
            html += `<span class="cell-type-badge">${typeBadge}</span>`;
            html += `<span class="cell-level">NV${baseLv + 1}</span>`;
            if (effLv > baseLv) html += `<span class="cell-bonus">+${effLv - baseLv}</span>`;
            html += `<span class="cell-icon">${s.icon}</span><span class="cell-name">${s.name}</span>`;

            if (s.isBarricade && cell.hp !== null) {
                const mhp = s.levels[baseLv].hp;
                html += `<div class="hp-bar"><div class="hp-fill" style="width:${(Math.max(0, cell.hp) / mhp) * 100}%"></div></div>`;
            }
            div.innerHTML = html;
            div.title = `${s.name} NV${effLv + 1} — ${s.levels[Math.min(effLv, 3)]?.desc || 'Divino'}\n${s.type === 'physical' ? 'FÍSICO' : 'MÁGICO'}`;
            div.onmouseenter = () => highlightSynergy(i);
            div.onmouseleave = clearSynergy;
            div.onclick = () => { if (G.phase === 'place') placeAt(i); };

            // Right-click to sell (idle/pick phases only)
            div.oncontextmenu = (e) => {
                e.preventDefault();
                if (G.phase !== 'idle' && G.phase !== 'pick') return;
                const refund = Math.floor(10 + G.wave * 2);
                G.coins += refund;
                addLog(`💰 ${s.name} vendido (+${refund}🪙)`, 'coin');
                G.cells[i] = { struct: null, level: 0, hp: null };
                updateHUD(); renderGrid();
            };
        } else if (G.phase === 'place') {
            div.classList.add('placeable');
            div.onclick = () => placeAt(i);
            div.innerHTML = '<span style="font-size:24px;opacity:.3">+</span>';
        } else {
            div.classList.add('empty');
            div.innerHTML = '·';
        }
        c.appendChild(div);
    });
}

function highlightSynergy(idx) {
    if (G.phase !== 'idle' && G.phase !== 'pick') return;
    const s = STRUCTS[G.cells[idx]?.struct]; if (!s) return;
    const els = document.getElementById('grid-container').children;
    els[idx].classList.add('synergy-source');
    getAdj(idx).forEach(n => {
        if (G.cells[n].struct && (s.passive || STRUCTS[G.cells[n].struct].passive)) els[n].classList.add('synergy-target');
    });
    G.activeCombos.forEach(c => { if (c.cells.includes(idx)) c.cells.forEach(ci => { if (ci !== idx) els[ci].classList.add('synergy-target'); }); });
}
function clearSynergy() { Array.from(document.getElementById('grid-container').children).forEach(el => el.classList.remove('synergy-source', 'synergy-target')); }

function renderEnemies(enemies) {
    const el = document.getElementById('enemy-list'); el.innerHTML = '';
    enemies.forEach((e, i) => {
        const d = document.createElement('div'); d.className = 'enemy-unit';
        if (i === 0) d.classList.add('targeted');
        const pct = Math.max(0, e.hp / e.maxHp) * 100;
        let st = '';
        if (e.frozen > 0) st += '<div class="status-icon" style="color:var(--blue)">❄</div>';
        if (e.dot > 0) st += '<div class="status-icon" style="color:#e67e22;left:-5px;right:auto">🔥</div>';
        d.innerHTML = `${e.icon}<div class="enemy-hp"><div class="enemy-hp-fill" style="width:${pct}%"></div></div>${st}`;
        d.title = `${e.name} | HP:${Math.max(0,Math.ceil(e.hp))}/${e.maxHp} | ATK:${e.atk} | ARM:${e.armor}`;
        el.appendChild(d);
    });
}

// ══════════════════════════════════════════════
// WAVE BUILDER (BALANCED SCALING)
// ══════════════════════════════════════════════

function buildWave() {
    const w = G.wave;
    const mainTier = Math.min(Math.floor((w - 1) / 2), ENEMIES_DB.length - 1);
    const subTier = Math.max(0, mainTier - 1);
    const count = Math.min(3 + Math.floor(w * 0.5), 14); // Increased count limit slightly
    
    let scale = 1 + (w - 1) * 0.12; // Base scaling
    if (w >= 20) {
        scale += Math.pow(w - 19, 1.4) * 0.25; // Significant non-linear jump starting wave 20
    }
    
    const enemies = [];

    for (let i = 0; i < count; i++) {
        const isBoss = (w % 10 === 0) && (i === count - 1); // Boss every 10 waves
        const base = isBoss ? ENEMIES_DB[Math.min(mainTier + 1, ENEMIES_DB.length - 1)] : ENEMIES_DB[i < count * 0.6 ? mainTier : subTier];
        const bs = isBoss ? 3.0 : 1; // Bosses are even tougher since they are rarer
        const ba = isBoss ? 1.5 : 1;

        enemies.push({
            ...base,
            hp: Math.ceil(base.hp * scale * bs),
            maxHp: Math.ceil(base.hp * scale * bs),
            atk: Math.ceil(base.atk * scale * ba),
            armor: base.armor + Math.floor(w / 6) + (w >= 20 ? Math.floor((w-19)/2) : 0), // Armor also jumps post w20
            coinValue: Math.ceil((base.tier * 2 + 1 + w * 0.3) * (isBoss ? 10 : 1)), // Boss gives 10x coins
            frozen: 0, dot: 0, isBoss,
        });
    }
    enemies.sort((a, b) => (b.isBoss ? 1 : 0) - (a.isBoss ? 1 : 0));
    return enemies;
}

// ══════════════════════════════════════════════
// COMBAT
// ══════════════════════════════════════════════

function startWave() {
    if (G.phase !== 'idle') return;
    closeShop();
    G.phase = 'wave';
    updateHUD();
    addLog(`⚔ WAVE ${G.wave}`, 'bad');

    detectCombos();
    G.activeCombos.forEach(c => { addLog(`⚡ ${c.name}`, 'special'); showToast(`⚡ ${c.name}`); });

    let enemies = buildWave();
    renderEnemies(enemies);

    const towers = [];
    G.cells.forEach((c, i) => {
        if (!c.struct || STRUCTS[c.struct].passive) return;
        const s = STRUCTS[c.struct];
        const eff = getEffLevel(i);
        const ldat = s.levels[Math.min(eff, 3)];
        let spdMult = 0, atkMult = 1;

        getAdj(i).forEach(n => {
            const nc = G.cells[n]; if (!nc || !nc.struct) return;
            const bLvl = clampLevel(nc.level);
            if (nc.struct === 'forge') { spdMult += STRUCTS.forge.levels[bLvl].spdBuff || 0; if (STRUCTS.forge.levels[bLvl].atkBuff) atkMult += STRUCTS.forge.levels[bLvl].atkBuff; }
            if (nc.struct === 'library' && STRUCTS.library.levels[bLvl].atkBuff) atkMult += STRUCTS.library.levels[bLvl].atkBuff;
            if (nc.struct === 'obelisk' && s.type === 'magical') atkMult += STRUCTS.obelisk.levels[bLvl].boostMagical || 0;
        });

        const poisonAdd = getPoisonInfusion(i), poisonArmRed = getPoisonArmorReduce(i);

        G.activeCombos.forEach(co => {
            if (!co.cells.includes(i)) return;
            if (co.bonus === 'spd') spdMult += co.val;
            if (co.bonus === 'dmg') atkMult += co.val;
            if (co.bonus === 'dmg_phys' && s.type === 'physical') atkMult += co.val;
        });

        if (eff === 4) atkMult *= 1.5;
        const hasGodObelisk = getAdj(i).some(n => G.cells[n]?.struct === 'obelisk' && clampLevel(G.cells[n].level) >= 2 && s.type === 'magical');
        const finalSpd = Math.max(1, Math.round((ldat.spd || 10) / (1 + spdMult)));
        const finalAtk = Math.ceil((ldat.atk || 0) * atkMult);

        towers.push({ ...ldat, icon: s.icon, idx: i, spd: finalSpd, atk: finalAtk, timer: 0, tags: s.tags, type: s.type, extraPoison: poisonAdd, extraPoisonArmor: poisonArmRed, freezeAura: hasGodObelisk });
    });

    let tick = 0, renderFrame = 0;
    G.timer = setInterval(() => {
        tick++; renderFrame++;

        // DOT every 8 ticks
        if (tick % 8 === 0) {
            enemies.forEach(e => {
                if (e.dot > 0) { let d = e.dot; G.activeCombos.forEach(c => { if (c.bonus === 'dot') d = Math.ceil(d * (1 + c.val)); }); e.hp -= d; }
                if (e.frozen > 0) e.frozen--;
            });
            let bf = enemies.length;
            enemies = enemies.filter(e => { if (e.hp <= 0) { enemyDie(e); return false; } return true; });
            if (enemies.length !== bf) renderFrame = 5;
        }

        // Tower attacks
        towers.forEach(t => {
            t.timer++; if (t.timer < t.spd || !enemies.length) return; t.timer = 0;
            const tgts = t.focusStrongest ? [[...enemies].sort((a,b) => b.hp - a.hp)[0]] : enemies.slice(0, t.targets || 1);
            tgts.forEach(e => {
                if (!e) return;
                if (t.instakill && e.hp/e.maxHp <= t.instakill && !e.isBoss) { e.hp = 0; addLog(`🎯 HEADSHOT!`, 'special'); return; }
                let dmg = t.atk;
                if (t.execute && e.hp / e.maxHp <= t.execute) dmg = Math.ceil(dmg * 1.5);
                let arm = e.armor;
                if (e.dot > 0 && t.extraPoisonArmor > 0) arm = Math.max(0, arm - Math.floor(arm * t.extraPoisonArmor));
                const effArm = t.noArmor ? 0 : arm * (1 - (t.armorPen || 0));
                dmg = Math.max(1, dmg - effArm);
                if (e.frozen > 0) dmg = Math.ceil(dmg * 1.3);
                e.hp -= dmg;
                if (t.freeze) e.frozen = Math.max(e.frozen, t.freeze);
                if (t.freezeAura && !e.frozen) e.frozen = 1;
                if (t.extraPoison > 0) e.dot = Math.max(e.dot, t.extraPoison);
                if (t.dot) e.dot = Math.max(e.dot, t.dot);
            });
            let bf = enemies.length;
            enemies = enemies.filter(e => { if (e.hp <= 0) { enemyDie(e); return false; } return true; });
            if (enemies.length !== bf) renderFrame = 5;
        });

        // Enemy attacks every 12 ticks
        if (tick % 12 === 0 && enemies.length) {
            let totalDmg = enemies.filter(e => e.frozen <= 0).reduce((s, e) => s + e.atk, 0);
            for (let i = 0; i < G.cells.length && totalDmg > 0; i++) {
                const bc = G.cells[i];
                if (!bc.struct || !STRUCTS[bc.struct].isBarricade || bc.hp <= 0) continue;
                const abs = Math.min(bc.hp, totalDmg); bc.hp -= abs; totalDmg -= abs;
                const bLv = clampLevel(bc.level);
                const th = STRUCTS[bc.struct].levels[bLv].thorns;
                if (th > 0) enemies.filter(e => e.frozen <= 0).forEach(e => e.hp -= th);
                if (bc.hp <= 0) { addLog(`💥 Muralha rompida!`, 'bad'); bc.struct = null; bc.hp = null; bc.level = 0; renderGrid(); }
                else { const bel = document.getElementById('grid-container').children[i]?.querySelector('.hp-fill'); if (bel) bel.style.width = (Math.max(0, bc.hp) / STRUCTS[bc.struct].levels[bLv].hp * 100) + '%'; }
            }
            enemies = enemies.filter(e => { if (e.hp <= 0) { enemyDie(e); return false; } return true; });
            if (totalDmg > 0) {
                G.hp = Math.max(0, G.hp - totalDmg); flash('red');
                const hb = document.getElementById('header-hp-container'); hb.classList.remove('shake'); void hb.offsetWidth; hb.classList.add('shake');
                addLog(`⚡ BASE: -${totalDmg} HP`, 'bad');
                if (G.hp <= 0) { clearInterval(G.timer); saveRecord(); document.getElementById('game-over').classList.add('active'); document.getElementById('go-stats').textContent = `Wave: ${G.wave} | Abates: ${G.kills} | Recorde: ${G.highScore}`; return; }
            }
            renderFrame = 5;
        }
        if (renderFrame >= 5) { renderEnemies(enemies); updateHUD(); renderFrame = 0; }

        // Win wave
        if (!enemies.length && G.hp > 0) {
            clearInterval(G.timer);
            addLog(`✓ WAVE ${G.wave} VENCIDA`, 'good');
            flash('green'); saveRecord();
            // Shrine heal & barricade regen
            G.cells.forEach((c, ci) => {
                if (!c.struct) return;
                const s = STRUCTS[c.struct];
                const bl = clampLevel(c.level);
                if (s.passive && s.levels[bl]?.heal) {
                    let h = s.levels[bl].heal, m = s.levels[bl].maxhp || 0;
                    G.activeCombos.forEach(co => { if (co.bonus === 'heal') h = Math.ceil(h * (1 + co.val)); });
                    G.maxHp += m; G.hp = Math.min(G.maxHp, G.hp + h);
                    addLog(`✚ ${s.name}: +${h}HP +${m}Max`, 'good');
                }
                if (s.isBarricade && c.hp !== null && s.levels[bl].regen) {
                    c.hp = Math.min(s.levels[bl].hp, c.hp + s.levels[bl].regen);
                }
            });
            updateHUD(); renderGrid();
            setTimeout(() => showBonusModal(), 700);
        }
    }, 100);
}

function enemyDie(e) {
    G.kills++; G.coins += e.coinValue;
    addLog(`💀 ${e.icon}${e.name} (+${e.coinValue}🪙)`, 'coin');
    const r = document.getElementById('enemy-panel').getBoundingClientRect();
    spawnText(r.left + 50, r.top + 40, `+${e.coinValue}`, 'coin');
}

// ══════════════════════════════════════════════
// POST-WAVE REWARDS (Mantido como principal)
// ══════════════════════════════════════════════

function showBonusModal() {
    G.phase = 'pick'; G.pendingReward = true;
    updateHUD();
    document.getElementById('m-title').textContent = `RECOMPENSA WAVE ${G.wave}`;
    const grid = document.getElementById('opt-grid'); grid.innerHTML = '';
    const keys = Object.keys(STRUCTS);
    const opts = [];
    const shuffled = [...keys].sort(() => 0.5 - Math.random());
    for (const k of shuffled) {
        if (opts.length >= 3) break;
        const cell = G.cells.find(c => c.struct === k);
        if (cell && cell.level < 3) opts.push({ key: k, type: 'up', curLv: cell.level });
        else opts.push({ key: k, type: 'new' });
    }
    if (G.gridSize < 5) opts.push({ key: 'expand', type: 'special' });
    else opts.push({ key: 'repair', type: 'special' });

    opts.forEach(opt => {
        const card = document.createElement('div');
        card.className = 'option-card';
        let name, desc, icon, badge;
        if (opt.key === 'expand') { name = 'EXPANDIR'; icon = '🗺️'; badge = 'SPECIAL'; desc = `Grid → ${G.gridSize+1}×${G.gridSize+1}`; card.style.setProperty('--cc','#1abc9c'); }
        else if (opt.key === 'repair') { name = 'REPARO MAX'; icon = '🔧'; badge = 'SPECIAL'; desc = 'Restaura 100% HP Base'; card.style.setProperty('--cc','#f1c40f'); }
        else { const s = STRUCTS[opt.key]; const lv = opt.type === 'up' ? opt.curLv + 1 : 0; name = s.name; icon = s.icon; desc = s.levels[lv].desc; badge = opt.type === 'up' ? `▲ NV${lv+1}` : '✦ NOVA'; card.style.setProperty('--cc', s.color); }
        card.innerHTML = `<div class="option-icon">${icon}</div><div class="option-name">${name}</div><div class="option-desc">${desc}</div><div class="option-tag">${badge}</div>`;
        card.onclick = () => handleChoice(opt);
        grid.appendChild(card);
    });
    document.getElementById('modal-overlay').classList.add('active');
}

function handleChoice(opt) {
    document.getElementById('modal-overlay').classList.remove('active');
    G.pendingReward = false;
    if (opt.key === 'expand') {
        const oldN = G.gridSize, newN = ++G.gridSize, old = G.cells; initGrid();
        for (let r = 0; r < oldN; r++) for (let c = 0; c < oldN; c++) G.cells[r * newN + c] = old[r * oldN + c];
        addLog(`🗺 Grid: ${newN}×${newN}`, 'good'); advanceWave();
    } else if (opt.key === 'repair') {
        G.hp = G.maxHp; addLog(`🔧 HP restaurado`, 'good'); advanceWave();
    } else if (opt.type === 'up') {
        const cell = G.cells.find(c => c.struct === opt.key && c.level < 3);
        if (cell) { cell.level++; if (STRUCTS[opt.key].isBarricade) cell.hp = STRUCTS[opt.key].levels[clampLevel(cell.level)].hp; addLog(`▲ ${STRUCTS[opt.key].name} → NV${cell.level+1}`, 'special'); }
        advanceWave();
    } else {
        G.placing = opt.key; G.placingName = STRUCTS[opt.key].name;
        G.phase = 'place'; updateHUD(); renderGrid();
        addLog(`📍 Posicione ${STRUCTS[opt.key].name}`, 'info');
    }
}

function advanceWave() { G.wave++; saveRecord(); G.phase = 'idle'; updateHUD(); renderGrid(); }

// ══════════════════════════════════════════════
// PLACEMENT
// ══════════════════════════════════════════════

function placeAt(idx) {
    if (G.phase !== 'place' || !G.placing) return;
    if (G.cells[idx].struct && G.cells[idx].struct !== G.placing) { addLog('Local ocupado', 'bad'); return; }

    if (G.cells[idx].struct === G.placing) {
        if (G.cells[idx].level < 3) {
            G.cells[idx].level++;
            if (STRUCTS[G.placing].isBarricade) G.cells[idx].hp = STRUCTS[G.placing].levels[clampLevel(G.cells[idx].level)].hp;
            addLog(`✨ ${STRUCTS[G.placing].name} → LV${G.cells[idx].level+1}`, 'good');
        } else { addLog('Limite evolutivo!', 'bad'); return; }
    } else {
        const s = STRUCTS[G.placing];
        G.cells[idx] = { struct: G.placing, level: 0, hp: s.isBarricade ? s.levels[0].hp : null };
        addLog(`✓ ${s.name} posicionado!`, 'good');
    }
    G.placing = null; G.placingName = null;

    if (G.isStarterPick) { G.isStarterPick = false; G.phase = 'idle'; }
    else if (G.pendingReward) advanceWave(); // From post-wave reward
    else { G.phase = 'idle'; } // From shop purchase

    updateHUD(); renderGrid();
}

// ══════════════════════════════════════════════
// SHOP (Secundário — NÃO substitui rewards)
// ══════════════════════════════════════════════

function openShop() {
    if (G.phase === 'wave' || G.phase === 'pick') return;
    G.phase = 'shop'; populateShop();
    document.getElementById('shop-overlay').classList.add('active'); updateHUD();
}
function closeShop() {
    document.getElementById('shop-overlay').classList.remove('active');
    if (G.phase === 'shop') G.phase = 'idle'; updateHUD();
}

function populateShop() {
    const gn = document.getElementById('shop-grid-normal'); gn.innerHTML = '';
    const keys = Object.keys(STRUCTS).sort(() => 0.5 - Math.random()).slice(0, 3);
    keys.forEach(k => {
        const s = STRUCTS[k];
        const cost = 25 + Math.floor(G.wave * 8); // Significantly more expensive over time
        const card = document.createElement('div');
        card.className = `option-card ${G.coins < cost ? 'disabled' : ''}`;
        card.style.setProperty('--cc', s.color);
        card.innerHTML = `<div class="cost-pill">${cost}🪙</div><div class="option-icon">${s.icon}</div><div class="option-name">${s.name}</div><div class="option-desc">Nova cópia ou fundida +1 LV</div>`;
        card.onclick = () => { if (G.coins >= cost) buyStructure(k, cost); };
        gn.appendChild(card);
    });

    const bmSec = document.getElementById('black-market-section');
    if (G.wave >= 4) {
        bmSec.style.display = 'block';
        const bg = document.getElementById('shop-grid-black'); bg.innerHTML = '';
        const items = [
            { id: 'heal', n: 'Pacto de Sangue', i: '💉', c: 40, d: '+10 MaxHP, -3 HP atual' },
            { id: 'boost', n: 'Elixir de Guerra', i: '⚗️', c: 60, d: '+5 HP máx + cura 10 HP' },
            { id: 'sell_all_coins', n: 'Alquimia Reversa', i: '🔄', c: 0, d: 'Vende todas torres lv1 por 20🪙 cada' },
        ];
        const pick = items[Math.floor(Math.random() * items.length)];
        const bc = document.createElement('div');
        bc.className = `option-card bm-card ${G.coins < pick.c ? 'disabled' : ''}`;
        bc.innerHTML = `<div class="cost-pill">${pick.c}🪙</div><div class="option-icon">${pick.i}</div><div class="option-name">${pick.n}</div><div class="option-desc">${pick.d}</div>`;
        bc.onclick = () => {
            if (G.coins < pick.c) return;
            G.coins -= pick.c;
            if (pick.id === 'heal') { G.maxHp += 10; G.hp = Math.max(1, G.hp - 3); addLog('💉 Pacto aceito', 'special'); }
            if (pick.id === 'boost') { G.maxHp += 5; G.hp = Math.min(G.maxHp, G.hp + 10); addLog('⚗️ Elixir consumido', 'good'); }
            if (pick.id === 'sell_all_coins') {
                let sold = 0;
                G.cells.forEach((c, i) => { if (c.struct && c.level === 0) { G.coins += 20; c.struct = null; c.level = 0; c.hp = null; sold++; } });
                addLog(`🔄 ${sold} torres vendidas`, 'coin');
            }
            openShop(); renderGrid(); updateHUD();
        };
        bg.appendChild(bc);
    } else { bmSec.style.display = 'none'; }
    document.getElementById('shop-coins-val').textContent = Math.floor(G.coins);
}

function buyStructure(key, cost) {
    G.coins -= cost;
    const existing = G.cells.filter(c => c.struct === key && c.level < 3);
    if (existing.length > 0) {
        existing[0].level++;
        if (STRUCTS[key].isBarricade) existing[0].hp = STRUCTS[key].levels[clampLevel(existing[0].level)].hp;
        addLog(`✨ ${STRUCTS[key].name} → LV${existing[0].level + 1}`, 'good');
        renderGrid(); openShop();
    } else {
        closeShop(); G.placing = key; G.placingName = STRUCTS[key].name;
        G.phase = 'place'; updateHUD(); renderGrid();
    }
}

// ══════════════════════════════════════════════
// STARTER (COM ESCOLHA - Fixed)
// ══════════════════════════════════════════════

function showStarter() {
    G.phase = 'pick'; G.isStarterPick = true; updateHUD();
    document.getElementById('m-title').textContent = 'ESCOLHA SUA DEFESA INICIAL';
    const grid = document.getElementById('opt-grid'); grid.innerHTML = '';
    const starters = ['archer', 'mage', 'fire', 'tesla'].sort(() => 0.5 - Math.random()).slice(0, 3);
    starters.forEach(k => {
        const s = STRUCTS[k];
        const card = document.createElement('div');
        card.className = 'option-card'; card.style.setProperty('--cc', s.color);
        card.innerHTML = `<div class="option-icon">${s.icon}</div><div class="option-name">${s.name}</div><div class="option-desc">${s.levels[0].desc}</div><div class="option-tag">${s.type === 'physical' ? '🗡️ FÍSICO' : '✨ MÁGICO'}</div>`;
        card.onclick = () => {
            document.getElementById('modal-overlay').classList.remove('active');
            G.placing = k; G.placingName = s.name; G.phase = 'place'; updateHUD(); renderGrid();
        };
        grid.appendChild(card);
    });
    document.getElementById('modal-overlay').classList.add('active');
}

document.addEventListener('keydown', e => {
    if ((e.code === 'Space' || e.code === 'Enter') && G.phase === 'idle') { e.preventDefault(); startWave(); }
});

window.resetGame = resetGame;
window.startWave = startWave;
window.openShop = openShop;
window.closeShop = closeShop;

initGrid(); updateHUD(); renderGrid(); showStarter();
