export class Dragable {
    private _startX: number;
    private _startY: number;
    private _endX: number;
    private _endY: number;
    private _event: Event;

    constructor(event?: Event, startX?: number, startY?: number, endX?: number, endY?: number) {
        this.event = event;
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
    }

    set startX(value: number) {
        this._startX = value;
    }

    get startX() {
        return this._startX;
    }

    set startY(value: number) {
        this._startY = value;
    }

    get startY() {
        return this._startY;
    }

    set endX(value: number) {
        this._endX = value;
    }

    get endX() {
        return this._endX;
    }

    set endY(value: number) {
        this._endY = value;
    }

    get endY() {
        return this._endY;
    }

    set event(ev: Event) {
        this._event = ev;
    }

    get event() {
        return this._event;
    }
}
