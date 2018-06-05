import { SeriesConditions } from './../../model/index';
import { IDisplay } from './../i-display.interface';
import { SeriesConfiguration } from '../../model/index';
import { Axe } from '../../common/axis/index';
import { Dragable } from '../plugin/index';
import { ChartEvent } from '../event/chart-event.constant';
import { ChartEventData } from '../event/chart-event.interface';

export abstract class Series implements IDisplay {

    // private
    private _xAxe: Axe;
    private _yAxe: Axe;
    private _x: any;
    private _y: any;
    private _configuration: any;
    private _label: any;
    private _manual: string;
    private _seriesCnt: number;
    private _seriesIndex: number;

    private _width: number;
    private _height: number;
    // get group element from chart-base
    private _target: any;
    private _color: any;
    // _displayName will be used in class name.
    private _displayName: string;
    private _xField: string;
    private _yField: string;
    // total data
    private _dataProvider: Array<any>;
    // single data
    private _data: any;
    private _index: number;

    private _rectWidthDimensions: number;
    private _rectHeightDimensions: number;

    private _chartWidth: number;
    private _chartHeight: number;

    protected _seriesName: string;

    constructor(seriesConfig?: SeriesConfiguration) {
        if (seriesConfig) {
            this.configuration = seriesConfig;
        }
    }

    set configuration(value: SeriesConfiguration) {
        this._configuration = value;
        if (this._configuration) {
            this._setConditions(this._configuration.condition);
        }
        if (this._configuration.target) {
            this._createContainer(this._configuration.target);
        }
    }

    get configuration() {
        return this._configuration;
    }

    set seriesCnt(value: number) {
        this._seriesCnt = value;
    }

    get seriesCnt(): number {
        return this._seriesCnt;
    }

    set seriesIndex(value: number) {
        this._seriesIndex = value;
    }

    get seriesIndex(): number {
        return this._seriesIndex;
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

    set target(value: any) {
        this._target = value;
    }

    get target(): any {
        return this._target;
    }

    set color(value: any) {
        this._color = value;
    }

    get color(): any {
        return this._color;
    }

    set displayName(value: string) {
        this._displayName = value;
        if (!this._displayName) {
            this._displayName = this._xField;
        }
        this._seriesName = this._displayName.replace(/ /g, '_');
    }

    get displayName(): string {
        return this._displayName;
    }

    set xField(value: string) {
        this._xField = value;
    }

    get xField(): string {
        return this._xField;
    }

    set label(value: any) {
        this._label = value;
    }

    get label(): any {
        return this._label;
    }

    set yField(value: string) {
        this._yField = value;
    }

    get yField(): string {
        return this._yField;
    }

    set data(value: any) {
        this._data = value;
    }

    get data(): any {
        return this._data;
    }

    set index(value: number) {
        this._index = value;
    }

    get index(): number {
        return this._index;
    }

    set xAxe( value: Axe ) {
        this._xAxe = value;
    }

    get xAxe(): Axe {
        return this._xAxe;
    }

    set yAxe( value: Axe ) {
        this._yAxe = value;
    }

    get yAxe(): Axe {
        return this._yAxe;
    }

    set x(value: any) {
        this._x = value;
    }

    get x(): any {
        return this._x;
    }

    set y(value: any) {
        this._y = value;
    }

    get y(): any {
        return this._y;
    }

    set dataProvider( data: any[] ) {
        this._dataProvider = data;
        this.dataSetting();
    }

    get dataProvider() {
        return this._dataProvider;
    }

    set manual(value: string) {
        this._manual = value;
    }

    get manual() {
        return this._manual;
    }

    set rectWidthDimensions(value: number) {
        this._rectWidthDimensions = value;
    }

    get rectWidthDimensions(): number {
        return this._rectWidthDimensions;
    }

    set rectHeightDimensions(value: number) {
        this._rectHeightDimensions = value;
    }

    get rectHeightDimensions(): number {
        return this._rectHeightDimensions;
    }

    get chartWidth(): number {
        return this._chartWidth;
    }

    get chartHeight(): number {
        return this._chartHeight;
    }

    /*
    * title : dataSetting
    * description : Run when set dataProvider
    */
    protected dataSetting() { }

    protected createChildren() { }

    protected generatePosition() { }

    /*
    * title : createItem
    * description : create point item for transition. data is setting 0
    */
    protected createItem() { }

    protected removeItem(targetElement: any) {
        targetElement.transition()
                        .attr('width', 0)
                        .attr('height', 0)
                        // .attr('y', this._chartHeight)
                        .remove();
    }

    /*
     * title : _addEventListener
     * description : add eventlistener of created svg element
     */
    _addEventListener(element: any) {
        element.nearestViewportElement.addEventListener(ChartEvent.DRAG_END, this._pluginEvent);
    }

    _pluginEvent = (event: CustomEvent) => {
        this.selectAll(event.detail);
    }

    /*
    * title : _createContainer
    * description : first time, create group element in series class
    */
    _createContainer(seriesTarget: any) {
        this.target = seriesTarget.append('g').attr('class', this.displayName);
        this._addEventListener(this.target[0][0]);
    }

    _setConditions(conditions: SeriesConditions) {
        this._xField = conditions.xField;
        this._yField = conditions.yField;
        this.displayName = conditions.displayName;

        // setup field name, when displayName is null.
        if (conditions.displayName) {
            this.displayName = conditions.displayName;
        } else {
            this.displayName = this._xField;
        }

        if (conditions.label) {
          this.label = conditions.label;
        }
    }

    updateDisplay(width?: number, height?: number) {
        if (this.data) {
            this.generatePosition();
            const parentSvg: any = this.target[0][0].nearestViewportElement;
            const backgroundElement: any = d3.select(parentSvg).select('.background-rect');
            const backWidth: number = +backgroundElement.attr('width');
            const backHeight: number = +backgroundElement.attr('height');
            this._chartWidth = backWidth;
            this._chartHeight = backHeight;
        }
    }

    selectAll(event: Dragable) {}

    setTransition(element: any, duration: number = 1000): any {
        if (element) {
            return element.transition().delay(duration);
        }
        return null;
    }

    unselectAll() {}

    createLabel( orient: string = 'top', targetElement: any) {
        if (this.configuration.condition.textLabel.show) {
            const targetWidth: number = targetElement.attr('width');
            const targetHeight: number = targetElement.attr('height');
            const targetX: number = targetElement.attr('x')? +targetElement.attr('x'):0;
            const targetY: number = targetElement.attr('y')? +targetElement.attr('y'):0;
            const value: any = targetElement.attr('value');
            let textLabel: any = this.target.select(`.${targetElement.attr('class')}label`);

            if (!textLabel[0][0]) {
                textLabel = this.target.append('text')
                                        .text(value)
                                        .attr('fill', 'black')
                                        .attr('class',`${targetElement.attr('class')}label`);
            }
            const labelWidth: number = textLabel.node().getBoundingClientRect().width;

            if (orient === 'top') {
                textLabel.attr({
                    x: targetX + (targetWidth/2) - (labelWidth/2),
                    y: targetY - 3
                });
            } else if (orient === 'right') {
                textLabel.attr({
                    x: targetWidth + 3,
                    y: targetY + (targetHeight/2),
                    dy: '.35em'
                });
            }
        }
    }

    removeAll() {
        const elements: Array<any> = this.target.selectAll('*');
        console.log('removeAll : ', elements);
    }

    filteringDataProvider(dataProvider: Array<any>) {
        return dataProvider.filter((d: any) => {
            const domain: Array<any> = this.xAxe.scale.domain();
            if (d[this.xField] >= domain[0] && d[this.xField] <= domain[1] ) {
                return true;
            } else {
                return false;
            }
        });
    }
}
