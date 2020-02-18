import * as Phaser from "phaser";
import MainScene from "./scenes/MainScene";

const gameConfig: Phaser.Types.Core.GameConfig = {
    title: "Phaser Quest",
    type: Phaser.AUTO,
    scale: {
        width: window.innerWidth,
        height: window.innerHeight,
    },
    render: {
        pixelArt: true,
    },
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
            gravity: { y: 2000 },
        },
    },
    parent: "game",
    backgroundColor: "#000000",
    scene: MainScene,
};

export const game = new Phaser.Game(gameConfig);
