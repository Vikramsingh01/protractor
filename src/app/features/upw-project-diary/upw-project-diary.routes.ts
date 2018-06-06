import { Routes } from '@angular/router';

import { UpwProjectDiaryListComponent } from './upw-project-diary-list/upw-project-diary-list.component';


export const UpwProjectDiary_ROUTES: Routes = [
   { path: "", component: UpwProjectDiaryListComponent, pathMatch: 'full', data:{action:'Read'}},
  
];
