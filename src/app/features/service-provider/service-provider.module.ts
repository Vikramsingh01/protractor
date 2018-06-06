import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ServiceProviderAddComponent } from './service-provider-add/service-provider-add.component';
import { ServiceProviderDetailComponent } from './service-provider-detail/service-provider-detail.component';
import { ServiceProviderListComponent } from './service-provider-list/service-provider-list.component';
import { ServiceProviderService } from './service-provider.service';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [ServiceProviderAddComponent, ServiceProviderDetailComponent, ServiceProviderListComponent],
  providers: [ServiceProviderService],
  exports: [ServiceProviderAddComponent, ServiceProviderDetailComponent, ServiceProviderListComponent, SharedModule]
})
export class ServiceProviderModule {}