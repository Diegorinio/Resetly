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
const ItemInfo=RTLY.ItemData;
Page({
    style:{
    titleBar:false
  },
  onInit(params) {
    if(params!=null&& params!=""&&params!=="undefined"){
        const _params=JSON.parse(params);
        RTLY.SetBaseItemDataFromParams(ItemInfo,_params);

        Logger.log("ItemInfo select_date: ",JSON.stringify(ItemInfo));
        // ItemInfo.item=_item;
        // ItemInfo.edit.isEdit=_item.edit.isEdit;
        // ItemInfo.edit.id=_item.edit.id;
        // Logger.log(JSON.stringify(ItemInfo.edit));
    }
    else
    {
      hmRoute.back();
    }
    hmUI.setStatusBarVisible(false);
  },
  build() {
    const datePicker=hmUI.createWidget(hmUI.widget.PICK_DATE);
    datePicker.setProperty(hmUI.prop.MORE,{
        w: 480,
      x: 20,
      y: 120,
      startYear: ItemInfo.date_picker.year,
      endYear: ItemInfo.date_picker.year,
      initYear: ItemInfo.date_picker.year,
      initMonth: ItemInfo.date_picker.month,
      initDay: ItemInfo.date_picker.day,
    })
    const btn=new GameObject.Button(0,DEVICE_HEIGHT-50,DEVICE_WIDTH,50,"CONFIRM",COLORS.WHITE,COLORS.BLUE,null,()=>{
        const dateObj=datePicker.getProperty(hmUI.MORE,{});
        const {year,month,day}=dateObj;
        if(year<=time.getFullYear()&&month<=time.getMonth()&&day<=time.getDate()){
        ItemInfo.date_picker.year=year;
        ItemInfo.date_picker.month=month;
        ItemInfo.date_picker.day=day;
        hmRoute.push({url:'/page/gt/home/index.page.new_item_page',params:JSON.stringify(ItemInfo)})
        }
    },12);
    btn.Draw();
  }
});