import "./polyfills.ts";
import { Config } from './app/configuration/config';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { AppModule } from './app/';


if (environment.production) {
  enableProdMode();
}
Config.loadInstance('http://192.168.2.33:8080/ui-configuration-service-api/configuration')
    .then(() => {
        platformBrowserDynamic().bootstrapModule(AppModule);
    })