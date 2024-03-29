import { range } from "../utils/Utils";
import Phaser from "../libs/phaser-full.min";
import Platform from "./MainScene/Platform";
import Player from "./MainScene/Player";
import { createBackground } from "./MainScene";

export default class HomeScene extends Phaser.Scene {
    constructor() {
        super("HomeScene");
    }

    init(data) {
        this.fromMainScene = data.fromMainScene;
    }

    create() {
        this.createAnimations();

        (createBackground.bind(this))();

        let rotatePhoneIcon = this.add.image(
            0.5 * this.scale.width,
            0.5 * this.scale.height - this.game.height * 0.3,
            "rotate-phone"
        );
        rotatePhoneIcon.setScale(0.2 * this.game.width / rotatePhoneIcon.width);
        this.add.text(
            0.5 * this.scale.width,
            rotatePhoneIcon.y + 0.75 * rotatePhoneIcon.displayHeight,
            "左右倾斜手机\n控制移动方向",
            { color: "black" }
        ).setOrigin(0.5, 0).setFontSize(0.05 * this.scale.width);

        let buttons = [];

        if (this.fromMainScene) {
            let continueBtn = this.add.image(
                0.5 * this.scale.width,
                0.5 * this.scale.height - this.game.height * 0.1,
                "continue-btn"
            ).setInteractive();
            continueBtn.displayWidth = 0.6 * this.game.width;
            continueBtn.displayHeight = this.autoDisplayHeight(continueBtn);
            continueBtn.on("pointerup", () => {
                this.scene.stop();
                this.scene.resume("MainScene");
                this.scene.bringToTop("MainScene");
            });
            buttons.push(continueBtn);

            let restartBtn = this.add.image(
                0.5 * this.scale.width,
                0.5 * this.scale.height + this.game.height * 0.05,
                "restart-btn"
            ).setInteractive();
            restartBtn.displayWidth = 0.6 * this.game.width;
            restartBtn.displayHeight = this.autoDisplayHeight(restartBtn);
            restartBtn.on("pointerup", () => {
                this.scene.start("MainScene");
            });
            buttons.push(restartBtn);
        } else {
            let startBtn = this.add.image(
                0.5 * this.scale.width,
                0.5 * this.scale.height,
                "start-btn"
            ).setInteractive()
            startBtn.setScale(0.6 * this.scale.width / startBtn.width);
            startBtn.on("pointerup", () => {
                this.scene.start("MainScene");
            });
            buttons.push(startBtn);
        }

        Platform.width = 0.08 * this.scale.width;
        Platform.separation = 2.5 * Platform.width;

        this.player = new Player(this, 0.5 * this.scale.width, 0.8 * this.scale.height, "land", 24);
        this.player.startFalling();

        let onAccelerometerChange = ({ x, y, z }) => {
            if (Math.abs(x) >= 0.05) x >= 0 ? this.player.turnRight() : this.player.turnLeft();
            this.player.setVelocityX(Math.abs(this.player.body.velocity.x) * (x >= 0 ? 1 : -1));
        }
        wx.onAccelerometerChange(onAccelerometerChange);

        this.physics.world.checkCollision.left = false;
        this.physics.world.checkCollision.right = false;

        let bgmBtn = this.add.sprite(
            0.5 * this.scale.width - this.game.width * 0.15,
            0.5 * this.scale.height + this.game.height * 0.25,
            "music-sheet", this.game.audio.bgmOn ? 0 : 1
        ).setInteractive();
        bgmBtn.setScale(0.09 * this.game.width / bgmBtn.width);
        bgmBtn.on("pointerup", () => {
            if (this.game.audio.bgmOn) {
                bgmBtn.setFrame(1);
                this.game.audio.stopBGM();
            } else {
                bgmBtn.setFrame(0);
                this.game.audio.playBGM();
            }
        });
        buttons.push(bgmBtn);

        let seBtn = this.add.sprite(
            0.5 * this.scale.width, bgmBtn.y,
            "sound-sheet", this.game.audio.seOn ? 0 : 1
        ).setInteractive();
        seBtn.setScale(0.09 * this.game.width / seBtn.width);
        seBtn.on("pointerdown", () => {
            if (this.game.audio.seOn) {
                this.game.audio.setSoundEffect(false);
                seBtn.setFrame(1);
            } else {
                this.game.audio.setSoundEffect(true);
                seBtn.setFrame(0);
            }
        });
        buttons.push(seBtn);

        let viewLbIconBtn = this.add.image(
            0.5 * this.scale.width + this.game.width * 0.15, bgmBtn.y,
            "view-leaderboard-icon-btn"
        ).setInteractive();
        viewLbIconBtn.setScale(0.09 * this.game.width / viewLbIconBtn.width);
        viewLbIconBtn.on("pointerup", () => {
            this.scene.pause();
            this.scene.launch("RankScene", { from: this.scene.key });
            this.scene.bringToTop("RankScene");
        });
        buttons.push(viewLbIconBtn);

        buttons.forEach((button) => {
            button.on("pointerdown", function () {
                this.setTint(0xd3d3d3);
            });
            button.on("pointerup", function () {
                this.clearTint();
            });
            this.game.audio.addNavTap(button);
        });

        this.events.on("shutdown", () => {
            wx.offAccelerometerChange(onAccelerometerChange);
            this.events.off("shutdown");
        });
    }

    update() {
        this.physics.world.wrap(this.player, .5 * this.player.body.width);
    }

    createAnimations() {
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
    }
}