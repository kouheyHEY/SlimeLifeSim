import { COMMON_CONST, FONT_NAME } from "../const/CommonConst.js";
import { UI_CONST } from "../const/UIConst.js";

/**
 * タイトルシーン
 * ゲーム開始時に表示され、プレイヤーがゲームを開始するまで待機
 */
export class Title extends Phaser.Scene {
    constructor() {
        super("Title");
    }

    /**
     * シーンの初期化
     * タイトル画面とスタートボタンを表示
     */
    create() {
        // 背景全体に透過オーバーレイをかける
        const overlay = this.add
            .rectangle(
                0,
                0,
                this.cameras.main.width,
                this.cameras.main.height,
                UI_CONST.TITLE_BACKGROUND_COLOR,
                UI_CONST.TITLE_BACKGROUND_ALPHA
            )
            .setOrigin(0, 0);

        // Title text
        const titleText = this.add
            .text(
                COMMON_CONST.SCREEN_WIDTH / 2,
                COMMON_CONST.SCREEN_HEIGHT * UI_CONST.TITLE_TEXT_Y_RATIO,
                "Slime Life\nSimulator",
                {
                    fontFamily: FONT_NAME.CP_PERIOD,
                    fontSize: UI_CONST.TITLE_TEXT_FONT_SIZE,
                    color: UI_CONST.TITLE_TEXT_COLOR,
                    align: "center",
                    stroke: UI_CONST.TITLE_TEXT_STROKE_COLOR,
                    strokeThickness: UI_CONST.TITLE_TEXT_STROKE_THICKNESS,
                }
            )
            .setOrigin(0.5, 0.5);

        // Button Y position
        const buttonY =
            COMMON_CONST.SCREEN_HEIGHT / 2 + UI_CONST.TITLE_BUTTON_Y_OFFSET;

        // New Game button
        const newGameButton = this.add
            .rectangle(
                COMMON_CONST.SCREEN_WIDTH / 2,
                buttonY,
                UI_CONST.TITLE_BUTTON_WIDTH,
                UI_CONST.TITLE_BUTTON_HEIGHT,
                UI_CONST.TITLE_BUTTON_BACKGROUND_COLOR
            )
            .setStrokeStyle(
                UI_CONST.TITLE_BUTTON_BORDER_WIDTH,
                UI_CONST.TITLE_BUTTON_BORDER_COLOR
            )
            .setInteractive({ useHandCursor: true });

        const newGameText = this.add
            .text(COMMON_CONST.SCREEN_WIDTH / 2, buttonY, "New Game", {
                fontFamily: FONT_NAME.CP_PERIOD,
                fontSize: UI_CONST.TITLE_BUTTON_TEXT_FONT_SIZE,
                color: UI_CONST.TITLE_BUTTON_TEXT_COLOR,
                align: "center",
                stroke: "#000000",
                strokeThickness: 3,
            })
            .setOrigin(0.5, 0.5);

        // Continue button
        const continueButton = this.add
            .rectangle(
                COMMON_CONST.SCREEN_WIDTH / 2,
                buttonY + UI_CONST.TITLE_BUTTON_SPACING,
                UI_CONST.TITLE_BUTTON_WIDTH,
                UI_CONST.TITLE_BUTTON_HEIGHT,
                UI_CONST.TITLE_BUTTON_BACKGROUND_COLOR
            )
            .setStrokeStyle(
                UI_CONST.TITLE_BUTTON_BORDER_WIDTH,
                UI_CONST.TITLE_BUTTON_BORDER_COLOR
            )
            .setInteractive({ useHandCursor: true });

        const continueText = this.add
            .text(
                COMMON_CONST.SCREEN_WIDTH / 2,
                buttonY + UI_CONST.TITLE_BUTTON_SPACING,
                "Continue",
                {
                    fontFamily: FONT_NAME.CP_PERIOD,
                    fontSize: UI_CONST.TITLE_BUTTON_TEXT_FONT_SIZE,
                    color: UI_CONST.TITLE_BUTTON_TEXT_COLOR,
                    align: "center",
                    stroke: "#000000",
                    strokeThickness: 3,
                }
            )
            .setOrigin(0.5, 0.5);

        // Store UI elements for fade-out animation
        this.titleElements = [
            overlay,
            titleText,
            newGameButton,
            newGameText,
            continueButton,
            continueText,
        ];

        // Button hover effects
        newGameButton.on("pointerover", () => {
            newGameButton.setFillStyle(UI_CONST.TITLE_BUTTON_HOVER_COLOR);
        });
        newGameButton.on("pointerout", () => {
            newGameButton.setFillStyle(UI_CONST.TITLE_BUTTON_BACKGROUND_COLOR);
        });

        continueButton.on("pointerover", () => {
            continueButton.setFillStyle(UI_CONST.TITLE_BUTTON_HOVER_COLOR);
        });
        continueButton.on("pointerout", () => {
            continueButton.setFillStyle(UI_CONST.TITLE_BUTTON_BACKGROUND_COLOR);
        });

        // Button click handlers
        newGameButton.on("pointerdown", () => {
            this.startGame();
        });

        continueButton.on("pointerdown", () => {
            this.startGame();
        });
    }

    startGame() {
        // Disable further interactions
        this.input.enabled = false;

        // Fade out all title elements
        this.tweens.add({
            targets: this.titleElements,
            alpha: 0,
            duration: UI_CONST.TITLE_FADE_DURATION,
            ease: "Linear",
            onComplete: () => {
                // タイトルシーンを停止し、ゲームシーンを再開
                this.scene.stop("Title");
                this.scene.resume("Game", {
                    from: "title",
                });
            },
        });
    }
}
