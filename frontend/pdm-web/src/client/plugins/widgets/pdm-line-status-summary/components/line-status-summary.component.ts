import { Component, OnInit, OnChanges, SimpleChanges, EventEmitter, Output, Input, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { PdmModelService } from './../../../../common';
import * as IDataType from './../model/data-type.interface';

export interface LineStatusSummaryType {
    alarm_count: number;
    area_id: number;
    area_name: string;
    end_time: number;
    failure_count: number;
    normal_count: number;
    offline_count: number;
    start_time: number
    total_count: number;
    warning_count: number;
}

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
        if (changes['condition'] !== null && changes['condition']['currentValue']) {
            let condition = changes['condition']['currentValue'];
            this.chartId = this.guid();

            if (condition.fab.fabId && condition.timePeriod.fromDate && condition.timePeriod.toDate) {
                this.getSummaryData(condition);
            }
        }
    }

    ngOnInit() {

    }

    onChartResize(): void {
        if (this.chart) {
            this.chart.resize();
        }
    }

    getSummaryData(condition: IDataType.ContitionType): void {
        let fabId: string | number = condition.fab.fabId;
        let params: any = {
            from: condition.timePeriod.fromDate,
            to: condition.timePeriod.toDate
        }

        this._pdmModel.getLineStatusSummary(fabId, params)
            .then((datas: LineStatusSummaryType[]) => {
                console.log('getLineStatusSummary', datas);
                this.setChartData(datas);
            }).catch((err) => {
                console.log('err', err);
                this.endChartLoad.emit({
                    isLoad: false,
                    msg: err.message
                });
            });
    }

    setChartData(datas: LineStatusSummaryType[]): void {
        let normals: any[] = ['normal'];
        let warnings: any[] = ['warning'];
        let alarms: any[] = ['alarm'];
        let failures: any[] = ['failure'];
        let offlines: any[] = ['offline'];
        let axisCategories: string[] = ['x'];
        let areas: any[] = [];
        const dataLangth: number = datas.length;

        for (let i = 0; i < dataLangth; i++) {
            const data: LineStatusSummaryType = datas[i];
            normals.push(data.normal_count);
            warnings.push(data.warning_count);
            alarms.push(data.alarm_count);
            failures.push(data.failure_count);
            offlines.push(data.offline_count);
            axisCategories.push(data.area_name);
            areas.push({
                areaId: data.area_id,
                areaName: data.area_name
            })
        }

        const chartData: any[] = [axisCategories, normals, warnings, alarms, failures, offlines];

        setTimeout(() => {
            this.generateChart(chartData, axisCategories, areas);
            this.endChartLoad.emit({
                isLoad: true
            });
        }, 500);
    }



    generateChart(chartData: any[], axisCategories: string[], areas: any[]): void {
        this.chart = c3Chart.generate({
            bindto: `#${this.chartId}`,
            // size: {
            //     height: 300,
            //     width: 680
            // },
            legend: {
                position: 'right'
            },
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
                            areaId: areas[d.index].areaId,
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
        });
    }

    private guid() {
        return 'xxx'.replace(/[xy]/g, (c) => {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return "C" + v.toString(16);
        });
    }
}
