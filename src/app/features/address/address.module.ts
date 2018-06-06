import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { addressAddComponent } from './address-add/address-add.component';
import { addressDetailComponent } from './address-detail/address-detail.component';
import { addressListComponent } from './address-list/address-list.component';
import { addressService } from './address.service';
import { AddressAssessmentListComponent } from '../address-assessment/address-assessment-list/address-assessment-list.component';
import { AddressDetailPendingTransferComponent } from './address-detail-pending-transfer/address-detail-pending-transfer.component';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [addressAddComponent, addressDetailComponent, addressListComponent,AddressAssessmentListComponent,AddressDetailPendingTransferComponent],
  providers: [addressService],
  exports: [addressAddComponent, addressDetailComponent, addressListComponent, SharedModule,AddressAssessmentListComponent, AddressDetailPendingTransferComponent]
})
export class AddressModule {}