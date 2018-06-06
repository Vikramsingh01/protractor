import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { OffenderDisabilityAddComponent } from './offender-disability-add/offender-disability-add.component';
import { OffenderDisabilityDetailComponent } from './offender-disability-detail/offender-disability-detail.component';
import { OffenderDisabilityListComponent } from './offender-disability-list/offender-disability-list.component';
import { OffenderDisabilityService } from './offender-disability.service';
import { ProvisionListComponent } from '../provision/provision-list/provision-list.component';
 
@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [OffenderDisabilityAddComponent, OffenderDisabilityDetailComponent, OffenderDisabilityListComponent, ProvisionListComponent],
  providers: [OffenderDisabilityService],
  exports: [OffenderDisabilityAddComponent, OffenderDisabilityDetailComponent, OffenderDisabilityListComponent, SharedModule]
})
export class OffenderDisabilityModule {}