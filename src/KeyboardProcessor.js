export default class KeyboardProcessor{

    #keyMap = {
        KeyS: {
            isDown:false
        },
        KeyA: {
            isDown:false
        },
        ArrowLeft: {
            isDown:false
        },
        ArrowRight: {
            isDown:false
        },
        ArrowUp: {
            isDown:false
        },
        ArrowDown: {
            isDown:false
        },
    }

    #gameContext;

    constructor(gameContex){
        this.#gameContext = gameContex;
    }

    getButton(keyName){
        return this.#keyMap[keyName];
    }

    onKeyDown(key){
        const button = this.#keyMap[key.code];

        if (button != undefined) {

            button.isDown = true;

            if (button.hasOwnProperty("executeDown")) {
                button.executeDown.call(this.#gameContext);
            }
            
        }
 
    }

    onKeyUp(key){
        const button = this.#keyMap[key.code];

        if (button != undefined) {

            button.isDown = false;

            if (button.hasOwnProperty("executeUp")) {
                button.executeUp.call(this.#gameContext);
            }
            button.isDown = false;
        }
    }

    isButtonPressed(keyName){
        return this.#keyMap[keyName].isDown;
    }
}