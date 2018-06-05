import { IDisplay } from '../i-display.interface';
import { EventMap, ChartEventData } from '../event/index';

export abstract class ChartPlugin implements IDisplay {

    protected _eventMap: EventMap = {};
    protected _target: any;
    private _configuration: any;
    private _width: number;
    private _height: number;
    private _className: string;

    constructor( target?: any, config?: any ) {
        if (config) {
            this.configuration = config;
        }
        if (target) {
            this.target = target;
        }
    }

    set target(value: any) {
        this._target = value;
        if (this._target) {
            this._addEvent(this._target);
        }
    }

    get target() {
        return this._target;
    }

    set width(value: number) {
        this._width = value;
    }

    get width(): number {
        return this._width;
    }

    set height(value: number) {
        this._height = value;
    }

    get height(): number {
        return this._height;
    }

    set className(value: string) {
        this._className = value;
    }

    get className() {
        return this._className;
    }

    set configuration( value: any ) {
        this._configuration = value;
        this.className = this._configuration.pluginClass;
    }

    get configuration() {
        return this._configuration;
    }

    get events(): Array<any> {
        return [];
    }

    protected _addEvent(target: any) {

    }

    addEventListener(type: string, method: any) {
        this._eventMap[type] = method;
    }

    dispatchEvent(type: string, event: ChartEventData) {
        if (this._eventMap[type]) {
            this._eventMap[type](event);
        }
    }

    updateDisplay(width?: number, height?: number) {

    }

    enabled() {
        console.log(this.className, 'plugin ==> enabled');
    }

    disabled() {
        console.log(this.className, 'plugin ==> disabled');
    }

    _moveToFront() {
        // const pluginGroup: any = d3.select('.');
        // return this.each(function(){
        //     this.parentNode.appendChild(this);
        // });
    }

    _moveToBack() {
        // return this.each(function() {
        //     var firstChild = this.parentNode.firstChild;
        //     if (firstChild) {
        //         this.parentNode.insertBefore(this, firstChild);
        //     }
        // });
    };

    callbackCall(data: any) { }
}
