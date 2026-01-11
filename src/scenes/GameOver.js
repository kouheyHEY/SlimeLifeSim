/**
 * ゲームオーバーシーン
 * プレイヤーの体力が尽きた時に表示
 */
export class GameOver extends Phaser.Scene {
    constructor() {
        super("GameOver");
    }

    /**
     * シーンの初期化
     * ゲームオーバー画面を表示
     */
    create() {
        // 黒い背景オーバーレイ
        this.add
            .rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.8)
            .setOrigin(0);

        // Game Overテキスト
        this.add
            .text(
                this.scale.width * 0.5,
                this.scale.height * 0.5,
                "Game Over",
                {
                    fontFamily: "Arial Black",
                    fontSize: 64,
                    color: "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 8,
                    align: "center",
                }
            )
            .setOrigin(0.5);
    }
}
