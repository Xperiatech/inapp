import { Component } from '@angular/core';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  url;

  ngOnInit(){
    this.initPushNotification();
      this.storage.get("notification").then((val)=>{
        console.log("RECEIVED NOTIFICATION");
        if(val != null){
        let json = JSON.parse(val);
        this.url = json.additionalData.url;
        console.log(" NOTIFICATION",json);
        if(json != null) {
        this.showNotification();
        }
      }
      });
  }


  constructor(private iab: InAppBrowser,
    private storage: Storage,
    private push: Push,
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

  initPushNotification(){

    if (!this.platform.is('cordova')) {
      console.warn('Push notifications not initialized. Cordova is not available - Run in physical device');
      return;
    }

    const options: PushOptions = {
      android: {
        senderID: '662602915786'
      },
      ios: {
        alert: 'true',
        badge: false,
        sound: 'true'
      },
      windows: {}
    };

    const pushObject: PushObject = this.push.init(options);

    pushObject.on('registration').subscribe(async (data: any) => {

      console.log('device token APP COMPONENT -> ' + data.registrationId);
      this.storage.set('deviceId APP COMPONENT',data.registrationId);
    });

    pushObject.on('error').subscribe(error => alert('Error with Push plugin' + error));
    /*pushObject.on('notification').subscribe(async (notification: any) => {
      console.log("NOTIFICATION RECEIVED", notification);
      let myNoti = JSON.stringify(notification);
      this.storage.set("notification",myNoti).then(()=>{
        this.router.navigate(['home']);
      });
    });*/
  }

}
