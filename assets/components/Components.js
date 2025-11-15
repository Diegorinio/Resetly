// import * as hmUI from "@zos/ui";
// import { Rect,Text,Image,Button,GameObject} from "./Classes";
// import { COLORS } from "./colors";
// export class Item{
//   constructor(id=0,name="item",icon_src="images/player.png"){
//     this.id=id;
//     this.name=name;
//     this.icon_src=icon_src;
//   }
// }
// export class UpgradableItem extends Item{
//   constructor(id=0,name="item",amount=0,clickValue=1,upgradeCost=10, icon_src="images/player.png",upgradeModifier=2.1){
//     super(id,name,icon_src);
//     this.unlockPrice=unlockPrice;
//     this.amount=amount;
//     this.clickValue=clickValue;
//     this.upgradeCost=upgradeCost;
//     this.upgradeModifier=upgradeModifier;
//   }

//   AddAmount = (n)=>{
//     this.amount+=n;
//     // this.upgradeCost=Math.round(this.upgradeCost*this.upgradeModifier);
//   }

//   GetTotalValue = ()=>{
//     return this.amount*this.clickValue;
//   }

//   GetClickValue = () =>{
//     return this.clickValue;
//   }

//   GetAmount = ()=>{
//     return this.amount;
//   }

//   GetUpgradeCost = () =>{
//      return Math.round(this.upgradeCost * Math.pow(this.upgradeModifier, this.amount));
//   }
// }

// export class UpgradableItemElement extends GameObject {
//   constructor(x, y, width, height, item = null, playerInstance = null) {
//     super(x, y, width, height);
//     this.backgroundRectParams = {
//       x: x,
//       y: y,
//       w: width,
//       h: height
//     };
//     this.isOwned = false;
//     this.playerInstance = playerInstance;
//     this.background = new Rect(this.x,this.y, this.width, this.height,COLORS.ORANGE_ACCENT,15,255);
//     this.nameTextWidgetButton = null;
//     this.unlockPriceWidget = null;
//     this.amountWidget = null;
//     this.clickValueWidget = null;
//     this.upgradeCostWidget = null;
//     this.iconWidget = null;
//     this.Widgets = [this.background];

//     if (item != null) {
//       this.assignedItem = item;
//       this.AssignItem(item);
//     }
//   }

//   GetAssignedItem = () => {
//     return this.assignedItem;
//   }

//   AssignItem = (item) => {
//     this.id = item.id;
//     this.name = item.name;
//     this.amount = item.amount;
//     this.clickValue = item.clickValue;
//     this.upgradeCost = item.upgradeCost;
//     if(this.playerInstance.ownedItemsMap.has(Number(this.id))){
//       const look_for = this.playerInstance.ownedItemsMap.get(Number(this.id))
//       this.isOwned = true;
//       this.assignedItem.amount = look_for.amount;
//       this.assignedItem.clickValue = look_for.clickValue;
//     }
//     const icon_height=50;
//     this.CreateWidgets(this.assignedItem);
//   }

//   SetVisible = (state)=>{
//     this.Widgets.forEach(el=>{
//       el.SetVisible(state);
//     })
//     // this.widget.SetVisible(state);
//   }

//   Delete = () =>{
//     this.Widgets.forEach(el=>{
//       hmUI.deleteWidget(el);
//       el.widget=null;
//     })
//     this.widgets=null;
//     hmUI.deleteWidget(this.widget);
//     this.widget=null;
//   }



//   CreateWidgets = (item) => {
//     const left=this.width*0.20;
//     const middle=this.width*0.50;
//     const right=this.width*0.30;
//     this.iconWidget = new Image(this.background.x,this.background.y+25, item.icon_src,left, this.background.height/2,true,255,true);
    
//     this.nameTextWidgetButton = new Text(left, this.y, middle, this.height/3,this.height/5, this.assignedItem.name, COLORS.BLACK, null, hmUI.align.LEFT);

//     this.amountLabel=new Text(this.nameTextWidgetButton.x+5,this.nameTextWidgetButton.y+this.nameTextWidgetButton.height,this.nameTextWidgetButton.width*0.25,this.height/4,this.height/10,"LEVEL",COLORS.BLACK,null,hmUI.align.CENTER_H);

//     this.amountWidget = new Text(this.amountLabel.x, this.amountLabel.y+this.amountLabel.height,middle,this.nameTextWidgetButton.height,this.height/5, item.amount, COLORS.BLACK, null, hmUI.align.LEFT);

//     this.upgradeCostWidget = new Button(left+middle-5, this.background.y+5,right,this.background.height-10, formatBig(item.upgradeCost), COLORS.WHITE, COLORS.NAVY_BLUE, null, this.OnUpgradeButtonOnClick,10,0x7393B3,this.background.height/3);
//     this.upgradeCostWidget.enabled=false;

//     this.rateLabel=new Text(left+middle-right/2,this.nameTextWidgetButton.y+this.nameTextWidgetButton.height,middle*0.25,this.height/4,this.height/10,"RATE",COLORS.BLACK,null,hmUI.align.RIGHT);

//     this.totalValuePerSecondWidget = new Text(left+middle-right,this.amountWidget.y,this.nameTextWidgetButton.width/2,this.nameTextWidgetButton.height,this.height/5, formatBig(item.clickValue) + "/s", COLORS.BLACK, null,hmUI.align.RIGHT);

//     this.Widgets.push(this.iconWidget,this.nameTextWidgetButton, this.amountLabel,this.amountWidget, this.upgradeCostWidget,this.rateLabel, this.totalValuePerSecondWidget);
//     if(this.playerInstance)
//       this.playerInstance.Update();
//   }

//   OnUpgradeButtonOnClick = () => {
//     if (this.playerInstance.GetAmount()>=this.assignedItem.GetUpgradeCost()) {
//       const removeAmount = this.assignedItem.GetUpgradeCost();
//       this.assignedItem.AddAmount(1);
//       this.playerInstance.Remove(removeAmount);
//       this.playerInstance.AddItem(this.assignedItem);
//       this.UpdateWidgets();
//     }
//   }

//   OnUpgradeButtonOnLongPress = () =>{
//     this.assignedItem.AddAmount(1000);
//     this.playerInstance.Remove(100000);
//     this.playerInstance.AddItem(this.assignedItem);
//     this.UpdateWidgets();
//   }

//   UpdateWidgets = () => {
//     const upgradeCost=this.assignedItem.GetUpgradeCost();
//     const canBuy=this.playerInstance.GetAmount()>=upgradeCost;
//     if(this.assignedItem.amount>0)
//       this.totalValuePerSecondWidget.SetText(formatBig(this.assignedItem.GetTotalValue()) + "/s");
//     this.amountWidget.SetText(formatBig(this.assignedItem.amount));
//     this.upgradeCostWidget.SetText(formatBig(this.assignedItem.GetUpgradeCost()));
//     // Logger.log("Can buy",canBuy);
//     this.upgradeCostWidget.SetEnable(canBuy);
//   }

//   Draw = () => {
//     this.Widgets.forEach(element => {
//       element.Draw();
//     });
//   }
// }
// export class ShopItem extends Item{
//   constructor(id=0,name="item",price=1,effect=0.01,description="item desc",icon_src="images/player.png"){
//     super(id,name,icon_src);
//     this.price=price;
//     this.effect=effect;
//     this.description=description;
//   }

//   GetPrice = ()=>{
//     return this.price;
//   }
//   GetEffect = ()=>{
//     return this.effect;
//   }
//   GetDescription = ()=>{
//     return this.description;
//   }
// }

// export class ShopItemElement extends GameObject{
//   constructor(x, y, width, height, item = null, playerInstance = null){
//     super(x,y,width,height);
//     this.playerInstance=playerInstance;
//     this.background= new Rect(this.x,this.y, this.width, this.height,COLORS.ORANGE_ACCENT,15,255);
//     this.nameTextWidget=null;
//     this.priceTextWidget=null;
//     this.iconWidget=null;
//     this.descriptionTextWidget=null;
//     this.Widgets=[this.background];
//     if(item!=null){
//       this.assignedItem=item;
//       this.AssignItem(this.assignedItem);
//     }
//     this.isOwned=false;
//   }

//   AssignItem = (item)=>{
//     this.id=item.id;
//     this.name=item.name;
//     this.price=item.price;
//     this.effect=item.effect;
//     this.icon=item.icon;
//     this.description=item.description;
//     this.CreateWidgets(this.assignedItem);
//   }

//   SetVisible = (state)=>{
//     this.Widgets.forEach(el=>{
//       el.SetVisible(state);
//     })
//   }
//   Delete = ()=>{
//     this.Widgets.forEach(el=>{
//       hmUI.deleteWidget(el);
//       el.widget=null;
//     })
//     this.Widgets=null;
//     hmUI.deleteWidget(this.widget);
//     this.widget=null;
//   }

//   CreateWidgets = (item)=>{
//     const left=this.width*0.25;
//     const middle=this.width*0.45;
//     const right=this.width*0.30;
//     this.iconWidget = new Image(this.background.x,this.background.y, item.icon_src,left,this.background.height,true,255,true);

//     this.nameTextWidget=new Text(left,this.background.y+5,middle,this.background.height/4,this.background.height/5,item.name,COLORS.BLACK,null,hmUI.align.LEFT);

//     this.descriptionTextWidget=new Text(this.nameTextWidget.x,this.nameTextWidget.y+this.nameTextWidget.height,middle,this.background.height/5,this.background.height/4,item.description,COLORS.BLACK,hmUI.align.CENTER_V,hmUI.align.LEFT);

//     this.priceTextWidget=new Text(this.nameTextWidget.x,this.descriptionTextWidget.y+this.descriptionTextWidget.height,middle,this.background.height/3,this.background.height/3,formatBig(item.price),COLORS.WHITE,hmUI.align.CENTER_V,hmUI.align.LEFT);

//     this.BuyButton=new Button(left+middle-2,this.background.y+5,right,this.background.height-10,"BUY",COLORS.WHITE,COLORS.BLUE,null,this.OnBuyButtonClick,12,COLORS.GRAY,this.background.height/3);

//     this.Widgets.push(this.iconWidget,this.nameTextWidget,this.priceTextWidget,this.BuyButton,this.descriptionTextWidget);
//   }

//   ItemBought = ()=>{
//     if(this.BuyButton&&this.nameTextWidget){
//         this.BuyButton.SetText("Own");
//         this.BuyButton.SetColor(COLORS.DEFAULT);
//         this.isOwned=true;
//       }
//     }

//   OnBuyButtonClick = () =>{
//     //debug =0 else this.assignedItem.price
//     if(this.playerInstance.GetAmount()>=this.assignedItem.price&&!this.isOwned){
//       if(!this.isOwned){
//         this.isOwned=true;
//         this.playerInstance.AddShopItem(this.assignedItem);
//       }
//       const removeAmount=this.assignedItem.price;
//       this.playerInstance.Remove(removeAmount);
//       this.ItemBought();
//       this.BuyButton.Draw();
//     }
//   }

//   UpdateWidgets = () => {
//     if(!this.isOwned)
//     {
//       const upgradeCost=this.assignedItem.GetPrice();
//       const canBuy=this.playerInstance.GetAmount()>=upgradeCost;
//       this.BuyButton.SetEnable(canBuy);
//     }
//   }
// }