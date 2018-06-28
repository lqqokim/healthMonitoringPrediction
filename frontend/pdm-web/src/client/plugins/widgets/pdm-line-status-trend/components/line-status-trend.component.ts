import { Component, OnInit, OnChanges, SimpleChanges, EventEmitter, Output, Input } from '@angular/core';

import * as IDataType from './../model/data-type.interface';

@Component({
    moduleId: module.id,
    selector: 'line-status-trend',
    templateUrl: './line-status-trend.html',
    styleUrls: ['./line-status-trend.css']
})
export class LineStatusTrendComponent implements OnInit, OnChanges {
    @Output() endChartLoad: EventEmitter<any> = new EventEmitter();
    @Input() condition: IDataType.ContitionType;

    chartId: string;
    chart: any;
    private _props: any;

    constructor() {
    }

    ngOnChanges(changes: SimpleChanges) {
        for (let propName in changes) {
            let change = changes[propName];
            const curVal = change.currentValue;
            let item: any;

            if (propName === 'condition') {
                item = curVal;
            }

            this.chartId = this.guid();
            this.setChartData(item);
        }

    }

    ngOnInit() {

    }

    onChartResize(): void {
        this.chart.resize();
    }

    setChartData(item): void {
        const normals: any[] = ['normal', 25, 23, 26, 22, 27, 29, 31];
        const warnings: any[] = ['warning', 4, 9, 3, 12, 3, 7];
        const alarms: any[] = ['alarm', 6, 1, 2, 1, 3, 2, 4];
        const failures: any[] = ['failure', 3, 1, 2, 1, 5, 3, 5];
        const offlines: any[] = ['offline', 2, 3, 3, 1, 2, 4, 1];
        const axisCategories: string[] = ['x', '2018-06-23', '2018-06-24', '2018-06-25', '2018-06-26', '2018-06-27', '2018-06-28'];
        const chartData: any[] = [axisCategories, normals, warnings, alarms, failures, offlines];

        setTimeout(() => {
            // this.generateBarChart(chartData, axisCategories);
            this.generateLineChart(chartData, axisCategories);
            this.endChartLoad.emit(true);
        }, 500);
    }

    generateLineChart(chartData: any[], axisCategories: string[]): void {
        const colors: string[] = ['green', 'orange', 'red', 'black', 'gray'];
        this.chart = c3Chart.generate({
            bindto: `#${this.chartId}`,
            data: {
                x: 'x',
                // xFormat: '%Y%m%d', // 'xFormat' can be used as custom format of 'x'
                columns: chartData,
                type: 'line',
                colors: {
                    normal: 'green',
                    warning: 'orange',
                    alarm: 'red',
                    failure: 'black',
                    offline: 'gray'
                },
                // color: (color: string, data: any): string => {
                //     return colors[data.index];
                // },
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        format: '%Y-%m-%d'
                    }
                }
            }
        });
    }

    generateBarChart(chartData: any[], axisCategories: string[]): void {
        this.chart = c3Chart.generate({
            bindto: `#${this.chartId}`,
            // size: {
            //     height: 300,
            //     width: 680
            // },
            padding: {
                top: 20
            },
            data: {
                type: 'bar',
                x: 'x',
                columns: chartData,
                names: {
                    normal: 'Normal',
                    warning: 'Warning',
                    alarm: 'Alarm',
                    failure: 'Failure',
                    offline: 'Offline'
                },
                colors: {
                    normal: 'green',
                    warning: 'orange',
                    alarm: 'red',
                    failure: 'black',
                    offline: 'gray'
                },
                groups: [['normal', 'warning', 'alarm', 'failure', 'offline']],
                order: 'asc'
            },
            zoom: {
                enabled: false
            },
            axis: {
                x: {
                    type: 'category',
                    // categories: axisCategories
                }
            },
            grid: {
                // y: {
                //     lines: [
                //         { value: 1, text: 'Alarm (1)', class: 'color-grid', position: 'middle' }
                //     ]
                // }
            },
            // tooltip: {
            //     format: {
            //         title: (d) => {
            //             return axisCategoryies[d];
            //         },
            //         value: (value, ratio, id) => {
            //             // console.log(value, ratio, id);
            //             return Number(value).toFixed(6);
            //         }
            //     },
            // }
        });

        // setTimeout(() => {
        //     chart.groups([['normal', 'warning', 'alarm']])
        // }, 500);

        // setTimeout(() => {
        //     chart.groups([['normal', 'warning', 'alarm', 'failure', 'offline']])
        // }, 1000);
    }

    private guid() {
        return 'xxx'.replace(/[xy]/g, (c) => {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return "C" + v.toString(16);
        });
    }
}
