import { Component, Input, Directive, HostListener } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormControlName, FormControlDirective } from '@angular/forms';
import { ValidationService } from './validation.service';
import { HeaderService } from '../../views/header/header.service';
import { Utility } from "../../shared/utility";

const originFormControlNgOnChanges = FormControlDirective.prototype.ngOnChanges;
FormControlDirective.prototype.ngOnChanges = function () {
  this.form.nativeElement = this.valueAccessor._elementRef.nativeElement;
  return originFormControlNgOnChanges.apply(this, arguments);
};

const originFormControlNameNgOnChanges = FormControlName.prototype.ngOnChanges;
FormControlName.prototype.ngOnChanges = function () {
  const result = originFormControlNameNgOnChanges.apply(this, arguments);
  this.control.nativeElement = this.valueAccessor._elementRef.nativeElement;
  return result;
};

@Component({
  selector: 'control-messages',
  template: `<div>
  <div *ngIf="errorServerMessage != null && control.invalid" class="error-msg">{{errorServerMessage}}</div>
  <div *ngIf="errorMessage != null && control.invalid && errorServerMessage==null" class="error-msg">{{errorMessage}}</div></div>`
})
export class ControlMessagesComponent {
  //errorMessage: string;
  @Input() control: FormControl;

  constructor() { }

  get errorMessage() {
    for (let propertyName in this.control.errors) {
      if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
        return ValidationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
      }
    }
    return null;
  }
  get errorServerMessage() {
    if (this.control.errors != null)
      return this.control.errors['errorMessage'];

    return null
  }

}


@Directive(
  { selector: '[fromServerMessageValidator]' }
)
export class FromServerMessageValidator {
  //errorMessage: string;
  @Input('form') form: FormGroup;
  @HostListener('click', ['$event']) onClick($event) {
    if (this.form.invalid) {
      //let focusField;
      Object.keys(this.form.controls).forEach(control => {
        this.form.controls[control].markAsTouched();
        if (this.form.controls[control] instanceof FormGroup) {
          let formGroup: FormGroup = <FormGroup>this.form.controls[control];
          Object.keys(formGroup.controls).forEach(groupControl => {
            formGroup.controls[groupControl].markAsTouched();
          });
        }
        if (this.form.controls[control] instanceof FormArray) {
          let formArray = <FormArray>this.form.controls[control];
          for (var i = 0; i < formArray.length; i++) {
            let formGroup: FormGroup = <FormGroup>formArray.controls[i];
            Object.keys(formGroup.controls).forEach(arrayControl => {
              formGroup.controls[arrayControl].markAsTouched();
            });
          }
        }
        // if ( !this.form.controls[control].valid && !focusField ) {
        //   focusField = control;
        // }
      })
      // if (focusField != null) {
      //   let errorControl: any = this.form.get(focusField);
      //   if (errorControl != null) {
      //     errorControl.nativeElement.focus();
      //   }
      // }
    }
    this.headerService.formSererValidator.subscribe((error: any[]) => {
      let errorList: any[] = [];
      //let focusField;
      if (error != null && error.length > 0) {
        error.forEach((errorObj, index) => {
          if (Utility.getObjectFromArrayByKeyAndValue(errorList, "field", errorObj.field) == null) {
            errorList.push({ field: errorObj.field, obj: errorObj, index: index });
          } else {
            let oldErrorObj = Utility.getObjectFromArrayByKeyAndValue(errorList, "field", errorObj.field);
            errorObj.errorMessage = oldErrorObj.obj.errorMessage + "\n" + errorObj.errorMessage;
            error.splice(oldErrorObj.index, 1);
          }
        });
      }

      if (error != null && error.length > 0) {
        error.forEach(element => {
          if (element.field.indexOf("[") >= 0 && element.field.indexOf("]")) {
            let index = element.field.substring(element.field.lastIndexOf("[") + 1, element.field.lastIndexOf("]"));
            let arrayFieldName = element.field.split("[");
            let fieldName = element.field.split(".");
            let formArray = <FormArray>this.form.controls[arrayFieldName[0]];
            if(formArray != null && formArray.length >= index){
              let formGroup = <FormGroup>formArray.at(index);
              if(formGroup != null && formGroup.controls[fieldName[1]] != null){
                formGroup.controls[fieldName[1]].setErrors({ "errorMessage": element.errorMessage, "fieldName": element.field });
              }
            }
          } else if (element.field.indexOf(".") >= 0) {
            let fieldArray = element.field.split(".");
            let fieldFormControl: any = this.form.controls[fieldArray[0]];
            fieldFormControl.controls[fieldArray[1]].setErrors({ "errorMessage": element.errorMessage, "fieldName": element.field });
          } else {
            if(this.form != null && element.field != null && this.form.controls[element.field] != null){
              this.form.controls[element.field].setErrors({ "errorMessage": element.errorMessage, "fieldName": element.field });
            }
          }
          // if ( !this.form.controls[element.field].valid && !focusField ) {
          //   focusField = element.field;
          // }
        });
        // if (focusField != null) {
        //   let errorControl: any = this.form.get(focusField);
        //   if (errorControl != null) {
        //     //errorControl.nativeElement.focus();
        //   }
        // }
      }
    })
  }
  constructor(private headerService: HeaderService) {

  }


}
