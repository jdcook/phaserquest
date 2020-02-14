export class Player extends Phaser.GameObjects.GameObject {
    arrowKeys: Phaser.Types.Input.Keyboard.CursorKeys;
    sprite: Phaser.Physics.Arcade.Sprite;

    constructor(scene) {
        super(scene, "player");
        this.scene.add.existing(this);
        this.sprite = this.scene.physics.add.sprite(100, 100, "player");
        this.arrowKeys = this.scene.input.keyboard.createCursorKeys();
    }

    update(): void {
        if(this.arrowKeys.left.isDown) {
            this.sprite.setVelocityX(-500);
        } else if(this.arrowKeys.right.isDown) {
            this.sprite.setVelocityX(500);
        } else {
            this.sprite.setVelocityX(0);
        }
    }
}