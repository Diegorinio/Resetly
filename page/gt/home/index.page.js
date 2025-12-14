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
const noSmokeLabel=new GameObject.Text(0,DEVICE_HEIGHT/3,DEVICE_WIDTH,28,22,getText("no-smoking-text"),COLORS.GREEN);
function DrawUpper(){
  LOGO.Draw();
  logoUnderText.Draw();
  noSmokeLabel.Draw();
  settingsButton.Draw();
}

const settingsButton=new GameObject.ImageButton(LOGO.x,LOGO.y,LOGO.width,LOGO.height+logoUnderText.height,"",COLORS.AMBER,getText("transparent"),null,GoToSettings,false,0,0,true);

const TimerText=new GameObject.Text(0,noSmokeLabel.y,DEVICE_WIDTH,150,48,"Press to start",COLORS.WHITE);

const smokesTodayLabel=new GameObject.Text(DEVICE_WIDTH/5,TimerText.y+TimerText.height-15,DEVICE_WIDTH/2,32,25,getText("streak"),COLORS.RED,hmUI.align.CENTER_V,hmUI.align.RIGHT);

const todaySmokeAmount=new GameObject.Text(smokesTodayLabel.x+smokesTodayLabel.width,smokesTodayLabel.y,DEVICE_WIDTH/2+15,32,25,"0",COLORS.RED,hmUI.align.CENTER_V,hmUI.align.LEFT);

const toggleTimerButton=new GameObject.Button(50,DEVICE_HEIGHT-105,DEVICE_WIDTH-100,100,getText("toggleButton-start"),COLORS.WHITE,COLORS.RED,null,ToggleTimer,42,null,52);

function DrawMainUI(){
  settingsButton.Draw();
  TimerText.Draw();
  smokesTodayLabel.Draw();
  todaySmokeAmount.Draw();
  toggleTimerButton.Draw();
  const smokesToday=GetSmokesAmountToday();
  if(smokesToday)
    todaySmokeAmount.SetText(smokesToday.toString());
}

const _Time=new Time();
const timer={start:_Time.getTime(),isActive:false}
//Format {day:dd,month:dd,year:yyyy,hour:hh,minutes:mm}
const resetHistory={history:[]}
function UpdatAmountEvent(){
  UpdateAmount(todaySmokeAmount);
}

Page({
  style:{
    titleBar:false
  },
  onInit(params) {
    // localStorage.clear();
    GoToSettings();
    hmUI.setStatusBarVisible(false);
    const savedTimer=GetLocalStorageTimer();
    if(savedTimer){
      timer.start=savedTimer.start;
      timer.isActive=savedTimer.isActive;
      logger.log("Load from save");
      logger.log(JSON.stringify(timer));
      toggleTimerButton.SetText(getText("toggleButton-reset"));
    }
    const savedHitory=GetLocalStorageHistory();
    logger.log(JSON.stringify(savedHitory));
    if(savedHitory){
      resetHistory.history=savedHitory.history;
      logger.log(JSON.stringify(resetHistory));
    }
    logger.debug("page onInit invoked");
  },
  build() {
    DrawUpper();
    DrawMainUI();
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
    if(timer.isActive==true){
      timer.isActive=false;
      Reset();
    }
    timer.start=now;
    timer.isActive=true;
    toggleTimerButton.SetText(getText("toggleButton-reset"));
}
function Reset(){
  const now = new Time();
  const _reset={day:now.getDate().toString(),month:now.getMonth().toString(),year:now.getFullYear().toString(),hours:now.getHours().toString(),minutes:now.getMinutes().toString(),start:timer.start,end:now.getTime()};
  AddToLocalStorageHistory(_reset);
  UpdatAmountEvent();
}
function CalculateTime(){
  if(timer.isActive){
    const now=new Time().getTime();
    const diff=now-timer.start;
    const _timeString=formatTime(diff);
    TimerText.SetText(_timeString);
  }
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
    return null;
  }
}

function GetLocalStorageHistory(){
  const _history=localStorage.getItem(getText("history"));
  if(_history){
    return JSON.parse(_history);
  }
  else{
    return null;
  }
}

function AddToLocalStorageHistory(itemDate){
  const _local=localStorage.getItem(getText("history"));
  if(!_local){
    const _local={history:[]}
    localStorage.setItem(getText("history"),JSON.stringify(_local));
  }
  const storage=JSON.parse(localStorage.getItem(getText("history")));
  let _storageArray=storage.history;
  _storageArray.push(itemDate);
  storage.history=_storageArray;
  localStorage.setItem(getText("history"),JSON.stringify(storage));
}

function GetSmokesAmountToday(){
  const stored=GetLocalStorageHistory();
  if(!stored||!stored.history||stored.history.length===0){
    return null;
  }
  let amountToday=0
  const _currentTime= new Time();
  stored.history.forEach(el=>{
    if(el.day==_currentTime.getDate()){
      amountToday+=1;
    }
  })
  return amountToday
}

function UpdateAmount(label){
  if(!label){
    return;
  }
  const _amount=GetSmokesAmountToday();
  label.SetText(_amount.toString());
}

function GoToSettings(){
  hmRoute.push({url:"page/gt/home/index.page.settings"});
}