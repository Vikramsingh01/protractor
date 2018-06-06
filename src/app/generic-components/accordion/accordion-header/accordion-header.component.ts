import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'tr-accordion-header',
  templateUrl: './accordion-header.component.html',
  styles: []
})
export class AccordionHeaderComponent implements OnInit {
  @Input() auth: boolean;
  @Input() link: any[];
  @Input() label: boolean;

  
  constructor() { }

  ngOnInit() {
  }

}
