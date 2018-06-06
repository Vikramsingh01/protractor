import { Injectable } from '@angular/core';
import { TerminateEvent } from "./terminate-event";
import { TokenService } from '../../services/token.service';
import { Http, Headers, Response, URLSearchParams, RequestOptions } from "@angular/http";
import { Observable } from "rxjs";
import { DataService } from '../../services/data.service';
import { ServiceUrlConstants, ServerUrl } from '../../shared/service-url-constants';
import { Utility } from '../../shared/utility';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { TerminateEventConstants } from './terminate-event.constants';

@Injectable()
export class TerminateEventService {

    private terminateEventList: TerminateEvent[] = [];
  
   private baseUrl: string =ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.TERMINATEEVENT;
    private baseUrlforTR: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.COMMUNITYREQUIREMENT;
    private baseUrlforSpgVersion: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.EVENT;
    private baseUrlforPC: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.PROCESSCONTACT;

    constructor(private http: Http, private tokenService: TokenService, private dataService: DataService) {

    }

    getTerminateEventList(): Observable<TerminateEvent[]> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl, { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    getTerminateEvent(id: number): Observable<TerminateEvent> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl + "/" + id, { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    updateTerminateEvent(id: number, terminateEvent: TerminateEvent) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.patch(this.baseUrl + "/" + id, terminateEvent, { headers: headers });
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

    addTerminateEvent( terminateEvent: TerminateEvent) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.baseUrl, terminateEvent, { headers: headers }).map((response: Response) => response.json());
    }

    

     getSpgVersion(id: number) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrlforSpgVersion +"/"+ id+"/forSpgVersion",{ headers: headers });
    }

    terminateEvent(id: number, terminateEvent: TerminateEvent) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.baseUrl  +"/" + id + "/terminate-sentence", terminateEvent, { headers: headers });
    }

    deleteTerminateEvent(terminateEventId: number) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.delete(this.baseUrl + "/" + terminateEventId, { headers: headers, body: "" });
    }

    isAuthorize(profileId: number,action:string): Observable<TerminateEvent> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.get(this.baseUrl + "/authorize/" + profileId + "/" + action ,{ headers: headers, body: "" }).map((response: Response) => {
            if(response.text() !=null && response.text()!=""){
                return response.json()
            }else{
                return {};
            }
        });
    }

    getTerminatedProcessContact(id: number) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrlforPC + "/" + id + "/forTerminateEvent",{ headers: headers }).map((response: Response) => response.json());
    }
    getAllTerminated(id: number) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl+"/forTerminateEvent/"+ id ,{ headers: headers }).map((response: Response) => response.json());
    }


}
