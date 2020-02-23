import IPhysics from "../entities/IPhysics";
import Player from "../entities/player";
import SceneBase from "../scenes/SceneBase";

export enum PowerUpType {
    Phaser = 0,
    ChargeShot = 1,
    Minigun = 2,
}
export const NUM_POWERUP_TYPES = Object.keys(PowerUpType).length / 2;

export default class PowerUp extends Phaser.Physics.Arcade.Sprite implements IPhysics {
    private readonly TYPE_SWITCH_INTERVAL = 1000;
    private readonly VEL_X = 30;
    private readonly VEL_Y = 30;

    private gameScene: SceneBase;
    private currentPowerupType: PowerUpType;
    private hitPlayerHandler: ArcadePhysicsCallback;
    private stateCounter: number = this.TYPE_SWITCH_INTERVAL;

    constructor(scene: SceneBase, x: number, y: number) {
        super(scene, x, y, "powerUp");
        this.gameScene = scene;
        this.hitPlayerHandler = this.hitPlayer.bind(this);
        this.currentPowerupType = PowerUpType.Phaser;
        this.anims.play("powerup0");
        scene.tweens.add({
            targets: this,
            scale: { from: 1, to: 1.1 },
            ease: "Power1",
            duration: 500,
            repeat: -1,
            yoyo: true,
        });
    }

    initPhysics(): void {
        this.scene.physics.add.overlap(this, this.gameScene.playerGroup, this.hitPlayerHandler);
        this.setVelocity(this.VEL_X, this.VEL_Y);
    }

    update(time: number, delta: number): void {
        this.stateCounter -= delta;
        if (this.stateCounter <= 0) {
            this.currentPowerupType = (this.currentPowerupType + 1) % NUM_POWERUP_TYPES;
            this.stateCounter = this.TYPE_SWITCH_INTERVAL;
            this.anims.play(`powerup${this.currentPowerupType}`);
        }
    }

    hitPlayer(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject): void {
        const player = obj1 === this ? obj2 : obj1;
        if (player instanceof Player) {
            player.powerUp(this.currentPowerupType);
            this.destroy();
        }
    }
}
