import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { OfflocListComponent } from './offloc-list/offloc-list.component';
import { OfflocRequestService } from './offloc-request.service';
import { OfflocResponseService } from './offloc-response.service';
import {OfflocDetailComponent} from "./offloc-detail/offloc-detail.component";
import { OffenderProfileService } from '../offenderprofile/offenderprofile.service';
import { CustodyLocationService } from '../custody-location/custody-location.service';
import { CustodyKeyDateService } from '../custody-key-date/custody-key-date.service';
import { ReleaseService } from '../release/release.service';
import { PssRequirementService } from '../pss-requirement/pss-requirement.service';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [OfflocListComponent, OfflocDetailComponent],
  providers: [OfflocRequestService, OfflocResponseService, OffenderProfileService, CustodyLocationService, CustodyKeyDateService, ReleaseService, PssRequirementService],
  exports: [OfflocListComponent, OfflocDetailComponent, SharedModule]
})
export class OfflocModule {}
