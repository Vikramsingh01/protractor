import { Injectable } from '@angular/core';
import {Cohort} from "./cohort";
import { TokenService } from '../../services/token.service';
import {Http, Headers, Response, URLSearchParams, RequestOptions} from "@angular/http";
import {Observable} from "rxjs";
import { DataService } from '../../services/data.service';
import { ServiceUrlConstants, ServerUrl } from '../../shared/service-url-constants';
import { Utility } from '../../shared/utility';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { CohortConstants } from './cohort.constants';

@Injectable()
export class CohortService {

  private cohorts: Cohort[] = [];
  private baseUrl: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.COHORT;
  authorizedFieldsObjList;
  constructor(private http: Http, private tokenService: TokenService, private authenticationGuard: AuthenticationGuard, private dataService:DataService){
    this.authorizedFieldsObjList = this.dataService.getFeatureFields();
  }

  getCohorts(): Observable<Cohort[]>{
    const headers = new Headers();
	  headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.get(this.baseUrl,{headers: headers, body:""}).map((response: Response) => response.json());
  }

  getCohort(id: number): Observable<Cohort>{
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

  searchCohort(cohort: Cohort){
    const body = JSON.stringify(cohort);
    const headers = new Headers();
	  headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.post(this.baseUrl+"/search", cohort, {headers: headers}).map((response: Response) => response.json());
  }

  addCohort(cohort: Cohort){
    const body = JSON.stringify(cohort);
    const headers = new Headers();
	  headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.post(this.baseUrl, cohort, {headers: headers}).map((response: Response) => response.json());
  }

  updateCohort(id, cohort: Cohort){
    const body = JSON.stringify(cohort);
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.patch(this.baseUrl+"/"+id+"/update", cohort, {headers: headers});
  }

  delete(cohortId: number){
    const body = JSON.stringify({ cohortId });
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.delete(this.baseUrl+"/"+cohortId+"/delete", {headers: headers, body:""});
  }

  isAuthorized(action){
    return this.authenticationGuard.isFeatureActionAuthorized(CohortConstants.featureId, action);
  }
  isFeildAuthorized(field, action){
    let authorized = false;
    let authorizedFieldsObj = Utility.getObjectFromArrayByKeyAndValue(this.authorizedFieldsObjList, 'featureId', CohortConstants.featureId);
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