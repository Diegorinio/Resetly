import { formatBig } from "./Game";
import { log as Logger } from "@zos/utils";
export class Player{
  static instance=null;
  static getInstance(mainWidget=null, rateWidget=null){
    if(!Player.instance && mainWidget && rateWidget){
      Player.instance = new Player(mainWidget,rateWidget);
    }
    return Player.instance;
  }
  constructor(mainWidget,rateWidget){
    if(Player.instance){
      return Player.instance
    }
    this.amount = 0;
    this.rate = 0;
    this.valueText=mainWidget;
    this.rateWidget=rateWidget;
    this.ownedShopItems=new Map();
    this.automationInterval=null;
    Player.instance=this;
    this.ownedItemsMap=new Map();
  }

  Add = (value)=>{
    this.amount+=value;
    this.Update();
  }

  Tick = ()=>{
    this.amount+=this.runMultiplier;
    this.Update();
  } 

  AddMultiplier = ()=>{
    this.amount+=this.runMultiplier;
    this.Update();
  }

  GetAmount = () =>{
    return this.amount;
  }

  AddItem = (item)=>{
    const exist=this.ownedItemsMap.get(item.id);
    if(exist){
        exist.amount=item.amount;
        exist.clickValue=item.clickValue;
    }
    else{
        const amount=item.amount;
        const clickValue=item.clickValue;
        this.ownedItemsMap.set(item.id,{amount,clickValue});
    }
    this.CalculateRate();
  }
  
  AddShopItem = (item)=>{
    const effect_val=item.effect;
    this.ownedShopItems.set(item.id,effect_val);
  }

  CalculateRate = ()=>{
    let sum=0;
    this.ownedItemsMap.forEach(({amount,clickValue})=>{
        sum+=amount*clickValue;
    })
    let sum_effect=0;
    this.ownedShopItems.forEach(effect=>{
      sum_effect+=effect;
    })
    sum=sum*(1+sum_effect);
    this.rate=Math.round(sum*100)/100;
  }
  Remove = (value)=>{
    this.amount-=value;
    this.Update();
  }

  Update = ()=>{
    this.CalculateRate();
    this.rateWidget.SetText(formatBig(this.rate)+"/s");
    this.valueText.SetText(formatBig(Math.ceil(this.amount).toString()));
  }
  SetShopItemElements=(elements)=>{
    this.ShopItemElement=elements;
  }
}