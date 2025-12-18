import { COMMON_CONST, FONT_NAME } from "../const/CommonConst.js";
import { UI_CONST } from "../const/UIConst.js";
import { addButtonEffects, DEFAULT_BUTTON_STYLE } from "../ui/ButtonUtils.js";

/**
 * クレジット画面シーン
 */
export class Credits extends Phaser.Scene {
    constructor() {
        super("Credits");
    }

    create() {
        // 背景色設定
        this.cameras.main.setBackgroundColor(0x000033);

        // タイトルテキスト
        this.add
            .text(COMMON_CONST.SCREEN_WIDTH / 2, 80, UI_CONST.CREDITS_TITLE, {
                fontFamily: FONT_NAME.CHECKPOINT,
                fontSize: 64,
                color: "#ffff00",
                stroke: "#000000",
                strokeThickness: 10,
                align: "center",
            })
            .setOrigin(0.5);

        // クレジット内容（2列表示用）
        const creditsContentLeft = [
            {
                title: UI_CONST.CREDITS_SECTION_GAME_DESIGN,
                names: ["むりこ", "ののむらむら"],
            },
            {
                title: UI_CONST.CREDITS_SECTION_GRAPHICS,
                names: ["むりこ", "ののむらむら"],
            },
        ];

        const creditsContentRight = [
            {
                title: UI_CONST.CREDITS_SECTION_SOUND,
                names: ["フリー素材", "ののむらむら"],
            },
            {
                title: UI_CONST.CREDITS_SECTION_THANKS,
                names: ["あなた", "みんな", "わたし"],
            },
        ];

        const startY = 180;
        const lineSpacing = 40;
        const sectionSpacing = 60;
        const columnSpacing = 500;
        const leftColumnX = COMMON_CONST.SCREEN_WIDTH / 2 - columnSpacing / 2;
        const rightColumnX = COMMON_CONST.SCREEN_WIDTH / 2 + columnSpacing / 2;

        // 左列の表示
        let currentY = startY;
        creditsContentLeft.forEach((section) => {
            // セクションタイトル
            this.add
                .text(leftColumnX, currentY, section.title, {
                    fontFamily: FONT_NAME.CHECKPOINT,
                    fontSize: 28,
                    color: "#00ffff",
                    stroke: "#000000",
                    strokeThickness: 6,
                    align: "center",
                })
                .setOrigin(0.5);

            currentY += lineSpacing;

            // 名前リスト
            section.names.forEach((name) => {
                this.add
                    .text(leftColumnX, currentY, name, {
                        fontFamily: FONT_NAME.CHECKPOINT,
                        fontSize: 24,
                        color: "#ffffff",
                        stroke: "#000000",
                        strokeThickness: 4,
                        align: "center",
                    })
                    .setOrigin(0.5);

                currentY += lineSpacing;
            });

            currentY += sectionSpacing - lineSpacing;
        });

        // 右列の表示
        currentY = startY;
        creditsContentRight.forEach((section) => {
            // セクションタイトル
            this.add
                .text(rightColumnX, currentY, section.title, {
                    fontFamily: FONT_NAME.CHECKPOINT,
                    fontSize: 28,
                    color: "#00ffff",
                    stroke: "#000000",
                    strokeThickness: 6,
                    align: "center",
                })
                .setOrigin(0.5);

            currentY += lineSpacing;

            // 名前リスト
            section.names.forEach((name) => {
                this.add
                    .text(rightColumnX, currentY, name, {
                        fontFamily: FONT_NAME.CHECKPOINT,
                        fontSize: 24,
                        color: "#ffffff",
                        stroke: "#000000",
                        strokeThickness: 4,
                        align: "center",
                    })
                    .setOrigin(0.5);

                currentY += lineSpacing;
            });

            currentY += sectionSpacing - lineSpacing;
        });

        // 戻るボタン
        const backButton = this.add
            .text(
                COMMON_CONST.SCREEN_WIDTH / 2,
                COMMON_CONST.SCREEN_HEIGHT / 2 + 150,
                UI_CONST.CREDITS_BUTTON_BACK,
                DEFAULT_BUTTON_STYLE
            )
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        addButtonEffects(backButton, () => {
            this.scene.start("Title");
        });

        // スペースキーでも戻れる
        this.input.keyboard.on("keydown-SPACE", () => {
            this.scene.start("Title");
        });
    }
}
