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
            { atk: 6, spd: 4, desc: 'Tiro rápido' },
            { atk: 12, spd: 4, desc: 'Tiro duplo', targets: 2 },
            { atk: 18, spd: 3, desc: 'Chuva de flechas (3 alvos)', targets: 3 },
            { atk: 28, spd: 2, desc: '[EVO] Rajada (5 alvos)', targets: 5 }
        ]
    },
    sniper: {
        name: 'Atirador', icon: '🎯', color: '#34495e', rgb: '52, 73, 94', type: 'physical',
        tags: ['ranged', 'heavy', 'physical'],
        levels: [
            { atk: 20, spd: 14, desc: 'Foca no mais forte', focusStrongest: true },
            { atk: 35, spd: 12, desc: 'Perfura 50% armadura', focusStrongest: true, armorPen: 0.5 },
            { atk: 60, spd: 10, desc: 'Execução: 1.5x HP<30%', focusStrongest: true, execute: 0.3 },
            { atk: 100, spd: 8, desc: '[EVO] Headshot <15%', focusStrongest: true, armorPen: 0.8, execute: 0.3, instakill: 0.15 }
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
            { atk: 10, spd: 10, desc: 'Projétil arcano' },
            { atk: 18, spd: 8, desc: 'Congela (2 turnos)', freeze: 2 },
            { atk: 32, spd: 7, desc: 'Ignora armadura + congela', freeze: 3, noArmor: true },
            { atk: 50, spd: 5, desc: '[EVO] Vórtice Arcano', freeze: 4, noArmor: true }
        ]
    },
    fire: {
        name: 'Torre Fogo', icon: '🔥', color: '#e67e22', rgb: '230, 126, 34', type: 'magical',
        tags: ['elemental', 'aoe', 'magic'],
        levels: [
            { atk: 4, spd: 7, desc: 'Chama + DOT', targets: 1, dot: 2 },
            { atk: 7, spd: 6, desc: 'Queima 2 alvos', targets: 2, dot: 3 },
            { atk: 13, spd: 5, desc: 'Inferno 3 alvos', targets: 3, dot: 5 },
            { atk: 25, spd: 4, desc: '[EVO] Imolação', targets: 5, dot: 10 }
        ]
    },
    tesla: {
        name: 'Tesla', icon: '⚡', color: '#f1c40f', rgb: '241, 196, 15', type: 'magical',
        tags: ['magic', 'electric'],
        levels: [
            { atk: 6, spd: 8, desc: 'Raio cadeia (2)', targets: 2 },
            { atk: 12, spd: 7, desc: 'Raio cadeia (3)', targets: 3 },
            { atk: 20, spd: 6, desc: 'Tempestade (todos)', targets: 99 },
            { atk: 35, spd: 5, desc: '[EVO] Plasma', targets: 99 }
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
            { hp: 50, atk: 10, spd: 8, selfHeal: 0.10, desc: 'Linha de frente básica' },
            { hp: 80, atk: 16, spd: 7, selfHeal: 0.12, desc: 'Golpe forte' },
            { hp: 130, atk: 25, spd: 6, selfHeal: 0.15, desc: 'Lâmina afiada' },
            { hp: 200, atk: 40, spd: 5, selfHeal: 0.20, desc: '[EVO] Lâmina Imortal', critChance: 0.2 }
        ]
    },
    bruxo: {
        name: 'Bruxo', icon: '🪄', color: '#6c3483', rgb: '108, 52, 131', type: 'magical',
        isWarrior: true, tags: ['warrior', 'debuff', 'magic'],
        levels: [
            { hp: 40, atk: 5, spd: 10, debuffTargets: 1, atkReduce: 0.15, desc: 'Enfraquece 1 (-15% ATK)' },
            { hp: 60, atk: 9, spd: 9, debuffTargets: 2, atkReduce: 0.20, desc: '-20% ATK em 2 alvos' },
            { hp: 90, atk: 14, spd: 8, debuffTargets: 3, atkReduce: 0.25, armorReduce: 0.15, desc: '-25% ATK -15% ARM (3)' },
            { hp: 130, atk: 22, spd: 7, debuffTargets: 5, atkReduce: 0.35, armorReduce: 0.25, desc: '[EVO] Maldição em Massa' }
        ]
    },
    curandeiro: {
        name: 'Curandeiro', icon: '💉', color: '#27ae60', rgb: '39, 174, 96', type: 'support',
        isWarrior: true, passive: true, tags: ['warrior', 'heal', 'support'],
        levels: [
            { hp: 30, healPerTick: 3, desc: 'Cura guerreiros adj. +3/tick' },
            { hp: 50, healPerTick: 5, desc: 'Cura +5/tick' },
            { hp: 75, healPerTick: 9, desc: 'Cura +9/tick' },
            { hp: 110, healPerTick: 15, desc: '[EVO] Restauração Divina' }
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
    { id:'linha_frente', tags:[['melee','warrior'],['heal','warrior']], name:'LINHA DE FRENTE', icon:'🛡️', color:'#27ae60',
      structs:'Espadachim + Curandeiro', desc:'Tropa indestrutível',
      detail:'O Curandeiro tem cura +40%. O Espadachim adjacente ganha +15% de armadura. Sobrevivência máxima.',
      bonus:'frontline', category:'warrior' },
    { id:'forca_guerra', tags:[['melee'],['camp']], name:'FORÇA TÁTICA', icon:'⚔️', color:'#c0392b',
      structs:'Espadachim + Acampamento', desc:'Ofensiva pesada na linha 1',
      detail:'Acampamento dobra a vida do Espadachim. O Espadachim recebe +30% de dano base.',
      bonus:'warforce', category:'warrior' },
    { id:'fortaleza_viva', tags:[['military'],['heal','warrior']], name:'FORTALEZA VIVA', icon:'🏰', color:'#3498db',
      structs:'Base Militar + Curandeiro', desc:'Defesa Absoluta',
      detail:'Sempre que o Curandeiro curar, a Base Militar ganha +10% de evasão. Dano na Base reduzido em 20%.',
      bonus:'fortress', category:'warrior' },
    // ── ELEMENTAL & MAGIC ──
    { id:'corrupcao', tags:[['magic','debuff'],['poison']], name:'MIASMA LETAL', icon:'☠️', color:'#8e44ad',
      structs:'Bruxo + Lab. Químico', desc:'Veneno acelerado e letal',
      detail:'Lab. Químico recebe alcance global de DOT. Bruxo debuffa +2 alvos extras com veneno simultâneo.',
      bonus:'corrupt', category:'elemental' },
    { id:'reator_plasma', tags:[['electric'],['magic','buff']], name:'REATOR DE PLASMA', icon:'⚡', color:'#f39c12',
      structs:'Tesla + Obelisco', desc:'Tempestade de raios em cadeia',
      detail:'Tesla atinge +3 alvos. Obelisco garante chance de paralisação total a todos atingidos.',
      bonus:'plasma', category:'elemental' },
    { id:'regen_arcana', tags:[['magic'],['heal','magic']], name:'FONTE DE MANA', icon:'💫', color:'#1abc9c',
      structs:'Santuário + Magos', desc:'Cura mística retroalimentada',
      detail:'Todo dano causado por Magos aumenta permanentemente o HP máximo do Santuário.',
      bonus:'mana_spring', category:'elemental' },
    // ── TACTICS & ECONOMY ──
    { id:'economia', tags:[['economy'],['camp']], name:'SAQUEADORES', icon:'💰', color:'#f1c40f',
      structs:'Cofre + Acampamento', desc:'Pilhagem de guerra',
      detail:'Acampamento agora concede +2 de moedas (Cofre) após a morte de inimigos boss. Cofre rende +60%.',
      bonus:'plunder', category:'economy' },
    { id:'logistica', tags:[['economy'],['military']], name:'LOGÍSTICA MILITAR', icon:'⚙️', color:'#cd853f',
      structs:'Cofre + Base Militar/Forja', desc:'Recursos velozes',
      detail:'Geração do Cofre +50%. Estruturas Militares ganham +1 de nível grátis.',
      bonus:'logistics', category:'economy' },
    { id:'arsenal', tags:[['military'],['ranged','heavy']], name:'ARTILHARIA PESADA', icon:'🎯', color:'#e74c3c',
      structs:'Base Militar + Atirador/Arqueiro', desc:'Tiro de longo alcance tático',
      detail:'Arqueiros e Atiradores recebem Velocidade Ataque +50% se do lado de Base.',
      bonus:'artillery', category:'economy' }
];

const ASCENSAO_DOURADA = {
    id:'ascensao', name:'ASCENSÃO DOURADA', icon:'🌟', color:'#ffd700',
    structs:'Qualquer NV5 + Suporte adj.', desc:'Poder divino amplificado',
    detail:'Estrutura NV5 adj. Suporte: Bônus global +10% dano e +10% vel.',
    bonus:'ascension', category:'special'
};

// ══════════════════════════════════════════════
// DATA: META UPGRADES (ROGUELIKE PERMANENTE)
// ══════════════════════════════════════════════

const META_UPGRADES = [
    { id: 'start_lv2', name: 'Início Avançado', icon: '⬆️', desc: 'Estrutura inicial começa no Nível 2', maxLevel: 1, costs: [10] },
    { id: 'global_dmg', name: 'Poder Interior', icon: '⚔️', desc: '+5% dano global por nível', maxLevel: 5, costs: [5, 10, 20, 35, 50] },
    { id: 'extra_card', name: 'Destino Amplo', icon: '🃏', desc: '+1 opção de carta por wave', maxLevel: 2, costs: [25, 60] },
    { id: 'start_coins', name: 'Herança', icon: '🪙', desc: '+25 moedas iniciais por nível', maxLevel: 3, costs: [3, 8, 15] },
    { id: 'max_hp', name: 'Constituição', icon: '❤️', desc: '+10 HP máximo inicial por nível', maxLevel: 3, costs: [5, 12, 25] },
    { id: 'legendary_chance', name: 'Destino Lendário', icon: '🌟', desc: '+2% chance de lendários por nível (Base: 1%)', maxLevel: 2, costs: [15, 40] },
];

const ENEMY_AURAS = {
    white: { name: 'Iluminado', icon: '⚪', color: '#ffffff', hpMult: 1.10, atkMult: 1.0, coinMult: 1.5, dropSoul: true, soulAmt: 2, cssClass: 'aura-white' },
    red: { name: 'Furioso', icon: '🔴', color: '#ff3333', hpMult: 1.35, atkMult: 1.25, coinMult: 2.0, dropSoul: true, soulAmt: 1, cssClass: 'aura-red' },
    yellow: { name: 'Opulento', icon: '🟡', color: '#ffd700', hpMult: 1.05, atkMult: 1.0, coinMult: 4.0, dropSoul: false, soulAmt: 0, cssClass: 'aura-yellow' },
    blue: { name: 'Cristalino', icon: '🔵', color: '#3498db', hpMult: 1.80, atkMult: 0.50, coinMult: 1.5, dropSoul: false, soulAmt: 0, cssClass: 'aura-blue' },
    cyan: { name: 'Arcano', icon: '🌀', color: '#00bcd4', hpMult: 0.70, atkMult: 2.50, coinMult: 2.0, dropSoul: false, soulAmt: 0, cssClass: 'aura-cyan' },
    green: { name: 'Venenoso', icon: '🟢', color: '#2ecc71', hpMult: 1.20, atkMult: 1.25, coinMult: 1.5, dropSoul: false, soulAmt: 0, cssClass: 'aura-green' },
    darkness: { name: 'Escuridão', icon: '🖤', color: '#1a0033', hpMult: 1.0, atkMult: 1.0, coinMult: 3.0, dropSoul: true, soulAmt: 10, cssClass: 'aura-darkness' },
};

// ══════════════════════════════════════════════
// DATA: LEGENDARY STRUCTURES
// ══════════════════════════════════════════════

STRUCTS.bardo = {
    name: 'Bardo', icon: '🪉', color: '#e8a317', rgb: '232,163,23',
    type: 'support', passive: false, isWarrior: true, isBarricade: false, isLegendary: true,
    tags: ['suporte', 'cura', 'buff', 'lendário'],
    levels: [{ desc: 'Cura global em todas as tropas (cresce com wave, max 40). Ao receber dano: +40% dano global 5s.', atk: 8, spd: 12, hp: 120, selfHeal: 0.1 }]
};
STRUCTS.trabuco = {
    name: 'Trabuco', icon: '⚙️', color: '#b8860b', rgb: '184,134,11',
    type: 'physical', passive: false, isWarrior: false, isBarricade: false, isLegendary: true,
    tags: ['área', 'pesado', 'anti-tank', 'lendário'],
    levels: [{ desc: 'Dano = 25% HP máx do alvo. Splash 5 inimigos. Estilhaça armadura (-50%). Mira o mais forte.', atk: 0, spd: 22, armorBreak: 0.5 }]
};
STRUCTS.magico = {
    name: 'Mágico', icon: '🎭', color: '#00bcd4', rgb: '0,188,212',
    type: 'magical', passive: false, isWarrior: false, isBarricade: false, isLegendary: true,
    tags: ['controle', 'transformação', 'lendário'],
    levels: [{ desc: '35% chance: Transforma inimigo em 🐇. Bosses sofrem dano maciço (250).', atk: 250, spd: 18 }]
};

const LEGENDARY_KEYS = ['bardo', 'trabuco', 'magico'];
function hasDiscoveredLegendary(key) { try { return localStorage.getItem('wdLeg_' + key) === '1'; } catch(e) { return false; } }
function discoverLegendary(key) { try { localStorage.setItem('wdLeg_' + key, '1'); } catch(e) {} }

// ══════════════════════════════════════════════
// DATA: ENEMIES
// ══════════════════════════════════════════════

const BASE_ENEMIES = [
    { name: 'Slime',           icon: '💧', hp: 12,  atk: 1,  armor: 0,  tier: 0, desc: 'Criatura gelatinosa fraca e lenta.' },
    { name: 'Goblin',          icon: '👺', hp: 20,  atk: 2,  armor: 0,  tier: 1, desc: 'Ágil e traiçoeiro. Ataca em grupos.' },
    { name: 'Orc Guerreiro',   icon: '🪓', hp: 45,  atk: 4,  armor: 1,  tier: 2, desc: 'Bruto com armadura leve.' },
    { name: 'Mago Sombrio',    icon: '🔮', hp: 75,  atk: 8,  armor: 1,  tier: 3, desc: 'Canaliza poder arcano sombrio.' },
    { name: 'Cavaleiro Morto', icon: '🏇', hp: 140, atk: 15, armor: 3,  tier: 4, desc: 'Cavaleiro caído com armadura pesada.' },
    { name: 'Wyvern',          icon: '🐉', hp: 280, atk: 25, armor: 6,  tier: 5, desc: 'Dragão menor voador. Destruição massiva.' },
    { name: 'General Kolossus',icon: '🧱', hp: 650, atk: 45, armor: 12, tier: 6, desc: 'Colosso ancestral. Quase indestrutível.' },
];

const SPECIAL_ENEMIES = [
    { name: 'Sombra Ágil',     icon: '👤', hp: 18,  atk: 3,  armor: 0,  tier: 1, desc: 'Velocidade dobrada. Ataca duas vezes.', special: 'fast' },
    { name: 'Serpente Tóxica',  icon: '🐍', hp: 35,  atk: 5,  armor: 0,  tier: 2, desc: 'Envenena guerreiros ao atacar.', special: 'venomous', structDot: 3 },
    { name: 'Atirador Sombrio',icon: '🏹', hp: 60,  atk: 10, armor: 0,  tier: 3, desc: 'Ignora barricadas. Foca guerreiros.', special: 'shooter' },
    { name: 'Golem Férreo',    icon: '🪨', hp: 250, atk: 8,  armor: 8,  tier: 4, desc: 'Tanque maciço. Vida e armadura gigantescas.', special: 'tank' },
    { name: 'Demolidor',       icon: '💣', hp: 100, atk: 12, armor: 1,  tier: 4, desc: 'Explode ao morrer. Causa dano massivo à base.', special: 'explosive', deathDmg: 20 },
    { name: 'Campeão',         icon: '👑', hp: 450, atk: 35, armor: 8,  tier: 5, desc: 'Guerreiro de elite poderoso. Recompensa grande.', special: 'elite' },
    { name: 'Monken',          icon: '🐒', hp: 600, atk: 40, armor: 10, tier: 6, desc: 'Anomalia sombria do Livro Enfeitado. Drops massivos de Souls.', special: 'anomaly', isMonken: true, soulDropAmt: 15 },
];

const ENEMIES_DB = [...BASE_ENEMIES, ...SPECIAL_ENEMIES,
    { name: 'Malmir', icon: '🦧', hp: 1200, atk: 55, armor: 15, tier: 7, desc: 'Senhor das Sombras. Boss ancestral de poder devastador.', special: 'boss', deathDmg: 0, structDot: 0, isMalmir: true, soulDropAmt: 40 }
].sort((a, b) => a.tier !== b.tier ? a.tier - b.tier : a.hp - b.hp); // Ordered by danger level

const TIER_COLORS = ['#7f8c8d', '#2ecc71', '#3498db', '#9b59b6', '#e74c3c', '#e67e22', '#f1c40f', '#ff0055'];
const SPECIAL_COLORS = { fast: '#f39c12', venomous: '#27ae60', tank: '#3498db', shooter: '#e74c3c', explosive: '#e67e22', elite: '#f1c40f', anomaly: '#ff0055', boss: '#8e44ad' };

// ══════════════════════════════════════════════
// STATE
// ══════════════════════════════════════════════

function getStorage(key, def) {
    try {
        const val = localStorage.getItem(key);
        return val !== null ? val : def;
    } catch(e) {
        console.warn("LocalStorage indisponível:", e);
        return def;
    }
}

let bestiaryData = {};
try {
    bestiaryData = JSON.parse(getStorage('wdBestiary', '{}'));
} catch(e) {
    console.warn("Erro ao ler bestiário:", e);
}

function getMetaLevel(id) { try { return parseInt(localStorage.getItem('wdMeta_' + id) || '0'); } catch(e) { return 0; } }
function setMetaLevel(id, lv) { try { localStorage.setItem('wdMeta_' + id, String(lv)); } catch(e) {} }

let G = {
    wave: 1, hp: 30, maxHp: 30, coins: 0, gridSize: 3,
    cells: [], phase: 'idle', placing: null, placingName: null,
    isStarterPick: false, timer: null, activeCombos: [],
    kills: 0, pendingReward: false, soulsThisRun: 0,
    highScore: parseInt(getStorage('wdHS', '1')),
    highKills: parseInt(getStorage('wdHK', '0')),
    souls: parseInt(getStorage('wdSouls', '0')),
    activeBook: null, boughtBookThisRun: false, shopRerollCost: 5
};

const LIBRARY_BOOKS = {
    book_blue: { id: 'book_blue', name: 'Livro Azul', icon: '📘', cost: 2, rarity: 'rare', css: 'book-rare', desc: 'Aumenta velocidade de ataque global (+20%)' },
    book_green: { id: 'book_green', name: 'Livro Verde', icon: '📗', cost: 2, rarity: 'rare', css: 'book-rare', desc: 'Aumenta a vida global das estruturas (+30%)' },
    book_red: { id: 'book_red', name: 'Livro Vermelho', icon: '📕', cost: 2, rarity: 'rare', css: 'book-rare', desc: 'Aumenta dano global (+25%)' },
    book_yellow: { id: 'book_yellow', name: 'Livro Amarelo', icon: '📒', cost: 5, rarity: 'epic', css: 'book-epic', desc: 'Aumenta significativamente o ouro recebido (+50%)' },
    book_voucher: { id: 'book_voucher', name: 'Vale Livro', icon: '🔖', cost: 3, rarity: 'epic', css: 'book-epic', desc: 'Replica o efeito do último livro usado na run anterior' },
    book_orange: { id: 'book_orange', name: 'Livro Laranja', icon: '📙', cost: 10, rarity: 'legendary', css: 'book-legendary', desc: 'Aumenta MUITO o drop de Souls (+15% base chance)' },
    book_trinity: { id: 'book_trinity', name: 'Trindade Bibliotecária', icon: '📚', cost: 15, rarity: 'legendary', css: 'book-legendary', desc: 'Aplica um balanço dos 3 livros raros (+10% vel, vida, dano)' },
    book_forbidden: { id: 'book_forbidden', name: 'Livro Enfeitado', icon: '📔', cost: 20, rarity: 'forbidden', css: 'book-forbidden', desc: '?????????????????????' }
};

// ══════════════════════════════════════════════
// CORE
// ══════════════════════════════════════════════

function initGrid() { G.cells = []; for (let i = 0; i < G.gridSize * G.gridSize; i++) G.cells.push({ struct: null, level: 0, hp: null }); }

function confirmReset() { document.getElementById('confirm-reset-overlay').classList.add('active'); }
function closeConfirmReset() { document.getElementById('confirm-reset-overlay').classList.remove('active'); }
function executeReset() { closeConfirmReset(); resetGame(); }

function resetGame() {
    if (G.activeBook) { localStorage.setItem('wdLastBook', G.activeBook); }
    clearInterval(G.timer); G.timer = null;
    let baseHp = 50 + getMetaLevel('max_hp') * 10;
    const startCoins = getMetaLevel('start_coins') * 25;
    G = { wave: 1, hp: baseHp, maxHp: baseHp, coins: startCoins, gridSize: 3, cells: [], phase: 'idle', placing: null, placingName: null, isStarterPick: false, timer: null, activeCombos: [], kills: 0, pendingReward: false, soulsThisRun: 0, highScore: parseInt(localStorage.getItem('wdHS') || '1'), highKills: parseInt(localStorage.getItem('wdHK') || '0'), souls: parseInt(localStorage.getItem('wdSouls') || '0'), activeBook: null, boughtBookThisRun: false, shopRerollCost: 5 };
    initGrid(); document.getElementById('game-over').classList.remove('active'); document.getElementById('battle-log').innerHTML = ''; closeShop(); closeCodex(); closeSoulShop();
    try{ closeLibrary(); }catch(e){}
    addLog('// SISTEMA REINICIADO', 'info'); updateHUD(); renderGrid(); showStarter();
}
function saveRecord() {
    try {
        if (G.wave > G.highScore) { G.highScore = G.wave; localStorage.setItem('wdHS', String(G.highScore)); }
        if (G.kills > G.highKills) { G.highKills = G.kills; localStorage.setItem('wdHK', String(G.highKills)); }
    } catch(e) {}
}
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
function saveBestiary() { 
    try {
        localStorage.setItem('wdBestiary', JSON.stringify(bestiaryData)); 
    } catch(e) {}
}

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
    const soulEl = document.getElementById('h-souls'); if (soulEl) soulEl.textContent = G.souls || 0;
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
    const bs = document.getElementById('btn-shop'); if (bs) bs.disabled = G.phase === 'wave';
    
    // Leitoril Sidebar Sync
    const leiSlot = document.getElementById('h-leitoril-slot');
    const leiIcon = document.getElementById('h-leitoril-icon');
    if (leiSlot && leiIcon) {
        if (G.activeBook && LIBRARY_BOOKS[G.activeBook]) {
            leiSlot.classList.remove('empty');
            const bk = LIBRARY_BOOKS[G.activeBook];
            leiIcon.textContent = bk.icon;
            leiSlot.title = `Leitoril: ${bk.name}`;
        } else {
            leiSlot.classList.add('empty');
            leiIcon.textContent = '';
            leiSlot.title = 'Leitoril: Vazio (Nenhum Livro Ativo)';
        }
    }
    
    renderActiveCombosBar();
}

function addLog(msg, type = '') { const el = document.getElementById('battle-log'), d = document.createElement('div'); d.className = 'log-entry' + (type ? ` log-${type}` : ''); d.textContent = msg; el.prepend(d); while (el.childNodes.length > 50) el.removeChild(el.lastChild); }
function flash(c) { const e = document.getElementById(`flash-${c}`); e.classList.add('active-flash'); setTimeout(() => e.classList.remove('active-flash'), 120); }
function showToast(m) { const t = document.getElementById('toast'); t.textContent = m; t.classList.add('show'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), 2200); }
function spawnText(x, y, text, type) { const c = document.getElementById('particles-container'), d = document.createElement('div'); d.className = `float-text float-${type}`; d.style.left = `${x + Math.random()*30 - 15}px`; d.style.top = `${y}px`; d.textContent = text; c.appendChild(d); setTimeout(() => d.remove(), 1000); }

function renderActiveCombosBar() {
    const bar = document.getElementById('active-combos');
    if (!bar) return;
    if (!G.activeCombos.length) { 
        if (bar.dataset.last !== 'empty') { bar.innerHTML = ''; bar.style.display = 'none'; bar.dataset.last = 'empty'; }
        return; 
    }
    const uniqueNames = [...new Set(G.activeCombos.map(c => c.id || c.name))].sort();
    const sig = uniqueNames.join(',');
    if (bar.dataset.last === sig) return; // Prevent DOM rewrite (flicker) if combos are unchanged
    bar.dataset.last = sig;
    bar.style.display = 'flex';
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
        if (e.special === 'elite' || e.special === 'anomaly' || e.special === 'boss') d.classList.add('enemy-elite');
        if (e.special === 'anomaly' || e.special === 'boss') d.style.boxShadow = `0 0 20px ${SPECIAL_COLORS[e.special]}`;
        if (e.aura) d.classList.add(`enemy-${ENEMY_AURAS[e.aura].cssClass}`);
        const pct = Math.max(0, e.hp / e.maxHp) * 100;
        let st = '';
        if (e.frozen > 0) st += '<div class="status-icon status-ice" style="color:var(--blue)">❄</div>';
        if (e.dot > 0) st += '<div class="status-icon status-fire" style="color:#e67e22;left:-5px;right:auto">🔥</div>';
        if (e.debuffed) st += '<div class="status-icon status-poison" style="color:#6c3483;left:-5px;right:auto;top:auto;bottom:-5px">🪄</div>';
        if (e.aura) st += `<div class="status-icon aura-badge-${e.aura}" style="top:auto;bottom:-5px;right:-5px">${ENEMY_AURAS[e.aura].icon}</div>`;
        d.innerHTML = `${e.icon}<div class="enemy-hp"><div class="enemy-hp-fill" style="width:${pct}%"></div></div>${st}`;
        d.title = `${e.name}${e.aura ? ` [${ENEMY_AURAS[e.aura].name.toUpperCase()}]` : ''}${e.special ? ` [${e.special.toUpperCase()}]` : ''} | HP:${Math.max(0,Math.ceil(e.hp))}/${e.maxHp} | ATK:${e.atk} | ARM:${e.armor}`;
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
        let base, isMalmir = false;

        // Malmir: ultra-rare boss replacement (2% chance, wave 5+) or 'book_forbidden' forcing wave 10
        if (G.activeBook === 'book_forbidden' && w === 10 && isBoss) {
            base = ENEMIES_DB.find(e => e.isMalmir);
            isMalmir = true;
        } else if (G.activeBook === 'book_forbidden' && w <= 10 && !isBoss) {
            // Replace normal enemies entirely!
            base = ENEMIES_DB.find(e => e.isMonken) || base;
        } else if (isBoss && w >= 5 && Math.random() < 0.02) {
            base = ENEMIES_DB.find(e => e.isMalmir);
            isMalmir = true;
        } else if (!isBoss && w >= 4 && eligibleSpecials.length > 0 && Math.random() < 0.25) {
            base = eligibleSpecials[Math.floor(Math.random() * eligibleSpecials.length)];
        } else {
            base = isBoss ? BASE_ENEMIES[Math.min(mainTier + 1, BASE_ENEMIES.length - 1)] : BASE_ENEMIES[i < count * 0.6 ? mainTier : subTier];
        }
        const bs = isBoss ? (isMalmir ? 4.0 : 3.0) : (base.special === 'elite' ? 1.8 : 1);
        const ba = isBoss ? (isMalmir ? 2.0 : 1.5) : (base.special === 'elite' ? 1.3 : 1);

        // Aura assignment
        let aura = null;
        if (isMalmir) { aura = 'darkness'; }
        else if (base.isMonken) { aura = 'darkness'; }
        else if (isBoss) { aura = 'white'; }
        else if (w >= 2) {
            let auraRoll = Math.min(0.30, 0.05 + w * 0.012);
            if (G.activeBook === 'book_orange') auraRoll += 0.15;
            if (Math.random() < auraRoll) {
                const pick = Math.random();
                if (pick < 0.05) aura = 'white'; // 5% (drops 2 souls)
                else if (pick < 0.30) aura = 'red'; // 25% (drops 1 soul)
                else if (pick < 0.40) aura = 'blue'; // 10% 
                else if (pick < 0.50) aura = 'cyan'; // 10%
                else if (pick < 0.60) aura = 'green'; // 10%
                else aura = 'yellow'; // 40% (just coins)
            }
        }
        const ah = aura ? ENEMY_AURAS[aura].hpMult : 1;
        const aa = aura ? ENEMY_AURAS[aura].atkMult : 1;
        const ac = aura ? ENEMY_AURAS[aura].coinMult : 1;

        let cValue = Math.ceil((base.tier * 2 + 1 + w * 0.3) * (isBoss ? 10 : (base.special === 'elite' ? 3 : 1)) * ac) + (isMalmir || base.isMonken ? (base.isMonken ? 50 : 100) : 0);
        if (G.activeBook === 'book_yellow') cValue = Math.ceil(cValue * 1.5);

        enemies.push({
            ...base, hp: Math.ceil(base.hp * scale * bs * ah), maxHp: Math.ceil(base.hp * scale * bs * ah),
            atk: Math.ceil(base.atk * scale * ba * aa),
            armor: base.armor + Math.floor(w / 6) + (w >= 20 ? Math.floor((w-19)/2) : 0),
            coinValue: cValue,
            frozen: 0, dot: 0, isBoss: isBoss || isMalmir, debuffed: false, corruptPoison: false,
            special: base.special || null, deathDmg: base.deathDmg || 0, structDot: base.structDot || 0,
            aura: aura, isMalmir: isMalmir || false, transformed: false, transformTimer: 0, originalStats: null,
        });
        if (isMalmir) { addLog('🖤 MALMIR, o Senhor das Sombras, se aproxima...', 'bad'); }
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
    if (G.timer) { clearInterval(G.timer); G.timer = null; }
    closeShop(); G.phase = 'wave'; updateHUD();
    addLog(`⚔ WAVE ${G.wave}`, 'bad');
    detectCombos();

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
        const ldat = s.isLegendary ? s.levels[0] : s.levels[Math.min(eff, 3)];
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

        // Artillery
        if (s.tags.includes('ranged') && hasComboCells('artillery', i)) spdMult += 0.5;

        // Warrior combo: Força Tática (+30% dmg for espadachim)
        if (s.isWarrior && c.struct === 'espadachim' && hasComboCells('warforce', i)) atkMult += 0.3;

        // Ascensão Dourada: global +10%
        if (hasAscension) { atkMult += 0.1; spdMult += 0.1; }

        // Meta upgrade: global damage
        const metaDmgBonus = getMetaLevel('global_dmg') * 0.05;
        if (metaDmgBonus > 0) atkMult += metaDmgBonus;

        // Isolate Legendaries from structural/combo buffs
        if (s.isLegendary) {
            atkMult = 1; spdMult = 0;
            if (metaDmgBonus > 0) atkMult += metaDmgBonus; // allow meta
        }

        // Library Buffs
        if (G.activeBook === 'book_blue') spdMult += 0.20;
        if (G.activeBook === 'book_red') atkMult += 0.25;
        if (G.activeBook === 'book_trinity') { spdMult += 0.10; atkMult += 0.10; }

        if (eff === 4) atkMult *= 1.5;
        const hasGodObelisk = getAdj(i).some(n => G.cells[n]?.struct === 'obelisk' && clampLevel(G.cells[n].level) >= 2 && s.type === 'magical');
        const finalSpd = Math.max(1, Math.round((ldat.spd || 10) / (1 + spdMult)));
        const finalAtk = Math.ceil((ldat.atk || 0) * atkMult);

        // Extra crit from Força Tática
        let extraCrit = 0;
        if (s.isWarrior && c.struct === 'espadachim' && hasComboCells('warforce', i)) extraCrit = 0.15;
        
        let targets = ldat.targets || 1;
        if (c.struct === 'tesla' && hasComboCells('plasma', i)) targets += 3;
        const freezeAuraFinal = hasGodObelisk || (c.struct === 'tesla' && hasComboCells('plasma', i));

        towers.push({ ...ldat, icon: s.icon, idx: i, spd: finalSpd, atk: finalAtk, timer: 0, tags: s.tags, type: s.type, extraPoison: poisonAdd, extraPoisonArmor: poisonArmRed, freezeAura: freezeAuraFinal, targets: targets, isWarrior: s.isWarrior || false, struct: c.struct, extraCrit });
    });

    let tick = 0, renderFrame = 0, bardBuff = 0;
    G.timer = setInterval(() => {
        tick++; renderFrame++;

        // Bard buff countdown
        if (bardBuff > 0) bardBuff--;

        // Transform timers
        enemies.forEach(e => {
            if (e.transformed && e.transformTimer > 0) {
                e.transformTimer--;
                if (e.transformTimer <= 0 && e.originalStats) {
                    const orig = e.originalStats;
                    e.icon = orig.icon; e.name = orig.name;
                    e.maxHp = orig.maxHp; e.hp = Math.min(e.hp, e.maxHp);
                    e.atk = orig.atk; e.armor = orig.armor;
                    e.transformed = false; e.originalStats = null;
                }
            }
        });

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
                    // Economia / Pilhagem / Logistica
                    if (hasComboCells('coins_boost', ci)) drip = Math.ceil(drip * 1.6);
                    if (hasComboCells('plunder', ci)) drip = Math.ceil(drip * 1.6);
                    if (hasComboCells('logistics', ci)) drip = Math.ceil(drip * 1.5);
                    if (G.activeBook === 'book_yellow') drip = Math.ceil(drip * 1.5);
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
                    if (STRUCTS[nc.struct].isLegendary) return; // Skip legendaries so Curandeiro does not heal Bardo!
                    const maxHp = STRUCTS[nc.struct].levels[clampLevel(nc.level)].hp;
                    nc.hp = Math.min(maxHp, nc.hp + heal);
                    const el = document.getElementById('grid-container').children[n]?.querySelector('.hp-fill');
                    if (el) el.style.width = (Math.max(0, nc.hp) / maxHp * 100) + '%';
                });
            });

            // Bardo: global heal ONLY warriors (troops) and itself, scaling with wave
            G.cells.forEach((c, ci) => {
                if (c.struct !== 'bardo' || !c.hp || c.hp <= 0) return;
                
                // Dynamically scale heal based on wave. Base 5, +1.5 per wave, cap at 40 max.
                const bardHeal = Math.min(40, 5 + Math.floor(G.wave * 1.5));
                
                G.cells.forEach((oc, oi) => {
                    if (!oc.struct || !oc.hp || oc.hp <= 0) return;
                    const os = STRUCTS[oc.struct];
                    // Bardo heals only warriors
                    if (os.isWarrior) {
                        const eff = getEffLevel(oi);
                        const ldat = os.isLegendary ? os.levels[0] : os.levels[Math.min(eff, 3)];
                        const maxHp = Math.ceil(ldat.hp * getGlobalHpMult());
                        oc.hp = Math.min(maxHp, oc.hp + bardHeal);
                        
                        const el = document.getElementById('grid-container').children[oi]?.querySelector('.hp-fill');
                        if (el) el.style.width = (Math.max(0, oc.hp) / maxHp * 100) + '%';
                    }
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

            // === TRABUCO: %HP damage + splash + armor break ===
            if (t.struct === 'trabuco') {
                const strongest = [...enemies].sort((a,b) => b.hp - a.hp)[0];
                if (strongest) {
                    let hpDmg = Math.ceil(strongest.maxHp * 0.25);
                    if (bardBuff > 0) hpDmg = Math.ceil(hpDmg * 1.4);
                    strongest.hp -= hpDmg;
                    if (t.armorBreak) strongest.armor = Math.floor(strongest.armor * (1 - t.armorBreak));
                    addLog(`⚙️ Trabuco: -${hpDmg} (25% HP máx)`, 'dmg');
                    const splash = enemies.filter(e => e !== strongest).slice(0, 5);
                    splash.forEach(e => { const sd = Math.ceil(hpDmg * 0.5); e.hp -= sd; if(t.armorBreak) e.armor = Math.floor(e.armor * (1 - t.armorBreak)); });
                }
                let bf = enemies.length; enemies = enemies.filter(e => { if (e.hp <= 0) { enemyDie(e); return false; } return true; }); if (enemies.length !== bf) renderFrame = 5;
                return;
            }

            // === MÁGICO: transform chance OR boss damage ===
            if (t.struct === 'magico' && enemies.length) {
                const target = enemies[0];
                if (!target.isBoss && !target.transformed && Math.random() < 0.35) {
                    target.originalStats = { icon: target.icon, hp: target.hp, maxHp: target.maxHp, atk: target.atk, armor: target.armor, name: target.name };
                    target.transformed = true; target.transformTimer = 40;
                    target.icon = '🐇'; target.name = 'Coelho';
                    target.hp = Math.min(target.hp, 5); target.maxHp = 5;
                    target.atk = 0; target.armor = 0;
                    addLog('🎭 Transformação! → 🐇', 'special');
                } else if (target.isBoss) {
                    let dmg = Math.max(1, t.atk - target.armor);
                    if (bardBuff > 0) dmg = Math.ceil(dmg * 1.4);
                    target.hp -= dmg;
                    addLog(`🎭 Mágico detonou boss: -${dmg}`, 'dmg');
                }
                let bf = enemies.length; enemies = enemies.filter(e => { if (e.hp <= 0) { enemyDie(e); return false; } return true; }); if (enemies.length !== bf) renderFrame = 5;
                return;
            }

            tgts.forEach(e => {
                if (!e) return;
                if (t.instakill && e.hp/e.maxHp <= t.instakill && !e.isBoss) { e.hp = 0; addLog(`🎯 HEADSHOT!`, 'special'); return; }
                let dmg = t.atk;
                // Bard buff
                if (bardBuff > 0) dmg = Math.ceil(dmg * 1.4);
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
            // Pass 1: non-bardo warriors absorb damage
            for (let i = 0; i < G.cells.length && totalDmg > 0; i++) {
                const wc = G.cells[i];
                if (!wc.struct || !STRUCTS[wc.struct].isWarrior || !wc.hp || wc.hp <= 0) continue;
                if (wc.struct === 'bardo') continue; // bardo is avoided
                let abs = Math.min(wc.hp, totalDmg);
                if (hasComboCells('frontline', i)) abs = Math.ceil(abs * 0.85);
                wc.hp -= abs; totalDmg -= abs;
                if (venomDot > 0) wc.hp -= venomDot;
                if (wc.hp <= 0) { addLog(`💀 ${STRUCTS[wc.struct].name} caiu!`, 'bad'); wc.struct = null; wc.hp = null; wc.level = 0; warriorDied = true; }
                else { const s = STRUCTS[wc.struct]; const maxHp = s.levels[clampLevel(wc.level)].hp; const bel = document.getElementById('grid-container').children[i]?.querySelector('.hp-fill'); if (bel) bel.style.width = (Math.max(0, wc.hp) / maxHp * 100) + '%'; }
            }
            // Pass 2: bardo absorbs remaining (last resort)
            for (let i = 0; i < G.cells.length && totalDmg > 0; i++) {
                const wc = G.cells[i];
                if (wc.struct !== 'bardo' || !wc.hp || wc.hp <= 0) continue;
                let abs = Math.min(wc.hp, totalDmg);
                wc.hp -= abs; totalDmg -= abs;
                if (abs > 0) { bardBuff = 50; addLog('🪉 Bardo atingido! +40% dano global!', 'special'); }
                if (wc.hp <= 0) { addLog(`💀 Bardo caiu!`, 'bad'); wc.struct = null; wc.hp = null; wc.level = 0; warriorDied = true; }
                else { const maxHp = Math.ceil(STRUCTS.bardo.levels[0].hp * getGlobalHpMult()); const bel = document.getElementById('grid-container').children[i]?.querySelector('.hp-fill'); if (bel) bel.style.width = (Math.max(0, wc.hp) / maxHp * 100) + '%'; }
            }
            if (warriorDied) renderGrid();

            enemies = enemies.filter(e => { if (e.hp <= 0) { enemyDie(e); return false; } return true; });

            // Fortaleza Viva: -20% damage to base
            if (hasFortress && totalDmg > 0) totalDmg = Math.ceil(totalDmg * 0.8);

            if (totalDmg > 0) {
                G.hp = Math.max(0, G.hp - totalDmg); flash('red');
                const hb = document.getElementById('header-hp-container'); hb.classList.remove('shake'); void hb.offsetWidth; hb.classList.add('shake');
                addLog(`⚡ BASE: -${totalDmg} HP`, 'bad');
                if (G.hp <= 0) { clearInterval(G.timer); G.timer = null; saveRecord(); document.getElementById('game-over').classList.add('active'); document.getElementById('go-stats').textContent = `Wave: ${G.wave} | Abates: ${G.kills} | Recorde: ${G.highScore} | 🟠 +${G.soulsThisRun || 0} Souls`; return; }
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
    let logExtra = '';
    
    let soulsToDrop = 0;
    if (e.aura && ENEMY_AURAS[e.aura]?.dropSoul) soulsToDrop += (ENEMY_AURAS[e.aura].soulAmt || 1);
    if (e.soulDropAmt && e.soulDropAmt > 0) soulsToDrop += e.soulDropAmt;
    
    if (soulsToDrop > 0) {
        G.souls = (G.souls || 0) + soulsToDrop; G.soulsThisRun = (G.soulsThisRun || 0) + soulsToDrop;
        try { localStorage.setItem('wdSouls', String(G.souls)); } catch(ex) {}
        logExtra = ` +${soulsToDrop}🟠`;
        addLog(`🟠 ${soulsToDrop > 1 ? soulsToDrop + ' SOULS' : 'SOUL'} obtida${soulsToDrop > 1 ? 's' : ''}!`, 'special');
    }
    
    addLog(`💀 ${e.icon}${e.name}${e.aura ? ` [${ENEMY_AURAS[e.aura].name}]` : ''} (+${e.coinValue}🪙${logExtra})`, 'coin');
    if (e.special === 'explosive' && e.deathDmg > 0) { G.hp = Math.max(0, G.hp - e.deathDmg); addLog(`💣 EXPLOSÃO! -${e.deathDmg} HP`, 'bad'); flash('red'); }
    const r = document.getElementById('enemy-panel').getBoundingClientRect();
    spawnText(r.left + 50, r.top + 40, `+${e.coinValue}`, 'coin');
    if (soulsToDrop > 0) spawnText(r.left + 80, r.top + 20, `+${soulsToDrop}🟠`, 'dmg');
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
    const keys = Object.keys(STRUCTS).filter(k => !STRUCTS[k].isLegendary);
    const opts = [];
    const shuffled = [...keys].sort(() => 0.5 - Math.random());
    for (const k of shuffled) { if (opts.length >= (3 + getMetaLevel('extra_card'))) break; const cell = G.cells.find(c => c.struct === k); if (cell && cell.level < 3) opts.push({ key: k, type: 'up', curLv: cell.level }); else opts.push({ key: k, type: 'new' }); }

    // Legendary card injection (very rare)
    const legChances = [0.01, 0.03, 0.05];
    const legChance = legChances[getMetaLevel('legendary_chance')] || 0.01;
    if (Math.random() < legChance) {
        const available = LEGENDARY_KEYS.filter(k => !G.cells.some(c => c.struct === k));
        if (available.length > 0) {
            const legKey = available[Math.floor(Math.random() * available.length)];
            opts.push({ key: legKey, type: 'new', isLegendary: true });
            addLog('🌟 Uma carta LENDÁRIA apareceu!', 'special');
        }
    }

    if (G.gridSize < 5) opts.push({ key: 'expand', type: 'special' }); else opts.push({ key: 'repair', type: 'special' });

    opts.forEach(opt => {
        const card = document.createElement('div'); card.className = 'option-card';
        let name, desc, icon, badge, s = null;
        if (opt.key === 'expand') { name = 'EXPANDIR'; icon = '🗺️'; badge = 'SPECIAL'; desc = `Grid → ${G.gridSize+1}×${G.gridSize+1}`; card.style.setProperty('--cc','#1abc9c'); }
        else if (opt.key === 'repair') { name = 'REPARO MAX'; icon = '🔧'; badge = 'SPECIAL'; desc = 'Restaura 100% HP Base'; card.style.setProperty('--cc','#f1c40f'); }
        else {
            s = STRUCTS[opt.key]; const lv = opt.type === 'up' ? opt.curLv + 1 : 0;
            name = s.name; icon = s.icon; desc = s.levels[lv].desc;
            badge = opt.type === 'up' ? `▲ NV${lv+1}` : (s.isLegendary ? '🌟 LENDÁRIA' : '✦ NOVA');
            card.style.setProperty('--cc', s.color);
            if (s.isLegendary) card.classList.add('legendary-card');
        }
        card.innerHTML = buildCardHTML(s, icon, name, desc, badge, opt.key === 'expand' || opt.key === 'repair');
        card.onclick = () => handleChoice(opt);
        grid.appendChild(card);
    });
    document.getElementById('modal-overlay').classList.add('active');
}

function handleChoice(opt) {
    document.getElementById('modal-overlay').classList.remove('active');
    if (opt.key === 'expand') { G.pendingReward = false; const oldN = G.gridSize, newN = ++G.gridSize, old = G.cells; initGrid(); for (let r = 0; r < oldN; r++) for (let c = 0; c < oldN; c++) G.cells[r * newN + c] = old[r * oldN + c]; addLog(`🗺 Grid: ${newN}×${newN}`, 'good'); advanceWave(); }
    else if (opt.key === 'repair') { G.pendingReward = false; G.hp = G.maxHp; addLog(`🔧 HP restaurado`, 'good'); advanceWave(); }
    else if (opt.type === 'up') {
        G.pendingReward = false;
        const cell = G.cells.find(c => c.struct === opt.key && c.level < 3);
        if (cell) { cell.level++; const s = STRUCTS[opt.key]; const nl = clampLevel(cell.level);
            if (s.isBarricade) cell.hp = s.levels[nl].hp;
            if (s.isWarrior) cell.hp = s.levels[nl].hp;
            addLog(`▲ ${s.name} → NV${cell.level+1}`, 'special'); }
        advanceWave();
    } else {
        // pendingReward stays TRUE so placeAt() can call advanceWave()
        G.placing = opt.key; G.placingName = STRUCTS[opt.key].name; G.phase = 'place'; updateHUD(); renderGrid(); addLog(`📍 Posicione ${STRUCTS[opt.key].name}`, 'info');
    }
}
function advanceWave() { G.wave++; G.shopRerollCost = 5; saveRecord(); G.phase = 'idle'; updateHUD(); renderGrid(); }

// ══════════════════════════════════════════════
// PLACEMENT
// ══════════════════════════════════════════════

function getGlobalHpMult() {
    if (G.activeBook === 'book_green') return 1.30;
    if (G.activeBook === 'book_trinity') return 1.10;
    return 1.0;
}

function placeAt(idx) {
    if (G.phase !== 'place' || !G.placing) return;
    if (G.cells[idx].struct && G.cells[idx].struct !== G.placing) { addLog('Local ocupado', 'bad'); return; }
    const hpMult = getGlobalHpMult();
    if (G.cells[idx].struct === G.placing && !STRUCTS[G.placing]?.isLegendary) {
        if (G.cells[idx].level < 3) { G.cells[idx].level++; const s = STRUCTS[G.placing]; const nl = clampLevel(G.cells[idx].level);
            if (s.isBarricade) G.cells[idx].hp = Math.ceil(s.levels[nl].hp * hpMult);
            if (s.isWarrior) G.cells[idx].hp = Math.ceil(s.levels[nl].hp * hpMult);
            addLog(`✨ ${s.name} → LV${G.cells[idx].level+1}`, 'good');
        } else { addLog('Limite evolutivo!', 'bad'); return; }
    } else {
        const s = STRUCTS[G.placing];
        const isHpUnit = s.isBarricade || s.isWarrior;
        G.cells[idx] = { struct: G.placing, level: 0, hp: isHpUnit ? Math.ceil(s.levels[0].hp * hpMult) : null };
        addLog(`✓ ${s.name} posicionado!`, 'good');
        if (s.isLegendary) { discoverLegendary(G.placing); addLog(`🌟 LENDÁRIA desbloqueada!`, 'special'); showToast(`🌟 ${s.name} — LENDÁRIA!`); }
    }
    // Meta: Início Avançado (start_lv2)
    if (G.isStarterPick && getMetaLevel('start_lv2') > 0 && G.cells[idx].level === 0) {
        G.cells[idx].level = 1; const su = STRUCTS[G.cells[idx].struct];
        if (su.isBarricade || su.isWarrior) G.cells[idx].hp = Math.ceil(su.levels[1].hp * hpMult);
        addLog(`⬆️ Início Avançado: NV2!`, 'special');
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

function rerollShop() {
    if (G.coins < G.shopRerollCost) { showToast('Moedas insuficientes!'); return; }
    G.coins -= G.shopRerollCost;
    addLog(`🔄 Mercado atualizado (-${G.shopRerollCost}🪙)`, 'coin');
    G.shopRerollCost += 5;
    populateShop();
    updateHUD();
}

function populateShop() {
    const rcVal = document.getElementById('reroll-cost-val');
    if (rcVal) rcVal.textContent = G.shopRerollCost;
    const btnReroll = document.getElementById('btn-reroll');
    if (btnReroll) btnReroll.disabled = G.coins < G.shopRerollCost;

    const gn = document.getElementById('shop-grid-normal'); gn.innerHTML = '';
    const keys = Object.keys(STRUCTS).filter(k => !STRUCTS[k].isLegendary).sort(() => 0.5 - Math.random()).slice(0, 3);
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
        const structs = Object.entries(STRUCTS).filter(([k, v]) => v.type === type.key && !v.isLegendary);
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
            html += `<div class="codex-level codex-level-god"><span class="codex-level-num">🌟NV5</span><span class="codex-level-desc">DESPERTAR DIVINO — Dano ×1.5 · Requer: 💠Amplificador NV4 adjacente</span></div>`;
            html += `</div><div class="codex-tags">${s.tags.map(t => `<span class="codex-tag">${t}</span>`).join('')}</div></div>`;
        });
        html += '</div></div>';
    });

    // === LEGENDARY SECTION ===
    html += `<div class="codex-type-section"><div class="codex-type-header codex-type-legendary" style="--type-color:#ffa500"><span class="codex-type-icon">🌟</span><div><h3 class="codex-type-title">CONSTRUÇÕES LENDÁRIAS</h3><p class="codex-type-desc">Extremamente raras. Sem níveis. Efeito único e poderoso.</p></div></div><div class="codex-grid codex-grid-structs">`;
    LEGENDARY_KEYS.forEach(key => {
        const s = STRUCTS[key];
        const discovered = hasDiscoveredLegendary(key);
        if (discovered) {
            html += `<div class="codex-card codex-card-struct codex-card-legendary" style="--sc:${s.color};--sr:${s.rgb}">
                <div class="codex-struct-header"><span class="codex-card-icon">${s.icon}</span><div><div class="codex-card-name">${s.name}</div><div class="codex-struct-type" style="color:#ffa500">🌟 LENDÁRIA</div></div></div>
                ${s.isWarrior ? '<div class="codex-warrior-tag">⚔ GUERREIRO — UNIDADE COM VIDA</div>' : ''}
                <div class="codex-levels"><div class="codex-level codex-level-god"><span class="codex-level-num">🌟</span><span class="codex-level-desc">${s.levels[0].desc}</span></div></div>
                <div class="codex-tags">${s.tags.map(t => `<span class="codex-tag">${t}</span>`).join('')}</div></div>`;
        } else {
            html += `<div class="codex-card codex-card-struct codex-card-legendary codex-locked-legendary">
                <div class="codex-struct-header"><span class="codex-card-icon" style="filter:brightness(0);opacity:0.3">???</span><div><div class="codex-card-name">???</div><div class="codex-struct-type" style="color:#555">🌟 LENDÁRIA</div></div></div>
                <div class="codex-levels"><div class="codex-level"><span class="codex-level-desc" style="color:#444">Descubra esta construção lendária para revelar seus segredos.</span></div></div></div>`;
        }
    });
    html += '</div></div>';
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
// SOUL SHOP (ROGUELIKE META)
// ══════════════════════════════════════════════

function openSoulShop() { renderSoulShop(); document.getElementById('soul-overlay').classList.add('active'); }
function closeSoulShop() { const el = document.getElementById('soul-overlay'); if (el) el.classList.remove('active'); }

function renderSoulShop() {
    const grid = document.getElementById('soul-grid');
    if (!grid) return;
    document.getElementById('soul-total').textContent = G.souls || 0;
    grid.innerHTML = '';
    META_UPGRADES.forEach(up => {
        const curLv = getMetaLevel(up.id);
        const maxed = curLv >= up.maxLevel;
        const cost = maxed ? 0 : up.costs[curLv];
        const canBuy = !maxed && G.souls >= cost;
        const card = document.createElement('div');
        card.className = `option-card soul-card ${maxed ? 'soul-maxed' : ''} ${!canBuy && !maxed ? 'disabled' : ''}`;
        card.innerHTML = `
            <div class="option-icon">${up.icon}</div>
            <div class="option-name">${up.name}</div>
            <div class="option-desc">${up.desc}</div>
            <div class="soul-level-bar">${Array.from({length: up.maxLevel}, (_, i) => `<span class="soul-pip ${i < curLv ? 'filled' : ''}"></span>`).join('')}</div>
            <div class="option-tag">${maxed ? '✅ MÁXIMO' : `🟠 ${cost} Souls`}</div>
        `;
        if (canBuy) card.onclick = () => {
            G.souls -= cost;
            try { localStorage.setItem('wdSouls', String(G.souls)); } catch(ex) {}
            setMetaLevel(up.id, curLv + 1);
            addLog(`🟠 ${up.name} → NV${curLv + 1}`, 'special');
            showToast(`🟠 ${up.name} melhorado!`);
            renderSoulShop();
            updateHUD();
        };
        grid.appendChild(card);
    });
}

// ══════════════════════════════════════════════
// LIBRARY (RUN-BASED BUFFS)
// ══════════════════════════════════════════════

function openLibrary() {
    renderLibrary();
    document.getElementById('library-overlay').classList.add('active');
}
function closeLibrary() {
    const el = document.getElementById('library-overlay');
    if (el) el.classList.remove('active');
}

function renderLibrary() {
    const grid = document.getElementById('library-grid');
    if (!grid) return;
    document.getElementById('lib-soul-total').textContent = G.souls || 0;
    grid.innerHTML = '';
    
    const shelves = [
        { id: 'rare', name: 'PRATELEIRA COMUM', color: '#1abc9c' },
        { id: 'epic', name: 'PRATELEIRA ÉPICA', color: '#00bcd4' },
        { id: 'legendary', name: 'PRATELEIRA LENDÁRIA', color: '#e67e22' },
        { id: 'forbidden', name: 'O ABISMO', color: '#ff3333' }
    ];
    let booksArr = Object.values(LIBRARY_BOOKS);
    
    shelves.forEach(shelf => {
        const matchingBooks = booksArr.filter(b => b.rarity === shelf.id);
        if(!matchingBooks.length) return;
        
        const shelfDiv = document.createElement('div');
        shelfDiv.className = 'library-shelf';
        shelfDiv.innerHTML = `<div class="shelf-label" style="color:${shelf.color}; border-bottom: 1px solid ${shelf.color}55;">${shelf.name}</div><div class="shelf-books container-opt-grid"></div>`;
        const shelfBooksContainer = shelfDiv.querySelector('.shelf-books');
        
        matchingBooks.forEach(b => {
            const cost = b.cost;
            const canBuy = G.souls >= cost;
            const card = document.createElement('div');
            const isActive = G.activeBook === b.id;
            card.className = `option-card ${b.css} ${G.boughtBookThisRun ? 'disabled' : (!canBuy ? 'disabled' : '')} ${isActive ? 'soul-maxed' : ''}`;
            
            card.innerHTML = `
                <div class="option-icon" style="font-size:36px;">${b.icon}</div>
                <div class="option-name">${b.name}</div>
                <div class="option-desc">${b.desc}</div>
                <div class="option-tag" style="margin-top:auto;">${isActive ? '✅ ATIVO NESTA RUN' : (G.boughtBookThisRun ? '❌ FECHADO' : `🟠 ${cost} Souls`)}</div>
            `;
            
            if (!G.boughtBookThisRun && canBuy && !isActive) {
                card.onclick = () => buyBook(b.id, cost);
            }
            shelfBooksContainer.appendChild(card);
        });
        
        grid.appendChild(shelfDiv);
    });
}

function buyBook(id, cost) {
    if (G.boughtBookThisRun) { showToast("Apenas 1 livro por run!"); return; }
    if (G.souls < cost) { showToast("Souls insuficientes!"); return; }
    
    // Vale Livro logic
    if (id === 'book_voucher') {
        const last = localStorage.getItem('wdLastBook');
        if (!last || last === 'book_voucher') { showToast("Nenhum livro anterior salvo!"); return; }
        id = last; // Transmutes visually/mechanically to last book immediately!
        addLog(`🔖 Vale Livro se transformou em: ${LIBRARY_BOOKS[id].name}`, 'special');
    }
    
    G.souls -= cost;
    try { localStorage.setItem('wdSouls', String(G.souls)); } catch(ex) {}
    
    G.activeBook = id;
    G.boughtBookThisRun = true;
    
    // Apply immediate global modifiers where necessary
    if (id === 'book_green' || id === 'book_trinity') {
        const mult = id === 'book_trinity' ? 1.10 : 1.30;
        G.maxHp = Math.ceil(G.maxHp * mult);
        G.hp = Math.ceil(G.hp * mult);
        G.cells.forEach(c => {
            if (c.struct && c.hp !== null) c.hp = Math.ceil(c.hp * mult);
        });
    }
    
    updateHUD();
    renderLibrary();
    renderGrid();
    closeLibrary();
    addLog(`📚 Livro adquirido: ${LIBRARY_BOOKS[id].name}`, 'special');
    showToast(`Livro ativado pelo resto da run!`);
}

// ══════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════

document.addEventListener('keydown', e => {
    if ((e.code === 'Space' || e.code === 'Enter') && G.phase === 'idle') { e.preventDefault(); startWave(); }
    if (e.code === 'Escape') { closeCodex(); closeShop(); closeSoulShop(); }
});

let resizeTimeout;
window.addEventListener('resize', () => { clearTimeout(resizeTimeout); resizeTimeout = setTimeout(() => renderGrid(), 150); });

window.resetGame = resetGame; window.startWave = startWave; window.openShop = openShop; window.closeShop = closeShop;
window.openCodex = openCodex; window.closeCodex = closeCodex; window.switchCodexTab = switchCodexTab;
window.openSoulShop = openSoulShop; window.closeSoulShop = closeSoulShop;
window.confirmReset = confirmReset; window.closeConfirmReset = closeConfirmReset; window.executeReset = executeReset;
window.openLibrary = openLibrary; window.closeLibrary = closeLibrary;

initGrid(); updateHUD(); renderGrid(); 
try {
    showStarter();
    console.log("🎮 WAVE DEFENDER inicializado com sucesso!");
} catch(e) {
    console.error("❌ Erro na inicialização do jogo:", e);
}
