import { MAP_CONST } from "../const/MapConst.js";

/**
 * マップ初期化用・管理クラス
 */
export class MapManager {
    /**
     * コンストラクタ
     */
    constructor(scene) {
        this.scene = scene;
        this.mapData = null;

        /** レイヤー管理用オブジェクト */
        this.layers = {};
    }

    /**
     * マップの初期化
     * @param {string} mapKey マップキー
     * @param {string} tilesetKey タイルセットキー
     */
    initMap(mapKey, tilesetKey) {
        // マップデータの読み込み
        this.mapData = this.scene.make.tilemap({ key: mapKey });
        // タイルセットの読み込み
        const tileset = this.mapData.addTilesetImage(tilesetKey, tilesetKey);

        // 最背面レイヤーを作成
        const backgroundLayer = this.mapData.createLayer(
            MAP_CONST.LAYER_KEYS.BACK1,
            tileset,
            0,
            0
        );
        this.layers[MAP_CONST.LAYER_KEYS.BACK1] = backgroundLayer;
        // UIカメラから除外
        this.scene.uiCamera.ignore(backgroundLayer);

        // 前面レイヤー1を作成
        const frontLayer1 = this.mapData.createLayer(
            MAP_CONST.LAYER_KEYS.FRONT1_WOOD,
            tileset,
            0,
            0
        );
        this.layers[MAP_CONST.LAYER_KEYS.FRONT1_WOOD] = frontLayer1;
        // 前面レイヤーの描画深度を設定
        frontLayer1.setDepth(200);
        // UIカメラから除外
        this.scene.uiCamera.ignore(frontLayer1);

        // 前面レイヤー2を作成
        const frontLayer2 = this.mapData.createLayer(
            MAP_CONST.LAYER_KEYS.FRONT2_SEA,
            tileset,
            0,
            0
        );
        this.layers[MAP_CONST.LAYER_KEYS.FRONT2_SEA] = frontLayer2;
        // 前面レイヤーの描画深度を設定
        frontLayer2.setDepth(200);
        // UIカメラから除外
        this.scene.uiCamera.ignore(frontLayer2);

        // マップの幅と高さを取得
        const mapWidth = this.mapData.widthInPixels;
        const mapHeight = this.mapData.heightInPixels;
        // ワールドの境界をマップのサイズに設定
        this.scene.physics.world.setBounds(0, 0, mapWidth, mapHeight);
        this.scene.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
    }

    /**
     * 衝突判定を付与
     */
    addCollision(obj, layerKey) {
        const layer = this.layers[layerKey];
        if (layer) {
            layer.setCollisionByExclusion([-1]);
            this.scene.physics.add.collider(obj, layer);
        }
    }
}
