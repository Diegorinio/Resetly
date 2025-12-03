import * as hmUI from "@zos/ui";
import {Time} from "@zos/sensor";
import { log, log as Logger } from "@zos/utils";
import * as hmRoute from "@zos/router";
import { Keyboard, TimePicker} from "../../../assets/components/Restartly";
import { DEVICE_HEIGHT, DEVICE_WIDTH } from "./index.page.s.layout";
import * as GameObject from "../../../assets/components/Classes";
import { COLORS } from "../../../assets/components/colors";
import * as RTLY from "../../../assets/components/Restartly";
import { createModal, MODAL_CONFIRM, showToast} from "@zos/interaction";
Page({
    style:{
    titleBar:false
  },
  onInit(params) {
    hmUI.setStatusBarVisible(false);
  },
  build() {
  }
});