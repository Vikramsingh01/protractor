import { Routes } from '@angular/router';

import { TerminationsListComponent } from './terminations-list/terminations-list.component';

import { ContactDetailComponent } from '../../features/contact/contact-detail/contact-detail.component';

import { EVENT_ROUTES } from '../event/event.routes';
export const Terminations_ROUTES: Routes = [
   { path: "", component: TerminationsListComponent, pathMatch: 'full', data:{action:'Read'}},
   // { path: ":contactId", component: ContactDetailComponent, data:{action:'Read'}},
    { path : ":profileId/event", children: EVENT_ROUTES},
    
];
