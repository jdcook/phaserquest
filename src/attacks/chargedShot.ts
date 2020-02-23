import KillableEntity from "../entities/killableEntity";
import SceneBase from "../scenes/SceneBase";
import Projectile from "./projectile";

const NUM_CHARGE_LEVEL_SPRITES = 4;
export default class ChargedShot extends Projectile {
    constructor(scene: SceneBase, x: number, y: number, damage: number, initialVel: Phaser.Math.Vector2, chargeLevel: number) {
        super(scene, x, y, chargeLevel >= NUM_CHARGE_LEVEL_SPRITES ? "maxChargedShot" : "chargedShot", damage, initialVel, true);
    }

    hitEntity(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject): void {
        const other = obj1 === this ? obj2 : obj1;
        if (other instanceof KillableEntity) {
            other.damage(this.damage);
        }
    }
}
