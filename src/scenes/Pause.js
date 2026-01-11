import { UI_CONST, UI_TEXT } from "../const/UIConst.js";
import {
    FONT_NAME,
    getLocalizedText,
    getCurrentLanguage,
} from "../const/CommonConst.js";

/**
 * 一時停止シーン
 * ゲームを一時停止し、設定を表示
 */
export class Pause extends Phaser.Scene {
    constructor() {
        super("Pause");
    }

    create() {
        // Gameシーンの参照を取得
        this.gameScene = this.scene.get("Game");

        // 背景全体にオーバーレイをかける
        const overlay = this.add
            .rectangle(
                0,
                0,
                this.cameras.main.width,
                this.cameras.main.height,
                0x000000,
                0.7
            )
            .setOrigin(0, 0);

        // モーダル用のコンテナを作成
        const pauseContainer = this.add.container(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2
        );

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
                    stroke: "#000000",
                    strokeThickness: 1,
                }
            )
            .setOrigin(0.5);
        pauseContainer.add(title);

        // ×ボタン
        const closeButton = this.add
            .text(
                UI_CONST.PAUSE_MODAL_WIDTH / 2 - 40,
                -UI_CONST.PAUSE_MODAL_HEIGHT / 2 + 40,
                "×",
                {
                    fontFamily: FONT_NAME.MELONANO,
                    fontSize: "48px",
                    color: "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 1,
                }
            )
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });
        pauseContainer.add(closeButton);

        closeButton.on("pointerdown", () => {
            this.resumeGame();
        });

        closeButton.on("pointerover", () => {
            closeButton.setColor("#ff0000");
        });

        closeButton.on("pointerout", () => {
            closeButton.setColor("#ffffff");
        });

        let currentY = -UI_CONST.PAUSE_MODAL_HEIGHT / 2 + 100;
        const lineHeight = 50;

        // BGM音量スライダー（簡易版：クリックで切り替え）
        const bgmText = this.add
            .text(
                -UI_CONST.PAUSE_MODAL_WIDTH / 2 + 40,
                currentY,
                `${getLocalizedText(
                    UI_TEXT.PAUSE_MODAL.BGM_VOLUME
                )}: ${Math.round(
                    this.gameScene.settingsManager.getBgmVolume() * 100
                )}%`,
                {
                    fontFamily: FONT_NAME.MELONANO,
                    fontSize: "20px",
                    color: "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 1,
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
                )}: ${Math.round(
                    this.gameScene.settingsManager.getSeVolume() * 100
                )}%`,
                {
                    fontFamily: FONT_NAME.MELONANO,
                    fontSize: "20px",
                    color: "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 1,
                }
            )
            .setOrigin(0, 0.5);
        pauseContainer.add(seText);
        currentY += lineHeight;

        // 背景色変化トグル
        this.createToggle(
            pauseContainer,
            -UI_CONST.PAUSE_MODAL_WIDTH / 2 + 40,
            currentY,
            getLocalizedText(UI_TEXT.PAUSE_MODAL.BACKGROUND_COLOR),
            this.gameScene.settingsManager.isBackgroundColorChangeEnabled(),
            (enabled) => {
                this.gameScene.settingsManager.setBackgroundColorChange(
                    enabled
                );
            }
        );
        currentY += lineHeight;

        // プレイヤーアニメーショントグル
        this.createToggle(
            pauseContainer,
            -UI_CONST.PAUSE_MODAL_WIDTH / 2 + 40,
            currentY,
            getLocalizedText(UI_TEXT.PAUSE_MODAL.PLAYER_ANIMATION),
            this.gameScene.settingsManager.isPlayerAnimationEnabled(),
            (enabled) => {
                this.gameScene.settingsManager.setPlayerAnimation(enabled);
            }
        );
        currentY += lineHeight;

        // ステータス変化トグル
        this.createToggle(
            pauseContainer,
            -UI_CONST.PAUSE_MODAL_WIDTH / 2 + 40,
            currentY,
            getLocalizedText(UI_TEXT.PAUSE_MODAL.STATUS_CHANGE),
            this.gameScene.settingsManager.isStatusChangeEnabled(),
            (enabled) => {
                this.gameScene.settingsManager.setStatusChange(enabled);
            }
        );
        currentY += lineHeight;

        // 自動釣りトグル（アップグレードがある場合のみ）
        if (this.gameScene.upgradeManager.isAutoFishingEnabled()) {
            this.createToggle(
                pauseContainer,
                -UI_CONST.PAUSE_MODAL_WIDTH / 2 + 40,
                currentY,
                getLocalizedText(UI_TEXT.PAUSE_MODAL.AUTO_FISHING),
                this.gameScene.settingsManager.isAutoFishingEnabled(),
                (enabled) => {
                    this.gameScene.settingsManager.setAutoFishing(enabled);
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
            .text(0, UI_CONST.PAUSE_MODAL_HEIGHT / 2 - 60, "OK", {
                fontFamily: FONT_NAME.MELONANO,
                fontSize: "24px",
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 2,
            })
            .setOrigin(0.5);
        pauseContainer.add(resumeText);

        resumeButton.on("pointerdown", () => {
            this.resumeGame();
        });

        resumeButton.on("pointerover", () => {
            resumeButton.setFillStyle(0x00ff00);
        });

        resumeButton.on("pointerout", () => {
            resumeButton.setFillStyle(0x00cc00);
        });
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
                stroke: "#000000",
                strokeThickness: 1,
            })
            .setOrigin(0, 0.5)
            .setInteractive({ useHandCursor: true });

        text.on("pointerdown", () => {
            const newValue = !initialValue;
            initialValue = newValue;
            text.setText(`${label}: ${newValue ? "ON" : "OFF"}`);
            callback(newValue);
        });

        text.on("pointerover", () => {
            text.setColor("#ffff00");
        });

        text.on("pointerout", () => {
            text.setColor("#ffffff");
        });

        container.add(text);
        return text;
    }

    /**
     * ゲームを再開
     */
    resumeGame() {
        this.scene.stop();
        this.scene.resume("Game");
        // ゲーム時間を再開
        this.gameScene.gameTimeManager.resume();
    }
}
