import Phaser from "../../libs/phaser-full.min";

const groundFrames = [
    // "ground_grass.png", // Normal √
    // "ground_sand.png", // Once off
    // "ground_snow.png", // Periodically invisible
    // "ground_stone.png", // With spikes √
    // "ground_wood.png" // Spring
];

const otherFrames = [
    // "wingMan1.png" // Mobile √
    // "sun1.png", // Periodically harmful
    // "cloud.png", // Fake
];

const bonusFrame = "carrot.png";

export default class Platform extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);
        scene.add.existing(this);
    }

    init() {
        this.removeAll();

        this.baseFrame = randomChoice(groundFrames.concat(otherFrames));

        let components = [];

        let ground;
        if (groundFrames.includes(this.baseFrame)) {
            ground = this.scene.add.image(0, 0, "spritesheet_jumper", this.baseFrame);
            ground.displayWidth = Platform.width;
            ground.displayHeight = this.scene.autoDisplayHeight(ground);
            components.push(ground);
        }

        switch (this.baseFrame) {
            case "ground_grass.png":
                break;
            case "ground_sand.png":
                break;
            case "ground_snow.png":
                break;
            case "ground_stone.png":
                const spikes = this.scene.add.image(0, 0, "spritesheet_jumper", "spikes_top.png");
                spikes.displayWidth = 0.8 * Platform.width;
                spikes.displayHeight = this.scene.autoDisplayHeight(spikes);
                components.unshift(spikes);

                ground.setY(0.4 * spikes.displayHeight);
                break;
            case "ground_wood.png":
                break;
            case "wingMan1.png":

                const wingman = this.scene.add.sprite(0, 0, "spritesheet_jumper", this.baseFrame);
                wingman.displayWidth = Platform.width;
                wingman.displayHeight = this.scene.autoDisplayHeight(wingman);
                components.push(wingman);

                wingman.anims.play("wingmanflying");
                break;
            case "sun1.png":
                break;
            case "cloud.png":
                break;
        }

        this.add(components);

        let bodyType = Phaser.Physics.Arcade.STATIC_BODY;
        if (this.baseFrame == "wingMan1.png" || this.baseFrame == "sun1.png") {
            bodyType = Phaser.Physics.Arcade.DYNAMIC_BODY;
        }
        this.scene.physics.add.existing(this, bodyType);
        this.body.setAllowGravity(false);
        this.body.pushable = false;

        if (bodyType == Phaser.Physics.Arcade.DYNAMIC_BODY) {
            this.body.setVelocityX(100);
            this.body.setCollideWorldBounds(true);
            this.body.bounce.setTo(1, 1);
        }
    }

    add(child) {
        super.add(child);

        // Make sure the size of the container fitting the content
        // Ref: https://phasergames.com/phaser-3-container-size-get-height-and-width/

        // set the top position to the bottom of the game
        var top = this.scene.scale.height;
        var bottom = 0;
        // set the left to the right of the game
        var left = this.scene.scale.width;
        var right = 0;

        // loop through the children
        this.iterate(function (child) {
            // get the positions of the child
            var childX = child.x;
            var childY = child.y;

            var childW = child.displayWidth;
            var childH = child.displayHeight;

            // calcuate the child position based on the origin
            var childTop = childY - (childH * child.originY);
            var childBottom = childY + (childH * (1 - child.originY));
            var childLeft = childX - (childW * child.originX);
            var childRight = childX + (childW * (1 - child.originY));

            // test the positions against top, bottom, left and right
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

        // calculate the square
        var h = Math.abs(top - bottom);
        var w = Math.abs(right - left);

        // set the container size
        this.setSize(w, h);
    }
}

function randomChoice(arr) {
    return arr[Phaser.Math.Between(0, arr.length - 1)];
}
