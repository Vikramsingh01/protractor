import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { UpwDetailAddComponent } from './upw-detail-add/upw-detail-add.component';
import { UpwDetailDetailComponent } from './upw-detail-detail/upw-detail-detail.component';
import { UpwDetailListComponent } from './upw-detail-list/upw-detail-list.component';
import { UpwDetailService } from './upw-detail.service';
import { UpwAppointmentModule } from "../upw-appointment/upw-appointment.module";
import { UpwProjectDeleteListComponent } from '../upw-appointment/upw-appointment-delete/upw-project-delete-list.component';
@NgModule({
  imports: [CommonModule, SharedModule, UpwAppointmentModule],
  declarations: [UpwDetailAddComponent, UpwDetailDetailComponent, UpwDetailListComponent , UpwProjectDeleteListComponent ],
  providers: [UpwDetailService],
  exports: [UpwDetailAddComponent, UpwDetailDetailComponent, UpwDetailListComponent, UpwAppointmentModule, SharedModule,UpwProjectDeleteListComponent]
})
export class UpwDetailModule {}