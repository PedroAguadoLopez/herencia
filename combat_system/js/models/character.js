import { Entity } from './entity.js';

export class Character extends Entity {
    constructor(name, level, maxHealth) {
        super(name, maxHealth);
        this.level = level;
    }
}