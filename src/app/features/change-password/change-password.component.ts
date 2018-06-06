import { ValidationService } from './../../generic-components/control-messages/validation.service';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, FormControl, AbstractControl, Validators, ValidatorFn } from "@angular/forms";

import { User } from './user.interface';
import { Observable } from 'rxjs';
import {Http, Headers, Response, URLSearchParams} from "@angular/http";
import { TokenService } from '../../services/token.service';
import { ServiceUrlConstants, ServerUrl } from '../../shared/service-url-constants';
import { ChangePasswod } from '../../features/change-password/change-password';
import { ChangePasswordService } from '../../features/change-password/changePasswod.service';
import 'rxjs/add/operator/debounceTime';


import { DataService } from '../../services/data.service';
import { AuthorizationService } from '../../services/authorization.service';
import { Router, ActivatedRoute } from "@angular/router";
import { Utility } from '../../shared/utility';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { ListService } from '../../services/list.service';
import { FilterPipe } from '../../generic-components/filter/filter.pipe';
import { HeaderService } from '../../views/header/header.service';
import {ReCaptchaComponent} from 'angular2-recaptcha/lib/captcha.component';
import { Config } from '../../configuration/config';
import { LoginService } from '../../views/login/login.service';

@Component({
  selector: 'tr-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
  providers: [ChangePasswordService]
})
export class ChangePasswordComponent implements OnInit {

//    @ViewChild(ReCaptchaComponent) captcha:ReCaptchaComponent;
  @Input() isLoggedIn: boolean = false;
    changePasswods : ChangePasswod[];
    myForm: FormGroup;
    private error: boolean = false;
     checkCapchaValue: boolean;
     private passwordMessage: string;
     invalidPasswordMessage;
  constructor(private _fb: FormBuilder,
   private loginService: LoginService,
   private http: Http,
   private tokenService: TokenService,
   private changePasswordService : ChangePasswordService,
   private dataService: DataService,
   private router: Router,private route: ActivatedRoute,
   private headerService: HeaderService)
   {
   }

  ngOnInit()
  {
    let config = Config.getInstance();
    this.invalidPasswordMessage = config['invalid-password-message'];
   let changePasswod: ChangePasswod = new ChangePasswod();


    this.myForm = this._fb.group({
      userId: [this.dataService.getLoggedInUserId()],
      oldPassword: ['', Validators.required],
        newPassword: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(32), ValidationService.passwordValidator])],
        confirmPassword:  ['', Validators.required],

        },{validator: this.matchingPasswords('newPassword', 'confirmPassword')}
        );

        // const confirmPasswordControl = this.myForm.get('confirmPassword');
        // confirmPasswordControl.valueChanges.debounceTime(1000).subscribe(
        //   confirmPasswordControl.setValidators(Validators.compose(this.matchingPasswords)));
   }

  matchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
  return (group: FormGroup) => {
    let passwordInput = group.controls[passwordKey];
    let passwordConfirmationInput = group.controls[passwordConfirmationKey];
    if (passwordInput.value !== passwordConfirmationInput.value) {
      return passwordConfirmationInput.setErrors({notEquivalent: true})
    }
  }
}


updateConfirmPassword()
{
      this.myForm.controls['confirmPassword'].setValue("");
}

/*private captchaResponse(response)
 {
   let _urlParams = new URLSearchParams();
   var token = this.captcha.getResponse();
   if(token.length != null)
   {
    this.checkCapchaValue = true;
   }
}*/

  logout() {
    if(this.tokenService.getToken() != null && this.tokenService.getToken() != "") {
      this.loginService.logout(this.tokenService.getToken()).subscribe(logoutStatus => {
        //this.logout = logoutStatus;
      });
    }
    this.tokenService.setToken("");
    this.headerService.changeLogin(false);
    this.isLoggedIn = false;
    this.dataService.setFeatures([]);
    this.dataService.setFeatureActions([]);
    this.dataService.setFeatureFields([]);
    this.dataService.setListData([]);
    this.dataService.setDrsRequestCRNs([]);
    this.headerService.setErrorPage(false);
    this.headerService.changeLoading(false);
    this.router.navigate(['/login']);
  }

onSubmit()
{
this.changePasswordService.changePasswordProfileCreate(this.myForm.value).subscribe((response: any) => {

if (response.statusCode == 200) {
         let msg = "Your password has been changed successfully.Please log in again.";
        this.headerService.setErrorPopup({errorMessage: 'Your password has been changed successfully.Please log in again.'});
      this.logout();
      }else if(response.statusCode == 400){
        response.errorMessage = response.message;
       this.headerService.setErrorPopup(response);
      }

      }, (err) => {
        let errorObj  =  err.json();
        let errors = errorObj.message;
        this.headerService.setErrorPopup({"statusCode":err.status,"errorMessage": errors});
      });


}
}




