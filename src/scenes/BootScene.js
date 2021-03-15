import Phaser from "../libs/phaser-full.min";

export default class BootScene extends Phaser.Scene {
    constructor() {
        super("BootScene");

        wx.showLoading({
            title: '加载中',
        });
    }

    preload() {
        this.load.image("rotate-phone", "assets/images/rotate-phone.png");
        this.load.image("start-btn", "assets/images/start-btn.png");
        this.load.image("view-leaderboard-icon-btn", "assets/images/view-leaderboard-btn.png");
        this.load.image("bg_layer1", "assets/images/bg_layer1.png");
        this.load.image("bg_layer2", "assets/images/bg_layer2.png");
        this.load.image("bg_layer3", "assets/images/bg_layer3.png");
        this.load.image("bg_layer4", "assets/images/bg_layer4.png");
        this.load.image("restart-btn", "assets/images/restart-btn.png");

        this.load.spritesheet("sound-sheet", "assets/images/sound-sheet.png", { frameWidth: 60.5, frameHeight: 60 });
        this.load.spritesheet("music-sheet", "assets/images/music-sheet.png", { frameWidth: 59.5, frameHeight: 60 });
        this.load.spritesheet("fall", "assets/images/npc_chicken__x1_fall_png_1354830392.png", { frameWidth: 148, frameHeight: 110 });
        this.load.spritesheet("land", "assets/images/npc_chicken__x1_land_png_1354830389.png", { frameWidth: 148, frameHeight: 110 });
        this.load.spritesheet("idle1", "assets/images/npc_chicken__x1_idle1_png_1354830404.png", { frameWidth: 148, frameHeight: 110 });
        this.load.spritesheet("idle2", "assets/images/npc_chicken__x1_idle2_png_1354830405.png", { frameWidth: 148, frameHeight: 110 });
        this.load.spritesheet("idle3", "assets/images/npc_chicken__x1_idle3_png_1354830407.png", { frameWidth: 148, frameHeight: 110 });
        this.load.spritesheet("pecking_once", "assets/images/npc_chicken__x1_pecking_once_png_1354830398.png", { frameWidth: 148, frameHeight: 110 });
        this.load.spritesheet("pecking_twice", "assets/images/npc_chicken__x1_pecking_twice_png_1354830400.png", { frameWidth: 148, frameHeight: 110 });
        this.load.spritesheet("sit", "assets/images/npc_chicken__x1_sit_png_1354830401.png", { frameWidth: 148, frameHeight: 110 });
        this.load.spritesheet("walk", "assets/images/npc_chicken__x1_walk_png_1354830385.png", { frameWidth: 148, frameHeight: 110 });
        this.load.spritesheet("flying", "assets/images/npc_chicken__x1_flying_png_1354830387.png", { frameWidth: 148, frameHeight: 110 });
        this.load.spritesheet("flying_back", "assets/images/npc_chicken__x1_flying_back_png_1354830391.png", { frameWidth: 148, frameHeight: 110 });
        this.load.spritesheet("fire", "assets/images/fire.png", { frameWidth: 128, frameHeight: 128 });

        this.load.atlas("spritesheet_jumper", "assets/atlas/spritesheet_jumper.png", "assets/atlas/spritesheet_jumper.json");
        this.load.bitmapFont("consolas", "assets/fonts/bitmap/consolas_0.png", "assets/fonts/bitmap/consolas.xml");
    }

    create() {
        wx.hideLoading();
        this.scene.start("HomeScene");
    }
}