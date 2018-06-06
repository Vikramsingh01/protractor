import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { CustodyLocationAddComponent } from './custody-location-add/custody-location-add.component';
import { CustodyLocationDetailComponent } from './custody-location-detail/custody-location-detail.component';
import { CustodyLocationListComponent } from './custody-location-list/custody-location-list.component';
import { CustodyLocationService } from './custody-location.service';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [CustodyLocationAddComponent, CustodyLocationDetailComponent, CustodyLocationListComponent],
  providers: [CustodyLocationService],
  exports: [CustodyLocationAddComponent, CustodyLocationDetailComponent, CustodyLocationListComponent, SharedModule]
})
export class CustodyLocationModule {}