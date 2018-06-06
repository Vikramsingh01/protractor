import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsComponent } from "./tabs.component";
import { RouterModule } from '@angular/router';
import { MainTabsComponent } from "./main-tabs.component";

@NgModule({
  imports: [
    CommonModule, RouterModule
  ],
  declarations: [TabsComponent, MainTabsComponent],
  exports: [TabsComponent, MainTabsComponent, RouterModule]
})
export class TabsModule { }