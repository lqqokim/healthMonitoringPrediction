import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BISTEL_SDKModule } from '../../../../../sdk';
import { ApplyComponent } from './apply.component';

@NgModule({
	imports: [
		CommonModule,
        BISTEL_SDKModule
	],
	declarations: [
        ApplyComponent
	],
    entryComponents: [
        ApplyComponent
    ]
})
export class ApplyModule {
   static config(): any {
        return {
            component: ApplyComponent
        };
    }
}
