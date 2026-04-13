import { Character } from './character.js';

export class Enemy extends Character {
    constructor(name, level, maxHealth, damage) {
        super(name, level, maxHealth);
        this.damage = damage;
    }

    attack(target) {
        target.takeDamage(this.damage);
        return this.damage;
    }
}