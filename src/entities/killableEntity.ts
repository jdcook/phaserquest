import { COLORS } from "../constants";
import SceneBase from "../scenes/SceneBase";

export default class KillableEntity extends Phaser.Physics.Arcade.Sprite {
    protected gameScene: SceneBase;
    protected health: number;
    private flashCounter = 0;
    private flashColor: number;
    private flashMillis: number;

    getHealth(): number {
        return this.health;
    }

    constructor(scene: SceneBase, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        this.gameScene = scene;
        this.health = 100;
    }

    update(time: number, delta: number): void {
        super.update(time, delta);
        if (this.flashCounter > 0) {
            this.flashCounter -= delta;
            if (this.flashCounter <= 0) {
                this.flashCounter = 0;
                this.clearTint();
            } else {
                this.setTint(Phaser.Math.Linear(this.flashColor, COLORS.WHITE, 1 - this.flashCounter / this.flashMillis));
            }
        }
    }

    damage(amount: number): void {
        this.health -= amount;
        if (this.health <= 0) {
            this.die();
        }
    }

    die(): void {
        this.destroy();
    }

    flashTint(colorHex: number, flashMillis: number, ignoreIfFlashing: boolean): void {
        if (this.flashCounter <= 0 || !ignoreIfFlashing) {
            this.setTint(colorHex);
            this.flashMillis = flashMillis;
            this.flashCounter = flashMillis;
            this.flashColor = colorHex;
        }
    }
}
