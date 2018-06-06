
import { Login } from '../page/LoginPage.po';
import { browser, protractor, element, by, promise } from '../../node_modules/protractor';
var using = require('../../node_modules/jasmine-data-provider');
import { TabsData } from '../Object';
import testData from '../login/data';

describe('Neo Tr LOGIN - ', function () {
    const lp: Login = new Login();
    lp.navigateToHome();

    var waitForURLContain = (urlExpected: string, timeout: number) => {
        try {
            const condition = browser.ExpectedConditions;
            browser.wait(condition.urlContains(urlExpected), timeout);
        } catch (e) {
            console.error('URL not found.', e);
        };
    }
    function plusprovider() {
        return [
            { username: TabsData.credentials.username1, password: TabsData.credentials.password1 },
            { username: TabsData.credentials.username2, password: TabsData.credentials.password2 }
        ];

    };

    using(plusprovider, function (data) {
        it('going to login', function () {

            browser.driver.manage().deleteAllCookies();
            lp.getLogin(data.username, data.password);

        });
    });

    it('should display the Titile of Login Page', () => {
        lp.getLoginPageTitle().then(result => {
            console.log("************Login Page Title*******" + result);
            expect(result).toEqual('Login');
        });


    });
});

