/**
 * ゲームシーン用の定数
 */
export const GAME_CONST = {
    /** ジャンプ力 */
    JUMP_VELOCITY: -720,
    /** 最大移動スピード */
    PLAYER_SPEED: 360,
    /** 加速度 */
    PLAYER_ACCELERATION: 2700,
    /** パワーの初期値 */
    PLAYER_POWER: 0,
    /** コインの生成間隔 */
    COIN_DISTANCE_MAX: 200,
    /** カメラのオフセット切り替え時の速度 */
    CAMERA_OFFSET_LERP: 0.05,
    /** 重力設定 */
    GRAVITY_Y: 2000,
    /** 落下速度上限 */
    MAX_FALLING_SPEED: 1000,
    /** 「超加速」の初期継続時間 */
    SUPER_SPEED_DURATION_INITIAL: 1000,
    /** 「超加速」のカメラの注目倍率 */
    SUPER_SPEED_CAMERA_LERP: 1.05,
    /** 「超加速」のカメラの注目速度 */
    SUPER_SPEED_CAMERA_FOCUS_TIME: 200,
    /** 「超加速」のカメラシェイクの激しさ */
    SUPER_SPEED_CAMERA_SHAKE_INTENSITY: 0.0025,

    /** 残像エフェクト関連 */
    /** 残像を表示する速度閾値 */
    AFTERIMAGE_SPEED_THRESHOLD: 600,
    /** 残像の生成間隔（ミリ秒） */
    AFTERIMAGE_SPAWN_INTERVAL: 50,
    /** 残像の持続時間（ミリ秒） */
    AFTERIMAGE_DURATION: 200,
    /** 残像の初期透明度 */
    AFTERIMAGE_INITIAL_ALPHA: 0.5,

    /** タイマーの表示_前半部分 */
    FORMAT_TIMER_PRE: "タイム: ",
    /** タイマーの表示_後半部分 */
    FORMAT_TIMER_POST: " s",

    /** 木箱破壊時のパワー消費値 */
    WOOD_BOX_BREAK_POWER_COST: 1,

    /** スコア関連の定数 */
    /** コイン取得時のスコア */
    SCORE_COIN: 500,
    /** 木箱破壊時のスコア */
    SCORE_BOX_DESTROY: 50,
    /** 移動距離に対するスコア係数（ピクセルあたりのスコア） */
    SCORE_DISTANCE_MULTIPLIER: 0.1,
    /** 移動時間によるスコア減算率 */
    SCORE_TIME_PENALTY_MULTIPLIER: 1000,

    /** ゴールアイテムの大きさ倍率 */
    GOAL_ITEM_SCALE: 2.0,

    /** 木箱破壊時の回転角度 */
    BOX_BREAK_ROTATION_ANGLE: 360 * 0.75,
    /** 木箱破壊時のアニメーション時間（ミリ秒） */
    BOX_BREAK_DURATION: 1000,
    /** 木箱破壊時の移動距離の倍率 */
    BOX_BREAK_DURATION_MULTIPLIER: 1000 / 1000,

    /** 背景レイヤーの深度 */
    BACKGROUND_DEPTH: -100,
    /** UIレイヤーの深度 */
    UI_DEPTH: 200,
    /** クリアオーバーレイの深度 */
    CLEAR_OVERLAY_DEPTH: 100,

    /** 木箱チュートリアルの表示距離（ピクセル） */
    BOX_TUTORIAL_TRIGGER_DISTANCE: 150,

    /** プレイヤーの初期Y座標の倍率（画面高さに対する） */
    PLAYER_START_Y_RATIO: 0.9,
    /** カメラの先読み距離倍率（ゲーム画面幅に対する） */
    CAMERA_LOOKAHEAD_RATIO: 0.1,

    /** BGM音量設定 */
    BGM_VOLUME_BEFORE_START: 0.2,
    BGM_VOLUME_NORMAL: 0.5,

    /** ゲームクリア後の遅延時間（ミリ秒） */
    GAME_CLEAR_DELAY: 2000,
};

export const POWERUP_TYPE = {
    /** スピード */
    SPEED: "speed",
    /** パワー */
    POWER: "power",
    /** コイン取得状況によって速度変更 */
    COIN_SPEED_BOOST: "coin_speed_boost",
    /** 二段ジャンプ */
    DOUBLE_JUMP: "double_jump",
    /** ブレーキスコア */
    SPEED_DOWN_SCORE: "speed_down_score",
};

export const POWERUP_NAME = {
    /** スピード */
    SPEED: "スピード",
    /** パワー */
    POWER: "パワー",
    /** コイン取得状況によって速度変更 */
    COIN_SPEED_BOOST: "がめつい加速",
    /** 二段ジャンプ */
    DOUBLE_JUMP: "カエル化現象",
    /** ブレーキスコア */
    SPEED_DOWN_SCORE: "投資上手",
};

export const POWERUP_EXPLANATION = {
    /** スピード */
    SPEED: "スピードが上がる。",
    /** パワー */
    POWER: "パワーが上がる。",
    /** コイン取得状況によって速度変更 */
    COIN_SPEED_BOOST: "コイン取得で速度が上がる。",
    /** 二段ジャンプ */
    DOUBLE_JUMP: "空中でもう一度ジャンプできる。",
    /** ブレーキスコア */
    SPEED_DOWN_SCORE: "速度が下がるがコインのスコアに\n倍率がかかる。",
};

export const POWERUP_VALUE = {
    /** スピードのレベルごとの上昇率（3%） */
    SPEED_GROWTH_RATE: 0.03,
    /** パワーの上昇値 */
    POWER: 2,
    /** コインスピードブーストの基本速度上昇率（コイン1枚あたり、0.5%） */
    COIN_SPEED_BOOST_BASE_RATE: 0.005,
    /** コインスピードブーストのレベルごとの上昇率（20%） */
    COIN_SPEED_BOOST_GROWTH_RATE: 0.20,
    /** ブレーキスコアのスコア倍率上昇率 */
    SPEED_DOWN_SCORE_MULTIPLIER: 0.1,
    /** ブレーキスコアの速度減少率 */
    SPEED_DOWN_SCORE_SPEED_REDUCTION: 0.8,
};
