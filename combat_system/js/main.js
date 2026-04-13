import { Warrior } from './models/warrior.js';
import { Mage } from './models/mage.js';
import { Orc } from './models/orc.js';

const player = new Mage("Gandalf", 5);
const enemy = new Orc("Grommash", 4);

const logArea = document.getElementById('log');
const playerStats = document.getElementById('player-stats');
const enemyStats = document.getElementById('enemy-stats');
const attackBtn = document.getElementById('btn-attack');
const abilityBtn = document.getElementById('btn-ability');

function updateUI() {
    playerStats.innerHTML = `
        <strong>${player.name} (Lvl ${player.level})</strong><br>
        HP: ${player.health}/${player.maxHealth}<br>
        ${player.resourceType}: ${player.resource}/${player.maxResource}
    `;
    
    enemyStats.innerHTML = `
        <strong>${enemy.name} (Lvl ${enemy.level})</strong><br>
        HP: ${enemy.health}/${enemy.maxHealth}
    `;

    if (!player.isAlive || !enemy.isAlive) {
        attackBtn.disabled = true;
        abilityBtn.disabled = true;
        logMessage(player.isAlive ? "¡Has ganado la batalla!" : "¡Has sido derrotado!");
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

updateUI();