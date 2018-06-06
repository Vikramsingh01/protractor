import { Injectable } from '@angular/core';
import { CourtWork } from "./court-work";
import { TokenService } from '../../services/token.service';
import { Http, Headers, Response, URLSearchParams, RequestOptions  } from "@angular/http";
import { Observable } from "rxjs";
import { DataService } from '../../services/data.service';
import { ServiceUrlConstants, ServerUrl } from '../../shared/service-url-constants';
import { Utility } from '../../shared/utility';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { CourtWorkConstants } from './court-work.constants';
import { DocumentStore, EntityType } from '../document-store/document-store';

@Injectable()
export class CourtWorkService {

    private courtWorkList: CourtWork[] = [];
    private type: string  = "NPS";
    private baseUrl: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.CourtWork;
      //'http://localhost:8010/courtwork';

   // private type: string  = "NPS";
    constructor(private http: Http, private tokenService: TokenService, private dataService: DataService) {

    }

    getCourtWorkList(): Observable<CourtWork[]> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl, { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    getCourtWork(id: number): Observable<CourtWork> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl + "/" + id, { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    updateCourtWork(id: number, courtWork: CourtWork) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.patch(this.baseUrl + "/" + id, courtWork, { headers: headers });
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

    addCourtWork(eventId:number, courtWork: CourtWork) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.baseUrl + "/" + eventId, courtWork, { headers: headers }).map((response: Response) => response.json());
    }

    deleteCourtWork(courtWorkId: number) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.delete(this.baseUrl + "/" + courtWorkId, { headers: headers, body: "" });
    }



    getRequestSubTypes(reqTypeId: number) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl + "/requestSubTypes/" + reqTypeId, { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    getAssociatedEvent(courtWorkId: any, eventId: any) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        let params = new URLSearchParams();
        params.set('courtWorkId', courtWorkId);
        params.set('eventId', eventId);
        return this.http.get(this.baseUrl + "/associatedEvent", { headers: headers, body: "", search: params }).map((response: Response) => response.json());
    }

    getRequestFilteredTypeList(): Observable<any> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
       return this.http.get(this.baseUrl + "/filterlist", { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    getActiveBreachCount(profileId): Observable<any> {
      const headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');
      headers.append("X-Authorization", this.tokenService.getToken());
     return this.http.get(this.baseUrl + "/"+profileId+"/activeBreachCount", { headers: headers, body: "" }).map((response: Response) => response.json());
  }

      getTemplateNameList(): Observable<any> {
        const headers = new Headers();

         headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(ServerUrl(ServiceUrlConstants.DRS) + ServiceUrlConstants.DOCUMENTSTORE + "/getTemplateList/" + this.type ,{headers: headers, body:""}).map((response: Response) => response.json());
    }


    generateLetter(courtWorkId: number,letter: String) {
        let xhr = new XMLHttpRequest(), formData = new FormData();
        xhr.open('GET', this.baseUrl + "/" + courtWorkId  + "/" + "generateLetter/" + letter);
        xhr.setRequestHeader("X-Authorization", this.tokenService.getToken());
        xhr.responseType="arraybuffer";
        xhr.send();
        return xhr;
    }


}
