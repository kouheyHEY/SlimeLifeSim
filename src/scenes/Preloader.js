import ASSETS from "../assets.js";
import { COMMON_CONST, FONT_NAME } from "../const/CommonConst.js";
import { MAP_CONST } from "../const/MapConst.js";

/**
 * プリローダーシーン
 * ゲームアセットの読み込みとロード画面の表示
 */
export class Preloader extends Phaser.Scene {
    constructor() {
        super("Preloader");
    }

    /**
     * ローディングバーの初期化
     */
    init() {
        //  We loaded this image in our Boot Scene, so we can display it here
        // this.add.image(512, 384, 'background');

        const barOutlineWidth = 468;
        const barOutlineHeight = 32;
        const barOutlineX = COMMON_CONST.SCREEN_WIDTH / 2;
        const barOutlineY = COMMON_CONST.SCREEN_HEIGHT / 2;

        const barWidth = 460;
        const barHeight = 24;

        //  A simple progress bar. This is the outline of the bar.
        this.add
            .rectangle(
                barOutlineX,
                barOutlineY,
                barOutlineWidth,
                barOutlineHeight
            )
            .setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(
            barOutlineX - barWidth / 2,
            barOutlineY,
            4,
            barHeight,
            0xffffff
        );
        bar.setOrigin(0, 0.5);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on("progress", (progress) => {
            //  Update the progress bar (our bar is 460px wide, so 100% = 460px)
            bar.width = 4 + barWidth * progress;
        });
    }

    preload() {
        // load timemap
        // Tiledによって作成されたマップの読み込み
        this.load.tilemapTiledJSON(
            MAP_CONST.MAP_SEASIDE_KEY,
            MAP_CONST.MAP_SEASIDE_PATH
        );

        //  Load the assets for the game - see ./src/assets.js
        for (let type in ASSETS) {
            for (let key in ASSETS[type]) {
                let args = ASSETS[type][key].args.slice();
                args.unshift(ASSETS[type][key].key);
                this.load[type].apply(this.load, args);
            }
        }

        // load fonts
        this.load.font(FONT_NAME.CP_PERIOD, "assets/fonts/cp_period.ttf");
    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start("Game");
    }
}
