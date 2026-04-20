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

const selectionScreen = document.getElementById('selection-screen');
const battleScreen = document.getElementById('battle-screen');
const selectionCards = document.querySelectorAll('.selection-card');
const logArea = document.getElementById('log');
const playerStats = document.getElementById('player-stats');
const enemyStats = document.getElementById('enemy-stats');
const killCounterDisplay = document.getElementById('kill-counter');
const attackBtn = document.getElementById('btn-attack');
const abilityBtn = document.getElementById('btn-ability');
const nextBattleBtn = document.getElementById('btn-next-battle');

function getRandomLevel(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function startGame(championId) {
    killCount = 0;
    battleActive = true;
    const playerLevel = getRandomLevel(3, 7);
    const enemyLevel = getRandomLevel(3, 8);

    const champions = {
        'garen': () => new Warrior("Garen", playerLevel),
        'darius': () => new Darius("Darius", playerLevel),
        'ashe': () => new Ashe("Ashe", playerLevel),
        'yasuo': () => new Yasuo("Yasuo", playerLevel),
        'ryze': () => new Mage("Ryze", playerLevel),
        'lux': () => new Lux("Lux", playerLevel),
        'ahri': () => new Ahri("Ahri", playerLevel),
        'veigar': () => new Veigar("Veigar", playerLevel)
    };

    player = champions[championId]();
    enemy = new Orc("Minion", enemyLevel);

    selectionScreen.classList.add('hidden');
    battleScreen.classList.remove('hidden');
    
    updateUI();
}

selectionCards.forEach(card => {
    card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        startGame(id);
    });
});

function updateUI() {
    killCounterDisplay.textContent = `Minions Farmeados: ${killCount}`;
    
    playerStats.innerHTML = `
        <strong>${player.name} (Lvl ${player.level})</strong><br>
        HP: ${player.health}/${player.maxHealth}<br>
        ${player.resourceType}: ${player.resource}/${player.maxResource}
    `;
    
    enemyStats.innerHTML = `
        <strong>${enemy.name} (Lvl ${enemy.level})</strong><br>
        HP: ${enemy.health}/${enemy.maxHealth}
    `;

    if (battleActive && (!player.isAlive || !enemy.isAlive)) {
        battleActive = false;
        attackBtn.disabled = true;
        abilityBtn.disabled = true;
        
        if (player.isAlive) {
            killCount++;
            const healAmount = Math.floor(player.maxHealth * 0.20);
            const resourceAmount = Math.floor(player.maxResource * 0.20);
            
            player.health = Math.min(player.maxHealth, player.health + healAmount);
            player.resource = Math.min(player.maxResource, player.resource + resourceAmount);
            
            logMessage(`¡Victoria! Recuperas ${healAmount} HP y ${resourceAmount} de ${player.resourceType}.`);
            nextBattleBtn.classList.remove('hidden');
        } else {
            logMessage("¡Has sido derrotado!");
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
    logMessage(`${enemy.name} ataca causando ${dmg} de daño.`);
    updateUI();
}

attackBtn.addEventListener('click', () => {
    const dmg = player.attack(enemy);
    logMessage(`${player.name} ataca y causa ${dmg} de daño.`);
    updateUI();
    if (enemy.isAlive) setTimeout(enemyTurn, 1000);
});

abilityBtn.addEventListener('click', () => {
    const dmg = player.useAbility(enemy);
    if (dmg > 0) {
        logMessage(`${player.name} usa su habilidad especial y causa ${dmg} de daño.`);
        updateUI();
        if (enemy.isAlive) setTimeout(enemyTurn, 1000);
    } else {
        logMessage(`No hay suficiente ${player.resourceType} para la habilidad.`);
    }
});

nextBattleBtn.addEventListener('click', () => {
    const enemyLevel = getRandomLevel(3, 8);
    enemy = new Orc("Minion", enemyLevel);
    battleActive = true;
    attackBtn.disabled = false;
    abilityBtn.disabled = false;
    nextBattleBtn.classList.add('hidden');
    logMessage(`¡Un nuevo Minion de nivel ${enemyLevel} aparece!`);
    updateUI();
});