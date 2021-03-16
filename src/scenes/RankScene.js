import Phaser from "../libs/phaser-full.min";

export default class RankScene extends Phaser.Scene {
    constructor() {
        super("RankScene");
    }

    init(data) {
        this.from = data.from;
        this.currentScore = data.currentScore;
    }

    create() {
        this.cameras.main.setBackgroundColor(0xffffff);

        let headerBg = wx.createCanvas();
        headerBg.width = this.game.width;
        headerBg.height = this.game.centerY - 0.22 * this.game.height;
        let headerBgCtx = headerBg.getContext("2d");
        headerBgCtx.fillStyle = "#00c777";
        headerBgCtx.fillRect(0, 0, headerBg.width, headerBg.height);

        headerBgCtx.fillStyle = "rgba(255, 255, 255, 0.5)";
        headerBgCtx.beginPath();
        let yIntercept = this.game.centerY - 0.332 * this.game.height;
        headerBgCtx.moveTo(0, yIntercept);
        headerBgCtx.quadraticCurveTo(
            headerBg.width * 0.5,
            this.game.centerY - 0.2816 * this.game.height,
            headerBg.width,
            yIntercept
        );
        headerBgCtx.lineTo(headerBg.width, headerBg.height);
        headerBgCtx.lineTo(0, headerBg.height);
        headerBgCtx.closePath();
        headerBgCtx.fill();
        if (!this.textures.exists("lb-header-bg")) this.textures.addCanvas("lb-header-bg", headerBg);
        this.add.image(
            headerBg.width * 0.5,
            headerBg.height * 0.5,
            "lb-header-bg"
        );

        let headerFontSize = 0.03 * this.game.height;
        let header = this.add.text(
            this.game.centerX,
            this.game.centerY - 0.45 * this.game.height,
            "排行榜",
            { font: headerFontSize + "px Arial", fill: "#fff" }
        ).setOrigin(0.5);

        let returnBtn = this.add.image(
            this.game.centerX - 0.42 * this.game.width,
            header.y,
            "return-btn"
        ).setInteractive();
        returnBtn.setScale(0.045 * this.game.width / returnBtn.width);
        returnBtn.on("pointerup", () => {
            if (this.scene.isPaused(this.from)) {
                this.scene.stop();
                this.scene.resume(this.from);
                this.scene.bringToTop(this.from);
            } else {
                this.scene.start(this.from);
            }
        });
        this.game.audio.addNavTap(returnBtn);

        let tabFontSize = headerFontSize * 0.85;
        let tabThisWeek = this.add.text(
            this.game.centerX - 0.2 * this.game.width,
            this.game.centerY - 0.38 * this.game.height,
            "本周",
            { font: tabFontSize + "px Arial", fill: "#fff" }
        ).setOrigin(0.5).setInteractive();
        tabThisWeek.tab = "thisWeek";

        let tabBestRecord = this.add.text(
            this.game.centerX + 0.2 * this.game.width,
            this.game.centerY - 0.38 * this.game.height,
            "最高分",
            { font: tabFontSize + "px Arial", fill: "#fff" }
        ).setOrigin(0.5).setInteractive();
        tabBestRecord.tab = "bestRecord";

        let graphics = this.add.graphics();
        let tabBarHeight = tabFontSize * 0.25;
        let tabBarWidth = tabFontSize * 5;
        graphics.lineStyle(tabBarHeight, 0xffffff, 1);
        graphics.lineBetween(0, 0, tabBarWidth, 0);
        graphics.generateTexture("tab-bar", tabBarWidth, tabBarHeight);
        graphics.destroy();
        let tabBar = this.add.sprite(tabThisWeek.x, tabThisWeek.y + tabFontSize, "tab-bar").setOrigin(0.5);

        [tabThisWeek, tabBestRecord].forEach((tab) => tab.on("pointerup", function () {
            wx.getOpenDataContext().postMessage({
                action: "RankScene",
                tab: this.tab
            });
            this.scene.tweens.add({
                targets: tabBar,
                x: this.x,
                duration: 400,
                ease: "Power2"
            });
        }));

        wx.getOpenDataContext().postMessage({
            action: "RankScene",
            tab: tabThisWeek.tab,
            score: this.currentScore
        });

        if (!this.textures.exists("shared-canvas")) this.textures.addCanvas("shared-canvas", wx.getOpenDataContext().canvas);
        this.sharedCanvas = this.add.image(
            this.game.centerX,
            this.game.centerY,
            "shared-canvas"
        );
        this.sharedCanvas.setScale(this.game.width / this.sharedCanvas.width);

        this.triggerTimer = this.time.addEvent({
            callback: () => this.sharedCanvas.frame.texture.refresh(),
            callbackScope: this,
            delay: 300,
            loop: true
        });
    }
}