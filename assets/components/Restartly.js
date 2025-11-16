import { GameObject, Rect,Text,Button} from "./Classes";
import { COLORS } from "./colors";
import * as hmUI from "@zos/ui";
import { log, log as Logger } from "@zos/utils";
export class ItemElement extends GameObject{
  constructor(x,y,width,height,item=null){
    super(x,y,width,height);
    this.background={
      x:x,
      y:y,
      w:width,
      h:height
    };
    this.background=new Rect(this.x,this.y,this.width,this.height,COLORS.BLUE,12,255);
    this.titleLabel=null;
    this.timerLabel=null;
    this.resetButton=null;
    this.editButton=null;
    this.Widgets=[this.background];
    this.Active=false;
    if(item!=null){
      this.assignedItem=item;
      Logger.debug(item.title);
      this.AssignItem(item);
    }
  }
    AssignItem=(item)=>{
      this.assignedItem=item;
      this.id=item.id;
      this.title=item.title;
      this.time=item.time;
      this.CreateWidgets(this.assignedItem);
    }

    CreateWidgets=(item)=>{
      const left=this.width*0.20;
      const middle=this.width*0.50;
      const right=this.width*0.30;
      this.titleLabel=new Text(left-50,this.y,left,this.height,this.height/4,item.title,COLORS.WHITE,hmUI.align.CENTER_V,hmUI.align.LEFT);

      this.timerLabel=new Text(this.titleLabel.x+this.titleLabel.width,this.y,middle,this.height,this.height/4,item.time,COLORS.WHITE,null);

      this.startButton=new Button(left+middle,this.y,100,this.height,"EDIT",COLORS.RED,COLORS.BLACK,null,this.ToggleTimer,12);
      this.Widgets.push(this.titleLabel,this.timerLabel,this.startButton);
    }

    Draw=()=>{
      this.Widgets.forEach(el=>{
        el.Draw();
      })
    }

    Update=()=>{
      this.timerLabel.SetText(this.time);
      this.Draw();
    }

    OnTick=()=>{
      if(this.Active){
        this.time+=1;
        this.Update();
      }
    }
  StopTimer=()=>{
    this.Active=false;
  }
  StartTimer=()=>{
    this.Active=true;
  }
  ToggleTimer=()=>{
    this.Active=!this.Active;
  }
}
export class Item{
  constructor(id,title,time){
    this.id=id;
    this.title=title;
    this.time=time;
  }
}

