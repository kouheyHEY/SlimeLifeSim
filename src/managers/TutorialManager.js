import { Modal } from "../../core/ui/Modal.js";
import { getCurrentLanguage, FONT_NAME } from "../const/CommonConst.js";

/**
 * チュートリアルステップの定数
 */
export const TUTORIAL_STEP = {
    NOT_STARTED: 0,
    FISH_HIT: 1,
    CLICK_FISH: 2,
    EAT_FISH: 3,
    STATUS_EXPLANATION: 4,
    COMPLETED: 5,
};

/**
 * モーダルサイズ定数
 */
const MODAL_SIZE = {
    SMALL: { width: 280, height: 90, titleSize: "20px", msgSize: "14px" },
    LARGE: { width: 380, height: 320, titleSize: "22px", msgSize: "14px" },
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
    }

    // ==================== 公開API ====================

    scheduleTutorialStart() {
        if (localStorage.getItem("tutorialCompleted") === "true") {
            this.tutorialCompleted = true;
            this.tutorialStep = TUTORIAL_STEP.COMPLETED;
            return;
        }
        this.tutorialStartGameTime =
            this.scene.gameTimeManager.getTotalMinutes();
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

        const msg =
            getCurrentLanguage() === "JP"
                ? "魚がヒット！\nアイコンをタップ！"
                : "Fish hit!\nTap the icon!";

        this._showSmallModal(msg);
        this.scene.gameTimeManager?.pause();
    }

    showStep2ClickFish() {
        if (this.tutorialStep !== TUTORIAL_STEP.FISH_HIT) return;
        this.tutorialStep = TUTORIAL_STEP.CLICK_FISH;

        this.highlightInventoryItem(0);

        const msg =
            getCurrentLanguage() === "JP"
                ? "釣り成功！\n魚をタップ！"
                : "Caught it!\nTap the fish!";

        this._showSmallModal(msg, { x: 180 });
        this.scene.gameTimeManager?.pause();
    }

    showStep3EatFish() {
        if (this.tutorialStep !== TUTORIAL_STEP.CLICK_FISH) return;
        this.tutorialStep = TUTORIAL_STEP.EAT_FISH;

        this.clearHighlight();

        const inventoryUI = this.scene.sidebarUI?.inventoryUI;
        if (inventoryUI?.pendingItemDetail) {
            const item = inventoryUI.pendingItemDetail;
            inventoryUI.pendingItemDetail = null;
            inventoryUI.showItemDetail(item);
            this.scene.time.delayedCall(200, () => this.highlightEatButton());
        }

        const msg =
            getCurrentLanguage() === "JP"
                ? "「食べる」をタップ！"
                : "Tap 'Eat'!";

        this._showSmallModal(msg);
    }

    showStep4StatusExplanation() {
        if (this.tutorialStep !== TUTORIAL_STEP.EAT_FISH) return;
        this.tutorialStep = TUTORIAL_STEP.STATUS_EXPLANATION;

        this.highlightStatus();

        const msg =
            getCurrentLanguage() === "JP"
                ? "魚を食べるとステータスUP！\n\n朝と夕方の終わりに\nステータスが下がります。\n\n最低になると\nゲームオーバー！\n\n定期的に魚を食べよう！"
                : "Eating fish boosts status!\n\nStatus drops at the end\nof morning & evening.\n\nGame over if it hits zero!\n\nEat fish regularly!";

        this._showLargeModal(msg, () => this.completeTutorial());
        this.scene.gameTimeManager?.pause();
    }

    completeTutorial() {
        this.tutorialStep = TUTORIAL_STEP.COMPLETED;
        this.tutorialCompleted = true;
        this.currentModal = null;
        this.clearHighlight();
        this.scene.gameTimeManager?.resume();
        localStorage.setItem("tutorialCompleted", "true");
    }

    // ==================== モーダル表示 ====================

    _showSmallModal(message, options = {}) {
        const gameWidth = this.scene.sys.game.config.width;
        const gameHeight = this.scene.sys.game.config.height;
        const size = MODAL_SIZE.SMALL;

        this.currentModal = new Modal(this.scene, {
            title:
                getCurrentLanguage() === "JP" ? "チュートリアル" : "Tutorial",
            message: message,
            modalStyle: this._getStyle(size),
            buttons: [],
            width: size.width,
            height: size.height,
            x: options.x || gameWidth / 2,
            y: gameHeight - 70,
            closeOnClickOutside: false,
        });

        this.currentModal.show();
        this.currentModal.overlay?.disableInteractive();
    }

    _showLargeModal(message, callback) {
        const size = MODAL_SIZE.LARGE;

        this.currentModal = new Modal(this.scene, {
            title:
                getCurrentLanguage() === "JP" ? "チュートリアル" : "Tutorial",
            message: message,
            modalStyle: this._getStyle(size),
            buttons: [
                {
                    text: "OK",
                    style: {
                        fontFamily: FONT_NAME.MELONANO,
                        fontSize: "18px",
                        backgroundColor: 0x00cc00,
                        width: 100,
                        height: 36,
                    },
                    callback: callback,
                },
            ],
            width: size.width,
            height: size.height,
        });

        this.currentModal.show();
    }

    _getStyle(size) {
        return {
            titleFontFamily: FONT_NAME.MELONANO,
            titleFontSize: size.titleSize,
            titleColor: "#ffff00",
            titleStroke: "#000000",
            titleStrokeThickness: 3,
            messageFontFamily: FONT_NAME.MELONANO,
            messageFontSize: size.msgSize,
            messageColor: "#ffffff",
            messageStroke: "#000000",
            messageStrokeThickness: 2,
            lineSpacing: 4,
        };
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

        const indicator = this.scene.fishHitIndicator;
        const text = this.scene.fishHitText;
        if (!indicator) return;

        this.highlightTarget = {
            fishHitIndicator: indicator,
            fishHitText: text,
            type: "fishHit",
        };

        this.overlayGraphics = this.scene.add
            .graphics()
            .setDepth(1000)
            .setScrollFactor(0);
        this.scene.uiCamera.ignore(this.overlayGraphics);

        this._createBlockingArea(true);
        this.scene.uiCamera.ignore(this.blockingArea);

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

        this._createUIOverlay();
        this._createHighlightGfx();
        this._createBlockingArea(false);
        this.scene.cameras.main.ignore(this.blockingArea);

        const pos = this._getInvPos(frame);
        const clickArea = this.scene.add
            .rectangle(pos.x, pos.y, frame.width, frame.height, 0x000000, 0.01)
            .setOrigin(0, 0)
            .setDepth(2500)
            .setScrollFactor(0)
            .setInteractive({ useHandCursor: true });

        clickArea.on("pointerdown", () => {
            this._closeModal();
            this.clearHighlight();
            const item = this.scene.inventoryManager.items[index];
            if (item?.itemKey) inventoryUI.showItemDetail(item);
        });

        this.highlightTarget.clickableArea = clickArea;

        this._startAnimation(TUTORIAL_STEP.CLICK_FISH, () => this._updateInv());
        this._updateInv();
    }

    highlightStatus() {
        this.clearHighlight();

        const topBarUI = this.scene.topBarUI;
        const sprite = topBarUI?.statusSprite;
        if (!sprite) return;

        this.highlightTarget = {
            statusSprite: sprite,
            topBarUI,
            type: "status",
        };

        this._createUIOverlay();
        this._createHighlightGfx();
        this._createBlockingArea(false);
        this.scene.cameras.main.ignore(this.blockingArea);

        this._startAnimation(TUTORIAL_STEP.STATUS_EXPLANATION, () =>
            this._updateStatus()
        );
        this._updateStatus();
    }

    highlightEatButton() {
        this.clearHighlight();

        const inventoryUI = this.scene.sidebarUI?.inventoryUI;
        if (!inventoryUI?.itemDetailModal) return;

        const cx = this.scene.cameras.main.width / 2;
        const cy = this.scene.cameras.main.height / 2;

        this.highlightTarget = {
            type: "eatButton",
            x: cx - 130,
            y: cy + 200,
            width: 200,
            height: 60,
        };

        this.overlayGraphics = this.scene.add
            .graphics()
            .setDepth(2100)
            .setScrollFactor(0);
        this.scene.cameras.main.ignore(this.overlayGraphics);

        this.highlightGraphics = this.scene.add
            .graphics()
            .setDepth(2101)
            .setScrollFactor(0);
        this.scene.cameras.main.ignore(this.highlightGraphics);

        this._startAnimation(TUTORIAL_STEP.EAT_FISH, () => this._updateEat());
        this._updateEat();
    }

    // ==================== ハイライト更新 ====================

    _updateFishHit() {
        if (!this.overlayGraphics || !this.highlightTarget) return;
        const b = this._getFishHitBounds();
        const alpha = 0.5 + Math.abs(Math.sin(this.highlightAlpha)) * 0.5;

        this.overlayGraphics.clear();
        this._draw4Region(b.x, b.y, b.width, b.height);
        this.overlayGraphics.lineStyle(4, 0xffff00, alpha);
        this.overlayGraphics.strokeRect(b.x, b.y, b.width, b.height);
    }

    _updateInv() {
        if (!this.highlightGraphics || !this.highlightTarget) return;
        const pos = this._getInvPos(this.highlightTarget.frame);
        const f = this.highlightTarget.frame;
        this._drawBorder(pos.x, pos.y, f.width, f.height);
    }

    _updateStatus() {
        if (!this.highlightGraphics || !this.highlightTarget) return;
        const { statusSprite, topBarUI } = this.highlightTarget;
        const x = topBarUI.x + statusSprite.x;
        const y = topBarUI.y + statusSprite.y;
        const s = statusSprite.displayWidth;
        this._drawBorder(x - s / 2, y - s / 2, s, s);
    }

    _updateEat() {
        if (!this.highlightGraphics || !this.highlightTarget) return;
        const { x, y, width, height } = this.highlightTarget;
        this._drawBorder(x - width / 2, y - height / 2, width, height);
    }

    // ==================== ヘルパー ====================

    _draw4Region(hx, hy, hw, hh) {
        const w = this.scene.sys.game.config.width;
        const h = this.scene.sys.game.config.height;
        this.overlayGraphics.fillStyle(0x000000, 0.7);
        this.overlayGraphics.fillRect(0, 0, w, hy);
        this.overlayGraphics.fillRect(0, hy + hh, w, h - (hy + hh));
        this.overlayGraphics.fillRect(0, hy, hx, hh);
        this.overlayGraphics.fillRect(hx + hw, hy, w - (hx + hw), hh);
    }

    _drawBorder(x, y, w, h) {
        const alpha = 0.5 + Math.abs(Math.sin(this.highlightAlpha)) * 0.5;
        this.highlightGraphics.clear();
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
            .setDepth(1000)
            .setInteractive({ useHandCursor: false });
        if (scroll) this.blockingArea.setScrollFactor(0);
        this.blockingArea.on("pointerdown", (p, lx, ly, e) =>
            e.stopPropagation()
        );
    }

    _createUIOverlay() {
        this.overlayGraphics = this.scene.add.graphics().setDepth(1000);
        this.scene.cameras.main.ignore(this.overlayGraphics);

        if (this.highlightTarget?.type === "inventory") {
            const pos = this._getInvPos(this.highlightTarget.frame);
            const f = this.highlightTarget.frame;
            this._draw4Region(
                pos.x - 10,
                pos.y - 10,
                f.width + 20,
                f.height + 20
            );
        } else if (this.highlightTarget?.type === "status") {
            const { statusSprite, topBarUI } = this.highlightTarget;
            const x = topBarUI.x + statusSprite.x;
            const y = topBarUI.y + statusSprite.y;
            const s = statusSprite.displayWidth;
            this._draw4Region(x - s / 2 - 10, y - s / 2 - 10, s + 20, s + 20);
        }
    }

    _createHighlightGfx() {
        this.highlightGraphics = this.scene.add.graphics().setDepth(1001);
        this.scene.cameras.main.ignore(this.highlightGraphics);
    }

    _startAnimation(step, updateFn) {
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
        const { fishHitIndicator, fishHitText } = this.highlightTarget;
        const cam = this.scene.cameras.main;
        const sx = fishHitIndicator.x - cam.scrollX;
        const sy = fishHitIndicator.y - cam.scrollY;
        const tw = fishHitText?.width || 0;
        const totalW = fishHitIndicator.displayWidth + tw + 30;
        const totalH =
            Math.max(fishHitIndicator.displayHeight, fishHitText?.height || 0) +
            20;
        return {
            x: sx - fishHitIndicator.displayWidth / 2 - 15,
            y: sy - totalH / 2,
            width: totalW,
            height: totalH,
        };
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
