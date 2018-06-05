import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BISTEL_SDKModule } from '../../../../../sdk';
import { ConfirmComponent } from './confirm.component';

@NgModule({
	imports: [
		CommonModule,
        BISTEL_SDKModule
	],
	declarations: [
        ConfirmComponent
	], 
    entryComponents: [
        ConfirmComponent
    ]
})
export class ConfirmModule {
   static config(): any {
        return {
            component: ConfirmComponent
        };
    }
}
