import {
    Component,
    OnInit,
    Input,
    EventEmitter,
    Output,
    OnChanges,
    OnDestroy,
    ElementRef
} from '@angular/core';
import { ChartApi } from "../charts/chart.api";

@Component({
    moduleId: module.id,
    selector: 'a3c-vis-map, div[a3c-vis-map]',
    template: '<div class="height-full"></div>'
})
export class VisMapComponent extends ChartApi implements OnInit, OnChanges, OnDestroy {
    // @Input() config: any;
    // @Input() data: any;
    @Output() completeChart: EventEmitter<any> = new EventEmitter();

    constructor(private element: ElementRef) {
        super();
    }

    ngOnInit() {
        this.setChartEl(this.element);
    }

    setConfig(config: any) {
        this._createChart(config);
    }

    loadData(data: any) {
        this.chart.load(data);
    }

    ngOnChanges(changes: any) {
        this._onChanges(changes);
    }

    private _onChanges(changes: any) {

    }

    private _createChart(config: any) {
        // set unique id for chart element
        this.setUUID(config);
        // create chart to initialize
        this.chart = (<any>window)['VisMap'].generate(config);
        // emitChart
        this.emitChart();

        // load data
        // if (config.data) {
        //     this.chart.load(config.data);
        // }
    }

    emitChart() {
        this.completeChart.emit({ component: this });
    }

    destroy() {
        if (this.chart) {
            this.chart.destroy();
        }
    }

    ngOnDestroy() {

    }
}
