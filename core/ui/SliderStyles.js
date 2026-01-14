/**
 * スライダースタイル定義
 * ゲーム別にカスタムスタイルを定義するための基盤
 */

/**
 * デフォルトスタイル
 */
export const DEFAULT_SLIDER_STYLE = {
    barBackgroundColor: 0x444444,
    barBorderColor: 0xffffff,
    barBorderWidth: 2,
    barHeight: 20,
    labelFontSize: "24px",
    labelColor: "#ffffff",
    labelStroke: "#000000",
    labelStrokeThickness: 1,
    percentFontSize: "20px",
    percentColor: "#ffffff",
    percentStroke: "#000000",
    percentStrokeThickness: 1,
    handleStrokeColor: 0xffffff,
    handleStrokeWidth: 2,
};

/**
 * ダークテーマスタイル
 */
export const DARK_SLIDER_STYLE = {
    barBackgroundColor: 0x1a1a1a,
    barBorderColor: 0x333333,
    barBorderWidth: 1,
    barHeight: 16,
    labelFontSize: "20px",
    labelColor: "#cccccc",
    labelStroke: "#000000",
    labelStrokeThickness: 1,
    percentFontSize: "18px",
    percentColor: "#cccccc",
    percentStroke: "#000000",
    percentStrokeThickness: 1,
    handleStrokeColor: 0x666666,
    handleStrokeWidth: 1,
};

/**
 * ブライトテーマスタイル
 */
export const BRIGHT_SLIDER_STYLE = {
    barBackgroundColor: 0xeeeeee,
    barBorderColor: 0x0066ff,
    barBorderWidth: 2,
    barHeight: 24,
    labelFontSize: "24px",
    labelColor: "#0066ff",
    labelStroke: "#ffffff",
    labelStrokeThickness: 2,
    percentFontSize: "20px",
    percentColor: "#0066ff",
    percentStroke: "#ffffff",
    percentStrokeThickness: 2,
    handleStrokeColor: 0x0066ff,
    handleStrokeWidth: 3,
};

/**
 * 警告色スタイル（例：ボリュームが低い場合）
 */
export const WARNING_SLIDER_STYLE = {
    barBackgroundColor: 0x663333,
    barBorderColor: 0xff6666,
    barBorderWidth: 2,
    barHeight: 20,
    labelFontSize: "24px",
    labelColor: "#ff6666",
    labelStroke: "#000000",
    labelStrokeThickness: 2,
    percentFontSize: "20px",
    percentColor: "#ff6666",
    percentStroke: "#000000",
    percentStrokeThickness: 2,
    handleStrokeColor: 0xff6666,
    handleStrokeWidth: 2,
};

/**
 * 成功色スタイル（例：ボリュームが高い場合）
 */
export const SUCCESS_SLIDER_STYLE = {
    barBackgroundColor: 0x336633,
    barBorderColor: 0x66ff66,
    barBorderWidth: 2,
    barHeight: 20,
    labelFontSize: "24px",
    labelColor: "#66ff66",
    labelStroke: "#000000",
    labelStrokeThickness: 2,
    percentFontSize: "20px",
    percentColor: "#66ff66",
    percentStroke: "#000000",
    percentStrokeThickness: 2,
    handleStrokeColor: 0x66ff66,
    handleStrokeWidth: 2,
};
