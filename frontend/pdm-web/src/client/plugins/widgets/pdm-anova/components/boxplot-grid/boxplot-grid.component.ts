import { Component, OnChanges, Input, Output, ViewEncapsulation, OnDestroy, SimpleChanges } from '@angular/core';

declare const Plotly: any;

@Component({
    moduleId: module.id,
    selector: 'boxplot-grid',
    templateUrl: './boxplot-grid.html',
    styleUrls: ['./boxplot-grid.css'],
    encapsulation: ViewEncapsulation.None
})
export class BoxplotGridComponent implements OnChanges, OnDestroy {
    @Input() data;

    chartId: string = this._guid();

    constructor() {

    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes && changes['data']['currentValue']) {
            const data = changes['data']['currentValue'];

            console.log('[boxplot] changes => ', data);
            this.drawBoxplot();
        }
    }

    drawBoxplot(): void {
        const data = this.getBoxplotData();
        const config = this.getBoxplotConfig();
        const layout = this.getBoxplotLayout();

        console.log('boxplot data => ', data);

        setTimeout(() => {
            Plotly.newPlot(this.chartId, data, layout, config);
        }, 1000);
    }

    getBoxplotData(): any {
        return this._setBoxplotData();
    }

    getBoxplotLayout(): any {
        return this._setBoxplotLayout();
    }

    getBoxplotConfig(): any {
        return this._setBoxplotConfig();
    }

    private _setBoxplotData(): any {
        let data = [];

        for (let i = 0; i < 100; i++) {
            let y = [];

            for (let j = 0; j < 50; j++) {
                const ran = Math.random() * (6000 - 100) + 100;
                y.push(ran);
            }

            data.push({
                y: y,
                type: 'box',
                // visible: 'rangeslideronly'
            });
        }

        return data;
    }

    private _setBoxplotLayout() {
        return {
            // title: 'Correlation Heatmap',
            dragmode: 'zoom',
            showlegend: false,
            margin: {
                l: 10,
                r: 10,
                b: 10,
                t: 10,
                // pad: 4
            },
            annotations: [],
            xaxis: {
                range: [0, 10], // this is the range the *selected area* of the slider spans
                rangeslider: {
                    borderwidth: 2,
                    thickness: 0.1,
                    range: [0, 100] // this is the range the *entire* slider spans
                },
                autorange: false, // 데이터 여백 안남기고 해당 데이터에 대한 영역을 확대해서 보여줌
                automargin: true,
                autosize: true,
                ticks: '',
                // side: 'bottom',
                // fixedrange: true // tick 드래그로 이동
            },
            yaxis: {
                autorange: true,
                automargin: true,
                autosize: true,
                ticks: '',
                ticksuffix: ' ',
                // width: 700,
                // height: 400,
            }
        };
    }

    private _setBoxplotConfig(): any {
        const config = {
            responsive: true,
            displayModeBar: false
        };

        return config;
    }

    private _guid() {
        return 'xxx'.replace(/[xy]/g, (c) => {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return "C" + v.toString(16);
        });
    }

    ngOnDestroy() {

    }
}