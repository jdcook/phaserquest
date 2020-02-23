import { DEPTH_VALUES } from "../constants";
import PowerUp from "../interactables/powerup";
import SceneBase from "../scenes/SceneBase";
import IPhysicsEntity from "./IPhysicsEntity";

enum TowerState {
    Idle,
    Activating,
    Charging,
    PausedCharging,
}

const ACTIVATE_RADIUS = 150;
const SPRITE_SCALE = 2;
const EXPLOSION_SCALE = 4;
const ACTIVATE_MILLIS = 500;
const CHARGE_MILLIS = 5000;
export default class Tower extends Phaser.Physics.Arcade.Sprite implements IPhysicsEntity {
    private currentState: TowerState = TowerState.Idle;
    private gameScene: SceneBase;
    private stateCounter: number;
    constructor(scene: SceneBase, x: number, y: number) {
        super(scene, x, y, "tower");
        this.gameScene = scene;
        this.scale = SPRITE_SCALE;
        this.depth = DEPTH_VALUES.FOREGROUND;
    }

    initPhysics(): void {}

    update(time: number, delta: number): void {
        switch (this.currentState) {
            case TowerState.Idle:
                if (Math.abs(this.gameScene.player.x - this.x) < ACTIVATE_RADIUS) {
                    this.anims.play("towerActivate", true);
                    this.stateCounter = ACTIVATE_MILLIS;
                    this.currentState = TowerState.Activating;
                }
                break;
            case TowerState.Activating:
                this.stateCounter -= delta;
                if (this.stateCounter <= 0) {
                    this.currentState = TowerState.Charging;
                    this.stateCounter = CHARGE_MILLIS;
                }
                break;
            case TowerState.Charging:
                if (Math.abs(this.gameScene.player.x - this.x) < ACTIVATE_RADIUS) {
                    this.anims.play("towerPulse", true);
                    this.stateCounter -= delta;
                    if (this.stateCounter <= 0) {
                        this.gameScene.createExplosion(this.x, this.y, EXPLOSION_SCALE);
                        this.gameScene.addToPhysicsGroup(new PowerUp(this.gameScene, this.x, this.y), this.gameScene.playerGroup);
                        this.destroy();
                    }
                } else {
                    this.anims.pause();
                }
                break;
        }
    }
}
