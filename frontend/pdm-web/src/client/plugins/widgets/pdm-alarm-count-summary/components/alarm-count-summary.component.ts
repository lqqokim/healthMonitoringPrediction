import { Component, OnInit, OnChanges, SimpleChanges, EventEmitter, Output, Input } from '@angular/core';
import { PdmModelService } from './../../../../common';
import * as IData from './../model/data-type.interface';

@Component({
    moduleId: module.id,
    selector: 'alarm-count-summary',
    templateUrl: './alarm-count-summary.html',
    styleUrls: ['./alarm-count-summary.css']
})
export class AlarmCountSummaryComponent implements OnInit, OnChanges {
    @Input() condition: IData.Contition;
    @Output() endChartLoad: EventEmitter<any> = new EventEmitter();
    @Output() onSync: EventEmitter<any> = new EventEmitter();

    chartId: any;
    chart: any;
    private _props: any;

    constructor(private _pdmModel: PdmModelService) {
    }

    ngOnChanges(changes: SimpleChanges) {
        for (let propName in changes) {
            let currentValue = changes[propName].currentValue;

            if (currentValue && propName === 'condition') {
                const condition: IData.Contition = currentValue;
                const fabId: number = condition.fab.fabId;
                const timePeriod: IData.TimePeriod = {
                    fromDate: condition.timePeriod.fromDate,
                    toDate: condition.timePeriod.toDate
                };
                
                const requestParams: IData.RequestParams = {
                    from: timePeriod.fromDate,
                    to: timePeriod.toDate
                };

                if (fabId && requestParams.from && requestParams.to) {
                    this.chartId = this.guid();
                    this.getAlarmCountSummaryData(fabId, requestParams);
                }
            }
        }
    }

    ngOnInit() {

    }

    onChartResize(size): void {
        if (this.chart) {
            this.chart.resize();
        }
    }

    getAlarmCountSummaryData(fabId, params): void {
        this._pdmModel.getAlarmCountSummary(fabId, params)
            .then((datas: IData.AlarmCountSummary[]) => {
                console.log('getAlarmCountSummary', datas);
                this.setChartData(datas);
            }).catch((err) => {
                console.log('err', err);
                this.endChartLoad.emit({
                    isLoad: false,
                    msg: err.message
                });
            });
    }

    setChartData(datas: IData.AlarmCountSummary[]): void {
        let normals: any[] = ['normal'];
        let warnings: any[] = ['warning'];
        let alarms: any[] = ['alarm'];
        let failures: any[] = ['failure'];
        let offlines: any[] = ['offline'];
        let axisCategories: string[] = ['x'];
        let areas: any[] = [];
        const dataLangth: number = datas.length;

        for (let i = 0; i < dataLangth; i++) {
            const data: IData.AlarmCountSummary = datas[i];

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

        const chartData: any[] = [axisCategories, warnings, alarms];

        setTimeout(() => {
            this.generateChart(chartData, axisCategories, areas);
        }, 300);
    }

    generateChart(chartData: any[], axisCategories: string[], areas: any[]): void {
        this.chart = c3Chart.generate({
            bindto: `#${this.chartId}`,
            legend: {
                position: 'right'
            },
            // size: {
            //     height: 350,
            //     width: 700
            // },
            padding: {
                top: 20
            },
            data: {
                type: 'bar',
                x: 'x',
                columns: chartData,
                names: {
                    alarm: 'Alarm',
                    warning: 'Warning'
                },
                colors: {
                    alarm: 'red',
                    warning: 'orange'
                },
                onclick: (d: any, s) => {
                    console.log('onclick', d, s);
                    console.log('area!!', areas[d.index]);
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
                    label: {
                        text: 'Area',
                        position: 'outer-center'
                    },
                },
                y: {
                    min: 0,
                    tick: {
                        format: d3.format('d')
                    },
                    padding: {top: 0, bottom: 0},
                    label: {
                        text: 'EQP(Count)',
                        position: 'outer-middle'
                    },
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

        this.endChartLoad.emit({
            isLoad: true
        });

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
}
