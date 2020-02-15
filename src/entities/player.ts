import { game } from "../main";
import { Vector } from "matter";

export default class Player extends Phaser.Physics.Arcade.Sprite {
    arrowKeys: Phaser.Types.Input.Keyboard.CursorKeys;
    keyW: Phaser.Input.Keyboard.Key;
    keyA: Phaser.Input.Keyboard.Key;
    keyS: Phaser.Input.Keyboard.Key;
    keyD: Phaser.Input.Keyboard.Key;

    jumpHoldCounter: number = 0;

    constructor(scene) {
        super(scene, 100, 100, "player");
        this.arrowKeys = this.scene.input.keyboard.createCursorKeys();
        this.scene.input.keyboard.createCombo;
        this.keyW = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }

    update(time, delta): void {
        // left/right movement
        if (this.arrowKeys.left.isDown || this.keyA.isDown) {
            this.setVelocityX(-500);
            this.anims.play("left", true);
        } else if (this.arrowKeys.right.isDown || this.keyD.isDown) {
            this.setVelocityX(500);
            this.anims.play("right", true);
        } else {
            this.setVelocityX(0);
            this.anims.play("turn", true);
        }

        // jumping - velocity calculated with jumpsquat (smashbros-like)
        if (this.arrowKeys.space.isDown) {
            this.jumpHoldCounter += delta;
        }
        if (this.arrowKeys.space.isUp || this.jumpHoldCounter > 96) {
            if (this.jumpHoldCounter > 0 && this.body.velocity.y <= 0 && this.body.touching.down) {
                this.setVelocityY(Math.min(-400, -this.jumpHoldCounter * 8));
            }
            this.jumpHoldCounter = 0;
        }

        // phaser
        if (this.scene.input.activePointer.active) {
        }
    }
}
