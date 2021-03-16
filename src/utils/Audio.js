export default class Audio {
    constructor() {
        this.bgm = wx.createInnerAudioContext();
        this.bgm.loop = true;
        this.bgm.src = "assets/media/bgm.mp3";

        // Sound effects
        this.se = {
            "chickenclucking": "assets/media/chicken-clucking.mp3",
            "chickentweet": "assets/media/chicken-tweet.mp3",
            "jumpbonus": "assets/media/jump-bonus.mp3",
            "jumpspring": "assets/media/jump-spring.mp3",
            "jumprock": "assets/media/jump-rock.mp3",
            "jump": "assets/media/jump.mp3",
            "tap": "assets/media/tap.m4a"
        };

        Object.keys(this.se).forEach((key) => {
            let ctx = wx.createInnerAudioContext();
            ctx.src = this.se[key];
            this.se[key] = ctx;
        });

        this.bgmOn = false;
        this.seOn = false;
        try {
            let setting = wx.getStorageSync("setting")
            if (setting) {
                setting = JSON.parse(setting);
                this.bgmOn = setting.bgmOn;
                this.seOn = setting.musicOn;

                if (this.bgmOn) this.playBGM();
            }
        } catch (e) {
            console.error(e);
        }
    }

    addNavTap(button) {
        button.on("pointerup", () => {
            if (this.seOn) this.se.tap.play();
        });
    }

    playBGM() {
        this.bgm.play();
        this.bgmOn = true;
        this.saveSettings();
    }

    stopBGM() {
        this.bgm.stop();
        this.bgmOn = false;
        this.saveSettings();
    }

    play(seKey) {
        if (this.seOn && this.se[seKey]) this.se[seKey].play();
    }

    setSoundEffect(seOn) {
        this.seOn = seOn;
        this.saveSettings();
    }

    saveSettings() {
        wx.setStorage({
            key: "setting",
            data: JSON.stringify({
                bgmOn: this.game.audio.bgmOn,
                seOn: this.game.audio.seOn
            })
        });
    }

    static getInstance() {
        if (!Audio.instance) Audio.instance = new Audio();
        return Audio.instance;
    }
}