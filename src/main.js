import { Boot } from "./scenes/Boot.js";
import { Game } from "./scenes/Game.js";
import { GameOver } from "./scenes/GameOver.js";
import { Preloader } from "./scenes/Preloader.js";
import { Title } from "./scenes/Title.js";
import { HighScore } from "./scenes/HighScore.js";
import { GAME_CONST } from "./const/GameConst.js";
import { Loading } from "./scenes/Loading.js";
import { Credits } from "./scenes/Credits.js";

export const config = {
    // レンダリング方法
    type: Phaser.AUTO,
    // 画面の大きさ定義
    width: 1280,
    height: 720,
    // レンダリング対象となるhtml要素のid
    parent: "game-container",
    // デフォルトの背景色
    backgroundColor: "#028af8",
    // 物理演算関連の定義
    physics: {
        default: "arcade",
        arcade: {
            // デバッグ設定
            debug: false,
            // 重力設定
            gravity: { y: GAME_CONST.GRAVITY_Y },

            fixedStep: false, // ←これを false にすると補間が働く
        },
    },
    // 画面の拡大縮小設定
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    // 入力設定
    input: {
        // マルチタッチ対応: 同時に3つのポインタ(左右方向転換+ジャンプ)をサポート
        activePointers: 3,
    },
    // シーンの定義
    scene: [
        Boot,
        Preloader,
        Title,
        Game,
        GameOver,
        Loading,
        Credits,
        HighScore,
    ],
    version: "1.0.0",
};

// ゲームの起動
new Phaser.Game(config);
