export const GAME_CONST = {
    /** プレイヤーの幅 */
    PLAYER_WIDTH: 48,
    /** プレイヤーの高さ */
    PLAYER_HEIGHT: 48,

    /** 魚の名前 */
    FISH_NAME: {
        /** フナ */
        FUNA: "fish_funa",
        /** ニジマス */
        NIJIMASU: "fish_nijimasu",
        /** タイ */
        TAI: "fish_tai",
        /** マグロ */
        TUNA: "fish_tuna",
        /** エビ */
        EBI: "fish_ebi",
    },

    /** 魚の表示名 */
    FISH_DISPLAY_NAME: {
        /** フナ */
        fish_funa: "フナ\n(Crucian carp)",
        /** ニジマス */
        fish_nijimasu: "ニジマス\n(Rainbow trout)",
        /** タイ */
        fish_tai: "タイ\n(Sea bream)",
        /** マグロ */
        fish_tuna: "マグロ\n(Bluefin tuna)",
        /** エビ */
        fish_ebi: "エビ\n(Shrimp)",
        /** メッセージボトル */
        bottle_letter: "メッセージボトル\n(Message bottle)",
    },

    /** 釣れる対象の確率重み */
    FISH_WEIGHT: {
        /** フナ */
        fish_funa: 50,
        /** ニジマス */
        fish_nijimasu: 25,
        /** エビ */
        fish_ebi: 10,
        /** マグロ */
        fish_tuna: 8,
        /** タイ */
        fish_tai: 2,
        /** メッセージボトル */
        bottle_letter: 5,
    },

    /** 成功ゲージの最大値 */
    SUCCESS_GAUGE_MAX: 200,
    /** 成功ゲージの初期値 */
    SUCCESS_GAUGE_INITIAL: 50,
    /** 成功ゲージの時間減少値 */
    SUCCESS_GAUGE_DECREASE_RATE: 0.2,

    /** 釣りゲームの出現する円の半径の基準値 */
    FISHING_GAME_CIRCLE_RADIUS_BASE: 120,
    /** 釣りゲームの出現する円の消失時間 */
    FISHING_GAME_CIRCLE_LIFETIME: 2000,
    /** 釣りゲームの出現する円の出現間隔 */
    FISHING_GAME_CIRCLE_SPAWN_INTERVAL: 800,
    /** 釣りゲームの出現する円の透明度 */
    FISHING_GAME_CIRCLE_ALPHA: 0.2,
    /** 釣りゲームの出現する円の通常色 */
    FISHING_GAME_CHALLENGE_CIRCLE_COLOR: "#00FFFF",
    /** 釣りゲームの出現する円のチャレンジの透明度 */
    FISHING_GAME_CHALLENGE_CIRCLE_ALPHA: 0.8,
    /** 釣りゲームの出現する円の背面色 */
    FISHING_GAME_CIRCLE_BACKGROUND_COLOR: "#FFFFFF",
    /** 釣りゲームの出現する円の枠の太さ */
    FISHING_GAME_CIRCLE_BORDER_WIDTH: 2,
    /** 釣りゲームで出現する円の行数 */
    FISHING_GAME_CIRCLE_ROWS: 1,
    /** 釣りゲームで出現する円の列数 */
    FISHING_GAME_CIRCLE_COLUMNS: 3,
    /** 釣りゲームで出現するチャレンジ円の最大数 */
    FISHING_GAME_CHALLENGE_CIRCLE_MAX: 3,
    /** 成功ゲージをタップしたときの増加値 */
    SUCCESS_GAUGE_INCREASE_ON_TAP: 100,
    /** 成功時のフェードの色 */
    SUCCESS_FADE_COLOR: "#FFFF00",
    /** 成功時のフェードの持続時間 */
    SUCCESS_FADE_DURATION: 400,
    /** 成功時のフェードの倍率 */
    SUCCESS_FADE_SCALE: 1.4,
    /** 成功時の元の透明率 */
    SUCCESS_FADE_ALPHA: 0.8,
    /** 成功時のシーンフェードタイム */
    SUCCESS_SCENE_FADE_TIME: 500,

    /** インベントリのサイズ */
    INVENTORY_SIZE: 8,
    /** インベントリの一つのアイテムのストック数 */
    INVENTORY_ITEM_STOCK: 5,

    /** 魚ヒット抽選の確率 (1/この値) */
    FISH_HIT_LOTTERY_PROBABILITY: 30,
    /** 魚ヒットの最小持続時間（ゲーム内分） */
    FISH_HIT_DURATION_MIN: 10,
    /** 魚ヒットの最大持続時間（ゲーム内分） */
    FISH_HIT_DURATION_MAX: 20,
};

export const EVENT_CONST = {
    /** 釣りシーンの結果をメインシーンに伝えるイベントキー */
    FISHING_RESULT_EVENT: "fishingResultEvent",
};
