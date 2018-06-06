import { Injectable } from '@angular/core';
import {PssContact} from "./psscontact";
import { TokenService } from '../../services/token.service';
import {Http, Headers, Response, URLSearchParams, RequestOptions} from "@angular/http";
import {Observable} from "rxjs";
import { DataService } from '../../services/data.service';
import { ServiceUrlConstants, ServerUrl } from '../../shared/service-url-constants';
import { Utility } from '../../shared/utility';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { PssContactConstants } from './psscontact.constants';

@Injectable()
export class PssContactService {

  private pssContacts: PssContact[] = [];
  private baseUrl: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.PSSCONTACT;
  authorizedFieldsObjList;
  constructor(private http: Http, private tokenService: TokenService, private authenticationGuard: AuthenticationGuard, private dataService:DataService){
    this.authorizedFieldsObjList = this.dataService.getFeatureFields();
  }

  getPssContacts(): Observable<PssContact[]>{
    const headers = new Headers();
	  headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.get(this.baseUrl,{headers: headers, body:""}).map((response: Response) => response.json());
  }

  getPssContact(id: number): Observable<PssContact>{
    const headers = new Headers();
	  headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.get(this.baseUrl+"/"+id, { headers: headers, body:""}).map((response: Response) => response.json());
  }

  sortFilterAndPaginate(filterObj, paginationObj, sortObj) {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    let searchParams: URLSearchParams = new URLSearchParams();
    if (sortObj != null && sortObj.field != null && sortObj.field != "") {
      searchParams.append("sort", sortObj.field + "," + sortObj.sort);
    }
    if (paginationObj != null) {
      searchParams.append("size", paginationObj.size);
      searchParams.append("page", paginationObj.number);
    }
    let options = new RequestOptions({
      headers: headers,
      search: searchParams
    });
    return this.http.post(this.baseUrl + "/search", filterObj, options).map((response: Response) => response.json());
  }

  searchPssContact(pssContact: PssContact){
    const body = JSON.stringify(pssContact);
    const headers = new Headers();
	  headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.post(this.baseUrl+"/search", pssContact, {headers: headers}).map((response: Response) => response.json());
  }

  addPssContact(pssContact: PssContact){
    const body = JSON.stringify(pssContact);
    const headers = new Headers();
	  headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.post(this.baseUrl, pssContact, {headers: headers}).map((response: Response) => response.json());
  }

  updatePssContact(id, pssContact: PssContact){
    const body = JSON.stringify(pssContact);
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.patch(this.baseUrl+"/"+id, pssContact, {headers: headers});
  }

  delete(pssContactId: number){
    const body = JSON.stringify({ pssContactId });
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.delete(this.baseUrl+"/"+pssContactId+"/delete", {headers: headers, body:""});
  }

  isAuthorized(action){
    return this.authenticationGuard.isFeatureActionAuthorized(PssContactConstants.featureId, action);
  }
  isFeildAuthorized(field, action){
    let authorized = false;
    let authorizedFieldsObj = Utility.getObjectFromArrayByKeyAndValue(this.authorizedFieldsObjList, 'featureId', PssContactConstants.featureId);
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
