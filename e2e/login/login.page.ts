// import { browser, by, element, promise, ElementFinder, ElementArrayFinder } from 'protractor';

// export class Login {

// 	/* Navigational methods */
// 	navigateToHome():promise.Promise<any> {
// 	console.log("launching chrome browser......");
//     	return browser.driver.get('http://tr6001.poc.meganexus.com/#/login');
		
//   	}

//   	navigateToContact():promise.Promise<any>  {
//   		return browser.get('/Forgot Password?');
//   	}

//   	/* data for login to app */

// 	getLogin(): any {
// 		let credentials: any = { Username: "merseyside_system_administrator",Password: "MegaNexus@2028"}
//   		return credentials;
// 	}

// 	getLoginPageTitle():ElementFinder {
// 		return element(by.css(".form-signin-heading"));
// 	}

//     getLoginPageHeading(): promise.Promise<string> {
// 		return this.getLoginPageTitle().element(by.css("h2")).getText();
// 	}
// }