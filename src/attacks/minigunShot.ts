import SceneBase from "../scenes/SceneBase";
import Projectile from "./projectile";

export default class MinigunShot extends Projectile {
    constructor(scene: SceneBase, x: number, y: number, damage: number, initialVel: Phaser.Math.Vector2) {
        super(scene, x, y, "minigunShot", damage, initialVel, true);
    }

    hitEntity(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject): void {
        super.hitEntity(obj1, obj2);
    }
}
