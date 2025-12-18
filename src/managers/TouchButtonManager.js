import { COMMON_CONST, FONT_NAME } from "../const/CommonConst.js";
import { UI_CONST } from "../const/UIConst.js";

/**
 * タッチボタン管理クラス
 */
export class TouchButtonManager {
    /**
     * コンストラクタ
     * @param {Phaser.Scene} scene シーンオブジェクト
     * @param {Phaser.GameObjects.Layer} uiLayer UIレイヤー
     */
    constructor(scene, uiLayer) {
        this.scene = scene;
        this.uiLayer = uiLayer;

        // タッチボタン入力用フラグとポインターID (マルチタッチ対応)
        this.leftPressed = false;
        this.rightPressed = false;
        this.jumpPressed = false;

        // 各ボタンを押しているポインターのIDを追跡
        this.leftPointerId = null;
        this.rightPointerId = null;
        this.jumpPointerId = null;

        this.createButtons();
    }

    /**
     * タッチボタンUI作成
     */
    createButtons() {
        this.createLeftButton();
        this.createRightButton();
        this.createJumpButton();
    }

    /**
     * 左転換ボタン作成
     */
    createLeftButton() {
        const leftButton = this.scene.add.rectangle(
            UI_CONST.TOUCH_BUTTON_MARGIN + UI_CONST.TOUCH_BUTTON_WIDTH / 2,
            COMMON_CONST.SCREEN_HEIGHT -
                UI_CONST.TOUCH_BUTTON_MARGIN -
                UI_CONST.TOUCH_BUTTON_HEIGHT / 2,
            UI_CONST.TOUCH_BUTTON_WIDTH,
            UI_CONST.TOUCH_BUTTON_HEIGHT,
            UI_CONST.TOUCH_BUTTON_LEFT_COLOR,
            UI_CONST.TOUCH_BUTTON_ALPHA
        );
        leftButton.setStrokeStyle(
            UI_CONST.TOUCH_BUTTON_STROKE_WIDTH,
            UI_CONST.TOUCH_BUTTON_STROKE_COLOR
        );
        leftButton.setInteractive();
        leftButton.setScrollFactor(0);
        this.uiLayer.add(leftButton);

        const leftText = this.scene.add.text(
            UI_CONST.TOUCH_BUTTON_MARGIN + UI_CONST.TOUCH_BUTTON_WIDTH / 2,
            COMMON_CONST.SCREEN_HEIGHT -
                UI_CONST.TOUCH_BUTTON_MARGIN -
                UI_CONST.TOUCH_BUTTON_HEIGHT / 2,
            UI_CONST.TOUCH_BUTTON_TEXT_LEFT,
            {
                fontFamily: FONT_NAME.CHECKPOINT,
                fontSize: UI_CONST.TOUCH_BUTTON_ARROW_FONT_SIZE,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 4,
            }
        );
        leftText.setOrigin(0.5);
        leftText.setScrollFactor(0);
        this.uiLayer.add(leftText);

        leftButton.on("pointerdown", (pointer) => {
            if (this.leftPointerId !== null) return;
            this.leftPressed = true;
            this.leftPointerId = pointer.id;
            leftButton.setAlpha(UI_CONST.TOUCH_BUTTON_ALPHA_ACTIVE);
        });
        leftButton.on("pointerup", (pointer) => {
            if (this.leftPointerId === pointer.id) {
                this.leftPressed = false;
                this.leftPointerId = null;
                leftButton.setAlpha(UI_CONST.TOUCH_BUTTON_ALPHA);
            }
        });
        leftButton.on("pointerout", (pointer) => {
            if (this.leftPointerId === pointer.id) {
                this.leftPressed = false;
                this.leftPointerId = null;
                leftButton.setAlpha(UI_CONST.TOUCH_BUTTON_ALPHA);
            }
        });
    }

    /**
     * 右転換ボタン作成
     */
    createRightButton() {
        const rightButton = this.scene.add.rectangle(
            UI_CONST.TOUCH_BUTTON_MARGIN * 2 +
                UI_CONST.TOUCH_BUTTON_WIDTH * 1.5,
            COMMON_CONST.SCREEN_HEIGHT -
                UI_CONST.TOUCH_BUTTON_MARGIN -
                UI_CONST.TOUCH_BUTTON_HEIGHT / 2,
            UI_CONST.TOUCH_BUTTON_WIDTH,
            UI_CONST.TOUCH_BUTTON_HEIGHT,
            UI_CONST.TOUCH_BUTTON_RIGHT_COLOR,
            UI_CONST.TOUCH_BUTTON_ALPHA
        );
        rightButton.setStrokeStyle(
            UI_CONST.TOUCH_BUTTON_STROKE_WIDTH,
            UI_CONST.TOUCH_BUTTON_STROKE_COLOR
        );
        rightButton.setInteractive();
        rightButton.setScrollFactor(0);
        this.uiLayer.add(rightButton);

        const rightText = this.scene.add.text(
            UI_CONST.TOUCH_BUTTON_MARGIN * 2 +
                UI_CONST.TOUCH_BUTTON_WIDTH * 1.5,
            COMMON_CONST.SCREEN_HEIGHT -
                UI_CONST.TOUCH_BUTTON_MARGIN -
                UI_CONST.TOUCH_BUTTON_HEIGHT / 2,
            UI_CONST.TOUCH_BUTTON_TEXT_RIGHT,
            {
                fontFamily: FONT_NAME.CHECKPOINT,
                fontSize: UI_CONST.TOUCH_BUTTON_ARROW_FONT_SIZE,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 4,
            }
        );
        rightText.setOrigin(0.5);
        rightText.setScrollFactor(0);
        this.uiLayer.add(rightText);

        rightButton.on("pointerdown", (pointer) => {
            if (this.rightPointerId !== null) return;
            this.rightPressed = true;
            this.rightPointerId = pointer.id;
            rightButton.setAlpha(UI_CONST.TOUCH_BUTTON_ALPHA_ACTIVE);
        });
        rightButton.on("pointerup", (pointer) => {
            if (this.rightPointerId === pointer.id) {
                this.rightPressed = false;
                this.rightPointerId = null;
                rightButton.setAlpha(UI_CONST.TOUCH_BUTTON_ALPHA);
            }
        });
        rightButton.on("pointerout", (pointer) => {
            if (this.rightPointerId === pointer.id) {
                this.rightPressed = false;
                this.rightPointerId = null;
                rightButton.setAlpha(UI_CONST.TOUCH_BUTTON_ALPHA);
            }
        });
    }

    /**
     * ジャンプボタン作成
     */
    createJumpButton() {
        const jumpButton = this.scene.add.rectangle(
            COMMON_CONST.SCREEN_WIDTH -
                UI_CONST.TOUCH_BUTTON_MARGIN -
                UI_CONST.TOUCH_BUTTON_WIDTH / 2,
            COMMON_CONST.SCREEN_HEIGHT -
                UI_CONST.TOUCH_BUTTON_MARGIN -
                UI_CONST.TOUCH_BUTTON_HEIGHT / 2,
            UI_CONST.TOUCH_BUTTON_WIDTH,
            UI_CONST.TOUCH_BUTTON_HEIGHT,
            UI_CONST.TOUCH_BUTTON_JUMP_COLOR,
            UI_CONST.TOUCH_BUTTON_ALPHA
        );
        jumpButton.setStrokeStyle(
            UI_CONST.TOUCH_BUTTON_STROKE_WIDTH,
            UI_CONST.TOUCH_BUTTON_STROKE_COLOR
        );
        jumpButton.setInteractive();
        jumpButton.setScrollFactor(0);
        this.uiLayer.add(jumpButton);

        const jumpText = this.scene.add.text(
            COMMON_CONST.SCREEN_WIDTH -
                UI_CONST.TOUCH_BUTTON_MARGIN -
                UI_CONST.TOUCH_BUTTON_WIDTH / 2,
            COMMON_CONST.SCREEN_HEIGHT -
                UI_CONST.TOUCH_BUTTON_MARGIN -
                UI_CONST.TOUCH_BUTTON_HEIGHT / 2,
            UI_CONST.TOUCH_BUTTON_TEXT_JUMP,
            {
                fontFamily: FONT_NAME.CHECKPOINT,
                fontSize: UI_CONST.TOUCH_BUTTON_JUMP_FONT_SIZE,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 4,
            }
        );
        jumpText.setOrigin(0.5);
        jumpText.setScrollFactor(0);
        this.uiLayer.add(jumpText);

        jumpButton.on("pointerdown", (pointer) => {
            if (this.jumpPointerId !== null) return;
            this.jumpPressed = true;
            this.jumpPointerId = pointer.id;
            jumpButton.setAlpha(UI_CONST.TOUCH_BUTTON_ALPHA_ACTIVE);
        });
        jumpButton.on("pointerup", (pointer) => {
            if (this.jumpPointerId === pointer.id) {
                this.jumpPressed = false;
                this.jumpPointerId = null;
                jumpButton.setAlpha(UI_CONST.TOUCH_BUTTON_ALPHA);
            }
        });
        jumpButton.on("pointerout", (pointer) => {
            if (this.jumpPointerId === pointer.id) {
                this.jumpPressed = false;
                this.jumpPointerId = null;
                jumpButton.setAlpha(UI_CONST.TOUCH_BUTTON_ALPHA);
            }
        });
    }

    /**
     * 左ボタンが押されているか
     * @returns {boolean}
     */
    isLeftPressed() {
        return this.leftPressed;
    }

    /**
     * 右ボタンが押されているか
     * @returns {boolean}
     */
    isRightPressed() {
        return this.rightPressed;
    }

    /**
     * ジャンプボタンが押されているか
     * @returns {boolean}
     */
    isJumpPressed() {
        return this.jumpPressed;
    }
}
