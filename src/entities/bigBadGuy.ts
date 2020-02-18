import SceneBase from "../scenes/SceneBase";
import KillableEntity from "./killableEntity";
import IPhysics from "./IPhysics";
import { DEPTH_VALUES } from "../constants";

enum BigBadGuyState {
    Strafing,
    Charging,
    Paused,
}

export default class BigBadGuy extends KillableEntity implements IPhysics {
    private moveCounter: number = 0;
    private originalPos = { x: 0, y: 0 };
    private shootCounter: number = 600;
    private shootFromLeft: boolean;
    private currentState: BigBadGuyState = BigBadGuyState.Strafing;
    private stateCounter: number = 5000;

    constructor(scene: SceneBase, x: number, y: number) {
        super(scene, x, y, "bigBadGuy", 500);
        this.originalPos.x = x;
        this.originalPos.y = y;
        this.depth = DEPTH_VALUES.ENEMIES;
    }

    initPhysics(): void {
        (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    }

    update(time: number, delta: number): void {
        super.update(time, delta);
        switch (this.currentState) {
            case BigBadGuyState.Strafing:
                this.stateCounter -= delta;
                if (this.stateCounter <= 0) {
                    this.currentState = BigBadGuyState.Charging;
                    this.anims.play("bigbad_charging");
                    this.stateCounter = 1000;
                } else {
                    this.moveCounter += delta * 0.001;
                    this.setPosition(this.originalPos.x + Math.sin(this.moveCounter) * 100, this.originalPos.y);

                    this.shootCounter -= delta;
                    if (this.shootCounter <= 0) {
                        if (this.shootFromLeft) {
                            this.gameScene.createGreenBullet(this.x - 60, this.y + 30);
                            this.anims.play("bigbad_shootLeft");
                        } else {
                            this.gameScene.createGreenBullet(this.x + 60, this.y + 30);
                            this.anims.play("bigbad_shootRight");
                        }
                        this.shootFromLeft = !this.shootFromLeft;
                        this.shootCounter = 600;
                    }
                }

                break;
            case BigBadGuyState.Charging:
                this.stateCounter -= delta;
                if (this.stateCounter <= 0) {
                    let angle = 0;
                    for (let i = 0; i < 10; ++i) {
                        angle = ((Math.PI / 2) * i) / 10 + Math.PI * (5 / 4);
                        this.gameScene.createBullet(this.x, this.y, Math.cos(angle) * 500, Math.sin(angle) * -500);
                    }
                    this.currentState = BigBadGuyState.Paused;
                    this.stateCounter = 1000;
                    this.anims.play("bigbad_idle");
                }
                break;
            case BigBadGuyState.Paused:
                this.stateCounter -= delta;
                if (this.stateCounter <= 0) {
                    this.currentState = BigBadGuyState.Strafing;
                    this.stateCounter = 5000;
                }
                break;
        }
    }

    damage(amount: number): void {
        super.damage(amount);
        this.flashTint(0xff0000, 250, true);
    }
}
