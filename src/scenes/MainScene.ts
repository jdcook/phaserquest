import { Player } from "../entities/player";

export class MainScene extends Phaser.Scene {
    player: Player;

    entityGroup: Phaser.GameObjects.Group;

    constructor() {
        super({
            active: false,
            visible: false,
            key: "MainScene",
        });
    }

    public preload(): void {
        this.load.spritesheet("player", "assets/dude.png", { frameWidth: 32, frameHeight: 48 });
    }

    public create(): void {
        this.entityGroup = this.add.group({ classType: Phaser.GameObjects.GameObject, runChildUpdate: true });

        this.player = new Player(this);
        this.entityGroup.add(this.player);

        //level

    }

    public update(): void {
        //todo
    }
}
