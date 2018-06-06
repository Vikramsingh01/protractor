import { Routes } from '@angular/router';

import { PersonalCircumstanceListComponent } from './personal-circumstance-list/personal-circumstance-list.component';
import { PersonalCircumstanceDetailComponent } from './personal-circumstance-detail/personal-circumstance-detail.component';
import { PersonalCircumstanceAddComponent } from './personal-circumstance-add/personal-circumstance-add.component';

export const PersonalCircumstance_ROUTES: Routes = [
    { path: "", component: PersonalCircumstanceListComponent, pathMatch: 'full', data: { action: 'Read' } },
    { path: "new", component: PersonalCircumstanceAddComponent, data: { action: 'Create' } },
    { path: ":personalCircumstanceId", component: PersonalCircumstanceDetailComponent, data: { action: 'Read' } },
    { path: "edit/:personalCircumstanceId", component: PersonalCircumstanceAddComponent, pathMatch: 'full', data: { action: 'Update' } }

];
