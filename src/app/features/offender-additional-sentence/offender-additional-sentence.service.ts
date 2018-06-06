import { Injectable } from '@angular/core';
import { OffenderAdditionalSentence } from "./offender-additional-sentence";
import { TokenService } from '../../services/token.service';
import { Http, Headers, Response, URLSearchParams, RequestOptions } from "@angular/http";
import { Observable } from "rxjs";
import { DataService } from '../../services/data.service';
import { ServiceUrlConstants, ServerUrl } from '../../shared/service-url-constants';
import { Utility } from '../../shared/utility';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { OffenderAdditionalSentenceConstants } from './offender-additional-sentence.constants';

@Injectable()
export class OffenderAdditionalSentenceService {

    private offenderAdditionalSentenceList: OffenderAdditionalSentence[] = [];
    private baseUrl: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.OFFENDERADDITIONALSENTENCE;

    constructor(private http: Http, private tokenService: TokenService, private dataService: DataService) {

    }

    getOffenderAdditionalSentenceList(): Observable<OffenderAdditionalSentence[]> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl, { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    getOffenderAdditionalSentence(id: number): Observable<OffenderAdditionalSentence> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl + "/" + id, { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    updateOffenderAdditionalSentence(id: number, offenderAdditionalSentence: OffenderAdditionalSentence) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.patch(this.baseUrl + "/" + id, offenderAdditionalSentence, { headers: headers });
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

  searchOffenderAdditionalSentence(offenderAdditionalSentence: OffenderAdditionalSentence){
    const body = JSON.stringify(offenderAdditionalSentence);
    const headers = new Headers();
	  headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.post(this.baseUrl+"-by-criteria", offenderAdditionalSentence, {headers: headers}).map((response: Response) => response.json());
  }
    addOffenderAdditionalSentence(offenderAdditionalSentence: OffenderAdditionalSentence) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.baseUrl, offenderAdditionalSentence, { headers: headers }).map((response: Response) => response.json());
    }

    deleteOffenderAdditionalSentence(offenderAdditionalSentenceId: number) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.delete(this.baseUrl + "/" + offenderAdditionalSentenceId, { headers: headers, body: "" });
    }

}
