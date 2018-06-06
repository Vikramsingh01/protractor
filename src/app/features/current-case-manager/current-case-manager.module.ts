import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { CurrentCaseManagerDetailComponent } from './current-case-manager-detail/current-case-manager-detail.component';
import { CurrentCaseManagerService } from './current-case-manager.service';
import { CaseManagerHistoryModule } from '../case-manager-history/case-manager-history.module';
import { TransferOutRequestModule } from '../transfer-out-request/transfer-out-request.module';

@NgModule({
  imports: [CommonModule, SharedModule, CaseManagerHistoryModule, TransferOutRequestModule],
  declarations: [CurrentCaseManagerDetailComponent, ],
  providers: [CurrentCaseManagerService],
  exports: [ CurrentCaseManagerDetailComponent, SharedModule, CaseManagerHistoryModule, TransferOutRequestModule ]
})
export class CurrentCaseManagerModule {}