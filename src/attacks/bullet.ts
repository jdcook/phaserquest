import { DEPTH_VALUES } from "../constants";
import IPhysics from "../entities/IPhysics";
import KillableEntity from "../entities/killableEntity";
import SceneBase from "../scenes/SceneBase";

export default class Bullet extends Phaser.Physics.Arcade.Sprite implements IPhysics {
    private readonly DAMAGE = 5;
    private gameScene: SceneBase;
    private hitEntityHandler: ArcadePhysicsCallback;

    constructor(scene: SceneBase, x: number, y: number) {
        super(scene, x, y, "bullet");
        this.gameScene = scene;
        this.anims.play("bulletIdle");
        this.hitEntityHandler = this.hitEntity.bind(this);
        this.depth = DEPTH_VALUES.PROJECTILES;
    }

    initPhysics(): void {
        this.scene.physics.add.overlap(this, this.gameScene.playerGroup, this.hitEntityHandler);
        this.scene.physics.add.overlap(this, this.gameScene.terrainGroup, this.hitEntityHandler);
        (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    }

    /*
     * Explode when touching players or terrain
     */
    hitEntity(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject): void {
        const other = obj1 === this ? obj2 : obj1;

        // create explosion
        this.gameScene.createExplosion(this.x, this.y, 1);

        if (other instanceof KillableEntity) {
            (other as KillableEntity).damage(this.DAMAGE);
        }

        this.destroy();
    }
}
