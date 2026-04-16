export class Character {
    constructor(name, level, maxHealth){
        this.name = name;
        this.level = level;
        this.maxHealth = maxHealth;
        this.health = maxHealth;
        this.isAlive = true;
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0){
            this.health = 0;
            this.isAlive = false;
        }
    }
}