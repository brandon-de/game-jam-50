import Phaser from 'phaser';
import TitleScene from './TitleScene';

const config = {
    type: Phaser.AUTO,
    parent: 'ufo50-game-jam',
    width: 256,
    height: 240,
    pixelArt: true,
    zoom: 2,
    scene: [TitleScene],
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH  
    }
};

const game = new Phaser.Game(config);
