import * as Phaser from "phaser";
import Player from "../entities/player";
import PhaserBeam from "../attacks/phaserBeam";
import BigBadGuy from "../entities/bigBadGuy";
import SceneBase from "./SceneBase";
import { DEPTH_VALUES } from "../constants";
import Tower from "../entities/tower";

export default class MainScene extends SceneBase {
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
        this.load.spritesheet("bigBadGuy", "assets/textures/big_bad_guy.png", { frameWidth: 137, frameHeight: 54 });
        this.load.spritesheet("tower", "assets/textures/tower.png", { frameWidth: 25, frameHeight: 56 });

        // projectiles
        this.load.image("phaserBeam", "assets/textures/phaser_beam.png");
        this.load.spritesheet("bullet", "assets/textures/bullet.png", { frameWidth: 7, frameHeight: 7 });
        this.load.spritesheet("greenBullet", "assets/textures/green_bullet.png", { frameWidth: 12, frameHeight: 28 });

        // particles
        this.load.image("particleRed", "assets/textures/red.png");

        // level
        this.load.image("dirt", "assets/textures/dirt.png");
        this.load.image("sky", "assets/textures/sky.png");

        // audio
        this.load.audio("audioPhaserBeam", ["assets/audio/phaser_beam.ogg", "assets/audio/phaser_beam.mp3"]);
        this.load.audio("audioSingleShot", ["assets/audio/single_shot.ogg", "assets/audio/single_shot.mp3"]);
        this.load.audio("audioMultiShot", ["assets/audio/multi_shot.ogg", "assets/audio/multi_shot.mp3"]);
    }

    create(): void {
        super.create();

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

        this.anims.create({
            key: "towerIdle",
            frames: [{ key: "tower", frame: 0 }],
            frameRate: 10,
            repeat: 0,
        });
        this.anims.create({
            key: "towerActivate",
            frames: this.anims.generateFrameNumbers("tower", { start: 0, end: 3 }),
            frameRate: 10,
            repeat: 0,
        });
        this.anims.create({
            key: "towerPulse",
            frames: [
                { key: "tower", frame: 4 },
                { key: "tower", frame: 5 },
                { key: "tower", frame: 6 },
                { key: "tower", frame: 5 },
            ],
            frameRate: 10,
            repeat: -1,
        });

        const bigBad = new BigBadGuy(this, 500, 100);
        this.enemyGroup.add(bigBad, true);
        bigBad.initPhysics();

        const bigBad2 = new BigBadGuy(this, 0, 100);
        this.enemyGroup.add(bigBad2, true);
        bigBad2.initPhysics();

        // level
        const background = this.add.tileSprite(-5000, 0, 10000, 600, "sky");
        background.setOrigin(0, 0);
        background.setDepth(DEPTH_VALUES.BACKGROUND);

        const ground = this.add.tileSprite(0, 584, 10000, 32, "dirt");
        this.terrainGroup.add(ground);
        const wallLeft = this.add.tileSprite(-5000, 0, 32, 2000, "dirt");
        this.terrainGroup.add(wallLeft);
        const wallRight = this.add.tileSprite(5000, 0, 32, 2000, "dirt");
        this.terrainGroup.add(wallRight);

        const tower = new Tower(this, 400, 520);
        this.levelBodilessGroup.add(tower, true);
        tower.initPhysics();
    }
}
