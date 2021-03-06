export default class Skeleton extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y){
        super(scene, x, y, "skeleton");
        this.scene.physics.world.enable(this);
        this.scene.add.existing(this);
        this.state = 'WALK';
        this.health = 4;
    }

    update(time, delta){
        if (!this.active) {
            return;
        }

        if(this.health == 0){
            this.scene.explosions.getFirstDead(true, this.x - 2, this.y + 3);
            this.destroy();
        }
        else if(this.state == 'HIT'){
            this.anims.play('skeleton-hit', true);            
            if(!this.hitTimer){                
                this.hitTimer = this.scene.time.addEvent({
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
        this.state = 'HIT';
        this.scene.sound.play("hit");
        this.health--;
    }

    endHit(){
        this.state = 'WALK';
        this.clearTint();
        this.hitTimer = undefined;          
    }
}