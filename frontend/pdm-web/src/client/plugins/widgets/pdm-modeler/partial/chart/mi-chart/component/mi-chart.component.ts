import { Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import { ChartConfiguration } from '../model/chart.interface';
import { LegendConfiguration } from '../model/legend.interface';
import { ChartComponent } from './chart/chart.component';
import { LegendComponent } from './legend/legend.component';

@Component({
    moduleId: module.id,
    selector: 'mi-chart',
    templateUrl: 'mi-chart.component.html'
})

export class MIChartComponent implements OnChanges {

    @Input() config: ChartConfiguration;

    chartInfo: ChartConfiguration;
    legendInfo: LegendConfiguration;
    isPlugin: boolean = true;

    @ViewChild('chart') chart: ChartComponent;
    @ViewChild('legend') legend: LegendComponent;

    constructor(private el: ElementRef) { }

    ngOnChanges(value: any) {
        if (value.config.currentValue) {
            const selector = this.guid();
            this.chartInfo = value.config.currentValue;
            this.chartInfo.chart.selector = selector;
            this.chartInfo.chart.uid = selector;
            //legend
            if (value.config.currentValue.legend) {
                this.legendInfo = value.config.currentValue.legend;
                this.legendInfo.chartSelector = selector;
                this.legendInfo.series = this.chartInfo.series;
            }
        }
    }

    pluginStatus() {
        if (!this.isPlugin) {
            this.isPlugin = true;
            this.chart.baseChart.enabledPlugin('DragBase');
        } else {
            this.isPlugin = false;
            this.chart.baseChart.disabledPlugin('DragBase');
        }
    }

    sizeUpdate(width: number, height: number) {
        this.chart.updateChartDisplay(width, height);
    }

    private guid() {
        return 'mi-chart-' + this.s4() + '-' + this.s4();
    }

    private s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

}
