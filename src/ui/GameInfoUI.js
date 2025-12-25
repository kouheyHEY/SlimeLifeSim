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
    constructor(scene, gameTimeManager, x = UI_CONST.GAME_INFO_X, y = UI_CONST.GAME_INFO_Y) {
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
            .text(
                UI_CONST.GAME_INFO_PADDING,
                UI_CONST.GAME_INFO_PADDING,
                "",
                {
                    fontSize: `${UI_CONST.GAME_INFO_FONT_SIZE}px`,
                    color: UI_CONST.GAME_INFO_FONT_COLOR,
                    fontFamily: FONT_NAME.MELONANO,
                }
            )
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

        // 時刻テキスト
        this.timeText = this.scene.add
            .text(
                UI_CONST.GAME_INFO_PADDING,
                UI_CONST.GAME_INFO_PADDING + UI_CONST.GAME_INFO_LINE_SPACING * 2,
                "",
                {
                    fontSize: `${UI_CONST.GAME_INFO_FONT_SIZE}px`,
                    color: UI_CONST.GAME_INFO_FONT_COLOR,
                    fontFamily: FONT_NAME.MELONANO,
                }
            )
            .setOrigin(0, 0);
        this.infoContainer.add(this.timeText);
        this.scene.cameras.main.ignore(this.timeText);
    }

    /**
     * UIの更新
     */
    update() {
        // 日付を更新
        this.dateText.setText(this.gameTimeManager.getDateString());

        // 天気を更新
        this.weatherText.setText(this.gameTimeManager.getWeatherIcon());

        // 時刻を更新
        this.timeText.setText(this.gameTimeManager.getTimeString());
    }
}
