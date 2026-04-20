import { Player } from './player.js';

export class Mage extends Player {
    constructor(name, level) {
        super(name, level, 80, 'Mana', 200);
    }

    useAbility(target) {
        if (this.resource >= 50) {
            this.resource -= 50;
            const damage = this.level * 8;
            target.takeDamage(damage);
            return damage;
        }
        return 0;
    }
}