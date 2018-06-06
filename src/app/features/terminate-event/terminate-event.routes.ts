import { Routes } from '@angular/router';

import { TerminateEventListComponent } from './terminate-event-list/terminate-event-list.component';
import { TerminateEventDetailComponent } from './terminate-event-detail/terminate-event-detail.component';
import { TerminateEventAddComponent } from './terminate-event-add/terminate-event-add.component';

export const TerminateEvent_ROUTES: Routes = [
   { path: "", component: TerminateEventListComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: TerminateEventAddComponent, data:{action:'Create'}},
   { path: ":terminateEventId", component: TerminateEventDetailComponent, data:{action:'Read'}},
   { path: "edit/:terminateEventId", component: TerminateEventAddComponent, pathMatch: 'full', data:{action:'Update'}}
   
];
