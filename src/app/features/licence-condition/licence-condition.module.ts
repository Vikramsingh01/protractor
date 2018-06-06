import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { LicenceConditionAddComponent } from './licence-condition-add/licence-condition-add.component';
import { LicenceConditionDetailComponent } from './licence-condition-detail/licence-condition-detail.component';
import { LicenceConditionListComponent } from './licence-condition-list/licence-condition-list.component';
import { LicenceConditionService } from './licence-condition.service';
import { LicenceConditionTerminateComponent } from './licence-condition-terminate/licence-condition-terminate.component';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [LicenceConditionAddComponent, LicenceConditionDetailComponent, LicenceConditionListComponent, LicenceConditionTerminateComponent],
  providers: [LicenceConditionService],
  exports: [LicenceConditionAddComponent, LicenceConditionDetailComponent, LicenceConditionListComponent, SharedModule]
})
export class LicenceConditionModule {}