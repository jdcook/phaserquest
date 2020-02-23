import SceneBase from "../scenes/SceneBase";

export default class TimedSprite extends Phaser.GameObjects.Sprite {
    private lifeCounter: number;
    constructor(scene: SceneBase, x: number, y: number, texture: string, lifeMillis: number) {
        super(scene, x, y, texture);
        this.lifeCounter = lifeMillis;
    }

    update(time: number, delta: number): void {
        this.lifeCounter -= delta;
        if (this.lifeCounter <= 0) {
            this.destroy();
        }
    }
}
