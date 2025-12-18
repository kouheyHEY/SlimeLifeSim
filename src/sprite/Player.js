import { GAME_CONST } from "../const/GameConst.js";
import { POWERUP_TYPE, POWERUP_VALUE } from "../const/GameConst.js";
import { config } from "../main.js";
import { SOUND_CONST } from "../const/SoundConst.js";
import { PlayerSkillManager } from "../PlayerSkillManager.js";

export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, skillManager) {
        super(scene, x, y, texture);
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        // 進行方向フラグ
        this.facingRight = true;
        // 接地フラグ
        this.isOnGround = true;
        // 「超加速」の継続時間
        this.superSpeedDuration = GAME_CONST.SUPER_SPEED_DURATION_INITIAL;

        /** @type {PlayerSkillManager} スキル管理 */
        if (!(skillManager instanceof PlayerSkillManager)) {
            // 後方互換性: オブジェクトの場合はPlayerSkillManagerに変換
            skillManager = new PlayerSkillManager(skillManager);
        }
        this.skillManager = skillManager;

        /** @deprecated 後方互換性のため残存 - skillManagerを使用してください */
        this.parameters = this.skillManager.getLevels();

        /** コイン取得数カウンター */
        this.coinsCollected = 0;

        /** ジャンプ回数カウンター */
        this.jumpCount = 0;
        /** 最大ジャンプ回数（1=通常ジャンプ、2以上=多段ジャンプ） */
        this.maxJumpCount = this.skillManager.getMaxJumpCount();
        /** 前フレームのジャンプ入力状態 */
        this.wasJumpPressed = false;

        /** 前フレームの壁接触状態 */
        this.wasTouchingWall = false;

        /**
         * @type {IPlayerStatus} ステータス情報
         */
        this.status = {
            speed: this.skillManager.getSpeedValue(),
            power: this.skillManager.getPowerValue(),
        };

        /** 加速や移動の一切の停止フラグ */
        this.stopMovingFlg = false;

        /** 直前の速度 */
        this.preVelocityX = 0;
        /** 直前の加速度 */
        this.preAccelerationX = 0;

        /** 速度維持フラグ */
        this.needRecoverySpeedFlg = false;

        // 速度と加速度の設定
        this.body.setMaxVelocityX(this.status.speed);
        this.body.setMaxVelocityY(GAME_CONST.MAX_FALLING_SPEED);
        this.updatedAcceleration = GAME_CONST.PLAYER_ACCELERATION;

        // TODO: テスト用 初期ステータス＋特殊能力付与
        if (config.physics.arcade.debug) {
            // skillManagerを使用してレベルを設定
            this.skillManager.setLevel(POWERUP_TYPE.SPEED, 10);
            this.skillManager.setLevel(POWERUP_TYPE.DOUBLE_JUMP, 15);
            this.skillManager.setLevel(POWERUP_TYPE.COIN_SPEED_BOOST, 30);
            // this.skillManager.setLevel(POWERUP_TYPE.SPEED_DOWN_SCORE, 2);

            // parametersを更新
            this.parameters = this.skillManager.getLevels();

            // ステータスを更新
            this.status.speed = this.skillManager.getSpeedValue();
            this.status.power = this.skillManager.getPowerValue();
            this.maxJumpCount = this.skillManager.getMaxJumpCount();

            this.updateSpeed();
        }
        // 速度を最新化
        this.updateSpeed();
    }

    /**
     * ジャンプ処理
     * @param {boolean} isJumpPressed ジャンプキーが押されているか
     */
    jump(isJumpPressed) {
        // 接地している場合、ジャンプカウントをリセット
        if (this.isOnGround) {
            this.jumpCount = 0;
        }

        // ジャンプ可能回数以内かチェック
        if (this.jumpCount >= this.maxJumpCount) {
            this.wasJumpPressed = isJumpPressed;
            return;
        }

        // 最初のジャンプ（jumpCount === 0）は着地時のみ可能（押しっぱなしOK）
        if (this.jumpCount === 0 && !this.isOnGround) {
            this.wasJumpPressed = isJumpPressed;
            return;
        }

        // 空中ジャンプ（jumpCount >= 1）は押した瞬間のみ可能
        if (this.jumpCount >= 1) {
            const isJustPressed = isJumpPressed && !this.wasJumpPressed;
            if (!isJustPressed) {
                this.wasJumpPressed = isJumpPressed;
                return;
            }
        }

        // ジャンプ実行
        this.body.setVelocityY(GAME_CONST.JUMP_VELOCITY);
        this.jumpCount++;
        this.wasJumpPressed = isJumpPressed;

        // ジャンプSE再生
        if (this.scene.soundManager) {
            this.scene.soundManager.playSe(SOUND_CONST.SE.JUMP);
        }
    }

    /**
     * 移動開始処理
     */
    startMoving() {
        if (this.facingRight) {
            this.body.setAccelerationX(this.updatedAcceleration);
        } else {
            this.body.setAccelerationX(-this.updatedAcceleration);
        }
    }

    /**
     * 向きの反転
     */
    flip() {
        this.facingRight = !this.facingRight;
        this.setFlipX(!this.facingRight);
        this.startMoving();
    }

    /**
     * パラメータを上昇させる
     * @param {string} powerUpType パワーアップ選択肢の種類
     * @param {number} powerUpNum パワーアップの数値
     */
    powerUpParameter(powerUpType, powerUpNum) {
        // PlayerSkillManagerを使用してスキルを適用
        for (let i = 0; i < powerUpNum; i++) {
            this.skillManager.applyPowerUp(powerUpType);
        }

        // 後方互換性のためparametersを更新
        this.parameters = this.skillManager.getLevels();

        // ステータスを更新
        this.status.speed = this.skillManager.getSpeedValue();
        this.status.power = this.skillManager.getPowerValue();
        this.maxJumpCount = this.skillManager.getMaxJumpCount();

        // 速度関連のスキルの場合は速度を再計算
        if (
            powerUpType === POWERUP_TYPE.SPEED ||
            powerUpType === POWERUP_TYPE.COIN_SPEED_BOOST ||
            powerUpType === POWERUP_TYPE.SPEED_DOWN_SCORE
        ) {
            this.updateSpeed();
        }
    }

    /**
     * コイン取得時の処理
     */
    collectCoin() {
        this.coinsCollected++;
        // コインスピードブーストが有効な場合、速度を更新
        if (this.skillManager.getLevel(POWERUP_TYPE.COIN_SPEED_BOOST) > 0) {
            this.updateSpeed();
        }
    }

    /**
     * 速度の更新
     */
    updateSpeed() {
        // (基本速度 + スピードパラメータ) * コインボーナス速度 * ブレーキスコアペナルティ
        // コインボーナスの計算 (PlayerSkillManagerを使用)
        const coinSpeedBonusRate =
            this.skillManager.getCoinSpeedBoostRate() * this.coinsCollected;

        // ブレーキスコアペナルティの計算
        const brakeScorePenaltyRate =
            this.skillManager.getSpeedDownScoreSpeedReduction();

        this.status.speed =
            this.skillManager.getSpeedValue() *
            (1 + coinSpeedBonusRate) *
            brakeScorePenaltyRate;

        // 加速度を更新
        this.updatedAcceleration =
            GAME_CONST.PLAYER_ACCELERATION *
            (1 + this.status.speed / (GAME_CONST.PLAYER_SPEED * 10));
        // 加速度を更新
        this.body.setAccelerationX(
            this.facingRight
                ? this.updatedAcceleration
                : -this.updatedAcceleration
        );
        // 速度上限を更新
        this.body.setMaxVelocityX(this.status.speed);
    }

    /**
     * 直前の速度を保存する
     */
    savePreviousVelocity() {
        this.preVelocityX = this.body.velocity.x;
        this.preAccelerationX = this.body.acceleration.x;
        this.needRecoverySpeedFlg = true;
    }

    /**
     * 直前の速度を回復する
     */
    recoverPreviousVelocity() {
        if (this.needRecoverySpeedFlg) {
            this.body.setVelocityX(this.preVelocityX);
            this.body.setAccelerationX(this.preAccelerationX);
            this.needRecoverySpeedFlg = false;
        }
    }
}
