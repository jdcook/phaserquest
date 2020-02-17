import { DEPTH_VALUES } from "../constants";
import SceneBase from "../scenes/SceneBase";
import KillableEntity from "../entities/killableEntity";

export default class PhaserBeam extends Phaser.GameObjects.Sprite {
    private readonly SCALE: number = 2;
    private readonly MAX_LEN: number = 2000;

    private gameScene: SceneBase;
    private firing: boolean;
    private audioPhaser: Phaser.Sound.BaseSound;
    private raycastLine: Phaser.Geom.Line;

    constructor(scene: SceneBase) {
        super(scene, 0, 0, "phaserBeam");
        this.gameScene = scene;
        this.visible = false;
        this.depth = DEPTH_VALUES.PROJECTILES;

        this.audioPhaser = this.scene.sound.add("audioPhaserBeam", {
            loop: true,
        });

        this.raycastLine = new Phaser.Geom.Line(0, 0, 1000, 1000);
    }

    startFiring(startPosition: Phaser.Math.Vector2, cursorPosition: Phaser.Math.Vector2): void {
        if (!this.firing) {
            this.firing = true;
            this.visible = true;
            this.audioPhaser.play();
        }

        const diff = new Phaser.Math.Vector2(cursorPosition);
        diff.subtract(startPosition);
        const direction = new Phaser.Math.Vector2(diff);
        direction.normalize();

        // raycast to see how long this should be. If no raycast hit is detected, continue past the edge of the screen
        let phaserLen = this.MAX_LEN;
        this.raycastLine.setTo(
            startPosition.x,
            startPosition.y,
            startPosition.x + direction.x * this.MAX_LEN,
            startPosition.y + direction.y * this.MAX_LEN
        );
        const hitResult = this.gameScene.raycastClosestHit(this.raycastLine, this.gameScene.enemyGroup);
        if (hitResult) {
            phaserLen = hitResult.distance;
            if (hitResult.hitGameObject) {
                // damage entity
                if (hitResult.hitGameObject instanceof KillableEntity) {
                    const killable = hitResult.hitGameObject as KillableEntity;
                    killable.damage(1);
                }
            }
        }

        const halfPhaserLen = phaserLen / 2;
        this.setPosition(startPosition.x + direction.x * halfPhaserLen, startPosition.y + direction.y * halfPhaserLen);
        this.setScale(halfPhaserLen * this.SCALE, 1);
        const radians = Math.atan2(diff.y, diff.x);
        this.setRotation(radians);

        // spawn particle system on edge of phaser
    }

    stopFiring(): void {
        if (this.firing) {
            this.audioPhaser.stop();
        }
        this.firing = false;
        this.visible = false;
    }
}
