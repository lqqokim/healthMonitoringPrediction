import { Component, OnInit, OnChanges, SimpleChanges, EventEmitter, Output, Input, ViewEncapsulation } from '@angular/core';
import { PdmModelService } from './../../../../common';
import * as IData from './../model/data-type.interface';

@Component({
    moduleId: module.id,
    selector: 'line-status-trend',
    templateUrl: './line-status-trend.html',
    styleUrls: ['./line-status-trend.css'],
    encapsulation: ViewEncapsulation.None
})
export class LineStatusTrendComponent implements OnInit, OnChanges {
    @Output() endChartLoad: EventEmitter<any> = new EventEmitter();
    @Input() condition: IData.Contition;

    chartId: string;
    chart: any;

    constructor(private _pdmModel: PdmModelService) {
    }

    ngOnChanges(changes: SimpleChanges) {
        for (let propName in changes) {
            let currentValue = changes[propName].currentValue;

            if (currentValue && propName === 'condition') {
                const condition: IData.Contition = currentValue;
                const fabId: number = condition.fab.fabId;
                const areaId: number = condition.area ? condition.area.areaId : undefined;
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
                    this.getTrendData(fabId, areaId, requestParams);
                }
            }
        }
    }

    ngOnInit() {

    }

    onChartResize(size): void {
        if (this.chart) {
            this.chart.resize(size);
        }
    }

    getTrendData(fabId, areaId, params): void {
        if (areaId === undefined) {
            this._pdmModel.getLineStatusTrendAll(fabId, params)
                .then((datas: IData.LineStatusTrend[]) => {
                    console.log('getLineStatusTrendAll', datas);
                    this.setChartData(datas);
                }).catch((err: Error) => {
                    console.log('err', err);
                    this.endChartLoad.emit({
                        isLoad: false,
                        msg: err.message
                    });
                });
        } else {
            this._pdmModel.getLineStatusTrendById(fabId, areaId, params)
                .then((datas: IData.LineStatusTrend[]) => {
                    console.log('getLineStatusTrendById', datas);
                    this.setChartData(datas);
                }).catch((err) => {
                    console.log('err', err);
                    this.endChartLoad.emit({
                        isLoad: false,
                        msg: err.message
                    });
                });
        }
    }


    setChartData(datas: IData.LineStatusTrend[]): void {
        let normals: any[] = ['Normal'];
        let warnings: any[] = ['Warning'];
        let alarms: any[] = ['Alarm'];
        // let failures: any[] = ['failure'];
        let offlines: any[] = ['Offline'];
        let axisCategories: any[] = ['date'];
        const dataLangth: number = datas.length;

        for (let i = 0; i < dataLangth; i++) {
            const data: IData.LineStatusTrend = datas[i];

            normals.push(data.normal_count);
            warnings.push(data.warning_count);
            alarms.push(data.alarm_count);
            offlines.push(data.offline_count);
            axisCategories.push(data.day);
        }

        const chartData: any[] = [axisCategories, normals, warnings, alarms, offlines];

        setTimeout(() => {
            this.generateLineChart(chartData);
        }, 300);
    }

    generateLineChart(chartData: any[]): void {
        const colors: string[] = ['green', 'orange', 'red', 'black', 'gray'];
        this.chart = c3Chart.generate({
            bindto: `#${this.chartId}`,
            data: {
                x: 'date',
                // xFormat: '%Y-%m-%d', // how the date is parsed
                // xFormat: '%m%d', // 'xFormat' can be used as custom format of 'x'
                columns: chartData,
                type: 'line',
                colors: {
                    Normal: 'green',
                    Warning: 'orange',
                    Alarm: 'red',
                    Offline: 'gray'
                },
                // color: (color: string, data: any): string => {
                //     return colors[data.index];
                // },
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        // format: '%Y-%m-%d'
                        format: '%m-%d'
                    }
                },
                y: {
                    tick: {
                        format: function (x) {
                            if (x != Math.floor(x)) {
                              let tick = d3.selectAll('.c3-axis-y g.tick').filter(function() {
                                let text = d3.select(this).select('text').text();
                                return +text === x;
                              }).style('opacity', 0);
                              return '';
                            }
                            return x;
                        }
                    },
                    label: {
                        text: 'EQP(Count)',
                        position: 'outer-middle'
                    },
                }
            }
        });

        this.endChartLoad.emit({
            isLoad: true
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
