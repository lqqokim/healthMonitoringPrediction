import { Component, OnInit, OnChanges, Input, Output, SimpleChanges, EventEmitter, Renderer, ElementRef, ViewChild } from '@angular/core';

import * as pdmRadarI from './../../model/pdm-radar.interface';
import { IGaugeChartData, IColorSet, IGaugeChartConfig } from '../../../../common/gauge-chart/gaugeChart.component';
import { GaugeChartComponent } from '../../../../common/gauge-chart/gaugeChart.component';

export interface IGaugeChartInfo {
    value: string;
    name: string;
}

@Component({
    moduleId: module.id,
    selector: 'gauge-chart-generate',
    templateUrl: './gauge-chart-generate.html',
    styleUrls: ['./gauge-chart-generate.css']
})
export class GaugeChartGenerateComponent implements OnInit, OnChanges {
    @ViewChild('gaugeChartComp') gaugeChartComp: GaugeChartComponent;
    @Input() item: pdmRadarI.ChartDataType;
    @Output() emitData: EventEmitter<any> = new EventEmitter();

    chartId: any;
    chartConfig: any;
    chartData: any[];
    isConfig;
    gaugeChartData: IGaugeChartConfig;
    gaugeChartInfo: IGaugeChartInfo;

    // private readonly ALARM_RATIO: number = 70;
    private readonly ALARM_RATIO: number = 71.5; //(%)

    constructor() {

    }

    ngOnChanges(changes: SimpleChanges) {
        for (let propName in changes) {
            let change = changes[propName];
            const curVal = change.currentValue;
            let item: any;

            if (propName === 'item') {
                item = curVal;

                if (!item['isExpand']) {
                    this.chartId = `${item.id}${item.type}`;
                } else {
                    this.chartId = `${item.id}${item.type}_expand`;
                }


                setTimeout(() => {
                    this.drawPlotGaugeChart(item);
                    // this.drawC3GaugeChart(item);
                }, 300);
            }
        }
    }

    ngOnInit() {

    }

    drawPlotGaugeChart(item: pdmRadarI.ChartDataType): void {
        // if (item.type === 'alarm' || item.type === 'warning') {
        //     this.setAWChartData(item);
        // } else {
        //     this.setBGChartData(item);
        // }
        this.setChartData(item);
    }
    setChartData(item: any) {
        if (item.chartData) {
            let score: any = item.chartData.score;
            let axisCategory: any = item.chartData.paramName;
            let warn: any = item.chartData.warn;

            // axisCategoryies = [];
            // paramDatas = [];
            // warns = [];

            setTimeout(() => {
                this.chartGenerator(item, score, axisCategory, warn);
                this.emitData.emit({
                    type: item.type,
                    paramId: item.chartData.paramId,
                    paramName: item.chartData.paramName,
                    eqpId: item.chartData.eqpId,
                    eqpName: item.chartData.eqpName,
                });
    
            }, 500);
        }
    }
    chartGenerator(item: pdmRadarI.ChartDataType, score: number, axisCategory: string, warn: number) {
        console.log('score => ', score, 'warn => ', warn );
        const alarmRatio: number = this.ALARM_RATIO * 0.01;
        const warnInterval: number = warn * alarmRatio;
        let gaugePointerPercent: number = score * alarmRatio > 1.4 ? 1.3 : score * alarmRatio;
        console.log('score * alarmRatio', score * alarmRatio);
        console.log('alarmRatio', alarmRatio);
        console.log('warnInterval', warnInterval);
        console.log('gaugePoinerPercent', gaugePointerPercent);

        const gaugeChartData: IGaugeChartConfig = {
            chartData: [
                { name: 'normal', start: 0, end: warnInterval },
                { name: 'warning', start: warnInterval, end: alarmRatio },
                { name: 'alarm', start: alarmRatio, end: 1.4 }
            ],
            chartColor: [
                { name: 'normal', color: '#21b100' },
                { name: 'warning', color: '#ffba00' },
                { name: 'alarm', color: '#ff3d3d' }
            ],
            dataRangeStart: 0,
            dataRangeEnd: 1.4,
            markerCount: 7,
            gaugePoinerPercent: gaugePointerPercent
        };

        this.gaugeChartComp.drawChart(gaugeChartData);
        this.gaugeChartInfo = {
            value: `Health Index : ${score.toFixed(4)}`,
            name: `Parameter : ${axisCategory}`
        };


    }
    // Standard: 100
    // chartGenerator(item: pdmRadarI.ChartDataType, score: number, axisCategory: string, warn: number) {
    //     const alarmRatio: number = this.ALARM_RATIO * 0.01;
    //     const warnInterval: number = warn * alarmRatio;
    //     let gaugePoinerPercent: number = score * alarmRatio > 1 ? 1 : score * alarmRatio;

    //     const gaugeChartData: IGaugeChartConfig = {
    //         chartData: [
    //             { name: 'normal', start: 0, end: warnInterval },
    //             { name: 'warning', start: warnInterval, end: alarmRatio },
    //             { name: 'alarm', start: alarmRatio, end: 1 }
    //         ],
    //         chartColor: [
    //             { name: 'normal', color: '#21b100' },
    //             { name: 'warning', color: '#ffba00' },
    //             { name: 'alarm', color: '#ff3d3d' }
    //         ],
    //         dataRangeStart: 0,
    //         dataRangeEnd: 100,
    //         markerCount: 5,
    //         gaugePoinerPercent: gaugePoinerPercent
    //     };

    //     this.gaugeChartComp.drawChart(gaugeChartData);
    //     this.gaugeChartInfo = {
    //         value: `Health Index : ${score.toFixed(4)}`,
    //         name: `Parameter : ${axisCategory}`
    //     };
    // }





    removeGridLine(): void {//for bistel chart bug
        $('.jqplot-target>canvas.jqplot-grid-canvas').remove();
        $('.jqplot-target>div.jqplot-axis.jqplot-xaxis').remove();
        $('.jqplot-target>div.jqplot-axis.jqplot-yaxis').remove();
    }
}