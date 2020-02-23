import KillableEntity from "../entities/killableEntity";
import SceneBase from "../scenes/SceneBase";
import Projectile from "./projectile";

export default class ChargedShot extends Projectile {
    constructor(scene: SceneBase, x: number, y: number, damage: number, initialVel: Phaser.Math.Vector2) {
        super(scene, x, y, "chargedShot", damage, initialVel, true);
    }

    hitEntity(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject): void {
        const other = obj1 === this ? obj2 : obj1;
        if (other instanceof KillableEntity) {
            other.damage(this.damage);
        }
    }
}
