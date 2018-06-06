import { Component, OnInit, Input, ElementRef, EventEmitter, Output, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ListService } from '../../services/list.service';
import { DataService } from '../../services/data.service';
import { Utility } from '../../shared/utility';

@Component({
  selector: 'tr-dropdown',
  template: `
  <div [formGroup]="dropdown">
  <label for="{{controlName}}{{name}}" class="custom-drop-label">{{controlName}}</label>
    <select class="form-control" (change)="onChange($event.target.value,dropdown)" id="{{controlName}}{{name}}" [formControlName]="controlName">
      <option value=''>- Select -</option>
      <option *ngFor="let listItem of (list  | excludeFilter : 'key': excludeItems | includeFilter: 'code': includeCodes | excludeFilter : 'code': excludeCodes); let i = index" value="{{listItem.key}}">{{listItem.value}}</option>
    </select>
    </div>
  `,
})
export class DropdownComponent implements OnInit, OnChanges {
  @Input() name: string;
  @Input('tableId') tableId;
  @Input('controlName') controlName: string;
  @Input('dropdown') dropdown: FormGroup;
  @Input('lookup') lookup: number;
  @Input('inputParam') inputParam: number;
  @Input('parentTableId') parentTableId: number;
  @Input('parentControlName') parentControlName: number;
  @Input('isNsrd') isNsrd: boolean;
  @Input('isDataNsrd') isDataNsrd: boolean;
  @Input('hasChildAnswers') hasChildAnswers: Boolean = false;
  @Input('hasParentAnswers') hasParentAnswers: Boolean = false;
  @Input('isQuestionDependency') isQuestionDependency: Boolean = false;
  @Input('isDependent') isDependent: Boolean = false;
  @Input('excludeItems') excludeItems: any[] = [];
  @Input('includeCodes') includeCodes: any[] = [];
  @Input('excludeCodes') excludeCodes: any[] = [];
  @Input('excludeDependency') excludeDependency: boolean;
  @Input('disabled') disabled: Boolean = false;
  @Input() list: any[] = [];
  @Input('operation') operation: string;
  @Output() updateNsrd: EventEmitter<any> = new EventEmitter<any>();
  @Output() updateDataNsrd: EventEmitter<any> = new EventEmitter<any>();
  @Output() updateAd: EventEmitter<any> = new EventEmitter<any>();
  @Output() updateAnswers: EventEmitter<any> = new EventEmitter<any>();
  @Output() updateParentAnswers: EventEmitter<any> = new EventEmitter<any>();
  @Output() updateQd: EventEmitter<any> = new EventEmitter<any>();
  private listData: any[] = [];
  private preventInvalidListItemChangeCall = false;

  constructor(private listService: ListService, private dataService: DataService, private el: ElementRef) { }
  ngOnInit() {
    this.dropdown.controls[this.controlName].valueChanges.subscribe(value => {
      if (!this.preventInvalidListItemChangeCall) {
        if (this.dropdown.controls[this.controlName].value == null) {
          this.preventInvalidListItemChangeCall = true;
          this.dropdown.controls[this.controlName].setValue('');
        }else if(this.list.length > 0) {
          if(this.list.filter(item => item['key'] == value).length == 0){
            this.preventInvalidListItemChangeCall = true;
            this.dropdown.controls[this.controlName].setValue('');
          } else if(this.operation === 'Update' || this.operation === 'Edit'){
            this.list = this.list.filter(item =>
              item['selectable'] == true ||
              item['key'] == value);
          }
        }
      } else {
        this.preventInvalidListItemChangeCall = false;
      }
    })

    this.dropdown.controls[this.controlName].statusChanges.subscribe(status => {
      if ('DISABLED' == status) {
        this.excludeItems = [];
      }
    })
    if (this.disabled) {
      this.dropdown.controls[this.controlName].disable();
    }
    if (this.dropdown.controls[this.controlName].value == null) {
      this.dropdown.controls[this.controlName].setValue('');
    }

    if (typeof this.tableId != 'undefined') {
      if (!this.isDependent) {
        if (this.inputParam != null) {
          this.listService.getListDataByLookupAndPkValue(this.tableId, this.lookup, this.inputParam).subscribe(data => {
            this.list = data;
          });
          return false;
        }

        if (this.lookup == null || this.lookup == 0) {
          //this.listData = this.dataService.getListData();
          if (Utility.getObjectFromArrayByKeyAndValue(this.listData, 'tableId', this.tableId) != null) {
            let listObj = Utility.getObjectFromArrayByKeyAndValue(this.listData, 'tableId', this.tableId);
            this.list = listObj.list;
          }
          else {
            this.listService.getListData(this.tableId).subscribe(data => {
              this.dataService.addListData(this.tableId, data);
              if(this.tableId != 0){
                if((this.operation === 'Update' || this.operation === 'Edit')) {
                  this.list = data;
                } else {
                  this.list = data.filter(item =>
                    item['selectable'] == true);
                }
            }
            }
            );
          }
        }
        else {
          this.listService.getListDataWithLookup(this.tableId, this.lookup).subscribe(data => {
            this.list = data;
          });
          return false;
        }
      } else {
        if (this.parentTableId != null) {
          this.listService.getDependentAnswers(this.parentTableId, this.dropdown.controls[this.parentControlName].value).subscribe((data: any) => {
            this.updateAnswers.emit(data);
          });
        }
      }
    } else {
      this.list = [];

    }

  }

  onChange(selectedValue, contact) {
    if (this.isNsrd && selectedValue !== '') {
      this.listService.getNSRDDataForChange(contact.getRawValue()).subscribe((data: any) => {
        this.updateNsrd.emit(data.resultMap.fieldObjectList);
      })
    }
    if (this.isDataNsrd && selectedValue !== '') {
      this.listService.getNSRDDataForChange(contact.getRawValue()).subscribe((data: any) => {
        this.updateDataNsrd.emit(data.resultMap);
      })
    }
    if (this.hasChildAnswers && selectedValue !== '') {
      if (selectedValue == 'null') {
        selectedValue = '';
      }
      this.listService.getDependentAnswers(this.tableId, selectedValue).subscribe((data: any) => {
        this.updateAnswers.emit(data);
      })
    }

    if (this.hasParentAnswers && selectedValue !== '') {
      if (selectedValue == 'null') {
        selectedValue = '';
      }
      this.listService.getParentDependentAnswers(this.tableId, selectedValue).subscribe((data: any) => {
        this.updateParentAnswers.emit(data);
      })
    }

    if (this.excludeDependency && selectedValue !== '') {

      this.listService.getListData(this.tableId).subscribe((data: any) => {
        let list: Array<any> = data;
        list.forEach(function (value, index) {

          if (value.key == selectedValue) {

            list.splice(index, 1);
          }

        });
        this.updateAd.emit(list);
      })
    }
    else {
      this.updateAd.emit([]);
    }
    if (this.isQuestionDependency) {
      //this.listService.getDependentAnswers(this.tableId, selectedValue).subscribe((data: any) => {
      //this.updateAd.emit(data);
      //})
    }
  }

  ngOnChanges() {
    if (this.list == undefined) {
      this.list = [];
    }
  }

}
