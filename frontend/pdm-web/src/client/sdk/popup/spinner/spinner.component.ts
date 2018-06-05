import { 
    Component, 
    OnInit, 
    OnDestroy, 
    Input
} from "@angular/core";

import { ISpinner} from './spinner.interface';

@Component({
    moduleId: module.id,
    selector: 'div[a3-spinner]',
    templateUrl: 'spinner.html',
    host: {
        '[class]': 'hostClass'
    }
})

export class SpinnerComponent implements OnInit, OnDestroy, ISpinner {
    @Input() type: string; // SPINNER.TYPE

    message: string;
    initMessage: string;
    noDataMessage: string;
    errorMessage: string;
    hostClass: string;
    spinnerState: string;
    SPINNER: any = SPINNER;

    spinnerClass: any = {
        show: 'float-wrapper',
        darkShow: 'float-wrapper-dark',
        hidden: 'hidden'
    };

    constructor() {}

    ngOnInit() {
        this.initMessage = 'Loading ...';
        this.spinnerState = this._defaultSpinnerInitState();
        this.hostClass = this._defaultSpinnerClass();
    }

    ngOnDestroy() {

    }

    private _defaultSpinnerInitState(): string {
        return this.type === SPINNER.TYPE.COMPONENT ? SPINNER.CHART_INIT : SPINNER.INIT;
    }

    private _defaultSpinnerClass() {
        switch (this.type) {
            case SPINNER.TYPE.WIDGET: return this.spinnerClass.show;
            case SPINNER.TYPE.TASKER: return this.spinnerClass.show;
            case SPINNER.TYPE.COMPONENT: return this.spinnerClass.hidden;
            case SPINNER.TYPE.SIDE_BAR: return this.spinnerClass.darkShow;
            case SPINNER.TYPE.ACUBED_NET: return this.spinnerClass.darkShow;
            case SPINNER.TYPE.ACUBED_MAP: return this.spinnerClass.darkShow;
            default: return this.spinnerClass.hidden;
        }
    }

    showSpinner(msg?: string) {
        this.initMessage = msg || 'Loading ...';
        this.hostClass = this.spinnerClass.show;
        this.spinnerState = this._defaultSpinnerInitState();
    }

    showNoData(msg?: string) {
        this.noDataMessage = msg || 'No Data';
        this.hostClass = this.spinnerClass.show;
        this.spinnerState = SPINNER.NODATA;
    }

    showError(msg?: string) {
        this.errorMessage = msg || 'Error';
        this.hostClass = this.spinnerClass.show;
        this.spinnerState = SPINNER.ERROR;
    }

    hideSpinner() {
        this.hostClass = this.spinnerClass.hidden;
        this.spinnerState = SPINNER.NONE;
    }
}
