import SceneBase from "../scenes/SceneBase";

export default class BigBadGuy extends Phaser.Physics.Arcade.Sprite {
    private moveCounter: number = 0;
    private originalPos = { x: 0, y: 0 };

    constructor(scene: SceneBase, x, y) {
        super(scene, x, y, "bigBadGuy");
        this.originalPos.x = x;
        this.originalPos.y = y;
    }
    init(): void {
        // let scene call init after being added to physics group, so that we can access the body (not available in constructor)
        (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    }
    update(time, delta): void {
        this.moveCounter += delta * 0.001;
        this.setPosition(this.originalPos.x + Math.sin(this.moveCounter) * 100, this.originalPos.y);
    }
}
