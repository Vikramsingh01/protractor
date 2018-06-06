import { browser, by, element, promise, ElementFinder, ElementArrayFinder, WebElement } from '../node_modules/protractor';


export class SelectWrapper{

     selectDropdownbyNum = function ( element, optionNum ) {
        if (optionNum){
          var options = element.findElements(by.tagName('option'))   
            .then(function(options){
              options[optionNum].click();
            });
        }
    }};
 