import { FONT_NAME } from "../const/CommonConst.js";

/**
 * ボタンUIのユーティリティ関数
 */

/**
 * デフォルトのボタンスタイル
 */
export const DEFAULT_BUTTON_STYLE = {
    fontFamily: FONT_NAME.CHECKPOINT,
    fontSize: 28,
    color: "#ffffff",
    stroke: "#000000",
    strokeThickness: 6,
    align: "center",
    backgroundColor: "#333333",
    padding: { x: 20, y: 10 },
};

/**
 * ボタンにホバー効果とクリック処理を追加
 * @param {Phaser.GameObjects.Text} button ボタンオブジェクト
 * @param {Function} onClick クリック時のコールバック
 */
export function addButtonEffects(button, onClick) {
    // ホバー効果
    button.on("pointerover", () => {
        button.setStyle({ color: "#ffff00" });
    });
    button.on("pointerout", () => {
        button.setStyle({ color: "#ffffff" });
    });
    // クリック処理
    button.on("pointerdown", onClick);
}
