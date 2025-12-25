import { GameInfoUI } from "./GameInfoUI.js";
import { InventoryUI } from "./InventoryUI.js";
import { UI_CONST } from "../const/UIConst.js";
import { COMMON_CONST } from "../const/CommonConst.js";

/**
 * 画面上部の統合UIバー
 * ゲーム情報とインベントリを含む
 */
export class TopBarUI {
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
        // トップバーのコンテナを作成
        this.topBarContainer = this.scene.add.container(0, 0);

        // 背景を作成
        this.background = this.scene.add
            .rectangle(
                0,
                0,
                COMMON_CONST.SCREEN_WIDTH,
                UI_CONST.TOP_BAR_HEIGHT,
                UI_CONST.TOP_BAR_COLOR,
                UI_CONST.TOP_BAR_ALPHA
            )
            .setOrigin(0, 0)
            .setStrokeStyle(
                UI_CONST.TOP_BAR_BORDER_WIDTH,
                UI_CONST.TOP_BAR_BORDER_COLOR
            );
        this.topBarContainer.add(this.background);
        
        // インベントリUIを作成（左側に配置）
        this.inventoryUI = new InventoryUI(
            this.scene,
            this.inventoryManager,
            UI_CONST.INVENTORY_X,
            UI_CONST.INVENTORY_Y
        );
        this.topBarContainer.add(this.inventoryUI.inventoryContainer);

        // ゲーム情報UIを作成（右側に配置）
        const gameInfoX = COMMON_CONST.SCREEN_WIDTH - UI_CONST.GAME_INFO_WIDTH - 20;
        this.gameInfoUI = new GameInfoUI(
            this.scene,
            this.gameTimeManager,
            gameInfoX,
            UI_CONST.GAME_INFO_Y
        );
        this.topBarContainer.add(this.gameInfoUI.infoContainer);
        
        // トップバー全体をメインカメラから除外（UIはカメラの移動に追従しない）
        this.scene.cameras.main.ignore(this.topBarContainer);
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
