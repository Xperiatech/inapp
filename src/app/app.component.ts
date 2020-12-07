import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { AlertController } from '@ionic/angular';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';
import { Storage } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Router } from '@angular/router';
import { ThemeableBrowser, ThemeableBrowserOptions, ThemeableBrowserObject } from '@ionic-native/themeable-browser/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {


  options: ThemeableBrowserOptions = {

    statusbar: {
        color: '#ffffffff'
    },
    toolbar: {
        height: 40,
        color: '#f0f0f0ff'
    },
    title: {
        color: '#003264ff',
        showPageTitle: false
    },
    backButton: {
        image: 'back',
        imagePressed: 'back_pressed',
        align: 'left',
        event: 'backPressed'
    },
    forwardButton: {
        image: 'forward',
        imagePressed: 'forward_pressed',
        align: 'left',
        event: 'forwardPressed'
    },
    closeButton: {
        image: 'close',
        imagePressed: 'close_pressed',
        align: 'left',
        event: 'closePressed'
    },
    customButtons: [
        {
            image: 'share',
            imagePressed: 'share_pressed',
            align: 'right',
            event: 'sharePressed'
        }
    ],

    menu: {
        image: 'menu',
        imagePressed: 'menu_pressed',
        title: 'Test',
        cancel: 'Cancel',
        align: 'right',
        items: [
            {
                event: 'helloPressed',
                label: 'Hello World!'
            },
            {
                event: 'testPressed',
                label: 'Test!'
            }
        ]
    },
    backButtonCanClose: true
};

  constructor(
    private router:Router,
    private themeableBrowser: ThemeableBrowser,
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
    this.splashScreen.show();
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
        console.log("ERROR OCCURED ***",error);
        this.initPushNotification();
        this.showView();
      });

      this.platform.backButton.subscribeWithPriority(999,()=>{
        navigator['app'].exitApp();
      })
      this.platform.backButton.subscribeWithPriority(9999,()=>{
        navigator['app'].exitApp();
      })

    });
  }

  showView() {
    let ab:InAppBrowserOptions;

    ab = {
         footer:'no',
         location:'no',
         zoom:'no'
       }
     //const browser = this.iab.create('https://emmelev.dk/app/',"_self",ab);
     const browser = this.themeableBrowser.create('https://omggamer.com/', '_self', this.options);
    // browser.show();
     browser.on('loadstart').subscribe((event)=>{
      console.log("LOADING...");
     });

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