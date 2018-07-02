import { Component, OnInit, OnChanges, SimpleChanges, EventEmitter, Output, Input } from '@angular/core';

import * as IDataType from './../model/data-type.interface';

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

    constructor() {
    }

    ngOnChanges(changes: SimpleChanges) {
        this.chartId = this.guid();        
        this.setChartData();
    }

    ngOnInit() {

    }

    onChartResize(): void {
        this.chart.resize();
    }

    setChartData(): void {
        const alarms: any[] = ['alarm', 23, 15, 23, 21, 24, 22, 21];
        const warnings: any[] = ['warning', 34, 32, 29, 35, 36, 40, 46];
        const axisCategories: string[] = ['x', '2018-06-23', '2018-06-24', '2018-06-25', '2018-06-26', '2018-06-27', '2018-06-28', '2018-06-29'];
        const chartData: any[] = [axisCategories, alarms, warnings];

        setTimeout(() => {
            this.generateChart(chartData, axisCategories, warnings);
            this.endChartLoad.emit(true);
        }, 500);
    }

    generateChart(chartData: any[], axisCategories: string[], warnings): void {
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
}
