import { InventoryManager } from "../managers/InventoryManager.js";
import { UI_CONST } from "../const/UIConst.js";
import { FONT_NAME } from "../const/CommonConst.js";
/**
 * インベントリのUI
 */
export class InventoryUI {
    /**
     * コンストラクタ
     * @param {Phaser.Scene} scene - 所属するシーン
     * @param {InventoryManager} inventoryManager - インベントリマネージャー
     * @param {number} x - X座標（親コンテナ内での相対位置）
     * @param {number} y - Y座標（親コンテナ内での相対位置）
     */
    constructor(scene, inventoryManager, x = UI_CONST.INVENTORY_X, y = UI_CONST.INVENTORY_Y) {
        this.scene = scene;
        this.inventoryManager = inventoryManager;
        this.inventoryFrameGroup = this.scene.add.group();
        this.x = x;
        this.y = y;
        this.createUI();
    }

    /**
     * UIの作成
     */
    createUI() {
        // コンテナを作成（親コンテナ内での相対位置）
        this.inventoryContainer = this.scene.add.container(
            this.x,
            this.y
        );

        for (let r = 0; r < UI_CONST.INVENTORY_ROWS; r++) {
            for (let c = 0; c < UI_CONST.INVENTORY_COLUMNS; c++) {
                const index = r * UI_CONST.INVENTORY_COLUMNS + c;
                const x =
                    c *
                    (UI_CONST.INVENTORY_ITEM_FRAME_SIZE +
                        UI_CONST.INVENTORY_ITEM_PADDING);
                const y =
                    r *
                    (UI_CONST.INVENTORY_ITEM_FRAME_SIZE +
                        UI_CONST.INVENTORY_ITEM_PADDING);
                const frame = this.scene.add
                    .rectangle(
                        x,
                        y,
                        UI_CONST.INVENTORY_ITEM_FRAME_SIZE,
                        UI_CONST.INVENTORY_ITEM_FRAME_SIZE,
                        UI_CONST.INVENTORY_COLOR
                    )
                    .setOrigin(0, 0)
                    .setStrokeStyle(
                        UI_CONST.INVENTORY_BORDER_WIDTH,
                        UI_CONST.INVENTORY_BORDER_COLOR
                    );
                this.inventoryContainer.add(frame);
                this.inventoryFrameGroup.add(frame);
                // メインカメラから除外
                this.scene.cameras.main.ignore(frame);
            }
        }
    }

    /**
     * インベントリの更新
     */
    update() {
        // インベントリの内容に応じてUIを更新する処理をここに追加
        for (let i = 0; i < this.inventoryManager.size; i++) {
            const item = this.inventoryManager.items[i];
            // アイテムの表示更新ロジック
            if (item.itemKey) {
                // アイテムが存在する場合、アイテムのスプライトや数量を表示
                const frame = this.inventoryFrameGroup.getChildren()[i];
                const sprite = this.scene.add
                    .sprite(
                        frame.x + UI_CONST.INVENTORY_ITEM_FRAME_SIZE / 2,
                        frame.y + UI_CONST.INVENTORY_ITEM_FRAME_SIZE / 2,
                        item.itemKey
                    )
                    .setOrigin(0.5, 0.5);
                sprite.setScale(
                    UI_CONST.INVENTORY_ITEM_DISPLAY_SIZE / sprite.width
                );
                this.scene.cameras.main.ignore(sprite);
                this.inventoryContainer.add(sprite);
                // 数量表示
                const quantityText = this.scene.add
                    .text(
                        frame.x + UI_CONST.INVENTORY_ITEM_FRAME_SIZE - 10,
                        frame.y + UI_CONST.INVENTORY_ITEM_FRAME_SIZE - 10,
                        item.stock,
                        {
                            fontSize: `${UI_CONST.INVENTORY_QUANTITY_FONT_SIZE}px`,
                            color: UI_CONST.INVENTORY_FONT_COLOR,
                            fontFamily: FONT_NAME.MELONANO,
                        }
                    )
                    .setOrigin(1, 1);
                this.scene.cameras.main.ignore(quantityText);
                this.inventoryContainer.add(quantityText);
            }
        }
    }
}
