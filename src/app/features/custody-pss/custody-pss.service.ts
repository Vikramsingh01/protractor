import { Injectable } from '@angular/core';
import { CustodyPss } from "./custody-pss";
import { TokenService } from '../../services/token.service';
import { Http, Headers, Response, URLSearchParams, RequestOptions } from "@angular/http";
import { Observable } from "rxjs";
import { DataService } from '../../services/data.service';
import { ServiceUrlConstants, ServerUrl } from '../../shared/service-url-constants';
import { Utility } from '../../shared/utility';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { CustodyPssConstants } from './custody-pss.constants';

@Injectable()
export class CustodyPssService {

    private custodyPssList: CustodyPss[] = [];
    private baseUrl: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.PSSREQUIREMENT;
    private baseUrlForEvent: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.EVENT;

    constructor(private http: Http, private tokenService: TokenService, private dataService: DataService) {

    }

    getCustodyPssList(): Observable<CustodyPss[]> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl, { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    getCustodyPss(id: number): Observable<CustodyPss> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl + "/custodypss/" + id, { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    updateCustodyPss(id: number, custodyPss: CustodyPss) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.patch(this.baseUrl + "/custodypss/" + id, custodyPss, { headers: headers });
    }

    isAnyReleaseActive(eventId: number): Observable<CustodyPss> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl + "/activeReleaseCheck" + "/" + eventId, { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    isEventTerminated(id: number): Observable<CustodyPss> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl + "/isEventTerminatedToAddPss/" + id, { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    isSentenceExpiryDateGreaterThanSysDate(eventId: number) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl + "/isSentenceExpiryDateGreaterThanSysDate" + "/" + eventId, { headers: headers, body: "" });
    }

    getDisposalByEventId(eventId: number): Observable<CustodyPss> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrlForEvent + "/" + eventId, { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    complexRefDataRequestForDisposal(disposalJson) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.baseUrl + "/disposal/crd", disposalJson, { headers: headers }).map((response: Response) => response.json());
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
        return this.http.post(this.baseUrl + "/custodypss/search", filterObj, options).map((response: Response) => response.json());
    }

    addCustodyPss(custodyPss: CustodyPss) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.baseUrl + "/custodypss", custodyPss, { headers: headers }).map((response: Response) => response.json());
    }



    deleteCustodyPss(Id: number) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.delete(this.baseUrl + "/custodypss/" + Id, { headers: headers, body: "" });
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
