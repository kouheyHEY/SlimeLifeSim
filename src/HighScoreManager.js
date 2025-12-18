/**
 * ハイスコア管理クラス
 * スコアランキングとタイムランキングを別々に保存・読み込みする
 */
export class HighScoreManager {
    /** ローカルストレージのキー（スコアランキング） */
    static STORAGE_KEY_SCORE = "soniclike_score_rankings";
    /** ローカルストレージのキー（タイムランキング） */
    static STORAGE_KEY_TIME = "soniclike_time_rankings";
    /** 保存する最大レコード数（各ランキング） */
    static MAX_RECORDS = 10;

    /**
     * 旧形式のデータを新形式に移行する
     */
    static migrateOldData() {
        try {
            // 新形式のデータが既に存在する場合は移行不要
            const scoreData = localStorage.getItem(
                HighScoreManager.STORAGE_KEY_SCORE
            );
            const timeData = localStorage.getItem(
                HighScoreManager.STORAGE_KEY_TIME
            );

            if (scoreData || timeData) {
                return; // 既に新形式が存在
            }

            // 旧形式のデータを取得
            const oldData = localStorage.getItem("soniclike_highscores");
            if (!oldData) {
                return; // 旧データも存在しない
            }

            const oldRecords = JSON.parse(oldData);
            if (!Array.isArray(oldRecords) || oldRecords.length === 0) {
                return;
            }

            // 各レコードにIDを付与
            const recordsWithId = oldRecords.map((record, index) => ({
                id: `migrated_${Date.now()}_${index}`,
                score: record.score,
                time: record.time,
                date: record.date || new Date().toISOString(),
            }));

            // スコアランキング用にソート
            const scoreRankings = [...recordsWithId]
                .sort((a, b) => {
                    if (b.score !== a.score) {
                        return b.score - a.score;
                    }
                    return a.time - b.time;
                })
                .slice(0, HighScoreManager.MAX_RECORDS);

            // タイムランキング用にソート
            const timeRankings = [...recordsWithId]
                .sort((a, b) => {
                    if (a.time !== b.time) {
                        return a.time - b.time;
                    }
                    return b.score - a.score;
                })
                .slice(0, HighScoreManager.MAX_RECORDS);

            // 新形式で保存
            localStorage.setItem(
                HighScoreManager.STORAGE_KEY_SCORE,
                JSON.stringify(scoreRankings)
            );
            localStorage.setItem(
                HighScoreManager.STORAGE_KEY_TIME,
                JSON.stringify(timeRankings)
            );

            // 旧データは削除せずに残しておく（念のため）
            // localStorage.removeItem("soniclike_highscores");
        } catch (e) {
            console.error("Failed to migrate old data:", e);
        }
    }

    /**
     * スコアランキングを取得する
     * @returns {Array<{id: string, score: number, time: number, date: string}>} スコアランキングの配列
     */
    static getScoreRankings() {
        // 初回アクセス時に移行処理を実行
        HighScoreManager.migrateOldData();

        try {
            const data = localStorage.getItem(
                HighScoreManager.STORAGE_KEY_SCORE
            );
            if (data) {
                return JSON.parse(data);
            }
        } catch (e) {
            console.error("Failed to load score rankings:", e);
        }
        return [];
    }

    /**
     * タイムランキングを取得する
     * @returns {Array<{id: string, score: number, time: number, date: string}>} タイムランキングの配列
     */
    static getTimeRankings() {
        // 初回アクセス時に移行処理を実行
        HighScoreManager.migrateOldData();

        try {
            const data = localStorage.getItem(
                HighScoreManager.STORAGE_KEY_TIME
            );
            if (data) {
                return JSON.parse(data);
            }
        } catch (e) {
            console.error("Failed to load time rankings:", e);
        }
        return [];
    }

    /**
     * 旧形式のハイスコアレコードを取得する（後方互換性のため）
     * @deprecated getScoreRankings() と getTimeRankings() を使用してください
     * @returns {Array<{score: number, time: number, date: string}>} ハイスコアレコードの配列
     */
    static getHighScores() {
        // 新形式が存在する場合はスコアランキングを返す
        const scoreRankings = HighScoreManager.getScoreRankings();
        if (scoreRankings.length > 0) {
            return scoreRankings;
        }

        // 旧形式のデータを読み込む（マイグレーション用）
        try {
            const data = localStorage.getItem("soniclike_highscores");
            if (data) {
                return JSON.parse(data);
            }
        } catch (e) {
            console.error("Failed to load high scores:", e);
        }
        return [];
    }

    /**
     * ハイスコアレコードを保存する（スコアランキングとタイムランキングに別々に保存）
     * @param {number} score スコア
     * @param {number} time タイム（秒）
     * @returns {{scoreRank: number, timeRank: number, isNewHighScore: boolean, isNewBestTime: boolean, scoreSaved: boolean, timeSaved: boolean}}
     *          スコアランクとタイムランク（1から開始、ランク外は-1）、
     *          ハイスコア更新フラグ、最速タイム更新フラグ、各ランキングに保存されたかどうか
     */
    static saveHighScore(score, time) {
        try {
            // 既存のランキングを取得
            const scoreRankings = HighScoreManager.getScoreRankings();
            const timeRankings = HighScoreManager.getTimeRankings();

            // 保存前の最高スコアと最速タイムを取得
            const previousHighScore =
                scoreRankings.length > 0
                    ? Math.max(...scoreRankings.map((r) => r.score))
                    : -Infinity;
            const previousBestTime =
                timeRankings.length > 0
                    ? Math.min(...timeRankings.map((r) => r.time))
                    : Infinity;

            // ユニークIDを生成（タイムスタンプ + ランダム値）
            const id = `${Date.now()}_${Math.random()
                .toString(36)
                .substring(2, 9)}`;

            // 新しいレコードを作成
            const newRecord = {
                id: id,
                score: score,
                time: time,
                date: new Date().toISOString(),
            };

            // === スコアランキングの処理 ===
            const scoreRecords = [...scoreRankings, newRecord];
            scoreRecords.sort((a, b) => {
                if (b.score !== a.score) {
                    return b.score - a.score;
                }
                return a.time - b.time; // 同点の場合はタイムが短い方が上
            });

            const scoreRank = scoreRecords.findIndex((r) => r.id === id) + 1;
            const trimmedScoreRecords = scoreRecords.slice(
                0,
                HighScoreManager.MAX_RECORDS
            );
            const scoreSaved = trimmedScoreRecords.some((r) => r.id === id);

            if (scoreSaved) {
                localStorage.setItem(
                    HighScoreManager.STORAGE_KEY_SCORE,
                    JSON.stringify(trimmedScoreRecords)
                );
            }

            // === タイムランキングの処理 ===
            const timeRecords = [...timeRankings, newRecord];
            timeRecords.sort((a, b) => {
                if (a.time !== b.time) {
                    return a.time - b.time; // タイムが短い方が上
                }
                return b.score - a.score; // 同タイムの場合はスコアが高い方が上
            });

            const timeRank = timeRecords.findIndex((r) => r.id === id) + 1;
            const trimmedTimeRecords = timeRecords.slice(
                0,
                HighScoreManager.MAX_RECORDS
            );
            const timeSaved = trimmedTimeRecords.some((r) => r.id === id);

            if (timeSaved) {
                localStorage.setItem(
                    HighScoreManager.STORAGE_KEY_TIME,
                    JSON.stringify(trimmedTimeRecords)
                );
            }

            // ハイスコア更新・最速タイム更新の判定
            const isNewHighScore = score > previousHighScore;
            const isNewBestTime = time < previousBestTime;

            return {
                scoreRank: scoreSaved ? scoreRank : -1,
                timeRank: timeSaved ? timeRank : -1,
                isNewHighScore: isNewHighScore,
                isNewBestTime: isNewBestTime,
                scoreSaved: scoreSaved,
                timeSaved: timeSaved,
                // 後方互換性のため
                rank: scoreSaved ? scoreRank : -1,
                saved: scoreSaved || timeSaved,
            };
        } catch (e) {
            console.error("Failed to save high score:", e);
            return {
                scoreRank: -1,
                timeRank: -1,
                isNewHighScore: false,
                isNewBestTime: false,
                scoreSaved: false,
                timeSaved: false,
                rank: -1,
                saved: false,
            };
        }
    }

    /**
     * スコア順でソートしたハイスコアレコードを取得する
     * @returns {Array<{score: number, time: number, date: string}>} スコア順ハイスコアレコードの配列
     */
    static getHighScoresByScore() {
        return HighScoreManager.getScoreRankings();
    }

    /**
     * タイム順でソートしたハイスコアレコードを取得する
     * @returns {Array<{score: number, time: number, date: string}>} タイム順ハイスコアレコードの配列
     */
    static getHighScoresByTime() {
        return HighScoreManager.getTimeRankings();
    }

    /**
     * ハイスコアをクリアする（両方のランキングをクリア）
     */
    static clearHighScores() {
        try {
            localStorage.removeItem(HighScoreManager.STORAGE_KEY_SCORE);
            localStorage.removeItem(HighScoreManager.STORAGE_KEY_TIME);
            // 旧形式のデータもクリア
            localStorage.removeItem("soniclike_highscores");
        } catch (e) {
            console.error("Failed to clear high scores:", e);
        }
    }
}
