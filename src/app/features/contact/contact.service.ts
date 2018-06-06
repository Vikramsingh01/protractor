import { Injectable } from '@angular/core';
import { Contact } from "./contact";
import { TokenService } from '../../services/token.service';
import { Http, Headers, Response, URLSearchParams, RequestOptions } from "@angular/http";
import { Observable } from "rxjs";
import { DataService } from '../../services/data.service';
import { ServiceUrlConstants, ServerUrl } from '../../shared/service-url-constants';
import { Utility } from '../../shared/utility';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { ContactConstants } from './contact.constants';

@Injectable()
export class ContactService {

    private contactList: Contact[] = [];
    authorizedFieldsObjList;
    private baseUrl: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.CONTACT;
    
    constructor(private http: Http, private tokenService: TokenService, private dataService: DataService) {

    }

    getContactList(): Observable<Contact[]> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl, { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    getContact(id: number): Observable<Contact> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl + "/" + id, { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    updateContact(id: number, contact: Contact) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.patch(this.baseUrl + "/" + id, contact, { headers: headers });
    }
 getAppointmentType(){
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
      return this.http.get(this.baseUrl + "/appointmenttypes" , { headers: headers, body: "" }).map((response: Response) => response.json());
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
        return this.http.post(this.baseUrl + "/search", filterObj, options).map((response: Response) => response.json());
    }

        getPlanedAppointment(filterObj, paginationObj, sortObj) {
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
        return this.http.post(this.baseUrl + "/planappointment", filterObj, options).map((response: Response) => response.json());
    }

    addContact(contact: Contact) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.baseUrl, contact, { headers: headers }).map((response: Response) => response.json());
    }

    deleteContact(contactId: number) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.delete(this.baseUrl + "/" + contactId, { headers: headers, body: "" });
    }

    isFeildAuthorized(field, action) {
        let authorized = false;
        let authorizedFieldsObj = Utility.getObjectFromArrayByKeyAndValue(this.authorizedFieldsObjList, 'featureId', ContactConstants.featureId);
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


    getRelatedToList(id: Number): Observable<any> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());

        return this.http.get(this.baseUrl + "/" + "relatesTo/" + id, { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    getColourCodes(): Observable<any> {

        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());

        return this.http.get(this.baseUrl + "/" + "colourCodes/", { headers: headers, body: "" }).map((response: Response) => response.json());
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

    getContactCrd(data): Observable<any> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.baseUrl + "/crd", data, { headers: headers }).map((response: Response) => response.json());
    }

    getPTOfficer() {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl + "/getPTOfficer", { headers: headers, body: "" }).map((response: Response) => response.json());
    }



    getEntryTypeByRelatesTo(data): Observable<any> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.baseUrl + "/entrytypebyrelatesto", data, { headers: headers }).map((response: Response) => response.json());
    }

      getEnforcementSummery(eventId): Observable<any> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.baseUrl + "/enforcementsummary/"+eventId, {},{ headers: headers }).map((response: Response) => response.json());
    }

    getProfileIdForContact(contactId: Number) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl + "/profileIdForContact/"+ contactId,{ headers: headers });
    }

    getLoggedInUserTeamId() {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl + "/getTeamId", { headers: headers, body: "" }).map((response: Response) => response.json());
    }

}
