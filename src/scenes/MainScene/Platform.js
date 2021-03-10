import Phaser from "../../libs/phaser-full.min";

export default class Platform extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        const groundImage = scene.add.image(0, 0, "spritesheet_jumper", "ground_sand.png");
        const platformWidth = 0.08 * scene.scale.width;

        groundImage.displayWidth = platformWidth;
        groundImage.displayHeight = scene.autoDisplayHeight(groundImage);

        super(scene, x, y, [groundImage]);
        scene.add.existing(this);
    }

    add(child) {
        super.add(child);

        // Make sure the size of the container fitting the content
        // Ref: https://phasergames.com/phaser-3-container-size-get-height-and-width/

        //set the top position to the bottom of the game
        var top = this.scene.scale.height;
        var bottom = 0;
        //set the left to the right of the game
        var left = this.scene.scale.width;
        var right = 0;
        //
        //
        //loop through the children
        //
        this.iterate(function (child) {
            //get the positions of the child
            var childX = child.x;
            var childY = child.y;
            //
            //
            //
            var childW = child.displayWidth;
            var childH = child.displayHeight;
            //
            //
            //calcuate the child position
            //based on the origin
            //
            //
            var childTop = childY - (childH * child.originY);
            var childBottom = childY + (childH * (1 - child.originY));
            var childLeft = childX - (childW * child.originX);
            var childRight = childX + (childW * (1 - child.originY));
            //test the positions against
            //top, bottom, left and right
            //
            if (childBottom > bottom) {
                bottom = childBottom;
            }
            if (childTop < top) {
                top = childTop;
            }
            if (childLeft < left) {
                left = childLeft;
            }
            if (childRight > right) {
                right = childRight;
            }
        }.bind(this));
        //
        //calculate the square
        var h = Math.abs(top - bottom);
        var w = Math.abs(right - left);
        //set the container size
        this.setSize(w, h);
    }
}
