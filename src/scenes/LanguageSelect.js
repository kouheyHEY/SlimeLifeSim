import {
    COMMON_CONST,
    FONT_NAME,
    LANGUAGE,
    setCurrentLanguage,
} from "../const/CommonConst.js";
import { UI_CONST } from "../const/UIConst.js";

/**
 * 言語選択シーン
 * 初回起動時に表示され、日本語または英語を選択
 */
export class LanguageSelect extends Phaser.Scene {
    constructor() {
        super("LanguageSelect");
    }

    /**
     * シーンのプリロード
     * フォント読み込み
     */
    preload() {
        this.load.font(FONT_NAME.CP_PERIOD, "assets/fonts/cp_period.ttf");
    }

    /**
     * シーンの初期化
     * 言語選択ボタンを表示
     */
    create() {
        // 背景全体にオーバーレイをかける
        const overlay = this.add
            .rectangle(
                0,
                0,
                this.cameras.main.width,
                this.cameras.main.height,
                0x000000,
                0.8
            )
            .setOrigin(0, 0);

        // タイトルテキスト
        const titleText = this.add
            .text(
                COMMON_CONST.SCREEN_WIDTH / 2,
                COMMON_CONST.SCREEN_HEIGHT * 0.3,
                "Select Language\n言語を選択してください",
                {
                    fontFamily: FONT_NAME.CP_PERIOD,
                    fontSize: "48px",
                    color: "#FFFFFF",
                    align: "center",
                    stroke: "#000000",
                    strokeThickness: 4,
                }
            )
            .setOrigin(0.5, 0.5);

        // ボタンの設定
        const centerX = COMMON_CONST.SCREEN_WIDTH / 2;
        const centerY = COMMON_CONST.SCREEN_HEIGHT / 2 + 50;
        const buttonWidth = 300;
        const buttonHeight = 80;
        const buttonSpacing = 50;

        // 日本語ボタン
        const japaneseButton = this.add
            .rectangle(
                centerX,
                centerY - buttonHeight / 2 - buttonSpacing / 2,
                buttonWidth,
                buttonHeight,
                0x0066cc
            )
            .setStrokeStyle(3, 0xffffff)
            .setInteractive({ useHandCursor: true });

        const japaneseText = this.add
            .text(
                centerX,
                centerY - buttonHeight / 2 - buttonSpacing / 2,
                "日本語",
                {
                    fontFamily: FONT_NAME.CP_PERIOD,
                    fontSize: "36px",
                    color: "#FFFFFF",
                    align: "center",
                    stroke: "#000000",
                    strokeThickness: 3,
                }
            )
            .setOrigin(0.5, 0.5);

        // 英語ボタン
        const englishButton = this.add
            .rectangle(
                centerX,
                centerY + buttonHeight / 2 + buttonSpacing / 2,
                buttonWidth,
                buttonHeight,
                0x0066cc
            )
            .setStrokeStyle(3, 0xffffff)
            .setInteractive({ useHandCursor: true });

        const englishText = this.add
            .text(
                centerX,
                centerY + buttonHeight / 2 + buttonSpacing / 2,
                "English",
                {
                    fontFamily: FONT_NAME.CP_PERIOD,
                    fontSize: "36px",
                    color: "#FFFFFF",
                    align: "center",
                    stroke: "#000000",
                    strokeThickness: 3,
                }
            )
            .setOrigin(0.5, 0.5);

        // ホバーエフェクト
        japaneseButton.on("pointerover", () => {
            japaneseButton.setFillStyle(0x0088ee);
        });
        japaneseButton.on("pointerout", () => {
            japaneseButton.setFillStyle(0x0066cc);
        });

        englishButton.on("pointerover", () => {
            englishButton.setFillStyle(0x0088ee);
        });
        englishButton.on("pointerout", () => {
            englishButton.setFillStyle(0x0066cc);
        });

        // クリックイベント
        japaneseButton.on("pointerdown", () => {
            this.selectLanguage(LANGUAGE.JAPANESE);
        });

        englishButton.on("pointerdown", () => {
            this.selectLanguage(LANGUAGE.ENGLISH);
        });
    }

    /**
     * 言語を選択してゲームを開始
     * @param {string} language - 選択した言語コード
     */
    selectLanguage(language) {
        // 言語設定を保存
        setCurrentLanguage(language);

        // フェードアウトしてPreloaderへ遷移
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once("camerafadeoutcomplete", () => {
            this.scene.start("Preloader");
        });
    }
}
