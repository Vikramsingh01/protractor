import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'tr-plan',
  templateUrl: './plan.component.html',
  styles: []
})
export class PlanComponent implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {
  }
goBack(): void {
    this.location.back();
  }
}
