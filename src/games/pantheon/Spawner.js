export default class Spawner {
    constructor(){
        this.oneSecond = 1000;
    }

    update(time, delta){
        this.oneSecond -= delta;

        if(this.oneSecond < 0){
            this.oneSecond = 1000;
        }
    }
}