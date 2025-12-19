import { Boot } from "./scenes/Boot.js";
import { Game } from "./scenes/Game.js";
import { GameOver } from "./scenes/GameOver.js";
import { Preloader } from "./scenes/Preloader.js";
import { COMMON_CONST } from "./const/CommonConst.js";

const config = {
    type: Phaser.AUTO,
    width: COMMON_CONST.SCREEN_WIDTH,
    height: COMMON_CONST.SCREEN_HEIGHT,
    parent: "game-container",
    backgroundColor: "#028af8",
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
            gravity: { y: 400 },
        },
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [Boot, Preloader, Game, GameOver],
};

new Phaser.Game(config);
