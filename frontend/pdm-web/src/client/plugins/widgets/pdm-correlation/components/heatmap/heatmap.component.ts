import { Component, Input, Output, OnInit, OnChanges, ViewEncapsulation, EventEmitter, SimpleChanges, OnDestroy } from '@angular/core';
// import { heatmapData } from './../../model/mock-data';

declare let Plotly: any;

export interface Heatmap {

}

@Component({
    moduleId: module.id,
    selector: 'heatmap',
    templateUrl: './heatmap.html',
    styleUrls: ['./heatmap.css'],
    encapsulation: ViewEncapsulation.None
})
export class HeatmapComponent implements OnChanges, OnDestroy {
    @Output() onClickHeatmap: EventEmitter<any> = new EventEmitter();
    @Output() spinnerControl: EventEmitter<any> = new EventEmitter();
    @Input() data;
    @Input('heatmapData')
    set heatmapData(data) {
        this._heatmapData = data;
    }

    get heatmapData() {
        return this._heatmapData;
    }

    _heatmapData;

    private _chartEl: HTMLElement;
    chartId: string = this._guid();

    constructor() {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes && changes['data']['currentValue']) {
            const data = changes['data']['currentValue'];
            this.drawHeatmap(data);
        }

        // if(this._heatmapData) {

        // }
    }

    drawHeatmap(inputData): void {
        const data = this.getHeatmapData(inputData);
        const config: any = this.getHeatmapConfig();
        const layout: any = this.getHeatmapLayout(inputData);

        Plotly.newPlot(this.chartId, data, layout, config);
        this.spinnerControl.emit(false);
        this._addHeatmapEventHandler();
    }

    getHeatmapData(data): any {
        return this._setHeatmapData(data);
    }

    getHeatmapLayout(data): any {
        return this._setHeatmapLayout(data);
    }

    getHeatmapConfig(): any {
        return this._setHeatmapConfig();
    }

    private _setHeatmapData(data): any {
        //parse data

        return data;
    }

    private _setHeatmapLayout(data): any {
        let layout = this.getHeatmapDefaultLayout();
        const xValues: string[] = data[0].x;
        const yValues: string[] = data[0].y;
        const zValues: any[] = data[0].z;

        for (let i = 0; i < yValues.length; i++) {
            for (let j = 0; j < xValues.length; j++) {
                let result = {
                    xref: 'x1',
                    yref: 'y1',
                    x: xValues[j],
                    y: yValues[i],
                    text: zValues[i][j],
                    font: {
                        family: 'Arial',
                        size: 15,
                        color: 'white'
                    },
                    showarrow: false
                };

                layout.annotations.push(result);
            }
        }

        return layout;
    }

    getHeatmapDefaultLayout(): any {
        return {
            // title: 'Correlation Heatmap',
            margin: {
                l: 10,
                r: 10,
                b: 10,
                t: 10,
                pad: 4
            },
            annotations: [],
            xaxis: {
                automargin: true,
                autosize: true,
                ticks: '',
                side: 'bottom',
            },
            yaxis: {
                automargin: true,
                autosize: true,
                ticks: '',
                ticksuffix: ' ',
                // width: 700,
                // height: 400,
            }
        };
    }

    private _setHeatmapConfig(): any {
        const config = {
            responsive: true,
            displayModeBar: false
        };

        return config;
    }


    public relayoutHeatmap(): void {
        // const parentWidth = $("#heatmap").parent().width();
        // const parentHeight = $("#heatmap").parent().height();
       
        // console.log('parentWidth, parentHeight => ', parentWidth, parentHeight);

        // const update = {
        //     width: parentWidth,  // or any new width
        //     height: parentHeight  // " "
        // };

        // Plotly.relayout('heatmap', update);
    }

    private _addHeatmapEventHandler(): void {
        this._chartEl = document.getElementById(this.chartId);
        const heatmapEl = this._chartEl;

        (heatmapEl as any).on('plotly_click', (data: any) => {
            console.log('heatmap click => ', data);

            const cell = {
                x: data.points[0].x,
                y: data.points[0].y,
                z: data.points[0].z
            };

            this.onClickHeatmap.emit(cell);
        });

        (heatmapEl as any).on('plotly_relayout', (data: any) => {
            console.log('plotly_relayout => ', data);
        });

        // (myPlot as any).on('plotly_selected', (data: any) => {
        //     console.log('plotly_selected => ', data);
        // });
        // (myPlot as any).on('plotly_selecting', (data: any) => {
        //     console.log('plotly_selecting => ', data);
        // });
        // (myPlot as any).on('plotly_sliderchange', (data: any) => {
        //     console.log('plotly_sliderchange => ', data);
        // });
        // (myPlot as any).on('plotly_sliderend', (data: any) => {
        //     console.log('plotly_sliderend => ', data);
        // });
        // (myPlot as any).on('plotly_sliderstart', (data: any) => {
        //     console.log('plotly_sliderstart => ', data);
        // });
        // (myPlot as any).on('plotly_afterexport', (data: any) => {
        //     console.log('plotly_afterexport=> ', data);
        // });
        // (myPlot as any).on('plotly_afterplot', (data: any) => {
        //     console.log('plotly_afterplot => ', data);
        // });
        // (myPlot as any).on('plotly_animated', (data: any) => {
        //     console.log('plotly_animated => ', data);
        // });
        // (myPlot as any).on('plotly_animatingframe', (data: any) => {
        //     console.log('plotly_animatingframe => ', data);
        // });
        // (myPlot as any).on('plotly_animationinterrupted', (data: any) => {
        //     console.log('plotly_animationinterrupted => ', data);
        // });
        // (myPlot as any).on('plotly_autosize', (data: any) => {
        //     console.log('plotly_autosize => ', data);
        // });
        // (myPlot as any).on('plotly_beforeexport', (data: any) => {
        //     console.log('plotly_beforeexport => ', data);
        // });
        // (myPlot as any).on('plotly_buttonclicked', (data: any) => {
        //     console.log('plotly_buttonclicked => ', data);
        // });
        // (myPlot as any).on('plotly_clickannotation', (data: any) => {
        //     console.log('plotly_clickannotation => ', data);
        // });
        // (myPlot as any).on('plotly_deselect', (data: any) => {
        //     console.log('plotly_deselect => ', data);
        // });
        // (myPlot as any).on('plotly_doubleclick', (data: any) => {
        //     console.log('plotly_doubleclick => ', data);
        // });
        // (myPlot as any).on('plotly_framework', (data: any) => {
        //     console.log('plotly_framework => ', data);
        // });
        // (myPlot as any).on('plotly_hover', (data: any) => {
        //     console.log('plotly_hover => ', data);
        // });
        // (myPlot as any).on('plotly_unhover', (data: any) => {
        //     console.log('plotly_unhover => ', data);
        // });
        // (myPlot as any).on('plotly_transitioning', (data: any) => {
        //     console.log('plotly_transitioning => ', data);
        // });
        // (myPlot as any).on('plotly_transitioninterrupted', (data: any) => {
        //     console.log('plotly_transitioninterrupted => ', data);
        // });
        // (myPlot as any).on('plotly_relayout', (data: any) => {
        //     console.log('plotly_relayout => ', data);
        // });
    }

    private _guid() {
        return 'xxx'.replace(/[xy]/g, (c) => {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return "C" + v.toString(16);
        });
    }

    ngOnDestroy() {
        function removeElement(element) {
            element && element.parentNode && element.parentNode.removeChild(element);
        }

        removeElement(this._chartEl);
    }
}