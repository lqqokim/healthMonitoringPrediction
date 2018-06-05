import { NgModule, ApplicationRef } from '@angular/core';

import { A3_CommonModule } from '../../../common/common.module';
import { BISTEL_SDKModule } from '../../../sdk/sdk.module';

import { TaskerListComponent } from './tasker-list.component';
import { TaskerListContentComponent } from './tasker-list-content.component';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule
    ],
    declarations: [
        TaskerListComponent, 
        TaskerListContentComponent
    ],
    entryComponents: [TaskerListComponent]
})
export class TaskerListModule {
   static config(): any {
        return {
            component: TaskerListComponent
        };
    }
}