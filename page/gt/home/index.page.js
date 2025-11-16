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
const newItemButton=new GameObject.Button(0,DEVICE_HEIGHT-105,DEVICE_WIDTH,100,"ADD NEW ITEM",COLORS.WHITE,COLORS.DARK_BLUE,null,CreateNewItem,60);
const ItemContainer=new GameObject.ViewContainer(0,LOGO.y+LOGO.height,DEVICE_WIDTH,(DEVICE_HEIGHT-LOGO.height),[],true,-1);
let itemElements=[];
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
    const text = new GameObject.Text(100,100,50,50,20,"sss",COLORS.AMBER);
    const itttem=new RTLY.Item(0,"Test",0);
    const itemElement=new RTLY.ItemElement(0,0,DEVICE_WIDTH,100,itttem);
    itemElements.push(itemElement);
    ItemContainer.AddWidget(itemElement);
    ItemContainer.InitializeWidgets();
    ItemContainer.AddScrollSpacer(1);
    // itemElement.Draw();
    GlobalLoop.OnTick(()=>{
      // text.SetText(xd);
      // text.Draw();
      itemElements.forEach(el=>{
        el.OnTick();
      })
    })

    newItemButton.Draw();
    GlobalLoop.Start();
  },
  onDestroy() {
    logger.debug("page onDestroy invoked");
  },
});

function CreateNewItem(){
  new_item=new RTLY.Item(items.length+1,"Item "+items.length+1,0);
  items.push(new_item);
  const last_item=itemElements[items.length-1];
  const new_itemElement=new RTLY.ItemElement(0,last_item.y+last_item.height+5,last_item.width,last_item.height,new_item);
  itemElements.push(new_itemElement)
  ItemContainer.AddWidget(new_itemElement);
  ItemContainer.InitializeWidgets();
}