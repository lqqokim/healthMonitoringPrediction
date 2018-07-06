import { Component, OnInit, OnChanges, SimpleChanges, EventEmitter, Output, Input } from '@angular/core';
import { PdmModelService } from './../../../../common';
import * as IDataType from './../model/data-type.interface';

export interface LineStatusTrendType {
    alarm_count: number;
    area_id: number;
    area_name: string;
    day: string;
    failure_count: number;
    normal_count: number;
    offline_count: number;
    start_time: number
    total_count: number;
    warning_count: number;
}

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

    constructor(private _pdmModel: PdmModelService) {
    }

    ngOnChanges(changes: SimpleChanges) {
        for (let propName in changes) {
            let currentValue = changes[propName].currentValue;

            if (currentValue && propName === 'condition') {
                const condition = currentValue;
                this.chartId = this.guid();
                this.getTrendData(condition);
            }
        }
    }

    ngOnInit() {

    }

    onChartResize(): void {
        this.chart.resize();
    }

    getTrendData(condition: IDataType.ContitionType): void {
        const fabId: string | number = condition.fab.fabId;
        const areaId: string | number = condition.area ? condition.area.areaId : undefined;
        const params: any = {
            from: condition.timePeriod.from,
            to: condition.timePeriod.to
        };

        if (areaId === undefined) {
            this._pdmModel.getLineStatusTrendAll(fabId, params)
                .then((datas: LineStatusTrendType[]) => {
                    console.log('getLineStatusTrendAll', datas);
                    this.setChartData(datas);
                }).catch((err) => {
                    console.log('err', err);
                    this.endChartLoad.emit(false);
                });
        } else {
            this._pdmModel.getLineStatusTrendById(fabId, areaId, params)
            .then((datas: LineStatusTrendType[]) => {
                console.log('getLineStatusTrendById', datas);
                this.setChartData(datas);
            }).catch((err) => {
                console.log('err', err);
                this.endChartLoad.emit(false);
            });
        }
    }


    setChartData(datas: LineStatusTrendType[]): void {
        let normals: any[] = ['normal'];
        let warnings: any[] = ['warning'];
        let alarms: any[] = ['alarm'];
        let failures: any[] = ['failure'];
        let offlines: any[] = ['offline'];
        let axisCategories: any[] = ['x'];
        const dataLangth: number = datas.length;

        for (let i = 0; i < dataLangth; i++) {
            const data: LineStatusTrendType = datas[i];

            normals.push(data.normal_count);
            warnings.push(data.warning_count);
            alarms.push(data.alarm_count);
            failures.push(data.failure_count);
            offlines.push(data.offline_count);
            axisCategories.push(data.day);
        }

        const chartData: any[] = [axisCategories, normals, warnings, alarms, failures, offlines];

        setTimeout(() => {
            this.generateLineChart(chartData);
            this.endChartLoad.emit(true);
        }, 500);
    }

    generateLineChart(chartData: any[]): void {
        const colors: string[] = ['green', 'orange', 'red', 'black', 'gray'];
        this.chart = c3Chart.generate({
            bindto: `#${this.chartId}`,
            data: {
                x: 'x',
                // xFormat: '%Y-%m-%d', // how the date is parsed
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
