import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { UpwProjectDiaryListComponent } from './upw-project-diary-list/upw-project-diary-list.component';
import { UpwProjectDiaryService } from './upw-project-diary.service';
import { ServiceUserService } from "../service-user/service-user.service";

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [UpwProjectDiaryListComponent],
  providers: [UpwProjectDiaryService, ServiceUserService],
  exports: [UpwProjectDiaryListComponent, SharedModule]
})
export class UpwProjectDiaryModule {}
