import { Injectable } from '@angular/core';
import {RequirementManager} from "./requirementmanager";
import { TokenService } from '../../services/token.service';
import {Http, Headers, Response, URLSearchParams, RequestOptions} from "@angular/http";
import {Observable} from "rxjs";
import { DataService } from '../../services/data.service';
import { ServiceUrlConstants, ServerUrl } from '../../shared/service-url-constants';
import { Utility } from '../../shared/utility';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { RequirementManagerConstants } from './requirementmanager.constants';

@Injectable()
export class RequirementManagerService {

  private requirementManagers: RequirementManager[] = [];
  private baseUrl: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.REQUIREMENTMANAGER;
  authorizedFieldsObjList;
  constructor(private http: Http, private tokenService: TokenService, private authenticationGuard: AuthenticationGuard, private dataService:DataService){
    this.authorizedFieldsObjList = this.dataService.getFeatureFields();
  }

  getRequirementManagers(): Observable<RequirementManager[]>{
    const headers = new Headers();
	  headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.get(this.baseUrl,{headers: headers, body:""}).map((response: Response) => response.json());
  }

  getRequirementManager(id: number): Observable<RequirementManager>{
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

  searchRequirementManager(requirementManager: RequirementManager){
    const body = JSON.stringify(requirementManager);
    const headers = new Headers();
	  headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
     let options = new RequestOptions({
        headers: headers,
        search: new URLSearchParams('size=5')
    });
    return this.http.post(this.baseUrl+"/search", requirementManager, options).map((response: Response) => response.json());
  }

  addRequirementManager(requirementManager: RequirementManager){
    const body = JSON.stringify(requirementManager);
    const headers = new Headers();
	  headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.post(this.baseUrl, requirementManager, {headers: headers}).map((response: Response) => response.json());
  }

  updateRequirementManager(id, requirementManager: RequirementManager){
    const body = JSON.stringify(requirementManager);
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.patch(this.baseUrl+"/"+id+"/update", requirementManager, {headers: headers});
  }

  delete(requirementManagerId: number){
    const body = JSON.stringify({ requirementManagerId });
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.delete(this.baseUrl+"/"+requirementManagerId+"/delete", {headers: headers, body:""});
  }

  isAuthorized(action){
    return this.authenticationGuard.isFeatureActionAuthorized(RequirementManagerConstants.featureId, action);
  }
  isFeildAuthorized(field, action){
    let authorized = false;
    let authorizedFieldsObj = Utility.getObjectFromArrayByKeyAndValue(this.authorizedFieldsObjList, 'featureId', RequirementManagerConstants.featureId);
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
