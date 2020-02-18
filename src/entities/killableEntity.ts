import SceneBase from "../scenes/SceneBase";

export default class KillableEntity extends Phaser.Physics.Arcade.Sprite {
    private readonly COLOR_WHITE: number = 0xffffff;
    protected gameScene: SceneBase;
    private health: number;
    private flashCounter: number = 0;
    private flashColor: number;
    private flashMillis: number;

    getHealth(): number {
        return this.health;
    }

    constructor(scene: SceneBase, x: number, y: number, texture: string, maxHealth: number) {
        super(scene, x, y, texture);
        this.gameScene = scene;
        this.health = maxHealth;
    }

    update(time: number, delta: number): void {
        super.update(time, delta);
        if (this.flashCounter > 0) {
            this.flashCounter -= delta;
            if (this.flashCounter <= 0) {
                this.flashCounter = 0;
                this.clearTint();
            } else {
                this.setTint(Phaser.Math.Linear(this.flashColor, this.COLOR_WHITE, 1 - this.flashCounter / this.flashMillis));
            }
        }
    }

    damage(amount: number) {
        this.health -= amount;
        if (this.health <= 0) {
            this.die();
        }
    }

    die(): void {
        this.destroy();
    }

    flashTint(colorHex: number, flashMillis: number, ignoreIfFlashing: boolean): void {
        if (this.flashCounter <= 0) {
            this.setTint(colorHex);
            this.flashMillis = flashMillis;
            this.flashCounter = flashMillis;
            this.flashColor = colorHex;
        }
    }
}
