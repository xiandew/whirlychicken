export default class Audio {
    constructor() {
        this.bgm = wx.createInnerAudioContext();
        this.bgm.loop = true;
        this.bgm.src = "assets/media/bgm.mp3";

        this.chickenClucking = wx.createInnerAudioContext();
        this.chickenClucking.src = "assets/media/chicken-clucking.mp3";

        this.chickenTweet = wx.createInnerAudioContext();
        this.chickenTweet.src = "assets/media/chicken-tweet.mp3";

        this.gameOver = wx.createInnerAudioContext();
        this.gameOver.src = "assets/media/game-over.mp3";

        this.jumpBonus = wx.createInnerAudioContext();
        this.jumpBonus.src = "assets/media/jump-bonus.mp3";

        this.jumpSpring = wx.createInnerAudioContext();
        this.jumpSpring.src = "assets/media/jump-spring.mp3";

        this.jump = wx.createInnerAudioContext();
        this.jump.src = "assets/media/jump.mp3";

        // this.bgmOn = true;
        // this.musicOn = true;
        // try {
        //     let setting = wx.getStorageSync("setting")
        //     if (setting) {
        //         setting = JSON.parse(setting);
        //         this.bgmOn = setting.bgmOn;
        //         this.musicOn = setting.musicOn;

        //         if (this.bgmOn) {
        //             this.playBGM();
        //         }
        //     }
        // } catch (e) {
        //     console.error(e);
        // }
    }

    addNavTap(button) {
        button.on("pointerup", () => {
            if (this.musicOn) {
                this.navTap.play();
            }
        });
    }

    playBGM() {
        this.bgm.play();
        this.bgmOn = true;
    }

    stopBGM() {
        this.bgm.stop();
        this.bgmOn = false;
    }

    playMatch() {
        if (this.musicOn) this.gameOver.play();
    }

    playPlaceChess() {
        if (this.musicOn) this.chickenTweet.play();
    }

    static getInstance() {
        if (!Audio.instance) {
            Audio.instance = new Audio();
        }
        return Audio.instance;
    }
}