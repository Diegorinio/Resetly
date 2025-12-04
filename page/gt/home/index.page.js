import * as hmUI from "@zos/ui";
import * as hmRoute from "@zos/router";
import {Time} from "@zos/sensor";
import { log, log as Logger } from "@zos/utils";
import * as GameObject from "../../../assets/components/Classes";
import {COLORS} from "../../../assets/components/colors";
import { GameLoop } from "../../../assets/components/GameLoop";
import { DEVICE_WIDTH,DEVICE_HEIGHT } from "./index.page.r.layout";
import { getText } from "@zos/i18n";
import * as RTLY from "../../../assets/components/Restartly";
import { localStorage } from '@zos/storage'
import { createModal, MODAL_CONFIRM} from "@zos/interaction";
const GlobalLoop=GameLoop.getInstance();
GlobalLoop.SetTick(1000);
const logger = Logger.getLogger("helloworld");

const LOGO=new GameObject.Text(0,0,DEVICE_WIDTH,80,52,getText('appName'),COLORS.RED,hmUI.align.BOTTOM,hmUI.align.CENTER_H);

const logoUnderText=new GameObject.Text(0,LOGO.height,DEVICE_WIDTH,30,24,getText('appTitle'),COLORS.RED,hmUI.align.BOTTOM,hmUI.align.CENTER_H);
const noSmokeLabel=new GameObject.Text(0,DEVICE_HEIGHT/3,DEVICE_WIDTH,28,22,getText("no-smoking-text"),COLORS.RED);

const TimerText=new GameObject.Text(0,noSmokeLabel.y,DEVICE_WIDTH,150,52,"Press to start",COLORS.WHITE);

const toggleTimerButton=new GameObject.Button(50,DEVICE_HEIGHT-105,DEVICE_WIDTH-100,100,getText("toggleButton-start"),COLORS.WHITE,COLORS.TEAL,null,ToggleTimer,60,null,99);

const settingsButton=new GameObject.ImageButton(LOGO.x,LOGO.y,LOGO.width,LOGO.height,"",COLORS.NAVY_BLUE,getText("options-icon"),null,GoToSettingsPage);

const _Time=new Time();
const timer={start:_Time.getTime(),isActive:false}
logger.log(JSON.stringify(timer));

Page({
  style:{
    titleBar:false
  },
  onInit(params) {
    hmUI.setStatusBarVisible(false);
    const savedTimer=GetLocalStorageTimer();
    if(savedTimer){
      timer.start=savedTimer.start;
      timer.isActive=savedTimer.isActive;
      logger.log("Load from save");
      logger.log(JSON.stringify(timer));
      toggleTimerButton.SetText(getText("toggleButton-reset"));
    }
    logger.debug("page onInit invoked");
  },
  build() {
    LOGO.Draw();
    logoUnderText.Draw();
    
    TimerText.Draw();
    settingsButton.Draw();
    toggleTimerButton.Draw();
    noSmokeLabel.Draw();
    GlobalLoop.OnTick(CalculateTime)
    GlobalLoop.Start();
  },
  onDestroy() {
    logger.debug("page onDestroy invoked");
    Save();
  },
});

function ToggleTimer(){
  if(!timer.isActive){
    StartTimer();
  }
  else{
    const dialog=createModal({
            content:"Do you want to reset?",
            autoHide:false,
            onClick:(keyObj)=>{
              const {type}=keyObj
              if(type==MODAL_CONFIRM){
                timer.isActive=false;
                StartTimer();
              }
              else{

              }
              dialog.show(false);
    }
  })
  }
}
function StartTimer(){
    const now=new Time().getTime();
    timer.start=now;
    timer.isActive=true;
    toggleTimerButton.SetText(getText("toggleButton-reset"));
}
function CalculateTime(){
  if(timer.isActive){
    const now=new Time().getTime();
    const diff=now-timer.start;
    const _timeString=formatTime(diff);
    TimerText.SetText(_timeString);
  }
}
function GoToSettingsPage(){
  hmRoute.push({url:"/page/gt/home/index.page.settings"});
}
function formatTime(ms) {
    // zamiana ms na sekundy
    let totalSeconds = Math.floor(ms / 1000);

    const d = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;

    const g = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;

    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;

    let parts = [];

    if (d > 0) parts.push(`${d}d`);
    if (g > 0) parts.push(`${g}g`);
    if (m > 0) parts.push(`${m}m`);
    if (s > 0 || parts.length === 0) parts.push(`${s}s`);

    return parts.join(" ");
}

function Save(){
  logger.log(JSON.stringify(timer));
  localStorage.setItem("timer",JSON.stringify(timer))
}

function GetLocalStorageTimer(){
  const storedTimer=localStorage.getItem("timer");
  if(storedTimer){
    return JSON.parse(storedTimer);
  }
  else{
    return timer;
  }
}