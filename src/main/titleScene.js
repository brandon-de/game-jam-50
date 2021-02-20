import Phaser from 'phaser';
import TitleImg from './assets/gamejam50-title-screen.png';
import PressStart2pImg from './assets/press-start-2p.png';
import PressStart2pXml from './assets/press-start-2p.xml';
import PressEnterSound from './assets/gamejam50-title-enter.wav';

export default class TitleScene extends Phaser.Scene {

    constructor() {
        super('TitleScene');
    }

    preload() {
        this.load.image('title', TitleImg);
        this.load.bitmapFont('PressStart2p', PressStart2pImg, PressStart2pXml);
        this.load.audio('pressEnter', PressEnterSound);
    }

    create() {
        this.add.image(128, 120, 'title');
        this.pressStartText = this.add.bitmapText(80, 150, "PressStart2p", "PRESS ENTER", 8);
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.isTriggerSceneTransition = false;
    }

    update() {
        if (this.enterKey.isDown && !this.isTriggerSceneTransition) {
            this.isTriggerSceneTransition = true;
            this.transitionTimer = this.time.addEvent({ delay: 200, callback: this.triggerSceneTransition, callbackScope: this, repeat: 5 });
            this.sound.play('pressEnter');
        }
    }

    triggerSceneTransition() {
        this.pressStartText.visible ? this.pressStartText.setVisible(false) : this.pressStartText.setVisible(true);

        if (this.transitionTimer.getRepeatCount() == 0) {
            this.scene.start('GameSelectScene');
        }
    }
}