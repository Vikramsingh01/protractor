import {Injectable} from '@angular/core';
import { TokenService } from './token.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UploadService {

  filesToUpload: Array<File>;
 
    constructor(private tokenService: TokenService) {
      
        this.filesToUpload = [];
    }
 
    upload() {
        this.makeFileRequest("http://localhost:4105/neo-profile-service-api/upload", [], this.filesToUpload).subscribe((result) => {
            console.log(result);
        }, (error) => {
            console.error(error);
        });
    }
 
    fileChangeEvent(fileInput: any){
      console.log(fileInput);
        this.filesToUpload = <Array<File>> fileInput.target.files;
    }
 
    private makeFileRequest (url: string, params: string[], files: File[]): Observable<any> {
    return Observable.create(observer => {
      let formData: FormData = new FormData(),
        xhr: XMLHttpRequest = new XMLHttpRequest();

      for (let i = 0; i < files.length; i++) {
        formData.append("file", files[i], files[i].name);
      }

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            observer.next(JSON.parse(xhr.response));
            observer.complete();
          } else {
            observer.error(xhr.response);
          }
        }
      };


      xhr.open('POST', url, true);
      var boundary=Math.random().toString().substr(2);
      //xhr.setRequestHeader("Content-Type", "multipart/form-data; boundary=----WebKitFormBoundaryR4BAZGDvIx4zdDRm");
      xhr.setRequestHeader("X-Authorization", this.tokenService.getToken());
      xhr.send(formData);
    });
  }
}