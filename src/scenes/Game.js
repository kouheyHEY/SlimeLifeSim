/*
[] * Asset from: https://kenney.nl/assets/pixel-platformer
 *
 */
import ASSETS from "../assets.js";
import ANIMATION from "../animation.js";
import InputManager from "../InputManager.js";
import { Player } from "../sprite/Player.js";
import { COMMON_CONST, KEY_NAME, FONT_NAME } from "../const/CommonConst.js";
import { GAME_CONST, POWERUP_TYPE, POWERUP_VALUE } from "../const/GameConst.js";
import { ChoiceOfPowerUpUI } from "../ui/ChoiceOfPowerUpUI.js";
import { GameInfoUI } from "../ui/GameInfoUI.js";
import { UI_CONST } from "../const/UIConst.js";
import { SoundManager } from "../SoundManager.js";
import { SOUND_CONST } from "../const/SoundConst.js";
import { HighScoreManager } from "../HighScoreManager.js";
import { TutorialManager } from "../TutorialManager.js";
import { TouchButtonManager } from "../managers/TouchButtonManager.js";
import { TutorialController } from "../managers/TutorialController.js";
import { CollisionHandler } from "../managers/CollisionHandler.js";
import { MapInitializer } from "../managers/MapInitializer.js";
import { GameStateManager } from "../GameStateManager.js";
import { PlayerSkillManager } from "../PlayerSkillManager.js";

/**
 * ゲームシーン
 */

export class Game extends Phaser.Scene {
    constructor() {
        super("Game");
        this.animsCreated = {
            coin: false,
            chara: false,
            flag: false,
        };
    }

    init(parameter) {
        // 中央座標
        this.screenCenterX;
        this.screenCenterY;

        /** プレイヤーの初期Y座標 */
        this.playerStartY = 0;

        /** スコア */
        this.score = 0;
        /** コイン枚数 */
        this.collectedCoins = 0;
        /** 木箱破壊によるスコア */
        this.boxScore = 0;
        /** 移動距離によるスコア */
        this.distanceScore = 0;
        /** プレイヤーの開始X座標 */
        this.playerStartX = 0;
        /** プレイヤーの最大移動距離 */
        this.maxTravelDistance = 0;

        this.gameStarted = false;
        this.gameCleared = false;
        /** カメラ注目フラグ */
        this.isCameraForcused = false;

        /** @type {PlayerSkillManager} スキル管理 */
        this.skillManager = parameter.skillManager || new PlayerSkillManager();

        /** @deprecated 後方互換性のため残存 - skillManagerを使用してください */
        this.powerUpParameters = this.skillManager.getLevels();

        // ゲームプレイエリアの幅
        this.gameScrWidth =
            COMMON_CONST.SCREEN_WIDTH - UI_CONST.GAME_INFO_UI_WIDTH;

        // すり抜けバグ修正用、押し出し距離の設定
        this.physics.world.TILE_BIAS =
            ASSETS.spritesheet.chara.args[1].frameWidth;
    }

    create() {
        this.screenCenterX = this.gameScrWidth * 0.5;
        this.screenCenterY = this.scale.height * 0.5;

        // サウンド管理クラスの初期化
        this.soundManager = new SoundManager(this);

        // 入力管理クラスの初期化
        this.inputManager = new InputManager(this);
        // プレイヤーの初期座標設定
        this.playerStartY = this.scale.height * GAME_CONST.PLAYER_START_Y_RATIO;
        // 背景色設定
        this.cameras.main.setBackgroundColor(0x00ff00);

        // UIカメラの作成
        this.uiCamera = this.cameras.add(
            0,
            0,
            COMMON_CONST.SCREEN_WIDTH,
            COMMON_CONST.SCREEN_HEIGHT
        );
        // UIレイヤーの設定
        this.uiLayer = this.add.layer();

        // Create tutorial text
        this.tutorialText = this.add
            .text(
                this.gameScrWidth / 2,
                this.screenCenterY,
                UI_CONST.TEXT_GAME_START,
                {
                    fontFamily: FONT_NAME.CHECKPOINT,
                    fontSize: UI_CONST.TEXT_GAME_START_FONT_SIZE,
                    color: UI_CONST.TEXT_GAME_START_COLOR,
                    stroke: UI_CONST.TEXT_GAME_START_STROKE_COLOR,
                    strokeThickness: UI_CONST.TEXT_GAME_START_STROKE_THICKNESS,
                    align: "center",
                }
            )
            .setOrigin(0.5);
        this.uiLayer.add(this.tutorialText);

        /** ゲームのタイマー */
        this.runTime = 0;

        // チュートリアル制御クラスの初期化
        this.tutorialController = new TutorialController(this);

        // コリジョンハンドラーの初期化
        this.collisionHandler = new CollisionHandler(
            this,
            this.soundManager,
            this.uiCamera
        );

        // アニメーションの初期化
        this.initAnimations();
        // プレイヤーの初期化
        this.initPlayer();
        // 入力の初期化
        this.initInput();
        // 物理演算関連の初期化
        this.initPhysics();
        // マップの初期化
        this.initMap();
        // イベントリスナー設定
        this.initEventListeners();

        /** ゲーム情報UIの設定 */
        this.gameInfoUI = new GameInfoUI(this);
        this.uiLayer.add(this.gameInfoUI);

        // メインカメラからUI要素を除外
        this.cameras.main.ignore(this.uiLayer);

        // カメラの追従設定
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        // メインカメラの幅の設定
        this.cameras.main.setViewport(
            0,
            0,
            this.gameScrWidth,
            COMMON_CONST.SCREEN_HEIGHT
        );
        // 先読み距離の定義
        this.lookahead = this.gameScrWidth * GAME_CONST.CAMERA_LOOKAHEAD_RATIO;
        this.cameraTargetOffsetX = 0;

        // タッチボタン管理クラスの初期化
        this.touchButtonManager = new TouchButtonManager(this, this.uiLayer);

        // 残像エフェクト用の初期化
        this.lastAfterimageTime = 0;

        // ゲーム開始前に小さい音量でBGMを再生
        this.soundManager.playBgm(SOUND_CONST.BGM.STAGE_NORMAL);
        this.soundManager.setBgmVolume(GAME_CONST.BGM_VOLUME_BEFORE_START);

        // チュートリアル表示
        this.tutorialController.showJumpTutorial();
    }

    update() {
        // ゲーム開始前
        if (!this.gameStarted && !this.gameCleared) {
            // ジャンプチュートリアル完了済みの場合のみスペースキー、または画面タップでゲーム開始可能
            if (
                TutorialManager.isTutorialCompleted(
                    TutorialManager.TUTORIAL_TYPE.JUMP
                ) &&
                (this.inputManager.keys[KEY_NAME.SPACE].isDown ||
                    this.inputManager.pointerJustDown)
            ) {
                this.startGame();
            }
            // ゲーム開始前はここで処理終了
            return;
        }

        // ゲームクリア後
        if (this.gameCleared) {
            // ゲームクリア後はここで処理終了
            return;
        }

        // 向きの変更検知（キーボードまたはフリック）
        // フリックによる方向転換はonSwipeEndで処理される
        if (
            (this.player.facingRight &&
                this.inputManager.cursors.left.isDown) ||
            (!this.player.facingRight && this.inputManager.cursors.right.isDown)
        ) {
            this.player.flip();
        }

        // プレイヤーの接地判定更新
        this.player.isOnGround = this.player.body.blocked.down;

        // 壁衡突判定とSE再生
        const isTouchingWall =
            this.player.body.blocked.left || this.player.body.blocked.right;
        if (isTouchingWall && !this.player.wasTouchingWall) {
            // 壁にぶつかった瞬間
            // this.soundManager.playSe(SOUND_CONST.SE.WALL_HIT);
        }
        this.player.wasTouchingWall = isTouchingWall;

        // 向きの変更検知（タッチボタン）
        if (
            this.touchButtonManager.isLeftPressed() &&
            this.player.facingRight
        ) {
            this.player.flip();
        } else if (
            this.touchButtonManager.isRightPressed() &&
            !this.player.facingRight
        ) {
            this.player.flip();
        }

        // ジャンプ処理(スペースキーまたはタッチボタン)
        const isJumpPressed =
            this.inputManager.keys[KEY_NAME.SPACE].isDown ||
            this.touchButtonManager.isJumpPressed();

        if (isJumpPressed) {
            this.player.jump(isJumpPressed);
        } else {
            // 入力がない場合はフラグのみ更新
            this.player.wasJumpPressed = false;
        }

        // 速度が0になったら再度速度設定
        if (this.player.body.velocity.x === 0 && !this.player.stopMovingFlg) {
            this.player.startMoving();
        }

        // 木箱チュートリアルの表示チェック
        this.tutorialController.checkAndShowBoxTutorial(
            this.player.x,
            GAME_CONST.BOX_TUTORIAL_TRIGGER_DISTANCE,
            () => {
                // ゲームを一時停止
                this.physics.pause();
                this.runTimePaused = true;
                // チュートリアル表示
                this.tutorialController.showBoxTutorial(() => {
                    // ゲームを再開
                    this.physics.resume();
                    this.runTimePaused = false;
                });
            }
        );

        // カメラの位置設定（プレイヤーが画面の中央やや後ろに位置するように）
        // 進行方向が右の時
        if (this.player.facingRight) {
            this.cameraTargetOffsetX = -this.lookahead;
        } else {
            this.cameraTargetOffsetX = this.lookahead;
        }

        // 現在のオフセットを取得
        const currentOffsetX = this.cameras.main.followOffset.x;
        // オフセットを徐々に目標値に近づける
        const newOffsetX =
            currentOffsetX +
            (this.cameraTargetOffsetX - currentOffsetX) *
                GAME_CONST.CAMERA_OFFSET_LERP;
        this.cameras.main.followOffset.x = newOffsetX;

        // 「超加速」処理 (Zキー)
        if (
            this.inputManager.keys[KEY_NAME.Z].isDown &&
            !this.isCameraForcused
        ) {
            this.isCameraForcused = true;

            // カメラをプレイヤー中心に少しズームする
            this.cameras.main.zoomTo(
                GAME_CONST.SUPER_SPEED_CAMERA_LERP,
                GAME_CONST.SUPER_SPEED_CAMERA_FOCUS_TIME
            );

            // カメラをシェイクさせる
            this.cameras.main.shake(
                this.player.superSpeedDuration,
                GAME_CONST.SUPER_SPEED_CAMERA_SHAKE_INTENSITY
            );

            // 一定時間後に元のズームに戻す
            this.time.delayedCall(this.player.superSpeedDuration, () => {
                this.cameras.main.zoomTo(
                    1,
                    GAME_CONST.SUPER_SPEED_CAMERA_FOCUS_TIME
                );
                this.isCameraForcused = false;
            });
        }

        // ゲームタイマー更新
        if (!this.runTimePaused) {
            this.runTime += this.game.loop.delta;
            const runTimeInSeconds = (this.runTime / 1000).toFixed(2);
            this.gameInfoUI.setTimerText(runTimeInSeconds);
        }

        // 直前の速度を復元
        this.player.recoverPreviousVelocity();

        // 残像エフェクトの処理
        this.updateAfterimage();
    }

    /**
     * アニメーションの初期化
     */
    initAnimations() {
        if (!this.animsCreated.chara) {
            this.anims.create({
                key: ANIMATION.chara.key,
                frames: this.anims.generateFrameNumbers(
                    ANIMATION.chara.texture,
                    { frames: [0, 1, 2, 1] }
                ),
                frameRate: ANIMATION.chara.frameRate,
                repeat: ANIMATION.chara.repeat,
            });
            this.animsCreated.chara = true;
        }

        if (!this.animsCreated.coin) {
            this.anims.create({
                key: ANIMATION.coin.key,
                frames: this.anims.generateFrameNumbers(ANIMATION.coin.texture),
                frameRate: ANIMATION.coin.frameRate,
                repeat: ANIMATION.coin.repeat,
            });
            this.animsCreated.coin = true;
        }

        if (!this.animsCreated.flag) {
            this.anims.create({
                key: ANIMATION.flag.key,
                frames: this.anims.generateFrameNumbers(ANIMATION.flag.texture),
                frameRate: ANIMATION.flag.frameRate,
                repeat: ANIMATION.flag.repeat,
            });
            this.animsCreated.flag = true;
        }
    }

    /**
     * 物理演算関連の初期化
     */
    initPhysics() {
        // コイン用グループの作成
        this.coinGroup = this.physics.add.group({
            allowGravity: false,
            immovable: true,
        });
        // プレイヤーとコインのオーバーラップ検知
        this.physics.add.overlap(
            this.player,
            this.coinGroup,
            (player, coin) => {
                this.collectedCoins =
                    this.collisionHandler.handleCoinCollection(
                        player,
                        coin,
                        this.collectedCoins,
                        (count) => this.gameInfoUI.setCoinText(count)
                    );
            },
            null,
            this
        );
        this.uiCamera.ignore([this.coinGroup]);

        // 木箱のグループ作成
        this.boxGroup = this.physics.add.group();
    }

    /**
     * プレイヤーの初期化
     */
    initPlayer() {
        this.player = new Player(
            this,
            200,
            this.playerStartY,
            ASSETS.spritesheet.chara.key,
            this.skillManager
        );
        this.uiCamera.ignore([this.player]);
    }

    /**
     * 入力の初期化
     */
    initInput() {
        // 物理演算の一時停止
        this.physics.pause();
        // 必要なキーを監視に追加(スペース、Z, X, C)
        this.inputManager.addKey(
            KEY_NAME.SPACE,
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );
        this.inputManager.addKey(KEY_NAME.Z, Phaser.Input.Keyboard.KeyCodes.Z);
        this.inputManager.addKey(KEY_NAME.X, Phaser.Input.Keyboard.KeyCodes.X);
        this.inputManager.addKey(KEY_NAME.C, Phaser.Input.Keyboard.KeyCodes.C);
    }

    /**
     * マップの初期化
     */
    initMap() {
        const mapInitializer = new MapInitializer(
            this,
            this.coinGroup,
            this.boxGroup,
            this.uiCamera
        );
        const firstBoxX = mapInitializer.initMap(
            "map_default_1",
            this.player,
            () => this.GameClear(),
            this.collisionHandler
        );
        // 最初の木箱のX座標をチュートリアルコントローラーに記録
        if (firstBoxX !== null) {
            this.tutorialController.recordFirstBoxX(firstBoxX);
        }
    }

    /**
     * イベントリスナー設定
     */
    initEventListeners() {
        // パワーアップ選択UIのイベントリスナー
        this.events.on("powerupSelected", this.handlePowerupSelected, this);
        // シーン終了時にリスナー解除
        this.events.once("shutdown", this.cleanUpEventListeners, this);
    }

    /**
     * イベントリスナー解除
     */
    cleanUpEventListeners() {
        this.events.off("powerupSelected");
    }

    /**
     * パワーアップのハンドリング
     * @param {string} powerUpType パワーアップのタイプ
     */
    handlePowerupSelected(powerUpType) {
        // パワーアップSE再生
        this.soundManager.playSe(SOUND_CONST.SE.POWERUP);

        // 選択されたパワーアップに応じた処理をここに追加
        if (powerUpType === POWERUP_TYPE.SPEED) {
            // プレイヤーの速度を上げる
            this.player.powerUpParameter(POWERUP_TYPE.SPEED, 1);
        } else if (powerUpType === POWERUP_TYPE.POWER) {
            // プレイヤーの攻撃力を上げる
            this.player.powerUpParameter(POWERUP_TYPE.POWER, 1);
        } else if (powerUpType === POWERUP_TYPE.COIN_SPEED_BOOST) {
            // コインスピードブーストを有効化
            this.player.powerUpParameter(POWERUP_TYPE.COIN_SPEED_BOOST, 1);
        } else if (powerUpType === POWERUP_TYPE.DOUBLE_JUMP) {
            // 二段ジャンプを有効化
            this.player.powerUpParameter(POWERUP_TYPE.DOUBLE_JUMP, 1);
        } else if (powerUpType === POWERUP_TYPE.SPEED_DOWN_SCORE) {
            // ブレーキスコア倍率アップを有効化
            this.player.powerUpParameter(POWERUP_TYPE.SPEED_DOWN_SCORE, 1);
        }

        // ゲーム状態を保存（プレイヤーの更新されたskillManagerを使用）
        GameStateManager.updateSkillLevels(
            this.player.skillManager.getLevels()
        );

        this.shutdown();
        // ゲームシーンを再度初期から再生（プレイヤーの更新されたskillManagerを使用）
        this.scene.start("Loading", { skillManager: this.player.skillManager });
    }

    /**
     * ゲーム開始処理
     */
    startGame() {
        // ゲーム開始フラグON
        this.gameStarted = true;
        // 物理演算の再開
        this.physics.resume();
        // プレイヤーの移動開始
        this.player.startMoving();
        this.player.anims.play(ANIMATION.chara.key, true);

        // チュートリアルテキストを非表示にする
        this.tutorialText.setVisible(false);

        // ゲームタイマー開始
        this.runTime = 0;

        // プレイヤーの開始位置を記録
        this.playerStartX = this.player.x;

        // BGMの音量を通常に戻す
        this.soundManager.setBgmVolume(GAME_CONST.BGM_VOLUME_NORMAL);
    }

    /**
     * 残像エフェクトの更新処理
     */
    updateAfterimage() {
        // プレイヤーの速度を取得（絶対値）
        const playerSpeed = Math.abs(this.player.body.velocity.x);

        // 速度が閾値以上かチェック
        if (playerSpeed < GAME_CONST.AFTERIMAGE_SPEED_THRESHOLD) {
            return;
        }

        // 残像生成間隔のチェック
        const currentTime = this.time.now;
        if (
            currentTime - this.lastAfterimageTime <
            GAME_CONST.AFTERIMAGE_SPAWN_INTERVAL
        ) {
            return;
        }
        this.lastAfterimageTime = currentTime;

        // 残像スプライトを生成
        const afterimage = this.add.sprite(
            this.player.x,
            this.player.y,
            this.player.texture.key,
            this.player.frame.name
        );

        // プレイヤーと同じ向きに設定
        afterimage.setFlipX(this.player.flipX);
        // 初期透明度を設定
        afterimage.setAlpha(GAME_CONST.AFTERIMAGE_INITIAL_ALPHA);
        // プレイヤーより後ろに表示（プレイヤーのデフォルト深度0より低く設定）
        afterimage.setDepth(-1);
        // UIカメラから除外
        this.uiCamera.ignore(afterimage);

        // フェードアウトして消滅させる
        this.tweens.add({
            targets: afterimage,
            alpha: 0,
            duration: GAME_CONST.AFTERIMAGE_DURATION,
            onComplete: () => {
                afterimage.destroy();
            },
        });
    }

    /**
     * ゲームオーバー処理
     */
    GameOver() {
        this.time.delayedCall(GAME_CONST.GAME_CLEAR_DELAY, () => {
            this.scene.start("GameOver");
        });
    }

    /**
     * ゲームクリア処理
     */
    GameClear() {
        // 物理演算の停止
        this.physics.pause();
        // プレイヤーのアニメーション停止
        this.player.anims.stop();

        // BGM停止とクリアジングル再生
        this.soundManager.stopBgm();
        this.soundManager.playSe(SOUND_CONST.JINGLE.CLEAR);

        // 可視性向上のための半透明オーバーレイを追加
        this.clearOverlay = this.add
            .rectangle(
                this.screenCenterX,
                this.screenCenterY,
                this.gameScrWidth,
                COMMON_CONST.SCREEN_HEIGHT,
                UI_CONST.GAME_CLEAR_OVERLAY_COLOR
            )
            .setAlpha(UI_CONST.GAME_CLEAR_OVERLAY_ALPHA)
            .setScrollFactor(0)
            .setDepth(GAME_CONST.CLEAR_OVERLAY_DEPTH);

        this.uiLayer.add(this.clearOverlay);

        // クリア後のスコア文字列を描画
        // ブレーキスコアによるコインスコア上昇倍率
        const brakeScoreMulti =
            this.player.skillManager.getSpeedDownScoreMultiplier();

        // タイムを秒単位で計算（数値）
        const timeInSeconds = this.runTime / 1000;

        // スコア＝コイン枚数*500*ブレーキスコア倍率 - 経過時間*1000
        const fixedScore = Math.floor(
            this.collectedCoins * GAME_CONST.SCORE_COIN * brakeScoreMulti -
                GAME_CONST.SCORE_TIME_PENALTY_MULTIPLIER * timeInSeconds
        );

        // スコアテキストの設定
        let scoreText = `${UI_CONST.TEXT_GAMESCORE_PREFIX} ${this.collectedCoins} x ${GAME_CONST.SCORE_COIN}`;
        if (
            this.player.skillManager.getLevel(POWERUP_TYPE.SPEED_DOWN_SCORE) > 0
        ) {
            scoreText += ` x ${brakeScoreMulti.toFixed(1)}`;
        }
        scoreText += ` - ${timeInSeconds.toFixed(2)} x ${
            GAME_CONST.SCORE_TIME_PENALTY_MULTIPLIER
        }\n= ${fixedScore}`;

        // ハイスコアを保存（スコアとタイムをセットで記録）
        const saveResult = HighScoreManager.saveHighScore(
            fixedScore,
            parseFloat(timeInSeconds.toFixed(2))
        );

        // 新記録通知の表示
        if (saveResult.isNewHighScore || saveResult.isNewBestTime) {
            let recordText;
            if (saveResult.isNewHighScore && saveResult.isNewBestTime) {
                recordText = UI_CONST.TEXT_NEW_RECORD_BOTH;
            } else if (saveResult.isNewHighScore) {
                recordText = UI_CONST.TEXT_NEW_HIGH_SCORE;
            } else {
                recordText = UI_CONST.TEXT_NEW_BEST_TIME;
            }

            this.add
                .text(
                    this.screenCenterX,
                    UI_CONST.TEXT_NEW_RECORD_Y,
                    recordText,
                    {
                        fontFamily: FONT_NAME.CHECKPOINT,
                        fontSize: UI_CONST.TEXT_NEW_RECORD_FONT_SIZE,
                        color: UI_CONST.TEXT_NEW_RECORD_COLOR,
                        stroke: UI_CONST.TEXT_NEW_RECORD_STROKE_COLOR,
                        strokeThickness:
                            UI_CONST.TEXT_NEW_RECORD_STROKE_THICKNESS,
                        align: "center",
                    }
                )
                .setOrigin(0.5)
                .setScrollFactor(0)
                .setDepth(GAME_CONST.UI_DEPTH);
        }

        this.add
            .text(this.screenCenterX, UI_CONST.TEXT_GAMESCORE_Y, scoreText, {
                fontFamily: FONT_NAME.CHECKPOINT,
                fontSize: UI_CONST.TEXT_GAMESCORE_FONT_SIZE,
                color: UI_CONST.TEXT_GAMESCORE_COLOR,
                stroke: UI_CONST.TEXT_GAMESCORE_STROKE_COLOR,
                strokeThickness: UI_CONST.TEXT_GAMESCORE_STROKE_THICKNESS,
                align: "center",
            })
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(GAME_CONST.UI_DEPTH);

        // クリア文字列を表示
        this.add
            .text(
                this.screenCenterX,
                UI_CONST.TEXT_GAME_CLEAR_Y,
                UI_CONST.TEXT_GAME_CLEAR,
                {
                    fontFamily: FONT_NAME.CHECKPOINT,
                    fontSize: UI_CONST.TEXT_GAME_CLEAR_FONT_SIZE,
                    color: UI_CONST.TEXT_GAME_CLEAR_COLOR,
                    stroke: UI_CONST.TEXT_GAME_CLEAR_STROKE_COLOR,
                    strokeThickness: UI_CONST.TEXT_GAME_CLEAR_STROKE_THICKNESS,
                    lineSpacing: UI_CONST.TEXT_GAME_CLEAR_LINE_SPACING,
                    align: "center",
                }
            )
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(GAME_CONST.UI_DEPTH);

        // パワーアップの種類をランダム選択する
        const powerUpTypes = [
            POWERUP_TYPE.SPEED,
            POWERUP_TYPE.POWER,
            POWERUP_TYPE.COIN_SPEED_BOOST,
            POWERUP_TYPE.DOUBLE_JUMP,
            POWERUP_TYPE.SPEED_DOWN_SCORE,
        ];

        // 3つの選択肢をランダムに選ぶ
        const shuffled = [...powerUpTypes].sort(() => Math.random() - 0.5);
        const selectedTypes = shuffled.slice(0, 3);

        for (const [index, type] of selectedTypes.entries()) {
            // パワーアップの選択肢を表示する
            const choiceUI = new ChoiceOfPowerUpUI(
                this,
                this.screenCenterX,
                UI_CONST.CHOICE_OF_POWERUP_UI_Y +
                    index *
                        (UI_CONST.CHOICE_OF_POWERUP_UI_HEIGHT +
                            UI_CONST.CHOICE_OF_POWERUP_UI_SPACING),
                type,
                this.player.skillManager
            );
            choiceUI.setScrollFactor(0);
            choiceUI.setDepth(GAME_CONST.UI_DEPTH);
            this.uiLayer.add(choiceUI);
        }
        // ゲームクリアフラグを立てる
        this.gameCleared = true;
    }

    /**
     * シーン終了時処理
     */
    shutdown() {
        this.cleanUpEventListeners();

        this.physics.world.destroy();

        this.player.destroy();
    }
}
