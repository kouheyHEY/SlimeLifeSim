import { COMMON_CONST, FONT_NAME } from "../const/CommonConst.js";
import { UI_CONST } from "../const/UIConst.js";
import { SoundManager } from "../SoundManager.js";
import { SOUND_CONST } from "../const/SoundConst.js";
import ASSETS from "../assets.js";
import ANIMATION from "../animation.js";
import { HighScoreManager } from "../HighScoreManager.js";

/**
 * ハイスコア画面シーン
 */
export class HighScore extends Phaser.Scene {
    constructor() {
        super("HighScore");
    }

    create() {
        // 背景色設定
        this.cameras.main.setBackgroundColor(0x000033);

        // サウンド管理クラスの初期化
        this.soundManager = new SoundManager(this);

        // コインアニメーションの初期化
        if (!this.anims.exists(ANIMATION.coin.key)) {
            this.anims.create({
                key: ANIMATION.coin.key,
                frames: this.anims.generateFrameNumbers(ANIMATION.coin.texture),
                frameRate: ANIMATION.coin.frameRate,
                repeat: ANIMATION.coin.repeat,
            });
        }

        // コイングループの作成
        this.coinGroup = this.add.group();

        // コイン生成タイマー（ランダムな間隔で生成）
        this.time.addEvent({
            delay: 500,
            callback: this.spawnCoin,
            callbackScope: this,
            loop: true,
        });

        /** 現在のソート順（true: スコア順, false: タイム順） */
        this.sortByScore = true;

        // ハイスコア画面のタイトル
        this.add
            .text(COMMON_CONST.SCREEN_WIDTH / 2, 60, "【ハイスコア】", {
                fontFamily: FONT_NAME.CHECKPOINT,
                fontSize: 48,
                color: "#ffff00",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5);

        // ソート切り替えボタン
        this.sortButton = this.add
            .text(COMMON_CONST.SCREEN_WIDTH / 2, 130, "[スコア順]", {
                fontFamily: FONT_NAME.CHECKPOINT,
                fontSize: 28,
                color: "#00ffff",
                stroke: "#000000",
                strokeThickness: 4,
            })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        this.sortButton.on("pointerdown", () => {
            this.sortByScore = !this.sortByScore;
            this.updateHighScoreDisplay();
        });

        this.sortButton.on("pointerover", () => {
            this.sortButton.setColor("#ffffff");
        });

        this.sortButton.on("pointerout", () => {
            this.sortButton.setColor("#00ffff");
        });

        // ハイスコアリスト表示エリア
        this.highScoreListY = 180;
        this.highScoreListX = COMMON_CONST.SCREEN_WIDTH / 2;

        // ハイスコアテキストの配列
        this.highScoreTexts = [];

        // 初期表示
        this.updateHighScoreDisplay();

        // 戻るボタン
        const backButton = this.add
            .text(
                COMMON_CONST.SCREEN_WIDTH / 2,
                COMMON_CONST.SCREEN_HEIGHT - 80,
                UI_CONST.HIGH_SCORE_BUTTON_BACK,
                {
                    fontFamily: FONT_NAME.CHECKPOINT,
                    fontSize: 28,
                    color: "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 4,
                }
            )
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        backButton.on("pointerdown", () => {
            this.goBackToTitle();
        });

        backButton.on("pointerover", () => {
            backButton.setColor("#ffff00");
        });

        backButton.on("pointerout", () => {
            backButton.setColor("#ffffff");
        });

        // ESCキーまたはスペースキーでタイトルに戻る
        this.input.keyboard.on("keydown-ESC", () => {
            this.goBackToTitle();
        });

        this.input.keyboard.on("keydown-SPACE", () => {
            this.goBackToTitle();
        });

        // BGM再生（小さめの音量）
        this.soundManager.playBgm(SOUND_CONST.BGM.STAGE_NORMAL);
        this.soundManager.setBgmVolume(0.3);
    }

    update() {
        // コインの位置を更新（下に移動）
        this.coinGroup.children.entries.forEach((coin) => {
            coin.y += coin.speed;

            // 画面外に出たら削除
            if (coin.y > COMMON_CONST.SCREEN_HEIGHT + 50) {
                coin.destroy();
            }
        });
    }

    /**
     * コイン生成処理
     */
    spawnCoin() {
        // ランダムなX座標
        const x = Phaser.Math.Between(50, COMMON_CONST.SCREEN_WIDTH - 50);

        // コインを生成
        const coin = this.add.sprite(x, -50, ASSETS.spritesheet.coin.key);
        coin.play(ANIMATION.coin.key);

        // ランダムな落下速度（2〜5）
        coin.speed = Phaser.Math.FloatBetween(2, 5);

        // ランダムなスケール（0.5〜1.0）
        const scale = Phaser.Math.FloatBetween(0.5, 1.0);
        coin.setScale(scale);

        // 透明度をランダムに（0.3〜0.7）
        coin.setAlpha(Phaser.Math.FloatBetween(0.3, 0.7));

        // グループに追加
        this.coinGroup.add(coin);

        // 回転アニメーション
        this.tweens.add({
            targets: coin,
            angle: 360,
            duration: Phaser.Math.Between(2000, 4000),
            repeat: -1,
            ease: "Linear",
        });
    }

    /**
     * ハイスコア表示を更新
     */
    updateHighScoreDisplay() {
        // 既存のテキストを削除
        this.highScoreTexts.forEach((text) => text.destroy());
        this.highScoreTexts = [];

        // ソートボタンのテキストを更新
        this.sortButton.setText(this.sortByScore ? "[スコア順]" : "[タイム順]");

        // ハイスコアを取得
        const records = this.sortByScore
            ? HighScoreManager.getHighScoresByScore()
            : HighScoreManager.getHighScoresByTime();

        // 最大10件表示
        const displayRecords = records.slice(0, 10);

        if (displayRecords.length === 0) {
            // レコードがない場合
            const noRecordText = this.add
                .text(
                    this.highScoreListX,
                    this.highScoreListY + 100,
                    "記録なし",
                    {
                        fontFamily: FONT_NAME.CHECKPOINT,
                        fontSize: 32,
                        color: "#888888",
                        stroke: "#000000",
                        strokeThickness: 4,
                    }
                )
                .setOrigin(0.5, 0);
            this.highScoreTexts.push(noRecordText);
        } else {
            // ヘッダー行
            const headerText = this.add
                .text(
                    this.highScoreListX,
                    this.highScoreListY,
                    "順位     スコア          タイム",
                    {
                        fontFamily: FONT_NAME.CHECKPOINT,
                        fontSize: 22,
                        color: "#ffff00",
                        stroke: "#000000",
                        strokeThickness: 3,
                    }
                )
                .setOrigin(0.5, 0);
            this.highScoreTexts.push(headerText);

            // レコードを表示
            displayRecords.forEach((record, index) => {
                const rankText = `${(index + 1).toString().padStart(2, " ")}.`;
                const scoreText = `${record.score
                    .toString()
                    .padStart(8, " ")}pt`;
                const timeText = `${record.time.toFixed(2).padStart(8, " ")}s`;

                // 順位によって色を変える
                let color = "#ffffff";
                if (index === 0) color = "#ffd700"; // 金
                else if (index === 1) color = "#c0c0c0"; // 銀
                else if (index === 2) color = "#cd7f32"; // 銅

                const recordText = this.add
                    .text(
                        this.highScoreListX,
                        this.highScoreListY + 40 + index * 40,
                        `${rankText}    ${scoreText}    ${timeText}`,
                        {
                            fontFamily: FONT_NAME.CHECKPOINT,
                            fontSize: 24,
                            color: color,
                            stroke: "#000000",
                            strokeThickness: 3,
                        }
                    )
                    .setOrigin(0.5, 0);
                this.highScoreTexts.push(recordText);
            });
        }
    }

    /**
     * タイトルに戻る処理
     */
    goBackToTitle() {
        // BGMをフェードアウト
        this.soundManager.fadeOutBgm(500);

        // 画面フェードアウト後にタイトルシーンへ
        this.cameras.main.fadeOut(500, 0, 0, 0);

        this.cameras.main.once("camerafadeoutcomplete", () => {
            this.scene.start("Title");
        });
    }
}
