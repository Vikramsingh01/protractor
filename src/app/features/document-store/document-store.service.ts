import { Injectable } from '@angular/core';
import { DocumentStore, EntityType } from './document-store';
import { TokenService } from '../../services/token.service';
import { Http, Headers, Response, URLSearchParams, RequestOptions, ResponseContentType } from "@angular/http";
import { Observable } from "rxjs";
import { DataService } from '../../services/data.service';
import { ServiceUrlConstants, ServerUrl } from '../../shared/service-url-constants';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderService } from '../../views/header/header.service';
@Injectable()
export class DocumentStoreService {
    private static DOCUMENT_TYPE: string = 'DOCUMENT';
    private static EXTENSIONS_ALLOWED: string[] = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/png",
        "image/jpeg"];
    private baseUrl: string = ServerUrl(ServiceUrlConstants.DRS) + ServiceUrlConstants.DOCUMENTSTORE;

   constructor(private http: Http, private tokenService: TokenService, private dataService: DataService, private headerService: HeaderService, private router: Router,
        private route: ActivatedRoute) { }
     
     allowedExtension(uploadeDoc: File) {
        let fileType = uploadeDoc.type;
        
        if (DocumentStoreService.EXTENSIONS_ALLOWED.indexOf(fileType) > -1) {
            return true;
        } else {
            this.headerService.setErrorPopup({ 'errorMessage': 'Cannot upload the file, the format is not supported. \n Please choose another format and try again.\n Accepted formats include: DOC / DOCX / JPEG / PDF / PNG.' });
            return false;
        }
    }
    
addDocumet(documentStore: DocumentStore, uploadedDoc: File, crn: number, toProvider: string) {
        let xhr = new XMLHttpRequest(), formData = new FormData();
        let et: EntityType = JSON.parse(documentStore.entityType);
        formData.append('crn', crn);
        formData.append('entityType', 'CONTACT');
        formData.append('entityId', documentStore.linkedToId);
        formData.append('documentType', 'DOCUMENT');
        formData.append('documentName',documentStore.documentName);
        formData.append('document', uploadedDoc, uploadedDoc.name);
        formData.append('createdProvider', toProvider);
        formData.append('authorProvider', toProvider);
        if (documentStore.isReadOnly == null) {
            formData.append('readOnly', false);
        } else {
            formData.append('readOnly', documentStore.isReadOnly);
        }

        xhr.open('POST', this.baseUrl + "/upload");
        xhr.setRequestHeader("X-Authorization", this.tokenService.getToken());
        xhr.send(formData);
        return xhr;
    }

 getDocumentList(crn: string,filterObj, paginationObj, sortObj): Observable<any> {
         const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        let searchParams: URLSearchParams = new URLSearchParams();
        let filterFields = Object.keys(filterObj);
        filterFields.forEach(field => {
            if (filterObj[field] != null && filterObj[field] != "") {
                searchParams.append(field, filterObj[field]);
            }
        })
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
        return this.http.get(this.baseUrl + "/search/" + crn, { headers: headers, search: searchParams }).map((response: Response) => response.json());
     }

    sortFilterAndPaginate(crn,filterObj, paginationObj, sortObj) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        let searchParams: URLSearchParams = new URLSearchParams();
        let filterFields = Object.keys(filterObj);
        filterFields.forEach(field => {
            if (filterObj[field] != null && filterObj[field] != "") {
                searchParams.append(field, filterObj[field]);
            }
        })
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
        return this.http.get(this.baseUrl + "/filter/" + crn, { headers: headers, search: searchParams }).map((response: Response) => response.json());
    }

    downloadDocument(documentAlfrescoId: string) {
        let xhr = new XMLHttpRequest(), formData = new FormData();
        xhr.open('GET', this.baseUrl + "/fetch/" + documentAlfrescoId);
        xhr.setRequestHeader("X-Authorization", this.tokenService.getToken());
        xhr.responseType="arraybuffer";
        xhr.send();
        return xhr;
    }

    getTemplateNameList(): Observable<any> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl + "/getTemplateList" ,{headers: headers, body:""}).map((response: Response) => response.json());
    }
    
    generateLetter(contactId: number,letter: String): Observable<any>{
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(ServerUrl(ServiceUrlConstants.CMS) +ServiceUrlConstants.CONTACT + "/" + contactId  + "/" + "generateLetter/" + letter,{ headers: headers, responseType: ResponseContentType.Blob, body: "" });
    }
}
