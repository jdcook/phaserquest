import SceneBase from "../scenes/SceneBase";
import Player from "./player";
import IPhysics from "./IPhysics";
import { DEPTH_VALUES } from "../constants";

export default class Tower extends Phaser.Physics.Arcade.Sprite implements IPhysics {
    private readonly ACTIVATE_RADIUS: number = 150;
    private gameScene: SceneBase;
    private activated: boolean = false;
    private stateCounter: number;
    constructor(scene: SceneBase, x: number, y: number) {
        super(scene, x, y, "tower");
        this.gameScene = scene;
        this.scale = 2;
        this.depth = DEPTH_VALUES.FOREGROUND;
    }

    initPhysics(): void {
        //(this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    }

    update(time: number, delta: number): void {
        if (!this.activated) {
            if (Math.abs(this.gameScene.player.x - this.x) < this.ACTIVATE_RADIUS) {
                this.activated = true;
                this.anims.play("towerActivate", true);
                this.stateCounter = 500;
            }
        } else {
            this.stateCounter -= delta;
            if (this.stateCounter <= 0) {
                if (Math.abs(this.gameScene.player.x - this.x) < this.ACTIVATE_RADIUS) {
                    this.anims.play("towerPulse", true);
                } else {
                    this.anims.pause();
                }
            }
        }
    }
}
