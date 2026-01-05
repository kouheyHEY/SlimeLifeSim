/*
 * Asset from: https://kenney.nl/assets/pixel-platformer
 *
 */
import ASSETS from "../assets.js";
import ANIMATION from "../animation.js";
import { MapManager } from "../managers/MapManager.js";
import { InventoryManager } from "../managers/InventoryManager.js";
import { GameTimeManager } from "../managers/GameTimeManager.js";
import { TopBarUI } from "../ui/TopBarUI.js";
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
        this.initGameTime();

        // ゲーム開始前はゲーム時間を一時停止
        this.gameTimeManager.pause();

        // タイトルシーンを前面に表示
        // まず描画を1フレーム待ってから、ゲームシーンを一時停止してタイトルを表示
        this.time.delayedCall(UI_CONST.TITLE_SCENE_LAUNCH_DELAY, () => {
            this.scene.launch("Title");
            this.scene.pause("Game");
        });
    }

    update() {
        // ゲーム時間とUIの更新（シーンが動いている時のみ）
        if (this.topBarUI) {
            this.gameTimeManager.update();
            this.topBarUI.update();
        }
        console.log(this.gameTimeManager.isPausedFlag);

        if (!this.gameStarted) return;

        // 魚ヒットインジケーターの位置を更新
        this.updateFishHitIndicator();
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
            // ゲーム時間を再開
            this.gameTimeManager.resume();

            if (data.from === "fishing" && data.success) {
                this.handleFishingSuccess(data.fishName);
            }
            // 釣りゲームから戻ってきた時、魚ヒットシステムを再開
            if (data.from === "fishing") {
                this.gameTimeManager.resumeFishSystem();
            }
        });

        // 魚ヒットイベントの購読
        this.events.on("fishHit", (isActive) => {
            if (isActive) {
                this.showFishHitIndicator();
            } else {
                this.hideFishHitIndicator();
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
        // インベントリUIはトップバーUIで初期化されるため、ここでは作成しない
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
     * ゲーム時間初期化
     */
    initGameTime() {
        this.gameTimeManager = new GameTimeManager(this);

        // トップバーUIを作成（ゲーム情報とインベントリを統合）
        this.topBarUI = new TopBarUI(
            this,
            this.gameTimeManager,
            this.inventoryManager
        );

        // 初期表示のためにUIを更新
        this.topBarUI.update();
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
        this.topBarUI.updateInventory();
    }

    /**
     * 魚ヒットインジケーターを表示
     */
    showFishHitIndicator() {
        if (this.fishHitIndicator) {
            this.fishHitIndicator.setVisible(true);
            return;
        }

        // プレイヤーの上に釣りアイコンを表示
        this.fishHitIndicator = this.add
            .text(0, -40, "🎣", {
                fontSize: "32px",
                align: "center",
            })
            .setOrigin(0.5, 0.5);

        // UIカメラから除外（プレイヤーと一緒に動く）
        this.uiCamera.ignore(this.fishHitIndicator);

        // 点滅アニメーションを追加
        this.tweens.add({
            targets: this.fishHitIndicator,
            alpha: 0.3,
            duration: 500,
            yoyo: true,
            repeat: -1,
        });
    }

    /**
     * 魚ヒットインジケーターを非表示
     */
    hideFishHitIndicator() {
        if (this.fishHitIndicator) {
            this.fishHitIndicator.setVisible(false);
        }
    }

    /**
     * 魚ヒットインジケーターの位置を更新
     */
    updateFishHitIndicator() {
        if (this.fishHitIndicator && this.fishHitIndicator.visible) {
            this.fishHitIndicator.setPosition(
                this.player.x,
                this.player.y - 40
            );
        }
    }

    startGame() {
        this.gameStarted = true;
        this.physics.resume();
        // 画面タップ時の処理を設定
        this.input.on("pointerdown", () => {
            // 魚がヒットしている場合のみ釣りゲームを開始
            if (this.gameTimeManager.isFishHitActive()) {
                this.startFishing();
            }
        });
    }

    /**
     * 釣りゲームを開始
     */
    startFishing() {
        console.log("釣りゲーム開始");
        this.scene.pause("Game");
        // ゲーム時間を一時停止
        this.gameTimeManager.pause();
        // ランダムに魚の種類を選択
        const fishNames = Object.values(GAME_CONST.FISH_NAME);
        const randomFish = Phaser.Utils.Array.GetRandom(fishNames);
        this.scene.launch("Fishing", { fishName: randomFish });
    }

    GameOver() {
        this.time.delayedCall(2000, () => {
            this.scene.start("GameOver");
        });
    }
}
