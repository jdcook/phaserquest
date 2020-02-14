import { Player } from "../entities/player";
import { Physics } from "phaser";

export class MainScene extends Phaser.Scene {
    direction: Phaser.Types.Math.Vector2Like = {
        x: 1,
        y: 1,
    };

    player: Player;

    entityGroup: Phaser.GameObjects.Group;

    constructor() {
        super({
            active: false,
            visible: false,
            key: "Game",
        });
    }

    public preload() {
        this.load.spritesheet("player", "assets/dude.png", { frameWidth: 32, frameHeight: 48 });
    }

    public create() {
        //groups
        this.entityGroup = this.add.group({ classType: Phaser.GameObjects.GameObject, runChildUpdate: true });
        this.physics.add.existing(this.square);

        this.player = new Player(this);
        this.entityGroup.add(this.player);
    }

    public update() {
        
    }
}
