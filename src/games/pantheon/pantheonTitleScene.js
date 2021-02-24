import Phaser from "phaser";
import PantheonTitleImg from "./assets/pantheon-title-screen.png";
import PressStart2pImg from "./assets/press-start-2p.png";
import PressStart2pXml from "./assets/press-start-2p.xml";
import ArrowPointerImage from "./assets/gamejam50-pantheon-projectile-arrow.png";
import MenuMoveSound from "./assets/pantheon-menu-move.wav";

export default class PantheonTitleScene extends Phaser.Scene {
  constructor() {
    super("PantheonTitleScene");
  }

  preload() {
    this.load.image("pantheonTitleImg", PantheonTitleImg);
    this.load.bitmapFont("PressStart2p", PressStart2pImg, PressStart2pXml);
    this.load.image("arrowPointer", ArrowPointerImage);
    this.load.audio("menuMove", MenuMoveSound);
  }

  create() {
    this.add.image(128, 120, "pantheonTitleImg");
    this.arrowPointer = this.add.sprite(88, 129, "arrowPointer");
    this.arrowPointer.setScale(2);
    this.menuMoveSound = this.sound.add("menuMove");
    this.menuMoveSound.justPlayed = false;

    this.pressStartText = this.add.bitmapText(
      100,
      125,
      "PressStart2p",
      "START",
      8
    );
    this.pressStartText = this.add.bitmapText(
      100,
      145,
      "PressStart2p",
      "CONTROLS",
      8
    );
    this.enterKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );

    this.input.keyboard.on('keydown-DOWN', function (event){
        this.arrowPointer.setY(149);
    }, this);

    this.input.keyboard.on('keydown-UP', function (event){
        this.arrowPointer.setY(129);
    }, this);
  }

  update(){
    /**if(this.cursors.down.isDown){
          this.arrowPointer.setY(149);
          if(!this.menuMoveSound.justPlayed){
            this.menuMoveSound.play();
            this.menuMoveSound.justPlayed = true;
          }
      }
      else if( this.cursors.down.)
      else if(this.cursors.up.isDown){
          this.arrowPointer.setY(129);
          this.menuMoveSound.play();
      }**/
  }
}
