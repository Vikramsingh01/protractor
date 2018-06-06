import { Injectable } from '@angular/core';
import { EngagementHistory } from "./engagement-history";
import { TokenService } from '../../services/token.service';
import { Http, Headers, Response, URLSearchParams,RequestOptions } from "@angular/http";
import { Observable } from "rxjs";
import { DataService } from '../../services/data.service';
import { ServiceUrlConstants, ServerUrl } from '../../shared/service-url-constants';
import { Utility } from '../../shared/utility';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { EngagementHistoryConstants } from './engagement-history.constants';

@Injectable()
export class EngagementHistoryService {

  private engagementHistorys: EngagementHistory[] = [];
  private baseUrl: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.ENGAGEMENTHISTORY;
  authorizedFieldsObjList;
  constructor(private http: Http, private tokenService: TokenService, private authenticationGuard: AuthenticationGuard, private dataService: DataService) {
    this.authorizedFieldsObjList = this.dataService.getFeatureFields();
  }

  getEngagementHistorys(): Observable<EngagementHistory[]> {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.get(this.baseUrl, { headers: headers, body: "" }).map((response: Response) => response.json());
  }
  sortFilterAndPaginate(filterObj, paginationObj, sortObj,offenderId) {
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
    return this.http.get(this.baseUrl + "-by-offenderId/"+offenderId, options).map((response: Response) => response.json());
  }
  getEngagementHistorysByOffenderId(offenderId){
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.get(this.baseUrl+"-by-offenderId/"+offenderId, { headers: headers, body: "" }).map((response: Response) => response.json());
  }

  getEngagementHistory(id: number): Observable<EngagementHistory> {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.get(this.baseUrl + "/" + id, { headers: headers, body: "" }).map((response: Response) => response.json());
  }

  addEngagementHistory(engagementHistory: EngagementHistory) {
    const body = JSON.stringify(engagementHistory);
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.post(this.baseUrl, engagementHistory, { headers: headers }).map((response: Response) => response.json());
  }

  updateEngagementHistory(id, engagementHistory: EngagementHistory) {
    const body = JSON.stringify(engagementHistory);
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.patch(this.baseUrl + "/" + id + "/update", engagementHistory, { headers: headers });
  }

  delete(engagementHistoryId: number) {
    const body = JSON.stringify({ engagementHistoryId });
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.delete(this.baseUrl + "/" + engagementHistoryId + "/delete", { headers: headers, body: "" });
  }

  isAuthorized(action) {
    return this.authenticationGuard.isFeatureActionAuthorized(EngagementHistoryConstants.featureId, action);
  }
  isFeildAuthorized(field, action) {
    let authorized = false;
    let authorizedFieldsObj = Utility.getObjectFromArrayByKeyAndValue(this.authorizedFieldsObjList, 'featureId', EngagementHistoryConstants.featureId);
    if (authorizedFieldsObj != null) {
      if (authorizedFieldsObj['featureFields'] != null) {
        let authorizedFields = [];
        //console.log(authorizedFieldsObj['featureFields']['Read']);
        authorizedFields = authorizedFieldsObj['featureFields'][action];
        if (authorizedFields.indexOf(field) > -1) {
          authorized = true;
        }
      }
    }
    return authorized;
  }

}
