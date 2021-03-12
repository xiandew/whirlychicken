import Phaser from "../libs/phaser-full.min";
import Audio from "../utils/Audio";

export default class Scene extends Phaser.Scene {
    constructor(config) {
        super(config);
        this.audio = Audio.getInstance();
    }
}