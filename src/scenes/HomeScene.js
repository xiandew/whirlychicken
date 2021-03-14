import { range } from "../utils/Utils";
import Phaser from "../libs/phaser-full.min";
import Platform from "./MainScene/Platform";
import Player from "./MainScene/Player";

export default class HomeScene extends Phaser.Scene {
    constructor() {
        super("HomeScene");
    }

    init(data) {
        this.fromMainScene = data.fromMainScene;
    }

    preload() {
        this.load.image("rotate-phone", "assets/images/rotate-phone.png");
        this.load.image("start-btn", "assets/images/start-btn.png");
        // this.load.image("continue-btn", "assets/images/continue-btn.png");
        // this.load.image("restart-btn", "assets/images/restart-btn.png");
        // this.load.image("view-leaderboard-icon-btn", "assets/images/view-leaderboard-icon-btn.png");

        // this.load.spritesheet("sound-sheet", "assets/images/sound-sheet.png", { frameWidth: 60.5, frameHeight: 60 });
        // this.load.spritesheet("music-sheet", "assets/images/music-sheet.png", { frameWidth: 59.5, frameHeight: 60 });
        this.load.spritesheet("fall", "assets/images/npc_chicken__x1_fall_png_1354830392.png", { frameWidth: 148, frameHeight: 110 });
        this.load.spritesheet("land", "assets/images/npc_chicken__x1_land_png_1354830389.png", { frameWidth: 148, frameHeight: 110 });
        this.load.spritesheet("idle1", "assets/images/npc_chicken__x1_idle1_png_1354830404.png", { frameWidth: 148, frameHeight: 110 });
        this.load.spritesheet("idle2", "assets/images/npc_chicken__x1_idle2_png_1354830405.png", { frameWidth: 148, frameHeight: 110 });
        this.load.spritesheet("idle3", "assets/images/npc_chicken__x1_idle3_png_1354830407.png", { frameWidth: 148, frameHeight: 110 });
        this.load.spritesheet("pecking_once", "assets/images/npc_chicken__x1_pecking_once_png_1354830398.png", { frameWidth: 148, frameHeight: 110 });
        this.load.spritesheet("pecking_twice", "assets/images/npc_chicken__x1_pecking_twice_png_1354830400.png", { frameWidth: 148, frameHeight: 110 });
        this.load.spritesheet("sit", "assets/images/npc_chicken__x1_sit_png_1354830401.png", { frameWidth: 148, frameHeight: 110 });
        this.load.spritesheet("walk", "assets/images/npc_chicken__x1_walk_png_1354830385.png", { frameWidth: 148, frameHeight: 110 });
    }

    create() {
        this.createAnimations();

        let rotataPhoneIcon = this.add.image(
            0.5 * this.scale.width,
            0.5 * this.scale.height - this.game.height * 0.3,
            "rotate-phone"
        );
        rotataPhoneIcon.setScale(0.2 * this.game.width / rotataPhoneIcon.width);

        let buttons = [];

        if (this.fromMainScene) {
            let continueBtn = this.add.image(
                this.game.centerX,
                this.game.centerY - this.game.height * 0.1,
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
                this.game.centerX,
                this.game.centerY + this.game.height * 0.05,
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
        Platform.separation = 2 * Platform.width;

        const player = new Player(this, 0.5 * this.scale.width, 0.8 * this.scale.height, "land", 24);
        player.state = Player.State.FALLING;
        player.startFalling();

        wx.onAccelerometerChange(({ x, y, z }) => {
            if (Math.abs(x) < 0.1) return;
            if (x >= 0) {
                player.turnRight();
            } else {
                player.turnLeft();
            }
            player.setVelocityX(Math.abs(player.body.velocity.x) * (x >= 0 ? 1 : -1));
        });

        // let soundBtn = this.add.sprite(
        //     this.game.centerX - this.game.width * 0.15,
        //     this.game.centerY + this.game.height * 0.25,
        //     "sound-sheet", this.audio.bgmOn ? 0 : 1
        // ).setInteractive();
        // soundBtn.displayWidth = 0.09 * this.game.width;
        // soundBtn.displayHeight = this.autoDisplayHeight(soundBtn);
        // let _this = this;
        // soundBtn.on("pointerup", function () {
        //     if (_this.audio.bgmOn) {
        //         this.setFrame(1);
        //         _this.audio.stopBGM();
        //     } else {
        //         this.setFrame(0);
        //         _this.audio.playBGM();
        //     }
        // });
        // buttons.push(soundBtn);

        // let musicBtn = this.add.sprite(
        //     this.game.centerX,
        //     this.game.centerY + this.game.height * 0.25,
        //     "music-sheet", this.audio.musicOn ? 0 : 1
        // ).setInteractive();
        // musicBtn.displayWidth = 0.09 * this.game.width;
        // musicBtn.displayHeight = this.autoDisplayHeight(musicBtn);
        // musicBtn.on("pointerdown", function () {
        //     if (_this.audio.musicOn) {
        //         _this.audio.musicOn = false;
        //         this.setFrame(1);
        //     } else {
        //         _this.audio.musicOn = true;
        //         this.setFrame(0);
        //     }
        // });
        // buttons.push(musicBtn);

        // let viewLbIconBtn = this.add.image(
        //     this.game.centerX + this.game.width * 0.15,
        //     this.game.centerY + this.game.height * 0.25,
        //     "view-leaderboard-icon-btn"
        // ).setInteractive();
        // viewLbIconBtn.displayWidth = 0.09 * this.game.width;
        // viewLbIconBtn.displayHeight = this.autoDisplayHeight(viewLbIconBtn);
        // viewLbIconBtn.on("pointerup", () => {
        //     this.scene.pause();
        //     this.scene.launch("RankScene", { from: this.scene.key });
        //     this.scene.bringToTop("RankScene");
        // });
        // buttons.push(viewLbIconBtn);

        // buttons.forEach((button) => {
        //     button.on("pointerdown", function () {
        //         this.setTint(0xd3d3d3);
        //     });
        //     button.on("pointerup", function () {
        //         this.clearTint();
        //     });
        //     this.audio.addNavTap(button);
        // });

        this.events.on("shutdown", () => {
            // wx.setStorage({
            //     key: "setting",
            //     data: JSON.stringify({
            //         bgmOn: this.audio.bgmOn,
            //         musicOn: this.audio.musicOn
            //     })
            // });

            wx.offAccelerometerChange();
            this.events.off("shutdown");
        });
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