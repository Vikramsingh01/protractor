import { Injectable ,EventEmitter,Output} from '@angular/core';
import { NationalSearch } from "./national-search";
import { TokenService } from '../../services/token.service';
import { Http, Headers, Response, URLSearchParams, RequestOptions } from "@angular/http";
import { Observable } from "rxjs";
import { DataService } from '../../services/data.service';
import { ServiceUrlConstants,ServerUrl } from '../../shared/service-url-constants';
import { Utility } from '../../shared/utility';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { NationalSearchConstants } from './national-search.constants';


@Injectable()
export class NationalSearchService {

    private nationalSearchList: NationalSearch[] = [];
   private baseUrl: string= ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.NationalSearch
    private baseUrlResponseDetails: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.NationalSearchResponseDetail;
    private baseUrlResponseHeader: string =ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.NationalSearchResponseHeader;
    private baseUrlResponseEvent: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.NationalSearchResponseEvent;
    private baseUrlResponseCircumstance: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.NationalSearchResponseCircumstance;
    private baseUrlResponseRegistration: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.NationalSearchResponseRegistration;


    // private baseUrl: string= "http://localhost:4103"+ '/nationalsearch';
    // private baseUrlResponseDetails: string = "http://localhost:4103"+ '/nationalsearchresponsedetail';
    // private baseUrlResponseHeader:string= "http://localhost:4103"+ '/nationalsearchresponseheader'
    // private baseUrlResponseEvent: string = "http://localhost:4103"+ '/nationalsearchresponseevent'

    // private baseUrlResponseCircumstance: string = "http://localhost:4103"+ '/nationalsearchresponsecircumstance';
    // private baseUrlResponseRegistration: string ="http://localhost:4103"+ '/nationalsearchresponseregistration';
    @Output("updateNationalSearchResponsDetailsList") updateNationalSearchResponsDetailsList: EventEmitter<any> = new EventEmitter<any>();
    constructor(private http: Http, private tokenService: TokenService, private dataService: DataService) {

    }

    getNationalSearchList(): Observable<NationalSearch[]> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl, { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    getResponseList(){
        return this.updateNationalSearchResponsDetailsList;
    }
    setResponseList(updateResponseList){
        this.updateNationalSearchResponsDetailsList.emit(updateResponseList);
    }
    getNationalSearch(id: number): Observable<NationalSearch> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl + "/" + id, { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    updateNationalSearch(id: number, nationalSearch: NationalSearch) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.patch(this.baseUrl + "/" + id, nationalSearch, { headers: headers });
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

    addNationalSearch(nationalSearch: NationalSearch) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.baseUrl, nationalSearch, { headers: headers }).map((response: Response) => response.json());
    }

    deleteNationalSearch(nationalSearchId: number) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.delete(this.baseUrl + "/" + nationalSearchId, { headers: headers, body: "" });
    }

    
    sortFilterAndPaginateSummary(filterObj, paginationObj, sortObj) {
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
        return this.http.post(this.baseUrlResponseDetails + "/search", filterObj, options).map((response: Response) => response.json());
    }

    sortFilterAndPaginateEvent(filterObj, paginationObj, sortObj) {
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
        return this.http.post(this.baseUrlResponseEvent + "/search", filterObj, options).map((response: Response) => response.json());
    }
       getNationalSearchResponseDetail(searchId: any,crn:any,offenderId:any): Observable<any> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrlResponseDetails + "/" + searchId+"/"+crn+"/"+offenderId, { headers: headers, body: "" }).map((response: Response) => response.json());
    }


    sortFilterAndPaginateHeader(filterObj, paginationObj, sortObj) {
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
        return this.http.post(this.baseUrlResponseHeader + "/search", filterObj, options).map((response: Response) => response.json());
    }

    sortFilterAndPaginateRegistration(filterObj, paginationObj, sortObj) {
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
        return this.http.post(this.baseUrlResponseRegistration + "/search", filterObj, options).map((response: Response) => response.json());
    }

    sortFilterAndPaginateCircumstance(filterObj, paginationObj, sortObj) {
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
        return this.http.post(this.baseUrlResponseCircumstance + "/search", filterObj, options).map((response: Response) => response.json());
    }

       isAuthorize(profileId: number,action:string): Observable<any> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        //return this.http.get( this.baseUrl + "/authorize/" + profileId + "/" + action ,{ headers: headers, body: "" }).map((response: Response) => {
        return this.http.get(this.baseUrl + "/authorize/" + profileId + "/" + action ,{ headers: headers, body: "" }).map((response: Response) => {
            if(response.text() !=null && response.text()!=""){
                return response.json()
            }else{
                return {};
            }
        });
    }
}
