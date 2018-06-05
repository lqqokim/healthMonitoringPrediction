/**
 * Created by airnold on 2017. 6. 19..
 */

export interface EventMap { // indexable interface
    [type: string]: any;
}

export interface IChartEvent {
    type: string;
    data: ChartEventData;
}

export class ChartEventData {
    event: any;
    data: any;
    type?: string;

    constructor(event: any, data: any, type?: string) {
        this.event = event;
        this.data = data;
        this.type = type;
    }
}
