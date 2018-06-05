import {
    Component,
    ElementRef,
    forwardRef,
    OnInit,
    OnChanges,
    OnDestroy,
    Input,
    Output,
    EventEmitter,
    ChangeDetectionStrategy,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';

import { ChartBase } from './chart-base';
import { SpinnerComponent } from '../../popup/spinner/spinner.component';

@Component({
    selector: 'a3c-c3-chart, div[a3c-c3-chart]',
    template: `
        <div a3-spinner #chartSpinner type="'component'"></div>
        <div #chartGenerator class="height-full"></div>
    `,
    // template: '',
    // providers: [{provide: ChartBaseComponent, useExisting: forwardRef(() => C3ChartComponent)}],
    // changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'style': 'height: 100%; width: 100%;'
    }
})
export class C3ChartComponent extends ChartBase implements OnInit, OnChanges, OnDestroy {
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
        this.baseType = 'c3';
    }

    private _initEl() {
        if (!this.isInitEl) {
            this.isInitEl = true;
            this.setChartEl(this.chartGeneratorEl);
            this.setSpiner(this.spinnerEl);
        }
    }

    ngOnInit() {
        this._initEl();
    }

    ngOnChanges(changes: any) {
        console.log('changes c3', changes);
        this.onChanges(changes);
    }

    createChart(config: any) {
        console.log('create c3 config', config);
        // init chartGeneratorEl & spinnerEl
        this._initEl();
        // set unique id for chart element
        this.setUUID(config);
        // create chart to initialize
        this.chart = c3Chart.generate(config);
        // none resize를 적용하고 싶지 않을 경우 적용한다. ex) wafer-traffic tasker 
        if (!this.noneResize) {
            this.listenResizing();
            this.setResizeEmitter(this.resize);
        }
        // load data
        if (config.data) {
            if (_.isArray(config.data)) {
              this.chart.load(config.data[0], config.data[1]);
            } else {
              this.chart.load(config.data);
            }
        }
    }

    emitChart() {
        this.completeChart.emit({ component: this });
    }

    ngOnDestroy() {
        this.destroy();
    }
}

