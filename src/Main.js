import Phaser from "./libs/phaser-full.min";
import BootScene from "./scenes/BootScene";
import HomeScene from "./scenes/HomeScene";
import MainScene from "./scenes/MainScene";
import RankScene from "./scenes/RankScene";
import GameEnded from "./scenes/GameEnded";
import Audio from "./utils/Audio";

export default class Main extends Phaser.Game {

    constructor() {
        let { screenWidth, screenHeight, pixelRatio } = wx.getSystemInfoSync();
        super({
            type: Phaser.WEBGL,
            canvas: canvas,
            width: screenWidth * pixelRatio,
            height: screenHeight * pixelRatio,
            backgroundColor: 0xffffff,
            physics: {
                default: "arcade",
                arcade: {
                    gravity: { y: 700 / 1136 * screenHeight * pixelRatio },
                    debug: true
                }
            },
            input: {
                touch: true
            },
            scene: [BootScene, HomeScene, MainScene, GameEnded, RankScene]
        });
        this.debug = true;
        this.audio = Audio.getInstance();

        const aspectRatio = 568 / 320;
        if (this.config.height / this.config.width > aspectRatio) {
            this.width = this.config.width;
            this.height = this.config.width * aspectRatio;
        } else {
            this.height = this.config.height;
            this.width = this.config.height / aspectRatio;
        }
        this.centerX = this.config.width * 0.5;
        this.centerY = this.config.height * 0.5;

        let sharedCanvas = wx.getOpenDataContext().canvas;
        sharedCanvas.width = this.width;
        sharedCanvas.height = this.height;

        wx.getOpenDataContext().postMessage({
            action: "Main"
        });

        wx.startAccelerometer({
            interval: 'game'
        });
    }
}

wx.showShareMenu({
    withShareTicket: true,
});

wx.onShareAppMessage(() => {
    return {
        title: "直升飞鸡",
        imageUrl: "assets/images/share.jpg"
    }
});
