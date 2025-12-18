import { POWERUP_TYPE, POWERUP_VALUE, GAME_CONST } from "./const/GameConst.js";

/**
 * プレイヤースキル管理クラス
 * スキルレベルと実際の効果値を一元管理
 */
export class PlayerSkillManager {
    /**
     * コンストラクタ
     * @param {Object} skillLevels スキルレベル（speed, power, coinSpeedBoost, doubleJump, speedDownScore）
     */
    constructor(skillLevels = null) {
        // スキルレベルを保持（POWERUP_TYPEと一致するスネークケース）
        this.levels = skillLevels || {
            speed: 0,
            power: 0,
            coin_speed_boost: 0,
            double_jump: 0,
            speed_down_score: 0,
        };
    }

    /**
     * スキルレベルを取得
     * @param {string} skillType スキルタイプ
     * @returns {number} スキルレベル
     */
    getLevel(skillType) {
        return this.levels[skillType] || 0;
    }

    /**
     * スキルレベルを設定
     * @param {string} skillType スキルタイプ
     * @param {number} level レベル
     */
    setLevel(skillType, level) {
        this.levels[skillType] = level;
    }

    /**
     * スキルレベルを上昇
     * @param {string} skillType スキルタイプ
     * @param {number} increment 上昇量（デフォルト1）
     */
    incrementLevel(skillType, increment = 1) {
        this.levels[skillType] = (this.levels[skillType] || 0) + increment;
    }

    /**
     * スピードの実際の値を取得（指数関数的成長）
     * レベルごとに3%ずつ上昇する曲線
     * @returns {number} スピード値（四捨五入した整数）
     */
    getSpeedValue() {
        const level = this.levels.speed;
        if (level === 0) return GAME_CONST.PLAYER_SPEED;

        const growthRate = POWERUP_VALUE.SPEED_GROWTH_RATE;
        // 基本値 × (1+上昇率)^レベル
        const value = GAME_CONST.PLAYER_SPEED * Math.pow(1 + growthRate, level);
        return Math.round(value);
    }

    /**
     * パワーの実際の値を取得（基本値 + 上昇値）
     * @returns {number} パワー値
     */
    getPowerValue() {
        return (
            GAME_CONST.PLAYER_POWER + this.levels.power * POWERUP_VALUE.POWER
        );
    }

    /**
     * コインスピードブーストの実際の速度上昇率を取得（指数関数的成長）
     * レベルごとに20%ずつ上昇する曲線
     * @returns {number} 速度上昇率（コイン1枚あたり）
     */
    getCoinSpeedBoostRate() {
        const level = this.levels.coin_speed_boost;
        if (level === 0) return 0;

        const baseRate = POWERUP_VALUE.COIN_SPEED_BOOST_BASE_RATE;
        const growthRate = POWERUP_VALUE.COIN_SPEED_BOOST_GROWTH_RATE;
        // 基本値(0.5%) × (1+上昇率)^(レベル-1)
        const rate = baseRate * Math.pow(1 + growthRate, level - 1);
        // パーセント表示用に丸める（小数点以下1桁まで）
        return Math.round(rate * 1000) / 1000;
    }

    /**
     * 二段ジャンプの最大ジャンプ回数を取得
     * @returns {number} 最大ジャンプ回数
     */
    getMaxJumpCount() {
        return 1 + this.levels.double_jump;
    }

    /**
     * ブレーキスコアのスコア倍率を取得
     * @returns {number} スコア倍率
     */
    getSpeedDownScoreMultiplier() {
        return (
            1 +
            this.levels.speed_down_score *
                POWERUP_VALUE.SPEED_DOWN_SCORE_MULTIPLIER
        );
    }

    /**
     * ブレーキスコアの速度減少率を取得
     * @returns {number} 速度減少率
     */
    getSpeedDownScoreSpeedReduction() {
        return Math.pow(
            POWERUP_VALUE.SPEED_DOWN_SCORE_SPEED_REDUCTION,
            this.levels.speed_down_score
        );
    }

    /**
     * パワーアップ選択時の処理
     * レベルを上昇させ、次のレベル値を返す
     * @param {string} powerUpType パワーアップタイプ
     * @returns {number} 新しいレベル
     */
    applyPowerUp(powerUpType) {
        this.incrementLevel(powerUpType, 1);
        return this.getLevel(powerUpType);
    }

    /**
     * 数値を省略表示形式にフォーマット
     * 1000以上の場合、1.4Kのような形式で表示
     * 小数点以下の桁数も制限する
     * @param {number} value 数値
     * @param {number} decimals 小数点以下の桁数（デフォルト1）
     * @returns {string} フォーマット済み文字列
     */
    formatNumber(value, decimals = 1) {
        if (value >= 1000000) {
            return (value / 1000000).toFixed(decimals) + "M";
        } else if (value >= 1000) {
            return (value / 1000).toFixed(decimals) + "K";
        }
        // 小数点以下の桁数を制限し、末尾の0と不要な小数点を削除
        return value.toFixed(decimals).replace(/\.?0+$/, "");
    }

    /**
     * すべてのスキル情報を取得（UI表示用）
     * @returns {Object} スキル情報
     */
    getAllSkillInfo() {
        const coinRate = this.getCoinSpeedBoostRate();

        const speedReduction = this.getSpeedDownScoreSpeedReduction();
        const scoreMultiplier = this.getSpeedDownScoreMultiplier();

        return {
            speed: {
                level: this.levels.speed,
                value: this.getSpeedValue(),
                displayValue: this.formatNumber(this.getSpeedValue()),
            },
            power: {
                level: this.levels.power,
                value: this.getPowerValue(),
                displayValue: this.formatNumber(
                    Math.ceil(this.getPowerValue())
                ),
            },
            coinSpeedBoost: {
                level: this.levels.coin_speed_boost,
                rate: coinRate,
                displayValue: `スピード +${this.formatNumber(
                    coinRate * 100
                )}%/枚`,
            },
            doubleJump: {
                level: this.levels.double_jump,
                maxJumpCount: this.getMaxJumpCount(),
                displayValue:
                    this.levels.double_jump > 0
                        ? `空中ジャンプ +${this.levels.double_jump}回`
                        : "---",
            },
            speedDownScore: {
                level: this.levels.speed_down_score,
                scoreMultiplier: scoreMultiplier,
                speedReduction: speedReduction,
                displayValue: `スピード -${Math.ceil(
                    (1 - speedReduction) * 100
                )}%\nコインスコア +${((scoreMultiplier - 1) * 100).toFixed(
                    0
                )}%`,
            },
        };
    }

    /**
     * パワーアップ後のスキル情報を取得（選択肢表示用）
     * @param {string} powerUpType パワーアップタイプ
     * @returns {Object} 現在値と更新後の値
     */
    getSkillInfoForChoice(powerUpType) {
        const currentLevel = this.getLevel(powerUpType);
        const nextLevel = currentLevel + 1;

        const result = {
            currentLevel,
            nextLevel,
        };

        switch (powerUpType) {
            case POWERUP_TYPE.SPEED:
                result.currentValue = this.getSpeedValue();

                // 次のレベルでの値計算（指数関数的成長）
                const growthRate = POWERUP_VALUE.SPEED_GROWTH_RATE;
                result.nextValue = Math.round(
                    GAME_CONST.PLAYER_SPEED *
                        Math.pow(1 + growthRate, nextLevel)
                );

                result.displayText = `スピード: ${this.formatNumber(
                    result.currentValue
                )} → ${this.formatNumber(result.nextValue)}`;
                break;

            case POWERUP_TYPE.POWER:
                result.currentValue = this.getPowerValue();
                result.nextValue =
                    GAME_CONST.PLAYER_POWER + nextLevel * POWERUP_VALUE.POWER;
                result.displayText = `パワー: ${this.formatNumber(
                    Math.round(result.currentValue)
                )} → ${this.formatNumber(Math.round(result.nextValue))}`;
                break;

            case POWERUP_TYPE.COIN_SPEED_BOOST:
                result.currentRate = this.getCoinSpeedBoostRate();

                // 次のレベルでのレート計算（指数関数的成長）
                const baseRate = POWERUP_VALUE.COIN_SPEED_BOOST_BASE_RATE;
                const coinGrowthRate =
                    POWERUP_VALUE.COIN_SPEED_BOOST_GROWTH_RATE;
                const nextRateRaw =
                    baseRate * Math.pow(1 + coinGrowthRate, nextLevel - 1);
                result.nextRate = Math.round(nextRateRaw * 1000) / 1000;

                // 表示テキスト生成
                const currentRatePercent = result.currentRate * 100;
                const nextRatePercent = result.nextRate * 100;
                result.displayText = `スピード: +${this.formatNumber(
                    currentRatePercent
                )}%/枚 → +${this.formatNumber(nextRatePercent)}%/枚`;
                break;

            case POWERUP_TYPE.DOUBLE_JUMP:
                result.currentMaxJumps = this.getMaxJumpCount();
                result.nextMaxJumps = 1 + nextLevel;
                result.displayText = `ジャンプ回数: ${result.currentMaxJumps} → ${result.nextMaxJumps}`;
                break;

            case POWERUP_TYPE.SPEED_DOWN_SCORE:
                result.currentMultiplier = this.getSpeedDownScoreMultiplier();
                result.nextMultiplier =
                    1 + nextLevel * POWERUP_VALUE.SPEED_DOWN_SCORE_MULTIPLIER;
                result.currentSpeedReduction =
                    this.getSpeedDownScoreSpeedReduction();
                result.nextSpeedReduction = Math.pow(
                    POWERUP_VALUE.SPEED_DOWN_SCORE_SPEED_REDUCTION,
                    nextLevel
                );

                const currentSpeedReductionPercent = Math.round(
                    (1 - result.currentSpeedReduction) * 100
                );
                const nextSpeedReductionPercent = Math.round(
                    (1 - result.nextSpeedReduction) * 100
                );
                const currentScorePercent = Math.round(
                    (result.currentMultiplier - 1) * 100
                );
                const nextScorePercent = Math.round(
                    (result.nextMultiplier - 1) * 100
                );
                result.displayText = `スピード: -${currentSpeedReductionPercent}% → -${nextSpeedReductionPercent}%\nスコア: +${currentScorePercent}% → +${nextScorePercent}%`;
                break;
        }

        return result;
    }

    /**
     * レベル情報を取得（保存用）
     * @returns {Object} レベル情報
     */
    getLevels() {
        return { ...this.levels };
    }
}
