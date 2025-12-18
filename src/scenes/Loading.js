export class Loading extends Phaser.Scene {
    constructor() {
        super("Loading");
    }
    init(params) {
        this.params = params;
    }
    preload() {}
    create() {
        this.scene.start("Game", this.params);
    }
}
