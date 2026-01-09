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
    FISHING_RESULT_TEXT_FONT_SIZE: 32,
    /** 釣り結果テキストの色 */
    FISHING_RESULT_TEXT_COLOR: "#FFFFFF",
    /** 釣り結果テキストの文字列Y座標 */
    FISHING_RESULT_TEXT_Y: 40,
    /** 釣り結果の遷移用ボタン文字列 */
    FISHING_RESULT_BUTTON_TEXT: "OK",
    /** 釣り結果ボタンの幅 */
    FISHING_RESULT_BUTTON_WIDTH: 150,
    /** 釣り結果ボタンの高さ */
    FISHING_RESULT_BUTTON_HEIGHT: 50,
    /** 釣り結果ボタンの文字の大きさ */
    FISHING_RESULT_BUTTON_FONT_SIZE: 24,
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
    INVENTORY_ITEM_FRAME_SIZE: 96,
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
    INVENTORY_QUANTITY_FONT_SIZE: 16,
    /** インベントリのフォント色 */
    INVENTORY_FONT_COLOR: "#FFFFFF",
    /** インベントリに表示するアイテムのサイズ */
    INVENTORY_ITEM_DISPLAY_SIZE: 80,

    /** アイテム詳細モーダルの幅 */
    ITEM_DETAIL_WIDTH: 500,
    /** アイテム詳細モーダルの高さ */
    ITEM_DETAIL_HEIGHT: 600,
    /** アイテム詳細モーダルの背景色 */
    ITEM_DETAIL_BG_COLOR: 0x2a2a2a,
    /** アイテム詳細モーダルの枠色 */
    ITEM_DETAIL_BORDER_COLOR: 0xffffff,
    /** アイテム詳細モーダルの枠の太さ */
    ITEM_DETAIL_BORDER_WIDTH: 3,
    /** アイテム詳細のテクスチャサイズ */
    ITEM_DETAIL_TEXTURE_SIZE: 128,
    /** アイテム詳細のフォントサイズ */
    ITEM_DETAIL_FONT_SIZE: 20,
    /** アイテム詳細の説明フォントサイズ */
    ITEM_DETAIL_DESC_FONT_SIZE: 18,
    /** アイテム詳細のボタン幅 */
    ITEM_DETAIL_BUTTON_WIDTH: 120,
    /** アイテム詳細のボタン高さ */
    ITEM_DETAIL_BUTTON_HEIGHT: 50,

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
    TITLE_BUTTON_WIDTH: 300,
    /** タイトル画面のボタンの高さ */
    TITLE_BUTTON_HEIGHT: 60,
    /** タイトル画面のボタンの間隔 */
    TITLE_BUTTON_SPACING: 80,
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
    TITLE_BUTTON_TEXT_FONT_SIZE: "32px",
    /** タイトル画面のボタンのテキストの色 */
    TITLE_BUTTON_TEXT_COLOR: "#FFFFFF",
    /** タイトル画面のフェードアウトの時間（ミリ秒） */
    TITLE_FADE_DURATION: 1000,
    /** ゲームシーン初期化後、タイトルシーンを表示するまでの遅延（ミリ秒） */
    TITLE_SCENE_LAUNCH_DELAY: 50,
    /** ゲーム情報UIの幅 */
    GAME_INFO_WIDTH: 192,
    /** ゲーム情報UIの高さ */
    GAME_INFO_HEIGHT: 288,
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
    SIDEBAR_WIDTH: 240,
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
    LETTER_WINDOW_WIDTH: 700,
    /** 手紙表示ウィンドウの高さ */
    LETTER_WINDOW_HEIGHT: 500,
    /** 手紙表示ウィンドウの長方形の色 */
    LETTER_WINDOW_RECTANGLE_COLOR: 0x000000,
    /** 手紙表示ウィンドウの長方形の枠の色 */
    LETTER_WINDOW_RECTANGLE_LINE_COLOR: 0xffffff,
    /** 手紙表示ウィンドウの長方形の枠の太さ */
    LETTER_WINDOW_RECTANGLE_LINE_WIDTH: 2,
    /** 手紙テキストのフォントサイズ */
    LETTER_TEXT_FONT_SIZE: 24,
    /** 手紙テキストの色 */
    LETTER_TEXT_COLOR: "#FFFFFF",
    /** 手紙テキストのY座標 */
    LETTER_TEXT_Y: -230,
    /** 手紙テキストの行間 */
    LETTER_TEXT_LINE_SPACING: 40,
    /** 手紙テキストのテキスト最大幅 */
    LETTER_TEXT_MAX_WIDTH: 600,
    /** 手紙ウィンドウの閉じるボタンのテキスト */
    LETTER_CLOSE_BUTTON_TEXT: "OK",
    /** 手紙ウィンドウの閉じるボタンの幅 */
    LETTER_CLOSE_BUTTON_WIDTH: 150,
    /** 手紙ウィンドウの閉じるボタンの高さ */
    LETTER_CLOSE_BUTTON_HEIGHT: 50,
    /** 手紙ウィンドウの閉じるボタンのフォントサイズ */
    LETTER_CLOSE_BUTTON_FONT_SIZE: 24,
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
};
