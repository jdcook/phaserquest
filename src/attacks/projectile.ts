import { DEPTH_VALUES } from "../constants";
import IPhysicsEntity from "../entities/IPhysicsEntity";
import KillableEntity from "../entities/killableEntity";
import SceneBase from "../scenes/SceneBase";

const LIFE_MILLIS = 3000;
export default class Projectile extends Phaser.Physics.Arcade.Sprite implements IPhysicsEntity {
    protected gameScene: SceneBase;
    protected damage: number;
    protected lifeCounter: number = LIFE_MILLIS;
    protected isPlayerFaction: boolean;
    private hitEntityHandler: ArcadePhysicsCallback;
    private initialVel: Phaser.Math.Vector2;

    constructor(scene: SceneBase, x: number, y: number, texture: string, damage: number, initialVel: Phaser.Math.Vector2, isPlayerFaction: boolean) {
        super(scene, x, y, texture);
        this.damage = damage;
        this.initialVel = initialVel;
        this.isPlayerFaction = isPlayerFaction;
        this.depth = DEPTH_VALUES.PROJECTILES;
    }

    initPhysics(): void {
        this.scene.physics.add.overlap(this, this.isPlayerFaction ? this.gameScene.enemyGroup : this.gameScene.playerGroup, this.hitEntityHandler);
        this.scene.physics.add.overlap(this, this.gameScene.terrainGroup, this.hitEntityHandler);
        (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
        this.setVelocity(this.initialVel.x, this.initialVel.y);
    }

    update(time: number, delta: number): void {
        this.lifeCounter -= delta;
        if (this.lifeCounter <= 0) {
            this.destroy();
        }
    }

    hitEntity(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject): void {
        const other = obj1 === this ? obj2 : obj1;
        if (other instanceof KillableEntity) {
            other.damage(this.damage);
        }
        this.destroy();
    }
}
