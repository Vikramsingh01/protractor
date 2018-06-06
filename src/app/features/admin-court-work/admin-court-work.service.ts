import { Injectable } from '@angular/core';
import { AdminCourtWork } from "./admin-court-work";
import { TokenService } from '../../services/token.service';
import { Http, Headers, Response, URLSearchParams, RequestOptions } from "@angular/http";
import { Observable } from "rxjs";
import { DataService } from '../../services/data.service';
import { ServiceUrlConstants, ServerUrl } from '../../shared/service-url-constants';
import { Utility } from '../../shared/utility';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { AdminCourtWorkConstants } from './admin-court-work.constants';
import { DocumentStore, EntityType } from '../../features/document-store/document-store';

@Injectable()
export class AdminCourtWorkService {

    private adminCourtWorkList: AdminCourtWork[] = [];
    private baseUrl: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.CourtWork;
      //'http://localhost:8010/courtwork';
    private baseUrlDoc: string = ServerUrl(ServiceUrlConstants.DRS) + ServiceUrlConstants.DOCUMENTSTORE;

    constructor(private http: Http, private tokenService: TokenService, private dataService: DataService) {

    }

    getAdminCourtWorkList(): Observable<AdminCourtWork[]> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl, { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    getAdminCourtWork(id: number): Observable<AdminCourtWork> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl + "/" + id, { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    updateAdminCourtWork(id: number, adminCourtWork: AdminCourtWork) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.patch(this.baseUrl + "/" + id, adminCourtWork, { headers: headers });
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
        return this.http.post(this.baseUrl + "/view/search", filterObj, options).map((response: Response) => response.json());
    }

    addAdminCourtWork(adminCourtWork: AdminCourtWork) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.baseUrl, adminCourtWork, { headers: headers }).map((response: Response) => response.json());
    }

    deleteAdminCourtWork(adminCourtWorkId: number) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.delete(this.baseUrl + "/" + adminCourtWorkId, { headers: headers, body: "" });
    }

    getRequestSubTypes(reqTypeId: number) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl + "/requestSubTypes/" + reqTypeId, { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    getAssociatedEvent(adminCourtWorkId: any, eventId: any) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        let params = new URLSearchParams();
        params.set('courtWorkId', adminCourtWorkId);
        params.set('eventId', eventId);
        return this.http.get(this.baseUrl + "/associatedEvent", { headers: headers, body: "", search: params }).map((response: Response) => {
        if(response.text() !=null && response.text()!=""){
            return response.json()
        }else{
            return {};
        }});
    }

    getRequestFilteredTypeList(): Observable<any> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
       return this.http.get(this.baseUrl + "/filterDivisionList", { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    getRequestTypeFilteredTypeList(): Observable<any> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
       return this.http.get(this.baseUrl + "/filterlist", { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    addDocumet(documentStore: DocumentStore, uploadedDoc: File, crn: number, toProvider: string) {
        let xhr = new XMLHttpRequest(), formData = new FormData();
        formData.append('crn', crn);
        formData.append('entityType', 'PROCESSCONTACT');
        formData.append('entityId', documentStore.linkedToId);
        formData.append('documentType', documentStore.docType);
        formData.append('documentName',documentStore.documentName);
        formData.append('document', uploadedDoc, uploadedDoc.name);
        formData.append('createdProvider', toProvider);
        formData.append('authorProvider', toProvider);
        if (documentStore.isReadOnly == null) {
            formData.append('readOnly', false);
        } else {
            formData.append('readOnly', documentStore.isReadOnly);
        }
        xhr.open('POST', this.baseUrlDoc + "/upload");
        xhr.setRequestHeader("X-Authorization", this.tokenService.getToken());
        xhr.send(formData);
        return xhr;
    }




}
