import { DEPTH_VALUES } from "../constants";

export default class PhaserBeam extends Phaser.GameObjects.Sprite {
    private readonly SCALE: number = 2;
    private firing: boolean;
    private audioPhaser: Phaser.Sound.BaseSound;

    constructor(scene) {
        super(scene, 0, 0, "phaserBeam");
        this.width;
        this.visible = false;
        this.depth = DEPTH_VALUES.PROJECTILES;

        this.audioPhaser = this.scene.sound.add("audioPhaserBeam", {
            loop: true,
        });
    }

    startFiring(startPosition: Phaser.Math.Vector2, cursorPosition: Phaser.Math.Vector2): void {
        if (!this.firing) {
            this.firing = true;
            this.visible = true;
            this.audioPhaser.play();
        }
        // raycast to see how long this should be
        let phaserLen;

        // if hit something, only go to the hit entity

        // if hit nothing, continue past the edge of the screen
        phaserLen = 2000;
        const halfPhaserLen = phaserLen / 2;

        const diff = new Phaser.Math.Vector2(cursorPosition);
        diff.subtract(startPosition);
        const direction = new Phaser.Math.Vector2(diff);
        direction.normalize();
        this.setPosition(startPosition.x + direction.x * halfPhaserLen, startPosition.y + direction.y * halfPhaserLen);
        this.setScale(halfPhaserLen * this.SCALE, 1);
        const radians = Math.atan2(diff.y, diff.x);
        this.setRotation(radians);

        // spawn particle system on hit
    }

    stopFiring(): void {
        if (this.firing) {
            this.audioPhaser.stop();
        }
        this.firing = false;
        this.visible = false;
    }
}
