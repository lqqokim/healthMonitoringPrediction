import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../sdk/sdk.module';

import { SpecRuleComponent } from './spec-rule.component';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule
    ],
    declarations: [
        SpecRuleComponent
    ],
    entryComponents: [
        SpecRuleComponent
    ]
})
export class SpecRuleModule {
    static config(): any {
        return {
            component: SpecRuleComponent
        };
    }
}
