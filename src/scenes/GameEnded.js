import Phaser from "../libs/phaser-full.min";

export default class GameEnded extends Phaser.Scene {
    constructor() {
        super("GameEnded");
    }

    init(data) {
        this.currentScore = data.currentScore;
    }

    create() {
        this.createGameOverModal();
        this.showGameOverModal();
    }

    showGameOverModal() {
        // if (!this.scene.get("MainScene").undoBtn.chess) {
        //     this.undoTextBtn.setVisible(false);
        //     this.restartBtn.setPosition(0, -0.2 * this.gameOverModal.height);
        //     this.viewLeaderboardBtn.setPosition(0, 0 * this.gameOverModal.height);
        // }

        this.tweens.add({
            targets: this.gameOverModal,
            x: this.gameOverModal.x,
            y: this.game.centerY,
            alpha: 1,
            duration: 400,
            ease: "Power2"
        });
    }

    hideGameOverModal() {
        this.tweens.add({
            targets: this.gameOverModal,
            x: this.gameOverModal.x,
            y: 0,
            alpha: 0,
            duration: 400,
            ease: "Power2"
        });
    }

    createGameOverModal() {
        this.gameOverModal = this.add.container(this.game.centerX, 0);
        this.gameOverModal.setDepth(Infinity);
        this.gameOverModal.alpha = 0;
        this.gameOverModal.setSize(0.9 * this.game.width, 0.7 * this.game.height);

        // let gameOverText = this.add.image(0, -0.42 * this.gameOverModal.height, "gameover-text");
        // gameOverText.displayWidth = 0.9 * this.gameOverModal.width;
        // gameOverText.displayHeight = this.autoDisplayHeight(gameOverText);
        // gameOverText.setTint(0xff6f69);

        // this.undoTextBtn = this.add.image(0, -0.2 * this.gameOverModal.height, "undo-text-btn").setInteractive();
        // this.undoTextBtn.displayWidth = 0.6 * this.game.width;
        // this.undoTextBtn.displayHeight = this.autoDisplayHeight(this.undoTextBtn);
        // this.undoTextBtn.on("pointerup", () => {
        //     this.hideGameOverModal();
        //     this.scene.stop();
        //     this.scene.resume("MainScene");
        //     this.scene.get("MainScene").undoBtn.emit("pointerup");
        // });
        // this.game.audio.addNavTap(this.undoTextBtn);

        this.restartBtn = this.add.image(0, 0, "restart-btn").setInteractive();
        this.restartBtn.setScale(0.6 * this.game.width / this.restartBtn.width);
        this.restartBtn.on("pointerup", () => this.scene.start("MainScene"));
        this.game.audio.addNavTap(this.restartBtn);

        // this.viewLeaderboardBtn = this.add.image(0, 0.2 * this.gameOverModal.height, "view-leaderboard-btn").setInteractive();
        // this.viewLeaderboardBtn.displayWidth = 0.6 * this.game.width;
        // this.viewLeaderboardBtn.displayHeight = this.autoDisplayHeight(this.viewLeaderboardBtn);
        // this.viewLeaderboardBtn.on("pointerup", () => {
        //     this.scene.pause();
        //     this.scene.launch("RankScene", {
        //         from: this.scene.key,
        //         currentScore: this.currentScore
        //     });
        //     this.scene.bringToTop("RankScene");
        // });
        // this.game.audio.addNavTap(this.viewLeaderboardBtn);

        // this.gameOverModal.add(gameOverText);
        // this.gameOverModal.add(this.undoTextBtn);
        this.gameOverModal.add(this.restartBtn);
        // this.gameOverModal.add(this.viewLeaderboardBtn);
    }
}