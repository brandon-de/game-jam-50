import Phaser from "phaser";
import TitleImg from "./assets/gamejam50-title-screen.png";
import PressStart2pImg from "./assets/press-start-2p.png";
import PressStart2pXml from "./assets/press-start-2p.xml";
import PressEnterSound from "./assets/gamejam50-title-enter.wav";
import PointerImage from "./assets/gamejam50-pointer.png";
import PointerSound from "./assets/gamejam50-game-frame-highlight.wav";

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super("TitleScene");
  }

  preload() {
    this.load.image("title", TitleImg);
    this.load.image("titlePointer", PointerImage);
    this.load.bitmapFont("PressStart2p", PressStart2pImg, PressStart2pXml);
    this.load.audio("pressEnter", PressEnterSound);
    this.load.audio("pointerMove", PointerSound);
  }

  create() {
    this.add.image(128, 120, "title");
    this.titlePointer = this.add.sprite(92, 138, "titlePointer");
    this.titlePointer.selectedOption = "START";
    this.pointerMoveSound = this.sound.add("pointerMove");
    this.pointerMoveSound.justPlayed = false;
    this.pressStartText = this.add.bitmapText(
      100,
      135,
      "PressStart2p",
      "START",
      8
    );
    this.pressRegisterText = this.add.bitmapText(
      48,
      155,
      "PressStart2p",
      "REGISTER FOR GAMEJAM",
      8
    );
    this.enterKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );
    this.isTriggerSceneTransition = false;

    this.input.keyboard.on(
      "keydown-DOWN",
      function (event) {
        if (
          !this.pointerMoveSound.justPlayed &&
          this.titlePointer.selectedOption != "REGISTER"
        ) {
          this.pointerMoveSound.play();
          this.pointerMoveSound.justPlayed = true;
        }

        this.titlePointer.setX(40);
        this.titlePointer.setY(158);
        this.titlePointer.selectedOption = "REGISTER";
      },
      this
    );

    this.input.keyboard.on(
      "keydown-UP",
      function (event) {
        if (
          !this.pointerMoveSound.justPlayed &&
          this.titlePointer.selectedOption != "START"
        ) {
          this.pointerMoveSound.play();
          this.pointerMoveSound.justPlayed = true;
        }

        this.titlePointer.setY(138);
        this.titlePointer.setX(92);
        this.titlePointer.selectedOption = "START";
      },
      this
    );

    this.input.keyboard.on(
      "keyup-DOWN",
      function (event) {
        this.pointerMoveSound.justPlayed = false;
      },
      this
    );

    this.input.keyboard.on(
      "keyup-UP",
      function (event) {
        this.pointerMoveSound.justPlayed = false;
      },
      this
    );
  }

  update() {
    if (this.enterKey.isDown && !this.isTriggerSceneTransition) {
      this.isTriggerSceneTransition = true;
      this.transitionTimer = this.time.addEvent({
        delay: 200,
        callback: this.triggerSceneTransition,
        callbackScope: this,
        repeat: 5,
      });
      this.sound.play("pressEnter");
    }
  }

  triggerSceneTransition() {
    this.pressStartText.visible && this.titlePointer.selectedOption == "START"
      ? this.pressStartText.setVisible(false)
      : this.pressStartText.setVisible(true);

    this.pressRegisterText.visible &&
    this.titlePointer.selectedOption == "REGISTER"
      ? this.pressRegisterText.setVisible(false)
      : this.pressRegisterText.setVisible(true);

    if (this.transitionTimer.getRepeatCount() == 0) {
      if (this.titlePointer.selectedOption == "REGISTER") {
        this.isTriggerSceneTransition = false;
        window.open("https://itch.io/jams");
      } else {
        this.scene.start("GameSelectScene");
      }
    }
  }
}
