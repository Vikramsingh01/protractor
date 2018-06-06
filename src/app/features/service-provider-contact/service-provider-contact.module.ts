import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ServiceProviderContactAddComponent } from './service-provider-contact-add/service-provider-contact-add.component';
import { ServiceProviderContactDetailComponent } from './service-provider-contact-detail/service-provider-contact-detail.component';
import { ServiceProviderContactListComponent } from './service-provider-contact-list/service-provider-contact-list.component';
import { ServiceProviderContactService } from './service-provider-contact.service';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [ServiceProviderContactAddComponent, ServiceProviderContactDetailComponent, ServiceProviderContactListComponent],
  providers: [ServiceProviderContactService],
  exports: [ServiceProviderContactAddComponent, ServiceProviderContactDetailComponent, ServiceProviderContactListComponent, SharedModule]
})
export class ServiceProviderContactModule {}