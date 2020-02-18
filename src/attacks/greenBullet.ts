import SceneBase from "../scenes/SceneBase";
import KillableEntity from "../entities/killableEntity";
import IPhysics from "../entities/IPhysics";

export default class GreenBullet extends Phaser.Physics.Arcade.Sprite implements IPhysics {
    private gameScene: SceneBase;
    private hitEntityHandler: ArcadePhysicsCallback;

    constructor(scene: SceneBase, x: number, y: number) {
        super(scene, x, y, "greenBullet");
        this.gameScene = scene;
        this.anims.play("greenBulletIdle");
        this.hitEntityHandler = this.hitEntity.bind(this);
    }

    initPhysics(): void {
        this.scene.physics.add.overlap(this, this.gameScene.playerGroup, this.hitEntityHandler);
        this.scene.physics.add.overlap(this, this.gameScene.terrainGroup, this.hitEntityHandler);
        (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
        this.setVelocityY(1000);
    }

    /*
     * Explode when touching players or terrain
     */
    hitEntity(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject): void {
        // create explosion
        this.gameScene.createExplosion(this.x, this.y);

        // damage players in range
        const bodies = this.scene.physics.overlapRect(this.x, this.y, 100, 100, true, false);
        bodies.forEach((body: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody) => {
            if (body.gameObject instanceof KillableEntity) {
                (body.gameObject as KillableEntity).damage(25);
            }
        });

        this.destroy();
    }
}
