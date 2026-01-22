import { getCurrentLanguage } from "../const/CommonConst.js";

/**
 * 手紙の管理クラス
 */
export class LetterManager {
    /**
     * コンストラクタ
     * @param {Phaser.Scene} scene シーン
     */
    constructor(scene) {
        this.scene = scene;
        // カテゴリごとの手紙進行状況
        // { categoryKey: { currentIndex: 0, readLetters: [] } }
        this.categories = {};
        // 次の釣りで手紙を釣るかどうか（チュートリアル終了後の交互パターン用）
        // falseで始めることで、最初は魚、次は手紙、という交互パターンになる
        this.shouldGetLetterNext = false;
    }

    /**
     * カテゴリを初期化
     * @param {string} categoryKey カテゴリキー
     */
    initCategory(categoryKey) {
        if (!this.categories[categoryKey]) {
            this.categories[categoryKey] = {
                currentIndex: 0,
                readLetters: [],
            };
        }
    }

    /**
     * 次の手紙のインデックスを取得
     * @param {string} categoryKey カテゴリキー
     * @returns {number} 次の手紙のインデックス
     */
    getNextLetterIndex(categoryKey = "story_planet") {
        this.initCategory(categoryKey);
        return this.categories[categoryKey].currentIndex;
    }

    /**
     * 手紙を読んだことを記録
     * @param {string} categoryKey カテゴリキー
     * @param {number} index 読んだ手紙のインデックス
     */
    markLetterAsRead(categoryKey, index) {
        console.log(
            `[LetterManager] markLetterAsRead called: categoryKey=${categoryKey}, index=${index}`,
        );
        this.initCategory(categoryKey);
        const category = this.categories[categoryKey];

        if (!category.readLetters.includes(index)) {
            category.readLetters.push(index);
            // 次の手紙のインデックスを進める
            category.currentIndex++;
            console.log(
                `[LetterManager] Letter marked as read. readLetters now:`,
                category.readLetters,
            );
        }
    }

    /**
     * 読んだ手紙の数を取得
     * @param {string} categoryKey カテゴリキー
     * @returns {number} 読んだ手紙の数
     */
    getReadLetterCount(categoryKey = "story_planet") {
        this.initCategory(categoryKey);
        return this.categories[categoryKey].readLetters.length;
    }

    /**
     * 読んだ手紙のリストを取得
     * @param {string} categoryKey カテゴリキー
     * @returns {number[]} 読んだ手紙のインデックスリスト
     */
    getReadLetters(categoryKey = "story_planet") {
        this.initCategory(categoryKey);
        return this.categories[categoryKey].readLetters;
    }

    /**
     * 手紙が1通でも読まれているか
     * @returns {boolean}
     */
    hasReadAnyLetter() {
        return Object.values(this.categories).some(
            (category) => category.readLetters.length > 0,
        );
    }

    /**
     * 全てのカテゴリを取得（読んだことがあるカテゴリのみ）
     * @returns {string[]} カテゴリキーのリスト
     */
    getAllCategories() {
        return Object.keys(this.categories).filter(
            (key) => this.categories[key].readLetters.length > 0,
        );
    }

    /**
     * 利用可能な全てのカテゴリを取得（読んだかどうかに関わらず）
     * @returns {string[]} カテゴリキーのリスト
     */
    getAvailableCategories() {
        return ["story_planet", "story_bear_and_rabbit"];
    }

    /**
     * カテゴリの表示名を取得
     * @param {string} categoryKey カテゴリキー
     * @returns {string} カテゴリの表示名
     */
    getCategoryDisplayName(categoryKey) {
        const currentLang = getCurrentLanguage() || "JP";
        const displayNames = {
            story_planet: {
                JP: "元住民からの手紙",
                EN: "Letters from a Former Resident",
            },
            story_bear_and_rabbit: {
                JP: "クマとウサギの物語",
                EN: "The Story of Bear and Rabbit",
            },
            // 将来的に追加されるカテゴリ
            // "story_ocean": { JP: "海底の物語", EN: "Tales from the Deep" },
            // "story_mountain": { JP: "山頂からの便り", EN: "Messages from the Summit" },
        };
        const categoryName = displayNames[categoryKey];
        if (categoryName && typeof categoryName === "object") {
            return categoryName[currentLang] || categoryName.JP;
        }
        return categoryKey;
    }

    /**
     * 指定したカテゴリに未読の手紙が残っているか
     * @param {string} categoryKey カテゴリキー
     * @param {Phaser.Scene} scene シーン（キャッシュにアクセスするため）
     * @returns {boolean} 未読の手紙があればtrue
     */
    hasUnreadLetters(categoryKey, scene) {
        this.initCategory(categoryKey);
        const category = this.categories[categoryKey];

        // JSONデータから総手紙数を取得
        const storyData = scene.cache.json.get(categoryKey);
        if (!storyData || !storyData.messages || !storyData.messages.JP) {
            return false;
        }

        const totalLetters = storyData.messages.JP.length;
        return category.currentIndex < totalLetters;
    }

    /**
     * いずれかのカテゴリに未読の手紙が残っているか
     * @param {Phaser.Scene} scene シーン
     * @returns {boolean} 未読の手紙があればtrue
     */
    hasAnyUnreadLetters(scene) {
        // すべてのカテゴリをチェック（story_planet, story_bear_and_rabbit など）
        const availableCategories = ["story_planet", "story_bear_and_rabbit"];
        return availableCategories.some((categoryKey) =>
            this.hasUnreadLetters(categoryKey, scene),
        );
    }

    /**
     * 未読があるカテゴリのリストを返す
     */
    getUnreadCategories(scene) {
        const availableCategories = ["story_planet", "story_bear_and_rabbit"];
        return availableCategories.filter((categoryKey) =>
            this.hasUnreadLetters(categoryKey, scene),
        );
    }

    /**
     * 次の釣りで手紙を釣るべきかどうかを取得（交互パターン用）
     * @returns {boolean} 次が手紙の番ならtrue
     */
    getShouldGetLetterNext() {
        return this.shouldGetLetterNext;
    }

    /**
     * 次の釣りで手紙を釣るかどうかを設定（交互パターン用）
     * @param {boolean} value 設定値
     */
    setShouldGetLetterNext(value) {
        this.shouldGetLetterNext = value;
    }

    /**
     * 交互パターンの状態を切り替え
     */
    toggleLetterPattern() {
        this.shouldGetLetterNext = !this.shouldGetLetterNext;
    }

    /**
     * セーブ用のデータを取得
     * @returns {Object} セーブ用データ
     */
    getSaveData() {
        return {
            categories: JSON.parse(JSON.stringify(this.categories)),
            shouldGetLetterNext: this.shouldGetLetterNext,
        };
    }

    /**
     * セーブデータから状態を復元
     * @param {Object} data - 復元するデータ
     */
    loadSaveData(data) {
        if (data.categories) {
            this.categories = JSON.parse(JSON.stringify(data.categories));
        }
        if (data.shouldGetLetterNext !== undefined) {
            this.shouldGetLetterNext = data.shouldGetLetterNext;
        }
    }
}
