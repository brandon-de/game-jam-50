import Phaser from 'phaser';
import TitleImg from './assets/ufo50-game-jam-title-screen.png';

class TitleScene extends Phaser.Scene {
    constructor(){
        super();
    }

    preload ()
    {
        this.load.image('title', TitleImg);
    }
      
    create ()
    {
        const logo = this.add.image(128, 120, 'title');
    }
}

export default TitleScene;