import Phaser from "../../libs/phaser-full.min";
import Platform from "./Platform";

export default class Player extends Phaser.Physics.Arcade.Sprite {
    static State = class {
        static JUMPING = 1;
        static FALLING = 2;
        static LANDED = 3;
        static WOUNDING = 4;
        static WOUNDED = 5;
    }

    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(0.71, 0.5);
        this.setScale(3 * Platform.width / this.width);
        this.body.setSize(50, 90);
        this.turnRight();
        this.body.checkCollision.up = false;
        this.body.checkCollision.left = false;
        this.body.checkCollision.right = false;

        this.state = Player.State.JUMPING;
        this.startY = NaN;
        this.deltaY = 0;
        this.maxVelocityX = 640 / 640 * this.scene.scale.width;

        wx.onAccelerometerChange(({ x, y, z }) => {
            if (Math.abs(x) < 0.1) return;
            if (this.state != Player.State.JUMPING) return;
            x >= 0 ? this.turnRight() : this.turnLeft();
            this.setVelocityX(this.maxVelocityX * x);
        });
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
        switch (this.state) {
            case Player.State.JUMPING:
                if (!Number.isNaN(this.startY)) this.deltaY = Math.max(this.deltaY, Math.abs(this.y - this.startY));
                break;
            case Player.State.FALLING:
                break;
            case Player.State.LANDED:
                return;
        }
    }

    onCollision(platform) {
        if (this.state != Player.State.JUMPING) return;
        if (Number.isNaN(this.startY)) this.startY = platform.y;

        this.setVelocityY(-platform.bounceFactor);

        if (platform.harmful) {
            this.state = Player.State.WOUNDING;
            this.anims.play("flyback").on("animationcomplete", () => {
                this.off("animationcomplete");
                this.state = Player.State.WOUNDED;
            });

            return;
        }

        this.off("animationcomplete");
        this.anims.play("takeoff", true).on("animationcomplete", () => {
            this.off("animationcomplete");
            this.anims.play("flying", true);
        });
    }

    startFalling(onLanded = () => { }) {
        this.state = Player.State.FALLING;
        this.anims.play("falling");

        this.setVelocityX(0);
        this.setCollideWorldBounds(true);
        this.body.bounce.setTo(1, 0);
        this.body.onWorldBounds = true;
        this.body.world.on("worldbounds", (body, up, down, left, right) => {
            if (body == this.body) {
                if (this.state == Player.State.LANDED) {
                    if (left) {
                        this.turnRight();
                    }
                    if (right) {
                        this.turnLeft();
                    }
                } else {
                    if (down) {
                        this.state = Player.State.LANDED;
                        this.anims.play("crashland", true).on("animationcomplete", () => {
                            this.off("animationcomplete");
                            this.anims.play("land", true).on("animationcomplete", this.wander);
                        });

                        onLanded();
                    }
                }
            }
        });
    }

    wander() {
        this.off("animationcomplete");

        let animKeys = shuffle(["idle1", "idle2", "idle3", "pecking_once", "pecking_twice", "sit", "walk"]);

        function onAnimationcomplete(anim) {
            let animKey = animKeys.shift();
            if (animKey) {
                this.play(animKey);

                if (animKey == "walk") {
                    this.setVelocityX(40 / 640 * this.scene.scale.width * (this.scaleX > 0 ? 1 : -1));
                } else {
                    this.setVelocityX(0);
                }
            } else {
                this.off("animationcomplete", onAnimationcomplete);
                this.wander();
            }
        };

        this.on("animationcomplete", onAnimationcomplete);
        (onAnimationcomplete.bind(this))();
    }
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}