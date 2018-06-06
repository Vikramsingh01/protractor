//import { Login } from '../login/login.page';
import { browser, protractor,element,by } from '../../node_modules/protractor';


 describe('Neo Tr LOGIN::', function() {
    beforeEach(function() {
      console.log('launching URL...........');
      //browser.driver.get('http://tr6001.poc.meganexus.com/#/login');           
    });  
    it('Verify that the user is logged in', function() {
        
        browser.driver.manage().deleteAllCookies();
        element.all(by.id('username')).get(0).sendKeys('merseyside_system_administrator');
        element(by.id('pwd')).sendKeys('MegaNexus@2028');
        element(by.css('.login-form button[type="submit"]')).click();
	//Wait for the current URL to change to welcome
    //     browser.driver.wait(function() {
    //         return browser.driver.getCurrentUrl().then(function(url) {
    //             return (/my-service-user/).test(url);
    //         });
    //     });
	// expect(browser.getCurrentUrl()).toEqual('http://tr6001.poc.meganexus.com/#/my-service-user');
    });  
});