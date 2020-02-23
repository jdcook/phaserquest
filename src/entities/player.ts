import ChargedShot from "../attacks/chargedShot";
import PhaserBeam from "../attacks/phaserBeam";
import { DEPTH_VALUES } from "../constants";
import { WeaponType } from "../interactables/powerup";
import SceneBase from "../scenes/SceneBase";
import KillableEntity from "./killableEntity";

const CHARGED_SHOT_DAMAGE_PER_MILLI = 0.05;
const CHARGED_SHOT_SPEED = 100;
const STARTING_CHARGE_SHOT_MILLIS = 1000;
const CHARGE_SHOT_MILLIS_PER_LEVEL = 250;
const STARTING_MINIGUN_INTERVAL = 400;
const MINIGUN_INTERVAL_REDUCTION_PER_LEVEL = 50;
const SPEED = 500;
const MIN_JUMP_VEL = 400;
const MAX_JUMPSQUAT_MILLIS = 96;
const JUMP_MILLIS_TO_VEL_MULT = 8;

export default class Player extends KillableEntity {
    private arrowKeys: Phaser.Types.Input.Keyboard.CursorKeys;
    private keyW: Phaser.Input.Keyboard.Key;
    private keyA: Phaser.Input.Keyboard.Key;
    private keyS: Phaser.Input.Keyboard.Key;
    private keyD: Phaser.Input.Keyboard.Key;

    private jumpHoldCounter: number = 0;
    private phaserBeam: PhaserBeam;
    private weaponLevel: number = 1;
    private weaponType: WeaponType = WeaponType.Phaser;
    private audioCharge: Phaser.Sound.BaseSound;
    private audioChargeShot: Phaser.Sound.BaseSound;
    private audioMinigunShot: Phaser.Sound.BaseSound;
    private chargeShotCounter: number = 0;
    private minigunShotCounter: number = 0;

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

        this.audioCharge = this.scene.sound.add("audioCharge");
    }

    update(time: number, delta: number): void {
        const camera = this.scene.cameras.main;

        // left/right movement
        if (this.arrowKeys.left.isDown || this.keyA.isDown) {
            this.setVelocityX(-SPEED);
            this.anims.play("left", true);
        } else if (this.arrowKeys.right.isDown || this.keyD.isDown) {
            this.setVelocityX(SPEED);
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
        if (this.arrowKeys.space.isUp || this.jumpHoldCounter > MAX_JUMPSQUAT_MILLIS) {
            if (this.jumpHoldCounter > 0 && this.body.velocity.y <= 0 && this.body.touching.down) {
                this.setVelocityY(Math.min(-MIN_JUMP_VEL, -this.jumpHoldCounter * JUMP_MILLIS_TO_VEL_MULT));
            }
            this.jumpHoldCounter = 0;
        }

        // weapons
        const isMouseDown = this.scene.input.activePointer.isDown;
        const pointer = this.scene.input.activePointer;
        pointer.updateWorldPoint(camera);
        const currentPos = new Phaser.Math.Vector2(this.x, this.y);
        const targetPos = new Phaser.Math.Vector2(pointer.worldX, pointer.worldY);
        const direction = new Phaser.Math.Vector2(targetPos).subtract(currentPos).normalize();

        switch (this.weaponType) {
            case WeaponType.Phaser:
                if (isMouseDown) {
                    this.phaserBeam.startFiring(this.weaponLevel, currentPos, targetPos);
                } else {
                    this.phaserBeam.stopFiring();
                }
                break;
            case WeaponType.ChargeShot:
                if (isMouseDown) {
                    // make charging sound and increase charging graphic to a max amount, megaman style
                    if (!this.audioCharge.isPlaying) {
                        this.audioCharge.play();
                    }
                    this.chargeShotCounter += delta;
                    // max charge level increases with powerups
                } else {
                    // if there is a charge, release the projectile at current charge
                    this.audioCharge.stop();
                    if (this.chargeShotCounter > 0) {
                        const currentMaxChargeMillis = STARTING_CHARGE_SHOT_MILLIS + CHARGE_SHOT_MILLIS_PER_LEVEL * this.weaponLevel;
                        this.createChargedShot(Math.min(this.chargeShotCounter, currentMaxChargeMillis), currentPos, direction);
                    }
                    this.chargeShotCounter = 0;
                }
                break;
            case WeaponType.Minigun:
                if (isMouseDown) {
                    this.minigunShotCounter -= delta;
                    if (this.minigunShotCounter <= 0) {
                        this.createMinigunShot(currentPos, direction);
                        this.minigunShotCounter = STARTING_MINIGUN_INTERVAL - MINIGUN_INTERVAL_REDUCTION_PER_LEVEL * this.weaponLevel;
                    }
                    // shoot a projectile every interval
                    // interval is shorter with powerups
                }
                break;
        }
    }

    createChargedShot(chargedMillis: number, origin: Phaser.Math.Vector2, direction: Phaser.Math.Vector2): void {
        this.audioChargeShot.play();
        let chargeLevel = 1;
        if (chargedMillis >= STARTING_CHARGE_SHOT_MILLIS) {
            chargeLevel = 2;
        }
        // after STARTING_CHARGE_SHOT_MILLIS ms has passed, each CHARGE_SHOT_MILLIS_PER_LEVEL adds another charge level
        chargeLevel += Math.floor((chargedMillis - STARTING_CHARGE_SHOT_MILLIS) / CHARGE_SHOT_MILLIS_PER_LEVEL);

        this.gameScene.addToPhysicsGroup(
            new ChargedShot(
                this.gameScene,
                origin.x,
                origin.y,
                chargedMillis * CHARGED_SHOT_DAMAGE_PER_MILLI,
                direction.scale(CHARGED_SHOT_SPEED),
                chargeLevel
            ),
            this.gameScene.playerProjectilesGroup
        );
    }

    createMinigunShot(origin: Phaser.Math.Vector2, direction: Phaser.Math.Vector2): void {
        this.audioMinigunShot.play();
        // this.gameScene.addToPhysicsGroup(new MinigunShot(), this.gameScene.playerProjectilesGroup);
    }

    powerUp(powerUpType: WeaponType): void {
        ++this.weaponLevel;
    }

    die(): void {
        this.phaserBeam.stopFiring();
        this.phaserBeam.destroy();
        super.die();
    }
}
