import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private iab: InAppBrowser,
    private platform: Platform
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
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
    const browser = this.iab.create('https://langlabtexas.com/',"_self",ab);
    browser.show();
    browser.on('exit').subscribe(()=>{
      navigator['app'].exitApp();
    })
    });
  }
}
