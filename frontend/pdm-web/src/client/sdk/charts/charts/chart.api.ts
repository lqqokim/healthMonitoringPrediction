import {
    ElementRef,
    SimpleChanges,
    ViewChild,
    EventEmitter
} from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { UUIDUtil } from '../../utils/uuid.util';
import { SpinnerComponent } from '../../popup/spinner/spinner.component';
import { ISpinner} from '../../popup/spinner/spinner.interface';

export class ChartApi implements ISpinner {

    private _chart: any;
    private _chartEl: HTMLElement;
    private _baseType: string; // common, c3, bistel
    private _spinner: SpinnerComponent;
    private _uuid: string;
    private _DEBOUNCE_TIME: number = 400;
    private _freezeWidth: boolean;
    private _freezeHeight: boolean;
    private _firstSize: any;
    private _resizeEmitter: EventEmitter<any>;

    set chart(value: any) {
        this._chart = value;
    }

    get chart(): any {
        return this._chart;
    }

    get chartEl(): HTMLElement {
        return this._chartEl;
    }

    set baseType(value: string) {
        this._baseType = value;
    }

    get baseType(): string {
        return this._baseType;
    }

    get uuid(): string {
        return this._uuid;
    }

    set freezeHeight(value: boolean) {
        this._freezeHeight = value;
    }

    get freezeHeight() {
        return this._freezeHeight;
    }

    set freezeWidth(value: boolean) {
        this._freezeWidth = value;
    }

    get freezeWidth() {
        return this._freezeWidth;
    }

    set firstSize(value: any) {
        this._firstSize = {
            width: value.width || this._firstSize.width,
            height: value.height || this._firstSize.height
        }
    }

    get firstSize() {
        return this._firstSize;
    }

    setResizeEmitter(value: EventEmitter<any>) {
        this._resizeEmitter = value;
    }

    protected setUUID(config: any) {
        // set bind element to a3c-bar
        config.bindto = `#${this._uuid}`;
    }

    setChartEl(element: ElementRef) {
        this._chartEl = element.nativeElement;
        // set id attribute for chart
        this._setIdAttribute();
    }

    setSpiner(spinner: SpinnerComponent) {
        this._spinner = spinner;
    }

    private _setIdAttribute() {
        if (!this.chartEl.hasAttribute('id') || this.chartEl.hasAttribute('id') === null) {
            // this.uuid = `a3c${this._chartType}__${UUIDUtil.new()}`;
            this._uuid = `a3c__chart__${UUIDUtil.new()}`;
            this.chartEl.setAttribute('id', this._uuid);
        }
    }

    /************************************************************************
     *
     * Resize
     *
     ************************************************************************/
    listenResizing() {
        const chartParentDOM = this._chartEl.parentElement;
        let latestSize: any = {};
        let lazyLayout = _.debounce((evt) => {
            if (!evt || !evt.target) {
                console.warn('Chart DOM resize evt NULL');
                return;
            }
            let size: any;

            if (this._firstSize) {
                size = {
                    width: this.freezeWidth ? this._firstSize.width : evt.target.clientWidth,
                    height: this.freezeHeight ? this._firstSize.height : evt.target.clientHeight
                };
            } else {
                size = {
                    width: evt.target.clientWidth,
                    height: evt.target.clientHeight
                };
                this._firstSize = size;
            }
            
            if (this._chart && !_.isEqual(latestSize, size)) {
                this._chart.resize(size);
                // when resize chart, emit event to upper component
                if (this._resizeEmitter) {
                    this._resizeEmitter.next(size);
                }
                latestSize = size;
            } else {
                return;
            }
        }, this._DEBOUNCE_TIME);

        $(chartParentDOM).resize(lazyLayout);
    }


    /************************************************************************
     *
     * Spinner
     *
     ************************************************************************/
    showSpinner(message: string = null) {
        this._spinner.showSpinner(message);
    }

    showNoData(message: string = null) {
        this._spinner.showNoData(message);
    }

    showError(message: string = null) {
        this._spinner.showError(message);
    }

    hideSpinner() {
        this._spinner.hideSpinner();
    }
}
