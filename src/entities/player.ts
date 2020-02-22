import PhaserBeam from "../attacks/phaserBeam";
import { DEPTH_VALUES } from "../constants";
import SceneBase from "../scenes/SceneBase";
import KillableEntity from "./killableEntity";

export default class Player extends KillableEntity {
    private readonly SPEED = 500;
    private readonly MIN_JUMP_VEL = 400;
    private readonly MAX_JUMPSQUAT_MILLIS = 96;
    private readonly JUMP_MILLIS_TO_VEL_MULT = 8;

    private arrowKeys: Phaser.Types.Input.Keyboard.CursorKeys;
    private keyW: Phaser.Input.Keyboard.Key;
    private keyA: Phaser.Input.Keyboard.Key;
    private keyS: Phaser.Input.Keyboard.Key;
    private keyD: Phaser.Input.Keyboard.Key;

    private jumpHoldCounter: number = 0;
    private phaserBeam: PhaserBeam;

    setPhaserBeam(phaserBeam: PhaserBeam): void {
        this.phaserBeam = phaserBeam;
    }

    constructor(scene: SceneBase, x: number, y: number) {
        super(scene, x, y, "player");
        this.health = 100;

        this.depth = DEPTH_VALUES.PLAYER;

        this.arrowKeys = this.scene.input.keyboard.createCursorKeys();
        this.keyW = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        this.phaserBeam = new PhaserBeam(scene);
        scene.add.existing(this.phaserBeam);
    }

    update(time: number, delta: number): void {
        const camera = this.scene.cameras.main;

        // left/right movement
        if (this.arrowKeys.left.isDown || this.keyA.isDown) {
            this.setVelocityX(-this.SPEED);
            this.anims.play("left", true);
        } else if (this.arrowKeys.right.isDown || this.keyD.isDown) {
            this.setVelocityX(this.SPEED);
            this.anims.play("right", true);
        } else {
            this.setVelocityX(0);
            this.anims.play("turn", true);
        }

        // this.scene.cameras.main.setPosition(this.x, this.y);
        camera.scrollX = this.x - this.scene.game.scale.width / 2;

        // jumping - jump on release or after 96ms, jump height is determined by how long the button was held (smashbros-like)
        if (this.arrowKeys.space.isDown) {
            this.jumpHoldCounter += delta;
        }
        if (this.arrowKeys.space.isUp || this.jumpHoldCounter > this.MAX_JUMPSQUAT_MILLIS) {
            if (this.jumpHoldCounter > 0 && this.body.velocity.y <= 0 && this.body.touching.down) {
                this.setVelocityY(Math.min(-this.MIN_JUMP_VEL, -this.jumpHoldCounter * this.JUMP_MILLIS_TO_VEL_MULT));
            }
            this.jumpHoldCounter = 0;
        }

        // phaser
        if (this.phaserBeam) {
            if (this.scene.input.activePointer.isDown) {
                const pointer = this.scene.input.activePointer;
                pointer.updateWorldPoint(camera);
                this.phaserBeam.startFiring(new Phaser.Math.Vector2(this.x, this.y), new Phaser.Math.Vector2(pointer.worldX, pointer.worldY));
            } else {
                this.phaserBeam.stopFiring();
            }
        }
    }

    die(): void {
        this.phaserBeam.stopFiring();
        this.phaserBeam.destroy();
        super.die();
    }
}
