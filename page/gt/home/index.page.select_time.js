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
const time_picker_data={hour:time.getHours(),minute:time.getMinutes(),seconds:time.getSeconds()};
const ItemInfo=RTLY.ItemData;
Page({
  //   style:{
  //   titleBar:false
  // },
  onInit(params) {
    if(params!=null&&params!=""&&params!=="undefined"){
      const _params=JSON.parse(params);
      RTLY.SetBaseItemDataFromParams(ItemInfo,_params);
      Logger.log("Is edit: ", ItemInfo.edit);

    }
    else{
      hmRoute.back();
    }
    hmUI.setStatusBarVisible(false);
  },
  build() {
    const timePicker=new RTLY.TimePicker("Start time","",()=>{
        const data=timePicker.time_picker_data;
        Logger.log(data);
          ItemInfo.time_picker.hour=data.hour;
          ItemInfo.time_picker.minute=data.minute;
          ItemInfo.time_picker.seconds=data.seconds
          hmRoute.push({url:'/page/gt/home/index.page.new_item_page',params:JSON.stringify(ItemInfo)})
    });
    timePicker.Draw();
  }
});