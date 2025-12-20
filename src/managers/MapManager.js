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

        const layerKeyBack1 = "back1";
        const layerKeyFront1 = "front1_wood";
        const layerKeyFront2 = "front2_sea";

        // 最背面レイヤーを作成
        const backgroundLayer = this.mapData.createLayer(
            layerKeyBack1,
            tileset,
            0,
            0
        );
        this.layers[layerKeyBack1] = backgroundLayer;

        // 当たり判定を付与
        backgroundLayer.setCollisionByExclusion([-1]);
        this.scene.physics.add.collider(this.scene.player, backgroundLayer);

        // 前面レイヤー1を作成
        const frontLayer1 = this.mapData.createLayer(
            layerKeyFront1,
            tileset,
            0,
            0
        );
        this.layers[layerKeyFront1] = frontLayer1;

        // 前面レイヤー2を作成
        const frontLayer2 = this.mapData.createLayer(
            layerKeyFront2,
            tileset,
            0,
            0
        );
        this.layers[layerKeyFront2] = frontLayer2;

        // マップの幅と高さを取得
        const mapWidth = this.mapData.widthInPixels;
        const mapHeight = this.mapData.heightInPixels;
        // ワールドの境界をマップのサイズに設定
        this.scene.physics.world.setBounds(0, 0, mapWidth, mapHeight);
        this.scene.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
    }
}
