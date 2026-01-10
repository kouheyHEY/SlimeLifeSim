import { UI_CONST, UI_TEXT } from "../const/UIConst.js";
import {
    FONT_NAME,
    getLocalizedText,
    getCurrentLanguage,
    COMMON_CONST,
} from "../const/CommonConst.js";
import { TIME_PERIOD_DISPLAY_NAME, GAME_CONST } from "../const/GameConst.js";

/**
 * 画面上部のトップバーUI
 * 日数、時間、時間帯、一時停止ボタンを表示
 */
export class TopBarUI {
    // 各セクションの幅設定
    static SECTION_WIDTHS = {
        PAUSE_BUTTON: 120, // 一時停止ボタンセクション
        TIME_PERIOD: 350, // 時間帯セクション
        STATUS_COIN: 180, // ステータス+コインセクション
        DAY_TIME: 180, // 日数+時間セクション
    };

    /**
     * コンストラクタ
     * @param {Phaser.Scene} scene - 所属するシーン
     * @param {GameTimeManager} gameTimeManager - ゲーム時間マネージャー
     * @param {GameInfoUI} gameInfoUI - ゲーム情報UI
     */
    constructor(scene, gameTimeManager, gameInfoUI) {
        this.scene = scene;
        this.gameTimeManager = gameTimeManager;
        this.gameInfoUI = gameInfoUI;
        this.createUI();
    }

    /**
     * UIの作成
     */
    createUI() {
        // トップバーのコンテナを作成
        this.topBarContainer = this.scene.add.container(0, 0);

        // 背景を作成（画面全体の幅）
        const topBarWidth = COMMON_CONST.SCREEN_WIDTH;
        this.background = this.scene.add
            .rectangle(
                0,
                0,
                topBarWidth,
                UI_CONST.TOP_BAR_HEIGHT,
                UI_CONST.TOP_BAR_COLOR,
                UI_CONST.TOP_BAR_ALPHA
            )
            .setOrigin(0, 0)
            .setStrokeStyle(
                UI_CONST.TOP_BAR_BORDER_WIDTH,
                UI_CONST.TOP_BAR_BORDER_COLOR
            );
        this.topBarContainer.add(this.background);

        // メインカメラから除外
        this.scene.cameras.main.ignore(this.background);

        // 各セクションの境界を計算
        const pauseSectionStart = 0;
        const pauseSectionEnd =
            UI_CONST.TOP_BAR_PADDING + UI_CONST.PAUSE_BUTTON_WIDTH + 20;
        const pauseSectionCenter = (pauseSectionStart + pauseSectionEnd) / 2;

        // 左側: 一時停止ボタン（中央揃え）
        this.pauseButton = this.scene.add
            .rectangle(
                pauseSectionCenter,
                UI_CONST.TOP_BAR_HEIGHT / 2,
                UI_CONST.PAUSE_BUTTON_WIDTH,
                UI_CONST.PAUSE_BUTTON_HEIGHT,
                0x3366cc
            )
            .setOrigin(0.5, 0.5)
            .setStrokeStyle(2, 0xffffff)
            .setInteractive({ useHandCursor: true });
        this.topBarContainer.add(this.pauseButton);
        this.scene.cameras.main.ignore(this.pauseButton);

        this.pauseButtonText = this.scene.add
            .text(
                pauseSectionCenter,
                UI_CONST.TOP_BAR_HEIGHT / 2,
                getLocalizedText(UI_TEXT.TOP_BAR.PAUSE),
                {
                    fontFamily: FONT_NAME.MELONANO,
                    fontSize: "20px",
                    color: "#FFFFFF",
                    align: "center",
                }
            )
            .setOrigin(0.5, 0.5);
        this.topBarContainer.add(this.pauseButtonText);
        this.scene.cameras.main.ignore(this.pauseButtonText);

        this.pauseButton.on("pointerdown", () => {
            this.scene.showPauseModal();
        });

        // 左中央: 時間帯テキスト（一時停止ボタンと右側要素の間）
        const pauseEndX =
            UI_CONST.TOP_BAR_PADDING + UI_CONST.PAUSE_BUTTON_WIDTH + 20;

        // 各セクションの開始位置を計算
        const daySectionStart = topBarWidth - TopBarUI.SECTION_WIDTHS.DAY_TIME;
        const statusSectionStart =
            daySectionStart - TopBarUI.SECTION_WIDTHS.STATUS_COIN;
        const timePeriodSectionStart = pauseEndX;
        const timePeriodSectionEnd = statusSectionStart;
        const timePeriodSectionCenter =
            (timePeriodSectionStart + timePeriodSectionEnd) / 2;

        const currentLang = getCurrentLanguage() || "JP";
        this.timePeriodText = this.scene.add
            .text(
                timePeriodSectionCenter,
                UI_CONST.TOP_BAR_HEIGHT / 2 - 25,
                "",
                {
                    fontSize:
                        currentLang === "EN"
                            ? "16px"
                            : `${UI_CONST.GAME_INFO_FONT_SIZE}px`,
                    color: UI_CONST.GAME_INFO_FONT_COLOR,
                    fontFamily: FONT_NAME.MELONANO,
                }
            )
            .setOrigin(0.5, 0.5);
        this.topBarContainer.add(this.timePeriodText);
        this.scene.cameras.main.ignore(this.timePeriodText);

        // 左中央: 時間帯バー用のGraphics
        this.timeLineGraphics = this.scene.add.graphics();
        this.topBarContainer.add(this.timeLineGraphics);
        this.scene.cameras.main.ignore(this.timeLineGraphics);

        // 時間帯バーの位置
        this.lineX = timePeriodSectionCenter;
        this.lineY = UI_CONST.TOP_BAR_HEIGHT / 2 + 15;

        // 縦線描画用のGraphics
        this.separatorGraphics = this.scene.add.graphics();
        this.topBarContainer.add(this.separatorGraphics);
        this.scene.cameras.main.ignore(this.separatorGraphics);

        // ステータス表示群のセクションを計算
        const statusSectionCenterX = (statusSectionStart + daySectionStart) / 2;

        // 右側: ステータスとコイン（中央揃え）
        // アイコン（幅30px）+ 間隔（25px）+ テキスト（約45px）で全体約100pxと想定

        // ステータスアイコン（上段）
        this.statusSprite = this.scene.add
            .sprite(
                statusSectionCenterX - 35,
                UI_CONST.TOP_BAR_HEIGHT / 2 - 20,
                this.gameInfoUI ? this.gameInfoUI.playerStatus : "status_normal"
            )
            .setOrigin(0.5, 0.5)
            .setScale(0.6);
        this.topBarContainer.add(this.statusSprite);
        this.scene.cameras.main.ignore(this.statusSprite);

        // ステータステキスト（上段）
        this.statusText = this.scene.add
            .text(
                statusSectionCenterX - 10,
                UI_CONST.TOP_BAR_HEIGHT / 2 - 20,
                "",
                {
                    fontSize: "20px",
                    color: UI_CONST.GAME_INFO_FONT_COLOR,
                    fontFamily: FONT_NAME.MELONANO,
                }
            )
            .setOrigin(0, 0.5);
        this.topBarContainer.add(this.statusText);
        this.scene.cameras.main.ignore(this.statusText);

        // コインアイコン（下段）
        this.coinSprite = this.scene.add
            .sprite(
                statusSectionCenterX - 35,
                UI_CONST.TOP_BAR_HEIGHT / 2 + 20,
                "coin"
            )
            .setOrigin(0.5, 0.5)
            .setScale(0.6);
        this.topBarContainer.add(this.coinSprite);
        this.scene.cameras.main.ignore(this.coinSprite);

        // コイン数テキスト（下段）
        this.coinCountText = this.scene.add
            .text(
                statusSectionCenterX - 10,
                UI_CONST.TOP_BAR_HEIGHT / 2 + 20,
                "0",
                {
                    fontSize: "20px",
                    color: UI_CONST.GAME_INFO_FONT_COLOR,
                    fontFamily: FONT_NAME.MELONANO,
                }
            )
            .setOrigin(0, 0.5);
        this.topBarContainer.add(this.coinCountText);
        this.scene.cameras.main.ignore(this.coinCountText);

        // 縦線を描画
        this.drawSeparators(topBarWidth, daySectionStart);

        // 右側: 日数テキスト（上段・中央揃え）
        const rightSectionStart = daySectionStart;
        const rightSectionEnd = topBarWidth - UI_CONST.TOP_BAR_PADDING;
        const dayTimeX = (rightSectionStart + rightSectionEnd) / 2;
        this.dayText = this.scene.add
            .text(dayTimeX, UI_CONST.TOP_BAR_HEIGHT / 2 - 20, "", {
                fontSize: "24px",
                color: UI_CONST.GAME_INFO_FONT_COLOR,
                fontFamily: FONT_NAME.MELONANO,
            })
            .setOrigin(0.5, 0.5);
        this.topBarContainer.add(this.dayText);
        this.scene.cameras.main.ignore(this.dayText);

        // 右側: 時刻テキスト（下段・日数の真下・中央揃え）
        this.timeText = this.scene.add
            .text(dayTimeX, UI_CONST.TOP_BAR_HEIGHT / 2 + 20, "", {
                fontSize: "24px",
                color: UI_CONST.GAME_INFO_FONT_COLOR,
                fontFamily: FONT_NAME.MELONANO,
            })
            .setOrigin(0.5, 0.5);
        this.topBarContainer.add(this.timeText);
        this.scene.cameras.main.ignore(this.timeText);
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

        // 時間帯テキストを更新
        const timePeriodDisplay =
            getLocalizedText(TIME_PERIOD_DISPLAY_NAME[timePeriod]) ||
            timePeriod;
        this.timePeriodText.setText(timePeriodDisplay);

        // 時間帯バーを描画
        this.drawTimeLine(timePeriod, progress);

        // ステータスとコインの更新
        if (this.gameInfoUI) {
            // ステータススプライトの更新
            if (this.statusSprite) {
                this.statusSprite.setTexture(this.gameInfoUI.playerStatus);
            }
            // ステータステキストの更新
            if (this.statusText) {
                const statusTextMap = {
                    status_smile: getLocalizedText("元気"),
                    status_normal: getLocalizedText("普通"),
                    status_bad: getLocalizedText("不機嫌"),
                };
                this.statusText.setText(
                    statusTextMap[this.gameInfoUI.playerStatus] || ""
                );
            }
            // コイン数の更新
            if (this.coinCountText) {
                this.coinCountText.setText(`${this.gameInfoUI.coins}`);
            }
        }
    }

    /**
     * 要素間の縦線を描画
     * @param {number} topBarWidth - トップバーの幅
     * @param {number} daySectionStart - 日数表示の開始位置
     */
    drawSeparators(topBarWidth, daySectionStart) {
        const margin = 10; // 上下の余白
        const lineColor = 0x666666;
        const lineWidth = 2;

        this.separatorGraphics.lineStyle(lineWidth, lineColor, 0.6);

        // 一時停止ボタンセクションと時間帯セクションの境界線
        const pauseEndX =
            UI_CONST.TOP_BAR_PADDING + UI_CONST.PAUSE_BUTTON_WIDTH + 20;
        this.separatorGraphics.lineBetween(
            pauseEndX,
            margin,
            pauseEndX,
            UI_CONST.TOP_BAR_HEIGHT - margin
        );

        // 時間帯セクションとステータスセクションの境界線
        const statusSectionStart =
            daySectionStart - TopBarUI.SECTION_WIDTHS.STATUS_COIN;
        this.separatorGraphics.lineBetween(
            statusSectionStart,
            margin,
            statusSectionStart,
            UI_CONST.TOP_BAR_HEIGHT - margin
        );

        // ステータスセクションと日数セクションの境界線
        this.separatorGraphics.lineBetween(
            daySectionStart,
            margin,
            daySectionStart,
            UI_CONST.TOP_BAR_HEIGHT - margin
        );
    }

    /**
     * 時間の数直線を描画
     * @param {string} timePeriod - 現在の時間帯
     * @param {number} progress - 時間帯内での進行度（0.0-1.0）
     */
    drawTimeLine(timePeriod, progress) {
        this.timeLineGraphics.clear();

        const width = UI_CONST.TIME_LINE_WIDTH;
        const height = UI_CONST.TIME_LINE_HEIGHT;
        const color = UI_CONST.TIME_PERIOD_COLORS[timePeriod];
        const x = this.lineX - width / 2;
        const y = this.lineY - height / 2;

        // 背景の長方形（グレー）
        this.timeLineGraphics.fillStyle(0x333333, 1);
        this.timeLineGraphics.fillRect(x, y, width, height);

        // 進行度の長方形（時間帯の色）
        if (progress > 0) {
            this.timeLineGraphics.fillStyle(color, 1);
            this.timeLineGraphics.fillRect(x, y, width * progress, height);
        }

        // 枠線
        this.timeLineGraphics.lineStyle(2, 0xffffff, 1);
        this.timeLineGraphics.strokeRect(x, y, width, height);
    }
}
