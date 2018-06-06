import { Injectable } from '@angular/core';
import { PendingTransfer } from "./pending-transfer";
import { TokenService } from '../../services/token.service';
import { Http, Headers, Response, URLSearchParams, RequestOptions } from "@angular/http";
import { Observable } from "rxjs";
import { DataService } from '../../services/data.service';
import { ServiceUrlConstants, ServerUrl } from '../../shared/service-url-constants';
import { Utility } from '../../shared/utility';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { PendingTransferConstants } from './pending-transfer.constants';
import { ComponentAllocationPendingTransfer } from "./component-allocation-transfer";
import { ConsolatedTransferRequest  } from '../pending-transfer/consolatedTransferRequest';
@Injectable()
export class PendingTransferService {

    private pendingTransferList: PendingTransfer[] = [];
    private baseUrl: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.PendingTransfer;
    //private baseUrlComponetAllocation: string = "http://localhost:4105/consolatedtransferresponse";
    private baseUrlComponetAllocation: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.ConsolidatedTransferResponse;

    constructor(private http: Http, private tokenService: TokenService, private dataService: DataService) {

    }

    getPendingTransferList(): Observable<PendingTransfer[]> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl, { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    getPendingTransfer(id: number): Observable<PendingTransfer> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl + "/" + id, { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    updatePendingTransfer(id: number, pendingTransfer: PendingTransfer) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.patch(this.baseUrl + "/" + id, pendingTransfer, { headers: headers });
    }

    sortFilterAndPaginateForPendingTransferComponent(filterObj, paginationObj, sortObj) {
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

    addPendingTransfer(pendingTransfer: PendingTransfer) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.baseUrl, pendingTransfer, { headers: headers }).map((response: Response) => response.json());
    }

    deletePendingTransfer(pendingTransferId: number) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.delete(this.baseUrl + "/" + pendingTransferId, { headers: headers, body: "" });
    }
    addCTRAndCMA(consolatedtransferresponse: ComponentAllocationPendingTransfer) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.baseUrlComponetAllocation, consolatedtransferresponse, { headers: headers }).map((response: Response) => {
            if(response.text() !=null && response.text()!=""){
                return response.json()
            }else{
                return {};
            }
        });
    }
    createConsolatedTransferResponseAndAllocateCM(consolatedtransferresponse: ComponentAllocationPendingTransfer[]) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.baseUrlComponetAllocation, consolatedtransferresponse, { headers: headers }).map((response: Response) => {
            if(response.text() !=null && response.text()!=""){
                return response.json()
            }else{
                return {};
            }
        });
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
         if(filterObj.crn==""){
            filterObj.crn=null;
        }
        let options = new RequestOptions({
            headers: headers,
            search: searchParams
        });
        return this.http.post(this.baseUrl + "/search", filterObj, options).map((response: Response) => response.json());
    }

    sortFilterAndPaginateRecentAllocated(filterObj, paginationObj, sortObj) {
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
         if(filterObj.crn==""){
            filterObj.crn=null;
        }
        let options = new RequestOptions({
            headers: headers,
            search: searchParams
        });
        return this.http.post(this.baseUrl + "/searchrecentallocated", filterObj, options).map((response: Response) => response.json());
    }



    genrateCTRForPendingTransferComponent(pendingTransferComponent: ConsolatedTransferRequest) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());

        return this.http.post(this.baseUrlComponetAllocation+ "/generate", pendingTransferComponent, { headers: headers }).map((response: Response) => response.json());
    }
    submit(id: number) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());

        return this.http.post(this.baseUrlComponetAllocation + "/submit", id, { headers: headers }).map((response: Response) => {
            if(response.text() !=null && response.text()!=""){
                return response.json()
            }else{
                return {};
            }
        });
    //    const headers = new Headers();
    //     headers.append('Accept', 'application/json');
    //     headers.append('Content-Type', 'application/json');
    //     headers.append("X-Authorization", this.tokenService.getToken());
    //     return this.http.patch("http://localhost:4103/consolatedtransferresponse" + "/submit", id, { headers: headers });
    }

     getPendingTransferDate(id: number) {
       const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrlComponetAllocation + "/transfer/" + id, { headers: headers, body: "" }).map((response: Response) => response.json());
    }
    getProviderFilteredList(): Observable<any> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
       return this.http.get(this.baseUrl + "/filterProviderList" , { headers: headers, body: "" }).map((response: Response) => response.json());
       
    }
isAllRequestTransfer(filterObj) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
         return this.http.post(this.baseUrlComponetAllocation + "/authorize", filterObj, { headers: headers }).map((response: Response) => {
            if(response.text() !=null && response.text()!=""){
                return response.json()
            }else{
                return {};
            }    
        });
    }

}
