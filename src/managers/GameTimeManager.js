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
            minute: 0
        };
        
        // 現在のゲーム時間
        this.currentTime = { ...this.gameStartTime };
        
        // 前回の更新時刻（実時間）
        this.lastUpdateTime = Date.now();
        
        // 天気の状態
        this.weatherStates = ['☀️', '⛅', '☁️', '🌧️'];
        this.currentWeather = this.weatherStates[0]; // 初期は晴れ
    }
    
    /**
     * ゲーム時間の更新
     * 1実時間秒 = 2ゲーム内分
     */
    update() {
        const now = Date.now();
        const deltaSeconds = (now - this.lastUpdateTime) / 1000;
        
        // 1秒で2分進める
        const minutesToAdd = Math.floor(deltaSeconds * 2);
        
        if (minutesToAdd > 0) {
            this.addMinutes(minutesToAdd);
            this.lastUpdateTime = now;
        }
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
        const hour = String(this.currentTime.hour).padStart(2, '0');
        const minute = String(this.currentTime.minute).padStart(2, '0');
        return `${hour}:${minute}`;
    }
    
    /**
     * 現在の天気アイコンを取得
     * @returns {string} 天気の絵文字
     */
    getWeatherIcon() {
        return this.currentWeather;
    }
}
