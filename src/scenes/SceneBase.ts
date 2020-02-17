import Player from "../entities/player";
import { Vector } from "matter";
import { GameObjects } from "phaser";
import { RaycastHitResult } from "../types";

export default class SceneBase extends Phaser.Scene {
    playerGroup: Phaser.GameObjects.Group;
    enemyGroup: Phaser.GameObjects.Group;
    terrainGroup: Phaser.Physics.Arcade.StaticGroup;

    create(): void {
        // physics setup
        this.playerGroup = this.physics.add.group({ classType: Phaser.GameObjects.GameObject, runChildUpdate: true });
        this.enemyGroup = this.physics.add.group({ classType: Phaser.GameObjects.GameObject, runChildUpdate: true });
        this.terrainGroup = this.physics.add.staticGroup();

        this.physics.add.collider(this.playerGroup, this.terrainGroup);
        this.physics.add.collider(this.enemyGroup, this.terrainGroup);
    }

    /*
     * Returns the points along the given line that intersect with the rectangle defined by x1, x2, y1, y2
     */
    private getIntersectionPoints(line: Phaser.Geom.Line, x1: number, x2: number, y1: number, y2: number): Array<Phaser.Math.Vector2> {
        const lineA = new Phaser.Geom.Line(x1, y1, x2, y1);
        const lineB = new Phaser.Geom.Line(x2, y1, x2, y2);
        const lineC = new Phaser.Geom.Line(x2, y2, x1, y2);
        const lineD = new Phaser.Geom.Line(x1, y2, x1, y1);

        var output = [new Phaser.Geom.Point(), new Phaser.Geom.Point(), new Phaser.Geom.Point(), new Phaser.Geom.Point()];

        var result = [
            Phaser.Geom.Intersects.LineToLine(lineA, line, output[0]),
            Phaser.Geom.Intersects.LineToLine(lineB, line, output[1]),
            Phaser.Geom.Intersects.LineToLine(lineC, line, output[2]),
            Phaser.Geom.Intersects.LineToLine(lineD, line, output[3]),
        ];

        const retVectors = [];
        for (var i = 0; i < 4; i++) {
            if (result[i]) {
                retVectors.push(new Phaser.Math.Vector2(output[i].x, output[i].y));
            }
        }
        return retVectors;
    }

    /*
     * Returns an array of intersections with entities of the given group
     */
    rayCast(line: Phaser.Geom.Line, group: Phaser.GameObjects.Group): Array<RaycastHitResult> {
        const hitResultList = [];
        group.children.each(entity => {
            if (Phaser.Geom.Intersects.LineToRectangle(line, entity.body)) {
                const body = entity.body as Phaser.Physics.Arcade.Body;
                const intersectionPoints = this.getIntersectionPoints(line, body.x, body.right, body.y, body.bottom);
                if (intersectionPoints?.length) {
                    hitResultList.push({ entity, intersectionPoints });
                }
            }
        });

        return hitResultList;
    }
}
