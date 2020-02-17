import * as Phaser from "phaser";
import Player from "../entities/player";
import PhaserBeam from "../attacks/phaserBeam";
import BigBadGuy from "../entities/bigBadGuy";

export default class MainScene extends Phaser.Scene {
    player: Player;
    phaserBeam: PhaserBeam;
    collisionGroupTerrain: number;
    collisionGroupPlayer: number;
    collisionGroupEnemies: number;
    collisionGroupPlayerProjectiles: number;
    collisionGroupEnemyProjectiles: number;
    updateEntityGroup: Phaser.GameObjects.Group;

    constructor() {
        super({
            active: false,
            visible: false,
            key: "MainScene",
        });
    }

    public preload(): void {
        this.load.spritesheet("player", "assets/textures/dude.png", { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet("bigBadGuy", "assets/textures/bigBadGuy.png", { frameWidth: 137, frameHeight: 53 });
        this.load.image("dirt", "assets/textures/dirt.png");
        this.load.image("phaserBeam", "assets/textures/phaserBeam.png");

        this.load.audio("audioPhaserBeam", ["assets/audio/phaserBeam.ogg", "assets/audio/phaserBeam.mp3"]);
    }

    public create(): void {
        this.matter.world.update30Hz();

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
            key: "idle",
            frames: [{ key: "bigBadGuy", frame: 0 }],
            frameRate: 1,
        });
        this.anims.create({
            key: "destroyed",
            frames: [{ key: "bigBadGuy", frame: 1 }],
            frameRate: 1,
        });

        // physics setup
        this.collisionGroupTerrain = this.matter.world.nextCategory();
        this.collisionGroupPlayer = this.matter.world.nextCategory();
        this.collisionGroupEnemies = this.matter.world.nextCategory();
        this.collisionGroupPlayerProjectiles = this.matter.world.nextCategory();
        this.collisionGroupEnemyProjectiles = this.matter.world.nextCategory();

        // entities
        this.updateEntityGroup = this.add.group({ classType: Phaser.Physics.Matter.Sprite, runChildUpdate: true });

        this.player = new Player(this);
        this.updateEntityGroup.add(this.player, true);

        this.phaserBeam = new PhaserBeam(this);
        this.add.existing(this.phaserBeam);
        this.player.setPhaserBeam(this.phaserBeam);

        const baddie = new BigBadGuy(this, 500, 100);
        this.updateEntityGroup.add(baddie, true);

        // level
        const ground = this.add.tileSprite(0, 500, 10000, 32, "dirt");
        this.matter.add.gameObject(ground, {
            isStatic: true,
            collisionFilter: {
                category: this.collisionGroupTerrain,
                mask:
                    this.collisionGroupEnemies |
                    this.collisionGroupEnemyProjectiles |
                    this.collisionGroupPlayer |
                    this.collisionGroupPlayerProjectiles,
            },
        });
    }

    public update(): void {
        // todo
    }
}
