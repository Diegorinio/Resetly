import * as hmUI from "@zos/ui";
import {Time} from "@zos/sensor";
import { log, log as Logger } from "@zos/utils";
import * as hmRoute from "@zos/router";
import { Keyboard, TimePicker} from "../../../assets/components/Restartly";
import { DEVICE_HEIGHT, DEVICE_WIDTH } from "./index.page.s.layout";
import * as GameObject from "../../../assets/components/Classes";
import { COLORS } from "../../../assets/components/colors";
import * as RTLY from "../../../assets/components/Restartly";
let UIElements=[];
const itemInfo={"title":"New break","time":0};
let keyboard=null;
const _currenttime=new Time();
const hours = Array.from({length:24}, (_,i) => i.toString().padStart(2,'0'));
const minutes = Array.from({length:60}, (_,i) => i.toString().padStart(2,'0'));
const time_picker_info={hour:_currenttime.getHours(),minute:_currenttime.getMinutes()};
Page({
  onInit() {
    // opcjonalnie ukryj status bar
    hmUI.setStatusBarVisible(false);
  },
  build() {
    // const TitleText=new GameObject.Text(0,50,DEVICE_WIDTH,50,32,"I want to break with",COLORS.RED);
    // TitleText.Draw();
    // const backgroundRect=new GameObject.GameObjectRect(0,120,DEVICE_WIDTH,80,COLORS.DARK_GRAY);
    // backgroundRect.Draw();
    // const TitleInputText=new GameObject.Text(10,120,DEVICE_WIDTH-100,80,42,"Title",COLORS.WHITE,hmUI.align.CENTER_V,hmUI.align.CENTER_H);
    // TitleInputText.Draw();
    // const InputEnableButton=new GameObject.Button(DEVICE_WIDTH-110,TitleInputText.y+2,100,75,"INPUT",COLORS.RED,COLORS.BLACK,null,EnableInput,16,null,32);
    // InputEnableButton.Draw();
    // keyboard=new Keyboard({
    //   x: 0,
    //   y: 100,
    //   onChange: (txt) => {
    //     console.log("Wpisywane: " + txt);
    //   },
    //   onSubmit: (txt) => {
    //     console.log("Zatwierdzono: " + txt);
    //     // Wracamy do głównego widoku po zatwierdzeniu
    //     DisableInput();
    //     itemInfo.title=txt;
    //     TitleInputText.SetText(txt);
    //     // hmApp.gotoPage({ url: "/pages/main/index" });
    //   },
    //   OnClose:()=>{
    //     DisableInput();
    //   }
    // });
    // keyboard.Hide();
    // const AddButton=new GameObject.Button(DEVICE_WIDTH/2-100,DEVICE_HEIGHT-120,200,100,"ADD",COLORS.WHITE,COLORS.BLUE,null,()=>{
    //   itemInfo.time=GetTime();
    //   hmRoute.push({
    //       url: "/page/gt/home/index.page",
    //       params: JSON.stringify({
    //           item: {
    //               title: itemInfo.title,
    //               time: itemInfo.time  // ms, liczba
    //           }
    //       })
    //   });

    // },16,null,42);
    // AddButton.Draw();
    // UIElements.push(backgroundRect,TitleText,TitleInputText,InputEnableButton,AddButton);

    // Date picker
    // const now = new Date();
    // const currentYear = now.getFullYear();
    // const currentMonth = now.getMonth() + 1;
    // const currentDay = now.getDate();

    // const pickDate = hmUI.createWidget(hmUI.widget.PICK_DATE, {
    //   x: 20,
    //   y: 120,
    //   w: 300,
    //   startYear: 2000,
    //   endYear: currentYear,   // rok nie może być większy niż dziś
    //   endMonth: currentMonth, // miesiąc nie może być większy niż dziś (tylko jeśli rok = endYear)
    //   endDay: currentDay,     // dzień nie może być większy niż dziś (tylko jeśli rok i miesiąc = dzisiejsze)
    //   initYear: currentYear,
    //   initMonth: currentMonth,
    //   initDay: currentDay,
    //   font_size: 32
    // });


    //TEsting time picker
    // const picker=hmUI.createWidget(hmUI.widget.WIDGET_PICKER,{
    //   title:"Start time",
    //   subtitle:'',
    //   nb_of_columns:2,
    //   single_wide:true,
    //   init_col_index:0,
    //   data_config:[
    //     {
    //     data_array:hours,
    //     init_val_index:time_picker_info.hour,
    //     unit:"h",
    //     support_loop:true,
    //     font_size:24,
    //     select_font_size:32,
    //     connector_font_size:18,
    //     unit_font_size:18,
    //     col_width:80 
    //     },
    //     {
    //       data_array:minutes,
    //       init_val_index:time_picker_info.minute,
    //       unit:"m",
    //       support_loop:true,
    //       font_size:24,
    //       select_font_size:32,
    //       connector_font_size:18,
    //       unit_font_size:18,
    //       col_width:80
    //     }
    //   ],picker_cb
    // })

    const foreground=new GameObject.GameObjectRect(0,0,DEVICE_WIDTH,DEVICE_HEIGHT,COLORS.BLACK);
    foreground.Draw();
    const btn=new GameObject.Button(100,100,100,100,"TIME",COLORS.WHITE,COLORS.BLUE,null,()=>{
      foreground.SetVisible(false);
      btn.SetVisible(false);
      timePicker.Draw();
    },12);
    btn.Draw();

    const timePicker=new RTLY.TimePicker("Start time","",()=>{
      foreground.Draw();
      btn.Draw();
    });
  }
});
function EnableInput(){
  // keyboard.Show();
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

function GetTime(){
  const time = new Time();
  return time.getTime();
}
