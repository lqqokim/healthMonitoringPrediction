import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BISTEL_SDKModule } from '../../../../../sdk';
import { ShareUserComponent } from './share-user.component';
import { SharedBodyComponent } from './shared-body/shared-body.component';
import { SharedListComponent } from './shared-list/shared-list.component';
import { SharedUserCardComponent } from './shared-list/card/user/shared-user-card.component';
import { SharedGroupCardComponent } from './shared-list/card/group/shared-group-card.component';
import { SharedUserDetailComponent } from './shared-user-detail/shared-user-detail.component';
import { SharedGroupDetailComponent } from './shared-group-detail/shared-group-detail.component';

@NgModule({
	imports: [
		CommonModule,
        BISTEL_SDKModule
	],
	declarations: [
        ShareUserComponent,
        SharedBodyComponent,
        SharedListComponent,
        SharedUserCardComponent,
        SharedGroupCardComponent,
        SharedUserDetailComponent,
        SharedGroupDetailComponent
	],
    exports: [
        ShareUserComponent,
        SharedBodyComponent,
        SharedListComponent,
        SharedUserCardComponent,
        SharedGroupCardComponent,
        SharedUserDetailComponent,
        SharedGroupDetailComponent
    ],
    entryComponents: [
        ShareUserComponent
    ]
})
export class ShareUserModule {
   static config(): any {
        return {
            component: ShareUserComponent
        };
    }
}
