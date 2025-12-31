import { GAME_CONST } from "../const/GameConst.js";

/**
 * ゲーム時間管理マネージャー
 * 1実時間秒 = 2ゲーム内分
 */
export class GameTimeManager {
    /**
     * コンストラクタ
     * @param {Phaser.Scene} scene - 所属するシーン
     */
    constructor(scene) {
        this.scene = scene;

        // ゲーム開始時刻（ゲーム内時間）
        // 初期時刻: 6:00 AM, 1日目
        this.gameStartTime = {
            month: 4,
            day: 1,
            hour: 6,
            minute: 0,
        };

        // 現在のゲーム時間
        this.currentTime = { ...this.gameStartTime };

        // 前回の更新時刻（実時間）
        this.lastUpdateTime = Date.now();

        // 累積時間（秒）
        this.elapsedSeconds = 0;

        // 天気の状態
        this.weatherStates = ["☀️", "⛅", "☁️", "🌧️"];
        this.currentWeather = this.weatherStates[0]; // 初期は晴れ

        // 魚ヒット関連
        this.fishHitActive = false; // 魚がヒットしているか
        this.fishHitEndTime = null; // ヒット終了時刻（ゲーム内分の合計）
        this.lotteryActive = true; // 抽選が有効かどうか
        this.lastLotteryMinute = this.getTotalMinutes(); // 最後に抽選を行った時刻
    }

    /**
     * ゲーム時間の更新
     * 1実時間秒 = 2ゲーム内分
     */
    update() {
        const now = Date.now();
        const deltaSeconds = (now - this.lastUpdateTime) / 1000;

        // 累積時間に加算
        this.elapsedSeconds += deltaSeconds;

        // 0.5秒（ゲーム内1分）ごとに時間を進める
        while (this.elapsedSeconds >= 0.5) {
            this.addMinutes(1);
            this.elapsedSeconds -= 0.5;
        }

        this.checkFishHitLottery();

        // シーンが一時停止と再開を繰り返す際の時間蓄積を防ぐため、常に更新
        this.lastUpdateTime = now;
    }

    /**
     * ゲーム内時間に分を追加
     * @param {number} minutes - 追加する分数
     */
    addMinutes(minutes) {
        this.currentTime.minute += minutes;

        // 時間の繰り上がり処理
        while (this.currentTime.minute >= 60) {
            this.currentTime.minute -= 60;
            this.currentTime.hour += 1;

            if (this.currentTime.hour >= 24) {
                this.currentTime.hour = 0;
                this.currentTime.day += 1;

                // 月の日数チェック（簡易版：全て30日とする）
                if (this.currentTime.day > 30) {
                    this.currentTime.day = 1;
                    this.currentTime.month += 1;

                    if (this.currentTime.month > 12) {
                        this.currentTime.month = 1;
                    }
                }
            }
        }
    }

    /**
     * 現在の日付を "m/d" 形式で取得
     * @returns {string} 日付文字列
     */
    getDateString() {
        return `${this.currentTime.month}/${this.currentTime.day}`;
    }

    /**
     * 現在の時刻を "hh:mm" 形式で取得
     * @returns {string} 時刻文字列
     */
    getTimeString() {
        const hour = String(this.currentTime.hour).padStart(2, "0");
        const minute = String(this.currentTime.minute).padStart(2, "0");
        return `${hour}:${minute}`;
    }

    /**
     * 現在の天気アイコンを取得
     * @returns {string} 天気の絵文字
     */
    getWeatherIcon() {
        return this.currentWeather;
    }

    /**
     * 現在のゲーム時間を分単位の合計で取得
     * @returns {number} 合計分数
     */
    getTotalMinutes() {
        return (
            this.currentTime.day * 24 * 60 +
            this.currentTime.hour * 60 +
            this.currentTime.minute
        );
    }

    /**
     * 魚ヒットの抽選をチェック
     */
    checkFishHitLottery() {
        const currentTotalMinutes = this.getTotalMinutes();

        // ヒットが有効な場合、終了時刻をチェック
        if (this.fishHitActive) {
            if (currentTotalMinutes >= this.fishHitEndTime) {
                this.fishHitActive = false;
                this.lotteryActive = true;
                console.log("魚ヒット終了");
                // イベントを発火してUIを更新
                this.scene.events.emit("fishHit", false);
            }
            return;
        }

        // 抽選が無効の場合は何もしない
        if (!this.lotteryActive) {
            return;
        }

        // 1分ごとに抽選を行う
        if (currentTotalMinutes > this.lastLotteryMinute) {
            this.lastLotteryMinute = currentTotalMinutes;

            // 低確率で魚がヒット
            const random = Phaser.Math.Between(
                1,
                GAME_CONST.FISH_HIT_LOTTERY_PROBABILITY
            );
            if (random === 1) {
                this.triggerFishHit();
            }
        }
    }

    /**
     * 魚ヒットを発生させる
     */
    triggerFishHit() {
        this.fishHitActive = true;
        this.lotteryActive = false;

        // ヒット持続時間をランダムに決定（10～20分）
        const duration = Phaser.Math.Between(
            GAME_CONST.FISH_HIT_DURATION_MIN,
            GAME_CONST.FISH_HIT_DURATION_MAX
        );
        this.fishHitEndTime = this.getTotalMinutes() + duration;

        console.log(`魚ヒット発生！ ${duration}分間有効`);

        // イベントを発火してUIを更新
        this.scene.events.emit("fishHit", true);
    }

    /**
     * 魚がヒットしているかどうかを取得
     * @returns {boolean} ヒット状態
     */
    isFishHitActive() {
        return this.fishHitActive;
    }

    /**
     * 釣りゲーム終了時の処理（ヒットを終了し抽選を再開）
     */
    resumeFishSystem() {
        this.fishHitActive = false;
        this.lotteryActive = true;
        this.lastLotteryMinute = this.getTotalMinutes();
        console.log("魚ヒットシステム再開");

        // イベントを発火してUIを更新
        this.scene.events.emit("fishHit", false);
    }

    /**
     * 現在の時間帯を取得
     * @returns {string} 時間帯 ("朝", "昼", "夕方", "夜")
     */
    getTimePeriod() {
        const hour = this.currentTime.hour;
        if (hour >= 6 && hour < 12) {
            return "朝"; // Morning: 6:00-11:59
        } else if (hour >= 12 && hour < 18) {
            return "昼"; // Day: 12:00-17:59
        } else if (hour >= 18 && hour < 21) {
            return "夕方"; // Evening: 18:00-20:59
        } else {
            return "夜"; // Night: 21:00-5:59
        }
    }

    /**
     * 現在の時間帯内での進行度を取得（0.0-1.0）
     * @returns {number} 進行度
     */
    getTimePeriodProgress() {
        const hour = this.currentTime.hour;
        const minute = this.currentTime.minute;
        const totalMinutes = hour * 60 + minute;

        if (hour >= 6 && hour < 12) {
            // 朝: 6:00-11:59 (6時間 = 360分)
            const periodStart = 6 * 60; // 360分
            return (totalMinutes - periodStart) / 360;
        } else if (hour >= 12 && hour < 18) {
            // 昼: 12:00-17:59 (6時間 = 360分)
            const periodStart = 12 * 60; // 720分
            return (totalMinutes - periodStart) / 360;
        } else if (hour >= 18 && hour < 21) {
            // 夕方: 18:00-20:59 (3時間 = 180分)
            const periodStart = 18 * 60; // 1080分
            return (totalMinutes - periodStart) / 180;
        } else {
            // 夜: 21:00-5:59 (9時間 = 540分)
            if (hour >= 21) {
                // 21:00-23:59
                const periodStart = 21 * 60; // 1260分
                return (totalMinutes - periodStart) / 540;
            } else {
                // 0:00-5:59
                const adjustedMinutes = totalMinutes + 3 * 60; // 夜の開始から3時間後として計算
                return adjustedMinutes / 540;
            }
        }
    }
}
