import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { ChartEvent } from '../../common/event/index';
import { ChartConfiguration } from '../../model/chart.interface';
import { ChartBase } from './../../common/index';
import { Subject } from 'rxjs/Subject';

@Component({
    moduleId: module.id,
    selector: 'chart',
    templateUrl: 'chart.component.html',
    styles: [`
        .michart {
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -o-user-select: none;
            user-select: none;
        }
        path, line {
            shape-rendering: crispEdges;
        }

        .unactive {
            fill-opacity: 0.3;
        }

        .active {
            fill-opacity: 1;
        }

        svg:focus {
            outline: none;
        }
    `],
    encapsulation: ViewEncapsulation.None
})
export class ChartComponent implements OnChanges {

    @Input() config: ChartConfiguration;
    @Input() set data(value: Array<any>) {
        if (this.baseChart) {
            this.baseChart.dataProvider = value;
        }
    }
    @Input() sizeChange: boolean = false;
    @Output() itemclick = new EventEmitter();
    @Output() mouseover = new EventEmitter();
    @Output() mouseout = new EventEmitter();
    @ViewChild('chart') chart_div: ElementRef;

    baseChart: ChartBase;
    chartConfig: any;
    chartSelector: string;

    zoomEnd$: Subject<any>;
    creationEnd$: Subject<any>;

    selectedItem: Array<any> = [];


    constructor() {
        this.zoomEnd$ = new Subject();
        this.creationEnd$ = new Subject();
    }

    ngOnChanges(value: any) {
        if (value.config.currentValue) {
            if (this.baseChart) {
                this.baseChart.clear();
            }
            this.chart_div.nativeElement.id = value.config.currentValue.chart.selector;
            value.config.currentValue.chart.size.width = this.chart_div.nativeElement.offsetWidth;
            value.config.currentValue.chart.size.height = this.chart_div.nativeElement.offsetHeight;
            this.chartConfig = value.config.currentValue;
            this._createChart(value.config.currentValue);
            this._drawChart(this.chart_div.nativeElement.offsetWidth, this.chart_div.nativeElement.offsetHeight);
        }
    }

    _createChart(config: any) {
        this.baseChart = new ChartBase(config);
        addEventListener(ChartEvent.ZOOM_END, this._zoomEnd);
        addEventListener(ChartEvent.CREATION_COMPLETE, this._chartCreation);
        addEventListener(ChartEvent.CONCAT_SELECT_ITEMS, this._dragRectEnd)
    }

    _drawChart(width: number, height: number) {
        this.updateChartDisplay(width, height);
    }

    updateChartDisplay(width: number, height: number) {
        this.config.chart.size.width = width;
        this.config.chart.size.height = height;
        this.baseChart.updateDisplay(this.config.chart.size.width, this.config.chart.size.height);
    }

    _zoomEnd = (event: CustomEvent) => {
        this.zoomEnd$.next('end');
    };

    _chartCreation = (event: CustomEvent) => {
        this.creationEnd$.next('end');
    };

    _dragRectEnd = (event: CustomEvent) => {
        if (this.chartConfig.series.length === event.detail.length) {
            event.detail.map((selected: any) => {
                const keyNames = Object.keys(selected)[0];
            });
        }
    }
}
