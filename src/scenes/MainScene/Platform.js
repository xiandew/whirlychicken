import Phaser from "../../libs/phaser-full.min";

const frames = {
    bonus: "carrot.png",
    ground: [
        "ground_grass.png", // Normal √
        "ground_sand_broken.png", // Once off √
        "ground_stone_broken.png", // Periodically harmful √
        "ground_snow.png", // Periodically invisible √
        "ground_stone.png", // With spikes √
        "ground_wood.png" // Spring √
    ],
    lott: [
        "wingMan1.png", // Mobile √
        "ground_grass.png", // Normal √
        "ground_sand_broken.png"
    ],
    mobile: [
        "wingMan1.png",
        "ground_stone_broken.png"
    ],
    base: [
        "ground_grass.png",
        "ground_sand_broken.png",
        "ground_stone_broken.png",
        "ground_snow.png",
        "ground_stone.png",
        "ground_wood.png",
        "wingMan1.png",
        "cloud.png", // Fake √
    ],
    consecutive: [
        "ground_grass.png",
        "ground_sand_broken.png",
        "ground_stone_broken.png",
        "ground_snow.png",
        "ground_wood.png",
        "wingMan1.png"
    ]
}

let lastBaseFrame;

export default class Platform extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);
        scene.add.existing(this);

        this.tweens = [];
        this.anims = [];
        this.onCollisionAnims = [];
        this.particleManagers = [];
    }

    init() {
        this.bounceFactor = 900 / 1136 * this.scene.scale.height;
        this.harmful = false;
        this.seKey = "jump";

        this.onCollisionAnims = [];
        this.particleManagers.forEach((e) => e.destroy());
        this.particleManagers = [];
        this.tweens.forEach((e) => e.remove());
        this.tweens = [];
        this.anims.forEach((e) => e.stop());
        this.anims = [];
        this.iterate((e) => { e.setTexture("spritesheet_jumper"); Platform.sprites.despawn(e); });
        this.removeAll();

        this.baseFrame =
            this.scene.score.value < 500 ?
                "ground_grass.png" :
                randomChoice(
                    frames.consecutive.includes(lastBaseFrame) ?
                        frames.base :
                        frames.consecutive
                );
        lastBaseFrame = this.baseFrame;

        let components = [];

        let ground;
        if (frames.ground.includes(this.baseFrame)) {
            ground = Platform.sprites.spawn();
            ground.setFrame(this.baseFrame);
            ground.setScale(Platform.width / ground.width);
            components.push(ground);
        }

        switch (this.baseFrame) {
            case "ground_stone_broken.png":
                const fire = Platform.sprites.spawn();
                fire.setTexture("fire").setOrigin(0.5, 1);
                fire.setScale(Platform.width / fire.width);
                components.unshift(fire);

                ground.setY(.5 * ground.displayHeight);

                const maxBounceFactor = this.bounceFactor;
                this.anims.push(fire.anims.play("fire"));
                this.tweens.push(
                    this.scene.tweens.add({
                        targets: fire,
                        duration: 400,
                        displayWidth: { start: 0, to: fire.displayWidth },
                        displayHeight: { start: 0, to: fire.displayHeight },
                        ease: "Power2",
                        yoyo: true,
                        hold: 500,
                        repeat: -1,
                        repeatDelay: 1000,
                        onUpdate: (tween, target) => {
                            this.harmful = !!target.displayWidth;
                            if (this.harmful) {
                                this.bounceFactor = maxBounceFactor * 0.3;
                                this.seKey = null;
                            } else {
                                this.bounceFactor = maxBounceFactor;
                                this.seKey = "jump";
                            }
                        },
                    })
                );

                break;
            case "ground_grass.png":
                break;
            case "ground_sand_broken.png":
                this.seKey = "jumprock";

                this.particleManagers.push(
                    this.scene.add.particles("spritesheet_jumper", null, {
                        frame: ["grass_brown1.png", "grass_brown2.png"],
                        x: this.x,
                        y: this.y,
                        angle: { min: 0, max: 180 },
                        lifespan: { min: 500, max: 1000 },
                        speed: { min: 50, max: 80 },
                        gravityY: 100,
                        alpha: { start: 1, end: 0 },
                        maxParticles: 15,
                        scale: { start: 0.3, end: 0 },
                        on: false
                    })
                );

                break;
            case "ground_snow.png":
                this.tweens.push(
                    this.scene.tweens.add({
                        targets: ground,
                        duration: 600,
                        alpha: 0,
                        ease: "Power2",
                        yoyo: true,
                        repeat: -1,
                        repeatDelay: 400
                    })
                );

                break;
            case "ground_stone.png":
                this.seKey = null;

                this.bounceFactor *= 0.3;
                this.harmful = true;

                const spikes = Platform.sprites.spawn();
                spikes.setFrame("spikes_top.png");
                spikes.setScale(0.8 * Platform.width / spikes.width);
                components.unshift(spikes);

                spikes.setY(-.2 * spikes.displayHeight);
                ground.setY(0.2 * spikes.displayHeight);
                break;
            case "ground_wood.png":
                this.seKey = "jumpspring";

                this.bounceFactor *= 1.7;

                const spring = Platform.sprites.spawn();
                spring.setFrame("spring.png");
                spring.setScale(0.7 * Platform.width / spring.width);
                components.unshift(spring);

                ground.setY(0.3 * spring.displayHeight);

                this.onCollisionAnims.push({ sprite: spring, animKey: "springinout" });
                break;
            case "wingMan1.png":
                this.bounceFactor *= 1.4;

                const wingman = Platform.sprites.spawn();
                wingman.setFrame(this.baseFrame);
                wingman.setScale(Platform.width / wingman.width);
                components.push(wingman);

                this.anims.push(wingman.anims.play("wingmanflying"));
                break;
            case "cloud.png":
                this.bounceFactor = 0;

                const cloud = Platform.sprites.spawn();
                cloud.setFrame(this.baseFrame);
                cloud.setScale(Platform.width / cloud.width);
                components.push(cloud);

                this.particleManagers.push(
                    this.scene.add.particles("spritesheet_jumper", null, {
                        frame: "smoke.png",
                        x: this.x,
                        y: this.y,
                        angle: { start: 0, end: 180, steps: 36 },
                        speed: { random: [10, 50] },
                        gravityY: -100,
                        lifespan: { min: 1000, max: 2000 },
                        alpha: { start: 1, end: 0 },
                        maxParticles: 5,
                        scale: 0.5,
                        on: false
                    })
                );
                break;
        }

        this.add(components);

        this.scene.physics.add.existing(this, Phaser.Physics.Arcade.DYNAMIC_BODY);
        this.body.setSize(this.width, this.height);
        this.body.setOffset(0, 0);
        this.body.pushable = false;
        this.body.setAllowGravity(false);
        this.body.setCollideWorldBounds(true);
        this.body.bounce.setTo(1, 1);

        if (frames.mobile.includes(this.baseFrame)) {
            this.body.setVelocityX(100);
        } else {
            this.body.setVelocityX(0);
        }

        if (this.baseFrame == "ground_stone_broken.png") {
            this.body.setOffset(0, 0.5 * this.body.height).setSize(this.body.width, ground.displayHeight);
        }

        if (
            frames.lott.includes(this.baseFrame) &&
            this.scene.score.value >= 1000 &&
            Phaser.Math.Between(1, 10) == 1
        ) {
            this.seKey = "jumpbonus";

            const bonus = Platform.sprites.spawn();
            bonus
                .setScale(0.7 * Platform.width / bonus.width)
                .setFrame(frames.bonus)
                .setY(-0.55 * (this.body.height + bonus.displayHeight));
            this.add(bonus);

            this.tweens.push(
                this.scene.tweens.add({
                    targets: bonus,
                    duration: 2000,
                    y: { start: bonus.y, to: bonus.y - 0.25 * bonus.displayHeight },
                    ease: "Linear",
                    yoyo: true,
                    repeat: -1
                })
            );

            this.bounceFactor *= 3;
        }
    }

    onCollision() {
        this.onCollisionAnims.forEach(({ sprite, animKey }) => {
            this.anims.push(sprite.play(animKey, true));
        });

        if (this.baseFrame == "ground_sand_broken.png") {
            this.playParticles();
            this.body.setEnable(false);
        }

        this.scene.game.audio.play(this.seKey);
    }

    onOverlap() {
        this.playParticles();
    }

    playParticles() {
        if (!this.visible) return;
        this.setVisible(false);

        this.particleManagers.forEach((e) => {
            e.emitters.list.forEach((e2) => e2.start())
        });
    }

    exit() {
        this.scene.tweens.add({
            targets: this,
            x: {
                start: this.x,
                to: this.x <= .5 * this.scene.scale.width ?
                    .5 * this.width :
                    this.scene.scale.width - .5 * this.width
            },
            alpha: 0,
            duration: 400,
            ease: "Power2"
        });
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
