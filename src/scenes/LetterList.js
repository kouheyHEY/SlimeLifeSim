import { UI_CONST } from "../const/UIConst.js";
import { FONT_NAME } from "../const/CommonConst.js";
import { wrapText } from "../utils/TextUtils.js";

/**
 * 手紙リスト表示シーン
 */
export class LetterList extends Phaser.Scene {
    constructor() {
        super("LetterList");
    }

    create() {
        // ゲームシーンへの参照を取得
        this.gameScene = this.scene.get("Game");
        this.letterManager = this.gameScene.letterManager;

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

        // 手紙リストコンテナを作成
        this.letterListContainer = this.add.container(
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
        this.letterListContainer.add(uiRectangle);

        // タイトルを表示
        const titleText = this.add
            .text(0, -UI_CONST.LETTER_WINDOW_HEIGHT / 2 + 40, "手紙リスト", {
                fontFamily: FONT_NAME.MELONANO,
                fontSize: "28px",
                color: UI_CONST.LETTER_TEXT_COLOR,
                align: "center",
            })
            .setOrigin(0.5, 0.5);
        this.letterListContainer.add(titleText);

        // カテゴリ別に手紙を表示
        const categories = this.letterManager.getAllCategories();
        const startY = -150;
        const itemHeight = 50;
        let currentY = startY;

        categories.forEach((categoryKey) => {
            // カテゴリタイトルを表示
            const categoryName =
                this.letterManager.getCategoryDisplayName(categoryKey);
            const categoryTitle = this.add
                .text(0, currentY, `【${categoryName}】`, {
                    fontFamily: FONT_NAME.MELONANO,
                    fontSize: "22px",
                    color: "#FFDD00",
                    align: "center",
                })
                .setOrigin(0.5, 0.5);
            this.letterListContainer.add(categoryTitle);
            currentY += itemHeight;

            // カテゴリ内の手紙を表示
            const readLetters = this.letterManager.getReadLetters(categoryKey);
            const storyData = this.cache.json.get(categoryKey);
            const letterMessages = storyData.messages.JP;

            readLetters.forEach((letterIndex) => {
                // 手紙アイテムの背景
                const itemBg = this.add
                    .rectangle(0, currentY, 600, 45, 0x2244aa)
                    .setStrokeStyle(1, 0xffffff)
                    .setInteractive({ useHandCursor: true });
                this.letterListContainer.add(itemBg);

                // 手紙の番号とプレビュー（改行コードを削除）
                const previewText =
                    letterMessages[letterIndex]
                        .replace(/\n/g, " ")
                        .substring(0, 20) + "...";
                const itemText = this.add
                    .text(
                        0,
                        currentY,
                        `手紙 ${letterIndex + 1}: ${previewText}`,
                        {
                            fontFamily: FONT_NAME.MELONANO,
                            fontSize: "18px",
                            color: UI_CONST.LETTER_TEXT_COLOR,
                            align: "center",
                        }
                    )
                    .setOrigin(0.5, 0.5);
                this.letterListContainer.add(itemText);

                // クリック時に手紙の内容を表示
                itemBg.on("pointerdown", () => {
                    this.showLetterContent(categoryKey, letterIndex);
                });

                currentY += itemHeight;
            });

            currentY += 10; // カテゴリ間のスペース
        });

        // 閉じるボタンを追加
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
        this.letterListContainer.add(closeButton);

        const closeButtonText = this.add
            .text(0, UI_CONST.LETTER_CLOSE_BUTTON_Y, "×", {
                fontFamily: FONT_NAME.MELONANO,
                fontSize: "32px",
                color: UI_CONST.LETTER_CLOSE_BUTTON_TEXT_COLOR,
                align: "center",
            })
            .setOrigin(0.5, 0.5);
        this.letterListContainer.add(closeButtonText);

        closeButton.on("pointerdown", () => {
            // ゲーム時間を再開
            this.gameScene.gameTimeManager.resume();
            // 魚ヒットシステムを再開
            this.gameScene.gameTimeManager.resumeFishSystem();
            this.scene.stop("LetterList");
            this.scene.resume("Game");
        });
    }

    /**
     * 手紙の内容を表示
     * @param {string} categoryKey カテゴリキー
     * @param {number} letterIndex 手紙のインデックス
     */
    showLetterContent(categoryKey, letterIndex) {
        // 現在のリストを非表示
        this.letterListContainer.setVisible(false);

        // 手紙内容コンテナを作成
        this.letterContentContainer = this.add.container(
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
        this.letterContentContainer.add(uiRectangle);

        // 手紙の内容を取得
        const storyData = this.cache.json.get(categoryKey);
        const letterMessages = storyData.messages.JP;
        const letterContent = letterMessages[letterIndex];

        // 一時的なテキストオブジェクトを作成してテキストの幅を測定
        const tempText = this.add.text(0, 0, "", {
            fontFamily: FONT_NAME.MELONANO,
            fontSize: `${UI_CONST.LETTER_TEXT_FONT_SIZE}px`,
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
                fontSize: `${UI_CONST.LETTER_TEXT_FONT_SIZE}px`,
                color: UI_CONST.LETTER_TEXT_COLOR,
                align: "left",
                lineSpacing: UI_CONST.LETTER_TEXT_LINE_SPACING,
            })
            .setOrigin(0.5, 0);
        this.letterContentContainer.add(letterText);

        // ページ番号を表示
        const totalLetters = letterMessages.length;
        const pageNumber = this.add
            .text(
                0,
                UI_CONST.LETTER_WINDOW_HEIGHT / 2 - 40,
                `${letterIndex + 1}/${totalLetters}`,
                {
                    fontFamily: FONT_NAME.MELONANO,
                    fontSize: "20px",
                    color: UI_CONST.LETTER_TEXT_COLOR,
                    align: "center",
                }
            )
            .setOrigin(0.5, 0.5);
        this.letterContentContainer.add(pageNumber);

        // 読んだ手紙のリストを取得
        const readLetters = this.letterManager.getReadLetters(categoryKey);
        const currentIndexInReadList = readLetters.indexOf(letterIndex);

        // 前へボタンを追加（最初の手紙でなければ表示）
        if (currentIndexInReadList > 0) {
            const prevButton = this.add
                .rectangle(
                    -200,
                    UI_CONST.LETTER_CLOSE_BUTTON_Y,
                    UI_CONST.LETTER_CLOSE_BUTTON_WIDTH,
                    UI_CONST.LETTER_CLOSE_BUTTON_HEIGHT,
                    0x5566dd
                )
                .setStrokeStyle(
                    UI_CONST.LETTER_CLOSE_BUTTON_BORDER_WIDTH,
                    UI_CONST.LETTER_CLOSE_BUTTON_BORDER_COLOR
                )
                .setOrigin(0.5, 0.5)
                .setInteractive({ useHandCursor: true });
            this.letterContentContainer.add(prevButton);

            const prevButtonText = this.add
                .text(-200, UI_CONST.LETTER_CLOSE_BUTTON_Y, "＜", {
                    fontFamily: FONT_NAME.MELONANO,
                    fontSize: "32px",
                    color: UI_CONST.LETTER_CLOSE_BUTTON_TEXT_COLOR,
                    align: "center",
                })
                .setOrigin(0.5, 0.5);
            this.letterContentContainer.add(prevButtonText);

            prevButton.on("pointerdown", () => {
                // 前の手紙を表示
                const prevLetterIndex = readLetters[currentIndexInReadList - 1];
                this.letterContentContainer.destroy();
                this.showLetterContent(categoryKey, prevLetterIndex);
            });
        }

        // 次へボタンを追加（最後の手紙でなければ表示）
        if (currentIndexInReadList < readLetters.length - 1) {
            const nextButton = this.add
                .rectangle(
                    200,
                    UI_CONST.LETTER_CLOSE_BUTTON_Y,
                    UI_CONST.LETTER_CLOSE_BUTTON_WIDTH,
                    UI_CONST.LETTER_CLOSE_BUTTON_HEIGHT,
                    0x5566dd
                )
                .setStrokeStyle(
                    UI_CONST.LETTER_CLOSE_BUTTON_BORDER_WIDTH,
                    UI_CONST.LETTER_CLOSE_BUTTON_BORDER_COLOR
                )
                .setOrigin(0.5, 0.5)
                .setInteractive({ useHandCursor: true });
            this.letterContentContainer.add(nextButton);

            const nextButtonText = this.add
                .text(200, UI_CONST.LETTER_CLOSE_BUTTON_Y, "＞", {
                    fontFamily: FONT_NAME.MELONANO,
                    fontSize: "32px",
                    color: UI_CONST.LETTER_CLOSE_BUTTON_TEXT_COLOR,
                    align: "center",
                })
                .setOrigin(0.5, 0.5);
            this.letterContentContainer.add(nextButtonText);

            nextButton.on("pointerdown", () => {
                // 次の手紙を表示
                const nextLetterIndex = readLetters[currentIndexInReadList + 1];
                this.letterContentContainer.destroy();
                this.showLetterContent(categoryKey, nextLetterIndex);
            });
        }

        // 戻るボタンを追加
        const backButton = this.add
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
        this.letterContentContainer.add(backButton);

        const backButtonText = this.add
            .text(0, UI_CONST.LETTER_CLOSE_BUTTON_Y, "×", {
                fontFamily: FONT_NAME.MELONANO,
                fontSize: "32px",
                color: UI_CONST.LETTER_CLOSE_BUTTON_TEXT_COLOR,
                align: "center",
            })
            .setOrigin(0.5, 0.5);
        this.letterContentContainer.add(backButtonText);

        backButton.on("pointerdown", () => {
            // 手紙内容を破棄してリストに戻る
            this.letterContentContainer.destroy();
            this.letterListContainer.setVisible(true);
        });
    }
}
