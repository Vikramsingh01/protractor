

import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'tr-multiselect-dropdown',
  templateUrl: './multiselect-dropdown.component.html',
  styles: ['multiselect-dropdown.component.css']
})
export class MultiselectDropdownComponent implements OnInit, OnChanges {

  @Input("list") list = [];
  private selected = [];
  @Input("checked") checked=[];
  @Input("controlName") controlName: string;
  @Input("form") form: FormGroup;
  private query;
  constructor() { }

  ngOnInit() {
    this.selected = this.checked;
  }

  ngOnChanges(){
    this.checked.forEach(check=>{
      if(this.selected.indexOf(parseInt(check))<0){
        this.selected.push(check);
      }
    })
    
  }
  select(options){
    if(options.checked && this.selected.indexOf(parseInt(options.value))<=0){
      this.selected.push(parseInt(options.value));
    }else if(!options.checked && this.selected.indexOf(parseInt(options.value))>=0){
      this.selected.splice(this.selected.indexOf(parseInt(options.value)),1);
    }
    this.form.controls[this.controlName].setValue(this.selected);
}

}

