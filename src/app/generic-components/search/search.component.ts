import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ValidationService } from "../control-messages/validation.service";
@Component({
  selector: 'tr-search',
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit {

  @Output("searchCommand") searchCommand: EventEmitter<any> = new EventEmitter<any>();
  @Input("showResetButton") showResetButton: Boolean = true;
  @Input("searchObjs") searchObjs: any[];
  private searchForm: FormGroup;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.searchForm = this.formBuilder.group(
      this.buildFormObject(this.searchObjs)
    )
  }

  search(){
    if(this.searchForm.valid){
      this.searchCommand.emit(this.searchForm.value);
    }
  }
  reset(){
    if(this.showResetButton){
      this.searchForm.patchValue(this.resetForm(this.searchObjs));
      this.searchCommand.emit(this.searchForm.value);
    }
  }

  private buildFormObject(searchObjs){

    let formObj: any = {};
    if (typeof searchObjs != 'undefined'){
      this.searchObjs.forEach(element=>{
        if(element.excludeCodes==null){
          element.excludeCodes=[];
        }
        if(element.type=="hidden"){
          formObj[element.field] = [element.value];
        }else{

          if(element.type=="time"){
            if(element.mandatory){
              formObj[element.field] = ['', Validators.compose([ValidationService.timeValidator, Validators.required])];
            }else{
              formObj[element.field] = ['', Validators.compose([ValidationService.timeValidator])];
            }
          }else if(element.type=="date"){
            if(element.mandatory){
              formObj[element.field] = ['', Validators.compose([ValidationService.dateValidator, Validators.required])];
            }else{
              formObj[element.field] = ['', Validators.compose([ValidationService.dateValidator])];
            }
          }else {
            if(element.mandatory){
              formObj[element.field] = ['', Validators.compose([Validators.required])];
            }else{
              formObj[element.field] = [''];
            }

          }
        }
      }
    )};
    return formObj;
  }
  private resetForm(searchObjs){
    let formObj: any = {};
    this.searchObjs.forEach(element=>{
      if(element.type=="hidden"){
        formObj[element.field] = element.value;
      }else{
        formObj[element.field] = '';
      }
    });
    return formObj;
  }
}
