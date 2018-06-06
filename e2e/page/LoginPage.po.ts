import { browser, by, element, promise, ElementFinder, ElementArrayFinder } from '../../node_modules/protractor';
import { TabsData } from '../Object';
var using =require('../../node_modules/jasmine-data-provider');

export class Login {


	/* Navigational methods */
	navigateToHome(): promise.Promise<any> {
		console.log("launching chrome browser and URL......");
		return browser.get(TabsData.testURL)

	}

	navigateToContact(): promise.Promise<any> {
		return browser.get('/Forgot Password?');
	}

	/* data for login to app */

	getLogin(user:string,pass:string): any {

		element.all(by.id('email')).clear();
		element.all(by.id('email')).sendKeys(user);
		console.log("**************^^^^^^^^^^"+user);
		element(by.id('pwd')).clear();
		element(by.id('pwd')).sendKeys(pass);
		console.log("**********************"+pass);
		element(by.css('.btn.btn-default.btn-warning.mb10.col-sm-12.nopadleft.nopadright')).click();


	}

	getLoginPageTitle() {
		// var contentPromise = driver.getPageSource();

		return browser.getTitle();
	}


}