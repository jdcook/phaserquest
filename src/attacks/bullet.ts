import SceneBase from "../scenes/SceneBase";
import Projectile from "./projectile";

const DAMAGE = 5;
export default class Bullet extends Projectile {
    constructor(scene: SceneBase, x: number, y: number, initialVel: Phaser.Math.Vector2) {
        super(scene, x, y, "bullet", DAMAGE, initialVel, false);
        this.anims.play("bulletIdle");
    }

    /*
     * Explode when touching players or terrain
     */
    hitEntity(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject): void {
        super.hitEntity(obj1, obj2);
        this.gameScene.createExplosion(this.x, this.y, 1);
        this.destroy();
    }
}
