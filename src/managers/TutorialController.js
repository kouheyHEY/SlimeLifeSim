import { TutorialManager } from "../TutorialManager.js";
import { Modal } from "../ui/Modal.js";

/**
 * チュートリアル制御クラス
 */
export class TutorialController {
    /**
     * コンストラクタ
     * @param {Phaser.Scene} scene シーンオブジェクト
     */
    constructor(scene) {
        this.scene = scene;
        this.boxTutorialShown = false;
        this.firstBoxX = null;
    }

    /**
     * ジャンプチュートリアル表示
     */
    showJumpTutorial() {
        // チュートリアルが既に完了している場合はスキップ
        if (
            TutorialManager.isTutorialCompleted(
                TutorialManager.TUTORIAL_TYPE.JUMP
            )
        ) {
            return;
        }

        // ジャンプチュートリアルのモーダルを表示
        const jumpTutorialModal = new Modal(this.scene, {
            title: "ジャンプ操作",
            message: "",
            width: 500,
            height: 550,
            image: {
                key: "tutorial_jump",
                frame: 0,
                scale: 1,
                y: -80,
            },
            keyLabel: "SPACE",
            buttons: [
                {
                    text: "スキップ",
                    callback: () => {
                        TutorialManager.skipAllTutorials();
                    },
                    style: {
                        backgroundColor: 0x666666,
                        hoverColor: 0x888888,
                    },
                },
                {
                    text: "OK",
                    callback: () => {
                        TutorialManager.markTutorialCompleted(
                            TutorialManager.TUTORIAL_TYPE.JUMP
                        );
                    },
                },
            ],
        });
        jumpTutorialModal.show();
    }

    /**
     * 木箱チュートリアル表示
     * @param {Function} onResume ゲーム再開時のコールバック
     */
    showBoxTutorial(onResume) {
        // 木箱チュートリアルが既に完了している場合はスキップ
        if (
            TutorialManager.isTutorialCompleted(
                TutorialManager.TUTORIAL_TYPE.BOX
            )
        ) {
            if (onResume) {
                onResume();
            }
            return;
        }

        // 木箱破壊チュートリアルのモーダルを表示
        const boxTutorialModal = new Modal(this.scene, {
            title: "木箱の破壊",
            message: "",
            width: 500,
            height: 550,
            image: {
                key: "tutorial_woodbox",
                frame: 0,
                scale: 1,
                y: -80,
            },
            keyLabel: {
                icon: "icon_power",
                iconScale: 0.8,
                text: " 1 ↓",
            },
            buttons: [
                {
                    text: "OK",
                    callback: () => {
                        TutorialManager.markTutorialCompleted(
                            TutorialManager.TUTORIAL_TYPE.BOX
                        );
                        if (onResume) {
                            onResume();
                        }
                    },
                },
            ],
        });
        boxTutorialModal.show();
        this.boxTutorialShown = true;
    }

    /**
     * 最初の木箱のX座標を記録
     * @param {number} x 木箱のX座標
     */
    recordFirstBoxX(x) {
        if (this.firstBoxX === null || x < this.firstBoxX) {
            this.firstBoxX = x;
        }
    }

    /**
     * 木箱チュートリアルをチェックして必要なら表示
     * @param {number} playerX プレイヤーのX座標
     * @param {number} threshold 表示距離の閾値
     * @param {Function} onShow チュートリアル表示時のコールバック
     */
    checkAndShowBoxTutorial(playerX, threshold, onShow) {
        if (!this.boxTutorialShown && this.firstBoxX !== null) {
            const distanceToFirstBox = this.firstBoxX - playerX;
            // 木箱の指定ピクセル手前に来たらチュートリアルを表示
            if (distanceToFirstBox <= threshold && distanceToFirstBox > 0) {
                if (onShow) {
                    onShow();
                }
            }
        }
    }

    /**
     * 木箱チュートリアルが表示済みか
     * @returns {boolean}
     */
    isBoxTutorialShown() {
        return this.boxTutorialShown;
    }

    /**
     * 最初の木箱のX座標を取得
     * @returns {number|null}
     */
    getFirstBoxX() {
        return this.firstBoxX;
    }
}
