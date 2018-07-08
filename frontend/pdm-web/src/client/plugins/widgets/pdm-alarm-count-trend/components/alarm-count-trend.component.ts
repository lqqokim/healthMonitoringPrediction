import { Component, OnInit, OnChanges, SimpleChanges, EventEmitter, Output, Input } from '@angular/core';
import { PdmModelService } from './../../../../common';
import * as IDataType from './../model/data-type.interface';

export interface AlarmCountTrendType {
    alarm_count: number;
    area_id: number;
    area_name: string;
    failure_count: number;
    normal_count: number;
    offline_count: number;
    start_time: number
    total_count: number;
    warning_count: number;
    day: string;
}

@Component({
    moduleId: module.id,
    selector: 'alarm-count-trend',
    templateUrl: './alarm-count-trend.html',
    styleUrls: ['./alarm-count-trend.css']
})
export class AlarmCountTrendComponent implements OnInit, OnChanges {
    @Output() endChartLoad: EventEmitter<any> = new EventEmitter();
    @Input() condition: IDataType.ContitionType;

    chartId: any;
    chart: any;
    private _props: any;

    constructor(private _pdmModel: PdmModelService) {
    }

    ngOnChanges(changes: SimpleChanges) {
        for (let propName in changes) {
            let condition = changes[propName].currentValue;

            if (condition && propName === 'condition') {
                this.chartId = this.guid();
                this.getAlarmCountTrendData(condition);
            }
        }
    }

    ngOnInit() {

    }

    onChartResize(): void {
        this.chart.resize();
    }

    getAlarmCountTrendData(condition: IDataType.ContitionType): void {
        const fabId: number | string = condition.fab.fabId;
        const areaId: string | number = condition.area ? condition.area.areaId : undefined;
        const params: any = {
            from: condition.timePeriod.from,
            to: condition.timePeriod.to
        };

        if (areaId === undefined) {
            this._pdmModel.getAlarmCountTrendAll(fabId, params)
                .then((datas: AlarmCountTrendType[]) => {
                    console.log('getAlarmCountTrendAll', datas);
                    this.setChartData(datas);
                }).catch((err) => {
                    console.log('err', err);
                    this.endChartLoad.emit(false);
                });
        } else {
            this._pdmModel.getAlarmCountTrendById(fabId, areaId, params)
            .then((datas: AlarmCountTrendType[]) => {
                console.log('getAlarmCountTrendById', datas);
                this.setChartData(datas);
            }).catch((err) => {
                console.log('err', err);
                this.endChartLoad.emit(false);
            });
        }

    }

    setChartData(datas: AlarmCountTrendType[]): void {
        let normals: any[] = ['normal'];
        let warnings: any[] = ['warning'];
        let alarms: any[] = ['alarm'];
        let failures: any[] = ['failure'];
        let offlines: any[] = ['offline'];
        let axisCategories: any[] = ['x'];
        const dataLangth: number = datas.length;

        for (let i = 0; i < dataLangth; i++) {
            const data: AlarmCountTrendType = datas[i];

            normals.push(data.normal_count);
            warnings.push(data.warning_count);
            alarms.push(data.alarm_count);
            failures.push(data.failure_count);
            offlines.push(data.offline_count);
            axisCategories.push(data.day);
        }

        const chartData: any[] = [axisCategories, alarms, warnings];

        setTimeout(() => {
            this.generateChart(chartData);
            this.endChartLoad.emit(true);
        }, 500);
    }

    generateChart(chartData: any[]): void {
        const colors: string[] = ['green', 'orange', 'red', 'black', 'gray'];
        this.chart = c3Chart.generate({
            bindto: `#${this.chartId}`,
            data: {
                x: 'x',
                // xFormat: '%Y%m%d', // 'xFormat' can be used as custom format of 'x'
                columns: chartData,
                type: 'line',
                colors: {
                    alarm: 'red',
                    warning: 'orange'
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

        // this.chart = c3Chart.generate({
        //     bindto: `#${this.chartId}`,
        //     legend: {
        //         position: 'right'
        //     },
        //     // size: {
        //     //     height: 350,
        //     //     width: 700
        //     // },
        //     padding: {
        //         top: 20
        //     },
        //     data: {
        //         type: 'bar',
        //         x: 'x',
        //         columns: chartData,
        //         names: {
        //             alarm: 'Alarm',
        //             warning: 'Warning'
        //         },
        //         colors: {
        //             alarm: 'red',
        //             warning: 'orange'
        //         }
        //     },
        //     zoom: {
        //         enabled: false
        //     },
        //     axis: {
        //         x: {
        //             type: 'category',
        //             // categories: axisCategories
        //         }
        //     },
        //     grid: {
        //         // y: {
        //         //     lines: [
        //         //         { value: 1, text: 'Alarm (1)', class: 'color-grid', position: 'middle' }
        //         //     ]
        //         // }
        //     },
        //     // tooltip: {
        //     //     format: {
        //     //         title: (d) => {
        //     //             return axisCategoryies[d];
        //     //         },
        //     //         value: (value, ratio, id) => {
        //     //             // console.log(value, ratio, id);
        //     //             return Number(value).toFixed(6);
        //     //         }
        //     //     },
        //     // }
        // });

        // setTimeout(() => {
        //     chart.load({
        //         columns: [warnings]
        //     });
        // }, 500);
    }

    private guid() {
        return 'xxx'.replace(/[xy]/g, (c) => {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return "C" + v.toString(16);
        });
    }

    ngOnDestroy(): void {
        $(`#${this.chartId}`).empty();
        this.chart = null;
    }
}
