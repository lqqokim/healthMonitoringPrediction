import { NgModule, ApplicationRef } from '@angular/core';

import { A3_CommonModule } from '../../../common/common.module';
import { BISTEL_SDKModule } from '../../../sdk/sdk.module';

import { WidgetListComponent } from './widget-list.component';
import { WidgetListContentComponent } from './widget-list-content.component';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule
    ],
    declarations: [
        WidgetListComponent, 
        WidgetListContentComponent
    ],
    entryComponents: [WidgetListComponent]
})
export class WidgetListModule {
   static config(): any {
        return {
            component: WidgetListComponent
        };
    }
}