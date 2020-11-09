import { Component } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private iab: InAppBrowser) {
    const browser = this.iab.create('https://mybrowser-search.com/search?q=inapp%20capacitor&ac=1468047342');
    browser.show();
  }

}
