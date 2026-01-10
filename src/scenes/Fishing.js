import { UI_CONST } from "../const/UIConst.js";
import { GAME_CONST } from "../const/GameConst.js";
import {
    FONT_NAME,
    getLocalizedText,
    getCurrentLanguage,
} from "../const/CommonConst.js";
import assets from "../assets.js";
import { wrapText } from "../utils/TextUtils.js";

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
     * @param {Object} paramObj パラメータオブジェクト
     * @param {string} paramObj.fishName 釣る魚の名前
     * @param {number} [paramObj.letterIndex] 手紙のインデックス
     * @param {string} [paramObj.letterCategory] 手紙のカテゴリ
     * @param {number} [paramObj.linePowerMultiplier] 釣り糸の引っ張り力倍率
     */
    init(paramObj) {
        this.fishName = paramObj.fishName;
        this.letterIndex = paramObj.letterIndex;
        this.letterCategory = paramObj.letterCategory || "story_planet";
        this.linePowerMultiplier = paramObj.linePowerMultiplier || 1.0;
        // 成功ゲージの初期値を設定
        this.successGaugeValue = GAME_CONST.SUCCESS_GAUGE_INITIAL;
        // 成功ゲージの最大値を設定
        this.successGaugeMax = GAME_CONST.SUCCESS_GAUGE_MAX;
        // チャレンジ中の円の個数
        this.challengeCircleCount = 0;
        // 状態管理（フィッシング中）
        this.isFishing = true;
        // 釣り結果表示中フラグ
        this.isShowingResult = false;
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

        // 成功ゲージの値に魚アイコンを表示
        this.fishIcon = this.add
            .sprite(
                (this.successGaugeValue / this.successGaugeMax) *
                    UI_CONST.FISHING_SUCCESS_GAUGE_LENGTH -
                    UI_CONST.FISHING_SUCCESS_GAUGE_LENGTH / 2,
                -UI_CONST.FISHING_HEIGHT / 2 +
                    UI_CONST.FISHING_SUCCESS_GAUGE_Y +
                    UI_CONST.FISHING_SUCCESS_GAUGE_HEIGHT / 2,
                assets.image.icon_fish_mini.key
            )
            .setOrigin(0.5, 0.5);
        this.fishingUIContainer.add(this.fishIcon);

        // ゲームで使用する円を表示
        this.gameCircleGroup = this.add.group();
        for (let row = 0; row < GAME_CONST.FISHING_GAME_CIRCLE_ROWS; row++) {
            for (
                let col = 0;
                col < GAME_CONST.FISHING_GAME_CIRCLE_COLUMNS;
                col++
            ) {
                const circle = this.add.circle(
                    (col - (GAME_CONST.FISHING_GAME_CIRCLE_COLUMNS - 1) / 2) *
                        (GAME_CONST.FISHING_GAME_CIRCLE_RADIUS_BASE * 2 + 40),
                    (row - (GAME_CONST.FISHING_GAME_CIRCLE_ROWS - 1) / 2) *
                        (GAME_CONST.FISHING_GAME_CIRCLE_RADIUS_BASE * 2 + 20) +
                        20,
                    GAME_CONST.FISHING_GAME_CIRCLE_RADIUS_BASE,
                    Phaser.Display.Color.HexStringToColor(
                        GAME_CONST.FISHING_GAME_CIRCLE_BACKGROUND_COLOR
                    ).color,
                    GAME_CONST.FISHING_GAME_CIRCLE_ALPHA
                );
                circle.setStrokeStyle(
                    GAME_CONST.FISHING_GAME_CIRCLE_BORDER_WIDTH,
                    Phaser.Display.Color.HexStringToColor(
                        GAME_CONST.FISHING_GAME_CIRCLE_BACKGROUND_COLOR
                    ).color
                );
                this.fishingUIContainer.add(circle);
                this.gameCircleGroup.add(circle);
            }
        }

        // 一定間隔でチャレンジ円を表示するタイマーを設定
        this.timerAppearChallengeCircle = this.time.addEvent({
            delay: GAME_CONST.FISHING_GAME_CIRCLE_SPAWN_INTERVAL,
            callback: this.appearChallengeCircle,
            callbackScope: this,
            loop: true,
        });
    }

    update() {
        // 釣り中でなければ何もしない
        if (!this.isFishing || this.isShowingResult) {
            return;
        }

        // 成功ゲージの値が最大値に達した場合、釣り成功処理を実行
        if (this.successGaugeValue >= this.successGaugeMax) {
            this.fishingSuccess();
        }

        // 成功ゲージの値を時間経過で減少させる
        this.successGaugeValue -= GAME_CONST.SUCCESS_GAUGE_DECREASE_RATE;
        // 成功ゲージの値が0未満にならないようにする
        if (this.successGaugeValue < 0) {
            this.successGaugeValue = 0;
        }
        // 成功ゲージの値に応じて魚アイコンの位置を更新
        this.fishIcon.x =
            (this.successGaugeValue / this.successGaugeMax) *
                UI_CONST.FISHING_SUCCESS_GAUGE_LENGTH -
            UI_CONST.FISHING_SUCCESS_GAUGE_LENGTH / 2;
    }

    /**
     * タップする必要のある円を表示する
     */
    appearChallengeCircle() {
        // チャレンジ円の個数が最大値に達している場合は表示しない
        if (
            this.challengeCircleCount >=
            GAME_CONST.FISHING_GAME_CIRCLE_ROWS *
                GAME_CONST.FISHING_GAME_CIRCLE_COLUMNS
        ) {
            return;
        }
        // チャレンジ円を表示できる円のインデックスの配列を作成
        const availableIndices = [];
        for (let i = 0; i < this.gameCircleGroup.getChildren().length; i++) {
            const circle = this.gameCircleGroup.getChildren()[i];
            if (!circle.challengeCircle) {
                availableIndices.push(i);
            }
        }
        if (availableIndices.length === 0) {
            return;
        }
        // いずれかの円に対して、徐々に小さくなる別色の円を表示
        const challengeCircIdx =
            availableIndices[
                Phaser.Math.Between(0, availableIndices.length - 1)
            ];
        const baseCircle = this.gameCircleGroup.getChildren()[challengeCircIdx];
        this.challengeCircleCount++;
        // タップ可能にする
        baseCircle.setInteractive();
        baseCircle.on("pointerdown", () => {
            this.tapChallengeCircle(baseCircle);
        });
        // チャレンジサークルの描画
        const challengeCircle = this.add.circle(
            baseCircle.x,
            baseCircle.y,
            GAME_CONST.FISHING_GAME_CIRCLE_RADIUS_BASE,
            Phaser.Display.Color.HexStringToColor(
                GAME_CONST.FISHING_GAME_CHALLENGE_CIRCLE_COLOR
            ).color,
            GAME_CONST.FISHING_GAME_CHALLENGE_CIRCLE_ALPHA
        );
        this.fishingUIContainer.add(challengeCircle);
        // ベースサークルに紐づける
        baseCircle.challengeCircle = challengeCircle;

        // 徐々に小さくなるアニメーションを追加
        this.tweens.add({
            targets: challengeCircle,
            radius: 0,
            duration: GAME_CONST.FISHING_GAME_CIRCLE_LIFETIME,
            ease: "Linear",
            onComplete: () => {
                // アニメーション完了後に円を削除
                challengeCircle.destroy();
                // チャレンジ円の個数を減らす
                this.challengeCircleCount--;
                baseCircle.challengeCircle = null;
            },
        });
    }

    /**
     * チャレンジ円の元の円をタップしたときの処理
     */
    tapChallengeCircle(baseCircle) {
        if (!baseCircle.challengeCircle) {
            // すでに消えている場合は何もしない
            return;
        }
        // 成功ゲージの値を増加させる（アップグレード倍率適用）
        const increaseAmount =
            GAME_CONST.SUCCESS_GAUGE_INCREASE_ON_TAP * this.linePowerMultiplier;
        this.successGaugeValue += increaseAmount;
        // 成功ゲージの値が最大値を超えないようにする
        if (this.successGaugeValue > this.successGaugeMax) {
            this.successGaugeValue = this.successGaugeMax;
        }
        // 既存のアニメーションを停止
        this.tweens.killTweensOf(baseCircle.challengeCircle);
        this.challengeCircleCount--;
        // チャレンジ円を削除
        baseCircle.challengeCircle.destroy();
        baseCircle.challengeCircle = null;
        // アニメーション用の円を追加
        const successCircle = this.add.circle(
            baseCircle.x,
            baseCircle.y,
            GAME_CONST.FISHING_GAME_CIRCLE_RADIUS_BASE,
            Phaser.Display.Color.HexStringToColor(GAME_CONST.SUCCESS_FADE_COLOR)
                .color,
            GAME_CONST.SUCCESS_FADE_ALPHA
        );
        successCircle.setDepth(100);
        this.fishingUIContainer.add(successCircle);
        // 透明度を徐々に下げ、サイズを大きくしてから削除するアニメーションを追加
        this.tweens.add({
            targets: successCircle,
            alpha: 0,
            radius:
                GAME_CONST.FISHING_GAME_CIRCLE_RADIUS_BASE *
                GAME_CONST.SUCCESS_FADE_SCALE,
            duration: GAME_CONST.SUCCESS_FADE_DURATION,
            ease: "Quad.out",
            onComplete: () => {
                successCircle.destroy();
            },
        });
    }

    /**
     * 釣り成功時の処理
     */
    fishingSuccess() {
        // チャレンジ円出現のタイマーを停止
        this.timerAppearChallengeCircle.remove(false);
        // 円とゲージをフェードアウト
        this.tweens.add({
            targets: this.fishingUIContainer,
            alpha: 0,
            duration: GAME_CONST.SUCCESS_SCENE_FADE_TIME,
            ease: "Linear",
        });
        // 一定時間後にシーンを終了してメインのゲームシーンに戻る
        this.time.delayedCall(GAME_CONST.SUCCESS_SCENE_FADE_TIME, () => {
            this.showFishingResultSuccess();
        });
    }

    /**
     * 釣り結果の表示処理
     */
    showFishingResultSuccess() {
        // メインの時と同じようにコンテナを作成
        this.fishingResultContainer = this.add.container(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2
        );
        // UIを長方形で表示
        const uiRectangle = this.add
            .rectangle(
                0,
                0,
                UI_CONST.FISHING_RESULT_WIDTH,
                UI_CONST.FISHING_RESULT_HEIGHT,
                UI_CONST.FISHING_RESULT_RECTANGLE_COLOR
            )
            .setStrokeStyle(
                UI_CONST.FISHING_RESULT_RECTANGLE_LINE_WIDTH,
                UI_CONST.FISHING_RESULT_RECTANGLE_LINE_COLOR
            );
        this.fishingResultContainer.add(uiRectangle);

        // 結果の魚スプライトを表示
        const fishSprite = this.add
            .sprite(
                0,
                UI_CONST.FISHING_RESULT_SPRITE_Y,
                assets.image[this.fishName].key
            )
            .setOrigin(0.5, 0.5);
        this.fishingResultContainer.add(fishSprite);

        // テキストを表示
        const fishDisplayName =
            getLocalizedText(GAME_CONST.FISH_DISPLAY_NAME[this.fishName]) ||
            this.fishName;
        const resultText = this.add
            .text(0, UI_CONST.FISHING_RESULT_TEXT_Y, fishDisplayName, {
                fontFamily: FONT_NAME.MELONANO,
                fontSize: `${UI_CONST.FISHING_RESULT_TEXT_FONT_SIZE}px`,
                color: UI_CONST.FISHING_RESULT_TEXT_COLOR,
                align: "center",
            })
            .setOrigin(0.5, 0.5);
        this.fishingResultContainer.add(resultText);

        // OKボタンを枠付きで表示
        const okButton = this.add
            .rectangle(
                0,
                UI_CONST.FISHING_RESULT_BUTTON_Y,
                UI_CONST.FISHING_RESULT_BUTTON_WIDTH,
                UI_CONST.FISHING_RESULT_BUTTON_HEIGHT,
                Phaser.Display.Color.HexStringToColor(
                    UI_CONST.FISHING_RESULT_BUTTON_BACKGROUND_COLOR
                ).color
            )
            .setStrokeStyle(
                UI_CONST.FISHING_RESULT_BUTTON_BORDER_WIDTH,
                Phaser.Display.Color.HexStringToColor(
                    UI_CONST.FISHING_RESULT_BUTTON_BORDER_COLOR
                ).color
            )
            .setOrigin(0.5, 0.5)
            .setInteractive({ useHandCursor: true });
        this.fishingResultContainer.add(okButton);
        // OKボタンのテキストを表示
        const okButtonText = this.add
            .text(
                0,
                UI_CONST.FISHING_RESULT_BUTTON_Y,
                UI_CONST.FISHING_RESULT_BUTTON_TEXT,
                {
                    fontFamily: FONT_NAME.MELONANO,
                    fontSize: `${UI_CONST.FISHING_RESULT_BUTTON_FONT_SIZE}px`,
                    color: UI_CONST.FISHING_RESULT_BUTTON_TEXT_COLOR,
                    align: "center",
                }
            )
            .setOrigin(0.5, 0.5);
        this.fishingResultContainer.add(okButtonText);
        okButton.on("pointerdown", () => {
            // メッセージボトルの場合は手紙表示ウィンドウを表示
            if (this.fishName === GAME_CONST.FISH_NAME.BOTTLE_LETTER) {
                this.showLetterWindow();
            } else {
                // 釣りシーンを終了してメインのゲームシーンに戻る
                this.scene.stop("Fishing");
                this.scene.resume("Game", {
                    from: "fishing",
                    fishName: this.fishName,
                    success: true,
                });
            }
        });
    }

    /**
     * 手紙表示ウィンドウを表示
     */
    showLetterWindow() {
        // リザルトコンテナをフェードアウト
        this.tweens.add({
            targets: this.fishingResultContainer,
            alpha: 0,
            duration: 300,
            ease: "Linear",
        });

        // 一定時間後に手紙ウィンドウを表示
        this.time.delayedCall(300, () => {
            // 手紙コンテナを作成
            this.letterContainer = this.add.container(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2
            );
            // UIを長方形で表示
            const uiRectangle = this.add
                .rectangle(
                    0,
                    0,
                    UI_CONST.LETTER_WINDOW_WIDTH,
                    UI_CONST.LETTER_WINDOW_HEIGHT,
                    UI_CONST.LETTER_WINDOW_RECTANGLE_COLOR
                )
                .setStrokeStyle(
                    UI_CONST.LETTER_WINDOW_RECTANGLE_LINE_WIDTH,
                    UI_CONST.LETTER_WINDOW_RECTANGLE_LINE_COLOR
                );
            this.letterContainer.add(uiRectangle);

            // 手紙の内容を表示
            // story_planet.jsonから手紙の内容を取得（順番に表示）
            const storyData = this.cache.json.get(this.letterCategory);
            const currentLang = getCurrentLanguage() || "JP";
            const letterMessages = storyData.messages[currentLang];
            // letterIndexを使用して順番に表示（インデックスが範囲外の場合は最後の手紙）
            const letterIndex =
                this.letterIndex !== undefined
                    ? Math.min(this.letterIndex, letterMessages.length - 1)
                    : 0;
            const letterContent = letterMessages[letterIndex];
            // ページ番号を保存
            this.currentLetterIndex = letterIndex;
            this.totalLetters = letterMessages.length;

            // 一時的なテキストオブジェクトを作成してテキストの幅を測定
            const fontSize =
                currentLang === "EN"
                    ? UI_CONST.LETTER_TEXT_FONT_SIZE_EN
                    : UI_CONST.LETTER_TEXT_FONT_SIZE;
            const tempText = this.add.text(0, 0, "", {
                fontFamily: FONT_NAME.MELONANO,
                fontSize: `${fontSize}px`,
            });

            // テキストを幅に合わせて改行
            const wrappedText = wrapText(
                tempText,
                letterContent,
                UI_CONST.LETTER_TEXT_MAX_WIDTH
            );
            tempText.destroy();

            const letterText = this.add
                .text(0, UI_CONST.LETTER_TEXT_Y, wrappedText, {
                    fontFamily: FONT_NAME.MELONANO,
                    fontSize: `${fontSize}px`,
                    color: UI_CONST.LETTER_TEXT_COLOR,
                    align: "left",
                    lineSpacing: UI_CONST.LETTER_TEXT_LINE_SPACING,
                })
                .setOrigin(0.5, 0);
            this.letterContainer.add(letterText);

            // ページ番号を表示（n/a形式）
            const pageNumber = this.add
                .text(
                    0,
                    UI_CONST.LETTER_WINDOW_HEIGHT / 2 - 40,
                    `${this.currentLetterIndex + 1}/${this.totalLetters}`,
                    {
                        fontFamily: FONT_NAME.MELONANO,
                        fontSize: "20px",
                        color: UI_CONST.LETTER_TEXT_COLOR,
                        align: "center",
                    }
                )
                .setOrigin(0.5, 0.5);
            this.letterContainer.add(pageNumber);

            // 閉じるボタンを枠付きで表示
            const closeButton = this.add
                .rectangle(
                    0,
                    UI_CONST.LETTER_CLOSE_BUTTON_Y,
                    UI_CONST.LETTER_CLOSE_BUTTON_WIDTH,
                    UI_CONST.LETTER_CLOSE_BUTTON_HEIGHT,
                    UI_CONST.LETTER_CLOSE_BUTTON_BACKGROUND_COLOR
                )
                .setStrokeStyle(
                    UI_CONST.LETTER_CLOSE_BUTTON_BORDER_WIDTH,
                    UI_CONST.LETTER_CLOSE_BUTTON_BORDER_COLOR
                )
                .setOrigin(0.5, 0.5)
                .setInteractive({ useHandCursor: true });
            this.letterContainer.add(closeButton);
            // 閉じるボタンのテキストを表示
            const closeButtonText = this.add
                .text(
                    0,
                    UI_CONST.LETTER_CLOSE_BUTTON_Y,
                    UI_CONST.LETTER_CLOSE_BUTTON_TEXT,
                    {
                        fontFamily: FONT_NAME.MELONANO,
                        fontSize: `${UI_CONST.LETTER_CLOSE_BUTTON_FONT_SIZE}px`,
                        color: UI_CONST.LETTER_CLOSE_BUTTON_TEXT_COLOR,
                        align: "center",
                    }
                )
                .setOrigin(0.5, 0.5);
            this.letterContainer.add(closeButtonText);
            closeButton.on("pointerdown", () => {
                // 釣りシーンを終了してメインのゲームシーンに戻る
                this.scene.stop("Fishing");
                this.scene.resume("Game", {
                    from: "fishing",
                    fishName: this.fishName,
                    letterIndex: this.currentLetterIndex,
                    letterCategory: this.letterCategory,
                    success: true,
                });
            });
        });
    }
}
