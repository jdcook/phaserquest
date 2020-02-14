import { Player } from "../entities/player";

export class MainScene extends Phaser.Scene {
    player: Player;
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
        this.load.spritesheet("player", "assets/dude.png", { frameWidth: 32, frameHeight: 48 });
        this.load.image("dirt", "assets/dirt.png");
    }

    public create(): void {
        //physics setup
        this.entityGroup = this.add.group({
            classType: Phaser.GameObjects.GameObject,
            runChildUpdate: true,
        });
        this.terrainGroup = this.physics.add.staticGroup();

        this.player = new Player(this);
        this.entityGroup.add(this.player);

        //level

        const tileSprite = this.add.tileSprite(0, 500, 10000, 32, "dirt");
        this.terrainGroup.add(tileSprite);
    }

    public update(): void {
        //todo
    }
}
