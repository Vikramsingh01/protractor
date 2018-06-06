import { Routes } from '@angular/router';

import { CourtReportListComponent } from './court-report-list/court-report-list.component';
import { CourtReportDetailComponent } from './court-report-detail/court-report-detail.component';
import { CourtReportAddComponent } from './court-report-add/court-report-add.component';

export const COURTREPORT_ROUTES: Routes = [
   { path: "", component: CourtReportListComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: CourtReportAddComponent, data:{action:'Create'}},
   { path: ":courtReportId", component: CourtReportDetailComponent, data:{action:'Read'}},
   { path: "edit/:courtReportId", component: CourtReportAddComponent, pathMatch: 'full', data:{action:'Update'}}
   
];
