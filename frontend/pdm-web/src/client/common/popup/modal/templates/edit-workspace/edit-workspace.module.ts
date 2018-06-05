import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BISTEL_SDKModule } from '../../../../../sdk';
import { EditWorkspaceComponent } from './edit-workspace.component';
import { ShareUserModule } from '../share-user/share-user.module';

@NgModule({
	imports: [
		CommonModule,
        BISTEL_SDKModule,
        ShareUserModule
	],
	declarations: [
        EditWorkspaceComponent,
	],
    entryComponents: [
        EditWorkspaceComponent  
    ]
})
export class EditWorkspaceModule {
   static config(): any {
        return {
            component: EditWorkspaceComponent
        };
    }
}

