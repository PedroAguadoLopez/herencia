import { Player } from './player.js';

export class Darius extends Player {
    constructor(name, level) {
        super(name, level, 180, 'Maná', 100);
    }

    useAbility(target) {
        if (this.resource >= 35) {
            this.resource -= 35;
            const damage = this.level * 7;
            target.takeDamage(damage);
            return damage;
        }
        return 0;
    }
}