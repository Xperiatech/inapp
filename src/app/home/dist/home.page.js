"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.HomePage = void 0;
var core_1 = require("@angular/core");
var HomePage = /** @class */ (function () {
    function HomePage(iab, storage, platform) {
        this.iab = iab;
        this.storage = storage;
        this.platform = platform;
    }
    HomePage.prototype.ngOnInit = function () {
        var _this = this;
        this.storage.get("notification").then(function (val) {
            console.log("RECEIVED NOTIFICATION");
            var json = JSON.parse(val);
            _this.url = json.additionalData.url;
            console.log(" NOTIFICATION", json);
            _this.showNotification();
        });
    };
    HomePage.prototype.showNotification = function () {
        this.platform.backButton.subscribeWithPriority(999, function () {
            navigator['app'].exitApp();
        });
        this.platform.backButton.subscribeWithPriority(9999, function () {
            navigator['app'].exitApp();
        });
        var ab;
        ab = {
            footer: 'no',
            location: 'no',
            zoom: 'no'
        };
        var browser = this.iab.create(this.url, "_self", ab);
        browser.show();
        browser.on('exit').subscribe(function () {
            navigator['app'].exitApp();
        });
    };
    HomePage = __decorate([
        core_1.Component({
            selector: 'app-home',
            templateUrl: 'home.page.html',
            styleUrls: ['home.page.scss']
        })
    ], HomePage);
    return HomePage;
}());
exports.HomePage = HomePage;