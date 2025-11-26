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
const LOGO=new GameObject.Text(0,0,DEVICE_WIDTH,50,32,getText('appName'),COLORS.RED,hmUI.align.BOTTOM,hmUI.align.CENTER_H);

const newItemButton=new GameObject.Button(0,DEVICE_HEIGHT-105,DEVICE_WIDTH,100,"+",COLORS.WHITE,COLORS.TEAL,null,CreateNewItem,60,null,99);

const ItemContainer=new GameObject.ViewContainer(0,LOGO.y+LOGO.height,DEVICE_WIDTH,(DEVICE_HEIGHT-LOGO.height-newItemButton.height),[],true,-1);
const loadedStorage=RTLY.LoadItemsStorage();
logger.log(JSON.stringify(loadedStorage));
let itemElements=[];
let items=[...loadedStorage.items].reverse();
items.forEach(el=>{
  logger.log(el.id);
})
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
    logger.debug("page build invoked");
    // const itttem=new RTLY.Item(0,"Test",523100);
    let posY=130;
    const spacing=133;
    items.forEach(item=>{
      logger.log(item.title);
      const _element = new RTLY.ItemElement(0,posY,DEVICE_WIDTH,130,item,()=>{
        GoToEditItemPage(item.id);
      });
      _element.Active=true;
      itemElements.push(_element);
      ItemContainer.AddWidget(_element);
      ItemContainer.InitializeWidgets();
      posY+=spacing;
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
  hmRoute.push({url:"/page/gt/home/index.page.new_item_page"});
}

function GoToEditItemPage(id){
  logger.log("Presed ",id);
  const _item=items.find(i => i.id==id);
  // logger.log(JSON.stringify(_item))
  hmRoute.push({url:"/page/gt/home/index.page.item_edit",params:JSON.stringify(_item)});
}

