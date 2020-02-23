import { DEPTH_VALUES } from "../constants";
import SceneBase from "../scenes/SceneBase";
import IPhysicsEntity from "./IPhysicsEntity";

enum TowerState {
    Idle,
    Activating,
    Charging,
    PausedCharging,
}

export default class Tower extends Phaser.Physics.Arcade.Sprite implements IPhysicsEntity {
    private readonly ACTIVATE_RADIUS: number = 150;
    private readonly SPRITE_SCALE = 2;
    private readonly EXPLOSION_SCALE = 4;
    private readonly ACTIVATE_MILLIS = 500;
    private readonly CHARGE_MILLIS = 5000;

    private currentState: TowerState = TowerState.Idle;
    private gameScene: SceneBase;
    private stateCounter: number;
    constructor(scene: SceneBase, x: number, y: number) {
        super(scene, x, y, "tower");
        this.gameScene = scene;
        this.scale = this.SPRITE_SCALE;
        this.depth = DEPTH_VALUES.FOREGROUND;
    }

    initPhysics(): void {}

    update(time: number, delta: number): void {
        switch (this.currentState) {
            case TowerState.Idle:
                if (Math.abs(this.gameScene.player.x - this.x) < this.ACTIVATE_RADIUS) {
                    this.anims.play("towerActivate", true);
                    this.stateCounter = this.ACTIVATE_MILLIS;
                    this.currentState = TowerState.Activating;
                }
                break;
            case TowerState.Activating:
                this.stateCounter -= delta;
                if (this.stateCounter <= 0) {
                    this.currentState = TowerState.Charging;
                    this.stateCounter = this.CHARGE_MILLIS;
                }
                break;
            case TowerState.Charging:
                if (Math.abs(this.gameScene.player.x - this.x) < this.ACTIVATE_RADIUS) {
                    this.anims.play("towerPulse", true);
                    this.stateCounter -= delta;
                    if (this.stateCounter <= 0) {
                        this.gameScene.createExplosion(this.x, this.y, this.EXPLOSION_SCALE);
                        this.gameScene.createPowerup(this.x, this.y);
                        this.destroy();
                    }
                } else {
                    this.anims.pause();
                }
                break;
        }
    }
}
