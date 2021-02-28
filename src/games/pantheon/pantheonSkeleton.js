export default class Skeleton extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y){
        super(scene, x, y, "skeleton");
        this.scene.physics.world.enable(this);
        this.scene.add.existing(this);
        this.state = 'WALK';
    }

    update(time, delta){
        if (!this.active) {
            return;
        }

        if(this.state == 'HIT'){
            this.anims.play('skeleton-hit', true);
            if(!this.timer){
                this.timer = this.scene.time.addEvent({
                    delay: 400,
                    callback: this.endHit,
                    callbackScope: this,
                    repeat: 0,
                });
            }
            this.body.setVelocityX(0);

            if(this.isTinted){
                this.clearTint();                            
            }
            else{
                this.setTint(0x000000);
            }
        }
        else if(this.state == 'WALK') {
            this.anims.play('skeleton-walk', true);
            this.body.setVelocityX(20);
        }
    }

    hit(){
        this.state = 'HIT'
    }

    endHit(){
        this.state = 'WALK';
        this.clearTint();
        console.log('END HIT');
        this.timer = undefined;
    }
}