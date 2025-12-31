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
let UIElements=[];
const time=new Time();
// const ItemInfo={"title":"Item","time":0,"time_picker":{hour:time.getHours(),minute:time.getMinutes(),seconds:time.getSeconds()},"date_picker":{day:time.getDate(),month:time.getMonth(),year:time.getFullYear()},edit:{isEdit:false,id:0}};
const ItemInfo=RTLY.ItemData;
let keyboard=null;
Page({
  style:{
    titleBar:false
  },
  onInit(params) {
    ItemInfo.edit.isEdit=false;
    ItemInfo.edit.item=null;
    if(params&&params!=="undefined"){
      const _params=JSON.parse(params);
      if(_params.edit?.isEdit){
        Logger.log("Edit");
        ItemInfo.edit.isEdit=true;
        ItemInfo.edit.item=_params.edit.item;
        ItemInfo.title=_params.edit.item.title;
        ItemInfo.time=_params.edit.item.time;
        if(_params.time_picker&&_params.date_picker){
          ItemInfo.time_picker=_params.time_picker;
          ItemInfo.date_picker=_params.date_picker;
        }
        else{
        ItemInfo.time_picker={
          hour:time.getHours(),
          minute:time.getMinutes(),
          seconds:time.getSeconds()
        };
        ItemInfo.date_picker={
          day:time.getDate(),
          month:time.getMonth(),
          year:time.getFullYear()
        };
      }
      }
      else{
        Logger.log("Adding new");
        SetTodayItemData();
      }
    }
    else{
      SetTodayItemData();
    }
    hmUI.setStatusBarVisible(false);
  },
  build() {
    //Title fragment
    const TitleText=new GameObject.Text(0,10,DEVICE_WIDTH,50,32,getText('newItemPageText'),COLORS.RED);
    TitleText.Draw();
    
    // Item name fragment
    const backgroundRect=new GameObject.GameObjectRect(0,60,DEVICE_WIDTH,80,COLORS.DARK_GRAY);
    backgroundRect.Draw();
    const TitleInputText=new GameObject.Text(10,60,DEVICE_WIDTH-100,80,42,ItemInfo.title,COLORS.WHITE,hmUI.align.CENTER_V,hmUI.align.CENTER_H);
    TitleInputText.Draw();

    const InputEnableButton=new GameObject.Button(DEVICE_WIDTH-110,TitleInputText.y+2,100,75,"INPUT",COLORS.RED,COLORS.BLACK,null,EnableInput,16,null,32);
    InputEnableButton.Draw();

    keyboard=new Keyboard({
      x: 0,
      y: 100,
      onChange: (txt) => {
      },
      onSubmit: (txt) => {
        DisableInput();
        ItemInfo.title=txt;
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

    const _timePickerInputText=new GameObject.Text(10,_timePickerBackgroundRect.y,DEVICE_WIDTH-100,80,42,`${ItemInfo.time_picker.hour.toString().padStart(2,'0')}:${ItemInfo.time_picker.minute.toString().padStart(2,'0')}`,COLORS.WHITE,hmUI.align.CENTER_V,hmUI.align.CENTER_H);
    _timePickerInputText.Draw();

    const TimePickerEnableButton=new GameObject.Button(DEVICE_WIDTH-110,_timePickerBackgroundRect.y+2,100,75,"INPUT",COLORS.RED,COLORS.BLACK,null,GoToTimePicker,16,null,32);
    TimePickerEnableButton.Draw();

    const timePickerFragment=[_timePickerBackgroundRect,_timePickerInputText,TimePickerEnableButton];

    // Date picker fragment
    const _datePickerBackgroundRect=new GameObject.GameObjectRect(0,_timePickerBackgroundRect.y+_timePickerBackgroundRect.height+1,DEVICE_WIDTH,80,COLORS.DARK_GRAY);
    _datePickerBackgroundRect.Draw();

    const _datePickerInputText=new GameObject.Text(10,_datePickerBackgroundRect.y,DEVICE_WIDTH-100,80,42,`${ItemInfo.date_picker.day}/${ItemInfo.date_picker.month}/${ItemInfo.date_picker.year}`,COLORS.WHITE,hmUI.align.CENTER_V,hmUI.align.LEFT);
    _datePickerInputText.Draw();

    const DatePickerEnableButton=new GameObject.Button(DEVICE_WIDTH-110,_datePickerBackgroundRect.y+2,100,75,"INPUT",COLORS.RED,COLORS.BLACK,null,GoToDatePicker,16,null,32);
    DatePickerEnableButton.Draw();

    const datePickerFragment=[_datePickerBackgroundRect,_datePickerInputText,DatePickerEnableButton];


    const BackButton=new GameObject.Button(0,DEVICE_HEIGHT-125,80,100,"<",COLORS.RED,COLORS.AMBER,null,()=>{
      hmRoute.push({url:'/page/gt/home/index.page'})
    },12,null,80);
    BackButton.Draw();
    const AddNewElementButton=new GameObject.Button(BackButton.x+BackButton.width,DEVICE_HEIGHT-125,DEVICE_WIDTH-80,100,"ADD NEW",COLORS.WHITE,COLORS.BLUE,null,AddEditItem,32);
    AddNewElementButton.Draw();

    UIElements.push(BackButton);
    UIElements.push(AddNewElementButton);
    UIElements.push(...titleFragment);
    UIElements.push(...timePickerFragment);
    UIElements.push(...datePickerFragment);
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
  hmRoute.push({url:'/page/gt/home/index.page.select_time',params:JSON.stringify(ItemInfo)});
}

function GoToDatePicker(){
  hmRoute.push({url:'/page/gt/home/index.page.select_date',params:JSON.stringify(ItemInfo)});
}

function AddEditItem(){
  Logger.log("Is editing ",ItemInfo.edit);
  if(ItemInfo.edit.isEdit){
    Logger.log("Editing complete");
  }
  else{
    Logger.log(JSON.stringify(ItemInfo.date_picker));
      const _itemDate=new Date(ItemInfo.date_picker.year,ItemInfo.date_picker.month-1,ItemInfo.date_picker.day,ItemInfo.time_picker.hour,ItemInfo.time_picker.minute,ItemInfo.time_picker.seconds);
      const _itemTime=_itemDate.getTime();
      const _itemData={title:ItemInfo.title,time:_itemTime}
      RTLY.AddItemToStorage(_itemData);
      hmRoute.push({url:'/page/gt/home/index.page'});
  }
}


function SetTodayItemData(){
  ItemInfo.time_picker={hour:time.getHours(),minute:time.getMinutes(),seconds:time.getSeconds()};
  ItemInfo.date_picker={day:time.getDate(),month:time.getMonth(),year:time.getFullYear()};
}