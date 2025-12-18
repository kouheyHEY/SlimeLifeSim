import { PlayerSkillManager } from "./PlayerSkillManager.js";

/**
 * ゲーム状態管理クラス
 * プレイヤーの強化状態などをローカルストレージで管理
 */
export class GameStateManager {
    /** ローカルストレージのキー */
    static STORAGE_KEY = "soniclike_game_state";

    /**
     * ゲーム状態の初期値
     */
    static getDefaultState() {
        return {
            skillLevels: {
                speed: 0,
                power: 0,
                coin_speed_boost: 0,
                double_jump: 0,
                speed_down_score: 0,
            },
            lastPlayedAt: null,
        };
    }

    /**
     * 保存されているゲーム状態を取得
     * @returns {Object} ゲーム状態
     */
    static loadGameState() {
        try {
            const savedData = localStorage.getItem(
                GameStateManager.STORAGE_KEY
            );
            if (savedData) {
                const state = JSON.parse(savedData);

                // 後方互換性: 旧形式(powerUpParams)を新形式(skillLevels)に変換
                if (state.powerUpParams && !state.skillLevels) {
                    state.skillLevels = {
                        speed: state.powerUpParams.speed || 0,
                        power: state.powerUpParams.power || 0,
                        coin_speed_boost:
                            state.powerUpParams.coinSpeedBoost || 0,
                        double_jump: state.powerUpParams.doubleJump || 0,
                        speed_down_score:
                            state.powerUpParams.speedDownScore || 0,
                    };
                    // 変換後のデータを保存
                    GameStateManager.saveGameState(state);
                }

                // キャメルケースからスネークケースへの変換（さらなる後方互換性）
                if (state.skillLevels) {
                    const converted = {};
                    let needsConversion = false;

                    if ("coinSpeedBoost" in state.skillLevels) {
                        converted.coin_speed_boost =
                            state.skillLevels.coinSpeedBoost;
                        needsConversion = true;
                    }
                    if ("doubleJump" in state.skillLevels) {
                        converted.double_jump = state.skillLevels.doubleJump;
                        needsConversion = true;
                    }
                    if ("speedDownScore" in state.skillLevels) {
                        converted.speed_down_score =
                            state.skillLevels.speedDownScore;
                        needsConversion = true;
                    }

                    if (needsConversion) {
                        state.skillLevels = {
                            speed: state.skillLevels.speed || 0,
                            power: state.skillLevels.power || 0,
                            coin_speed_boost: converted.coin_speed_boost || 0,
                            double_jump: converted.double_jump || 0,
                            speed_down_score: converted.speed_down_score || 0,
                        };
                        GameStateManager.saveGameState(state);
                    }
                }

                // skillLevelsが存在しない場合はデフォルト値を設定
                if (!state.skillLevels) {
                    state.skillLevels =
                        GameStateManager.getDefaultState().skillLevels;
                }

                return state;
            }
            return GameStateManager.getDefaultState();
        } catch (error) {
            console.error(
                "Failed to load game state from localStorage:",
                error
            );
            return GameStateManager.getDefaultState();
        }
    }

    /**
     * ゲーム状態を保存
     * @param {Object} state ゲーム状態
     */
    static saveGameState(state) {
        try {
            state.lastPlayedAt = new Date().toISOString();
            localStorage.setItem(
                GameStateManager.STORAGE_KEY,
                JSON.stringify(state)
            );
        } catch (error) {
            console.error("Failed to save game state to localStorage:", error);
        }
    }

    /**
     * ゲーム状態をリセット
     */
    static resetGameState() {
        try {
            localStorage.removeItem(GameStateManager.STORAGE_KEY);
        } catch (error) {
            console.error("Failed to reset game state:", error);
        }
    }

    /**
     * セーブデータが存在するか
     * @returns {boolean}
     */
    static hasSaveData() {
        try {
            const savedData = localStorage.getItem(
                GameStateManager.STORAGE_KEY
            );
            return savedData !== null;
        } catch (error) {
            console.error("Failed to check save data:", error);
            return false;
        }
    }

    /**
     * 初回起動かどうかを判定
     * @returns {boolean} 初回起動の場合true
     */
    static isFirstTime() {
        return !GameStateManager.hasSaveData();
    }

    /**
     * スキルレベルを更新
     * @param {Object} skillLevels スキルレベル
     */
    static updateSkillLevels(skillLevels) {
        const state = GameStateManager.loadGameState();
        state.skillLevels = skillLevels;
        GameStateManager.saveGameState(state);
    }

    /**
     * PlayerSkillManagerを取得
     * @returns {PlayerSkillManager} スキル管理インスタンス
     */
    static getSkillManager() {
        const state = GameStateManager.loadGameState();
        return new PlayerSkillManager(state.skillLevels);
    }

    /**
     * 後方互換性のため、旧形式のパワーアップパラメータを更新（非推奨）
     * @deprecated updateSkillLevelsを使用してください
     * @param {Object} powerUpParams パワーアップパラメータ
     */
    static updatePowerUpParams(powerUpParams) {
        // 旧形式を新形式に変換
        GameStateManager.updateSkillLevels(powerUpParams);
    }
}
