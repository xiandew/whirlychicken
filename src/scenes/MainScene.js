import { range } from "../utils/Utils"
import "./MainScene/utils/Pool";
import Platform from "./MainScene/Platform";
import Player from "./MainScene/Player";

const INFO_FORMAT =
    "FPS:        %1\n" +
    "Size:       %2\n" +
    "Spawned:    %3\n" +
    "Despawned:  %4\n\n" +
    "Size:       %5\n" +
    "Spawned:    %6\n" +
    "Despawned:  %7\n";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
    }

    create() {
        this.createAnimations();

        (createBackground.bind(this))();

        const fontSize = 0.05 * this.scale.width;
        this.score = this.add.bitmapText(fontSize, fontSize, "consolas", "0", fontSize).setOrigin(0).setScrollFactor(0);
        this.score.value = 0;
        this.scoreUnit = Platform.separation / 50;

        Platform.sprites = this.add.pool({
            classType: Phaser.GameObjects.Sprite,
            defaultKey: "spritesheet_jumper"
        });
        Platform.sprites.initializeWithSize(20);
        this.platforms = this.add.pool({ classType: Platform });
        this.platforms.initializeWithSize(10);
        this.spawnPlatforms();
        this.minPlatformY = Infinity;

        this.player = new Player(this, 0.5 * this.scale.width, 0.5 * this.scale.height, "land", 24);
        this.player.anims.play("flying", true);

        this.cameras.main.startFollow(this.player, false);

        wx.setKeepScreenOn({ keepScreenOn: true });

        this.events.on("shutdown", () => {
            wx.setKeepScreenOn({ keepScreenOn: false });
            wx.offAccelerometerChange();
            this.events.off("shutdown");
        });

        if (!this.game.debug) return;
        this.infoText = this.add.text(16, 16, "").setScrollFactor(0);
        this.add.text(32, this.scale.height, "W", { color: "black" }).setFontSize(32).setOrigin(0, 1).setScrollFactor(0)
            .setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.player.setVelocityY(-500);
            });

        this.add.text(96, this.scale.height, "A", { color: "black" }).setFontSize(32).setOrigin(0, 1).setScrollFactor(0)
            .setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.player.setVelocityX(-160);
                this.player.turnLeft();
            });

        this.add.text(160, this.scale.height, "D", { color: "black" }).setFontSize(32).setOrigin(0, 1).setScrollFactor(0)
            .setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.player.setVelocityX(160);
                this.player.turnRight();
            });
    }

    update(time, delta) {
        this.bgLayer2.tilePositionX -= .5;

        this.player.update();

        if (this.player.state == Player.State.JUMPING) {
            // Update score
            const currScore = Math.floor(this.player.deltaY / this.scoreUnit);
            this.score.value = Math.max(this.score.value, currScore);
            this.score.text = this.score.value.toString();

            // Update world and camera bounds as player moves up
            this.physics.world.setBounds(
                0,
                -this.player.deltaY,
                this.scale.width,
                Math.min(2 * this.scale.height, this.scale.height + this.player.deltaY)
            );
            this.physics.world.wrap(this.player);
            this.cameras.main.setBounds(
                this.physics.world.bounds.x,
                this.physics.world.bounds.y,
                this.physics.world.bounds.width,
                this.physics.world.bounds.height
            );

            // Recycle out-of-view platforms and update the current top and bottom of all platforms
            let nPlatformsDespawned = 0;
            this.maxPlatformY = -Infinity;
            this.platforms.getChildren().forEach((e) => {
                if (!e.active) return;

                this.minPlatformY = Math.min(this.minPlatformY, e.y);
                this.maxPlatformY = Math.max(this.maxPlatformY, e.y);

                if (e.y - 0.5 * e.height > this.cameras.main.scrollY + this.scale.height) {
                    this.platforms.despawn(e);
                    nPlatformsDespawned++;
                }
            });

            // Create new platforms
            range(nPlatformsDespawned).forEach(() => {
                this.minPlatformY = this.spawnPlatform(this.minPlatformY - Platform.separation).y;
            });

            // Check collisions
            this.physics.world.collide(
                this.player,
                this.platforms.getChildren().filter(e => e.bounceFactor),
                (player, platform) => {
                    if (player.body.touching.down && platform.body.touching.up) {
                        player.onCollision(platform);
                        platform.onCollision();
                    }
                }
            );

            // Check overlapping
            this.physics.world.overlap(
                this.player,
                this.platforms.getChildren().filter(e => !e.bounceFactor),
                (player, platform) => {
                    if (player.body.touching.down && platform.body.touching.up) {
                        platform.onOverlap();
                    }
                }
            );
        }

        if (this.player.state == Player.State.JUMPING && this.player.y > this.maxPlatformY ||
            this.player.state == Player.State.WOUNDED) {
            this.player.startFalling(() => {
                this.platforms.getChildren().forEach((e) => { if (e.active) e.exit(); });

                this.scene.launch("GameEnded", { currentScore: this.score.value });
                this.scene.bringToTop("GameEnded");
            });

            this.bgLayer3.setY(Math.min(this.physics.world.bounds.bottom, this.scale.height));
            this.bgLayer4.setY(Math.min(this.physics.world.bounds.bottom, this.scale.height));
        }

        if (!this.game.debug) return;
        const size = this.platforms.getLength();
        const used = this.platforms.getTotalUsed();
        const spriteSize = Platform.sprites.getLength();
        const spriteUsed = Platform.sprites.getTotalUsed();
        const text = Phaser.Utils.String.Format(
            INFO_FORMAT,
            [
                (1000 / delta).toFixed(3),
                size, used, size - used,
                spriteSize, spriteUsed, spriteSize - spriteUsed
            ]
        );
        this.infoText.setText(text);
    }

    spawnPlatforms() {
        range(Math.ceil(this.scale.height / Platform.separation)).forEach((e, i) => {
            this.spawnPlatform(this.scale.height - Platform.separation - Platform.separation * i);
        });
    }

    spawnPlatform(y) {
        if (!this.platforms) {
            return null;
        }

        const platform = this.platforms.spawn(
            this.scale.width * 0.2 + Phaser.Math.Between(0, this.scale.width * 0.6 - Platform.width),
            y
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
                frames: range(35, 42).concat(range(5))
            }),
            frameRate: 20,
        });

        this.anims.create({
            key: "flying",
            frames: this.anims.generateFrameNumbers("flying", {
                frames: range(5, 13)
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "flyback",
            frames: this.anims.generateFrameNumbers("flying_back", { end: 16 }),
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

        this.anims.create({
            key: "springinout",
            frames: this.anims.generateFrameNumbers("spritesheet_jumper", {
                frames: ["spring.png", "spring_in.png", "spring_out.png"]
            }),
            frameRate: 20
        });

        this.anims.create({
            key: "fire",
            frames: this.anims.generateFrameNumbers("fire"),
            frameRate: 20,
            repeat: -1
        });
    }
}

export function createBackground() {
    this.bgLayer1 = this.add.image(0, 0, "bg_layer1").setOrigin(0).setScrollFactor(0).setDisplaySize(this.scale.width, this.scale.height);
    this.bgLayer2 = this.add.tileSprite(0, 0, 0, 0, "bg_layer2").setOrigin(0).setScrollFactor(0);
    this.bgLayer2.setScale(this.scale.height / this.bgLayer2.height);
    this.bgLayer3 = this.add.image(0, this.scale.height, "bg_layer3").setOrigin(0, 1);
    this.bgLayer3.setScale(this.scale.width / this.bgLayer3.width);
    this.bgLayer4 = this.add.image(0, this.scale.height, "bg_layer4").setOrigin(0, 1);
    this.bgLayer4.setScale(this.scale.width / this.bgLayer4.width);
}
