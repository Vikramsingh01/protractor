import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ProvisionAddComponent } from './provision-add/provision-add.component';
import { ProvisionDetailComponent } from './provision-detail/provision-detail.component';
import { ProvisionListComponent } from './provision-list/provision-list.component';
import { ProvisionService } from './provision.service';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [ProvisionAddComponent, ProvisionDetailComponent],
  providers: [ProvisionService],
  exports: [ProvisionAddComponent, ProvisionDetailComponent, SharedModule]
})
export class ProvisionModule {}