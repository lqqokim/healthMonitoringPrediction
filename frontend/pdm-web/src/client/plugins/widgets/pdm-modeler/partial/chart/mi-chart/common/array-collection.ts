import { EventMap } from './event/index';

export class ArrayCollection {

    static DATA_ADDED_ITEM: string = 'data_added_item';
    static DATA_REMOVED_ITEM: string = 'data_removed_item';

    private _source: Array<any>;
    private _eventMap: EventMap = {};

    constructor(source?: Array<any>) {
        if (source) {
            this._source = source;
        } else {
            this._source = <any>[];
        }
    }

    set source(value: Array<any>) {
        this._source = value;
    }

    get source(): Array<any> {
        return this._source;
    }

    addItem(value: any) {
        this._source.push(value);
        this.dispatchEvent(ArrayCollection.DATA_ADDED_ITEM, value);
    }

    removeItemAt(index: number) {
        const targetValue: any = this._source.slice(index, 1);
        this.dispatchEvent(ArrayCollection.DATA_REMOVED_ITEM, targetValue);
    }

    addEventListener(type: string, method: any) {
        this._eventMap[type] = method;
    }

    removeEventListener(type: string) {
        this._eventMap[type] = undefined;
    }

    dispatchEvent(type: string, data: any) {
        if (this._eventMap[type]) {
            this._eventMap[type](type, data);
        }
    }
}
