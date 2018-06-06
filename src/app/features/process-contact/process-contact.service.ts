import { Injectable } from '@angular/core';
import { ProcessContact } from "./process-contact";
import { TokenService } from '../../services/token.service';
import { Http, Headers, Response, URLSearchParams, RequestOptions } from "@angular/http";
import { Observable } from "rxjs";
import { DataService } from '../../services/data.service';
import { ServiceUrlConstants, ServerUrl } from '../../shared/service-url-constants';
import { Utility } from '../../shared/utility';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { ProcessContactConstants } from './process-contact.constants';

@Injectable()
export class ProcessContactService {

  private processContacts: ProcessContact[] = [];
  private baseUrl: string =  ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.PROCESSCONTACT;
  authorizedFieldsObjList;
  constructor(private http: Http, private tokenService: TokenService, private authenticationGuard: AuthenticationGuard, private dataService:DataService){
    this.authorizedFieldsObjList = this.dataService.getFeatureFields();
  }

  getProcessContacts(): Observable<ProcessContact[]>{
    const headers = new Headers();
	  headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.get(this.baseUrl,{headers: headers, body:""}).map((response: Response) => response.json());
  }

    getProcessContactList(): Observable<ProcessContact[]> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl, { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    getProcessContact(id: number,processTypeId:number): Observable<ProcessContact> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
       return this.http.get(this.baseUrl + "/" + id + "/" + processTypeId , { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    updateProcessContact(id: number, processTypeId:number,processContact: ProcessContact) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.patch(this.baseUrl + "/" + id + "/" + processTypeId, processContact, { headers: headers });
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

    addProcessContact(processContact: ProcessContact) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.baseUrl, processContact, { headers: headers }).map((response: Response) => response.json());
    }

    deleteProcessContact(processContactId: number) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.delete(this.baseUrl + "/" + processContactId, { headers: headers, body: "" });
    }

    getPTOfficer() {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl + "/getPTOfficer", { headers: headers, body: "" }).map((response: Response) => response.json());
     }

    getRelatedToList(id: Number): Observable<any> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl + "/" + "relatesTo/" + id, { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    getProcessTypeExcludeList(): Observable<any> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
       return this.http.get(this.baseUrl + "/filterProcessTypeList" , { headers: headers, body: "" }).map((response: Response) => response.json());  
    }
  getProcessContactCrd(data): Observable<any> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.baseUrl + "/crd", data, { headers: headers }).map((response: Response) => response.json());
    }
    removeConstantsFields(obj){
        obj.createdDate = null;
        obj.createdBy = null;
        obj.createdByUserId = null;
        obj.modifiedBy = null;
        obj.modifiedByUserId = null;
        obj.modifiedDate = null;
        obj.deletedDate = null;
        return obj;
    }

     getRequestFilteredTypeList(providerId : number): Observable<any> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
       return this.http.get(this.baseUrl + "/filterNSIProvisionList/"+providerId, { headers: headers, body: "" }).map((response: Response) => response.json());
    }

     processTypeByRelatesTo(processContact: ProcessContact): Observable<any> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
       return this.http.post(this.baseUrl + "/process-type-filter/processTypeByRelatesTo", processContact, { headers: headers }).map((response: Response) => response.json());
    }
    isAuthorize(profileId: number,action:string): Observable<ProcessContact> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
      // return this.http.get("http://localhost:4103/processcontact" + "/authorize/" + profileId + "/" + action ,{ headers: headers, body: "" }).map((response: Response) => {
      return this.http.get(this.baseUrl + "/authorize/" + profileId + "/" + action ,{ headers: headers, body: "" }).map((response: Response) => {
            if(response.text() !=null && response.text()!=""){
                return response.json()
            }else{
                return {};
            }
        });
    }

    getUnitsCode(id: number): Observable<any> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
          return this.http.get(this.baseUrl + "/units/"+ id, { headers: headers, body: "" }).map((response: Response) => {
            if(response.text() !=null && response.text()!=""){
                return response.json()
            }else{
                return {};
            }
        });
      // return this.http.get("http://localhost:4103/processcontact" + "/units/"+ id, { headers: headers }).map((response: Response) => response.json());
    }
    
  }


