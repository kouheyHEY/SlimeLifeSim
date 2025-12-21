import { UI_CONST } from "../const/UIConst.js";
/**
 * 釣り中にメインのゲームシーンの上に、ポップアップウインドウのように
 * 表示されるミニゲームのシーン
 */
export class Fishing extends Phaser.Scene {
    constructor() {
        super("Fishing");
    }

    /**
     * 初期化
     * @param {string} fishName 魚の名前
     */
    init(fishName) {
        this.fishName = fishName;
    }

    create() {
        // 背景全体にオーバーレイをかける
        this.add
            .rectangle(
                0,
                0,
                this.cameras.main.width,
                this.cameras.main.height,
                UI_CONST.FISHING_BACKGROUND_COLOR,
                UI_CONST.FISHING_BACKGROUND_ALPHA
            )
            .setOrigin(0, 0);

        // 釣りゲームUIのコンテナを作成
        this.fishingUIContainer = this.add.container(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2
        );

        // 釣りゲームUIを長方形で表示
        const uiRectangle = this.add
            .rectangle(
                0,
                0,
                UI_CONST.FISHING_WIDTH,
                UI_CONST.FISHING_HEIGHT,
                UI_CONST.FISHING_RECTANGLE_COLOR
            )
            .setStrokeStyle(
                UI_CONST.FISHING_RECTANGLE_LINE_WIDTH,
                UI_CONST.FISHING_RECTANGLE_LINE_COLOR
            );
        this.fishingUIContainer.add(uiRectangle);

        // 成功ゲージ(左右の両端と中央の水平線を描画
        // 左端の線
        this.successGaugeLeftLine = this.add
            .line(
                -UI_CONST.FISHING_SUCCESS_GAUGE_LENGTH / 2,
                -UI_CONST.FISHING_HEIGHT / 2 +
                    UI_CONST.FISHING_SUCCESS_GAUGE_Y +
                    UI_CONST.FISHING_SUCCESS_GAUGE_HEIGHT / 2,
                0,
                0,
                0,
                UI_CONST.FISHING_SUCCESS_GAUGE_HEIGHT,
                UI_CONST.FISHING_SUCCESS_GAUGE_LINE_COLOR
            )
            .setLineWidth(UI_CONST.FISHING_SUCCESS_GAUGE_LINE_WIDTH);
        this.fishingUIContainer.add(this.successGaugeLeftLine);

        // 右端の線
        this.successGaugeRightLine = this.add
            .line(
                UI_CONST.FISHING_SUCCESS_GAUGE_LENGTH / 2,
                -UI_CONST.FISHING_HEIGHT / 2 +
                    UI_CONST.FISHING_SUCCESS_GAUGE_Y +
                    UI_CONST.FISHING_SUCCESS_GAUGE_HEIGHT / 2,
                0,
                0,
                0,
                UI_CONST.FISHING_SUCCESS_GAUGE_HEIGHT,
                UI_CONST.FISHING_SUCCESS_GAUGE_LINE_COLOR
            )
            .setLineWidth(UI_CONST.FISHING_SUCCESS_GAUGE_LINE_WIDTH);
        this.fishingUIContainer.add(this.successGaugeRightLine);

        // 中央の水平線
        this.successGaugeCenterLine = this.add
            .line(
                -UI_CONST.FISHING_SUCCESS_GAUGE_LENGTH / 2,
                -UI_CONST.FISHING_HEIGHT / 2 +
                    UI_CONST.FISHING_SUCCESS_GAUGE_Y +
                    UI_CONST.FISHING_SUCCESS_GAUGE_HEIGHT / 2,
                0,
                0,
                UI_CONST.FISHING_SUCCESS_GAUGE_LENGTH,
                0,
                UI_CONST.FISHING_SUCCESS_GAUGE_LINE_COLOR
            )
            .setLineWidth(UI_CONST.FISHING_SUCCESS_GAUGE_LINE_WIDTH)
            .setOrigin(0, 0.5);
        this.fishingUIContainer.add(this.successGaugeCenterLine);
    }
}
