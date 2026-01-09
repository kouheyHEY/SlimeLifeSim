import { GAME_CONST, GAME_TIME_CONST } from "../const/GameConst.js";
import { MAP_CONST } from "../const/MapConst.js";

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
        this.gameStartTime = { ...GAME_TIME_CONST.GAME_START_TIME };

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

        // ゲーム時間のポーズ状態
        this.isPausedFlag = false; // ゲーム時間が一時停止中かどうか
    }

    /**
     * ゲーム時間の更新
     * 1実時間秒 = 2ゲーム内分
     */
    update() {
        // ゲーム時間が一時停止中の場合は時間を進めない
        if (this.isPausedFlag) {
            this.lastUpdateTime = Date.now();
            return;
        }

        const now = Date.now();
        const deltaSeconds =
            (now - this.lastUpdateTime) /
            GAME_TIME_CONST.REAL_TIME_CONVERSION.SECONDS_PER_MILLISECOND;

        // 累積時間に加算
        this.elapsedSeconds += deltaSeconds;

        // UPDATE_THRESHOLD_SECONDS（ゲーム内1分）ごとに時間を進める
        while (
            this.elapsedSeconds >= GAME_TIME_CONST.UPDATE_THRESHOLD_SECONDS
        ) {
            this.addMinutes(GAME_TIME_CONST.TIME_SCALE_MINUTES_PER_REAL_SECOND);
            this.elapsedSeconds -= GAME_TIME_CONST.UPDATE_THRESHOLD_SECONDS;
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

        const timeUnits = GAME_TIME_CONST.TIME_UNITS;

        // 時間の繰り上がり処理
        while (this.currentTime.minute >= timeUnits.MINUTES_PER_HOUR) {
            this.currentTime.minute -= timeUnits.MINUTES_PER_HOUR;
            this.currentTime.hour += 1;

            if (this.currentTime.hour >= timeUnits.HOURS_PER_DAY) {
                this.currentTime.hour = 0;
                this.currentTime.day += 1;

                // 月の日数チェック（簡易版：全て30日とする）
                if (this.currentTime.day > timeUnits.DAYS_PER_MONTH) {
                    this.currentTime.day = 1;
                    this.currentTime.month += 1;

                    if (this.currentTime.month > timeUnits.MONTHS_PER_YEAR) {
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
        const timeUnits = GAME_TIME_CONST.TIME_UNITS;
        return (
            this.currentTime.day *
                timeUnits.HOURS_PER_DAY *
                timeUnits.MINUTES_PER_HOUR +
            this.currentTime.hour * timeUnits.MINUTES_PER_HOUR +
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
     * @returns {string} 時間帯 ("MORNING", "DAY", "EVENING", "NIGHT")
     */
    getTimePeriod() {
        const hour = this.currentTime.hour;
        if (hour >= 6 && hour < 12) {
            return "MORNING"; // Morning: 6:00-11:59
        } else if (hour >= 12 && hour < 16) {
            return "DAY"; // Day: 12:00-15:59
        } else if (hour >= 16 && hour < 19) {
            return "EVENING"; // Evening: 16:00-18:59
        } else {
            return "NIGHT"; // Night: 19:00-5:59
        }
    }

    /**
     * 現在の時間帯内での進行度を取得（0.0-1.0）
     * @returns {number} 進行度
     */
    getTimePeriodProgress() {
        const hour = this.currentTime.hour;
        const minute = this.currentTime.minute;
        const totalMinutes =
            hour * GAME_TIME_CONST.TIME_UNITS.MINUTES_PER_HOUR + minute;
        const timeUnits = GAME_TIME_CONST.TIME_UNITS;
        const periods = GAME_TIME_CONST.TIME_PERIOD_LENGTHS;

        if (hour >= 6 && hour < 12) {
            // 朝
            const periodStart = 6 * timeUnits.MINUTES_PER_HOUR;
            return (
                (totalMinutes - periodStart) /
                (periods.MORNING * timeUnits.MINUTES_PER_HOUR)
            );
        } else if (hour >= 12 && hour < 16) {
            // 昼
            const periodStart = 12 * timeUnits.MINUTES_PER_HOUR;
            return (
                (totalMinutes - periodStart) /
                (periods.DAY * timeUnits.MINUTES_PER_HOUR)
            );
        } else if (hour >= 16 && hour < 19) {
            // 夕方
            const periodStart = 16 * timeUnits.MINUTES_PER_HOUR;
            return (
                (totalMinutes - periodStart) /
                (periods.EVENING * timeUnits.MINUTES_PER_HOUR)
            );
        } else {
            // 夜: 19:00-5:59 (11時間 = 660分)
            if (hour >= 19) {
                // 19:00-23:59
                const periodStart = 19 * timeUnits.MINUTES_PER_HOUR;
                return (
                    (totalMinutes - periodStart) /
                    (periods.NIGHT * timeUnits.MINUTES_PER_HOUR)
                );
            } else {
                // 0:00-5:59
                const adjustedMinutes =
                    totalMinutes +
                    (timeUnits.HOURS_PER_DAY - 19) * timeUnits.MINUTES_PER_HOUR;
                return (
                    adjustedMinutes /
                    (periods.NIGHT * timeUnits.MINUTES_PER_HOUR)
                );
            }
        }
    }

    /**
     * ゲーム時間を一時停止
     */
    pause() {
        this.isPausedFlag = true;
        // ポーズ時に前回の更新時刻をリセット（再開時に時間差が蓄積しないようにする）
        this.lastUpdateTime = Date.now();
    }

    /**
     * ゲーム時間を再開
     */
    resume() {
        this.isPausedFlag = false;
        // 再開時に前回の更新時刻をリセット（ポーズ中の時間差を無視する）
        this.lastUpdateTime = Date.now();
    }

    /**
     * 現在の時間帯を取得
     * @returns {string} 時間帯の名前
     */
    getCurrentTimeOfDay() {
        const hour = this.currentTime.hour;
        const hours = MAP_CONST.TIME_OF_DAY_HOURS;

        if (hour >= hours.EARLY_MORNING_START && hour < hours.MORNING_START) {
            return "EARLY_MORNING";
        } else if (hour >= hours.MORNING_START && hour < hours.DAY_START) {
            return "MORNING";
        } else if (hour >= hours.DAY_START && hour < hours.EVENING_START) {
            return "DAY";
        } else if (hour >= hours.EVENING_START && hour < hours.DUSK_START) {
            return "EVENING";
        } else if (hour >= hours.DUSK_START && hour < hours.NIGHT_START) {
            return "DUSK";
        } else {
            return "NIGHT";
        }
    }

    /**
     * 背景色用の細かい時間帯が変わったかチェック
     * @returns {boolean} 時間帯が変わったか
     */
    hasBackgroundTimeChanged() {
        const currentTimeOfDay = this.getCurrentTimeOfDay();
        if (!this.previousBackgroundTime) {
            this.previousBackgroundTime = currentTimeOfDay;
            return false;
        }

        if (this.previousBackgroundTime !== currentTimeOfDay) {
            this.previousBackgroundTime = currentTimeOfDay;
            return true;
        }

        return false;
    }

    /**
     * 時間帯が変わったかチェック（円グラフ・ステータス管理用）
     * @returns {boolean} 時間帯が変わったか
     */
    hasTimeOfDayChanged() {
        const currentTimePeriod = this.getTimePeriod();
        if (!this.previousTimePeriod) {
            this.previousTimePeriod = currentTimePeriod;
            return false;
        }

        if (this.previousTimePeriod !== currentTimePeriod) {
            const previousPeriod = this.previousTimePeriod;
            this.previousTimePeriod = currentTimePeriod;

            console.log(`時間帯変更: ${previousPeriod} → ${currentTimePeriod}`);

            // 朝の終了（昼開始）または夕方の終了（夜開始）時にイベント発火
            if (
                (previousPeriod === "MORNING" && currentTimePeriod === "DAY") ||
                (previousPeriod === "EVENING" && currentTimePeriod === "NIGHT")
            ) {
                console.log("ステータス低下イベントを発火");
                this.scene.events.emit("statusDecreaseTime");
            }

            return true;
        }

        return false;
    }

    /**
     * 魚ヒットシステムを一時停止
     * 釣り中や手紙を読んでいる間に新たな魚ヒットが発生しないようにする
     */
    pauseFishSystem() {
        this.lotteryActive = false;
        // 既存の魚ヒットをクリア
        if (this.fishHitActive) {
            this.fishHitActive = false;
            this.fishHitEndTime = null;
            // 魚ヒットインジケーターを非表示にするイベントを発行
            this.scene.events.emit("fishHit", false);
        }
    }

    /**
     * 魚ヒットシステムを再開
     */
    resumeFishSystem() {
        this.lotteryActive = true;
        // 再開時に最後の抽選時刻を現在時刻に更新（すぐに抽選が始まらないようにする）
        this.lastLotteryMinute = this.getTotalMinutes();
    }
}
