import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from "@angular/forms";
@Component({
  selector: 'tr-address-generic-add',
  templateUrl: './address-generic-add.component.html'
})
export class AddressGenericAddComponent implements OnInit {

  @Input() form: FormGroup;
  @Input() formGroupName: string;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    // this.form = this.formBuilder.group({
    //   buildingname: [''],
    //   country: [''],
    //   district: [''],
    //   houseNumber: [''],
    //   postcode: [''],
    //   townCity: [''],
    //   telephoneNumber: [''],
    //   streetName: ['']
    // })

  }

}
