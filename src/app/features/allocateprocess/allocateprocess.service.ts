import { Injectable } from '@angular/core';
import {AllocateProcess} from "./allocateprocess";
import { TokenService } from '../../services/token.service';
import {Http, Headers, Response, URLSearchParams,RequestOptions} from "@angular/http";
import {Observable} from "rxjs";
import { DataService } from '../../services/data.service';
import { ServiceUrlConstants, ServerUrl } from '../../shared/service-url-constants';
import { Utility } from '../../shared/utility';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { AllocateProcessConstants } from './allocateprocess.constants';

@Injectable()
export class AllocateProcessService {

  private allocateProcesss: AllocateProcess[] = [];
  private baseUrl: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.ALLOCATEPROCESS;
  authorizedFieldsObjList;
  constructor(private http: Http, private tokenService: TokenService, private authenticationGuard: AuthenticationGuard, private dataService:DataService){
    this.authorizedFieldsObjList = this.dataService.getFeatureFields();
  }

  getAllocateProcesss(): Observable<AllocateProcess[]>{
    const headers = new Headers();
	  headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.get(this.baseUrl,{headers: headers, body:""}).map((response: Response) => response.json());
  }

  getAllocateProcess(id: number): Observable<AllocateProcess>{
    const headers = new Headers();
	  headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.get(this.baseUrl+"/"+id, { headers: headers, body:""}).map((response: Response) => response.json());
  }

  addAllocateProcess(allocateProcess: AllocateProcess){
    const body = JSON.stringify(allocateProcess);
    const headers = new Headers();
	  headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.post(this.baseUrl, allocateProcess, {headers: headers}).map((response: Response) => response.json());
  }

  searchAllocateProcess(allocateProcess: AllocateProcess){
    const body = JSON.stringify(allocateProcess);
    const headers = new Headers();
	  headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.post(this.baseUrl+"/search", allocateProcess, {headers: headers}).map((response: Response) => response.json());
  }
  sortSearchPagination(filterObj, paginationObj, sortObj){

    const headers = new Headers();
	  headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());

    let searchParams: URLSearchParams = new URLSearchParams();
    if(sortObj != null && sortObj.field != null && sortObj.field != ""){
      searchParams.append("sort", sortObj.field+","+sortObj.sort);
    }

    if(paginationObj != null){
      searchParams.append("size", paginationObj.size);
      searchParams.append("page", paginationObj.number);
    }

    let options = new RequestOptions({
        headers: headers,
        search: searchParams
    });

    return this.http.post(this.baseUrl+"/search", filterObj, options).map((response: Response) => response.json());
  }

  updateAllocateProcess(id, allocateProcess: AllocateProcess){
    const body = JSON.stringify(allocateProcess);
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.patch(this.baseUrl + "/" + id, allocateProcess, {headers: headers});
  }

  delete(allocateProcessId: number){
    const body = JSON.stringify({ allocateProcessId });
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.delete(this.baseUrl+"/"+allocateProcessId+"/delete", {headers: headers, body:""});
  }

  isAuthorized(action){
    return this.authenticationGuard.isFeatureActionAuthorized(AllocateProcessConstants.featureId, action);
  }
  isFeildAuthorized(field, action){
    let authorized = false;
    let authorizedFieldsObj = Utility.getObjectFromArrayByKeyAndValue(this.authorizedFieldsObjList, 'featureId', AllocateProcessConstants.featureId);
    if(authorizedFieldsObj!=null){
      if(authorizedFieldsObj['featureFields']!=null){
        let authorizedFields = [];
        //console.log(authorizedFieldsObj['featureFields']['Read']);
        authorizedFields = authorizedFieldsObj['featureFields'][action];
        if(authorizedFields.indexOf(field)>-1){
          authorized = true;
        }
      }
    }
    return authorized;
  }

}
