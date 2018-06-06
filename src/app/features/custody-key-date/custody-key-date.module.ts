import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { CustodyKeyDateAddComponent } from './custody-key-date-add/custody-key-date-add.component';
import { CustodyKeyDateDetailComponent } from './custody-key-date-detail/custody-key-date-detail.component';
import { CustodyKeyDateListComponent } from './custody-key-date-list/custody-key-date-list.component';
import { CustodyKeyDateService } from './custody-key-date.service';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [CustodyKeyDateAddComponent, CustodyKeyDateDetailComponent, CustodyKeyDateListComponent],
  providers: [CustodyKeyDateService],
  exports: [CustodyKeyDateAddComponent, CustodyKeyDateDetailComponent, CustodyKeyDateListComponent, SharedModule]
})
export class CustodyKeyDateModule {}