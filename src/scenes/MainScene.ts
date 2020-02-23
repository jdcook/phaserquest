import { DEPTH_VALUES } from "../constants";
import BigBadGuy from "../entities/bigBadGuy";
import Player from "../entities/player";
import Tower from "../entities/tower";
import SceneBase from "./SceneBase";

export default class MainScene extends SceneBase {
    readonly WORLD_BOUNDS = {
        x: -5000,
        y: 0,
        width: 10000,
        height: 600,
        centerX: 0,
    };
    readonly SPAWNS = {
        bigBadGuys: [
            { x: 500, y: 100 },
            { x: 0, y: 100 },
        ],
        tower: { x: 400, y: 520 },
        player: { x: 100, y: 100 },
    };
    readonly DIRT_SIZE = 32;
    readonly WALL_HEIGHT = 2000;

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
        this.load.audio("audioCharge", ["assets/audio/charge.ogg", "assets/audio/charge.mp3"]);
        this.load.audio("audioChargeShot", ["assets/audio/charge_shot.ogg", "assets/audio/charge_shot.mp3"]);
        this.load.audio("audioMinigunShot", ["assets/audio/minigun_shot.ogg", "assets/audio/minigun_shot.mp3"]);
    }

    create(): void {
        super.create();

        // #region animations
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
        // #endregion

        // entities
        this.player = new Player(this, this.SPAWNS.player.x, this.SPAWNS.player.y);
        this.playerGroup.add(this.player, true);

        this.addToPhysicsGroup(new BigBadGuy(this, this.SPAWNS.bigBadGuys[0].x, this.SPAWNS.bigBadGuys[0].y), this.enemyGroup);
        this.addToPhysicsGroup(new BigBadGuy(this, this.SPAWNS.bigBadGuys[1].x, this.SPAWNS.bigBadGuys[1].y), this.enemyGroup);

        // level
        const background = this.add.tileSprite(this.WORLD_BOUNDS.x, this.WORLD_BOUNDS.y, this.WORLD_BOUNDS.width, this.WORLD_BOUNDS.height, "sky");
        background.setOrigin(0, 0);
        background.setDepth(DEPTH_VALUES.BACKGROUND);

        const ground = this.add.tileSprite(
            this.WORLD_BOUNDS.centerX,
            this.WORLD_BOUNDS.height - this.DIRT_SIZE / 2,
            this.WORLD_BOUNDS.width,
            this.DIRT_SIZE,
            "dirt"
        );
        this.terrainGroup.add(ground);
        const wallLeft = this.add.tileSprite(this.WORLD_BOUNDS.x, this.WORLD_BOUNDS.y, this.DIRT_SIZE, this.WALL_HEIGHT, "dirt");
        this.terrainGroup.add(wallLeft);
        const wallRight = this.add.tileSprite(
            this.WORLD_BOUNDS.x + this.WORLD_BOUNDS.width,
            this.WORLD_BOUNDS.y,
            this.DIRT_SIZE,
            this.WALL_HEIGHT,
            "dirt"
        );
        this.terrainGroup.add(wallRight);

        this.addToPhysicsGroup(new Tower(this, this.SPAWNS.tower.x, this.SPAWNS.tower.y), this.levelBodilessGroup);

        this.createPowerup(0, 0);
    }
}
