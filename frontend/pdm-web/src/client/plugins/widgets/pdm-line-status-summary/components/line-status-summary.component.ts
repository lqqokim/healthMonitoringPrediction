import { Component, OnInit, OnChanges, SimpleChanges, EventEmitter, Output, Input, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { PdmModelService } from './../../../../common';
import * as IDataType from './../model/data-type.interface';

@Component({
    moduleId: module.id,
    selector: 'line-status-summary',
    templateUrl: './line-status-summary.html',
    styleUrls: ['./line-status-summary.css'],
})
export class LineStatusSummaryComponent implements OnInit, OnChanges {
    @Input() condition: IDataType.ContitionType;
    @Output() endChartLoad: EventEmitter<any> = new EventEmitter();
    @Output() onSync: EventEmitter<any> = new EventEmitter();

    chartId;

    private chart: any;
    private _props: any;

    constructor(private _pdmModel: PdmModelService) {
    }

    ngOnChanges(changes: SimpleChanges) {
        // for (let propName in changes) {
        //     let currentValue = changes[propName].currentValue;

        //     if (currentValue && propName === 'condition') {
        //         const condition = currentValue;
        //         this.chartId = this.guid();
        //         this.getSummaryData(condition);
        //     }
        // }
        if (changes['condition'] !== null && changes['condition']['currentValue']) {
            let condition = changes['condition']['currentValue'];
            this.chartId = this.guid();
            this.getSummaryData(condition);
        }
    }

    ngOnInit() {

    }

    onChartResize(): void {
        // let chartEl = $(`#${this.chartId}`)[0];
        // console.log('chartEl', chartEl);
        this.chart.resize();
    }

    getSummaryData(condition) {
        const fabId = condition.fabId;
        const params = {
            fromdate: condition.timePeriod.from,
            todate: condition.timePeriod.to
        };

        this._pdmModel.getLineStatusSummary(fabId, params)
            .then((res) => {
                console.log('getLineStatusSummary', res);
                this.setChartData();
            }).catch((err) => {
                console.log('err', err);
            });
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
                order: 'asc',
                onclick: (d: any, s) => {
                    this.onSync.emit({
                        area: {
                            areaId: 1,
                            areaName: axisCategories[d.index + 1]
                        }
                    });
                }
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
