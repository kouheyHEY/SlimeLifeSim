import { COMMON_CONST, FONT_NAME } from "../const/CommonConst.js";

export class Title extends Phaser.Scene {
    constructor() {
        super("Title");
    }

    create() {
        // Title text
        const titleText = this.add
            .text(
                COMMON_CONST.SCREEN_WIDTH / 2,
                COMMON_CONST.SCREEN_HEIGHT / 3,
                "Slime Life Simulator",
                {
                    fontFamily: FONT_NAME.MELONANO,
                    fontSize: "64px",
                    color: "#FFFFFF",
                    align: "center",
                    stroke: "#000000",
                    strokeThickness: 4,
                }
            )
            .setOrigin(0.5, 0.5);

        // Button dimensions and positions
        const buttonWidth = 300;
        const buttonHeight = 60;
        const buttonSpacing = 80;
        const buttonY = COMMON_CONST.SCREEN_HEIGHT / 2 + 50;

        // New Game button
        const newGameButton = this.add
            .rectangle(
                COMMON_CONST.SCREEN_WIDTH / 2,
                buttonY,
                buttonWidth,
                buttonHeight,
                0x000000
            )
            .setStrokeStyle(3, 0xffffff)
            .setInteractive({ useHandCursor: true });

        const newGameText = this.add
            .text(
                COMMON_CONST.SCREEN_WIDTH / 2,
                buttonY,
                "New Game",
                {
                    fontFamily: FONT_NAME.MELONANO,
                    fontSize: "32px",
                    color: "#FFFFFF",
                    align: "center",
                }
            )
            .setOrigin(0.5, 0.5);

        // Continue button
        const continueButton = this.add
            .rectangle(
                COMMON_CONST.SCREEN_WIDTH / 2,
                buttonY + buttonSpacing,
                buttonWidth,
                buttonHeight,
                0x000000
            )
            .setStrokeStyle(3, 0xffffff)
            .setInteractive({ useHandCursor: true });

        const continueText = this.add
            .text(
                COMMON_CONST.SCREEN_WIDTH / 2,
                buttonY + buttonSpacing,
                "Continue",
                {
                    fontFamily: FONT_NAME.MELONANO,
                    fontSize: "32px",
                    color: "#FFFFFF",
                    align: "center",
                }
            )
            .setOrigin(0.5, 0.5);

        // Store UI elements for fade-out animation
        this.titleElements = [
            titleText,
            newGameButton,
            newGameText,
            continueButton,
            continueText,
        ];

        // Button hover effects
        newGameButton.on("pointerover", () => {
            newGameButton.setFillStyle(0x333333);
        });
        newGameButton.on("pointerout", () => {
            newGameButton.setFillStyle(0x000000);
        });

        continueButton.on("pointerover", () => {
            continueButton.setFillStyle(0x333333);
        });
        continueButton.on("pointerout", () => {
            continueButton.setFillStyle(0x000000);
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
            duration: 1000,
            ease: "Linear",
            onComplete: () => {
                // Transition to Game scene
                this.scene.start("Game");
            },
        });
    }
}
