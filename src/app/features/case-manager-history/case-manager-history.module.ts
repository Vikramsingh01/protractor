import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { CaseManagerHistoryAddComponent } from './case-manager-history-add/case-manager-history-add.component';
import { CaseManagerHistoryDetailComponent } from './case-manager-history-detail/case-manager-history-detail.component';
import { CaseManagerHistoryListComponent } from './case-manager-history-list/case-manager-history-list.component';
import { CaseManagerHistoryService } from './case-manager-history.service';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [CaseManagerHistoryAddComponent, CaseManagerHistoryDetailComponent, CaseManagerHistoryListComponent],
  providers: [CaseManagerHistoryService],
  exports: [CaseManagerHistoryAddComponent, CaseManagerHistoryDetailComponent, CaseManagerHistoryListComponent, SharedModule]
})
export class CaseManagerHistoryModule {}