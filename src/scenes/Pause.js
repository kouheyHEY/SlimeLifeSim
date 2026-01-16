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
                UI_CONST.PAUSE_MODAL_OVERLAY_COLOR,
                UI_CONST.PAUSE_MODAL_OVERLAY_ALPHA
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
                UI_CONST.PAUSE_MODAL_BG_COLOR,
                UI_CONST.PAUSE_MODAL_BG_ALPHA
            )
            .setStrokeStyle(
                UI_CONST.PAUSE_MODAL_BORDER_WIDTH,
                UI_CONST.PAUSE_MODAL_BORDER_COLOR
            );
        pauseContainer.add(modalBg);

        // タイトル
        const title = this.add
            .text(
                0,
                -UI_CONST.PAUSE_MODAL_HEIGHT / 2 +
                    UI_CONST.PAUSE_MODAL_TITLE_Y_OFFSET,
                getLocalizedText(UI_TEXT.PAUSE_MODAL.TITLE),
                {
                    fontFamily: FONT_NAME.CP_PERIOD,
                    fontSize: UI_CONST.PAUSE_MODAL_TITLE_FONT_SIZE,
                    color: UI_CONST.PAUSE_MODAL_TITLE_COLOR,
                    stroke: UI_CONST.PAUSE_MODAL_TITLE_STROKE_COLOR,
                    strokeThickness:
                        UI_CONST.PAUSE_MODAL_TITLE_STROKE_THICKNESS,
                }
            )
            .setOrigin(0.5);
        pauseContainer.add(title);

        // ×ボタン
        const closeButton = this.add
            .text(
                UI_CONST.PAUSE_MODAL_WIDTH / 2 -
                    UI_CONST.PAUSE_MODAL_CLOSE_BUTTON_X_OFFSET,
                -UI_CONST.PAUSE_MODAL_HEIGHT / 2 +
                    UI_CONST.PAUSE_MODAL_CLOSE_BUTTON_Y_OFFSET,
                "×",
                {
                    fontFamily: FONT_NAME.CP_PERIOD,
                    fontSize: UI_CONST.PAUSE_MODAL_CLOSE_BUTTON_FONT_SIZE,
                    color: UI_CONST.PAUSE_MODAL_CLOSE_BUTTON_COLOR,
                    stroke: UI_CONST.PAUSE_MODAL_CLOSE_BUTTON_STROKE_COLOR,
                    strokeThickness:
                        UI_CONST.PAUSE_MODAL_CLOSE_BUTTON_STROKE_THICKNESS,
                }
            )
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });
        pauseContainer.add(closeButton);

        closeButton.on("pointerdown", () => {
            this.resumeGame();
        });

        closeButton.on("pointerover", () => {
            closeButton.setColor(UI_CONST.PAUSE_MODAL_CLOSE_BUTTON_HOVER_COLOR);
        });

        closeButton.on("pointerout", () => {
            closeButton.setColor(UI_CONST.PAUSE_MODAL_CLOSE_BUTTON_COLOR);
        });

        let currentY =
            -UI_CONST.PAUSE_MODAL_HEIGHT / 2 +
            UI_CONST.PAUSE_MODAL_SETTINGS_START_Y_OFFSET;
        const lineHeight = UI_CONST.PAUSE_MODAL_LINE_HEIGHT;

        // BGM音量スライダー
        const bgmSlider = new Slider(this, pauseContainer, {
            x:
                -UI_CONST.PAUSE_MODAL_WIDTH / 2 +
                UI_CONST.PAUSE_MODAL_SETTINGS_X_OFFSET,
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
                percentFontSize: "36px",
                labelFontSize: "36px",
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
                -UI_CONST.PAUSE_MODAL_WIDTH / 2 +
                    UI_CONST.PAUSE_MODAL_SETTINGS_X_OFFSET,
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
                UI_CONST.PAUSE_MODAL_HEIGHT / 2 -
                    UI_CONST.PAUSE_MODAL_RESUME_BUTTON_Y_OFFSET,
                UI_CONST.PAUSE_MODAL_RESUME_BUTTON_WIDTH,
                UI_CONST.PAUSE_MODAL_RESUME_BUTTON_HEIGHT,
                UI_CONST.PAUSE_MODAL_RESUME_BUTTON_COLOR
            )
            .setStrokeStyle(
                UI_CONST.PAUSE_MODAL_RESUME_BUTTON_BORDER_WIDTH,
                UI_CONST.PAUSE_MODAL_RESUME_BUTTON_BORDER_COLOR
            )
            .setInteractive({ useHandCursor: true });
        pauseContainer.add(resumeButton);

        const resumeText = this.add
            .text(
                0,
                UI_CONST.PAUSE_MODAL_HEIGHT / 2 -
                    UI_CONST.PAUSE_MODAL_RESUME_BUTTON_Y_OFFSET,
                "OK",
                {
                    fontFamily: FONT_NAME.CP_PERIOD,
                    fontSize: UI_CONST.PAUSE_MODAL_RESUME_BUTTON_TEXT_FONT_SIZE,
                    color: UI_CONST.PAUSE_MODAL_RESUME_BUTTON_TEXT_COLOR,
                    stroke: UI_CONST.PAUSE_MODAL_TITLE_STROKE_COLOR,
                    strokeThickness:
                        UI_CONST.PAUSE_MODAL_RESUME_BUTTON_TEXT_STROKE_THICKNESS,
                }
            )
            .setOrigin(0.5);
        pauseContainer.add(resumeText);

        resumeButton.on("pointerdown", () => {
            this.resumeGame();
        });

        resumeButton.on("pointerover", () => {
            resumeButton.setFillStyle(
                UI_CONST.PAUSE_MODAL_RESUME_BUTTON_HOVER_COLOR
            );
        });

        resumeButton.on("pointerout", () => {
            resumeButton.setFillStyle(UI_CONST.PAUSE_MODAL_RESUME_BUTTON_COLOR);
        });

        // セーブボタンを追加（OKボタンの上に配置）
        const saveButtonY =
            UI_CONST.PAUSE_MODAL_HEIGHT / 2 -
            UI_CONST.PAUSE_MODAL_RESUME_BUTTON_Y_OFFSET -
            UI_CONST.PAUSE_MODAL_SAVE_BUTTON_Y_OFFSET;
        const saveButton = this.add
            .rectangle(
                0,
                saveButtonY,
                UI_CONST.PAUSE_MODAL_SAVE_BUTTON_WIDTH,
                UI_CONST.PAUSE_MODAL_SAVE_BUTTON_HEIGHT,
                UI_CONST.PAUSE_MODAL_SAVE_BUTTON_COLOR
            )
            .setStrokeStyle(
                UI_CONST.PAUSE_MODAL_SAVE_BUTTON_BORDER_WIDTH,
                UI_CONST.PAUSE_MODAL_SAVE_BUTTON_BORDER_COLOR
            )
            .setInteractive({ useHandCursor: true });
        pauseContainer.add(saveButton);

        const saveText = this.add
            .text(0, saveButtonY, "Save", {
                fontFamily: FONT_NAME.CP_PERIOD,
                fontSize: UI_CONST.PAUSE_MODAL_SAVE_BUTTON_TEXT_FONT_SIZE,
                color: UI_CONST.PAUSE_MODAL_SAVE_BUTTON_TEXT_COLOR,
                stroke: UI_CONST.PAUSE_MODAL_TITLE_STROKE_COLOR,
                strokeThickness:
                    UI_CONST.PAUSE_MODAL_SAVE_BUTTON_TEXT_STROKE_THICKNESS,
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
            saveButton.setFillStyle(
                UI_CONST.PAUSE_MODAL_SAVE_BUTTON_HOVER_COLOR
            );
        });

        saveButton.on("pointerout", () => {
            saveButton.setFillStyle(UI_CONST.PAUSE_MODAL_SAVE_BUTTON_COLOR);
        });
    }

    /**
     * トグルボタンを作成
     */
    createToggle(container, x, y, label, initialValue, callback) {
        const text = this.add
            .text(x, y, `${label}: ${initialValue ? "ON" : "OFF"}`, {
                fontFamily: FONT_NAME.CP_PERIOD,
                fontSize: UI_CONST.PAUSE_MODAL_SETTINGS_FONT_SIZE,
                color: UI_CONST.PAUSE_MODAL_SETTINGS_TEXT_COLOR,
                stroke: UI_CONST.PAUSE_MODAL_SETTINGS_STROKE_COLOR,
                strokeThickness: UI_CONST.PAUSE_MODAL_SETTINGS_STROKE_THICKNESS,
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
            text.setColor(UI_CONST.PAUSE_MODAL_SETTINGS_HOVER_COLOR);
        });

        text.on("pointerout", () => {
            text.setColor(UI_CONST.PAUSE_MODAL_SETTINGS_TEXT_COLOR);
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
