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

    public preload(): void {
        this.load.spritesheet("player", "assets/textures/dude.png", { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet("bigBadGuy", "assets/textures/bigBadGuy.png", { frameWidth: 137, frameHeight: 53 });
        this.load.image("dirt", "assets/textures/dirt.png");
        this.load.image("phaserBeam", "assets/textures/phaserBeam.png");

        this.load.audio("audioPhaserBeam", ["assets/audio/phaserBeam.ogg", "assets/audio/phaserBeam.mp3"]);
    }

    public create(): void {
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
            key: "idle",
            frames: [{ key: "bigBadGuy", frame: 0 }],
            frameRate: 1,
        });
        this.anims.create({
            key: "destroyed",
            frames: [{ key: "bigBadGuy", frame: 1 }],
            frameRate: 1,
        });

        this.player = new Player(this);
        this.playerGroup.add(this.player, true);

        const bigBad = new BigBadGuy(this, 500, 100);
        this.enemyGroup.add(bigBad, true);
        bigBad.init();

        // level
        const tileSprite = this.add.tileSprite(0, 500, 10000, 32, "dirt");
        this.terrainGroup.add(tileSprite);
    }

    public update(): void {
        // todo
    }
}
