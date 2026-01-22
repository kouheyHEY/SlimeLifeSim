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
            totalLevel: 0, // 総合レベル（すべての能力が上がる）
            rarity: 0, // レア魚の確率
            hitTime: 0, // ヒット猶予時間
        };

        // アップグレードの最大レベル
        this.maxLevels = {
            totalLevel: 30,
            rarity: 100,
            hitTime: 100,
        };

        // アップグレードのコスト計算式（ベースコスト × 倍率^(レベル-1)）
        this.baseCosts = {
            totalLevel: 100,
            rarity: 5,
            hitTime: 5,
        };

        // コストの増加倍率（指数的増加）
        this.costMultipliers = {
            totalLevel: 1.3,
            rarity: 1.08,
            hitTime: 1.1,
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
            JSON.stringify(this.upgrades),
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
     * 次のレベルのコストを取得（指数的増加）
     * @param {string} upgradeKey - アップグレードのキー
     * @returns {number} コスト（最大レベルの場合は-1）
     */
    getUpgradeCost(upgradeKey) {
        if (!this.canUpgrade(upgradeKey)) {
            return -1; // 最大レベル
        }
        const currentLevel = this.upgrades[upgradeKey] || 0;
        const baseCost = this.baseCosts[upgradeKey] || 100;
        const multiplier = this.costMultipliers[upgradeKey] || 1.5;
        // cost = baseCost * multiplier^currentLevel
        return Math.floor(baseCost * Math.pow(multiplier, currentLevel));
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
            `アップグレード成功: ${upgradeKey} レベル${this.upgrades[upgradeKey]}`,
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
     * 自動釣りが有効かどうか
     * @returns {boolean}
     */
    isAutoFishingEnabled() {
        // 簡略化版では常にfalse
        return false;
    }

    /**
     * 魚の釣れやすさの倍率を取得
     * @returns {number}
     */
    getFishCatchRateMultiplier() {
        // 総合レベルに応じて上昇
        return 1.0 + this.upgrades.totalLevel * 0.05;
    }

    /**
     * 釣り糸の力の倍率を取得
     * @returns {number}
     */
    getLinePowerMultiplier() {
        // 総合レベルに応じて上昇
        return 1.0 + this.upgrades.totalLevel * 0.1;
    }

    /**
     * 魚の価値の倍率を取得
     * @returns {number}
     */
    getFishValueMultiplier() {
        // 総合レベルに応じて上昇
        return 1.0 + this.upgrades.totalLevel * 0.05;
    }

    /**
     * 総合レベルを取得
     * @returns {number}
     */
    getTotalLevel() {
        return this.upgrades.totalLevel || 0;
    }

    /**
     * 総合最大レベルを取得
     * @returns {number}
     */
    getTotalMaxLevel() {
        return this.maxLevels.totalLevel || 30;
    }

    /**
     * 総合アップグレードのコストを取得
     * @returns {number}
     */
    getTotalUpgradeCost() {
        if (this.upgrades.totalLevel >= this.maxLevels.totalLevel) {
            return Infinity;
        }
        return this.baseCosts.totalLevel * (this.upgrades.totalLevel + 1);
    }

    /**
     * 総合アップグレードを実行
     * @param {number} currentCoins - 現在のコイン枚数
     * @returns {Object} - {success: boolean, newCoins: number, newLevel: number}
     */
    upgradeAll(currentCoins) {
        const cost = this.getTotalUpgradeCost();

        if (this.upgrades.totalLevel >= this.maxLevels.totalLevel) {
            return {
                success: false,
                newCoins: currentCoins,
                newLevel: this.upgrades.totalLevel,
            };
        }

        if (currentCoins < cost) {
            return {
                success: false,
                newCoins: currentCoins,
                newLevel: this.upgrades.totalLevel,
            };
        }

        // アップグレード実行
        this.upgrades.totalLevel++;
        const newCoins = currentCoins - cost;

        // データを保存
        this.saveUpgrades();

        console.log(
            `総合アップグレード成功: レベル${this.upgrades.totalLevel}`,
        );

        return { success: true, newCoins, newLevel: this.upgrades.totalLevel };
    }

    /**
     * 魚のヒット確率の倍率を取得（旧互換性のため残す）
     * @returns {number} 倍率（1.0 = 通常、1.5 = 1.5倍など）
     */
    getFishCatchRateMultiplierOld() {
        // レベル1で1.1倍、レベル10で2.0倍
        return 1.0 + this.upgrades.fishCatchRate * 0.1;
    }

    /**
     * 釣り糸の引っ張り力倍率を取得（旧互換性のため残す）
     * @returns {number} 倍率（1.0 = 通常、2.0 = 2倍など）
     */
    getLinePowerMultiplierOld() {
        // レベル1で1.2倍、レベル10で2.8倍
        return 1.0 + this.upgrades.linePower * 0.2;
    }

    /**
     * 魚の価値倍率を取得（旧互換性のため残す）
     * @returns {number} 倍率（1.0 = 通常、2.0 = 2倍など）
     */
    getFishValueMultiplierOld() {
        // レベル1で1.1倍、レベル10で2.0倍
        return 1.0 + this.upgrades.fishValue * 0.1;
    }

    /**
     * レア魚の確率倍率を取得
     * @returns {number} 倍率（1.0 = 通常、1.5 = 1.5倍など）
     */
    getRareFishRateMultiplier() {
        const level = this.upgrades.rarity || 0;
        // レベル1で1.1倍、レベル10で2.0倍
        return 1.0 + level * 0.1;
    }

    /**
     * ヒット時間の延長倍率を取得
     * @returns {number} 倍率（1.0 = 通常、2.0 = 2倍など）
     */
    getHitTimeMultiplier() {
        const level = this.upgrades.hitTime || 0;
        // 最大100レベルで2倍になる直線補正
        return 1.0 + level / 100;
    }
}
