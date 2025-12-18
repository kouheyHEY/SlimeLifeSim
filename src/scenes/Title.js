import { COMMON_CONST, FONT_NAME } from "../const/CommonConst.js";
import { UI_CONST } from "../const/UIConst.js";
import { SoundManager } from "../SoundManager.js";
import { SOUND_CONST } from "../const/SoundConst.js";
import ASSETS from "../assets.js";
import ANIMATION from "../animation.js";
import { addButtonEffects } from "../ui/ButtonUtils.js";
import { GameStateManager } from "../GameStateManager.js";
import { TutorialManager } from "../TutorialManager.js";
import { PlayerSkillManager } from "../PlayerSkillManager.js";
import { config } from "../main.js";

/**
 * タイトル画面シーン
 */
export class Title extends Phaser.Scene {
    constructor() {
        super("Title");
    }

    create() {
        // ゲーム開始処理中フラグ
        this.isStartingGame = false;

        // 背景色設定
        this.cameras.main.setBackgroundColor(UI_CONST.TITLE_BACKGROUND_COLOR);

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
            delay: UI_CONST.TITLE_COIN_SPAWN_INTERVAL,
            callback: this.spawnCoin,
            callbackScope: this,
            loop: true,
        });

        // タイトルテキスト
        const titleText = this.add
            .text(
                COMMON_CONST.SCREEN_WIDTH / 2,
                COMMON_CONST.SCREEN_HEIGHT / 2 + UI_CONST.TITLE_TEXT_Y_OFFSET,
                UI_CONST.TITLE_TEXT,
                {
                    fontFamily: FONT_NAME.CHECKPOINT,
                    fontSize: UI_CONST.TITLE_TEXT_FONT_SIZE,
                    color: UI_CONST.TITLE_TEXT_COLOR,
                    stroke: UI_CONST.TITLE_TEXT_STROKE_COLOR,
                    strokeThickness: UI_CONST.TITLE_TEXT_STROKE_THICKNESS,
                    align: "center",
                }
            )
            .setOrigin(0.5);

        // タイトルのアニメーション（点滅効果）
        this.tweens.add({
            targets: titleText,
            alpha: UI_CONST.TITLE_TEXT_BLINK_ALPHA,
            duration: UI_CONST.TITLE_TEXT_BLINK_DURATION,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut",
        });

        // ナビゲーションボタンの作成
        this.createMenuButtons();

        // バージョン表示（オプション）
        this.add
            .text(
                COMMON_CONST.SCREEN_WIDTH - UI_CONST.TITLE_VERSION_X_MARGIN,
                COMMON_CONST.SCREEN_HEIGHT - UI_CONST.TITLE_VERSION_Y_MARGIN,
                `v${config.version}`,
                {
                    fontFamily: FONT_NAME.CHECKPOINT,
                    fontSize: UI_CONST.TITLE_VERSION_FONT_SIZE,
                    color: UI_CONST.TITLE_VERSION_COLOR,
                }
            )
            .setOrigin(1, 1);

        // BGM再生（小さめの音量）
        this.soundManager.playBgm(SOUND_CONST.BGM.STAGE_NORMAL);
        this.soundManager.setBgmVolume(UI_CONST.TITLE_BGM_VOLUME);
    }

    /**
     * メニューボタン作成処理
     */
    createMenuButtons() {
        const buttonStyle = {
            fontFamily: FONT_NAME.CHECKPOINT,
            fontSize: UI_CONST.TITLE_MENU_BUTTON_FONT_SIZE,
            color: UI_CONST.TITLE_MENU_BUTTON_COLOR,
            stroke: UI_CONST.TITLE_MENU_BUTTON_STROKE_COLOR,
            strokeThickness: UI_CONST.TITLE_MENU_BUTTON_STROKE_THICKNESS,
            align: "center",
            backgroundColor: UI_CONST.TITLE_MENU_BUTTON_BG_COLOR,
            padding: {
                x: UI_CONST.TITLE_MENU_BUTTON_PADDING_X,
                y: UI_CONST.TITLE_MENU_BUTTON_PADDING_Y,
            },
        };

        const centerX = COMMON_CONST.SCREEN_WIDTH / 2;
        const centerY =
            COMMON_CONST.SCREEN_HEIGHT / 2 + UI_CONST.TITLE_MENU_Y_OFFSET;
        const columnSpacing = UI_CONST.TITLE_MENU_COLUMN_SPACING;
        const rowSpacing = UI_CONST.TITLE_MENU_ROW_SPACING;

        // 初回起動判定
        const isFirstTime = GameStateManager.isFirstTime();

        // 左列: はじめから ボタン
        const newGameButtonStyle = isFirstTime
            ? {
                  ...buttonStyle,
                  color: UI_CONST.TITLE_FIRST_TIME_BUTTON_COLOR,
                  backgroundColor: UI_CONST.TITLE_FIRST_TIME_BUTTON_BG_COLOR,
              }
            : buttonStyle;

        const newGameButton = this.add
            .text(
                centerX - columnSpacing / 2,
                centerY,
                UI_CONST.TITLE_BUTTON_NEW_GAME,
                newGameButtonStyle
            )
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        this.addButtonEffects(newGameButton, () => {
            this.startNewGame();
        });

        // 初回起動時は「はじめから」ボタンを点滅させる
        if (isFirstTime) {
            this.tweens.add({
                targets: newGameButton,
                alpha: UI_CONST.TITLE_FIRST_TIME_BUTTON_BLINK_ALPHA,
                duration: UI_CONST.TITLE_FIRST_TIME_BUTTON_BLINK_DURATION,
                yoyo: true,
                repeat: -1,
                ease: "Sine.easeInOut",
            });
        }

        // 右列: つづきから ボタン
        const continueButton = this.add
            .text(
                centerX + columnSpacing / 2,
                centerY,
                UI_CONST.TITLE_BUTTON_CONTINUE,
                buttonStyle
            )
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        // セーブデータがない場合はグレーアウト
        if (!GameStateManager.hasSaveData()) {
            continueButton.setAlpha(UI_CONST.TITLE_DISABLED_BUTTON_ALPHA);
            continueButton.disableInteractive();
        } else {
            this.addButtonEffects(continueButton, () => {
                this.continueGame();
            });
        }

        // 左列下: ランキング ボタン
        const highScoreButton = this.add
            .text(
                centerX - columnSpacing / 2,
                centerY + rowSpacing,
                UI_CONST.TITLE_BUTTON_HIGH_SCORE,
                buttonStyle
            )
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        this.addButtonEffects(highScoreButton, () => {
            this.goToHighScore();
        });

        // 右列下: クレジット ボタン
        const creditsButton = this.add
            .text(
                centerX + columnSpacing / 2,
                centerY + rowSpacing,
                UI_CONST.TITLE_BUTTON_CREDITS,
                buttonStyle
            )
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        this.addButtonEffects(creditsButton, () => {
            this.goToCredits();
        });
    }

    /**
     * ボタンにホバー効果とクリック処理を追加
     * @param {Phaser.GameObjects.Text} button ボタンオブジェクト
     * @param {Function} onClick クリック時のコールバック
     */
    addButtonEffects(button, onClick) {
        addButtonEffects(button, onClick);
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
        const x = Phaser.Math.Between(
            UI_CONST.TITLE_COIN_MIN_X,
            COMMON_CONST.SCREEN_WIDTH - UI_CONST.TITLE_COIN_MIN_X
        );

        // コインを生成
        const coin = this.add.sprite(x, -50, ASSETS.spritesheet.coin.key);
        coin.play(ANIMATION.coin.key);

        // ランダムな落下速度
        coin.speed = Phaser.Math.FloatBetween(
            UI_CONST.TITLE_COIN_MIN_SPEED,
            UI_CONST.TITLE_COIN_MAX_SPEED
        );

        // ランダムなスケール
        const scale = Phaser.Math.FloatBetween(
            UI_CONST.TITLE_COIN_MIN_SCALE,
            UI_CONST.TITLE_COIN_MAX_SCALE
        );
        coin.setScale(scale);

        // 透明度をランダムに
        coin.setAlpha(
            Phaser.Math.FloatBetween(
                UI_CONST.TITLE_COIN_MIN_ALPHA,
                UI_CONST.TITLE_COIN_MAX_ALPHA
            )
        );

        // グループに追加
        this.coinGroup.add(coin);

        // 回転アニメーション
        this.tweens.add({
            targets: coin,
            angle: 360,
            duration: Phaser.Math.Between(
                UI_CONST.TITLE_COIN_ROTATION_MIN_DURATION,
                UI_CONST.TITLE_COIN_ROTATION_MAX_DURATION
            ),
            repeat: -1,
            ease: "Linear",
        });
    }

    /**
     * 新規ゲーム開始処理
     */
    startNewGame() {
        // 既にゲーム開始処理中の場合は無視
        if (this.isStartingGame) {
            return;
        }
        this.isStartingGame = true;

        // ゲーム状態をリセット
        GameStateManager.resetGameState();
        // チュートリアル状態もリセット
        TutorialManager.resetTutorial();

        // BGMをフェードアウト
        this.soundManager.fadeOutBgm(UI_CONST.TITLE_FADEOUT_DURATION);

        // 画面フェードアウト後にゲームシーンへ
        this.cameras.main.fadeOut(UI_CONST.TITLE_FADEOUT_DURATION, 0, 0, 0);

        this.cameras.main.once("camerafadeoutcomplete", () => {
            const skillManager = new PlayerSkillManager();
            this.scene.start("Game", { skillManager });
        });
    }

    /**
     * 続きからゲーム開始処理
     */
    continueGame() {
        // 既にゲーム開始処理中の場合は無視
        if (this.isStartingGame) {
            return;
        }
        this.isStartingGame = true;

        // 保存されているゲーム状態を読み込み
        const gameState = GameStateManager.loadGameState();

        // BGMをフェードアウト
        this.soundManager.fadeOutBgm(UI_CONST.TITLE_FADEOUT_DURATION);

        // 画面フェードアウト後にゲームシーンへ
        this.cameras.main.fadeOut(UI_CONST.TITLE_FADEOUT_DURATION, 0, 0, 0);

        this.cameras.main.once("camerafadeoutcomplete", () => {
            const skillManager = GameStateManager.getSkillManager();
            this.scene.start("Game", { skillManager });
        });
    }

    /**
     * ハイスコア画面へ遷移
     */
    goToHighScore() {
        // 既にゲーム開始処理中の場合は無視
        if (this.isStartingGame) {
            return;
        }
        this.isStartingGame = true;

        // BGMをフェードアウト
        this.soundManager.fadeOutBgm(UI_CONST.TITLE_FADEOUT_DURATION);

        // 画面フェードアウト後にハイスコアシーンへ
        this.cameras.main.fadeOut(UI_CONST.TITLE_FADEOUT_DURATION, 0, 0, 0);

        this.cameras.main.once("camerafadeoutcomplete", () => {
            this.scene.start("HighScore");
        });
    }

    /**
     * クレジット画面へ遷移
     */
    goToCredits() {
        // 既にゲーム開始処理中の場合は無視
        if (this.isStartingGame) {
            return;
        }
        this.isStartingGame = true;

        // BGMをフェードアウト
        this.soundManager.fadeOutBgm(UI_CONST.TITLE_FADEOUT_DURATION);

        // 画面フェードアウト後にクレジットシーンへ
        this.cameras.main.fadeOut(UI_CONST.TITLE_FADEOUT_DURATION, 0, 0, 0);

        this.cameras.main.once("camerafadeoutcomplete", () => {
            this.scene.start("Credits");
        });
    }
}
