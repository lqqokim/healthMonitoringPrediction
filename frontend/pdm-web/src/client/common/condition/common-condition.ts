import { Util } from '../../sdk';

export class CommonCondition {

    constructor(private _properties: any, private _config?: string) {
        if (_properties['config']) {
            delete _properties['config'];
        }
    }

    get data() {
        return this._properties;
    }

    get config() {
        return this._config;
    }

    get(name: string) {
        return this._properties[name];
        // return Util.Data.getValueFromJson(name, model);
    }

    getInt(name: string) {
        return parseInt(this.get(name), 10);
    }

    set(name: string, value?: any) {
        this._properties[name] = value;
        // Util.Data.setValueToJson(name, value, this._properties);
    }

    isEmpty(name: string): boolean {
        const value = this.get(name);
        return value === undefined || value === null;
    }
}