import * as Phaser from "phaser";
import MainScene from "./scenes/MainScene";

const gameConfig: Phaser.Types.Core.GameConfig = {
    title: "Phaser Quest",
    type: Phaser.AUTO,
    scale: {
        width: window.innerWidth,
        height: window.innerHeight,
    },
    physics: {
        default: "matter",
        arcade: {
            debug: true,
            gravity: { y: 2000 },
        },
    },
    parent: "game",
    backgroundColor: "#000000",
    scene: MainScene,
};

export const game = new Phaser.Game(gameConfig);
