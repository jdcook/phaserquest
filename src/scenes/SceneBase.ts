import Player from "../entities/player";
import { GameObjects } from "phaser";
import { RaycastHitResult, RaycastHitResults } from "../types";
import GreenBullet from "../attacks/greenBullet";
import Bullet from "../attacks/bullet";

/*
 * The scene object that all scene extend, handles common physics functionality
 */
export default class SceneBase extends Phaser.Scene {
    player: Player;

    playerGroup: Phaser.GameObjects.Group;
    enemyGroup: Phaser.GameObjects.Group;
    enemyProjectilesGroup: Phaser.GameObjects.Group;
    playerProjectilesGroup: Phaser.GameObjects.Group;
    terrainGroup: Phaser.Physics.Arcade.StaticGroup;
    levelBodilessGroup: Phaser.GameObjects.Group;

    preload(): void {
        this.load.spritesheet("player", "assets/textures/dude.png", { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet("explosion", "assets/textures/explosion.png", { frameWidth: 24, frameHeight: 24 });
    }

    create(): void {
        // animations
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
            key: "explode",
            frames: this.anims.generateFrameNumbers("explosion", { start: 0, end: 14 }),
            frameRate: 40,
            repeat: 0,
        });

        // physics setup
        this.playerGroup = this.physics.add.group({ classType: Phaser.GameObjects.GameObject, runChildUpdate: true });
        this.enemyGroup = this.physics.add.group({ classType: Phaser.GameObjects.GameObject, runChildUpdate: true });
        this.playerProjectilesGroup = this.physics.add.group({ classType: Phaser.GameObjects.GameObject, runChildUpdate: true });
        this.enemyProjectilesGroup = this.physics.add.group({ classType: Phaser.GameObjects.GameObject, runChildUpdate: true });
        this.terrainGroup = this.physics.add.staticGroup();
        this.levelBodilessGroup = this.add.group({ classType: Phaser.GameObjects.GameObject, runChildUpdate: true });

        this.physics.add.collider(this.playerGroup, this.terrainGroup);
        this.physics.add.collider(this.enemyGroup, this.terrainGroup);
        //this.physics.add.collider(this.enemyProjectilesGroup, this.terrainGroup);
        //this.physics.add.overlap
        this.physics.add.collider(this.playerProjectilesGroup, this.terrainGroup);

        this.player = new Player(this);
        this.playerGroup.add(this.player, true);
    }

    /*
     * Returns the points along the given line that intersect with the rectangle defined by x1, x2, y1, y2
     */
    private getIntersectionPoints(line: Phaser.Geom.Line, x1: number, x2: number, y1: number, y2: number): Array<Phaser.Math.Vector2> {
        const lineA = new Phaser.Geom.Line(x1, y1, x2, y1);
        const lineB = new Phaser.Geom.Line(x2, y1, x2, y2);
        const lineC = new Phaser.Geom.Line(x2, y2, x1, y2);
        const lineD = new Phaser.Geom.Line(x1, y2, x1, y1);

        const output = [new Phaser.Geom.Point(), new Phaser.Geom.Point(), new Phaser.Geom.Point(), new Phaser.Geom.Point()];

        const result = [
            Phaser.Geom.Intersects.LineToLine(lineA, line, output[0]),
            Phaser.Geom.Intersects.LineToLine(lineB, line, output[1]),
            Phaser.Geom.Intersects.LineToLine(lineC, line, output[2]),
            Phaser.Geom.Intersects.LineToLine(lineD, line, output[3]),
        ];

        const retVectors = [];
        for (let i = 0; i < 4; i++) {
            if (result[i]) {
                retVectors.push(new Phaser.Math.Vector2(output[i].x, output[i].y));
            }
        }
        return retVectors;
    }

    /*
     * Returns an array of intersections with entities of the given group
     */
    rayCast(ray: Phaser.Geom.Line, group: Phaser.GameObjects.Group): Array<RaycastHitResults> {
        const hitResultList: Array<RaycastHitResults> = [];
        group.children.each(entity => {
            if (Phaser.Geom.Intersects.LineToRectangle(ray, entity.body)) {
                const body = entity.body as Phaser.Physics.Arcade.Body;
                const intersectionPoints = this.getIntersectionPoints(ray, body.x, body.right, body.y, body.bottom);
                if (intersectionPoints?.length) {
                    hitResultList.push({ hitGameObject: entity, intersectionPoints });
                }
            }
        });

        return hitResultList;
    }

    /*
     * Perform a raycast, then find the closest point to the start of the given line
     */
    raycastClosestHit(ray: Phaser.Geom.Line, group: Phaser.GameObjects.Group): RaycastHitResult {
        const hitResults = this.rayCast(ray, group);

        if (hitResults.length) {
            let hitEntity = null;
            let closestDistance = Number.MAX_VALUE;
            let closestPoint: Phaser.Math.Vector2;
            for (let i = 0; i < hitResults.length; ++i) {
                for (let j = 0; j < hitResults[i].intersectionPoints.length; ++j) {
                    const vector = hitResults[i].intersectionPoints[j];
                    // using distance^2 to avoid unnecessary square roots, calculate actual distance once we find the closest point
                    const a = vector.x - ray.x1;
                    const b = vector.y - ray.y1;
                    const distSq = a * a + b * b;
                    if (distSq < closestDistance) {
                        closestDistance = distSq;
                        closestPoint = vector;
                        hitEntity = hitResults[i].hitGameObject;
                    }
                }
            }

            return {
                hitGameObject: hitEntity,
                intersectionPoint: closestPoint,
                distance: Math.sqrt(closestDistance),
            };
        }

        return null;
    }

    createExplosion(x: number, y: number, scale: number): void {
        const explosion = this.add.sprite(x, y, "explosion");
        explosion.setScale(scale, scale);
        explosion.anims.play("explode");
    }

    createGreenBullet(x: number, y: number): void {
        const bullet = new GreenBullet(this, x, y);
        this.enemyProjectilesGroup.add(bullet, true);
        bullet.initPhysics();
    }

    createBullet(x: number, y: number, xVel: number, yVel: number): void {
        const bullet = new Bullet(this, x, y);
        this.enemyProjectilesGroup.add(bullet, true);
        bullet.initPhysics();
        bullet.setVelocity(xVel, yVel);
    }
}
