import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { TransferOutRequestAddComponent } from './transfer-out-request-add/transfer-out-request-add.component';
import { TransferOutRequestDetailComponent } from './transfer-out-request-detail/transfer-out-request-detail.component';
import { TransferOutRequestListComponent } from './transfer-out-request-list/transfer-out-request-list.component';
import { TransferOutRequestService } from './transfer-out-request.service';
import {TransferOutRequestEditComponent} from './transfer-out-request-edit/transfer-out-request-edit.component';
import {TransferOutHistoryListComponent} from './transfer-out-history-list/transfer-out-history-list.component';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [TransferOutRequestAddComponent, TransferOutRequestDetailComponent, TransferOutRequestListComponent,TransferOutRequestEditComponent,TransferOutHistoryListComponent],
  providers: [TransferOutRequestService],
  exports: [TransferOutRequestAddComponent, TransferOutRequestDetailComponent, TransferOutRequestListComponent, SharedModule,TransferOutRequestEditComponent,TransferOutHistoryListComponent]
})
export class TransferOutRequestModule {}