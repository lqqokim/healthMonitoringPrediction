import { NgModule, ApplicationRef } from '@angular/core';

import { A3_CommonModule } from '../../../common/common.module';
import { BISTEL_SDKModule } from '../../../sdk/sdk.module';

import { NotificationListComponent } from './notification-list.component';
import { NotificationListContentComponent } from './notification-list-content.component';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule
    ],
    declarations: [
        NotificationListComponent,
        NotificationListContentComponent
    ],
    entryComponents: [NotificationListComponent]
})
export class NotificationListModule {
   static config(): any {
        return {
            component: NotificationListComponent
        };
    }
}