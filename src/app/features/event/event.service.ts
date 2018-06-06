import { Injectable } from '@angular/core';
import { Event } from "./event";
import { TokenService } from '../../services/token.service';
import { Http, Headers, Response, URLSearchParams, RequestOptions } from "@angular/http";
import { Observable } from "rxjs";
import { DataService } from '../../services/data.service';
import { ServiceUrlConstants, ServerUrl } from '../../shared/service-url-constants';
import { Utility } from '../../shared/utility';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { EventConstants } from './event.constants';

@Injectable()
export class EventService {

  private events: Event[] = [];
  private baseUrl: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.EVENT;
  private baseUrlForPssReq: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.PSSREQUIREMENT;
  private eventBaseUrl: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.PENDINGTRANSFEREVENT;
  authorizedFieldsObjList;
  constructor(private http: Http, private tokenService: TokenService, private authenticationGuard: AuthenticationGuard, private dataService: DataService) {
    this.authorizedFieldsObjList = this.dataService.getFeatureFields();
  }

  getEvents(): Observable<Event[]> {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.get(this.baseUrl, { headers: headers, body: "" }).map((response: Response) => response.json());
  }

  getEvent(id: number): Observable<Event> {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.get(this.baseUrl + "/" + id, { headers: headers, body: "" }).map((response: Response) => response.json());
  }

  getDisposalByEventId(eventId: number): Observable<Event> {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.get(this.baseUrl + "/" + eventId, { headers: headers, body: "" }).map((response: Response) => response.json());
  }

  complexRefDataRequestForDisposal(disposalJson) {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.post(this.baseUrlForPssReq + "/disposal/crd", disposalJson, { headers: headers }).map((response: Response) => response.json());
  }

  sortFilterAndPaginate(filterObj, paginationObj, sortObj) {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    let searchParams: URLSearchParams = new URLSearchParams();

    if (sortObj != null && sortObj.length > 0) {
      sortObj.forEach((element: any) => {
        searchParams.append("sort", element.field + "," + element.sort);
      });
    }

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
    return this.http.post(this.baseUrl + "-by-criteria", filterObj, options).map((response: Response) => response.json());
  }

  searchEvent(event: Event) {
    const body = JSON.stringify(event);
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    let options = new RequestOptions({
      headers: headers,
      search: new URLSearchParams('sort=eventNumber,desc&size=5')
    });

    // return this.http.post(this.baseUrl+"-by-criteria", event, {headers: headers}).map((response: Response) => response.json());
    return this.http.post(this.baseUrl + "-by-criteria", event, options).map((response: Response) => response.json());
  }

  addEvent(event: Event) {
    const body = JSON.stringify(event);
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.post(this.baseUrl, event, { headers: headers }).map((response: Response) => response.json());
  }

  updateEvent(id, event: Event) {
    const body = JSON.stringify(event);
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.patch(this.baseUrl + "/" + id + "/update", event, { headers: headers });
  }

  delete(eventId: number) {
    const body = JSON.stringify({ eventId });
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.delete(this.baseUrl + "/" + eventId + "/delete", { headers: headers, body: "" });
  }

  isAuthorized(action) {
    return this.authenticationGuard.isFeatureActionAuthorized(EventConstants.featureId, action);
  }
  isFeildAuthorized(field, action) {
    let authorized = false;
    let authorizedFieldsObj = Utility.getObjectFromArrayByKeyAndValue(this.authorizedFieldsObjList, 'featureId', EventConstants.featureId);
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

  getEventForPendingTransfer(profileId: number): Observable<Event[]> {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.get(this.baseUrl + "/pending-transfer-event/" + profileId, { headers: headers, body: "" }).map((response: Response) => response.json());
  }

  getCodeForEventType(eventId: number) {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.get(this.baseUrl + "/codeForEventType/" + eventId, { headers: headers });
  }

  removeConstantsFields(obj) {
    obj.createdDate = null;
    obj.createdBy = null;
    obj.createdByUserId = null;
    obj.modifiedBy = null;
    obj.modifiedByUserId = null;
    obj.modifiedDate = null;
    obj.deletedDate = null;
    return obj;
  }


}
