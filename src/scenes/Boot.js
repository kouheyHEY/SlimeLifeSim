import { getCurrentLanguage } from "../const/CommonConst.js";

export class Boot extends Phaser.Scene {
    constructor() {
        super("Boot");
    }

    preload() {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        this.load.image("background", "assets/background.png");
    }

    create() {
        // 言語設定をチェック
        const language = getCurrentLanguage();

        if (language === null) {
            // 初回起動：言語選択画面へ
            this.scene.start("LanguageSelect");
        } else {
            // 2回目以降：通常通りPreloaderへ
            this.scene.start("Preloader");
        }
    }
}
