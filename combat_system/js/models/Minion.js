import { Enemy } from './enemy.js';

export class Orc extends Enemy {
    constructor(name, level) {
        super(name, level, 120, level * 4);
    }
}