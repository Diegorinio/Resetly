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
const data={longestTime:0,smokesAmount:0};
import { getText } from "@zos/i18n";


const title=new GameObject.Text(0,30,DEVICE_WIDTH,80,32,getText("settings-title"));
const goToMainButton= new GameObject.ImageButton(title.x,title.y,title.width,title.height,"",null,getText("transparent"),null,GoToMain,false,12,0,true);
const buttonsGrid=new GameObject.HContainer(0,title.y+title.height+10,DEVICE_WIDTH,80);

//Buttons
const daybutton=new GameObject.Button(0,0,10,10,getText("button-day"),COLORS.WHITE,COLORS.BLUE,null,GetToday);
const weekButton=new GameObject.Button(0,0,10,10,getText("button-week"),COLORS.WHITE,COLORS.BLUE,null,GetWeek);
const monthButton=new GameObject.Button(0,0,10,10,getText("button-month"),COLORS.WHITE,COLORS.BLUE,null,()=>{});

function DrawBaseUI(){
  title.Draw();
  goToMainButton.Draw();
  buttonsGrid.AddWidget(daybutton);
  buttonsGrid.AddWidget(weekButton);
  buttonsGrid.AddWidget(monthButton);
  buttonsGrid.SetWidgets();
  buttonsGrid.Draw();
}

const longestTimeLabel=new GameObject.Text(0,buttonsGrid.y+buttonsGrid.height+10,DEVICE_WIDTH,30,25,getText("settings-streak"),COLORS.GREEN);
const longestTimeValue=new GameObject.Text(0,longestTimeLabel.y+longestTimeLabel.height+5,DEVICE_WIDTH,35,28,"0",COLORS.GREEN);
const smokesAmountLabel=new GameObject.Text(0,longestTimeValue.y+longestTimeValue.height+10,DEVICE_WIDTH,30,25,getText("settings-smokes-taken"),COLORS.RED);
const smokesAmountValue=new GameObject.Text(0,smokesAmountLabel.y+smokesAmountLabel.height+5,DEVICE_WIDTH,35,28,"0",COLORS.RED);

function DrawStatsUI(){
  longestTimeLabel.Draw();
  longestTimeValue.Draw();
  smokesAmountLabel.Draw();
  smokesAmountValue.Draw();
}
Page({
    style:{
    titleBar:false
  },
  onInit(params) {
    hmUI.setStatusBarVisible(false);
  },
  build() {
    DrawBaseUI();

    //Continer values 
    DrawStatsUI();
    //Get Data
  }
});

//Longest streak, smokes today
function GetStats(data){
  let longestTime=0;
  let smokesAmount=0;
  if(data){
  data.forEach(el=>{
    Logger.log(el.day);
    smokesAmount+=1;
    const diff=el.end-el.start;
    if(longestTime<diff){
      longestTime=diff;
    }
  })
  }
  else{
    return {longestTime:0,smokesAmount:getText("settings-null")};
  }
  return {longestTime:longestTime,smokesAmount:smokesAmount};
}
function GetToday(){
  const todayHistory=RTLY.GetHistoryToday();
    const stats=GetStats(todayHistory);
    longestTimeValue.SetText(RTLY.formatTime(stats.longestTime));
    smokesAmountValue.SetText(stats.smokesAmount.toString());
}

function GetWeek(){
  const weekHistory=RTLY.GetWeekHistory();
  const stats=GetStats(weekHistory);
  longestTimeValue.SetText(RTLY.formatTime(stats.longestTime));
  smokesAmountValue.SetText(stats.smokesAmount.toString());
}

function GoToMain(){
  hmRoute.back();
}