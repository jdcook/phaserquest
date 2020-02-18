import * as Phaser from "phaser";
import Player from "../entities/player";
import PhaserBeam from "../attacks/phaserBeam";
import BigBadGuy from "../entities/bigBadGuy";
import SceneBase from "./SceneBase";

export default class MainScene extends SceneBase {
    player: Player;

    constructor() {
        super({
            active: false,
            visible: false,
            key: "MainScene",
        });
    }

    preload(): void {
        super.preload();
        // entities
        this.load.spritesheet("player", "assets/textures/dude.png", { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet("bigBadGuy", "assets/textures/big_bad_guy.png", { frameWidth: 137, frameHeight: 54 });

        // projectiles
        this.load.image("phaserBeam", "assets/textures/phaser_beam.png");
        this.load.spritesheet("bullet", "assets/textures/bullet.png", { frameWidth: 7, frameHeight: 7 });
        this.load.spritesheet("greenBullet", "assets/textures/green_bullet.png", { frameWidth: 12, frameHeight: 28 });

        // particles
        this.load.image("particleRed", "assets/textures/red.png");

        // level
        this.load.image("dirt", "assets/textures/dirt.png");

        // audio
        this.load.audio("audioPhaserBeam", ["assets/audio/phaser_beam.ogg", "assets/audio/phaser_beam.mp3"]);
    }

    create(): void {
        super.create();

        // animations
        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("player", { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: "turn",
            frames: [{ key: "player", frame: 4 }],
            frameRate: 20,
        });
        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("player", { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "bigbad_idle",
            frames: [{ key: "bigBadGuy", frame: 0 }],
            frameRate: 1,
        });
        this.anims.create({
            key: "bigbad_shootLeft",
            frames: this.anims.generateFrameNumbers("bigBadGuy", { start: 0, end: 3 }),
            frameRate: 20,
            repeat: 0,
        });
        this.anims.create({
            key: "bigbad_shootRight",
            frames: this.anims.generateFrameNumbers("bigBadGuy", { start: 4, end: 7 }),
            frameRate: 20,
            repeat: 0,
        });
        this.anims.create({
            key: "bigbad_destroyed",
            frames: [{ key: "bigBadGuy", frame: 1 }],
            frameRate: 8,
        });
        this.anims.create({
            key: "bigbad_charging",
            frames: this.anims.generateFrameNumbers("bigBadGuy", { start: 9, end: 10 }),
            frameRate: 8,
        });

        this.anims.create({
            key: "bulletIdle",
            frames: this.anims.generateFrameNumbers("bullet", { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: "greenBulletIdle",
            frames: this.anims.generateFrameNumbers("greenBullet", { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1,
        });

        this.player = new Player(this);
        this.playerGroup.add(this.player, true);

        const bigBad = new BigBadGuy(this, 500, 100);
        this.enemyGroup.add(bigBad, true);
        bigBad.initPhysics();

        // level
        const tileSprite = this.add.tileSprite(0, 500, 10000, 32, "dirt");
        this.terrainGroup.add(tileSprite);
    }
}
