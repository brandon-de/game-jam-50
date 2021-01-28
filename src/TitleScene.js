import Phaser from 'phaser';
import TitleImg from './assets/ufo50-game-jam-title-screen.png';
import PressStart2pImg from './assets/press-start-2p.png';
import PressStart2pXml from './assets/press-start-2p.xml';

export default class TitleScene extends Phaser.Scene {

    constructor(){
        super('TitleScene');
    }

    preload ()
    {
        this.load.image('title', TitleImg);
        this.load.bitmapFont('PressStart2p', PressStart2pImg, PressStart2pXml);
    }    
      
    create ()
    {
        this.add.image(128, 120, 'title');
        this.pressStartText = this.add.bitmapText(80, 150, "PressStart2p", "PRESS START", 8);
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.isTriggerSceneTransition = false;
    }

    update ()
    {
        if(this.enterKey.isDown && !this.isTriggerSceneTransition)
        {
            this.isTriggerSceneTransition = true;
            this.transitionTimer = this.time.addEvent({ delay: 300, callback: this.triggerSceneTransition, callbackScope: this, repeat: 5 });        
        }
    }

    triggerSceneTransition ()
    {
        this.pressStartText.visible ? this.pressStartText.setVisible(false) : this.pressStartText.setVisible(true);

        if(this.transitionTimer.getRepeatCount() == 0)
        {
            this.scene.start('GameSelectScene');
        }
    }
}