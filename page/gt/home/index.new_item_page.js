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
const itemInfo={"title":"Item","time":0,"time_picker":{hour:time.getHours(),minute:time.getMinutes(),seconds:time.getSeconds()},"date_picker":{day:time.getDate(),month:time.getMonth(),year:time.getFullYear()}};
let keyboard=null;
const hours = Array.from({length:24}, (_,i) => i.toString().padStart(2,'0'));
const minutes = Array.from({length:60}, (_,i) => i.toString().padStart(2,'0'));
Page({
  style:{
    titleBar:false
  },
  onInit(params) {
    if(params!=null && params!=""&&params!=null){
      const itemParams=JSON.parse(params);
      Logger.log(itemParams.date_picker.day);
      itemInfo.title=itemParams.title;
      itemInfo.time=itemParams.time;
      itemInfo.time_picker=itemParams.time_picker;
      // itemInfo.time_picker.hour=itemParams.time_picker.hour;
      // itemInfo.time_picker.minute=itemParams.time_picker.minute;
      // itemInfo.time_picker.seconds=itemParams.time_picker.seconds;
      itemInfo.date_picker=itemParams.date_picker;
    }
    // opcjonalnie ukryj status bar
    hmUI.setStatusBarVisible(false);
  },
  build() {
    //Title fragment
    const TitleText=new GameObject.Text(0,50,DEVICE_WIDTH,50,32,getText('newItemPageText'),COLORS.RED);
    TitleText.Draw();
    const backgroundRect=new GameObject.GameObjectRect(0,120,DEVICE_WIDTH,80,COLORS.DARK_GRAY);
    backgroundRect.Draw();
    const TitleInputText=new GameObject.Text(10,120,DEVICE_WIDTH-100,80,42,itemInfo.title,COLORS.WHITE,hmUI.align.CENTER_V,hmUI.align.CENTER_H);
    TitleInputText.Draw();

    const InputEnableButton=new GameObject.Button(DEVICE_WIDTH-110,TitleInputText.y+2,100,75,"INPUT",COLORS.RED,COLORS.BLACK,null,EnableInput,16,null,32);
    InputEnableButton.Draw();

    keyboard=new Keyboard({
      x: 0,
      y: 100,
      onChange: (txt) => {
        console.log("Wpisywane: " + txt);
      },
      onSubmit: (txt) => {
        console.log("Zatwierdzono: " + txt);
        DisableInput();
        itemInfo.title=txt;
        TitleInputText.SetText(txt);
      },
      OnClose:()=>{
        DisableInput();
      }
    });
    keyboard.Hide();
    
    const titleFragment=[TitleText,backgroundRect,TitleInputText,InputEnableButton]

    //Time picker fragment
    const _timePickerBackgroundRect=new GameObject.GameObjectRect(0,backgroundRect.y+backgroundRect.height+1,DEVICE_WIDTH,80,COLORS.DARK_GRAY);
    _timePickerBackgroundRect.Draw();

    const _timePickerInputText=new GameObject.Text(10,_timePickerBackgroundRect.y,DEVICE_WIDTH-100,80,42,`${itemInfo.time_picker.hour}:${itemInfo.time_picker.minute}`,COLORS.WHITE,hmUI.align.CENTER_V,hmUI.align.CENTER_H);
    _timePickerInputText.Draw();

    const TimePickerEnableButton=new GameObject.Button(DEVICE_WIDTH-110,_timePickerBackgroundRect.y+2,100,75,"INPUT",COLORS.RED,COLORS.BLACK,null,GoToTimePicker,16,null,32);
    TimePickerEnableButton.Draw();

    const timePickerFragment=[_timePickerBackgroundRect,_timePickerInputText,TimePickerEnableButton];

    //Date picker fragment
    // const _datePickerBackgroundRect=new GameObject.GameObjectRect(0,_timePickerBackgroundRect.y+_timePickerBackgroundRect.height+1,DEVICE_WIDTH,80,COLORS.DARK_GRAY);
    // _datePickerBackgroundRect.Draw();

    // const _datePickerInputText=new GameObject.Text(10,_datePickerBackgroundRect.y,DEVICE_WIDTH-100,80,42,`${itemInfo.date_picker.day}/${itemInfo.date_picker.month}/${itemInfo.date_picker.year}`,COLORS.WHITE,hmUI.align.CENTER_V,hmUI.align.LEFT);
    // _datePickerInputText.Draw();

    // const DatePickerEnableButton=new GameObject.Button(DEVICE_WIDTH-110,_datePickerBackgroundRect.y+2,100,75,"INPUT",COLORS.RED,COLORS.BLACK,null,GoToDatePicker,16,null,32);
    // DatePickerEnableButton.Draw();

    // const datePickerFragment=[_datePickerBackgroundRect,_datePickerInputText,DatePickerEnableButton];


    const AddNewElementButton=new GameObject.Button(0,DEVICE_HEIGHT-100,DEVICE_WIDTH,100,"ADD NEW",COLORS.WHITE,COLORS.BLUE,null,AddNewItem,32);
    AddNewElementButton.Draw();
    UIElements.push(AddNewElementButton);
    UIElements.push(...titleFragment);
    UIElements.push(...timePickerFragment);
    // UIElements.push(...datePickerFragment);
  }
});
function EnableInput(){
  keyboard.Show();
  UIElements.forEach(element => {
    element.SetVisible(false);
  });
}

function DisableInput(){
  keyboard.Hide();
  UIElements.forEach(el=>{
    el.SetVisible(true);
  })
}

function GoToTimePicker(){
  hmRoute.push({url:'/page/gt/home/index.page.select_time',params:JSON.stringify(itemInfo)});
}

function GoToDatePicker(){
  hmRoute.push({url:'/page/gt/home/index.page.select_date',params:JSON.stringify(itemInfo)});
}

function AddNewItem(){
  Logger.log(JSON.stringify(itemInfo.date_picker));
  const _itemDate=new Date(itemInfo.date_picker.year,itemInfo.date_picker.month-1,itemInfo.date_picker.day,itemInfo.time_picker.hour,itemInfo.time_picker.minute,itemInfo.time_picker.seconds);
  const _itemTime=_itemDate.getTime();
  const _itemData={title:itemInfo.title,time:_itemTime}
  RTLY.AddItemToStorage(_itemData);
  hmRoute.push({url:'/page/gt/home/index.page'});
}
