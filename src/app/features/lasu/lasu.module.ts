import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SharedModule} from "../../shared/shared.module";
import {LasuOffenderprofileListComponent} from "./lasu-offenderprofile-list/lasu-offenderprofile-list.component";
import {LasuRestrictionService} from "./lasu-restriction.service";
import {LasuOffenderprofileRestrictionAddComponent} from "./lasu-offenderprofile-add/lasu-offenderprofile-restriction-add.component";
import {LasuOffenderprofileExclusionAddComponent} from "./lasu-offenderprofile-add/lasu-offenderprofile-exclusion-add.component";
import {LasuExclusionService} from "./lasu-exclusion.service";
import {LasuOffenderprofileRestrictionDetailComponent} from "./lasu-offenderprofile-detail/lasu-offenderprofile-restriction-detail.component";
import {LasuOffenderprofileExclusionDetailComponent} from "./lasu-offenderprofile-detail/lasu-offenderprofile-exclusion-detail.component";

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [LasuOffenderprofileListComponent,LasuOffenderprofileRestrictionAddComponent,LasuOffenderprofileExclusionAddComponent,
    LasuOffenderprofileRestrictionDetailComponent,LasuOffenderprofileExclusionDetailComponent],
  providers: [LasuRestrictionService,LasuExclusionService],
  exports: [LasuOffenderprofileListComponent,LasuOffenderprofileRestrictionAddComponent,LasuOffenderprofileExclusionAddComponent,
    LasuOffenderprofileRestrictionDetailComponent,LasuOffenderprofileExclusionDetailComponent,SharedModule]
})

export class LasuModule{}
