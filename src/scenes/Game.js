/*
 * Asset from: https://kenney.nl/assets/pixel-platformer
 *
 */
import ASSETS from "../assets.js";
import ANIMATION from "../animation.js";
import { MapManager } from "../managers/MapManager.js";
import { InventoryManager } from "../managers/InventoryManager.js";
import { InventoryUI } from "../ui/InventoryUI.js";
import { MAP_CONST } from "../const/MapConst.js";
import { GAME_CONST } from "../const/GameConst.js";
import { UI_CONST } from "../const/UIConst.js";
import assets from "../assets.js";

export class Game extends Phaser.Scene {
    constructor() {
        super("Game");
    }

    create() {
        this.cameras.main.setBackgroundColor(0x00ff00);

        this.initCameras();
        this.initAnimations();
        this.initPlayer();
        this.initInput();
        this.initMaps();
        this.initEvents();
        this.initInventory();

        // タイトルシーンを前面に表示
        // まず描画を1フレーム待ってから、ゲームシーンを一時停止してタイトルを表示
        this.time.delayedCall(UI_CONST.TITLE_SCENE_LAUNCH_DELAY, () => {
            this.scene.launch("Title");
            this.scene.pause("Game");
        });
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

        // メインカメラをプレイヤーに追従させる
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        // UIカメラから除外
        this.uiCamera.ignore(this.player);
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
     * イベント初期化
     */
    initEvents() {
        // シーン再開時の処理
        this.events.on("resume", (scene, data) => {
            if (data.from === "fishing" && data.success) {
                this.handleFishingSuccess(data.fishName);
            }
        });
    }

    /**
     * インベントリ初期化
     */
    initInventory() {
        this.inventoryManager = new InventoryManager(
            this,
            GAME_CONST.INVENTORY_SIZE
        );
        this.inventoryUI = new InventoryUI(this, this.inventoryManager);
    }

    /**
     * カメラ初期化
     */
    initCameras() {
        // UIカメラの作成
        this.uiCamera = this.cameras.add(
            0,
            0,
            this.sys.game.config.width,
            this.sys.game.config.height
        );
        this.uiCamera.setScroll(0, 0);
    }

    /**
     * 釣り成功時の処理
     */
    handleFishingSuccess(fishName) {
        console.log(`釣り成功: ${fishName}`);
        // ここに釣り成功時の処理を追加
        this.inventoryManager.addItem(
            fishName,
            GAME_CONST.FISH_DISPLAY_NAME[fishName],
            1
        );
        // インベントリUIの更新
        this.inventoryUI.update();
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
