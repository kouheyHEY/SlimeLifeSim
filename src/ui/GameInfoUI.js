import { GameTimeManager } from "../managers/GameTimeManager.js";
import { UI_CONST, UI_TEXT } from "../const/UIConst.js";
import {
    COMMON_CONST,
    FONT_NAME,
    getLocalizedText,
    getCurrentLanguage,
} from "../const/CommonConst.js";
import { GAME_CONST, TIME_PERIOD_DISPLAY_NAME } from "../const/GameConst.js";

/**
 * ゲーム情報表示UI
 * トップバー内に日付、天気、時刻、プレイヤー状態、コイン枚数を表示
 */
export class GameInfoUI {
    /**
     * コンストラクタ
     * @param {Phaser.Scene} scene - 所属するシーン
     * @param {GameTimeManager} gameTimeManager - ゲーム時間マネージャー
     * @param {number} x - X座標（親コンテナ内での相対位置）
     * @param {number} y - Y座標（親コンテナ内での相対位置）
     */
    constructor(
        scene,
        gameTimeManager,
        x = UI_CONST.GAME_INFO_X,
        y = UI_CONST.GAME_INFO_Y
    ) {
        this.scene = scene;
        this.gameTimeManager = gameTimeManager;
        this.x = x;
        this.y = y;
        // プレイヤーの状態とコイン
        this.playerStatus = GAME_CONST.PLAYER_INITIAL_STATUS;
        this.coins = GAME_CONST.PLAYER_INITIAL_COINS;
        this.createUI();
    }

    /**
     * UIの作成
     */
    createUI() {
        // コンテナを作成（親コンテナ内での相対位置）
        this.infoContainer = this.scene.add.container(this.x, this.y);

        // 背景を作成
        this.background = this.scene.add
            .rectangle(
                0,
                0,
                UI_CONST.GAME_INFO_WIDTH,
                UI_CONST.GAME_INFO_HEIGHT,
                UI_CONST.GAME_INFO_COLOR
            )
            .setOrigin(0, 0)
            .setStrokeStyle(
                UI_CONST.GAME_INFO_BORDER_WIDTH,
                UI_CONST.GAME_INFO_BORDER_COLOR
            );
        this.infoContainer.add(this.background);

        // メインカメラから除外
        this.scene.cameras.main.ignore(this.background);

        const centerX = UI_CONST.GAME_INFO_WIDTH / 2;
        let currentY = UI_CONST.GAME_INFO_PADDING + 10;

        // 釣竿のテクスチャ（上部、中央揃え）
        this.rodSprite = this.scene.add
            .sprite(centerX, currentY, "rod")
            .setOrigin(0.5, 0)
            .setScale(0.5);
        this.infoContainer.add(this.rodSprite);
        this.scene.cameras.main.ignore(this.rodSprite);

        // 釣竿の高さを取得
        const rodHeight = this.rodSprite.displayHeight;
        currentY += rodHeight + 10;

        // 釣竿レベルテキスト（釣竿の下、中央揃え）
        this.rodLevelText = this.scene.add
            .text(centerX, currentY, "Lv 0", {
                fontSize: "20px",
                color: UI_CONST.GAME_INFO_FONT_COLOR,
                fontFamily: FONT_NAME.MELONANO,
            })
            .setOrigin(0.5, 0);
        this.infoContainer.add(this.rodLevelText);
        this.scene.cameras.main.ignore(this.rodLevelText);

        currentY += 30;

        // アップグレードボタン（レベルテキストの下、中央揃え）
        const upgradeButtonX =
            (UI_CONST.GAME_INFO_WIDTH - UI_CONST.UPGRADE_BUTTON_WIDTH) / 2;
        this.upgradeButton = this.scene.add
            .rectangle(
                upgradeButtonX,
                currentY,
                UI_CONST.UPGRADE_BUTTON_WIDTH,
                UI_CONST.UPGRADE_BUTTON_HEIGHT,
                0x00cc00
            )
            .setOrigin(0, 0)
            .setStrokeStyle(2, 0xffffff)
            .setInteractive({ useHandCursor: true });
        this.infoContainer.add(this.upgradeButton);
        this.scene.cameras.main.ignore(this.upgradeButton);

        this.upgradeButtonText = this.scene.add
            .text(
                upgradeButtonX + UI_CONST.UPGRADE_BUTTON_WIDTH / 2,
                currentY + UI_CONST.UPGRADE_BUTTON_HEIGHT / 2,
                getLocalizedText(UI_TEXT.TOP_BAR.UPGRADE),
                {
                    fontFamily: FONT_NAME.MELONANO,
                    fontSize: "18px",
                    color: "#FFFFFF",
                    align: "center",
                }
            )
            .setOrigin(0.5, 0.5);
        this.infoContainer.add(this.upgradeButtonText);
        this.scene.cameras.main.ignore(this.upgradeButtonText);

        // アップグレードボタンのクリックイベント（簡略化版）
        this.upgradeButton.on("pointerdown", () => {
            // アップグレードマネージャーを使用して総合アップグレードを実行
            const upgradeManager = this.scene.upgradeManager;
            const cost = upgradeManager.getTotalUpgradeCost();

            if (this.coins >= cost) {
                const result = upgradeManager.upgradeAll(this.coins);
                if (result.success) {
                    this.setCoins(result.newCoins);
                    // アップグレード成功のフィードバック
                    console.log(
                        `アップグレード成功! 新しいレベル: ${result.newLevel}`
                    );
                }
            } else {
                console.log(`コイン不足: 必要${cost}, 所持${this.coins}`);
            }
        });
    }

    /**
     * UIの更新
     */
    update() {
        // 釣竿レベルを更新
        if (this.rodLevelText && this.scene.upgradeManager) {
            const level = this.scene.upgradeManager.getTotalLevel();
            this.rodLevelText.setText(`Lv ${level}`);
        }

        // アップグレードボタンのテキストを更新
        if (this.upgradeButtonText && this.scene.upgradeManager) {
            const upgradeManager = this.scene.upgradeManager;
            const level = upgradeManager.getTotalLevel();
            const cost = upgradeManager.getTotalUpgradeCost();
            const maxLevel = upgradeManager.getTotalMaxLevel();

            if (level >= maxLevel) {
                this.upgradeButtonText.setText(
                    getLocalizedText({ JP: "MAX", EN: "MAX" })
                );
                this.upgradeButton.setFillStyle(0x666666);
            } else {
                this.upgradeButtonText.setText(
                    getLocalizedText(UI_TEXT.TOP_BAR.UPGRADE)
                );
                this.upgradeButton.setFillStyle(
                    this.coins >= cost ? 0x00cc00 : 0x666666
                );
            }
        }
    }

    /**
     * プレイヤーの状態を更新
     * @param {string} status - 新しい状態のキー（例: "status_smile", "status_normal", "status_bad"）
     */
    setPlayerStatus(status) {
        console.log(`setPlayerStatus: ${this.playerStatus} → ${status}`);
        this.playerStatus = status;
    }

    /**
     * プレイヤーの状態を1段階向上させる
     * status_bad → status_normal → status_smile
     */
    improvePlayerStatus() {
        if (this.playerStatus === "status_bad") {
            this.setPlayerStatus("status_normal");
        } else if (this.playerStatus === "status_normal") {
            this.setPlayerStatus("status_smile");
        }
        // status_smileの場合はこれ以上上がらない
    }

    /**
     * プレイヤーの状態を1段階低下させる
     * status_smile → status_normal → status_bad
     * @returns {boolean} - これ以上下がらない場合false
     */
    decreasePlayerStatus() {
        console.log(
            `decreasePlayerStatus: 現在のステータス = ${this.playerStatus}`
        );
        if (this.playerStatus === "status_smile") {
            this.setPlayerStatus("status_normal");
            return true;
        } else if (this.playerStatus === "status_normal") {
            this.setPlayerStatus("status_bad");
            return true;
        }
        // status_badの場合はこれ以上下がらない
        console.log("これ以上ステータスを下げられません");
        return false;
    }

    /**
     * コイン枚数を設定
     * @param {number} amount - コイン枚数
     */
    setCoins(amount) {
        this.coins = Math.max(0, amount);
    }

    /**
     * コインを追加
     * @param {number} amount - 追加するコイン枚数
     */
    addCoins(amount) {
        this.coins += amount;
        this.coins = Math.max(0, this.coins);
    }

    /**
     * コインを減らす
     * @param {number} amount - 減らすコイン枚数
     * @return {boolean} - 減らせた場合true、コイン不足の場合false
     */
    removeCoins(amount) {
        if (this.coins >= amount) {
            this.coins -= amount;
            return true;
        }
        return false;
    }
}
