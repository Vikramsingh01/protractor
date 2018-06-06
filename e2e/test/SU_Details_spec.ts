import { SUDetails } from '../page/SUDetails.po';
import { browser, protractor, element, by, promise } from '../../node_modules/protractor';

describe('SU Details operations - ', function () {
    const sd: SUDetails = new SUDetails();
browser.sleep(2000);
     it('should display the Titile of Home Page', () => {
        sd.getHomePageTitle().then(ht => {
            console.log("************Home Page Title*******" + ht);
            expect(ht).toEqual('My Service Users');
        });
    }); 
    it('going to clicking on buttons', function () {

        sd.ClickOnRecntlyViewBtn();
        sd.clickOnViewBtn();
        sd.clickOnIdentifiers();
    });

});


