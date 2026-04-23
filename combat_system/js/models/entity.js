export class Entity {
    constructor(name, hp) {
        this.name = name;
        this.maxHealth = hp;
        this.health = hp;
        this.isAlive = true;
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            this.isAlive = false;
        }
    }
}