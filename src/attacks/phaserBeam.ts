import { DEPTH_VALUES } from "../constants";
import KillableEntity from "../entities/killableEntity";
import SceneBase from "../scenes/SceneBase";

export default class PhaserBeam extends Phaser.GameObjects.Sprite {
    private readonly SCALE: number = 2;
    private readonly MAX_LEN: number = 2000;

    private gameScene: SceneBase;
    private firing: boolean;
    private audioPhaser: Phaser.Sound.BaseSound;
    private raycastLine: Phaser.Geom.Line;
    private particles: Phaser.GameObjects.Particles.ParticleEmitter;

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
        if (!this.particles) {
            const particleManager = this.scene.add.particles("particleRed");
            particleManager.depth = DEPTH_VALUES.PARTICLES;
            this.particles = particleManager.createEmitter({
                blendMode: "ADD",
                frequency: 50,
                gravityY: 0,
                lifespan: { min: 200, max: 1000 },
                quantity: 1,
                scale: { start: 0.5, end: 0 },
                speed: 40,
            });
        }
        if (!this.particles.on) {
            this.particles.start();
            this.particles.speedX;
        }
        this.particles.setPosition(startPosition.x + direction.x * phaserLen, startPosition.y + direction.y * phaserLen);
    }

    stopFiring(): void {
        if (this.firing) {
            this.firing = false;
            this.visible = false;
            this.audioPhaser.stop();
            this.particles.stop();
        }
    }
}
