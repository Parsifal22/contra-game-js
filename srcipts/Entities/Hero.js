import { Container, Graphics } from "../../pixi/pixi.mjs";

const States = {
    Stay: "stay",
    Jump: "jump",
}

export default class Hero extends Container{

    #GRAVITY_FORCE = 0.1;
    #SPEED = 2;
    #JUMP_FORCE = 6;
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
        view.lineStyle(1, 0xff0000);
        view.drawRect(0,0,20,60);
        this.addChild(view);
    }

    update(){

        this.#velocityX = this.#movement.x * this.#SPEED;
        this.x += this.#velocityX;

        this.#velocityY += this.#GRAVITY_FORCE;
        this.y += this.#velocityY;
    }

    stay(){
        this.#state = States.Stay;
        this.#velocityY = 0;
    }

    jump(){

        if (this.#state == States.Jump){
            return;
        }

        this.#state = States.Jump;
        this.#velocityY -= this.#JUMP_FORCE;
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
}