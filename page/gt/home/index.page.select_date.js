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
const itemInfo={item:null};
Page({
    style:{
    titleBar:false
  },
  onInit(params) {
    if(params!=null&& params!=""&&params!==undefined){
        const _item=JSON.parse(params);
        itemInfo.item=_item;
        Logger.log(JSON.stringify(itemInfo.item));
        // Logger.log(JSON.stringify(_item));
        // itemInfo.title=_item.title;
        // itemInfo.time=_item.time;
        // itemInfo.date=_item.date;
        // itemInfo.time_picker=_item.time_picker;
        // Logger.log("Date picker: "+JSON.stringify(_item.date_picker));
        // itemInfo.date_picker=_item.date_picker;
    }
    if(itemInfo==null){
      hmRoute.push({url:'/page/gt/home/index.page.new_item_page'})
    }
    hmUI.setStatusBarVisible(false);
  },
  build() {
    const datePicker=hmUI.createWidget(hmUI.widget.PICK_DATE);
    datePicker.setProperty(hmUI.prop.MORE,{
        w: 480,
      x: 20,
      y: 120,
      startYear: itemInfo.item.date_picker.year,
      endYear: itemInfo.item.date_picker.year,
      initYear: itemInfo.item.date_picker.year,
      initMonth: itemInfo.item.date_picker.month,
      initDay: itemInfo.item.date_picker.day,
    })
    const btn=new GameObject.Button(0,DEVICE_HEIGHT-50,DEVICE_WIDTH,50,"CONFIRM",COLORS.WHITE,COLORS.BLUE,null,()=>{
        const dateObj=datePicker.getProperty(hmUI.MORE,{});
        const {year,month,day}=dateObj;
        itemInfo.item.date_picker.year=year;
        itemInfo.item.date_picker.month=month;
        itemInfo.item.date_picker.day=day;
        hmRoute.push({url:'/page/gt/home/index.page.new_item_page',params:JSON.stringify(itemInfo.item)})
    },12);
    btn.Draw();
  }
});