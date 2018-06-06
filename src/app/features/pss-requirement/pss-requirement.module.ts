import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { PssRequirementAddComponent } from './pss-requirement-add/pss-requirement-add.component';
import { PssRequirementDetailComponent } from './pss-requirement-detail/pss-requirement-detail.component';
import { PssRequirementListComponent } from './pss-requirement-list/pss-requirement-list.component';
import { PssRequirementService } from './pss-requirement.service';
import { PssRequirementTerminateComponent } from './pss-requirement-terminate/pss-requirement-terminate.component';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [PssRequirementAddComponent, PssRequirementDetailComponent, PssRequirementListComponent, PssRequirementTerminateComponent],
  providers: [PssRequirementService],
  exports: [PssRequirementAddComponent, PssRequirementDetailComponent, PssRequirementListComponent, SharedModule]
})
export class PssRequirementModule {}