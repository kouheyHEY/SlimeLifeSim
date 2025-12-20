/*
 * Asset from: https://kenney.nl/assets/pixel-platformer
 *
 */
import ASSETS from "../assets.js";
import ANIMATION from "../animation.js";
import { MapManager } from "../managers/MapManager.js";
import { MAP_CONST } from "../const/MapConst.js";

export class Game extends Phaser.Scene {
    constructor() {
        super("Game");
    }

    create() {
        this.centreX = this.scale.width * 0.5;
        this.centreY = this.scale.height * 0.5;

        this.cameras.main.setBackgroundColor(0x00ff00);

        // Create tutorial text
        this.tutorialText = this.add
            .text(this.centreX, this.centreY, "Tap to fly!", {
                fontFamily: "Arial Black",
                fontSize: 42,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5);

        this.initAnimations();
        this.initPlayer();
        this.initInput();
        this.initPhysics();
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
        this.anims.create({
            key: ANIMATION.coin.key,
            frames: this.anims.generateFrameNumbers(ANIMATION.coin.texture),
            frameRate: ANIMATION.coin.frameRate,
            repeat: ANIMATION.coin.repeat,
        });
    }

    initPhysics() {
        this.obstacleGroup = this.add.group();
        this.coinGroup = this.add.group();

        this.physics.add.overlap(
            this.player,
            this.obstacleGroup,
            this.hitObstacle,
            null,
            this
        );
        this.physics.add.overlap(
            this.player,
            this.coinGroup,
            this.collectCoin,
            null,
            this
        );
    }

    initPlayer() {
        this.player = this.physics.add
            .sprite(
                20 * MAP_CONST.CELL_SIZE,
                25 * MAP_CONST.CELL_SIZE,
                ASSETS.spritesheet.bat.key
            )
            .setDepth(100)
            .setCollideWorldBounds(true);
        this.player.anims.play(ANIMATION.bat.key, true);
    }

    initInput() {
        this.physics.pause();
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
        this.input.on("pointerdown", () => {
            this.fly();
        });

        this.fly();
        this.tutorialText.setVisible(false);
    }

    fly() {
        this.player.setVelocityY(this.flyVelocity);
    }

    GameOver() {
        this.time.delayedCall(2000, () => {
            this.scene.start("GameOver");
        });
    }
}
