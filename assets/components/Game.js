import * as hmUI from "@zos/ui";
import { log as Logger } from "@zos/utils";
import { DEVICE_WIDTH, DEVICE_HEIGHT} from "../../page/gt/home/index.style";
import { sportItemsData } from "../sport-items";
import { ShopItems } from "../shop-items";
import { LocalStorage } from '@zos/storage'
import { COLORS } from "./colors";
import { Button, GameObject, GameObjectRect, Text, Image, Rect} from "./Classes";
const localStorage=new LocalStorage();

export class Item{
  constructor(id=0,name="item",icon_src="images/player.png"){
    this.id=id;
    this.name=name;
    this.icon_src=icon_src;
  }
}
export class UpgradableItem extends Item{
  constructor(id=0,name="item",amount=0,clickValue=1,upgradeCost=10, icon_src="images/player.png",upgradeModifier=2.1){
    super(id,name,icon_src);
    this.unlockPrice=unlockPrice;
    this.amount=amount;
    this.clickValue=clickValue;
    this.upgradeCost=upgradeCost;
    this.upgradeModifier=upgradeModifier;
  }

  AddAmount = (n)=>{
    this.amount+=n;
    // this.upgradeCost=Math.round(this.upgradeCost*this.upgradeModifier);
  }

  GetTotalValue = ()=>{
    return this.amount*this.clickValue;
  }

  GetClickValue = () =>{
    return this.clickValue;
  }

  GetAmount = ()=>{
    return this.amount;
  }

  GetUpgradeCost = () =>{
     return Math.round(this.upgradeCost * Math.pow(this.upgradeModifier, this.amount));
  }

  GetUpgradeCostForAmount = (n) => {
  let totalCost = 0;
  for (let i = 0; i < n; i++) {
    const level = this.amount + i;
    const cost = this.upgradeCost * Math.pow(this.upgradeModifier, level);
    totalCost += cost;
  }

  return Math.round(totalCost);
}

}

export class UpgradableItemElement extends GameObject {
  constructor(x, y, width, height, item = null, playerInstance = null) {
    super(x, y, width, height);
    this.backgroundRectParams = {
      x: x,
      y: y,
      w: width,
      h: height
    };
    this.isOwned = false;
    this.playerInstance = playerInstance;
    this.background = new Rect(this.x,this.y, this.width, this.height,COLORS.ORANGE_ACCENT,15,255);
    this.nameTextWidgetButton = null;
    this.unlockPriceWidget = null;
    this.amountWidget = null;
    this.clickValueWidget = null;
    this.BuyButton = null;
    this.iconWidget = null;
    this.buyMultipliers=[1,2,5,10,25,50,100];
    this.buyMultiplierID=0;
    this.Widgets = [this.background];

    if (item != null) {
      this.assignedItem = item;
      this.AssignItem(item);
    }
  }

  GetAssignedItem = () => {
    return this.assignedItem;
  }

  AssignItem = (item) => {
    this.id = item.id;
    this.name = item.name;
    this.amount = item.amount;
    this.clickValue = item.clickValue;
    this.upgradeCost = item.upgradeCost;
    if(this.playerInstance.ownedItemsMap.has(Number(this.id))){
      const look_for = this.playerInstance.ownedItemsMap.get(Number(this.id))
      this.isOwned = true;
      this.assignedItem.amount = look_for.amount;
      this.assignedItem.clickValue = look_for.clickValue;
    }
    const icon_height=50;
    this.CreateWidgets(this.assignedItem);
  }

  SetVisible = (state)=>{
    this.Widgets.forEach(el=>{
      el.SetVisible(state);
    })
  }

  Delete = () =>{
    this.Widgets.forEach(el=>{
      hmUI.deleteWidget(el);
      el.widget=null;
    })
    this.widgets=null;
    hmUI.deleteWidget(this.widget);
    this.widget=null;
  }



  CreateWidgets = (item) => {
    const left=this.width*0.20;
    const middle=this.width*0.50;
    const right=this.width*0.30;
    this.iconWidget=new Image(this.background.x,this.background.y+25, item.icon_src,left, this.background.height/2,true,255,true);
    
    this.nameTextWidgetButton=new Text(left, this.y, middle, this.height/3,this.height/5, this.assignedItem.name, COLORS.BLACK, null, hmUI.align.LEFT);

    this.amountLabel=new Text(this.nameTextWidgetButton.x+5,this.nameTextWidgetButton.y+this.nameTextWidgetButton.height,this.nameTextWidgetButton.width*0.25,this.height/4,this.height/10,"LEVEL",COLORS.BLACK,null,hmUI.align.CENTER_H);

    this.amountWidget=new Text(this.amountLabel.x, this.amountLabel.y+this.amountLabel.height,middle,this.nameTextWidgetButton.height,this.height/5, item.amount, COLORS.BLACK, null, hmUI.align.LEFT);

    this.BuyButton=new Button(left+middle-5, this.background.y+5,right,this.background.height/1.6, formatBig(this.assignedItem.GetUpgradeCostForAmount(this.buyMultipliers[this.buyMultiplierID])), COLORS.WHITE, COLORS.NAVY_BLUE, null, this.OnUpgradeButtonOnClick,10,COLORS.GREY_BLUE,this.background.height/4);
    this.BuyButton.enabled=false;

    const maxButtonHeight=this.background.y+this.background.height-5-(this.BuyButton.y+this.BuyButton.height);

    this.BuyMaxButton=new Button(left+middle-5, this.BuyButton.y+this.BuyButton.height,right,maxButtonHeight,this.buyMultipliers[this.buyMultiplierID]+"x", COLORS.WHITE, COLORS.BLUE,null, this.OnBuyMaxButtonOnClick,12,COLORS.GRAY,maxButtonHeight/2);
    // this.BuyMaxButton.SetEnable(false);

    this.rateLabel=new Text(left+middle-right/2,this.nameTextWidgetButton.y+this.nameTextWidgetButton.height,middle*0.25,this.height/4,this.height/10,"RATE",COLORS.BLACK,null,hmUI.align.RIGHT);

    this.totalValuePerSecondWidget=new Text(left+middle-right,this.amountWidget.y,this.nameTextWidgetButton.width/2,this.nameTextWidgetButton.height,this.height/5, formatBig(item.clickValue) + "/s", COLORS.BLACK, null,hmUI.align.RIGHT);

    this.Widgets.push(this.iconWidget,this.nameTextWidgetButton, this.amountLabel,this.amountWidget, this.BuyButton,this.BuyMaxButton,this.rateLabel, this.totalValuePerSecondWidget);
    if(this.playerInstance)
      this.playerInstance.Update();
  }

  OnUpgradeButtonOnClick = () => {
    const totalItemCost=this.assignedItem.GetUpgradeCostForAmount(this.buyMultipliers[this.buyMultiplierID]);
    if (this.playerInstance.GetAmount()>=totalItemCost) {
      // const removeAmount = this.assignedItem.GetUpgradeCost();
      this.assignedItem.AddAmount(this.buyMultipliers[this.buyMultiplierID]);
      this.playerInstance.Remove(totalItemCost);
      this.playerInstance.AddItem(this.assignedItem);
      this.UpdateWidgets();
    }
  }

  OnBuyMaxButtonOnClick = ()=>{
    if(this.buyMultiplierID>=this.buyMultipliers.length-1){
      this.buyMultiplierID=0;
    }
    else{
      this.buyMultiplierID+=1;
    }
    this.UpdateWidgets();
  }

  UpdateWidgets = () => {
    const upgradeCost=this.assignedItem.GetUpgradeCostForAmount(this.buyMultipliers[this.buyMultiplierID]);
    const canBuy=this.playerInstance.GetAmount()>=upgradeCost;
    if(this.assignedItem.amount>0)
      this.totalValuePerSecondWidget.SetText(formatBig(this.assignedItem.GetTotalValue()) + "/s");
    this.amountWidget.SetText(formatBig(this.assignedItem.amount));
    this.BuyButton.SetText(formatBig(this.assignedItem.GetUpgradeCostForAmount(this.buyMultipliers[this.buyMultiplierID])));
    // Logger.log("Can buy",canBuy);
    this.BuyButton.SetEnable(canBuy);
    this.BuyMaxButton.SetText(this.buyMultipliers[this.buyMultiplierID].toString()+"x");
  }

  Draw = () => {
    this.Widgets.forEach(element => {
      element.Draw();
    });
  }
}

export class ShopItem extends Item{
  constructor(id=0,name="item",price=1,effect=0.01,description="item desc",icon_src="images/player.png"){
    super(id,name,icon_src);
    this.price=price;
    this.effect=effect;
    this.description=description;
  }

  GetPrice = ()=>{
    return this.price;
  }
  GetEffect = ()=>{
    return this.effect;
  }
  GetDescription = ()=>{
    return this.description;
  }
}

export class ShopItemElement extends GameObject{
  constructor(x, y, width, height, item = null, playerInstance = null){
    super(x,y,width,height);
    this.playerInstance=playerInstance;
    this.background= new Rect(this.x,this.y, this.width, this.height,COLORS.ORANGE_ACCENT,15,255);
    this.nameTextWidget=null;
    this.priceTextWidget=null;
    this.iconWidget=null;
    this.descriptionTextWidget=null;
    this.Widgets=[this.background];
    if(item!=null){
      this.assignedItem=item;
      this.AssignItem(this.assignedItem);
    }
    this.isOwned=false;
  }

  AssignItem = (item)=>{
    this.id=item.id;
    this.name=item.name;
    this.price=item.price;
    this.effect=item.effect;
    this.icon=item.icon;
    this.description=item.description;
    this.CreateWidgets(this.assignedItem);
  }

  SetVisible = (state)=>{
    this.Widgets.forEach(el=>{
      el.SetVisible(state);
    })
  }
  Delete = ()=>{
    this.Widgets.forEach(el=>{
      hmUI.deleteWidget(el);
      el.widget=null;
    })
    this.Widgets=null;
    hmUI.deleteWidget(this.widget);
    this.widget=null;
  }

  CreateWidgets = (item)=>{
    const left=this.width*0.25;
    const middle=this.width*0.45;
    const right=this.width*0.30;
    this.iconWidget = new Image(this.background.x,this.background.y, item.icon_src,left,this.background.height,true,255,true);

    this.nameTextWidget=new Text(left,this.background.y+5,middle,this.background.height/4,this.background.height/5,item.name,COLORS.BLACK,null,hmUI.align.LEFT);

    this.descriptionTextWidget=new Text(this.nameTextWidget.x,this.nameTextWidget.y+this.nameTextWidget.height,middle,this.background.height/5,this.background.height/4,item.description,COLORS.BLACK,hmUI.align.CENTER_V,hmUI.align.LEFT);

    this.priceTextWidget=new Text(this.nameTextWidget.x,this.descriptionTextWidget.y+this.descriptionTextWidget.height,middle,this.background.height/3,this.background.height/3,formatBig(item.price),COLORS.WHITE,hmUI.align.CENTER_V,hmUI.align.LEFT);

    this.BuyButton=new Button(left+middle-right/10,this.background.y+5,right,this.background.height-10,"BUY",COLORS.WHITE,COLORS.BLUE,null,this.OnBuyButtonClick,12,COLORS.GRAY,this.background.height/3);

    this.Widgets.push(this.iconWidget,this.nameTextWidget,this.priceTextWidget,this.BuyButton,this.descriptionTextWidget);
  }

  ItemBought = ()=>{
    if(this.BuyButton&&this.nameTextWidget){
        this.BuyButton.SetText("Own");
        this.BuyButton.SetColor(COLORS.AMBER);
        this.isOwned=true;
      }
    }

  OnBuyButtonClick = () =>{
    //debug =0 else this.assignedItem.price
    if(this.playerInstance.GetAmount()>=this.assignedItem.price&&!this.isOwned){
      if(!this.isOwned){
        this.isOwned=true;
        this.playerInstance.AddShopItem(this.assignedItem);
      }
      const removeAmount=this.assignedItem.price;
      this.playerInstance.Remove(removeAmount);
      this.ItemBought();
      this.BuyButton.Draw();
    }
  }

  UpdateWidgets = () => {
    if(!this.isOwned)
    {
      const upgradeCost=this.assignedItem.GetPrice();
      const canBuy=this.playerInstance.GetAmount()>=upgradeCost;
      this.BuyButton.SetEnable(canBuy);
    }
  }
}

export function formatBig(num){
  if (num < 1000) return num.toString();
  const units = ["k", "M", "B", "T", "Qa", "Qi"];
  let unitIndex = -1;
  let scaled = num;
  while (scaled >= 1000 && unitIndex < units.length - 1) {
    scaled /= 1000;
    unitIndex++;
  }
  return scaled.toFixed(1).replace(/\.0$/, "") + units[unitIndex];
}

export function SaveGame(player){
  const saveData = {
      amount: player.amount,
      rate: player.rate,
      ownedItems:Object.fromEntries(player.ownedItemsMap),
      ownedShopItems:Object.fromEntries(player.ownedShopItems),
      lastVisit:Date.now()
    };
    localStorage.setItem("GameSave", JSON.stringify(saveData));
}

export function LoadGame(){
  // localStorage.clear();
  const data = localStorage.getItem("GameSave");
  if (!data) return null;
  // Logger.log(`Loaded data ${data}`);
  return JSON.parse(data);
}

export function LoadItemsFromFile(playerInstance){
  const item_x=0;
  let item_y=0;
  let itemsList=[]
  const elementHeight=DEVICE_HEIGHT/3;
  const spacing=5;
  const elementWidth=DEVICE_WIDTH;
  sportItemsData.forEach(element => {
      const _item=new UpgradableItem(element.id,element.name,element.amount,element.clickValue,element.upgradeCost,element.icon_src,element.upgradeModifier);
      const _itemElement=new UpgradableItemElement(item_x,item_y,elementWidth,elementHeight,_item,playerInstance);
      itemsList.push({item:_item,element:_itemElement});
      item_y+=elementHeight+spacing;
  });
  return itemsList;
}

export function LoadShopItemsFromFile(playerInstance){
  const item_x=0;
  let item_y=0;
  let shopItemsList=[];
  const elementHeight=DEVICE_HEIGHT/4;
  const spacing=5;
  const elementWidth=DEVICE_WIDTH;
  ShopItems.forEach(el=>{
      const _item=new ShopItem(el.id,el.name,el.price,el.effect,el.description,el.icon);
      const _itemElement=new ShopItemElement(item_x,item_y,elementWidth,elementHeight,_item,playerInstance);
      if(playerInstance.ownedShopItems.has(Number(el.id))){
        _itemElement.ItemBought();
      }
      shopItemsList.push({item:_item,element:_itemElement});
      item_y+=elementHeight+spacing;
  })
  return shopItemsList;
}

export function LoadGameToPlayer(player, savedData) {
  player.amount = savedData.amount;
  player.rate = savedData.rate;
  if(savedData.lastVisit){
    const now = Date.now();
    let offlineTime=Math.floor((now-savedData.lastVisit)/1000);
    offlineTime=Math.min(offlineTime,21600);
    const offlineScore= offlineTime*player.rate;
    player.amount+=offlineScore;
    if (offlineScore > 0 && offlineTime>30) {
      hmUI.showToast({text: `Offline earnings: ${formatBig(offlineScore)}`});
    }
  }

  const ownedItemsMap = new Map(
    Object.entries(savedData.ownedItems).map(([id, data]) => [Number(id), data])
  );
  ownedItemsMap.forEach((savedItem,id) => {
    const baseItem = sportItemsData.find(el => Number(el.id) === Number(id));
    if (baseItem) {
      player.AddItem({id:baseItem.id,amount:savedItem.amount,clickValue:baseItem.clickValue});
    }
  });
  const ownedShopItemsMap = new Map(
    Object.entries(savedData.ownedShopItems).map(([id, data]) => [Number(id), data])
  );
  ownedShopItemsMap.forEach((effect,id)=>{
    player.AddShopItem({id:id,effect:effect});
  })
}