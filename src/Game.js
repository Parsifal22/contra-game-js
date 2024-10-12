import { Container } from "../lib/pixi.mjs";
import Camera from "./Camera.js";
import BulletFactory from "./Entities/Bullets/BulletFactory.js";
import RunnerFactory from "./Entities/Enemies/Runner/RunnerFactory.js";
import HeroFactory from "./Entities/Hero/HeroFactory.js";
import PlatformFactory from "./Entities/Platforms/PlatformFactory.js";
import KeyboardProcessor from "./KeyboardProcessor.js";
import Physics from "./Physics.js";

export default class Game {

    #pixiApp;
    #hero;
    #platforms = [];
    #entities = [];
    #camera;

    #bulletFactory;
    #runnerFactory;

    #worldContainer
    keyboardProcessor;


    constructor(pixiApp) {
        this.#pixiApp = pixiApp;

        this.#worldContainer = new Container();
        this.#pixiApp.stage.addChild(this.#worldContainer);

        const heroFactory = new HeroFactory(this.#worldContainer);
        this.#hero = heroFactory.createHero(100, 100);

        this.#entities.push(this.#hero);
        const platformFactory = new PlatformFactory(this.#worldContainer);

        this.#platforms.push(platformFactory.createPlatform(100, 400));
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

        this.#bulletFactory = new BulletFactory(this.#worldContainer, this.#entities);

        this.#runnerFactory = new RunnerFactory(this.#worldContainer);
        this.#entities.push(this.#runnerFactory.createRunner(800, 100));
        this.#entities.push(this.#runnerFactory.createRunner(850, 100));
        this.#entities.push(this.#runnerFactory.createRunner(900, 100));

    }

    update() {
        for(let i = 0; i < this.#entities.length; i++) {
            const entity = this.#entities[i];
            entity.update();

            if (entity.type == "hero" || entity.type == "characterEnemy"){
                this.#checkDamage(entity);
                this.#checkPlatforms(entity);
            }

            this.#checkEntityStatus(entity, i);
        }

        this.#camera.update();
    }

    #checkDamage(entity){
        const damagers = this.#entities.filter(damager => (entity.type == "characterEnemy" && damager.type == "heroBullet")
                                                       ||(entity.type == "hero" && (damager.type == "enemyBullet" || damager.type == "characterEnemy")));

        for (let damager of damagers) {
            if (Physics.isCheckAABB(damager.collisionBox, entity.collisionBox)) {
                entity.dead();
                if (damager.type != "characterEnemy"){
                    damager.dead();
                }

                break;
            }
        }
    }

    #checkPlatforms(character) {
        if (character.isDead) {
            return;
        }

        for (let platform  of this.#platforms) {
            if (character.isJumpState() && platform.type != "box") {
                continue;
            }
            this.checkPlatformCollision(character, platform);
        }
    }

    checkPlatformCollision(character, platform) {

        const prevPoint = character.prevPoint;

        const collisionResult = Physics.getOrientCollisionResult(character.collisionBox, platform, prevPoint)

        if (collisionResult.vertical == true) {
            character.y = prevPoint.y;
            character.stay(platform.y);
        }
        if (collisionResult.horizontal == true && platform.type == "box") {
            if (platform.isStep) {
                character.stay(platform.y);

            }
            else {
                character.x = prevPoint.x;
            }

        }
    }

    setKeys() {

        this.keyboardProcessor.getButton("KeyA").executeDown = function () {
            this.#bulletFactory.createBullet(this.#hero.bulletContext);
        }

        this.keyboardProcessor.getButton("KeyS").executeDown = function () {
            if (this.keyboardProcessor.isButtonPressed("ArrowDown")
                && !(this.keyboardProcessor.isButtonPressed("ArrowRight") || this.keyboardProcessor.isButtonPressed("ArrowLeft"))) {
                this.#hero.throwDown();
            }
            else {
                this.#hero.jump();
            }

        };

        const arrowLeft = this.keyboardProcessor.getButton("ArrowLeft");
        arrowLeft.executeDown = function () {
            this.#hero.startLeftMove();
            this.#hero.setView(this.getArrowButtonContext());
        };
        arrowLeft.executeUp = function () {
            this.#hero.stopLeftMove();
            this.#hero.setView(this.getArrowButtonContext());
        };

        const arrowRight = this.keyboardProcessor.getButton("ArrowRight");
        arrowRight.executeDown = function () {
            this.#hero.startRightMove();
            this.#hero.setView(this.getArrowButtonContext());
        };
        arrowRight.executeUp = function () {
            this.#hero.stopRightMove();
            this.#hero.setView(this.getArrowButtonContext());
        };

        const arrowUp = this.keyboardProcessor.getButton("ArrowUp");
        arrowUp.executeDown = function () {
            this.#hero.setView(this.getArrowButtonContext());
        };
        arrowUp.executeUp = function () {
            this.#hero.setView(this.getArrowButtonContext());
        };

        const arrowDown = this.keyboardProcessor.getButton("ArrowDown");
        arrowDown.executeDown = function () {
            this.#hero.setView(this.getArrowButtonContext());
        };
        arrowDown.executeUp = function () {
            this.#hero.setView(this.getArrowButtonContext());
        };
    }

    getArrowButtonContext() {
        const buttonContext = {};
        buttonContext.arrowLeft = this.keyboardProcessor.isButtonPressed("ArrowLeft");
        buttonContext.arrowRight = this.keyboardProcessor.isButtonPressed("ArrowRight");
        buttonContext.arrowUp = this.keyboardProcessor.isButtonPressed("ArrowUp");
        buttonContext.arrowDown = this.keyboardProcessor.isButtonPressed("ArrowDown");
        return buttonContext;
    }

    #checkEntityStatus(entity, index) {
        if(entity.isDead || this.#isScreenOut(entity)){
            entity.removeFromStage();
            this.#entities.splice(index, 1);
        }
    }

    #isScreenOut(entity) {
        return (entity.x > (this.#pixiApp.screen.width - this.#worldContainer.x)
                || entity.y > this.#pixiApp.screen.height
                || entity.x < (-this.#worldContainer.x)
                || entity.y < 0)
    }

}