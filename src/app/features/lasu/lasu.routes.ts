import {Routes} from '@angular/router';
import {LasuOffenderprofileListComponent} from "./lasu-offenderprofile-list/lasu-offenderprofile-list.component";
import {LasuOffenderprofileRestrictionAddComponent} from "./lasu-offenderprofile-add/lasu-offenderprofile-restriction-add.component";
import {LasuOffenderprofileExclusionAddComponent} from "./lasu-offenderprofile-add/lasu-offenderprofile-exclusion-add.component";
import {LasuOffenderprofileRestrictionDetailComponent} from "./lasu-offenderprofile-detail/lasu-offenderprofile-restriction-detail.component";
import {LasuOffenderprofileExclusionDetailComponent} from "./lasu-offenderprofile-detail/lasu-offenderprofile-exclusion-detail.component";

export const LASU_ROUTES: Routes = [
  {path: "", component: LasuOffenderprofileListComponent, pathMatch: 'full'},
  {path: ":profileId/restriction/new", component: LasuOffenderprofileRestrictionAddComponent, data: {action: 'Create'}},
  {
    path: ":profileId/restriction/edit",
    component: LasuOffenderprofileRestrictionAddComponent,
    data: {action: 'Update'}
  },
  {path: ":profileId/exclusion/new", component: LasuOffenderprofileExclusionAddComponent, data: {action: 'Create'}},
  {path: ":profileId/exclusion/edit", component: LasuOffenderprofileExclusionAddComponent, data: {action: 'Update'}},
  {path: ":profileId/restriction/detail", component: LasuOffenderprofileRestrictionDetailComponent},
  {path: ":profileId/exclusion/detail", component: LasuOffenderprofileExclusionDetailComponent}
];
