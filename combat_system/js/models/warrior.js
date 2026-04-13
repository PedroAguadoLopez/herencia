import { Player } from './player.js';

export class Warrior extends Player {
    constructor(name, level) {
        super(name, level, 150, 'Stamina', 100);
    }

    useAbility(target) {
        if (this.resource >= 30) {
            this.resource -= 30;
            const damage = this.level * 6;
            target.takeDamage(damage);
            return damage;
        }
        return 0;
    }
}