import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable()
export class HeaderService {

  @Output() login = new EventEmitter();
  @Output() loginStatus = new EventEmitter();
  @Output() logoutUser =new EventEmitter();

  @Output() loading = new EventEmitter();

  @Output() errorPopup = new EventEmitter<any>();
  @Output() alertPopup = new EventEmitter<any>();
  @Output() leftMenu = new EventEmitter();
  @Output() toBeShown: EventEmitter<boolean> = new EventEmitter<boolean>(false);
  @Output() offenderDetails: EventEmitter<any> = new EventEmitter<any>();
  @Output() loggedInUsername : EventEmitter<any> = new EventEmitter<any>();
   @Output() loggedInUser : EventEmitter<any> = new EventEmitter<any>();
  @Output() nsrdDataSource : EventEmitter<any> = new EventEmitter<any>();
  @Output() formSererValidator : EventEmitter<any> = new EventEmitter<any>();
  @Output() errorPageCommand: EventEmitter<any> = new EventEmitter<any>();
  @Output() rasipemmiter = new EventEmitter();
  @Output() passwordChangeReminder:EventEmitter<any>=new EventEmitter<any>();
  @Output() activeBreachEmitter:EventEmitter<any>=new EventEmitter<any>();
  constructor() { }

  changeLogin(status: boolean){
    this.login.emit(status);
  }

  getLogin(){
    return this.login;
  }
  changeLoginStatus(status: boolean){
    this.loginStatus.emit(status);
  }

  getLoginStatus(){
    return this.loginStatus;
  }

  changeLoading(loading: boolean){
    this.loading.emit(loading);
  }

  setAlertPopup(message){
    this.alertPopup.emit(message);
  }

  setErrorPage(data){
    this.errorPageCommand.emit(data);
  }

    setRASIP(data){
    this.rasipemmiter.emit(data);
  }

   getRASIP(){
    return this.rasipemmiter;
  }

  getActiveBreachEmitter() {
    return this.activeBreachEmitter;
  }

  refreshActiveBreach() {
    this.activeBreachEmitter.emit({});
  }

  setformSererValidator(error){
    this.formSererValidator.emit(error);
  }
  setNsrdDataSource(data){
    this.nsrdDataSource.emit(data);
  }
  setErrorPopup(error){
    this.errorPopup.emit(error);
  }


  toggleLeftMenu(leftMenu){
    this.leftMenu.emit(leftMenu);
  }

  toggleOffenderHeader(value){
    this.toBeShown.emit(value);
  }
  publishOffenderDetailsData(offenderDetails:any){
    this.offenderDetails.emit(offenderDetails);
  }
  changeLoggedInUsername(string){
    this.loggedInUsername.emit(string);
  }

   changeLoggedInUser(string){
    this.loggedInUser.emit(string);
  }

    setDaysLeft(data){
    this.passwordChangeReminder.emit(data)
  }

   getDaysLeft(){
    return this.passwordChangeReminder;
  }

  changeLogoutUser(logout: boolean){
    this.logoutUser.emit(logout);
  }
}
