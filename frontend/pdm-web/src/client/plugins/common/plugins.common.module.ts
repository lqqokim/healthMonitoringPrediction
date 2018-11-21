import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { A3_CommonModule } from '../../common/common.module';
import { BISTEL_SDKModule } from '../../sdk/sdk.module';

// import { TreeModule } from 'ng2-tree';
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

import { LineChartComponent }  from './line-chart/line-chart.component';

import { Ng2C3Component } from './ng2-c3/ng2-c3.component';
import { GaugeChartComponent } from './gauge-chart/gaugeChart.component';
import { FilterConditionComponent } from './filter-condition/filter-condition.component';
import { MultiSelectComboComponent } from './multi-select-combo/multi-select-combo.component';
import { SearchComboPipe } from './multi-select-combo/search.pipe';
import { ImageChartComponent } from './image-chart/image-chart.component';

import { TrendComponent } from './../widgets/pdm-correlation/components/trend/trend.component';
// import { PlotlyModule } from 'angular-plotly.js';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
        FormsModule,
        // TreeModule,
        Ng2TableModule,
        // PlotlyModule
    ],
    declarations: [
        ModelingTreeComponent,
        TreeComponent,
        FabAreaEqpParamTreeComponent,
        CheckTreeComponent,
        StatusChartComponent,
        DonutChartComponent,
        GaugeChartComponent,
        TableComponent,
        WidgetChartConditionComponent,
        StatusChangeComponent,
        LineChartComponent,
        Ng2C3Component,
        FilterConditionComponent,
        MultiSelectComboComponent,
        SearchComboPipe,
        ImageChartComponent,
        TrendComponent
    ],
    exports: [
        ModelingTreeComponent,
        TreeComponent,
        FabAreaEqpParamTreeComponent,
        CheckTreeComponent,
        StatusChartComponent,
        DonutChartComponent,
        GaugeChartComponent,
        TableComponent,
        WidgetChartConditionComponent,
        StatusChangeComponent,
        LineChartComponent,
        Ng2C3Component,
        FilterConditionComponent,
        MultiSelectComboComponent,
        SearchComboPipe,
        ImageChartComponent,
        TrendComponent
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
