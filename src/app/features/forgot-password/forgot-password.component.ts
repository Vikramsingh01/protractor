import { Component, OnInit, Input } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";

import { Observable } from 'rxjs';
import {Http, Headers, Response, URLSearchParams} from "@angular/http";
import { TokenService } from '../../services/token.service';
import { ServiceUrlConstants, ServerUrl } from '../../shared/service-url-constants';
import { DataService } from '../../services/data.service';
import { AuthorizationService } from '../../services/authorization.service';
import { Router, ActivatedRoute } from "@angular/router";
import { Utility } from '../../shared/utility';
import { HeaderService } from '../../views/header/header.service';
import {ForgotPasswordService } from '../../features/forgot-password/forgotPassword.service';

@Component({
  selector: 'tr-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  providers:[ForgotPasswordService]
})
export class ForgotPasswordComponent implements OnInit {

 private message;
 forgotPasswordForm: FormGroup;
 gotNewToken : boolean;
isExistingUserPasswordExpired:boolean = false;
 constructor(private _fb: FormBuilder,
   private http: Http,
   private tokenService: TokenService,
   private forgetPasswordService : ForgotPasswordService,
   private dataService: DataService,
   private router: Router,private route: ActivatedRoute,
   private headerService: HeaderService){ }
   
 ngOnInit() {
   var temp=localStorage.getItem("isExistingUserPasswordExpired");
   if(temp=="true"){
     this.isExistingUserPasswordExpired=true;
   }else{
     this.isExistingUserPasswordExpired=false;
   }
   this.forgotPasswordForm = this._fb.group({
     userName: ['', Validators.required]
   });
   this.gotNewToken = false;
  }

 onSubmit()
{

this.forgetPasswordService.forgotPasswordProfileCreate(this.forgotPasswordForm.value).subscribe((response: any) => {
  next=>{
    this.headerService.setErrorPopup(response);
  }
  if(response.statusCode==200){
    let msg = "<b>Reset password link sent successfully.</b><br><br>A reset password link has been sent to you via email. <br>Please follow the instructions given in the mail to reset your password.";
    response.errorMessage = response.message;
    this.headerService.setAlertPopup(response.message);
  }else if(response.statusCode==400){
    response.errorMessage = response.message;
    this.headerService.setErrorPopup(response);
    return false;
  }
   
  let responseMessage = response.message;
      //  this.gotNewToken = true;
      //   console.log(responseMessage);
      //   this.message=responseMessage;
      //   console.log("Nice");
      //  this.router.navigate(['login']);
      }, (err) => {
        let errorObj  =  err.json();
        let errors = errorObj.message;
        this.headerService.setErrorPopup({errors});
        
        this.headerService.setErrorPopup({"statusCode":err.status,"message": errors});
        
      });

}

}
