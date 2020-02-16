export default class BigBadGuy extends Phaser.Physics.Arcade.Sprite {
    private moveCounter: number = 0;
    private originalPos = { x: 0, y: 0 };

    constructor(scene, x, y) {
        super(scene, x, y, "bigBadGuy");
        this.originalPos.x = x;
        this.originalPos.y = y;
    }
    update(time, delta): void {
        this.moveCounter += delta * 0.001;
        this.setPosition(this.originalPos.x + Math.sin(this.moveCounter) * 100, this.originalPos.y);
    }
}
