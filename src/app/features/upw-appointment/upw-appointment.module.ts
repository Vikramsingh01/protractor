import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { UpwAppointmentAddComponent } from './upw-appointment-add/upw-appointment-add.component';
import { UpwAppointmentRecurringAddComponent } from './upw-appointment-recurring-add/upw-appointment-recurring-add.component';
import { UpwAppointmentDetailComponent } from './upw-appointment-detail/upw-appointment-detail.component';
import { UpwAppointmentListComponent } from './upw-appointment-list/upw-appointment-list.component';
import { UpwAppointmentService } from './upw-appointment.service';
import { ServiceUserService } from "../service-user/service-user.service";

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [UpwAppointmentAddComponent, UpwAppointmentDetailComponent, UpwAppointmentListComponent, UpwAppointmentRecurringAddComponent],
  providers: [UpwAppointmentService, ServiceUserService],
  exports: [UpwAppointmentAddComponent, UpwAppointmentDetailComponent, UpwAppointmentListComponent, UpwAppointmentRecurringAddComponent, SharedModule]
})
export class UpwAppointmentModule {}