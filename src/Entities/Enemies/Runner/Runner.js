import Entity from "../../Entity.js";

const States = {
    Stay: "stay",
    Jump: "jump",
    FlyDown: "flydown",
}

export default class Runner extends Entity {

    #GRAVITY_FORCE = 0.2;
    #SPEED = 3;
    #JUMP_FORCE = 9;
    #velocityX = 0;
    #velocityY = 0;


    #movement = {
        x: 0,
        y: 0,
    }

    #prevPoint = {
        x: 0,
        y: 0,
    }

    #state = States.Stay;

    type = "enemy";

    constructor(view) {
        super(view);


        this.#state = States.Jump;
        this._view.showJump();

        this.#movement.x = -1;

        this.gravitable = true;
    }

    get prevPoint() {
        return this.#prevPoint;
    }

    update() {

        this.#prevPoint.x = this.x;
        this.#prevPoint.y = this.y;

        this.#velocityX = this.#movement.x * this.#SPEED;
        this.x += this.#velocityX;

        if (this.#velocityY > 0) {
            if (!(this.#state == States.Jump || this.#state == States.FlyDown)) {
                if(Math.random() > 0.4) {
                    this._view.showFall();
                }
                else {
                    this.jump();
                }
                
            }

            if(this.#velocityY > 0) {
                this.#state = States.FlyDown;
            }

        }

        this.#velocityY += this.#GRAVITY_FORCE;
        this.y += this.#velocityY;
    }

    damage() {
        this.dead();
    }

    stay(platformY) {

        if (this.#state == States.Jump || this.#state == States.FlyDown) {
            const fakeButtonContext = {};
            fakeButtonContext.arrowLeft = this.#movement.x == -1;
            fakeButtonContext.arrowRight = this.#movement.x == 1;
            this.#state = States.Stay;
            this.setView(fakeButtonContext);
        }

        this.#state = States.Stay;
        this.#velocityY = 0;
        this.y = platformY - this._view.collisionBox.height;
    }

    jump() {

        this._view.flip(this.#movement.x);

        if (this.#state == States.Jump || this.#state == States.FlyDown) {
            return;
        }

        this.#state = States.Jump;
        this.#velocityY -= this.#JUMP_FORCE;
        this._view.showJump();
    }

    isJumpState() {
        return this.#state == States.Jump;
    }

    setView(buttonContext) {

        this._view.flip(this.#movement.x);

        if (this.isJumpState() || this.#state == States.FlyDown) {
            return;
        }

        if (buttonContext.arrowLeft || buttonContext.arrowRight) {
            this._view.showRun();
        }
    }

    removeFromParent() {
        if (this._view.parent != null) {
            this._view.removeFromParent();
        }
    }

}