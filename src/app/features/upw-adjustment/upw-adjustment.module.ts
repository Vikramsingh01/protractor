import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { UpwAdjustmentAddComponent } from './upw-adjustment-add/upw-adjustment-add.component';
import { UpwAdjustmentDetailComponent } from './upw-adjustment-detail/upw-adjustment-detail.component';
import { UpwAdjustmentListComponent } from './upw-adjustment-list/upw-adjustment-list.component';
import { UpwAdjustmentService } from './upw-adjustment.service';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [UpwAdjustmentAddComponent, UpwAdjustmentDetailComponent, UpwAdjustmentListComponent],
  providers: [UpwAdjustmentService],
  exports: [UpwAdjustmentAddComponent, UpwAdjustmentDetailComponent, UpwAdjustmentListComponent, SharedModule]
})
export class UpwAdjustmentModule {}