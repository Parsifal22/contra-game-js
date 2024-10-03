import { Container } from "../lib/pixi.mjs";
import Camera from "./Camera.js";
import BulletFactory from "./Entities/Bullets/BulletFactory.js";
import RunnerFactory from "./Entities/Enemies/Runner/RunnerFactory.js";
import Hero from "./Entities/Hero/Hero.js"
import PlatformFactory from "./Entities/Platforms/PlatformFactory.js";
import KeyboardProcessor from "./KeyboardProcessor.js";

export default class Game {

    #pixiApp;
    #hero;
    #platforms = [];
    #bullets = [];
    #enemies = [];
    #camera;

    #bulletFactory;
    #runnerFactory;

    #worldContainer
    keyboardProcessor;


    constructor(pixiApp){
        this.#pixiApp = pixiApp;

        this.#worldContainer = new Container();
        this.#pixiApp.stage.addChild(this.#worldContainer);

        this.#hero = new Hero(this.#worldContainer);
        this.#hero.x = 100;
        this.#hero.y = 50;

        const platformFactory = new PlatformFactory(this.#worldContainer);

        this.#platforms.push(platformFactory.createPlatform(100, 400));
        this.#platforms.push(platformFactory.createPlatform(300, 400));
        this.#platforms.push(platformFactory.createPlatform(500, 400));
        this.#platforms.push(platformFactory.createPlatform(700, 400));
        this.#platforms.push(platformFactory.createPlatform(1100, 500));


        this.#platforms.push(platformFactory.createPlatform(1200, 600));
        this.#platforms.push(platformFactory.createPlatform(1400, 600));
        this.#platforms.push(platformFactory.createPlatform(1800, 600));

        this.#platforms.push(platformFactory.createPlatform(300, 550));

        this.#platforms.push(platformFactory.createBox(0, 738));
        this.#platforms.push(platformFactory.createBox(200, 738));
        this.#platforms.push(platformFactory.createBox(600, 738));
        this.#platforms.push(platformFactory.createBox(1000, 738));

        const box = platformFactory.createBox(400, 708);
        box.isStep = true;
        this.#platforms.push(box);

        this.keyboardProcessor = new KeyboardProcessor(this);
        this.setKeys();

        const cameraSettings = {
            target: this.#hero,
            world: this.#worldContainer,
            screenSize: this.#pixiApp.screen,
            maxWorldWidth: this.#worldContainer.width,
            isBackScrollX: false,

        }
        this.#camera = new Camera(cameraSettings);

        this.#bulletFactory = new BulletFactory();

        this.#runnerFactory = new RunnerFactory(this.#worldContainer);
        this.#enemies.push(this.#runnerFactory.createRunner(600, 100));

    }

    update(){
        
        this.#hero.update();


        for (let enemy of this.#enemies) {
            enemy.update();
        }

        for (let platform of this.#platforms) {

            if(this.#hero.isJumpState() && platform.type != "box"){
                continue;
            }

            this.checkPlatformCollision(this.#hero, platform);

            for (let enemy of this.#enemies) {
                if(enemy.isJumpState() && platform.type != "box"){
                    continue;
                }
    
                this.checkPlatformCollision(enemy, platform);
            }
        }

        this.#camera.update();

        for (let i = 0; i < this.#bullets.length; i++){
            this.#bullets[i].update();
            this.#checkBulletPosition(this.#bullets[i], i);
        }

    }

    checkPlatformCollision(character, platform){

        const prevPoint = character.prevPoint;

        const collisionResult = this.getOrientCollisionResult(character.collisionBox, platform, prevPoint)

        if (collisionResult.vertical == true){
            character.y = prevPoint.y;
            character.stay(platform.y);
        }
        if (collisionResult.horizontal == true && platform.type == "box"){
            if (platform.isStep){
                character.stay(platform.y);
                
            }
            else{
               character.x = prevPoint.x; 
            }
            
        }
    }

    getOrientCollisionResult(aaRect, bbRect, aaPrevPoint){
        const collisionResult = {
            horizontal: false,
            vertical: false,
        }

        if (!this.isCheckAABB(aaRect, bbRect)){ 
            return collisionResult;
        } 

        aaRect.y = aaPrevPoint.y;
        if (!this.isCheckAABB(aaRect, bbRect)){

            collisionResult.vertical = true;
            return collisionResult;
        } 

        collisionResult.horizontal = true;
        return collisionResult;
    }

    isCheckAABB(entity, area){
        return (entity.x < area.x + area.width &&
            entity.x + entity.width > area.x &&
            entity.y < area.y + area.height &&
            entity.y + entity.height > area.y);
    }


    isCheckAABB(entity, area){
        return (entity.x < area.x + area.width &&
            entity.x + entity.width > area.x &&
            entity.y < area.y + area.height &&
            entity.y + entity.height > area.y);
    }

    setKeys(){

        this.keyboardProcessor.getButton("KeyA").executeDown = function(){
            const bullet = this.#bulletFactory.createBullet(this.#hero.bulletContext);
            this.#worldContainer.addChild(bullet);
            this.#bullets.push(bullet);
        }

        this.keyboardProcessor.getButton("KeyS").executeDown = function(){
            if(this.keyboardProcessor.isButtonPressed("ArrowDown") 
                && !(this.keyboardProcessor.isButtonPressed("ArrowRight") || this.keyboardProcessor.isButtonPressed("ArrowLeft"))){
                this.#hero.throwDown(); 
            }
            else{
               this.#hero.jump(); 
            }
            
        };

        const arrowLeft = this.keyboardProcessor.getButton("ArrowLeft");
        arrowLeft.executeDown = function(){
            this.#hero.startLeftMove();
            this.#hero.setView(this.getArrowButtonContext());
        };
        arrowLeft.executeUp = function(){
            this.#hero.stopLeftMove();
            this.#hero.setView(this.getArrowButtonContext());
        };

        const arrowRight = this.keyboardProcessor.getButton("ArrowRight");
        arrowRight.executeDown = function(){
            this.#hero.startRightMove();
            this.#hero.setView(this.getArrowButtonContext());
        };
        arrowRight.executeUp = function(){
            this.#hero.stopRightMove();
            this.#hero.setView(this.getArrowButtonContext());
        };

        const arrowUp = this.keyboardProcessor.getButton("ArrowUp");
        arrowUp.executeDown = function(){
            this.#hero.setView(this.getArrowButtonContext());
        };
        arrowUp.executeUp = function(){
            this.#hero.setView(this.getArrowButtonContext());
        };

        const arrowDown = this.keyboardProcessor.getButton("ArrowDown");
        arrowDown.executeDown = function(){
            this.#hero.setView(this.getArrowButtonContext());
        };
        arrowDown.executeUp = function(){
            this.#hero.setView(this.getArrowButtonContext());
        };
    }

    getArrowButtonContext(){
        const buttonContext = {};
        buttonContext.arrowLeft = this.keyboardProcessor.isButtonPressed("ArrowLeft");
        buttonContext.arrowRight = this.keyboardProcessor.isButtonPressed("ArrowRight");
        buttonContext.arrowUp = this.keyboardProcessor.isButtonPressed("ArrowUp");
        buttonContext.arrowDown = this.keyboardProcessor.isButtonPressed("ArrowDown");
        return buttonContext;
    }

    #checkBulletPosition(bullet, index){
        if (bullet.x > (this.#pixiApp.screen.width - this.#worldContainer.x)
            || bullet.y > this.#pixiApp.screen.height
            || bullet.x < -this.#worldContainer.x
            || bullet.y < 0){

            if(bullet.parent != null){
                bullet.removeFromParent(); 
            }
            this.#bullets.splice(index, 1);              
        }
    }

}