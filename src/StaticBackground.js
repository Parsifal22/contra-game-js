import { Container, Graphics} from "../lib/pixi.mjs";

export default class StaticBackground extends Container{
    constructor(screenSize, assets){
        super();

        for (let i=0; i<300; i++) {
            const star = this.#createStar();
            star.x = Math.random() * screenSize.width;
            star.y = Math.random() * screenSize.height;
        }

    }

    #createStar() {
        const star = new Graphics();
        star.beginFill(0xdddddd);
        star.drawRect(0,0,2,2);
        this.addChild(star);

        return star;
    }
}