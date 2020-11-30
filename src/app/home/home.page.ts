import { Component } from '@angular/core';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  url;

  ngOnInit(){
      this.storage.get("notification").then((val)=>{
        console.log("RECEIVED NOTIFICATION");
        let json = JSON.parse(val);
        this.url = json.additionalData.url;
        console.log(" NOTIFICATION",json);
        this.showNotification();
      });
  }


  constructor(private iab: InAppBrowser,
    private storage: Storage,
    private platform: Platform) {
  }

  showNotification() {
    this.platform.backButton.subscribeWithPriority(999,()=>{
      navigator['app'].exitApp();
    })
    this.platform.backButton.subscribeWithPriority(9999,()=>{
      navigator['app'].exitApp();
    })
 let ab:InAppBrowserOptions;
 ab = {
      footer:'no',
      location:'no',
      zoom:'no',
    }
  const browser = this.iab.create(this.url,"_self",ab);
  browser.show();
  browser.on('exit').subscribe(()=>{
    navigator['app'].exitApp();
  });
  }

}
