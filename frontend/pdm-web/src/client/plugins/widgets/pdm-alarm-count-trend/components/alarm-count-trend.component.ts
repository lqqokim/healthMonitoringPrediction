import { Component, OnInit, OnChanges, SimpleChanges, EventEmitter, Output, Input, ViewEncapsulation } from '@angular/core';
import { PdmModelService } from './../../../../common';
import * as IData from './../model/data-type.interface';

@Component({
    moduleId: module.id,
    selector: 'alarm-count-trend',
    templateUrl: './alarm-count-trend.html',
    styleUrls: ['./alarm-count-trend.css'],
    encapsulation: ViewEncapsulation.None
})
export class AlarmCountTrendComponent implements OnInit, OnChanges {
    @Output() endChartLoad: EventEmitter<any> = new EventEmitter();
    @Input() condition: IData.Contition;

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
                const areaId: number = condition.area ? condition.area.areaId : undefined;
                const timePeriod: IData.TimePeriod = {
                    fromDate: condition.timePeriod.fromDate,
                    toDate: condition.timePeriod.toDate
                };

                const requestParams: IData.RequestParam = {
                    from: timePeriod.fromDate,
                    to: timePeriod.toDate
                };

                if (fabId && requestParams.from && requestParams.to) {
                    this.chartId = this.guid();
                    this.getAlarmCountTrendData(fabId, areaId, requestParams);
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

    getAlarmCountTrendData(fabId, areaId, params): void {
        if (areaId === undefined) {
            this._pdmModel.getAlarmCountTrendAll(fabId, params)
                .then((datas: IData.AlarmCountTrend[]) => {
                    console.log('getAlarmCountTrendAll', datas);
                    this.setChartData(datas);
                }).catch((err) => {
                    console.log('err', err);
                    this.endChartLoad.emit({
                        isLoad: false,
                        msg: err.message
                    });
                });
        } else {
            this._pdmModel.getAlarmCountTrendById(fabId, areaId, params)
                .then((datas: IData.AlarmCountTrend[]) => {
                    console.log('getAlarmCountTrendById', datas);
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

    setChartData(datas: IData.AlarmCountTrend[]): void {
        let warnings: any[] = ['Warning'];
        let alarms: any[] = ['Alarm'];
        let axisCategories: any[] = ['date'];
        const dataLangth: number = datas.length;

        for (let i = 0; i < dataLangth; i++) {
            const data: IData.AlarmCountTrend = datas[i];

            warnings.push(data.warning_count);
            alarms.push(data.alarm_count);
            axisCategories.push(data.day);
        }

        const chartData: any[] = [axisCategories, alarms, warnings];

        setTimeout(() => {
            this.generateChart(chartData);
        }, 300);
    }

    generateChart(chartData: any[]): void {
        const colors: string[] = ['green', 'orange', 'red', 'black', 'gray'];
        this.chart = c3Chart.generate({
            bindto: `#${this.chartId}`,
            data: {
                // xFormat: '%m%d', // 'xFormat' can be used as custom format of 'x'
                x: 'date',
                columns: chartData,
                // type: 'line',
                colors: {
                    Alarm: 'red',
                    Warning: 'orange'
                },
                // color: (color: string, data: any): string => {
                //     return colors[data.index];
                // },
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
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
