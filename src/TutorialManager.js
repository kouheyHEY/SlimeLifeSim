/**
 * チュートリアル管理クラス
 * ローカルストレージを使用してチュートリアルの完了状態を管理
 */
export class TutorialManager {
    /** ローカルストレージのキープレフィックス */
    static STORAGE_KEY_PREFIX = "soniclike_tutorial_";

    /** チュートリアルタイプの定数 */
    static TUTORIAL_TYPE = {
        JUMP: "jump",
        BOX: "box",
    };

    /**
     * 特定のチュートリアルが完了済みかどうかを取得
     * @param {string} tutorialType チュートリアルタイプ
     * @returns {boolean} 完了済みの場合true
     */
    static isTutorialCompleted(tutorialType) {
        try {
            const key = TutorialManager.STORAGE_KEY_PREFIX + tutorialType;
            const value = localStorage.getItem(key);
            return value === "true";
        } catch (error) {
            console.error(
                `Failed to read tutorial status for ${tutorialType} from localStorage:`,
                error
            );
            return false;
        }
    }

    /**
     * 特定のチュートリアルを完了済みとしてマーク
     * @param {string} tutorialType チュートリアルタイプ
     */
    static markTutorialCompleted(tutorialType) {
        try {
            const key = TutorialManager.STORAGE_KEY_PREFIX + tutorialType;
            localStorage.setItem(key, "true");
        } catch (error) {
            console.error(
                `Failed to save tutorial status for ${tutorialType} to localStorage:`,
                error
            );
        }
    }

    /**
     * 特定のチュートリアルの完了状態をリセット（開発用）
     * @param {string} tutorialType チュートリアルタイプ（省略時は全てリセット）
     */
    static resetTutorial(tutorialType = null) {
        try {
            if (tutorialType) {
                const key = TutorialManager.STORAGE_KEY_PREFIX + tutorialType;
                localStorage.removeItem(key);
            } else {
                // 全てのチュートリアルをリセット
                Object.values(TutorialManager.TUTORIAL_TYPE).forEach((type) => {
                    const key = TutorialManager.STORAGE_KEY_PREFIX + type;
                    localStorage.removeItem(key);
                });
            }
        } catch (error) {
            console.error("Failed to reset tutorial status:", error);
        }
    }

    /**
     * 特定のチュートリアルをスキップして完了としてマーク
     * @param {string} tutorialType チュートリアルタイプ
     */
    static skipTutorial(tutorialType) {
        TutorialManager.markTutorialCompleted(tutorialType);
    }

    /**
     * 全てのチュートリアルをスキップして完了としてマーク
     */
    static skipAllTutorials() {
        Object.values(TutorialManager.TUTORIAL_TYPE).forEach((type) => {
            TutorialManager.markTutorialCompleted(type);
        });
    }
}
