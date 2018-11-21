import { Component, Input, Output, OnInit, OnChanges, ViewEncapsulation, EventEmitter, SimpleChanges } from '@angular/core';
import { scatterData } from './../../model/mock-data';

declare let Plotly: any;

export interface Scatter {

}

@Component({
    moduleId: module.id,
    selector: 'scatter',
    templateUrl: './scatter.html',
    styleUrls: ['./scatter.css'],
    encapsulation: ViewEncapsulation.None
})
export class ScatterComponent implements OnInit, OnChanges {
    @Input() data;

    chartId: string = this._guid();;

    constructor() {

    }

    ngOnInit() {

    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes && changes['data']['currentValue']) {
            console.log('ngOnChanges scatter => ', changes);
            const data = changes['data']['currentValue'];
            this.drawScatter(data);
        }
    }

    drawScatter(data): void {
        const scatterData: any = this.getScatterData(data);
        const layout: any = this.getScatterLayout(data);
        const config: any = this.getScatterConfig();

        Plotly.newPlot(this.chartId, scatterData, layout, config);
    }

    getScatterData(data): any {
        return this._setScatterData(data);
    }

    getScatterConfig(): any {
        return this._setScatterConfig();
    }

    getScatterLayout(data): any {
        return this._setScatterLayout(data);
    }

    private _setScatterData(data): any {
        // parse data

        return scatterData;
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