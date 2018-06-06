import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { InstitutionalReportAddComponent } from './institutional-report-add/institutional-report-add.component';
import { InstitutionalReportDetailComponent } from './institutional-report-detail/institutional-report-detail.component';
import { InstitutionalReportListComponent } from './institutional-report-list/institutional-report-list.component';
import { InstitutionalReportService } from './institutional-report.service';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [InstitutionalReportAddComponent, InstitutionalReportDetailComponent, InstitutionalReportListComponent],
  providers: [InstitutionalReportService],
  exports: [InstitutionalReportAddComponent, InstitutionalReportDetailComponent, InstitutionalReportListComponent, SharedModule]
})
export class InstitutionalReportModule {}