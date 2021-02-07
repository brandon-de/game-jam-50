import Phaser from 'phaser';
import GameSelectScene from './gameSelectScene';
import TitleScene from './titleScene';
import PantheonGameScene from './pantheonGameScene';

const config = {
    type: Phaser.AUTO,
    parent: 'gamejam50',
    width: 256,
    height: 240,
    pixelArt: true,
    zoom: 2,
    scene: [TitleScene, GameSelectScene, PantheonGameScene],
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    audio: {
        disableWebAudio: true
    },
    debug: true
};

const game = new Phaser.Game(config);
