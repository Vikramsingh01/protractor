import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ReleaseAddComponent } from './release-add/release-add.component';
import { ReleaseDetailComponent } from './release-detail/release-detail.component';
import { ReleaseListComponent } from './release-list/release-list.component';
import { ReleaseService } from './release.service';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [ReleaseAddComponent, ReleaseDetailComponent, ReleaseListComponent],
  providers: [ReleaseService],
  exports: [ReleaseAddComponent, ReleaseDetailComponent, ReleaseListComponent, SharedModule]
})
export class ReleaseModule {}