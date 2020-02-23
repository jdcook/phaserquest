import Bullet from "../attacks/bullet";
import GreenBullet from "../attacks/greenBullet";
import { COLORS, DEPTH_VALUES } from "../constants";
import SceneBase from "../scenes/SceneBase";
import IPhysicsEntity from "./IPhysicsEntity";
import KillableEntity from "./killableEntity";

enum BigBadGuyState {
    Strafing,
    Charging,
    Paused,
}

const BULLET_OFFSET = {
    x: 60,
    y: 30,
};
const MIN_STRAFE_MILLIS = 3000;
const MAX_STRAFE_MILLIS = 6000;
const SHOOT_INTERVAL = 600;
const MOVE_TIME_MULT = 0.001;
const MOVE_SIN_AMPLITUDE = 100;
const BULLET_SPRAY_NUM = 10;
const BULLET_SPRAY_ANGLE = Math.PI / 2;
const ANGLE_DOWN = Math.PI * (3 / 2);
const BULLET_SPRAY_ANGLE_OFFSET = ANGLE_DOWN - BULLET_SPRAY_ANGLE / 2;
const BULLET_SPRAY_SPEED = 500;
const FLASH_MILLIS = 250;
const UPDATE_RADIUS = 600;
export default class BigBadGuy extends KillableEntity implements IPhysicsEntity {
    private moveCounter = 0;
    private originalPos = { x: 0, y: 0 };
    private shootCounter: number;
    private shootFromLeft: boolean;
    private currentState: BigBadGuyState = BigBadGuyState.Strafing;
    private stateCounter: number;
    private audioSingleShot: Phaser.Sound.BaseSound;
    private audioMultiShot: Phaser.Sound.BaseSound;

    constructor(scene: SceneBase, x: number, y: number) {
        super(scene, x, y, "bigBadGuy");
        this.health = 500;
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

        this.stateCounter = Phaser.Math.Between(MIN_STRAFE_MILLIS, MAX_STRAFE_MILLIS);
        this.shootCounter = SHOOT_INTERVAL;
    }

    initPhysics(): void {
        (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    }

    update(time: number, delta: number): void {
        if (Math.abs(this.x - this.gameScene.player.x) > UPDATE_RADIUS) {
            return;
        }

        super.update(time, delta);
        switch (this.currentState) {
            case BigBadGuyState.Strafing:
                this.stateCounter -= delta;
                if (this.stateCounter <= 0) {
                    this.currentState = BigBadGuyState.Charging;
                    this.anims.play("bigbad_charging");
                    this.stateCounter = 1000;
                } else {
                    this.moveCounter += delta;
                    this.setPosition(this.originalPos.x + Math.sin(this.moveCounter * MOVE_TIME_MULT) * MOVE_SIN_AMPLITUDE, this.originalPos.y);

                    this.shootCounter -= delta;
                    if (this.shootCounter <= 0) {
                        this.audioSingleShot.play({ volume: 0.25 });
                        if (this.shootFromLeft) {
                            this.gameScene.addToPhysicsGroup(
                                new GreenBullet(this.gameScene, this.x - BULLET_OFFSET.x, this.y + BULLET_OFFSET.y),
                                this.gameScene.enemyProjectilesGroup
                            );
                            this.anims.play("bigbad_shootLeft");
                        } else {
                            this.gameScene.addToPhysicsGroup(
                                new GreenBullet(this.gameScene, this.x + BULLET_OFFSET.x, this.y + BULLET_OFFSET.y),
                                this.gameScene.enemyProjectilesGroup
                            );
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
                    let angle;
                    for (let i = 0; i < BULLET_SPRAY_NUM; ++i) {
                        angle = i * (BULLET_SPRAY_ANGLE / BULLET_SPRAY_NUM) + BULLET_SPRAY_ANGLE_OFFSET;
                        this.gameScene.addToPhysicsGroup(
                            new Bullet(
                                this.gameScene,
                                this.x,
                                this.y,
                                new Phaser.Math.Vector2(Math.cos(angle) * BULLET_SPRAY_SPEED, Math.sin(angle) * -BULLET_SPRAY_SPEED)
                            ),
                            this.gameScene.enemyProjectilesGroup
                        );
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
                    this.stateCounter = Phaser.Math.Between(MIN_STRAFE_MILLIS, MAX_STRAFE_MILLIS);
                }
                break;
        }
    }
    damage(amount: number): void {
        super.damage(amount);
        this.flashTint(COLORS.RED, FLASH_MILLIS, true);
    }
}
