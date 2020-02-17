import SceneBase from "../scenes/SceneBase";

export default class KillableEntity extends Phaser.Physics.Arcade.Sprite {
    private health: number;
    getHealth(): number {
        return this.health;
    }

    constructor(scene: SceneBase, x: number, y: number, texture: string, maxHealth: number) {
        super(scene, x, y, texture);
        this.health = maxHealth;
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
}
