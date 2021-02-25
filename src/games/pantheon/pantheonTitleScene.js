import Phaser from "phaser";
import PantheonTitleImg from "./assets/pantheon-title-screen.png";
import PressStart2pImg from "./assets/press-start-2p.png";
import PressStart2pXml from "./assets/press-start-2p.xml";
import ArrowPointerImage from "./assets/gamejam50-pantheon-projectile-arrow.png";
import MenuMoveSound from "./assets/pantheon-menu-move.wav";
import MenuSelectSound from "./assets/pantheon-menu-select.wav";

export default class PantheonTitleScene extends Phaser.Scene {
  constructor() {
    super("PantheonTitleScene");
  }

  preload() {
    this.load.image("pantheonTitleImg", PantheonTitleImg);
    this.load.bitmapFont("PressStart2p", PressStart2pImg, PressStart2pXml);
    this.load.image("arrowPointer", ArrowPointerImage);
    this.load.audio("menuMove", MenuMoveSound);
    this.load.audio("menuSelect", MenuSelectSound);
  }

  create() {
    this.add.image(128, 120, "pantheonTitleImg");
    this.arrowPointer = this.add.sprite(88, 129, "arrowPointer");
    this.arrowPointer.setScale(2);
    this.arrowPointer.selectedOption = "START";
    this.menuMoveSound = this.sound.add("menuMove");
    this.menuMoveSound.justPlayed = false;
    this.isTriggerSceneTransition = false;

    this.pressStartText = this.add.bitmapText(
      100,
      125,
      "PressStart2p",
      "START",
      8
    );
    this.pressOptionsText = this.add.bitmapText(
      100,
      145,
      "PressStart2p",
      "CONTROLS",
      8
    );
    this.enterKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );

    this.input.keyboard.on(
      "keydown-DOWN",
      function (event) {
        if (!this.menuMoveSound.justPlayed && this.arrowPointer.selectedOption != 'OPTIONS') {
          this.menuMoveSound.play();
          this.menuMoveSound.justPlayed = true;
        }

        this.arrowPointer.setY(149);
        this.arrowPointer.selectedOption = 'OPTIONS';        
      },
      this
    );

    this.input.keyboard.on(
      "keyup-DOWN",
      function (event) {
        this.menuMoveSound.justPlayed = false;
      },
      this
    );

    this.input.keyboard.on(
      "keydown-UP",
      function (event) {
        if (!this.menuMoveSound.justPlayed && this.arrowPointer.selectedOption != 'START') {
          this.menuMoveSound.play();
          this.menuMoveSound.justPlayed = true;
        }

        this.arrowPointer.setY(129);
        this.arrowPointer.selectedOption = 'START';        
      },
      this
    );

    this.input.keyboard.on(
      "keyup-UP",
      function (event) {
        this.menuMoveSound.justPlayed = false;
      },
      this
    );
  }

  update() {
    if (
      this.enterKey.isDown &&
      !this.isTriggerSceneTransition &&
      this.arrowPointer.selectedOption == "START"
    ) {
      this.isTriggerSceneTransition = true;
      this.transitionTimer = this.time.addEvent({
        delay: 200,
        callback: this.triggerSceneTransition,
        callbackScope: this,
        repeat: 5,
      });
      this.sound.play("menuSelect");
    }
  }

  triggerSceneTransition() {
    this.pressStartText.visible
      ? this.pressStartText.setVisible(false)
      : this.pressStartText.setVisible(true);

    if (this.transitionTimer.getRepeatCount() == 0) {
      this.scene.start("PantheonGameScene");
    }
  }
}
