/**
 * SaveManager
 * ゲームの状態をlocalStorageに保存・読み込みするマネージャー
 */
export class SaveManager {
    constructor() {
        this.SAVE_KEY = "slimeLifeSim_saveData";
    }

    /**
     * セーブデータが存在するか確認
     * @returns {boolean} セーブデータが存在するか
     */
    hasSaveData() {
        const data = localStorage.getItem(this.SAVE_KEY);
        return data !== null;
    }

    /**
     * ゲームデータを保存
     * @param {Object} gameData - 保存するゲームデータ
     * @param {Object} gameData.gameTime - 日数と時刻のデータ
     * @param {Object} gameData.inventory - インベントリのデータ
     * @param {Object} gameData.coins - コイン枚数
     * @param {Object} gameData.letters - 手紙のデータ
     * @param {Object} gameData.tutorial - チュートリアルの状態
     * @param {Object} gameData.upgrades - アップグレードの状態
     * @param {Object} gameData.settings - 設定データ
     */
    saveGame(gameData) {
        try {
            const saveData = {
                version: "1.0.0",
                timestamp: new Date().toISOString(),
                data: gameData,
            };
            localStorage.setItem(this.SAVE_KEY, JSON.stringify(saveData));
            console.log("ゲームを保存しました:", saveData);
            return true;
        } catch (error) {
            console.error("セーブに失敗しました:", error);
            return false;
        }
    }

    /**
     * ゲームデータを読み込み
     * @returns {Object|null} 読み込んだゲームデータ、存在しない場合はnull
     */
    loadGame() {
        try {
            const savedData = localStorage.getItem(this.SAVE_KEY);
            if (!savedData) {
                console.log("セーブデータが見つかりません");
                return null;
            }

            const saveData = JSON.parse(savedData);
            console.log("ゲームを読み込みました:", saveData);
            return saveData.data;
        } catch (error) {
            console.error("ロードに失敗しました:", error);
            return null;
        }
    }

    /**
     * セーブデータを削除
     */
    deleteSave() {
        try {
            localStorage.removeItem(this.SAVE_KEY);
            console.log("セーブデータを削除しました");
            return true;
        } catch (error) {
            console.error("セーブデータの削除に失敗しました:", error);
            return false;
        }
    }

    /**
     * セーブデータをリセット（新規ゲーム用）
     * チュートリアル状態も含めてすべてクリア
     */
    resetSave() {
        // セーブデータを削除
        this.deleteSave();

        // チュートリアル状態もクリア
        localStorage.removeItem("tutorialCompleted");
        localStorage.removeItem("coinTutorialCompleted");

        // アップグレードと設定もクリア
        localStorage.removeItem("slimelife_upgrades");
        localStorage.removeItem("slimelife_settings");

        console.log("全データをリセットしました");
        return true;
    }
}
