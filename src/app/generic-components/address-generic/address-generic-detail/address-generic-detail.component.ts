import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from "@angular/forms";
@Component({
  selector: 'tr-address-generic-detail',
  templateUrl: './address-generic-detail.component.html'
})
export class AddressGenericDetailComponent implements OnInit {

  @Input() valueObj: any;
  constructor() { }

  ngOnInit() {
    

  }

}
