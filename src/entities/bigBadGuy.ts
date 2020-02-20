import { DEPTH_VALUES } from "../constants";
import SceneBase from "../scenes/SceneBase";
import IPhysics from "./IPhysics";
import KillableEntity from "./killableEntity";

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
    private audioSingleShot: Phaser.Sound.BaseSound;
    private audioMultiShot: Phaser.Sound.BaseSound;

    constructor(scene: SceneBase, x: number, y: number) {
        super(scene, x, y, "bigBadGuy", 500);
        this.originalPos.x = x;
        this.originalPos.y = y;
        this.depth = DEPTH_VALUES.ENEMIES;

        this.audioSingleShot = this.scene.sound.add("audioSingleShot");
        this.audioMultiShot = this.scene.sound.add("audioMultiShot");

        scene.anims.create({
            key: "bigbad_idle",
            frames: [{ key: "bigBadGuy", frame: 0 }],
            frameRate: 1,
        });
        scene.anims.create({
            key: "bigbad_shootLeft",
            frames: scene.anims.generateFrameNumbers("bigBadGuy", { start: 0, end: 3 }),
            frameRate: 20,
            repeat: 0,
        });
        scene.anims.create({
            key: "bigbad_shootRight",
            frames: scene.anims.generateFrameNumbers("bigBadGuy", { start: 4, end: 7 }),
            frameRate: 20,
            repeat: 0,
        });
        scene.anims.create({
            key: "bigbad_destroyed",
            frames: [{ key: "bigBadGuy", frame: 1 }],
            frameRate: 8,
        });
        scene.anims.create({
            key: "bigbad_charging",
            frames: scene.anims.generateFrameNumbers("bigBadGuy", { start: 9, end: 10 }),
            frameRate: 8,
            repeat: -1,
        });

        this.stateCounter = Phaser.Math.Between(1000, 5000);
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
                        this.audioSingleShot.play({ volume: 0.25 });
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
                    this.audioMultiShot.play({ volume: 0.25 });
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
                    this.stateCounter = Phaser.Math.Between(1000, 5000);
                }
                break;
        }
    }

    damage(amount: number): void {
        super.damage(amount);
        this.flashTint(0xff0000, 250, true);
    }
}
