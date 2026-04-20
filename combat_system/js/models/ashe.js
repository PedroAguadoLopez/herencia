import { Player } from './player.js';

export class Ashe extends Player {
    constructor(name, level) {
        super(name, level, 130, 'Maná', 100);
    }

    useAbility(target) {
        if (this.resource >= 40) {
            this.resource -= 40;
            const damage = this.level * 5;
            target.takeDamage(damage);
            return damage;
        }
        return 0;
    }
}