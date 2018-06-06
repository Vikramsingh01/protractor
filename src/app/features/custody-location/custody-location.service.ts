import { Injectable } from '@angular/core';
import { CustodyLocation } from "./custody-location";
import { TokenService } from '../../services/token.service';
import { Http, Headers, Response, URLSearchParams, RequestOptions } from "@angular/http";
import { Observable } from "rxjs";
import { DataService } from '../../services/data.service';
import { ServiceUrlConstants, ServerUrl } from '../../shared/service-url-constants';
import { Utility } from '../../shared/utility';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { CustodyLocationConstants } from './custody-location.constants';

@Injectable()
export class CustodyLocationService {

    private custodyLocationList: CustodyLocation[] = [];
    private baseUrl: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.CUSTODYLOCATION;



    constructor(private http: Http, private tokenService: TokenService, private dataService: DataService) {

    }

    getCustodyLocationList(): Observable<CustodyLocation[]> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl, { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    getCustodyLocation(id: number): Observable<CustodyLocation> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl + "/" + id, { headers: headers, body: "" }).map((response: Response) => response.json());
    }
    searchCustodyLocation(custodyLocation: CustodyLocation) {
        const body = JSON.stringify(custodyLocation);
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.baseUrl + "/search", custodyLocation, { headers: headers }).map((response: Response) => response.json());
    }
    getCustodyLocationByEventId(eventId: number): Observable<CustodyLocation> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl + "/event/" + eventId, { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    getCustodyLocationByProfileId(profileId: number): Observable<CustodyLocation> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl + "/profile/" + profileId, { headers: headers, body: "" }).map((response: Response) => response.json());
    }



    getCurrentStatusByEventId(eventId: number): Observable<CustodyLocation> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl + "/currentstatus/event/" + eventId, { headers: headers, body: "" }).map((response: Response) => response.json());
    }



    getStatusDateByEventId(eventId: number): Observable<CustodyLocation> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl + "/currentstatusDate/event/" + eventId, { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    getRecallStatusByEventId(eventId: number): Observable<CustodyLocation> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl + "/edit/event/" + eventId, { headers: headers, body: "" }).map((response: Response) => response.json());
    }


    getCustodyLocationLockStatusByEventId(eventId: number): Observable<CustodyLocation> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl + "/editLock/event/" + eventId, { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    updateCustodyLocation(id: number, custodyLocation: CustodyLocation) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.patch(this.baseUrl + "/" + id, custodyLocation, { headers: headers });
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

    addCustodyLocation(custodyLocation: CustodyLocation) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.baseUrl, custodyLocation, { headers: headers }).map((response: Response) => response.json());
    }

    deleteCustodyLocation(custodyLocationId: number) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.delete(this.baseUrl + "/" + custodyLocationId, { headers: headers, body: "" });
    }

}
