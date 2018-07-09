import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { A3_CommonModule } from '../../common/common.module';
import { BISTEL_SDKModule } from '../../sdk/sdk.module';

import { TreeModule } from 'ng2-tree';
import { Ng2TableModule } from 'ng2-table/ng2-table';

import { ModelingTreeComponent } from '../common/modeling-tree/modeling-tree.component';
import { TreeComponent } from '../common/modeling-tree/tree/tree.component';

import { FabAreaEqpParamTreeComponent } from '../common/fab-area-eqp-param-tree/fab-area-eqp-param-tree.component';
import { CheckTreeComponent } from '../common/fab-area-eqp-param-tree/check-tree/check-tree.component';

import { StatusChartComponent }  from '../common/status-chart/status-chart.component';
import { WidgetChartConditionComponent } from './widget-chart-condition/widget-chart-condition.component';
import { DonutChartComponent } from './donut-chart/donutChart.component';
import { TableComponent } from './ng2-table/table.component';
import { StatusChangeComponent } from '../common/status-chart-canvas/status-change.component';
import { WidgetViewTimeperiod } from './widget-chart-condition/widget-timeperiod.pipe';

import { LineChartComponent }  from './line-chart/line-chart.component';

import { Ng2C3Component } from './ng2-c3/ng2-c3.component';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
        FormsModule,
        // TreeModule,
        Ng2TableModule
    ],
    declarations: [
        ModelingTreeComponent,
        TreeComponent,
        FabAreaEqpParamTreeComponent,
        CheckTreeComponent,
        StatusChartComponent,
        DonutChartComponent,
        TableComponent,
        WidgetChartConditionComponent,
        StatusChangeComponent,
        WidgetViewTimeperiod,
        LineChartComponent,
        Ng2C3Component
    ],
    exports: [
        ModelingTreeComponent,
        TreeComponent,
        FabAreaEqpParamTreeComponent,
        CheckTreeComponent,
        StatusChartComponent,
        DonutChartComponent,
        TableComponent,
        WidgetChartConditionComponent,
        StatusChangeComponent,
        WidgetViewTimeperiod,
        LineChartComponent,
        Ng2C3Component
    ]
    // ,
    // entryComponents: [
    //     ModelingTreeComponent
    // ]
})
export class PluginCommonModule {

    // static config(): any {
    //     return {
    //         component: ModelingTreeComponent
    //     };
    // }
}
