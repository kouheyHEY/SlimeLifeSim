/**
 * サウンド管理クラス
 * ゲーム全体のBGMと効果音を管理する
 */
export class SoundManager {
    /**
     * @param {Phaser.Scene} scene シーン
     */
    constructor(scene) {
        this.scene = scene;

        /** BGMの音量 */
        this.bgmVolume = 0.5;
        /** SEの音量 */
        this.seVolume = 0.7;

        /** 現在再生中のBGM */
        this.currentBgm = null;
    }

    /**
     * BGMを再生
     * @param {string} key サウンドキー
     * @param {boolean} loop ループ再生するか（デフォルト: true）
     */
    playBgm(key, loop = true) {
        // 既存のBGMを停止
        this.stopBgm();

        // 新しいBGMを再生
        this.currentBgm = this.scene.sound.add(key, {
            volume: this.bgmVolume,
            loop: loop,
        });
        this.currentBgm.play();
    }

    /**
     * BGMを停止
     */
    stopBgm() {
        if (this.currentBgm) {
            this.currentBgm.stop();
            this.currentBgm.destroy();
            this.currentBgm = null;
        }
    }

    /**
     * BGMをフェードアウト
     * @param {number} duration フェードアウト時間（ミリ秒）
     */
    fadeOutBgm(duration = 1000) {
        if (this.currentBgm) {
            this.scene.tweens.add({
                targets: this.currentBgm,
                volume: 0,
                duration: duration,
                onComplete: () => {
                    this.stopBgm();
                },
            });
        }
    }

    /**
     * BGMの音量を設定
     * @param {number} volume 音量（0.0〜1.0）
     */
    setBgmVolume(volume) {
        this.bgmVolume = Math.max(0, Math.min(1, volume));
        if (this.currentBgm) {
            this.currentBgm.setVolume(this.bgmVolume);
        }
    }

    /**
     * 効果音を再生
     * @param {string} key サウンドキー
     * @param {number} volume 音量（デフォルト: SEの基本音量）
     */
    playSe(key, volume = null) {
        const seVolume = volume !== null ? volume : this.seVolume;
        this.scene.sound.play(key, {
            volume: seVolume,
        });
    }

    /**
     * SEの音量を設定
     * @param {number} volume 音量（0.0〜1.0）
     */
    setSeVolume(volume) {
        this.seVolume = Math.max(0, Math.min(1, volume));
    }

    /**
     * すべてのサウンドを停止
     */
    stopAll() {
        this.stopBgm();
        this.scene.sound.stopAll();
    }

    /**
     * リソース解放
     */
    destroy() {
        this.stopAll();
    }
}
