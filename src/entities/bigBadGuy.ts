import MainScene from "../scenes/MainScene";

export default class BigBadGuy extends Phaser.Physics.Matter.Sprite {
    private moveCounter: number = 0;
    private originalPos = { x: 0, y: 0 };

    constructor(scene: MainScene, x, y) {
        super(scene.matter.world, x, y, "bigBadGuy", null, {
            ignoreGravity: true,
            collisionFilter: {
                category: scene.collisionGroupEnemies,
                mask: scene.collisionGroupTerrain | scene.collisionGroupPlayerProjectiles,
            },
        });
        this.setFixedRotation();
        this.originalPos.x = x;
        this.originalPos.y = y;
    }

    update(time, delta): void {
        this.moveCounter += delta * 0.001;
        this.setPosition(this.originalPos.x + Math.sin(this.moveCounter) * 100, this.originalPos.y);
    }
}
