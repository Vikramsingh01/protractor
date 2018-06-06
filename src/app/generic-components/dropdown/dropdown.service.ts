import { Injectable } from '@angular/core';
import { TokenService } from '../../services/token.service';
import {Http, Headers, Response, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs";
import { ServiceUrlConstants, ServerUrl } from '../../shared/service-url-constants';
@Injectable()
export class DropdownService {

  constructor(private tokenService: TokenService, private http: Http) { }

  getListData(tableId): Observable<any[]>{
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.get(ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.LIST+"/1/"+tableId, { headers: headers, body:""}).map((response: Response) => response.json());
    // return Observable.of([
    //   {key: 1, value: "test"},
    //   {key: 2, value: "test1"},
    //   {key: 3, value: "test2"},
    //   {key: 4, value: "tes3"},
    //   {key: 5, value: "test4"},
    //   {key: 6, value: "test5"},
    //   {key: 7, value: "test6"},
    //   {key: 8, value: "test7"},
    //   ])
  }
  getQuestionDependency(listTableId, listItemId) {

    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.get(ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.QD + listTableId + "/" + listItemId, { headers: headers }).map((response: Response) => response.json());
  }
}
