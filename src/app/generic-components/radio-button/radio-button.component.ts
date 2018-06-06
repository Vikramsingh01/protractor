import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { ListService } from '../../services/list.service';

@Component({
  selector: 'tr-radio',
  template: `
    <div [formGroup]="form">
     <label class="radio-inline" *ngFor="let listItem of (list  | excludeFilter : 'key': excludeItems | includeFilter: 'code': includeCodes | excludeFilter : 'code': excludeCodes); let i = index">
      <input type="radio" [formControlName]="controlName" value="{{listItem?.key}}" />&nbsp;&nbsp;{{listItem?.value}}
      </label>
    </div>
  `,
})
export class RadioButtonComponent implements OnInit {
  @Input("controlName") controlName: string;
  @Input("excludeItems") excludeItems: any[] = [];
  @Input("includeCodes") includeCodes: any[] = [];
  @Input("excludeCodes") excludeCodes: any[] = [];
  @Input("form") form: FormGroup;
  @Input("tableId") tableId;
  list: any[] = [];
  constructor(private listService: ListService) { }

  ngOnInit() {
    this.listService.getListData(this.tableId).subscribe(data=>{
      this.list = data;
    });;

  }

}
