import { GameTimeManager } from "../managers/GameTimeManager.js";
import { UI_CONST } from "../const/UIConst.js";
import { COMMON_CONST, FONT_NAME } from "../const/CommonConst.js";
import { GAME_CONST, TIME_PERIOD_DISPLAY_NAME } from "../const/GameConst.js";

/**
 * ゲーム情報表示UI
 * トップバー内に日付、天気、時刻、プレイヤー状態、コイン枚数を表示
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
        // プレイヤーの状態とコイン
        this.playerStatus = GAME_CONST.PLAYER_INITIAL_STATUS;
        this.coins = GAME_CONST.PLAYER_INITIAL_COINS;
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

        // 日数テキスト
        this.dayText = this.scene.add
            .text(UI_CONST.GAME_INFO_PADDING, UI_CONST.GAME_INFO_PADDING, "", {
                fontSize: `${UI_CONST.GAME_INFO_FONT_SIZE}px`,
                color: UI_CONST.GAME_INFO_FONT_COLOR,
                fontFamily: FONT_NAME.MELONANO,
            })
            .setOrigin(0, 0);
        this.infoContainer.add(this.dayText);
        this.scene.cameras.main.ignore(this.dayText);

        // 時刻テキスト（24時間表記）
        this.timeText = this.scene.add
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
        this.infoContainer.add(this.timeText);
        this.scene.cameras.main.ignore(this.timeText);

        // 円グラフの中心位置
        const circleX = UI_CONST.GAME_INFO_WIDTH / 2;
        const circleY =
            UI_CONST.GAME_INFO_PADDING * 2 +
            UI_CONST.GAME_INFO_LINE_SPACING * 2 +
            UI_CONST.TIME_CIRCLE_RADIUS;

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

        // ステータスとコインの縦並び表示（左寄せ）
        const itemsStartY =
            circleY +
            UI_CONST.TIME_CIRCLE_RADIUS +
            UI_CONST.GAME_INFO_PADDING +
            25;
        const leftMargin = UI_CONST.GAME_INFO_PADDING + 5;

        // プレイヤーステータスアイコン（左寄せ）
        const statusIconX = leftMargin + UI_CONST.PLAYER_STATUS_ICON_SIZE / 2;
        this.playerStatusSprite = this.scene.add
            .sprite(statusIconX, itemsStartY, this.playerStatus)
            .setOrigin(0.5, 0.5);
        const statusScale =
            UI_CONST.PLAYER_STATUS_ICON_SIZE / this.playerStatusSprite.width;
        this.playerStatusSprite.setScale(statusScale);
        this.infoContainer.add(this.playerStatusSprite);
        this.scene.cameras.main.ignore(this.playerStatusSprite);

        // ステータス名テキスト（アイコンの右側）
        const statusTextX = leftMargin + UI_CONST.PLAYER_STATUS_ICON_SIZE + 8;
        this.statusText = this.scene.add
            .text(
                statusTextX,
                itemsStartY,
                GAME_CONST.PLAYER_STATUS_DISPLAY_NAME[this.playerStatus] || "",
                {
                    fontSize: `${UI_CONST.GAME_INFO_FONT_SIZE}px`,
                    color: UI_CONST.GAME_INFO_FONT_COLOR,
                    fontFamily: FONT_NAME.MELONANO,
                }
            )
            .setOrigin(0, 0.5);
        this.infoContainer.add(this.statusText);
        this.scene.cameras.main.ignore(this.statusText);

        // コインアイコンとテキスト（ステータスの下、左寄せ）
        const coinY = itemsStartY + UI_CONST.PLAYER_STATUS_ICON_SIZE / 2 + 30;
        const coinIconX = leftMargin;
        this.coinIcon = this.scene.add
            .sprite(coinIconX, coinY, "coin")
            .setOrigin(0, 0.5);
        const coinScale = UI_CONST.COIN_ICON_SIZE / this.coinIcon.width;
        this.coinIcon.setScale(coinScale);
        this.infoContainer.add(this.coinIcon);
        this.scene.cameras.main.ignore(this.coinIcon);

        // コイン枚数テキスト
        this.coinText = this.scene.add
            .text(
                coinIconX + UI_CONST.COIN_ICON_SIZE + 8,
                coinY,
                `${this.coins}`,
                {
                    fontSize: `${UI_CONST.GAME_INFO_FONT_SIZE}px`,
                    color: UI_CONST.GAME_INFO_FONT_COLOR,
                    fontFamily: FONT_NAME.MELONANO,
                }
            )
            .setOrigin(0, 0.5);
        this.infoContainer.add(this.coinText);
        this.scene.cameras.main.ignore(this.coinText);
    }

    /**
     * UIの更新
     */
    update() {
        // 日数を更新
        const day = this.gameTimeManager.currentTime.day;
        this.dayText.setText(`DAY ${day}`);

        // 時刻を更新（24時間表記）
        const hour = this.gameTimeManager.currentTime.hour;
        const minute = this.gameTimeManager.currentTime.minute;
        const timeString = `${hour.toString().padStart(2, "0")}:${minute
            .toString()
            .padStart(2, "0")}`;
        this.timeText.setText(timeString);

        // 時間帯と進行度を取得
        const timePeriod = this.gameTimeManager.getTimePeriod();
        const progress = this.gameTimeManager.getTimePeriodProgress();

        // 時間帯テキストを更新（日本語表示）
        const timePeriodDisplay =
            TIME_PERIOD_DISPLAY_NAME[timePeriod] || timePeriod;
        this.timePeriodText.setText(timePeriodDisplay);

        // 円グラフを描画
        this.drawTimeCircle(timePeriod, progress);

        // ステータステキストを更新
        if (this.statusText) {
            this.statusText.setText(
                GAME_CONST.PLAYER_STATUS_DISPLAY_NAME[this.playerStatus] || ""
            );
        }

        // コイン枚数を更新
        this.coinText.setText(`${this.coins}`);
    }

    /**
     * プレイヤーの状態を更新
     * @param {string} status - 新しい状態のキー（例: "status_smile", "status_normal", "status_bad"）
     */
    setPlayerStatus(status) {
        console.log(`setPlayerStatus: ${this.playerStatus} → ${status}`);
        this.playerStatus = status;
        if (this.playerStatusSprite) {
            this.playerStatusSprite.setTexture(status);
            console.log(`スプライトを更新: ${status}`);
        }
        if (this.statusText) {
            const displayName =
                GAME_CONST.PLAYER_STATUS_DISPLAY_NAME[status] || "";
            this.statusText.setText(displayName);
            console.log(`テキストを更新: ${displayName}`);
        }
    }

    /**
     * プレイヤーの状態を1段階向上させる
     * status_bad → status_normal → status_smile
     */
    improvePlayerStatus() {
        if (this.playerStatus === "status_bad") {
            this.setPlayerStatus("status_normal");
        } else if (this.playerStatus === "status_normal") {
            this.setPlayerStatus("status_smile");
        }
        // status_smileの場合はこれ以上上がらない
    }

    /**
     * プレイヤーの状態を1段階低下させる
     * status_smile → status_normal → status_bad
     * @returns {boolean} - これ以上下がらない場合false
     */
    decreasePlayerStatus() {
        console.log(
            `decreasePlayerStatus: 現在のステータス = ${this.playerStatus}`
        );
        if (this.playerStatus === "status_smile") {
            this.setPlayerStatus("status_normal");
            return true;
        } else if (this.playerStatus === "status_normal") {
            this.setPlayerStatus("status_bad");
            return true;
        }
        // status_badの場合はこれ以上下がらない
        console.log("これ以上ステータスを下げられません");
        return false;
    }

    /**
     * コイン枚数を設定
     * @param {number} amount - コイン枚数
     */
    setCoins(amount) {
        this.coins = Math.max(0, amount);
    }

    /**
     * コインを追加
     * @param {number} amount - 追加するコイン枚数
     */
    addCoins(amount) {
        this.coins += amount;
        this.coins = Math.max(0, this.coins);
    }

    /**
     * コインを減らす
     * @param {number} amount - 減らすコイン枚数
     * @return {boolean} - 減らせた場合true、コイン不足の場合false
     */
    removeCoins(amount) {
        if (this.coins >= amount) {
            this.coins -= amount;
            return true;
        }
        return false;
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
            const endAngle = startAngle + 360 * progress;
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
