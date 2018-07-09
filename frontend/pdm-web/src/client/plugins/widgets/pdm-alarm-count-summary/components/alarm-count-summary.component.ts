import { Component, OnInit, OnChanges, SimpleChanges, EventEmitter, Output, Input } from '@angular/core';
import { PdmModelService } from './../../../../common';
import * as IDataType from './../model/data-type.interface';

export interface AlarmCountSummaryType {
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
    selector: 'alarm-count-summary',
    templateUrl: './alarm-count-summary.html',
    styleUrls: ['./alarm-count-summary.css']
})
export class AlarmCountSummaryComponent implements OnInit, OnChanges {
    @Input() condition: IDataType.ContitionType;
    @Output() endChartLoad: EventEmitter<any> = new EventEmitter();
    @Output() onSync: EventEmitter<any> = new EventEmitter();
    
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
                this.getAlarmCountSummaryData(condition);
            }
        }
    }

    ngOnInit() {

    }

    onChartResize(): void {
        if(this.chart) {
            this.chart.resize();
        }
    }

    getAlarmCountSummaryData(condition: IDataType.ContitionType): void {
        const fabId: number | string = condition.fab.fabId;
        const params: any = {
            from: condition.timePeriod.fromDate,
            to: condition.timePeriod.toDate
        };

        this._pdmModel.getAlarmCountSummary(fabId, params)
            .then((datas: AlarmCountSummaryType[]) => {
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

    setChartData(datas: AlarmCountSummaryType[]): void {
        let normals: any[] = ['normal'];
        let warnings: any[] = ['warning'];
        let alarms: any[] = ['alarm'];
        let failures: any[] = ['failure'];
        let offlines: any[] = ['offline'];
        let axisCategories: string[] = ['x'];
        const dataLangth: number = datas.length;

        for (let i = 0; i < dataLangth; i++) {
            const data: AlarmCountSummaryType = datas[i];
            
            normals.push(data.normal_count);
            warnings.push(data.warning_count);
            alarms.push(data.alarm_count);
            failures.push(data.failure_count);
            offlines.push(data.offline_count);
            axisCategories.push(data.area_name);
        }

        const chartData: any[] = [axisCategories, warnings, alarms];

        setTimeout(() => {
            this.generateChart(chartData, axisCategories);
            this.endChartLoad.emit({
                isLoad: true
            });
        }, 500);
    }

    generateChart(chartData: any[], axisCategories: string[]): void {
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
                    this.onSync.emit({
                        area: {
                            areaId: 200,
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
