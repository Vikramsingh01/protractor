import { Component, OnInit, EventEmitter, Output     } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { LoginService } from "./login.service";
import { TokenService } from '../../services/token.service';
import { DataService } from '../../services/data.service';
import { AuthorizationService } from '../../services/authorization.service';
import { ListService } from '../../services/list.service';
import { HeaderService } from '../header/header.service';
import { APPCONSTANTS } from '../../app.constants';
import { Observable } from "rxjs/Rx";
import { Title } from "@angular/platform-browser";
import { ServerUrl } from '../../shared/service-url-constants';

@Component({
  selector: 'tr-login',
  templateUrl: './login.component.html',
  styles: [],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {

  features = [];
  isLoggedIn: boolean = false;
  private loginForm: FormGroup;
  loggedInUserName: EventEmitter<string> = new EventEmitter<string>();
  loggedInUser: EventEmitter<string> = new EventEmitter<string>();
  private loginFailed: boolean = false;
  private loginFailedThired: boolean = false;
   private message;
   intValue : number = 0;
   myName :string;
   alertPopUp = {};


  constructor(private _fb: FormBuilder,
    private tokenService: TokenService,
    private dataService: DataService,
    private router: Router,
    private loginService: LoginService,
    private headerService: HeaderService,
    private authorizationService: AuthorizationService,
    private listService: ListService,
    private titleService: Title) { }

  login() {
    if(this.loginForm.valid){
    this.loginFailed = false;
    this.loginService.login(this.loginForm.value).subscribe((data: any) => {
      if(data.daysLeftToChangePassword != null && data.daysLeftToChangePassword > 0){
        this.headerService.setDaysLeft(data.daysLeftToChangePassword);
        this.dataService.setPasswordChangeDaysLeft(data.daysLeftToChangePassword);
      }
       if(data.isPasswordChangeRequired!=null && data.isPasswordChangeRequired==true){
         if(data.isExistingUser){
           localStorage.setItem("isExistingUserPasswordExpired","true");
         }else{
           localStorage.setItem("isExistingUserPasswordExpired","false");
         }

          this.router.navigate(['/login', 'forgot-password']);
          return;
      }

      this.tokenService.setToken(data.token);
      this.dataService.setLoggedInUserId(data.userId);
      this.dataService.setLoggedInUserName(data.username);
      this.dataService.setLoggedInUser(data.personName+", "+data.provider+", "+data.role);
       this.headerService.changeLoggedInUser(data.personName+", "+data.provider+", "+data.role);
      this.headerService.changeLoggedInUsername(data.username);
      if(APPCONSTANTS.listCache){

      }
      if(APPCONSTANTS.authorizationCache){
        Observable.forkJoin([

          this.listService.getAllAuthorizationFeatureActionData(),
           this.listService.getAllAuthorizationFeatureFieldsData(),
          //this.listService.getAllListData()
           ]).subscribe((data:any)=>{
             this.dataService.setFeatureActions(data[0]);
             this.dataService.setFeatureFields(data[1]);
             this.dataService.setFeatures(data[0]);
             //this.dataService.setListData(data[2]);
             this.headerService.changeLogin(true);
             this.router.navigate(["/my-service-user"]);
           })

        // this.listService.getAllAuthorizationFeatureActionData().subscribe((authorizedFeatureActions: any) => {
        //   this.dataService.setFeatureActions(authorizedFeatureActions);
        // });
        // this.listService.getAllAuthorizationFeatureFieldsData().subscribe((authorizedFeatureFields: any) => {
        //   this.dataService.setFeatureFields(authorizedFeatureFields);
        // });
      }else{
      this.authorizationService.getAuthorizedFeatures(data.userId).subscribe(features => {
        this.dataService.setFeatures(features);
        this.headerService.changeLogin(true);
        this.router.navigate(["/my-service-user"]);
      });
      }

    },
      error => {
        if (error.status == 404 || error.status == 500 || error.status == 0) {
          return false;
        }
        this.loginFailed = true;
        this.message=error.json().message
        // this.message = "Hie";


        var fields = this.message.split('$$$');
  //      console.log(fields);

        if(fields[1] == 1)
    {

      this.message = fields[0];

    }else if(fields[1] == 2)
   {
         this.myName =   "You have made two unsuccesful login attempts.<br>Your account will be locked after third unsuccesful attempt.<br>If you have forgotten the password, Please use 'Forgotten Password' link below.";

           this.message = this.myName;

   }else if(fields[1] == 3)
   {
     this.message = fields[0];
     let firstValue;
     if(this.loginFailedThired == false)
    {
         firstValue = "Your account has been locked, Please try again after 20 minutes";

    this.loginFailedThired = true;
  }else
  {
    firstValue = "Your account has been locked";


  }
      //this.headerService.setErrorPopup({errorMessage: firstValue});
   }
 });
 }
 }

  ngOnInit() {
    this.titleService.setTitle('Login');
    localStorage.clear();
    this.loginForm = this._fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
    // if (this.tokenService.getToken() != "" || this.tokenService.getToken() != null) {
    //   this.authorizationService.validateToken(this.tokenService.getToken()).subscribe(res => {
    //     this.isLoggedIn = true;
    //   },
    //     error => {
    //       this.isLoggedIn = false;
    //       this.headerService.changeLogin(false);
    //       this.dataService.setFeatures([]);
    //       this.dataService.setFeatureActions([]);
    //       this.dataService.setFeatureFields([]);
    //       this.router.navigate(['/login']);
    //     })
    // }
  }
}
