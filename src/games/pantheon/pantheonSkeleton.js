export default class Skeleton extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "skeleton");
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.state = "WALK";
    this.health = 4;
    this.attackPlayerRangeX = 85;
    this.determineDirection();

    this.on(
      Phaser.Animations.Events.ANIMATION_COMPLETE,
      this.onAnimComplete.bind(this)
    );

    this.body.setSize(12, 24).setOffset(1, 8);
  }

  update(time, delta) {
    if (!this.active) {
      return;
    }

    if (this.state != "ATTACK") {
      this.CurrentXDistanceFromPlayer = this.x - this.scene.player.x;
    }

    if (
      this.state != "ATTACK" &&
      this.attackTimer == undefined &&
      Math.abs(this.CurrentXDistanceFromPlayer) < this.attackPlayerRangeX
    ) {
      this.attackTimer = this.scene.time.addEvent({
        delay: Math.floor(Math.random() * 2000) + 500,
        callback: this.attack,
        callbackScope: this,
        repeat: 0,
      });
    } else if (
      this.state == "ATTACK" &&
      this.attackResetTimer == undefined &&
      (this.scene.player.x > this.currentAttackAtX + 10 ||
        this.scene.player.x < this.currentAttackAtX - 10)
    ) {
      this.attackResetTimer = this.scene.time.addEvent({
        delay: 2000,
        callback: this.attackReset,
        callbackScope: this,
        repeat: 0,
      });
    }

    if (this.health == 0) {
      this.scene.explosions.getFirstDead(true, this.x - 2, this.y + 3);

      if (this.attackTimer) {
        this.attackTimer.paused = true;
      }

      this.destroy();
    } else if (this.state == "HIT") {
      this.anims.play("skeleton-hit", true);
      if (!this.hitTimer) {
        this.hitTimer = this.scene.time.addEvent({
          delay: 400,
          callback: this.endHit,
          callbackScope: this,
          repeat: 0,
        });
      }

      if (!this.flashTimer) {
        this.flashTimer = this.scene.time.addEvent({
          delay: 75,
          callback: this.flash,
          callbackScope: this,
          loop: true,
        });
      }

      this.body.setVelocityX(0);
    } else if (this.state == "ATTACK") {
      this.body.setVelocityX(0);
      this.anims.play("skeleton-attack", true);
    } else if (this.state == "WALK") {
      this.anims.play("skeleton-walk", true);
      this.determineDirection();
    }
  }

  hit() {
    this.state = "HIT";
    this.scene.sound.play("hit");
    this.health--;
  }

  determineDirection() {
    if (this.scene.player.x > this.x) {
      this.facingRight = true;
      this.flipX = false;
      this.body.setVelocityX(20);
    } else {
      this.facingRight = false;
      this.flipX = true;
      this.body.setVelocityX(-20);
    }
  }

  attack() {
    this.state = "ATTACK";
    var bone = this.scene.bones.getFirstDead(true, this.x, this.y - 5);
    bone.activate(this.CurrentXDistanceFromPlayer);
    this.attackTimer = undefined;
    this.currentAttackAtX = this.scene.player.x;
  }

  attackReset() {
    if (this.attackTimer) {
      this.attackTimer.paused = true;
      this.attackTimer = undefined;
    }

    if (this.attackResetTimer) {
      this.attackResetTimer.paused = true;
      this.attackResetTimer = undefined;
    }

    this.state = "WALK";
  }

  flash() {
    if (this.isTinted) {
      this.clearTint();
    } else {
      this.setTint(0x000000);
    }
  }

  endHit() {
    this.state = "WALK";
    this.flashTimer.paused = true;
    this.hitTimer = undefined;
    this.flashTimer = undefined;
    this.clearTint();
  }

  onAnimComplete(animation, frame) {
    if (animation.key == "skeleton-attack") {
      var bone = this.scene.bones.getFirstDead(true, this.x, this.y - 5);
      bone.activate(this.CurrentXDistanceFromPlayer);
    }
  }
}
