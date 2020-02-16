import * as Phaser from "phaser";
import Player from "../entities/player";
import PhaserBeam from "../attacks/phaserBeam";

export default class MainScene extends Phaser.Scene {
    player: Player;
    phaserBeam: PhaserBeam;
    entityGroup: Phaser.GameObjects.Group;
    terrainGroup: Phaser.Physics.Arcade.StaticGroup;

    constructor() {
        super({
            active: false,
            visible: false,
            key: "MainScene",
        });
    }

    public preload(): void {
        this.load.spritesheet("player", "assets/textures/dude.png", { frameWidth: 32, frameHeight: 48 });
        this.load.image("dirt", "assets/textures/dirt.png");
        this.load.image("phaserBeam", "assets/textures/phaserBeam.png");

        this.load.audio("audioPhaserBeam", ["assets/audio/phaserBeam.mp3", "assets/audio/phaserBeam.ogg"]);
    }

    public create(): void {
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

        // physics setup
        this.entityGroup = this.physics.add.group({ classType: Phaser.GameObjects.GameObject, runChildUpdate: true });
        this.terrainGroup = this.physics.add.staticGroup();

        this.physics.add.collider(this.entityGroup, this.terrainGroup);

        this.player = new Player(this);
        this.entityGroup.add(this.player, true);

        this.phaserBeam = new PhaserBeam(this);
        this.add.existing(this.phaserBeam);
        this.player.setPhaserBeam(this.phaserBeam);

        // level
        const tileSprite = this.add.tileSprite(0, 500, 10000, 32, "dirt");
        this.terrainGroup.add(tileSprite);
    }

    public update(): void {
        // todo
    }
}
