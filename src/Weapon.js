export default class Weapon {

    #currentGunStartegy;
    #bulletFactory;

    #count = 0;
    #limit = 6;

    #isFire = false;

    constructor(bulletFactory) {
        this.#currentGunStartegy = this.#defaultGunStrategy;
        this.#bulletFactory = bulletFactory;
    }

    update(bulletContext) {

        if(this.#isFire == false) {
            return;
        }
        
        if (this.#count % this.#limit == 0) {
            this.#currentGunStartegy(bulletContext);
        }
        this.#count++;
    }

    setWeapon(type) {
        switch(type) {
            case 1:
                this.#currentGunStartegy = this.#defaultGunStrategy;
                break;
            case 2:
                this.#currentGunStartegy = this.#spreadGunStrategy;
                break;
        }
    }

    startFire(bulletContext) {
        this.#isFire = true;

    }

    stopFire() {
        this.#isFire = false;
        this.#count = 0;
    }

    #defaultGunStrategy(bulletContext) {
        this.#limit = 10;
        this.#bulletFactory.createBullet(bulletContext)
    }

    #spreadGunStrategy(bulletContext) {
        let angleShift = -20;
        this.#limit = 40;

        for(let i = 0; i < 5; i++){

            const localBulletContext = {
                x: bulletContext.x,
                y: bulletContext.y,
                angle: bulletContext.angle + angleShift,
                type: bulletContext.type,
            }

            this.#bulletFactory.createSpreadBullet(localBulletContext);
            angleShift += 10;

        }


    }
}