// Angular Imports
import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../common';
import { BISTEL_SDKModule } from '../../../sdk/sdk.module';

// This Module's Components
import { InCondition } from './conditions/in-condition';
import { OutCondition } from './conditions/out-condition';
import { Properties } from './config/properties';
import { PdmEqpParamAnalysisComponent } from './pdm-eqp-param-analysis.component';
import { PdmEqpParamAnalysisChartConfig } from './config/chart.config';
import { ViewConfig } from './config/view.config';

// import { BtreeComponentModule } from './components/components.module';
import { PluginCommonModule } from '../../common/plugins.common.module';

// import { ModelingTreeComponent } from '../../common/modeling-tree/modeling-tree.component';
// import { TreeComponent } from '../../common/modeling-tree/tree/tree.component';
// import { NgTree } from 'ng.tree';

@NgModule({
    imports: [
        A3_CommonModule,
        BISTEL_SDKModule,
        // BtreeComponentModule,
        PluginCommonModule
    ],
    declarations: [
        PdmEqpParamAnalysisComponent,
        // ModelingTreeComponent,
        // TreeComponent,
        // NgTree
    ],
    exports: [
        PdmEqpParamAnalysisComponent
    ]
})
export class PdmEqpParamAnalysisModule {
    static config(): any {
        return {
            component: PdmEqpParamAnalysisComponent,
            properties: Properties,
            inCondition: InCondition,
            outCondition: OutCondition,
            chartConfig: PdmEqpParamAnalysisChartConfig,
            viewConfig: ViewConfig
        };
    }
}
