import { GameTimeManager } from "../managers/GameTimeManager.js";
import { UI_CONST } from "../const/UIConst.js";
import { COMMON_CONST, FONT_NAME } from "../const/CommonConst.js";

/**
 * ゲーム情報表示UI
 * トップバー内に日付、天気、時刻を表示
 */
export class GameInfoUI {
    /**
     * コンストラクタ
     * @param {Phaser.Scene} scene - 所属するシーン
     * @param {GameTimeManager} gameTimeManager - ゲーム時間マネージャー
     * @param {number} x - X座標（親コンテナ内での相対位置）
     * @param {number} y - Y座標（親コンテナ内での相対位置）
     */
    constructor(
        scene,
        gameTimeManager,
        x = UI_CONST.GAME_INFO_X,
        y = UI_CONST.GAME_INFO_Y
    ) {
        this.scene = scene;
        this.gameTimeManager = gameTimeManager;
        this.x = x;
        this.y = y;
        this.createUI();
    }

    /**
     * UIの作成
     */
    createUI() {
        // コンテナを作成（親コンテナ内での相対位置）
        this.infoContainer = this.scene.add.container(this.x, this.y);

        // 背景を作成
        this.background = this.scene.add
            .rectangle(
                0,
                0,
                UI_CONST.GAME_INFO_WIDTH,
                UI_CONST.GAME_INFO_HEIGHT,
                UI_CONST.GAME_INFO_COLOR
            )
            .setOrigin(0, 0)
            .setStrokeStyle(
                UI_CONST.GAME_INFO_BORDER_WIDTH,
                UI_CONST.GAME_INFO_BORDER_COLOR
            );
        this.infoContainer.add(this.background);

        // メインカメラから除外
        this.scene.cameras.main.ignore(this.background);

        // 日付テキスト
        this.dateText = this.scene.add
            .text(UI_CONST.GAME_INFO_PADDING, UI_CONST.GAME_INFO_PADDING, "", {
                fontSize: `${UI_CONST.GAME_INFO_FONT_SIZE}px`,
                color: UI_CONST.GAME_INFO_FONT_COLOR,
                fontFamily: FONT_NAME.MELONANO,
            })
            .setOrigin(0, 0);
        this.infoContainer.add(this.dateText);
        this.scene.cameras.main.ignore(this.dateText);

        // 天気テキスト
        this.weatherText = this.scene.add
            .text(
                UI_CONST.GAME_INFO_PADDING,
                UI_CONST.GAME_INFO_PADDING + UI_CONST.GAME_INFO_LINE_SPACING,
                "",
                {
                    fontSize: `${UI_CONST.GAME_INFO_FONT_SIZE}px`,
                    color: UI_CONST.GAME_INFO_FONT_COLOR,
                    fontFamily: FONT_NAME.MELONANO,
                }
            )
            .setOrigin(0, 0);
        this.infoContainer.add(this.weatherText);
        this.scene.cameras.main.ignore(this.weatherText);

        // 円グラフの中心位置
        const circleX = UI_CONST.GAME_INFO_WIDTH / 2;
        const circleY = UI_CONST.GAME_INFO_PADDING + UI_CONST.GAME_INFO_LINE_SPACING * 2 + UI_CONST.TIME_CIRCLE_RADIUS;

        // 円グラフ用のGraphicsオブジェクト
        this.timeCircleGraphics = this.scene.add.graphics();
        this.infoContainer.add(this.timeCircleGraphics);
        this.scene.cameras.main.ignore(this.timeCircleGraphics);
        
        // 円グラフの中心位置を保存
        this.circleX = circleX;
        this.circleY = circleY;

        // 時間帯テキスト（円グラフの中央）
        this.timePeriodText = this.scene.add
            .text(circleX, circleY, "", {
                fontSize: `${UI_CONST.GAME_INFO_FONT_SIZE}px`,
                color: UI_CONST.GAME_INFO_FONT_COLOR,
                fontFamily: FONT_NAME.MELONANO,
            })
            .setOrigin(0.5, 0.5);
        this.infoContainer.add(this.timePeriodText);
        this.scene.cameras.main.ignore(this.timePeriodText);
    }

    /**
     * UIの更新
     */
    update() {
        // 日付を更新
        const dateStr = this.gameTimeManager.getDateString();
        this.dateText.setText(dateStr);

        // 天気を更新
        const weatherIcon = this.gameTimeManager.getWeatherIcon();
        this.weatherText.setText(weatherIcon);

        // 時間帯と進行度を取得
        const timePeriod = this.gameTimeManager.getTimePeriod();
        const progress = this.gameTimeManager.getTimePeriodProgress();

        // 時間帯テキストを更新
        this.timePeriodText.setText(timePeriod);

        // 円グラフを描画
        this.drawTimeCircle(timePeriod, progress);
    }

    /**
     * 時間の円グラフを描画
     * @param {string} timePeriod - 現在の時間帯
     * @param {number} progress - 時間帯内での進行度（0.0-1.0）
     */
    drawTimeCircle(timePeriod, progress) {
        this.timeCircleGraphics.clear();

        const radius = UI_CONST.TIME_CIRCLE_RADIUS;
        const lineWidth = UI_CONST.TIME_CIRCLE_LINE_WIDTH;
        const color = UI_CONST.TIME_PERIOD_COLORS[timePeriod];

        // 背景の円（グレー）
        this.timeCircleGraphics.lineStyle(lineWidth, 0x333333, 1);
        this.timeCircleGraphics.beginPath();
        this.timeCircleGraphics.arc(
            this.circleX,
            this.circleY,
            radius,
            Phaser.Math.DegToRad(0),
            Phaser.Math.DegToRad(360),
            false
        );
        this.timeCircleGraphics.strokePath();

        // 進行度の円弧（時間帯の色）
        if (progress > 0) {
            this.timeCircleGraphics.lineStyle(lineWidth, color, 1);
            this.timeCircleGraphics.beginPath();
            // 12時の位置から開始（-90度）
            const startAngle = -90;
            const endAngle = startAngle + (360 * progress);
            this.timeCircleGraphics.arc(
                this.circleX,
                this.circleY,
                radius,
                Phaser.Math.DegToRad(startAngle),
                Phaser.Math.DegToRad(endAngle),
                false
            );
            this.timeCircleGraphics.strokePath();
        }
    }
}
