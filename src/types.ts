export type RaycastHitResults = {
    hitGameObject: Phaser.GameObjects.GameObject;
    intersectionPoints: Array<Phaser.Math.Vector2>;
};
export type RaycastHitResult = {
    hitGameObject: Phaser.GameObjects.GameObject;
    intersectionPoint: Phaser.Math.Vector2;
    distance: number;
};
