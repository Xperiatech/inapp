import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { AlertController } from '@ionic/angular';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';
import { Storage } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private router:Router,
    private push: Push,
    private storage: Storage,
    public alertController: AlertController,
    private diagnostic: Diagnostic,
    private iab: InAppBrowser,
    private platform: Platform,
    private splashScreen: SplashScreen,
  ) {
    this.initializeApp();
  }

  initializeApp() {

    this.platform.ready().then(() => {
      this.diagnostic.isWifiAvailable().then((valueBooler)=>{
        console.log("RESPONSE: ",valueBooler);
        let android = this.platform.is('android');
        let ios = this.platform.is('ios');
        console.log("IS ANDROID: ", android);
        console.log("IS IOS: ", ios);
        if(android) {
          this.initPushNotification();
          if(valueBooler == 0){
          this.presentAlert();
          } else {
            this.showView();
            this.initPushNotification();
          }
        } else if(ios) {
          this.initPushNotification();
          if(valueBooler == false){
          this.presentAlert();
          } else {
            this.showView();
            this.initPushNotification();
          }
        }
      },(error)=>{
        console.log("ERROR OCCURED",error);
      });

      this.platform.backButton.subscribeWithPriority(999,()=>{
        navigator['app'].exitApp();
      })
      this.platform.backButton.subscribeWithPriority(9999,()=>{
        navigator['app'].exitApp();
      });
      this.showView();

    });
  }

  showView() {
    let ab:InAppBrowserOptions;

    ab = {
         footer:'no',
         location:'no',
         zoom:'no',
       }
     const browser = this.iab.create('https://emmelev.dk/app/',"_self",ab);
     browser.show();
     browser.on('exit').subscribe(()=>{
     navigator['app'].exitApp();
     })
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      message: 'لا يوجد انترنت .. يرجى التأكد من اتصالك بالشبكة',
      buttons: [
         {
          text: 'حسنا',
          handler: () => {
            this.diagnostic.switchToWifiSettings();
          }
        }
      ]

    });

    await alert.present();
  }

  initPushNotification(){

    if (!this.platform.is('cordova')) {
      console.warn('Push notifications not initialized. Cordova is not available - Run in physical device');
      return;
    }

    const options: PushOptions = {
      android: {
        senderID: '81410076543'
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
    pushObject.on('notification').subscribe(async (notification: any) => {
      console.log("NOTIFICATION RECEIVED", notification);
      let myNoti = JSON.stringify(notification);
      this.storage.set("notification",myNoti).then(()=>{
        this.router.navigate(['home']);
      });
    });
  }


}
