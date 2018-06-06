import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccordionComponent, AccordionTab } from './accordion.component';
import { AccordionHeaderComponent } from './accordion-header/accordion-header.component';

@NgModule({
    imports: [CommonModule],
    exports: [AccordionComponent,AccordionTab, AccordionHeaderComponent],
    declarations: [AccordionComponent,AccordionTab, AccordionHeaderComponent]
})
export class AccordionModule { }
