import Phaser from 'phaser';
import TitleImg from './assets/ufo50-game-jam-title-screen.png';

class TitleScene extends Phaser.Scene {
    constructor(){
        super();
    }

    preload ()
    {
        this.load.image('title', TitleImg);
        this.load.bitmapFont('nes', 'src/assets/press-start-2p.png', 'src/assets/press-start-2p.xml');
    }
      
    create ()
    {
        this.add.image(128, 120, 'title');
        this.add.bitmapText(80, 150, "nes", "PRESS START", 8);
    }
}

export default TitleScene;