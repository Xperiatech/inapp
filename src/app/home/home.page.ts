import { Component } from '@angular/core';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  helpUrl= "https://www.google.com";
   url = this.helpUrl.replace("watch?v=", "v/");

  constructor(private iab: InAppBrowser,
    private sanitizer: DomSanitizer) {
   let ab:InAppBrowserOptions;
   ab = {
        footer:'no',
        location:'no',
        zoom:'no',

      }
    const browser = this.iab.create('https://www.k2.com.pk/',"_self",ab);
    browser.show();

  }
}
