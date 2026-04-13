/**
 * WAVE DEFENDER - GAME ENGINE V7 (STABLE BASELINE)
 * Reconstrução total para estabilidade pós-truncagem.
 */

// ══════════════════════════════════════════════
// CONSTANTS & DATABASE
// ══════════════════════════════════════════════

const STRUCTS = {
    archer: {
        name: 'Arqueiro', icon: '🏹', color: '#2ecc71', rgb: '46, 204, 113', type: 'physical',
        tags: ['ranged', 'physical'],
        levels: [
            { atk: 8, spd: 4, desc: 'Tiro rápido' },
            { atk: 16, spd: 4, desc: 'Tiro duplo', targets: 2 },
            { atk: 26, spd: 3, desc: 'Chuva de flechas (3 alvos)', targets: 3 },
            { atk: 40, spd: 2, desc: 'Rajada (5 alvos)', targets: 5 }
        ]
    },
    sniper: {
        name: 'Atirador', icon: '🎯', color: '#34495e', rgb: '52, 73, 94', type: 'physical',
        tags: ['ranged', 'heavy', 'physical'],
        levels: [
            { atk: 25, spd: 12, desc: 'Foca no mais forte', focusStrongest: true },
            { atk: 45, spd: 10, desc: 'Perfura 50% armadura', focusStrongest: true, armorPen: 0.5 },
            { atk: 80, spd: 8, desc: 'Execução: 1.5x HP<30%', focusStrongest: true, execute: 0.3 },
            { atk: 130, spd: 7, desc: 'Headshot <15%', focusStrongest: true, armorPen: 0.8, execute: 0.3, instakill: 0.15 }
        ]
    },
    barricade: {
        name: 'Muralha', icon: '🛡️', color: '#7f8c8d', rgb: '127, 140, 141', type: 'physical',
        passive: true, isBarricade: true, tags: ['defense', 'heavy', 'physical'],
        levels: [
            { hp: 70, thorns: 0, desc: 'Absorve 70 de dano' },
            { hp: 180, thorns: 8, desc: '180 HP + Espinhos(8)' },
            { hp: 350, thorns: 18, regen: 20, desc: '350 HP + Espinhos + Regen' },
            { hp: 700, thorns: 45, regen: 40, desc: 'Bastião Intransponível' }
        ]
    },
    forge: {
        name: 'Forja', icon: '⚒️', color: '#95a5a6', rgb: '149, 165, 166', type: 'physical',
        passive: true, tags: ['buff', 'industrial', 'physical'],
        levels: [
            { desc: 'Torres adj. +25% vel.', spdBuff: 0.25 },
            { desc: '+40% vel.', spdBuff: 0.40 },
            { desc: '+40% vel. + 15% dano', spdBuff: 0.40, atkBuff: 0.15 },
            { desc: '+60% vel. +30% dano', spdBuff: 0.60, atkBuff: 0.30 }
        ]
    },
    mage: {
        name: 'Mago', icon: '🧙', color: '#9b59b6', rgb: '155, 89, 182', type: 'magical',
        tags: ['magic', 'elemental'],
        levels: [
            { atk: 12, spd: 10, desc: 'Projétil arcano' },
            { atk: 22, spd: 8, desc: 'Congela (2 turnos)', freeze: 2 },
            { atk: 40, spd: 6, desc: 'Ignora armadura + congela', freeze: 3, noArmor: true },
            { atk: 65, spd: 5, desc: 'Vórtice Arcano', freeze: 4, noArmor: true }
        ]
    },
    fire: {
        name: 'Torre Fogo', icon: '🔥', color: '#e67e22', rgb: '230, 126, 34', type: 'magical',
        tags: ['elemental', 'aoe', 'magic'],
        levels: [
            { atk: 6, spd: 7, desc: 'Chama + DOT', targets: 1, dot: 3 },
            { atk: 10, spd: 6, desc: 'Queima 2 alvos', targets: 2, dot: 5 },
            { atk: 18, spd: 5, desc: 'Inferno 3 alvos', targets: 3, dot: 8 },
            { atk: 35, spd: 4, desc: 'Imolação', targets: 5, dot: 15 }
        ]
    },
    tesla: {
        name: 'Tesla', icon: '⚡', color: '#f1c40f', rgb: '241, 196, 15', type: 'magical',
        tags: ['magic', 'electric'],
        levels: [
            { atk: 8, spd: 8, desc: 'Raio cadeia (2)', targets: 2 },
            { atk: 15, spd: 7, desc: 'Raio cadeia (3)', targets: 3 },
            { atk: 25, spd: 6, desc: 'Tempestade (todos)', targets: 99 },
            { atk: 45, spd: 5, desc: 'Plasma', targets: 99 }
        ]
    },
    library: {
        name: 'Amplificador', icon: '💠', color: '#3498db', rgb: '52, 152, 219', type: 'support',
        passive: true, tags: ['buff', 'amplify', 'support'],
        levels: [
            { desc: 'Sincronia Arcaica', levelBuff: 1 },
            { desc: 'Ressonância de Almas', levelBuff: 1, atkBuff: 0.25 },
            { desc: 'Conhecimento Absoluto', levelBuff: 2, atkBuff: 0.3 },
            { desc: 'Despertar Divino', levelBuff: 2, atkBuff: 0.5, godAwaken: true }
        ]
    },
    venom: {
        name: 'Lab. Químico', icon: '🧪', color: '#8e44ad', rgb: '142, 68, 173', type: 'magical',
        passive: true, tags: ['buff', 'poison', 'magic'],
        levels: [
            { desc: 'Torres adj. DOT: 2', poisonGrant: 2 },
            { desc: 'DOT: 5', poisonGrant: 5 },
            { desc: 'DOT: 9', poisonGrant: 9 },
            { desc: 'DOT: 18 -30% arm.', poisonGrant: 18, armorReduce: 0.3 }
        ]
    },
    shrine: {
        name: 'Santuário', icon: '⛩️', color: '#1abc9c', rgb: '26, 188, 156', type: 'magical',
        passive: true, tags: ['heal', 'magic'],
        levels: [
            { heal: 6, maxhp: 3, desc: '+6 HP +3 MaxHP/wave' },
            { heal: 12, maxhp: 5, desc: '+12 HP +5 MaxHP/wave' },
            { heal: 22, maxhp: 8, desc: 'Restauração divina' },
            { heal: 50, maxhp: 15, desc: 'Fonte Eterna' }
        ]
    },
    obelisk: {
        name: 'Obelisco', icon: '🗿', color: '#e74c3c', rgb: '231, 76, 60', type: 'magical',
        passive: true, tags: ['buff', 'magic'],
        levels: [
            { desc: 'Mágicas adj. +30% dano', boostMagical: 0.3 },
            { desc: '+60% dano mágico', boostMagical: 0.6 },
            { desc: '+60% + Congela', boostMagical: 0.6, freezeAura: true },
            { desc: '+120% dano mágico', boostMagical: 1.2, freezeAura: true }
        ]
    },
    cofre: {
        name: 'Cofre', icon: '🏦', color: '#d4af37', rgb: '212, 175, 55', type: 'support',
        passive: true, tags: ['economy', 'support'],
        levels: [
            { desc: '+3🪙/wave + gotejo', coinsPerWave: 3, drip: 1 },
            { desc: '+8🪙/wave + gotejo', coinsPerWave: 8, drip: 2 },
            { desc: '+15🪙/wave + gotejo', coinsPerWave: 15, drip: 3 },
            { desc: '+30🪙 + Cashback 15%', coinsPerWave: 30, drip: 5, cashback: 0.15 }
        ]
    },
    base_militar: {
        name: 'Base Militar', icon: '🏰', color: '#cd853f', rgb: '205, 133, 63', type: 'support',
        passive: true, tags: ['buff', 'military', 'support'],
        levels: [
            { desc: 'Físicas adj. +25% dano', physDmgBuff: 0.25 },
            { desc: '+45% dano físico', physDmgBuff: 0.45 },
            { desc: '+45% dano + 20% vel.', physDmgBuff: 0.45, physSpdBuff: 0.20 },
            { desc: '+80% dano + 40% vel.', physDmgBuff: 0.80, physSpdBuff: 0.40 }
        ]
    },
    espadachim: {
        name: 'Espadachim', icon: '⚔️', color: '#c0392b', rgb: '192, 57, 43', type: 'physical',
        isWarrior: true, tags: ['warrior', 'melee', 'physical'],
        levels: [
            { hp: 60, atk: 12, spd: 8, selfHeal: 0.10, desc: 'Linha de frente básica' },
            { hp: 110, atk: 20, spd: 7, selfHeal: 0.12, desc: 'Golpe forte' },
            { hp: 180, atk: 32, spd: 6, selfHeal: 0.15, desc: 'Lâmina afiada' },
            { hp: 280, atk: 50, spd: 5, selfHeal: 0.20, desc: 'Lâmina Imortal', critChance: 0.2 }
        ]
    },
    bruxo: {
        name: 'Bruxo', icon: '🪄', color: '#6c3483', rgb: '108, 52, 131', type: 'magical',
        isWarrior: true, tags: ['warrior', 'debuff', 'magic'],
        levels: [
            { hp: 50, atk: 5, spd: 10, debuffTargets: 1, atkReduce: 0.15, desc: 'Enfraquece 1 (-15% ATK)' },
            { hp: 80, atk: 9, spd: 9, debuffTargets: 2, atkReduce: 0.20, desc: '-20% ATK em 2 alvos' },
            { hp: 120, atk: 14, spd: 8, debuffTargets: 3, atkReduce: 0.25, armorReduce: 0.15, desc: '-25% ATK -15% ARM (3)' },
            { hp: 180, atk: 22, spd: 7, debuffTargets: 5, atkReduce: 0.35, armorReduce: 0.25, desc: 'Maldição em Massa' }
        ]
    },
    curandeiro: {
        name: 'Curandeiro', icon: '💉', color: '#27ae60', rgb: '39, 174, 96', type: 'support',
        isWarrior: true, passive: true, tags: ['warrior', 'heal', 'support'],
        levels: [
            { hp: 40, healPerTick: 5, desc: 'Cura guerreiros adj. +5/tick' },
            { hp: 70, healPerTick: 8, desc: 'Cura +8/tick' },
            { hp: 110, healPerTick: 14, desc: 'Cura +14/tick' },
            { hp: 160, healPerTick: 22, desc: 'Restauração Divina' }
        ]
    },
    acampamento: {
        name: 'Acampamento', icon: '⛺', color: '#d35400', rgb: '211, 84, 0', type: 'support',
        passive: true, tags: ['buff', 'camp', 'support'],
        levels: [
            { desc: 'Guerreiros adj. +20% dano', warriorDmgBuff: 0.20 },
            { desc: '+35% dano guerreiro', warriorDmgBuff: 0.35 },
            { desc: '+50% dano', warriorDmgBuff: 0.50 },
            { desc: '+80% dano', warriorDmgBuff: 0.80 }
        ]
    },
    bardo: {
        name: 'Bardo', icon: '🪉', color: '#e8a317', rgb: '232,163,23',
        type: 'support', passive: false, isWarrior: true, isBarricade: false, isLegendary: true,
        tags: ['suporte', 'cura', 'buff', 'lendário'],
        levels: [{ desc: 'Cura global (cresce com wave, max 60). Ao receber dano: +40% dano global 5s.', atk: 8, spd: 12, hp: 150, selfHeal: 0.12 }]
    },
    trabuco: {
        name: 'Trabuco', icon: '⚙️', color: '#b8860b', rgb: '184,134,11',
        type: 'physical', passive: false, isWarrior: false, isBarricade: false, isLegendary: true,
        tags: ['área', 'pesado', 'anti-tank', 'lendário'],
        levels: [{ desc: 'Dano = 25% HP máx do alvo. Splash 5. Estilhaça armadura (-50%).', atk: 0, spd: 18, armorBreak: 0.5 }]
    },
    magico: {
        name: 'Mágico', icon: '🎭', color: '#00bcd4', rgb: '0,188,212',
        type: 'magical', passive: false, isWarrior: false, isBarricade: false, isLegendary: true,
        tags: ['controle', 'transformação', 'lendário'],
        levels: [{ desc: '35% chance: Transforma inimigo em 🐇. Bosses: dano maciço (200).', atk: 200, spd: 15 }]
    }
};

const LEGENDARY_KEYS = ['bardo', 'trabuco', 'magico'];

function getCardTypeBar(type) {
    const ti = type === 'physical' ? {icon:'🗡️',label:'FÍSICO',color:'#e74c3c'} : 
               (type === 'magical' ? {icon:'✨',label:'MÁGICO',color:'#9b59b6'} : 
               {icon:'⚙️',label:'SUPORTE',color:'#d4af37'});
    return `<div class="card-type-bar" style="background:${ti.color}">${ti.icon} ${ti.label}</div>`;
}

const COMBOS = [
    // ── WARRIOR SYNERGIES ──
    { id:'linha_frente', name:'INDESTRUTÍVEL', icon: '🛡️', color:'#27ae60',
      structs:['espadachim','curandeiro'], desc:'Tropa indestrutível',
      detail:'O Curandeiro tem cura +40%. O Espadachim adjacente ganha +15% de armadura. Sobrevivência máxima.',
      bonus:'frontline', category:'warrior' },
    { id:'forca_guerra', name:'OFENSIVA', icon: '⚔️', color:'#c0392b',
      structs:['espadachim','acampamento'], desc:'Ofensiva pesada na linha 1',
      detail:'Acampamento dobra a vida do Espadachim. O Espadachim recebe +30% de dano base.',
      bonus:'warforce', category:'warrior' },
    { id:'fortaleza_viva', name:'FORTALEZA', icon: '🏰', color:'#3498db',
      structs:['base_militar','curandeiro'], desc:'Defesa Absoluta',
      detail:'Sempre que o Curandeiro curar, a Base Militar ganha +10% de evasão. Dano na Base reduzido em 20%.',
      bonus:'fortress', category:'warrior' },
    { id:'acampamento_medico', name:'MEDCAMP', icon: '💉', color:'#2ecc71',
      structs:['curandeiro','acampamento'], desc:'Campo de cura expandido',
      detail:'Acampamento cura guerreiros adjacentes +8/tick. Curandeiro adjacente ganha +50% heal.',
      bonus:'medcamp', category:'warrior' },
    // ── ELEMENTAL & MAGIC ──
    { id:'corrupcao', name:'MIASMA', icon: '☣️', color:'#8e44ad',
      structs:['bruxo','venom'], desc:'Veneno acelerado e letal',
      detail:'Lab. Químico recebe alcance global de DOT. Bruxo debuffa +2 alvos extras com veneno simultâneo.',
      bonus:'corrupt', category:'elemental' },
    { id:'reator_plasma', name:'PLASMA', icon: '⚡', color:'#f39c12',
      structs:['tesla','obelisk'], desc:'Tempestade de raios em cadeia',
      detail:'Tesla atinge +3 alvos. Obelisco garante chance de paralisação total a todos atingidos.',
      bonus:'plasma', category:'elemental' },
    { id:'regen_arcana', name:'MANA', icon: '💧', color:'#1abc9c',
      structs:['shrine','mage'], desc:'Cura mística retroalimentada',
      detail:'Todo dano causado por Magos aumenta permanentemente o HP máximo do Santuário.',
      bonus:'mana_spring', category:'elemental' },
    { id:'inferno_toxico', name:'TÓXICO', icon: '🔥', color:'#e67e22',
      structs:['fire','venom'], desc:'Chamas envenenadas',
      detail:'DOT de fogo e veneno se combinam: 2x DOT quando ambos ativos no alvo. -20% armadura permanente.',
      bonus:'toxic_fire', category:'elemental' },
    // ── TACTICS & ECONOMY ──
    { id:'economia', name:'SAQUE', icon: '💰', color:'#f1c40f',
      structs:['cofre','acampamento'], desc:'Pilhagem de guerra',
      detail:'Acampamento agora concede +2 de moedas (Cofre) após a morte de inimigos boss. Cofre rende +60%.',
      bonus:'plunder', category:'economy' },
    { id:'logistica', name:'LOGÍSTICA', icon: '📦', color:'#cd853f',
      structs:['cofre','base_militar'], desc:'Recursos velozes',
      detail:'Geração do Cofre +50%. Estruturas Militares ganham +1 de nível grátis.',
      bonus:'logistics', category:'economy' },
    { id:'arsenal', name:'ARTILHARIA', icon: '🔭', color:'#e74c3c',
      structs:['base_militar','sniper'], desc:'Tiro de longo alcance tático',
      detail:'Atiradores recebem Velocidade Ataque +50% se do lado de Base.',
      bonus:'artillery', category:'economy' },
    { id:'arsenal2', name:'BATERIA', icon: '🏹', color:'#2ecc71',
      structs:['base_militar','archer'], desc:'Arqueiros aprimorados',
      detail:'Arqueiros ganham +50% velocidade e +1 alvo adicional.',
      bonus:'artillery', category:'economy' }
];

const ASCENSAO_DOURADA = {
    id:'ascensao', name:'ASCENSÃO DOURADA', icon:'🌟', color:'#ffd700',
    structs:'Qualquer NV5 + Suporte adj.', desc:'Poder divino amplificado',
    detail:'Estrutura NV5 adj. Suporte: Bônus global +10% dano e +10% vel.',
    bonus:'ascension', category:'special'
};

const BASE_ENEMIES = [
    { name: 'Slime',           icon: '💧', hp: 12,  atk: 1,  armor: 0,  tier: 0, desc: 'Criatura gelatinosa fraca e lenta.' },
    { name: 'Goblin',          icon: '👺', hp: 20,  atk: 1,  armor: 0,  tier: 1, desc: 'Ágil e traiçoeiro. Ataca em grandes grupos.' },
    { name: 'Orc Guerreiro',   icon: '🪓', hp: 45,  atk: 3,  armor: 1,  tier: 2, desc: 'Bruto com armadura leve e força bruta.' },
    { name: 'Mago Sombrio',    icon: '🔮', hp: 75,  atk: 8,  armor: 1,  tier: 3, desc: 'Canaliza poder arcano sombrio de longo alcance.' },
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
    { name: 'Monken',          icon: '🐒', hp: 600, atk: 15, armor: 10, tier: 6, desc: 'O Viajante Dimensional. Um ser errático que carrega tesouros de almas em sua forma instável.', special: 'anomaly', isMonken: true, soulDropAmt: 15 },
];

const ENEMIES_DB = [...BASE_ENEMIES, ...SPECIAL_ENEMIES,
    { name: 'Malmir', icon: '🦧', hp: 1200, atk: 55, armor: 15, tier: 7, desc: 'O Pesadelo Primordial. Uma entidade que transcende as ondas, buscando apenas o fim da luz.', special: 'boss', deathDmg: 0, structDot: 0, isMalmir: true, soulDropAmt: 40 }
].sort((a, b) => a.tier !== b.tier ? a.tier - b.tier : a.hp - b.hp); 

const ENEMY_AURAS = {
    'white': { name: 'Abençoado', icon: '⚪', hpMult: 1.2, atkMult: 1.0, coinMult: 3.0, dropSoul: true, soulAmt: 2 },
    'red': { name: 'Berserker', icon: '🔴', hpMult: 1.5, atkMult: 2.0, coinMult: 2.0, dropSoul: true, soulAmt: 1 },
    'blue': { name: 'Ártico', icon: '🔵', hpMult: 2.5, atkMult: 1.0, coinMult: 1.5 },
    'cyan': { name: 'Fantasma', icon: '🌐', hpMult: 1.0, atkMult: 1.3, coinMult: 2.5 },
    'yellow': { name: 'Dourado', icon: '🟡', hpMult: 1.0, atkMult: 1.0, coinMult: 10.0 },
    'green': { name: 'Regenerativo', icon: '🟢', hpMult: 3.0, atkMult: 0.8, coinMult: 1.5 },
    'darkness': { name: 'Sombrio', icon: '🌑', hpMult: 3.5, atkMult: 1.1, coinMult: 5.0, dropSoul: true, soulAmt: 3 }
};

const TIER_COLORS = { 1: '#95a5a6', 2: '#2ecc71', 3: '#3498db', 4: '#e74c3c', 5: '#9b59b6' };
const SPECIAL_COLORS = { 'venomous': '#2ecc71', 'shooter': '#e67e22', 'armored': '#95a5a6', 'elite': '#c0392b', 'boss': '#ff3333', 'overlord': '#6c3483', 'explosive': '#f39c12' };

const SOUL_TREE_NODES = {
    // ⚔️ Físico
    'phy_1': { branch: 'phy', name: 'Lâmina Penetrante', icon: '🗡️', desc: 'Ignora 10% armadura por nível.', cost: 1, req: null, maxLv: 3, costPerLv: [1, 2, 4] },
    'phy_2': { branch: 'phy', name: 'Instinto', icon: '🎯', desc: '+25% Dano em HP < 50%.', cost: 3, req: 'phy_1' },
    'phy_3': { branch: 'phy', name: 'Execução Real', icon: '💀', desc: '+35% Dano em Finalização.', cost: 6, req: 'phy_2' },
    
    // ✨ Mágico
    'mag_1': { branch: 'mag', name: 'Maldição', icon: '🌀', desc: 'Debuffs duram +45%.', cost: 1, req: null },
    'mag_2': { branch: 'mag', name: 'Ruína', icon: '🔥', desc: '+15% Dano em debuffados/nível.', cost: 2, req: 'mag_1', maxLv: 3, costPerLv: [2, 4, 7] },
    'mag_3': { branch: 'mag', name: 'Gelo Rúnico', icon: '❄️', desc: '10% chance de Congelamento.', cost: 6, req: 'mag_2' },
    
    // 🪙 Economia
    'eco_1': { branch: 'eco', name: 'Bolsas de Ouro', icon: '💵', desc: '+20 Moedas iniciais por nível.', cost: 1, req: null, maxLv: 3, costPerLv: [1, 2, 3] },
    'eco_2': { branch: 'eco', name: 'Logística de Campo', icon: '🚛', desc: 'Reroll -3 custo/nível (NV3 Grátis).', cost: 2, req: 'eco_1', maxLv: 3, costPerLv: [2, 4, 7] },
    'eco_3': { branch: 'eco', name: 'Ganância de Guerra', icon: '💰', desc: 'Moedas 3x em Chefes/Elites.', cost: 6, req: 'eco_2' },

    // 🛡️ Neutro
    'neu_1': { branch: 'neu', name: 'Fortificação', icon: '🧱', desc: '+25 HP base por nível.', cost: 1, req: null, maxLv: 3, costPerLv: [1, 2, 3] },
    'neu_2': { branch: 'neu', name: 'Singularidade', icon: '🌌', desc: 'Inimigos iniciam Congelados.', cost: 3, req: 'neu_1' },
    'neu_3': { branch: 'neu', name: 'Destino Lendário', icon: '🌟', desc: '+12% Sorte Lendária por nível.', cost: 3, req: 'neu_2', maxLv: 3, costPerLv: [3, 5, 8] },

    // ⚔ Guerreiros
    'war_1': { branch: 'war', name: 'Couraça Vital', icon: '❤️', desc: '+50% HP Máximo.', cost: 2, req: null },
    'war_2': { branch: 'war', name: 'Irmandade Marcial', icon: '🛡️', desc: '+25% Dano e Auto-Cura.', cost: 4, req: 'war_1' },
    'war_3': { branch: 'war', name: 'Fúria Imortal', icon: '🔥', desc: 'HP < 25%: Dano Triplicado.', cost: 8, req: 'war_2' },

    // 📚 Biblioteca
    'lib_1': { branch: 'lib', name: 'Foco Literário I', icon: '📖', desc: 'Poder do Livro +25%.', cost: 2, req: null },
    'lib_2': { branch: 'lib', name: 'Foco Literário II', icon: '📚', desc: 'Poder do Livro +35%.', cost: 4, req: 'lib_1' },
    'lib_3': { branch: 'lib', name: 'Maestria Literária', icon: '🌌', desc: 'Poder do Livro +60%.', cost: 8, req: 'lib_2' },

    // 🌟 Suprema
    'apex_offense': { branch: 'apex', name: 'Sinergia Ofensiva', icon: '⚔️', desc: 'Combos: +30% Dano Real.', cost: 10, req: 'ANY_TIER_3' },
    'apex_vital': { branch: 'apex', name: 'Sinergia Vital', icon: '🛡️', desc: 'Combos: Cura +200 Vida.', cost: 12, req: 'ANY_TIER_3' },
    'apex_utility': { branch: 'apex', name: 'Alta Frequência', icon: '🧠', desc: 'Combos utilitários 5x mais fortes.', cost: 12, req: 'ANY_TIER_3' }
};

const LIBRARY_BOOKS = {
    'book_blue': { id: 'book_blue', rarity: 'rare', name: 'Códice do Vento', css: 'book-rare', icon: '📖', desc: '+20% Cadência Global em todas as torres.', cost: 8 },
    'book_red': { id: 'book_red', rarity: 'rare', name: 'Grimório Flamífero', css: 'book-rare', icon: '📜', desc: '+25% Dano Global em todas as torres.', cost: 8 },
    'book_green': { id: 'book_green', rarity: 'epic', name: 'Relíquia da Vida', css: 'book-epic', icon: '🌿', desc: '+30% HP Máximo e cura total no uso.', cost: 15 },
    'book_yellow': { id: 'book_yellow', rarity: 'epic', name: 'Pacto da Avareza', css: 'book-epic', icon: '💰', desc: '+50% Moedas de todas as fontes.', cost: 12 },
    'book_trinity': { id: 'book_trinity', rarity: 'legendary', name: 'Tomo da Trindade', css: 'book-legendary', icon: '🔱', desc: '+20% Dano, SPD e HP Global.', cost: 30 },
    'book_orange': { id: 'book_orange', rarity: 'epic', name: 'Chama das Almas', css: 'book-epic', icon: '🕯️', desc: '+15% chance de Inimigos Especiais (⚪/🔴).', cost: 15 },
    'book_abyss': { id: 'book_abyss', rarity: 'forbidden', name: 'O Vazio', css: 'book-forbidden', icon: '🌑', desc: 'DANO MASSIVO (+75%), mas BASE tem apenas 1 HP.', cost: 66 },
    'book_voucher': { id: 'book_voucher', rarity: 'rare', name: 'Vale-Livro', css: 'book-rare', icon: '🔖', desc: 'Se transforma no livro da Run anterior.', cost: 5 }
};

// ══════════════════════════════════════════════
// STATE
// ══════════════════════════════════════════════

let G = {
    wave: 1, hp: 50, maxHp: 50, coins: 35, kills: 0, highScore: 1, souls: 0,
    soulsThisRun: 0,
    gridSize: 3, cells: [], 
    phase: 'idle', 
    timer: null,
    totalEnemies: 0, currentEnemies: 0,
    activeCombos: [], pendingReward: false,
    placing: null, placingName: null, placingCost: 0,
    shopRerollCost: 3,
    isStarterPick: false,
    analytics: {},
    activeBook: null,
    boughtBookThisRun: false
};

const bestiaryData = JSON.parse(localStorage.getItem('wdBestiary') || '{}');
G.highScore = Number(localStorage.getItem('wdHighScore') || 1);
G.souls = Number(localStorage.getItem('wdSouls') || 0);

// Implementação Soul Tree: Início de Run
function applyStartSoulBuffs() {
    const neu1 = getSoulStacks('neu_1');
    if (neu1 > 0) { G.maxHp += (neu1 * 25); G.hp = G.maxHp; }
    
    const eco1 = getSoulStacks('eco_1');
    if (eco1 > 0) { G.coins += (eco1 * 20); }
}
applyStartSoulBuffs();

// ══════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════

function addLog(msg, type = '') {
    const log = document.getElementById('battle-log');
    const div = document.createElement('div');
    div.className = `log-entry ${type ? 'log-'+type : ''}`;
    div.textContent = msg;
    log.prepend(div);
    if (log.children.length > 30) log.lastChild.remove();
}

function updateHUD() {
    document.getElementById('h-wave').textContent = G.wave;
    document.getElementById('h-coins').textContent = Math.floor(G.coins);
    document.getElementById('h-souls').textContent = G.souls;
    document.getElementById('h-hp').textContent = Math.max(0, G.hp);
    document.getElementById('h-maxhp').textContent = G.maxHp;
    document.getElementById('h-kills').textContent = G.kills;
    document.getElementById('h-record').textContent = G.highScore;
    
    const fill = document.getElementById('h-hp-fill');
    fill.style.width = (Math.max(0, G.hp) / G.maxHp * 100) + '%';
    
    const badge = document.getElementById('phase-badge');
    badge.className = 'badge badge-phase-' + G.phase;
    badge.textContent = G.phase.toUpperCase();
    
    const leitorilSlot = document.getElementById('h-leitoril-slot');
    const leitorilIcon = document.getElementById('h-leitoril-icon');
    if (G.activeBook) {
        leitorilSlot.classList.remove('empty');
        leitorilIcon.textContent = LIBRARY_BOOKS[G.activeBook].icon;
    } else {
        leitorilSlot.classList.add('empty');
        leitorilIcon.textContent = '';
    }

    const btnStart = document.getElementById('btn-start');
    if (btnStart) {
        btnStart.textContent = G.phase === 'wave' ? 'EM COMBATE' : `▶ WAVE ${G.wave}`;
        btnStart.disabled = G.phase !== 'idle';
    }
}

function flash(type) {
    const el = document.getElementById('flash-' + type);
    el.classList.add('active-flash');
    setTimeout(() => el.classList.remove('active-flash'), 150);
}

function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
}

function spawnText(x, y, txt, type) {
    const el = document.createElement('div');
    el.className = `float-text float-${type}`;
    el.style.left = x + 'px'; el.style.top = y + 'px';
    el.textContent = txt;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1000);
}


function getCashbackRate() { return hasCombo('logistics') ? 0.1 : 0; }
function recordEncounter(name) { if (!bestiaryData[name]) bestiaryData[name] = { kills: 0 }; localStorage.setItem('wdBestiary', JSON.stringify(bestiaryData)); }
function recordKill(name) { 
    if (!bestiaryData[name]) recordEncounter(name);
    bestiaryData[name].kills++; 
    localStorage.setItem('wdBestiary', JSON.stringify(bestiaryData)); 
}
function discoverLegendary(key) { const disc = JSON.parse(localStorage.getItem('wdLegendaries') || '[]'); if (!disc.includes(key)) { disc.push(key); localStorage.setItem('wdLegendaries', JSON.stringify(disc)); } }
function hasDiscoveredLegendary(key) { return JSON.parse(localStorage.getItem('wdLegendaries') || '[]').includes(key); }

// ══════════════════════════════════════════════
// GRID LOGIC
// ══════════════════════════════════════════════

function initGrid() {
    const container = document.getElementById('grid-container');
    container.style.gridTemplateColumns = `repeat(${G.gridSize}, 85px)`;
    G.cells = Array(G.gridSize * G.gridSize).fill(null).map(() => ({ struct: null, level: 0, hp: null }));
}

function renderGrid() {
    const container = document.getElementById('grid-container');
    container.innerHTML = '';
    G.cells.forEach((c, i) => {
        const div = document.createElement('div');
        div.className = `cell ${c.struct ? 'occupied' : 'empty'}`;
        if (G.phase === 'place') {
            const sPlacing = STRUCTS[G.placing];
            const canPlaceNew = !c.struct;
            const canUpgrade = c.struct === G.placing && c.level < sPlacing.levels.length - 1;
            
            if (canPlaceNew || canUpgrade) {
                div.classList.add('placeable');
                if (canUpgrade) div.classList.add('upgradeable-slot');
            }
        }
        
        if (c.struct) {
            const s = STRUCTS[c.struct];
            div.dataset.struct = c.struct;
            div.style.setProperty('--sc', s.color);
            div.style.setProperty('--sr', s.rgb);
            
            // Type Identity
            div.classList.add('type-' + s.type);
            if (s.isWarrior) div.classList.add('warrior-unit');
            
            let iconHTML = `<div class="cell-icon">${s.icon}</div>`;
            let nameHTML = `<div class="cell-name">${s.name}</div>`;
            
            // Calcule o nvel bnus do Amplificador para o HUD
            let bonusLvlHUD = 0;
            getAdj(i).forEach(n => {
                const nc = G.cells[n];
                if (nc?.struct === 'library') bonusLvlHUD += STRUCTS.library.levels[clampLevel(nc.level)].levelBuff || 0;
            });

            const currentEff = Math.min(4, c.level + bonusLvlHUD);
            let levelHTML = c.level > 0 || bonusLvlHUD > 0 ? `<div class="cell-level">LV${c.level + 1}</div>` : '';
            
            // Buff indicators
            let bonusHTML = '';
            if (bonusLvlHUD > 0) bonusHTML += `<div class="level-buff-badge">+${bonusLvlHUD}</div>`;
            if (s.isWarrior) iconHTML += `<div class="warrior-indicator">⚔️</div>`;
            
            // Level 5/6 Visuals
            const totalLvEff = c.level + bonusLvlHUD;
            if (totalLvEff >= 5) {
                div.classList.add('evo-lv6');
            } else if (c.level === 3) {
                const adjAmps = getAdj(i).filter(n => G.cells[n]?.struct === 'obelisk' && G.cells[n].level === 3);
                if (adjAmps.length > 0) div.classList.add('evo-lv5'); else div.classList.add('evo-lv4');
            }

            // HP bar for warriors/barricades
            let hpHTML = '';
            if (c.hp !== null) {
                const max = Math.ceil(s.levels[clampLevel(c.level)].hp * getGlobalHpMult());
                const pct = (c.hp / max) * 100;
                hpHTML = `<div class="hp-bar"><div class="hp-fill ${s.isWarrior ? 'warrior-hp' : ''}" style="width:${pct}%"></div></div>`;
            }

            // Passive special indicator
            if (c.struct === 'base_militar') div.classList.add('militar-base');
            
            div.innerHTML = iconHTML + nameHTML + levelHTML + bonusHTML + hpHTML;
            div.onmouseenter = () => highlightSynergies(i);
            div.onmouseleave = clearHighlights;
        } else {
            div.innerHTML = '<span style="opacity:0.2">+</span>';
        }
        div.onclick = () => handleCellClick(i);
        container.appendChild(div);
    });
}

function getAdj(i) {
    const res = [], n = G.gridSize, r = Math.floor(i/n), c = i%n;
    if (r > 0) res.push(i-n); if (r < n-1) res.push(i+n);
    if (c > 0) res.push(i-1); if (c < n-1) res.push(i+1);
    return res;
}

function clampLevel(lv) { return Math.min(Math.max(0, lv), 3); }

// ══════════════════════════════════════════════
// SYNERGY & COMBOS
// ══════════════════════════════════════════════

function detectCombos() {
    G.activeCombos = [];
    const detected = new Set();
    const comboBar = document.getElementById('active-combos');
    comboBar.innerHTML = '';

    G.cells.forEach((c, i) => {
        if (!c.struct) return;
        COMBOS.forEach(combo => {
            // New: structs is now an array of struct keys
            if (!combo.structs.includes(c.struct)) return;
            const otherKeys = combo.structs.filter(s => s !== c.struct);
            // If combo has same struct twice (e.g. 2x mage), check adj for same
            const neededKey = otherKeys.length > 0 ? otherKeys[0] : c.struct;
            const adjs = getAdj(i).filter(n => G.cells[n]?.struct === neededKey);
            if (adjs.length > 0) {
                const comboId = [combo.id, i, adjs[0]].sort().join('_');
                if (!detected.has(comboId)) {
                    detected.add(comboId);
                    G.activeCombos.push({ ...combo, cells: [i, ...adjs] });
                }
            }
        });
    });

    // Special: Ascensão Dourada
    const hasGodTier = G.cells.some((c, i) => c.level === 3 && getAdj(i).some(n => G.cells[n]?.struct === 'obelisk' && G.cells[n].level === 3));
    if (hasGodTier) G.activeCombos.push({ ...ASCENSAO_DOURADA, cells: G.cells.map((_, i) => i) });

    // Render Pills
    const uniqueCombos = [...new Map(G.activeCombos.map(c => [c.id, c])).values()];
    if (uniqueCombos.length > 0) {
        comboBar.style.display = 'flex';
        uniqueCombos.forEach(c => {
            const pill = document.createElement('div'); pill.className = 'combo-pill';
            pill.style.setProperty('--cp', c.color);
            pill.innerHTML = `<span class="combo-pill-icon">${c.icon || '⚡'}</span><span class="combo-pill-name">${c.desc}</span>`;
            pill.title = c.detail;
            comboBar.appendChild(pill);
        });
    } else { comboBar.style.display = 'none'; }
}

function highlightSynergies(i) {
    const c = G.cells[i]; if (!c.struct) return;
    const cellEls = document.getElementById('grid-container').children;
    cellEls[i].classList.add('synergy-source');
    
    // Check combos
    G.activeCombos.forEach(combo => {
        if (combo.cells.includes(i)) {
            combo.cells.forEach(idx => { if (idx !== i) cellEls[idx].classList.add('synergy-target'); });
        }
    });

    // Check structural buffs
    const s = STRUCTS[c.struct];
    if (c.struct === 'forge' || c.struct === 'obelisk' || c.struct === 'base_militar' || c.struct === 'acampamento' || c.struct === 'curandeiro' || c.struct === 'library') {
        getAdj(i).forEach(n => { if (G.cells[n]?.struct) cellEls[n].classList.add('synergy-target'); });
    }
}

function clearHighlights() {
    document.querySelectorAll('.cell').forEach(el => el.classList.remove('synergy-source', 'synergy-target'));
}

function hasCombo(id) { return G.activeCombos.some(c => c.id === id); }
function hasComboCells(id, cellIdx) { return G.activeCombos.some(c => c.id === id && c.cells.includes(cellIdx)); }

function getEffLevel(i) {
    const c = G.cells[i]; if (!c.struct) return 0;
    let bonusLvl = 0;
    getAdj(i).forEach(n => {
        const nc = G.cells[n];
        if (nc?.struct === 'library') bonusLvl += STRUCTS.library.levels[clampLevel(nc.level)].levelBuff || 0;
    });
    
    const base = c.level;
    const total = base + bonusLvl;

    const hasAmp = getAdj(i).some(n => G.cells[n]?.struct === 'obelisk' && G.cells[n].level === 3);
    if (hasAmp && total >= 3) return 4;
    return Math.min(total, 3);
}

function getPoisonInfusion(i) {
    if (G.cells[i].struct === 'venom') return 0;
    let poison = 0;
    getAdj(i).forEach(n => {
        if (G.cells[n]?.struct === 'venom') {
            const lvl = clampLevel(G.cells[n].level);
            poison = Math.max(poison, STRUCTS.venom.levels[lvl].poisonGrant);
        }
    });
    return poison;
}

function getPoisonArmorReduce(i) {
    if (G.cells[i].struct === 'venom') return 0;
    let red = 0;
    getAdj(i).forEach(n => {
        if (G.cells[n]?.struct === 'venom' && G.cells[n].level === 3) red = 0.3;
    });
    return red;
}

// ══════════════════════════════════════════════
// V7 SYNERGY VISUALS (CANVAS)
// ══════════════════════════════════════════════

function drawComboConnections() {
    const canvas = document.getElementById('connection-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.clearRect(0,0,canvas.width,canvas.height);

    G.activeCombos.forEach(combo => {
        if (combo.id === 'ascension') return;
        const cells = combo.cells;
        for (let i=0; i < cells.length; i++) {
            for (let j=i+1; j < cells.length; j++) {
                if (isAdj(cells[i], cells[j])) drawBeam(cells[i], cells[j], combo.color, ctx);
            }
        }
    });
}
function isAdj(i1, i2) { const n=G.gridSize, r1=Math.floor(i1/n), c1=i1%n, r2=Math.floor(i2/n), c2=i2%n; return Math.abs(r1-r2)+Math.abs(c1-c2) === 1;}
function drawBeam(i1, i2, color, ctx) {
    const grid = document.getElementById('grid-container').children;
    const b1 = grid[i1].getBoundingClientRect(), b2 = grid[i2].getBoundingClientRect();
    const x1 = b1.left + b1.width/2, y1 = b1.top + b1.height/2;
    const x2 = b2.left + b2.width/2, y2 = b2.top + b2.height/2;
    const grad = ctx.createLinearGradient(x1, y1, x2, y2);
    grad.addColorStop(0, color+'00'); grad.addColorStop(0.5, color+'66'); grad.addColorStop(1, color+'00');
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
    ctx.strokeStyle = grad; ctx.lineWidth = 3; ctx.setLineDash([5, 15]); ctx.lineDashOffset = -Date.now()/50; ctx.stroke();
}

// ══════════════════════════════════════════════
// WAVE & ENEMIES
// ══════════════════════════════════════════════

function buildWave() {
    const enemies = [];
    const count = 4 + Math.floor(G.wave * 1.5) + (G.wave >= 30 ? Math.floor((G.wave - 29) * 1.5) : 0);
    let scale;
    if (G.wave <= 10) scale = 1 + (G.wave - 1) * 0.15; 
    else if (G.wave <= 20) scale = 2.35 + (G.wave - 10) * 0.25;
    else if (G.wave <= 30) scale = 4.85 + (G.wave - 20) * 0.40;
    else scale = 8.85 + Math.pow(G.wave - 30, 1.6) * 0.4;
    
    for (let i = 0; i < count; i++) {
        const isMalmirBoss = (G.wave === 10 || G.wave === 20 || G.wave === 30) && i === 0;
        const isBoss = !isMalmirBoss && G.wave % 10 === 0 && i === 0;
        const isMiniBoss = !isMalmirBoss && !isBoss && G.wave % 5 === 0 && G.wave > 5 && i === 0;
        
        let base;
        
        // Random Legendary Spawns
        const monkenSpawn = G.wave > 5 && Math.random() < 0.02;
        const malmirSpawn = G.wave > 15 && Math.random() < 0.005;

        if (isMalmirBoss || malmirSpawn) {
            base = ENEMIES_DB.find(e => e.isMalmir);
            if (malmirSpawn && !isMalmirBoss) addLog('🌑 O PESADELO PRIMORDIAL SURGUIU!', 'bad');
        } else if (monkenSpawn) {
            base = ENEMIES_DB.find(e => e.isMonken);
            addLog('🐒 O VIAJANTE DIMENSIONAL APARECEU!', 'special');
        } else if (isBoss) {
            const bossTier = Math.min(6, Math.floor(G.wave / 10) + 4);
            const bossPool = ENEMIES_DB.filter(e => e.tier >= bossTier - 1 && e.tier <= bossTier && !e.isMalmir && !e.isMonken);
            base = { ...(bossPool.length ? bossPool[Math.floor(Math.random() * bossPool.length)] : ENEMIES_DB.find(e => e.tier === 6)) };
        } else if (isMiniBoss) {
            const elites = ENEMIES_DB.filter(e => e.special === 'elite' || e.special === 'tank');
            base = { ...elites[Math.floor(Math.random() * elites.length)] };
        } else {
            if (G.wave === 1) {
                base = ENEMIES_DB.find(e => e.name === 'Slime');
            } else {
                const maxTier = Math.min(6, Math.ceil(G.wave / 4));
                const available = ENEMIES_DB.filter(e => e.tier <= maxTier && !e.special?.includes('boss') && !e.special?.includes('overlord') && !e.isMalmir && !e.isMonken);
                base = { ...available[Math.floor(Math.random() * available.length)] };
            }
        }

        const isMalmirUnit = base.isMalmir || false;
        const bs = isMalmirUnit ? 4.0 : (isBoss ? 2.0 : (isMiniBoss ? 1.4 : (base.special === 'elite' ? 1.3 : 1)));
        const ba = isMalmirUnit ? 1.4 : (isBoss ? 1.2 : (isMiniBoss ? 1.05 : (base.special === 'elite' ? 1.05 : 1))); 

        // Aura assignment
        let aura = null;
        if (isMalmirUnit) { aura = 'darkness'; }
        else if (base.isMonken) { aura = 'darkness'; }
        else if (isBoss || isMalmirBoss) { aura = 'white'; }
        else if (G.wave >= 2) {
            let auraRoll = Math.min(0.25, 0.03 + G.wave * 0.008);
            if (G.activeBook === 'book_orange') auraRoll += 0.15;
            if (Math.random() < auraRoll) {
                const pick = Math.random();
                if (pick < 0.04) aura = 'white'; 
                else if (pick < 0.25) aura = 'red'; 
                else if (pick < 0.40) aura = 'blue'; 
                else if (pick < 0.50) aura = 'cyan';
                else if (pick < 0.60) aura = 'green';
                else aura = 'yellow';
            }
        }

        const ah = aura ? ENEMY_AURAS[aura].hpMult || 1 : 1;
        const aa = aura ? ENEMY_AURAS[aura].atkMult || 1 : 1;
        const ac = aura ? ENEMY_AURAS[aura].coinMult || 1 : 1;

        let cValue = Math.ceil((base.tier * 2 + 1 + G.wave * 0.4) * (isBoss || isMalmirBoss ? 8 : (isMiniBoss ? 4 : (base.special === 'elite' ? 2 : 1))) * ac) + (isMalmirUnit || base.isMonken ? (base.isMonken ? 40 : 80) : 0);
        if (G.activeBook === 'book_yellow') cValue = Math.ceil(cValue * 1.5);

        enemies.push({
            ...base, hp: Math.ceil(base.hp * scale * bs * ah), maxHp: Math.ceil(base.hp * scale * bs * ah),
            atk: Math.ceil(base.atk * scale * ba * aa),
            armor: (base.armor || 0) + Math.floor(G.wave / 8),
            coinValue: cValue,
            frozen: hasSoulNode('neu_2') ? 5 : 0, 
            dot: 0, 
            isBoss: isBoss || isMalmirUnit || isMiniBoss || isMalmirBoss, 
            debuffed: false, corruptPoison: false,
            special: base.special || null, deathDmg: base.deathDmg || 0, structDot: base.structDot || 0,
            aura: aura, isMalmir: isMalmirUnit, transformed: false, transformTimer: 0, originalStats: null,
            frozen: (G.wave === 1 && hasSoulNode('neu_2')) ? 2 : 0
        });

        recordEncounter(base.name);

        if (isMalmirUnit) { addLog('🖤 MALMIR se aproxima...', 'bad'); }
        else if (isBoss || isMalmirBoss) { addLog('💀 BOSS detectado!', 'bad'); }
        else if (isMiniBoss) { addLog('⚠️ Mini-Boss!', 'bad'); }
    }
    enemies.sort((a,b) => (b.isBoss?1:0) - (a.isBoss?1:0));
    return enemies;
}

function startWave() {
    if (G.phase !== 'idle') return;
    if (G.timer) { clearInterval(G.timer); G.timer = null; }
    closeShop(); G.phase = 'wave'; 
    const waveEl = document.getElementById('h-wave'); if (waveEl) { waveEl.classList.remove('wave-start-anim'); void waveEl.offsetWidth; waveEl.classList.add('wave-start-anim'); }
    updateHUD(); addLog(`⚔ WAVE ${G.wave}`, 'bad'); detectCombos();

    const hasAscension = hasCombo('ascension'), hasFortress = hasCombo('fortress'), hasCorrupt = hasCombo('corrupt');
    let enemies = buildWave(); G.totalEnemies = enemies.length; G.currentEnemies = enemies.length; updateWaveProgress(G.currentEnemies, G.totalEnemies); renderEnemies(enemies);

    const towers = [];
    G.cells.forEach((c, i) => {
        if (!c.struct || STRUCTS[c.struct].passive) return;
        const s = STRUCTS[c.struct], eff = getEffLevel(i);
        const ldat = s.isLegendary ? s.levels[0] : s.levels[Math.min(eff, 3)];
        let spdMult = 0, atkMult = 1;
        getAdj(i).forEach(n => {
            const nc = G.cells[n]; if (!nc || !nc.struct) return;
            const bLvl = clampLevel(nc.level);
            if (nc.struct === 'forge') { spdMult += STRUCTS.forge.levels[bLvl].spdBuff || 0; if (STRUCTS.forge.levels[bLvl].atkBuff) atkMult += STRUCTS.forge.levels[bLvl].atkBuff; }
            if (nc.struct === 'obelisk' && s.type === 'magical') atkMult += STRUCTS.obelisk.levels[bLvl].boostMagical || 0;
            if (nc.struct === 'base_militar' && s.type === 'physical') { atkMult += STRUCTS.base_militar.levels[bLvl].physDmgBuff || 0; spdMult += STRUCTS.base_militar.levels[bLvl].physSpdBuff || 0; }
            if (nc.struct === 'acampamento' && s.isWarrior) atkMult += STRUCTS.acampamento.levels[bLvl].warriorDmgBuff || 0;
            if (nc.struct === 'library') atkMult += STRUCTS.library.levels[bLvl].atkBuff || 0;
        });
        const poisonAdd = getPoisonInfusion(i), poisonArmRed = getPoisonArmorReduce(i);
        G.activeCombos.forEach(co => { if (!co.cells.includes(i)) return; if (co.bonus === 'spd') spdMult += co.val; if (co.bonus === 'dmg') atkMult += co.val; if (co.bonus === 'dmg_phys' && s.type === 'physical') atkMult += co.val; });
        if (s.tags.includes('ranged') && hasComboCells('artillery', i)) spdMult += 0.5;
        if (s.isWarrior && c.struct === 'espadachim' && hasComboCells('warforce', i)) atkMult += 0.3;
        if (hasAscension) { atkMult += 0.1; spdMult += 0.1; }
        
        // Soul Tree: Warrior Buffs
        if (s.isWarrior) {
            if (hasSoulNode('war_2')) atkMult += 0.25;
            if (hasSoulNode('war_3') && c.hp/ldat.hp < 0.25) atkMult *= 3;
        }

        const metaDmgBonus = getSoulStacks('phy_1') * 0.10; if (metaDmgBonus > 0) atkMult += metaDmgBonus;
        if (s.isLegendary) { atkMult = 1; spdMult = 0; if (metaDmgBonus > 0) atkMult += metaDmgBonus; }
        
        // Soul Tree: Library Multiplier
        let libMult = 1;
        if (hasSoulNode('lib_1')) libMult += 0.25;
        if (hasSoulNode('lib_2')) libMult += 0.35;
        if (hasSoulNode('lib_3')) libMult += 0.60;

        if (G.activeBook === 'book_blue') spdMult += (0.20 * libMult); 
        if (G.activeBook === 'book_red') atkMult += (0.25 * libMult); 
        if (G.activeBook === 'book_trinity') { spdMult += (0.20 * libMult); atkMult += (0.20 * libMult); }
        
        if (eff === 4) atkMult *= 1.5;
        const hasGodObelisk = getAdj(i).some(n => G.cells[n]?.struct === 'obelisk' && clampLevel(G.cells[n].level) >= 2 && s.type === 'magical');
        const finalSpd = Math.max(1, Math.round((ldat.spd || 10) / (1 + spdMult))), finalAtk = Math.ceil((ldat.atk || 0) * atkMult);
        let extraCrit = 0; if (s.isWarrior && c.struct === 'espadachim' && hasComboCells('warforce', i)) extraCrit = 0.15;
        let targets = ldat.targets || 1; if (c.struct === 'tesla' && hasComboCells('plasma', i)) targets += 3;
        const freezeAuraFinal = hasGodObelisk || (c.struct === 'tesla' && hasComboCells('plasma', i));
        const finalArmorPen = (ldat.armorPen || 0) + (getSoulStacks('phy_1') * 0.05);
        
        // Apex Buffs
        let soulDmgBonus = 0;
        if (hasSoulNode('apex_offense') && G.activeCombos.some(co => co.cells.includes(i))) soulDmgBonus = 0.30;

        towers.push({ ...ldat, icon: s.icon, idx: i, spd: finalSpd, atk: finalAtk, armorPen: finalArmorPen, timer: 0, tags: s.tags, type: s.type, extraPoison: poisonAdd, extraPoisonArmor: poisonArmRed, freezeAura: freezeAuraFinal, targets: targets, isWarrior: s.isWarrior || false, struct: c.struct, extraCrit, soulDmgBonus });
    });

    let tick = 0, renderFrame = 0, bardBuff = 0;
    // Medcamp combo: Acampamento cura guerreiros quando conectado a Curandeiro
    const hasMedcamp = hasCombo('medcamp');
    G.timer = setInterval(() => {
        tick++; renderFrame++; if (bardBuff > 0) bardBuff--;
        enemies.forEach(e => { if (e.transformed && e.transformTimer > 0) { e.transformTimer--; if (e.transformTimer <= 0 && e.originalStats) { const orig = e.originalStats; e.icon = orig.icon; e.name = orig.name; e.maxHp = orig.maxHp; e.hp = Math.min(e.hp, e.maxHp); e.atk = orig.atk; e.armor = orig.armor; e.transformed = false; e.originalStats = null; } } });
        if (tick % 8 === 0) { 
            enemies.forEach(e => { 
                if (e.dot > 0) { 
                    let d = e.dot; if (hasCorrupt && e.corruptPoison) d = Math.ceil(d * 1.5); 
                    G.activeCombos.forEach(c => { if (c.bonus === 'dot') d = Math.ceil(d * (1 + c.val)); }); 
                    e.hp -= d; 
                } 
                if (e.frozen > 0) {
                    // mag_1: Debuffs duram +30% -> na prática, 30% de chance de não reduzir o timer este tick
                    if (!hasSoulNode('mag_1') || Math.random() > 0.23) e.frozen--; 
                }
                if (e.fire > 0) e.fire--;
                if (e.shocked > 0) e.shocked--;
            }); 
            let bf = enemies.length; 
            enemies = enemies.filter(e => { if (e.hp <= 0) { enemyDie(e); return false; } return true; }); 
            if (enemies.length !== bf) renderFrame = 5; 
        }
        if (tick % 25 === 0) { G.cells.forEach((c, ci) => { if (c.struct === 'cofre') { const bl = clampLevel(c.level); let drip = STRUCTS.cofre.levels[bl].drip || 0; if (hasComboCells('coins_boost', ci)) drip = Math.ceil(drip * 1.6); if (hasComboCells('plunder', ci)) drip = Math.ceil(drip * 1.6); if (hasComboCells('logistics', ci)) drip = Math.ceil(drip * 1.5); if (G.activeBook === 'book_yellow') drip = Math.ceil(drip * 1.5); if (drip > 0) { G.coins += drip; const el = document.getElementById('grid-container').children[ci]; if (el) { const r = el.getBoundingClientRect(); spawnText(r.left + r.width / 2, r.top + 10, `+${drip}🪙`, 'coin'); el.classList.add('cofre-pulse'); setTimeout(() => el.classList.remove('cofre-pulse'), 400); } } } }); }
        if (tick % 15 === 0) { G.cells.forEach((c, ci) => { if (!c.struct || c.struct !== 'curandeiro' || !c.hp || c.hp <= 0) return; const bl = clampLevel(c.level); let heal = STRUCTS.curandeiro.levels[bl].healPerTick || 0; if (hasComboCells('frontline', ci)) heal = Math.ceil(heal * 1.4); if (hasComboCells('medcamp', ci)) heal = Math.ceil(heal * 1.5); if (hasFortress) heal = Math.ceil(heal * 1.5); getAdj(ci).forEach(n => { const nc = G.cells[n]; if (!nc.struct || !STRUCTS[nc.struct].isWarrior || !nc.hp || nc.hp <= 0) return; if (STRUCTS[nc.struct].isLegendary) return; const maxHp = Math.ceil(STRUCTS[nc.struct].levels[clampLevel(nc.level)].hp * getGlobalHpMult()); nc.hp = Math.min(maxHp, nc.hp + heal); const el = document.getElementById('grid-container').children[n]?.querySelector('.hp-fill'); if (el) el.style.width = (Math.max(0, nc.hp) / maxHp * 100) + '%'; }); }); /* Medcamp: Acampamento cura guerreiros adj. */ if (hasMedcamp) { G.cells.forEach((c, ci) => { if (c.struct !== 'acampamento') return; if (!hasComboCells('medcamp', ci)) return; const campHeal = 8; getAdj(ci).forEach(n => { const nc = G.cells[n]; if (!nc.struct || !STRUCTS[nc.struct].isWarrior || !nc.hp || nc.hp <= 0) return; const maxHp = Math.ceil(STRUCTS[nc.struct].levels[clampLevel(nc.level)].hp * getGlobalHpMult()); nc.hp = Math.min(maxHp, nc.hp + campHeal); }); }); } G.cells.forEach((c, ci) => { if (c.struct !== 'bardo' || !c.hp || c.hp <= 0) return; const bardHeal = Math.min(60, 8 + Math.floor(G.wave * 2)); G.cells.forEach((oc, oi) => { if (!oc.struct || !oc.hp || oc.hp <= 0) return; const os = STRUCTS[oc.struct]; if (os.isWarrior) { const eff = getEffLevel(oi); const ldat = os.isLegendary ? os.levels[0] : os.levels[Math.min(eff, 3)]; const maxHp = Math.ceil(ldat.hp * getGlobalHpMult()); oc.hp = Math.min(maxHp, oc.hp + bardHeal); const el = document.getElementById('grid-container').children[oi]?.querySelector('.hp-fill'); if (el) el.style.width = (Math.max(0, oc.hp) / maxHp * 100) + '%'; } }); }); /* Warrior Self-Heal */ G.cells.forEach((c, ci) => { if (!c.struct || !STRUCTS[c.struct].isWarrior || !c.hp || c.hp <= 0) return; const s = STRUCTS[c.struct]; if (s.isLegendary) return; const bl = clampLevel(c.level); const selfHeal = s.levels[bl].selfHeal; if (selfHeal) { const maxHp = Math.ceil(s.levels[bl].hp * getGlobalHpMult()); const healAmt = Math.ceil(maxHp * selfHeal); c.hp = Math.min(maxHp, c.hp + healAmt); } }); }
        towers.forEach(t => {
            if (t.isWarrior && (!G.cells[t.idx]?.struct || !G.cells[t.idx].hp || G.cells[t.idx].hp <= 0)) return;
            t.timer++; if (t.timer < t.spd || !enemies.length) return; t.timer = 0;
            
            if (t.struct === 'bruxo') {
                let dbTargets = t.debuffTargets || 1;
                if (hasCorrupt && hasComboCells('corrupt', t.idx)) dbTargets += 2;
                const targets = enemies.filter(e => !e.debuffed).slice(0, dbTargets);
                targets.forEach(e => {
                    e.debuffed = true;
                    const durMult = hasSoulNode('mag_1') ? 1.45 : 1;
                    e.atk = Math.max(1, Math.ceil(e.atk * (1 - (t.atkReduce || 0))));
                    if (t.armorReduce) e.armor = Math.max(0, Math.ceil(e.armor * (1 - t.armorReduce)));
                    if (hasCorrupt && hasComboCells('corrupt', t.idx)) {
                        e.corruptPoison = true;
                        if (Math.random() < 0.25) { e.frozen = Math.max(e.frozen, Math.ceil(1 * durMult)); addLog('🌀 Slow!', 'special'); }
                        else if (Math.random() < 0.15) { e.dot = Math.max(e.dot, 3); addLog('🧪 Toxic!', 'special'); }
                    }
                });
                if (targets.length > 0) addLog(`🪄 Enfraquecido(s)`, 'special');
                return;
            }

            const tgts = t.focusStrongest ? [[...enemies].sort((a,b) => b.hp - a.hp)[0]] : enemies.slice(0, t.targets || 1);

            if (t.struct === 'trabuco') {
                const strongest = [...enemies].sort((a,b) => b.hp - a.hp)[0];
                if (strongest) {
                    let hpDmg = Math.ceil(strongest.maxHp * 0.25);
                    if (bardBuff > 0) hpDmg = Math.ceil(hpDmg * 1.4);
                    strongest.hp -= hpDmg;
                    if (t.armorBreak) strongest.armor = Math.floor(strongest.armor * (1 - t.armorBreak));
                    addLog(`⚙️ Trabuco: -${hpDmg}`, 'dmg');
                    const splash = enemies.filter(e => e !== strongest).slice(0, 5);
                    splash.forEach(e => {
                        const sd = Math.ceil(hpDmg * 0.5); e.hp -= sd;
                        if(t.armorBreak) e.armor = Math.floor(e.armor * (1 - t.armorBreak));
                    });
                }
                let bf = enemies.length;
                enemies = enemies.filter(e => { if (e.hp <= 0) { enemyDie(e); return false; } return true; });
                if (enemies.length !== bf) renderFrame = 5;
                return;
            }

            if (t.struct === 'magico' && enemies.length) {
                const target = enemies[0];
                if (!target.isBoss && !target.transformed && Math.random() < 0.35) {
                    target.originalStats = { icon: target.icon, hp: target.hp, maxHp: target.maxHp, atk: target.atk, armor: target.armor, name: target.name };
                    target.transformed = true; target.transformTimer = 40; target.icon = '🐇'; target.name = 'Coelho'; target.hp = Math.min(target.hp, 5); target.maxHp = 5; target.atk = 0; target.armor = 0;
                    addLog('🎭 Coelho! 🐇', 'special');
                } else if (target.isBoss) {
                    let dmg = Math.ceil(target.hp * 0.20) + t.atk; // Dano massivo (20% HP + atk)
                    if (bardBuff > 0) dmg = Math.ceil(dmg * 1.4);
                    target.hp = Math.max(1, target.hp - dmg); 
                    addLog(`🎭 Dano Mágico (Boss): -${dmg}`, 'dmg');
                }
                let bf = enemies.length;
                enemies = enemies.filter(e => { if (e.hp <= 0) { enemyDie(e); return false; } return true; });
                if (enemies.length !== bf) renderFrame = 5;
                return;
            }

            tgts.forEach(e => {
                if (!e) return;
                if (t.instakill && e.hp/e.maxHp <= t.instakill && !e.isBoss) { e.hp = 0; addLog(`🎯 HEADSHOT!`, 'special'); return; }
                let dmg = t.atk; if (bardBuff > 0) dmg = Math.ceil(dmg * 1.4);
                const totalCrit = (t.critChance || 0) + (t.extraCrit || 0);
                if (totalCrit > 0 && Math.random() < totalCrit) { dmg = Math.ceil(dmg * 2); addLog(`⚔ CRÍTICO!`, 'special'); }
                
                // Soul Tree: Physical & Target Based
                if (t.type === 'physical') {
                    if (hasSoulNode('phy_2') && e.hp/e.maxHp < 0.5) dmg = Math.ceil(dmg * 1.15);
                    if (hasSoulNode('phy_3') && e.hp/e.maxHp < 0.25) dmg = Math.ceil(dmg * 1.25);
                }
                // Soul Tree: Magical & Debuff
                if (t.type === 'magical' || hasSoulNode('mag_2')) {
                    const magStacks = getSoulStacks('mag_2');
                    if (magStacks > 0 && (e.frozen > 0 || e.dot > 0 || e.debuffed)) dmg = Math.ceil(dmg * (1 + magStacks * 0.15));
                    if (hasSoulNode('mag_3') && Math.random() < 0.10) {
                        const durMult = hasSoulNode('mag_1') ? 1.45 : 1;
                        e.frozen = Math.max(e.frozen, Math.ceil(2 * durMult));
                    }
                }
                // Soul Tree: Apex
                if (t.soulDmgBonus) dmg = Math.ceil(dmg * (1 + t.soulDmgBonus));

                if (t.execute && e.hp / e.maxHp <= t.execute) dmg = Math.ceil(dmg * 1.5);
                let arm = e.armor; if (e.dot > 0 && t.extraPoisonArmor > 0) arm = Math.max(0, arm - Math.floor(arm * t.extraPoisonArmor));
                const effArm = t.noArmor ? 0 : arm * (1 - (t.armorPen || 0));
                dmg = Math.max(1, dmg - effArm);
                if (e.frozen > 0) dmg = Math.ceil(dmg * 1.3);
                e.hp -= dmg;
                if (t.freeze) {
                    const durMult = hasSoulNode('mag_1') ? 1.3 : 1;
                    e.frozen = Math.max(e.frozen, Math.ceil(t.freeze * durMult));
                }
                if (t.freezeAura && !e.frozen) e.frozen = 1;
                if (t.extraPoison > 0) e.dot = Math.max(e.dot, t.extraPoison);
                if (t.dot) e.dot = Math.max(e.dot, t.dot);
                if (t.struct === 'fire') e.fire = 3;
                if (t.struct === 'tesla') e.shocked = 2;
            });
            let bf = enemies.length;
            enemies = enemies.filter(e => { if (e.hp <= 0) { enemyDie(e); return false; } return true; });
            if (enemies.length !== bf) renderFrame = 5;
        });
        if (tick % 24 === 0 && enemies.length) {
            let regularDmg = 0, shooterDmg = 0; enemies.filter(e => e.frozen <= 0).forEach(e => { const mult = e.special === 'fast' ? 1.5 : 1; const dmg = Math.ceil(e.atk * mult); if (e.special === 'shooter') shooterDmg += dmg; else regularDmg += dmg; });
            for (let i = 0; i < G.cells.length && regularDmg > 0; i++) { const bc = G.cells[i]; if (!bc.struct || !STRUCTS[bc.struct].isBarricade || bc.hp <= 0) continue; const abs = Math.min(bc.hp, regularDmg); bc.hp -= abs; regularDmg -= abs; const bLv = clampLevel(bc.level); const th = STRUCTS[bc.struct].levels[bLv].thorns; if (th > 0) enemies.filter(e => e.frozen <= 0).forEach(e => e.hp -= th); if (bc.hp <= 0) { addLog(`💥 Muralha rompida!`, 'bad'); bc.struct = null; bc.hp = null; bc.level = 0; renderGrid(); } else { const bel = document.getElementById('grid-container').children[i]?.querySelector('.hp-fill'); if (bel) bel.style.width = (Math.max(0, bc.hp) / STRUCTS[bc.struct].levels[bLv].hp * 100) + '%'; } }
            let totalDmg = regularDmg + shooterDmg; const venomDot = enemies.reduce((max, e) => (e.special === 'venomous' && e.frozen <= 0) ? Math.max(max, e.structDot || 0) : max, 0); let warriorDied = false;
            for (let i = 0; i < G.cells.length && totalDmg > 0; i++) { const wc = G.cells[i]; if (!wc.struct || !STRUCTS[wc.struct].isWarrior || !wc.hp || wc.hp <= 0) continue; if (wc.struct === 'bardo') continue; let abs = Math.min(wc.hp, totalDmg); if (hasComboCells('frontline', i)) abs = Math.ceil(abs * 0.85); wc.hp -= abs; totalDmg -= abs; if (venomDot > 0) wc.hp -= venomDot; if (wc.hp <= 0) { addLog(`💀 ${STRUCTS[wc.struct].name} caiu!`, 'bad'); wc.struct = null; wc.hp = null; wc.level = 0; warriorDied = true; } else { const s = STRUCTS[wc.struct]; const maxHp = s.levels[clampLevel(wc.level)].hp; const bel = document.getElementById('grid-container').children[i]?.querySelector('.hp-fill'); if (bel) bel.style.width = (Math.max(0, wc.hp) / maxHp * 100) + '%'; } }
            for (let i = 0; i < G.cells.length && totalDmg > 0; i++) { const wc = G.cells[i]; if (wc.struct !== 'bardo' || !wc.hp || wc.hp <= 0) continue; let abs = Math.min(wc.hp, totalDmg); wc.hp -= abs; totalDmg -= abs; if (abs > 0) { bardBuff = 50; addLog('🪉 Bardo atingido!', 'special'); } if (wc.hp <= 0) { addLog(`💀 Bardo caiu!`, 'bad'); wc.struct = null; wc.hp = null; wc.level = 0; warriorDied = true; } else { const maxHp = Math.ceil(STRUCTS.bardo.levels[0].hp * getGlobalHpMult()); const bel = document.getElementById('grid-container').children[i]?.querySelector('.hp-fill'); if (bel) bel.style.width = (Math.max(0, wc.hp) / maxHp * 100) + '%'; } }
            if (warriorDied) renderGrid(); enemies = enemies.filter(e => { if (e.hp <= 0) { enemyDie(e); return false; } return true; }); if (hasFortress && totalDmg > 0) totalDmg = Math.ceil(totalDmg * 0.8);
            if (totalDmg > 0) { G.hp = Math.max(0, G.hp - totalDmg); flash('red'); const hb = document.getElementById('header-hp-container'); hb.classList.remove('shake'); void hb.offsetWidth; hb.classList.add('shake'); addLog(`⚡ BASE: -${totalDmg} HP`, 'bad'); if (G.hp <= 0) { clearInterval(G.timer); G.timer = null; saveRecord(); document.getElementById('game-over').classList.add('active'); return; } }
            renderFrame = 5;
        }
        if (renderFrame >= 5) { renderEnemies(enemies); updateHUD(); renderFrame = 0; }
        if (!enemies.length && G.hp > 0) { clearInterval(G.timer); addLog(`✓ WAVE ${G.wave} VENCIDA`, 'good'); flash('green'); saveRecord(); G.cells.forEach((c, ci) => { if (!c.struct) return; const s = STRUCTS[c.struct]; const bl = clampLevel(c.level); if (s.passive && s.levels[bl]?.heal) { let h = s.levels[bl].heal, m = s.levels[bl].maxhp || 0; G.activeCombos.forEach(co => { if (co.bonus === 'heal') h = Math.ceil(h * (1 + co.val)); }); G.maxHp += m; G.hp = Math.min(G.maxHp, G.hp + h); } if (s.isBarricade && c.hp !== null && s.levels[bl].regen) c.hp = Math.min(s.levels[bl].hp, c.hp + s.levels[bl].regen); if (c.struct === 'cofre') { let coins = STRUCTS.cofre.levels[bl].coinsPerWave || 0; G.activeCombos.forEach(co => { if (co.bonus === 'coins_boost' && co.cells.includes(ci)) coins = Math.ceil(coins * (1 + (co.val || 0.5))); }); G.coins += coins; } }); updateHUD(); renderGrid(); setTimeout(() => showBonusModal(), 700); }
    }, 100);
}

function renderEnemies(enemies) {
    const list = document.getElementById('enemy-list');
    list.innerHTML = '';
    enemies.forEach(e => {
        const div = document.createElement('div');
        div.className = 'enemy-unit';
        if (e.isBoss) div.classList.add('enemy-elite');
        if (e.aura) div.classList.add('enemy-aura-' + e.aura);
        
        let statusHtml = '<div class="status-container">';
        if (e.frozen > 0) statusHtml += '<div class="status-icon status-ice">❄️</div>';
        if (e.dot > 0) statusHtml += '<div class="status-icon status-poison">🧪</div>';
        if (e.fire > 0) statusHtml += '<div class="status-icon status-fire">🔥</div>';
        if (e.shocked > 0) statusHtml += '<div class="status-icon status-lightning">⚡</div>';
        if (e.debuffed) statusHtml += '<div class="status-icon status-curse">👿</div>';
        statusHtml += '</div>';
        
        div.innerHTML = `<span class="enemy-icon">${e.icon}</span><div class="enemy-hp"><div class="enemy-hp-fill" style="width:${(e.hp/e.maxHp)*100}%"></div></div>${statusHtml}`;
        
        div.title = `${e.name}\nHP: ${e.hp}/${e.maxHp}${e.aura ? `\nAura: ${ENEMY_AURAS[e.aura].name}` : ''}`;
        list.appendChild(div);
    });
}

function updateWaveProgress(curr, total) {
    const fill = document.getElementById('wave-progress-fill');
    const text = document.getElementById('wave-progress-text');
    const pct = ((total - curr) / total) * 100;
    fill.style.width = pct + '%';
    text.textContent = `INIMIGOS: ${curr}/${total}`;
}

function enemyDie(e) {
    recordKill(e.name);
    let val = e.coinValue;
    if (hasSoulNode('eco_3') && (e.isBoss || e.special === 'elite')) val *= 3;
    G.coins += val;
    G.kills++;
    G.currentEnemies--; updateWaveProgress(G.currentEnemies, G.totalEnemies);
    let soulsToDrop = 0;
    // Soul drops: rare but impactful
    if (e.aura && ENEMY_AURAS[e.aura]?.dropSoul) soulsToDrop += (ENEMY_AURAS[e.aura].soulAmt || 1);
    // Boss soul drop: calibrated
    if (e.isBoss && !e.aura) soulsToDrop += Math.max(1, Math.floor(G.wave / 10));
    // Elite soul drop: 10% chance
    if (e.special === 'elite' && Math.random() < 0.10) soulsToDrop += 1;
    // Wave milestone soul bonus (every 10 waves)
    if (G.wave % 10 === 0 && e.isBoss) soulsToDrop += 2;
    if (soulsToDrop > 0) { G.souls += soulsToDrop; G.soulsThisRun += soulsToDrop; localStorage.setItem('wdSouls', G.souls); addLog(`🟠 +${soulsToDrop} Souls`, 'special'); }
    addLog(`💀 ${e.name} (+${e.coinValue}🪙)`, 'coin');
    const r = document.getElementById('enemy-panel').getBoundingClientRect();
    spawnText(r.left + 50, r.top + 40, `+${e.coinValue}`, 'coin');
}

// ══════════════════════════════════════════════
// MODALS
// ══════════════════════════════════════════════

function showBonusModal() {
    G.phase = 'pick'; G.pendingReward = true; updateHUD();
    document.getElementById('m-title').textContent = `RECOMPENSA WAVE ${G.wave}`;
    const grid = document.getElementById('opt-grid'); grid.innerHTML = '';
    const keys = Object.keys(STRUCTS).filter(k => !STRUCTS[k].isLegendary);
    const opts = []; const shuffled = [...keys].sort(() => 0.5 - Math.random());
    for (const k of shuffled) { if (opts.length >= (3 + (hasSoulNode('neu_3') ? 1 : 0))) break; const cell = G.cells.find(c => c.struct === k); if (cell && cell.level < 3) opts.push({ key: k, type: 'up', curLv: cell.level }); else opts.push({ key: k, type: 'new' }); }
    
    // Legendary chance: 0.5% base + 12% per Node level
    const legC = 0.005 + (getSoulStacks('neu_3') * 0.12);
    if (Math.random() < legC) { const available = LEGENDARY_KEYS.filter(k => !G.cells.some(c => c.struct === k)); if (available.length) opts.push({ key: available[Math.floor(Math.random()*available.length)], type: 'new', isLegendary: true }); }

    if (G.gridSize < 5) opts.push({ key: 'expand', type: 'special' }); else opts.push({ key: 'repair', type: 'special' });

    opts.forEach(opt => {
        const card = document.createElement('div'); card.className = 'option-card';
        let name, desc, icon, badge, s = null;
        if (opt.key === 'expand') { name = 'EXPANDIR'; icon = '🗺️'; badge = 'SPECIAL'; desc = `Aumenta o Grid.`; card.style.setProperty('--cc','#1abc9c'); }
        else if (opt.key === 'repair') { name = 'REPARO'; icon = '🔧'; badge = 'SPECIAL'; desc = 'Restaura HP Base.'; card.style.setProperty('--cc','#f1c40f'); }
        else { s = STRUCTS[opt.key]; const lv = opt.type === 'up' ? opt.curLv + 1 : 0; name = s.name; icon = s.icon; desc = s.levels[lv].desc; badge = opt.type === 'up' ? `▲ NV${lv+1}` : (s.isLegendary ? '🌟 LENDÁRIA' : '✦ NOVA'); card.style.setProperty('--cc', s.color); if (s.isLegendary) card.classList.add('legendary-card'); }
        
        const typeBar = s ? getCardTypeBar(s.type) : '';
        card.innerHTML = `${typeBar}<div class="option-icon">${icon}</div><div class="option-name">${name}</div><div class="option-desc">${desc}</div><div class="option-tag">${badge}</div>`;
        card.onclick = () => handleChoice(opt);
        grid.appendChild(card);
    });
    document.getElementById('modal-overlay').classList.add('active');
}

function handleChoice(opt) {
    document.getElementById('modal-overlay').classList.remove('active');
    if (opt.key === 'expand') { G.pendingReward = false; const oldN = G.gridSize, newN = ++G.gridSize, old = G.cells; initGrid(); for (let r = 0; r < oldN; r++) for (let c = 0; c < oldN; c++) G.cells[r * newN + c] = old[r * oldN + c]; advanceWave(); }
    else if (opt.key === 'repair') { G.pendingReward = false; G.hp = G.maxHp; advanceWave(); }
    else if (opt.type === 'up') { G.pendingReward = false; const cell = G.cells.find(c => c.struct === opt.key && c.level < 3); if (cell) { cell.level++; const s = STRUCTS[opt.key]; if (s.isBarricade || s.isWarrior) cell.hp = s.levels[clampLevel(cell.level)].hp; } advanceWave(); }
    else { preparePlacement(opt.key, 0); }
}

function advanceWave() { G.wave++; G.shopRerollCost = 3; saveRecord(); G.phase = 'idle'; updateHUD(); renderGrid(); }

function preparePlacement(key, cost) {
    G.placing = key; G.placingCost = cost; G.phase = 'place';
    const s = STRUCTS[key];
    const hud = document.getElementById('selection-hud');
    document.getElementById('sel-icon').textContent = s.icon;
    document.getElementById('sel-name').textContent = s.name;
    document.getElementById('sel-desc').textContent = s.levels[0].desc;
    document.getElementById('sel-cost').textContent = cost;
    hud.classList.add('active');
    renderGrid(); updateHUD();
}

function cancelPlacement() {
    if (G.placingCost > 0) G.coins += G.placingCost;
    G.placing = null; G.phase = 'idle';
    document.getElementById('selection-hud').classList.remove('active');
    renderGrid(); updateHUD();
}

function placeAt(idx) {
    if (G.phase !== 'place' || !G.placing) return;
    
    const cell = G.cells[idx];
    const s = STRUCTS[G.placing];

    if (cell.struct) {
        // Tentar Upgrade (Merge)
        if (cell.struct === G.placing && cell.level < s.levels.length - 1) {
            cell.level++;
            // Restaurar vida no upgrade se for combatente
            if (cell.hp !== null) {
                cell.hp = Math.ceil(s.levels[cell.level].hp * getGlobalHpMult());
            }
            addLog(`>> ${s.name} evoluiu para NV${cell.level + 1}!`, 'special');
        } else {
            addLog('Posicionamento inválido', 'bad');
            return;
        }
    } else {
        // Novo Posicionamento
        const isHp = s.isBarricade || s.isWarrior;
        G.cells[idx] = { 
            struct: G.placing, 
            level: 0, 
            hp: isHp ? Math.ceil(s.levels[0].hp * getGlobalHpMult()) : null 
        };
        addLog(`+ ${s.name} posicionado.`, 'good');
    }

    document.getElementById('selection-hud').classList.remove('active');
    if (s.isLegendary) discoverLegendary(G.placing);
    G.placing = null;
    
    if (G.isStarterPick) { G.isStarterPick = false; G.phase = 'idle'; }
    else if (G.pendingReward) advanceWave();
    else G.phase = 'idle';
    
    updateHUD(); renderGrid();
}

function getGlobalHpMult() { if (G.activeBook === 'book_green') return 1.3; if (G.activeBook === 'book_trinity') return 1.2; return 1; }

// ══════════════════════════════════════════════
// SHOP & CODEX
// ══════════════════════════════════════════════

function openShop() { if (G.phase === 'wave' || G.phase === 'pick') return; G.phase = 'shop'; populateShop(); document.getElementById('shop-overlay').classList.add('active'); updateHUD(); }
function closeShop() { document.getElementById('shop-overlay').classList.remove('active'); if (G.phase === 'shop') G.phase = 'idle'; updateHUD(); }
function rerollShop() { 
    const stacks = getSoulStacks('eco_2');
    const discount = stacks * 3;
    const finalCost = Math.max(0, G.shopRerollCost - discount);
    if (stacks >= 3) {
        // Free reroll at level 3
        populateShop(); updateHUD();
        return;
    }
    if (G.coins < finalCost) return; 
    G.coins -= finalCost; 
    G.shopRerollCost += 3; 
    populateShop(); updateHUD(); 
}

function populateShop() {
    const stacks = getSoulStacks('eco_2');
    const discount = stacks * 2;
    const finalCost = Math.max(0, G.shopRerollCost - discount);
    document.getElementById('reroll-cost-val').textContent = stacks >= 3 ? 'GRÁTIS' : finalCost;
    document.getElementById('shop-coins-val').textContent = Math.floor(G.coins);
    
    // 🟢 SUPPLY BASE (Comum)
    const gn = document.getElementById('shop-grid-normal'); gn.innerHTML = '';
    const keys = Object.keys(STRUCTS).filter(k => !STRUCTS[k].isLegendary).sort(() => 0.5 - Math.random()).slice(0, 3);
    keys.forEach(k => {
        const s = STRUCTS[k], cost = 30 + Math.floor(G.wave * 8);
        const card = document.createElement('div'); 
        card.className = `option-card ${G.coins < cost ? 'disabled' : ''}`; 
        card.style.setProperty('--cc', s.color);
        card.innerHTML = `
            ${getCardTypeBar(s.type)}
            <div class="cost-pill">🪙 ${cost}</div>
            <div class="option-icon">${s.icon}</div>
            <div class="option-name">${s.name}</div>
            <div class="option-desc">${s.levels[0].desc}</div>
        `;
        card.onclick = () => { if (G.coins >= cost) { G.coins -= cost; preparePlacement(k, cost); closeShop(); } };
        gn.appendChild(card);
    });

    // 🔴 MERCADO NEGRO (Alto Risco)
    const bmSection = document.getElementById('black-market-section');
    const gb = document.getElementById('shop-grid-black');
    bmSection.style.display = 'block'; // Sempre visível agora
    
    if (G.wave >= 10) {
        gb.innerHTML = '';
        const bmPool = [
            { name: 'Cura Total', icon: '❤️', desc: 'Recupera todo o HP da base.', cost: 60, action: () => { G.hp = G.maxHp; addLog('>> Base Restaurada!', 'good'); flash('green'); } },
            { name: 'Vitalidade I', icon: '💎', desc: '+10 HP Máximo para esta run.', cost: 45, action: () => { G.maxHp += 10; G.hp += 10; addLog('>> +10 Max HP!', 'good'); } },
            { name: 'Vitalidade II', icon: '🔱', desc: '+20 HP Máximo para esta run.', cost: 85, action: () => { G.maxHp += 20; G.hp += 20; addLog('>> +20 Max HP!', 'good'); } }
        ];

        bmPool.forEach(item => {
            const card = document.createElement('div'); 
            card.className = `option-card bm-card ${G.coins < item.cost ? 'disabled' : ''}`; 
            card.style.setProperty('--cc', '#ff2e2e');
            card.innerHTML = `
                <div class="card-type-bar" style="background: #ff2e2e">UPGRADE RUN</div>
                <div class="cost-pill">🪙 ${item.cost}</div>
                <div class="option-icon">${item.icon}</div>
                <div class="option-name">${item.name}</div>
                <div class="option-desc">${item.desc}</div>
                <div class="option-tag" style="border-color: #ff2e2e; color: #ff2e2e; background: rgba(255,0,0,0.1)">MERCADO NEGRO</div>
            `;
            card.onclick = () => { 
                if (G.coins >= item.cost) { 
                    G.coins -= item.cost; 
                    item.action(); 
                    closeShop(); 
                    updateHUD();
                } 
            };
            gb.appendChild(card);
        });
    } else {
        gb.innerHTML = `
            <div class="shop-closed-placeholder">
                <span class="lock-icon">🔒</span>
                <span>Mercado Fechado</span>
                <small style="font-size: 10px; opacity: 0.6; letter-spacing: 1px;">DISPONÍVEL APÓS WAVE 10</small>
            </div>
        `;
    }
}

let currentCodexTab = 'bestiary';
function openCodex() { switchCodexTab(currentCodexTab); document.getElementById('codex-overlay').classList.add('active'); }
function closeCodex() { document.getElementById('codex-overlay').classList.remove('active'); }
function switchCodexTab(tab) { 
    currentCodexTab = tab;
    document.querySelectorAll('.codex-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab)); 
    renderCodex(tab); 
}

function renderCodex(tab = 'bestiary') {
    const content = document.getElementById('codex-content');
    content.classList.remove('codex-animate');
    void content.offsetWidth; // Trigger reflow
    content.classList.add('codex-animate');
    
    if (tab === 'bestiary') {
        let h = `<div class="codex-grid">`;
        ENEMIES_DB.forEach(e => {
            const disc = bestiaryData[e.name];
            h += `<div class="codex-card ${disc ? 'unlocked' : 'locked'}">
                <div class="codex-card-icon">${disc ? e.icon : '?'}</div>
                <div class="codex-card-name">${disc ? e.name : '???'}</div>
                <div class="codex-card-desc">${disc ? e.desc : 'Derrote para descobrir.'}</div>
            </div>`;
        });
        content.innerHTML = h + '</div>';
    } else if (tab === 'structures') {
        let h = `<div class="codex-sections">`;
        
        const typeMapping = {
            'physical': { title: '⚔️ FÍSICOS', color: 'var(--theme-physical)' },
            'magical': { title: '🔮 MÁGICOS', color: 'var(--theme-magic)' },
            'support': { title: '🛡️ SUPORTE', color: 'var(--theme-support)' }
        };

        Object.keys(typeMapping).forEach(tKey => {
            const structsOfType = Object.keys(STRUCTS).filter(k => STRUCTS[k].type === tKey);
            if (structsOfType.length === 0) return;
            
            h += `<div class="codex-section">
                <div style="display: flex; align-items: center; justify-content: center; margin: 30px 0 20px 0;">
                    <div style="flex:1; height:1px; background: linear-gradient(to right, transparent, ${typeMapping[tKey].color});"></div>
                    <div style="padding: 0 20px; font-family: var(--font-title); font-size: 20px; font-weight: 900; letter-spacing: 2px; color: ${typeMapping[tKey].color}; text-shadow: 0 0 15px ${typeMapping[tKey].color}80; display:flex; align-items:center;">
                        ${typeMapping[tKey].title}
                    </div>
                    <div style="flex:1; height:1px; background: linear-gradient(to left, transparent, ${typeMapping[tKey].color});"></div>
                </div>
                <div class="codex-grid">`;
                
            structsOfType.forEach(k => {
                const s = STRUCTS[k];
                let tagsHtml = '';
                if (s.isWarrior && s.isLegendary) {
                    tagsHtml += `<span class="badge" style="color:var(--gold); border-color:var(--gold); padding: 2px 6px; font-size: 9px;">🦸‍♂️ GUERREIRO LENDÁRIO</span> `;
                } else {
                    if (s.isWarrior) tagsHtml += `<span class="badge" style="color:var(--red); border-color:var(--red); padding: 2px 6px; font-size: 9px;">⚔️ GUERREIRO</span> `;
                    if (s.isLegendary) tagsHtml += `<span class="badge" style="color:var(--gold); border-color:var(--gold); padding: 2px 6px; font-size: 9px;">🌟 LENDÁRIA</span> `;
                }

                let levelsHtml = '<div style="margin-top: 10px; font-size: 11.5px; text-align: center; background: rgba(0,0,0,0.25); padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.03); width: 100%;">';
                s.levels.forEach((lv, i) => {
                    levelsHtml += `<div style="margin-bottom: 6px; padding-bottom: 6px; border-bottom: ${i < s.levels.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none'}; color: ${i === 3 ? 'var(--gold)' : 'var(--text-dim)'}; line-height: 1.4;">${lv.desc}</div>`;
                });
                levelsHtml += '</div>';

                h += `<div class="codex-card" style="border-color:${s.color}">
                    <div class="codex-card-icon">${s.icon}</div>
                    <div class="codex-card-name">${s.name}</div>
                    <div style="margin-bottom: 8px;">${tagsHtml}</div>
                    <div class="codex-card-desc" style="flex: initial;">${levelsHtml}</div>
                </div>`;
            });
            h += `</div></div>`;
        });
        content.innerHTML = h;
    } else {
        let h = `<div class="codex-grid">`;
        COMBOS.forEach(c => {
            // New: structs is an array of keys
            const iconsHtml = c.structs.map(sk => {
                const s = STRUCTS[sk];
                const icon = s ? s.icon : '⚙️';
                return `<span style="background: rgba(255,255,255,0.1); padding: 4px 8px; border-radius: 6px; font-size: 16px;">${icon}</span>`;
            });
            
            const visualFormula = `<div style="margin-bottom: 15px; display: flex; align-items: center; justify-content: center; gap: 8px;">
                ${iconsHtml.join('<span style="color: var(--text-dim); font-size: 14px; font-weight: bold;">➕</span>')}
            </div>`;

            h += `<div class="codex-card" style="border-color:${c.color}; display: flex; flex-direction: column; justify-content: center;">
                <div class="codex-card-name" style="color:${c.color}; text-shadow: 0 0 10px ${c.color}60; font-size: 16px;">${c.name}</div>
                ${visualFormula}
                <div class="codex-card-desc" style="font-size: 12px;">${c.detail}</div>
            </div>`;
        });
        content.innerHTML = h + '</div>';
    }
}

// ══════════════════════════════════════════════
// SOUL & LIBRARY
// ══════════════════════════════════════════════

function openSoulShop() { renderSoulShop(); document.getElementById('soul-overlay').classList.add('active'); }
function closeSoulShop() { const el = document.getElementById('soul-overlay'); if (el) el.classList.remove('active'); }

function renderSoulShop() {
    const grid = document.getElementById('soul-grid');
    if (!grid) return;
    document.getElementById('soul-total').textContent = G.souls || 0;
    grid.innerHTML = '';
    
    const branches = {
        'phy': { title: 'Físico', icon: '⚔️', color: '#ff4757' },
        'mag': { title: 'Mágico', icon: '🔮', color: '#1e90ff' },
        'eco': { title: 'Econômico', icon: '🪙', color: '#2ed573' },
        'neu': { title: 'Neutro', icon: '🛡️', color: '#a4b0be' },
        'war': { title: 'Guerreiros', icon: '⚔', color: '#e17055' },
        'lib': { title: 'Biblioteca', icon: '📚', color: '#1abc9c' },
        'apex':{ title: 'Suprema', icon: '🌟', color: '#ffb142' }
    };

    const wrapper = document.createElement('div');
    wrapper.className = 'soul-tree-wrapper';

    Object.entries(branches).forEach(([bKey, bData]) => {
        const branchDiv = document.createElement('div');
        branchDiv.className = 'tree-branch';
        branchDiv.innerHTML = `<div class="tree-branch-title" style="color: ${bData.color}; border-bottom: 1px solid ${bData.color}40">${bData.icon} ${bData.title}</div>`;
        
        const nodesDiv = document.createElement('div');
        nodesDiv.className = 'tree-nodes';
        nodesDiv.id = `nodes-${bKey}`;
        nodesDiv.style.setProperty('--branch-color', bData.color);
        
        branchDiv.appendChild(nodesDiv);
        wrapper.appendChild(branchDiv);
    });
    
    grid.appendChild(wrapper);

    Object.entries(SOUL_TREE_NODES).forEach(([id, node]) => {
        const stacks = getSoulStacks(id);
        const maxLv = node.maxLv || 1;
        const isMaxed = stacks >= maxLv;
        const canBuy = canUnlockNode(id);
        const unlocked = hasSoulNode(id);
        
        const card = document.createElement('div');
        card.className = `tree-node ${unlocked ? 'unlocked' : (canBuy ? 'available' : 'locked')}`;
        
        let dotsHTML = '';
        if (maxLv > 1) {
            dotsHTML = '<div class="soul-dots">';
            for(let i=0; i<maxLv; i++) {
                dotsHTML += `<div class="soul-dot ${i < stacks ? 'soul-dot-filled' : 'soul-dot-empty'}"></div>`;
            }
            dotsHTML += '</div>';
        }

        const currentCost = node.costPerLv ? (node.costPerLv[stacks] || 'MAX') : node.cost;

        card.innerHTML = `
            <div class="option-icon">${node.icon}</div>
            <div class="option-name">${node.name}</div>
            <div class="option-desc">${node.desc}</div>
            ${dotsHTML}
            <div class="soul-tag-cost">${isMaxed ? 'MÁXIMO' : `🟠 ${currentCost}`}</div>
        `;

        if (canBuy) {
            card.onclick = function() {
                unlockSoulNode(id);
                renderSoulShop();
            };
        }
        
        const target = document.getElementById(`nodes-${node.branch}`);
        if (target) target.appendChild(card);
    });
}

function getUnlockedTree() { try { const str = localStorage.getItem('wdSoulTree'); return str ? str.split(',').filter(s => s.length > 0) : []; } catch(e) { return []; } }
function hasSoulNode(id) { return getUnlockedTree().includes(id); }
function getSoulStacks(id) { return getUnlockedTree().filter(k => k === id).length; }

function canUnlockNode(id) {
    const node = SOUL_TREE_NODES[id];
    if (!node) return false;
    const stacks = getSoulStacks(id);
    const maxLv = node.maxLv || 1;
    if (stacks >= maxLv) return false;
    if (node.branch === 'apex' && getUnlockedTree().some(k => SOUL_TREE_NODES[k]?.branch === 'apex')) return false;
    const cost = node.costPerLv ? node.costPerLv[stacks] : node.cost;
    if (G.souls < cost) return false;
    if (!node.req) return true;
    if (node.req === 'ANY_TIER_3') return getUnlockedTree().some(k => k.endsWith('_3'));
    return hasSoulNode(node.req);
}

function unlockSoulNode(id) {
    if (!canUnlockNode(id)) return;
    const node = SOUL_TREE_NODES[id];
    const stacks = getSoulStacks(id);
    const cost = node.costPerLv ? node.costPerLv[stacks] : node.cost;
    G.souls -= cost;
    localStorage.setItem('wdSouls', G.souls);
    const list = getUnlockedTree();
    list.push(id);
    localStorage.setItem('wdSoulTree', list.join(','));
    renderSoulShop();
    updateHUD();
}

function openLibrary() { renderLibrary(); document.getElementById('library-overlay').classList.add('active'); }
function closeLibrary() { document.getElementById('library-overlay').classList.remove('active'); }
function renderLibrary() {
    const grid = document.getElementById('library-grid');
    if (!grid) return;
    document.getElementById('lib-soul-total').textContent = G.souls || 0;
    grid.innerHTML = '';
    
    // Conceito Antigo: Prateleiras por Raridade
    const shelves = [
        { id: 'rare', name: 'PRATELEIRA COMUM', color: 'var(--blue)', icon: '📘' },
        { id: 'epic', name: 'PRATELEIRA ÉPICA', color: '#9b59b6', icon: '📕' },
        { id: 'legendary', name: 'PRATELEIRA LENDÁRIA', color: 'var(--gold)', icon: '📙' },
        { id: 'forbidden', name: 'O ABISMO', color: 'var(--red)', icon: '📓' }
    ];

    shelves.forEach(shelf => {
        const books = Object.values(LIBRARY_BOOKS).filter(b => b.rarity === shelf.id);
        if(!books.length) return;
        
        const shelfDiv = document.createElement('div');
        shelfDiv.className = 'library-shelf';
        shelfDiv.innerHTML = `<div class="shelf-label" style="color:${shelf.color}; border-bottom: 2px solid ${shelf.color}40;">${shelf.icon} ${shelf.name}</div><div class="shelf-books option-grid"></div>`;
        const shelfBooksContainer = shelfDiv.querySelector('.shelf-books');
        
        books.forEach(b => {
            const cost = b.cost;
            const canBuy = G.souls >= cost;
            const isActive = G.activeBook === b.id;
            const card = document.createElement('div');
            
            // Lógica de Trava: Apenas 1 livro por run
            card.className = `option-card ${b.css} ${G.boughtBookThisRun && !isActive ? 'disabled' : ''} ${!canBuy && !isActive ? 'disabled' : ''} ${isActive ? 'active-book' : ''}`;
            card.style.setProperty('--cc', shelf.color);

            card.innerHTML = `
                <div class="option-icon">${b.icon}</div>
                <div class="option-name" style="color: var(--cc)">${b.name}</div>
                <div class="option-desc">${b.desc}</div>
                <div class="option-tag" style="margin-top:auto;">
                    ${isActive ? '✅ ATIVO NESTA RUN' : (G.boughtBookThisRun ? '❌ FECHADO' : `🟠 ${cost} Souls`)}
                </div>
            `;
            
            if (!G.boughtBookThisRun && canBuy && !isActive) {
                card.onclick = () => { 
                    G.souls -= cost; 
                    G.activeBook = b.id; 
                    G.boughtBookThisRun = true; 
                    localStorage.setItem('wdSouls', G.souls); 
                    closeLibrary(); 
                    updateHUD(); 
                    if(typeof addLog === 'function') addLog(`📚 Novo Livro Ativado: ${b.name}`, 'special');
                };
            }
            shelfBooksContainer.appendChild(card);
        });
        
        grid.appendChild(shelfDiv);
    });
}

// ══════════════════════════════════════════════
// INIT & CORE
// ══════════════════════════════════════════════

function saveRecord() { if (G.wave > G.highScore) { G.highScore = G.wave; localStorage.setItem('wdHighScore', G.highScore); } }

function resetGame() { location.reload(); }
function confirmReset() { document.getElementById('confirm-reset-overlay').classList.add('active'); }
function closeConfirmReset() { document.getElementById('confirm-reset-overlay').classList.remove('active'); }
function executeReset() { resetGame(); }

function showStarter() {
    G.phase = 'pick'; G.isStarterPick = true; updateHUD();
    document.getElementById('m-title').textContent = 'ESCOLHA INICIAL';
    const grid = document.getElementById('opt-grid'); grid.innerHTML = '';
    ['archer', 'mage', 'espadachim'].forEach(k => {
        const s = STRUCTS[k]; const card = document.createElement('div'); card.className = 'option-card'; card.style.setProperty('--cc', s.color);
        card.innerHTML = `
            ${getCardTypeBar(s.type)}
            <div class="option-icon">${s.icon}</div>
            <div class="option-name">${s.name}</div>
            <div class="option-desc">${s.levels[0].desc}</div>
        `;
        card.onclick = () => { document.getElementById('modal-overlay').classList.remove('active'); preparePlacement(k, 0); };
        grid.appendChild(card);
    });
    document.getElementById('modal-overlay').classList.add('active');
}

document.addEventListener('keydown', e => { if (e.code === 'Space' && G.phase === 'idle') startWave(); });

// Global Exposure
window.openShop = openShop; window.closeShop = closeShop; window.rerollShop = rerollShop;
window.openCodex = openCodex; window.closeCodex = closeCodex; window.switchCodexTab = switchCodexTab;
window.openSoulShop = openSoulShop; window.closeSoulShop = closeSoulShop;
function handleCellClick(i) {
    if (G.phase === 'place') {
        placeAt(i);
        return;
    }
    const c = G.cells[i];
    if (c.struct) {
        openSellModal(i);
    }
}

function openSellModal(i) {
    const c = G.cells[i];
    const prices = [5, 10, 20, 35]; 
    const price = prices[clampLevel(c.level)] || 5;
    
    const floating = document.getElementById('floating-sell-btn');
    const cellEl = document.getElementById('grid-container').children[i];
    if (!cellEl) return;
    const rect = cellEl.getBoundingClientRect();
    
    floating.style.display = 'block';
    floating.style.left = (rect.left + rect.width / 2) + 'px';
    floating.style.top = rect.top + 'px'; 
    
    document.getElementById('sell-price-fast').textContent = price + '🪙';
    
    const btn = document.getElementById('btn-sell-confirm-fast');
    btn.onclick = (e) => {
        e.stopPropagation();
        G.coins += price;
        c.struct = null; c.level = 0; c.hp = null;
        closeSellModal();
        renderGrid(); updateHUD(); detectCombos();
        addLog(`💰 Venda: +${price}🪙`, 'coin');
    };

    const closeListener = (ev) => {
        if (!floating.contains(ev.target) && ev.target !== cellEl && !cellEl.contains(ev.target)) {
            closeSellModal();
            document.removeEventListener('mousedown', closeListener);
        }
    };
    setTimeout(() => document.addEventListener('mousedown', closeListener), 50);
}

function closeSellModal() {
    const floating = document.getElementById('floating-sell-btn');
    if (floating) floating.style.display = 'none';
}

window.closeSellModal = closeSellModal;
window.openLibrary = openLibrary; window.closeLibrary = closeLibrary;
window.startWave = startWave; window.resetGame = resetGame; 
window.confirmReset = confirmReset; window.closeConfirmReset = closeConfirmReset; window.executeReset = executeReset;
window.placeAt = placeAt; window.cancelPlacement = cancelPlacement;

initGrid(); updateHUD(); renderGrid();
setTimeout(showStarter, 500);

function animate() { drawComboConnections(); requestAnimationFrame(animate); }
animate();
console.log("🚀 WAVE DEFENDER V8 - BALANCED");
