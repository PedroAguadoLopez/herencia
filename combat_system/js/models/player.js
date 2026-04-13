import { Character } from "./character";

export class Player extends Character {
    constructor(name, level, maxHealth, resourceType, maxResource) {
        super(name, level, maxHealth);
        this.resourceType = resourceType;
        this.maxResource = maxResource;
        this.resource = maxResource;
        }

    attack(target){
        const damage = this.level * 3;
        target.takeDamage(damage);
        return damage;
    }

    useAbility(target){
        return 0;
    }

    }