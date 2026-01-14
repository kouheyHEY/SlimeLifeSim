/**
 * スライダーコンポーネント
 * 汎用的なスライダー機能を提供
 */
export class Slider {
    /**
     * スライダーを作成
     * @param {Phaser.Scene} scene - スライダーを追加するシーン
     * @param {Phaser.GameObjects.Container} container - スライダーを追加するコンテナ
     * @param {Object} config - スライダーの設定
     * @param {number} config.x - X座標（ラベルの位置）
     * @param {number} config.y - Y座標
     * @param {string} config.label - ラベルテキスト
     * @param {number} config.value - 初期値（0.0-1.0）
     * @param {Function} config.onChange - 値変更時のコールバック関数
     * @param {string} config.fontFamily - フォントファミリー（デフォルト: "Arial"）
     * @param {number} config.sliderWidth - スライダーの幅（デフォルト: 140）
     * @param {number} config.handleOffsetX - つまみのX座標オフセット（デフォルト: 200）
     * @param {number} config.percentOffsetX - パーセンテージ表示のX座標オフセット（デフォルト: 320）
     * @param {number} config.handleRadius - つまみの半径（デフォルト: 10）
     * @param {number} config.handleColor - つまみの色（デフォルト: 0x00ff00）
     * @param {boolean} config.showPercent - パーセンテージ表示（デフォルト: true）
     * @param {Object} config.style - スタイル設定（オプション）
     * @param {number} config.style.barBackgroundColor - スライダーバー背景色（デフォルト: 0x444444）
     * @param {number} config.style.barBorderColor - スライダーバー枠線色（デフォルト: 0xffffff）
     * @param {number} config.style.barBorderWidth - スライダーバー枠線幅（デフォルト: 2）
     * @param {number} config.style.barHeight - スライダーバー高さ（デフォルト: 8）
     * @param {number} config.style.labelFontSize - ラベルフォントサイズ（デフォルト: "24px"）
     * @param {string} config.style.labelColor - ラベル色（デフォルト: "#ffffff"）
     * @param {string} config.style.labelStroke - ラベルストローク色（デフォルト: "#000000"）
     * @param {number} config.style.labelStrokeThickness - ラベルストローク幅（デフォルト: 1）
     * @param {string} config.style.percentFontSize - パーセンテージフォントサイズ（デフォルト: "20px"）
     * @param {string} config.style.percentColor - パーセンテージ色（デフォルト: "#ffffff"）
     * @param {string} config.style.percentStroke - パーセンテージストローク色（デフォルト: "#000000"）
     * @param {number} config.style.percentStrokeThickness - パーセンテージストローク幅（デフォルト: 1）
     * @param {number} config.style.handleStrokeColor - つまみストローク色（デフォルト: 0xffffff）
     * @param {number} config.style.handleStrokeWidth - つまみストローク幅（デフォルト: 2）
     */
    constructor(scene, container, config) {
        this.scene = scene;
        this.container = container;

        // 設定
        this.config = {
            x: config.x,
            y: config.y,
            label: config.label || "",
            value: Math.max(0, Math.min(1, config.value || 0.5)),
            onChange: config.onChange || (() => {}),
            fontFamily: config.fontFamily || "Arial",
            sliderWidth: config.sliderWidth ?? 140,
            handleOffsetX: config.handleOffsetX ?? 200,
            percentOffsetX: config.percentOffsetX ?? 320,
            handleRadius: config.handleRadius ?? 10,
            handleColor: config.handleColor ?? 0x00ff00,
            showPercent: config.showPercent ?? true,
        };

        // スタイル設定
        this.style = {
            barBackgroundColor: config.style?.barBackgroundColor ?? 0x444444,
            barBorderColor: config.style?.barBorderColor ?? 0xffffff,
            barBorderWidth: config.style?.barBorderWidth ?? 2,
            barHeight: config.style?.barHeight ?? 8,
            labelFontSize: config.style?.labelFontSize ?? "24px",
            labelColor: config.style?.labelColor ?? "#ffffff",
            labelStroke: config.style?.labelStroke ?? "#000000",
            labelStrokeThickness: config.style?.labelStrokeThickness ?? 1,
            percentFontSize: config.style?.percentFontSize ?? "20px",
            percentColor: config.style?.percentColor ?? "#ffffff",
            percentStroke: config.style?.percentStroke ?? "#000000",
            percentStrokeThickness: config.style?.percentStrokeThickness ?? 1,
            handleStrokeColor: config.style?.handleStrokeColor ?? 0xffffff,
            handleStrokeWidth: config.style?.handleStrokeWidth ?? 2,
        };

        // コンポーネント
        this.labelText = null;
        this.sliderBg = null;
        this.sliderHandle = null;
        this.percentText = null;

        // ドラッグ状態
        this.isDragging = false;

        this.create();
    }

    /**
     * スライダーを作成
     */
    create() {
        const {
            x,
            y,
            label,
            value,
            fontFamily,
            sliderWidth,
            handleOffsetX,
            percentOffsetX,
            handleRadius,
            handleColor,
            showPercent,
        } = this.config;

        // ラベル
        this.labelText = this.scene.add
            .text(x, y, label, {
                fontFamily: fontFamily,
                fontSize: this.style.labelFontSize,
                color: this.style.labelColor,
                stroke: this.style.labelStroke,
                strokeThickness: this.style.labelStrokeThickness,
            })
            .setOrigin(0, 0.5);
        this.container.add(this.labelText);

        // スライダーバーの背景
        this.sliderBg = this.scene.add
            .rectangle(
                x + handleOffsetX,
                y,
                sliderWidth,
                this.style.barHeight,
                this.style.barBackgroundColor
            )
            .setStrokeStyle(
                this.style.barBorderWidth,
                this.style.barBorderColor
            )
            .setOrigin(0.5, 0.5);
        this.container.add(this.sliderBg);

        // スライダーつまみ
        this.sliderHandle = this.scene.add
            .circle(
                x + handleOffsetX - sliderWidth / 2 + value * sliderWidth,
                y,
                handleRadius,
                handleColor
            )
            .setStrokeStyle(
                this.style.handleStrokeWidth,
                this.style.handleStrokeColor
            )
            .setOrigin(0.5, 0.5)
            .setInteractive({ useHandCursor: true });
        this.container.add(this.sliderHandle);

        // パーセンテージ表示
        if (showPercent) {
            this.percentText = this.scene.add
                .text(x + percentOffsetX, y, `${Math.round(value * 100)}%`, {
                    fontFamily: fontFamily,
                    fontSize: this.style.percentFontSize,
                    color: this.style.percentColor,
                    stroke: this.style.percentStroke,
                    strokeThickness: this.style.percentStrokeThickness,
                })
                .setOrigin(0, 0.5);
            this.container.add(this.percentText);
        }

        this.setupEventListeners();
    }

    /**
     * イベントリスナーを設定
     */
    setupEventListeners() {
        this.sliderHandle.on("pointerdown", () => {
            this.isDragging = true;
        });

        this.scene.input.on("pointerup", () => {
            this.isDragging = false;
        });

        this.scene.input.on("pointermove", (pointer) => {
            if (!this.isDragging) return;

            this.updateValue(pointer);
        });
    }

    /**
     * スライダーの値を更新
     * @param {Phaser.Input.Pointer} pointer - ポインターオブジェクト
     */
    updateValue(pointer) {
        const { x, sliderWidth, handleOffsetX } = this.config;

        // コンテナの相対座標に変換
        const containerX = pointer.x - this.container.x;

        // スライダーバーの範囲内で、つまみを動かす
        const minX = x + handleOffsetX - sliderWidth / 2;
        const maxX = x + handleOffsetX + sliderWidth / 2;
        const clampedX = Math.max(minX, Math.min(maxX, containerX));

        this.sliderHandle.setX(clampedX);

        // 値を計算（0.0-1.0）
        const value = (clampedX - minX) / sliderWidth;
        this.config.value = value;

        // 表示を更新
        if (this.percentText) {
            this.percentText.setText(`${Math.round(value * 100)}%`);
        }

        // コールバック実行
        this.config.onChange(value);
    }

    /**
     * スライダーのスタイルを更新
     * @param {Object} styleUpdates - 更新するスタイルプロパティ
     * @param {number} styleUpdates.barBackgroundColor - スライダーバー背景色
     * @param {number} styleUpdates.barBorderColor - スライダーバー枠線色
     * @param {number} styleUpdates.barBorderWidth - スライダーバー枠線幅
     * @param {number} styleUpdates.barHeight - スライダーバー高さ
     * @param {string} styleUpdates.labelFontSize - ラベルフォントサイズ
     * @param {string} styleUpdates.labelColor - ラベル色
     * @param {string} styleUpdates.labelStroke - ラベルストローク色
     * @param {number} styleUpdates.labelStrokeThickness - ラベルストローク幅
     * @param {string} styleUpdates.percentFontSize - パーセンテージフォントサイズ
     * @param {string} styleUpdates.percentColor - パーセンテージ色
     * @param {string} styleUpdates.percentStroke - パーセンテージストローク色
     * @param {number} styleUpdates.percentStrokeThickness - パーセンテージストローク幅
     * @param {number} styleUpdates.handleStrokeColor - つまみストローク色
     * @param {number} styleUpdates.handleStrokeWidth - つまみストローク幅
     */
    setStyle(styleUpdates) {
        // スタイルを更新
        Object.assign(this.style, styleUpdates);

        // GameObjectsに反映させる
        if (this.labelText && styleUpdates.labelColor) {
            this.labelText.setColor(styleUpdates.labelColor);
        }
        if (this.labelText && styleUpdates.labelFontSize) {
            this.labelText.setFontSize(styleUpdates.labelFontSize);
        }
        if (
            this.labelText &&
            (styleUpdates.labelStroke || styleUpdates.labelStrokeThickness)
        ) {
            this.labelText.setStroke(
                styleUpdates.labelStroke || this.style.labelStroke,
                styleUpdates.labelStrokeThickness ||
                    this.style.labelStrokeThickness
            );
        }

        if (this.sliderBg && styleUpdates.barBackgroundColor) {
            this.sliderBg.setFillStyle(styleUpdates.barBackgroundColor);
        }
        if (
            this.sliderBg &&
            (styleUpdates.barBorderColor || styleUpdates.barBorderWidth)
        ) {
            this.sliderBg.setStrokeStyle(
                styleUpdates.barBorderWidth ?? this.style.barBorderWidth,
                styleUpdates.barBorderColor ?? this.style.barBorderColor
            );
        }
        if (this.sliderBg && styleUpdates.barHeight) {
            this.sliderBg.setDisplaySize(
                this.sliderBg.width,
                styleUpdates.barHeight
            );
        }

        if (this.sliderHandle && styleUpdates.handleColor) {
            this.sliderHandle.setFillStyle(styleUpdates.handleColor);
        }
        if (
            this.sliderHandle &&
            (styleUpdates.handleStrokeColor || styleUpdates.handleStrokeWidth)
        ) {
            this.sliderHandle.setStrokeStyle(
                styleUpdates.handleStrokeWidth ?? this.style.handleStrokeWidth,
                styleUpdates.handleStrokeColor ?? this.style.handleStrokeColor
            );
        }

        if (this.percentText && styleUpdates.percentColor) {
            this.percentText.setColor(styleUpdates.percentColor);
        }
        if (this.percentText && styleUpdates.percentFontSize) {
            this.percentText.setFontSize(styleUpdates.percentFontSize);
        }
        if (
            this.percentText &&
            (styleUpdates.percentStroke || styleUpdates.percentStrokeThickness)
        ) {
            this.percentText.setStroke(
                styleUpdates.percentStroke || this.style.percentStroke,
                styleUpdates.percentStrokeThickness ||
                    this.style.percentStrokeThickness
            );
        }
    }

    /**
     * スライダーの値を取得
     * @returns {number} 値（0.0-1.0）
     */
    getValue() {
        return this.config.value;
    }

    /**
     * スライダーの値を設定
     * @param {number} value - 値（0.0-1.0）
     */
    setValue(value) {
        value = Math.max(0, Math.min(1, value));
        this.config.value = value;

        const { x, sliderWidth, handleOffsetX } = this.config;
        const minX = x + handleOffsetX - sliderWidth / 2;
        const newX = minX + value * sliderWidth;

        this.sliderHandle.setX(newX);

        if (this.percentText) {
            this.percentText.setText(`${Math.round(value * 100)}%`);
        }
    }

    /**
     * スライダーを削除
     */
    destroy() {
        this.labelText?.destroy();
        this.sliderBg?.destroy();
        this.sliderHandle?.destroy();
        this.percentText?.destroy();
    }
}
