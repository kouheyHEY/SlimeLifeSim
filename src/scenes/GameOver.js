/**
 * ゲームオーバーシーン
 * プレイヤーの体力が尽きた時に表示
 */
export class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    /**
     * シーンの初期化
     * ゲームオーバー画面を表示
     */
    create() {
        this.background1 = this.add.image(0, 0, 'background').setOrigin(0);

        this.add.text(this.scale.width * 0.5, this.scale.height * 0.5, 'Game Over', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

    }
}
