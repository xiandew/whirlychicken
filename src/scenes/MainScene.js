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

    preload() {
        this.load.image("crate", "assets/images/grain__x1_1_x1_2_x1_3_x1_4_png_1354830084.png");
        this.load.image("bg_layer1", "assets/images/bg_layer1.png");
        this.load.image("bg_layer2", "assets/images/bg_layer2.png");
        this.load.image("bg_layer3", "assets/images/bg_layer3.png");
        this.load.image("bg_layer4", "assets/images/bg_layer4.png");
        this.load.atlas("spritesheet_jumper", "assets/atlas/spritesheet_jumper.png", "assets/atlas/spritesheet_jumper.json");
        this.load.spritesheet("flying", "assets/images/npc_chicken__x1_flying_png_1354830387.png", { frameWidth: 148, frameHeight: 110 });
        this.load.spritesheet("flying_back", "assets/images/npc_chicken__x1_flying_back_png_1354830391.png", { frameWidth: 148, frameHeight: 110 });
        this.load.spritesheet("fall", "assets/images/npc_chicken__x1_fall_png_1354830392.png", { frameWidth: 148, frameHeight: 110 });
        this.load.spritesheet("land", "assets/images/npc_chicken__x1_land_png_1354830389.png", { frameWidth: 148, frameHeight: 110 });
        this.load.spritesheet("idle1", "assets/images/npc_chicken__x1_idle1_png_1354830404.png", { frameWidth: 148, frameHeight: 110 });
        this.load.spritesheet("idle2", "assets/images/npc_chicken__x1_idle2_png_1354830405.png", { frameWidth: 148, frameHeight: 110 });
        this.load.spritesheet("idle3", "assets/images/npc_chicken__x1_idle3_png_1354830407.png", { frameWidth: 148, frameHeight: 110 });
        this.load.spritesheet("pecking_once", "assets/images/npc_chicken__x1_pecking_once_png_1354830398.png", { frameWidth: 148, frameHeight: 110 });
        this.load.spritesheet("pecking_twice", "assets/images/npc_chicken__x1_pecking_twice_png_1354830400.png", { frameWidth: 148, frameHeight: 110 });
        this.load.spritesheet("sit", "assets/images/npc_chicken__x1_sit_png_1354830401.png", { frameWidth: 148, frameHeight: 110 });
        this.load.spritesheet("walk", "assets/images/npc_chicken__x1_walk_png_1354830385.png", { frameWidth: 148, frameHeight: 110 });
        this.load.spritesheet("fire", "assets/images/fire.png", { frameWidth: 128, frameHeight: 128 });
    }

    create() {
        this.createAnimations();

        this.bgLayer1 = this.add.image(0, 0, "bg_layer1").setOrigin(0).setScrollFactor(0).setDisplaySize(this.scale.width, this.scale.height);
        this.bgLayer2 = this.add.tileSprite(0, 0, 0, 0, "bg_layer2").setOrigin(0).setScrollFactor(0);
        this.bgLayer2.setScale(this.scale.height / this.bgLayer2.height);
        this.bgLayer3 = this.add.image(0, this.scale.height, "bg_layer3").setOrigin(0, 1);
        this.bgLayer3.setScale(this.scale.width / this.bgLayer3.width);
        this.bgLayer4 = this.add.image(0, this.scale.height, "bg_layer4").setOrigin(0, 1);
        this.bgLayer4.setScale(this.scale.width / this.bgLayer4.width);

        Platform.width = 0.08 * this.scale.width;
        Platform.separation = 2 * Platform.width;
        Platform.sprites = this.add.pool({
            classType: Phaser.GameObjects.Sprite,
            defaultKey: "spritesheet_jumper"
        });
        Platform.sprites.initializeWithSize(20);
        this.platforms = this.add.pool({ classType: Platform });
        this.platforms.initializeWithSize(10);

        this.player = new Player(this, 0.5 * this.scale.width, 0.5 * this.scale.height, "land", 24);
        this.player.anims.play("flying", true);

        this.spawnPlatforms();

        this.cameras.main.startFollow(this.player, false);

        this.minPlatformY = Infinity;

        if (!this.game.debug) {
            return;
        }
        this.infoText = this.add.text(16, 16, "").setScrollFactor(0);
        this.add.text(32, this.scale.height, "UP", { color: "black" }).setFontSize(32).setOrigin(0, 1).setScrollFactor(0)
            .setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.player.setVelocityY(-500);
            });

        this.add.text(96, this.scale.height, "LEFT", { color: "black" }).setFontSize(32).setOrigin(0, 1).setScrollFactor(0)
            .setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.player.setVelocityX(-160);
                this.player.turnLeft();
            });

        this.add.text(192, this.scale.height, "RIGHT", { color: "black" }).setFontSize(32).setOrigin(0, 1).setScrollFactor(0)
            .setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.player.setVelocityX(160);
                this.player.turnRight();
            });
    }

    update(time, delta) {
        this.bgLayer2.tilePositionX -= .5;

        this.player.update();

        if (this.player.state == Player.State.JUMPING && this.player.y > this.maxPlatformY ||
            this.player.state == Player.State.WOUNDED) {
            this.player.startFalling();

            this.bgLayer3.setY(Math.min(this.physics.world.bounds.bottom, this.scale.height));
            this.bgLayer4.setY(Math.min(this.physics.world.bounds.bottom, this.scale.height));
        }

        if (this.player.state != Player.State.JUMPING) return;

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

        let nPlatformsDespawned = 0;
        this.maxPlatformY = -Infinity;
        this.platforms.getChildren().forEach((e) => {
            if (!e.active) return;

            this.minPlatformY = Math.min(this.minPlatformY, e.y);
            this.maxPlatformY = Math.max(this.maxPlatformY, e.y);

            // Recycle out-of-view platforms
            if (e.y - 0.5 * e.height > this.cameras.main.scrollY + this.scale.height) {
                this.platforms.despawn(e);
                nPlatformsDespawned++;
            }
        });

        range(nPlatformsDespawned).forEach(() => {
            this.minPlatformY = this.spawnPlatform(this.minPlatformY - Platform.separation).y;
        });

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

        this.physics.world.overlap(
            this.player,
            this.platforms.getChildren().filter(e => !e.bounceFactor),
            (player, platform) => {
                if (player.body.touching.down && platform.body.touching.up) {
                    platform.onOverlap();
                }
            }
        );

        if (!this.game.debug) {
            return;
        }
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
        range(Math.floor(this.scale.height / Platform.separation)).forEach((e, i) => {
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
            repeat: -1
        });

        this.anims.create({
            key: "flyback",
            frames: this.anims.generateFrameNumbers("flying_back", { end: 16 }),
            frameRate: 20
        });


        this.anims.create({
            key: "land",
            frames: this.anims.generateFrameNumbers("land", {
                frames: range(25)
            }),
            frameRate: 20
        });

        this.anims.create({
            key: "falling",
            frames: this.anims.generateFrameNumbers("fall", { end: 5 }),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: "crashland",
            frames: this.anims.generateFrameNumbers("fall", { frames: range(6, 25) }),
            frameRate: 20
        });

        this.anims.create({
            key: "idle1",
            frames: this.anims.generateFrameNumbers("idle1", { end: 66 }),
            frameRate: 20
        });

        this.anims.create({
            key: "idle2",
            frames: this.anims.generateFrameNumbers("idle2", { end: 46 }),
            frameRate: 20
        });

        this.anims.create({
            key: "idle3",
            frames: this.anims.generateFrameNumbers("idle3", { end: 85 }),
            frameRate: 20
        });

        this.anims.create({
            key: "pecking_once",
            frames: this.anims.generateFrameNumbers("pecking_once", { end: 31 }),
            frameRate: 20
        });

        this.anims.create({
            key: "pecking_twice",
            frames: this.anims.generateFrameNumbers("pecking_twice", { end: 39 }),
            frameRate: 20
        });

        this.anims.create({
            key: "sit",
            frames: this.anims.generateFrameNumbers("sit", {
                frames: range(20).concat(range(30).map(e => 19))
            }),
            frameRate: 20,
            yoyo: true
        });

        this.anims.create({
            key: "walk",
            frames: this.anims.generateFrameNumbers("walk", { end: 23 }),
            frameRate: 20,
            repeat: 3
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

function range(start, end) {
    if (!end) end = start, start = 0;
    return [...Array(end - start).keys()].map(i => i + start);
}