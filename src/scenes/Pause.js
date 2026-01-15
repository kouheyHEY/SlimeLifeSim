import { UI_CONST, UI_TEXT } from "../const/UIConst.js";
import {
    FONT_NAME,
    getLocalizedText,
    getCurrentLanguage,
} from "../const/CommonConst.js";
import { Slider } from "../../core/ui/Slider.js";

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

        // Gameシーンの各種変化を停止（保険的に明示）
        if (this.gameScene) {
            this.gameScene.isPaused = true;
            this.gameScene.physics.pause();
            this.gameScene.tweens.pauseAll();
            if (this.gameScene.player && this.gameScene.player.anims) {
                this.gameScene.player.anims.pause();
            }
            if (this.gameScene.slimeAnimationTimer) {
                this.gameScene.slimeAnimationTimer.paused = true;
            }
        }

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
                    fontFamily: FONT_NAME.CP_PERIOD,
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
                    fontFamily: FONT_NAME.CP_PERIOD,
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

        // BGM音量スライダー
        const bgmSlider = new Slider(this, pauseContainer, {
            x: -UI_CONST.PAUSE_MODAL_WIDTH / 2 + 40,
            y: currentY,
            label: getLocalizedText(UI_TEXT.PAUSE_MODAL.BGM_VOLUME),
            value: this.gameScene.settingsManager.getBgmVolume(),
            fontFamily: FONT_NAME.CP_PERIOD,
            sliderWidth: UI_CONST.SLIDER_WIDTH,
            handleOffsetX: UI_CONST.SLIDER_HANDLE_OFFSET_X,
            percentOffsetX: UI_CONST.SLIDER_PERCENT_OFFSET_X,
            handleRadius: UI_CONST.SLIDER_HANDLE_RADIUS,
            // スタイル設定（ゲーム固有のスタイルをここで指定可能）
            style: {
                barBackgroundColor: 0x1a3a3a,
                barBorderColor: 0xffffff,
                barBorderWidth: 2,
                labelColor: "#ffff00",
                percentColor: "#ffffff",
            },
            onChange: (volume) => {
                this.gameScene.settingsManager.setBgmVolume(volume);
                if (this.gameScene.soundManager) {
                    this.gameScene.soundManager.setBgmVolume(volume);
                }
            },
        });
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
                fontFamily: FONT_NAME.CP_PERIOD,
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

        // セーブボタンを追加（OKボタンの上に配置）
        const saveButtonY = UI_CONST.PAUSE_MODAL_HEIGHT / 2 - 60 - 70;
        const saveButton = this.add
            .rectangle(0, saveButtonY, 200, 50, 0x3366ff)
            .setStrokeStyle(2, 0xffffff)
            .setInteractive({ useHandCursor: true });
        pauseContainer.add(saveButton);

        const saveText = this.add
            .text(0, saveButtonY, "Save", {
                fontFamily: FONT_NAME.CP_PERIOD,
                fontSize: "24px",
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 2,
            })
            .setOrigin(0.5);
        pauseContainer.add(saveText);

        saveButton.on("pointerdown", () => {
            // ゲームをセーブ
            if (this.gameScene && this.gameScene.saveGame) {
                const success = this.gameScene.saveGame();
                if (success) {
                    // セーブ成功のフィードバック
                    saveText.setText("Saved!");
                    this.time.delayedCall(1000, () => {
                        saveText.setText("Save");
                    });
                }
            }
        });

        saveButton.on("pointerover", () => {
            saveButton.setFillStyle(0x5588ff);
        });

        saveButton.on("pointerout", () => {
            saveButton.setFillStyle(0x3366ff);
        });
    }

    /**
     * トグルボタンを作成
     */
    createToggle(container, x, y, label, initialValue, callback) {
        const text = this.add
            .text(x, y, `${label}: ${initialValue ? "ON" : "OFF"}`, {
                fontFamily: FONT_NAME.CP_PERIOD,
                fontSize: "24px",
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
        // Gameシーンの停止を解除
        this.gameScene.isPaused = false;
        this.gameScene.physics.resume();
        this.gameScene.tweens.resumeAll();
        if (this.gameScene.player && this.gameScene.player.anims) {
            this.gameScene.player.anims.resume();
        }
        if (this.gameScene.slimeAnimationTimer) {
            this.gameScene.slimeAnimationTimer.paused = false;
        }
    }
}
