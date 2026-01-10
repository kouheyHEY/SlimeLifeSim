import { GameInfoUI } from "./GameInfoUI.js";
import { InventoryUI } from "./InventoryUI.js";
import { UI_CONST, UI_TEXT } from "../const/UIConst.js";
import {
    COMMON_CONST,
    FONT_NAME,
    getLocalizedText,
} from "../const/CommonConst.js";

/**
 * 画面右側の統合サイドバー
 * ゲーム情報とインベントリを含む
 */
export class SidebarUI {
    /**
     * コンストラクタ
     * @param {Phaser.Scene} scene - 所属するシーン
     * @param {GameTimeManager} gameTimeManager - ゲーム時間マネージャー
     * @param {InventoryManager} inventoryManager - インベントリマネージャー
     */
    constructor(scene, gameTimeManager, inventoryManager) {
        this.scene = scene;
        this.gameTimeManager = gameTimeManager;
        this.inventoryManager = inventoryManager;
        this.createUI();
    }

    /**
     * UIの作成
     */
    createUI() {
        // サイドバーのX位置（画面右端）
        const sidebarX = COMMON_CONST.SCREEN_WIDTH - UI_CONST.SIDEBAR_WIDTH;

        // サイドバーのコンテナを作成
        this.sidebarContainer = this.scene.add.container(sidebarX, 0);

        // 背景を作成
        this.background = this.scene.add
            .rectangle(
                0,
                0,
                UI_CONST.SIDEBAR_WIDTH,
                COMMON_CONST.SCREEN_HEIGHT,
                UI_CONST.SIDEBAR_COLOR,
                UI_CONST.SIDEBAR_ALPHA
            )
            .setOrigin(0, 0)
            .setStrokeStyle(
                UI_CONST.SIDEBAR_BORDER_WIDTH,
                UI_CONST.SIDEBAR_BORDER_COLOR
            );
        this.sidebarContainer.add(this.background);

        // ゲーム情報UIを作成（中央に配置）
        const gameInfoX =
            (UI_CONST.SIDEBAR_WIDTH - UI_CONST.GAME_INFO_WIDTH) / 2;
        this.gameInfoUI = new GameInfoUI(
            this.scene,
            this.gameTimeManager,
            gameInfoX,
            UI_CONST.SIDEBAR_PADDING
        );
        this.sidebarContainer.add(this.gameInfoUI.infoContainer);

        // インベントリUIを作成（ゲーム情報の下に配置、中央に表示）
        const inventoryY =
            UI_CONST.SIDEBAR_PADDING +
            UI_CONST.GAME_INFO_HEIGHT +
            UI_CONST.SIDEBAR_PADDING;
        const inventoryWidth =
            UI_CONST.INVENTORY_COLUMNS * UI_CONST.INVENTORY_ITEM_FRAME_SIZE;
        const inventoryX = (UI_CONST.SIDEBAR_WIDTH - inventoryWidth) / 2;
        this.inventoryUI = new InventoryUI(
            this.scene,
            this.inventoryManager,
            this.gameTimeManager,
            this.gameInfoUI,
            inventoryX,
            inventoryY
        );
        this.sidebarContainer.add(this.inventoryUI.inventoryContainer);

        // 手紙ボタンを作成（インベントリの下に配置）
        const letterButtonY =
            inventoryY +
            UI_CONST.INVENTORY_ROWS * UI_CONST.INVENTORY_ITEM_FRAME_SIZE +
            20;
        this.createLetterButton(inventoryX, letterButtonY, inventoryWidth);

        // サイドバー全体をメインカメラから除外（UIはカメラの移動に追従しない）
        this.scene.cameras.main.ignore(this.sidebarContainer);
    }

    /**
     * 手紙ボタンを作成
     */
    createLetterButton(x, y, width) {
        this.letterButton = this.scene.add
            .rectangle(x, y, width, 50, 0x3366cc)
            .setOrigin(0, 0)
            .setStrokeStyle(2, 0xffffff)
            .setInteractive({ useHandCursor: true })
            .setVisible(false); // 初期状態では非表示

        // ボトルのアイコンを追加
        this.letterButtonIcon = this.scene.add
            .image(x + 25, y + 25, "bottle_letter")
            .setOrigin(0.5, 0.5)
            .setScale(0.3)
            .setVisible(false);

        this.letterButtonText = this.scene.add
            .text(
                x + 45,
                y + 25,
                getLocalizedText(UI_TEXT.LETTER.READ_BUTTON),
                {
                    fontFamily: FONT_NAME.MELONANO,
                    fontSize: "20px",
                    color: "#FFFFFF",
                    align: "left",
                }
            )
            .setOrigin(0, 0.5)
            .setVisible(false);

        this.sidebarContainer.add(this.letterButton);
        this.sidebarContainer.add(this.letterButtonIcon);
        this.sidebarContainer.add(this.letterButtonText);

        this.letterButton.on("pointerdown", () => {
            // ゲーム時間を一時停止（手紙を読んでいる間は時間が進まない）
            this.scene.gameTimeManager.pause();
            // 魚ヒットシステムを一時停止（手紙を読んでいる間は釣りが発生しないように）
            this.scene.gameTimeManager.pauseFishSystem();
            // 手紙リストモーダルを表示
            this.scene.scene.launch("LetterList");
            this.scene.scene.pause("Game");
        });
    }

    /**
     * 手紙ボタンの表示/非表示を更新
     */
    updateLetterButton() {
        const letterManager = this.scene.letterManager;
        if (letterManager && letterManager.hasReadAnyLetter()) {
            this.letterButton.setVisible(true);
            this.letterButtonIcon.setVisible(true);
            this.letterButtonText.setVisible(true);
        } else {
            this.letterButton.setVisible(false);
            this.letterButtonIcon.setVisible(false);
            this.letterButtonText.setVisible(false);
        }
    }

    /**
     * UIの更新
     */
    update() {
        // ゲーム情報UIを更新
        this.gameInfoUI.update();

        // インベントリUIは必要に応じて更新
        // (現在の実装では明示的な呼び出しが必要な場合のみ)
    }

    /**
     * インベントリUIを更新（アイテム追加時など）
     */
    updateInventory() {
        this.inventoryUI.update();
    }
}
