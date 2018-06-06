import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { RecallAddComponent } from './recall-add/recall-add.component';
import { RecallDetailComponent } from './recall-detail/recall-detail.component';
import { RecallListComponent } from './recall-list/recall-list.component';
import { RecallService } from './recall.service';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [RecallAddComponent, RecallDetailComponent, RecallListComponent],
  providers: [RecallService],
  exports: [RecallAddComponent, RecallDetailComponent, RecallListComponent, SharedModule]
})
export class RecallModule {}