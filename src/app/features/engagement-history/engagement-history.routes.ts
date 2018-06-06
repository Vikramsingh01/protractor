import { Routes } from '@angular/router';

import { EngagementHistoryComponent } from '../engagement-history';
import { EngagementHistoryDetailComponent } from './engagement-history-detail/engagement-history-detail.component';
import { EngagementHistoryEditComponent } from './engagement-history-edit/engagement-history-edit.component';

export const ENGAGEMENTHISTORY_ROUTES: Routes = [
    { path: "", component: EngagementHistoryComponent, pathMatch: 'full', data: { action: 'Read' } },
    { path: "new", component: EngagementHistoryEditComponent, data: { action: 'Create' } },
    { path: ":offenderId", component: EngagementHistoryComponent, data: { action: 'Read' } },
    { path: ":offenderId/:id", component: EngagementHistoryDetailComponent, data: { action: 'Read' } },
    { path: ":id/edit", component: EngagementHistoryEditComponent, pathMatch: 'full', data: { action: 'Update' } }

];
