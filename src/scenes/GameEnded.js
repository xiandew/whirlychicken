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

        this.restartBtn = this.add.image(0, -0.2 * this.gameOverModal.height, "restart-btn").setInteractive();
        this.restartBtn.setScale(0.6 * this.game.width / this.restartBtn.width);
        this.restartBtn.on("pointerup", () => this.scene.start("MainScene"));
        this.game.audio.addNavTap(this.restartBtn);

        this.viewLeaderboardBtn = this.add.image(0, 0, "view-leaderboard-btn").setInteractive();
        this.viewLeaderboardBtn.setScale(0.6 * this.game.width / this.viewLeaderboardBtn.width);
        this.viewLeaderboardBtn.on("pointerup", () => {
            this.scene.pause();
            this.scene.launch("RankScene", {
                from: this.scene.key,
                currentScore: this.currentScore
            });
            this.scene.bringToTop("RankScene");
        });
        this.game.audio.addNavTap(this.viewLeaderboardBtn);

        this.gameOverModal.add(this.restartBtn);
        this.gameOverModal.add(this.viewLeaderboardBtn);
    }
}