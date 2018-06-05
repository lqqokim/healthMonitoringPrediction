import { NgModule, ApplicationRef } from '@angular/core';

import { A3_CommonModule } from '../../../common/common.module';
import { BISTEL_SDKModule } from '../../../sdk/sdk.module';

import { DashboardListComponent } from './dashboard-list.component';
import { DashboardListContentComponent } from './dashboard-list-content.component';

import { CarouselComponent } from './slide/carousel.component';
import { SlideComponent } from './slide/slide.component';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule
    ],
    declarations: [
        DashboardListComponent, 
        DashboardListContentComponent,
        CarouselComponent,
        SlideComponent
    ],
    entryComponents: [DashboardListComponent]
})
export class DashboardListModule {
   static config(): any {
        return {
            component: DashboardListComponent
        };
    }
}