import { STORAGE_KEY } from "../const/CommonConst.js";

/**
 * アップグレード管理マネージャー
 * プレイヤーのアップグレードレベルとコストを管理
 */
export class UpgradeManager {
    /**
     * コンストラクタ
     * @param {Phaser.Scene} scene - 所属するシーン
     */
    constructor(scene) {
        this.scene = scene;

        // アップグレードの種類と初期レベル
        this.upgrades = {
            fishCatchRate: 0, // 魚の釣れやすさ
            linePower: 0, // 釣り糸引っ張り力
            fishValue: 0, // 魚の価値上昇
            autoFishing: 0, // 釣り全自動化（0 or 1）
        };

        // アップグレードの最大レベル
        this.maxLevels = {
            fishCatchRate: 10,
            linePower: 10,
            fishValue: 10,
            autoFishing: 1, // 釣り全自動化は1レベルのみ
        };

        // アップグレードのコスト計算式（ベースコスト × レベル）
        this.baseCosts = {
            fishCatchRate: 100, // レベル1: 100, レベル2: 200, ...
            linePower: 100,
            fishValue: 150,
            autoFishing: 1000, // 高額な一回きりのアップグレード
        };

        // LocalStorageから読み込み
        this.loadUpgrades();
    }

    /**
     * アップグレードデータをLocalStorageから読み込み
     */
    loadUpgrades() {
        const saved = localStorage.getItem(STORAGE_KEY.UPGRADES);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.upgrades = { ...this.upgrades, ...data };
            } catch (e) {
                console.error("アップグレードデータの読み込みに失敗:", e);
            }
        }
    }

    /**
     * アップグレードデータをLocalStorageに保存
     */
    saveUpgrades() {
        localStorage.setItem(
            STORAGE_KEY.UPGRADES,
            JSON.stringify(this.upgrades)
        );
    }

    /**
     * アップグレードレベルを取得
     * @param {string} upgradeKey - アップグレードのキー
     * @returns {number} 現在のレベル
     */
    getLevel(upgradeKey) {
        return this.upgrades[upgradeKey] || 0;
    }

    /**
     * アップグレードの最大レベルを取得
     * @param {string} upgradeKey - アップグレードのキー
     * @returns {number} 最大レベル
     */
    getMaxLevel(upgradeKey) {
        return this.maxLevels[upgradeKey] || 10;
    }

    /**
     * アップグレード可能かチェック
     * @param {string} upgradeKey - アップグレードのキー
     * @returns {boolean} アップグレード可能ならtrue
     */
    canUpgrade(upgradeKey) {
        return this.upgrades[upgradeKey] < this.maxLevels[upgradeKey];
    }

    /**
     * 次のレベルのコストを取得
     * @param {string} upgradeKey - アップグレードのキー
     * @returns {number} コスト（最大レベルの場合は-1）
     */
    getUpgradeCost(upgradeKey) {
        if (!this.canUpgrade(upgradeKey)) {
            return -1; // 最大レベル
        }
        const currentLevel = this.upgrades[upgradeKey];
        return this.baseCosts[upgradeKey] * (currentLevel + 1);
    }

    /**
     * アップグレードを実行
     * @param {string} upgradeKey - アップグレードのキー
     * @param {number} currentCoins - 現在のコイン数
     * @returns {Object} {success: boolean, newCoins: number} アップグレード結果
     */
    upgrade(upgradeKey, currentCoins) {
        if (!this.canUpgrade(upgradeKey)) {
            return { success: false, newCoins: currentCoins };
        }

        const cost = this.getUpgradeCost(upgradeKey);
        if (currentCoins < cost) {
            return { success: false, newCoins: currentCoins };
        }

        // アップグレード実行
        this.upgrades[upgradeKey]++;
        const newCoins = currentCoins - cost;

        // 保存
        this.saveUpgrades();

        console.log(
            `アップグレード成功: ${upgradeKey} レベル${this.upgrades[upgradeKey]}`
        );

        return { success: true, newCoins };
    }

    /**
     * 釣り全自動化が有効かチェック
     * @returns {boolean} 有効ならtrue
     */
    isAutoFishingEnabled() {
        return this.upgrades.autoFishing > 0;
    }

    /**
     * 魚のヒット確率の倍率を取得
     * @returns {number} 倍率（1.0 = 通常、1.5 = 1.5倍など）
     */
    getFishCatchRateMultiplier() {
        // レベル1で1.1倍、レベル10で2.0倍
        return 1.0 + this.upgrades.fishCatchRate * 0.1;
    }

    /**
     * 釣り糸の引っ張り力倍率を取得
     * @returns {number} 倍率（1.0 = 通常、2.0 = 2倍など）
     */
    getLinePowerMultiplier() {
        // レベル1で1.2倍、レベル10で2.8倍
        return 1.0 + this.upgrades.linePower * 0.2;
    }

    /**
     * 魚の価値倍率を取得
     * @returns {number} 倍率（1.0 = 通常、2.0 = 2倍など）
     */
    getFishValueMultiplier() {
        // レベル1で1.1倍、レベル10で2.0倍
        return 1.0 + this.upgrades.fishValue * 0.1;
    }
}
