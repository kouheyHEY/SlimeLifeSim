/**
 * インベントリの管理クラス
 */
export class InventoryManager {
    /**
     * コンストラクタ
     * @param {Phaser.Scene} scene シーン
     * @param {number} size インベントリのサイズ
     */
    constructor(scene, size) {
        this.scene = scene;
        this.items = [];
        this.size = size;
    }

    /** インベントリの初期化 */
    initInventory() {
        for (let i = 0; i < this.size; i++) {
            this.items.push({
                itemKey: null,
                itemName: null,
                stock: 0,
            });
        }
    }

    /** アイテムをインベントリに追加する */
    addItem(itemKey, itemName, quantity) {
        // 既に同じアイテムがあるか確認
        const existingItem = this.items.find(
            (item) => item.itemKey === itemKey
        );
        if (existingItem) {
            // すでにある場合はストック数をチェックして格納できるか確認
            if (
                existingItem.stock + quantity <=
                GAME_CONST.INVENTORY_ITEM_STOCK
            ) {
                existingItem.stock += quantity;
            } else {
                console.log("アイテムのストック数が上限を超えています。");
            }
        } else {
            // 空きスロットを探して追加
            const emptySlot = this.items.find((item) => item.itemKey === null);
            if (emptySlot) {
                emptySlot.itemKey = itemKey;
                emptySlot.itemName = itemName;
                emptySlot.stock = Math.min(
                    quantity,
                    GAME_CONST.INVENTORY_ITEM_STOCK
                );
            } else {
                console.log("インベントリがいっぱいです。");
            }
        }
    }
}
