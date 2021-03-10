import Scene from "./Scene";
import Chess from "./MainScene/Chess";
import Board from "./MainScene/Board";
import Tile from "./MainScene/Tile";
import "./MainScene/utils/Pool";
import Platform from "./MainScene/Platform";

const INFO_FORMAT =
    "Size:       %1\n" +
    "Spawned:    %2\n" +
    "Despawned:  %3\n";

export default class MainScene extends Scene {
    constructor() {
        super("MainScene");
    }

    preload() {
        this.load.image("crate", "assets/images/grain__x1_1_x1_2_x1_3_x1_4_png_1354830084.png");
        this.load.image("bg_layer1", "assets/images/bg_layer1.png");
        this.load.image("bg_layer2", "assets/images/bg_layer2.png");
        this.load.image("bg_layer3", "assets/images/bg_layer3.png");
        this.load.image("bg_layer4", "assets/images/bg_layer4.png");
        this.load.atlas("spritesheet_jumper", "assets/atlas/spritesheet_jumper.png", "assets/atlas/spritesheet_jumper.json");
        this.load.spritesheet("flying", "assets/images/npc_chicken__x1_flying_png_1354830387.png", { frameWidth: 148, frameHeight: 110 });
        this.load.spritesheet("fall", "assets/images/npc_chicken__x1_fall_png_1354830392.png", { frameWidth: 148, frameHeight: 110 });
        this.load.spritesheet("land", "assets/images/npc_chicken__x1_land_png_1354830389.png", { frameWidth: 148, frameHeight: 110 });

        // this.load.image("tile", "assets/images/tile.png");
        // this.load.image("undo-btn", "assets/images/undo-btn.png");
        // this.load.image("home-btn", "assets/images/home-btn.png");
        // [...Array(8).keys()].forEach(i => {
        //     this.load.image(`particles${i}`, `assets/images/particles${i}.png`);
        // });

        // this.load.image("best-score", "assets/images/best-score.png");
        // this.load.bitmapFont(
        //     "basic-square-7-solid",
        //     "assets/fonts/bitmap/basic-square-7-solid_0.png",
        //     "assets/fonts/bitmap/basic-square-7-solid.xml"
        // );
    }

    create() {

        this.bgLayer1 = this.add.image(0, 0, "bg_layer1").setOrigin(0);
        this.bgLayer1.displayWidth = this.scale.width;
        this.bgLayer1.displayHeight = this.scale.height;
        this.bgLayer2 = this.add.tileSprite(0, 0, 0, 0, "bg_layer2").setOrigin(0).setScrollFactor(0);
        this.bgLayer3 = this.add.tileSprite(0, 0, 0, 0, "bg_layer3").setOrigin(0).setScrollFactor(0);
        this.bgLayer4 = this.add.tileSprite(0, 0, 0, 0, "bg_layer4").setOrigin(0).setScrollFactor(0);
        this.bgLayer2.displayHeight = this.scale.height;
        this.bgLayer3.displayHeight = this.scale.height;
        this.bgLayer4.displayHeight = this.scale.height;
        this.bgLayer2.displayWidth = this.autoDisplayWidth(this.bgLayer2);
        this.bgLayer3.displayWidth = this.autoDisplayWidth(this.bgLayer3);
        this.bgLayer4.displayWidth = this.autoDisplayWidth(this.bgLayer4);

        Platform.width = 0.08 * this.scale.width;
        Platform.separation = 2 * Platform.width;
        this.platforms = this.add.pool({ classType: Platform });
        this.platforms.initializeWithSize(10);
        this.spawnPlatforms(10);

        this.player = this.physics.add.sprite(300, 450, 'land', 24).setOrigin(0.71, 0.5);
        this.player.displayWidth = 3 * Platform.width;
        this.player.displayHeight = this.autoDisplayHeight(this.player);
        this.player.body.setSize(50, 90);
        // this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.player.turnLeft = function () {
            this.setScale(1);
            this.body.setOffset(80, 0);
        }
        this.player.turnRight = function () {
            this.setScale(-1, 1);
            this.body.setOffset(130, 0);
        }
        this.player.turnLeft();

        this.physics.add.collider(this.player, new Phaser.Physics.Arcade.StaticGroup(this.physics.world, this, this.platforms.getChildren()));

        this.anims.create({
            key: "takeoff",
            frames: this.anims.generateFrameNumbers("flying", {
                frames: range(35, 42).concat(range(4))
            }),
            frameRate: 20,
        });

        this.anims.create({
            key: "flying",
            frames: this.anims.generateFrameNumbers("flying", {
                frames: range(4, 13)
            }),
            frameRate: 20,
        });

        this.anims.create({
            key: "land",
            frames: this.anims.generateFrameNumbers("land", {
                frames: range(25)
            }),
            frameRate: 20
        });

        // this.cameras.main.setBackgroundColor(0xffffff);

        // this.board = new Board(this);
        // this.createChesses();

        // this.undoBtn = this.add.image(
        //     GameGlobal.centerX - GameGlobal.width * 0.4,
        //     GameGlobal.centerY - GameGlobal.height * 0.45,
        //     "undo-btn"
        // ).setInteractive();
        // this.undoBtn.displayWidth = 0.06 * GameGlobal.width;
        // this.undoBtn.displayHeight = this.autoDisplayHeight(this.undoBtn);
        // this.undoBtn.setTint(0x00c777);
        // this.undoBtn.alpha = 0;
        // let _this = this;
        // this.undoBtn.on("pointerup", function () {
        //     if (this.alpha != 1 || !this.chess) {
        //         return;
        //     }

        //     if (_this.chesses.length == Chess.directions.length) {
        //         _this.chesses.forEach((chess) => chess.exit());
        //     }

        //     _this.chesses.push(this.chess);
        //     this.chess.takeback();
        //     this.chess = null;
        //     this.setTint(0xe5e5e5);
        // });

        // this.undoBtn.onPlaceChess = function (chess) {
        //     if (this.alpha != 1) {
        //         _this.tweens.add({
        //             targets: this,
        //             alpha: 1,
        //             duration: 300,
        //             ease: "Power2"
        //         });
        //     }

        //     if (this.chess) {
        //         this.chess.commit();
        //     }

        //     if (!chess) {
        //         this.setTint(0xe5e5e5);
        //     } else {
        //         this.setTint(0x00c777);
        //     }

        //     this.chess = chess;
        // }

        // let homeBtn = this.add.image(
        //     GameGlobal.centerX - GameGlobal.width * 0.4,
        //     GameGlobal.centerY + GameGlobal.height * 0.45,
        //     "home-btn"
        // ).setInteractive();
        // homeBtn.displayWidth = 0.06 * GameGlobal.width;
        // homeBtn.displayHeight = this.autoDisplayHeight(homeBtn);
        // homeBtn.on("pointerup", () => {
        //     this.scene.pause();
        //     this.scene.launch("HomeScene", { fromMainScene: true });
        //     this.scene.bringToTop("HomeScene");
        // });

        // this.audio.addNavTap(homeBtn);

        // this.bestScoreIcon = this.add.image(
        //     GameGlobal.centerX,
        //     GameGlobal.centerY - GameGlobal.height * 0.45,
        //     "best-score"
        // );
        // this.bestScoreIcon.displayWidth = this.undoBtn.displayWidth;
        // this.bestScoreIcon.displayHeight = this.autoDisplayHeight(this.bestScoreIcon);

        // this.currentScore = this.add.bitmapText(
        //     GameGlobal.centerX - this.bestScoreIcon.displayWidth,
        //     GameGlobal.centerY - GameGlobal.height * 0.45,
        //     "basic-square-7-solid",
        //     "0", 0.05 * GameGlobal.width
        // ).setOrigin(1, 0.5);
        // this.currentScore.value = 0;

        // let bestRecord = 0;
        // try {
        //     let data = wx.getStorageSync("data")
        //     if (data) {
        //         data = JSON.parse(data);
        //         if (data.bestRecord) {
        //             bestRecord = data.bestRecord;

        //             // Make sure the best record in the local storage is synced
        //             wx.getOpenDataContext().postMessage({
        //                 action: "RankScene",
        //                 score: bestRecord,
        //                 update_time: data.lastUpdate
        //             });
        //         }
        //     }
        // } catch (e) {
        //     console.error(e);
        // }

        // this.bestScore = this.add.bitmapText(
        //     GameGlobal.centerX + this.bestScoreIcon.displayWidth,
        //     GameGlobal.centerY - GameGlobal.height * 0.45,
        //     "basic-square-7-solid",
        //     bestRecord, 0.05 * GameGlobal.width
        // ).setOrigin(0, 0.5);
        // this.bestScore.value = bestRecord;

        this.infoText = this.add.text(16, 16, "");

        this.add.text(16, this.scale.height - 16, "UP", { color: "black" })
            .setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.player.setVelocityY(-330);
            });

        this.add.text(64, this.scale.height - 16, "LEFT", { color: "black" })
            .setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                // this.player.setVelocityX(-160);
                this.player.turnRight();
            });

        this.add.text(144, this.scale.height - 16, "RIGHT", { color: "black" })
            .setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                // player.setVelocityX(160);
                this.player.turnLeft();
                this.player.anims.play("takeoff", true).on("animationcomplete", () => {
                    this.player.off("animationcomplete");
                    this.player.anims.play('flying', true).on("animationcomplete", () => {
                        this.player.anims.play('land', true);
                        this.player.off("animationcomplete");
                    });
                });
            });
    }

    update() {
        this.bgLayer2.tilePositionX -= .5;
        this.bgLayer3.tilePositionX -= .25;
        this.bgLayer4.tilePositionX += .05;

        if (!this.platforms || !this.infoText) {
            return;
        }

        const size = this.platforms.getLength();
        const used = this.platforms.getTotalUsed();
        const text = Phaser.Utils.String.Format(INFO_FORMAT, [size, used, size - used]);
        this.infoText.setText(text);

        // this.chesses.forEach((chess) => {
        //     if (chess.container.body.embedded) chess.container.body.touching.none = false;
        //     var touching = !chess.container.body.touching.none;
        //     var wasTouching = !chess.container.body.wasTouching.none;

        //     if (!touching && wasTouching) chess.emit("overlapend", chess);
        // });
    }

    spawnPlatforms() {
        range(Math.floor(this.scale.height / Platform.separation)).forEach((e, i) => {
            this.createPlatform(
                this.scale.width * 0.2 + Phaser.Math.Between(0, this.scale.width * 0.6 - Platform.width),
                this.scale.height - Platform.separation - Platform.separation * i
            );
        });
    }

    createPlatform(x, y) {
        if (!this.platforms) {
            return null;
        }

        const platform = this.platforms.spawn(x, y);

        if (!platform) {
            return;
        }

        return platform;
    }

    createChesses() {
        this.chesses = Chess.directions.reverse().map(([dx, dy]) => {
            return new Chess(this, dx, dy);
        });

        this.chesses.forEach((chess) => {
            this.physics.add.overlap(chess, this.board, function (block, tile) {
                let d = Math.sqrt(
                    Math.pow(block.parentContainer.x + block.x - tile.x, 2) +
                    Math.pow(block.parentContainer.y + block.y - tile.y, 2)
                );
                if (d < this.board.gridSize * 0.5) {
                    block.parentContainer.setPosition(
                        tile.x - block.x,
                        tile.y - block.y
                    );
                    block.parentContainer.onBoard = true;
                }
            }, function (block, tile) {
                block.tile = tile;
                return block.parentContainer.dragging && !block.parentContainer.onBoard;
            }, this);

            chess.on("overlapend", function (chess) {
                chess.container.onBoard = false;
                chess.container.iterate((block) => block.tile = null);
            });

            this.physics.add.overlap(chess.container, this.board);
        });
    }

    onPlaceChess(chess) {
        this.audio.playPlaceChess();
        this.chesses.splice(this.chesses.indexOf(chess), 1);
        if (!this.chesses.length) {
            this.createChesses();
        }

        if (this.chesses.length == Chess.directions.length) {
            this.chesses.forEach((chess) => chess.enter());
        }

        const matches = this.board.tiles.reduce((matches, row, i) => {
            return matches
                .concat(match(row) || [])
                .concat(match(this.board.tiles.map((row) => row[i])) || []);

            function match(row) {
                if (row.every((tile) => tile.occupied)) {
                    return [row];
                }
                return null;
            }
        }, []);

        if (matches.length) {
            this.undoBtn.onPlaceChess();
            chess.commit();
        } else {
            this.undoBtn.onPlaceChess(chess);
            this.tryGameOver();
        }

        let i = 0;
        matches.forEach((match) => {
            this.score(match, () => {
                i++;
                if (i == matches.length) {
                    this.tryGameOver();
                }
            });
        });
    }

    score(row, onComplete) {
        this.audio.playMatch();
        this.currentScore.value += row.length;
        this.currentScore.text = this.currentScore.value.toString();

        if (this.currentScore.value > this.bestScore.value) {
            this.bestScore.value = this.currentScore.value;
            this.bestScore.text = this.currentScore.text;

            wx.getOpenDataContext().postMessage({
                action: "RankScene",
                score: this.currentScore.value
            });

            wx.setStorage({
                key: "data",
                data: JSON.stringify({
                    bestRecord: this.currentScore.value,
                    lastUpdate: new Date().getTime()
                })
            });
        }

        row.forEach((tile) => {
            let block = tile.block;
            if (!tile.occupied) {
                return;
            }

            this.add.particles(`particles${block.colorIndex}`, null, {
                x: block.x,
                y: block.y,
                angle: { start: 0, end: 360, steps: 12 },
                speed: { random: [10, 150] },
                quantity: 2,
                alpha: { start: 1, end: 0 },
                maxParticles: 30,
                scale: 0.05
            });

            let blockDisplayWidth = block.displayWidth;
            let blockDisplayHeight = block.displayHeight;
            this.tweens.add({
                targets: block,
                duration: 400,
                displayWidth: { start: block.displayWidth, to: 0 },
                displayHeight: { start: block.displayHeight, to: 0 },
                ease: "Power2",
                onComplete: () => {
                    block.setVisible(false);
                    block.displayWidth = blockDisplayWidth;
                    block.displayHeight = blockDisplayHeight;

                    tile.occupied = false;
                    if (row.every((tile) => !tile.occupied)) {
                        onComplete();
                    }
                }
            });
        });
    }

    tryGameOver() {
        if (!this.chesses.some((chess) => {
            return this.board.getChildren().some((tile) => {
                return chess.container.list.every((block) => {
                    const r = this.board.tiles[tile.indexRepr[0] + block.indexRepr[0]];
                    const t = r && r[tile.indexRepr[1] + block.indexRepr[1]];
                    return t && !t.occupied;
                });
            });
        })) {
            this.chesses.forEach((chess) => {
                chess.shake(() => {
                    chess.shaked = true;
                    if (this.chesses.every((chess) => chess.shaked)) {
                        this.scene.pause();
                        this.scene.launch("GameEnded", { currentScore: this.currentScore.value });
                        this.scene.bringToTop("GameEnded");
                    }
                });
            });
        }
    }
}

function range(start, end) {
    if (!end) end = start, start = 0;
    return [...Array(end - start).keys()].map(i => i + start);
}