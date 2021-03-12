import Phaser from "../../libs/phaser-full.min";
import Platform from "./Platform";

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(0.71, 0.5);
        this.setScale(3 * Platform.width / this.width);
        this.body.setSize(50, 90);
        this.turnRight();

        this.alive = true;
        this.startY = this.y;
        this.deltaY = 0;
    }

    turnRight() {
        this.setScale(Math.abs(this.scaleX), this.scaleY);
        this.body.setOffset(80, 0);
    }

    turnLeft() {
        this.setScale(Math.abs(this.scaleX) * -1, this.scaleY);
        this.body.setOffset(130, 0);
    }

    update() {
        this.deltaY = Math.max(this.deltaY, Math.abs(this.y - this.startY));
    }
}