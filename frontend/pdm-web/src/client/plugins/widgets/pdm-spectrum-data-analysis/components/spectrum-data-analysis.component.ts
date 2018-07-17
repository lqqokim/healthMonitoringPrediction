//Angular
import { Component, ViewEncapsulation, ViewChild, OnDestroy, ElementRef, OnChanges, OnInit, Output, EventEmitter, Input } from '@angular/core';

//MIP
import { WidgetRefreshType, WidgetApi, OnSetup, RequestType } from './../../../../common';
import { PdmEqpParamAnalysisService } from './../../pdm-eqp-param-analysis/pdm-eqp-param-analysis.service';
import { PdmCommonService } from './../../../../common/service/pdm-common.service';

import { ModelingTreeComponent } from './../../../common/modeling-tree/modeling-tree.component';

export interface ChartDataType {
    data: any[];
    layout: any;
}

@Component({
    moduleId: module.id,
    selector: 'spectrum-data-analysis',
    templateUrl: './spectrum-data-analysis.html',
    styleUrls: ['./spectrum-data-analysis.html'],
    providers: [PdmEqpParamAnalysisService, PdmCommonService],
    encapsulation: ViewEncapsulation.None
})
export class SpectrumDataAnalysisComponent implements OnInit, OnChanges, OnDestroy {
    // @Output() onLoad: EventEmitter<any> = new EventEmitter();
    // @Input() condition: any;

    // public graph: any = {
    //     data: [
    //         { x: [1, 2, 3], y: [2, 6, 3], type: 'scatter', mode: 'lines+points', marker: { color: 'red' } },
    //         { x: [1, 2, 3], y: [2, 5, 3], type: 'bar' },
    //     ],
    //     layout: { width: 320, height: 240, title: 'A Fancy Plot' }
    // };

    public graph: ChartDataType = {
        data: undefined,
        layout: undefined
    }

    constructor() {

    }

    ngOnChanges() {

    }

    ngOnInit() {        
        this.setChartData();
    }


    setChartData(): void {
        let datas: any[] = [];

        for (var i = 0; i < 20; i++) {
            let x = [];
            let y = [];
            let z = [];

            for (let j = 0; j < 100; j++) {
                x.push(i);
                y.push(j);

                if (j > 20 && j < 30) {
                    z.push(randomRange(10, 20) / 10);
                } else {
                    z.push(randomRange(1, 3) / 10);
                }
            }

            const data: any = {
                x: x,
                y: y,
                z: z,
                mode: 'lines',
                marker: {
                    color: '#1f77b4',
                    size: 12,
                    symbol: 'circle',
                    line: {
                        color: 'rgb(0,0,0)',
                        width: 0
                    }
                },
                line: {
                    color: '#1f77b4',
                    width: 1
                },
                type: 'scatter3d'
            };
            datas.push(data);
        }

        const layout: any = {
            title: '3D Line Plot',
            autosize: false,
            showlegend: false,
            width: 1000,
            height: 500,
            margin: {
                l: 0,
                r: 0,
                b: 0,
                t: 65
            },
            scene: {
                aspectratio: {
                    x: 1, y: 2, z: 0.1
                },
                camera: {
                    eye: { x: 1.9896227268277047, y: 0.0645906841396725, z: 0.5323776223386583 }
                }
            }
        };

        this.graph.data = datas;
        this.graph.layout = layout;


        function randomRange(min, max) {
            return Math.floor(Math.random() * ((max - min) + 1) + min);
        }

        // this.onLoad.emit({
        //     isLoad: true
        // });
    }


    ngOnDestroy() {

    }
}