export default class Weapon {

    #currentGunStartegy;
    #bulletFactory;

    constructor(bulletFactory) {
        this.#currentGunStartegy = this.#defaultGunStrategy;
        this.#bulletFactory = bulletFactory;
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

    fire(bulletContext) {
        this.#currentGunStartegy(bulletContext);
    }

    #defaultGunStrategy(bulletContext) {
        this.#bulletFactory.createBullet(bulletContext)
    }

    #spreadGunStrategy(bulletContext) {
        let angleShift = -20;

        for(let i = 0; i < 5; i++){

            const localBulletContext = {
                x: bulletContext.x,
                y: bulletContext.y,
                angle: bulletContext.angle + angleShift,
                type: bulletContext.type,
            }

            this.#bulletFactory.createBullet(localBulletContext);
            angleShift += 10;

        }


    }
}