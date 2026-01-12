import { COMMON_CONST, FONT_NAME } from "../../src/const/CommonConst.js";

/**
 * モーダルダイアログクラス
 * 汎用的なモーダル表示機能を提供
 */
export class Modal {
    /**
     * モーダルを作成
     * @param {Phaser.Scene} scene - モーダルを表示するシーン
     * @param {Object} config - モーダルの設定
     * @param {string} config.title - モーダルのタイトル（オプション）
     * @param {string} config.message - モーダルのメッセージ
     * @param {Array<{text: string, callback: Function, style?: Object}>} config.buttons - ボタンの配列
     * @param {Object} config.modalStyle - モーダルのスタイル設定（オプション）
     * @param {number} config.width - モーダルの幅（デフォルト: 600）
     * @param {number} config.height - モーダルの高さ（デフォルト: 400）
     * @param {boolean} config.closeOnClickOutside - 外側クリックで閉じるか（デフォルト: false）
     * @param {Object} config.image - 画像表示設定（オプション）
     * @param {string} config.image.key - スプライトシートのキー
     * @param {number} config.image.frame - 表示するフレーム番号（デフォルト: 0）
     * @param {number} config.image.scale - 画像のスケール（デフォルト: 1）
     * @param {number} config.image.frameRate - アニメーションのフレームレート（デフォルト: 10）
     * @param {number} config.image.y - 画像のY座標オフセット（オプション）
     * @param {string|Object} config.keyLabel - 画像の下に表示するキーラベル（文字列またはオブジェクト）
     * @param {string} config.keyLabel.icon - アイコンテクスチャのキー（オプション）
     * @param {number} config.keyLabel.iconFrame - アイコンのフレーム番号（オプション）
     * @param {number} config.keyLabel.iconScale - アイコンのスケール（オプション、デフォルト: 1）
     * @param {string} config.keyLabel.text - 表示するテキスト
     */
    constructor(scene, config) {
        this.scene = scene;
        this.config = {
            title: config.title || "",
            message: config.message || "",
            buttons: config.buttons || [],
            width: config.width || 600,
            height: config.height || 400,
            closeOnClickOutside: config.closeOnClickOutside || false,
            modalStyle: config.modalStyle || {},
            image: config.image || null,
            keyLabel: config.keyLabel || null,
            x: config.x,
            y: config.y,
            messageAlignTop: config.messageAlignTop || false,
        };

        this.container = null;
        this.overlay = null;
        this.isVisible = false;
    }

    /**
     * モーダルを表示
     */
    show() {
        if (this.isVisible) return;

        this.isVisible = true;

        // オーバーレイ（背景）
        this.overlay = this.scene.add.rectangle(
            0,
            0,
            COMMON_CONST.SCREEN_WIDTH,
            COMMON_CONST.SCREEN_HEIGHT,
            0x000000,
            0.7
        );
        this.overlay.setOrigin(0, 0);
        this.overlay.setScrollFactor(0);
        this.overlay.setDepth(2000);
        this.overlay.setInteractive();

        // 外側クリックで閉じる設定
        if (this.config.closeOnClickOutside) {
            this.overlay.on("pointerdown", () => {
                this.close();
            });
        }

        // モーダルコンテナ（Y座標をカスタマイズ可能に）
        const containerX =
            this.config.x !== undefined
                ? this.config.x
                : COMMON_CONST.SCREEN_WIDTH / 2;
        const containerY =
            this.config.y !== undefined
                ? this.config.y
                : COMMON_CONST.SCREEN_HEIGHT / 2;

        this.container = this.scene.add.container(containerX, containerY);
        this.container.setScrollFactor(0);
        this.container.setDepth(2001);

        // モーダル背景
        const modalBg = this.scene.add.rectangle(
            0,
            0,
            this.config.width,
            this.config.height,
            this.config.modalStyle.backgroundColor || 0x222222,
            this.config.modalStyle.backgroundAlpha || 0.95
        );
        modalBg.setStrokeStyle(
            this.config.modalStyle.borderWidth || 4,
            this.config.modalStyle.borderColor || 0xffffff
        );
        this.container.add(modalBg);

        let currentY = -this.config.height / 2 + 40;

        // タイトル表示
        if (this.config.title) {
            const titleText = this.scene.add.text(
                0,
                currentY,
                this.config.title,
                {
                    fontFamily:
                        this.config.modalStyle.titleFontFamily ||
                        FONT_NAME.CHECKPOINT,
                    fontSize: this.config.modalStyle.titleFontSize || "36px",
                    color: this.config.modalStyle.titleColor || "#ffff00",
                    stroke: this.config.modalStyle.titleStroke || "#000000",
                    strokeThickness:
                        this.config.modalStyle.titleStrokeThickness || 6,
                    align: "center",
                    wordWrap: { width: this.config.width - 80 },
                }
            );
            titleText.setOrigin(0.5);
            this.container.add(titleText);
            currentY += 60;
        }

        // 画像表示（スプライトシート）
        if (this.config.image) {
            const imageY =
                this.config.image.y !== undefined
                    ? this.config.image.y
                    : currentY;

            // テクスチャのフレーム数を確認
            const texture = this.scene.textures.get(this.config.image.key);
            const frameNames = texture.getFrameNames();
            const hasMultipleFrames = frameNames.length > 1;

            console.log(
                `Modal image: ${this.config.image.key}, frames: ${frameNames.length}, hasMultiple: ${hasMultipleFrames}`
            );

            const imageSprite = this.scene.add.sprite(
                0,
                imageY,
                this.config.image.key,
                this.config.image.frame || 0
            );
            imageSprite.setScale(this.config.image.scale || 1);
            this.container.add(imageSprite);

            // スプライトシートの場合のみアニメーション設定（ループ再生）
            if (hasMultipleFrames) {
                const animKey = `${this.config.image.key}_modal_anim`;
                if (!this.scene.anims.exists(animKey)) {
                    const frames = this.scene.anims.generateFrameNumbers(
                        this.config.image.key,
                        { start: 0, end: -1 }
                    );
                    this.scene.anims.create({
                        key: animKey,
                        frames: frames,
                        frameRate: this.config.image.frameRate || 10,
                        repeat: -1, // 無限ループ
                    });
                }
                console.log(`Playing animation: ${animKey}`);
                imageSprite.play(animKey);
            } else {
                console.log(
                    `Skipping animation for single frame image: ${this.config.image.key}`
                );
            }

            currentY += imageSprite.displayHeight * 0.5 + 20;

            // キーラベル表示
            if (this.config.keyLabel) {
                const keyBoxY = imageY + imageSprite.displayHeight * 0.5 + 35;

                // キーボックスコンテナ（アニメーション用）
                const keyContainer = this.scene.add.container(0, keyBoxY);
                this.container.add(keyContainer);

                // keyLabelが文字列の場合は従来の表示
                if (typeof this.config.keyLabel === "string") {
                    const keyBoxWidth = 120;
                    const keyBoxHeight = 50;

                    // キーボックス背景
                    const keyBox = this.scene.add.rectangle(
                        0,
                        0,
                        keyBoxWidth,
                        keyBoxHeight,
                        0x333333,
                        1
                    );
                    keyBox.setStrokeStyle(3, 0xffffff);
                    keyContainer.add(keyBox);

                    // キーテキスト
                    const keyText = this.scene.add.text(
                        0,
                        0,
                        this.config.keyLabel,
                        {
                            fontFamily: FONT_NAME.CHECKPOINT,
                            fontSize: "24px",
                            color: "#ffffff",
                            stroke: "#000000",
                            strokeThickness: 4,
                        }
                    );
                    keyText.setOrigin(0.5);
                    keyContainer.add(keyText);
                } else {
                    // keyLabelがオブジェクトの場合はアイコン+テキスト表示
                    const labelConfig = this.config.keyLabel;
                    let currentX = 0;

                    // アイコン表示
                    if (labelConfig.icon) {
                        const iconSprite = this.scene.add.sprite(
                            currentX,
                            0,
                            labelConfig.icon,
                            labelConfig.iconFrame || 0
                        );
                        iconSprite.setScale(labelConfig.iconScale || 1);
                        keyContainer.add(iconSprite);
                        currentX += iconSprite.displayWidth / 2 + 10;
                    }

                    // テキスト表示
                    if (labelConfig.text) {
                        const keyText = this.scene.add.text(
                            currentX,
                            0,
                            labelConfig.text,
                            {
                                fontFamily: FONT_NAME.CHECKPOINT,
                                fontSize: "32px",
                                color: "#ffffff",
                                stroke: "#000000",
                                strokeThickness: 4,
                            }
                        );
                        keyText.setOrigin(0, 0.5);
                        keyContainer.add(keyText);
                    }

                    // コンテナの位置を中央に調整
                    const bounds = keyContainer.getBounds();
                    keyContainer.x = -bounds.width / 2;
                }

                // 離散的な切り替えアニメーション（押されている感）
                // tweenとholdを使って2つの状態を切り替え
                this.scene.tweens.add({
                    targets: keyContainer,
                    y: keyBoxY + 6,
                    alpha: 0.7,
                    duration: 0,
                    hold: 300,
                    yoyo: true,
                    repeat: -1,
                    repeatDelay: 300,
                });
            }
        }

        // メッセージ表示
        const messageText = this.scene.add.text(
            0,
            currentY,
            this.config.message,
            {
                fontFamily:
                    this.config.modalStyle.messageFontFamily ||
                    FONT_NAME.CHECKPOINT,
                fontSize: this.config.modalStyle.messageFontSize || "24px",
                color: this.config.modalStyle.messageColor || "#ffffff",
                stroke: this.config.modalStyle.messageStroke || "#000000",
                strokeThickness:
                    this.config.modalStyle.messageStrokeThickness || 4,
                align: "center",
                wordWrap: { width: this.config.width - 80 },
                lineSpacing: this.config.modalStyle.lineSpacing || 8,
            }
        );
        // 上揃えオプションの場合は上端を基準に配置
        if (this.config.messageAlignTop) {
            messageText.setOrigin(0.5, 0);
        } else {
            messageText.setOrigin(0.5);
        }
        this.container.add(messageText);

        // メッセージの高さを考慮してボタンの位置を調整
        const messageHeight = messageText.height;
        currentY = this.config.height / 2 - 40;

        // ボタン表示
        if (this.config.buttons.length > 0) {
            const buttonSpacing = 20;
            const totalButtonWidth =
                this.config.buttons.length * 200 +
                (this.config.buttons.length - 1) * buttonSpacing;
            let buttonX = -totalButtonWidth / 2 + 100;

            this.config.buttons.forEach((buttonConfig) => {
                const button = this.createButton(
                    buttonX,
                    currentY,
                    buttonConfig
                );
                this.container.add(button);
                buttonX += 200 + buttonSpacing;
            });
        }

        // フェードインアニメーション
        this.overlay.setAlpha(0);
        this.container.setAlpha(0);
        this.container.setScale(0.8);

        this.scene.tweens.add({
            targets: this.overlay,
            alpha: 0.7,
            duration: 200,
            ease: "Power2",
        });

        this.scene.tweens.add({
            targets: this.container,
            alpha: 1,
            scale: 1,
            duration: 300,
            ease: "Back.easeOut",
        });
    }

    /**
     * ボタンを作成
     * @param {number} x - X座標
     * @param {number} y - Y座標
     * @param {Object} buttonConfig - ボタンの設定
     * @returns {Phaser.GameObjects.Container} ボタンコンテナ
     */
    createButton(x, y, buttonConfig) {
        const buttonContainer = this.scene.add.container(x, y);

        const buttonStyle = buttonConfig.style || {};
        const buttonWidth = buttonStyle.width || 180;
        const buttonHeight = buttonStyle.height || 60;

        // ボタン背景
        const buttonBg = this.scene.add.rectangle(
            0,
            0,
            buttonWidth,
            buttonHeight,
            buttonStyle.backgroundColor || 0x4444ff,
            buttonStyle.backgroundAlpha || 1
        );
        buttonBg.setStrokeStyle(
            buttonStyle.borderWidth || 3,
            buttonStyle.borderColor || 0xffffff
        );
        buttonBg.setInteractive({ useHandCursor: true });
        buttonContainer.add(buttonBg);

        // ボタンテキスト
        const buttonText = this.scene.add.text(0, 0, buttonConfig.text, {
            fontFamily: buttonStyle.fontFamily || FONT_NAME.CHECKPOINT,
            fontSize: buttonStyle.fontSize || "28px",
            color: buttonStyle.color || "#ffffff",
            stroke: buttonStyle.stroke || "#000000",
            strokeThickness: buttonStyle.strokeThickness || 4,
        });
        buttonText.setOrigin(0.5);
        buttonContainer.add(buttonText);

        // ボタンイベント
        buttonBg.on("pointerdown", () => {
            // クリックアニメーション
            this.scene.tweens.add({
                targets: buttonContainer,
                scale: 0.95,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                    if (buttonConfig.callback) {
                        buttonConfig.callback();
                    }
                    if (buttonConfig.closeOnClick !== false) {
                        this.close();
                    }
                },
            });
        });

        buttonBg.on("pointerover", () => {
            buttonBg.setFillStyle(buttonStyle.hoverColor || 0x6666ff);
            this.scene.tweens.add({
                targets: buttonContainer,
                scale: 1.05,
                duration: 100,
            });
        });

        buttonBg.on("pointerout", () => {
            buttonBg.setFillStyle(buttonStyle.backgroundColor || 0x4444ff);
            this.scene.tweens.add({
                targets: buttonContainer,
                scale: 1,
                duration: 100,
            });
        });

        return buttonContainer;
    }

    /**
     * モーダルを閉じる
     */
    close() {
        if (!this.isVisible) return;

        this.isVisible = false;

        // フェードアウトアニメーション
        this.scene.tweens.add({
            targets: this.overlay,
            alpha: 0,
            duration: 200,
            ease: "Power2",
        });

        this.scene.tweens.add({
            targets: this.container,
            alpha: 0,
            scale: 0.8,
            duration: 200,
            ease: "Power2",
            onComplete: () => {
                this.destroy();
            },
        });
    }

    /**
     * モーダルを破棄
     */
    destroy() {
        if (this.overlay) {
            this.overlay.destroy();
            this.overlay = null;
        }
        if (this.container) {
            this.container.destroy();
            this.container = null;
        }
        this.isVisible = false;
    }

    /**
     * モーダルが表示中かどうか
     * @returns {boolean}
     */
    isShowing() {
        return this.isVisible;
    }
}
