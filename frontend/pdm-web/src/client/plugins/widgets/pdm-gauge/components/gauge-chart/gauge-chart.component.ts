import { Component, OnInit, OnChanges, OnDestroy, Input, Output, SimpleChanges, EventEmitter, Renderer, ElementRef, ViewChild } from '@angular/core';

import * as pdmRadarI from './../../model/pdm-radar.interface';

@Component({
    moduleId: module.id,
    selector: 'gauge-chart',
    templateUrl: './gauge-chart.html',
    styleUrls: ['./gauge-chart.css']
})
export class GaugeChartComponent implements OnInit, OnChanges {
    @Input() item: pdmRadarI.ChartDataType;

    chartId: any;

    chartConfig;
    chartData;

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
            }

            setTimeout(() => {
                // this.drawBarChart(item);
                this.drawPlotGaugeChart(item);
            }, 300);
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

        setTimeout(() => {
            this.removeGridLine();
        }, 500);
    }

    setAWChartData(item: any) {
        let avgWithAWs: any[] = item.chartData.avgWithAWs.map((d: any) => d.value);
        let avgDailys: any[] = item.chartData.avgDailys.map((d: any) => d.value);
        let axisCategoryies: any[] = item.chartData.alarms.map((d: any) => d.axis);
        let warns: any[] = item.chartData.warns.map((d: any) => d.value);

        if (item.type === 'alarm') {
            this.setAlarmData(avgWithAWs, avgDailys, axisCategoryies, item);
        } else if (item.type === 'warning') {
            this.setWarningData(avgWithAWs, avgDailys, axisCategoryies, warns, item);
        }
    }

    setAlarmData(avgWithAWs, avgDailys, axisCategoryies, item): void {
        let datas: any[] = [];
        const dataLength: number = avgWithAWs.length;
        for (let i = 0; i < dataLength; i++) {
            datas.push({
                axis: axisCategoryies[i],
                avgWithAW: avgWithAWs[i],
                avgDaily: avgDailys[i]
            });
        }

        avgWithAWs = [];
        avgDailys = [];
        axisCategoryies = [];

        setTimeout(() => {
            _.sortBy(datas, 'avgWithAW').reverse().map((d: any, i: number) => {
                avgWithAWs.push(d.avgWithAW);
                avgDailys.push(d.avgDaily);
                axisCategoryies.push(d.axis);
            });

            // avgWithAWs.unshift('avgWithAW');
            // avgDailys.unshift('avgDaily');
            // const chartData: any[] = [avgWithAWs, avgDailys];
            this.AWChartGenerator(item, avgWithAWs, axisCategoryies);
        }, 500);
    }

    setWarningData(avgWithAWs, avgDailys, axisCategoryies, warns, item): void {
        let datas: any[] = [];
        const dataLength: number = avgWithAWs.length;
        for (let i = 0; i < dataLength; i++) {
            datas.push({
                axis: axisCategoryies[i],
                avgWithAW: avgWithAWs[i],
                avgDaily: avgDailys[i]
            });
        }

        avgWithAWs = [];
        avgDailys = [];
        axisCategoryies = [];

        setTimeout(() => {
            _.sortBy(datas, 'avgWithAW').reverse().map((d: any, i: number) => {
                avgWithAWs.push(d.avgWithAW);
                avgDailys.push(d.avgDaily);
                axisCategoryies.push(d.axis);
            });

            // avgWithAWs.unshift('avgWithAW');
            // avgDailys.unshift('avgDaily');
            // const chartData: any[] = [avgWithAWs, avgDailys];
            this.AWChartGenerator(item, avgWithAWs, axisCategoryies);
        }, 500);
    }

    AWChartGenerator(item: pdmRadarI.ChartDataType, avgWithAWs: number[], axisCategoryies: string[]) {
        const color: string = item.type === 'alarm' ? 'red' : 'orange';
        const ranVal: number = Number((Math.floor(Math.random() * (95 - 30)) + 30).toFixed(2));
        const data = ['data', ranVal];
        const label: string = `Max ${item.type}: ${avgWithAWs[0].toFixed(4)} / Paramter: ${axisCategoryies[0]}`;

        setTimeout(() => {
            this.chartData = [[avgWithAWs[0]]];
            this.chartConfig = {
                legend: {
                    show: true
                },
                seriesDefaults: {
                    renderer: $.jqplot.MeterGaugeRenderer,
                    rendererOptions: {
                        label: label,
                        labelPosition: 'bottom',
                        labelHeightAdjust: 10,
                        intervalOuterRadius: 70,
                        min: 0,
                        max: 1.5,
                        ticks: [0, 0.5, 1, 1.5],
                        // intervals: [200, 300, 400, 500],
                        // intervalColors: ['#66cc66', '#93b75f', '#E7E658', '#cc6666']
                        intervals: [0.5, 1, 1.5],
                        intervalColors: ['#66cc66', '#ff0', '#cc6666', '#cc6666']
                    }
                }
            }

            setTimeout(() => {
                this.removeGridLine();
            });
        }, 200);
    }

    setBGChartData(item: pdmRadarI.ChartDataType): void {
        let avgSpecs: any[] = item.chartData.avgSpecs.map((d: any) => d.value);
        let avgDailys: any[] = item.chartData.avgDailys.map((d: any) => d.value);
        let axisCategoryies: any[] = item.chartData.alarms.map((d: any) => d.axis);
        let datas: any[] = [];

        for (let i = 0; i < avgSpecs.length; i++) {
            datas.push({
                axis: axisCategoryies[i],
                avgSpec: avgSpecs[i],
                avgDaily: avgDailys[i],
            });
        }

        avgSpecs = [];
        avgDailys = [];
        axisCategoryies = [];

        setTimeout(() => {
            _.sortBy(datas, 'avgDaily').reverse().map((d: any, i: number) => {
                avgSpecs.push(d.avgSpec);
                avgDailys.push(d.avgDaily);
                axisCategoryies.push(d.axis);
            });

            // avgSpecs.unshift('avgSpec');
            // avgDailys.unshift('avgDaily');
            // axisCategoryies.unshift('x');
            // const chartData: any[] = [avgDailys, avgSpecs];
            this.BGChartGenerator(item, avgDailys, avgSpecs, axisCategoryies);
        }, 500);
    }

    BGChartGenerator(item: pdmRadarI.ChartDataType, avgDailys: number[], avgSpecs: number[], axisCategoryies: string[]) {
        const color: string = item.type === 'G5' ? '#22b8cf' : '#ff009d';
        const ranVal: number = Number((Math.floor(Math.random() * (95 - 30)) + 30).toFixed(2));
        const data = ['data', ranVal];
        const label: string = `Target days avg: ${avgSpecs[0].toFixed(4)} / Paramter: ${axisCategoryies[0]}`;

        setTimeout(() => {
            this.chartData = [[avgSpecs[0]]];
            this.chartConfig = {
                legend: {
                    show: true
                },
                seriesDefaults: {
                    renderer: $.jqplot.MeterGaugeRenderer,
                    rendererOptions: {
                        label: label,
                        labelPosition: 'bottom',
                        labelHeightAdjust: 10,
                        intervalOuterRadius: 70,
                        min: 0,
                        max: 1.5,
                        ticks: [0, 0.5, 1, 1.5],
                        // intervals: [200, 300, 400, 500],
                        // intervalColors: ['#66cc66', '#93b75f', '#E7E658', '#cc6666']
                        intervals: [0.5, 1, 1.5],
                        intervalColors: ['#66cc66', '#ff0', '#cc6666', '#cc6666']
                    }
                }
            }

            setTimeout(() => {
                this.removeGridLine();
            })
        }, 200);
    }

    // drawBarChart(item): void {
    //     if (item.type === 'alarm' || item.type === 'warning') {
    //         this.setAWChartData(item);
    //     } else {
    //         this.setBGChartData(item);
    //     }
    // }

    // setAWChartData(item: any) {
    //     let avgWithAWs: any[] = item.chartData.avgWithAWs.map((d: any) => d.value);
    //     let avgDailys: any[] = item.chartData.avgDailys.map((d: any) => d.value);
    //     let axisCategoryies: any[] = item.chartData.alarms.map((d: any) => d.axis);
    //     let warns: any[] = item.chartData.warns.map((d: any) => d.value);

    //     if (item.type === 'alarm') {
    //         this.setAlarmData(avgWithAWs, avgDailys, axisCategoryies, item);
    //     } else if (item.type === 'warning') {
    //         this.setWarningData(avgWithAWs, avgDailys, axisCategoryies, warns, item);
    //     }
    // }

    // setAlarmData(avgWithAWs, avgDailys, axisCategoryies, item): void {
    //     this.AWChartGenerator(item);
    // }

    // setWarningData(avgWithAWs, avgDailys, axisCategoryies, warns, item): void {
    //     this.AWChartGenerator(item);
    // }

    // AWChartGenerator(item: pdmRadarI.ChartDataType) {
    //     const color: string = item.type === 'alarm' ? 'red' : 'orange';
    //     const ranVal: number = Number((Math.floor(Math.random() * (95 - 30)) + 30).toFixed(2));
    //     const data = ['data', ranVal];

    //     setTimeout(() => {
    //         const chart = c3Chart.generate({
    //             bindto: `#gaugeChart${item.id}${item.type}`,
    //             data: {
    //                 columns: [
    //                     data
    //                 ],
    //                 type: 'gauge',
    //             },
    //             gauge: {
    //                 //        label: {
    //                 //            format: function(value, ratio) {
    //                 //                return value;
    //                 //            },
    //                 //            show: false // to turn off the min/max labels.
    //                 //        },
    //                 //    min: 0, // 0 is default, //can handle negative min e.g. vacuum / voltage / current flow / rate of change
    //                 //    max: 100, // 100 is default
    //                 //    units: ' %',
    //                 //    width: 39 // for adjusting arc thickness
    //             },
    //             color: {
    //                 pattern: [color], // the three color levels for the percentage values.
    //                 threshold: {
    //                     //            unit: 'value', // percentage is default
    //                     //            max: 200, // 100 is default
    //                     // values: [30, 60, 90, 100]
    //                 }
    //             },
    //             size: {
    //                 height: 200
    //             }
    //         });
    //     })
    // }

    // setBGChartData(item): void {
    //     this.BGChartGenerator(item);
    // }

    // BGChartGenerator(item: pdmRadarI.ChartDataType) {
    //     const color: string = item.type === 'G5' ? '#22b8cf' : '#ff009d';
    //     const ranVal: number = Number((Math.floor(Math.random() * (95 - 30)) + 30).toFixed(2));
    //     const data = ['data', ranVal];

    //     setTimeout(() => {
    //         const chart = c3Chart.generate({
    //             bindto: `#gaugeChart${item.id}${item.type}`,
    //             data: {
    //                 columns: [
    //                     data
    //                 ],
    //                 type: 'gauge',
    //             },
    //             gauge: {
    //                 //        label: {
    //                 //            format: function(value, ratio) {
    //                 //                return value;
    //                 //            },
    //                 //            show: false // to turn off the min/max labels.
    //                 //        },
    //                 //    min: 0, // 0 is default, //can handle negative min e.g. vacuum / voltage / current flow / rate of change
    //                 //    max: 100, // 100 is default
    //                 //    units: ' %',
    //                 //    width: 39 // for adjusting arc thickness
    //             },
    //             color: {
    //                 pattern: [color], // the three color levels for the percentage values.
    //                 threshold: {
    //                     //            unit: 'value', // percentage is default
    //                     //            max: 200, // 100 is default
    //                     // values: [30, 60, 90, 100]
    //                 }
    //             },
    //             size: {
    //                 height: 200
    //             }
    //         });
    //     });
    // }

    removeGridLine(): void {//for bistel chart bug
        $('.jqplot-target>canvas.jqplot-grid-canvas').remove();
        $('.jqplot-target>div.jqplot-axis.jqplot-xaxis').remove();
        $('.jqplot-target>div.jqplot-axis.jqplot-yaxis').remove();

    }
}