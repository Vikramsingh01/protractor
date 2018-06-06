import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { NetworkAddComponent } from './network-add/network-add.component';
import { NetworkDetailComponent } from './network-detail/network-detail.component';
import { NetworkListComponent } from './network-list/network-list.component';
import { NetworkService } from './network.service';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [NetworkAddComponent, NetworkDetailComponent, NetworkListComponent],
  providers: [NetworkService],
  exports: [NetworkAddComponent, NetworkDetailComponent, NetworkListComponent, SharedModule]
})
export class NetworkModule {}