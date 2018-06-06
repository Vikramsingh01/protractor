import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { CustodyPssAddComponent } from './custody-pss-add/custody-pss-add.component';
import { CustodyPssDetailComponent } from './custody-pss-detail/custody-pss-detail.component';
import { CustodyPssListComponent } from './custody-pss-list/custody-pss-list.component';
import { CustodyPssService } from './custody-pss.service';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [CustodyPssAddComponent, CustodyPssDetailComponent, CustodyPssListComponent],
  providers: [CustodyPssService],
  exports: [CustodyPssAddComponent, CustodyPssDetailComponent, CustodyPssListComponent, SharedModule]
})
export class CustodyPssModule {}