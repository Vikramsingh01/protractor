import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { ListService } from '../../services/list.service';
import { DataService } from '../../services/data.service';
import { Utility } from '../../shared/utility';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {HeaderService} from "../../views/header/header.service"
import{NsrdComponent} from "../../generic-components/nsrd-dropdown/nsrd-component"
import{NsrdDropdownService} from "../../generic-components/nsrd-dropdown/nsrd-dropdown.service"

@Component({
  selector: 'tr-nsrd-dropdown',
  template: `
  <div [formGroup]="dropdown">
    <select class="form-control" id="{{controlName}}" [formControlName]="controlName" (change)="onSelect($event.target.value)">
      <option value="">- Select -</option>
      <option *ngFor="let listItem of list; let i = index" value="{{listItem.key}}">{{listItem.value}}</option>
    </select>
    </div>
  `, 
  providers: [NsrdDropdownService]
})
export class NsrdDropdownComponent implements OnInit {

  @Input('tableId') tableId;
  @Input("controlName") controlName: string;
  @Input("dropdown") dropdown: FormGroup;
  @Input("lookup") lookup: number ;
  @Input("inputParam") inputParam: number;

  
  list: any[] = [];
  private listData: any[] = [];
  constructor(private listService: ListService, private dataService: DataService,private headerService:HeaderService) { }

  ngOnInit() {
    if(this.inputParam != null){
      this.listService.getListDataByLookupAndPkValue(this.tableId, this.lookup, this.inputParam).subscribe(data=>{
      this.list = data;
    });;
    }
    if(this.lookup == null || this.lookup == 0){
      if(Utility.getObjectFromArrayByKeyAndValue(this.listData, 'tableId', this.tableId) != null){
          let listObj = Utility.getObjectFromArrayByKeyAndValue(this.listData, 'tableId', this.tableId);
          this.list = listObj.list;
        }
        else{
          this.listService.getListData(this.tableId).subscribe(data=>{
            this.dataService.addListData(this.tableId, data);
            this.list = data;
          });
        }
      // this.listService.getListData(this.tableId).subscribe(data=>{
      //   this.list = data;
      // });
    }
    else{
      this.listService.getListDataWithLookup(this.tableId, this.lookup).subscribe(data=>{
        this.list = data;
      });
    }

  }

  onSelect(value) {
    var nsrdComponent = new  NsrdComponent();
    nsrdComponent.setTableId(this.tableId);
    nsrdComponent.setListId(value);

    this.headerService.setNsrdDataSource(nsrdComponent);
  }

}
