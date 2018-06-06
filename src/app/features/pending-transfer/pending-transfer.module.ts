import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { PendingTransferListComponent } from './pending-transfer-list/pending-transfer-list.component';
import { PendingTransferService } from './pending-transfer.service';

import { ConsolatedTransferRequestComponent } from './pending-transfer-requests/consolated-transfer-request-list';
import { PendingTransferRecentAllocatedListComponent } from './pending-transfer-recent-allocated-list/pending-transfer-recent-allocated-list.component';
@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [ PendingTransferListComponent, PendingTransferRecentAllocatedListComponent],
  providers: [PendingTransferService],
  exports: [ PendingTransferListComponent, SharedModule, PendingTransferRecentAllocatedListComponent ]
})
export class PendingTransferModule {}