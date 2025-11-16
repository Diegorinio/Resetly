import * as hmUI from "@zos/ui";
import { Keyboard } from "../../../assets/components/Restartly";
import { DEVICE_HEIGHT, DEVICE_WIDTH } from "./index.page.s.layout";

Page({
  onInit() {
    // opcjonalnie ukryj status bar
    hmUI.setStatusBarVisible(false);
  },
  build() {
    // tworzymy instancję klawiatury
    this.kb = new Keyboard({
      x: 0,
      y: 100,
      onChange: (txt) => {
        console.log("Wpisywane: " + txt);
      },
      onSubmit: (txt) => {
        console.log("Zatwierdzono: " + txt);
        // Wracamy do głównego widoku po zatwierdzeniu
        hmApp.gotoPage({ url: "/pages/main/index" });
      }
    });

    this.kb.build(); // rysujemy widgety na ekranie
  }
});
