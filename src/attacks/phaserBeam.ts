import { DEPTH_VALUES } from "../constants";
import SceneBase from "../scenes/SceneBase";

export default class PhaserBeam extends Phaser.GameObjects.Sprite {
    private gameScene: SceneBase;
    private readonly SCALE: number = 2;
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

        // raycast to see how long this should be
        this.raycastLine.setTo(startPosition.x, startPosition.y, startPosition.x + direction.x * 1000, startPosition.y + direction.y * 1000);
        const hitResults = this.gameScene.rayCast(this.raycastLine, this.gameScene.enemyGroup);
        let phaserLen;

        // if hit something, only go to the hit entity
        if (hitResults.length) {
            let hitEntity = null;
            phaserLen = Number.MAX_VALUE;
            for (let i = 0; i < hitResults.length; ++i) {
                for (let j = 0; j < hitResults[i].intersectionPoints.length; ++j) {
                    const vector = hitResults[i].intersectionPoints[j];
                    // use distance squared to avoid unnecessary square roots, calculate actual distance once we find the closest point
                    const distSq = startPosition.distanceSq(vector);
                    if (distSq < phaserLen) {
                        phaserLen = distSq;
                        hitEntity = hitResults[i].hitGameObject;
                    }
                }
            }

            // get the real distance
            phaserLen = Math.sqrt(phaserLen);
            if (hitEntity) {
                // todo: damage entity
                // spawn particle system on hit
            }
        } else {
            // if hit nothing, continue past the edge of the screen
            phaserLen = 2000;
        }

        const halfPhaserLen = phaserLen / 2;

        this.setPosition(startPosition.x + direction.x * halfPhaserLen, startPosition.y + direction.y * halfPhaserLen);
        this.setScale(halfPhaserLen * this.SCALE, 1);
        const radians = Math.atan2(diff.y, diff.x);
        this.setRotation(radians);
    }

    stopFiring(): void {
        if (this.firing) {
            this.audioPhaser.stop();
        }
        this.firing = false;
        this.visible = false;
    }
}
