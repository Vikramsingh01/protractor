import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { UpwProjectAddComponent } from './upw-project-add/upw-project-add.component';
import { UpwProjectDetailComponent } from './upw-project-detail/upw-project-detail.component';
import { UpwProjectListComponent } from './upw-project-list/upw-project-list.component';
import { UpwProjectService } from './upw-project.service';
import { AddressGenericModule } from "../../generic-components/address-generic/address-generic.module";
import { UpwProjectDiaryModule } from '../../features/upw-project-diary/upw-project-diary.module';
@NgModule({
  imports: [CommonModule, SharedModule, AddressGenericModule, UpwProjectDiaryModule],
  declarations: [UpwProjectAddComponent, UpwProjectDetailComponent, UpwProjectListComponent],
  providers: [UpwProjectService],
  exports: [UpwProjectAddComponent, UpwProjectDetailComponent, UpwProjectListComponent, AddressGenericModule, SharedModule]
})
export class UpwProjectModule { }