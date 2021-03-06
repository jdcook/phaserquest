import { DEPTH_VALUES } from "../constants";
import BigBadGuy from "../entities/bigBadGuy";
import Player from "../entities/player";
import Tower from "../entities/tower";
import SceneBase from "./SceneBase";

const WORLD_BOUNDS = {
    x: 0,
    y: 0,
    width: 10000,
    height: 600,
};
const WORLD_CENTER_X = WORLD_BOUNDS.x + WORLD_BOUNDS.width / 2;

const SPAWNS = {
    bigBadGuys: [
        { x: 1000, y: 100 },
        { x: 1400, y: 100 },
        { x: 2000, y: 100 },
        { x: 2400, y: 100 },
        { x: 2600, y: 100 },
        { x: 2800, y: 100 },
    ],
    towers: [
        { x: 400, y: 520 },
        { x: 1200, y: 520 },
        { x: 1600, y: 520 },
        { x: 2200, y: 520 },
        { x: 2400, y: 520 },
        { x: 2600, y: 520 },
        { x: 3000, y: 520 },
        { x: 3600, y: 520 },
    ],
    player: { x: 40, y: 500 },
};
const DIRT_SIZE = 32;
const WALL_HEIGHT = 2000;
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
        this.load.spritesheet("player", "assets/textures/dude.png", { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet("bigBadGuy", "assets/textures/big_bad_guy.png", { frameWidth: 137, frameHeight: 54 });
        this.load.spritesheet("tower", "assets/textures/tower.png", { frameWidth: 25, frameHeight: 56 });

        // projectiles
        this.load.image("phaserBeam", "assets/textures/phaser_beam.png");
        this.load.spritesheet("bullet", "assets/textures/bullet.png", { frameWidth: 7, frameHeight: 7 });
        this.load.spritesheet("greenBullet", "assets/textures/green_bullet.png", { frameWidth: 12, frameHeight: 28 });
        this.load.spritesheet("chargedShot", "assets/textures/charged_shot.png", { frameWidth: 10, frameHeight: 14 });
        this.load.image("maxChargedShot", "assets/textures/max_charge_shot.png");
        this.load.image("minigunShot", "assets/textures/minigun_shot.png");
        this.load.image("minigunShot2", "assets/textures/minigun_shot_2.png");

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
        this.load.audio("audioChargeFinish", ["assets/audio/charge_finish.ogg", "assets/audio/charge_finish.mp3"]);
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
            key: "chargedShot1",
            frames: [{ key: "chargedShot", frame: 0 }],
            frameRate: 1,
            repeat: 0,
        });
        this.anims.create({
            key: "chargedShot2",
            frames: [{ key: "chargedShot", frame: 1 }],
            frameRate: 1,
            repeat: 0,
        });
        this.anims.create({
            key: "chargedShot3",
            frames: [{ key: "chargedShot", frame: 2 }],
            frameRate: 1,
            repeat: 0,
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
        this.player = new Player(this, SPAWNS.player.x, SPAWNS.player.y);
        this.playerGroup.add(this.player, true);

        SPAWNS.bigBadGuys.forEach(spawn => {
            this.addToPhysicsGroup(new BigBadGuy(this, spawn.x, spawn.y), this.enemyGroup);
        });

        // level
        const background = this.add.tileSprite(WORLD_BOUNDS.x, WORLD_BOUNDS.y, WORLD_BOUNDS.width, WORLD_BOUNDS.height, "sky");
        background.setOrigin(0, 0);
        background.setDepth(DEPTH_VALUES.BACKGROUND);

        const ground = this.add.tileSprite(WORLD_CENTER_X, WORLD_BOUNDS.height - DIRT_SIZE / 2, WORLD_BOUNDS.width, DIRT_SIZE, "dirt");
        this.terrainGroup.add(ground);
        const wallLeft = this.add.tileSprite(WORLD_BOUNDS.x, WORLD_BOUNDS.y, DIRT_SIZE, WALL_HEIGHT, "dirt");
        this.terrainGroup.add(wallLeft);
        const wallRight = this.add.tileSprite(WORLD_BOUNDS.x + WORLD_BOUNDS.width, WORLD_BOUNDS.y, DIRT_SIZE, WALL_HEIGHT, "dirt");
        this.terrainGroup.add(wallRight);

        SPAWNS.towers.forEach(spawn => {
            this.addToPhysicsGroup(new Tower(this, spawn.x, spawn.y), this.levelBodilessGroup);
        });
    }
}
