import * as hmUI from "@zos/ui";
import {Time} from "@zos/sensor";
import { log, log as Logger } from "@zos/utils";
import * as hmRoute from "@zos/router";
import { Keyboard, TimePicker} from "../../../assets/components/Restartly";
import { DEVICE_HEIGHT, DEVICE_WIDTH } from "./index.page.s.layout";
import * as GameObject from "../../../assets/components/Classes";
import { COLORS } from "../../../assets/components/colors";
import * as RTLY from "../../../assets/components/Restartly";
import { createModal, MODAL_CONFIRM, showToast} from "@zos/interaction";
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
        if(year<=time.getFullYear()&&month<=time.getMonth()&&day<=time.getDate()){
        itemInfo.item.date_picker.year=year;
        itemInfo.item.date_picker.month=month;
        itemInfo.item.date_picker.day=day;
        hmRoute.push({url:'/page/gt/home/index.page.new_item_page',params:JSON.stringify(itemInfo.item)})
        }
        else{
          showToast({
            content:"Cannot travel to the future"
          })
        }
    },12);
    btn.Draw();
  }
});