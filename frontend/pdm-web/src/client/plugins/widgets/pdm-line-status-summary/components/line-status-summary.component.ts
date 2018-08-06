import { Component, OnInit, OnChanges, SimpleChanges, EventEmitter, Output, Input, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { PdmModelService } from './../../../../common';
import * as IData from './../model/data-type.interface';

@Component({
    moduleId: module.id,
    selector: 'line-status-summary',
    templateUrl: './line-status-summary.html',
    styleUrls: ['./line-status-summary.css'],
})
export class LineStatusSummaryComponent implements OnInit, OnChanges {
    @Input() condition: IData.Contition;
    @Output() endChartLoad: EventEmitter<any> = new EventEmitter();
    @Output() onSync: EventEmitter<any> = new EventEmitter();

    chartId;
    private chart: any;
    private _props: any;

    constructor(private _pdmModel: PdmModelService) {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['condition'] !== null && changes['condition']['currentValue']) {
            let condition: IData.Contition = changes['condition']['currentValue'];
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
                this.getSummaryData(fabId, requestParams);
            }
        }
    }

    ngOnInit() {

    }

    onChartResize(size?): void {
        console.log('onChartResize', size)
        if (this.chart) {
            this.chart.resize(size);
        }
    }

    getSummaryData(fabId, params): void {
        this._pdmModel.getLineStatusSummary(fabId, params)
            .then((datas: IData.LineStatusSummary[]) => {
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

    setChartData(datas: IData.LineStatusSummary[]): void {
        let normals: any[] = ['normal'];
        let warnings: any[] = ['warning'];
        let alarms: any[] = ['alarm'];
        let offlines: any[] = ['offline'];
        let axisCategories: string[] = ['x'];
        let areas: any[] = [];
        const dataLangth: number = datas.length;

        for (let i = 0; i < dataLangth; i++) {
            const data: IData.LineStatusSummary = datas[i];
            normals.push(data.normal_count);
            warnings.push(data.warning_count);
            alarms.push(data.alarm_count);
            offlines.push(data.offline_count);
            axisCategories.push(data.area_name);
            areas.push({
                areaId: data.area_id,
                areaName: data.area_name
            })
        }

        const chartData: any[] = [axisCategories, normals, warnings, alarms, offlines];

        setTimeout(() => {
            this.generateChart(chartData, axisCategories, areas);
        }, 300);
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
                    offline: 'Offline'
                },
                colors: {
                    normal: 'green',
                    warning: 'orange',
                    alarm: 'red',
                    offline: 'gray'
                },
                groups: [['normal', 'warning', 'alarm', 'offline']],
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
            // onresize: function (e) {
            //     console.log('resize', e)
            //     const chartEl = $(`#${this.chartId}`);
            //     $el.css("max-height", "none");
            // }
        });

        this.endChartLoad.emit({
            isLoad: true
        });
    }

    private guid() {
        return 'xxx'.replace(/[xy]/g, (c) => {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return "C" + v.toString(16);
        });
    }
}
