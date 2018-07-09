import { Component, ViewEncapsulation, OnInit, ViewChild, Input, OnDestroy, ElementRef, Renderer, OnChanges, AfterViewInit } from '@angular/core';
import { UUIDUtil } from '../../../sdk/utils/uuid.util';

import { Ng2C3Component } from '../ng2-c3/ng2-c3.component';

@Component({
    moduleId: module.id,
    selector: 'line-chart',
    templateUrl: 'line-chart.html',
    styleUrls: ['line-chart.css'],
    encapsulation: ViewEncapsulation.None
})

export class LineChartComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {

    // @ViewChild('list') listElem: ElementRef;

    // // 차트 데이터 (columns)
    // @Input() chartData: Array<IDonutChartData>;
    // @Input() chartColor: Array<IColorSet>;

    @Input() data;
    @Input() config;
    @Input() eventLines;
    @Input() chartEvents;


    private _data: any;
    private _chartOptions:any ;
    private _configs: any;

    id = "r" + UUIDUtil.new().replace(/-/g, '');



    constructor() {

    }

    ngOnInit() {
        //     this._data = {
        //         columns: [
        //         // ['data1', 30, 20, 50, 40, 60, 50],
        //         // ['data2', 200, 130, 90, 240, 130, 220],
        //         // ['data3', 300, 200, 160, 400, 250, 250],
        //         // ['data4', 200, 130, 90, 240, 130, 220],
        //         // ['data5', 130, 120, 150, 140, 160, 150],
        //         // ['data6', 90, 70, 20, 50, 60, 120],
        //     ],
        //     type: 'line',
        //     // types: {
        //     //     data3: 'spline',
        //     //     data4: 'line',
        //     //     data6: 'area',
        //     // },
        //     // groups: [
        //     //     ['data1','data2']
        //     // ]
        //    };

        //Options provided for chart like axis, tooltip, legend, zoom etc.
        this._configs = {
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        format: '%Y-%m-%d'
                    }
                }
            },
            point: {
                show: false
            },
            'zoom': {
                enabled: true
            },
            grid: {
                y: {
                    lines: [
                        {value: 0.235, text: 'Label 50 for y' ,class: 'red-line',selection: { draggable: true }},
                        {value: 1300, text: 'Label 1300 for y2', position: 'start'},
                        {value: 350, text: 'Label 350 for y', position: 'middle'}
                    ]
                }
            }
            
            
        };

        //Specific Chart Configuration
        this._chartOptions = {
            // size: {
            //     height: '100%',
            //     width: '100%'
            // },
            padding: {
                top: 40,
                right: 100,
                bottom: 40,
                left: 100,
            },
            color: {
                pattern: ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5']
            },
            transition: {
                duration: 100
            }
        };

    }

    ngOnDestroy() {
    }

    ngOnChanges(c: any) {
        if (this.data != null) {
            this._data = {
                x: 'x',
                columns: this.makeData()
            }
        }

    }
    makeData() {
        let datas = []
        let x = [];
        datas.push(x);
        for (let index = 0; index < this.data.length; index++) {
            const element: any = this.data[index];
            let newSeriesDatas = [];
            newSeriesDatas.push(`series${index}`);
            if (x.length > 0) {
                for (let index1 = 0; index1 < element.length; index1++) {
                    const seriesData = element[index1];
                    newSeriesDatas.push(seriesData[1]);
                }

            } else {
                x.push("x");
                for (let index1 = 0; index1 < element.length; index1++) {
                    const seriesData = element[index1];
                    x.push(seriesData[0]);
                    newSeriesDatas.push(seriesData[1]);
                }

            }
            datas.push(newSeriesDatas);
        }
        return datas;


    }
    ngAfterViewInit() {
        let datas = [];
        if (this.data != null) {
            datas = this.makeData();
        }


    }
}