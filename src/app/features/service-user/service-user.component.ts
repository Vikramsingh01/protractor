import {Component, Input, OnInit,Output} from '@angular/core';
import { Http } from '@angular/http';
import { NgForm } from '@angular/forms';
import {ServiceUserService} from "./service-user.service";
import {ServiceUser} from "./service-user";
import { TokenService } from '../../services/token.service';
import { Router, ActivatedRoute} from "@angular/router";

@Component({
  selector: 'tr-service-user',
  templateUrl: 'service-user.component.html',
  
  providers: [ServiceUserService, TokenService]

})
export class ServiceUserComponent {

  @Input() serviceUserId: number;

  numberOfPages: number[] = [1];

  serviceUsers: ServiceUser[];
  serviceUser: ServiceUser = new ServiceUser();
  tmp_serviceUser: ServiceUser= new ServiceUser();
  defaultItemPerPage: number = 5;
  totalPages = [];
  dropdownItems = [5, 10, 15, 20];
  defaultPageNumber = 0;
  flagForPaginatioStuff: boolean = false;
  constructor(private router: Router,
		private route: ActivatedRoute, private serviceUserService: ServiceUserService) {
  }

  // ngOnInit(){
  //   this.serviceUserService.getServiceUsers().subscribe((data: ServiceUser[]) => {
  //     this.serviceUsers = data;
  //     console.log(this.serviceUsers);
  //   });
  // }



  onSubmit(form: NgForm) {

    console.log("defaultItemPerPage :" + this.defaultItemPerPage);
    this.totalPages = [];
    this.tmp_serviceUser = form.value;
    this.serviceUserService.search(form.value, this.defaultItemPerPage, 0).subscribe((data: any) => {
      // console.log(data);
      this.serviceUsers = data.content;
      for (var i = 1; i <= data.totalPages; i++) {
        this.totalPages.push(i);
      }
      //console.log(this.totalPages);
      form.reset();
      this.flagForPaginatioStuff = true;
    })
  }

  getPage(page: number, itemPerPage: number) {

    console.log("page :" + page, " ,  itemPerPage :" + itemPerPage);
    this.totalPages = [];
    this.serviceUserService.search(this.tmp_serviceUser, itemPerPage, page - 1).subscribe((data: any) => {
      for (var i = 1; i <= data.totalPages; i++) {
        this.totalPages.push(i);
      }
      this.serviceUsers = data.content;

    })
  }

}
