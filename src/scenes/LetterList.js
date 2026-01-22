import { UI_CONST, UI_TEXT } from "../const/UIConst.js";
import {
    FONT_NAME,
    getLocalizedText,
    getCurrentLanguage,
} from "../const/CommonConst.js";
import { wrapText } from "../../core/utils/TextUtils.js";

/**
 * 手紙リスト表示シーン
 * カテゴリ選択 → カテゴリ内一覧 → 手紙内容
 */
export class LetterList extends Phaser.Scene {
    constructor() {
        super("LetterList");
    }

    /**
     * 初期化
     */
    create() {
        // Gameシーン参照
        this.gameScene = this.scene.get("Game");
        this.letterManager = this.gameScene.letterManager;

        // 背景オーバーレイ
        this.add
            .rectangle(
                0,
                0,
                this.cameras.main.width,
                this.cameras.main.height,
                UI_CONST.FISHING_BACKGROUND_COLOR,
                UI_CONST.FISHING_BACKGROUND_ALPHA,
            )
            .setOrigin(0, 0);

        // 利用可能カテゴリ
        this.categories = this.letterManager.getAvailableCategories();
        this.showCategorySelection();
    }

    /**
     * カテゴリ選択画面
     */
    showCategorySelection() {
        // 既存コンテナ破棄
        if (this.letterListContainer) {
            this.letterListContainer.destroy();
        }

        // UIコンテナ
        this.letterListContainer = this.add.container(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
        );

        // ウィンドウ
        const uiRectangle = this.add
            .rectangle(
                0,
                0,
                UI_CONST.LETTER_WINDOW_WIDTH,
                UI_CONST.LETTER_WINDOW_HEIGHT,
                UI_CONST.LETTER_WINDOW_RECTANGLE_COLOR,
            )
            .setStrokeStyle(
                UI_CONST.LETTER_WINDOW_RECTANGLE_LINE_WIDTH,
                UI_CONST.LETTER_WINDOW_RECTANGLE_LINE_COLOR,
            );
        this.letterListContainer.add(uiRectangle);

        // タイトル
        const titleText = this.add
            .text(0, UI_CONST.LETTER_LIST_START_Y - 80, "物語を選択", {
                fontFamily: FONT_NAME.CP_PERIOD,
                fontSize: UI_CONST.LETTER_LIST_CATEGORY_FONT_SIZE,
                color: UI_CONST.LETTER_LIST_CATEGORY_COLOR,
                align: "center",
                stroke: UI_CONST.LETTER_LIST_CATEGORY_STROKE_COLOR,
                strokeThickness: 2,
            })
            .setOrigin(0.5, 0.5);
        this.letterListContainer.add(titleText);

        // カテゴリ一覧
        const startY = UI_CONST.LETTER_LIST_START_Y;
        const itemHeight = UI_CONST.LETTER_LIST_ITEM_HEIGHT;
        let currentY = startY;

        this.categories.forEach((categoryKey) => {
            const categoryBg = this.add
                .rectangle(
                    0,
                    currentY,
                    UI_CONST.LETTER_LIST_ITEM_WIDTH,
                    UI_CONST.LETTER_LIST_ITEM_HEIGHT - 5,
                    UI_CONST.LETTER_LIST_ITEM_BG_COLOR,
                )
                .setStrokeStyle(
                    UI_CONST.LETTER_LIST_ITEM_BORDER_WIDTH,
                    UI_CONST.LETTER_LIST_ITEM_BORDER_COLOR,
                )
                .setInteractive({ useHandCursor: true });
            this.letterListContainer.add(categoryBg);

            const categoryName =
                this.letterManager.getCategoryDisplayName(categoryKey);
            const readLetters = this.letterManager.getReadLetters(categoryKey);
            const storyData = this.cache.json.get(categoryKey);
            const currentLang = getCurrentLanguage() || "JP";
            const totalLetters = storyData.messages[currentLang].length;

            const categoryText = this.add
                .text(
                    0,
                    currentY,
                    `${categoryName} (${readLetters.length}/${totalLetters})`,
                    {
                        fontFamily: FONT_NAME.CP_PERIOD,
                        fontSize: UI_CONST.LETTER_LIST_ITEM_FONT_SIZE,
                        color: UI_CONST.LETTER_TEXT_COLOR,
                        align: "center",
                        stroke: UI_CONST.LETTER_LIST_ITEM_STROKE_COLOR,
                        strokeThickness:
                            UI_CONST.LETTER_LIST_ITEM_STROKE_THICKNESS,
                    },
                )
                .setOrigin(0.5, 0.5);
            this.letterListContainer.add(categoryText);

            categoryBg.on("pointerdown", () => {
                this.playDecisionSe();
                this.showCategoryLetters(categoryKey);
            });

            currentY += itemHeight + 10;
        });

        // 閉じる
        const closeButton = this.add
            .rectangle(
                0,
                UI_CONST.LETTER_CLOSE_BUTTON_Y,
                UI_CONST.LETTER_CLOSE_BUTTON_WIDTH,
                UI_CONST.LETTER_CLOSE_BUTTON_HEIGHT,
                UI_CONST.LETTER_CLOSE_BUTTON_BACKGROUND_COLOR,
            )
            .setStrokeStyle(
                UI_CONST.LETTER_CLOSE_BUTTON_BORDER_WIDTH,
                UI_CONST.LETTER_CLOSE_BUTTON_BORDER_COLOR,
            )
            .setOrigin(0.5, 0.5)
            .setInteractive({ useHandCursor: true });
        this.letterListContainer.add(closeButton);

        const closeButtonText = this.add
            .text(0, UI_CONST.LETTER_CLOSE_BUTTON_Y, "×", {
                fontFamily: FONT_NAME.CP_PERIOD,
                fontSize: UI_CONST.LETTER_CLOSE_BUTTON_FONT_SIZE,
                color: UI_CONST.LETTER_CLOSE_BUTTON_TEXT_COLOR,
                align: "center",
                stroke: UI_CONST.PAUSE_MODAL_TITLE_STROKE_COLOR,
                strokeThickness: 2,
            })
            .setOrigin(0.5, 0.5);
        this.letterListContainer.add(closeButtonText);

        closeButton.on("pointerdown", () => {
            this.playCancelSe();
            this.gameScene.gameTimeManager.resume();
            this.gameScene.gameTimeManager.resumeFishSystem();
            this.scene.stop("LetterList");
            this.scene.resume("Game");
        });
    }

    /**
     * カテゴリ内手紙一覧
     */
    showCategoryLetters(categoryKey) {
        // コンテナ再構成
        this.letterListContainer.destroy();
        this.letterListContainer = this.add.container(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
        );

        // ウィンドウ
        const uiRectangle = this.add
            .rectangle(
                0,
                0,
                UI_CONST.LETTER_WINDOW_WIDTH,
                UI_CONST.LETTER_WINDOW_HEIGHT,
                UI_CONST.LETTER_WINDOW_RECTANGLE_COLOR,
            )
            .setStrokeStyle(
                UI_CONST.LETTER_WINDOW_RECTANGLE_LINE_WIDTH,
                UI_CONST.LETTER_WINDOW_RECTANGLE_LINE_COLOR,
            );
        this.letterListContainer.add(uiRectangle);

        // タイトル
        const categoryName =
            this.letterManager.getCategoryDisplayName(categoryKey);
        const categoryTitle = this.add
            .text(0, UI_CONST.LETTER_LIST_START_Y - 80, `【${categoryName}】`, {
                fontFamily: FONT_NAME.CP_PERIOD,
                fontSize: UI_CONST.LETTER_LIST_CATEGORY_FONT_SIZE,
                color: UI_CONST.LETTER_LIST_CATEGORY_COLOR,
                align: "center",
                stroke: UI_CONST.LETTER_LIST_CATEGORY_STROKE_COLOR,
                strokeThickness: UI_CONST.LETTER_LIST_CATEGORY_STROKE_THICKNESS,
            })
            .setOrigin(0.5, 0.5);
        this.letterListContainer.add(categoryTitle);

        const startY = UI_CONST.LETTER_LIST_START_Y;
        const itemHeight = UI_CONST.LETTER_LIST_ITEM_HEIGHT;
        let currentY = startY;

        const readLetters = this.letterManager.getReadLetters(categoryKey);
        const storyData = this.cache.json.get(categoryKey);
        const currentLang = getCurrentLanguage() || "JP";
        const letterMessages = storyData.messages[currentLang];

        console.log(
            `[LetterList] showCategoryLetters: categoryKey=${categoryKey}, readLetters=${JSON.stringify(readLetters)}`,
        );

        // 表示対象: 読んだページのみ
        const displayLetters = readLetters.slice();

        if (displayLetters.length === 0) {
            // まだ手紙がない場合はメッセージを表示
            const noLetterText = this.add
                .text(0, currentY, "このカテゴリはまだ手紙が到着していません", {
                    fontFamily: FONT_NAME.CP_PERIOD,
                    fontSize: UI_CONST.LETTER_LIST_ITEM_FONT_SIZE,
                    color: UI_CONST.LETTER_TEXT_COLOR,
                    align: "center",
                    stroke: UI_CONST.LETTER_LIST_ITEM_STROKE_COLOR,
                    strokeThickness: UI_CONST.LETTER_LIST_ITEM_STROKE_THICKNESS,
                })
                .setOrigin(0.5, 0.5);
            this.letterListContainer.add(noLetterText);
        } else {
            displayLetters.forEach((letterIndex) => {
                const itemBg = this.add
                    .rectangle(
                        0,
                        currentY,
                        UI_CONST.LETTER_LIST_ITEM_WIDTH,
                        UI_CONST.LETTER_LIST_ITEM_HEIGHT - 5,
                        UI_CONST.LETTER_LIST_ITEM_BG_COLOR,
                    )
                    .setStrokeStyle(
                        UI_CONST.LETTER_LIST_ITEM_BORDER_WIDTH,
                        UI_CONST.LETTER_LIST_ITEM_BORDER_COLOR,
                    )
                    .setInteractive({ useHandCursor: true });
                this.letterListContainer.add(itemBg);

                const previewText =
                    letterMessages[letterIndex]
                        .replace(/\n/g, " ")
                        .substring(0, UI_CONST.LETTER_LIST_PREVIEW_MAX_LENGTH) +
                    "...";
                const itemText = this.add
                    .text(
                        0,
                        currentY,
                        `${getLocalizedText(UI_TEXT.LETTER.LETTER_PREFIX)}${
                            letterIndex + 1
                        }: ${previewText}`,
                        {
                            fontFamily: FONT_NAME.CP_PERIOD,
                            fontSize: UI_CONST.LETTER_LIST_ITEM_FONT_SIZE,
                            color: UI_CONST.LETTER_TEXT_COLOR,
                            align: "center",
                            stroke: UI_CONST.LETTER_LIST_ITEM_STROKE_COLOR,
                            strokeThickness:
                                UI_CONST.LETTER_LIST_ITEM_STROKE_THICKNESS,
                        },
                    )
                    .setOrigin(0.5, 0.5);
                this.letterListContainer.add(itemText);

                itemBg.on("pointerdown", () => {
                    this.playDecisionSe();
                    this.showLetterContent(
                        categoryKey,
                        letterIndex,
                        displayLetters,
                    );
                });

                currentY += itemHeight + 10;
            });
        }

        // 戻る（カテゴリ選択へ）
        const backButton = this.add
            .rectangle(
                0,
                UI_CONST.LETTER_CLOSE_BUTTON_Y,
                UI_CONST.LETTER_CLOSE_BUTTON_WIDTH,
                UI_CONST.LETTER_CLOSE_BUTTON_HEIGHT,
                UI_CONST.LETTER_CLOSE_BUTTON_BACKGROUND_COLOR,
            )
            .setStrokeStyle(
                UI_CONST.LETTER_CLOSE_BUTTON_BORDER_WIDTH,
                UI_CONST.LETTER_CLOSE_BUTTON_BORDER_COLOR,
            )
            .setOrigin(0.5, 0.5)
            .setInteractive({ useHandCursor: true });
        this.letterListContainer.add(backButton);

        const backButtonText = this.add
            .text(0, UI_CONST.LETTER_CLOSE_BUTTON_Y, "←", {
                fontFamily: FONT_NAME.CP_PERIOD,
                fontSize: UI_CONST.LETTER_CLOSE_BUTTON_FONT_SIZE,
                color: UI_CONST.LETTER_CLOSE_BUTTON_TEXT_COLOR,
                align: "center",
                stroke: UI_CONST.PAUSE_MODAL_TITLE_STROKE_COLOR,
                strokeThickness: 2,
            })
            .setOrigin(0.5, 0.5);
        this.letterListContainer.add(backButtonText);

        backButton.on("pointerdown", () => {
            this.playCancelSe();
            this.showCategorySelection();
        });
    }

    /**
     * 手紙内容
     */
    showLetterContent(categoryKey, letterIndex, displayLetters) {
        // リスト非表示
        this.letterListContainer.setVisible(false);

        // コンテナ
        this.letterContentContainer = this.add.container(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
        );

        // ウィンドウ
        const uiRectangle = this.add
            .rectangle(
                0,
                0,
                UI_CONST.LETTER_WINDOW_WIDTH,
                UI_CONST.LETTER_WINDOW_HEIGHT,
                UI_CONST.LETTER_WINDOW_RECTANGLE_COLOR,
            )
            .setStrokeStyle(
                UI_CONST.LETTER_WINDOW_RECTANGLE_LINE_WIDTH,
                UI_CONST.LETTER_WINDOW_RECTANGLE_LINE_COLOR,
            );
        this.letterContentContainer.add(uiRectangle);

        // 内容テキスト
        const storyData = this.cache.json.get(categoryKey);
        const currentLang = getCurrentLanguage() || "JP";
        const letterMessages = storyData.messages[currentLang];
        const letterContent = letterMessages[letterIndex];

        const fontSize =
            currentLang === "EN"
                ? UI_CONST.LETTER_TEXT_FONT_SIZE_EN
                : UI_CONST.LETTER_TEXT_FONT_SIZE;
        const tempText = this.add.text(0, 0, "", {
            fontFamily: FONT_NAME.CP_PERIOD,
            fontSize: `${fontSize}px`,
        });

        const wrappedText = wrapText(
            tempText,
            letterContent,
            UI_CONST.LETTER_TEXT_MAX_WIDTH,
        );
        tempText.destroy();

        const letterText = this.add
            .text(0, UI_CONST.LETTER_TEXT_Y, wrappedText, {
                fontFamily: FONT_NAME.CP_PERIOD,
                fontSize: `${fontSize}px`,
                color: UI_CONST.LETTER_TEXT_COLOR,
                align: "left",
                lineSpacing: UI_CONST.LETTER_TEXT_LINE_SPACING,
                stroke: "#000000",
                strokeThickness: 1,
            })
            .setOrigin(0.5, 0);
        this.letterContentContainer.add(letterText);

        // ページ番号
        const totalLetters = letterMessages.length;
        const pageNumber = this.add
            .text(
                0,
                UI_CONST.LETTER_WINDOW_HEIGHT / 2 -
                    UI_CONST.LETTER_CONTENT_PAGE_NUMBER_Y_OFFSET,
                `${letterIndex + 1}/${totalLetters}`,
                {
                    fontFamily: FONT_NAME.CP_PERIOD,
                    fontSize: UI_CONST.LETTER_CONTENT_PAGE_NUMBER_FONT_SIZE,
                    color: UI_CONST.LETTER_CONTENT_PAGE_NUMBER_COLOR,
                    align: "center",
                    stroke: UI_CONST.LETTER_CONTENT_PAGE_NUMBER_STROKE_COLOR,
                    strokeThickness:
                        UI_CONST.LETTER_CONTENT_PAGE_NUMBER_STROKE_THICKNESS,
                },
            )
            .setOrigin(0.5, 0.5);
        this.letterContentContainer.add(pageNumber);

        // ナビ用配列
        const displayList = Array.isArray(displayLetters)
            ? displayLetters
            : [letterIndex];
        const currentIndex = displayList.indexOf(letterIndex);

        // 前へ
        if (currentIndex > 0) {
            const prevButton = this.add
                .rectangle(
                    UI_CONST.LETTER_CONTENT_PREV_BUTTON_X_OFFSET,
                    UI_CONST.LETTER_CLOSE_BUTTON_Y,
                    UI_CONST.LETTER_CLOSE_BUTTON_WIDTH,
                    UI_CONST.LETTER_CLOSE_BUTTON_HEIGHT,
                    UI_CONST.LETTER_CONTENT_PREV_BUTTON_COLOR,
                )
                .setStrokeStyle(
                    UI_CONST.LETTER_CLOSE_BUTTON_BORDER_WIDTH,
                    UI_CONST.LETTER_CLOSE_BUTTON_BORDER_COLOR,
                )
                .setOrigin(0.5, 0.5)
                .setInteractive({ useHandCursor: true });
            this.letterContentContainer.add(prevButton);

            const prevButtonText = this.add
                .text(
                    UI_CONST.LETTER_CONTENT_PREV_BUTTON_X_OFFSET,
                    UI_CONST.LETTER_CLOSE_BUTTON_Y,
                    UI_CONST.LETTER_CONTENT_PREV_BUTTON_TEXT,
                    {
                        fontFamily: FONT_NAME.CP_PERIOD,
                        fontSize: UI_CONST.LETTER_CONTENT_PREV_BUTTON_FONT_SIZE,
                        color: UI_CONST.LETTER_CLOSE_BUTTON_TEXT_COLOR,
                        align: "center",
                        stroke: UI_CONST.PAUSE_MODAL_TITLE_STROKE_COLOR,
                        strokeThickness: 2,
                    },
                )
                .setOrigin(0.5, 0.5);
            this.letterContentContainer.add(prevButtonText);

            prevButton.on("pointerdown", () => {
                this.playDecisionSe();
                const prevLetterIndex = displayList[currentIndex - 1];
                this.letterContentContainer.destroy();
                this.showLetterContent(
                    categoryKey,
                    prevLetterIndex,
                    displayList,
                );
            });
        }

        // 次へ
        if (currentIndex < displayList.length - 1) {
            const nextButton = this.add
                .rectangle(
                    UI_CONST.LETTER_CONTENT_NEXT_BUTTON_X_OFFSET,
                    UI_CONST.LETTER_CLOSE_BUTTON_Y,
                    UI_CONST.LETTER_CLOSE_BUTTON_WIDTH,
                    UI_CONST.LETTER_CLOSE_BUTTON_HEIGHT,
                    UI_CONST.LETTER_CONTENT_NEXT_BUTTON_COLOR,
                )
                .setStrokeStyle(
                    UI_CONST.LETTER_CLOSE_BUTTON_BORDER_WIDTH,
                    UI_CONST.LETTER_CLOSE_BUTTON_BORDER_COLOR,
                )
                .setOrigin(0.5, 0.5)
                .setInteractive({ useHandCursor: true });
            this.letterContentContainer.add(nextButton);

            const nextButtonText = this.add
                .text(
                    UI_CONST.LETTER_CONTENT_NEXT_BUTTON_X_OFFSET,
                    UI_CONST.LETTER_CLOSE_BUTTON_Y,
                    UI_CONST.LETTER_CONTENT_NEXT_BUTTON_TEXT,
                    {
                        fontFamily: FONT_NAME.CP_PERIOD,
                        fontSize: UI_CONST.LETTER_CONTENT_NEXT_BUTTON_FONT_SIZE,
                        color: UI_CONST.LETTER_CLOSE_BUTTON_TEXT_COLOR,
                        align: "center",
                        stroke: UI_CONST.PAUSE_MODAL_TITLE_STROKE_COLOR,
                        strokeThickness: 2,
                    },
                )
                .setOrigin(0.5, 0.5);
            this.letterContentContainer.add(nextButtonText);

            nextButton.on("pointerdown", () => {
                this.playDecisionSe();
                const nextLetterIndex = displayList[currentIndex + 1];
                this.letterContentContainer.destroy();
                this.showLetterContent(
                    categoryKey,
                    nextLetterIndex,
                    displayList,
                );
            });
        }

        // 閉じる（カテゴリ内一覧へ戻る）
        const backButton = this.add
            .rectangle(
                0,
                UI_CONST.LETTER_CLOSE_BUTTON_Y,
                UI_CONST.LETTER_CLOSE_BUTTON_WIDTH,
                UI_CONST.LETTER_CLOSE_BUTTON_HEIGHT,
                UI_CONST.LETTER_CLOSE_BUTTON_BACKGROUND_COLOR,
            )
            .setStrokeStyle(
                UI_CONST.LETTER_CLOSE_BUTTON_BORDER_WIDTH,
                UI_CONST.LETTER_CLOSE_BUTTON_BORDER_COLOR,
            )
            .setOrigin(0.5, 0.5)
            .setInteractive({ useHandCursor: true });
        this.letterContentContainer.add(backButton);

        const backButtonText = this.add
            .text(0, UI_CONST.LETTER_CLOSE_BUTTON_Y, "×", {
                fontFamily: FONT_NAME.CP_PERIOD,
                fontSize: UI_CONST.LETTER_CLOSE_BUTTON_FONT_SIZE,
                color: UI_CONST.LETTER_CLOSE_BUTTON_TEXT_COLOR,
                align: "center",
                stroke: UI_CONST.PAUSE_MODAL_TITLE_STROーク_COLOR,
                strokeThickness: 2,
            })
            .setOrigin(0.5, 0.5);
        this.letterContentContainer.add(backButtonText);

        backButton.on("pointerdown", () => {
            this.playCancelSe();
            this.letterContentContainer.destroy();
            this.letterListContainer.setVisible(true);
        });
    }

    playDecisionSe() {
        this.gameScene?.soundManager?.playSe?.("decision");
    }

    playCancelSe() {
        this.gameScene?.soundManager?.playSe?.("cancel");
    }
}
