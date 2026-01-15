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
        STATUS_COIN: 180, // コインセクション
        DAY_TIME: 180, // 日数+時間セクション
    };

    /**
     * コンストラクタ
     * @param {Phaser.Scene} scene - 所属するシーン
     * @param {GameTimeManager} gameTimeManager - ゲーム時間マネージャー
     * @param {GameInfoUI} gameInfoUI - ゲーム情報UI
     * @param {TutorialManager} [tutorialManager] - チュートリアルマネージャー（オプション）
     */
    constructor(scene, gameTimeManager, gameInfoUI, tutorialManager = null) {
        this.scene = scene;
        this.gameTimeManager = gameTimeManager;
        this.gameInfoUI = gameInfoUI;
        this.tutorialManager = tutorialManager;
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
            UI_CONST.TOP_BAR_PADDING +
            UI_CONST.PAUSE_BUTTON_WIDTH +
            UI_CONST.TOP_BAR_SECTION_MARGIN;
        const pauseSectionCenter = (pauseSectionStart + pauseSectionEnd) / 2;

        // 左側: 一時停止ボタン（中央揃え）
        // 外枠（暗め）
        this.pauseButtonOuter = this.scene.add
            .rectangle(
                pauseSectionCenter,
                UI_CONST.TOP_BAR_HEIGHT / 2,
                UI_CONST.PAUSE_BUTTON_WIDTH,
                UI_CONST.PAUSE_BUTTON_HEIGHT,
                UI_CONST.TOP_BAR_PAUSE_BUTTON_OUTER_COLOR
            )
            .setOrigin(0.5, 0.5)
            .setVisible(false);
        this.topBarContainer.add(this.pauseButtonOuter);
        this.scene.cameras.main.ignore(this.pauseButtonOuter);

        // 内側（明るめ）
        this.pauseButton = this.scene.add
            .rectangle(
                pauseSectionCenter,
                UI_CONST.TOP_BAR_HEIGHT / 2,
                UI_CONST.PAUSE_BUTTON_WIDTH -
                    UI_CONST.TOP_BAR_PAUSE_BUTTON_INNER_OFFSET,
                UI_CONST.PAUSE_BUTTON_HEIGHT -
                    UI_CONST.TOP_BAR_PAUSE_BUTTON_INNER_OFFSET,
                UI_CONST.TOP_BAR_PAUSE_BUTTON_INNER_COLOR
            )
            .setOrigin(0.5, 0.5)
            .setInteractive({ useHandCursor: true })
            .setVisible(false);
        this.topBarContainer.add(this.pauseButton);
        this.scene.cameras.main.ignore(this.pauseButton);

        // 一時停止アイコン（2本の縦線）を図形で描画
        const pauseIconWidth = UI_CONST.TOP_BAR_PAUSE_ICON_WIDTH;
        const pauseIconHeight = UI_CONST.TOP_BAR_PAUSE_ICON_HEIGHT;
        const pauseIconGap = UI_CONST.TOP_BAR_PAUSE_ICON_GAP;

        this.pauseIcon = this.scene.add.graphics();
        this.pauseIcon.fillStyle(UI_CONST.TOP_BAR_PAUSE_ICON_COLOR, 1);

        // 左の縦線
        const leftBarX = pauseSectionCenter - pauseIconGap / 2 - pauseIconWidth;
        const barY = UI_CONST.TOP_BAR_HEIGHT / 2 - pauseIconHeight / 2;
        this.pauseIcon.fillRect(
            leftBarX,
            barY,
            pauseIconWidth,
            pauseIconHeight
        );

        // 右の縦線
        const rightBarX = pauseSectionCenter + pauseIconGap / 2;
        this.pauseIcon.fillRect(
            rightBarX,
            barY,
            pauseIconWidth,
            pauseIconHeight
        );

        this.topBarContainer.add(this.pauseIcon);
        this.scene.cameras.main.ignore(this.pauseIcon);
        this.pauseIcon.setVisible(false);

        this.pauseButton.on("pointerdown", () => {
            // プレス効果
            this.pauseButtonOuter.y += UI_CONST.TOP_BAR_BUTTON_PRESS_OFFSET;
            this.pauseButton.y += UI_CONST.TOP_BAR_BUTTON_PRESS_OFFSET;
            this.pauseIcon.y += UI_CONST.TOP_BAR_BUTTON_PRESS_OFFSET;

            // Pauseシーンを起動してGameシーンを一時停止
            this.scene.scene.pause();
            this.scene.scene.launch("Pause");
            this.scene.gameTimeManager.pause();

            // 少し遅延してから元に戻す
            this.scene.time.delayedCall(
                UI_CONST.TOP_BAR_BUTTON_PRESS_DELAY,
                () => {
                    this.pauseButtonOuter.y -=
                        UI_CONST.TOP_BAR_BUTTON_PRESS_OFFSET;
                    this.pauseButton.y -= UI_CONST.TOP_BAR_BUTTON_PRESS_OFFSET;
                    this.pauseIcon.y -= UI_CONST.TOP_BAR_BUTTON_PRESS_OFFSET;
                }
            );
        });

        // 左中央: 時間帯テキスト（一時停止ボタンと右側要素の間）
        const pauseEndX =
            UI_CONST.TOP_BAR_PADDING +
            UI_CONST.PAUSE_BUTTON_WIDTH +
            UI_CONST.TOP_BAR_SECTION_MARGIN;

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
                UI_CONST.TOP_BAR_HEIGHT / 2 -
                    UI_CONST.TOP_BAR_TIME_PERIOD_TEXT_Y_OFFSET,
                "",
                {
                    fontSize:
                        currentLang === "EN"
                            ? UI_CONST.TOP_BAR_TIME_PERIOD_FONT_SIZE_EN
                            : UI_CONST.TOP_BAR_TIME_PERIOD_FONT_SIZE_JP,
                    color: UI_CONST.GAME_INFO_FONT_COLOR,
                    fontFamily: FONT_NAME.CP_PERIOD,
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
        this.lineY =
            UI_CONST.TOP_BAR_HEIGHT / 2 + UI_CONST.TOP_BAR_TIME_LINE_Y_OFFSET;

        // 縦線描画用のGraphics
        this.separatorGraphics = this.scene.add.graphics();
        this.topBarContainer.add(this.separatorGraphics);
        this.scene.cameras.main.ignore(this.separatorGraphics);

        const statusSectionCenterX = (statusSectionStart + daySectionStart) / 2;

        // コインアイコン（下段）
        this.coinSprite = this.scene.add
            .sprite(
                statusSectionCenterX - UI_CONST.TOP_BAR_STATUS_ICON_X_OFFSET,
                UI_CONST.TOP_BAR_HEIGHT / 2,
                "coin"
            )
            .setOrigin(0.5, 0.5)
            .setScale(UI_CONST.TOP_BAR_STATUS_ICON_SCALE);
        this.topBarContainer.add(this.coinSprite);
        this.scene.cameras.main.ignore(this.coinSprite);

        // コイン数テキスト（下段）
        this.coinCountText = this.scene.add
            .text(
                statusSectionCenterX - UI_CONST.TOP_BAR_STATUS_TEXT_X_OFFSET,
                UI_CONST.TOP_BAR_HEIGHT / 2,
                UI_TEXT.TOP_BAR.INITIAL_COIN_COUNT,
                {
                    fontSize: UI_CONST.TOP_BAR_STATUS_TEXT_FONT_SIZE,
                    color: UI_CONST.GAME_INFO_FONT_COLOR,
                    fontFamily: FONT_NAME.CP_PERIOD,
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
            .text(
                dayTimeX,
                UI_CONST.TOP_BAR_HEIGHT / 2 -
                    UI_CONST.TOP_BAR_DAY_TIME_TOP_Y_OFFSET,
                "",
                {
                    fontSize: UI_CONST.TOP_BAR_DAY_TIME_FONT_SIZE,
                    color: UI_CONST.GAME_INFO_FONT_COLOR,
                    fontFamily: FONT_NAME.CP_PERIOD,
                }
            )
            .setOrigin(0.5, 0.5);
        this.topBarContainer.add(this.dayText);
        this.scene.cameras.main.ignore(this.dayText);

        // 右側: 時刻テキスト（下段・日数の真下・中央揃え）
        this.timeText = this.scene.add
            .text(
                dayTimeX,
                UI_CONST.TOP_BAR_HEIGHT / 2 +
                    UI_CONST.TOP_BAR_DAY_TIME_BOTTOM_Y_OFFSET,
                "",
                {
                    fontSize: UI_CONST.TOP_BAR_DAY_TIME_FONT_SIZE,
                    color: UI_CONST.GAME_INFO_FONT_COLOR,
                    fontFamily: FONT_NAME.CP_PERIOD,
                }
            )
            .setOrigin(0.5, 0.5);
        this.topBarContainer.add(this.timeText);
        this.scene.cameras.main.ignore(this.timeText);
    }

    /**
     * UIの更新
     */
    update() {
        // チュートリアル状態に基づいて Pause ボタンの表示を制御
        // コインチュートリアルが完了するまで非表示
        const shouldShowPauseButton = 
            this.tutorialManager && 
            this.tutorialManager.isCoinTutorialCompleted();
        this.pauseButton.setVisible(shouldShowPauseButton);
        this.pauseButtonOuter.setVisible(shouldShowPauseButton);
        this.pauseIcon.setVisible(shouldShowPauseButton);

        // 日数を更新
        const day = this.gameTimeManager.currentTime.day;
        this.dayText.setText(`${UI_TEXT.TOP_BAR.DAY_PREFIX}${day}`);

        // 時刻を更新（24時間表記）
        const hour = this.gameTimeManager.currentTime.hour;
        const minute = this.gameTimeManager.currentTime.minute;
        const timeString = `${hour.toString().padStart(2, "0")}${
            UI_TEXT.TOP_BAR.TIME_SEPARATOR
        }${minute.toString().padStart(2, "0")}`;
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
        if (this.gameInfoUI && this.coinCountText) {
            this.coinCountText.setText(`${this.gameInfoUI.coins}`);
        }
    }

    /**
     * 要素間の縦線を描画
     * @param {number} topBarWidth - トップバーの幅
     * @param {number} daySectionStart - 日数表示の開始位置
     */
    drawSeparators(topBarWidth, daySectionStart) {
        const margin = UI_CONST.TOP_BAR_SEPARATOR_MARGIN;
        const lineColor = UI_CONST.TOP_BAR_SEPARATOR_COLOR;
        const lineWidth = UI_CONST.TOP_BAR_SEPARATOR_WIDTH;

        this.separatorGraphics.lineStyle(
            lineWidth,
            lineColor,
            UI_CONST.TOP_BAR_SEPARATOR_ALPHA
        );

        // 一時停止ボタンセクションと時間帯セクションの境界線
        const pauseEndX =
            UI_CONST.TOP_BAR_PADDING +
            UI_CONST.PAUSE_BUTTON_WIDTH +
            UI_CONST.TOP_BAR_SECTION_MARGIN;
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
        this.timeLineGraphics.fillStyle(UI_CONST.TOP_BAR_TIME_LINE_BG_COLOR, 1);
        this.timeLineGraphics.fillRect(x, y, width, height);

        // 進行度の長方形（時間帯の色）
        if (progress > 0) {
            this.timeLineGraphics.fillStyle(color, 1);
            this.timeLineGraphics.fillRect(x, y, width * progress, height);
        }

        // 枠線
        this.timeLineGraphics.lineStyle(
            UI_CONST.TOP_BAR_TIME_LINE_BORDER_WIDTH,
            UI_CONST.TOP_BAR_TIME_LINE_BORDER_COLOR,
            1
        );
        this.timeLineGraphics.strokeRect(x, y, width, height);
    }
}
