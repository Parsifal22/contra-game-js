import HeroView from "./HeroView.js";

const States = {
    Stay: "stay",
    Jump: "jump",
    FlyDown: "flydown",
}

export default class Hero {

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

    #isLay = false;
    #isStayUp = false;

    #view;

    constructor(stage){
        this.#view = new HeroView();
        stage.addChild(this.#view);

        this.#state = States.Jump;
        this.#view.showJump();
    }

    get x(){
        return this.#view.x;
    }

    set x(value){
        this.#view.x = value;
    }

    get y(){
        return this.#view.y;
    }

    set y(value){
        this.#view.y = value;
    }

    get collisionBox(){
        return this.#view.collisionBox;
    }

    update(){

        this.#velocityX = this.#movement.x * this.#SPEED;
        this.x += this.#velocityX;

        if(this.#velocityY > 0){
            if(!(this.#state == States.Jump || this.#state == States.FlyDown)){
                this.#view.showFall();
            }
            this.#state = States.FlyDown
        }

        this.#velocityY += this.#GRAVITY_FORCE;
        this.y += this.#velocityY;
    }

    stay(platformY){

        if (this.#state == States.Jump || this.#state == States.FlyDown){
            const fakeButtonContext = {};
            fakeButtonContext.arrowLeft = this.#movement.x == -1;
            fakeButtonContext.arrowRight = this.#movement.x == 1;
            fakeButtonContext.arrowDown = this.#isLay;
            fakeButtonContext.arrowUp = this.#isStayUp;
            this.#state = States.Stay;
            this.setView(fakeButtonContext);
        }

        this.#state = States.Stay;
        this.#velocityY = 0;
        this.y = platformY - this.#view.collisionBox.height; 
    }

    jump(){

        if (this.#state == States.Jump || this.#state == States.FlyDown){
            return;
        }

        this.#state = States.Jump;
        this.#velocityY -= this.#JUMP_FORCE;
        this.#view.showJump();
    }

    isJumpState(){
        return this.#state == States.Jump; 
    }

    throwDown(){
        this.#state = States.Jump;
        this.#view.showFall();
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

    setView(buttonContext){

        this.#view.flip(this.#movement.x);
        this.#isLay = buttonContext.arrowDown;
        this.#isStayUp = buttonContext.arrowUp;


        if (this.#state == States.Jump || this.#state == States.FlyDown){
            return;
        }

        if(buttonContext.arrowLeft || buttonContext.arrowRight){
            if(buttonContext.arrowUp){
                this.#view.showRunUp();
            }
            else if(buttonContext.arrowDown){
                this.#view.showRunDown();
            }
            else{
               this.#view.showRun(); 
            }
            
        }
        else{
            if(buttonContext.arrowUp){
                this.#view.showStayUp();
            }
            else if(buttonContext.arrowDown){
                this.#view.showLay();
            }
            else{
              this.#view.showStay(); 
            }
            
        }
    }

}