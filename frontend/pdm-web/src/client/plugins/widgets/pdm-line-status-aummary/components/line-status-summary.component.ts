import { Component, OnInit, OnChanges, SimpleChanges, EventEmitter, Output, Input, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';

import * as IDataType from './../model/data-type.interface';

@Component({
    moduleId: module.id,
    selector: 'line-status-summary',
    templateUrl: './line-status-summary.html',
    styleUrls: ['./line-status-summary.css'],
})
export class LineStatusSummaryComponent implements OnInit, OnChanges {
    @Output() endChartLoad: EventEmitter<any> = new EventEmitter();
    @Input() condition: IDataType.ContitionType;

    chartId;

    private chart: any;
    private _props: any;

    constructor() {
    }

    ngOnChanges(changes: SimpleChanges) {
        for (let propName in changes) {
            let change = changes[propName];
            let curVal = change.currentValue;

            if (propName === 'condition') {
                this.chartId = this.guid();
                this.setChartData();
            }
        }
    }

    ngOnInit() {

    }

    onChartResize(): void {
        this.chart.resize();
    }

    setChartData(): void {
        const normals: any[] = ['normal', 25, 23, 26, 22, 27];
        const warnings: any[] = ['warning', 4, 5, 3, 1, 3];
        const alarms: any[] = ['alarm', 6, 1, 2, 1, 3];
        const failures: any[] = ['failure', 1, 1, 2, 1, 1];
        const offlines: any[] = ['offline', 2, 1, 3, 1, 2];
        const axisCategories: string[] = ['x', '1Line', '2Line', '3Line', '4Line', '5Line'];
        const chartData: any[] = [axisCategories, normals, warnings, alarms, failures, offlines];

        setTimeout(() => {
            this.generateChart(chartData, axisCategories);
            this.endChartLoad.emit(true);
        }, 500);
    }

    generateChart(chartData: any[], axisCategories: string[]): void {
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
        //     this.chart.groups([['normal', 'warning', 'alarm']]);
        // }, 500);

        // setTimeout(() => {
        //     this.chart.groups([['normal', 'warning', 'alarm', 'failure', 'offline']]);
        // }, 1000);
    }

    private guid() {
        return 'xxx'.replace(/[xy]/g, (c) => {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return "C" + v.toString(16);
        });
    }
}
