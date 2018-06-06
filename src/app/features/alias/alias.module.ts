import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { AliasAddComponent } from './alias-add/alias-add.component';
import { AliasDetailComponent } from './alias-detail/alias-detail.component';
import { AliasListComponent } from './alias-list/alias-list.component';
import { AliasService } from './alias.service';
import { OffenderProfileService } from "../offenderprofile/offenderprofile.service";

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [AliasAddComponent, AliasDetailComponent, AliasListComponent],
  providers: [AliasService, OffenderProfileService],
  exports: [AliasAddComponent, AliasDetailComponent, AliasListComponent, SharedModule]
})
export class AliasModule {}