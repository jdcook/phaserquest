import SceneBase from "../scenes/SceneBase";
import KillableEntity from "./killableEntity";

export default class BigBadGuy extends KillableEntity {
    private moveCounter: number = 0;
    private originalPos = { x: 0, y: 0 };

    constructor(scene: SceneBase, x: number, y: number) {
        super(scene, x, y, "bigBadGuy", 100);
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
