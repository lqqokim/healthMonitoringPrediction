import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BISTEL_SDKModule } from '../../../sdk';

import { ModalBehaviorComponent } from './modal-behavior.component';
// import { ConfirmComponent } from './templates/confirm/confirm.component';
// import { ConfirmDeleteComponent } from './templates/confirm-delete/confirm-delete.component';
// import { AlertComponent } from './templates/alert/alert.component';

import { AlertModule } from './templates/alert/alert.module';
import { ConfirmModule } from './templates/confirm/confirm.module';
import { ConfirmDeleteModule } from './templates/confirm-delete/confirm-delete.module';
import { ShareUserModule } from './templates/share-user/share-user.module';
import { EditWorkspaceModule } from './templates/edit-workspace/edit-workspace.module';
import { ApplyModule } from './templates/apply/apply.module';

import { ModalBehaviorService } from './modal-behavior.service';
import { ModalRequester } from './modal-requester';


@NgModule({
	imports: [
		CommonModule,
        BISTEL_SDKModule,
        AlertModule,
        ConfirmModule,
        ConfirmDeleteModule,
        ShareUserModule,
        EditWorkspaceModule,
        ApplyModule
	],
	declarations: [
        ModalBehaviorComponent
	],
	exports: [
        ModalBehaviorComponent
	],
    entryComponents: [
        ModalBehaviorComponent
    ]
})
export class ModalModule {
    static forProviders(): any[] {
        return <any>[
            ModalBehaviorService,
            ModalRequester
        ];
    }
}
