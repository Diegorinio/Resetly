import * as hmUI from "@zos/ui";
import { log as Logger } from "@zos/utils";
import * as GameObject from "../../../assets/components/Classes";
import {COLORS} from "../../../assets/components/colors";

const logger = Logger.getLogger("helloworld");
Page({
  onInit() {
    hmUI.setStatusBarVisible(false);
    logger.debug("page onInit invoked");
  },
  build() {
    logger.debug("page build invoked");
    // hmUI.createWidget(hmUI.widget.TEXT, TEXT_STYLE);
    const text = new GameObject.Text(100,100,50,50,20,"sss",COLORS.AMBER);
    text.Draw();
  },
  onDestroy() {
    logger.debug("page onDestroy invoked");
  },
});
