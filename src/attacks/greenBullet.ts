import KillableEntity from "../entities/killableEntity";
import SceneBase from "../scenes/SceneBase";
import Projectile from "./projectile";

const Y_VEL = 1000;
const EXPLOSION_SPRITE_SCALE = 2;
const EXPLOSION_SIZE = 100;
const EXPLOSION_DAMAGE = 25;

export default class GreenBullet extends Projectile {
    constructor(scene: SceneBase, x: number, y: number) {
        super(scene, x, y, "greenBullet", 0, new Phaser.Math.Vector2(0, Y_VEL), false);
        this.anims.play("greenBulletIdle");
    }

    /*
     * Explode when touching players or terrain
     */
    hitEntity(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject): void {
        // create explosion
        this.gameScene.createExplosion(this.x, this.y, EXPLOSION_SPRITE_SCALE);

        // damage players in range
        const bodies = this.scene.physics.overlapRect(this.x, this.y, EXPLOSION_SIZE, EXPLOSION_SIZE, true, false);
        bodies.forEach((body: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody) => {
            if (body.gameObject instanceof KillableEntity) {
                (body.gameObject as KillableEntity).damage(EXPLOSION_DAMAGE);
            }
        });

        this.destroy();
    }
}
