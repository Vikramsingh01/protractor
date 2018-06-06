import { browser, by, element, promise, ElementFinder, ElementArrayFinder, WebElement } from '../../node_modules/protractor';
import { ExpectedConditions } from 'protractor';
import {  } from '../Utility';


export class SUDetails {

    /*  wait(){   
      browser.wait(ExpectedConditions.visibilityOf(we), 3000, 'recently button is not visible.....')
      browser.manage().timeouts().implicitlyWait(3000);
    browser.wait(function () {
            browser.sleep(2000);
            return element(by.id('identifier1')).isDisplayed()
            .then(
                function (isDisplayed) { 
                    return isDisplayed; 
                }, 
                function (error) { 
                    return false 
                });
        }, 20 * 2000);  
    
    }  */
 
    getHomePageTitle() {
        browser.sleep(3000);
        return browser.getTitle();

    }

    ClickOnRecntlyViewBtn() {
        var rvBtn = element(by.xpath("//button[text()='Recently Viewed']"));
         rvBtn.isDisplayed().then(identifier=>{
            rvBtn.click();
        });
       
    }
    clickOnViewBtn() {
       var vBtn= element(by.xpath("(//span[@class='glyphicon glyphicon-search'])[1]"));
        vBtn.click();
    }
    
     clickOnIdentifiers() {
        var idBtn=element(by.xpath("//button[text()='Identifiers']"));
            idBtn.click();
    } 
    ClickOnAIAddBtn(){
        var AIAddBtn = element(by.xpath("(//span[@class='glyphicon glyphicon-plus'])[2]"));
        AIAddBtn.click();
    }

    SelectIdentifierType(){
       // let sw:Utility = new Utility();
        //sw.selectDropdownbyNum();
    }
}