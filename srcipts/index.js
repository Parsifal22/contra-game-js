import Game from "./Game.js"
import * as PIXI from "../lib/pixi.mjs"

const pixiApp = new PIXI.Application({
    width: 1024,
    height: 768,
});
const game = new Game(pixiApp);

document.body.appendChild(pixiApp.renderer.view);
document.addEventListener("keydown", function(key){
    game.keyboardProcessor.onKeyDown(key);
});
document.addEventListener("keyup", function(key){
    game.keyboardProcessor.onKeyUp(key);
});

pixiApp.ticker.add(game.update, game);
