import Phaser from "phaser";
import GameSelectScene from "./main/gameSelectScene";
import TitleScene from "./main/titleScene";
import PantheonGameScene from "./games/pantheon/pantheonGameScene";
import PantheonTitleScene from "./games/pantheon/pantheonTitleScene";

const config = {
  type: Phaser.AUTO,
  parent: "gamejam50",
  width: 256,
  height: 240,
  pixelArt: true,
  roundPixel: false,
  antialias: false,
  zoom: 2.5,
  scene: [TitleScene, GameSelectScene, PantheonTitleScene, PantheonGameScene],
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  audio: {
    disableWebAudio: true,
  },
  debug: true,
};

const game = new Phaser.Game(config);
