import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl } from "@angular/forms";
import { Config } from '../../configuration/config';

import { Utility } from '../../shared/utility';

@Injectable()
export class ValidationService {

    static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
        let config = {
            'required': 'Required field ',
            'invalidCreditCard': 'Is invalid credit card number',
            'invalidEmailAddress': 'Invalid email address',
            'invalidPassword': 'Password must contain at least 8 characters, including upper/lowercase, special character and number.Old password cannot be re-used.',
            'minlength': `Minimum length ${validatorValue.requiredLength}`,
            'maxlength': `Maximum length exceeded`,
            'pattern': 'Invalid text',
            'invalidDate': 'Invalid date format',
            'invalidTime': 'Invalid time format',
            'invalidName': `Invalid value`,
            'invalidValue': `Invalid value`,
            'invalidNumber': `Invalid Number`,
            'invalidLength': `The length as entered should be less than or equal to 6`,
            'maxValue': `Value cannot should be greater than ${validatorValue.max}`,
            'minValue': `Value should be greater than ${validatorValue.min}`,
            'dateBefore': `Please select today or future date`,
            'dateBeforeGeneric': `Please select date after ${validatorValue.date}`
        };

        return config[validatorName];
    }

    static getServerValidatorErrorMessage(validatorName: string, validatorValue?: any) {
        let config = {
            'required': 'Required',
            'invalidCreditCard': 'Is invalid credit card number',
            'invalidEmailAddress': 'Invalid email address',
            'invalidPassword': 'Invalid password. Password must be at least 6 characters long, and contain a number.',
            'minlength': `Minimum length ${validatorValue.requiredLength}`,
            'maxlength': `Maximum length ${validatorValue.requiredLength}`,
            'pattern': 'Invalid text',
            'invalidDate': 'Invalid Date format'
        };

        return config[validatorName];
    }

    static dateValidator(control) {
        if (control.value == null  || control.value == "" ) {
            return null;
        } else if(!control.value.match(/^(0?[1-9]|[12][0-9]|3[01])[\/](0?[1-9]|1[012])[\/]\d{4}$/)) {
            return { 'invalidDate': true };
        }
    }
    static timeValidator(control) {
        if (control.value == null  || control.value == "" ) {
            return null;
        } else if(!control.value.match(/^(?:2[0-3]|[0-1][0-9]):[0-5][0-9]$/)) {
            return { 'invalidTime': true };
        }

    }
    static MobileNumberTextValidator(control) {
        if (control.value == null  || control.value == "" ) {
            return null;
        } else if(!control.value.match(/^([0-9\s\s]*)$/)) {
            return { 'invalidValue': true };
        }

    }

    static MobileNumberDigitValidator(control) {
        if (control.value == null  || control.value == "" ) {
            return null;
        } else if(!control.value.match(/^([0][7][0-9\s\s]*)$/)) {
            return { 'invalidNumber': true };
        }
    }
     static lengthValidator(control) {
        if (control.value == null  || control.value == "" ) {
            return null;
        } else if(!control.value.match(/^0?[1-6]$/)) {
            return { 'invalidLength': true };
        }
    }
    static NumberValidator(control) {
        if (control.value == null  || control.value == "" ) {
            return null;
        } else if(!control.value.toString().match(/^([0-9]*)$/)) {
            return { 'invalidNumber': true };
        }
    }

    static DecimalNumberValidator(control) {
        if (control.value == null  || control.value == "" ) {
            return null;
        } else if(!control.value.toString().match(/^([\d]{0,8})(?:\.\d{1,2})?$/)) {
            return { 'invalidNumber': true };
        }
    }


    static TelephoneNumberTextValidator(control) {
        if (control.value == null  || control.value == "" ) {
            return null;
        } else if(!control.value.match(/^([0-9\s\s]*)$/)) {
            return { 'invalidValue': true };
        }

    }

  static MaxValue(max: Number): ValidatorFn {
       return (control: AbstractControl): {[key: string]: any} => {
            const input = control.value,isValid = parseInt(input) < max;
            if (control.value == null  || control.value == "" ) {
                return null;
            }else if(!isValid){
                return { 'maxValue': {max} };
            }
            else{
                return null;
            }
        };
    }
    static MinValue(min: Number): ValidatorFn {
       return (control: AbstractControl): {[key: string]: any} => {
            const input = control.value,isValid = parseInt(input) > min;
            if (control.value == null  || control.value == "" ) {
                return null;
            }else if(!isValid){
                return { 'minValue': {min} };
            }
            else{
                return null;
            }
        };
    }
    static nameValidator(label): ValidatorFn {
        // if (control.value == null  || control.value == "" ) {
        //     return null;
        // } else if(!control.value.match(/^([a-zA-Z-']*)$/)) {
        //     return {"invalidName": {"label": label};
        // }else{
        //     return null;
        // }
        return (control: AbstractControl): {[key: string]: any} => {

            if (control.value == null  || control.value == "") return null;
            var v: string = control.value;
            if(!control.value.match(/^([a-zA-Z-'0-9]*)$/)) {
             return {"invalidName": {"label": label}};
            }else{
                return null;
            }
        };
    }
    static creditCardValidator(control) {
        // Visa, MasterCard, American Express, Diners Club, Discover, JCB
        if (control.value.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/)) {
            return null;
        } else {
            return { 'invalidCreditCard': true };
        }
    }

    static emailValidator(control) {
        // RFC 2822 compliant regex
        if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
            return null;
        } else {
            return { 'invalidEmailAddress': true };
        }
    }

    static passwordValidator(control) {
      let config = Config.getInstance();
        if (control.value.match(new RegExp(config['password-regex']))) {
            return null;
        } else {
            return { 'invalidPassword': true };
        }
    }


    static DateBefore(date: String): ValidatorFn {
      return (control: AbstractControl): {[key: string]: any} => {

           if (control.value == null  || control.value == "" ) {
               return null;
           }
           else if(control.value.match(/^(0?[1-9]|[12][0-9]|3[01])[\/](0?[1-9]|1[012])[\/]\d{4}$/)){
            let inputDate = Utility.convertStringToDate(control.value);
            let validationDate = Utility.convertStringToDate(date);
            if(inputDate.getTime() < validationDate.getTime())
               return { 'dateBefore': {date} };
           }
           else{
               return null;
           }
       };
   }

   static DateBeforeGeneric(date: String): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {

         if (control.value == null  || control.value == "" ) {
             return null;
         }
         else if(control.value.match(/^(0?[1-9]|[12][0-9]|3[01])[\/](0?[1-9]|1[012])[\/]\d{4}$/)){
          let inputDate = Utility.convertStringToDate(control.value);
          let validationDate = Utility.convertStringToDate(date);
          if(inputDate.getTime() < validationDate.getTime())
             return { 'dateBeforeGeneric': {date} };
         }
         else{
             return null;
         }
     };
 }
}
