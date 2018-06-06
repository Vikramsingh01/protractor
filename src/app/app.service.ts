import { Injectable, Output, EventEmitter } from '@angular/core';
import { APPCONSTANTS } from "./app.constants"
import { ServerUrl } from "./shared/service-url-constants";

@Injectable()
export class AppService {
  @Output() changeTimeOut : EventEmitter<any> = new EventEmitter<any>();

  private pageList: any[] = [];
  constructor() {}

   setChangeTimeOut(isChanged: boolean){
     let timeOut = parseInt(ServerUrl('session.expiry.duration.minutes'))*60;
     timeOut = timeOut - APPCONSTANTS.timeOut;
    return this.changeTimeOut.emit({IdelTime: timeOut, TimeOut: APPCONSTANTS.timeOut});
  }

  addUrlToPageList(url){
    if(url != "/error"){
      this.pageList.push(url);
    }
  }
  getPageList(){
    return this.pageList;
  }

  clearPageList(){
    this.pageList = [];
  }
}
