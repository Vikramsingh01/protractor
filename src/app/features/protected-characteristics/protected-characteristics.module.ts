import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ProtectedCharacteristicsAddComponent } from './protected-characteristics-add/protected-characteristics-add.component';
import { ProtectedCharacteristicsDetailComponent } from './protected-characteristics-detail/protected-characteristics-detail.component';
import { ProtectedCharacteristicsService } from './protected-characteristics.service';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [ProtectedCharacteristicsAddComponent, ProtectedCharacteristicsDetailComponent],
  providers: [ProtectedCharacteristicsService],
  exports: [ProtectedCharacteristicsAddComponent, ProtectedCharacteristicsDetailComponent, SharedModule]
})
export class ProtectedCharacteristicsModule {}