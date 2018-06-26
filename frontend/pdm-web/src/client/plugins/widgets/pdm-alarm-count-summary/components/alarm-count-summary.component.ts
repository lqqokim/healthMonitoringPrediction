import { Component, OnInit, OnChanges, SimpleChanges, EventEmitter, Output, Input } from '@angular/core';

import * as IDataType from './../model/data-type.interface';

@Component({
    moduleId: module.id,
    selector: 'alarm-count-summary',
    templateUrl: './alarm-count-summary.html',
    styleUrls: ['./alarm-count-summary.css']
})
export class PdmAlarmCountSummaryComponent implements OnInit, OnChanges {
    @Output() endChartLoad: EventEmitter<any> = new EventEmitter();
    @Input() condition: IDataType.ContitionType;
    
    chartId;
    private _props: any;

    constructor() {
    }

    ngOnChanges(changes: SimpleChanges) {
        this.chartId = this.guid();        
        this.setChartData();
    }

    ngOnInit() {

    }

    setChartData(): void {
        const alarms: any[] = ['alarm', 5, 4, 6, 5, 4];
        const warnings: any[] = ['warning', 7, 8, 9, 12, 11];
        const axisCategories: string[] = ['x', '1Line', '2Line', '3Line', '4Line', '5Line'];
        const chartData: any[] = [axisCategories, alarms];

        setTimeout(() => {
            this.generateChart(chartData, axisCategories, warnings);
            this.endChartLoad.emit(true);
        }, 500);
    }

    generateChart(chartData: any[], axisCategories: string[], warnings): void {
        const chart: any = c3Chart.generate({
            bindto: `#${this.chartId}`,
            legend: {
                position: 'right'
            },
            size: {
                height: 350,
                width: 700
            },
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
        
        setTimeout(() => {
            chart.load({
                columns: [warnings]
            });
        }, 500);
    }

    private guid() {
        return 'xxx'.replace(/[xy]/g, (c) => {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return "C" + v.toString(16);
        });
      }
}
