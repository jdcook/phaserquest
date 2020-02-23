import SceneBase from "../scenes/SceneBase";
import Projectile from "./projectile";

const SCALE_NORMAL = 1.5;
const SCALE_POWERED_UP = 3;
export default class MinigunShot extends Projectile {
    constructor(scene: SceneBase, x: number, y: number, damage: number, initialVel: Phaser.Math.Vector2, isPoweredUp: boolean) {
        super(scene, x, y, isPoweredUp ? "minigunShot2" : "minigunShot", damage, initialVel, true);
        this.rotation = Math.atan2(initialVel.y, initialVel.x) + Math.PI / 2;
        this.scale = isPoweredUp ? SCALE_POWERED_UP : SCALE_NORMAL;
    }

    hitEntity(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject): void {
        super.hitEntity(obj1, obj2);
    }
}
