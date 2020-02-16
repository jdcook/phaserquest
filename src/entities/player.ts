import { game } from "../main";
import PhaserBeam from "../attacks/phaserBeam";
import { DEPTH_VALUES } from "../constants";
import MainScene from "../scenes/MainScene";

export default class Player extends Phaser.Physics.Matter.Sprite {
    private arrowKeys: Phaser.Types.Input.Keyboard.CursorKeys;
    private keyW: Phaser.Input.Keyboard.Key;
    private keyA: Phaser.Input.Keyboard.Key;
    private keyS: Phaser.Input.Keyboard.Key;
    private keyD: Phaser.Input.Keyboard.Key;

    private jumpHoldCounter: number = 0;
    private phaserBeam: PhaserBeam;

    setPhaserBeam(phaserBeam: PhaserBeam) {
        this.phaserBeam = phaserBeam;
    }

    constructor(world, scene: MainScene) {
        super(world, 100, 100, "player", null, {
            collisionFilter: {
                category: scene.collisionGroupPlayer,
                mask: scene.collisionGroupTerrain | scene.collisionGroupEnemyProjectiles,
            },
        });

        this.depth = DEPTH_VALUES.PLAYER;

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
            // if (this.jumpHoldCounter > 0 && this.velocity.y <= 0 && this.body.touching.down) {
            //     this.setVelocityY(Math.min(-400, -this.jumpHoldCounter * 8));
            // }
            this.jumpHoldCounter = 0;
        }

        // phaser
        if (this.phaserBeam) {
            if (this.scene.input.activePointer.isDown) {
                this.phaserBeam.startFiring(new Phaser.Math.Vector2(this.x, this.y), this.scene.input.activePointer.position);
            } else {
                this.phaserBeam.stopFiring();
            }
        }
    }
}
