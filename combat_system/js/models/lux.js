import { Player } from './player.js';

export class Lux extends Player {
    constructor(name, level) {
        super(name, level, 90, 'Mana', 200);
    }

    useAbility(target) {
        if (this.resource >= 60) {
            this.resource -= 60;
            const damage = this.level * 10;
            target.takeDamage(damage);
            return damage;
        }
        return 0;
    }
}