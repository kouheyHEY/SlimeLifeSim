import { Modal } from "../../core/ui/Modal.js";
import {
    getCurrentLanguage,
    FONT_NAME,
    STORAGE_KEY,
    COMMON_CONST,
} from "../const/CommonConst.js";
import { UI_CONST } from "../const/UIConst.js";
import { GAME_CONST } from "../const/GameConst.js";

/**
 * チュートリアルステップの定数
 */
export const TUTORIAL_STEP = {
    NOT_STARTED: 0,
    FISH_HIT: 1,
    CLICK_FISH: 2,
    SELL_FISH: 3,
    COMPLETED: 4,
    // コインチュートリアル
    FIRST_COIN_EARNED: 6,
    UPGRADE_ROD_EXPLANATION: 7,
    COIN_TUTORIAL_COMPLETED: 8,
};

/**
 * チュートリアル開始までの分数（ゲーム内時間）
 */
export const TUTORIAL_START_GAME_MINUTES = 1; // ゲーム開始から1分後

/**
 * モーダルサイズ定数
 */
const MODAL_SIZE = {
    SMALL: { width: 360, height: 100, msgSize: "28px" },
    LARGE: { width: 460, height: 460, msgSize: "26px" },
};

/**
 * チュートリアル遅延定数（ミリ秒）
 */
const TUTORIAL_DELAY = {
    COIN_TUTORIAL_START: 100, // コインチュートリアル開始までの遅延
};

/**
 * モーダル位置定数（各ステップごとに個別設定）
 * x: null = 画面中央, y: null = 画面中央
 * y: "top" = 画面上部, y: "bottom" = 画面下部
 * x/yは画面サイズに対する比率または固定値で指定可能
 */
const STEP_CONFIG = {
    // ステップ1: 魚ヒット
    STEP1: {
        x: null, // 画面中央
        y: "bottom", // 画面下部
        bottomMargin: 200, // 下マージン
    },
    // ステップ2: 魚をクリック
    STEP2: {
        x: null, // 画面中央
        y: null, // 画面中央
    },
    // ステップ3: 売るボタン
    STEP3: {
        x: null, // 画面中央
        y: "top", // 画面上部
        topMargin: 80, // 上マージン
    },
    // コインチュートリアルステップ1: コインを獲得
    COIN_STEP1: {
        x: null, // 画面中央
        y: null, // 画面中央
    },
    // コインチュートリアルステップ2: 釣り竿のアップグレード説明
    COIN_STEP2: {
        x: null, // 画面中央
        y: null, // 画面中央
    },
};

/**
 * チュートリアル文字列定数
 */
const TUTORIAL_TEXT = {
    // ステップ1: 魚ヒット
    STEP1: {
        JP: "魚がヒット！\nアイコンをタップ！",
        EN: "Fish hit!\nTap the icon!",
    },
    // ステップ2: 魚をクリック
    STEP2: {
        JP: "釣り成功！\n魚をタップ！",
        EN: "Caught it!\nTap the fish!",
    },
    // ステップ3: 売るボタン
    STEP3: {
        JP: "「売る」をタップ！",
        EN: "Tap 'Sell'!",
    },
    // コインチュートリアルステップ1: コイン獲得
    COIN_STEP1: {
        JP: "コインを獲得しました！\n\nコインを使って\n釣り竿を強化できます！",
        EN: "You earned coins!\n\nUse coins to upgrade\nyour fishing rod!",
    },
    // コインチュートリアルステップ2: アップグレード説明
    COIN_STEP2: {
        JP: "釣り竿を強化すると...\n\n\n・レアな魚が釣れやすくなる\n・魚のヒット持続時間が延びる\n\n釣竿の下のボタンで強化できます！",
        EN: "Upgrading your rod gives:\n\n・More rare fish\n・Longer fish hit duration\n\nUpgrade via the button below the rod!",
    },
    // OKボタン
    OK_BUTTON: "OK",
};

/**
 * モーダルスタイル定数
 */
const MODAL_STYLE = {
    // メッセージ
    MESSAGE_COLOR: "#ffffff",
    MESSAGE_STROKE: "#000000",
    MESSAGE_STROKE_THICKNESS: 2,
    LINE_SPACING: 4,
    // OKボタン
    OK_BUTTON: {
        FONT_SIZE: "24px",
        BG_COLOR: 0x00cc00,
        WIDTH: 100,
        HEIGHT: 48,
    },
};

/**
 * チュートリアルマネージャー
 */
export class TutorialManager {
    constructor(scene) {
        this.scene = scene;
        this.tutorialStep = 0;
        this.tutorialCompleted = false;
        this.currentModal = null;
        this.highlightGraphics = null;
        this.highlightTarget = null;
        this.highlightTimer = null;
        this.overlayGraphics = null;
        this.blockingArea = null;
        this.highlightAlpha = 1;
        this.tutorialStartGameTime = null;
        this.tutorialTriggered = false;
        this.coinTutorialCompleted = false;
        this.firstCoinEarned = false;
        this.pendingTutorialItem = null; // チュートリアル中に売るアイテムを保存
    }

    // ==================== 公開API ====================

    scheduleTutorialStart() {
        if (localStorage.getItem(STORAGE_KEY.TUTORIAL_COMPLETED) === "true") {
            this.tutorialCompleted = true;
            this.tutorialStep = TUTORIAL_STEP.COMPLETED;
            return;
        }
        this.tutorialStartGameTime =
            this.scene.gameTimeManager.getTotalMinutes();

        // コインチュートリアルの完了状態をロード
        if (
            localStorage.getItem(STORAGE_KEY.COIN_TUTORIAL_COMPLETED) === "true"
        ) {
            this.coinTutorialCompleted = true;
        }
    }

    startTutorial() {
        this.showStep1FishHit();
    }

    isTutorialCompleted() {
        return this.tutorialCompleted;
    }

    getCurrentStep() {
        return this.tutorialStep;
    }

    // ==================== 各ステップ ====================

    showStep1FishHit() {
        this.tutorialStep = TUTORIAL_STEP.FISH_HIT;
        this.scene.gameTimeManager?.forceFishHit();

        this.scene.time.delayedCall(100, () =>
            this.highlightFishHitIndicator()
        );

        const msg = this._getText(TUTORIAL_TEXT.STEP1);
        this._showSmallModal(msg, STEP_CONFIG.STEP1);
        this.scene.gameTimeManager?.pause();
    }

    showStep2ClickFish() {
        if (this.tutorialStep !== TUTORIAL_STEP.FISH_HIT) return;
        this.tutorialStep = TUTORIAL_STEP.CLICK_FISH;

        this.highlightInventoryItem(0);

        const msg = this._getText(TUTORIAL_TEXT.STEP2);
        this._showSmallModal(msg, STEP_CONFIG.STEP2);
        this.scene.gameTimeManager?.pause();
    }

    showStep3SellFish(item) {
        if (this.tutorialStep !== TUTORIAL_STEP.CLICK_FISH) return;
        this.tutorialStep = TUTORIAL_STEP.SELL_FISH;

        this.clearHighlight();

        // アイテムを直接保存（パラメータから取得）
        if (item) {
            this.pendingTutorialItem = item;
        }

        const inventoryUI = this.scene.sidebarUI?.inventoryUI;
        if (inventoryUI && item) {
            inventoryUI.pendingItemDetail = null;
            inventoryUI.showItemDetail(item);
            this.scene.time.delayedCall(200, () => this.highlightSellButton());
        }

        const msg = this._getText(TUTORIAL_TEXT.STEP3);
        this._showSmallModal(msg, STEP_CONFIG.STEP3);
    }

    completeTutorial() {
        this.tutorialStep = TUTORIAL_STEP.COMPLETED;
        this.tutorialCompleted = true;
        this.currentModal = null;
        this.clearHighlight();
        this.scene.gameTimeManager?.resume();
        localStorage.setItem(STORAGE_KEY.TUTORIAL_COMPLETED, "true");
    }

    // ==================== コインチュートリアル ====================

    /**
     * コインチュートリアルが完了しているかチェック
     * @returns {boolean} コインチュートリアルが完了していればtrue
     */
    isCoinTutorialCompleted() {
        return this.coinTutorialCompleted;
    }

    /**
     * 魚を売ったときにコインチュートリアルを開始
     * 最初の魚を売った時のみ実行される
     *
     * Note: This tutorial triggers when coins go from 0 to positive.
     * Since coins are not persisted across page reloads in the current
     * implementation, the tutorial will re-trigger after reload if not
     * completed. Once completed, it will never show again.
     */
    onFirstFishSold() {
        // メインチュートリアルが完了していない場合は開始しない
        if (!this.tutorialCompleted) {
            return;
        }

        // すでにコインチュートリアルが完了している場合は開始しない
        if (this.coinTutorialCompleted) {
            return;
        }

        // 初めてのコイン獲得
        // Note: firstCoinEarned is not persisted to localStorage intentionally.
        // If the tutorial is interrupted before completion, it will trigger again
        // on the next first coin earning, ensuring players don't miss the tutorial.
        // The hadZeroCoins check in InventoryUI prevents multiple triggers in the same session.
        if (!this.firstCoinEarned) {
            this.firstCoinEarned = true;
            this.scene.time.delayedCall(
                TUTORIAL_DELAY.COIN_TUTORIAL_START,
                () => {
                    this.showCoinTutorialStep1();
                }
            );
        }
    }

    /**
     * コインチュートリアルステップ1: コイン獲得を祝福
     */
    showCoinTutorialStep1() {
        this.tutorialStep = TUTORIAL_STEP.FIRST_COIN_EARNED;
        this.scene.gameTimeManager?.pause();

        const msg = this._getText(TUTORIAL_TEXT.COIN_STEP1);
        this._showLargeModal(
            msg,
            () => this.showCoinTutorialStep2(),
            STEP_CONFIG.COIN_STEP1
        );
    }

    /**
     * コインチュートリアルステップ2: 釣り竿のアップグレード説明
     */
    showCoinTutorialStep2() {
        this.tutorialStep = TUTORIAL_STEP.UPGRADE_ROD_EXPLANATION;

        // アップグレードボタンをハイライト
        this.highlightUpgradeButton();

        const msg = this._getText(TUTORIAL_TEXT.COIN_STEP2);
        this._showLargeModal(
            msg,
            () => this.completeCoinTutorial(),
            STEP_CONFIG.COIN_STEP2
        );
    }

    /**
     * コインチュートリアルを完了
     */
    completeCoinTutorial() {
        this.tutorialStep = TUTORIAL_STEP.COIN_TUTORIAL_COMPLETED;
        this.coinTutorialCompleted = true;
        this.currentModal = null;
        this.clearHighlight();
        this.scene.gameTimeManager?.resume();
        localStorage.setItem(STORAGE_KEY.COIN_TUTORIAL_COMPLETED, "true");
    }

    // ==================== モーダル表示 ====================

    _showSmallModal(message, config = {}) {
        const gameWidth = this.scene.sys.game.config.width;
        const gameHeight = this.scene.sys.game.config.height;
        const size = MODAL_SIZE.SMALL;

        // X座標の計算
        const minX = size.width / 2 + 10;
        const requestedX = config.x !== null ? config.x : gameWidth / 2;
        const safeX = Math.max(minX, Math.min(requestedX, gameWidth - minX));

        // Y座標の計算
        let modalY;
        if (config.y === "top") {
            modalY = size.height / 2 + (config.topMargin || 20);
        } else if (config.y === "bottom") {
            modalY = gameHeight - size.height / 2 - (config.bottomMargin || 20);
        } else if (config.y !== null && config.y !== undefined) {
            modalY = config.y;
        } else {
            modalY = gameHeight / 2;
        }

        this.currentModal = new Modal(this.scene, {
            title: "",
            message: message,
            modalStyle: this._getStyle(size),
            buttons: [],
            width: size.width,
            height: size.height,
            x: safeX,
            y: modalY,
            closeOnClickOutside: false,
            screenWidth: COMMON_CONST.SCREEN_WIDTH,
            screenHeight: COMMON_CONST.SCREEN_HEIGHT,
            fontFamily: FONT_NAME.CHECKPOINT,
        });

        this.currentModal.show();
        this.currentModal.overlay?.disableInteractive();
        this.currentModal.overlay?.setVisible(false);
    }

    _showLargeModal(message, callback, config = {}) {
        const gameWidth = this.scene.sys.game.config.width;
        const gameHeight = this.scene.sys.game.config.height;
        const size = MODAL_SIZE.LARGE;

        // X座標の計算
        const minX = size.width / 2 + 10;
        const requestedX = config.x !== null ? config.x : gameWidth / 2;
        const safeX = Math.max(minX, Math.min(requestedX, gameWidth - minX));

        // Y座標の計算
        let modalY;
        if (config.y === "top") {
            modalY = size.height / 2 + (config.topMargin || 20);
        } else if (config.y === "bottom") {
            modalY = gameHeight - size.height / 2 - (config.bottomMargin || 20);
        } else if (config.y !== null && config.y !== undefined) {
            modalY = config.y;
        } else {
            modalY = gameHeight / 2;
        }

        this.currentModal = new Modal(this.scene, {
            title: "",
            message: message,
            modalStyle: this._getStyle(size),
            buttons: [
                {
                    text: TUTORIAL_TEXT.OK_BUTTON,
                    style: {
                        fontFamily: FONT_NAME.CP_PERIOD,
                        fontSize: MODAL_STYLE.OK_BUTTON.FONT_SIZE,
                        backgroundColor: MODAL_STYLE.OK_BUTTON.BG_COLOR,
                        width: MODAL_STYLE.OK_BUTTON.WIDTH,
                        height: MODAL_STYLE.OK_BUTTON.HEIGHT,
                    },
                    callback: callback,
                },
            ],
            width: size.width,
            height: size.height,
            x: safeX,
            y: modalY,
            messageAlignTop: true,
            screenWidth: COMMON_CONST.SCREEN_WIDTH,
            screenHeight: COMMON_CONST.SCREEN_HEIGHT,
            fontFamily: FONT_NAME.CHECKPOINT,
        });

        this.currentModal.show();
        // オーバーレイを無効化してハイライトを表示できるようにする
        this.currentModal.overlay?.disableInteractive();
        this.currentModal.overlay?.setVisible(false);
    }

    _getStyle(size) {
        return {
            messageFontFamily: FONT_NAME.CP_PERIOD,
            messageFontSize: size.msgSize,
            messageColor: MODAL_STYLE.MESSAGE_COLOR,
            messageStroke: MODAL_STYLE.MESSAGE_STROKE,
            messageStrokeThickness: MODAL_STYLE.MESSAGE_STROKE_THICKNESS,
            lineSpacing: MODAL_STYLE.LINE_SPACING,
        };
    }

    _getText(textObj) {
        return getCurrentLanguage() === "JP" ? textObj.JP : textObj.EN;
    }

    // ==================== ハイライト ====================

    clearHighlight() {
        this.highlightGraphics?.destroy();
        this.highlightGraphics = null;
        this.highlightTimer?.remove();
        this.highlightTimer = null;
        this.overlayGraphics?.destroy();
        this.overlayGraphics = null;
        this.blockingArea?.destroy();
        this.blockingArea = null;
        this.highlightTarget?.clickableArea?.destroy();
        this.highlightTarget = null;
        this.highlightAlpha = 1;
    }

    highlightFishHitIndicator() {
        this.clearHighlight();

        const button = this.scene.fishHitButton;
        const indicator = this.scene.fishHitIndicator;
        const text = this.scene.fishHitText;
        if (!button && !indicator) return;

        this.highlightTarget = {
            fishHitButton: button,
            fishHitIndicator: indicator,
            fishHitText: text,
            type: "fishHit",
        };

        this.overlayGraphics = this.scene.add
            .graphics()
            .setDepth(1000)
            .setScrollFactor(0);
        this.scene.cameras.main.ignore(this.overlayGraphics);

        this.highlightGraphics = this.scene.add
            .graphics()
            .setDepth(1001)
            .setScrollFactor(0);
        this.scene.cameras.main.ignore(this.highlightGraphics);

        this._createBlockingArea(true);
        this.scene.cameras.main.ignore(this.blockingArea);

        this.blockingArea.on("pointerdown", (pointer) => {
            const bounds = this._getFishHitBounds();
            if (this._inBounds(pointer, bounds)) {
                this._closeModal();
                this.scene.gameTimeManager?.resume();
                if (this.scene.gameTimeManager.isFishHitActive()) {
                    this.clearHighlight();
                    this.scene.startFishing();
                }
            }
        });

        // 初期描画
        const b = this._getFishHitBounds();
        this._draw4Region(b.x - 10, b.y - 10, b.width + 20, b.height + 20);

        this._startAnimation(TUTORIAL_STEP.FISH_HIT, () =>
            this._updateFishHit()
        );
        this._updateFishHit();
    }

    highlightInventoryItem(index) {
        this.clearHighlight();

        const inventoryUI = this.scene.sidebarUI?.inventoryUI;
        if (!inventoryUI) return;

        const frame = inventoryUI.inventoryFrameGroup.getChildren()[index];
        if (!frame) return;

        this.highlightTarget = { frame, index, type: "inventory" };

        this.overlayGraphics = this.scene.add
            .graphics()
            .setDepth(1000)
            .setScrollFactor(0);
        this.scene.cameras.main.ignore(this.overlayGraphics);

        this.highlightGraphics = this.scene.add
            .graphics()
            .setDepth(1001)
            .setScrollFactor(0);
        this.scene.cameras.main.ignore(this.highlightGraphics);

        this._createBlockingArea(false);
        this.scene.cameras.main.ignore(this.blockingArea);

        const pos = this._getInvPos(frame);
        const clickArea = this.scene.add
            .rectangle(pos.x, pos.y, frame.width, frame.height, 0x000000, 0.01)
            .setOrigin(0, 0)
            .setDepth(999)
            .setScrollFactor(0)
            .setInteractive({ useHandCursor: true });

        clickArea.on("pointerdown", () => {
            this._closeModal();
            this.clearHighlight();
            const item = this.scene.inventoryManager.items[index];
            if (item?.itemKey) inventoryUI.showItemDetail(item);
        });

        this.highlightTarget.clickableArea = clickArea;

        // 初期描画
        const f = frame;
        this._draw4Region(pos.x - 10, pos.y - 10, f.width + 20, f.height + 20);

        this._startAnimation(TUTORIAL_STEP.CLICK_FISH, () => this._updateInv());
        this._updateInv();
    }

    highlightSellButton() {
        this.clearHighlight();

        const inventoryUI = this.scene.sidebarUI?.inventoryUI;
        if (!inventoryUI?.itemDetailModal) return;

        const cx = this.scene.cameras.main.width / 2;
        const cy = this.scene.cameras.main.height / 2;

        // ボタンの左上座標と大きさ
        const buttonW = UI_CONST.ITEM_DETAIL_BUTTON_WIDTH;
        const buttonH = UI_CONST.ITEM_DETAIL_BUTTON_HEIGHT;
        const buttonCenterX = cx - 65;
        const buttonX = buttonCenterX - buttonW / 2;
        const buttonY = cy + 200 - buttonH / 2;

        this.highlightTarget = {
            type: "sellButton",
            x: buttonX,
            y: buttonY,
            width: buttonW,
            height: buttonH,
        };

        this.overlayGraphics = this.scene.add
            .graphics()
            .setDepth(1000)
            .setScrollFactor(0);
        this.scene.cameras.main.ignore(this.overlayGraphics);

        this.highlightGraphics = this.scene.add
            .graphics()
            .setDepth(1001)
            .setScrollFactor(0);
        this.scene.cameras.main.ignore(this.highlightGraphics);

        // ブロッキングエリアを作成（クリック可能な領域を制限）
        this._createBlockingArea(false);
        this.scene.cameras.main.ignore(this.blockingArea);

        // 売るボタンの上にクリック可能な透明エリアを作成
        const clickArea = this.scene.add
            .rectangle(buttonX, buttonY, buttonW, buttonH, 0x000000, 0.01)
            .setOrigin(0, 0)
            .setDepth(1002)
            .setScrollFactor(0)
            .setInteractive({ useHandCursor: true });

        this.scene.cameras.main.ignore(clickArea);

        clickArea.on("pointerdown", () => {
            // チュートリアルのモーダルを閉じる
            this._closeModal();
            this.clearHighlight();

            // InventoryUIに保存されたアイテムと価値を取得
            const item = inventoryUI.lastItemDetail;
            const value = inventoryUI.lastItemValue;

            if (
                item &&
                this.scene.inventoryManager.removeItem(item.itemKey, 1)
            ) {
                console.log("売る:", item.itemKey, value);
                if (inventoryUI.gameInfoUI) {
                    // 初回コイン獲得かどうかをチェック
                    const hadZeroCoins = inventoryUI.gameInfoUI.coins === 0;
                    inventoryUI.gameInfoUI.addCoins(value);
                    // トップバーを更新してコイン表示を反映
                    if (this.scene.topBarUI) {
                        this.scene.topBarUI.update();
                    }
                    // メインチュートリアルを先に完了
                    this.completeTutorial();
                    // 初めてコインを獲得した場合、コインチュートリアルを開始
                    if (hadZeroCoins) {
                        this.scene.time.delayedCall(500, () => {
                            this.onFirstFishSold();
                        });
                    }
                }
                // インベントリを更新
                inventoryUI.update();
            }
            // アイテムディテールモーダルを閉じる
            inventoryUI.closeItemDetail();
            // アイテム参照をクリア
            this.pendingTutorialItem = null;
        });

        this.highlightTarget.clickableArea = clickArea;

        // 初期描画（マージン付き）
        this._draw4Region(
            buttonX - 10,
            buttonY - 10,
            buttonW + 20,
            buttonH + 20
        );

        this._startAnimation(TUTORIAL_STEP.SELL_FISH, () => this._updateSell());
        this._updateSell();
    }

    highlightUpgradeButton() {
        this.clearHighlight();

        const sidebarUI = this.scene.sidebarUI;
        const gameInfoUI = sidebarUI?.gameInfoUI;

        // 必要なコンポーネントの存在確認
        if (!sidebarUI) {
            console.warn(
                "Cannot highlight upgrade button: sidebarUI not found"
            );
            return;
        }
        if (!gameInfoUI) {
            console.warn(
                "Cannot highlight upgrade button: gameInfoUI not found"
            );
            return;
        }
        if (!gameInfoUI.upgradeButton) {
            console.warn(
                "Cannot highlight upgrade button: upgradeButton not found"
            );
            return;
        }
        if (!sidebarUI.sidebarContainer) {
            console.warn(
                "Cannot highlight upgrade button: sidebarContainer not found"
            );
            return;
        }
        if (!gameInfoUI.infoContainer) {
            console.warn(
                "Cannot highlight upgrade button: infoContainer not found"
            );
            return;
        }

        // アップグレードボタンの位置とサイズを取得
        const sidebarX = sidebarUI.sidebarContainer.x;
        const sidebarY = sidebarUI.sidebarContainer.y;
        const infoX = gameInfoUI.infoContainer.x;
        const infoY = gameInfoUI.infoContainer.y;

        // ボタンの絶対座標を計算
        // upgradeButton has origin (0, 0), so x/y are top-left coordinates
        const buttonX = sidebarX + infoX + gameInfoUI.upgradeButton.x;
        const buttonY = sidebarY + infoY + gameInfoUI.upgradeButton.y;
        const buttonW = gameInfoUI.upgradeButton.width;
        const buttonH = gameInfoUI.upgradeButton.height;

        this.highlightTarget = {
            type: "upgradeButton",
            x: buttonX,
            y: buttonY,
            width: buttonW,
            height: buttonH,
        };

        this.overlayGraphics = this.scene.add
            .graphics()
            .setDepth(1000)
            .setScrollFactor(0);
        this.scene.cameras.main.ignore(this.overlayGraphics);

        this.highlightGraphics = this.scene.add
            .graphics()
            .setDepth(1001)
            .setScrollFactor(0);
        this.scene.cameras.main.ignore(this.highlightGraphics);

        // 初期描画（マージン付き）
        this._draw4Region(
            buttonX - 10,
            buttonY - 10,
            buttonW + 20,
            buttonH + 20
        );

        this._startAnimation(TUTORIAL_STEP.UPGRADE_ROD_EXPLANATION, () =>
            this._updateUpgradeButton()
        );
        this._updateUpgradeButton();
    }

    // ==================== ハイライト更新 ====================

    _updateFishHit() {
        if (!this.highlightGraphics || !this.highlightTarget) return;
        const b = this._getFishHitBounds();
        this._drawBorder(b.x - 10, b.y - 10, b.width + 20, b.height + 20);
    }

    _updateInv() {
        if (!this.highlightGraphics || !this.highlightTarget) return;
        const pos = this._getInvPos(this.highlightTarget.frame);
        const f = this.highlightTarget.frame;
        this._drawBorder(pos.x - 10, pos.y - 10, f.width + 20, f.height + 20);
    }

    _updateSell() {
        if (!this.highlightGraphics || !this.highlightTarget) return;
        const { x, y, width, height } = this.highlightTarget;
        this._drawBorder(x - 10, y - 10, width + 20, height + 20);
    }

    _updateUpgradeButton() {
        if (!this.highlightGraphics || !this.highlightTarget) return;
        const { x, y, width, height } = this.highlightTarget;
        this._drawBorder(x - 10, y - 10, width + 20, height + 20);
    }

    // ==================== ヘルパー ====================

    _draw4Region(hx, hy, hw, hh) {
        const w = this.scene.sys.game.config.width;
        const h = this.scene.sys.game.config.height;

        // コンソール出力：どのステップのどのオーバーレイが描画されるか
        const stepName =
            {
                1: "FISH_HIT",
                2: "CLICK_FISH",
                3: "SELL_FISH",
                6: "FIRST_COIN_EARNED",
                7: "UPGRADE_ROD_EXPLANATION",
            }[this.tutorialStep] || "UNKNOWN";
        const overlayAlpha = 0.3;

        this.overlayGraphics.fillStyle(0x000000, overlayAlpha);
        this.overlayGraphics.fillRect(0, 0, w, hy);
        this.overlayGraphics.fillRect(0, hy + hh, w, h - (hy + hh));
        this.overlayGraphics.fillRect(0, hy, hx, hh);
        this.overlayGraphics.fillRect(hx + hw, hy, w - (hx + hw), hh);
    }

    _drawBorder(x, y, w, h) {
        const alpha = 0.5 + Math.abs(Math.sin(this.highlightAlpha)) * 0.5;
        this.highlightGraphics.clear();

        this.highlightGraphics.fillStyle(0xffffff, 0);
        this.highlightGraphics.fillRect(x, y, w, h);
        // 枠線
        this.highlightGraphics.lineStyle(4, 0xffff00, alpha);
        this.highlightGraphics.strokeRect(x - 4, y - 4, w + 8, h + 8);
    }

    _createBlockingArea(scroll) {
        this.blockingArea = this.scene.add
            .rectangle(
                0,
                0,
                this.scene.sys.game.config.width,
                this.scene.sys.game.config.height,
                0x000000,
                0.01
            )
            .setOrigin(0, 0)
            .setDepth(999)
            .setInteractive({ useHandCursor: false });
        if (scroll) this.blockingArea.setScrollFactor(0);
        this.blockingArea.on("pointerdown", (p, lx, ly, e) =>
            e.stopPropagation()
        );
    }

    _createHighlightGfx() {
        this.highlightGraphics = this.scene.add.graphics().setDepth(1001);
        this.scene.cameras.main.ignore(this.highlightGraphics);
    }

    _startAnimation(step, updateFn) {
        // Start a looped animation that only runs while still on the specified tutorial step
        // This prevents animations from continuing after moving to a different step
        this.highlightTimer = this.scene.time.addEvent({
            delay: 30,
            callback: () => {
                if (this.tutorialStep === step) {
                    this.highlightAlpha += 0.05;
                    updateFn();
                }
            },
            loop: true,
        });
    }

    _getFishHitBounds() {
        const { fishHitButton, fishHitIndicator } = this.highlightTarget;
        const cam = this.scene.cameras.main;

        // ボタンがある場合はボタンのサイズを使用
        if (fishHitButton) {
            const sx = fishHitButton.x - cam.scrollX;
            const sy = fishHitButton.y - cam.scrollY;
            const padding = 10;
            return {
                x: sx - fishHitButton.width / 2 - padding,
                y: sy - fishHitButton.height / 2 - padding,
                width: fishHitButton.width + padding * 2,
                height: fishHitButton.height + padding * 2,
            };
        }

        // フォールバック（ボタンがない場合）
        if (fishHitIndicator) {
            const sx = fishHitIndicator.x - cam.scrollX;
            const sy = fishHitIndicator.y - cam.scrollY;
            const padding = 15;
            return {
                x: sx - fishHitIndicator.displayWidth / 2 - padding,
                y: sy - fishHitIndicator.displayHeight / 2 - padding,
                width: fishHitIndicator.displayWidth + padding * 2,
                height: fishHitIndicator.displayHeight + padding * 2,
            };
        }

        return { x: 0, y: 0, width: 100, height: 100 };
    }

    _getInvPos(frame) {
        const inv = this.scene.sidebarUI?.inventoryUI;
        const sx = this.scene.sidebarUI.sidebarContainer.x;
        const sy = this.scene.sidebarUI.sidebarContainer.y;
        return { x: sx + inv.x + frame.x, y: sy + inv.y + frame.y };
    }

    _inBounds(p, b) {
        return (
            p.x >= b.x &&
            p.x <= b.x + b.width &&
            p.y >= b.y &&
            p.y <= b.y + b.height
        );
    }

    _closeModal() {
        if (this.currentModal) {
            this.currentModal.close();
            this.currentModal = null;
        }
    }
}
