import {
    ElementRef,
    Input,
    Output,
    EventEmitter,
    SimpleChanges,
    ViewChild
} from '@angular/core';

import { ChartApi } from './chart.api';
import { InjectorUtil } from '../../utils/injector.util';
import { UUIDUtil } from '../../utils/uuid.util';
import { SpinnerComponent } from '../../popup/spinner/spinner.component';
import { DataUtil } from '../../utils/data.util';
import { ChartStyleUtil } from './styleUtils';

export abstract class ChartBase extends ChartApi {

    private _chartType: any;
    private _chartConfig: any;
    private _isAlreadyCreated: boolean = false;

    constructor() {
        super();
    }

    /**
     * 상속받은 차트가 반드시 구현해야할 메소드
     */
    protected abstract createChart(config: any): any;

    protected abstract emitChart(): void;

    protected onChanges(changes: any) {
        if (this.baseType === 'c3') {
            this._c3Changes(changes);
        } else {
            this._commonChanges(changes);
        }
    }

    private _commonChanges(changes: SimpleChanges) {
        const type = changes['type'];
        const config = changes['config'];
        const data = changes['data'];
        const freezeHeight = changes['freezeHeight'];
        const freezeWidth = changes['freezeWidth'];

        if (type && type.currentValue) {
            this._chartType = type.currentValue;
        }

        if ( (config && config.currentValue && !this._isAlreadyCreated && !_.isEmpty(config.currentValue))
            || (config && !_.isEmpty(config.currentValue) && !_.isEqual(config.currentValue, this._chartConfig))
        ) {
            this._chartConfig = DataUtil.mergeDeep({}, config.currentValue);

            // chart config만 빠뀔때가 있다.
            if (this._chartType) {
                this.destroy();
                //this._setIdAttribute(); // move setChartEl function
                this.createChart(config.currentValue);
                this.emitChart();
                this._isAlreadyCreated = true;
            }
        }

        // chart 안에서 null 처리 한다.
        if (data && data.currentValue) {
            if (this.chart) {
                this.chart.load(data.currentValue);
                this.emitChart();
            }
        }

        if (freezeHeight && freezeHeight.currentValue) {
            this.freezeHeight = freezeHeight.currentValue;
        }

        if (freezeWidth && freezeWidth.currentValue) {
            this.freezeWidth = freezeWidth.currentValue;
        }
    }

    private _c3Changes(changes: SimpleChanges) {
        const config = changes['config'];
        const data = changes['data'];
        const freezeHeight = changes['freezeHeight'];
        const freezeWidth = changes['freezeWidth'];

        if ( (config && config.currentValue && !this._isAlreadyCreated && !_.isEmpty(config.currentValue))
            || (config && !_.isEmpty(config.currentValue) && !_.isEqual(config.currentValue, this._chartConfig))
        ) {
            this._chartConfig = DataUtil.mergeDeep({}, config.currentValue);

            // set id attribute for chart
            //this._setIdAttribute(); // move setChartEl function
            this._setC3ConfigOptions();

            this.destroy();
            this.createChart(config.currentValue);
            this.emitChart();
            this._isAlreadyCreated = true;
        }

        if (data && data.currentValue) {
            if (this.chart) {
                if (_.isArray(data.currentValue)) {
                    this.chart.load(data.currentValue[0], data.currentValue[1]);
                } else {
                    this.chart.load(data.currentValue);
                }
                this.emitChart();
            }
        }

        if (freezeHeight && freezeHeight.currentValue) {
            this.freezeHeight = freezeHeight.currentValue;
        }

        if (freezeWidth && freezeWidth.currentValue) {
            this.freezeWidth = freezeWidth.currentValue;
        }
    }

    /*
    private _commonChanges(changes: SimpleChanges) {
        const type = changes['type'];
        const config = changes['config'];
        const data = changes['data'];

        if (type && type.currentValue) {
            this._chartType = type.currentValue;
        }

        if (this.chart && this._isChangedConfig(config)) {
            this._isAlreadyCreated = false;
            this.destroy();
        }

        if (config && config.currentValue) {
            this._chartConfig = config.currentValue;
            if (!this._isAlreadyCreated && this._chartType) {
                this._isAlreadyCreated = true;
                this.createChart(config.currentValue);
            }
        }

        // chart 안에서 null 처리 한다.
        if (data && data.currentValue && this._chartConfig) {
            if (this.chart && this._isAlreadyCreated) {
                this.chart.load(data.currentValue);
                this.emitChart();
            }
        }
    }

    private _c3Changes(changes: SimpleChanges) {
        const config = changes['config'];
        const data = changes['data'];

        if (this.chart && this._isChangedConfig(config)) {
            this._isAlreadyCreated = false;
            this.destroy();
        }

        if (config && config.currentValue && !_.isEmpty(config.currentValue)) {
            this._chartConfig = config.currentValue;
            if (!this._isAlreadyCreated) {
                this._isAlreadyCreated = true;
                this._setC3ConfigOptions();
                this.createChart(config.currentValue);
            }
        }

        if (data && data.currentValue && this._chartConfig) {
            if (this.chart && this._isAlreadyCreated) {
                if (_.isArray(data.currentValue)) {
                    this.chart.load(data.currentValue[0], data.currentValue[1]);
                } else {
                    this.chart.load(data.currentValue);
                }
                this.emitChart();
            }

        }
    }

    private _isChangedConfig(config: any) :boolean {
        if (config
            && config.currentValue
            && this._isAlreadyCreated
            && this._chartConfig
            && this._chartConfig != config.currentValue) {
                return true;
            }
        return false;
    }
    */

    private _setC3ConfigOptions() {
        if (this._chartConfig.color === undefined) {
            this._chartConfig.color = {};
        }
        if (this._chartConfig.color.pattern === undefined) {
            this._chartConfig.color.pattern = ChartStyleUtil.getDefaultColor;
        }
    }

    protected destroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = undefined;
        }
    }
}
