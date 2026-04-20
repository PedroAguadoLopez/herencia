import { Player } from './player.js';

export class Ahri extends Player {
    constructor(name, level) {
        super(name, level, 110, 'Mana', 200);
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