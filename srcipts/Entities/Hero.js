import { Container, Graphics } from "../../lib/pixi.mjs";

const States = {
    Stay: "stay",
    Jump: "jump",
    FlyDown: "flydown",
}

export default class Hero extends Container{

    #GRAVITY_FORCE = 0.2;
    #SPEED = 3;
    #JUMP_FORCE = 9;
    #velocityX = 0;
    #velocityY = 0;


    #movement = {
        x: 0,
        y: 0,
    }

    #directionContex = {
        left: 0,
        right: 0,
    }


    #state = States.Stay;

    constructor(){
        super();
        const  view = new Graphics();
        view.lineStyle(1, 0xffff00);
        view.drawRect(0,0,20,90);
        this.addChild(view);
    }

    update(){

        this.#velocityX = this.#movement.x * this.#SPEED;
        this.x += this.#velocityX;

        if(this.#velocityY > 0 && this.isJumpState()){
            this.#state = States.FlyDown
        }

        this.#velocityY += this.#GRAVITY_FORCE;
        this.y += this.#velocityY;
    }

    stay(platformY){
        this.#state = States.Stay;
        this.#velocityY = 0;

        this.y = platformY - this.height; 
    }

    jump(){

        if (this.#state == States.Jump || this.#state == States.FlyDown){
            return;
        }

        this.#state = States.Jump;
        this.#velocityY -= this.#JUMP_FORCE;
    }

    isJumpState(){
        return this.#state == States.Jump; 
    }

    throwDown(){
        this.#state = States.Jump;
    }

    startLeftMove(){
        this.#directionContex.left = -1;

        if (this.#directionContex.right > 0){
            this.#movement.x = 0;
            return;
        }

        this.#movement.x = -1;
    }

    startRightMove(){
        this.#directionContex.right = 1;

        if (this.#directionContex.left < 0){
            this.#movement.x = 0;
            return;
        }

        this.#movement.x = 1;
    }

    stopLeftMove(){
        this.#directionContex.left = 0;
        this.#movement.x = this.#directionContex.right;
    }

    stopRightMove(){
        this.#directionContex.right = 0;
        this.#movement.x = this.#directionContex.left;
    }

    #rect = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    }

    getRect(){
        this.#rect.x = this.x;
        this.#rect.y = this.y;
        this.#rect.width = this.width;
        this.#rect.height = this.height;

        return this.#rect;
    }
}