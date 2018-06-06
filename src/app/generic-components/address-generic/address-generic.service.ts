import { Injectable } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";
import { ValidationService } from "../control-messages/validation.service";

@Injectable()
export class AddressGenericService {

  constructor(private formBuilder: FormBuilder) { }

  createAddressForm(address){
     return this.formBuilder.group({
      buildingname: ['', Validators.compose([Validators.maxLength(35)])],
      country: ['', Validators.compose([Validators.maxLength(35)])],
      district: ['', Validators.compose([Validators.maxLength(35)])],
      houseNumber: ['', Validators.compose([Validators.maxLength(35)])],
      postcode: ['', Validators.compose([Validators.maxLength(35)])],
      townCity: ['', Validators.compose([Validators.maxLength(35)])],
      telephoneNumber: ['', Validators.compose([Validators.maxLength(35), ValidationService.TelephoneNumberTextValidator])],
      streetName: ['', Validators.compose([Validators.maxLength(35)])]
    })
  }

}
