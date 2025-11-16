import * as hmUI from "@zos/ui";
import { log as Logger } from "@zos/utils";
import * as GameObject from "../../../assets/components/Classes";
import {COLORS} from "../../../assets/components/colors";
import { GameLoop } from "../../../assets/components/GameLoop";
import { DEVICE_WIDTH,DEVICE_HEIGHT } from "./index.page.r.layout";
import * as RTLY from "../../../assets/components/Restartly";
const GlobalLoop=GameLoop.getInstance();
GlobalLoop.SetTick(1000);
const logger = Logger.getLogger("helloworld");
const LOGO=new GameObject.Text(0,0,DEVICE_WIDTH,100,32,"Restartly",COLORS.RED);
const newItemButton=new GameObject.Button(0,DEVICE_HEIGHT-100,DEVICE_WIDTH,100,"ADD NEW ITEM",COLORS.WHITE,COLORS.BLUE,null);
const ItemContainer=new GameObject.Container();
Page({
  onInit() {
    hmUI.setStatusBarVisible(false);
    logger.debug("page onInit invoked");
  },
  build() {
    LOGO.Draw();
    let xd=1;
    logger.debug("page build invoked");
    const text = new GameObject.Text(100,100,50,50,20,"sss",COLORS.AMBER);
    const itttem=new RTLY.Item(0,"Test",100);
    const itemElement=new RTLY.ItemElement(0,0,DEVICE_WIDTH,100,itttem);
    itemElement.Draw();
    text.Draw();
    GlobalLoop.OnTick(()=>{
      text.SetText(xd);
      text.Draw();
      xd++;
    })

    newItemButton.Draw();
    GlobalLoop.Start();
  },
  onDestroy() {
    logger.debug("page onDestroy invoked");
  },
});