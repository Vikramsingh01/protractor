import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AppService } from '../../app.service';
import { HeaderService } from "../../views/header/header.service";

@Component({
  selector: 'tr-error-page',
  templateUrl: './error-page.component.html'
})

export class ErrorPageComponent implements OnInit {


  public errorPageObj: any = {};

  constructor(private location: Location,
    private router: Router,
    private appService: AppService,
    private headerService: HeaderService) {


    this.headerService.setErrorPage(true);

  }

  ngOnInit() {
  }
  onClick() {
    let pageList = this.appService.getPageList();
    pageList.pop();
    this.appService.clearPageList();
    this.headerService.setErrorPage(false);
    if (pageList.length == 0 || "/login" == pageList[pageList.length - 1]) {
      this.headerService.changeLogoutUser(true);
    } else {
      this.router.navigateByUrl(pageList[pageList.length - 1]);
    }
  }
}
