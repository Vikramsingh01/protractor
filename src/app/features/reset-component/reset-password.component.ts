import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";

import { Observable } from 'rxjs';
import { Http, Headers, Response, URLSearchParams } from "@angular/http";
import { TokenService } from '../../services/token.service';
import { ServiceUrlConstants, ServerUrl } from '../../shared/service-url-constants';
import { DataService } from '../../services/data.service';
import { AuthorizationService } from '../../services/authorization.service';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Utility } from '../../shared/utility';
import { HeaderService } from '../../views/header/header.service';
import { ResetPasswordService } from '../../features/reset-component/resetPassword.service';
import { ResetPasswod } from '../../features/reset-component/reset-password';
import { Subscription } from "rxjs/Rx";
import { ReCaptchaComponent } from 'angular2-recaptcha/lib/captcha.component';
import { LoginService } from '../../views/login/login.service';
import { ValidationService } from "../../generic-components/control-messages/validation.service";
import { Config } from '../../configuration/config';
@Component({
  selector: 'tr-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  providers: [ResetPasswordService]
})
export class ResetPasswordComponent implements OnInit {

  @ViewChild(ReCaptchaComponent) captcha: ReCaptchaComponent;
  forgotResetPasswordForm: FormGroup;
  resetPasswod: ResetPasswod[];
  resetPasswodValue: any;
  checkCapchaValue: boolean;
  resetPasswodToken: any;
  invalidPasswordMessage;
  constructor(private resetPasswordService: ResetPasswordService,
    private router: Router,
    private route: ActivatedRoute,
    private headerService: HeaderService,
    private loginService: LoginService,
    private _fb: FormBuilder,
    private dataService: DataService,
    private http: Http, private tokenService: TokenService) { }

  ngOnInit() {
    let config = Config.getInstance();
    this.invalidPasswordMessage = config['invalid-password-message'];
     this.headerService.changeLoginStatus(false);
     if (this.tokenService.getToken() != "" && this.tokenService.getToken() != null) {
      this.loginService.logout(this.tokenService.getToken()).subscribe(logoutStatus => {
       this.tokenService.setToken('');
    });  }
    let resetPasswodV: ResetPasswod = new ResetPasswod();
    this.route.queryParams.subscribe(params => {
      resetPasswodV.token = params['token'];
      this.resetPasswordService.resetPasswordTokenProfileCreate(resetPasswodV).subscribe((data: any) => {
        // forcefully logout user


        this.resetPasswodValue = data;
        this.forgotResetPasswordForm.value.userId = data.userId;
    //     this.router.navigate(['../login/forgot-password']);
      }, (err) => {
        let errorObj = err.json();
        let errors = errorObj.message;
        this.headerService.setErrorPopup({ "errorMessage": errors });
        this.router.navigate(['../login/forgot-password']);
      });
    });

    this.forgotResetPasswordForm = this._fb.group({

       newPassword: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(32),  ValidationService.passwordValidator])],
       confirmPassword: ['', Validators.required],
      token: [resetPasswodV.token]
    }, { validator: this.matchingPasswords('newPassword', 'confirmPassword') });
  }


  matchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey];
      let passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({ notEquivalent: true })
      }
    }
  }


  private captchaResponse(response) {
    let _urlParams = new URLSearchParams();
    var token = this.captcha.getResponse();
    if (token.length != null) {
      this.checkCapchaValue = true;
    }
  }

  /*onSubmit() {

    this.forgotResetPasswordForm.value.userId = this.resetPasswodValue.userId;
    this.resetPasswordService.resetPasswordProfileCreate(this.forgotResetPasswordForm.value).subscribe((response: any) => {
      let responseObj = response.json();
      let responseMessage = response.message;
      this.headerService.setErrorPopup({ "statusCode": response.statusCode, "message": response.message });
      *//*if (response.statusCode == 200) {
        let msg = "<b>Your message has been reset successfully.</b><br><br><b>Please log in here.</b>";
        this.headerService.setAlertPopup(msg);
      }*/
     /* this.router.navigate(['login']);
    }, (err) => {
      let errorObj = err.json();
      let errors = errorObj.message;
      this.headerService.setErrorPopup({ errors });
      this.headerService.setErrorPopup({ "statusCode": err.status, "message": errors });
    });
  }*/

onSubmit()
{
this.forgotResetPasswordForm.value.userId = this.resetPasswodValue.userId;
this.resetPasswordService.resetPasswordProfileCreate(this.forgotResetPasswordForm.value).subscribe((response: any) => {
      if (response.statusCode == 200) {
        //let msg = "<b>Your password has been reset successfully.</b><br><br><b>Please log in.</b>";
         let msg = "Your password has been reset successfully.Please log in again.";
        this.headerService.setErrorPopup({errorMessage: 'Your password has been reset successfully.Please log in again.'});
        //   this.headerService.setAlertPopup(msg);
       this.router.navigate(['../login']);
      this.router.navigate(['../login']);
      }else if(response.statusCode == 400){
        response.errorMessage = response.message;
       this.headerService.setErrorPopup(response);
      }

      }, (err) => {
        let errorObj  =  err.json();
        let errors = errorObj.message;
        //this.headerService.setErrorPopup({errors});

        this.headerService.setErrorPopup({"statusCode":err.status,"errorMessage": errors});

      });

}

}

