import Hero from "./Entities/Hero.js"
import PlatformFactory from "./Entities/Platforms/PlatformFactory.js";
import KeyboardProcessor from "./KeyboardProcessor.js";

export default class Game {

    #pixiApp;
    #hero;
    #platforms = [];

    keyboardProcessor;


    constructor(pixiApp){
        this.#pixiApp = pixiApp;

        this.#hero = new Hero();
        this.#hero.x = 100;
        this.#hero.y = 50;
        this.#pixiApp.stage.addChild(this.#hero);

        const platformFactory = new PlatformFactory(this.#pixiApp);

        this.#platforms.push(platformFactory.createPlatform(100, 400));
        this.#platforms.push(platformFactory.createPlatform(300, 400));
        this.#platforms.push(platformFactory.createPlatform(500, 400));
        this.#platforms.push(platformFactory.createPlatform(700, 400));
        this.#platforms.push(platformFactory.createPlatform(900, 400));

        this.#platforms.push(platformFactory.createPlatform(300, 550));

        this.#platforms.push(platformFactory.createBox(0, 738));
        this.#platforms.push(platformFactory.createBox(200, 738));

        const box = platformFactory.createBox(400, 708);
        box.isStep = true;
        this.#platforms.push(box);

        this.keyboardProcessor = new KeyboardProcessor(this);
        this.setKeys();
    }

    update(){

        const prevPoint = {
            x:this.#hero.x,
            y:this.#hero.y
        };
        
        this.#hero.update();
        for (let i = 0; i < this.#platforms.length; i++) {

            if(this.#hero.isJumpState() && this.#platforms[i].type != "box"){
                continue;
            }
            const collisionResult = this.getPlatformCollisionResult(this.#hero, this.#platforms[i], prevPoint)
            if (collisionResult.vertical == true) {
                this.#hero.stay(this.#platforms[i].y);
            }
        }

    }

    getPlatformCollisionResult(character, platform, prevPoint){
        const collisionResult = this.getOrientCollisionResult(character.getRect(), platform, prevPoint)

        if (collisionResult.vertical == true){
            character.y = prevPoint.y;
        }
        if (collisionResult.horizontal == true && platform.type == "box"){
            if (platform.isStep){
                character.stay(platform.y);
            }
            character.x = prevPoint.x;
        }
        return collisionResult;
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
        this.keyboardProcessor.getButton("KeyS").executeDown = function(){
            if(this.keyboardProcessor.isButtonPressed("ArrowDown")){
                this.#hero.throwDown(); 
            }
            else{
               this.#hero.jump(); 
            }
            
        };
        this.keyboardProcessor.getButton("ArrowLeft").executeDown = function(){
            this.#hero.startLeftMove();
        };
        this.keyboardProcessor.getButton("ArrowLeft").executeUp = function(){
            this.#hero.stopLeftMove();
        };
        this.keyboardProcessor.getButton("ArrowRight").executeDown = function(){
            this.#hero.startRightMove();
        };
        this.keyboardProcessor.getButton("ArrowRight").executeUp = function(){
            this.#hero.stopRightMove();
        };
    }

}