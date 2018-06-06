import { Routes } from '@angular/router';

import { OffenderAdditionalSentenceListComponent } from './offender-additional-sentence-list/offender-additional-sentence-list.component';
import { OffenderAdditionalSentenceDetailComponent } from './offender-additional-sentence-detail/offender-additional-sentence-detail.component';
import { OffenderAdditionalSentenceAddComponent } from './offender-additional-sentence-add/offender-additional-sentence-add.component';

export const OffenderAdditionalSentence_ROUTES: Routes = [
   { path: "", component: OffenderAdditionalSentenceListComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: OffenderAdditionalSentenceAddComponent, data:{action:'Create'}},
   { path: ":offenderAdditionalSentenceId", component: OffenderAdditionalSentenceDetailComponent, data:{action:'Read'}},
   { path: "edit/:offenderAdditionalSentenceId", component: OffenderAdditionalSentenceAddComponent, pathMatch: 'full', data:{action:'Update'}}
   
];
