import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { CaseManagerAllocationService } from './case-manager-allocation.service';
import { CaseManagerAllocationListComponent } from './case-manager-allocation-list/case-manager-allocation-list.component';
@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [ CaseManagerAllocationListComponent],
  providers: [CaseManagerAllocationService],
  exports: [SharedModule]
})
export class CaseManagerAllocationModule {}