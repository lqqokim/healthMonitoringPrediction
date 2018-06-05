
import { EventMap, ChartEventData } from './chart-event.interface';

interface ChartEventMap {
    [type: string]: EventMap;
}

export class EventDispatcher {
    private static _Instance: EventDispatcher;
    private _chartForEventMap:ChartEventMap = {};

    static getInstance(chartId?: string): EventDispatcher {
        if (!EventDispatcher._Instance) {
            EventDispatcher._Instance = new EventDispatcher(chartId);
        }
        return EventDispatcher._Instance;
    }

    constructor(chartId?: string) {
        if (chartId) {
            this.connect(chartId);
        }
    }

    connect(chartId: string) {
        const chartEvent: EventMap = {};
        this._chartForEventMap[chartId] = chartEvent;
    }

    disconnect(chartId: string) {
        this._chartForEventMap[chartId] = undefined;
    }

    addEventListener(chartId: string, type: string, method: any) {
        this._chartForEventMap[chartId][type] = method;
    }

    removeEventListener(chartId: string, type: string) {
        this._chartForEventMap[chartId][type] = undefined;
    }

    dispatchEvent(chartId: string, type: string, data?: ChartEventData) {
        this._chartForEventMap[chartId][type](data);
    }
}

