import { Player } from './player.js';

export class Veigar extends Player {
    constructor(name, level) {
        super(name, level, 85, 'Mana', 250);
    }

    useAbility(target) {
        if (this.resource >= 70) {
            this.resource -= 70;
            const damage = this.level * 12;
            target.takeDamage(damage);
            return damage;
        }
        return 0;
    }
}