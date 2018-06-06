import { Injectable } from '@angular/core';
import { UpwAppointment } from "./upw-appointment";
import { TokenService } from '../../services/token.service';
import { Http, Headers, Response, URLSearchParams, RequestOptions } from "@angular/http";
import { Observable } from "rxjs";
import { DataService } from '../../services/data.service';
import { ServiceUrlConstants, ServerUrl } from '../../shared/service-url-constants';
import { Utility } from '../../shared/utility';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { UpwAppointmentConstants } from './upw-appointment.constants';

@Injectable()
export class UpwAppointmentService {

    private upwAppointmentList: UpwAppointment[] = [];
    private baseUrl: string  = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.UpwAppointment;

    constructor(private http: Http, private tokenService: TokenService, private dataService: DataService) {

    }

    getUpwAppointmentList(): Observable<UpwAppointment[]> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl, { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    getUpwAppointment(id: number): Observable<UpwAppointment> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl + "/" + id, { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    getUpwAppointmentForAllCrc(id: number): Observable<UpwAppointment> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl + "/forAllCrc/" + id, { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    updateUpwAppointment(id: number, upwAppointment: UpwAppointment) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.patch(this.baseUrl + "/" + id, upwAppointment, { headers: headers });
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

    getUPWData(upwData){
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.baseUrl + "/search", upwData, { headers: headers }).map((response: Response) => response.json());
    }

    addUpwAppointment(upwAppointment: UpwAppointment) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.baseUrl, upwAppointment, { headers: headers }).map((response: Response) => response.json());
    }
    checkduplicateAppointment(upwAppointment: UpwAppointment): Observable<any>
    {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.baseUrl+"/checkDuplicateSingleAppointment", upwAppointment, { headers: headers }).map((response: Response) => response.json());
        
    }
    addRecurringUpwAppointment(upwAppointment: UpwAppointment) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.baseUrl+"/recurring", upwAppointment, { headers: headers }).map((response: Response) => response.json());
    }

    bulkUpdateUpwAppointment(upwAppointments) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.baseUrl+"/bulk-update", upwAppointments, { headers: headers }).map((response: Response) => response.json());
    }

    deleteUpwAppointment(upwAppointmentId: number) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.delete(this.baseUrl + "/" + upwAppointmentId, { headers: headers, body: "" });
    }


    deleteUpwAppointmentByProjectName(projectName:any,eventId:any,dayofWeek:any) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.delete(this.baseUrl + "/" + projectName+"/"+eventId+"/"+dayofWeek , { headers: headers, body: "" });
    }

    sortFilterAndPaginateForDeleteAppointment(filterObj, paginationObj, sortObj, profileId,eventId) {
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
        return this.http.post(this.baseUrl + "/searchForDelete/"+profileId+"/"+eventId, filterObj, options).map((response: Response) => response.json());
    }

    validate(upwAppointment){
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.baseUrl+"/validate", upwAppointment, { headers: headers }).map((response: Response) => response.json());
    }

     getTotalHoursWorked(obj){
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.baseUrl + "/totalHoursWorked", obj, { headers: headers }).map((response: Response) => response.json());
    }

     getTotalHoursWorkedByEventId(obj){
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.baseUrl + "/totalHoursWorkedByEventId", obj, { headers: headers }).map((response: Response) => response.json());
    }
    getAllocatedServiceUserIdsByAppointmentDateAndProjectName(upwAppointment){
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.baseUrl + "/allocatedServiceUser", upwAppointment, { headers: headers }).map((response: Response) => response.json());
    }

    getAllocatedServiceUserIdsBySpecificAppointmentDateAndProjectName(upwAppointment){
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.baseUrl + "/specificAllocatedServiceUser", upwAppointment, { headers: headers }).map((response: Response) => response.json());
    }

    getUpwAppointmentCrd(data): Observable<UpwAppointment> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.baseUrl + "/crd", data, { headers: headers }).map((response: Response) => response.json());
    }

    sortFilterAndPaginateForProjectAttendence(filterObj, paginationObj, sortObj) {
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
        return this.http.post(this.baseUrl + "/allocatedServiceUserForAppoitmentDateAndTime", filterObj, options).map((response: Response) => response.json());
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
    
      isAuthorize(profileId: number,action:string): Observable<UpwAppointment> {
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

}
