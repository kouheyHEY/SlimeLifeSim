import { InventoryManager } from "../managers/InventoryManager.js";
import { UI_CONST, UI_TEXT } from "../const/UIConst.js";
import { FONT_NAME, getLocalizedText } from "../const/CommonConst.js";
import { GAME_CONST } from "../const/GameConst.js";
/**
 * インベントリのUI
 */
export class InventoryUI {
    /**
     * コンストラクタ
     * @param {Phaser.Scene} scene - 所属するシーン
     * @param {InventoryManager} inventoryManager - インベントリマネージャー
     * @param {GameTimeManager} gameTimeManager - ゲーム時間マネージャー
     * @param {GameInfoUI} gameInfoUI - ゲーム情報UI
     * @param {number} x - X座標（親コンテナ内での相対位置）
     * @param {number} y - Y座標（親コンテナ内での相対位置）
     */
    constructor(
        scene,
        inventoryManager,
        gameTimeManager,
        gameInfoUI,
        x = UI_CONST.INVENTORY_X,
        y = UI_CONST.INVENTORY_Y
    ) {
        this.scene = scene;
        this.inventoryManager = inventoryManager;
        this.gameTimeManager = gameTimeManager;
        this.gameInfoUI = gameInfoUI;
        this.inventoryFrameGroup = this.scene.add.group();
        this.x = x;
        this.y = y;
        this.itemSprites = []; // アイテムスプライトの配列
        this.quantityTexts = []; // 数量テキストの配列
        this.itemDetailModal = null; // アイテム詳細モーダル
        this.createUI();
    }

    /**
     * UIの作成
     */
    createUI() {
        // コンテナを作成（親コンテナ内での相対位置）
        this.inventoryContainer = this.scene.add.container(this.x, this.y);

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
        // 既存のアイテムスプライトと数量テキストをクリア
        this.itemSprites.forEach((sprite) => {
            if (sprite) {
                sprite.destroy();
            }
        });
        this.quantityTexts.forEach((text) => {
            if (text) {
                text.destroy();
            }
        });
        this.itemSprites = [];
        this.quantityTexts = [];

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
                    .setOrigin(0.5, 0.5)
                    .setInteractive({ useHandCursor: true });
                sprite.setScale(
                    UI_CONST.INVENTORY_ITEM_DISPLAY_SIZE / sprite.width
                );
                this.scene.cameras.main.ignore(sprite);
                this.inventoryContainer.add(sprite);
                this.itemSprites.push(sprite);

                // クリック時にアイテム詳細を表示
                sprite.on("pointerdown", () => {
                    this.showItemDetail(item);
                });
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
                this.quantityTexts.push(quantityText);
            } else {
                // 空のスロットにはnullを追加してインデックスを保持
                this.itemSprites.push(null);
                this.quantityTexts.push(null);
            }
        }
    }

    /**
     * アイテム詳細モーダルを表示
     * @param {Object} item - アイテム情報
     */
    showItemDetail(item) {
        // ゲーム時間を一時停止
        if (this.gameTimeManager) {
            this.gameTimeManager.pause();
            this.gameTimeManager.pauseFishSystem();
        }

        // 既存のモーダルがあれば削除
        if (this.itemDetailModal) {
            this.itemDetailModal.destroy();
        }

        // チュートリアルステップ3をトリガー
        if (this.scene.tutorialManager && this.scene.tutorialManager.getCurrentStep() === 2) {
            this.scene.time.delayedCall(300, () => {
                this.scene.tutorialManager.showStep3EatFish();
            });
        }

        // モーダル用のコンテナを作成（画面中央）
        const centerX = this.scene.cameras.main.width / 2;
        const centerY = this.scene.cameras.main.height / 2;
        this.itemDetailModal = this.scene.add.container(centerX, centerY);

        // 背景
        const bg = this.scene.add
            .rectangle(
                0,
                0,
                UI_CONST.ITEM_DETAIL_WIDTH,
                UI_CONST.ITEM_DETAIL_HEIGHT,
                UI_CONST.ITEM_DETAIL_BG_COLOR
            )
            .setStrokeStyle(
                UI_CONST.ITEM_DETAIL_BORDER_WIDTH,
                UI_CONST.ITEM_DETAIL_BORDER_COLOR
            );
        this.itemDetailModal.add(bg);

        // アイテムテクスチャ
        const itemSprite = this.scene.add
            .sprite(0, -200, item.itemKey)
            .setOrigin(0.5, 0.5);
        const scale = UI_CONST.ITEM_DETAIL_TEXTURE_SIZE / itemSprite.width;
        itemSprite.setScale(scale);
        this.itemDetailModal.add(itemSprite);

        // アイテム名
        const itemName =
            GAME_CONST.FISH_DISPLAY_NAME[item.itemKey] || item.itemKey;
        const displayName = getLocalizedText(itemName);
        const nameText = this.scene.add
            .text(0, -100, displayName, {
                fontFamily: FONT_NAME.MELONANO,
                fontSize: `${UI_CONST.ITEM_DETAIL_FONT_SIZE}px`,
                color: "#FFFFFF",
                align: "center",
            })
            .setOrigin(0.5, 0.5);
        this.itemDetailModal.add(nameText);

        // 数量
        const quantityText = this.scene.add
            .text(
                0,
                -50,
                `${getLocalizedText(UI_TEXT.ITEM_DETAIL.QUANTITY)}${
                    item.stock
                }`,
                {
                    fontFamily: FONT_NAME.MELONANO,
                    fontSize: `${UI_CONST.ITEM_DETAIL_FONT_SIZE}px`,
                    color: "#FFFF00",
                    align: "center",
                }
            )
            .setOrigin(0.5, 0.5);
        this.itemDetailModal.add(quantityText);

        // 説明
        const description =
            GAME_CONST.ITEM_DESCRIPTION[item.itemKey] ||
            UI_TEXT.ITEM_DETAIL.NO_DESCRIPTION;
        const displayDesc = getLocalizedText(description);
        const descText = this.scene.add
            .text(0, 20, displayDesc, {
                fontFamily: FONT_NAME.MELONANO,
                fontSize: `${UI_CONST.ITEM_DETAIL_DESC_FONT_SIZE}px`,
                color: "#CCCCCC",
                align: "center",
                lineSpacing: 5,
            })
            .setOrigin(0.5, 0.5);
        this.itemDetailModal.add(descText);

        // 価値
        const value = GAME_CONST.ITEM_VALUE[item.itemKey] || 0;
        const valueText = this.scene.add
            .text(
                0,
                100,
                `${getLocalizedText(
                    UI_TEXT.ITEM_DETAIL.VALUE
                )}${value}${getLocalizedText(UI_TEXT.ITEM_DETAIL.COIN)}`,
                {
                    fontFamily: FONT_NAME.MELONANO,
                    fontSize: `${UI_CONST.ITEM_DETAIL_FONT_SIZE}px`,
                    color: "#FFD700",
                    align: "center",
                }
            )
            .setOrigin(0.5, 0.5);
        this.itemDetailModal.add(valueText);

        // ボタンのY座標
        const buttonY = 200;

        // 食べるボタン
        const eatButton = this.scene.add
            .rectangle(
                -130,
                buttonY,
                UI_CONST.ITEM_DETAIL_BUTTON_WIDTH,
                UI_CONST.ITEM_DETAIL_BUTTON_HEIGHT,
                0x44aa44
            )
            .setStrokeStyle(2, 0xffffff)
            .setInteractive({ useHandCursor: true });
        this.itemDetailModal.add(eatButton);

        const eatText = this.scene.add
            .text(
                -130,
                buttonY,
                getLocalizedText(UI_TEXT.ITEM_DETAIL.EAT_BUTTON),
                {
                    fontFamily: FONT_NAME.MELONANO,
                    fontSize: "20px",
                    color: "#FFFFFF",
                    align: "center",
                    stroke: "#000000",
                    strokeThickness: 2,
                }
            )
            .setOrigin(0.5, 0.5);
        this.itemDetailModal.add(eatText);

        eatButton.on("pointerdown", () => {
            // 魚を食べる処理
            if (this.inventoryManager.removeItem(item.itemKey, 1)) {
                console.log("食べる:", item.itemKey);
                // ステータスを1段階向上
                if (this.gameInfoUI) {
                    this.gameInfoUI.improvePlayerStatus();
                }
                // インベントリを更新
                this.update();
                
                // チュートリアルステップ4をトリガー
                if (this.scene.tutorialManager && this.scene.tutorialManager.getCurrentStep() === 3) {
                    this.scene.time.delayedCall(500, () => {
                        this.scene.tutorialManager.showStep4StatusExplanation();
                    });
                }
            }
            this.closeItemDetail();
        });

        // 売るボタン
        const sellButton = this.scene.add
            .rectangle(
                0,
                buttonY,
                UI_CONST.ITEM_DETAIL_BUTTON_WIDTH,
                UI_CONST.ITEM_DETAIL_BUTTON_HEIGHT,
                0xaa8844
            )
            .setStrokeStyle(2, 0xffffff)
            .setInteractive({ useHandCursor: true });
        this.itemDetailModal.add(sellButton);

        const sellText = this.scene.add
            .text(
                0,
                buttonY,
                getLocalizedText(UI_TEXT.ITEM_DETAIL.SELL_BUTTON),
                {
                    fontFamily: FONT_NAME.MELONANO,
                    fontSize: "20px",
                    color: "#FFFFFF",
                    align: "center",
                    stroke: "#000000",
                    strokeThickness: 2,
                }
            )
            .setOrigin(0.5, 0.5);
        this.itemDetailModal.add(sellText);

        sellButton.on("pointerdown", () => {
            // 魚を売る処理
            if (this.inventoryManager.removeItem(item.itemKey, 1)) {
                console.log("売る:", item.itemKey, value);
                // コインを追加
                if (this.gameInfoUI) {
                    this.gameInfoUI.addCoins(value);
                }
                // インベントリを更新
                this.update();
            }
            this.closeItemDetail();
        });

        // 閉じるボタン（×）
        const closeButton = this.scene.add
            .rectangle(
                130,
                buttonY,
                UI_CONST.ITEM_DETAIL_BUTTON_WIDTH,
                UI_CONST.ITEM_DETAIL_BUTTON_HEIGHT,
                0xaa4444
            )
            .setStrokeStyle(2, 0xffffff)
            .setInteractive({ useHandCursor: true });
        this.itemDetailModal.add(closeButton);

        const closeText = this.scene.add
            .text(
                130,
                buttonY,
                getLocalizedText(UI_TEXT.ITEM_DETAIL.CLOSE_BUTTON),
                {
                    fontFamily: FONT_NAME.MELONANO,
                    fontSize: "32px",
                    color: "#FFFFFF",
                    align: "center",
                    stroke: "#000000",
                    strokeThickness: 2,
                }
            )
            .setOrigin(0.5, 0.5);
        this.itemDetailModal.add(closeText);

        closeButton.on("pointerdown", () => {
            this.closeItemDetail();
        });

        // メインカメラから除外
        this.itemDetailModal.each((child) => {
            this.scene.cameras.main.ignore(child);
        });
    }

    /**
     * アイテム詳細モーダルを閉じる
     */
    closeItemDetail() {
        if (this.itemDetailModal) {
            this.itemDetailModal.destroy();
            this.itemDetailModal = null;
        }

        // ゲーム時間を再開
        if (this.gameTimeManager) {
            this.gameTimeManager.resume();
            this.gameTimeManager.resumeFishSystem();
        }
    }

    /**
     * 魚選択モーダルを表示（ステータス低下時に使用）
     * @param {Function} onSelectCallback - 魚が選ばれたときのコールバック
     */
    showFishSelectionModal(onSelectCallback) {
        // ゲーム時間を一時停止
        if (this.gameTimeManager) {
            this.gameTimeManager.pause();
            this.gameTimeManager.pauseFishSystem();
        }

        // 既存のモーダルがあれば削除
        if (this.fishSelectionModal) {
            this.fishSelectionModal.destroy();
        }

        // モーダル用のコンテナを作成（画面中央）
        const centerX = this.scene.cameras.main.width / 2;
        const centerY = this.scene.cameras.main.height / 2;
        this.fishSelectionModal = this.scene.add.container(centerX, centerY);

        // 背景
        const bg = this.scene.add
            .rectangle(
                0,
                0,
                UI_CONST.ITEM_DETAIL_WIDTH,
                UI_CONST.ITEM_DETAIL_HEIGHT,
                UI_CONST.ITEM_DETAIL_BG_COLOR
            )
            .setStrokeStyle(
                UI_CONST.ITEM_DETAIL_BORDER_WIDTH,
                UI_CONST.ITEM_DETAIL_BORDER_COLOR
            );
        this.fishSelectionModal.add(bg);

        // タイトル
        const titleText = this.scene.add
            .text(0, -220, "体力が低下しています\n魚を食べて回復してください", {
                fontFamily: FONT_NAME.MELONANO,
                fontSize: `20px`,
                color: "#FF6666",
                align: "center",
            })
            .setOrigin(0.5, 0.5);
        this.fishSelectionModal.add(titleText);

        // 魚のリストを取得
        const fishItems = this.inventoryManager.items.filter(
            (item) => item.itemKey && item.itemKey.startsWith("fish_")
        );

        // 魚アイテムを表示
        const startY = -140;
        const itemHeight = 80;
        fishItems.forEach((item, index) => {
            const y = startY + index * itemHeight;

            // アイテム背景
            const itemBg = this.scene.add
                .rectangle(0, y, 400, 70, 0x334455)
                .setStrokeStyle(2, 0xffffff)
                .setInteractive({ useHandCursor: true });
            this.fishSelectionModal.add(itemBg);

            // アイテム画像
            const sprite = this.scene.add
                .sprite(-150, y, item.itemKey)
                .setOrigin(0.5, 0.5);
            sprite.setScale(50 / sprite.width);
            this.fishSelectionModal.add(sprite);

            // アイテム名
            const itemName =
                GAME_CONST.FISH_DISPLAY_NAME[item.itemKey] || item.itemKey;
            const nameText = this.scene.add
                .text(-50, y, itemName.split("\n")[0], {
                    fontFamily: FONT_NAME.MELONANO,
                    fontSize: "18px",
                    color: "#FFFFFF",
                })
                .setOrigin(0, 0.5);
            this.fishSelectionModal.add(nameText);

            // 数量
            const quantityText = this.scene.add
                .text(150, y, `x${item.stock}`, {
                    fontFamily: FONT_NAME.MELONANO,
                    fontSize: "18px",
                    color: "#FFFF00",
                })
                .setOrigin(0.5, 0.5);
            this.fishSelectionModal.add(quantityText);

            // クリック時の処理
            itemBg.on("pointerdown", () => {
                if (this.inventoryManager.removeItem(item.itemKey, 1)) {
                    if (this.gameInfoUI) {
                        this.gameInfoUI.improvePlayerStatus();
                    }
                    this.update();
                    if (onSelectCallback) {
                        onSelectCallback();
                    }
                }
                this.closeFishSelectionModal();
            });
        });

        // メインカメラから除外
        this.fishSelectionModal.each((child) => {
            this.scene.cameras.main.ignore(child);
        });
    }

    /**
     * 魚選択モーダルを閉じる
     */
    closeFishSelectionModal() {
        if (this.fishSelectionModal) {
            this.fishSelectionModal.destroy();
            this.fishSelectionModal = null;
        }

        // ゲーム時間を再開
        if (this.gameTimeManager) {
            this.gameTimeManager.resume();
            this.gameTimeManager.resumeFishSystem();
        }
    }
}
