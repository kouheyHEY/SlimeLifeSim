import { GAME_CONST } from "../const/GameConst.js";
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
        this.initInventory();
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

    /** インベントリの総スロット数を返す */
    getTotalSlots() {
        return this.size;
    }

    /** 使用中のスロット数を返す */
    getUsedSlots() {
        return this.items.filter((item) => item.itemKey !== null).length;
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
                return;
            } else {
                console.log("アイテムのストック数が上限を超えています。");
            }
        }
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

    /**
     * アイテムを減らす
     * @param {string} itemKey - アイテムキー
     * @param {number} quantity - 減らす数
     * @return {boolean} - 成功したかどうか
     */
    removeItem(itemKey, quantity = 1) {
        const item = this.items.find((item) => item.itemKey === itemKey);
        if (item && item.stock >= quantity) {
            item.stock -= quantity;
            // ストックが0になったらスロットを空にする
            if (item.stock === 0) {
                item.itemKey = null;
                item.itemName = null;
            }
            return true;
        }
        return false;
    }

    /**
     * セーブ用のデータを取得
     * @returns {Object} セーブ用データ
     */
    getSaveData() {
        return {
            items: this.items.map((item) => ({ ...item })),
            size: this.size,
        };
    }

    /**
     * セーブデータから状態を復元
     * @param {Object} data - 復元するデータ
     */
    loadSaveData(data) {
        if (data.items) {
            this.items = data.items.map((item) => ({ ...item }));
        }
        if (data.size !== undefined) {
            this.size = data.size;
        }
    }
}
