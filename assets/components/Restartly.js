import { DEVICE_WIDTH } from "../../page/gt/home/index.page.r.layout";
import { GameObject, Rect,Text,Button} from "./Classes";
import { COLORS } from "./colors";
import * as hmUI from "@zos/ui";
import {Time} from "@zos/sensor";
import { log, log as Logger } from "@zos/utils";
export class ItemElement extends GameObject{
  constructor(x,y,width,height,item=null){
    super(x,y,width,height);
    this.background={
      x:x,
      y:y,
      w:width,
      h:height
    };
    this.background=new Rect(this.x,this.y,this.width,this.height,COLORS.BLUE,12,255);
    this.titleLabel=null;
    this.timerLabel=null;
    this.resetButton=null;
    this.editButton=null;
    this.Widgets=[this.background];
    this.Active=false;
    if(item!=null){
      this.assignedItem=item;
      this.AssignItem(item);
    }
  }
    AssignItem=(item)=>{
      this.assignedItem=item;
      this.id=item.id;
      this.title=item.title;
      this.time=item.time;
      this.CreateWidgets(this.assignedItem);
    }

    CreateWidgets=(item)=>{
      const left=this.width*0.20;
      const middle=this.width*0.50;
      const right=this.width*0.30;
      this.titleLabel=new Text(left-50,this.y,left,this.height,this.height/4,item.title,COLORS.WHITE,hmUI.align.CENTER_V,hmUI.align.LEFT);

      this.timerText=new Text(this.titleLabel.x+this.titleLabel.width,this.y,middle,this.height/2,this.height/5,"Absence time",COLORS.WHITE);
      this.timerLabel=new Text(this.titleLabel.x+this.titleLabel.width,this.timerText.y+this.timerText.height/4,middle,this.height,this.height/4,item.time,COLORS.WHITE,null);

      this.startButton=new Button(this.x+this.width-100,this.y+5,100,this.height-10,"EDIT",COLORS.RED,COLORS.BLACK,null,this.ToggleTimer,12,null,this.height/4);
      this.Widgets.push(this.titleLabel,this.timerText,this.timerLabel,this.startButton);
    }

    Draw=()=>{
      this.Widgets.forEach(el=>{
        el.Draw();
      })
    }

    Update=()=>{
      const now=new Time().getTime();
      const diff=now-this.time;
      const _timeString=formatTime(diff);
      this.timerLabel.widget.setProperty(hmUI.prop.TEXT,_timeString);
    }

    OnTick=()=>{
      if(this.Active){
        this.Update();
      }
    }
  StopTimer=()=>{
    this.Active=false;
  }
  StartTimer=()=>{
    this.Active=true;
  }
  ToggleTimer=()=>{
    this.Active=!this.Active;
  }
}
export class Item{
  constructor(id,title,time){
    this.id=id;
    this.title=title;
    this.time=time;
  }
}


export function formatTime(ms) {
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


export class Keyboard {
  constructor(opts) {
    this.x = opts.x || 0;
    this.y = opts.y || 200;
    this.onChange = opts.onChange || (() => {});
    this.onSubmit = opts.onSubmit || (() => {});
    this.shift = false;
    this.value = "";
    this.OnClose=opts.OnClose||(()=>{});

    this.buttons = [];
    this._buildUI();
  }

  _buildUI() {
    const SCREEN_W = DEVICE_WIDTH;
    const spacing = 5;
    const margin = 10;

    // Wyświetlany tekst
    this.textBox = hmUI.createWidget(hmUI.widget.TEXT, {
      x: 0,
      y: this.y - 60,
      w: SCREEN_W,
      h: 50,
      text: "",
      text_size: 28,
      align_h: hmUI.align.CENTER_H
    });

    // Rzędy klawiszy, z przyciskiem CLOSE
    const rows = [
      ["q","w","e","r","t","y","u","i","o","p"],
      ["a","s","d","f","g","h","j","k","l"],
      ["shift","z","x","c","v","b","n","m","back"],
      ["close","space","enter"]  // ← NOWY RZĄD Z CLOSE
    ];

    let yOffset = this.y;

    rows.forEach(row => {
      let xOffset = margin;

      // Dynamiczne dopasowanie dla rzędów bez specjalnych przycisków
      let keyWidth = 40;
      if (!(row.includes("space") || row.includes("enter") || row.includes("close"))) {
        const totalSpacing = spacing * (row.length - 1);
        const usableWidth = SCREEN_W - margin * 2 - totalSpacing;
        keyWidth = Math.floor(usableWidth / row.length);
      }

      row.forEach(key => {
        let w = keyWidth;

        // Szerokości specjalnych przycisków
        if (key === "close") w = SCREEN_W * 0.15;
        if (key === "space") w = SCREEN_W * 0.60;
        if (key === "enter") w = SCREEN_W * 0.25;

        // Ikony
        const label = key === "space" ? "␣" :
                      key === "back"  ? "←" :
                      key === "shift" ? "⇧" :
                      key === "enter" ? "⏎" :
                      key === "close" ? "✕" : key;

        const btn = hmUI.createWidget(hmUI.widget.BUTTON, {
          x: xOffset,
          y: yOffset,
          w: w,
          h: 40,
          text: label,
          text_size: 20,
          click_func: () => this._onKeyPress(key)
        });

        this.buttons.push(btn);
        xOffset += w + spacing;
      });

      yOffset += 50;
    });
  }

  _onKeyPress(key) {
    // Zamykanie klawiatury
    if (key === "close") {
      this.Hide();
      this.OnClose();
      return;
    }

    // Submit
    if (key === "enter") {
      this.onSubmit(this.value);
      return;
    }

    // Backspace
    if (key === "back") {
      this.value = this.value.slice(0, -1);
      this._updateText();
      return;
    }

    // Shift
    if (key === "shift") {
      this.shift = !this.shift;
      return;
    }

    // Spacja
    if (key === "space") {
      this.value += " ";
      this._updateText();
      return;
    }

    // Litery
    const ch = this.shift ? key.toUpperCase() : key;
    this.value += ch;
    this._updateText();
  }

  _updateText() {
    this.textBox.setProperty(hmUI.prop.TEXT, this.value);
    this.onChange(this.value);
  }

  Show() {
    this.textBox.setProperty(hmUI.prop.VISIBLE, true);
    this.buttons.forEach(btn => {
      btn.setProperty(hmUI.prop.VISIBLE, true);
    });
  }

  Hide() {
    this.textBox.setProperty(hmUI.prop.VISIBLE, false);
    this.buttons.forEach(btn => {
      btn.setProperty(hmUI.prop.VISIBLE, false);
    });
  }
}

export class TimePicker{
  constructor(title="time picker",subtitle="",OnConfirm=null){
    this.Widget=null;
    this.title=title;
    this.subtitle=subtitle;
    this.time_instance=new Time();
    this.time_picker_data={hour:this.time_instance.getHours(),minute:this.time_instance.getMinutes()}
    this.hours = Array.from({length:24}, (_,i) => i.toString().padStart(2,'0'));
    this.minutes = Array.from({length:60}, (_,i) => i.toString().padStart(2,'0'));
    this.data_config=[
        {
        data_array:this.hours,
        init_val_index:this.time_picker_data.hour,
        unit:"h",
        support_loop:true,
        font_size:24,
        select_font_size:32,
        connector_font_size:18,
        unit_font_size:18,
        col_width:80 
        },
        {
          data_array:this.minutes,
          init_val_index:this.time_picker_data.minute,
          unit:"m",
          support_loop:true,
          font_size:24,
          select_font_size:32,
          connector_font_size:18,
          unit_font_size:18,
          col_width:80
        }
      ]
    this.OnPickerChange=this.OnPickerChange;
    this.OnConfirm=OnConfirm||(()=>{})
  }

  OnPickerChange=(picker,event_type,column_index,select_index)=>{
    if(event_type==1){
      if(column_index==0){
        this.time_picker_data.hour=this.hours[select_index];
      }
      else if(column_index==1){
        this.time_picker_data.minute=this.minutes[select_index];
      }
    }
    if(event_type==2){
      Logger.log(`H:${this.time_picker_data.hour}, M:${this.time_picker_data.minute}`);
      this.OnConfirm();
    }
  }

  Draw=()=>{
    this.Widget=hmUI.createWidget(hmUI.widget.WIDGET_PICKER,{
      title:this.title,
      subtitle:this.subtitle,
      nb_of_columns:2,
      single_wide:true,
      init_col_index:0,
      data_config:this.data_config,
      picker_cb:this.OnPickerChange
    })
  }
  Delete=()=>{
    hmUI.deleteWidget(this.Widget);
  }
}





