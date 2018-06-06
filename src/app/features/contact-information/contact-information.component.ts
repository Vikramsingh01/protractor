import { Component, OnInit } from '@angular/core';
import { Location }               from '@angular/common';
@Component({
  selector: 'tr-contact-information',
  templateUrl: './contact-information.component.html',
  styles: []
})
export class ContactInformationComponent implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {
  }
goBack(): void {
    this.location.back();
  }
}
