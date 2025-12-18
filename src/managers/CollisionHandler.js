import ASSETS from "../assets.js";
import { GAME_CONST } from "../const/GameConst.js";
import { SOUND_CONST } from "../const/SoundConst.js";

/**
 * コリジョン処理ハンドラークラス
 */
export class CollisionHandler {
    /**
     * コンストラクタ
     * @param {Phaser.Scene} scene シーンオブジェクト
     * @param {SoundManager} soundManager サウンド管理クラス
     * @param {Phaser.Cameras.Scene2D.Camera} uiCamera UIカメラ
     */
    constructor(scene, soundManager, uiCamera) {
        this.scene = scene;
        this.soundManager = soundManager;
        this.uiCamera = uiCamera;
    }

    /**
     * プレイヤーと木箱の衝突処理
     * @param {Player} player プレイヤーオブジェクト
     * @param {Phaser.Physics.Arcade.Sprite} box 木箱オブジェクト
     */
    handlePlayerBoxCollision(player, box) {
        // プレイヤーのパワーが木箱破壊時のパワー消費値以上の場合に実行
        if (player.status.power < GAME_CONST.WOOD_BOX_BREAK_POWER_COST) {
            return;
        }
        // 横方向からの衝突時のみ処理
        if (player.body.touching.left || player.body.touching.right) {
            // プレイヤーのパワーを消費
            player.status.power -= GAME_CONST.WOOD_BOX_BREAK_POWER_COST;

            // 木箱を即座に削除し、同じ見た目の新しい物理ボディを持たない木箱を生成
            const brokenBox = this.scene.add
                .sprite(box.x, box.y, ASSETS.spritesheet.boxWood.key)
                .setAlpha(1);
            this.uiCamera.ignore([brokenBox]);
            // 落下計算のためのカスタムプロパティを追加
            brokenBox.startY = box.y;
            brokenBox.startVY = GAME_CONST.JUMP_VELOCITY;
            // 元の木箱を削除
            box.destroy();

            // 木箱破壊SE再生
            this.soundManager.playSe(SOUND_CONST.SE.BREAK);

            // 箱を放物線上に回転させながら押し飛ばす
            this.scene.tweens.add({
                targets: brokenBox,
                alpha: 0,
                angle: GAME_CONST.BOX_BREAK_ROTATION_ANGLE,
                x:
                    brokenBox.x +
                    (player.facingRight ? 1 : -1) *
                        player.body.maxVelocity.x *
                        GAME_CONST.BOX_BREAK_DURATION_MULTIPLIER,
                duration: GAME_CONST.BOX_BREAK_DURATION,
                onComplete: () => {
                    brokenBox.destroy();
                },
                onUpdate: (tween, target) => {
                    // Y軸の放物線運動計算
                    const gravity = GAME_CONST.GRAVITY_Y;
                    const time = tween.progress * (tween.duration / 1000); // 秒単位
                    // 更新後のy座標計算
                    // y = y0 + v0*t + 0.5*g*t^2
                    const height =
                        target.startVY * time + 0.5 * gravity * time * time;
                    target.y = target.startY + height;
                },
            });
        }
    }

    /**
     * プレイヤーと木箱の衝突直前処理
     * @param {Player} player プレイヤーオブジェクト
     * @param {Phaser.Physics.Arcade.Sprite} box 木箱オブジェクト
     * @returns {boolean}
     */
    handlePlayerBoxPreCollision(player, box) {
        // 木箱破壊可能時、かつ木箱に横から衝突する場合、直前の速度を保存
        if (
            player.status.power >= GAME_CONST.WOOD_BOX_BREAK_POWER_COST &&
            Math.abs(player.y - box.y) < box.displayHeight / 2
        ) {
            player.savePreviousVelocity();
        }
        return true;
    }

    /**
     * プレイヤーとコインのオーバーラップ処理
     * @param {Player} player プレイヤーオブジェクト
     * @param {Phaser.Physics.Arcade.Sprite} coin コインオブジェクト
     * @param {number} collectedCoins 現在のコイン枚数
     * @param {Function} updateUI UI更新コールバック
     * @returns {number} 更新後のコイン枚数
     */
    handleCoinCollection(player, coin, collectedCoins, updateUI) {
        // コイン消去
        coin.destroy();
        // プレイヤーのコイン取得処理
        player.collectCoin();
        // コイン枚数加算
        const newCount = collectedCoins + 1;
        // SE再生
        this.soundManager.playSe(SOUND_CONST.SE.COIN_GET);
        // UI更新
        if (updateUI) {
            updateUI(newCount);
        }
        return newCount;
    }
}
