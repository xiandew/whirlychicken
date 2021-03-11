import Scene from "./Scene";
import Chess from "./MainScene/Chess";
import Board from "./MainScene/Board";
import Tile from "./MainScene/Tile";
import "./MainScene/utils/Pool";
import Platform from "./MainScene/Platform";

const INFO_FORMAT =
    "Size:       %1\n" +
    "Spawned:    %2\n" +
    "Despawned:  %3\n";

export default class MainScene extends Scene {
    constructor() {
        super("MainScene");
    }

    preload() {
        this.load.image("crate", "assets/images/grain__x1_1_x1_2_x1_3_x1_4_png_1354830084.png");
        this.load.image("bg_layer1", "assets/images/bg_layer1.png");
        this.load.image("bg_layer2", "assets/images/bg_layer2.png");
        this.load.image("bg_layer3", "assets/images/bg_layer3.png");
        this.load.image("bg_layer4", "assets/images/bg_layer4.png");
        this.load.atlas("spritesheet_jumper", "assets/atlas/spritesheet_jumper.png", "assets/atlas/spritesheet_jumper.json");
        this.load.spritesheet("flying", "assets/images/npc_chicken__x1_flying_png_1354830387.png", { frameWidth: 148, frameHeight: 110 });
        this.load.spritesheet("fall", "assets/images/npc_chicken__x1_fall_png_1354830392.png", { frameWidth: 148, frameHeight: 110 });
        this.load.spritesheet("land", "assets/images/npc_chicken__x1_land_png_1354830389.png", { frameWidth: 148, frameHeight: 110 });
    }

    create() {
        this.createAnimations();

        this.bgLayer1 = this.add.image(0, 0, "bg_layer1").setOrigin(0);
        this.bgLayer1.displayWidth = this.scale.width;
        this.bgLayer1.displayHeight = this.scale.height;
        this.bgLayer2 = this.add.tileSprite(0, 0, 0, 0, "bg_layer2").setOrigin(0).setScrollFactor(0);
        this.bgLayer3 = this.add.tileSprite(0, 0, 0, 0, "bg_layer3").setOrigin(0).setScrollFactor(0);
        this.bgLayer4 = this.add.tileSprite(0, 0, 0, 0, "bg_layer4").setOrigin(0).setScrollFactor(0);
        this.bgLayer2.displayHeight = this.scale.height;
        this.bgLayer3.displayHeight = this.scale.height;
        this.bgLayer4.displayHeight = this.scale.height;
        this.bgLayer2.displayWidth = this.autoDisplayWidth(this.bgLayer2);
        this.bgLayer3.displayWidth = this.autoDisplayWidth(this.bgLayer3);
        this.bgLayer4.displayWidth = this.autoDisplayWidth(this.bgLayer4);

        Platform.width = 0.08 * this.scale.width;
        Platform.separation = 2 * Platform.width;
        this.platforms = this.add.pool({ classType: Platform });
        this.platforms.initializeWithSize(10);
        this.spawnPlatforms(10);

        this.player = this.physics.add.sprite(300, 450, 'land', 24).setOrigin(0.71, 0.5);
        this.player.displayWidth = 3 * Platform.width;
        this.player.displayHeight = this.autoDisplayHeight(this.player);
        this.player.body.setSize(50, 90);
        // this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.player.turnLeft = function () {
            this.setScale(Math.abs(this.scaleX), this.scaleY);
            this.body.setOffset(80, 0);
        }
        this.player.turnRight = function () {
            this.setScale(Math.abs(this.scaleX) * -1, this.scaleY);
            this.body.setOffset(130, 0);
        }
        this.player.turnLeft();

        const collider = this.physics.add.collider(
            this.player,
            this.platforms.getChildren(),
            function (player, platform) {
                if (player.body.touching.down && platform.body.touching.up) {
                    // console.log("Test");
                }
            }
        );
        collider.overlapOnly = true;

        this.infoText = this.add.text(16, 16, "");
        this.add.text(16, this.scale.height - 16, "UP", { color: "black" })
            .setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.player.setVelocityY(-330);
            });

        this.add.text(64, this.scale.height - 16, "LEFT", { color: "black" })
            .setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                // this.player.setVelocityX(-160);
                this.player.turnRight();
            });

        this.add.text(144, this.scale.height - 16, "RIGHT", { color: "black" })
            .setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                // player.setVelocityX(160);
                this.player.turnLeft();
                this.player.anims.play("takeoff", true).on("animationcomplete", () => {
                    this.player.off("animationcomplete");
                    this.player.anims.play('flying', true).on("animationcomplete", () => {
                        this.player.anims.play('land', true);
                        this.player.off("animationcomplete");
                    });
                });
            });
    }

    update() {
        this.bgLayer2.tilePositionX -= .5;
        this.bgLayer3.tilePositionX -= .25;
        this.bgLayer4.tilePositionX += .05;

        if (!this.platforms) {
            return;
        }

        if (!this.infoText) {
            return;
        }
        const size = this.platforms.getLength();
        const used = this.platforms.getTotalUsed();
        const text = Phaser.Utils.String.Format(INFO_FORMAT, [size, used, size - used]);
        this.infoText.setText(text);
    }

    spawnPlatforms() {
        range(Math.floor(this.scale.height / Platform.separation)).forEach((e, i) => {
            this.createPlatform(this.scale.height - Platform.separation - Platform.separation * i);
        });
    }

    createPlatform(y) {
        if (!this.platforms) {
            return null;
        }

        const platform = this.platforms.spawn(
            this.scale.width * 0.2 + Phaser.Math.Between(0, this.scale.width * 0.6 - Platform.width),
            y || 0 // TODO
        );

        if (!platform) {
            return;
        }

        platform.init();

        return platform;
    }

    createAnimations() {
        this.anims.create({
            key: "takeoff",
            frames: this.anims.generateFrameNumbers("flying", {
                frames: range(35, 42).concat(range(4))
            }),
            frameRate: 20,
        });

        this.anims.create({
            key: "flying",
            frames: this.anims.generateFrameNumbers("flying", {
                frames: range(4, 13)
            }),
            frameRate: 20,
        });

        this.anims.create({
            key: "land",
            frames: this.anims.generateFrameNumbers("land", {
                frames: range(25)
            }),
            frameRate: 20
        });

        this.anims.create({
            key: "wingmanflying",
            frames: this.anims.generateFrameNumbers("spritesheet_jumper", {
                frames: range(1, 6).map((i) => `wingMan${i}.png`)
            }),
            frameRate: 10,
            yoyo: true,
            repeat: -1
        });
    }
}

function range(start, end) {
    if (!end) end = start, start = 0;
    return [...Array(end - start).keys()].map(i => i + start);
}