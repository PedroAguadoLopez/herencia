import { Warrior } from './models/garen.js';
import { Mage } from './models/ryze.js';
import { Darius } from './models/darius.js';
import { Ashe } from './models/ashe.js';
import { Yasuo } from './models/yasuo.js';
import { Lux } from './models/lux.js';
import { Ahri } from './models/ahri.js';
import { Veigar } from './models/veigar.js';
import { Orc } from './models/Minion.js';

let player;
let enemy;
let killCount = 0;
let battleActive = false;
let currentChampId = '';

let gold = 0;
let xp = 0;
let level = 1;
let xpNeeded = 100;
let bonusBasicDmg = 0;
let bonusAbilityDmg = 0;
let abilityCd = 0;
let healCd = 0;
let igniteCd = 0;

const champIcons = {
    'garen': 'https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/Garen.png',
    'darius': 'https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/Darius.png',
    'ashe': 'https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/Ashe.png',
    'yasuo': 'https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/Yasuo.png',
    'ryze': 'https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/Ryze.png',
    'lux': 'https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/Lux.png',
    'ahri': 'https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/Ahri.png',
    'veigar': 'https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/Veigar.png'
};

const enemyIcons = {
    'minion': 'minion.jpg',
    'turret': 'torre.webp',
    'inhib': 'inhibidor.png',
    'superminion': 'super_minion.png',
    'nexus': 'nexo.png'
};

let currentEnemyIcon = enemyIcons['minion'];

const selectionScreen = document.getElementById('selection-screen');
const battleScreen = document.getElementById('battle-screen');
const selectionCards = document.querySelectorAll('.selection-card');
const logArea = document.getElementById('log');
const playerStats = document.getElementById('player-stats');
const enemyStats = document.getElementById('enemy-stats');
const killCounterDisplay = document.getElementById('kill-counter');

const attackBtn = document.getElementById('btn-attack');
const abilityBtn = document.getElementById('btn-ability');
const healBtn = document.getElementById('btn-heal');
const igniteBtn = document.getElementById('btn-ignite');
const nextBattleBtn = document.getElementById('btn-next-battle');

const shopBtn = document.getElementById('btn-shop');
const closeShopBtn = document.getElementById('btn-close-shop');
const shopModal = document.getElementById('shop-modal');
const shopItems = document.querySelectorAll('.shop-item');

const goldDisplay = document.getElementById('gold-display');
const xpDisplay = document.getElementById('xp-display');
const xpNeededDisplay = document.getElementById('xp-needed');
const lvlDisplay = document.getElementById('lvl-display');

setInterval(() => {
    let updated = false;
    if (healCd > 0) { healCd--; updated = true; }
    if (igniteCd > 0) { igniteCd--; updated = true; }
    if (updated) checkSpells();
}, 1000);

class GameStructure {
    constructor(name, hp, dmg) {
        this.name = name;
        this.level = 'Estructura';
        this.maxHealth = hp;
        this.health = hp;
        this.dmg = dmg;
        this.isAlive = true;
    }
    takeDamage(dmg) {
        this.health -= dmg;
        if (this.health <= 0) {
            this.health = 0;
            this.isAlive = false;
        }
    }
    attack(target) {
        if (this.dmg > 0 && target) {
            target.takeDamage(this.dmg);
        }
        return this.dmg;
    }
}

function startGame(championId) {
    killCount = 0;
    gold = 0;
    xp = 0;
    level = 1;
    xpNeeded = 100;
    bonusBasicDmg = 0;
    bonusAbilityDmg = 0;
    abilityCd = 0;
    healCd = 0;
    igniteCd = 0;
    
    battleActive = true;
    currentChampId = championId;

    const champions = {
        'garen': () => new Warrior("Garen", 1),
        'darius': () => new Darius("Darius", 1),
        'ashe': () => new Ashe("Ashe", 1),
        'yasuo': () => new Yasuo("Yasuo", 1),
        'ryze': () => new Mage("Ryze", 1),
        'lux': () => new Lux("Lux", 1),
        'ahri': () => new Ahri("Ahri", 1),
        'veigar': () => new Veigar("Veigar", 1)
    };

    player = champions[championId]();
    
    player.originalAttack = player.attack;
    player.attack = function(target) {
        let dmg = this.originalAttack.call(this, target);
        if (bonusBasicDmg > 0 && target.isAlive) {
            target.takeDamage(bonusBasicDmg);
            dmg += bonusBasicDmg;
        }
        return dmg;
    };

    player.originalUseAbility = player.useAbility;
    player.useAbility = function(target) {
        let dmg = this.originalUseAbility.call(this, target);
        if (dmg > 0 && bonusAbilityDmg > 0 && target.isAlive) {
            target.takeDamage(bonusAbilityDmg);
            dmg += bonusAbilityDmg;
        }
        return dmg;
    };

    spawnEnemy();
    selectionScreen.classList.add('hidden');
    battleScreen.classList.remove('hidden');
    logArea.innerHTML = '';
    logMessage(`¡Bienvenido a la Grieta del Invocador, ${player.name}!`);
    updateUI();
}

function spawnEnemy() {
    if (killCount < 4) {
        enemy = new Orc("Minion", level);
        currentEnemyIcon = enemyIcons['minion'];
        killCounterDisplay.textContent = `Oleada: ${killCount + 1}/4 - Avanza hacia la Torreta`;
    } else if (killCount === 4) {
        enemy = new GameStructure("Torreta Exterior", 500, 20);
        currentEnemyIcon = enemyIcons['turret'];
        killCounterDisplay.textContent = `¡Destruye la Torreta Enemiga!`;
    } else if (killCount > 4 && killCount < 7) {
        enemy = new Orc("Minion", level + 1);
        currentEnemyIcon = enemyIcons['minion'];
        killCounterDisplay.textContent = `Oleada: ${killCount - 3}/2 - Avanza hacia el Inhibidor`;
    } else if (killCount === 7) {
        enemy = new GameStructure("Inhibidor", 1000, 0);
        currentEnemyIcon = enemyIcons['inhib'];
        killCounterDisplay.textContent = `¡El Inhibidor está expuesto!`;
    } else if (killCount > 7 && killCount < 10) {
        enemy = new Orc("Minion", level + 2);
        currentEnemyIcon = enemyIcons['minion'];
        killCounterDisplay.textContent = `Defensa de la Base: ${killCount - 6}/2`;
    } else if (killCount === 10) {
        enemy = new Orc("Super Minion", level + 4);
        enemy.maxHealth = 800;
        enemy.health = 800;
        currentEnemyIcon = enemyIcons['superminion'];
        killCounterDisplay.textContent = `¡Aparece un Super Minion!`;
    } else if (killCount === 11) {
        enemy = new GameStructure("Nexo", 1500, 0);
        currentEnemyIcon = enemyIcons['nexus'];
        killCounterDisplay.textContent = `¡DESTRUYE EL NEXO PARA GANAR!`;
    }
    
    battleActive = true;
    attackBtn.disabled = false;
    checkSpells();
}

selectionCards.forEach(card => {
    card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        startGame(id);
    });
});

function checkSpells() {
    abilityBtn.disabled = abilityCd > 0 || !battleActive;
    document.getElementById('ability-cd').textContent = abilityCd > 0 ? `(${abilityCd})` : '';
    
    healBtn.disabled = healCd > 0 || !battleActive;
    document.getElementById('heal-cd').textContent = healCd > 0 ? `(${healCd}s)` : '';
    
    igniteBtn.disabled = igniteCd > 0 || !battleActive;
    document.getElementById('ignite-cd').textContent = igniteCd > 0 ? `(${igniteCd}s)` : '';
}

function advanceCooldowns() {
    if (abilityCd > 0) abilityCd--;
    checkSpells();
}

function gainRewards() {
    let gainedGold = 200;
    let gainedXp = 80;

    if (enemy.name === "Torreta Exterior" || enemy.name === "Inhibidor" || enemy.name === "Super Minion") {
        gainedGold = 600;
        gainedXp = 250;
    }
    
    gold += gainedGold;
    xp += gainedXp;
    
    logMessage(`Recompensas: ${gainedGold}g y ${gainedXp} XP.`);
    
    if (xp >= xpNeeded) {
        level++;
        xp -= xpNeeded;
        xpNeeded = Math.floor(xpNeeded * 1.5);
        player.level = level;
        player.maxHealth += 50;
        player.health = player.maxHealth;
        player.maxResource += 20;
        player.resource = player.maxResource;
        logMessage(`¡SUBES AL NIVEL ${level}! Recuperas toda tu vida y recurso.`);
    }
}

function updateUI() {
    goldDisplay.textContent = gold;
    xpDisplay.textContent = xp;
    xpNeededDisplay.textContent = xpNeeded;
    lvlDisplay.textContent = level;

    const hpPct = Math.max(0, (player.health / player.maxHealth) * 100);
    const resPct = player.maxResource ? Math.max(0, (player.resource / player.maxResource) * 100) : 0;
    const enemyHpPct = Math.max(0, (enemy.health / enemy.maxHealth) * 100);
    
    playerStats.innerHTML = `
        <div class="combat-entity">
            <img src="${champIcons[currentChampId]}" class="combat-portrait">
            <strong>${player.name} (Lvl ${player.level})</strong>
        </div>
        <div class="bar-container">
            <div class="bar health-bar" style="width: ${hpPct}%"></div>
            <span class="bar-text">${player.health} / ${player.maxHealth} HP</span>
        </div>
        <div class="bar-container">
            <div class="bar resource-bar" style="width: ${resPct}%"></div>
            <span class="bar-text">${player.resource} / ${player.maxResource} ${player.resourceType || 'Energía'}</span>
        </div>
    `;
    
    enemyStats.innerHTML = `
        <div class="combat-entity">
            <img src="${currentEnemyIcon}" class="combat-portrait enemy-portrait">
            <strong>${enemy.name} (Lvl ${enemy.level})</strong>
        </div>
        <div class="bar-container">
            <div class="bar enemy-health-bar" style="width: ${enemyHpPct}%"></div>
            <span class="bar-text">${enemy.health} / ${enemy.maxHealth} HP</span>
        </div>
    `;

    if (battleActive && (!player.isAlive || !enemy.isAlive)) {
        battleActive = false;
        attackBtn.disabled = true;
        abilityBtn.disabled = true;
        healBtn.disabled = true;
        igniteBtn.disabled = true;
        
        if (player.isAlive) {
            if (killCount === 11) {
                logMessage(`¡VICTORIA! HAS DESTRUIDO EL NEXO ENEMIGO.`);
                killCounterDisplay.textContent = "¡VICTORIA!";
                return;
            }
            
            gainRewards();
            killCount++;
            nextBattleBtn.classList.remove('hidden');
        } else {
            logMessage("¡Has sido derrotado! Fin de la partida.");
        }
    }
}

function logMessage(msg) {
    const p = document.createElement('p');
    p.textContent = msg;
    logArea.appendChild(p);
    logArea.scrollTop = logArea.scrollHeight;
}

function enemyTurn() {
    if (!enemy.isAlive) return;
    const dmg = enemy.attack(player);
    
    if (dmg > 0) {
        logMessage(`${enemy.name} ataca causando ${dmg} de daño.`);
    } else {
        logMessage(`${enemy.name} no puede atacar.`);
    }
    
    advanceCooldowns();
    updateUI();
}

attackBtn.addEventListener('click', () => {
    const dmg = player.attack(enemy);
    if (player.resource < player.maxResource) {
        player.resource = Math.min(player.maxResource, player.resource + 15);
    }
    logMessage(`${player.name} ataca y causa ${dmg} de daño.`);
    updateUI();
    if (enemy.isAlive) setTimeout(enemyTurn, 1000);
});

abilityBtn.addEventListener('click', () => {
    const dmg = player.useAbility(enemy);
    if (dmg > 0) {
        abilityCd = 3;
        logMessage(`${player.name} usa su habilidad y causa ${dmg} de daño.`);
        checkSpells();
        updateUI();
        if (enemy.isAlive) setTimeout(enemyTurn, 1000);
    } else {
        logMessage(`No hay suficiente recurso.`);
    }
});

healBtn.addEventListener('click', () => {
    const amount = Math.floor(player.maxHealth * 0.3);
    player.health = Math.min(player.maxHealth, player.health + amount);
    healCd = 50;
    logMessage(`¡Usas Curar! Recuperas ${amount} HP.`);
    checkSpells();
    updateUI();
    if (enemy.isAlive) setTimeout(enemyTurn, 1000);
});

igniteBtn.addEventListener('click', () => {
    const dmg = 40 + (level * 15);
    enemy.takeDamage(dmg);
    igniteCd = 140;
    logMessage(`¡Usas Prender! ${enemy.name} sufre ${dmg} de daño verdadero.`);
    checkSpells();
    updateUI();
    if (enemy.isAlive) setTimeout(enemyTurn, 1000);
});

nextBattleBtn.addEventListener('click', () => {
    nextBattleBtn.classList.add('hidden');
    spawnEnemy();
    logMessage(`¡Aparece ${enemy.name}!`);
    updateUI();
});

shopBtn.addEventListener('click', () => { shopModal.classList.remove('hidden'); });
closeShopBtn.addEventListener('click', () => { shopModal.classList.add('hidden'); });

shopItems.forEach(item => {
    item.addEventListener('click', () => {
        const cost = parseInt(item.getAttribute('data-cost'));
        const type = item.getAttribute('data-item');
        
        if (gold >= cost) {
            gold -= cost;
            if (type === 'potion') {
                player.health = Math.min(player.maxHealth, player.health + 50);
                logMessage("Compras Poción de Vida. (+50 HP)");
            } else if (type === 'doran') {
                player.maxHealth += 80;
                player.health += 80;
                bonusBasicDmg += 10;
                logMessage("Compras Espada de Doran. (+80 HP, +10 Daño Base)");
            } else if (type === 'rabadon') {
                bonusAbilityDmg += 40;
                logMessage("Compras Vara Grande. (+40 Daño de Habilidad)");
            }
            updateUI();
        } else {
            logMessage("No tienes suficiente oro.");
        }
    });
});