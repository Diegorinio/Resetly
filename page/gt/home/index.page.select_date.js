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
const itemInfo={"title":"item","time":0,"time_picker":time_picker_data,"date_picker":{day:time.getDate(),month:time.getMonth(),year:time.getFullYear()}};
Page({
    style:{
    titleBar:false
  },
  onInit(params) {
    if(params!=null&& params!=""&&params!==undefined){
        const _item=JSON.parse(params);
        itemInfo.title=_item.title;
        itemInfo.time=_item.time;
        itemInfo.date=_item.date;
        itemInfo.time_picker=_item.time_picker;
        Logger.log("Date picker: "+JSON.stringify(_item.date_picker));
        itemInfo.date_picker=_item.date_picker;
    }
    hmUI.setStatusBarVisible(false);
  },
  build() {
    const datePicker=hmUI.createWidget(hmUI.widget.PICK_DATE);
    datePicker.setProperty(hmUI.prop.MORE,{
        w: 480,
      x: 20,
      y: 120,
      startYear: itemInfo.date_picker.year,
      endYear: itemInfo.date_picker.year,
      initYear: itemInfo.date_picker.year,
      initMonth: itemInfo.date_picker.month,
      initDay: itemInfo.date_picker.day,
    })
    const btn=new GameObject.Button(0,DEVICE_HEIGHT-50,DEVICE_WIDTH,50,"CONFIRM",COLORS.WHITE,COLORS.BLUE,null,()=>{
        const dateObj=datePicker.getProperty(hmUI.MORE,{});
        const {year,month,day}=dateObj;
        itemInfo.date_picker.year=year;
        itemInfo.date_picker.month=month;
        itemInfo.date_picker.day=day;
        Logger.log("New date picker: "+JSON.stringify(itemInfo.date_picker));
        hmRoute.push({url:'/page/gt/home/index.new_item_page',params:JSON.stringify(itemInfo)})
    },12);
    btn.Draw();
  }
});