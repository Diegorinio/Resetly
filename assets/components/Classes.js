import * as hmUI from "@zos/ui";
import { DEVICE_HEIGHT, DEVICE_WIDTH } from "../../page/gt/home/index.page.r.layout";
import { SystemTimer } from '@zos/timer';
import { log, log as Logger } from "@zos/utils";
const logger = Logger.getLogger("helloworld");

export const COLORS={DEFAULT:0xFFC0CB,WHITE:0xffffff,BLACK:0x000000,RED:0xff0000,BLUE:0x0000ff,GREEN:0x46923c,YELLOW:0xedea35,LIGHT_BLUE:0x2ed2c7,ORANGE:0xe78516};

export class GameObject {
  constructor(x=0,y=0,width=10,height=10){
    this.x=x;
    this.y=y;
    this.width=width;
    this.height=height;
    this.widget=null;
    this.visible=true;
    this.Active=true;
    this.Widgets=[];
  }

  static FromProps(props){
    return new GameObject(props.x,hmUI.props.y,props.width,props.height);
  }

  GetPosition() {
    return {x:this.x,y:this.y}
  }
  GetPositionX() {
    return this.x;
  }
  GetPositionY() {
    return this.y;
  }
  SetPosition(x,y) {
    this.x=x;
    this.y=y;
    if (this.widget) this.widget.setProperty(hmUI.prop.MORE, {x:this.x,y:this.y});
  }
  SetPositionX(x) {
    this.x=x;
    if (this.widget) this.widget.setProperty(hmUI.prop.MORE, {x:this.x,y:this.y});
  }
  SetPositionY(y) {
    this.y=y;
    if (this.widget) this.widget.setProperty(hmUI.prop.MORE, {x:this.x,y:this.y});
  }
  GetSize() {
    return {w:this.width, h:this.height}
  }
  Delete(){
    if(this.widget){
      hmUI.deleteWidget(this.widget);
      this.widget=null;
    }
  }
  GetWidth() {
    return this.width;
  }
  SetWidth(width) {
    this.width=width;
    if (this.widget) this.widget.setProperty(hmUI.prop.W, this.width);
  }
  GetHeight() {
    return this.height;
  }
  SetHeight(height) {
    this.height=height;
    if (this.widget) this.widget.setProperty(hmUI.prop.H, this.height);
  }
  GetColor() {
    return this.color;
  }
  SetColor(color) {
    this.color=color;
    this.Draw();
  }
  Draw() {
    if(this.widget&&this.Active){
        hmUI.deleteWidget(this.widget);
        this.widget = null;
    }
  }

  GetParams = ()=>{
    return{
      x:this.x,
      y:this.y,
      w:this.width,
      h:this.height
    }
  }

  Destroy() {
    if(this.widget){
      hmUI.deleteWidget(this.widget);
      this.widget = null;
    }
  }
  SetVisible(state) {
      this.visible=state;
      if (this.widget) this.widget.setProperty(hmUI.prop.VISIBLE,this.visible);
      this.Active=state;
  }
}


export class GameObjectRect extends GameObject {
    constructor(x, y, width, height, color=COLORS.DEFAULT) {
        super(x, y, width, height);
        this.color = color;
        this.widgetType=hmUI.widget.FILL_RECT;
    }

    static FromProps(props) {
        return new GameObjectRect(
            props.x ?? 0,
            props.y ?? 0,
            props.width ?? 10,
            props.height ?? 10,
            props.color ?? 0xFFC0CB
        );
    }

    GetParams=()=>{
    return {x:this.x,y:this.y,w:this.width,h:this.height,color:this.color};
    }
    Draw() {
        super.Draw();
        this.widget = hmUI.createWidget(this.widgetType, {
            x: this.x,
            y: this.y,
            w: this.width,
            h: this.height,
            color: this.color,
        });
        if(this.OnclickWidget){
          this.OnclickWidget.Draw();
        }
        this.SetVisible(this.visible);
    }

    // Nie powinienem tego robić ale chuj
  AddOnClickEvent = (e,debug=false)=>{
    this.OnclickWidget=new ImageButton(this.x,this.y,this.width,this.height,"",null,"images/transparent.png",null,e,debug,0,0);
  }
  SetVisible = (state)=>{
    super.SetVisible(state);
    if(this.OnclickWidget){
      this.OnclickWidget.enabled=state;
    }
  }
}



export class Rect extends GameObjectRect{
  constructor(x,y,width,height,color=COLORS.DEFAULT,radius=12,alpha=255){
    super(x,y,width,height,color);
    this.radius=radius;
    this.alpha=alpha;
  }
  GetParams=()=>{
    return {x:this.x,y:this.y,w:this.width,h:this.height,color:this.color,radius:this.radius,alpha:this.alpha};
  }

  Draw =()=>{
    super.Draw();
    this.widget = hmUI.createWidget(this.widgetType, {
            x: this.x,
            y: this.y,
            w: this.width,
            h: this.height,
            color: this.color,
            radius:this.radius,
            alpha:this.alpha
        });
        if(this.OnclickWidget){
          this.OnclickWidget.Draw();
        }
        this.SetVisible(this.visible);
  }
  // Nie powinienem tego robić ale chuj
  AddOnClickEvent = (e,debug=false)=>{
    this.OnclickWidget=new ImageButton(this.x,this.y,this.width,this.height,"",null,"images/transparent.png",null,e,debug,0,0);
  }
  SetVisible = (state)=>{
    super.SetVisible(state);
    if(this.OnclickWidget){
      this.OnclickWidget.enabled=state;
    }
  }
}

export class Text extends GameObjectRect {
    constructor(x, y, width, height, t_size, text, color = COLORS.WHITE, align_v=hmUI.align.CENTER_V,align_h=hmUI.align.CENTER_H) {
        super(x, y, width, height, color);
        this.t_size = t_size;
        this.text = text;
        this.align_v=align_v?align_v:hmUI.align.CENTER_V;
        this.align_h=align_h?align_h:hmUI.align.LEFT;
        this.widgetType=hmUI.widget.TEXT;
    }

    static FromProps(props) {
        return new Text(
            props.x ?? 0,
            props.y ?? 0,
            props.width ?? 100,
            props.height ?? 40,
            props.t_size ?? 20,
            props.text ?? "",
            props.color ?? 0x000000
        );
    }
    SetText = (txt)=>{
        this.text=txt;
        this.widget.setProperty(hmUI.prop.TEXT,this.text);
    }

    GetParams=()=>{
    return {x: this.x,
            y: this.y,
            w: this.width,
            h: this.height,
            color: this.color,
            text_size: this.t_size,
            text: this.text,
            align_h:this.align_h,
            align_v:this.align_v
          };
    }
    Draw = () => {
        if(this.widget){
            hmUI.deleteWidget(this.widget);
            this.widget=null;
        }
        this.widget = hmUI.createWidget(this.widgetType, {
            x: this.x,
            y: this.y,
            w: this.width,
            h: this.height,
            color: this.color,
            text_size: this.t_size,
            text: this.text,
            align_h:this.align_h,
            align_v:this.align_v
        });
    }
}



export class Button extends GameObject {
    constructor(x,y,width,height,text,t_color,bg_color_n,bg_color_p=null,onclick=()=>{},radius=12,disabledColor=0xffffff,text_size=15,long_press=()=>{}){
        super(x,y,width,height);
        this.text=text;
        this.color=t_color;
        this.bg_color_n=bg_color_n;
        this.bg_color_p=bg_color_p || this.bg_color_n;
        this.onclick=onclick;
        this.radius=radius;
        this.enabled=true;
        this.disabledColor=disabledColor;
        this.text_color=this.text_color;
        this.text_size=text_size;
        this.onLongPress=long_press;
        this.widgetType=hmUI.widget.BUTTON;
    }
    SetText(text) {
        this.text=text;
        if (this.widget) this.widget.setProperty(hmUI.prop.TEXT,this.text);
    }

    SetEnable(state) {
      if(this.Active){
        this.enabled=state;
        this.Draw();
      }
        // this.widget=this.widget;
    }
    SetBgColorNormal(color) {
        this.bg_color_n=color;
        // this.Draw();
    }

    SetColor(color){
      this.bg_color_n=color;
      this.bg_color_p=color;
    }
    AddOnClickEvent(event) {
        this.onclick=event;
        if (this.widget) {
            hmUI.deleteWidget(this.widget);
            this.widget = null;
        }
        this.Draw();
    }

    AddOnLongPressEvent(event){
      this.onLongPress=event;
      if(this.widget){
        hmUI.deleteWidget(this.widget);
        this.widget=null;
      }
      this.Draw();
    }

    GetParams = () =>{
      return {
        x:this.x,
            y:this.y,
            w:this.width,
            h:this.height,
            color:this.color,
            normal_color:this.enabled ? this.bg_color_n:this.disabledColor,
            press_color: this.enabled ? this.bg_color_p:this.disabledColor,
            radius:this.radius,
            text:this.text,
            text_size:this.text_size,
            longpress_func:this.onLongPress,
            click_func:this.enabled ? this.onclick: ()=>{}
      }
    }
    Draw() {
        super.Draw();
        this.widget=hmUI.createWidget(this.widgetType,this.GetParams());
        this.SetVisible(this.visible);
    }
}

export class ImageButton extends GameObject{
  constructor(x,y,width,height,text,t_color,bg_src="images/transparent.png",bg_src_p=null,onclick=()=>{},debug=false,radius=12,text_size=0,auto_scale=true){
    super(x,y,width,height);
    this.text=text;
    this.color=t_color;
    this.debug=debug
    if(this.debug){
      this.normal_src="images/player.png"
    }
    else{
      this.normal_src=bg_src;
    }
    this.press_src=bg_src_p?bg_src_p:this.normal_src;
    this.onclick=onclick;
    this.radius=radius;
    this.enabled=true;
    this.disabledColor=disabledColor;
    this.text_size=text_size;
    this.auto_scale=auto_scale;
    this.widgetType=hmUI.widget.BUTTON;
  }

  SetText(text) {
        this.text=text;
        if (this.widget) this.widget.setProperty(hmUI.prop.TEXT,this.text);
    }


    SetEnable(state) {
      if(this.Active){
        this.enabled=state;
        this.Draw();
      }
        // this.widget=this.widget;
    }
    AddOnClickEvent(event) {
        this.onclick=event;
        if (this.widget) {
            hmUI.deleteWidget(this.widget);
            this.widget = null;
        }
        this.Draw();
    }

    GetParams = () =>{
      return {
        x:this.x,
            y:this.y,
            w:this.width,
            h:this.height,
            color:this.color,
            normal_src:this.enabled ? this.normal_src:"images/player.png",
            press_src: this.enabled ? this.press_src:"images/player.png",
            radius:this.radius,
            text:this.text,
            text_size:this.text_size,
            auto_scale:this.auto_scale,
            click_func:this.enabled ? this.onclick: ()=>{}
      }
    }
    Draw() {
        super.Draw();
        this.widget=hmUI.createWidget(this.widgetType,this.GetParams());
        this.SetVisible(this.visible);
    }
}

export class Image extends GameObject{
    constructor(x,y,src,width=null,height=null,visible=true,alpha=255,auto_scale=false){
        super(x,y,width,height);
        this.src=src;
        this.visible=visible;
        this.widget=null;
        this.alpha=alpha;
        this.auto_scale=auto_scale;
        this.widgetType=hmUI.widget.IMG;
    }
    static FromProps(props) {
        return new Image(
            props.x ?? 0,
            props.y ?? 0,
            props.src ?? "",
            props.width ?? null,
            props.height ?? null,
            props.visible ?? true
        );
    }

    SetSrc = (src)=>{
        this.src=src;
        this.widget.setProperty(hmUI.prop.IMG_SRC, this.src);
        this.Draw();
    }

    GetParams = ()=>{
      return {
        x:this.x,
        y:this.y,
        w:this.width,
        h:this.height,
        alpha:this.alpha,
        auto_scale:this.auto_scale,
        src:this.src
      }
    }

    Draw = ()=>{
        if(this.widget){
            hmUI.deleteWidget(this.widget);
        }
        this.widget=hmUI.createWidget(this.widgetType, {
            x:this.x,
            y:this.y,
            w:this.width,
            h:this.height,
            alpha:this.alpha,
            auto_scale:this.auto_scale,
            src:this.src
        })
        if(this.OnclickWidget){
          this.OnclickWidget.Draw();
        }
    }

    AddOnClickEvent=(e,debug=false)=>{
      this.OnclickWidget=new ImageButton(this.x,this.y,this.width,this.height,"",COLORS.DEFAULT,"images/transparent.png",null,e,debug,12,12);
      this.Widgets.push(this.OnclickWidget);
    }
}

export class AnimatedImage extends Image{
  constructor(x,y,src=null,width=null,height=null,frames_path,frames_count,delay=200,loop=true,visible=true){
    super(x,y,src,width,height,visible);
    this.framesCount=frames_count;
    this.frames_path=this.GenerateFramesPaths(frames_path,frames_count);
    this.delay=delay;
    this.loop=loop;
    this.intervalId=null;
    this.currentFrame=0;
    this.currentFramePath=this.frames_path[0];
    this.isRunning=false;
    this.intervalId=null;
  }

  GenerateFramesPaths = (base, count)=>{
    const paths=[];
    for(let i=0;i<count;i++){
      paths.push(`${base}${i}.png`);
    }
    return paths;
  }

  Start = () =>{
    if(this.isRunning || this.frames_path.length===0){
      return;
    }
    this.isRunning=true;
    this.currentFrame=0;
    this.intervalId=setInterval(()=>{
      this.currentFrame++;
      this.currentFramePath=this.frames_path[this.currentFrame];
      if(this.currentFrame>=this.frames_path.length){
        if(this.loop){
          this.currentFrame=0;
          this.currentFramePath=this.frames_path[0];
        }
        else{
          return;
        }
      }
      this.Draw();
    }, this.delay);
  }


  GetParams = ()=>{
    return {
      x:this.x,
      y:this.y,
      w:this.width,
      h:this.height,
      src:this.src
    }
  }
  Draw =()=>{
    this.src=this.currentFramePath;
    if(this.widget){
            hmUI.deleteWidget(this.widget);
        }
        this.widget=hmUI.createWidget(this.widgetType, {
            x:this.x,
            y:this.y,
            w:this.width,
            h:this.height,
            src:this.src
          })
  }
  
}

export class ImageAnimation extends GameObject{
  constructor(x,y,anim_path,anim_prefix,anim_ext,anim_fps,anim_size,loop=true,anim_status=1){
    super(x,y,64,64)
    this.anim_path=anim_path;
    this.anim_prefix=anim_prefix;
    this.anim_ext=anim_ext;
    this.anim_fps=anim_fps;
    this.repeat=!loop
    this.anim_size=anim_size;
    this.anim_status=anim_status;
    this.widget=null;
    this.widgetType=hmUI.widget.IMG_ANIM;
  }

  Start = () =>{
    this.widget.setProperty(hmUI.prop.ANIM_STATUS, hmUI.anim_status.START);
    const isRunning=this.widget.getProperty(hmUI.widget.ANIM_IS_RUNNING);
    if(!isRunning){
      this.widget.setProperty(hmUI.prop.ANIM_STATUS, hmUI.anim_status.START);
    }
  }

  Stop = () =>{
    this.widget.setProperty(hmUI.prop.ANIM_STATUS, hmUI.anim_status.STOP);
  }

  GetParams = ()=>{
    return{
      anim_path: this.anim_path,
      anim_prefix: this.anim_prefix,
      anim_ext: this.anim_ext,
      anim_fps: this.anim_fps,
      anim_size: this.anim_size,
      repeat_count:this.loop?1:0,
      anim_status: this.anim_status,
      x: this.x,
      y: this.y,
    }
  }
  Draw=()=>{
    this.widget=hmUI.createWidget(this.widgetType,{
      anim_path: this.anim_path,
      anim_prefix: this.anim_prefix,
      anim_ext: this.anim_ext,
      anim_fps: this.anim_fps,
      anim_size: this.anim_size,
      repeat_count:this.loop?1:0,
      anim_status: this.anim_status,
      x: this.x,
      y: this.y,
    })
  }
}

export class LabelImage extends Image {
  constructor(
    x, y, src,
    width = 40, height = 40,
    text="",
    text_color = COLORS.WHITE,
    text_x = null, text_y = null,
    text_width = null, text_height = null,
    text_size = null,
    visible = true
  ) {
    super(x, y, src, width, height, visible);

    this.text = text;
    this.text_color = text_color;

    this.text_x = (text_x !== null && text_x !== undefined) ? text_x : (x + width);
    this.text_y = (text_y !== null && text_y !== undefined) ? text_y : y-1;
    this.text_width = (text_width !== null && text_width !== undefined) ? text_width : width*2.5;
    this.text_height = (text_height !== null && text_height !== undefined) ? text_height : height;
    this.text_size = (text_size !== null && text_size !== undefined) ? text_size : Math.floor(height /1.5);

    this.textWidget = new Text(
      this.text_x,
      this.text_y,
      this.text_width,
      this.text_height,
      this.text_size,
      this.text,
      this.text_color,
      hmUI.align.CENTER_V,
      hmUI.align.LEFT
    );
    this.Widgets=[this.textWidget];
  }

  GetTotalWidth = ()=>{
    return (this.x+this.width)+(this.text_width);
  }
  GetParams = ()=>{
    return{
      x: this.x,
      y: this.y,
      w: this.width,
      h: this.height,
      src: this.src
    }
  }

  SetText = (txt)=>{
        this.text=txt;
        this.textWidget.SetText(this.text);
        this.Draw();
    }

  Draw = () => {
    if (!this.widget) {
      this.widget = hmUI.createWidget(this.widgetType, {
        x: this.x,
        y: this.y,
        w: this.width,
        h: this.height,
        src: this.src
      });
    }
    this.Widgets.forEach(el=>{
      el.Draw();
    })
  }
}




export class ProgressBar extends GameObjectRect{
  constructor(x,y,width,height,color, duration,onFinish=null, text=null,tickTime=100){
    super(x,y,width,height,color);
    this.duration=duration;
    this.tickTime=tickTime;
    this.onFinish=onFinish;
    this.progressWidth=0;
    this.intervalId=null;
    this.maxWidth=this.width;
    this.text=text
    this.Widgets=[];
    if(this.text){
      this.textWidget=new Text(this.x,this.y,this.maxWidth,this.height,this.height/2,this.text);
      this.widgets.push(this.textWidget);
    }
  }

  Start = ()=>{
    const steps=this.duration/this.tickTime;
    const increase=this.maxWidth/steps;
    this.progressWidth=0;
    this.intervalId = setInterval(()=>{
      this.progressWidth+=increase;
      if(this.progressWidth>=this.maxWidth){
        this.progressWidth=this.maxWidth;
        this.SetWidth(this.progressWidth);
        clearInterval(this.intervalId);
        this.intervalId=null;
        this.onFinish();
      }
      else{
        this.SetWidth(Math.floor(this.progressWidth));
      }
    }, this.tickTime);
    this.Draw();
  }

  Stop = () =>{
    if(this.intervalId){
      clearInterval(this.intervalId);
      this.intervalId=null;
    }
  }
  Reset = () =>{
    this.Stop();
    this.progressWidth=0;
    this.SetWidth(0);
  }
  Draw = () =>{
    super.Draw();
    this.SetWidth(this.progressWidth);
    if(this.textWidget && this.widgets.length>0){
      this.textWidget.Draw();
    }
  }
}

export class HContainer extends GameObject{
  constructor(x,y,width,height,widgets=[], spacing=0){
    super(x,y,width,height);
    this.Widgets=widgets;
    this.spacing=spacing;
    if(this.Widgets.length>0){
      this.SetWidgets();
    }
  }

  AddWidget = (el)=>{
    this.Widgets.push(el);
    this.Draw();
  }

  SetWidgets = ()=>{
    const totalSpacing = this.spacing * (this.Widgets.length - 1);
    const widthPerWidget = (this.width - totalSpacing) / this.Widgets.length;

    for (let i = 0; i < this.Widgets.length; i++) {
      const el=this.Widgets[i];
      const posX=this.x+i*(widthPerWidget + this.spacing);
      el.SetPositionX(posX);
      el.SetPositionY(this.y);
      el.SetWidth(widthPerWidget);
      el.SetHeight(this.height);
    }
  }


  Draw = ()=>{
    this.SetWidgets();
    this.Widgets.forEach(el=>{
      el.Draw();
    })
  }
}

export class VContainer extends GameObject{
  constructor(x,y,width,height,widgets=[], spacing=0){
    super(x,y,width,height);
    this.Widgets=widgets;
    this.spacing=spacing;
    if(this.Widgets.length>0){
      this.SetWidgets();
    }
  }

  AddWidget=(el)=>{
    this.Widgets.push(el);
    this.Draw();
  }

  SetWidgets = ()=>{
    const totalSpacing=this.spacing*(this.Widgets.length-1);
    const heightPerWidget=(this.height-totalSpacing)/this.Widgets.length;
    for (let i = 0; i < this.Widgets.length; i++) {
      const el=this.Widgets[i];
      const posY=this.y+i*(heightPerWidget+this.spacing);
      el.SetPositionX(this.x);
      el.SetPositionY(posY);
      el.SetWidth(this.width);
      el.SetHeight(heightPerWidget);
    }
  }

  Draw = () =>{
    this.SetWidgets();
    this.Widgets.forEach(el=>{
      el.Draw();
    })
  }
}

//When creating elemnet for viewContainer set in relative positions to Container
export class ViewContainer extends GameObject{
  constructor(x=0,y=0,width=DEVICE_WIDTH,height=DEVICE_HEIGHT,widgets=[],scroll_enable=true,z_index=1){
    super(x,y,width,height);
    this.Widgets=widgets;
    this.scroll_enable=scroll_enable===true?1:0;
    this.z_index=z_index
    this.widget=hmUI.createWidget(hmUI.widget.VIEW_CONTAINER,{
      x:this.x,
      y:this.y,
      w:this.width,
      h:this.height,
      scroll_enable:this.scroll_enable,
      z_index:this.z_index
    })
    this.widgetType=hmUI.widget.VIEW_CONTAINER;
  }

  GetParams = ()=>{
    return{
      x:this.x,
      y:this.y,
      w:this.width,
      h:this.height,
      scroll_enable:this.scroll_enable,
      z_index:this.z_index
    }
  }

  AddWidget = (w)=>{
    this.Widgets.push(w);
    // this.InitializeWidgets();
  }
  AddWidgets = (w=[])=>{
    this.Widgets.push(...w);
    // this.InitializeWidgets();
  }

  InitializeWidgets = ()=>{
    hmUI.deleteWidget(this.widget);
    this.widget=hmUI.createWidget(this.widgetType,this.GetParams());
    this.Widgets.forEach(el=>{
      el.widget=this.widget.createWidget(el.widgetType,el.GetParams());
      el.Draw = ()=>{
        hmUI.deleteWidget(el.widget);
        el.widget=this.widget.createWidget(el.widgetType,el.GetParams());
      }
    })
  }

  AddScrollSpacer = (amount=1)=>{
    for(let x=0;x<amount;x++){
      const lastElement=this.Widgets[this.Widgets.length-1];
      const lastElementY=lastElement.y+lastElement.height*5;
      const spacer=new Rect(lastElement.x,lastElementY,lastElement.width,lastElement.height,COLORS.WHITE,12,0);
      this.Widgets.push(spacer);
    }
  }
}

export class Arc extends GameObject{
  constructor(x,y,width,height,start_angle=0,end_angle=0,line_width=0,color=COLORS.BLUE){
    super(x,y,width,height);
    this.radius=radius;
    this.start_angle=start_angle;
    this.end_angle=end_angle;
    this.line_width=line_width;
    this.color=color;
    this.widgetType=hmUI.widget.ARC;
  }

  GetParams = ()=>{
    return{
      x:this.x,
      y:this.y,
      w:this.width,
      h:this.height,
      radius:this.radius,
      start_angle:this.start_angle,
      end_angle:this.end_angle,
      line_width:this.line_width,
      color:this.color
    }
  }

  SetStartAngle = (angle)=>{
    this.start_angle=angle;
    this.Draw();
  }
  SetEndAngle = (angle)=>{
    this.end_angle=angle;
    this.Draw();
  }
  Draw = ()=>{
    super.Draw();
    if(this.widget){
      hmUI.deleteWidget(this.widget);
      this.widget=null;
    }
    this.widget=hmUI.createWidget(this.widgetType,this.GetParams());
  }
}