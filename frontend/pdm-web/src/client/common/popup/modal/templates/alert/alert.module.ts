import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BISTEL_SDKModule } from '../../../../../sdk';
import { AlertComponent } from './alert.component';

@NgModule({
	imports: [
		CommonModule,
        BISTEL_SDKModule
	],
	declarations: [
        AlertComponent
	],
    entryComponents: [
        AlertComponent
    ]
})
export class AlertModule {
   static config(): any {
        return {
            component: AlertComponent
        };
    }
}
