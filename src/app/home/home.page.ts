import { Component } from '@angular/core';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {


  ngOnInit(){
    console.log("INSIDE APP");

  }

  helpUrl= "https://www.google.com";
   url = this.helpUrl.replace("watch?v=", "v/");

  constructor(private iab: InAppBrowser,
    private platform: Platform,) {
      this.platform.backButton.subscribeWithPriority(9999,()=>{
        navigator['app'].exitApp();
      })
   let ab:InAppBrowserOptions;
   ab = {
        footer:'no',
        location:'no',
        zoom:'no',
      }
    const browser = this.iab.create('https://thepetproject.in/',"_self",ab);
    browser.show();
    browser.on('exit').subscribe(()=>{
      navigator['app'].exitApp();
    })
  }
}
