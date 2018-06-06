import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { DeregistrationAddComponent } from './deregistration-add/deregistration-add.component';
import { DeregistrationDetailComponent } from './deregistration-detail/deregistration-detail.component';
import { DeregistrationListComponent } from './deregistration-list/deregistration-list.component';
import { DeregistrationService } from './deregistration.service';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [DeregistrationAddComponent, DeregistrationDetailComponent, DeregistrationListComponent],
  providers: [DeregistrationService],
  exports: [DeregistrationAddComponent, DeregistrationDetailComponent, DeregistrationListComponent, SharedModule]
})
export class DeregistrationModule {}