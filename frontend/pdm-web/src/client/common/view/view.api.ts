import { ConditionType } from '../condition/condition.type';

export abstract class ViewApi {

    private _model: any;
    private _data: any;

    abstract displayContext(): ConditionType[];
    abstract displayConfiguration(): ConditionType[];
    abstract displaySync(): ConditionType[];

    /**
     * call from widget.api when apply configuration.
     */
    initModel(model: any) {
        this._model = model;
    }

    setViewData(data: any) {
        this._data = data;
        // this._data = undefined;
        // this._data = Util.Data.mergeDeep(this._model, data);
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
        let model = this._data || this._model;
        let value = model[name];
        if (!value && value !== 0) {
            if (this._data) {
                value = this._data[name];
            }
            if (!value) {
                value = initValue;
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
}
