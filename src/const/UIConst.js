export const UI_CONST = {
    /** パワーアップの選択肢UIのY座標 */
    CHOICE_OF_POWERUP_UI_Y: 320,
    /** パワーアップの選択肢UIの幅 */
    CHOICE_OF_POWERUP_UI_WIDTH: 500,
    /** パワーアップの選択肢UIの高さ */
    CHOICE_OF_POWERUP_UI_HEIGHT: 130,
    /** パワーアップの選択肢UI間のスペース */
    CHOICE_OF_POWERUP_UI_SPACING: 20,
    /** パワーアップ選択肢UIの背景色 */
    CHOICE_OF_POWERUP_UI_BACKGROUND_COLOR: 0x000000,
    /** アイコンの幅 */
    CHOICE_OF_POWERUP_ICON_WIDTH: 64,
    /** アイコンの高さ */
    CHOICE_OF_POWERUP_ICON_HEIGHT: 64,

    /** ゲーム情報表示UIの幅 */
    GAME_INFO_UI_WIDTH: 300,

    // GameInfoUI レイアウト設定
    /** GameInfoUI: 左マージン */
    GAME_INFO_LEFT_MARGIN: 15,
    /** GameInfoUI: スコアのY座標初期値 */
    GAME_INFO_SCORE_Y_START: 15,
    /** GameInfoUI: スコアとタイマー間のスペース */
    GAME_INFO_SCORE_TIMER_SPACING: 40,
    /** GameInfoUI: タイマーと基礎能力間のスペース */
    GAME_INFO_TIMER_BASIC_SPACING: 60,
    /** GameInfoUI: セクションラベルとコンテンツ間のスペース */
    GAME_INFO_LABEL_CONTENT_SPACING: 50,
    /** GameInfoUI: 基礎能力と特殊能力間のスペース */
    GAME_INFO_BASIC_SPECIAL_SPACING: 30,
    /** GameInfoUI: ステータス項目間のスペース */
    GAME_INFO_STATUS_ITEM_SPACING: 40,
    /** GameInfoUI: アイコンのX座標 */
    GAME_INFO_ICON_X: 36,
    /** GameInfoUI: アイコンのY座標オフセット */
    GAME_INFO_ICON_Y_OFFSET: 16,
    /** GameInfoUI: アイコンのサイズ */
    GAME_INFO_ICON_SIZE: 32,
    /** GameInfoUI: ステータステキストのX座標 */
    GAME_INFO_STATUS_TEXT_X: 60,
    /** GameInfoUI: 特殊能力ステータステキストのX座標 */
    GAME_INFO_SPECIAL_STATUS_TEXT_X: 34,

    // GameInfoUI フォントサイズ設定
    /** GameInfoUI: スコアとタイマーのフォントサイズ */
    GAME_INFO_SCORE_TIMER_FONT_SIZE: 28,
    /** GameInfoUI: セクションラベルのフォントサイズ */
    GAME_INFO_SECTION_LABEL_FONT_SIZE: 26,
    /** GameInfoUI: ステータステキストのフォントサイズ */
    GAME_INFO_STATUS_FONT_SIZE: 24,
    /** GameInfoUI: 特殊能力ステータステキストのフォントサイズ */
    GAME_INFO_SPECIAL_STATUS_FONT_SIZE: 20,

    // GameInfoUI カラー設定
    /** GameInfoUI: 基礎能力ラベルの色 */
    GAME_INFO_BASIC_LABEL_COLOR: "#ffff00",
    /** GameInfoUI: 特殊能力ラベルの色 */
    GAME_INFO_SPECIAL_LABEL_COLOR: "#00ffff",
    /** GameInfoUI: 通常テキストの色 */
    GAME_INFO_TEXT_COLOR: "#ffffff",
    /** GameInfoUI: テキストのストローク色 */
    GAME_INFO_TEXT_STROKE_COLOR: "#000000",
    /** GameInfoUI: テキストのストローク幅 */
    GAME_INFO_TEXT_STROKE_THICKNESS: 8,

    // GameInfoUI テキスト設定
    /** GameInfoUI: 基礎能力ラベルテキスト */
    GAME_INFO_BASIC_LABEL_TEXT: "【基礎能力】",
    /** GameInfoUI: 特殊能力ラベルテキスト */
    GAME_INFO_SPECIAL_LABEL_TEXT: "【特殊能力】",
    /** GameInfoUI: スコアのプレフィックス */
    GAME_INFO_SCORE_PREFIX: "コイン: ",

    GAME_INFO_JP_STATUS: {
        speed: "スピード",
        power: "パワー",
        coinSpeedBoost: "がめつい加速",
        doubleJump: "カエル化現象",
        speedDownScore: "投資上手",
    },

    // ゲームクリアテキスト設定
    TEXT_GAMESCORE_PREFIX: "スコア: ",
    TEXT_GAMESCORE_Y: 60,
    TEXT_GAMESCORE_FONT_SIZE: 32,
    TEXT_GAMESCORE_COLOR: "#ffffff",
    TEXT_GAMESCORE_STROKE_COLOR: "#000000",
    TEXT_GAMESCORE_STROKE_THICKNESS: 8,

    TEXT_GAME_CLEAR_Y: 200,
    TEXT_GAME_CLEAR: "以下の選択肢から一つ選び\nプレイヤーを強化...",
    TEXT_GAME_CLEAR_FONT_SIZE: 32,
    TEXT_GAME_CLEAR_COLOR: "#ffff00",
    TEXT_GAME_CLEAR_STROKE_COLOR: "#000000",
    TEXT_GAME_CLEAR_STROKE_THICKNESS: 8,
    TEXT_GAME_CLEAR_LINE_SPACING: 10,

    // ゲームクリア画面のオーバーレイ設定
    /** ゲームクリア画面オーバーレイの色 */
    GAME_CLEAR_OVERLAY_COLOR: 0x000000,
    /** ゲームクリア画面オーバーレイの透明度 */
    GAME_CLEAR_OVERLAY_ALPHA: 0.3,

    TEXT_GAME_START: "タップまたはスペースキーでスタート",
    TEXT_GAME_START_FONT_SIZE: 32,
    TEXT_GAME_START_COLOR: "#ffffff",
    TEXT_GAME_START_STROKE_COLOR: "#000000",
    TEXT_GAME_START_STROKE_THICKNESS: 6,

    // タッチボタン設定
    /** タッチボタンの幅 */
    TOUCH_BUTTON_WIDTH: 160,
    /** タッチボタンの高さ */
    TOUCH_BUTTON_HEIGHT: 100,
    /** タッチボタンの画面端からのマージン */
    TOUCH_BUTTON_MARGIN: 30,
    /** タッチボタンの通常時の透明度 */
    TOUCH_BUTTON_ALPHA: 0.3,
    /** タッチボタンのアクティブ時の透明度 */
    TOUCH_BUTTON_ALPHA_ACTIVE: 0.8,
    /** タッチボタンの枠線の幅 */
    TOUCH_BUTTON_STROKE_WIDTH: 3,
    /** タッチボタンの枠線の色 */
    TOUCH_BUTTON_STROKE_COLOR: 0xffffff,
    /** 左転換ボタンの色 */
    TOUCH_BUTTON_LEFT_COLOR: 0xff0000,
    /** 右転換ボタンの色 */
    TOUCH_BUTTON_RIGHT_COLOR: 0x0000ff,
    /** ジャンプボタンの色 */
    TOUCH_BUTTON_JUMP_COLOR: 0x00ff00,
    /** 方向転換ボタンのフォントサイズ */
    TOUCH_BUTTON_ARROW_FONT_SIZE: "60px",
    /** ジャンプボタンのフォントサイズ */
    TOUCH_BUTTON_JUMP_FONT_SIZE: "24px",
    /** 左転換ボタンのテキスト */
    TOUCH_BUTTON_TEXT_LEFT: "←",
    /** 右転換ボタンのテキスト */
    TOUCH_BUTTON_TEXT_RIGHT: "→",
    /** ジャンプボタンのテキスト */
    TOUCH_BUTTON_TEXT_JUMP: "ジャンプ",

    // タイトル画面レイアウト
    /** タイトル画面: タイトルテキスト */
    TITLE_TEXT: "アイアムダッシュマン",
    /** タイトル画面: タイトルY座標オフセット */
    TITLE_TEXT_Y_OFFSET: -150,
    /** タイトル画面: タイトルフォントサイズ */
    TITLE_TEXT_FONT_SIZE: 64,
    /** タイトル画面: タイトル色 */
    TITLE_TEXT_COLOR: "#ffff00",
    /** タイトル画面: タイトルストローク色 */
    TITLE_TEXT_STROKE_COLOR: "#000000",
    /** タイトル画面: タイトルストローク幅 */
    TITLE_TEXT_STROKE_THICKNESS: 10,
    /** タイトル画面: タイトル点滅アニメーション透明度 */
    TITLE_TEXT_BLINK_ALPHA: 0.5,
    /** タイトル画面: タイトル点滅アニメーション時間 */
    TITLE_TEXT_BLINK_DURATION: 1000,

    /** タイトル画面: バージョン表示 */
    TITLE_VERSION: "v1.0.0",
    /** タイトル画面: バージョン表示X座標マージン */
    TITLE_VERSION_X_MARGIN: 20,
    /** タイトル画面: バージョン表示Y座標マージン */
    TITLE_VERSION_Y_MARGIN: 20,
    /** タイトル画面: バージョン表示フォントサイズ */
    TITLE_VERSION_FONT_SIZE: 16,
    /** タイトル画面: バージョン表示色 */
    TITLE_VERSION_COLOR: "#888888",

    /** タイトル画面: 背景色 */
    TITLE_BACKGROUND_COLOR: 0x000033,
    /** タイトル画面: BGM音量 */
    TITLE_BGM_VOLUME: 0.3,

    /** タイトル画面: コイン生成間隔 */
    TITLE_COIN_SPAWN_INTERVAL: 500,
    /** タイトル画面: コイン最小速度 */
    TITLE_COIN_MIN_SPEED: 2,
    /** タイトル画面: コイン最大速度 */
    TITLE_COIN_MAX_SPEED: 5,
    /** タイトル画面: コイン最小スケール */
    TITLE_COIN_MIN_SCALE: 0.5,
    /** タイトル画面: コイン最大スケール */
    TITLE_COIN_MAX_SCALE: 1.0,
    /** タイトル画面: コイン最小透明度 */
    TITLE_COIN_MIN_ALPHA: 0.3,
    /** タイトル画面: コイン最大透明度 */
    TITLE_COIN_MAX_ALPHA: 0.7,
    /** タイトル画面: コインX座標最小値 */
    TITLE_COIN_MIN_X: 50,
    /** タイトル画面: コイン回転アニメーション最小時間 */
    TITLE_COIN_ROTATION_MIN_DURATION: 2000,
    /** タイトル画面: コイン回転アニメーション最大時間 */
    TITLE_COIN_ROTATION_MAX_DURATION: 4000,

    /** タイトル画面: メニューボタンY座標オフセット */
    TITLE_MENU_Y_OFFSET: 20,
    /** タイトル画面: メニューボタン列間隔 */
    TITLE_MENU_COLUMN_SPACING: 280,
    /** タイトル画面: メニューボタン行間隔 */
    TITLE_MENU_ROW_SPACING: 100,
    /** タイトル画面: メニューボタンフォントサイズ */
    TITLE_MENU_BUTTON_FONT_SIZE: 32,
    /** タイトル画面: メニューボタン色 */
    TITLE_MENU_BUTTON_COLOR: "#ffffff",
    /** タイトル画面: メニューボタンストローク色 */
    TITLE_MENU_BUTTON_STROKE_COLOR: "#000000",
    /** タイトル画面: メニューボタンストローク幅 */
    TITLE_MENU_BUTTON_STROKE_THICKNESS: 6,
    /** タイトル画面: メニューボタン背景色 */
    TITLE_MENU_BUTTON_BG_COLOR: "#333333",
    /** タイトル画面: メニューボタンパディングX */
    TITLE_MENU_BUTTON_PADDING_X: 40,
    /** タイトル画面: メニューボタンパディングY */
    TITLE_MENU_BUTTON_PADDING_Y: 15,

    /** タイトル画面: 初回起動時ボタン色 */
    TITLE_FIRST_TIME_BUTTON_COLOR: "#ffff00",
    /** タイトル画面: 初回起動時ボタン背景色 */
    TITLE_FIRST_TIME_BUTTON_BG_COLOR: "#ff6600",
    /** タイトル画面: 初回起動時ボタン点滅透明度 */
    TITLE_FIRST_TIME_BUTTON_BLINK_ALPHA: 0.7,
    /** タイトル画面: 初回起動時ボタン点滅時間 */
    TITLE_FIRST_TIME_BUTTON_BLINK_DURATION: 800,

    /** タイトル画面: 無効ボタン透明度 */
    TITLE_DISABLED_BUTTON_ALPHA: 0.5,

    /** タイトル画面: フェードアウト時間 */
    TITLE_FADEOUT_DURATION: 500,

    // タイトル画面テキスト
    /** タイトル画面: はじめからボタンテキスト */
    TITLE_BUTTON_NEW_GAME: "はじめから",
    /** タイトル画面: つづきからボタンテキスト */
    TITLE_BUTTON_CONTINUE: "つづきから",
    /** タイトル画面: ハイスコアボタンテキスト */
    TITLE_BUTTON_HIGH_SCORE: "ランキング",
    /** タイトル画面: クレジットボタンテキスト */
    TITLE_BUTTON_CREDITS: "クレジット",

    // クレジット画面テキスト
    /** クレジット画面: タイトル */
    CREDITS_TITLE: "クレジット",
    /** クレジット画面: 戻るボタン */
    CREDITS_BUTTON_BACK: "タイトルに戻る",
    /** クレジット画面: ゲームデザイン＆プログラミング */
    CREDITS_SECTION_GAME_DESIGN: "ゲームデザイン・プログラミング",
    /** クレジット画面: グラフィック＆アート */
    CREDITS_SECTION_GRAPHICS: "グラフィック・アート",
    /** クレジット画面: サウンド＆ミュージック */
    CREDITS_SECTION_SOUND: "サウンド・ミュージック",
    /** クレジット画面: スペシャルサンクス */
    CREDITS_SECTION_THANKS: "スペシャルサンクス",

    // ハイスコア画面テキスト
    /** ハイスコア画面: 戻るボタン */
    HIGH_SCORE_BUTTON_BACK: "< タイトルに戻る >",

    // ゴール時の記録更新通知
    /** 新記録（ハイスコア＆最速タイム）更新時のテキスト */
    TEXT_NEW_RECORD_BOTH: "★ 新記録！ハイスコア＆最速タイム更新！ ★",
    /** ハイスコア更新時のテキスト */
    TEXT_NEW_HIGH_SCORE: "★ 新記録！ハイスコア更新！ ★",
    /** 最速タイム更新時のテキスト */
    TEXT_NEW_BEST_TIME: "★ 新記録！最速タイム更新！ ★",
    /** 新記録通知のY座標 */
    TEXT_NEW_RECORD_Y: 130,
    /** 新記録通知のフォントサイズ */
    TEXT_NEW_RECORD_FONT_SIZE: 28,
    /** 新記録通知の色 */
    TEXT_NEW_RECORD_COLOR: "#ffff00",
    /** 新記録通知のストローク色 */
    TEXT_NEW_RECORD_STROKE_COLOR: "#ff0000",
    /** 新記録通知のストローク幅 */
    TEXT_NEW_RECORD_STROKE_THICKNESS: 6,
};
