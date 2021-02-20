import Phaser from 'phaser';
import LevelData from './assets/gamejam50-pantheon-level1.json';
import TileSetImage from './assets/gamejam50-pantheon-tileset.png';
import PlayerImage from './assets/gamejam50-pantheon-player.png'
import PlayerData from './assets/gamejam50-pantheon-player.json'

export default class PantheonGameScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'PantheonGameScene',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 200 }
        }
      }
    });
  }

  preload() {
    this.load.image('tiles', TileSetImage);
    this.load.tilemapTiledJSON('map', LevelData);
    this.load.aseprite('player', PlayerImage, PlayerData);
  }

  create() {
    var map = this.make.tilemap({ key: 'map' });
    var tileset = map.addTilesetImage('gamejam50-pantheon-tileset', 'tiles');
    var platformLayer = map.createLayer('platforms', tileset, 0, 0);

    this.anims.createFromAseprite('player');
    this.player = this.add.sprite(32, 32, 'player');
    this.cursors = this.input.keyboard.createCursorKeys();
    this.zkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.xkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);

    platformLayer.setCollision([1]);
    this.physics.add.existing(this.player);
    this.physics.add.collider(this.player, platformLayer);
  }

  update() {
    if (this.zkey.isDown && !this.cursors.down.isDown) {
      this.player.body.setVelocityX(0);
      this.player.play('arrow-fire-stand', true);

      if(this.cursors.left.isDown && !this.player.flipX)
      {
        this.player.flipX = true;
      }
      else if(this.cursors.right.isDown && this.player.flipX)
      {
        this.player.flipX = false;
      }
    }
    else if (this.cursors.down.isDown) {
      if (this.cursors.left.isDown) {
        this.player.flipX = true;
      }
      else if (this.cursors.right.isDown) {
        this.player.flipX = false;
      }

      if (this.zkey.isDown) {
        this.player.anims.play('arrow-fire-crouch', true);
      }
      else {
        this.player.anims.play('crouch', true);
      }

      this.player.body.setVelocityX(0);
    }
    else if (this.cursors.right.isDown) {
      this.player.flipX = false;
      this.player.anims.play('walk', true);
      this.player.body.setVelocityX(40);
    }
    else if (this.cursors.left.isDown) {
      this.player.flipX = true;
      this.player.anims.play('walk', true);
      this.player.body.setVelocityX(-40);
    }
    else {
      this.player.body.setVelocityX(0);
      this.player.anims.play('idle', true);
    }
  }
}