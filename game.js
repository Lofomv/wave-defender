/**
 * WAVE DEFENDER — Game Engine (V7 - COMBOS & SINERGIAS)
 * Full combo system with visual feedback, active tracking, and Codex tab.
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
        name: 'Amplificador', icon: '💠', color: '#3498db', rgb: '52, 152, 219', type: 'support',
        passive: true, tags: ['buff', 'amplify', 'support'],
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
    },
    cofre: {
        name: 'Cofre', icon: '🏦', color: '#d4af37', rgb: '212, 175, 55', type: 'support',
        passive: true, tags: ['economy', 'support'],
        levels: [
            { desc: '+3🪙/wave + gotejo', coinsPerWave: 3, drip: 1 },
            { desc: '+8🪙/wave + gotejo', coinsPerWave: 8, drip: 2 },
            { desc: '+15🪙/wave + gotejo', coinsPerWave: 15, drip: 3 },
            { desc: '[EVO] +30🪙 + Cashback 15%', coinsPerWave: 30, drip: 5, cashback: 0.15 }
        ]
    },
    base_militar: {
        name: 'Base Militar', icon: '🏰', color: '#cd853f', rgb: '205, 133, 63', type: 'support',
        passive: true, tags: ['buff', 'military', 'support'],
        levels: [
            { desc: 'Físicas adj. +25% dano', physDmgBuff: 0.25 },
            { desc: '+45% dano físico', physDmgBuff: 0.45 },
            { desc: '+45% dano + 20% vel.', physDmgBuff: 0.45, physSpdBuff: 0.20 },
            { desc: '[EVO] +80% dano + 40% vel.', physDmgBuff: 0.80, physSpdBuff: 0.40 }
        ]
    },
    espadachim: {
        name: 'Espadachim', icon: '⚔️', color: '#c0392b', rgb: '192, 57, 43', type: 'physical',
        isWarrior: true, tags: ['warrior', 'melee', 'physical'],
        levels: [
            { hp: 40, atk: 8, spd: 8, selfHeal: 0.10, desc: 'Linha de frente básica' },
            { hp: 70, atk: 14, spd: 7, selfHeal: 0.12, desc: 'Golpe forte' },
            { hp: 110, atk: 22, spd: 6, selfHeal: 0.15, desc: 'Lâmina afiada' },
            { hp: 180, atk: 35, spd: 5, selfHeal: 0.20, desc: '[EVO] Lâmina Imortal', critChance: 0.2 }
        ]
    },
    bruxo: {
        name: 'Bruxo', icon: '🪄', color: '#6c3483', rgb: '108, 52, 131', type: 'magical',
        isWarrior: true, tags: ['warrior', 'debuff', 'magic'],
        levels: [
            { hp: 30, atk: 4, spd: 10, debuffTargets: 1, atkReduce: 0.15, desc: 'Enfraquece 1 (-15% ATK)' },
            { hp: 50, atk: 7, spd: 9, debuffTargets: 2, atkReduce: 0.20, desc: '-20% ATK em 2 alvos' },
            { hp: 75, atk: 11, spd: 8, debuffTargets: 3, atkReduce: 0.25, armorReduce: 0.15, desc: '-25% ATK -15% ARM (3)' },
            { hp: 110, atk: 18, spd: 7, debuffTargets: 5, atkReduce: 0.35, armorReduce: 0.25, desc: '[EVO] Maldição em Massa' }
        ]
    },
    curandeiro: {
        name: 'Curandeiro', icon: '💉', color: '#27ae60', rgb: '39, 174, 96', type: 'support',
        isWarrior: true, passive: true, tags: ['warrior', 'heal', 'support'],
        levels: [
            { hp: 25, healPerTick: 2, desc: 'Cura guerreiros adj. +2/tick' },
            { hp: 40, healPerTick: 4, desc: 'Cura +4/tick' },
            { hp: 60, healPerTick: 7, desc: 'Cura +7/tick' },
            { hp: 90, healPerTick: 12, desc: '[EVO] Restauração Divina' }
        ]
    },
    acampamento: {
        name: 'Acampamento', icon: '⛺', color: '#d35400', rgb: '211, 84, 0', type: 'support',
        passive: true, tags: ['buff', 'camp', 'support'],
        levels: [
            { desc: 'Guerreiros adj. +20% dano', warriorDmgBuff: 0.20 },
            { desc: '+35% dano guerreiro', warriorDmgBuff: 0.35 },
            { desc: '+50% dano', warriorDmgBuff: 0.50 },
            { desc: '[EVO] +80% dano', warriorDmgBuff: 0.80 }
        ]
    }
};

// ══════════════════════════════════════════════
// DATA: COMBOS & SINERGIAS
// ══════════════════════════════════════════════

const COMBOS = [
    // ── WARRIOR SYNERGIES ──
    { id:'linha_frente', tags:[['melee','warrior'],['heal','warrior']], name:'LINHA DE FRENTE', icon:'🔥', color:'#27ae60',
      structs:'Espadachim + Curandeiro', desc:'Tanque sustentável',
      detail:'Cura do Curandeiro +40% no Espadachim. Dano recebido -15%.',
      bonus:'frontline', category:'warrior' },
    { id:'corrupcao', tags:[['warrior','debuff'],['poison']], name:'CORRUPÇÃO ARCANA', icon:'☠️', color:'#8e44ad',
      structs:'Bruxo + Lab. Químico', desc:'Veneno + Debuff amplificados',
      detail:'Veneno +50%. Bruxo debuffa +2 alvos extras. Chance de efeito aleatório.',
      bonus:'corrupt', category:'warrior' },
    { id:'forca_guerra', tags:[['melee'],['camp']], name:'FORÇA DE GUERRA', icon:'⚔️', color:'#c0392b',
      structs:'Espadachim + Acampamento', desc:'DPS alto na linha de frente',
      detail:'Espadachim: +30% dano, 15% chance de crítico (2x).',
      bonus:'warforce', category:'warrior' },
    { id:'fortaleza', tags:[['military'],['heal','warrior']], name:'FORTALEZA VIVA', icon:'🛡️', color:'#3498db',
      structs:'Base Militar + Curandeiro', desc:'Defesa extremamente sólida',
      detail:'Dano à base -20%. Cura de guerreiros +50%.',
      bonus:'fortress', category:'warrior' },
    // ── ECONOMY ──
    { id:'economia', tags:[['economy'],['amplify']], name:'ECONOMIA OCULTA', icon:'💰', color:'#f1c40f',
      structs:'Cofre + Amplificador', desc:'Geração de moedas aumentada',
      detail:'Cofre gera +60% moedas. Gotejo amplificado.',
      bonus:'coins_boost', val:0.6, category:'economy' },
    { id:'logistica', tags:[['economy'],['military']], name:'LOGÍSTICA DE GUERRA', icon:'📦', color:'#cd853f',
      structs:'Cofre + Base Militar', desc:'Economia de guerra',
      detail:'Cofre adj. Base: geração +50%.',
      bonus:'coins_boost', val:0.5, category:'economy' },
    // ── ELEMENTAL SYNERGIES ──
    { id:'fluxo', tags:[['elemental'],['magic']], name:'FLUXO MÁGICO', icon:'✨', color:'#9b59b6',
      structs:'Elemental + Mágica', desc:'+40% dano Elemental',
      detail:'Torres Elemental adjacentes a Mágicas: +40% dano.',
      bonus:'dmg', val:0.4, category:'elemental' },
    { id:'hiper', tags:[['electric'],['amplify']], name:'HIPER-PROCESSAMENTO', icon:'⚡', color:'#f39c12',
      structs:'Tesla + Amplificador', desc:'Velocidade ampliada',
      detail:'Tesla adj. Amplificador: +40% velocidade.',
      bonus:'spd', val:0.4, category:'elemental' },
    { id:'baluarte', tags:[['heavy'],['defense']], name:'BALUARTE', icon:'🏯', color:'#7f8c8d',
      structs:'Pesadas + Muralha', desc:'Pesadas fortalecidas',
      detail:'Torres pesadas adj. Muralha: +30% dano.',
      bonus:'dmg', val:0.3, category:'elemental' },
    { id:'nuvem', tags:[['poison'],['aoe']], name:'NUVEM TÓXICA', icon:'☁️', color:'#2ecc71',
      structs:'Lab. Químico + AoE', desc:'DOT dobrado',
      detail:'Torres AoE adj. Lab. Químico: DOT dobrado.',
      bonus:'dot', val:1.0, category:'elemental' },
    { id:'mecanismo', tags:[['ranged'],['industrial']], name:'MECANISMO AUTO.', icon:'⚒️', color:'#95a5a6',
      structs:'Ranged + Forja', desc:'Cadência aumentada',
      detail:'Torres Ranged adj. Forja: +60% velocidade.',
      bonus:'spd', val:0.6, category:'elemental' },
    { id:'regen', tags:[['magic'],['heal']], name:'REGEN. ARCANA', icon:'💫', color:'#1abc9c',
      structs:'Mágica + Santuário', desc:'Cura amplificada',
      detail:'Mágica adj. Santuário: Cura +50%.',
      bonus:'heal', val:0.5, category:'elemental' },
    { id:'escudo', tags:[['defense'],['elemental']], name:'ESCUDO ELEMENTAL', icon:'🔰', color:'#2ecc71',
      structs:'Muralha + Elemental', desc:'Muralha reforçada',
      detail:'Muralha adj. Elemental: +50% HP.',
      bonus:'wall_hp', val:0.5, category:'elemental' },
    { id:'tatica', tags:[['physical'],['amplify']], name:'TÁTICA AVANÇADA', icon:'🎯', color:'#e74c3c',
      structs:'Físicas + Amplificador', desc:'Dano físico ampliado',
      detail:'Físicas adj. Amplificador: +25% dano.',
      bonus:'dmg_phys', val:0.25, category:'elemental' },
    { id:'arsenal', tags:[['military'],['ranged']], name:'ARSENAL TÁTICO', icon:'🏰', color:'#cd853f',
      structs:'Base Militar + Ranged', desc:'Arsenal de longo alcance',
      detail:'Ranged adj. Base Militar: +30% dano.',
      bonus:'dmg', val:0.30, category:'elemental' },
];

const ASCENSAO_DOURADA = {
    id:'ascensao', name:'ASCENSÃO DOURADA', icon:'🌟', color:'#ffd700',
    structs:'Qualquer NV5 + Suporte adj.', desc:'Poder divino amplificado',
    detail:'Estrutura NV5 adj. Suporte: Bônus global +10% dano e +10% vel.',
    bonus:'ascension', category:'special'
};

// ══════════════════════════════════════════════
// DATA: ENEMIES
// ══════════════════════════════════════════════

const BASE_ENEMIES = [
    { name: 'Slime',           icon: '💧', hp: 12,  atk: 1,  armor: 0,  tier: 0, desc: 'Criatura gelatinosa fraca e lenta.' },
    { name: 'Goblin',          icon: '👺', hp: 24,  atk: 3,  armor: 0,  tier: 1, desc: 'Ágil e traiçoeiro. Ataca em grupos.' },
    { name: 'Orc Guerreiro',   icon: '🪓', hp: 50,  atk: 6,  armor: 1,  tier: 2, desc: 'Bruto com armadura leve.' },
    { name: 'Mago Sombrio',    icon: '🔮', hp: 90,  atk: 11, armor: 1,  tier: 3, desc: 'Canaliza poder arcano sombrio.' },
    { name: 'Cavaleiro Morto', icon: '🏇', hp: 160, atk: 20, armor: 3,  tier: 4, desc: 'Cavaleiro caído com armadura pesada.' },
    { name: 'Wyvern',          icon: '🐉', hp: 320, atk: 30, armor: 6,  tier: 5, desc: 'Dragão menor voador. Destruição massiva.' },
    { name: 'General Kolossus',icon: '🧱', hp: 750, atk: 55, armor: 12, tier: 6, desc: 'Colosso ancestral. Quase indestrutível.' },
];

const SPECIAL_ENEMIES = [
    { name: 'Sombra Ágil',     icon: '👤', hp: 15,  atk: 8,  armor: 0,  tier: 1, desc: 'Velocidade dobrada. Ataca duas vezes.', special: 'fast' },
    { name: 'Serpente Tóxica',  icon: '🐍', hp: 35,  atk: 5,  armor: 0,  tier: 2, desc: 'Envenena guerreiros ao atacar.', special: 'venomous', structDot: 3 },
    { name: 'Golem Férreo',    icon: '🪨', hp: 200, atk: 4,  armor: 8,  tier: 3, desc: 'Tanque maciço. Vida enorme.', special: 'tank' },
    { name: 'Atirador Sombrio',icon: '🏹', hp: 40,  atk: 12, armor: 0,  tier: 3, desc: 'Ignora barricadas. Foca guerreiros.', special: 'shooter' },
    { name: 'Demolidor',       icon: '💣', hp: 60,  atk: 8,  armor: 1,  tier: 4, desc: 'Explode ao morrer. Dano à base.', special: 'explosive', deathDmg: 15 },
    { name: 'Campeão',         icon: '👑', hp: 400, atk: 35, armor: 8,  tier: 5, desc: 'Elite poderoso. Recompensa grande.', special: 'elite' },
];

const ENEMIES_DB = [...BASE_ENEMIES, ...SPECIAL_ENEMIES];
const TIER_COLORS = ['#7f8c8d', '#2ecc71', '#3498db', '#9b59b6', '#e74c3c', '#e67e22', '#f1c40f'];
const SPECIAL_COLORS = { fast: '#f39c12', venomous: '#27ae60', tank: '#3498db', shooter: '#e74c3c', explosive: '#e67e22', elite: '#f1c40f' };

// ══════════════════════════════════════════════
// STATE
// ══════════════════════════════════════════════

let bestiaryData = JSON.parse(localStorage.getItem('wdBestiary') || '{}');

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

function initGrid() { G.cells = []; for (let i = 0; i < G.gridSize * G.gridSize; i++) G.cells.push({ struct: null, level: 0, hp: null }); }
function resetGame() {
    clearInterval(G.timer);
    G = { wave: 1, hp: 30, maxHp: 30, coins: 0, gridSize: 3, cells: [], phase: 'idle', placing: null, placingName: null, isStarterPick: false, timer: null, activeCombos: [], kills: 0, pendingReward: false, highScore: parseInt(localStorage.getItem('wdHS') || '1'), highKills: parseInt(localStorage.getItem('wdHK') || '0') };
    initGrid(); document.getElementById('game-over').classList.remove('active'); document.getElementById('battle-log').innerHTML = ''; closeShop(); closeCodex();
    addLog('// SISTEMA REINICIADO', 'info'); updateHUD(); renderGrid(); showStarter();
}
function saveRecord() { if (G.wave > G.highScore) { G.highScore = G.wave; localStorage.setItem('wdHS', String(G.highScore)); } if (G.kills > G.highKills) { G.highKills = G.kills; localStorage.setItem('wdHK', String(G.highKills)); } }
function getAdj(idx) { const n = G.gridSize, r = Math.floor(idx / n), c = idx % n, a = []; if (r > 0) a.push(idx - n); if (r < n - 1) a.push(idx + n); if (c > 0) a.push(idx - 1); if (c < n - 1) a.push(idx + 1); return a; }
function clampLevel(lv) { return Math.min(lv, 3); }

function getEffLevel(idx) {
    const cell = G.cells[idx]; if (!cell || !cell.struct) return 0;
    let base = clampLevel(cell.level), eff = base, adjLibLv = -1;
    getAdj(idx).forEach(n => { const nc = G.cells[n]; if (nc && nc.struct === 'library') { const bl = clampLevel(nc.level); eff += STRUCTS.library.levels[bl].levelBuff || 0; if (bl > adjLibLv) adjLibLv = bl; } });
    if (base === 3 && adjLibLv === 3) return 4;
    return Math.min(eff, 3);
}
function getPoisonInfusion(idx) { let p = 0; getAdj(idx).forEach(n => { const nc = G.cells[n]; if (nc && nc.struct === 'venom') p = Math.max(p, STRUCTS.venom.levels[clampLevel(nc.level)].poisonGrant || 0); }); return p; }
function getPoisonArmorReduce(idx) { let r = 0; getAdj(idx).forEach(n => { const nc = G.cells[n]; if (nc && nc.struct === 'venom') r = Math.max(r, STRUCTS.venom.levels[clampLevel(nc.level)].armorReduce || 0); }); return r; }

function recordEncounter(name) { if (!bestiaryData[name]) bestiaryData[name] = { kills: 0 }; saveBestiary(); }
function recordKill(name) { if (!bestiaryData[name]) bestiaryData[name] = { kills: 0 }; bestiaryData[name].kills++; saveBestiary(); }
function saveBestiary() { localStorage.setItem('wdBestiary', JSON.stringify(bestiaryData)); }

function getCashbackRate() { let rate = 0; G.cells.forEach((c, i) => { if (c.struct === 'cofre') { const lvl = Math.min(getEffLevel(i), 3); const cb = STRUCTS.cofre.levels[lvl].cashback || 0; if (cb > rate) rate = cb; } }); return rate; }

function getTypeInfo(s) {
    if (!s) return { label: '', color: '#888', icon: '' };
    const map = { physical: { label: 'FÍSICO', color: '#e74c3c', icon: '🗡️' }, magical: { label: 'MÁGICO', color: '#9b59b6', icon: '✨' }, support: { label: 'SUPORTE', color: '#d4af37', icon: '⚙️' } };
    return map[s.type] || map.support;
}

function hasCombo(bonusType) { return G.activeCombos.some(c => c.bonus === bonusType); }
function hasComboCells(bonusType, idx) { return G.activeCombos.some(c => c.bonus === bonusType && c.cells.includes(idx)); }

// ══════════════════════════════════════════════
// COMBO DETECTION
// ══════════════════════════════════════════════

function detectCombos() {
    G.activeCombos = []; const seen = new Set();
    G.cells.forEach((cell, i) => { if (!cell.struct) return; const tagsA = STRUCTS[cell.struct].tags;
        getAdj(i).forEach(j => { const nc = G.cells[j]; if (!nc || !nc.struct) return; const tagsB = STRUCTS[nc.struct].tags;
            COMBOS.forEach(combo => { const [req1, req2] = combo.tags;
                const match = (req1.every(t => tagsA.includes(t)) && req2.every(t => tagsB.includes(t))) || (req1.every(t => tagsB.includes(t)) && req2.every(t => tagsA.includes(t)));
                if (match) { const key = Math.min(i, j) + '-' + Math.max(i, j) + combo.id; if (!seen.has(key)) { seen.add(key); G.activeCombos.push({ ...combo, cells: [i, j] }); } }
            });
        });
    });
    // Ascensão Dourada — special: any LV5 adj support
    let ascFound = false;
    G.cells.forEach((cell, i) => {
        if (ascFound || !cell.struct || getEffLevel(i) < 4) return;
        const adjSupport = getAdj(i).some(j => G.cells[j]?.struct && STRUCTS[G.cells[j].struct].type === 'support');
        if (adjSupport) { G.activeCombos.push({ ...ASCENSAO_DOURADA, cells: [i] }); ascFound = true; }
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
    const sv = document.getElementById('shop-coins-val'); if (sv) sv.textContent = Math.floor(G.coins);
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
    renderActiveCombosBar();
}

function addLog(msg, type = '') { const el = document.getElementById('battle-log'), d = document.createElement('div'); d.className = 'log-entry' + (type ? ` log-${type}` : ''); d.textContent = msg; el.prepend(d); while (el.childNodes.length > 50) el.removeChild(el.lastChild); }
function flash(c) { const e = document.getElementById(`flash-${c}`); e.classList.add('active-flash'); setTimeout(() => e.classList.remove('active-flash'), 120); }
function showToast(m) { const t = document.getElementById('toast'); t.textContent = m; t.classList.add('show'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), 2200); }
function spawnText(x, y, text, type) { const c = document.getElementById('particles-container'), d = document.createElement('div'); d.className = `float-text float-${type}`; d.style.left = `${x + Math.random()*30 - 15}px`; d.style.top = `${y}px`; d.textContent = text; c.appendChild(d); setTimeout(() => d.remove(), 1000); }

function renderActiveCombosBar() {
    const bar = document.getElementById('active-combos');
    if (!bar) return;
    if (!G.activeCombos.length) { bar.innerHTML = ''; bar.style.display = 'none'; return; }
    bar.style.display = 'flex';
    const uniqueNames = [...new Set(G.activeCombos.map(c => c.id || c.name))];
    const uniqueCombos = uniqueNames.map(id => G.activeCombos.find(c => (c.id || c.name) === id));
    bar.innerHTML = uniqueCombos.map(c =>
        `<div class="combo-pill" style="--cp:${c.color}"><span class="combo-pill-icon">${c.icon}</span><span class="combo-pill-name">${c.name}</span></div>`
    ).join('');
}

// ══════════════════════════════════════════════
// GRID RENDER
// ══════════════════════════════════════════════

function renderGrid() {
    const c = document.getElementById('grid-container');
    const isMobile = window.innerWidth <= 900;
    document.documentElement.style.setProperty('--grid-cols', G.gridSize);
    c.style.gridTemplateColumns = isMobile ? `repeat(${G.gridSize}, 1fr)` : `repeat(${G.gridSize}, 85px)`;
    c.innerHTML = '';
    detectCombos();
    const comboSet = new Set(G.activeCombos.flatMap(x => x.cells));

    // Build combo-aura map: cell index → set of combo bonus types
    const comboAuraMap = {};
    G.activeCombos.forEach(co => {
        co.cells.forEach(ci => {
            if (!comboAuraMap[ci]) comboAuraMap[ci] = new Set();
            comboAuraMap[ci].add(co.bonus);
        });
    });

    const militarBuffed = new Set();
    G.cells.forEach((cell, i) => { if (cell.struct === 'base_militar') { getAdj(i).forEach(n => { const nc = G.cells[n]; if (nc && nc.struct && !STRUCTS[nc.struct].passive && STRUCTS[nc.struct].type === 'physical') militarBuffed.add(n); }); } });

    G.cells.forEach((cell, i) => {
        const div = document.createElement('div');
        div.className = 'cell';
        if (cell.struct) {
            const s = STRUCTS[cell.struct];
            const baseLv = clampLevel(cell.level);
            const effLv = getEffLevel(i);
            div.classList.add('occupied', `type-${s.type}`);
            div.dataset.struct = cell.struct;
            if (comboSet.has(i)) div.classList.add('combo-active');
            if (baseLv >= 3) div.classList.add('evo-lv4');
            if (effLv >= 4) div.classList.add('evo-lv5');
            if (militarBuffed.has(i)) div.classList.add('militar-buffed');
            if (s.isWarrior) div.classList.add('warrior-unit');
            div.style.setProperty('--sc', s.color); div.style.setProperty('--sr', s.rgb);

            // Per-combo aura class
            const auras = comboAuraMap[i];
            if (auras) {
                if (auras.has('frontline')) div.classList.add('combo-aura-frontline');
                if (auras.has('warforce')) div.classList.add('combo-aura-warforce');
                if (auras.has('corrupt')) div.classList.add('combo-aura-corrupt');
                if (auras.has('fortress')) div.classList.add('combo-aura-fortress');
                if (auras.has('coins_boost')) div.classList.add('combo-aura-economy');
                if (auras.has('ascension')) div.classList.add('combo-aura-ascension');
            }

            const poisonInf = getPoisonInfusion(i);
            let html = '';
            if (poisonInf > 0 && !s.tags.includes('poison')) html += '<div class="poison-aura"></div>';

            const ti = getTypeInfo(s);
            html += `<span class="cell-type-badge">${ti.icon}</span>`;
            html += `<span class="cell-level">NV${baseLv + 1}</span>`;
            if (effLv > baseLv) html += `<span class="cell-bonus">+${effLv - baseLv}</span>`;
            if (s.isWarrior) html += '<span class="warrior-indicator">♥</span>';
            html += `<span class="cell-icon">${s.icon}</span><span class="cell-name">${s.name}</span>`;

            if ((s.isBarricade || s.isWarrior) && cell.hp !== null) {
                const mhp = s.levels[baseLv].hp;
                const hpCls = s.isWarrior ? 'warrior-hp' : '';
                html += `<div class="hp-bar"><div class="hp-fill ${hpCls}" style="width:${(Math.max(0, cell.hp) / mhp) * 100}%"></div></div>`;
            }
            div.innerHTML = html;
            const typeLabel = ti.label;
            let tooltipExtra = '';
            if (auras && auras.size > 0) tooltipExtra = '\n⚡ Sinergias: ' + [...auras].map(a => G.activeCombos.find(c => c.bonus === a)?.name || a).join(', ');
            div.title = `${s.name} NV${effLv + 1} — ${s.levels[Math.min(effLv, 3)]?.desc || 'Divino'}\n${typeLabel}${s.isWarrior ? ' (GUERREIRO)' : ''}${tooltipExtra}`;
            div.onmouseenter = () => highlightSynergy(i);
            div.onmouseleave = clearSynergy;
            div.onclick = () => { if (G.phase === 'place') placeAt(i); };
            div.oncontextmenu = (e) => { e.preventDefault(); if (G.phase !== 'idle' && G.phase !== 'pick') return; const refund = Math.floor(10 + G.wave * 2); G.coins += refund; addLog(`💰 ${s.name} vendido (+${refund}🪙)`, 'coin'); G.cells[i] = { struct: null, level: 0, hp: null }; updateHUD(); renderGrid(); };
        } else if (G.phase === 'place') {
            div.classList.add('placeable'); div.onclick = () => placeAt(i);
            div.innerHTML = '<span style="font-size:24px;opacity:.3">+</span>';
        } else { div.classList.add('empty'); div.innerHTML = '·'; }
        c.appendChild(div);
    });
}

function highlightSynergy(idx) { if (G.phase !== 'idle' && G.phase !== 'pick') return; const s = STRUCTS[G.cells[idx]?.struct]; if (!s) return; const els = document.getElementById('grid-container').children; els[idx].classList.add('synergy-source'); getAdj(idx).forEach(n => { if (G.cells[n].struct && (s.passive || STRUCTS[G.cells[n].struct].passive)) els[n].classList.add('synergy-target'); }); G.activeCombos.forEach(c => { if (c.cells.includes(idx)) c.cells.forEach(ci => { if (ci !== idx) els[ci].classList.add('synergy-target'); }); }); }
function clearSynergy() { Array.from(document.getElementById('grid-container').children).forEach(el => el.classList.remove('synergy-source', 'synergy-target')); }

function renderEnemies(enemies) {
    const el = document.getElementById('enemy-list'); el.innerHTML = '';
    enemies.forEach((e, i) => {
        const d = document.createElement('div'); d.className = 'enemy-unit';
        if (i === 0) d.classList.add('targeted');
        if (e.special) d.style.borderColor = SPECIAL_COLORS[e.special] || 'rgba(192,57,43,0.3)';
        if (e.special === 'elite') d.classList.add('enemy-elite');
        const pct = Math.max(0, e.hp / e.maxHp) * 100;
        let st = '';
        if (e.frozen > 0) st += '<div class="status-icon" style="color:var(--blue)">❄</div>';
        if (e.dot > 0) st += '<div class="status-icon" style="color:#e67e22;left:-5px;right:auto">🔥</div>';
        if (e.debuffed) st += '<div class="status-icon" style="color:#6c3483;left:-5px;right:auto;top:auto;bottom:-5px">🪄</div>';
        d.innerHTML = `${e.icon}<div class="enemy-hp"><div class="enemy-hp-fill" style="width:${pct}%"></div></div>${st}`;
        d.title = `${e.name}${e.special ? ` [${e.special.toUpperCase()}]` : ''} | HP:${Math.max(0,Math.ceil(e.hp))}/${e.maxHp} | ATK:${e.atk} | ARM:${e.armor}`;
        el.appendChild(d);
    });
}

// ══════════════════════════════════════════════
// WAVE BUILDER
// ══════════════════════════════════════════════

function buildWave() {
    const w = G.wave;
    const mainTier = Math.min(Math.floor((w - 1) / 2), BASE_ENEMIES.length - 1);
    const subTier = Math.max(0, mainTier - 1);
    const count = Math.min(3 + Math.floor(w * 0.5), 14);
    let scale = 1 + (w - 1) * 0.12;
    if (w >= 20) scale += Math.pow(w - 19, 1.4) * 0.25;

    const eligibleSpecials = SPECIAL_ENEMIES.filter(e => e.tier <= BASE_ENEMIES[mainTier].tier);
    const enemies = [];

    for (let i = 0; i < count; i++) {
        const isBoss = (w % 10 === 0) && (i === count - 1);
        let base;
        if (!isBoss && w >= 4 && eligibleSpecials.length > 0 && Math.random() < 0.25) {
            base = eligibleSpecials[Math.floor(Math.random() * eligibleSpecials.length)];
        } else {
            base = isBoss ? BASE_ENEMIES[Math.min(mainTier + 1, BASE_ENEMIES.length - 1)] : BASE_ENEMIES[i < count * 0.6 ? mainTier : subTier];
        }
        const bs = isBoss ? 3.0 : (base.special === 'elite' ? 1.8 : 1);
        const ba = isBoss ? 1.5 : (base.special === 'elite' ? 1.3 : 1);

        enemies.push({
            ...base, hp: Math.ceil(base.hp * scale * bs), maxHp: Math.ceil(base.hp * scale * bs),
            atk: Math.ceil(base.atk * scale * ba),
            armor: base.armor + Math.floor(w / 6) + (w >= 20 ? Math.floor((w-19)/2) : 0),
            coinValue: Math.ceil((base.tier * 2 + 1 + w * 0.3) * (isBoss ? 10 : (base.special === 'elite' ? 3 : 1))),
            frozen: 0, dot: 0, isBoss, debuffed: false, corruptPoison: false,
            special: base.special || null, deathDmg: base.deathDmg || 0, structDot: base.structDot || 0,
        });
        recordEncounter(base.name);
    }
    enemies.sort((a, b) => (b.isBoss ? 1 : 0) - (a.isBoss ? 1 : 0));
    return enemies;
}

// ══════════════════════════════════════════════
// COMBAT
// ══════════════════════════════════════════════

function startWave() {
    if (G.phase !== 'idle') return;
    closeShop(); G.phase = 'wave'; updateHUD();
    addLog(`⚔ WAVE ${G.wave}`, 'bad');
    detectCombos();

    // Combo activation feedback
    const uniqueIds = [...new Set(G.activeCombos.map(c => c.id))];
    const uniqueCombos = uniqueIds.map(id => G.activeCombos.find(c => c.id === id));
    if (uniqueCombos.length > 0) {
        uniqueCombos.forEach(c => addLog(`⚡ ${c.icon} ${c.name}`, 'special'));
        const names = uniqueCombos.map(c => `${c.icon}${c.name}`);
        if (names.length <= 2) names.forEach(n => showToast(`⚡ ${n}`));
        else showToast(`⚡ ${uniqueCombos.length} COMBOS ATIVOS!`);
    }

    // Global check: Ascensão Dourada
    const hasAscension = hasCombo('ascension');
    // Global check: Fortaleza Viva
    const hasFortress = hasCombo('fortress');
    // Global check: Corrupção Arcana
    const hasCorrupt = hasCombo('corrupt');

    let enemies = buildWave();
    renderEnemies(enemies);

    // Collect attacking towers & warriors
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
            if (nc.struct === 'base_militar' && s.type === 'physical') { atkMult += STRUCTS.base_militar.levels[bLvl].physDmgBuff || 0; spdMult += STRUCTS.base_militar.levels[bLvl].physSpdBuff || 0; }
            if (nc.struct === 'acampamento' && s.isWarrior) atkMult += STRUCTS.acampamento.levels[bLvl].warriorDmgBuff || 0;
        });

        const poisonAdd = getPoisonInfusion(i), poisonArmRed = getPoisonArmorReduce(i);

        // Classic combo buffs
        G.activeCombos.forEach(co => { if (!co.cells.includes(i)) return; if (co.bonus === 'spd') spdMult += co.val; if (co.bonus === 'dmg') atkMult += co.val; if (co.bonus === 'dmg_phys' && s.type === 'physical') atkMult += co.val; });

        // Warrior combo: Força de Guerra (+30% dmg for espadachim)
        if (s.isWarrior && c.struct === 'espadachim' && hasComboCells('warforce', i)) atkMult += 0.3;

        // Ascensão Dourada: global +10%
        if (hasAscension) { atkMult += 0.1; spdMult += 0.1; }

        if (eff === 4) atkMult *= 1.5;
        const hasGodObelisk = getAdj(i).some(n => G.cells[n]?.struct === 'obelisk' && clampLevel(G.cells[n].level) >= 2 && s.type === 'magical');
        const finalSpd = Math.max(1, Math.round((ldat.spd || 10) / (1 + spdMult)));
        const finalAtk = Math.ceil((ldat.atk || 0) * atkMult);

        // Extra crit from Força de Guerra
        let extraCrit = 0;
        if (s.isWarrior && c.struct === 'espadachim' && hasComboCells('warforce', i)) extraCrit = 0.15;

        towers.push({ ...ldat, icon: s.icon, idx: i, spd: finalSpd, atk: finalAtk, timer: 0, tags: s.tags, type: s.type, extraPoison: poisonAdd, extraPoisonArmor: poisonArmRed, freezeAura: hasGodObelisk, isWarrior: s.isWarrior || false, struct: c.struct, extraCrit });
    });

    let tick = 0, renderFrame = 0;
    G.timer = setInterval(() => {
        tick++; renderFrame++;

        // DOT every 8 ticks
        if (tick % 8 === 0) {
            enemies.forEach(e => {
                if (e.dot > 0) {
                    let d = e.dot;
                    // Corrupção Arcana: +50% poison on debuffed enemies
                    if (hasCorrupt && e.corruptPoison) d = Math.ceil(d * 1.5);
                    G.activeCombos.forEach(c => { if (c.bonus === 'dot') d = Math.ceil(d * (1 + c.val)); });
                    e.hp -= d;
                }
                if (e.frozen > 0) e.frozen--;
            });
            let bf = enemies.length; enemies = enemies.filter(e => { if (e.hp <= 0) { enemyDie(e); return false; } return true; }); if (enemies.length !== bf) renderFrame = 5;
        }

        // Cofre drip every 25 ticks
        if (tick % 25 === 0) {
            G.cells.forEach((c, ci) => {
                if (c.struct === 'cofre') {
                    const bl = clampLevel(c.level);
                    let drip = STRUCTS.cofre.levels[bl].drip || 0;
                    // Economia Oculta: +60% drip
                    if (hasComboCells('coins_boost', ci)) drip = Math.ceil(drip * 1.6);
                    if (drip > 0) {
                        G.coins += drip;
                        const el = document.getElementById('grid-container').children[ci];
                        if (el) { const r = el.getBoundingClientRect(); spawnText(r.left + r.width / 2, r.top + 10, `+${drip}🪙`, 'coin'); el.classList.add('cofre-pulse'); setTimeout(() => el.classList.remove('cofre-pulse'), 400); }
                    }
                }
            });
        }

        // Curandeiro healing every 15 ticks
        if (tick % 15 === 0) {
            G.cells.forEach((c, ci) => {
                if (!c.struct || c.struct !== 'curandeiro' || !c.hp || c.hp <= 0) return;
                const bl = clampLevel(c.level);
                let heal = STRUCTS.curandeiro.levels[bl].healPerTick || 0;

                // Linha de Frente: +40% heal when curandeiro is part of it
                if (hasComboCells('frontline', ci)) heal = Math.ceil(heal * 1.4);
                // Fortaleza Viva: +50% heal
                if (hasFortress) heal = Math.ceil(heal * 1.5);

                getAdj(ci).forEach(n => {
                    const nc = G.cells[n];
                    if (!nc.struct || !STRUCTS[nc.struct].isWarrior || !nc.hp || nc.hp <= 0) return;
                    const maxHp = STRUCTS[nc.struct].levels[clampLevel(nc.level)].hp;
                    nc.hp = Math.min(maxHp, nc.hp + heal);
                    const el = document.getElementById('grid-container').children[n]?.querySelector('.hp-fill');
                    if (el) el.style.width = (Math.max(0, nc.hp) / maxHp * 100) + '%';
                });
            });
        }

        // Tower & warrior attacks
        towers.forEach(t => {
            if (t.isWarrior && (!G.cells[t.idx]?.struct || !G.cells[t.idx].hp || G.cells[t.idx].hp <= 0)) return;
            t.timer++; if (t.timer < t.spd || !enemies.length) return; t.timer = 0;

            // Bruxo: debuff instead of damage
            if (t.struct === 'bruxo') {
                let dbTargets = t.debuffTargets || 1;
                // Corrupção Arcana: +2 extra debuff targets
                if (hasCorrupt && hasComboCells('corrupt', t.idx)) dbTargets += 2;

                const targets = enemies.filter(e => !e.debuffed).slice(0, dbTargets);
                targets.forEach(e => {
                    e.debuffed = true;
                    e.atk = Math.max(1, Math.ceil(e.atk * (1 - (t.atkReduce || 0))));
                    if (t.armorReduce) e.armor = Math.max(0, Math.ceil(e.armor * (1 - t.armorReduce)));
                    // Corrupção: mark for poison amp
                    if (hasCorrupt && hasComboCells('corrupt', t.idx)) {
                        e.corruptPoison = true;
                        // Random extra effect
                        if (Math.random() < 0.25) { e.frozen = Math.max(e.frozen, 1); addLog('🌀 Efeito extra: Slow!', 'special'); }
                        else if (Math.random() < 0.15) { e.dot = Math.max(e.dot, 3); addLog('🧪 Efeito extra: Toxic!', 'special'); }
                    }
                });
                if (targets.length > 0) addLog(`🪄 ${targets.length} enfraquecido(s)`, 'special');
                return;
            }

            const tgts = t.focusStrongest ? [[...enemies].sort((a,b) => b.hp - a.hp)[0]] : enemies.slice(0, t.targets || 1);
            tgts.forEach(e => {
                if (!e) return;
                if (t.instakill && e.hp/e.maxHp <= t.instakill && !e.isBoss) { e.hp = 0; addLog(`🎯 HEADSHOT!`, 'special'); return; }
                let dmg = t.atk;
                // Crit: base + combo extra crit
                const totalCrit = (t.critChance || 0) + (t.extraCrit || 0);
                if (totalCrit > 0 && Math.random() < totalCrit) { dmg = Math.ceil(dmg * 2); addLog(`⚔ CRÍTICO!`, 'special'); }
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
            let bf = enemies.length; enemies = enemies.filter(e => { if (e.hp <= 0) { enemyDie(e); return false; } return true; }); if (enemies.length !== bf) renderFrame = 5;
        });

        // Enemy attacks every 12 ticks
        if (tick % 12 === 0 && enemies.length) {
            let regularDmg = 0, shooterDmg = 0;
            enemies.filter(e => e.frozen <= 0).forEach(e => {
                const mult = e.special === 'fast' ? 1.5 : 1;
                const dmg = Math.ceil(e.atk * mult);
                if (e.special === 'shooter') shooterDmg += dmg;
                else regularDmg += dmg;
            });

            // Barricades absorb regular damage
            for (let i = 0; i < G.cells.length && regularDmg > 0; i++) {
                const bc = G.cells[i];
                if (!bc.struct || !STRUCTS[bc.struct].isBarricade || bc.hp <= 0) continue;
                const abs = Math.min(bc.hp, regularDmg); bc.hp -= abs; regularDmg -= abs;
                const bLv = clampLevel(bc.level);
                const th = STRUCTS[bc.struct].levels[bLv].thorns;
                if (th > 0) enemies.filter(e => e.frozen <= 0).forEach(e => e.hp -= th);
                if (bc.hp <= 0) { addLog(`💥 Muralha rompida!`, 'bad'); bc.struct = null; bc.hp = null; bc.level = 0; renderGrid(); }
                else { const bel = document.getElementById('grid-container').children[i]?.querySelector('.hp-fill'); if (bel) bel.style.width = (Math.max(0, bc.hp) / STRUCTS[bc.struct].levels[bLv].hp * 100) + '%'; }
            }

            // Warriors absorb remaining + shooter damage
            let totalDmg = regularDmg + shooterDmg;
            const venomDot = enemies.reduce((max, e) => (e.special === 'venomous' && e.frozen <= 0) ? Math.max(max, e.structDot || 0) : max, 0);
            let warriorDied = false;
            for (let i = 0; i < G.cells.length && totalDmg > 0; i++) {
                const wc = G.cells[i];
                if (!wc.struct || !STRUCTS[wc.struct].isWarrior || !wc.hp || wc.hp <= 0) continue;
                let abs = Math.min(wc.hp, totalDmg);

                // Linha de Frente: warrior takes 15% less damage
                if (hasComboCells('frontline', i)) abs = Math.ceil(abs * 0.85);

                wc.hp -= abs; totalDmg -= abs;
                if (venomDot > 0) wc.hp -= venomDot;
                if (wc.hp <= 0) { addLog(`💀 ${STRUCTS[wc.struct].name} caiu!`, 'bad'); wc.struct = null; wc.hp = null; wc.level = 0; warriorDied = true; }
                else { const s = STRUCTS[wc.struct]; const maxHp = s.levels[clampLevel(wc.level)].hp; const bel = document.getElementById('grid-container').children[i]?.querySelector('.hp-fill'); if (bel) bel.style.width = (Math.max(0, wc.hp) / maxHp * 100) + '%'; }
            }
            if (warriorDied) renderGrid();

            enemies = enemies.filter(e => { if (e.hp <= 0) { enemyDie(e); return false; } return true; });

            // Fortaleza Viva: -20% damage to base
            if (hasFortress && totalDmg > 0) totalDmg = Math.ceil(totalDmg * 0.8);

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

            G.cells.forEach((c, ci) => {
                if (!c.struct) return; const s = STRUCTS[c.struct]; const bl = clampLevel(c.level);
                // Shrine heal
                if (s.passive && s.levels[bl]?.heal) { let h = s.levels[bl].heal, m = s.levels[bl].maxhp || 0; G.activeCombos.forEach(co => { if (co.bonus === 'heal') h = Math.ceil(h * (1 + co.val)); }); G.maxHp += m; G.hp = Math.min(G.maxHp, G.hp + h); addLog(`✚ ${s.name}: +${h}HP +${m}Max`, 'good'); }
                // Barricade regen
                if (s.isBarricade && c.hp !== null && s.levels[bl].regen) c.hp = Math.min(s.levels[bl].hp, c.hp + s.levels[bl].regen);
                // Cofre coins
                if (c.struct === 'cofre') {
                    let coins = STRUCTS.cofre.levels[bl].coinsPerWave || 0;
                    G.activeCombos.forEach(co => { if (co.bonus === 'coins_boost' && co.cells.includes(ci)) coins = Math.ceil(coins * (1 + (co.val || 0.5))); });
                    G.coins += coins; addLog(`🏦 Cofre: +${coins}🪙`, 'coin');
                }
                // Warrior self-heal
                if (s.isWarrior && c.hp !== null && c.hp > 0) {
                    const selfHeal = s.levels[bl].selfHeal || 0;
                    if (selfHeal > 0) { const maxHp = s.levels[bl].hp; const healAmt = Math.ceil(maxHp * selfHeal); c.hp = Math.min(maxHp, c.hp + healAmt); addLog(`♥ ${s.name}: +${healAmt} HP (${Math.ceil(selfHeal*100)}%)`, 'good'); }
                }
            });
            updateHUD(); renderGrid();
            setTimeout(() => showBonusModal(), 700);
        }
    }, 100);
}

function enemyDie(e) {
    G.kills++; G.coins += e.coinValue; recordKill(e.name);
    addLog(`💀 ${e.icon}${e.name} (+${e.coinValue}🪙)`, 'coin');
    if (e.special === 'explosive' && e.deathDmg > 0) { G.hp = Math.max(0, G.hp - e.deathDmg); addLog(`💣 EXPLOSÃO! -${e.deathDmg} HP`, 'bad'); flash('red'); }
    const r = document.getElementById('enemy-panel').getBoundingClientRect();
    spawnText(r.left + 50, r.top + 40, `+${e.coinValue}`, 'coin');
}

// ══════════════════════════════════════════════
// CARD BUILDER HELPER
// ══════════════════════════════════════════════

function buildCardHTML(s, icon, name, desc, badge, isSpecial) {
    let typeBar = '', wBadge = '';
    if (!isSpecial && s) {
        const ti = getTypeInfo(s);
        typeBar = `<div class="card-type-bar" style="background:${ti.color}">${ti.icon} ${ti.label}</div>`;
        if (s.isWarrior) wBadge = `<div class="card-warrior-badge">⚔ GUERREIRO</div>`;
    }
    return `${typeBar}<div class="option-icon">${icon}</div>${wBadge}<div class="option-name">${name}</div><div class="option-desc">${desc}</div><div class="option-tag">${badge}</div>`;
}

// ══════════════════════════════════════════════
// POST-WAVE REWARDS
// ══════════════════════════════════════════════

function showBonusModal() {
    G.phase = 'pick'; G.pendingReward = true; updateHUD();
    document.getElementById('m-title').textContent = `RECOMPENSA WAVE ${G.wave}`;
    const grid = document.getElementById('opt-grid'); grid.innerHTML = '';
    const keys = Object.keys(STRUCTS);
    const opts = [];
    const shuffled = [...keys].sort(() => 0.5 - Math.random());
    for (const k of shuffled) { if (opts.length >= 3) break; const cell = G.cells.find(c => c.struct === k); if (cell && cell.level < 3) opts.push({ key: k, type: 'up', curLv: cell.level }); else opts.push({ key: k, type: 'new' }); }
    if (G.gridSize < 5) opts.push({ key: 'expand', type: 'special' }); else opts.push({ key: 'repair', type: 'special' });

    opts.forEach(opt => {
        const card = document.createElement('div'); card.className = 'option-card';
        let name, desc, icon, badge, s = null;
        if (opt.key === 'expand') { name = 'EXPANDIR'; icon = '🗺️'; badge = 'SPECIAL'; desc = `Grid → ${G.gridSize+1}×${G.gridSize+1}`; card.style.setProperty('--cc','#1abc9c'); }
        else if (opt.key === 'repair') { name = 'REPARO MAX'; icon = '🔧'; badge = 'SPECIAL'; desc = 'Restaura 100% HP Base'; card.style.setProperty('--cc','#f1c40f'); }
        else { s = STRUCTS[opt.key]; const lv = opt.type === 'up' ? opt.curLv + 1 : 0; name = s.name; icon = s.icon; desc = s.levels[lv].desc; badge = opt.type === 'up' ? `▲ NV${lv+1}` : '✦ NOVA'; card.style.setProperty('--cc', s.color); }
        card.innerHTML = buildCardHTML(s, icon, name, desc, badge, opt.key === 'expand' || opt.key === 'repair');
        card.onclick = () => handleChoice(opt);
        grid.appendChild(card);
    });
    document.getElementById('modal-overlay').classList.add('active');
}

function handleChoice(opt) {
    document.getElementById('modal-overlay').classList.remove('active'); G.pendingReward = false;
    if (opt.key === 'expand') { const oldN = G.gridSize, newN = ++G.gridSize, old = G.cells; initGrid(); for (let r = 0; r < oldN; r++) for (let c = 0; c < oldN; c++) G.cells[r * newN + c] = old[r * oldN + c]; addLog(`🗺 Grid: ${newN}×${newN}`, 'good'); advanceWave(); }
    else if (opt.key === 'repair') { G.hp = G.maxHp; addLog(`🔧 HP restaurado`, 'good'); advanceWave(); }
    else if (opt.type === 'up') {
        const cell = G.cells.find(c => c.struct === opt.key && c.level < 3);
        if (cell) { cell.level++; const s = STRUCTS[opt.key]; const nl = clampLevel(cell.level);
            if (s.isBarricade) cell.hp = s.levels[nl].hp;
            if (s.isWarrior) cell.hp = s.levels[nl].hp;
            addLog(`▲ ${s.name} → NV${cell.level+1}`, 'special'); }
        advanceWave();
    } else { G.placing = opt.key; G.placingName = STRUCTS[opt.key].name; G.phase = 'place'; updateHUD(); renderGrid(); addLog(`📍 Posicione ${STRUCTS[opt.key].name}`, 'info'); }
}
function advanceWave() { G.wave++; saveRecord(); G.phase = 'idle'; updateHUD(); renderGrid(); }

// ══════════════════════════════════════════════
// PLACEMENT
// ══════════════════════════════════════════════

function placeAt(idx) {
    if (G.phase !== 'place' || !G.placing) return;
    if (G.cells[idx].struct && G.cells[idx].struct !== G.placing) { addLog('Local ocupado', 'bad'); return; }
    if (G.cells[idx].struct === G.placing) {
        if (G.cells[idx].level < 3) { G.cells[idx].level++; const s = STRUCTS[G.placing]; const nl = clampLevel(G.cells[idx].level);
            if (s.isBarricade) G.cells[idx].hp = s.levels[nl].hp;
            if (s.isWarrior) G.cells[idx].hp = s.levels[nl].hp;
            addLog(`✨ ${s.name} → LV${G.cells[idx].level+1}`, 'good');
        } else { addLog('Limite evolutivo!', 'bad'); return; }
    } else {
        const s = STRUCTS[G.placing];
        const isHpUnit = s.isBarricade || s.isWarrior;
        G.cells[idx] = { struct: G.placing, level: 0, hp: isHpUnit ? s.levels[0].hp : null };
        addLog(`✓ ${s.name} posicionado!`, 'good');
    }
    G.placing = null; G.placingName = null;
    if (G.isStarterPick) { G.isStarterPick = false; G.phase = 'idle'; }
    else if (G.pendingReward) advanceWave();
    else { G.phase = 'idle'; }
    updateHUD(); renderGrid();
}

// ══════════════════════════════════════════════
// SHOP
// ══════════════════════════════════════════════

function openShop() { if (G.phase === 'wave' || G.phase === 'pick') return; G.phase = 'shop'; populateShop(); document.getElementById('shop-overlay').classList.add('active'); updateHUD(); }
function closeShop() { document.getElementById('shop-overlay').classList.remove('active'); if (G.phase === 'shop') G.phase = 'idle'; updateHUD(); }

function populateShop() {
    const gn = document.getElementById('shop-grid-normal'); gn.innerHTML = '';
    const keys = Object.keys(STRUCTS).sort(() => 0.5 - Math.random()).slice(0, 3);
    keys.forEach(k => {
        const s = STRUCTS[k]; const cost = 25 + Math.floor(G.wave * 8);
        const card = document.createElement('div');
        card.className = `option-card ${G.coins < cost ? 'disabled' : ''}`;
        card.style.setProperty('--cc', s.color);
        card.innerHTML = `<div class="cost-pill">${cost}🪙</div>${buildCardHTML(s, s.icon, s.name, 'Nova cópia ou fundida +1 LV', '', false)}`;
        card.onclick = () => { if (G.coins >= cost) buyStructure(k, cost); };
        gn.appendChild(card);
    });
    const bmSec = document.getElementById('black-market-section');
    if (G.wave >= 4) {
        bmSec.style.display = 'block';
        const bg = document.getElementById('shop-grid-black'); bg.innerHTML = '';
        const items = [ { id: 'heal', n: 'Pacto de Sangue', i: '💉', c: 40, d: '+10 MaxHP, -3 HP atual' }, { id: 'boost', n: 'Elixir de Guerra', i: '⚗️', c: 60, d: '+5 HP máx + cura 10 HP' }, { id: 'sell_all_coins', n: 'Alquimia Reversa', i: '🔄', c: 0, d: 'Vende todas torres lv1 por 20🪙 cada' } ];
        const pick = items[Math.floor(Math.random() * items.length)];
        const bc = document.createElement('div'); bc.className = `option-card bm-card ${G.coins < pick.c ? 'disabled' : ''}`;
        bc.innerHTML = `<div class="cost-pill">${pick.c}🪙</div><div class="option-icon">${pick.i}</div><div class="option-name">${pick.n}</div><div class="option-desc">${pick.d}</div>`;
        bc.onclick = () => { if (G.coins < pick.c) return; G.coins -= pick.c;
            if (pick.id === 'heal') { G.maxHp += 10; G.hp = Math.max(1, G.hp - 3); addLog('💉 Pacto aceito', 'special'); }
            if (pick.id === 'boost') { G.maxHp += 5; G.hp = Math.min(G.maxHp, G.hp + 10); addLog('⚗️ Elixir consumido', 'good'); }
            if (pick.id === 'sell_all_coins') { let sold = 0; G.cells.forEach((c, i) => { if (c.struct && c.level === 0) { G.coins += 20; c.struct = null; c.level = 0; c.hp = null; sold++; } }); addLog(`🔄 ${sold} torres vendidas`, 'coin'); }
            openShop(); renderGrid(); updateHUD();
        };
        bg.appendChild(bc);
    } else { bmSec.style.display = 'none'; }
    document.getElementById('shop-coins-val').textContent = Math.floor(G.coins);
}

function buyStructure(key, cost) {
    G.coins -= cost;
    const cbRate = getCashbackRate();
    if (cbRate > 0) { const refund = Math.floor(cost * cbRate); G.coins += refund; addLog(`🏦 Cashback: +${refund}🪙`, 'coin'); showToast(`🏦 Cashback +${refund}🪙`); }
    const existing = G.cells.filter(c => c.struct === key && c.level < 3);
    if (existing.length > 0) {
        existing[0].level++;
        const s = STRUCTS[key]; const nl = clampLevel(existing[0].level);
        if (s.isBarricade) existing[0].hp = s.levels[nl].hp;
        if (s.isWarrior) existing[0].hp = s.levels[nl].hp;
        addLog(`✨ ${s.name} → LV${existing[0].level + 1}`, 'good'); renderGrid(); openShop();
    } else { closeShop(); G.placing = key; G.placingName = STRUCTS[key].name; G.phase = 'place'; updateHUD(); renderGrid(); }
}

// ══════════════════════════════════════════════
// STARTER
// ══════════════════════════════════════════════

function showStarter() {
    G.phase = 'pick'; G.isStarterPick = true; updateHUD();
    document.getElementById('m-title').textContent = 'ESCOLHA SUA DEFESA INICIAL';
    const grid = document.getElementById('opt-grid'); grid.innerHTML = '';
    const starters = ['archer', 'mage', 'fire', 'espadachim'].sort(() => 0.5 - Math.random()).slice(0, 3);
    starters.forEach(k => {
        const s = STRUCTS[k]; const card = document.createElement('div');
        card.className = 'option-card'; card.style.setProperty('--cc', s.color);
        const ti = getTypeInfo(s);
        card.innerHTML = buildCardHTML(s, s.icon, s.name, s.levels[0].desc, `${ti.icon} ${ti.label}`, false);
        card.onclick = () => { document.getElementById('modal-overlay').classList.remove('active'); G.placing = k; G.placingName = s.name; G.phase = 'place'; updateHUD(); renderGrid(); };
        grid.appendChild(card);
    });
    document.getElementById('modal-overlay').classList.add('active');
}

// ══════════════════════════════════════════════
// CODEX (3 TABS: Monstros + Estruturas + Combos)
// ══════════════════════════════════════════════

let codexTab = 'bestiary';
function openCodex() { codexTab = 'bestiary'; renderCodex(); document.getElementById('codex-overlay').classList.add('active'); }
function closeCodex() { document.getElementById('codex-overlay').classList.remove('active'); }
function switchCodexTab(tab) { codexTab = tab; document.querySelectorAll('.codex-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab)); renderCodex(); }

function renderCodex() {
    const content = document.getElementById('codex-content');
    if (codexTab === 'bestiary') content.innerHTML = renderBestiary();
    else if (codexTab === 'structures') content.innerHTML = renderStructCatalog();
    else content.innerHTML = renderCombosCatalog();
}

function renderBestiary() {
    const encountered = Object.keys(bestiaryData).length, total = ENEMIES_DB.length;
    let html = `<div class="codex-progress-bar"><div class="codex-progress-label">DESCOBERTOS: ${encountered}/${total}</div><div class="codex-progress-track"><div class="codex-progress-fill" style="width:${(encountered/total)*100}%"></div></div></div><div class="codex-grid">`;
    ENEMIES_DB.forEach(e => {
        const data = bestiaryData[e.name];
        const specialBadge = e.special ? `<div class="codex-enemy-type" style="color:${SPECIAL_COLORS[e.special]}">${e.special.toUpperCase()}</div>` : '';
        if (data) {
            html += `<div class="codex-card codex-card-enemy unlocked" style="--tier-color:${TIER_COLORS[e.tier]}">
                <div class="codex-card-tier" style="background:${TIER_COLORS[e.tier]}">T${e.tier}</div>
                <div class="codex-card-icon">${e.icon}</div><div class="codex-card-name">${e.name}</div>${specialBadge}
                <div class="codex-card-stats"><div class="codex-stat"><span class="codex-stat-label">♥ VIDA</span><span class="codex-stat-val">${e.hp}</span></div><div class="codex-stat"><span class="codex-stat-label">⚔ DANO</span><span class="codex-stat-val">${e.atk}</span></div><div class="codex-stat"><span class="codex-stat-label">🛡 ARM.</span><span class="codex-stat-val">${e.armor}</span></div></div>
                <div class="codex-card-desc">${e.desc}</div>
                <div class="codex-card-footer"><span>🪙 Base: ${e.tier * 2 + 1}</span><span>💀 ${data.kills} abates</span></div></div>`;
        } else {
            html += `<div class="codex-card codex-card-enemy locked"><div class="codex-card-tier" style="background:#333">?</div><div class="codex-card-icon" style="filter:brightness(0);opacity:0.2;font-size:48px">${e.icon}</div><div class="codex-card-name">???</div>
                <div class="codex-card-stats"><div class="codex-stat"><span class="codex-stat-label">♥</span><span class="codex-stat-val">???</span></div><div class="codex-stat"><span class="codex-stat-label">⚔</span><span class="codex-stat-val">???</span></div><div class="codex-stat"><span class="codex-stat-label">🛡</span><span class="codex-stat-val">???</span></div></div>
                <div class="codex-card-desc" style="color:#444">Encontre este inimigo para desbloquear.</div></div>`;
        }
    });
    return html + '</div>';
}

function renderStructCatalog() {
    const types = [
        { key: 'physical', label: 'ESTRUTURAS FÍSICAS', icon: '🗡️', color: '#e74c3c', desc: 'Dano direto e defesa bruta.' },
        { key: 'magical', label: 'ESTRUTURAS MÁGICAS', icon: '✨', color: '#9b59b6', desc: 'Poder arcano e efeitos elementais.' },
        { key: 'support', label: 'ESTRUTURAS DE SUPORTE', icon: '⚙️', color: '#d4af37', desc: 'Influência indireta, auras e economia.' },
    ];
    let html = '';
    types.forEach(type => {
        const structs = Object.entries(STRUCTS).filter(([k, v]) => v.type === type.key);
        if (!structs.length) return;
        html += `<div class="codex-type-section"><div class="codex-type-header" style="--type-color:${type.color}"><span class="codex-type-icon">${type.icon}</span><div><h3 class="codex-type-title">${type.label}</h3><p class="codex-type-desc">${type.desc}</p></div></div><div class="codex-grid codex-grid-structs">`;
        structs.forEach(([key, s]) => {
            const isDmg = !s.passive;
            const isW = s.isWarrior;
            html += `<div class="codex-card codex-card-struct" style="--sc:${s.color};--sr:${s.rgb}">
                <div class="codex-struct-header"><span class="codex-card-icon">${s.icon}</span><div><div class="codex-card-name">${s.name}</div><div class="codex-struct-type" style="color:${type.color}">${type.icon} ${type.label.replace('ESTRUTURAS ','')}</div></div></div>
                ${isW ? '<div class="codex-warrior-tag">⚔ GUERREIRO — UNIDADE COM VIDA</div>' : ''}
                ${!isDmg && !isW ? '<div class="codex-no-dmg">SEM DANO DIRETO</div>' : ''}
                <div class="codex-levels">`;
            s.levels.forEach((lv, i) => { const isEvo = i === 3; html += `<div class="codex-level ${isEvo ? 'codex-level-evo' : ''}"><span class="codex-level-num">NV${i+1}</span><span class="codex-level-desc">${lv.desc}</span></div>`; });
            html += `</div><div class="codex-tags">${s.tags.map(t => `<span class="codex-tag">${t}</span>`).join('')}</div></div>`;
        });
        html += '</div></div>';
    });
    return html;
}

function renderCombosCatalog() {
    detectCombos();
    const activeIds = new Set(G.activeCombos.map(c => c.id));
    const totalActive = activeIds.size;
    const totalCombos = COMBOS.length + 1;

    let html = `<div class="codex-progress-bar"><div class="codex-progress-label">SINERGIAS ATIVAS: ${totalActive}/${totalCombos}</div><div class="codex-progress-track"><div class="codex-progress-fill" style="width:${(totalActive/totalCombos)*100}%"></div></div></div>`;

    // ── Warrior Combos ──
    const warriorCombos = COMBOS.filter(c => c.category === 'warrior');
    if (warriorCombos.length) {
        html += `<div class="codex-type-section"><div class="codex-type-header" style="--type-color:#c0392b"><span class="codex-type-icon">⚔️</span><div><h3 class="codex-type-title">SINERGIAS DE GUERREIRO</h3><p class="codex-type-desc">Combinações poderosas entre unidades com vida.</p></div></div><div class="codex-combo-grid">`;
        warriorCombos.forEach(c => { html += renderComboCard(c, activeIds.has(c.id)); });
        html += '</div></div>';
    }

    // ── Elemental Combos ──
    const elemCombos = COMBOS.filter(c => c.category === 'elemental');
    if (elemCombos.length) {
        html += `<div class="codex-type-section"><div class="codex-type-header" style="--type-color:#9b59b6"><span class="codex-type-icon">✨</span><div><h3 class="codex-type-title">SINERGIAS ELEMENTAIS</h3><p class="codex-type-desc">Combinações entre torres adjacentes por tags.</p></div></div><div class="codex-combo-grid">`;
        elemCombos.forEach(c => { html += renderComboCard(c, activeIds.has(c.id)); });
        html += '</div></div>';
    }

    // ── Economy Combos ──
    const econCombos = COMBOS.filter(c => c.category === 'economy');
    if (econCombos.length) {
        html += `<div class="codex-type-section"><div class="codex-type-header" style="--type-color:#f1c40f"><span class="codex-type-icon">💰</span><div><h3 class="codex-type-title">SINERGIAS ECONÔMICAS</h3><p class="codex-type-desc">Geração de recursos e economia.</p></div></div><div class="codex-combo-grid">`;
        econCombos.forEach(c => { html += renderComboCard(c, activeIds.has(c.id)); });
        html += '</div></div>';
    }

    // ── Ascensão Dourada (Special) ──
    html += `<div class="codex-type-section"><div class="codex-type-header" style="--type-color:#ffd700"><span class="codex-type-icon">🌟</span><div><h3 class="codex-type-title">SINERGIA LENDÁRIA</h3><p class="codex-type-desc">Poder máximo. Requer NV5 (Evolução + Amplificador NV4).</p></div></div><div class="codex-combo-grid">`;
    html += renderComboCard(ASCENSAO_DOURADA, activeIds.has('ascensao'));
    html += '</div></div>';

    return html;
}

function renderComboCard(c, isActive) {
    const statusClass = isActive ? 'combo-card-active' : 'combo-card-inactive';
    const statusText = isActive ? '✅ ATIVO' : '⬜ INATIVO';
    const tagPairs = c.tags ? `<div class="combo-card-tags">[${c.tags[0].join(',')}] + [${c.tags[1].join(',')}]</div>` : '<div class="combo-card-tags">NV5 + SUPORTE adj.</div>';

    return `<div class="codex-combo-card ${statusClass}" style="--combo-color:${c.color}">
        <div class="combo-card-status ${isActive ? 'status-active' : ''}">${statusText}</div>
        <div class="combo-card-header">
            <span class="combo-card-icon">${c.icon}</span>
            <div>
                <div class="combo-card-name">${c.name}</div>
                <div class="combo-card-structs">${c.structs}</div>
            </div>
        </div>
        <div class="combo-card-desc">${c.desc}</div>
        ${tagPairs}
        <div class="combo-card-detail">${c.detail}</div>
    </div>`;
}

// ══════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════

document.addEventListener('keydown', e => {
    if ((e.code === 'Space' || e.code === 'Enter') && G.phase === 'idle') { e.preventDefault(); startWave(); }
    if (e.code === 'Escape') { closeCodex(); closeShop(); }
});

let resizeTimeout;
window.addEventListener('resize', () => { clearTimeout(resizeTimeout); resizeTimeout = setTimeout(() => renderGrid(), 150); });

window.resetGame = resetGame; window.startWave = startWave; window.openShop = openShop; window.closeShop = closeShop;
window.openCodex = openCodex; window.closeCodex = closeCodex; window.switchCodexTab = switchCodexTab;

initGrid(); updateHUD(); renderGrid(); showStarter();
