import { MAP_CONST } from "../const/MapConst.js";

/**
 * 時間帯マネージャー
 * 時間の経過に応じて背景色を更新します
 */
export class TimeOfDayManager {
    /**
     * コンストラクタ
     * @param {Phaser.Scene} scene - 所属するシーン
     * @param {GameTimeManager} gameTimeManager - ゲーム時間マネージャー
     */
    constructor(scene, gameTimeManager) {
        this.scene = scene;
        this.gameTimeManager = gameTimeManager;

        // 色の遷移用のTween
        this.colorTween = null;

        // 現在の色（RGB形式の小数値）
        this.currentColor = {
            r: 0,
            g: 0,
            b: 0,
        };

        // 初期色を設定
        this.setInitialColor();
    }

    /**
     * 初期色を設定
     */
    setInitialColor() {
        const currentTimeOfDay = this.gameTimeManager.getCurrentTimeOfDay();
        const colorData = this.getColorForTimeOfDay(currentTimeOfDay);
        const color = colorData.color;
        const rgb = MAP_CONST.RGB_CONVERSION;

        // 16進数カラーコードをRGBに変換
        this.currentColor = {
            r: (color >> rgb.RED_SHIFT) & rgb.MAX_VALUE,
            g: (color >> rgb.GREEN_SHIFT) & rgb.MAX_VALUE,
            b: color & rgb.MAX_VALUE,
        };

        // 初期色を適用
        this.scene.cameras.main.setBackgroundColor(color);
    }

    /**
     * 時間帯に対応する色データを取得
     * @param {string} timeOfDay - 時間帯の名前
     * @returns {Object} 色データ
     */
    getColorForTimeOfDay(timeOfDay) {
        const colors = MAP_CONST.TIME_OF_DAY_COLORS;
        return colors[timeOfDay] || colors.NIGHT;
    }

    /**
     * 背景色を更新
     */
    updateBackgroundColor() {
        const currentTimeOfDay = this.gameTimeManager.getCurrentTimeOfDay();
        const colorData = this.getColorForTimeOfDay(currentTimeOfDay);
        const targetColor = colorData.color;
        const rgb = MAP_CONST.RGB_CONVERSION;

        // RGBに変換
        const targetRGB = {
            r: (targetColor >> rgb.RED_SHIFT) & rgb.MAX_VALUE,
            g: (targetColor >> rgb.GREEN_SHIFT) & rgb.MAX_VALUE,
            b: targetColor & rgb.MAX_VALUE,
        };

        // 既存のTweenをキャンセル
        if (this.colorTween) {
            this.colorTween.stop();
        }

        // 色を徐々に変更するTweenを作成
        this.colorTween = this.scene.tweens.add({
            targets: this.currentColor,
            r: targetRGB.r,
            g: targetRGB.g,
            b: targetRGB.b,
            duration: MAP_CONST.COLOR_TRANSITION_DURATION,
            ease: MAP_CONST.COLOR_TRANSITION_EASE,
            onUpdate: () => {
                // 毎フレーム更新される際に、現在の色でカメラを更新
                const color =
                    (Math.round(this.currentColor.r) << rgb.RED_SHIFT) |
                    (Math.round(this.currentColor.g) << rgb.GREEN_SHIFT) |
                    Math.round(this.currentColor.b);

                this.scene.cameras.main.setBackgroundColor(color);
            },
        });
    }
}
