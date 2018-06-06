import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { PersonalCircumstanceAddComponent } from './personal-circumstance-add/personal-circumstance-add.component';
import { PersonalCircumstanceDetailComponent } from './personal-circumstance-detail/personal-circumstance-detail.component';
import { PersonalCircumstanceListComponent } from './personal-circumstance-list/personal-circumstance-list.component';
import { PersonalCircumstanceService } from './personal-circumstance.service';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [PersonalCircumstanceAddComponent, PersonalCircumstanceDetailComponent, PersonalCircumstanceListComponent],
  providers: [PersonalCircumstanceService],
  exports: [PersonalCircumstanceAddComponent, PersonalCircumstanceDetailComponent, PersonalCircumstanceListComponent, SharedModule]
})
export class PersonalCircumstanceModule { }