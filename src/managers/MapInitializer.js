import ASSETS from "../assets.js";
import ANIMATION from "../animation.js";
import { GAME_CONST } from "../const/GameConst.js";

/**
 * マップ初期化クラス
 */
export class MapInitializer {
    /**
     * コンストラクタ
     * @param {Phaser.Scene} scene シーンオブジェクト
     * @param {Phaser.Physics.Arcade.Group} coinGroup コイングループ
     * @param {Phaser.Physics.Arcade.Group} boxGroup 木箱グループ
     * @param {Phaser.Cameras.Scene2D.Camera} uiCamera UIカメラ
     */
    constructor(scene, coinGroup, boxGroup, uiCamera) {
        this.scene = scene;
        this.coinGroup = coinGroup;
        this.boxGroup = boxGroup;
        this.uiCamera = uiCamera;
        this.firstBoxX = null;
    }

    /**
     * マップの初期化
     * @param {string} mapKey マップキー
     * @param {Player} player プレイヤーオブジェクト
     * @param {Function} onGameClear ゲームクリア時のコールバック
     * @param {CollisionHandler} collisionHandler コリジョンハンドラー
     * @returns {number|null} 最初の木箱のX座標
     */
    initMap(mapKey, player, onGameClear, collisionHandler) {
        // マップデータ読み込み
        const mapData = this.scene.make.tilemap({ key: mapKey });
        // タイルセットの読み込み
        const tileset = mapData.addTilesetImage("tileset_1", "tileset_1");

        // 地形レイヤーを作成
        const groundLayer = mapData.createLayer("Ground", tileset, 0, 0);
        this.uiCamera.ignore([groundLayer]);

        // 衝突判定
        groundLayer.setCollisionByExclusion([-1]);
        this.scene.physics.add.collider(player, groundLayer);
        this.scene.physics.add.collider(this.boxGroup, groundLayer);

        // アイテムレイヤーを作成
        this.createItemsFromLayer(mapData, player, onGameClear);

        // プレイヤーと木箱の衝突判定
        this.scene.physics.add.collider(
            player,
            this.boxGroup,
            (p, box) => collisionHandler.handlePlayerBoxCollision(p, box),
            (p, box) => collisionHandler.handlePlayerBoxPreCollision(p, box),
            this.scene
        );

        // 背景レイヤー
        const tileset_bg_1 = mapData.addTilesetImage(
            "background_1",
            "background_1"
        );
        const bgLayer = mapData.createLayer("Background_1", tileset_bg_1, 0, 0);
        bgLayer.setDepth(GAME_CONST.BACKGROUND_DEPTH);
        this.uiCamera.ignore([bgLayer]);

        // マップの幅と高さを取得
        const mapWidth = mapData.widthInPixels;
        const mapHeight = mapData.heightInPixels;
        // ワールドの境界をマップのサイズに設定
        this.scene.physics.world.setBounds(0, 0, mapWidth, mapHeight);
        this.scene.cameras.main.setBounds(0, 0, mapWidth, mapHeight);

        return this.firstBoxX;
    }

    /**
     * アイテムレイヤーからアイテムを生成
     * @param {Phaser.Tilemaps.Tilemap} mapData マップデータ
     * @param {Player} player プレイヤーオブジェクト
     * @param {Function} onGameClear ゲームクリア時のコールバック
     */
    createItemsFromLayer(mapData, player, onGameClear) {
        const itemsLayer = mapData.getObjectLayer("Items");

        itemsLayer.objects.forEach((item) => {
            if (item.name === "coin") {
                this.createCoin(item.x, item.y);
            } else if (item.name === "flag") {
                this.createFlag(item.x, item.y, player, onGameClear);
            } else if (item.name === "boxWood") {
                this.createBox(item.x, item.y);
            }
        });
    }

    /**
     * コイン生成
     * @param {number} x X座標
     * @param {number} y Y座標
     */
    createCoin(x, y) {
        const coin = this.coinGroup.create(x, y, ASSETS.spritesheet.coin.key);
        this.uiCamera.ignore([coin]);
        coin.anims.play(ANIMATION.coin.key, true);
    }

    /**
     * ゴールフラグ生成
     * @param {number} x X座標
     * @param {number} y Y座標
     * @param {Player} player プレイヤーオブジェクト
     * @param {Function} onGameClear ゲームクリア時のコールバック
     */
    createFlag(x, y, player, onGameClear) {
        const flag = this.scene.physics.add.sprite(
            x,
            y,
            ASSETS.spritesheet.flag.key
        );
        flag.setScale(GAME_CONST.GOAL_ITEM_SCALE);
        this.uiCamera.ignore([flag]);
        flag.anims.play(ANIMATION.flag.key, true);
        flag.body.setAllowGravity(false);

        // プレイヤーとフラグの衝突判定
        this.scene.physics.add.overlap(
            player,
            flag,
            () => {
                flag.destroy();
                if (onGameClear) {
                    onGameClear();
                }
            },
            null,
            this.scene
        );
    }

    /**
     * 木箱生成
     * @param {number} x X座標
     * @param {number} y Y座標
     */
    createBox(x, y) {
        const box = this.scene.physics.add.sprite(
            x,
            y,
            ASSETS.spritesheet.boxWood.key
        );
        box.setPushable(false);
        this.uiCamera.ignore([box]);
        this.boxGroup.add(box);

        // 最初の木箱のX座標を記録
        if (this.firstBoxX === null || x < this.firstBoxX) {
            this.firstBoxX = x;
        }
    }
}
