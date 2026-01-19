export const GAME_CONST = {
    /** プレイヤーの幅 */
    PLAYER_WIDTH: 256,
    /** プレイヤーの高さ */
    PLAYER_HEIGHT: 192,

    /** プレイヤーの初期コイン数 */
    PLAYER_INITIAL_COINS: 0,

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
        fish_funa: { JP: "フナ", EN: "Crucian carp" },
        /** ニジマス */
        fish_nijimasu: { JP: "ニジマス", EN: "Rainbow trout" },
        /** タイ */
        fish_tai: { JP: "タイ", EN: "Sea bream" },
        /** マグロ */
        fish_tuna: { JP: "マグロ", EN: "Bluefin tuna" },
        /** エビ */
        fish_ebi: { JP: "エビ", EN: "Shrimp" },
        /** メッセージボトル */
        bottle_letter: { JP: "メッセージボトル", EN: "Message bottle" },
    },

    /** アイテムの説明 */
    ITEM_DESCRIPTION: {
        fish_funa: {
            JP: "淡水に生息する普通の魚。\nどこでも釣れる。",
            EN: "A common freshwater fish.\nCan be caught anywhere.",
        },
        fish_ebi: {
            JP: "小さな甲殻類。\n比較的よく釣れる。",
            EN: "A small crustacean.\nRelatively common.",
        },
        fish_nijimasu: {
            JP: "美しい虹色の魚。\n人気の食材。",
            EN: "A beautiful rainbow fish.\nPopular ingredient.",
        },
        fish_tuna: {
            JP: "海の王者。\n希少で高級な食材。",
            EN: "King of the sea.\nRare and luxurious.",
        },
        fish_tai: {
            JP: "縁起の良い魚。\n最高級の食材で大変レア。",
            EN: "An auspicious fish.\nExtremely rare delicacy.",
        },
        bottle_letter: {
            JP: "海を漂う手紙入りの瓶。\n誰かのメッセージが入っている。",
            EN: "A bottle with a letter inside.\nContains someone's message.",
        },
    },

    /** アイテムの価値（コイン） */
    ITEM_VALUE: {
        fish_funa: 10, // 重み40: 期待値 4.0
        fish_ebi: 30, // 重み15: 期待値 4.5
        fish_nijimasu: 50, // 重み25: 期待値 12.5
        fish_tuna: 150, // 重み10: 期待値 15.0
        fish_tai: 400, // 重み5:  期待値 20.0
        bottle_letter: 0, // 売れない
    },

    /** 魚のレア度（値が高いほどレア） */
    FISH_RARITY: {
        /** フナ */
        fish_funa: 1,
        /** エビ */
        fish_ebi: 2,
        /** ニジマス */
        fish_nijimasu: 3,
        /** マグロ */
        fish_tuna: 4,
        /** タイ */
        fish_tai: 5,
    },

    /** 釣れる対象の確率重み */
    FISH_WEIGHT: {
        /** フナ */
        fish_funa: 9000,
        /** ニジマス */
        fish_nijimasu: 900,
        /** エビ */
        fish_ebi: 90,
        /** マグロ */
        fish_tuna: 9,
        /** タイ */
        fish_tai: 1,
        /** メッセージボトル */
        bottle_letter: 10,
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
    INVENTORY_SIZE: 6,
    /** インベントリの一つのアイテムのストック数 */
    INVENTORY_ITEM_STOCK: 5,

    /** 魚ヒット抽選の確率 (1/この値) TODO: リリース時は要調整 */
    FISH_HIT_LOTTERY_PROBABILITY: 2,
    /** 魚ヒットの最小持続時間（ゲーム内分） */
    FISH_HIT_DURATION_MIN: 4,
    /** 魚ヒットの最大持続時間（ゲーム内分） */
    FISH_HIT_DURATION_MAX: 20,
    /** 釣った後のクールダウン時間（ゲーム内分） */
    FISH_HIT_COOLDOWN_AFTER_CATCH: 10,
    /** 天井システム：この時間ヒットがなければ確定ヒット（ゲーム内分） */
    FISH_HIT_CEILING_TIME: 360,

    /** レア魚アップグレード：レベルごとに重みに加算する値 */
    RARE_FISH_UPGRADE_WEIGHT_BONUS_PER_LEVEL: 1,

    /** メッセージボトルの基本出現率（％） */
    BOTTLE_LETTER_BASE_PROBABILITY_PERCENT: 10,

    /** 魚を餌として使う時の最低レア度 */
    BAIT_FISH_MINIMUM_RARITY: 1,
};

/**
 * 時間帯の定数
 */
export const TIME_PERIOD = {
    MORNING: "MORNING",
    DAY: "DAY",
    EVENING: "EVENING",
    NIGHT: "NIGHT",
};

/**
 * 時間帯の表示名
 */
export const TIME_PERIOD_DISPLAY_NAME = {
    MORNING: { JP: "朝", EN: "Morning" },
    DAY: { JP: "昼", EN: "Day" },
    EVENING: { JP: "夕方", EN: "Evening" },
    NIGHT: { JP: "夜", EN: "Night" },
};

/**
 * ゲーム内時間に関する定数
 */
export const GAME_TIME_CONST = {
    /** ゲーム時間のスケール: 実時間1秒 = ゲーム内N分 */
    TIME_SCALE_MINUTES_PER_REAL_SECOND: 1,

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
        DAY: 4, // 昼: 12:00-15:59 (4時間)
        EVENING: 3, // 夕方: 16:00-18:59 (3時間)
        NIGHT: 11, // 夜: 19:00-5:59 (11時間)
    },
};

export const EVENT_CONST = {
    /** 釣りシーンの結果をメインシーンに伝えるイベントキー */
    FISHING_RESULT_EVENT: "fishingResultEvent",
};
