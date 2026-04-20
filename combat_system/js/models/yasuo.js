import { Player } from './player.js';

export class Yasuo extends Player {
    constructor(name, level) {
        super(name, level, 140, 'Flujo', 100);
    }

    useAbility(target) {
        if (this.resource >= 100) {
            this.resource = 0;
            const damage = this.level * 9;
            target.takeDamage(damage);
            return damage;
        }
        return 0;
    }
}