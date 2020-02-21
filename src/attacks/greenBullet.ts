import { DEPTH_VALUES } from "../constants";
import IPhysics from "../entities/IPhysics";
import KillableEntity from "../entities/killableEntity";
import SceneBase from "../scenes/SceneBase";

export default class GreenBullet extends Phaser.Physics.Arcade.Sprite implements IPhysics {
    private readonly Y_VEL = 1000;
    private readonly EXPLOSION_SPRITE_SCALE = 2;
    private readonly EXPLOSION_SIZE = 100;
    private readonly EXPLOSION_DAMAGE = 25;
    private gameScene: SceneBase;
    private hitEntityHandler: ArcadePhysicsCallback;

    constructor(scene: SceneBase, x: number, y: number) {
        super(scene, x, y, "greenBullet");
        this.gameScene = scene;
        this.anims.play("greenBulletIdle");
        this.hitEntityHandler = this.hitEntity.bind(this);
        this.depth = DEPTH_VALUES.PROJECTILES;
    }

    initPhysics(): void {
        this.scene.physics.add.overlap(this, this.gameScene.playerGroup, this.hitEntityHandler);
        this.scene.physics.add.overlap(this, this.gameScene.terrainGroup, this.hitEntityHandler);
        (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
        this.setVelocityY(this.Y_VEL);
    }

    /*
     * Explode when touching players or terrain
     */
    hitEntity(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject): void {
        // create explosion
        this.gameScene.createExplosion(this.x, this.y, this.EXPLOSION_SPRITE_SCALE);

        // damage players in range
        const bodies = this.scene.physics.overlapRect(this.x, this.y, this.EXPLOSION_SIZE, this.EXPLOSION_SIZE, true, false);
        bodies.forEach((body: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody) => {
            if (body.gameObject instanceof KillableEntity) {
                (body.gameObject as KillableEntity).damage(this.EXPLOSION_DAMAGE);
            }
        });

        this.destroy();
    }
}
