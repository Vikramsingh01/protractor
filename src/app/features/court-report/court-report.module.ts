import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { CourtReportAddComponent } from './court-report-add/court-report-add.component';
import { CourtReportDetailComponent } from './court-report-detail/court-report-detail.component';
import { CourtReportListComponent } from './court-report-list/court-report-list.component';
import { CourtReportService } from './court-report.service';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [CourtReportAddComponent, CourtReportDetailComponent, CourtReportListComponent],
  providers: [CourtReportService],
  exports: [CourtReportAddComponent, CourtReportDetailComponent, CourtReportListComponent, SharedModule]
})
export class CourtReportModule {}