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
import { LocalStorage } from '@zos/storage'
const GlobalLoop=GameLoop.getInstance();
GlobalLoop.SetTick(1000);
const logger = Logger.getLogger("helloworld");

const LOGO=new GameObject.Text(0,0,DEVICE_WIDTH,80,52,getText('appName'),COLORS.RED,hmUI.align.BOTTOM,hmUI.align.CENTER_H);
const logoUnderText=new GameObject.Text(0,LOGO.height,DEVICE_WIDTH,30,24,getText('appTitle'),COLORS.RED,hmUI.align.BOTTOM,hmUI.align.CENTER_H);

const settingsButton=new GameObject.ImageButton(LOGO.x,LOGO.y,LOGO.width,LOGO.height,"",COLORS.NAVY_BLUE,getText("options-icon"),null,GoToSettingsPage);
const resetTimerButton=new GameObject.Button(50,DEVICE_HEIGHT-105,DEVICE_WIDTH-100,100,"+",COLORS.WHITE,COLORS.TEAL,null,StartTimer,60,null,99);

const TimerText=new GameObject.Text(0,DEVICE_HEIGHT/2-100,DEVICE_WIDTH,150,52,"Press to start",COLORS.WHITE);
const _Time=new Time();
const timer={start:_Time.getTime()}

Page({
  style:{
    titleBar:false
  },
  onInit(params) {
    hmUI.setStatusBarVisible(false);
    logger.debug("page onInit invoked");
  },
  build() {
    // hmRoute.push({url:"/page/gt/home/index.page.select_date"});
    LOGO.Draw();
    logoUnderText.Draw();
    TimerText.Draw();
    settingsButton.Draw();
    resetTimerButton.Draw();
    GlobalLoop.OnTick(CalculateTime)
    GlobalLoop.Start();
  },
  onDestroy() {
    logger.debug("page onDestroy invoked");
  },
});
const x = "chuj".tposx
function StartTimer(){
    const now=new Time().getTime();
    timer.start=now;
}
function ResetTimer(){
    timer.start=0;
}
function CalculateTime(){
    const now=new Time().getTime();
    const diff=now-timer.start;
    const _timeString=formatTime(diff);
    TimerText.SetText(_timeString);
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