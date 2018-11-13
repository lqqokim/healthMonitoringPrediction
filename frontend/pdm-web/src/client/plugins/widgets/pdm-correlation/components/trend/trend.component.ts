import { Component, Input, Output, OnInit, OnChanges, ViewEncapsulation, SimpleChanges } from '@angular/core';

declare let Plotly: any;

export interface Heatmap {

}

@Component({
    moduleId: module.id,
    selector: 'trend',
    templateUrl: './trend.html',
    styleUrls: ['./trend.css'],
    encapsulation: ViewEncapsulation.None
})
export class TrendComponent implements OnInit, OnChanges {
    @Input() data;

    private _chartId: string = 'trend';
    trendData;

    constructor() {

    }

    ngOnInit() {

    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes && changes['data']['currentValue']) {
            const data = changes['data']['currentValue'];
            this.drawTrend(data);
        }
    }

    drawTrend(data): void {
        this.getTrendData(data);

        setTimeout(() => {
            const trendData = this.trendData;
            const config = this.getTrendConfig();
            const layout = this.getTrendLayout();

            Plotly.newPlot(this._chartId, trendData, layout, config);
        }, 300);
    }

    getTrendData(data): any {
        return this._setTrendData(data);
    }

    getTrendLayout(): any {
        return this._setTrendLayout();
    }

    getTrendConfig(): any {
        return this._setTrendConfig();
    }

    private _setTrendData(data) {
        //parse data
        Plotly.d3.csv("https://raw.githubusercontent.com/plotly/datasets/master/finance-charts-apple.csv", (err, rows) => {
            function unpack(rows, key) {
                return rows.map(function (row) { return row[key]; });
            }

            const trace1 = {
                type: "scatter",
                mode: "lines",
                name: data.x,
                x: unpack(rows, 'Date'),
                y: unpack(rows, 'AAPL.High'),
                line: { color: '#17BECF' }
            }

            const trace2 = {
                type: "scatter",
                mode: "lines",
                name: data.y,
                x: unpack(rows, 'Date'),
                y: unpack(rows, 'AAPL.Low'),
                line: { color: '#7F7F7F' }
            }

            this.trendData = [trace1, trace2];
        });
    }

    private _setTrendLayout() {
        const layout = {
            margin: {
                l: 50,
                r: 50,
                b: 50,
                t: 50,
                pad: 4
            }
        };

        return layout;
    }

    private _setTrendConfig() {
        const config = {
            responsive: true,
            displayModeBar: false
        }

        return config;
    }
}