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
import { UpgradeManager } from "../managers/UpgradeManager.js";
import { SettingsManager } from "../managers/SettingsManager.js";
import { TopBarUI } from "../ui/TopBarUI.js";
import { SidebarUI } from "../ui/SidebarUI.js";
import { MAP_CONST } from "../const/MapConst.js";
import { GAME_CONST } from "../const/GameConst.js";
import { UI_CONST, UI_TEXT } from "../const/UIConst.js";
import {
    FONT_NAME,
    getCurrentLanguage,
    getLocalizedText,
    COMMON_CONST,
} from "../const/CommonConst.js";
import assets from "../assets.js";
import { TimeOfDayManager } from "../managers/TimeOfDayManager.js";

/**
 * メインゲームシーン
 * プレイヤーの操作、釣り、インベントリ、時間経過などを管理
 */
export class Game extends Phaser.Scene {
    constructor() {
        super("Game");
    }

    /**
     * シーンの初期化
     * 各種マネージャーとUIの初期化
     */
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
        this.initUpgradesAndSettings();

        // ゲーム開始前はゲーム時間を一時停止
        this.gameTimeManager.pause();

        // タイトルシーンを前面に表示
        // まず描画を1フレーム待ってから、ゲームシーンを一時停止してタイトルを表示
        this.time.delayedCall(UI_CONST.TITLE_SCENE_LAUNCH_DELAY, () => {
            this.scene.launch("Title");
            this.scene.pause("Game");
        });
    }

    /**
     * フレームごとの更新処理
     * ゲーム時間、UI、魚ヒットインジケーターの更新
     */
    update() {
        // ゲーム時間とUIの更新（シーンが動いている時のみ）
        if (this.topBarUI && this.sidebarUI) {
            this.gameTimeManager.update();
            this.topBarUI.update();
            this.sidebarUI.update();

            // 背景色用の細かい時間帯が変わったかチェック
            if (
                this.settingsManager.isBackgroundColorChangeEnabled() &&
                this.gameTimeManager.hasBackgroundTimeChanged()
            ) {
                this.timeOfDayManager.updateBackgroundColor();
            }

            // ステータス管理用の時間帯が変わったかチェック
            if (this.settingsManager.isStatusChangeEnabled()) {
                this.gameTimeManager.hasTimeOfDayChanged();
            }
        }

        if (!this.gameStarted) return;

        // 魚ヒットインジケーターの位置を更新
        this.updateFishHitIndicator();
    }

    /**
     * アニメーションの初期化
     * プレイヤーキャラクターのアニメーションを作成
     */
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
        // アニメーション再生間隔をランダムに設定
        const nextDelay = Phaser.Math.Between(
            UI_CONST.PLAYER_ANIMATION_DELAY_MIN,
            UI_CONST.PLAYER_ANIMATION_DELAY_MAX
        );

        this.time.delayedCall(nextDelay, () => {
            // 設定でアニメーションが無効化されている場合はスキップ
            if (!this.settingsManager.isPlayerAnimationEnabled()) {
                this.scheduleSlimeAnimation();
                return;
            }

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

    /**
     * 入力の初期化
     * クリック/タップでゲーム開始
     */
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

        // サイドバーUIを作成（ゲーム情報とインベントリを統合）
        this.sidebarUI = new SidebarUI(
            this,
            this.gameTimeManager,
            this.inventoryManager
        );

        // トップバーUIを作成（画面上部）- gameInfoUIを渡してステータスとコインを表示
        this.topBarUI = new TopBarUI(
            this,
            this.gameTimeManager,
            this.sidebarUI.gameInfoUI
        );

        // 初期表示のためにUIを更新
        this.topBarUI.update();
        this.sidebarUI.update();

        // 初期時間帯の背景色を設定
        this.timeOfDayManager.updateBackgroundColor();
    }

    /**
     * アップグレードと設定の初期化
     */
    initUpgradesAndSettings() {
        this.upgradeManager = new UpgradeManager(this);
        this.settingsManager = new SettingsManager(this);

        // アップグレードに基づいて自動釣り設定を同期
        if (this.upgradeManager.isAutoFishingEnabled()) {
            this.settingsManager.setAutoFishing(true);
        }
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
                this.sidebarUI.updateLetterButton();
            }
        } else {
            // ここに釣り成功時の処理を追加
            // アップグレードによる価値倍率を適用
            const valueMultiplier =
                this.upgradeManager.getFishValueMultiplier();
            const baseValue = GAME_CONST.ITEM_VALUE[fishName] || 0;
            const actualValue = Math.floor(baseValue * valueMultiplier);

            // コイン獲得（価値倍率適用後）
            this.sidebarUI.gameInfoUI.addCoins(actualValue);

            this.inventoryManager.addItem(
                fishName,
                GAME_CONST.FISH_DISPLAY_NAME[fishName],
                1
            );
            // インベントリUIの更新
            this.sidebarUI.updateInventory();
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
            this.player.y + UI_CONST.FISH_HIT_INDICATOR_Y_OFFSET
        );
        this.fishHitText.setPosition(
            startX + iconWidth + UI_CONST.FISH_HIT_TEXT_OFFSET_X,
            this.player.y + UI_CONST.FISH_HIT_INDICATOR_Y_OFFSET
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
                this.player.y + UI_CONST.FISH_HIT_INDICATOR_Y_OFFSET
            );

            if (this.fishHitText && this.fishHitText.visible) {
                this.fishHitText.setPosition(
                    startX + iconWidth + UI_CONST.FISH_HIT_TEXT_OFFSET_X,
                    this.player.y + UI_CONST.FISH_HIT_INDICATOR_Y_OFFSET
                );
            }
        }
    }

    startGame() {
        this.gameStarted = true;
        this.physics.resume();
        this.isPaused = false; // 一時停止中フラグを追加
        // 画面タップ時の処理を設定
        this.input.on("pointerdown", (pointer) => {
            // 一時停止中は何もしない
            if (this.isPaused) {
                return;
            }

            // UIエリアをクリックした場合は釣りゲームを発動しない
            if (this.isPointerOverUI(pointer)) {
                return;
            }

            // 魚がヒットしている場合のみ釣りゲームを開始
            if (this.gameTimeManager.isFishHitActive()) {
                this.startFishing();
            }
        });
    }

    /**
     * ポインターがUIエリア上にあるかチェック
     * @param {Phaser.Input.Pointer} pointer - ポインター
     * @returns {boolean} - UIエリア上の場合true
     */
    isPointerOverUI(pointer) {
        const x = pointer.x;
        const y = pointer.y;

        // トップバーエリア（上部）
        if (y < UI_CONST.TOP_BAR_HEIGHT) {
            return true;
        }

        // サイドバーエリア（右側）
        const sidebarX = COMMON_CONST.SCREEN_WIDTH - UI_CONST.SIDEBAR_WIDTH;
        if (x > sidebarX && y >= UI_CONST.TOP_BAR_HEIGHT) {
            return true;
        }

        return false;
    }

    /**
     * UIボタンを無効化
     */
    disableUIButtons() {
        if (this.topBarUI && this.topBarUI.pauseButton) {
            this.topBarUI.pauseButton.disableInteractive();
        }
        if (
            this.sidebarUI &&
            this.sidebarUI.gameInfoUI &&
            this.sidebarUI.gameInfoUI.upgradeButton
        ) {
            this.sidebarUI.gameInfoUI.upgradeButton.disableInteractive();
        }
    }

    /**
     * UIボタンを有効化
     */
    enableUIButtons() {
        if (this.topBarUI && this.topBarUI.pauseButton) {
            this.topBarUI.pauseButton.setInteractive({ useHandCursor: true });
        }
        if (
            this.sidebarUI &&
            this.sidebarUI.gameInfoUI &&
            this.sidebarUI.gameInfoUI.upgradeButton
        ) {
            this.sidebarUI.gameInfoUI.upgradeButton.setInteractive({
                useHandCursor: true,
            });
        }
    }

    /**
     * 釣りゲームを開始
     */
    startFishing() {
        console.log("釣りゲーム開始");

        // 自動釣りが有効な場合は即座に釣り上げ
        if (this.settingsManager.isAutoFishingEnabled()) {
            this.autoFishing();
            return;
        }

        this.scene.pause("Game");
        // ゲーム時間を一時停止
        this.gameTimeManager.pause();
        // 魚ヒットシステムを停止（釣り中や手紙読み中に重複しないように）
        this.gameTimeManager.pauseFishSystem();
        // 確率をもとに対象を選択（重み付けランダム）
        const target = this.selectFishByWeight();
        // メッセージボトルの場合は次の手紙のインデックスを渡す
        const params = {
            fishName: target,
            linePowerMultiplier: this.upgradeManager.getLinePowerMultiplier(),
        };
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
     * 自動釣り処理
     */
    autoFishing() {
        console.log("自動釣り実行");
        // 確率をもとに対象を選択（重み付けランダム）
        const target = this.selectFishByWeight();

        // 手紙の処理
        if (target === GAME_CONST.FISH_NAME.BOTTLE_LETTER) {
            const letterCategory = "story_planet";
            const letterIndex =
                this.letterManager.getNextLetterIndex(letterCategory);
            this.handleFishingSuccess(target, letterIndex, letterCategory);
        } else {
            this.handleFishingSuccess(target);
        }

        // 魚ヒットシステムを再開
        this.gameTimeManager.resumeFishSystem();
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
        const canDecrease = this.sidebarUI.gameInfoUI.decreasePlayerStatus();
        console.log(`ステータス低下結果: ${canDecrease}`);

        if (!canDecrease) {
            // これ以上下がらない（status_bad）
            // 魚があるか確認
            const fishItems = this.inventoryManager.items.filter(
                (item) => item.itemKey && item.itemKey.startsWith("fish_")
            );

            if (fishItems.length > 0) {
                // 魚がある場合は選択モーダルを表示
                this.sidebarUI.inventoryUI.showFishSelectionModal(() => {
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
        this.time.delayedCall(UI_CONST.GAME_OVER_DELAY, () => {
            this.scene.start("GameOver");
        });
    }

    /**
     * 一時停止モーダルを表示
     */
    showPauseModal() {
        // 一時停止中フラグを設定
        this.isPaused = true;

        // UIボタンを無効化
        this.disableUIButtons();

        // ゲーム時間を一時停止
        this.gameTimeManager.pause();

        // 背景オーバーレイ
        const overlay = this.add
            .rectangle(
                this.sys.game.config.width / 2,
                this.sys.game.config.height / 2,
                this.sys.game.config.width,
                this.sys.game.config.height,
                0x000000,
                0.7
            )
            .setOrigin(0.5, 0.5)
            .setScrollFactor(0)
            .setDepth(UI_CONST.OVERLAY_DEPTH);
        this.cameras.main.ignore(overlay);

        // モーダル用のシーンを作成（簡易実装）
        const pauseContainer = this.add.container(
            this.sys.game.config.width / 2,
            this.sys.game.config.height / 2
        );
        pauseContainer.setDepth(UI_CONST.MODAL_DEPTH);
        this.cameras.main.ignore(pauseContainer);

        // モーダル背景
        const modalBg = this.add
            .rectangle(
                0,
                0,
                UI_CONST.PAUSE_MODAL_WIDTH,
                UI_CONST.PAUSE_MODAL_HEIGHT,
                0x222222,
                0.95
            )
            .setStrokeStyle(4, 0xffffff);
        pauseContainer.add(modalBg);

        // タイトル
        const title = this.add
            .text(
                0,
                -UI_CONST.PAUSE_MODAL_HEIGHT / 2 + 40,
                getLocalizedText(UI_TEXT.PAUSE_MODAL.TITLE),
                {
                    fontFamily: FONT_NAME.MELONANO,
                    fontSize: "32px",
                    color: "#ffff00",
                }
            )
            .setOrigin(0.5);
        pauseContainer.add(title);

        let currentY = -UI_CONST.PAUSE_MODAL_HEIGHT / 2 + 100;
        const lineHeight = 50;

        // BGM音量スライダー（簡易版：クリックで切り替え）
        const bgmText = this.add
            .text(
                -UI_CONST.PAUSE_MODAL_WIDTH / 2 + 40,
                currentY,
                `${getLocalizedText(
                    UI_TEXT.PAUSE_MODAL.BGM_VOLUME
                )}: ${Math.round(this.settingsManager.getBgmVolume() * 100)}%`,
                {
                    fontFamily: FONT_NAME.MELONANO,
                    fontSize: "20px",
                    color: "#ffffff",
                }
            )
            .setOrigin(0, 0.5);
        pauseContainer.add(bgmText);
        currentY += lineHeight;

        // SE音量スライダー（簡易版）
        const seText = this.add
            .text(
                -UI_CONST.PAUSE_MODAL_WIDTH / 2 + 40,
                currentY,
                `${getLocalizedText(
                    UI_TEXT.PAUSE_MODAL.SE_VOLUME
                )}: ${Math.round(this.settingsManager.getSeVolume() * 100)}%`,
                {
                    fontFamily: FONT_NAME.MELONANO,
                    fontSize: "20px",
                    color: "#ffffff",
                }
            )
            .setOrigin(0, 0.5);
        pauseContainer.add(seText);
        currentY += lineHeight;

        // 背景色変化トグル
        const bgColorToggle = this.createToggle(
            pauseContainer,
            -UI_CONST.PAUSE_MODAL_WIDTH / 2 + 40,
            currentY,
            getLocalizedText(UI_TEXT.PAUSE_MODAL.BACKGROUND_COLOR),
            this.settingsManager.isBackgroundColorChangeEnabled(),
            (enabled) => {
                this.settingsManager.setBackgroundColorChange(enabled);
            }
        );
        currentY += lineHeight;

        // プレイヤーアニメーショントグル
        const animToggle = this.createToggle(
            pauseContainer,
            -UI_CONST.PAUSE_MODAL_WIDTH / 2 + 40,
            currentY,
            getLocalizedText(UI_TEXT.PAUSE_MODAL.PLAYER_ANIMATION),
            this.settingsManager.isPlayerAnimationEnabled(),
            (enabled) => {
                this.settingsManager.setPlayerAnimation(enabled);
            }
        );
        currentY += lineHeight;

        // ステータス変化トグル
        const statusToggle = this.createToggle(
            pauseContainer,
            -UI_CONST.PAUSE_MODAL_WIDTH / 2 + 40,
            currentY,
            getLocalizedText(UI_TEXT.PAUSE_MODAL.STATUS_CHANGE),
            this.settingsManager.isStatusChangeEnabled(),
            (enabled) => {
                this.settingsManager.setStatusChange(enabled);
            }
        );
        currentY += lineHeight;

        // 自動釣りトグル（アップグレードがある場合のみ）
        if (this.upgradeManager.isAutoFishingEnabled()) {
            const autoFishToggle = this.createToggle(
                pauseContainer,
                -UI_CONST.PAUSE_MODAL_WIDTH / 2 + 40,
                currentY,
                getLocalizedText(UI_TEXT.PAUSE_MODAL.AUTO_FISHING),
                this.settingsManager.isAutoFishingEnabled(),
                (enabled) => {
                    this.settingsManager.setAutoFishing(enabled);
                }
            );
            currentY += lineHeight;
        }

        // 再開ボタン
        const resumeButton = this.add
            .rectangle(
                0,
                UI_CONST.PAUSE_MODAL_HEIGHT / 2 - 60,
                150,
                50,
                0x00cc00
            )
            .setStrokeStyle(2, 0xffffff)
            .setInteractive({ useHandCursor: true });
        pauseContainer.add(resumeButton);

        const resumeText = this.add
            .text(
                0,
                UI_CONST.PAUSE_MODAL_HEIGHT / 2 - 60,
                getLocalizedText(UI_TEXT.PAUSE_MODAL.RESUME),
                {
                    fontFamily: FONT_NAME.MELONANO,
                    fontSize: "20px",
                    color: "#ffffff",
                }
            )
            .setOrigin(0.5);
        pauseContainer.add(resumeText);

        resumeButton.on("pointerdown", () => {
            // 一時停止中フラグをリセット
            this.isPaused = false;

            // UIボタンを有効化
            this.enableUIButtons();

            // ゲーム時間を再開
            this.gameTimeManager.resume();
            // オーバーレイとモーダルを削除
            overlay.destroy();
            pauseContainer.destroy();
        });

        this.pauseContainer = pauseContainer;
        this.pauseOverlay = overlay;
    }

    /**
     * トグルボタンを作成
     */
    createToggle(container, x, y, label, initialValue, callback) {
        const text = this.add
            .text(x, y, `${label}: ${initialValue ? "ON" : "OFF"}`, {
                fontFamily: FONT_NAME.MELONANO,
                fontSize: "20px",
                color: "#ffffff",
            })
            .setOrigin(0, 0.5)
            .setInteractive({ useHandCursor: true });
        container.add(text);

        let enabled = initialValue;
        text.on("pointerdown", () => {
            enabled = !enabled;
            text.setText(`${label}: ${enabled ? "ON" : "OFF"}`);
            callback(enabled);
        });

        return text;
    }

    /**
     * アップグレードモーダルを表示
     */
    showUpgradeModal() {
        // ゲーム時間を一時停止
        this.gameTimeManager.pause();

        // モーダル用のコンテナ
        const upgradeContainer = this.add.container(
            this.sys.game.config.width / 2,
            this.sys.game.config.height / 2
        );
        upgradeContainer.setDepth(UI_CONST.MODAL_DEPTH);
        this.cameras.main.ignore(upgradeContainer);

        // 背景オーバーレイ
        const overlay = this.add
            .rectangle(
                0,
                0,
                this.sys.game.config.width,
                this.sys.game.config.height,
                0x000000,
                0.7
            )
            .setOrigin(0.5, 0.5)
            .setScrollFactor(0);
        upgradeContainer.add(overlay);

        // モーダル背景
        const modalBg = this.add
            .rectangle(
                0,
                0,
                UI_CONST.UPGRADE_MODAL_WIDTH,
                UI_CONST.UPGRADE_MODAL_HEIGHT,
                0x222222,
                0.95
            )
            .setStrokeStyle(4, 0xffffff);
        upgradeContainer.add(modalBg);

        // タイトル
        const title = this.add
            .text(
                0,
                -UI_CONST.UPGRADE_MODAL_HEIGHT / 2 + 40,
                getLocalizedText(UI_TEXT.UPGRADE_MODAL.TITLE),
                {
                    fontFamily: FONT_NAME.MELONANO,
                    fontSize: "32px",
                    color: "#ffff00",
                }
            )
            .setOrigin(0.5);
        upgradeContainer.add(title);

        // コイン表示
        const coinsText = this.add
            .text(
                0,
                -UI_CONST.UPGRADE_MODAL_HEIGHT / 2 + 80,
                `${getLocalizedText({ JP: "所持コイン", EN: "Coins" })}: ${
                    this.sidebarUI.gameInfoUI.coins
                }`,
                {
                    fontFamily: FONT_NAME.MELONANO,
                    fontSize: "20px",
                    color: "#ffffff",
                }
            )
            .setOrigin(0.5);
        upgradeContainer.add(coinsText);

        let currentY = -UI_CONST.UPGRADE_MODAL_HEIGHT / 2 + 140;
        const lineHeight = 80;

        // アップグレードアイテムを作成
        const upgrades = [
            {
                key: "fishCatchRate",
                name: UI_TEXT.UPGRADE_MODAL.FISH_CATCH_RATE,
            },
            { key: "linePower", name: UI_TEXT.UPGRADE_MODAL.LINE_POWER },
            { key: "fishValue", name: UI_TEXT.UPGRADE_MODAL.FISH_VALUE },
            { key: "autoFishing", name: UI_TEXT.UPGRADE_MODAL.AUTO_FISHING },
        ];

        const upgradeElements = [];
        upgrades.forEach((upgrade, index) => {
            const element = this.createUpgradeItem(
                upgradeContainer,
                0,
                currentY,
                upgrade.key,
                upgrade.name,
                () => {
                    // アップグレード実行後、UI更新
                    coinsText.setText(
                        `${getLocalizedText({
                            JP: "所持コイン",
                            EN: "Coins",
                        })}: ${this.sidebarUI.gameInfoUI.coins}`
                    );
                    upgradeElements.forEach((el) => el.update());
                }
            );
            upgradeElements.push(element);
            currentY += lineHeight;
        });

        // 閉じるボタン
        const closeButton = this.add
            .rectangle(
                0,
                UI_CONST.UPGRADE_MODAL_HEIGHT / 2 - 60,
                150,
                50,
                0xcc0000
            )
            .setStrokeStyle(2, 0xffffff)
            .setInteractive({ useHandCursor: true });
        upgradeContainer.add(closeButton);

        const closeText = this.add
            .text(
                0,
                UI_CONST.UPGRADE_MODAL_HEIGHT / 2 - 60,
                getLocalizedText(UI_TEXT.UPGRADE_MODAL.CLOSE),
                {
                    fontFamily: FONT_NAME.MELONANO,
                    fontSize: "20px",
                    color: "#ffffff",
                }
            )
            .setOrigin(0.5);
        upgradeContainer.add(closeText);

        closeButton.on("pointerdown", () => {
            // ゲーム時間を再開
            this.gameTimeManager.resume();
            // モーダルを削除
            upgradeContainer.destroy();
        });

        this.upgradeContainer = upgradeContainer;
    }

    /**
     * アップグレードアイテムを作成
     */
    createUpgradeItem(container, x, y, upgradeKey, nameText, onUpgrade) {
        const itemContainer = this.add.container(x, y);
        container.add(itemContainer);

        const level = this.upgradeManager.getLevel(upgradeKey);
        const maxLevel = this.upgradeManager.getMaxLevel(upgradeKey);
        const cost = this.upgradeManager.getUpgradeCost(upgradeKey);
        const canUpgrade = this.upgradeManager.canUpgrade(upgradeKey);

        // 名前とレベル
        const nameLabel = this.add
            .text(
                -UI_CONST.UPGRADE_MODAL_WIDTH / 2 + 40,
                0,
                `${getLocalizedText(nameText)}`,
                {
                    fontFamily: FONT_NAME.MELONANO,
                    fontSize: "18px",
                    color: "#ffffff",
                }
            )
            .setOrigin(0, 0.5);
        itemContainer.add(nameLabel);

        const levelLabel = this.add
            .text(
                -UI_CONST.UPGRADE_MODAL_WIDTH / 2 + 40,
                25,
                canUpgrade
                    ? `${getLocalizedText(
                          UI_TEXT.UPGRADE_MODAL.LEVEL
                      )} ${level}/${maxLevel}`
                    : getLocalizedText(UI_TEXT.UPGRADE_MODAL.MAX_LEVEL),
                {
                    fontFamily: FONT_NAME.MELONANO,
                    fontSize: "16px",
                    color: "#aaaaaa",
                }
            )
            .setOrigin(0, 0.5);
        itemContainer.add(levelLabel);

        // アップグレードボタン
        if (canUpgrade) {
            const button = this.add
                .rectangle(
                    UI_CONST.UPGRADE_MODAL_WIDTH / 2 - 120,
                    0,
                    100,
                    40,
                    0x00cc00
                )
                .setStrokeStyle(2, 0xffffff)
                .setInteractive({ useHandCursor: true });
            itemContainer.add(button);

            const buttonText = this.add
                .text(UI_CONST.UPGRADE_MODAL_WIDTH / 2 - 120, 0, `${cost}`, {
                    fontFamily: FONT_NAME.MELONANO,
                    fontSize: "18px",
                    color: "#ffffff",
                })
                .setOrigin(0.5);
            itemContainer.add(buttonText);

            button.on("pointerdown", () => {
                const result = this.upgradeManager.upgrade(
                    upgradeKey,
                    this.sidebarUI.gameInfoUI.coins
                );
                if (result.success) {
                    this.sidebarUI.gameInfoUI.setCoins(result.newCoins);
                    // 自動釣りアップグレードの場合、設定を有効化
                    if (
                        upgradeKey === "autoFishing" &&
                        this.upgradeManager.isAutoFishingEnabled()
                    ) {
                        this.settingsManager.setAutoFishing(true);
                    }
                    onUpgrade();
                }
            });
        }

        return {
            update: () => {
                const newLevel = this.upgradeManager.getLevel(upgradeKey);
                const newMaxLevel = this.upgradeManager.getMaxLevel(upgradeKey);
                const newCost = this.upgradeManager.getUpgradeCost(upgradeKey);
                const newCanUpgrade =
                    this.upgradeManager.canUpgrade(upgradeKey);

                levelLabel.setText(
                    newCanUpgrade
                        ? `${getLocalizedText(
                              UI_TEXT.UPGRADE_MODAL.LEVEL
                          )} ${newLevel}/${newMaxLevel}`
                        : getLocalizedText(UI_TEXT.UPGRADE_MODAL.MAX_LEVEL)
                );

                // 既存のボタンとテキストを削除して再作成
                itemContainer.removeAll(true);
                itemContainer.add(nameLabel);
                itemContainer.add(levelLabel);

                if (newCanUpgrade) {
                    const button = this.add
                        .rectangle(
                            UI_CONST.UPGRADE_MODAL_WIDTH / 2 -
                                UI_CONST.UPGRADE_BUTTON_X_OFFSET,
                            0,
                            100,
                            40,
                            0x00cc00
                        )
                        .setStrokeStyle(2, 0xffffff)
                        .setInteractive({ useHandCursor: true });
                    itemContainer.add(button);

                    const buttonText = this.add
                        .text(
                            UI_CONST.UPGRADE_MODAL_WIDTH / 2 -
                                UI_CONST.UPGRADE_BUTTON_X_OFFSET,
                            0,
                            `${newCost}`,
                            {
                                fontFamily: FONT_NAME.MELONANO,
                                fontSize: "18px",
                                color: "#ffffff",
                            }
                        )
                        .setOrigin(0.5);
                    itemContainer.add(buttonText);

                    button.on("pointerdown", () => {
                        const result = this.upgradeManager.upgrade(
                            upgradeKey,
                            this.sidebarUI.gameInfoUI.coins
                        );
                        if (result.success) {
                            this.sidebarUI.gameInfoUI.setCoins(result.newCoins);
                            // 自動釣りアップグレードの場合、設定を有効化
                            if (
                                upgradeKey === "autoFishing" &&
                                this.upgradeManager.isAutoFishingEnabled()
                            ) {
                                this.settingsManager.setAutoFishing(true);
                            }
                            onUpgrade();
                        }
                    });
                }
            },
        };
    }
}
