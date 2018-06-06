import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
//import { TerminateRequirementAddComponent } from './terminate-requirement-add/terminate-requirement-add.component';
// import { TerminateRequirementDetailComponent } from './terminate-requirement-detail/terminate-requirement-detail.component';
import { TerminateRequirementListComponent } from './terminate-requirement-list/terminate-requirement-list.component';
import { TerminateRequirementService } from './terminate-requirement.service';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [ TerminateRequirementListComponent],
  providers: [TerminateRequirementService],
  exports: [ TerminateRequirementListComponent, SharedModule]
})
export class TerminateRequirementModule {}