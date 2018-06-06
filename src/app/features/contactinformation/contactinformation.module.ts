import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { contactinformationAddComponent } from './contactinformation-add/contactinformation-add.component';
import { contactinformationDetailComponent } from './contactinformation-detail/contactinformation-detail.component';
import { contactinformationService } from './contactinformation.service';
import { AddressModule } from '../address/address.module'; 
import { NetworkModule } from '../network/network.module';  


@NgModule({
  imports: [CommonModule, SharedModule,AddressModule,NetworkModule],
  declarations: [contactinformationAddComponent, contactinformationDetailComponent],
  providers: [contactinformationService],
  exports: [contactinformationAddComponent, contactinformationDetailComponent, SharedModule]
})
export class contactinformationModule {}