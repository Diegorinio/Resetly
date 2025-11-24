import * as hmUI from "@zos/ui";
import {Time} from "@zos/sensor";
import { log, log as Logger } from "@zos/utils";
import * as hmRoute from "@zos/router";
import { Keyboard, TimePicker} from "../../../assets/components/Restartly";
import { DEVICE_HEIGHT, DEVICE_WIDTH } from "./index.page.s.layout";
import * as GameObject from "../../../assets/components/Classes";
import { COLORS } from "../../../assets/components/colors";
import * as RTLY from "../../../assets/components/Restartly";
const time=new Time();
const time_picker_data={hour:time.getHours(),minute:time.getMinutes(),seconds:time.getSeconds()};
const itemInfo={"title":"Item","time":0,"time_picker":time_picker_data,"date_picker":{day:time.getDate(),month:time.getMonth(),year:time.getFullYear()}};
Page({
    style:{
    titleBar:false
  },
  onInit(params) {
    if(params!=null&& params!=""){
        const _item=JSON.parse(params);
        itemInfo.title=_item.title;
        itemInfo.time=_item.time;
        itemInfo.date=_item.date;
        itemInfo.time_picker=_item.time_picker;
        Logger.log(itemInfo.time_picker.hour);
    }
    hmUI.setStatusBarVisible(false);
  },
  build() {
    const timePicker=new RTLY.TimePicker("Start time","",()=>{
        const data=timePicker.time_picker_data;
        itemInfo.time_picker.hour=data.hour;
        itemInfo.time_picker.minute=data.minute;
        itemInfo.time_picker.seconds=data.seconds
        hmRoute.push({url:'/page/gt/home/index.new_item_page',params:JSON.stringify(itemInfo)})
    });
    timePicker.Draw();
  }
});