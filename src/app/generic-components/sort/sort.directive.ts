import { Directive, Input, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[trSortBy]'
})
export class SortDirective {

  @Input("trSortBy") sortByField: string;
  @Input("sort") sort: string = '';
  @Output("sortCommand") sortCommand: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }
  @HostListener('click') onclick() {

    let sampleSort: boolean;
    let sortObj: any = {};
    sortObj.field = this.sortByField;
    sortObj.sort = this.sort;

    if (this.sort == 'asc') {
      sampleSort = true;
    }
    if (this.sort == 'desc') {
      sampleSort = false;
    }

    if (sampleSort == true) {
      this.sort = 'desc';
    }
    if (sampleSort == false) {
      this.sort = 'asc';
    }
    if (this.sort == '') {
      this.sort = 'asc';
    }

    sortObj.sort = this.sort;
    sortObj.field = this.sortByField;
    this.sortCommand.emit(sortObj);
    
  }

}
