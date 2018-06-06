import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { DataService } from '../../services/data.service';
import { HeaderService } from './header.service';
import { Router } from '@angular/router';
import { LoginService } from '../login/login.service';
import { ValidationService } from './../../generic-components/control-messages/validation.service';
import { NgForm, FormGroup, FormBuilder, FormControl, AbstractControl, Validators, ValidatorFn } from "@angular/forms";
import { ChangePasswod } from '../../features/change-password/change-password';
import { ChangePasswordService } from '../../features/change-password/changePasswod.service';
import { AuthorizationService } from '../../services/authorization.service';
import { Config } from '../../configuration/config';
@Component({
  selector: 'tr-header',
  templateUrl: './header.component.html',
  styles: ['./header.component.css'],
  providers: [ChangePasswordService,TokenService,ChangePasswod,AuthorizationService]
})
export class HeaderComponent implements OnInit {

  leftMenu: boolean = true;
  @Input() isLoggedIn: boolean = false;
  @Input() isLoggedOut: boolean = false;
  showLogoutMenu = false;
  droparrow: boolean = true;
  firstName: string;
  loggedInUserName: String;
  daysLeft: String;
  startUpUrl: String;
  private loggedInUser:any;
  isChangePassword: boolean = false;
  invalidPasswordMessage;
  myForm: FormGroup;
  constructor(private tokenService: TokenService,private _fb: FormBuilder,private changePasswod:ChangePasswod,
     private changePasswordService : ChangePasswordService, private router: Router, private headerService: HeaderService,
    private loginService: LoginService, private dataService: DataService, private authorizationService: AuthorizationService) {

    router.events.subscribe(data => {
      this.startUpUrl= data.url;
    });

    this.headerService.login.subscribe(loginStatus => {
      this.isLoggedIn = loginStatus;
    });
    this.headerService.loginStatus.subscribe(loginStatus => {
      this.isLoggedIn = loginStatus;
    });
    this.headerService.loggedInUsername.subscribe(username => {
      this.loggedInUserName = username;
    })
     this.headerService.loggedInUser.subscribe(user => {
      this.loggedInUser = user;
    })
    this.headerService.logoutUser.subscribe(logoutUserFlag => {
      if(logoutUserFlag) {
        this.logout();
      }
    })

  }

  ngOnInit() {
    let config = Config.getInstance();
    this.invalidPasswordMessage = config['invalid-password-message'];
    this.headerService.getDaysLeft().subscribe(data=>{
     this.daysLeft= data;
    })

 //    this.daysLeft=localStorage.getItem('daysLeft');
    this.loggedInUserName = localStorage.getItem("loggedInUserName");
    this.loggedInUser=this.dataService.getLoggedInUser();
    if (this.tokenService.getToken() == "" || this.tokenService.getToken() == null) {
           this.isLoggedIn = false;
    } else {
      this.isLoggedIn = true;
       this.daysLeft = this.dataService.getPasswordChangeDaysLeft();
    }
     this.myForm = this._fb.group({
      userId: [this.dataService.getLoggedInUserId()],
      oldPassword: ['', Validators.required],
        newPassword: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(32)])],
        confirmPassword:  ['', Validators.required],

        },{validator: this.matchingPasswords('newPassword', 'confirmPassword')}
        );
  }

  updateConfirmPassword()
{
      this.myForm.controls['confirmPassword'].setValue("");
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
    this.dataService.clearEventData();
    this.headerService.setErrorPage(false);
    this.headerService.changeLoading(false);
    this.router.navigate(['/login']);
  }
onSubmit()
{

this.changePasswordService.changePasswordProfileCreate(this.myForm.value).subscribe((response: any) => {

if (response.statusCode == 200) {
         let msg = "Your password has been changed, select OK to sign in with new credentials";
        this.headerService.setErrorPopup({errorMessage: msg});
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
  changePassword(){
    this.authorizationService.validateToken(this.tokenService.getToken()).subscribe(res=>{
      this.isChangePassword = true;
    });

  }

  cancelClicked(){

     this.authorizationService.validateToken(this.tokenService.getToken()).subscribe(res=>{
  this.myForm.controls['oldPassword'].setValue('');
          this.myForm.controls['newPassword'].setValue('');
             this.myForm.controls['confirmPassword'].setValue('')
            //  this.myForm.controls['confirmPassword'].setErrors(null)

    });
  }
  toggleLeftMenu() {

    this.leftMenu = !this.leftMenu;
    this.headerService.toggleLeftMenu(this.leftMenu);
  }

}
