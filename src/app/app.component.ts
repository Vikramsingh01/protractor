import { Component, OnInit, EventEmitter, Output, HostListener } from '@angular/core';
import { Http } from '@angular/http';
import { Router, ActivatedRoute, NavigationStart, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './views/header/header.component';
import { LeftPanelComponent } from './views/left-panel/left-panel.component';
import { FooterComponent } from './views/footer/footer.component';
import { HeaderService } from './views/header/header.service';
import { TokenService } from './services/token.service';
import { DataService } from './services/data.service';
import { AuthorizationService } from './services/authorization.service';
import { HttpInterceptor } from './guards/http-interceptor';
import { environment } from '../environments/environment';
import { Idle } from '../app/generic-components/idle/idle';
import { Location } from '@angular/common';
import { BreadcrumbMappingService } from './generic-components/breadcrumb/breadcrumb-mapping-service';
import { LoginService } from "./views/login/login.service";
import { AppService } from './app.service'
@Component({
  selector: 'tr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isLoggedIn: boolean = false;
  environment = environment;
  appLoading: boolean = false;
  toBeShown = false;
  isServiceUser = false;
  errorPopup = {};
  alertPopUp = {};
  idleState = 'Not started.';
  timedOut = false;
  isErrorPage: boolean = false;
  private loggedInUser:any;
  constructor(private tokenService: TokenService, private route: ActivatedRoute, private headerService: HeaderService, public router: Router,
    private dataService: DataService,
    private authorizationService: AuthorizationService,
    private idle: Idle, private appService: AppService,
    private location: Location,
    private breadcrumbMappingService: BreadcrumbMappingService
  ) {


    this.headerService.errorPageCommand.subscribe(data => {
      this.isErrorPage = data;
    });
    this.headerService.login.subscribe(loginStatus => {
      this.isLoggedIn = loginStatus;
      if(loginStatus == false){
        this.dataService.setFeatures([]);
        this.dataService.setFeatureActions([]);
        this.dataService.setFeatureFields([]);
        this.dataService.setListData([]);
        this.dataService.setDrsRequestCRNs([]);
        var resetUrlIndex=this.router.url.indexOf("reset-component");
        if(resetUrlIndex>0){
        this.router.navigate(['/login']);
      }

      }
    });
    this.headerService.loginStatus.subscribe(loginStatus => {
      this.isLoggedIn = loginStatus;
      if(loginStatus == false){
        this.dataService.setFeatures([]);
        this.dataService.setFeatureActions([]);
        this.dataService.setFeatureFields([]);
        this.dataService.setListData([]);
        this.dataService.setDrsRequestCRNs([]);

      }
    });
    this.headerService.loading.subscribe(loadingStatus => {
      this.appLoading = loadingStatus;
    });

    this.headerService.alertPopup.subscribe(data => {
      this.alertPopUp = data
    })
    appService.changeTimeOut.subscribe(object => {
      idle.setIdle(object.IdelTime);
      idle.setTimeout(object.TimeOut);

      idle.onTimeout.subscribe(() => {
        this.tokenService.setToken("");
        this.headerService.changeLogin(false);
        this.isLoggedIn = false;
        this.headerService.setErrorPopup({});
        this.dataService.setFeatures([]);
        this.dataService.setFeatureActions([]);
        this.dataService.setFeatureFields([]);
        //this.dataService.setListData([]);
        this.dataService.setDrsRequestCRNs([]);

        this.router.navigate(['/login']);
        this.timedOut = false
      });

      idle.onTimeoutWarning.subscribe((countdown) => {
        if(this.isLoggedIn){
          this.idleState = 'Your session has been inactive for several minutes. It will expire in approximately ' + countdown + ' seconds. To remain logged in, click the button below'
          this.timedOut = true
        }

      }
      );

      this.idle.watch();
    })

  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.keyCode == 27) {
      this.errorPopup = {};
    }
  }


  closePopup() {

    this.errorPopup = {};
  }
  closeAlertPopUp() {
    this.alertPopUp = {}
    this.location.back();
  }
  resume() {

    this.authorizationService.validateToken(this.tokenService.getToken()).subscribe((response: any) => {

    });
    this.timedOut = false
    this.idle.stop();
    this.idle.watch();
  }

  ngOnInit() {


    this.breadcrumbMappingService.constructBreadcrumbMapping();

    this.headerService.errorPopup.subscribe(error => {
      this.errorPopup = error;
    });


    this.router.events.subscribe((event: any): void => {
      if (event.url.indexOf("login") < 0 && event.url.indexOf("error") < 0) {
        if (this.tokenService.getToken() == "" || this.tokenService.getToken() == null) {
          this.isLoggedIn = false;
          this.headerService.changeLogin(false);
          this.dataService.setFeatures([]);
          this.dataService.setFeatureActions([]);
          this.dataService.setFeatureFields([]);
          this.router.navigate(['/login']);
        }
      }
      this.navigationInterceptor(event);
      if (event instanceof NavigationEnd) {
        this.appService.addUrlToPageList(event.url);
      }
    });



    if (this.tokenService.getToken() == "" || this.tokenService.getToken() == null) {
      this.isLoggedIn = false;
      this.headerService.changeLogin(false);
      this.dataService.setFeatures([]);
      this.dataService.setFeatureActions([]);
      this.dataService.setFeatureFields([]);
    } else {
      this.authorizationService.validateToken(this.tokenService.getToken()).subscribe((res: any) => {
        if(res._body == null || res._body == ""){
          this.isLoggedIn = false;
          this.headerService.changeLogin(false);
          this.dataService.setFeatures([]);
          this.dataService.setFeatureActions([]);
          this.dataService.setFeatureFields([]);
          this.router.navigate(['/login']);

        }else{
          let response = JSON.parse(res._body);
          if(response.hasOwnProperty("userId") && response.hasOwnProperty("username")
            && response.userId != null && response.userId != "" && response.username != null && response.username != ""){
              this.isLoggedIn = true;
            }else{
              this.isLoggedIn = false;
              this.headerService.changeLogin(false);
              this.dataService.setFeatures([]);
              this.dataService.setFeatureActions([]);
              this.dataService.setFeatureFields([]);
              this.router.navigate(['/login']);
            }
        }

        //console.log(res);
      },
        error => {
          //if (error.status = "401") {
          this.isLoggedIn = false;
          this.headerService.changeLogin(false);
          this.dataService.setFeatures([]);
          this.dataService.setFeatureActions([]);
          this.dataService.setFeatureFields([]);
          this.router.navigate(['/login']);
          //}
          //console.log(error);
        })

    }





  }

  navigationInterceptor(event): void {
    // this.route.params.subscribe((params: any) => {
    //   console.log(event);
    //   if (params.hasOwnProperty('profileId')) {
    //     this.headerService.toBeShown.emit(true);
    //   }
    //   else{
    //     this.headerService.toBeShown.emit(false);
    //   }

    // })

    if (event instanceof NavigationStart) {
      if(event.url.search("/([a-z]*)-service-user") >=0){
        this.isServiceUser = true;
      }
      else{
        this.isServiceUser = false;
      }

      if (event.url.indexOf("/my-service-user/") >= 0 || event.url.indexOf("/team-service-user/") >= 0 || event.url.indexOf("/crc-service-user/") >= 0 || event.url.indexOf("/pending-transfer/") >= 0 || event.url.indexOf("/admin-court-work/") >= 0 || event.url.indexOf("/enforcement/") >= 0 || event.url.search(new RegExp("cm-actions\/[0-9]*\/[0-9]*"))>=0 || event.url.search(new RegExp("cm-actions\/refer-to-casemanager\/[0-9]*\/[0-9]*")) >=0 || event.url.search(new RegExp("cm-actions\/alert\/[0-9]*\/[0-9]*"))>=0 || event.url.search(new RegExp("cm-actions\/register-review\/[0-9]*\/[0-9]*"))>=0) {
        //this.headerService.toBeShown.emit(true);
        this.toBeShown = true;
      }
      else {
        //this.headerService.toBeShown.emit(false);
        this.toBeShown = false;
      }
    }
     if (event instanceof NavigationEnd) {
    //   this.appLoading = false;
    if(this.router.url.search("/([a-z]*)-service-user") >=0){
        this.isServiceUser = true;
      }
      else{
        this.isServiceUser = false;
      }
     }
    // Additionally there's NavigationCancel and NavigationError
  }
}
