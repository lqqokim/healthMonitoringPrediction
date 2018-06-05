import { IDisplay } from '../i-display.interface';

export class ChartTooltip implements IDisplay {

    private _htmlTemplate: string;
    private _bindKey: string;
    private _selector: any;
    private _toolTipObj: any;
    private _width: number;
    private _height: number;

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

    get htmlTemplate(): string {
        return this._htmlTemplate;
    }

    set htmlTemplate(value: string) {
        this._htmlTemplate = value;
    }

    get bindKey(): string {
        return this._bindKey;
    }

    set bindKey(value: string) {
        this._bindKey = value;
    }

    get selector(): string {
        return this._selector;
    }

    set selector(value: string) {
        this._selector = value;
    }

    constructor(target: string = 'body') {
        this.selector = target;
    }

    updateDisplay(width?: number, height?: number) {

    }

    _createTooltip(event: any, data: any) {
        const template: any = this.assemble(this.htmlTemplate, this.bindKey);
        const htmlString: string = template(data);
        console.log('_createTooltip : ', template(data));
        if (!this._toolTipObj) {
            this._toolTipObj = d3.select(this.selector)
            .append('div')  // declare the tooltip div
            .attr('class', 'michart_tooltip')              // apply the 'tooltip' class
            .style('opacity', 0);
        }
        this._toolTipObj.html(htmlString)
        .style('left', (event.pageX) + 'px')
        .style('top', (event.pageY - 28) + 'px')
        .style('opacity', 1)
        .append('div')
        .html('label');
    }

    _destoryTooltip() {
        this._toolTipObj.style('opacity', 0);
    }

    assemble(literal: string, params: any) {
        return new Function(params, 'return `'+literal+'`;');
    }
}
