import {
    Component,
    ElementRef,
    OnInit,
    OnChanges,
    OnDestroy,
    Input,
    Output,
    EventEmitter,
    ViewEncapsulation,
    ViewChild
} from '@angular/core';

import { ChartBase } from './chart-base';
import { SpinnerComponent } from '../../popup/spinner/spinner.component';

@Component({
    selector: 'a3c-common-chart, div[a3c-common-chart]',
    template: `
        <div a3-spinner #chartSpinner type="'component'"></div>
        <div #chartGenerator class="height-full"></div>
    `,
    // providers: [{provide: ChartBase, useExisting: forwardRef(() => CommonChartComponent)}],
    // changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'style': 'height: 100%; width: 100%;'
    }
})
export class CommonChartComponent extends ChartBase implements OnInit, OnChanges, OnDestroy {
    @Input() type: string;
    @Input() config: any;
    @Input() data: any;
    @Input() noneResize: boolean;
    @Input() freezeHeight: boolean;
    @Input() freezeWidth: boolean;
    @Output() completeChart: EventEmitter<any> = new EventEmitter();
    @Output() resize: EventEmitter<any> = new EventEmitter();

    @ViewChild('chartGenerator') chartGeneratorEl: ElementRef;
    @ViewChild('chartSpinner') spinnerEl: SpinnerComponent;

    private isInitEl: boolean;

    constructor() {
        super();
        this.baseType = 'common';
    }

    ngOnInit() {
        this._initEl();
        // this.baseType = 'common';
        // this.setChartEl(this.chartGeneratorEl);
        // this.setSpiner(this.spinnerEl);
        // console.log('CommonChartComponent : ngOnInit');
    }

    ngOnChanges(changes: any) {
        this._initEl();
        this.onChanges(changes);
    }

    createChart(config: any) {
        // set unique id for chart element
        this.setUUID(config);
        // create chart to initialize
        this.chart = (<any>window)[this.type].generate(config);
        // none resize를 적용하고 싶지 않을 경우 적용한다. ex) wafer-traffic tasker
        if (!this.noneResize) {
            this.listenResizing();
            this.setResizeEmitter(this.resize);
        }
        // load data
        if(config.data) {
            this.chart.load(config.data);
        }
    }

    emitChart() {
        this.completeChart.emit({ component: this });
    }

    private _initEl() {
        if (!this.isInitEl) {
            this.isInitEl = true;
            this.setChartEl(this.chartGeneratorEl);
            this.setSpiner(this.spinnerEl);
        }
    }

    ngOnDestroy() {
        this.destroy();
    }
}

