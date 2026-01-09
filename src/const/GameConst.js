export const GAME_CONST = {
    /** プレイヤーの幅 */
    PLAYER_WIDTH: 256,
    /** プレイヤーの高さ */
    PLAYER_HEIGHT: 192,

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
        /** メッセージボトル */
        BOTTLE_LETTER: "bottle_letter",
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

    /** アイテムの説明 */
    ITEM_DESCRIPTION: {
        fish_funa: "淡水に生息する魚。\n食用に適している。",
        fish_nijimasu: "美しい虹色の魚。\n高級食材として人気。",
        fish_tai: "縁起の良い魚。\nとても美味しい。",
        fish_tuna: "海の王者。\n最高級の食材。",
        fish_ebi: "小さな甲殻類。\n料理の素材に使える。",
        bottle_letter: "海を漂う手紙入りの瓶。\n誰かのメッセージが入っている。",
    },

    /** アイテムの価値（コイン） */
    ITEM_VALUE: {
        fish_funa: 10,
        fish_nijimasu: 30,
        fish_tai: 100,
        fish_tuna: 200,
        fish_ebi: 5,
        bottle_letter: 0,
    },

    /** 釣れる対象の確率重み */
    FISH_WEIGHT: {
        /** フナ */
        fish_funa: 40,
        /** ニジマス */
        fish_nijimasu: 25,
        /** エビ */
        fish_ebi: 15,
        /** マグロ */
        fish_tuna: 10,
        /** タイ */
        fish_tai: 5,
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
    FISH_HIT_LOTTERY_PROBABILITY: 3,
    /** 魚ヒットの最小持続時間（ゲーム内分） */
    FISH_HIT_DURATION_MIN: 10,
    /** 魚ヒットの最大持続時間（ゲーム内分） */
    FISH_HIT_DURATION_MAX: 20,
};

/**
 * ゲーム内時間に関する定数
 */
export const GAME_TIME_CONST = {
    /** ゲーム時間のスケール: 実時間1秒 = ゲーム内N分 */
    TIME_SCALE_MINUTES_PER_REAL_SECOND: 2,

    /** ゲーム時間の更新判定時間（秒） */
    UPDATE_THRESHOLD_SECONDS: 0.5,

    /** ゲーム開始時の初期時刻 */
    GAME_START_TIME: {
        month: 4,
        day: 1,
        hour: 6,
        minute: 0,
    },

    /** 時間単位の進行定数 */
    TIME_UNITS: {
        MINUTES_PER_HOUR: 60, // 1時間は60分
        HOURS_PER_DAY: 24, // 1日は24時間
        DAYS_PER_MONTH: 30, // 1月は30日（簡易版）
        MONTHS_PER_YEAR: 12, // 1年は12ヶ月
    },

    /** 実時間への変換係数 */
    REAL_TIME_CONVERSION: {
        SECONDS_PER_MILLISECOND: 1000, // 1000ミリ秒 = 1秒
    },

    /** 時間帯ごとの長さ（時） */
    TIME_PERIOD_LENGTHS: {
        MORNING: 6, // 朝: 6:00-11:59 (6時間)
        DAY: 6, // 昼: 12:00-17:59 (6時間)
        EVENING: 3, // 夕方: 18:00-20:59 (3時間)
        NIGHT: 9, // 夜: 21:00-5:59 (9時間)
    },
};

export const EVENT_CONST = {
    /** 釣りシーンの結果をメインシーンに伝えるイベントキー */
    FISHING_RESULT_EVENT: "fishingResultEvent",
};
