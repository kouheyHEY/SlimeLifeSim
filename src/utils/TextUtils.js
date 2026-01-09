/**
 * テキスト処理のユーティリティ関数
 */

/**
 * テキストを指定した幅に合わせて改行する
 * @param {Phaser.GameObjects.Text} textObject - Phaserのテキストオブジェクト
 * @param {string} text - 改行するテキスト
 * @param {number} maxWidth - 最大幅（ピクセル）
 * @returns {string} 改行が挿入されたテキスト
 */
export function wrapText(textObject, text, maxWidth) {
    // 一時的にテキストを設定してサイズを測定
    const lines = [];
    const paragraphs = text.split("\n");

    for (const paragraph of paragraphs) {
        if (paragraph === "") {
            lines.push("");
            continue;
        }

        const words = paragraph.split("");
        let currentLine = "";

        for (let i = 0; i < words.length; i++) {
            const testLine = currentLine + words[i];
            textObject.setText(testLine);
            const metrics = textObject.getBounds();

            if (metrics.width > maxWidth && currentLine !== "") {
                lines.push(currentLine);
                currentLine = words[i];
            } else {
                currentLine = testLine;
            }
        }

        if (currentLine !== "") {
            lines.push(currentLine);
        }
    }

    return lines.join("\n");
}
