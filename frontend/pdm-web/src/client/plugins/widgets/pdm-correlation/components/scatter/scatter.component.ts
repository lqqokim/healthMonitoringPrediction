import { Component, Input, Output, OnInit, OnChanges, ViewEncapsulation, EventEmitter, SimpleChanges } from '@angular/core';
import * as ICorrelation from './../../model/correlation-interface';

declare let Plotly: any;

export interface Scatter {
    x: Array<number>;
    y: Array<number>;
    mode: string;
    name: string;
    text?: Array<string>;
    marker: {
        color: string;
        size: number;
        line: {
            color: string;
            width: number;
        }
    },
    type: string;
}

export type ScatterData = Array<Scatter>;

@Component({
    moduleId: module.id,
    selector: 'scatter',
    templateUrl: './scatter.html',
    styleUrls: ['./scatter.css'],
    encapsulation: ViewEncapsulation.None
})
export class ScatterComponent implements OnInit, OnChanges {
    @Input() data: ICorrelation.Response;

    chartId: string = this._guid();;

    constructor() {

    }

    ngOnInit() {

    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes && changes['data']['currentValue']) {
            const data: ICorrelation.Response = changes['data']['currentValue'];

            this.drawScatter(data);
        }
    }

    drawScatter(data: ICorrelation.Response): void {
        const scatterData: any = this.getScatterData(data);
        const layout: any = this.getScatterLayout(data);
        const config: any = this.getScatterConfig();

        Plotly.newPlot(this.chartId, scatterData, layout, config);
    }

    getScatterData(data) {
        return this._setScatterData(data);
    }

    getScatterConfig(): any {
        return this._setScatterConfig();
    }

    getScatterLayout(data): any {
        return this._setScatterLayout(data);
    }

    private _setScatterData(data: ICorrelation.Response) {
        let xValues: Array<number> = [];
        let yValues: Array<number> = [];

        data.correlationScatter.map((point: Array<number>) => {
            xValues.push(point[0]);
            yValues.push(point[1]);
        });

        const line = {
            mode: 'lines',
            name: 'Regression',
            x: [data.regression.start_xValue, data.regression.end_xValue],
            y: [data.regression.start_yValue, data.regression.end_yValue],
            line: {
                color: 'red'
            }
        }

        const scatterData: Scatter = {
            x: xValues,
            y: yValues,
            mode: 'markers',
            name: `${data.paramNames[0]} / ${data.paramNames[1]}`,
            // text: ['United States', 'Canada'],
            marker: {
                color: 'rgb(164, 194, 244)',
                size: 10,
                line: {
                    color: 'black',
                    width: 0.5
                }
            },
            type: 'scatter'
        };

        return [scatterData, line];
    }

    private _setScatterLayout(data): any {
        const layout = this.getScatterDefaultLayout();
        layout.xaxis.title = data.x;
        layout.yaxis.title = data.y;

        return layout;
    }

    private _setScatterConfig(): any {
        const config = {
            responsive: true,
            displayModeBar: false
        }

        return config;
    }

    getScatterDefaultLayout(): any {
        const layout = {
            margin: {
                l: 10,
                r: 10,
                b: 10,
                t: 10,
                pad: 4
            },
            xaxis: {
                automargin: true,
                // autosize: true,
                title: '',
                showgrid: false,
                zeroline: false,
            },
            yaxis: {
                automargin: true,
                // autosize: true,
                title: '',
                showline: false
            },
            showLegend: true,
            legend: {
                "orientation": "h"
            }
        };

        return layout;
    }

    private _guid() {
        return 'xxx'.replace(/[xy]/g, (c) => {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return "C" + v.toString(16);
        });
    }
}