import { STORAGE_KEY } from "../const/CommonConst.js";

/**
 * ゲーム設定管理マネージャー
 * BGM/SE音量、背景色変化、アニメーション、ステータス変化などの設定を管理
 */
export class SettingsManager {
    /**
     * コンストラクタ
     * @param {Phaser.Scene} scene - 所属するシーン
     */
    constructor(scene) {
        this.scene = scene;

        // デフォルト設定
        this.settings = {
            bgmVolume: 0.5, // BGM音量（0.0-1.0）
            seVolume: 0.5, // SE音量（0.0-1.0）
            backgroundColorChange: true, // 背景色の変化
            playerAnimation: true, // プレイヤーのアニメーション
            statusChange: true, // ステータスの変化
            autoFishing: false, // 釣り全自動化（アップグレードで有効化）
        };

        // LocalStorageから読み込み
        this.loadSettings();
    }

    /**
     * 設定をLocalStorageから読み込み
     */
    loadSettings() {
        const saved = localStorage.getItem(STORAGE_KEY.SETTINGS);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.settings = { ...this.settings, ...data };
            } catch (e) {
                console.error("設定の読み込みに失敗:", e);
            }
        }
    }

    /**
     * 設定をLocalStorageに保存
     */
    saveSettings() {
        localStorage.setItem(
            STORAGE_KEY.SETTINGS,
            JSON.stringify(this.settings)
        );
    }

    /**
     * BGM音量を取得
     * @returns {number} 音量（0.0-1.0）
     */
    getBgmVolume() {
        return this.settings.bgmVolume;
    }

    /**
     * BGM音量を設定
     * @param {number} volume - 音量（0.0-1.0）
     */
    setBgmVolume(volume) {
        this.settings.bgmVolume = Math.max(0, Math.min(1, volume));
        this.saveSettings();
    }

    /**
     * SE音量を取得
     * @returns {number} 音量（0.0-1.0）
     */
    getSeVolume() {
        return this.settings.seVolume;
    }

    /**
     * SE音量を設定
     * @param {number} volume - 音量（0.0-1.0）
     */
    setSeVolume(volume) {
        this.settings.seVolume = Math.max(0, Math.min(1, volume));
        this.saveSettings();
    }

    /**
     * 背景色変化が有効かチェック
     * @returns {boolean}
     */
    isBackgroundColorChangeEnabled() {
        return this.settings.backgroundColorChange;
    }

    /**
     * 背景色変化を設定
     * @param {boolean} enabled
     */
    setBackgroundColorChange(enabled) {
        this.settings.backgroundColorChange = enabled;
        this.saveSettings();
    }

    /**
     * プレイヤーアニメーションが有効かチェック
     * @returns {boolean}
     */
    isPlayerAnimationEnabled() {
        return this.settings.playerAnimation;
    }

    /**
     * プレイヤーアニメーションを設定
     * @param {boolean} enabled
     */
    setPlayerAnimation(enabled) {
        this.settings.playerAnimation = enabled;
        this.saveSettings();
    }

    /**
     * ステータス変化が有効かチェック
     * @returns {boolean}
     */
    isStatusChangeEnabled() {
        return this.settings.statusChange;
    }

    /**
     * ステータス変化を設定
     * @param {boolean} enabled
     */
    setStatusChange(enabled) {
        this.settings.statusChange = enabled;
        this.saveSettings();
    }

    /**
     * 釣り全自動化が有効かチェック
     * @returns {boolean}
     */
    isAutoFishingEnabled() {
        return this.settings.autoFishing;
    }

    /**
     * 釣り全自動化を設定
     * @param {boolean} enabled
     */
    setAutoFishing(enabled) {
        this.settings.autoFishing = enabled;
        this.saveSettings();
    }
}
