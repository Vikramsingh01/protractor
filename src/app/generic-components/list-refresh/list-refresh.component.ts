import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'tr-list-refresh',
  template: `
  <div  class="pull-right">
	  <button  (click)="emitRefresh()" class="btn btn-default btn-small" id="list_refreshButton" title="Refresh"><span class="glyphicon glyphicon-refresh">aa</span></button>
  </div>`
})
export class ListRefreshComponent {
  
  @Output("refreshCommand") refreshCommand: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }


  emitRefresh() {
    this.refreshCommand.emit();
  }

}
