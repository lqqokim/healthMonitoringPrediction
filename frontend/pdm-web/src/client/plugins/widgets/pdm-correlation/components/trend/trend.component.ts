import { Component, Input, Output, OnInit, OnChanges, ViewEncapsulation, SimpleChanges } from '@angular/core';

import * as ICorrelation from './../../model/correlation-interface';

declare let Plotly: any;

// export enum Type {
//     line = 'lines',
//     maker = 'markers'
// }

export interface Trend {
    datas: ICorrelation.Response;
    // type: Type
    type: string;
}

export interface TrendData {
    mode: string;
    name: string;
    x: Array<number>;
    y: Array<number>;
    line: { color: string }
}

@Component({
    moduleId: module.id,
    selector: 'trend',
    templateUrl: './trend.html',
    styleUrls: ['./trend.css'],
    encapsulation: ViewEncapsulation.None
})
export class TrendComponent implements OnInit, OnChanges {
    @Input() data: ICorrelation.Response;

    private _chartEl: HTMLElement;
    chartId: string = this.guid();
    trendData;

    constructor() {

    }

    ngOnInit() {

    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes && changes['data']['currentValue']) {
            const currentValue: Trend = changes['data']['currentValue'];

            this.drawTrend(currentValue);
        }
    }

    drawTrend(currentValue: Trend): void {
        const trendData = this.getTrendData(currentValue);
        const config = this.getTrendConfig();
        const layout = this.getTrendLayout();

        Plotly.newPlot(this.chartId, {
            data: trendData,
            layout: layout,
            config: config
        });

        this._addTrendEventHandler();
    }

    private _addTrendEventHandler(): void {
        d3.select('#trend')
            .call(d3.behavior.drag()
                .on('dragstart', () => {
                    console.log(d3.event)
                })
                .on('dragend', () => {
                    console.log(d3.event)
                })
            )

        this._chartEl = document.getElementById(this.chartId);
        const trendEl = this._chartEl;

        // (trendEl as any).on('plotly_zoomin', (data: any) => {
        //     console.log('plotly_zoomin => ', data);
        // });
        // (trendEl as any).on('plotly_zoomout', (data: any) => {
        //     console.log('plotly_zoomout => ', data);
        // });
        // (trendEl as any).on('plotly_pan', (data: any) => {
        //     console.log('plotly_zoomout => ', data);
        // });

        // (trendEl as any).on('plotly_scale_x', (data: any) => {
        //     console.log('plotly_zoomout => ', data);
        // });
        // (trendEl as any).on('plotly_scale_y', (data: any) => {
        //     console.log('plotly_zoomout => ', data);
        // });

        (trendEl as any).on('plotly_click', (data: any, ev) => {
            console.log('plotly_click => ', data, ev);
        });
        (trendEl as any).on('plotly_relayout', function (data: any, ev) {
            console.log('plotly_relayout => ', data, ev);
        });
    }

    getTrendData(data: Trend): any {
        return this._setTrendData(data);
    }

    getTrendLayout(): any {
        return this._setTrendLayout();
    }

    getTrendConfig(): any {
        return this._setTrendConfig();
    }

    private _setTrendData(data: Trend): Array<TrendData> {
        console.log('_setTrend => ', data);
        let xValues: Array<number> = [];
        let yValues: Array<number> = [];

        data.datas.correlationTrend[0].map((point) => {
            xValues.push(point[0]);
            yValues.push(point[1]);
        });


        const trace1 = {
            // type: "scatter",
            // mode: "lines",
            mode: data.type,
            name: data.datas.paramNames[0],
            x: xValues,
            y: yValues,
            line: { color: '#17BECF' }
        }

        xValues = [];
        yValues = [];

        data.datas.correlationTrend[1].map((point) => {
            xValues.push(point[0]);
            yValues.push(point[1]);
        });

        const trace2 = {
            mode: data.type,
            name: data.datas.paramNames[1],
            x: xValues,
            y: yValues,
            line: { color: '#7F7F7F' }
        }

        return [trace1, trace2];
    }

    private _setTrendLayout() {
        let layout = this.getTrendDefaultLayout();

        return layout;
    }

    getTrendDefaultLayout(): any {
        const layout = {
            margin: {
                l: 10,
                r: 10,
                b: 10,
                t: 10,
                pad: 4
            },
            xaxis: {
                // fixedrange: true,
                automargin: true,
                // autosize: true   
            },
            yaxis: {
                fixedrange: true,
                automargin: true,
                // autosize: true,
                autorange: 'visible'
            },
            showLegend: true,
            legend: { 
                "orientation": "h" 
                // orientation: 'h' | 'v'
            }
        };

        // legend:{
        //     xanchor:"center",
        //     yanchor:"top",
        //     y:-0.3, // play with it
        //     x:0.5   // play with it
        //   }

        return layout;
    }

    private _setTrendConfig() {
        const config = {
            responsive: true,
            displayModeBar: false,
            // scrollZoom: true,
            // staticPlot: true
        }

        return config;
    }

    private guid() {
        return 'xxx'.replace(/[xy]/g, (c) => {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return "C" + v.toString(16);
        });
    }
}