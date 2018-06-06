import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { Utility } from '../../shared/utility';
@Component({
  selector: 'tr-pagination',
  templateUrl: './pagination.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent implements OnInit, OnChanges {

  @Input("paginationObj") paginationObj: any;
  @Input("name") name: any;
  @Output("paginationCommand") paginationCommand: EventEmitter<any> = new EventEmitter<any>();
  private pages: any[] = [];
  constructor() { }

  ngOnInit() {
    this.pages = Utility.convertSizeToArray(this.paginationObj.totalPages);
  }
  ngOnChanges() {
    this.pages = Utility.convertSizeToArray(this.paginationObj.totalPages);
  }

  fetchDataList(size, number) {
    this.paginationObj.size = size;
    this.paginationObj.number = number;
    this.pages = Utility.convertSizeToArray(this.paginationObj.totalPages);
    this.paginationCommand.emit(this.paginationObj);
  }
}
