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

    private readonly ALARM_RATIO: number = 70;

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
        if (item.type === 'alarm' || item.type === 'warning') {
            this.setAWChartData(item);
        } else {
            this.setBGChartData(item);
        }
    }

    setAWChartData(item: pdmRadarI.ChartDataType) {
        let avgWithAWs: any[] = item.chartData.avgWithAWs.map((d: any) => d.value);
        let avgDailys: any[] = item.chartData.avgDailys.map((d: any) => d.value);
        let paramDatas: any[] = item.chartData.paramDatas;
        let axisCategoryies: any[] = item.chartData.alarms.map((d: any) => d.axis);
        let warns: any[] = item.chartData.warns.map((d: any) => d.value);

        if (item.type === 'alarm') {
            this.setAlarmData(avgWithAWs, avgDailys, axisCategoryies, item, warns, paramDatas);
        } else if (item.type === 'warning') {
            this.setWarningData(avgWithAWs, avgDailys, axisCategoryies, warns, item, paramDatas);
        }
    }

    setAlarmData(avgWithAWs, avgDailys, axisCategoryies, item: pdmRadarI.ChartDataType, warns, paramDatas): void {
        let datas: any[] = [];
        const dataLength: number = avgWithAWs.length;
        for (let i = 0; i < dataLength; i++) {
            datas.push({
                axis: axisCategoryies[i],
                avgWithAW: avgWithAWs[i],
                avgDaily: avgDailys[i],
                paramData: paramDatas[i],
                warn: warns[i]
            });
        }

        avgWithAWs = [];
        avgDailys = [];
        axisCategoryies = [];
        paramDatas = [];
        warns = [];

        setTimeout(() => {
            _.sortBy(datas, 'avgWithAW').reverse().map((d: any, i: number) => {
                avgWithAWs.push(d.avgWithAW);
                avgDailys.push(d.avgDaily);
                axisCategoryies.push(d.axis);
                paramDatas.push(d.paramData);
                warns.push(d.warn)
            });

            this.emitData.emit({
                type: item.type,
                paramId: paramDatas[0].paramId,
                paramName: paramDatas[0].paramName,
                eqpId: paramDatas[0].eqpId,
                eqpName: paramDatas[0].eqpName,
                avgWithAW: avgWithAWs[0],
                warn: warns[0]
            });

            this.AWChartGenerator(item, avgWithAWs, axisCategoryies, warns);
        }, 500);
    }

    setWarningData(avgWithAWs, avgDailys, axisCategoryies, warns, item: pdmRadarI.ChartDataType, paramDatas): void {
        let datas: any[] = [];
        const dataLength: number = avgWithAWs.length;
        for (let i = 0; i < dataLength; i++) {
            datas.push({
                axis: axisCategoryies[i],
                avgWithAW: avgWithAWs[i],
                avgDaily: avgDailys[i],
                paramData: paramDatas[i],
                warn: warns[i]
            });
        }

        avgWithAWs = [];
        avgDailys = [];
        axisCategoryies = [];
        warns = [];
        paramDatas = [];

        setTimeout(() => {
            _.sortBy(datas, 'avgWithAW').reverse().map((d: any, i: number) => {
                avgWithAWs.push(d.avgWithAW);
                avgDailys.push(d.avgDaily);
                axisCategoryies.push(d.axis);
                warns.push(d.warn);
                paramDatas.push(d.paramData);
            });

            this.emitData.emit({
                type: item.type,
                paramId: paramDatas[0].paramId,
                paramName: paramDatas[0].paramName,
                eqpId: paramDatas[0].eqpId,
                eqpName: paramDatas[0].eqpName,
                avgWithAW: avgWithAWs[0],
                warn: warns[0]
            });

            this.AWChartGenerator(item, avgWithAWs, axisCategoryies, warns);
        }, 500);
    }

    AWChartGenerator(item: pdmRadarI.ChartDataType, avgWithAWs: number[], axisCategoryies: string[], warns: number[]) {
        const alarmRatio: number = this.ALARM_RATIO * 0.01;        
        const warnInterval: number = warns[0] * alarmRatio;
        let gaugePoinerPercent: number = avgWithAWs[0] * alarmRatio > 1 ? 1 : avgWithAWs[0] * alarmRatio;

        const gaugeChartData: IGaugeChartConfig = {
            chartData: [
                { name: 'normal', start: 0, end: warnInterval },
                { name: 'warning', start: warnInterval, end: alarmRatio },
                { name: 'alarm', start: alarmRatio, end: 1 }
            ],
            chartColor: [
                { name: 'normal', color: 'green' },
                { name: 'warning', color: 'yellow' },
                { name: 'alarm', color: 'red' }
            ],
            dataRangeStart: 0,
            dataRangeEnd: 100,
            markerCount: 5,
            gaugePoinerPercent: gaugePoinerPercent
        };

        this.gaugeChartComp.drawChart(gaugeChartData);
        this.gaugeChartInfo = {
            value: `Max ${item.type} : ${avgWithAWs[0].toFixed(4)}`,
            name: `Parameter : ${axisCategoryies[0]}`
        };


        // setTimeout(() => {
        //     this.chartData = [[avgWithAWs[0] * 75]];
        //     this.chartConfig = {
        //         legend: {
        //             show: true
        //         },
        //         cursor: {
        //             zoom: false,
        //             style: 'auto',
        //             showTooltip: true,
        //             draggable: false,
        //             dblClickReset: false
        //         },
        //         seriesDefaults: {
        //             renderer: $.jqplot.MeterGaugeRenderer,
        //             rendererOptions: {
        //                 label: label,
        //                 labelPosition: 'bottom',
        //                 labelHeightAdjust: 10,
        //                 intervalOuterRadius: 70,
        //                 min: 0,
        //                 max: 100,
        //                 // ticks: [0, warnInterval, this.ALARM_RATIO, 100],
        //                 intervals: [warnInterval, this.ALARM_RATIO, 100],
        //                 intervalColors: ['#66cc66', '#ff0', '#cc6666', '#cc6666']
        //             }
        //         }
        //     }
        //     setTimeout(() => {
        //         if (!this.isConfig) {
        //             this.removeGridLine();
        //         }
        //     });
        // }, 200);
    }

    setBGChartData(item: pdmRadarI.ChartDataType): void {
        // console.log('NW item', item);
        let avgSpecs: any[] = item.chartData.avgSpecs.map((d: any) => d.value);
        let avgDailys: any[] = item.chartData.avgDailys.map((d: any) => d.value);
        let axisCategoryies: any[] = item.chartData.alarms.map((d: any) => d.axis);
        let paramDatas: any[] = item.chartData.paramDatas;
        let warns: any[] = item.chartData.warns.map((d: any) => d.value);
        let datas: any[] = [];
        let gap: any[] = [];

        for (let i = 0; i < avgSpecs.length; i++) {
            datas.push({
                axis: axisCategoryies[i],
                avgSpec: avgSpecs[i],
                avgDaily: avgDailys[i],
                warn: warns[i],
                paramData: paramDatas[i],
                gap: avgDailys[i] - avgSpecs[i],
            });
        }

        avgSpecs = [];
        avgDailys = [];
        axisCategoryies = [];
        paramDatas = [];
        warns = [];

        setTimeout(() => {
            _.sortBy(datas, 'gap').reverse().map((d: any, i: number) => {
                avgSpecs.push(d.avgSpec);
                avgDailys.push(d.avgDaily);
                axisCategoryies.push(d.axis);
                warns.push(d.warn);
                paramDatas.push(d.paramData);
            });

            this.emitData.emit({
                type: item.type,
                paramId: paramDatas[0].paramId,
                paramName: paramDatas[0].paramName,
                eqpId: paramDatas[0].eqpId,
                eqpName: paramDatas[0].eqpName,
                warn: warns[0]
            });

            this.BGChartGenerator(item, avgDailys, avgSpecs, axisCategoryies, warns);
        }, 500);
    }

    BGChartGenerator(item: pdmRadarI.ChartDataType, avgDailys: number[], avgSpecs: number[], axisCategoryies: string[], warns: number[]) {
        // const color: string = item.type === 'G5' ? '#22b8cf' : '#ff009d';
        // const label: string = `Target days avg: ${avgSpecs[0].toFixed(4)} / Paramter: ${axisCategoryies[0]}`;
        // const warnInterval: number = warns[0] * this.ALARM_RATIO;
        // const pointVal: number = avgSpecs[0] * this.ALARM_RATIO

        const alarmRatio: number = this.ALARM_RATIO * 0.01;        
        const warnInterval: number = warns[0] * alarmRatio;
        let gaugePoinerPercent: number = avgSpecs[0] * alarmRatio > 1 ? 1 : avgSpecs[0] * alarmRatio;

        const gaugeChartData: IGaugeChartConfig = {
            chartData: [
                { name: 'normal', start: 0, end: warnInterval },
                { name: 'warning', start: warnInterval, end: alarmRatio },
                { name: 'alarm', start: alarmRatio, end: 1 }
            ],
            chartColor: [
                { name: 'normal', color: 'green' },
                { name: 'warning', color: 'yellow' },
                { name: 'alarm', color: 'red' }
            ],
            dataRangeStart: 0,
            dataRangeEnd: 100,
            markerCount: 5,
            gaugePoinerPercent: gaugePoinerPercent
        };

        this.gaugeChartComp.drawChart(gaugeChartData);
        this.gaugeChartInfo = {
            value: `Target days avg : ${avgSpecs[0].toFixed(4)}`,
            name: `Parameter : ${axisCategoryies[0]}`
        };

        // setTimeout(() => {
        //     this.chartData = [[pointVal]];
        //     this.chartConfig = {
        //         legend: {
        //             show: true
        //         },
        //         seriesDefaults: {
        //             renderer: $.jqplot.MeterGaugeRenderer,
        //             rendererOptions: {
        //                 label: label,
        //                 labelPosition: 'bottom',
        //                 labelHeightAdjust: 10,
        //                 intervalOuterRadius: 70,
        //                 min: 0,
        //                 max: 100,
        //                 // ticks: [0, 0.5, 1, 1.5],
        //                 // intervals: [200, 300, 400, 500],
        //                 // intervalColors: ['#66cc66', '#93b75f', '#E7E658', '#cc6666']
        //                 intervals: [warnInterval, this.ALARM_RATIO, 100],
        //                 intervalColors: ['#66cc66', '#ff0', '#cc6666', '#cc6666']
        //             }
        //         }
        //     }
        // }, 200);
    }

    removeGridLine(): void {//for bistel chart bug
        $('.jqplot-target>canvas.jqplot-grid-canvas').remove();
        $('.jqplot-target>div.jqplot-axis.jqplot-xaxis').remove();
        $('.jqplot-target>div.jqplot-axis.jqplot-yaxis').remove();
    }
}