import { Modal } from "../../core/ui/Modal.js";
import { GAME_CONST } from "../const/GameConst.js";
import { getCurrentLanguage } from "../const/CommonConst.js";

/**
 * チュートリアルマネージャー
 * チュートリアルの進行状態を管理し、適切なタイミングでチュートリアルモーダルを表示する
 */
export class TutorialManager {
    /**
     * コンストラクタ
     * @param {Phaser.Scene} scene - 所属するシーン
     */
    constructor(scene) {
        this.scene = scene;
        // チュートリアルの進行状態
        this.tutorialStep = 0;
        // チュートリアル完了フラグ
        this.tutorialCompleted = false;
        // 現在のモーダル
        this.currentModal = null;
        // ハイライト用のグラフィックス
        this.highlightGraphics = null;
        // ハイライトターゲット
        this.highlightTarget = null;
    }

    /**
     * チュートリアルを開始
     */
    startTutorial() {
        // ローカルストレージから完了状態を確認
        const tutorialCompleted = localStorage.getItem("tutorialCompleted");
        if (tutorialCompleted === "true") {
            this.tutorialCompleted = true;
            this.tutorialStep = 5;
            return;
        }

        // ステップ1: ゲーム開始直後に魚をヒットさせる
        this.showStep1FishHit();
    }

    /**
     * ステップ1: 魚がヒットしました
     */
    showStep1FishHit() {
        this.tutorialStep = 1;
        
        // 魚ヒットを強制的にトリガー
        if (this.scene.gameTimeManager) {
            this.scene.gameTimeManager.forceFishHit();
        }

        // モーダルを表示
        const message = getCurrentLanguage() === "JP"
            ? "魚がヒットしました！\n早速釣り上げてみましょう！\n\n画面をタップして釣りを開始してください。"
            : "A fish hit!\nLet's catch it!\n\nTap the screen to start fishing.";

        this.currentModal = new Modal(this.scene, {
            title: getCurrentLanguage() === "JP" ? "チュートリアル" : "Tutorial",
            message: message,
            image: {
                key: "rod",
                scale: 0.5,
                y: -50,
            },
            buttons: [
                {
                    text: "OK",
                    callback: () => {
                        this.currentModal = null;
                    },
                },
            ],
            width: 700,
            height: 500,
        });
        this.currentModal.show();
    }

    /**
     * ステップ2: 釣り上げた魚をクリックさせる
     */
    showStep2ClickFish() {
        if (this.tutorialStep !== 1) return;
        this.tutorialStep = 2;

        // インベントリの最初のアイテムをハイライト
        this.highlightInventoryItem(0);

        const message = getCurrentLanguage() === "JP"
            ? "釣りに成功しました！\n\nインベントリに魚が追加されました。\n魚をクリックして詳細を見てみましょう。"
            : "Fishing successful!\n\nThe fish was added to your inventory.\nClick on the fish to see details.";

        this.currentModal = new Modal(this.scene, {
            title: getCurrentLanguage() === "JP" ? "チュートリアル" : "Tutorial",
            message: message,
            buttons: [
                {
                    text: "OK",
                    callback: () => {
                        this.currentModal = null;
                    },
                },
            ],
            width: 700,
            height: 400,
        });
        this.currentModal.show();
    }

    /**
     * ステップ3: 魚を食べる
     */
    showStep3EatFish() {
        if (this.tutorialStep !== 2) return;
        this.tutorialStep = 3;

        // ハイライトをクリア
        this.clearHighlight();

        const message = getCurrentLanguage() === "JP"
            ? "魚は食べることも、売ることもできます。\n\nまずは「食べる」を選んで、\n魚を食べてみましょう！"
            : "You can eat or sell the fish.\n\nFirst, select 'Eat' to\ntry eating the fish!";

        this.currentModal = new Modal(this.scene, {
            title: getCurrentLanguage() === "JP" ? "チュートリアル" : "Tutorial",
            message: message,
            buttons: [
                {
                    text: "OK",
                    callback: () => {
                        this.currentModal = null;
                    },
                },
            ],
            width: 700,
            height: 400,
        });
        this.currentModal.show();
    }

    /**
     * ステップ4: ステータスの説明
     */
    showStep4StatusExplanation() {
        if (this.tutorialStep !== 3) return;
        this.tutorialStep = 4;

        // ステータス表示をハイライト
        this.highlightStatus();

        const message = getCurrentLanguage() === "JP"
            ? "魚を食べるとステータスが良くなります！\n\nステータスは朝の終了時と夕方の終了時に\n下がります。\n\nステータスが最低まで下がると\nゲームオーバーになるので、\n定期的に魚を食べましょう！"
            : "Eating fish improves your status!\n\nYour status decreases at the end of\nmorning and evening.\n\nIf your status drops to the lowest level,\nit's game over, so eat fish regularly!";

        this.currentModal = new Modal(this.scene, {
            title: getCurrentLanguage() === "JP" ? "チュートリアル" : "Tutorial",
            message: message,
            buttons: [
                {
                    text: "OK",
                    callback: () => {
                        this.completeTutorial();
                    },
                },
            ],
            width: 700,
            height: 500,
        });
        this.currentModal.show();
    }

    /**
     * チュートリアル完了
     */
    completeTutorial() {
        this.tutorialStep = 5;
        this.tutorialCompleted = true;
        this.currentModal = null;
        
        // ハイライトをクリア
        this.clearHighlight();

        // ローカルストレージに保存
        localStorage.setItem("tutorialCompleted", "true");
    }

    /**
     * インベントリアイテムをハイライト
     * @param {number} index - ハイライトするアイテムのインデックス
     */
    highlightInventoryItem(index) {
        // 既存のハイライトをクリア
        this.clearHighlight();

        // インベントリUIの位置を取得
        const inventoryUI = this.scene.sidebarUI?.inventoryUI;
        if (!inventoryUI) return;

        const frame = inventoryUI.inventoryFrameGroup.getChildren()[index];
        if (!frame) return;

        // ハイライト用のグラフィックスを作成
        this.highlightGraphics = this.scene.add.graphics();
        this.highlightGraphics.setDepth(999);
        
        // メインカメラから除外（UIカメラで表示）
        this.scene.cameras.main.ignore(this.highlightGraphics);

        // ハイライト対象を保存
        this.highlightTarget = { frame, index };

        // 点滅アニメーション
        this.scene.time.addEvent({
            delay: 500,
            callback: () => {
                if (this.highlightGraphics && this.tutorialStep === 2) {
                    this.updateHighlight();
                }
            },
            loop: true,
        });

        this.updateHighlight();
    }

    /**
     * ハイライトを更新
     */
    updateHighlight() {
        if (!this.highlightGraphics || !this.highlightTarget) return;

        const { frame } = this.highlightTarget;
        const inventoryUI = this.scene.sidebarUI?.inventoryUI;
        if (!inventoryUI) return;

        // UIカメラの座標系でハイライトを描画
        const sidebarX = this.scene.sidebarUI.x;
        const sidebarY = this.scene.sidebarUI.y;
        const inventoryX = inventoryUI.x;
        const inventoryY = inventoryUI.y;

        const x = sidebarX + inventoryX + frame.x;
        const y = sidebarY + inventoryY + frame.y;

        this.highlightGraphics.clear();
        this.highlightGraphics.lineStyle(4, 0xffff00, 1);
        this.highlightGraphics.strokeRect(
            x - 2,
            y - 2,
            frame.width + 4,
            frame.height + 4
        );
    }

    /**
     * ステータス表示をハイライト
     */
    highlightStatus() {
        // 既存のハイライトをクリア
        this.clearHighlight();

        const topBarUI = this.scene.topBarUI;
        if (!topBarUI) return;

        // ステータス表示の位置を取得
        const statusSprite = topBarUI.statusSprite;
        if (!statusSprite) return;

        // ハイライト用のグラフィックスを作成
        this.highlightGraphics = this.scene.add.graphics();
        this.highlightGraphics.setDepth(999);
        
        // メインカメラから除外
        this.scene.cameras.main.ignore(this.highlightGraphics);

        // ハイライト対象を保存
        this.highlightTarget = { statusSprite, topBarUI };

        // 点滅アニメーション
        this.scene.time.addEvent({
            delay: 500,
            callback: () => {
                if (this.highlightGraphics && this.tutorialStep === 4) {
                    this.updateStatusHighlight();
                }
            },
            loop: true,
        });

        this.updateStatusHighlight();
    }

    /**
     * ステータスハイライトを更新
     */
    updateStatusHighlight() {
        if (!this.highlightGraphics || !this.highlightTarget) return;

        const { statusSprite, topBarUI } = this.highlightTarget;
        if (!statusSprite || !topBarUI) return;

        // UIカメラの座標系でハイライトを描画
        const topBarX = topBarUI.x;
        const topBarY = topBarUI.y;

        const x = topBarX + statusSprite.x;
        const y = topBarY + statusSprite.y;

        const size = statusSprite.displayWidth;

        this.highlightGraphics.clear();
        this.highlightGraphics.lineStyle(4, 0xffff00, 1);
        this.highlightGraphics.strokeRect(
            x - size / 2 - 4,
            y - size / 2 - 4,
            size + 8,
            size + 8
        );
    }

    /**
     * ハイライトをクリア
     */
    clearHighlight() {
        if (this.highlightGraphics) {
            this.highlightGraphics.destroy();
            this.highlightGraphics = null;
        }
        this.highlightTarget = null;
    }

    /**
     * チュートリアルが完了しているかチェック
     * @returns {boolean}
     */
    isTutorialCompleted() {
        return this.tutorialCompleted;
    }

    /**
     * 現在のチュートリアルステップを取得
     * @returns {number}
     */
    getCurrentStep() {
        return this.tutorialStep;
    }
}
