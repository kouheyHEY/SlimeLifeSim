export const MAP_CONST = {
    /** マップキー：海辺のマップ */
    MAP_SEASIDE_KEY: "map_seaside",
    /** マップファイルパス：海辺のマップ */
    MAP_SEASIDE_PATH: "assets/maps/map_seaside.json",

    /** タイルのサイズ単位 */
    CELL_SIZE: 32,

    /** プレイヤーの初期座標位置 */
    PLAYER_START_POSITION: { x: 21, y: 21 },

    /** レイヤーのキー */
    LAYER_KEYS: {
        BACK1: "back1",
        FRONT1_WOOD: "front1_wood",
        FRONT2_SEA: "front2_sea",
    },

    /** 時間帯別の背景色設定 */
    TIME_OF_DAY_COLORS: {
        NIGHT: {
            time: 0, // 00:00
            color: 0x1a1a2e, // 深い濃紺
        },
        EARLY_MORNING: {
            time: 4, // 04:00
            color: 0x3d2817, // 暗い茶色
        },
        MORNING: {
            time: 6, // 06:00
            color: 0xff9a56, // オレンジ（朝焼け）
        },
        DAY: {
            time: 9, // 09:00
            color: 0x87ceeb, // 明るい空色
        },
        AFTERNOON: {
            time: 13, // 13:00
            color: 0x87ceeb, // 昼間の空色
        },
        EVENING: {
            time: 16, // 16:00
            color: 0xff8c42, // オレンジ（夕方開始）
        },
        DUSK: {
            time: 18, // 18:00
            color: 0xff6b6b, // 赤オレンジ（夕焼け）
        },
        NIGHT_TRANSITION: {
            time: 19, // 19:00
            color: 0x1a1a2e, // 深い濃紺（夜へ）
        },
    },

    /** 色の遷移時間（ミリ秒） */
    COLOR_TRANSITION_DURATION: 2000, // 2秒かけてゆっくり色が変わる

    /** Tween用イージング関数 */
    COLOR_TRANSITION_EASE: "Linear",

    /** 時間帯の判定時刻（時） */
    TIME_OF_DAY_HOURS: {
        EARLY_MORNING_START: 4, // 深夜から早朝への切り替え時刻
        MORNING_START: 6, // 早朝から朝への切り替え時刻
        DAY_START: 9, // 朝から昼への切り替え時刻
        EVENING_START: 16, // 昼から夕方への切り替え時刻
        DUSK_START: 19, // 夕方から夜への切り替え時刻
        NIGHT_START: 24, // 夜から次の日への切り替え時刻（常に24時間制で使用）
    },

    /** 初期背景色（ゲーム開始時） */
    INITIAL_BACKGROUND_COLOR: 0x00ff00,

    /** RGB変換用定数 */
    RGB_CONVERSION: {
        MAX_VALUE: 255, // RGB値の最大値（0-255）
        RED_SHIFT: 16, // 赤のビットシフト量
        GREEN_SHIFT: 8, // 緑のビットシフト量
        BLUE_SHIFT: 0, // 青のビットシフト量
    },
};
