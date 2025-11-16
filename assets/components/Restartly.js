import { GameObject, Rect,Text,Button} from "./Classes";
import { COLORS } from "./colors";
import * as hmUI from "@zos/ui";
import { log as Logger } from "@zos/utils";
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
      this.titleLabel=new Text(left,this.y,middle,this.height/2,this.height/4,item.title,COLORS.WHITE,null,hmUI.align.LEFT);

      this.timerLabel=new Text(this.titleLabel.x+this.titleLabel.width,this.y,middle,this.height,this.height/4,item.time,COLORS.WHITE,null);
      this.Widgets.push(this.titleLabel,this.timerLabel);
    }
  Draw=()=>{
    this.Widgets.forEach(el=>{
      el.Draw();
    })
  }
}
export class Item{
  constructor(id,title,time){
    this.id=id;
    this.title=title;
    this.time=time;
  }
}

