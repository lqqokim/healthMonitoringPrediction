import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BISTEL_SDKModule } from '../../../../../sdk';
import { ConfirmDeleteComponent } from './confirm-delete.component';

@NgModule({
	imports: [
		CommonModule,
        BISTEL_SDKModule
	],
	declarations: [
        ConfirmDeleteComponent
	], 
    entryComponents: [
        ConfirmDeleteComponent
    ]
})
export class ConfirmDeleteModule {
   static config(): any {
        return {
            component: ConfirmDeleteComponent
        };
    }
}
