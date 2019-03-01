// Task 1
function sum() {
    return [].reduce.call(
        arguments,
        (acc, el) => acc + el,
        0
    );
}

// Task 2
function multiply() {
    return [].reduce.call(
        arguments,
        (acc, el) => acc * el,
        1
    );
}

let closure = () => {
    let cachedActions = {};

    return (action) => (...args) => {
        let cachedActionsValues = cachedActions[action.name] || (cachedActions[action.name] = {});

        let arrayAsKey = args.sort().join();

        let result = cachedActionsValues[arrayAsKey] || (cachedActionsValues[arrayAsKey] = action(...args)) + ' (not in cache yet)';

        return result;
    }
}

let memoization = closure();

console.log(memoization(sum)(1, 2, 3))
console.log(memoization(sum)(1, 2, 3))
console.log(memoization(multiply)(1, 2, 3))
console.log(memoization(multiply)(3, 2, 1))

// Task 3
class Warrior {
    constructor(name, attackType, healthPoints) {
        this.name = name;
        this.attackType = attackType;
        this.healthPoints = healthPoints;
        this.maxDamage = 10;
        this.minDamage = 1;
    }

    dealDamage(amountOfDamage) {
        this.healthPoints -= amountOfDamage;

        if (this.healthPoints < 0) {
            this.healthPoints = 0;
        }

        let isDead = this.healthPoints === 0;
        return isDead;
    }

    getAttackDamage() {
        return Math.floor(Math.random() * (this.maxDamage + 1 - this.minDamage)) + this.minDamage;
    }
}

class Monster extends Warrior {
    constructor(name, attackType, healthPoints) {
        super(name, attackType, healthPoints);
    }

    getAttackDamage() {
        // Monster can deal critical damage (x2) with 15% chance
        let isCriticalStrike = Math.floor(Math.random() * (100)) + 1 <= 15;
        let attackDamage = super.getAttackDamage();

        if (isCriticalStrike) {
            console.log(`${this.name} (monster) deals a critical strike!`);
            attackDamage *= 2;
        }

        return attackDamage;
    }
}

class Gladiator extends Warrior {
    constructor(name, attackType, healthPoints) {
        super(name, attackType, healthPoints);
    }

    dealDamage(amountOfDamage) {
        // Gladiator has some armor, so he reduces incoming damage
        let reducedDamage = Math.floor(amountOfDamage * 0.8);
        
        console.log(`${this.name} (gladiator) reduced incoming damage by 20%`);

        return super.dealDamage(reducedDamage);
    }
}

class Game {
    constructor(firstWarrior, secondWarrior) {
        this.firstWarrior = firstWarrior;
        this.secondWarrior = secondWarrior;
    }

    // Attack move
    _move(damageDealer, victim) {
        let damageDealerAttackDamage = damageDealer.getAttackDamage();
        
        console.log(`${damageDealer.name} attacked ${victim.name} and deals ${damageDealerAttackDamage} damage.`);
        
        let victimIsDead = victim.dealDamage(damageDealerAttackDamage);

        if (victimIsDead) {
            console.log(`${victim.name} died.`);
        } else {
            console.log(`${victim.name} has ${victim.healthPoints} HP.`);
        }

        return victimIsDead;
    }

    start() {
        let persons = [this.firstWarrior, this.secondWarrior];

        // Randomize first move
        if (Math.floor(Math.random())) {
            persons.reverse();
        }

        // Sequence of moves
        do {
            if (this._move(...persons)) {
                this.winner = persons[0].name;
            } else {
                persons.reverse();
            }
        } while (!this.winner);

        return this;
    }
}

const gladiator = new Gladiator('Serhii', 'Melee', 30);
const monster = new Monster('Ghoul', 'Melee', 20);
const game = new Game(gladiator, monster);

game.start();

console.log(`Winner - ${game.winner}.`);