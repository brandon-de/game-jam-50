export default class Explosion extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y){
        super(scene, x, y, "explosion");
        this.scene.add.existing(this);         
        this.scene.physics.world.enable(this);
        this.body.setVelocity(0, 0).setBounce(0, 0).setCollideWorldBounds(false);
        this.body.allowGravity = false;

        this.anims.play("explode");
        this.scene.sound.play("boom");
        this.on(
            Phaser.Animations.Events.ANIMATION_COMPLETE,
            this.onAnimComplete.bind(this)
          );
    }

    onAnimComplete(){
        this.destroy();
    }
}