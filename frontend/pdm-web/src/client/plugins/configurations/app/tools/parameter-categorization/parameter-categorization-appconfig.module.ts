import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../sdk/sdk.module';

// import { ToolsComponentModule } from '../component/component.module';

import { CategorizationListComponent } from './partial/categorization-list.component';
import { ParameterSumListComponent } from './partial/parameter-sum-list.component';
import { ParameterCategorizationComponent } from './parameter-categorization-appconfig.component';
import { CategorySelectorComponent } from './selector/category-selector.component';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
    ],
    exports: [
        CategorySelectorComponent
    ],    
    declarations: [
        ParameterCategorizationComponent,
        CategorizationListComponent,
        ParameterSumListComponent,
        CategorySelectorComponent
    ]
})
export class ParameterCategorizationAppConfigModule {

    static config(): any {
        return {
            component: ParameterCategorizationComponent
        };
    }
}
