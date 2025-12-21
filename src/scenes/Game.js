/*
 * Asset from: https://kenney.nl/assets/pixel-platformer
 *
 */
import ASSETS from "../assets.js";
import ANIMATION from "../animation.js";
import { MapManager } from "../managers/MapManager.js";
import { MAP_CONST } from "../const/MapConst.js";
import { GAME_CONST } from "../const/GameConst.js";
import assets from "../assets.js";

export class Game extends Phaser.Scene {
    constructor() {
        super("Game");
    }

    create() {
        this.cameras.main.setBackgroundColor(0x00ff00);

        this.initAnimations();
        this.initPlayer();
        this.initInput();
        this.initMaps();
        this.initCameras();
    }

    update() {
        if (!this.gameStarted) return;
    }

    initAnimations() {
        this.anims.create({
            key: ANIMATION.bat.key,
            frames: this.anims.generateFrameNumbers(ANIMATION.bat.texture),
            frameRate: ANIMATION.bat.frameRate,
            repeat: ANIMATION.bat.repeat,
        });
    }

    /**
     * プレイヤー初期化
     */
    initPlayer() {
        this.player = this.physics.add
            .sprite(
                20 * MAP_CONST.CELL_SIZE + MAP_CONST.CELL_SIZE / 2,
                25 * MAP_CONST.CELL_SIZE + MAP_CONST.CELL_SIZE / 2,
                ASSETS.spritesheet.bat.key
            )
            .setDepth(100)
            .setCollideWorldBounds(true);
        this.player.anims.play(ANIMATION.bat.key, true);
    }

    initInput() {
        this.input.once("pointerdown", () => {
            this.startGame();
        });
    }

    /**
     * マップ初期化
     */
    initMaps() {
        // マップマネージャーの生成
        this.mapManager = new MapManager(this);
        // マップの初期化
        this.mapManager.initMap(
            MAP_CONST.MAP_SEASIDE_KEY,
            ASSETS.spritesheet.sheet_seaside.key
        );
    }

    /**
     * カメラ初期化
     */
    initCameras() {
        // メインカメラをプレイヤーに追従させる
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    }

    startGame() {
        this.gameStarted = true;
        this.physics.resume();
        this.input.on("pointerdown", () => {});
        // DEBUG 釣りゲームUIを表示
        this.scene.pause("Game");
        this.scene.launch("Fishing", { fishName: "fish_funa" });
    }

    GameOver() {
        this.time.delayedCall(2000, () => {
            this.scene.start("GameOver");
        });
    }
}
