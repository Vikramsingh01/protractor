import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { CommunityRequirementAddComponent } from './community-requirement-add/community-requirement-add.component';
import { CommunityRequirementDetailComponent } from './community-requirement-detail/community-requirement-detail.component';
import { CommunityRequirementListComponent } from './community-requirement-list/community-requirement-list.component';
import { CommunityRequirementService } from './community-requirement.service';
import { TerminateRequirementAddComponent} from '../terminate-requirement/terminate-requirement-add/terminate-requirement-add.component';
import { TerminateRequirementDetailComponent} from '../terminate-requirement/terminate-requirement-detail/terminate-requirement-detail.component';
@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [CommunityRequirementAddComponent, CommunityRequirementDetailComponent, CommunityRequirementListComponent, TerminateRequirementAddComponent, TerminateRequirementDetailComponent ],
  providers: [CommunityRequirementService],
  exports: [CommunityRequirementAddComponent, CommunityRequirementDetailComponent, CommunityRequirementListComponent, SharedModule, TerminateRequirementAddComponent, TerminateRequirementDetailComponent]
})
export class CommunityRequirementModule {}