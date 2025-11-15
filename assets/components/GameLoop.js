export class GameLoop{
  static instance=null;
  static getInstance(){
    if(!GameLoop.instance){
      GameLoop.instance=new GameLoop();
    }
    return GameLoop.instance;
  }
  constructor(){
    this.tickRate=100;
    this.tickFunctions=[];
    this.frame=0;
    this.interval=null;
    this.deltaTime=this.tickRate/1000;
    GameLoop.instance=this;
  }
  Start = ()=>{
    if (this.interval) return;
    this.interval = setInterval(() => {
      this.frame++;
      for (const handler of this.tickFunctions) {
        handler(this.frame);
      }
    }, this.tickRate);
  }

  Stop = ()=>{
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  OnTick = (func)=>{
    this.tickFunctions.push(func);
  }

  OffTick(handler) {
    this.tickFunctions = this.tickFunctions.filter(h => h !== handler);
  }

  ResetFrame() {
    this.frame = 0;
  }
}