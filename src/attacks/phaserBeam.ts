import { DEPTH_VALUES } from "../constants";
import KillableEntity from "../entities/killableEntity";
import SceneBase from "../scenes/SceneBase";

const SCALE = 2;
const MAX_LEN = 2000;
const DAMAGE_PER_LEVEL = 1;
export default class PhaserBeam extends Phaser.GameObjects.Sprite {
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

        this.raycastLine = new Phaser.Geom.Line();
    }

    startFiring(weaponLevel: number, startPosition: Phaser.Math.Vector2, cursorPosition: Phaser.Math.Vector2): void {
        if (!this.firing) {
            this.firing = true;
            this.visible = true;
            this.audioPhaser.play();
        }

        this.scaleY = weaponLevel;

        const diff = new Phaser.Math.Vector2(cursorPosition);
        diff.subtract(startPosition);
        const direction = new Phaser.Math.Vector2(diff);
        direction.normalize();

        // raycast to see how long this should be. If no raycast hit is detected, continue past the edge of the screen
        let phaserLen = MAX_LEN;
        this.raycastLine.setTo(startPosition.x, startPosition.y, startPosition.x + direction.x * MAX_LEN, startPosition.y + direction.y * MAX_LEN);
        const hitResult = this.gameScene.raycastClosestHit(this.raycastLine, this.gameScene.enemyGroup);
        if (hitResult) {
            phaserLen = hitResult.distance;
            if (hitResult.hitGameObject) {
                // damage entity
                if (hitResult.hitGameObject instanceof KillableEntity) {
                    const killable = hitResult.hitGameObject as KillableEntity;
                    killable.damage(weaponLevel * DAMAGE_PER_LEVEL);
                }
            }
        }

        const halfPhaserLen = phaserLen / 2;
        this.setPosition(startPosition.x + direction.x * halfPhaserLen, startPosition.y + direction.y * halfPhaserLen);

        this.scaleX = halfPhaserLen * SCALE;
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
