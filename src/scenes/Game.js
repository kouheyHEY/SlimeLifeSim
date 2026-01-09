/*
 * Asset from: https://kenney.nl/assets/pixel-platformer
 *
 */
import ASSETS from "../assets.js";
import ANIMATION from "../animation.js";
import { MapManager } from "../managers/MapManager.js";
import { InventoryManager } from "../managers/InventoryManager.js";
import { LetterManager } from "../managers/LetterManager.js";
import { GameTimeManager } from "../managers/GameTimeManager.js";
import { TopBarUI } from "../ui/TopBarUI.js";
import { MAP_CONST } from "../const/MapConst.js";
import { GAME_CONST } from "../const/GameConst.js";
import { UI_CONST } from "../const/UIConst.js";
import assets from "../assets.js";
import { TimeOfDayManager } from "../managers/TimeOfDayManager.js";
import {
    FONT_NAME,
    getCurrentLanguage,
    getLocalizedText,
} from "../const/CommonConst.js";

export class Game extends Phaser.Scene {
    constructor() {
        super("Game");
    }

    create() {
        this.cameras.main.setBackgroundColor(
            MAP_CONST.INITIAL_BACKGROUND_COLOR
        );

        this.initCameras();
        this.initAnimations();
        this.initMaps();
        this.initPlayer();
        this.initInput();
        this.initEvents();
        this.initInventory();
        this.initLetter();
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

            // 背景色用の細かい時間帯が変わったかチェック
            if (this.gameTimeManager.hasBackgroundTimeChanged()) {
                this.timeOfDayManager.updateBackgroundColor();
            }

            // ステータス管理用の時間帯が変わったかチェック
            this.gameTimeManager.hasTimeOfDayChanged();
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

        this.anims.create({
            key: ANIMATION.slime_anim_bounce.key,
            frames: this.anims.generateFrameNumbers(
                ANIMATION.slime_anim_bounce.texture
            ),
            frameRate: ANIMATION.slime_anim_bounce.frameRate,
            repeat: ANIMATION.slime_anim_bounce.repeat,
        });

        this.anims.create({
            key: ANIMATION.slime_anim_wink.key,
            frames: this.anims.generateFrameNumbers(
                ANIMATION.slime_anim_wink.texture
            ),
            frameRate: ANIMATION.slime_anim_wink.frameRate,
            repeat: ANIMATION.slime_anim_wink.repeat,
        });
    }

    /**
     * プレイヤー初期化
     */
    initPlayer() {
        this.player = this.physics.add
            .sprite(
                MAP_CONST.PLAYER_START_POSITION.x * MAP_CONST.CELL_SIZE,
                MAP_CONST.PLAYER_START_POSITION.y * MAP_CONST.CELL_SIZE,
                ASSETS.spritesheet.slime_anim_bounce.key
            )
            .setDepth(50)
            .setCollideWorldBounds(true);

        // メインカメラをプレイヤーに追従させる
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        // UIカメラから除外
        this.uiCamera.ignore(this.player);

        // プレイヤーとマップの当たり判定を設定
        this.mapManager.addCollision(this.player, MAP_CONST.LAYER_KEYS.BACK1);

        // スライムアニメーションの開始
        this.scheduleSlimeAnimation();
    }

    /**
     * スライムアニメーションをランダムにスケジュール
     */
    scheduleSlimeAnimation() {
        // アニメーション再生間隔をランダムに設定（2～5秒）
        const nextDelay = Phaser.Math.Between(2000, 5000);

        this.time.delayedCall(nextDelay, () => {
            // bounce と wink のアニメーションをランダムに選択
            const animations = [
                ANIMATION.slime_anim_bounce.key,
                ANIMATION.slime_anim_wink.key,
            ];
            const randomAnimation =
                animations[Phaser.Math.Between(0, animations.length - 1)];

            // アニメーションを再生
            this.player.anims.play(randomAnimation, true);

            // アニメーション終了後、次のアニメーションをスケジュール
            this.player.once("animationcomplete", () => {
                this.scheduleSlimeAnimation();
            });
        });
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

            // dataがundefinedの場合は早期リターン
            if (!data) {
                return;
            }

            if (data.from === "fishing" && data.success) {
                this.handleFishingSuccess(
                    data.fishName,
                    data.letterIndex,
                    data.letterCategory
                );
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

        // ステータス低下イベントを購読
        this.events.on("statusDecreaseTime", this.handleStatusDecrease, this);
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
     * 手紙管理初期化
     */
    initLetter() {
        this.letterManager = new LetterManager(this);
    }

    /**
     * ゲーム時間初期化
     */
    initGameTime() {
        this.gameTimeManager = new GameTimeManager(this);
        this.timeOfDayManager = new TimeOfDayManager(
            this,
            this.gameTimeManager
        );

        // トップバーUIを作成（ゲーム情報とインベントリを統合）
        this.topBarUI = new TopBarUI(
            this,
            this.gameTimeManager,
            this.inventoryManager
        );

        // 初期表示のためにUIを更新
        this.topBarUI.update();

        // 初期時間帯の背景色を設定
        this.timeOfDayManager.updateBackgroundColor();
    }

    /**
     * 釣り成功時の処理
     */
    handleFishingSuccess(fishName, letterIndex, letterCategory) {
        console.log(`釣り成功: ${fishName}`);
        // メッセージボトルの場合はインベントリに追加しない
        if (fishName === GAME_CONST.FISH_NAME.BOTTLE_LETTER) {
            // 手紙を読んだことを記録
            if (letterIndex !== undefined && letterCategory) {
                this.letterManager.markLetterAsRead(
                    letterCategory,
                    letterIndex
                );
                // UIを更新（手紙ボタンの表示）
                this.topBarUI.updateLetterButton();
            }
        } else {
            // ここに釣り成功時の処理を追加
            this.inventoryManager.addItem(
                fishName,
                GAME_CONST.FISH_DISPLAY_NAME[fishName],
                1
            );
            // インベントリUIの更新
            this.topBarUI.updateInventory();
        }
    }

    /**
     * 魚ヒットインジケーターを表示
     */
    showFishHitIndicator() {
        if (this.fishHitIndicator) {
            this.fishHitIndicator.setVisible(true);
            if (this.fishHitText) {
                this.fishHitText.setVisible(true);
            }
            return;
        }

        // プレイヤーの上に釣りアイコンを表示（一旦仮配置）
        this.fishHitIndicator = this.add
            .image(0, 0, assets.image.rod.key)
            .setOrigin(0.5, 0.5)
            .setScale(0.5);

        // UIカメラから除外（プレイヤーと一緒に動く）
        this.uiCamera.ignore(this.fishHitIndicator);

        // アイコンの右に「Hit!!」テキストを表示（一旦仮配置）
        this.fishHitText = this.add
            .text(0, 0, getLocalizedText(UI_CONST.FISH_HIT_TEXT), {
                fontFamily: FONT_NAME.MELONANO,
                fontSize: `${UI_CONST.FISH_HIT_TEXT_FONT_SIZE}px`,
                color: UI_CONST.FISH_HIT_TEXT_COLOR,
                stroke: UI_CONST.FISH_HIT_TEXT_STROKE_COLOR,
                strokeThickness: UI_CONST.FISH_HIT_TEXT_STROKE_THICKNESS,
            })
            .setOrigin(0, 0.5);

        // UIカメラから除外（プレイヤーと一緒に動く）
        this.uiCamera.ignore(this.fishHitText);

        // アイコンとテキストの合計幅を計算して中央配置
        const iconWidth = this.fishHitIndicator.displayWidth;
        const textWidth = this.fishHitText.width;
        const totalWidth =
            iconWidth + UI_CONST.FISH_HIT_TEXT_OFFSET_X + textWidth;
        const startX = this.player.x - totalWidth / 2;

        this.fishHitIndicator.setPosition(
            startX + iconWidth / 2,
            this.player.y - 120
        );
        this.fishHitText.setPosition(
            startX + iconWidth + UI_CONST.FISH_HIT_TEXT_OFFSET_X,
            this.player.y - 120
        );

        // 点滅アニメーションを追加
        this.tweens.add({
            targets: [this.fishHitIndicator, this.fishHitText],
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
        if (this.fishHitText) {
            this.fishHitText.setVisible(false);
        }
    }

    /**
     * 魚ヒットインジケーターの位置を更新
     */
    updateFishHitIndicator() {
        if (this.fishHitIndicator && this.fishHitIndicator.visible) {
            // アイコンとテキストの合計幅を計算して中央配置
            const iconWidth = this.fishHitIndicator.displayWidth;
            const textWidth = this.fishHitText ? this.fishHitText.width : 0;
            const totalWidth =
                iconWidth + UI_CONST.FISH_HIT_TEXT_OFFSET_X + textWidth;
            const startX = this.player.x - totalWidth / 2;

            this.fishHitIndicator.setPosition(
                startX + iconWidth / 2,
                this.player.y - 120
            );

            if (this.fishHitText && this.fishHitText.visible) {
                this.fishHitText.setPosition(
                    startX + iconWidth + UI_CONST.FISH_HIT_TEXT_OFFSET_X,
                    this.player.y - 120
                );
            }
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
        // 魚ヒットシステムを停止（釣り中や手紙読み中に重複しないように）
        this.gameTimeManager.pauseFishSystem();
        // 確率をもとに対象を選択（重み付けランダム）
        const target = this.selectFishByWeight();
        // メッセージボトルの場合は次の手紙のインデックスを渡す
        const params = { fishName: target };
        if (target === GAME_CONST.FISH_NAME.BOTTLE_LETTER) {
            // 現在はstory_planetのみ、将来的には確率で選択するなど
            const letterCategory = "story_planet";
            params.letterIndex =
                this.letterManager.getNextLetterIndex(letterCategory);
            params.letterCategory = letterCategory;
        }
        this.scene.launch("Fishing", params);
    }

    /**
     * 重み付けランダム選択で魚またはボトルを選択
     * @returns {string} 選択された魚またはボトルの名前
     */
    selectFishByWeight() {
        const weights = { ...GAME_CONST.FISH_WEIGHT };

        // 未読の手紙がない場合はメッセージボトルを除外
        if (!this.letterManager.hasAnyUnreadLetters(this)) {
            delete weights[GAME_CONST.FISH_NAME.BOTTLE_LETTER];
        }

        const targets = Object.keys(weights);

        // 総重みを計算
        const totalWeight = targets.reduce(
            (sum, target) => sum + weights[target],
            0
        );

        // ランダムな値を生成（0～totalWeight）
        let random = Phaser.Math.Between(1, totalWeight);

        // 累積重みで対象を選択
        for (const target of targets) {
            random -= weights[target];
            if (random <= 0) {
                return target;
            }
        }

        // フォールバック（通常は到達しない）
        return targets[0];
    }

    /**
     * ステータス低下処理
     */
    handleStatusDecrease() {
        console.log("handleStatusDecreaseが呼ばれました");
        const canDecrease = this.topBarUI.gameInfoUI.decreasePlayerStatus();
        console.log(`ステータス低下結果: ${canDecrease}`);

        if (!canDecrease) {
            // これ以上下がらない（status_bad）
            // 魚があるか確認
            const fishItems = this.inventoryManager.items.filter(
                (item) => item.itemKey && item.itemKey.startsWith("fish_")
            );

            if (fishItems.length > 0) {
                // 魚がある場合は選択モーダルを表示
                this.topBarUI.inventoryUI.showFishSelectionModal(() => {
                    // 魚を食べた後の処理
                    console.log("魚を食べて体力回復");
                });
            } else {
                // 魚がない場合はゲームオーバー
                this.triggerGameOver();
            }
        }
    }

    /**
     * ゲームオーバー処理
     */
    triggerGameOver() {
        console.log("ゲームオーバー: 体力が尽きました");
        // ゲーム時間を停止
        this.gameTimeManager.pause();
        this.gameTimeManager.pauseFishSystem();

        // ゲームオーバーシーンへ移行
        this.scene.start("GameOver");
    }

    GameOver() {
        this.time.delayedCall(2000, () => {
            this.scene.start("GameOver");
        });
    }
}
