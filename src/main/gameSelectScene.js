import Phaser from "phaser";
import GameFrameSheetImg from "./assets/gamejam50-game-frame.png";
import GameFrameSheetData from "./assets/gamejam50-game-frame.json";
import PressStart2pImg from "./assets/press-start-2p.png";
import PressStart2pXml from "./assets/press-start-2p.xml";
import DinoRunGameFrameImg from "./assets/dino-run-game-frame.png";
import PaginatorImg from "./assets/gamejam50-paginator.png";
import PaginatorData from "./assets/gamejam50-paginator.json";
import GameFrameHighlightSound from "./assets/gamejam50-game-frame-highlight.wav";
import PaginatorHighlightSound from "./assets/gamejam50-paginator-highlight.wav";
import MenuNegativeSound from "./assets/gamejam50-negative-menu.wav";
import GameSelectSound from "./assets/gamejam50-game-select.wav";
import PantheonGameFrameImg from "./assets/pantheon-game-frame.png";

export default class GameSelectScene extends Phaser.Scene {
  constructor() {
    super("GameSelectScene");
    this.gameFrames = [];
  }

  preload() {
    this.load.aseprite("gameFrame", GameFrameSheetImg, GameFrameSheetData);
    this.load.aseprite("paginator", PaginatorImg, PaginatorData);
    this.load.bitmapFont("PressStart2p", PressStart2pImg, PressStart2pXml);
    this.load.image("dinoRunGameFrame", DinoRunGameFrameImg);
    this.load.image("pantheonGameFrame", PantheonGameFrameImg);
    this.load.audio("gameFrameHighlight", GameFrameHighlightSound);
    this.load.audio("paginatorHighlight", PaginatorHighlightSound);
    this.load.audio("menuNegative", MenuNegativeSound);
    this.load.audio("gameSelect", GameSelectSound);
    // TODO: Load this from JSON
    this.games = [
      {},
      {},
      {
        text: "PANTHEON",
        image: "pantheonGameFrame",
        sceneName: "PantheonGameScene",
      },
      {},
      {},
      {},
      {},
      {},
      {},
    ];
  }

  create() {
    var gameFrameHighlightSound = this.sound.add("gameFrameHighlight");
    var paginatorHighlightSound = this.sound.add("paginatorHighlight");
    var menuNegativeSound = this.sound.add("menuNegative");
    var gameSelectSound = this.sound.add("gameSelect");
    this.anims.createFromAseprite("gameFrame");

    var currentX = 44;
    var currentY = 38;
    for (var i = 0; i < 9; i++) {
      if (i % 3 == 0 && i != 0) {
        currentX = 44;
        currentY += 78;
      } else if (i != 0) {
        currentX += 82;
      }

      var gameFrame = this.add
        .sprite(currentX, currentY, "gameFrame")
        .setInteractive();
      gameFrame.sceneName =
        this.games[i].sceneName == undefined ? null : this.games[i].sceneName;

      if (this.games[i].text != undefined) {
        this.add.bitmapText(
          currentX - 30,
          currentY + 30,
          "PressStart2p",
          this.games[i].text,
          8
        );
      }

      if (this.games[i].image != undefined) {
        this.add.image(currentX, currentY, this.games[i].image);
      }

      gameFrame.on("pointerover", function (_pointer) {
        _pointer.manager.game.input.setDefaultCursor("pointer");
        this.setFrame("1");
        gameFrameHighlightSound.play();
      });
      gameFrame.on("pointerout", function (_pointer) {
        _pointer.manager.game.input.setDefaultCursor("context-menu");
        this.setFrame("0");
      });
      gameFrame.on(
        "pointerdown",
        this.onGameFrameClick.bind(
          this,
          gameFrame,
          gameSelectSound,
          menuNegativeSound
        )
      );
      gameFrame.on(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        this.onGameFrameAnimComplete.bind(this, gameFrame)
      );

      this.gameFrames.push(gameFrame);
    }

    for (let i = 0; i < 3; i++) {
      var paginator = this.add
        .sprite(117 + i * 10, 230, "paginator")
        .setInteractive();

      paginator.on("pointerover", function (_pointer) {
        _pointer.manager.game.input.setDefaultCursor("pointer");
        this.setFrame("1");
        paginatorHighlightSound.play();
      });
      paginator.on("pointerout", function (_pointer) {
        _pointer.manager.game.input.setDefaultCursor("context-menu");

        if (!this.currentPage) {
          this.setFrame("0");
        }
      });
      // TODO: Actually paginate and move camera instead of disabling buttons
      paginator.on("pointerdown", function (_pointer) {
        if (!this.currentPage) {
          menuNegativeSound.play();
        }
      });

      if (i == 0) {
        paginator.setFrame(1);
        paginator.currentPage = true;
      }
    }
  }

  onGameFrameClick(gameFrame, gameSelectSound, menuNegativeSound, pointer) {
    if (gameFrame.sceneName == undefined) {
      menuNegativeSound.play();
    } else {
      gameSelectSound.play();
      gameFrame.play({ key: "flash", repeat: 6 });
    }
  }

  onGameFrameAnimComplete(gameFrame) {
    this.scene.start(gameFrame.sceneName);
  }
}
