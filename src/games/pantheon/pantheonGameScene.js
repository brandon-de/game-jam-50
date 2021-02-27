import Phaser from "phaser";
import LevelData from "./assets/gamejam50-pantheon-level1.json";
import TileSetImage from "./assets/gamejam50-pantheon-tileset.png";
import PlayerImage from "./assets/gamejam50-pantheon-player.png";
import PlayerData from "./assets/gamejam50-pantheon-player.json";
import ProjectileArrowImage from "./assets/gamejam50-pantheon-projectile-arrow.png";
import PressStart2pImg from "./assets/press-start-2p.png";
import PressStart2pXml from "./assets/press-start-2p.xml";
import PlayerHealthBarImage from "./assets/pantheon-game-health-bar.png";
import PlayerHealthBarData from "./assets/pantheon-game-health-bar.json";

export default class PantheonGameScene extends Phaser.Scene {
  constructor() {
    super({
      key: "PantheonGameScene",
      physics: {
        default: "arcade",
        arcade: {
          debug: false,
          gravity: { y: 200 },
        },
      },
    });
  }

  preload() {
    this.load.image("tiles", TileSetImage);
    this.load.tilemapTiledJSON("map", LevelData);
    this.load.aseprite("player", PlayerImage, PlayerData);
    this.load.aseprite(
      "playerHealthBar",
      PlayerHealthBarImage,
      PlayerHealthBarData
    );
    this.load.image("projectileArrow", ProjectileArrowImage);
    this.load.bitmapFont("PressStart2p", PressStart2pImg, PressStart2pXml);
  }

  create() {
    var map = this.make.tilemap({ key: "map" });
    var tileset = map.addTilesetImage("gamejam50-pantheon-tileset", "tiles");
    var platformLayer = map.createLayer("platforms", tileset, 0, 0);

    this.anims.createFromAseprite("player");
    this.player = this.add.sprite(128, 100, "player");
    this.cursors = this.input.keyboard.createCursorKeys();
    this.zkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.xkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);    
    this.score = { number: 0 };
    this.score.textStatic = this.add.bitmapText(2, 12, "PressStart2p", "SCORE", 8);
    this.score.textDynamic = this.add.bitmapText(44, 12, "PressStart2p", this.score.number.toString(), 8);
    this.playerHealth = { current: 4, max: 4, bars: [] };
    for (var index = 0; index < this.playerHealth.max; index++) {
      this.playerHealth.bars.push(this.add.sprite(54 + (index * 5), 5, "playerHealthBar"));
    }
    this.playerHealth.text = this.add.bitmapText(2, 2, "PressStart2p", "PLAYER", 8);


    platformLayer.setCollision([1]);
    this.physics.add.existing(this.player);
    this.physics.add.collider(this.player, platformLayer);

    this.projectileArrows = this.physics.add.group({
      defaultKey: "projectileArrow",
      maxSize: 20,
      allowGravity: false,
    });

    this.player.on(
      Phaser.Animations.Events.ANIMATION_COMPLETE,
      this.onPlayerAnimComplete.bind(this)
    );
  }

  update() {
    if (this.zkey.isDown && !this.cursors.down.isDown) {
      this.player.body.setVelocityX(0);

      if (this.cursors.up.isDown) {
        this.player.flipX = false;
        this.player.play("arrow-fire-up", true);
      } else {
        this.player.play("arrow-fire-stand", true);

        if (this.cursors.left.isDown && !this.player.flipX) {
          this.player.flipX = true;
        } else if (this.cursors.right.isDown && this.player.flipX) {
          this.player.flipX = false;
        }
      }
    } else if (this.cursors.down.isDown) {
      if (this.cursors.left.isDown) {
        this.player.flipX = true;
      } else if (this.cursors.right.isDown) {
        this.player.flipX = false;
      }

      if (this.zkey.isDown) {
        this.player.anims.play("arrow-fire-crouch", true);
      } else {
        this.player.anims.play("crouch", true);
      }

      this.player.body.setVelocityX(0);
    } else if (this.cursors.right.isDown) {
      this.player.flipX = false;
      this.player.anims.play("walk", true);
      this.player.body.setVelocityX(40);
    } else if (this.cursors.left.isDown) {
      this.player.flipX = true;
      this.player.anims.play("walk", true);
      this.player.body.setVelocityX(-40);
    } else {
      this.player.body.setVelocityX(0);
      this.player.anims.play("idle", true);
    }

    this.projectileArrows.children.each(
      function (arrow) {
        if (
          (Math.abs(arrow.startX - arrow.x) ||
            Math.abs(arrow.startY - arrow.y)) > 55
        ) {
          arrow.setActive(false);
          arrow.setVisible(false);
        }
      }.bind(this)
    );
  }

  onPlayerAnimComplete() {
    var velocity = 250;

    if (
      this.player.anims.currentAnim.key == "arrow-fire-crouch" ||
      this.player.anims.currentAnim.key == "arrow-fire-stand"
    ) {
      var xPosBuffer = 3;
      var yPosBuffer = 6;

      if (this.player.flipX) {
        velocity *= -1;
        xPosBuffer *= -1;
      }

      if (this.player.anims.currentAnim.key == "arrow-fire-stand") {
        yPosBuffer = -1;
      }

      var arrow = this.projectileArrows.get(
        this.player.x + xPosBuffer,
        this.player.y + yPosBuffer
      );
      if (arrow) {
        arrow.angle = 0.0;
        arrow.flipX = this.player.flipX;
        arrow.setActive(true);
        arrow.setVisible(true);
        arrow.startX = arrow.x;
        arrow.startY = arrow.y;
        arrow.body.setVelocityX(velocity);
        arrow.body.setVelocityY(0);
      }
    } else if (this.player.anims.currentAnim.key == "arrow-fire-up") {
      var arrow = this.projectileArrows.get(this.player.x, this.player.y + -2);
      if (arrow) {
        arrow.flipX = false;
        arrow.angle = -90.0;
        arrow.setActive(true);
        arrow.setVisible(true);
        arrow.startX = arrow.x;
        arrow.startY = arrow.y;
        arrow.body.setVelocityY(velocity * -1);
        arrow.body.setVelocityX(0);
      }
    }
  }
}
