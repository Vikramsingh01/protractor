import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { ListService } from '../../services/list.service';
import { DataService } from '../../services/data.service';
import { Utility } from '../../shared/utility';

@Component({
  selector: 'tr-list-label',
  template: `
    {{listObjLabel}}
  `
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListLabelComponent implements OnInit {

  private listObjLabel="";
  @Input("tableId") tableId;
  @Input("pkValue") pkValue;
  private listData: any[] = [];
  constructor(private listService: ListService, private dataService: DataService) { }

  ngOnInit() {

    this.listData = this.dataService.getListData();
    if (Utility.getObjectFromArrayByKeyAndValue(this.listData, 'tableId', this.tableId)) {
      let listArrayObj = Utility.getObjectFromArrayByKeyAndValue(this.listData, 'tableId', this.tableId);
      let list = listArrayObj.list;
      let listObj = Utility.getObjectFromArrayByKeyAndValue(list, 'key', parseInt(this.pkValue));
      if(listObj != null){
        this.listObjLabel = listObj.value;
      }
    } else {
      this.listService.getListData(this.tableId).subscribe(data=>{
            this.dataService.addListData(this.tableId, data);
            let listObj = Utility.getObjectFromArrayByKeyAndValue(data, 'key', parseInt(this.pkValue));
            if(listObj != null){
              this.listObjLabel = listObj.value;
            }
        });

      // this.listService.getListObjById(this.tableId, this.pkValue).subscribe(listObj => {
      //   this.listObjLabel = listObj[0].value;
      // })
    }

    //  this.listService.getListObjById(this.tableId, this.pkValue).subscribe(listObj=>{
    //    this.listObjLabel = listObj[0].value;
    //  })
  }

}
