import { ConditionType } from './condition.type';
import { getPreConditionFromAjax, PreInitConditionType } from './service/pre-init.service';

import { FormConfigType, Util } from '../../sdk';

export abstract class ConditionApi {

    private _model: any;
    private _condition: any;
    private _preInitConditionKeys: Array<string>;


    constructor() {
        // 초기화 데이터를 AJAX로 받아올 경우
        // this.preInit([CD.INLINE_GROUP]);
        if (this.preInit) {
            this._preInitConditionKeys = this.preInit();
        }
    }

    preInit?(): Array<string>;
    abstract init(): void;
    abstract config(): [ConditionType];
    form?(): [FormConfigType];

    private _preInit(): Promise<boolean> {
        if (!this.isPreInit) { return Promise.resolve(false); }

        let promises: any = [];
        this._preInitConditionKeys.forEach((conditionKey) => {
            // configuration을 통해 값을 설정했다면 Pre Init을 적용하지 않는다.
            if (this._model && this._model[conditionKey]) {
                return;
            }
            promises.push(getPreConditionFromAjax(conditionKey));
        });

        return Promise.all(promises)
            .then((inits: any) => {
                if (inits && inits.length > 0) {
                    inits.forEach((init: PreInitConditionType) => {
                        if (init.condition === 'empty') { return; }
                        this._model[init.condition] = init.data;
                    });
                }
                return true;
            }, (err: any) => {
                return false;
            });
    }

    /**
     * call from widget.api when apply configuration.
     */
    initModel(model: any, isFirst: boolean): Promise<any> {
        if (isFirst && this.isPreInit) {
            // 최초 초기화 될때만 Pre Init을 적용한다.
            this._model = model;
            return this._preInit().then((result: boolean) => {
                if (!result) {
                    // console.error(`--- ${this._preInitConditionKeys} Pre Init Condition Exception ---`);
                }
                this.init();
                return true;
            });
        } else {
            // 최초 widget.api를 생성한 이후에는 preInit이 된 widgetModel을 사용한다.
            // @see widget.api.ts
            this._model = model;
            this.init();
            return Promise.resolve(true);
        }
    }

    /**
     * add data for out condition
     * @see widget.api.ts
     */
    setCondition(data: any) {
        this._condition = data;
        // this._condition = undefined;
        // this._condition = Util.Data.mergeDeep(this._model, data);
    }

    clearCondition() {
        this._condition = undefined;
    }

    get isPreInit() {
        return this._preInitConditionKeys && this._preInitConditionKeys.length > 0;
    }

    getWithGroup(groupKey: string, name: string, initValue?: any) {
        if (!groupKey) {
            return this.get(name, initValue);
        }

        let group = this.get(groupKey);
        if (group) {
            let value = group[name];
            if (!value) {
                value = initValue;
            }

            return value;
        }
        return initValue;
    }

    get(name: string, initValue?: any) {
        let model = this._condition || this._model;
        let value = model[name];
        if (!value && value !== 0) {
            if (this._condition) {
                value = this._condition[name] || initValue;
            }
        }
        return value;
    }

    getInt(name: string, initValue?: any) {
        return parseInt(this.get(name, initValue), 10);
    }

    set(name: string, value?: any) {
        this._model[name] = value;
        // Util.Data.setValueToJson(name, value, this._model);
    }

    isEmpty(name: string): boolean {
        const value = this.get(name);
        return value === undefined || value === null;
    }

    /**********************************************
     *
     * Common Method for Properties, Conditions
     *
     **********************************************/
    init_manualTimeline() {
        // const defaultValue = {
        //     selectedDate: null,
        //     dateMode: A3_CONFIG.WIDGET.TIME_LINE.NOW
        // };
        // if (this.isEmpty(CD.MANUAL_TIMELINE)) {
        //     this.set(CD.MANUAL_TIMELINE, defaultValue);
        // } else {
        //     const value = this.get(CD.MANUAL_TIMELINE);
        //     if (!value || !value.dateMode) {
        //         this.set(CD.MANUAL_TIMELINE, defaultValue);
        //     }
        // }
    }

    init_dateType(defaultValue?: any) {
        if (this.isEmpty(CD.DATE_TYPE)) {
            const value = defaultValue || _.first(A3_CODE.DFD.PERIOD_TYPE).data;
            this.set(CD.DATE_TYPE, value);
        }
    }

    init_time_period() {
        if (this.isEmpty(CD.CUTOFF_TYPE)) {
            this.set(CD.CUTOFF_TYPE, 'DAY');
        }
        if (this.isEmpty(CD.DAY_PERIOD)) {
            this.set(CD.DAY_PERIOD, 1);
        }

        const dateType: string = this.get(CD.CUTOFF_TYPE);
        const timePeriod: any = this.get(CD.TIME_PERIOD);
        const dayPeriod: number = dateType === 'DAY' ? this.getInt(CD.DAY_PERIOD) : 1;
        const now = Util.Date.now();
        const defaultValue: any = {
            [CD.FROM]: Util.Date.getFrom(dayPeriod, now),
            [CD.TO]: now
        };

        if (dateType === 'DAY') {
            this.set(CD.TIME_PERIOD, defaultValue);
        } else if (!timePeriod) {
            this.set(CD.TIME_PERIOD, defaultValue);
        }
    }
}
