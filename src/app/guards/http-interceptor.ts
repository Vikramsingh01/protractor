import { Injectable, EventEmitter, Output } from '@angular/core';
import { Http, Request, RequestOptionsArgs, Response, XHRBackend, RequestOptions, ConnectionBackend, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import { HeaderService } from '../views/header/header.service';
import { AppService } from '../app.service';
import { ServerUrl } from '../shared/service-url-constants';

@Injectable()
export class HttpInterceptor extends Http {

    private httpRequestsArray: any[] = [];
    constructor(backend: ConnectionBackend, defaultOptions: RequestOptions, private _router: Router, private headerService: HeaderService, private appService: AppService) {
        super(backend, defaultOptions);
    }

    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.get(url, options));
    }

    post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.post(url, body, this.getRequestOptionArgs(options)));
    }

    put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.put(url, body, this.getRequestOptionArgs(options)));
    }

    patch(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.patch(url, body, this.getRequestOptionArgs(options)));
    }

    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.delete(url, options));
    }

    getRequestOptionArgs(options?: RequestOptionsArgs): RequestOptionsArgs {
        if (options == null) {
            options = new RequestOptions();
        }
        if (options.headers == null) {
            options.headers = new Headers();
        }
        //options.headers.append('Content-Type', 'application/json');
        return options;
    }

    intercept(observable: Observable<Response>): Observable<Response> {
        this.httpRequestsArray.push("intercept");
        if (this.httpRequestsArray.length >= 0) {
            this.headerService.changeLoading(true);
        }
        return observable.do(
            null,
            err => {

                this.httpRequestsArray.pop();
                if (err.status == 401){
                    this.headerService.changeLogin(false);

                    this._router.navigate(['/login']);
                }
                if (err.status == 404 || err.status == 424 || err.status == 500 || err.status == 0) {
                    this.headerService.changeLoading(false);
                    if(ServerUrl('production') != null && ServerUrl('production') == 'true') {
                        this._router.navigate(['/error']);

                    }
                    this.appService.setChangeTimeOut(true);
                }
                if (this.httpRequestsArray.length <= 0) {
                    this.headerService.changeLoading(false);
                }
                if (err.status == 403) {
                    // this.headerService.setErrorPopup("Error")
                    var obj = JSON.parse(err._body);
                    this.headerService.setErrorPopup(obj);
                    this.appService.setChangeTimeOut(true);
                }
                if (err.status == 400) {
                    // this.headerService.setErrorPopup("Error")
                    var obj = JSON.parse(err._body);
                    this.headerService.setErrorPopup(obj);
                    this.appService.setChangeTimeOut(true);

                }
                if (err.status == 422) {
                    // this.headerService.setErrorPopup("Error")
                    var obj = JSON.parse(err._body);
                    this.headerService.setformSererValidator(obj.data);
                    this.appService.setChangeTimeOut(true);

                }
            },
            () => {
                this.httpRequestsArray.pop();

                if (this.httpRequestsArray.length <= 0) {
                    this.headerService.changeLoading(false);
                    this.appService.setChangeTimeOut(true);
                }
            }
        );
    }
}
