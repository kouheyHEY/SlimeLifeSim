export const UI_CONST = {
    /** 釣りゲームUIの幅 */
    FISHING_WIDTH: 960,
    /** 釣りゲームUIの高さ */
    FISHING_HEIGHT: 600,
    /** 釣りゲームUIの背景の色 */
    FISHING_BACKGROUND_COLOR: 0x000000,
    /** 釣りゲームUIの背景の透明度 */
    FISHING_BACKGROUND_ALPHA: 0.5,
    /** 釣りゲームUIの長方形の色 */
    FISHING_RECTANGLE_COLOR: 0x000000,
    /** 釣りゲームUIの長方形の枠の色 */
    FISHING_RECTANGLE_LINE_COLOR: 0xffffff,
    /** 釣りゲームUIの長方形の枠の太さ */
    FISHING_RECTANGLE_LINE_WIDTH: 2,

    /** 魚ヒットインジケーターのテキスト */
    FISH_HIT_TEXT: {
        JP: "ヒット!!",
        EN: "Hit!!",
    },
    /** 魚ヒットテキストのフォントサイズ */
    FISH_HIT_TEXT_FONT_SIZE: 40,
    /** 魚ヒットテキストの色 */
    FISH_HIT_TEXT_COLOR: "#ffffff",
    /** 魚ヒットテキストの縁取り色 */
    FISH_HIT_TEXT_STROKE_COLOR: "#000000",
    /** 魚ヒットテキストの縁取り太さ */
    FISH_HIT_TEXT_STROKE_THICKNESS: 4,
    /** 魚ヒットテキストのXオフセット */
    FISH_HIT_TEXT_OFFSET_X: 40,

    /** 成功ゲージの長さ */
    FISHING_SUCCESS_GAUGE_LENGTH: 600,
    /** 成功ゲージのy座標 */
    FISHING_SUCCESS_GAUGE_Y: 40,
    /** 成功ゲージの高さ */
    FISHING_SUCCESS_GAUGE_HEIGHT: 20,
    /** 成功ゲージの枠の色 */
    FISHING_SUCCESS_GAUGE_LINE_COLOR: 0xffffff,
    /** 成功ゲージの枠の太さ */
    FISHING_SUCCESS_GAUGE_LINE_WIDTH: 2,

    /** 釣り結果表示用の長方形の幅 */
    FISHING_RESULT_WIDTH: 600,
    /** 釣り結果表示用の長方形の高さ */
    FISHING_RESULT_HEIGHT: 400,
    /** 釣り結果表示用の長方形の色 */
    FISHING_RESULT_RECTANGLE_COLOR: 0x000000,
    /** 釣り結果表示用の長方形の枠の色 */
    FISHING_RESULT_RECTANGLE_LINE_COLOR: 0xffffff,
    /** 釣り結果表示用の長方形の枠の太さ */
    FISHING_RESULT_RECTANGLE_LINE_WIDTH: 2,
    /** 釣り結果のスプライト表示Y座標 */
    FISHING_RESULT_SPRITE_Y: -100,
    /** 釣り結果テキストのフォントサイズ */
    FISHING_RESULT_TEXT_FONT_SIZE: 40,
    /** 釣り結果テキストの色 */
    FISHING_RESULT_TEXT_COLOR: "#FFFFFF",
    /** 釣り結果テキストの文字列Y座標 */
    FISHING_RESULT_TEXT_Y: 40,
    /** 釣り結果の遷移用ボタン文字列 */
    FISHING_RESULT_BUTTON_TEXT: "OK",
    /** 釣り結果ボタンの幅 */
    FISHING_RESULT_BUTTON_WIDTH: 160,
    /** 釣り結果ボタンの高さ */
    FISHING_RESULT_BUTTON_HEIGHT: 60,
    /** 釣り結果ボタンの文字の大きさ */
    FISHING_RESULT_BUTTON_FONT_SIZE: 36,
    /** 釣り結果ボタンの文字色 */
    FISHING_RESULT_BUTTON_TEXT_COLOR: "#FFFFFF",
    /** 釣り結果の遷移用ボタンの背景色 */
    FISHING_RESULT_BUTTON_BACKGROUND_COLOR: "#00CC00",
    /** 釣り結果の遷移用ボタンの枠色 */
    FISHING_RESULT_BUTTON_BORDER_COLOR: "#FFFFFF",
    /** 釣り結果の遷移用ボタンの枠の太さ */
    FISHING_RESULT_BUTTON_BORDER_WIDTH: 2,
    /** 釣り結果の遷移用ボタンのY座標 */
    FISHING_RESULT_BUTTON_Y: 140,

    /** インベントリの行数 */
    INVENTORY_ROWS: 3,
    /** インベントリの列数 */
    INVENTORY_COLUMNS: 2,
    /** インベントリのアイテムの枠のサイズ */
    INVENTORY_ITEM_FRAME_SIZE: 120,
    /** インベントリの色 */
    INVENTORY_COLOR: 0x000000,
    /** インベントリの枠の色 */
    INVENTORY_BORDER_COLOR: 0xffffff,
    /** インベントリの枠の太さ */
    INVENTORY_BORDER_WIDTH: 2,
    /** インベントリのパディング */
    INVENTORY_ITEM_PADDING: 0,
    /** インベントリのX座標（トップバー内での相対位置） */
    INVENTORY_X: 20,
    /** インベントリのY座標（トップバー内での相対位置） */
    INVENTORY_Y: 20,
    /** インベントリの数量のフォントサイズ */
    INVENTORY_QUANTITY_FONT_SIZE: 30,
    /** インベントリのフォント色 */
    INVENTORY_FONT_COLOR: "#FFFFFF",
    /** インベントリに表示するアイテムのサイズ */
    INVENTORY_ITEM_DISPLAY_SIZE: 96,

    /** アイテム詳細モーダルの幅 */
    ITEM_DETAIL_WIDTH: 500,
    /** アイテム詳細モーダルの高さ */
    ITEM_DETAIL_HEIGHT: 640,
    /** アイテム詳細モーダルの背景色 */
    ITEM_DETAIL_BG_COLOR: 0x222222,
    /** アイテム詳細モーダルの枠色 */
    ITEM_DETAIL_BORDER_COLOR: 0xffffff,
    /** アイテム詳細モーダルの枠の太さ */
    ITEM_DETAIL_BORDER_WIDTH: 3,
    /** アイテム詳細のテクスチャサイズ */
    ITEM_DETAIL_TEXTURE_SIZE: 128,
    /** アイテム詳細のフォントサイズ */
    ITEM_DETAIL_FONT_SIZE: 32,
    /** アイテム詳細の説明フォントサイズ */
    ITEM_DETAIL_DESC_FONT_SIZE: 32,
    /** アイテム詳細のボタン幅 */
    ITEM_DETAIL_BUTTON_WIDTH: 200,
    /** アイテム詳細のボタン高さ */
    ITEM_DETAIL_BUTTON_HEIGHT: 70,
    /** アイテム詳細ボタンの1段目Y座標 */
    ITEM_DETAIL_BUTTON_Y_ROW1: 170,
    /** アイテム詳細ボタンの2段目Y座標 */
    ITEM_DETAIL_BUTTON_Y_ROW2: 260,
    /** アイテム詳細の魚ボタン配置（1段目） */
    ITEM_DETAIL_BUTTON_POSITIONS_WITH_BAIT_ROW1: {
        SELL_ONE_X: -120,
        SELL_ALL_X: 120,
    },
    /** アイテム詳細の魚ボタン配置（2段目） */
    ITEM_DETAIL_BUTTON_POSITIONS_WITH_BAIT_ROW2: {
        BAIT_X: -120,
        CLOSE_X: 120,
    },
    /** アイテム詳細の非魚ボタン配置（1段目） */
    ITEM_DETAIL_BUTTON_POSITIONS_WITHOUT_BAIT_ROW1: {
        SELL_ONE_X: -120,
        SELL_ALL_X: 120,
    },
    /** アイテム詳細の非魚ボタン配置（2段目） */
    ITEM_DETAIL_BUTTON_POSITIONS_WITHOUT_BAIT_ROW2: {
        CLOSE_X: 0,
    },

    /** インベントリ餌表示の枠幅 */
    INVENTORY_BAIT_BORDER_WIDTH: 3,
    /** インベントリ餌表示の枠色 */
    INVENTORY_BAIT_BORDER_COLOR: 0x8844aa,
    /** インベントリ餌表示のテキスト */
    INVENTORY_BAIT_TEXT: { JP: "餌", EN: "Bait" },
    /** インベントリ餌テキストのフォントサイズ */
    INVENTORY_BAIT_FONT_SIZE: 16,
    /** インベントリ餌テキストの色 */
    INVENTORY_BAIT_TEXT_COLOR: "#8844aa",

    /** インベントリ餌表示の枠幅 */
    INVENTORY_BAIT_BORDER_WIDTH: 3,
    /** インベントリ餌表示の枠色 */
    INVENTORY_BAIT_BORDER_COLOR: 0x8844aa,
    /** インベントリ餌表示のテキスト */
    INVENTORY_BAIT_TEXT: { JP: "餌", EN: "Bait" },
    /** インベントリ餌テキストのフォントサイズ */
    INVENTORY_BAIT_FONT_SIZE: 30,
    /** インベントリ餌テキストの色 */
    INVENTORY_BAIT_TEXT_COLOR: "#8844aa",

    /** タイトル画面の背景の色 */
    TITLE_BACKGROUND_COLOR: 0x000000,
    /** タイトル画面の背景の透明度 */
    TITLE_BACKGROUND_ALPHA: 0.5,
    /** タイトルテキストのフォントサイズ */
    TITLE_TEXT_FONT_SIZE: "64px",
    /** タイトルテキストの色 */
    TITLE_TEXT_COLOR: "#FFFFFF",
    /** タイトルテキストのストローク色 */
    TITLE_TEXT_STROKE_COLOR: "#000000",
    /** タイトルテキストのストロークの太さ */
    TITLE_TEXT_STROKE_THICKNESS: 4,
    /** タイトルテキストのY座標（画面高さに対する比率） */
    TITLE_TEXT_Y_RATIO: 1 / 3,
    /** タイトル画面のボタンの幅 */
    TITLE_BUTTON_WIDTH: 400,
    /** タイトル画面のボタンの高さ */
    TITLE_BUTTON_HEIGHT: 100,
    /** タイトル画面のボタンの間隔 */
    TITLE_BUTTON_SPACING: 120,
    /** タイトル画面のボタンのY座標オフセット */
    TITLE_BUTTON_Y_OFFSET: 50,
    /** タイトル画面のボタンの背景色 */
    TITLE_BUTTON_BACKGROUND_COLOR: 0x000000,
    /** タイトル画面のボタンの枠の色 */
    TITLE_BUTTON_BORDER_COLOR: 0xffffff,
    /** タイトル画面のボタンの枠の太さ */
    TITLE_BUTTON_BORDER_WIDTH: 3,
    /** タイトル画面のボタンのホバー時の背景色 */
    TITLE_BUTTON_HOVER_COLOR: 0x333333,
    /** タイトル画面のボタンのテキストのフォントサイズ */
    TITLE_BUTTON_TEXT_FONT_SIZE: "48px",
    /** タイトル画面のボタンのテキストの色 */
    TITLE_BUTTON_TEXT_COLOR: "#FFFFFF",
    /** タイトル画面のフェードアウトの時間（ミリ秒） */
    TITLE_FADE_DURATION: 1000,
    /** ゲームシーン初期化後、タイトルシーンを表示するまでの遅延（ミリ秒） */
    TITLE_SCENE_LAUNCH_DELAY: 50,
    /** ゲーム情報UIの幅 */
    GAME_INFO_WIDTH: 240,
    /** ゲーム情報UIの高さ */
    GAME_INFO_HEIGHT: 210,
    /** ゲーム情報UIのX座標（トップバー内での相対位置） */
    GAME_INFO_X: 20,
    /** ゲーム情報UIのY座標（トップバー内での相対位置） */
    GAME_INFO_Y: 20,
    /** ゲーム情報UIの背景色 */
    GAME_INFO_COLOR: 0x000000,
    /** ゲーム情報UIの枠の色 */
    GAME_INFO_BORDER_COLOR: 0xffffff,
    /** ゲーム情報UIの枠の太さ */
    GAME_INFO_BORDER_WIDTH: 2,
    /** ゲーム情報UIのフォントサイズ */
    GAME_INFO_FONT_SIZE: 20,
    /** ゲーム情報UIのフォント色 */
    GAME_INFO_FONT_COLOR: "#FFFFFF",
    /** ゲーム情報UIの行間 */
    GAME_INFO_LINE_SPACING: 28,
    /** ゲーム情報UIの内部パディング */
    GAME_INFO_PADDING: 10,
    /** 時間円グラフの半径 */
    TIME_CIRCLE_RADIUS: 50,
    /** 時間円グラフの線の太さ */
    TIME_CIRCLE_LINE_WIDTH: 10,
    /** 時間数直線の長さ（英語版） */
    TIME_LINE_WIDTH: 400,
    /** 時間数直線の高さ（英語版） */
    TIME_LINE_HEIGHT: 10,
    /** プレイヤー状態アイコンのサイズ */
    PLAYER_STATUS_ICON_SIZE: 40,
    /** コインアイコンのサイズ */
    COIN_ICON_SIZE: 40,
    /** 時間帯の色 */
    TIME_PERIOD_COLORS: {
        MORNING: 0xffeb3b, // 黄色 (morning)
        DAY: 0xff9800, // オレンジ (day)
        EVENING: 0xff5722, // 赤オレンジ (evening)
        NIGHT: 0x3f51b5, // 青 (night)
    },

    /** サイドバーUIの幅 */
    SIDEBAR_WIDTH: 280,
    /** サイドバーUIの背景色 */
    SIDEBAR_COLOR: 0x000000,
    /** サイドバーUIの背景透明度 */
    SIDEBAR_ALPHA: 0.7,
    /** サイドバーUIの枠の色 */
    SIDEBAR_BORDER_COLOR: 0xffffff,
    /** サイドバーUIの枠の太さ */
    SIDEBAR_BORDER_WIDTH: 2,
    /** サイドバーUIの上下パディング */
    SIDEBAR_PADDING: 20,

    /** 手紙表示ウィンドウの幅 */
    LETTER_WINDOW_WIDTH: 800,
    /** 手紙表示ウィンドウの高さ */
    LETTER_WINDOW_HEIGHT: 600,
    /** 手紙表示ウィンドウの長方形の色 */
    LETTER_WINDOW_RECTANGLE_COLOR: 0x000000,
    /** 手紙表示ウィンドウの長方形の枠の色 */
    LETTER_WINDOW_RECTANGLE_LINE_COLOR: 0xffffff,
    /** 手紙表示ウィンドウの長方形の枠の太さ */
    LETTER_WINDOW_RECTANGLE_LINE_WIDTH: 2,
    /** 手紙テキストのフォントサイズ */
    LETTER_TEXT_FONT_SIZE: 32,
    /** 手紙テキストのフォントサイズ（英語） */
    LETTER_TEXT_FONT_SIZE_EN: 28,
    /** 手紙テキストの色 */
    LETTER_TEXT_COLOR: "#FFFFFF",
    /** 手紙テキストのY座標 */
    LETTER_TEXT_Y: -260,
    /** 手紙テキストの行間 */
    LETTER_TEXT_LINE_SPACING: 30,
    /** 手紙テキストのテキスト最大幅 */
    LETTER_TEXT_MAX_WIDTH: 740,
    /** 手紙ウィンドウの閉じるボタンのテキスト */
    LETTER_CLOSE_BUTTON_TEXT: "OK",
    /** 手紙ウィンドウの閉じるボタンの幅 */
    LETTER_CLOSE_BUTTON_WIDTH: 160,
    /** 手紙ウィンドウの閉じるボタンの高さ */
    LETTER_CLOSE_BUTTON_HEIGHT: 60,
    /** 手紙ウィンドウの閉じるボタンのフォントサイズ */
    LETTER_CLOSE_BUTTON_FONT_SIZE: 36,
    /** 手紙ウィンドウの閉じるボタンのテキスト色 */
    LETTER_CLOSE_BUTTON_TEXT_COLOR: "#FFFFFF",
    /** 手紙ウィンドウの閉じるボタンの背景色 */
    LETTER_CLOSE_BUTTON_BACKGROUND_COLOR: 0x0099ff,
    /** 手紙ウィンドウの閉じるボタンの枠色 */
    LETTER_CLOSE_BUTTON_BORDER_COLOR: 0xffffff,
    /** 手紙ウィンドウの閉じるボタンの枠の太さ */
    LETTER_CLOSE_BUTTON_BORDER_WIDTH: 2,
    /** 手紙ウィンドウの閉じるボタンのY座標 */
    LETTER_CLOSE_BUTTON_Y: 170,

    /** 手紙リストのカテゴリタイトルのフォントサイズ */
    LETTER_LIST_CATEGORY_FONT_SIZE: "40px",
    /** 手紙リストのカテゴリタイトルの色 */
    LETTER_LIST_CATEGORY_COLOR: "#FFDD00",
    /** 手紙リストのカテゴリタイトルのストローク色 */
    LETTER_LIST_CATEGORY_STROKE_COLOR: "#000000",
    /** 手紙リストのカテゴリタイトルのストローク太さ */
    LETTER_LIST_CATEGORY_STROKE_THICKNESS: 2,
    /** 手紙リストの開始Y座標 */
    LETTER_LIST_START_Y: -180,
    /** 手紙リストのアイテム高さ */
    LETTER_LIST_ITEM_HEIGHT: 60,
    /** 手紙リストのカテゴリ間スペース */
    LETTER_LIST_CATEGORY_SPACING: 30,
    /** 手紙リストのアイテム背景色 */
    LETTER_LIST_ITEM_BG_COLOR: 0x2244aa,
    /** 手紙リストのアイテム背景の枠色 */
    LETTER_LIST_ITEM_BORDER_COLOR: 0xffffff,
    /** 手紙リストのアイテム背景の枠の太さ */
    LETTER_LIST_ITEM_BORDER_WIDTH: 2,
    /** 手紙リストのアイテム幅 */
    LETTER_LIST_ITEM_WIDTH: 700,
    /** 手紙リストのアイテムのフォントサイズ */
    LETTER_LIST_ITEM_FONT_SIZE: "28px",
    /** 手紙リストのアイテムのストローク色 */
    LETTER_LIST_ITEM_STROKE_COLOR: "#000000",
    /** 手紙リストのアイテムのストローク太さ */
    LETTER_LIST_ITEM_STROKE_THICKNESS: 2,
    /** 手紙リストのアイテムのプレビューテキストの最大長 */
    LETTER_LIST_PREVIEW_MAX_LENGTH: 20,

    /** 手紙コンテンツ表示のページ番号のY座標オフセット */
    LETTER_CONTENT_PAGE_NUMBER_Y_OFFSET: 40,
    /** 手紙コンテンツ表示のページ番号のフォントサイズ */
    LETTER_CONTENT_PAGE_NUMBER_FONT_SIZE: "32px",
    /** 手紙コンテンツ表示のページ番号の色 */
    LETTER_CONTENT_PAGE_NUMBER_COLOR: "#FFFFFF",
    /** 手紙コンテンツ表示のページ番号のストローク色 */
    LETTER_CONTENT_PAGE_NUMBER_STROKE_COLOR: "#000000",
    /** 手紙コンテンツ表示のページ番号のストローク太さ */
    LETTER_CONTENT_PAGE_NUMBER_STROKE_THICKNESS: 1,
    /** 手紙コンテンツ表示の前へボタンのX座標オフセット */
    LETTER_CONTENT_PREV_BUTTON_X_OFFSET: -200,
    /** 手紙コンテンツ表示の前へボタンの色 */
    LETTER_CONTENT_PREV_BUTTON_COLOR: 0x5566dd,
    /** 手紙コンテンツ表示の前へボタンのテキスト */
    LETTER_CONTENT_PREV_BUTTON_TEXT: "＜",
    /** 手紙コンテンツ表示の前へボタンのフォントサイズ */
    LETTER_CONTENT_PREV_BUTTON_FONT_SIZE: "32px",
    /** 手紙コンテンツ表示の次へボタンのX座標オフセット */
    LETTER_CONTENT_NEXT_BUTTON_X_OFFSET: 200,
    /** 手紙コンテンツ表示の次へボタンの色 */
    LETTER_CONTENT_NEXT_BUTTON_COLOR: 0x5566dd,
    /** 手紙コンテンツ表示の次へボタンのテキスト */
    LETTER_CONTENT_NEXT_BUTTON_TEXT: "＞",
    /** 手紙コンテンツ表示の次へボタンのフォントサイズ */
    LETTER_CONTENT_NEXT_BUTTON_FONT_SIZE: "32px",

    /** トップバーの高さ */
    TOP_BAR_HEIGHT: 120,
    /** トップバーの背景色 */
    TOP_BAR_COLOR: 0x000000,
    /** トップバーの背景透明度 */
    TOP_BAR_ALPHA: 0.7,
    /** トップバーの枠の色 */
    TOP_BAR_BORDER_COLOR: 0xffffff,
    /** トップバーの枠の太さ */
    TOP_BAR_BORDER_WIDTH: 2,
    /** トップバーのパディング */
    TOP_BAR_PADDING: 10,
    /** 一時停止ボタンの幅 */
    PAUSE_BUTTON_WIDTH: 120,
    /** 一時停止ボタンの高さ */
    PAUSE_BUTTON_HEIGHT: 80,
    /** アップグレードボタンの幅 */
    UPGRADE_BUTTON_WIDTH: 200,
    /** アップグレードボタンの高さ */
    UPGRADE_BUTTON_HEIGHT: 70,

    /** 一時停止モーダルの幅 */
    PAUSE_MODAL_WIDTH: 800,
    /** 一時停止モーダルの高さ */
    PAUSE_MODAL_HEIGHT: 500,
    /** 一時停止モーダルの背景色 */
    PAUSE_MODAL_BG_COLOR: 0x222222,
    /** 一時停止モーダルの背景透明度 */
    PAUSE_MODAL_BG_ALPHA: 0.95,
    /** 一時停止モーダルの枠の色 */
    PAUSE_MODAL_BORDER_COLOR: 0xffffff,
    /** 一時停止モーダルの枠の太さ */
    PAUSE_MODAL_BORDER_WIDTH: 4,
    /** 一時停止モーダルのオーバーレイの色 */
    PAUSE_MODAL_OVERLAY_COLOR: 0x000000,
    /** 一時停止モーダルのオーバーレイの透明度 */
    PAUSE_MODAL_OVERLAY_ALPHA: 0.7,
    /** 一時停止モーダルのタイトルの色 */
    PAUSE_MODAL_TITLE_COLOR: "#ffff00",
    /** 一時停止モーダルのタイトルのストローク色 */
    PAUSE_MODAL_TITLE_STROKE_COLOR: "#000000",
    /** 一時停止モーダルのタイトルのストローク太さ */
    PAUSE_MODAL_TITLE_STROKE_THICKNESS: 1,
    /** 一時停止モーダルのタイトルのフォントサイズ */
    PAUSE_MODAL_TITLE_FONT_SIZE: "40px",
    /** 一時停止モーダルのタイトルのY座標オフセット */
    PAUSE_MODAL_TITLE_Y_OFFSET: 40,
    /** 一時停止モーダルのクローズボタンのフォントサイズ */
    PAUSE_MODAL_CLOSE_BUTTON_FONT_SIZE: "48px",
    /** 一時停止モーダルのクローズボタンの色 */
    PAUSE_MODAL_CLOSE_BUTTON_COLOR: "#ffffff",
    /** 一時停止モーダルのクローズボタンの色（ホバー） */
    PAUSE_MODAL_CLOSE_BUTTON_HOVER_COLOR: "#ff0000",
    /** 一時停止モーダルのクローズボタンのストローク色 */
    PAUSE_MODAL_CLOSE_BUTTON_STROKE_COLOR: "#000000",
    /** 一時停止モーダルのクローズボタンのストローク太さ */
    PAUSE_MODAL_CLOSE_BUTTON_STROKE_THICKNESS: 2,
    /** 一時停止モーダルのクローズボタンのX座標オフセット */
    PAUSE_MODAL_CLOSE_BUTTON_X_OFFSET: 40,
    /** 一時停止モーダルのクローズボタンのY座標オフセット */
    PAUSE_MODAL_CLOSE_BUTTON_Y_OFFSET: 40,
    /** 一時停止モーダルの設定項目の行高 */
    PAUSE_MODAL_LINE_HEIGHT: 50,
    /** 一時停止モーダルの設定項目の最初のY座標オフセット */
    PAUSE_MODAL_SETTINGS_START_Y_OFFSET: 120,
    /** 一時停止モーダルの設定項目のX座標オフセット */
    PAUSE_MODAL_SETTINGS_X_OFFSET: 60,
    /** 一時停止モーダルの設定テキストのフォントサイズ */
    PAUSE_MODAL_SETTINGS_FONT_SIZE: "36px",
    /** 一時停止モーダルの設定テキストの色 */
    PAUSE_MODAL_SETTINGS_TEXT_COLOR: "#ffffff",
    /** 一時停止モーダルの設定テキストのストローク色 */
    PAUSE_MODAL_SETTINGS_STROKE_COLOR: "#000000",
    /** 一時停止モーダルの設定テキストのストローク太さ */
    PAUSE_MODAL_SETTINGS_STROKE_THICKNESS: 1,
    /** 一時停止モーダルの設定テキスト（ホバー）の色 */
    PAUSE_MODAL_SETTINGS_HOVER_COLOR: "#ffff00",
    /** 一時停止モーダルの再開ボタンの幅 */
    PAUSE_MODAL_RESUME_BUTTON_WIDTH: 200,
    /** 一時停止モーダルの再開ボタンの高さ */
    PAUSE_MODAL_RESUME_BUTTON_HEIGHT: 80,
    /** 一時停止モーダルの再開ボタンの色 */
    PAUSE_MODAL_RESUME_BUTTON_COLOR: 0x00cc00,
    /** 一時停止モーダルの再開ボタンの色（ホバー） */
    PAUSE_MODAL_RESUME_BUTTON_HOVER_COLOR: 0x00ff00,
    /** 一時停止モーダルの再開ボタンの枠の色 */
    PAUSE_MODAL_RESUME_BUTTON_BORDER_COLOR: 0xffffff,
    /** 一時停止モーダルの再開ボタンの枠の太さ */
    PAUSE_MODAL_RESUME_BUTTON_BORDER_WIDTH: 2,
    /** 一時停止モーダルの再開ボタンのテキストのフォントサイズ */
    PAUSE_MODAL_RESUME_BUTTON_TEXT_FONT_SIZE: "36px",
    /** 一時停止モーダルの再開ボタンのテキストの色 */
    PAUSE_MODAL_RESUME_BUTTON_TEXT_COLOR: "#ffffff",
    /** 一時停止モーダルの再開ボタンのテキストのストローク太さ */
    PAUSE_MODAL_RESUME_BUTTON_TEXT_STROKE_THICKNESS: 2,
    /** 一時停止モーダルの再開ボタンのY座標オフセット */
    PAUSE_MODAL_RESUME_BUTTON_Y_OFFSET: 80,
    /** 一時停止モーダルのセーブボタンの幅 */
    PAUSE_MODAL_SAVE_BUTTON_WIDTH: 200,
    /** 一時停止モーダルのセーブボタンの高さ */
    PAUSE_MODAL_SAVE_BUTTON_HEIGHT: 80,
    /** 一時停止モーダルのセーブボタンの色 */
    PAUSE_MODAL_SAVE_BUTTON_COLOR: 0x3366ff,
    /** 一時停止モーダルのセーブボタンの色（ホバー） */
    PAUSE_MODAL_SAVE_BUTTON_HOVER_COLOR: 0x5588ff,
    /** 一時停止モーダルのセーブボタンの枠の色 */
    PAUSE_MODAL_SAVE_BUTTON_BORDER_COLOR: 0xffffff,
    /** 一時停止モーダルのセーブボタンの枠の太さ */
    PAUSE_MODAL_SAVE_BUTTON_BORDER_WIDTH: 2,
    /** 一時停止モーダルのセーブボタンのテキストのフォントサイズ */
    PAUSE_MODAL_SAVE_BUTTON_TEXT_FONT_SIZE: "36px",
    /** 一時停止モーダルのセーブボタンのテキストの色 */
    PAUSE_MODAL_SAVE_BUTTON_TEXT_COLOR: "#ffffff",
    /** 一時停止モーダルのセーブボタンのテキストのストローク太さ */
    PAUSE_MODAL_SAVE_BUTTON_TEXT_STROKE_THICKNESS: 2,
    /** 一時停止モーダルのセーブボタンのY座標オフセット */
    PAUSE_MODAL_SAVE_BUTTON_Y_OFFSET: 120,

    /** スライダーの幅 */
    SLIDER_WIDTH: 300,
    /** スライダーつまみの半径 */
    SLIDER_HANDLE_RADIUS: 24,
    /** スライダーつまみのX座標オフセット（ラベルの右側） */
    SLIDER_HANDLE_OFFSET_X: 340,
    /** スライダーパーセンテージ表示のX座標オフセット（ラベルの右側） */
    SLIDER_PERCENT_OFFSET_X: 520,

    /** アップグレードモーダルの幅 */
    UPGRADE_MODAL_WIDTH: 900,
    /** アップグレードモーダルの高さ */
    UPGRADE_MODAL_HEIGHT: 600,

    /** モーダル表示のデプス値 */
    MODAL_DEPTH: 2000,
    /** オーバーレイのデプス値 */
    OVERLAY_DEPTH: 1999,

    /** 魚ヒットインジケーターのY座標オフセット（プレイヤー位置からの相対値） */
    FISH_HIT_INDICATOR_Y_OFFSET: -160,

    /** プレイヤーアニメーションの最小遅延時間（ミリ秒） */
    PLAYER_ANIMATION_DELAY_MIN: 2000,
    /** プレイヤーアニメーションの最大遅延時間（ミリ秒） */
    PLAYER_ANIMATION_DELAY_MAX: 5000,

    /** ゲームオーバーへの遷移遅延時間（ミリ秒） */
    GAME_OVER_DELAY: 2000,

    /** アップグレードボタンのX座標オフセット */
    UPGRADE_BUTTON_X_OFFSET: 120,

    /** トップバー: セクション間の境界マージン */
    TOP_BAR_SECTION_MARGIN: 20,
    /** トップバー: 一時停止ボタンの外枠の色 */
    TOP_BAR_PAUSE_BUTTON_OUTER_COLOR: 0x1e3a8a,
    /** トップバー: 一時停止ボタンの内側の色 */
    TOP_BAR_PAUSE_BUTTON_INNER_COLOR: 0x3b82f6,
    /** トップバー: 一時停止ボタンの内側のサイズオフセット */
    TOP_BAR_PAUSE_BUTTON_INNER_OFFSET: 6,
    /** トップバー: 一時停止アイコンの線の幅 */
    TOP_BAR_PAUSE_ICON_WIDTH: 10,
    /** トップバー: 一時停止アイコンの線の高さ */
    TOP_BAR_PAUSE_ICON_HEIGHT: 40,
    /** トップバー: 一時停止アイコンの線の間隔 */
    TOP_BAR_PAUSE_ICON_GAP: 10,
    /** トップバー: 一時停止アイコンの色 */
    TOP_BAR_PAUSE_ICON_COLOR: 0xffffff,
    /** トップバー: ボタン押下時のY座標オフセット */
    TOP_BAR_BUTTON_PRESS_OFFSET: 2,
    /** トップバー: ボタン押下後の復元遅延（ミリ秒） */
    TOP_BAR_BUTTON_PRESS_DELAY: 100,
    /** トップバー: 時間帯テキストのY座標オフセット（上） */
    TOP_BAR_TIME_PERIOD_TEXT_Y_OFFSET: 24,
    /** トップバー: 時間帯テキストのフォントサイズ（日本語） */
    TOP_BAR_TIME_PERIOD_FONT_SIZE_JP: "32px",
    /** トップバー: 時間帯テキストのフォントサイズ（英語） */
    TOP_BAR_TIME_PERIOD_FONT_SIZE_EN: "32px",
    /** トップバー: 時間帯バーのY座標オフセット（下） */
    TOP_BAR_TIME_LINE_Y_OFFSET: 15,
    /** トップバー: ステータス/コイン表示のX座標オフセット（アイコン） */
    TOP_BAR_STATUS_ICON_X_OFFSET: 55,
    /** トップバー: ステータス/コイン表示のX座標オフセット（テキスト） */
    TOP_BAR_STATUS_TEXT_X_OFFSET: 25,
    /** トップバー: ステータス/コインアイコンのスケール */
    TOP_BAR_STATUS_ICON_SCALE: 0.9,
    /** トップバー: ステータス/コインテキストのフォントサイズ */
    TOP_BAR_STATUS_TEXT_FONT_SIZE: "32px",
    /** トップバー: 日数/時刻テキストのフォントサイズ */
    TOP_BAR_DAY_TIME_FONT_SIZE: "32px",
    /** トップバー: 日数/時刻テキストのY座標オフセット（上段） */
    TOP_BAR_DAY_TIME_TOP_Y_OFFSET: 24,
    /** トップバー: 日数/時刻テキストのY座標オフセット（下段） */
    TOP_BAR_DAY_TIME_BOTTOM_Y_OFFSET: 24,
    /** トップバー: セクション境界線の上下マージン */
    TOP_BAR_SEPARATOR_MARGIN: 10,
    /** トップバー: セクション境界線の色 */
    TOP_BAR_SEPARATOR_COLOR: 0x666666,
    /** トップバー: セクション境界線の太さ */
    TOP_BAR_SEPARATOR_WIDTH: 2,
    /** トップバー: セクション境界線の透明度 */
    TOP_BAR_SEPARATOR_ALPHA: 0.6,
    /** トップバー: 時間帯バーの背景色 */
    TOP_BAR_TIME_LINE_BG_COLOR: 0x333333,
    /** トップバー: 時間帯バーの枠の色 */
    TOP_BAR_TIME_LINE_BORDER_COLOR: 0xffffff,
    /** トップバー: 時間帯バーの枠の太さ */
    TOP_BAR_TIME_LINE_BORDER_WIDTH: 2,
};

/**
 * UI テキスト定数（多言語対応）
 */
export const UI_TEXT = {
    /** アイテム詳細モーダルのテキスト */
    ITEM_DETAIL: {
        QUANTITY: { JP: "数量: ", EN: "Quantity: " },
        RARITY: { JP: "レア度: ", EN: "Rarity: " },
        NO_DESCRIPTION: { JP: "説明なし", EN: "No description" },
        VALUE: { JP: "価値: ", EN: "Value: " },
        COIN: { JP: " コイン", EN: " Coins" },
        SELL_ONE_BUTTON: { JP: "1つ売る", EN: "Sell 1" },
        SELL_ALL_BUTTON: { JP: "すべて売る", EN: "Sell All" },
        USE_AS_BAIT_BUTTON: { JP: "餌にする", EN: "Bait" },
        REMOVE_BAIT_BUTTON: { JP: "餌を外す", EN: "No Bait" },
        CLOSE_BUTTON: { JP: "×", EN: "×" },
    },
    /** 手紙関連のテキスト */
    LETTER: {
        READ_BUTTON: { JP: "手紙を読む", EN: "Letters" },
        LETTER_PREFIX: { JP: "手紙 ", EN: "Letter " },
    },
    /** 一時停止モーダルのテキスト */
    PAUSE_MODAL: {
        TITLE: { JP: "設定", EN: "Settings" },
        BGM_VOLUME: { JP: "BGM", EN: "BGM" },
        SE_VOLUME: { JP: "SE", EN: "SE" },
        BACKGROUND_COLOR: { JP: "背景色の変化", EN: "Background Color" },
        PLAYER_ANIMATION: {
            JP: "プレイヤーアニメーション",
            EN: "Player Animation",
        },
        AUTO_FISHING: { JP: "釣り全自動化", EN: "Auto Fishing" },
        RESUME: { JP: "再開", EN: "Resume" },
        CLOSE: { JP: "閉じる", EN: "Close" },
        SETTINGS: { JP: "設定", EN: "Settings" },
        UPGRADE: { JP: "アップグレード", EN: "Upgrade" },
    },
    /** アップグレードモーダルのテキスト */
    UPGRADE_MODAL: {
        TITLE: { JP: "釣竿アップグレード", EN: "Rod Upgrade" },
        UPGRADE_BUTTON: { JP: "強化", EN: "Upgrade" },
        CANCEL_BUTTON: { JP: "キャンセル", EN: "Cancel" },
        NOT_ENOUGH_COINS: { JP: "コイン不足", EN: "Not Enough Coins" },
        MAX: { JP: "最大レベル到達", EN: "Max Level Reached" },
    },
    /** アップグレードモーダルのスタイル */
    UPGRADE_MODAL_STYLE: {
        WIDTH: 700,
        HEIGHT: 600,
        BACKGROUND_COLOR: 0x222222,
        BACKGROUND_ALPHA: 0.98,
        BORDER_WIDTH: 3,
        BORDER_COLOR: 0xffffff,
        OVERLAY_COLOR: 0x000000,
        OVERLAY_ALPHA: 0.7,
    },
    /** アップグレードモーダルのタイトルスタイル */
    UPGRADE_MODAL_TITLE_STYLE: {
        FONT_SIZE: "28px",
        COLOR: "#ffffff",
        STROKE: "#000000",
        STROKE_THICKNESS: 2,
        Y_OFFSET: 25,
    },
    /** アップグレードモーダルの項目スタイル */
    UPGRADE_MODAL_ITEM_STYLE: {
        START_Y_OFFSET: 140,
        HEIGHT: 160,
        SPACING: 28,
        BG_ALPHA: 0.3,
        BORDER_WIDTH: 2,
        NAME_FONT_SIZE: "32px",
        NAME_COLOR: "#ffffff",
        NAME_Y_OFFSET: 28,
        LEVEL_FONT_SIZE: "32px",
        LEVEL_COLOR: "#ffff88",
        LEVEL_Y_OFFSET: 28,
        DESC_FONT_SIZE: "28px",
        DESC_COLOR: "#cccccc",
        DESC_Y_OFFSET: 68,
        DESC_X_OFFSET: 44,
    },
    /** アップグレードモーダルのコスト表示スタイル */
    UPGRADE_MODAL_COST_STYLE: {
        ICON_RADIUS: 12,
        ICON_COLOR: 0xffd700,
        ICON_STROKE: 0xffaa00,
        FONT_SIZE: "32px",
        COLOR: "#ffd700",
        STROKE: "#000000",
        STROKE_THICKNESS: 2,
        Y_OFFSET: -28,
        ICON_X_OFFSET: 48,
        TEXT_X_OFFSET: 66,
    },
    /** アップグレードモーダルのボタンスタイル */
    UPGRADE_MODAL_BUTTON_STYLE: {
        WIDTH: 140,
        HEIGHT: 64,
        FONT_SIZE: "32px",
        COLOR: "#ffffff",
        STROKE: "#000000",
        STROKE_THICKNESS: 2,
        BORDER_WIDTH: 2,
        BORDER_COLOR: 0xffffff,
        X_OFFSET: -110,
        Y_OFFSET: -56,
    },
    /** アップグレードモーダルのキャンセルボタンスタイル */
    UPGRADE_MODAL_CANCEL_BUTTON_STYLE: {
        WIDTH: 200,
        HEIGHT: 64,
        FONT_SIZE: "32px",
        COLOR: "#ffffff",
        STROKE: "#000000",
        STROKE_THICKNESS: 2,
        BORDER_WIDTH: 2,
        BORDER_COLOR: 0xffffff,
        BACKGROUND_COLOR: 0x888888,
        HOVER_COLOR: 0xaaaaaa,
        Y_OFFSET: -56,
    },
    /** アップグレード項目の定義 */
    UPGRADE_ITEMS: [
        {
            id: "rarity",
            name: { JP: "レア魚の確率", EN: "Rare Fish Rate" },
            description: {
                JP: "レアな魚が釣れやすくなります",
                EN: "Increases rare fish catch rate",
            },
            maxLevel: 10,
            baseCost: 100,
            costMultiplier: 1.2, // 指数的増加: cost = baseCost * (multiplier ^ (level-1))
            gainCoins: 0,
            color: 0x3388ff,
            hoverColor: 0x66aaff,
        },
        {
            id: "hitTime",
            name: { JP: "ヒット猶予", EN: "Hit Time" },
            description: {
                JP: "魚のヒット時間が延長されます",
                EN: "Extends fish hit time window",
            },
            maxLevel: 10,
            baseCost: 120,
            costMultiplier: 1.2,
            gainCoins: 0,
            color: 0xff8833,
            hoverColor: 0xffaa66,
        },
    ],
    /** トップバーのテキスト */
    TOP_BAR: {
        PAUSE: { JP: "一時停止", EN: "Pause" },
        UPGRADE: { JP: "アップグレード", EN: "Upgrade" },
        DAY_PREFIX: "DAY ",
        TIME_SEPARATOR: ":",
        INITIAL_COIN_COUNT: "0",
    },
};
