import Phaser from 'phaser';
import GameFrameSheetImg from './assets/ufo50-game-jam-game-frame.png';
import GameFrameSheetData from './assets/ufo50-game-jam-game-frame.json';
import PressStart2pImg from './assets/press-start-2p.png';
import PressStart2pXml from './assets/press-start-2p.xml';
import DinoRunGameFrameImg from './assets/dino-run-game-frame.png';
import PaginatorImg from './assets/ufo50-game-jam-paginator.png';
import PaginatorData from './assets/ufo50-game-jam-paginator.json';
import GameFrameHighlightSound from './assets/ufo50-game-jam-game-frame-highlight.wav';
import PaginatorHighlightSound from './assets/ufo50-game-jam-paginator-highlight.wav';

export default class GameSelectScene extends Phaser.Scene {

    constructor(){
        super('GameSelectScene');
        this.gameFrames = [];
    }

    preload ()
    {        
        this.load.aseprite('gameFrame', GameFrameSheetImg, GameFrameSheetData);
        this.load.aseprite('paginator', PaginatorImg, PaginatorData);
        this.load.bitmapFont('PressStart2p', PressStart2pImg, PressStart2pXml);
        this.load.image('dinoRunGameFrame', DinoRunGameFrameImg);        
        this.load.audio('gameFrameHighlight', GameFrameHighlightSound);
        this.load.audio('paginatorHighlight', PaginatorHighlightSound);
        this.games = [{},{},{text: "DINO RUN", image: 'dinoRunGameFrame'},{},{},{},{},{},{}]; // TODO: Load this from JSON
    }    
      
    create ()
    {
        var gameFrameHighlightSound = this.sound.add('gameFrameHighlight');
        var paginatorHighlightSound = this.sound.add('paginatorHighlight');

        var currentX = 44;
        var currentY = 38;
        for (var i = 0; i < 9; i++) 
        {
            if(i % 3 == 0 && i != 0)
            {
                currentX = 44;
                currentY += 78;
            }   
            else if(i != 0)
            {
                currentX += 82;
            }         

            var gameFrame = this.add.sprite(currentX, currentY, 'gameFrame').setInteractive();

            if(this.games[i].text != undefined)
            {
                this.add.bitmapText(currentX - 30, currentY + 30, "PressStart2p", this.games[i].text, 8);
            }

            if(this.games[i].image != undefined)
            {
                this.add.image(currentX, currentY, this.games[i].image);
            }

            gameFrame.on('pointerover', function(_pointer) {
                _pointer.manager.game.input.setDefaultCursor('pointer');
                this.setFrame('1');
                gameFrameHighlightSound.play();
            });
            gameFrame.on('pointerout', function(_pointer) {
                _pointer.manager.game.input.setDefaultCursor('context-menu');
                this.setFrame('0');
            });

            this.gameFrames.push(gameFrame);
        }

        for (let i = 0; i < 3; i++) 
        {
            var paginator = this.add.sprite(117 + (i * 10), 230, 'paginator').setInteractive();

            paginator.on('pointerover', function(_pointer) {
                _pointer.manager.game.input.setDefaultCursor('pointer');
                this.setFrame('1');
                paginatorHighlightSound.play();
            });
            paginator.on('pointerout', function(_pointer) {
                _pointer.manager.game.input.setDefaultCursor('context-menu');

                if(!this.currentPage)
                {
                    this.setFrame('0');
                }
            });            

            if(i == 0)
            {
                paginator.setFrame(1);
                paginator.currentPage = true;
            }
        }
        
    }
}