import { GameTimeManager } from "../managers/GameTimeManager.js";
import { UI_CONST, UI_TEXT } from "../const/UIConst.js";
import {
    COMMON_CONST,
    FONT_NAME,
    getLocalizedText,
    getCurrentLanguage,
} from "../const/CommonConst.js";
import { GAME_CONST, TIME_PERIOD_DISPLAY_NAME } from "../const/GameConst.js";
import { Modal } from "../../core/ui/Modal.js";

/**
 * ゲーム情報表示UI
 * トップバー内に日付、天気、時刻、プレイヤー状態、コイン枚数を表示
 */
export class GameInfoUI {
    /**
     * コンストラクタ
     * @param {Phaser.Scene} scene - 所属するシーン
     * @param {GameTimeManager} gameTimeManager - ゲーム時間マネージャー
     * @param {number} x - X座標（親コンテナ内での相対位置）
     * @param {number} y - Y座標（親コンテナ内での相対位置）
     */
    constructor(
        scene,
        gameTimeManager,
        x = UI_CONST.GAME_INFO_X,
        y = UI_CONST.GAME_INFO_Y
    ) {
        this.scene = scene;
        this.gameTimeManager = gameTimeManager;
        this.x = x;
        this.y = y;
        // コイン
        this.coins = GAME_CONST.PLAYER_INITIAL_COINS;
        this.upgradeItemElements = {};
        this.createUI();
    }

    /**
     * UIの作成
     */
    createUI() {
        // コンテナを作成（親コンテナ内での相対位置）
        this.infoContainer = this.scene.add.container(this.x, this.y);

        // 背景を作成
        this.background = this.scene.add
            .rectangle(
                0,
                0,
                UI_CONST.GAME_INFO_WIDTH,
                UI_CONST.GAME_INFO_HEIGHT,
                UI_CONST.GAME_INFO_COLOR
            )
            .setOrigin(0, 0)
            .setStrokeStyle(
                UI_CONST.GAME_INFO_BORDER_WIDTH,
                UI_CONST.GAME_INFO_BORDER_COLOR
            );
        this.infoContainer.add(this.background);

        // メインカメラから除外
        this.scene.cameras.main.ignore(this.background);

        const centerX = UI_CONST.GAME_INFO_WIDTH / 2;
        let currentY = UI_CONST.GAME_INFO_PADDING + 10;

        // 釣竿のテクスチャ（上部、中央揃え）
        this.rodSprite = this.scene.add
            .sprite(centerX, currentY, "rod")
            .setOrigin(0.5, 0)
            .setScale(0.6);
        this.infoContainer.add(this.rodSprite);
        this.scene.cameras.main.ignore(this.rodSprite);

        // 釣竿の高さを取得
        const rodHeight = this.rodSprite.displayHeight;
        currentY += rodHeight + 25;

        // アップグレードボタン（レベルテキストの下、中央揃え）
        const upgradeButtonX =
            (UI_CONST.GAME_INFO_WIDTH - UI_CONST.UPGRADE_BUTTON_WIDTH) / 2;

        // 外枠（暗め）
        this.upgradeButtonOuter = this.scene.add
            .rectangle(
                upgradeButtonX,
                currentY,
                UI_CONST.UPGRADE_BUTTON_WIDTH,
                UI_CONST.UPGRADE_BUTTON_HEIGHT,
                0x008800
            )
            .setOrigin(0, 0);
        this.infoContainer.add(this.upgradeButtonOuter);
        this.scene.cameras.main.ignore(this.upgradeButtonOuter);

        // 内側（明るめ）
        this.upgradeButton = this.scene.add
            .rectangle(
                upgradeButtonX + 3,
                currentY + 3,
                UI_CONST.UPGRADE_BUTTON_WIDTH - 6,
                UI_CONST.UPGRADE_BUTTON_HEIGHT - 6,
                0x00dd00
            )
            .setOrigin(0, 0)
            .setInteractive({ useHandCursor: true });
        this.infoContainer.add(this.upgradeButton);
        this.scene.cameras.main.ignore(this.upgradeButton);

        // ボタン内容用のコンテナ
        this.upgradeButtonContentContainer = this.scene.add.container(
            upgradeButtonX + UI_CONST.UPGRADE_BUTTON_WIDTH / 2,
            currentY + UI_CONST.UPGRADE_BUTTON_HEIGHT / 2
        );
        this.infoContainer.add(this.upgradeButtonContentContainer);
        this.scene.cameras.main.ignore(this.upgradeButtonContentContainer);

        // アップグレードテキスト（コンテナ内の座標）
        this.upgradeButtonText = this.scene.add
            .text(0, 0, "アップグレード", {
                fontFamily: FONT_NAME.CP_PERIOD,
                fontSize: "40px",
                color: "#FFFFFF",
                align: "center",
                stroke: "#000000",
                strokeThickness: 2,
            })
            .setOrigin(0.5, 0.5);
        this.upgradeButtonContentContainer.add(this.upgradeButtonText);
        this.scene.cameras.main.ignore(this.upgradeButtonText);

        // アップグレードボタンのクリックイベント（簡略化版）
        this.upgradeButton.on("pointerdown", () => {
            // プレス効果
            this.upgradeButtonOuter.y += 2;
            this.upgradeButton.y += 2;
            this.upgradeButtonContentContainer.y += 2;

            // アップグレードモーダルを表示
            this.showUpgradeModal();

            // 少し遅延してから元に戻す
            this.scene.time.delayedCall(100, () => {
                this.upgradeButtonOuter.y -= 2;
                this.upgradeButton.y -= 2;
                this.upgradeButtonContentContainer.y -= 2;
            });
        });
    }

    /**
     * アップグレード選択モーダルを表示
     */
    showUpgradeModal() {
        // 時間を停止
        if (this.gameTimeManager) {
            this.gameTimeManager.pause();
            this.gameTimeManager.pauseFishSystem();
        }

        if (this.upgradeModal) {
            this.upgradeModal.destroy();
        }
        this.upgradeItemElements = {};

        const upgrades = this.getUpgradeData();
        if (upgrades.length === 0) {
            return;
        }

        const screenWidth = COMMON_CONST.SCREEN_WIDTH;
        const screenHeight = COMMON_CONST.SCREEN_HEIGHT;
        const modalWidth = UI_TEXT.UPGRADE_MODAL_STYLE.WIDTH;
        const modalHeight = UI_TEXT.UPGRADE_MODAL_STYLE.HEIGHT;
        const centerX = screenWidth / 2;
        const centerY = screenHeight / 2;

        // モーダルコンテナを作成
        this.upgradeModal = this.scene.add.container(centerX, centerY);
        this.upgradeModal.setDepth(200);

        // オーバーレイ背景
        const overlay = this.scene.add
            .rectangle(
                -centerX,
                -centerY,
                screenWidth,
                screenHeight,
                UI_TEXT.UPGRADE_MODAL_STYLE.OVERLAY_COLOR,
                UI_TEXT.UPGRADE_MODAL_STYLE.OVERLAY_ALPHA
            )
            .setOrigin(0, 0)
            .setInteractive();
        this.upgradeModal.add(overlay);

        // モーダル背景
        const modalBg = this.scene.add
            .rectangle(
                0,
                0,
                modalWidth,
                modalHeight,
                UI_TEXT.UPGRADE_MODAL_STYLE.BACKGROUND_COLOR,
                UI_TEXT.UPGRADE_MODAL_STYLE.BACKGROUND_ALPHA
            )
            .setStrokeStyle(
                UI_TEXT.UPGRADE_MODAL_STYLE.BORDER_WIDTH,
                UI_TEXT.UPGRADE_MODAL_STYLE.BORDER_COLOR
            );
        this.upgradeModal.add(modalBg);

        // タイトル
        const title = this.scene.add.text(
            0,
            -modalHeight / 2 + UI_TEXT.UPGRADE_MODAL_TITLE_STYLE.Y_OFFSET,
            getLocalizedText(UI_TEXT.UPGRADE_MODAL.TITLE),
            {
                fontFamily: FONT_NAME.CP_PERIOD,
                fontSize: UI_TEXT.UPGRADE_MODAL_TITLE_STYLE.FONT_SIZE,
                color: UI_TEXT.UPGRADE_MODAL_TITLE_STYLE.COLOR,
                stroke: UI_TEXT.UPGRADE_MODAL_TITLE_STYLE.STROKE,
                strokeThickness:
                    UI_TEXT.UPGRADE_MODAL_TITLE_STYLE.STROKE_THICKNESS,
            }
        );
        title.setOrigin(0.5, 0.5);
        this.upgradeModal.add(title);

        const itemStyle = UI_TEXT.UPGRADE_MODAL_ITEM_STYLE;
        let startY = -modalHeight / 2 + itemStyle.START_Y_OFFSET;
        const itemHeight = itemStyle.HEIGHT;
        const itemSpacing = itemStyle.SPACING;

        upgrades.forEach((upgrade, index) => {
            const itemY = startY + index * (itemHeight + itemSpacing);

            // 項目背景
            const itemBg = this.scene.add
                .rectangle(
                    0,
                    itemY,
                    modalWidth - 40,
                    itemHeight,
                    upgrade.color,
                    itemStyle.BG_ALPHA
                )
                .setStrokeStyle(itemStyle.BORDER_WIDTH, upgrade.color);
            this.upgradeModal.add(itemBg);

            // 強化要素名（左寄せ）
            const nameText = this.scene.add.text(
                -modalWidth / 2 + 36,
                itemY - itemHeight / 2 + itemStyle.NAME_Y_OFFSET,
                upgrade.name,
                {
                    fontFamily: FONT_NAME.CP_PERIOD,
                    fontSize: itemStyle.NAME_FONT_SIZE,
                    color: itemStyle.NAME_COLOR,
                    stroke: "#000000",
                    strokeThickness: 2,
                }
            );
            nameText.setOrigin(0, 0.5);
            this.upgradeModal.add(nameText);

            // レベル表記（右寄せ）
            const levelText = this.scene.add.text(
                modalWidth / 2 - 36,
                itemY - itemHeight / 2 + itemStyle.LEVEL_Y_OFFSET,
                `Lv.${upgrade.level}`,
                {
                    fontFamily: FONT_NAME.CP_PERIOD,
                    fontSize: itemStyle.LEVEL_FONT_SIZE,
                    color: itemStyle.LEVEL_COLOR,
                    stroke: "#000000",
                    strokeThickness: 2,
                }
            );
            levelText.setOrigin(1, 0.5);
            this.upgradeModal.add(levelText);

            // 説明
            const descText = this.scene.add.text(
                -modalWidth / 2 + itemStyle.DESC_X_OFFSET,
                itemY - itemHeight / 2 + itemStyle.DESC_Y_OFFSET,
                upgrade.description,
                {
                    fontFamily: FONT_NAME.CP_PERIOD,
                    fontSize: itemStyle.DESC_FONT_SIZE,
                    color: itemStyle.DESC_COLOR,
                    stroke: "#000000",
                    strokeThickness: 1,
                }
            );
            descText.setOrigin(0, 0.5);
            this.upgradeModal.add(descText);

            // コスト表示（最大レベルの場合は「MAX」と表示）
            const costStyle = UI_TEXT.UPGRADE_MODAL_COST_STYLE;
            const coinIcon = this.scene.add
                .sprite(
                    -modalWidth / 2 + costStyle.ICON_X_OFFSET,
                    itemY + itemHeight / 2 + costStyle.Y_OFFSET,
                    "coin"
                )
                .setOrigin(0.5, 0.5)
                .setScale(0.8)
                .setVisible(!upgrade.isMaxLevel);
            this.upgradeModal.add(coinIcon);

            const costText = this.scene.add
                .text(
                    -modalWidth / 2 + costStyle.TEXT_X_OFFSET,
                    itemY + itemHeight / 2 + costStyle.Y_OFFSET,
                    `${upgrade.cost}`,
                    {
                        fontFamily: FONT_NAME.CP_PERIOD,
                        fontSize: costStyle.FONT_SIZE,
                        color: costStyle.COLOR,
                        stroke: costStyle.STROKE,
                        strokeThickness: costStyle.STROKE_THICKNESS,
                    }
                )
                .setOrigin(0, 0.5)
                .setVisible(!upgrade.isMaxLevel);
            this.upgradeModal.add(costText);

            const maxText = this.scene.add
                .text(
                    -modalWidth / 2 + costStyle.ICON_X_OFFSET,
                    itemY + itemHeight / 2 + costStyle.Y_OFFSET,
                    getLocalizedText(UI_TEXT.UPGRADE_MODAL.MAX),
                    {
                        fontFamily: FONT_NAME.CP_PERIOD,
                        fontSize: "18px",
                        color: "#88ff88",
                        stroke: "#000000",
                        strokeThickness: 2,
                    }
                )
                .setOrigin(0, 0.5)
                .setVisible(upgrade.isMaxLevel);
            this.upgradeModal.add(maxText);

            // 購入ボタン
            const btnStyle = UI_TEXT.UPGRADE_MODAL_BUTTON_STYLE;
            const btnX = modalWidth / 2 + btnStyle.X_OFFSET;
            const btnY = itemY + itemHeight / 2 + btnStyle.Y_OFFSET;

            const isDisabled = upgrade.isMaxLevel || !upgrade.canAfford;
            const buttonColor = isDisabled ? 0x666666 : upgrade.color;

            const buyButton = this.scene.add
                .rectangle(
                    btnX,
                    btnY,
                    btnStyle.WIDTH,
                    btnStyle.HEIGHT,
                    buttonColor
                )
                .setStrokeStyle(btnStyle.BORDER_WIDTH, btnStyle.BORDER_COLOR);

            buyButton.baseColor = upgrade.color;
            buyButton.hoverColor = upgrade.hoverColor;
            buyButton.isDisabled = isDisabled;

            if (!isDisabled) {
                buyButton.setInteractive({ useHandCursor: true });
            } else {
                buyButton.disableInteractive();
            }
            this.upgradeModal.add(buyButton);

            const buttonText = upgrade.isMaxLevel
                ? getLocalizedText(UI_TEXT.UPGRADE_MODAL.MAX)
                : getLocalizedText(UI_TEXT.UPGRADE_MODAL.UPGRADE_BUTTON);

            const buyText = this.scene.add.text(btnX, btnY, buttonText, {
                fontFamily: FONT_NAME.CP_PERIOD,
                fontSize: btnStyle.FONT_SIZE,
                color: isDisabled ? "#888888" : btnStyle.COLOR,
                stroke: btnStyle.STROKE,
                strokeThickness: btnStyle.STROKE_THICKNESS,
            });
            buyText.setOrigin(0.5, 0.5);
            this.upgradeModal.add(buyText);

            buyButton.on("pointerdown", () =>
                this.handleUpgradeClick(upgrade.id)
            );
            buyButton.on("pointerover", () => {
                if (buyButton.isDisabled) {
                    return;
                }
                buyButton.setFillStyle(buyButton.hoverColor);
            });
            buyButton.on("pointerout", () => {
                if (buyButton.isDisabled) {
                    return;
                }
                buyButton.setFillStyle(buyButton.baseColor);
            });

            this.upgradeItemElements[upgrade.id] = {
                levelText,
                costText,
                coinIcon,
                maxText,
                buyButton,
                buyText,
                color: upgrade.color,
                hoverColor: upgrade.hoverColor,
            };
        });

        // キャンセルボタン
        const cancelStyle = UI_TEXT.UPGRADE_MODAL_CANCEL_BUTTON_STYLE;
        const cancelY = modalHeight / 2 + cancelStyle.Y_OFFSET;
        const cancelButton = this.scene.add
            .rectangle(
                0,
                cancelY,
                cancelStyle.WIDTH,
                cancelStyle.HEIGHT,
                cancelStyle.BACKGROUND_COLOR
            )
            .setStrokeStyle(cancelStyle.BORDER_WIDTH, cancelStyle.BORDER_COLOR)
            .setInteractive({ useHandCursor: true });
        this.upgradeModal.add(cancelButton);

        const cancelText = this.scene.add.text(
            0,
            cancelY,
            getLocalizedText(UI_TEXT.UPGRADE_MODAL.CANCEL_BUTTON),
            {
                fontFamily: FONT_NAME.CP_PERIOD,
                fontSize: cancelStyle.FONT_SIZE,
                color: cancelStyle.COLOR,
                stroke: cancelStyle.STROKE,
                strokeThickness: cancelStyle.STROKE_THICKNESS,
            }
        );
        cancelText.setOrigin(0.5, 0.5);
        this.upgradeModal.add(cancelText);

        cancelButton.on("pointerdown", () => this.closeUpgradeModal());
        cancelButton.on("pointerover", () =>
            cancelButton.setFillStyle(cancelStyle.HOVER_COLOR)
        );
        cancelButton.on("pointerout", () =>
            cancelButton.setFillStyle(cancelStyle.BACKGROUND_COLOR)
        );

        // オーバーレイクリックで閉じる
        overlay.on("pointerdown", () => this.closeUpgradeModal());

        // メインカメラから除外（UIカメラ専用）
        this.upgradeModal.each((child) => {
            this.scene.cameras.main.ignore(child);
        });
    }

    getUpgradeData() {
        const upgradeManager = this.scene.upgradeManager;
        if (!upgradeManager) {
            return [];
        }

        return UI_TEXT.UPGRADE_ITEMS.map((item) => {
            const currentLevel = upgradeManager.getLevel(item.id);
            const cost = upgradeManager.getUpgradeCost(item.id);
            const isMaxLevel = cost === -1;

            return {
                ...item,
                name: getLocalizedText(item.name),
                description: getLocalizedText(item.description),
                level: currentLevel,
                cost: isMaxLevel ? 0 : cost,
                isMaxLevel,
                canAfford: !isMaxLevel && this.coins >= cost,
            };
        });
    }

    handleUpgradeClick(upgradeId) {
        const upgradeManager = this.scene.upgradeManager;
        if (!upgradeManager) {
            return;
        }

        const cost = upgradeManager.getUpgradeCost(upgradeId);
        if (cost === -1 || this.coins < cost) {
            console.log(
                getLocalizedText(UI_TEXT.UPGRADE_MODAL.NOT_ENOUGH_COINS)
            );
            return;
        }

        const result = upgradeManager.upgrade(upgradeId, this.coins);
        if (!result.success) {
            console.log(
                getLocalizedText(UI_TEXT.UPGRADE_MODAL.NOT_ENOUGH_COINS)
            );
            return;
        }

        this.coins = result.newCoins;
        this.updateCoinCount();
        this.refreshUpgradeModal();
    }

    refreshUpgradeModal() {
        if (!this.upgradeModal) {
            return;
        }

        const upgrades = this.getUpgradeData();
        const btnStyle = UI_TEXT.UPGRADE_MODAL_BUTTON_STYLE;

        upgrades.forEach((upgrade) => {
            const elements = this.upgradeItemElements[upgrade.id];
            if (!elements) {
                return;
            }

            elements.levelText.setText(`Lv.${upgrade.level}`);

            if (upgrade.isMaxLevel) {
                elements.coinIcon?.setVisible(false);
                elements.costText?.setVisible(false);
                if (elements.maxText) {
                    elements.maxText.setVisible(true);
                    elements.maxText.setText(
                        getLocalizedText(UI_TEXT.UPGRADE_MODAL.MAX)
                    );
                }
            } else {
                elements.coinIcon?.setVisible(true);
                elements.costText?.setVisible(true);
                if (elements.costText) {
                    elements.costText.setText(`${upgrade.cost}`);
                }
                if (elements.maxText) {
                    elements.maxText.setVisible(false);
                }
            }

            const isDisabled = upgrade.isMaxLevel || !upgrade.canAfford;
            const buttonColor = isDisabled ? 0x666666 : elements.color;

            elements.buyButton.setFillStyle(buttonColor);
            if (isDisabled) {
                elements.buyButton.disableInteractive();
            } else {
                elements.buyButton.setInteractive({ useHandCursor: true });
            }
            elements.buyButton.isDisabled = isDisabled;

            elements.buyText.setText(
                upgrade.isMaxLevel
                    ? getLocalizedText(UI_TEXT.UPGRADE_MODAL.MAX)
                    : getLocalizedText(UI_TEXT.UPGRADE_MODAL.UPGRADE_BUTTON)
            );
            elements.buyText.setColor(isDisabled ? "#888888" : btnStyle.COLOR);
        });
    }

    /**
     * アップグレードモーダルを閉じる
     */
    closeUpgradeModal() {
        if (this.upgradeModal) {
            this.upgradeModal.destroy();
            this.upgradeModal = null;
        }
        this.upgradeItemElements = {};

        // 時間を再開
        if (this.gameTimeManager) {
            this.gameTimeManager.resume();
            this.gameTimeManager.resumeFishSystem();
        }
    }

    /**
     * UIの更新
     */
    update() {
        // 釣竿レベルを更新
        if (this.rodLevelText && this.scene.upgradeManager) {
            const level = this.scene.upgradeManager.getTotalLevel();
            this.rodLevelText.setText(`Lv ${level}`);
        }

        // アップグレードボタンのテキストを更新
        if (this.upgradeButtonText && this.scene.upgradeManager) {
            const upgradeManager = this.scene.upgradeManager;
            const level = upgradeManager.getTotalLevel();
            const maxLevel = upgradeManager.getTotalMaxLevel();

            if (level >= maxLevel) {
                this.upgradeButtonText.setText(
                    getLocalizedText(UI_TEXT.UPGRADE_MODAL.MAX)
                );
                this.upgradeButton.setFillStyle(0x00dd00);
                this.upgradeButtonOuter.setFillStyle(0x008800);
            } else {
                this.upgradeButtonText.setText(
                    getLocalizedText(UI_TEXT.UPGRADE_MODAL.UPGRADE_BUTTON)
                );
                this.upgradeButton.setFillStyle(0x00dd00);
                this.upgradeButtonOuter.setFillStyle(0x008800);
            }
        }
    }

    updateCoinCount() {
        if (this.scene.topBarUI && this.scene.topBarUI.coinCountText) {
            this.scene.topBarUI.coinCountText.setText(`${this.coins}`);
        }
    }

    /**
     * コイン枚数を設定
     * @param {number} amount - コイン枚数
     */
    setCoins(amount) {
        this.coins = Math.max(0, amount);
    }

    /**
     * コインを追加
     * @param {number} amount - 追加するコイン枚数
     */
    addCoins(amount) {
        const oldCoins = this.coins;
        this.coins += amount;
        this.coins = Math.max(0, this.coins);
        console.log(
            `GameInfoUI.addCoins: ${oldCoins} + ${amount} = ${this.coins}`
        );
    }

    /**
     * コインを減らす
     * @param {number} amount - 減らすコイン枚数
     * @return {boolean} - 減らせた場合true、コイン不足の場合false
     */
    removeCoins(amount) {
        if (this.coins >= amount) {
            this.coins -= amount;
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
            coins: this.coins,
        };
    }

    /**
     * セーブデータから状態を復元
     * @param {Object} data - 復元するデータ
     */
    loadSaveData(data) {
        if (data.coins !== undefined) {
            this.coins = data.coins;
        }
    }
}
