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

const GlobalLoop=GameLoop.getInstance();
GlobalLoop.SetTick(1000);
const logger = Logger.getLogger("helloworld");
const LOGO=new GameObject.Text(0,0,DEVICE_WIDTH,50,32,getText('appName'),COLORS.RED,hmUI.align.BOTTOM,hmUI.align.CENTER_H);

const newItemButton=new GameObject.Button(100,DEVICE_HEIGHT-105,DEVICE_WIDTH/2,100,"+",COLORS.WHITE,COLORS.BLUE,null,CreateNewItem,42,null,48);
const ItemContainer=new GameObject.ViewContainer(0,LOGO.y+LOGO.height,DEVICE_WIDTH,(DEVICE_HEIGHT-LOGO.height),[],true,-1);
let itemElements=[];
let items=[];
Page({
  style:{
    titleBar:false
  },
  onInit(params) {
    if(params!=null && params!=""){
      const itemParams=JSON.parse(params);
      logger.log(itemParams);
      items.push(new RTLY.Item(items.length+1,itemParams.title,Number(itemParams.time)));
    }
    hmUI.setStatusBarVisible(false);
    logger.debug("page onInit invoked");
  },
  build() {
    // hmRoute.push({url:"/page/gt/home/index.page.select_date"});
    LOGO.Draw();
    logger.debug("page build invoked");
    // const itttem=new RTLY.Item(0,"Test",523100);
    items.forEach(item=>{
      const _element = new RTLY.ItemElement(0,100,DEVICE_WIDTH,100,item);
      _element.Active=true;
      itemElements.push(_element);
      ItemContainer.AddWidget(_element);
      ItemContainer.InitializeWidgets();
    })
    // const itemElement=new RTLY.ItemElement(0,0,DEVICE_WIDTH,100,itttem);
    // itemElements.push(itemElement);
    // ItemContainer.AddWidget(itemElement);
    // ItemContainer.AddScrollSpacer(1);
    GlobalLoop.OnTick(()=>{
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
  // new_item=new RTLY.Item(items.length+1,"Item "+items.length+1,0);
  // items.push(new_item);
  // const last_item=itemElements[items.length-1];
  // const new_itemElement=new RTLY.ItemElement(0,last_item.y+last_item.height+5,last_item.width,last_item.height,new_item);
  // itemElements.push(new_itemElement)
  // ItemContainer.AddWidget(new_itemElement);
  // ItemContainer.InitializeWidgets();
  hmRoute.push({url:"/page/gt/home/index.new_item_page"});
}

