import * as hmUI from "@zos/ui";
import {Time} from "@zos/sensor";
import * as hmRoute from "@zos/router";
import { Keyboard} from "../../../assets/components/Restartly";
import { DEVICE_HEIGHT, DEVICE_WIDTH } from "./index.page.s.layout";
import * as GameObject from "../../../assets/components/Classes";
import { COLORS } from "../../../assets/components/colors";
let UIElements=[];
const itemInfo={"title":"New break","time":0};
let keyboard=null;
Page({
  onInit() {
    // opcjonalnie ukryj status bar
    hmUI.setStatusBarVisible(false);
  },
  build() {
    const TitleText=new GameObject.Text(0,50,DEVICE_WIDTH,50,32,"I want to break with",COLORS.RED);
    TitleText.Draw();
    const backgroundRect=new GameObject.GameObjectRect(0,120,DEVICE_WIDTH,80,COLORS.DARK_GRAY);
    backgroundRect.Draw();
    const TitleInputText=new GameObject.Text(10,120,DEVICE_WIDTH-100,80,42,"Title",COLORS.WHITE,hmUI.align.CENTER_V,hmUI.align.CENTER_H);
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
        // Wracamy do głównego widoku po zatwierdzeniu
        DisableInput();
        itemInfo.title=txt;
        TitleInputText.SetText(txt);
        // hmApp.gotoPage({ url: "/pages/main/index" });
      },
      OnClose:()=>{
        DisableInput();
      }
    });
    keyboard.Hide();
    // InputBoxButton.Draw();
    const AddButton=new GameObject.Button(DEVICE_WIDTH/2-100,DEVICE_HEIGHT-120,200,100,"ADD",COLORS.WHITE,COLORS.BLUE,null,()=>{
      itemInfo.time=GetTime();
      hmRoute.push({
          url: "/page/gt/home/index.page",
          params: JSON.stringify({
              item: {
                  title: itemInfo.title,
                  time: itemInfo.time  // ms, liczba
              }
          })
      });

    },16,null,42);
    AddButton.Draw();
    UIElements.push(backgroundRect,TitleText,TitleInputText,InputEnableButton,AddButton);
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

function GetTime(){
  const time = new Time();
  return time.getTime();
}
