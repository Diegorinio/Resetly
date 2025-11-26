import * as hmUI from "@zos/ui";
import {Time} from "@zos/sensor";
import { log, log as Logger } from "@zos/utils";
import * as hmRoute from "@zos/router";
import { Keyboard, TimePicker} from "../../../assets/components/Restartly";
import { DEVICE_HEIGHT, DEVICE_WIDTH } from "./index.page.s.layout";
import * as GameObject from "../../../assets/components/Classes";
import { COLORS } from "../../../assets/components/colors";
import * as RTLY from "../../../assets/components/Restartly";
import { getText } from "@zos/i18n";
import { LocalStorage } from '@zos/storage'
let UIElements=[];
const time=new Time();
const item={id:0,title:"",time:0}
Page({
  style:{
    titleBar:false
  },
  onInit(params) {
    if(params!=null && params!=""){
      const itemParams=JSON.parse(params);
      item.id=itemParams.id;
      item.title=itemParams.title;
      item.time=itemParams.time;
      Logger.log(JSON.stringify(item));
    }
    hmUI.setStatusBarVisible(false);
  },
  build() {
    const titleText=new GameObject.Text(0,DEVICE_HEIGHT/6,DEVICE_WIDTH,100,42,item.title,COLORS.RED);
    titleText.Draw();
    const RestartBtn=new GameObject.Button(0,titleText.y+titleText.height,DEVICE_WIDTH,100,"RESTART",COLORS.RED,COLORS.AMBER,null,()=>{
        const time=new Time();
        item.time=time.getTime();
        RTLY.OverwriteItemInStorage(item);
        GoBack();
    })

    const DeleteBtn=new GameObject.Button(0,RestartBtn.y+RestartBtn.height,100,80,"DELETE",COLORS.WHITE,COLORS.RED,null,()=>{
        RTLY.RemoveItemFromStorage(item);
        GoBack();
    })
    RestartBtn.Draw();
    DeleteBtn.Draw();
  }
});
function GoBack(){
    hmRoute.push({url:"/page/gt/home/index.page"});
}
function GoToTimePicker(){
  hmRoute.push({url:'/page/gt/home/index.page.select_time',params:JSON.stringify(itemInfo)});
}

function GoToDatePicker(){
  hmRoute.push({url:'/page/gt/home/index.page.select_date',params:JSON.stringify(itemInfo)});
}