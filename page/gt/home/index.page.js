import * as hmUI from "@zos/ui";
import { log, log as Logger } from "@zos/utils";
import * as GameObject from "../../../assets/components/Classes";
import {COLORS} from "../../../assets/components/colors";
import { GameLoop } from "../../../assets/components/GameLoop";
import { DEVICE_WIDTH,DEVICE_HEIGHT } from "./index.page.r.layout";
import * as RTLY from "../../../assets/components/Restartly";
const GlobalLoop=GameLoop.getInstance();
GlobalLoop.SetTick(1000);
const logger = Logger.getLogger("helloworld");
const LOGO=new GameObject.Text(0,0,DEVICE_WIDTH,50,32,"Restartly",COLORS.RED,hmUI.align.BOTTOM,hmUI.align.CENTER_H);
const newItemButton=new GameObject.Button(0,DEVICE_HEIGHT-100,DEVICE_WIDTH,100,"ADD NEW ITEM",COLORS.WHITE,COLORS.BLUE,null);
const ItemContainer=new GameObject.Container();
let items=[];
Page({
  style:{
    titleBar:false
  },
  onInit() {
    hmUI.setStatusBarVisible(false);
    logger.debug("page onInit invoked");
  },
  build() {
    LOGO.Draw();
    let xd=1;
    logger.debug("page build invoked");
    const VContainer=new GameObject.ViewContainer(0,LOGO.y,DEVICE_WIDTH,(DEVICE_HEIGHT-LOGO.height),[],true);
    const text = new GameObject.Text(100,100,50,50,20,"sss",COLORS.AMBER);
    const itttem=new RTLY.Item(0,"Test",0);
    const itemElement=new RTLY.ItemElement(0,100,DEVICE_WIDTH,100,itttem);
    VContainer.AddWidget(itemElement);
    VContainer.InitializeWidgets();
    VContainer.AddScrollSpacer(1);
    // itemElement.Draw();
    GlobalLoop.OnTick(()=>{
      // text.SetText(xd);
      // text.Draw();
      itemElement.OnTick();
    })

    newItemButton.Draw();
    GlobalLoop.Start();
  },
  onDestroy() {
    logger.debug("page onDestroy invoked");
  },
});

function CreateNewItem(item){

}