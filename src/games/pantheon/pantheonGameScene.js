import Phaser from "phaser";
import LevelData2 from "./assets/pantheon-level1.json";
import TileSetImage2 from "./assets/pantheon-tileset.png";
import PlayerImage from "./assets/gamejam50-pantheon-player.png";
import PlayerData from "./assets/gamejam50-pantheon-player.json";
import ProjectileArrowImage from "./assets/gamejam50-pantheon-projectile-arrow.png";
import PressStart2pImg from "./assets/press-start-2p.png";
import PressStart2pXml from "./assets/press-start-2p.xml";
import PlayerHealthBarImage from "./assets/pantheon-game-health-bar.png";
import PlayerHealthBarData from "./assets/pantheon-game-health-bar.json";
import SkeletonImage from "./assets/pantheon-game-skeleton.png";
import SkeletonData from "./assets/pantheon-game-skeleton.json";
import Skeleton from "./pantheonSkeleton";
import ArrowSound from "./assets/pantheon-arrow-shoot.wav";
import HitSound from "./assets/pantheon-hit.wav";
import ExplodeImage from "./assets/pantheon-explosion.png";
import ExplodeData from "./assets/pantheon-explosion.json";
import Explosion from "./pantheonExplosion";
import ExplodeSound from "./assets/pantheon-explosion.wav";
import Spawner from "./Spawner";
import BoneImage from "./assets/pantheon-bone.png";
import BoneData from "./assets/pantheon-bone.json";
import Bone from "./pantheonBone";
import SmallExplodeSound from "./assets/pantheon-small-explosion.wav";
import SmallExplodeImage from "./assets/pantheon-small-explosion.png";
import SmallExplodeData from "./assets/pantheon-small-explosion.json";
import SmallExplosion from "./pantheonSmallExplosion";
import PlayerHitSound from "./assets/pantheon-player-hit.wav";

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
    this.load.image("tiles", TileSetImage2);
    this.load.tilemapTiledJSON("map", LevelData2);
    this.load.aseprite("bone", BoneImage, BoneData);
    this.load.aseprite("player", PlayerImage, PlayerData);
    this.load.aseprite("skeleton", SkeletonImage, SkeletonData);
    this.load.aseprite("explode", ExplodeImage, ExplodeData);
    this.load.aseprite(
      "playerHealthBar",
      PlayerHealthBarImage,
      PlayerHealthBarData
    );
    this.load.aseprite("smallExplode", SmallExplodeImage, SmallExplodeData);
    this.load.image("projectileArrow", ProjectileArrowImage);
    this.load.bitmapFont("PressStart2p", PressStart2pImg, PressStart2pXml);
    this.load.audio("arrowShoot", ArrowSound);
    this.load.audio("hit", HitSound);
    this.load.audio("boom", ExplodeSound);
    this.load.audio("smallBoom", SmallExplodeSound);
    this.load.audio("playerHit", PlayerHitSound);
  }

  create() {
    var camera = this.cameras.main;
    camera.centerOn(160, 120);

    var map = this.make.tilemap({ key: "map" });
    var tileset = map.addTilesetImage("pantheon-tileset", "tiles");
    this.platformLayer = map.createLayer("platforms", tileset, 0, 0);
    this.backgroundLayer = map.createLayer("background", tileset, 0, 0);
    this.anims.createFromAseprite("player");
    this.anims.createFromAseprite("skeleton");
    this.anims.createFromAseprite("explode");
    this.anims.createFromAseprite("bone");
    this.anims.createFromAseprite("smallExplode");
    this.player = this.add.sprite(160, 120, "player");
    this.player.facingRight = true;
    this.cursors = this.input.keyboard.createCursorKeys();
    this.zkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.xkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    this.score = { number: 0 };
    this.score.textStatic = this.add.bitmapText(
      34,
      12,
      "PressStart2p",
      "SCORE",
      8
    );
    this.score.textDynamic = this.add.bitmapText(
      76,
      12,
      "PressStart2p",
      this.score.number.toString(),
      8
    );
    this.playerHealth = { current: 4, max: 4, bars: [] };
    for (var index = 0; index < this.playerHealth.max; index++) {
      this.playerHealth.bars.push(
        this.add.sprite(86 + index * 5, 5, "playerHealthBar")
      );
    }
    this.playerHealth.text = this.add.bitmapText(
      34,
      2,
      "PressStart2p",
      "PLAYER",
      8
    );

    this.platformLayer.setCollision([1]);
    this.physics.add.existing(this.player);

    this.projectileArrows = this.physics.add.group({
      defaultKey: "projectileArrow",
      frameQuantity: 10,
      allowGravity: false,
      runChildUpdate: true,
      active: false,
      visible: false,
    });

    this.explosions = this.physics.add.group({
      classType: Explosion,
      frameQuantity: 5,
      allowGravity: false,
      runChildUpdate: true,
      active: false,
      visible: false,
    });

    this.skeletons = this.physics.add.group({
      classType: Skeleton,
      frameQuantity: 10,
      allowGravity: true,
      runChildUpdate: true,
      active: true,
      visible: true,
    });

    this.bones = this.physics.add.group({
      classType: Bone,
      frameQuantity: 20,
      allowGravity: false,
      runChildUpdate: true,
      active: true,
      visible: true,
    });

    this.smallExplosions = this.physics.add.group({
      classType: SmallExplosion,
      frameQuantity: 20,
      allowGravity: false,
      runChildUpdate: true,
      active: true,
      visible: true,
    });

    this.player.on(
      Phaser.Animations.Events.ANIMATION_COMPLETE,
      this.onPlayerAnimComplete.bind(this)
    );

    this.physics.add.collider(this.player, this.platformLayer);
    this.physics.add.collider(this.skeletons, this.platformLayer);
    this.physics.add.collider(
      this.bones,
      this.platformLayer,
      this.onBoneOverlap,
      null,
      this
    );
    this.physics.add.overlap(
      this.projectileArrows,
      this.skeletons,
      this.onArrowOverlap,
      null,
      this
    );
    this.physics.add.overlap(
      this.bones,
      this.player,
      this.onPlayerBonesOverlap,
      null,
      this
    );

    this.spawnOppositeSide = false;
    this.time.addEvent({
      delay: Math.floor(Math.random() * 2500) + 500,
      callback: this.spawnSkeletons,
      callbackScope: this,
      repeat: 8,
    });
  }

  update(time, delta) {
    if (this.zkey.isDown && !this.cursors.down.isDown) {
      this.player.body.setVelocityX(0);

      if (this.cursors.up.isDown) {
        this.player.flipX = false;
        this.player.play("arrow-fire-up", true);
      } else {
        this.player.play("arrow-fire-stand", true);

        if (this.cursors.left.isDown && !this.player.flipX) {
          this.player.facingRight = false;
          this.player.flipX = true;
        } else if (this.cursors.right.isDown && this.player.flipX) {
          this.player.facingRight = true;
          this.player.flipX = false;
        }
      }
    } else if (this.cursors.down.isDown) {
      if (this.cursors.left.isDown) {
        this.player.facingRight = false;
        this.player.flipX = true;
      } else if (this.cursors.right.isDown) {
        this.player.facingRight = true;
        this.player.flipX = false;
      }

      if (this.zkey.isDown) {
        this.player.anims.play("arrow-fire-crouch", true);
      } else {
        this.player.anims.play("crouch", true);
      }

      this.player.body.setVelocityX(0);
    } else if (this.cursors.right.isDown) {
      this.player.facingRight = true;
      this.player.flipX = false;
      this.player.anims.play("walk", true);
      this.player.body.setVelocityX(40);
    } else if (this.cursors.left.isDown) {
      this.player.facingRight = false;
      this.player.flipX = true;
      this.player.anims.play("walk", true);
      this.player.body.setVelocityX(-40);
    } else {
      this.player.body.setVelocityX(0);
      this.player.anims.play("idle", true);
    }

    if(this.player.state == "HIT"){
      if (!this.player.flashTimer) {
        this.player.flashTimer = this.time.addEvent({
          delay: 75,
          callback: this.playerFlash,
          callbackScope: this,
          loop: true,
        });
      }
    }

    this.projectileArrows.children.each(
      function (arrow) {
        if (
          (Math.abs(arrow.startX - arrow.x) ||
            Math.abs(arrow.startY - arrow.y)) > 65
        ) {
          this.projectileArrows.killAndHide(arrow);
          arrow.body.enable = false;
        }
      }.bind(this)
    );

    this.skeletons.children.each(
      function (skeleton) {
        skeleton.update(time, delta);
      }.bind(this)
    );

    this.bones.children.each(
      function (bone) {
        bone.update(time, delta);
      }.bind(this)
    );
  }

  onPlayerAnimComplete() {
    var velocity = 250;

    if (
      (this.player.anims.currentAnim.key == "arrow-fire-crouch" ||
        this.player.anims.currentAnim.key == "arrow-fire-stand") &&
      this.zkey.isDown
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

      var arrow = this.projectileArrows.getFirstDead(
        true,
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
        arrow.body.enable = true;
        this.sound.play("arrowShoot");
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
        arrow.body.enable = true;
        this.sound.play("arrowShoot");
      }
    }
  }

  onArrowOverlap(arrow, enemy) {
    arrow.setActive(false);
    arrow.setVisible(false);
    arrow.body.enable = false;
    enemy.hit();
  }

  onBoneOverlap(bone, platform) {
    bone.hit();
  }

  onPlayerBonesOverlap(player, bone) {
    bone.hit();
    this.playerHit();
  }

  spawnSkeletons() {    
    var xpos = this.spawnOppositeSide ? 300 : 0;
    this.skeletons.getFirstDead(true, xpos, 150);
    this.spawnOppositeSide = !this.spawnOppositeSide;
  }

  playerHit() {
    if (this.playerHealth.current > 0 && this.player.state != "HIT") {
      this.player.state = "HIT";
      this.sound.play("playerHit");
      this.playerHealth.current -= 1;

      for (
        var index = this.playerHealth.bars.length - 1;
        index > this.playerHealth.current - 1;
        index--
      ) {
        var bar = this.playerHealth.bars[index];
        bar.setFrame("1");
      }

      if(!this.player.hitTimer){
        this.player.hitTimer = this.time.addEvent({
          delay: 1500,
          callback: this.playerEndHit,
          callbackScope: this,
          repeat: 0,
        });
      }
    }
  }

  playerEndHit() {
    this.player.state = "NONE";
    this.player.flashTimer.paused = true;
    this.player.flashTimer = undefined;
    this.player.hitTimer = undefined;
    this.player.clearTint();
  }

  playerFlash() {
    if (this.player.isTinted) {
      this.player.clearTint();
    } else {
      this.player.setTint(0x000000);
    }
  }
}
