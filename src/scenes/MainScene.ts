
export class MainScene extends Phaser.Scene {
    square: Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };
    direction: Phaser.Types.Math.Vector2Like = {
        x: 1,
        y: 1,
    };

    constructor() {
        super({
            active: false,
            visible: false,
            key: "Game",
        });
    }

    public create() {
        this.square = this.add.rectangle(400, 400, 100, 100, 0xFFF) as any;
        this.physics.add.existing(this.square);
    }

    public update() {
        this.square.x += 10 * this.direction.x;
        this.square.y += 10 * this.direction.y;

        if (this.square.x >= this.game.scale.width - this.square.width / 2) {
            this.direction.x = -1;
        } else if (this.square.x <= this.square.width / 2) {
            this.direction.x = 1;
        }
        if (this.square.y >= this.game.scale.height - this.square.height / 2) {
            this.direction.y = -1;
        } else if (this.square.y <= this.square.height / 2) {
            this.direction.y = 1;
        }
    }
}
