import { AxisConfiguration, AxisConditions } from './../../model/index';
import { Axe } from './axe';
import { IDisplay } from './../i-display.interface';

export abstract class Axis implements IDisplay {
    axe: Axe;
    numeric_min: number;
    numeric_max: number;

    protected _range: Array<number>;
    protected _scale: any;

    private _configuration: AxisConfiguration;
    private _field: string;
    private _format: any;
    private _visible: boolean;
    private _gridline: boolean;
    private _title: string;
    private _domain: Array<any>;
    private _type: string;
    private _orient: string;
    private _margin: any;
    private _target: any;
    private _width: number;
    private _height: number;
    private _tickInfo: any;
    private _dataProvider: Array<any>;
    private _isStacked: boolean;
    private _prevDomain: Array<any>;


    // axisConfig: any, axisTarget: any, width: number, height: number, margin: Array<any>, domain: any
    constructor(axisConfig?: AxisConfiguration) {
        if (axisConfig) {
            this.configuration = axisConfig;
        }
    }

    set configuration( value: AxisConfiguration ) {
        this._configuration = value;
        if (this._configuration) {
            this.width = this._configuration.width;
            this.height = this._configuration.height;
            this.margin = this._configuration.margin;
            this.domain = this._configuration.domain;
            this.prevDomain = this.domain;
            this.isStacked = this._configuration.isStacked;
            if (this._configuration.conditions) {
                this._setConditions(this._configuration.conditions);
            }
            this.dataProvider = this._configuration.data;
            if (this._configuration.target) {
                this.target = this._configuration.target;
            }
        }
    }

    get configuration() {
        return this._configuration;
    }

    set target( value: any ) {
        this._createContainer(value);
    }

    get target(): any {
        return this._target;
    }

    set width(value: number) {
        this._width = value;
    }

    get width() {
        return this._width;
    }

    set height(value: number) {
        this._height = value;
    }

    get height() {
        return this._height;
    }

    set field( value: string ) {
        this._field = value;
    }

    get field() {
        return this._field;
    }

    set format( value: any ) {
        this._format = value;
    }

    get format() {
        return this._format;
    }

    set gridline( value: boolean ) {
        this._gridline = value;
    }

    get gridline() {
        return this._gridline;
    }

    set visible( value: boolean ) {
        this._visible = value;
    }

    get visible() {
        return this._visible;
    }

    set title( value: string ) {
        this._title = value;
    }

    get title() {
        return this._title;
    }

    set domain( value: any ) {
        this._domain = value;
    }
    get domain() {
        return this._domain;
    }

    set prevDomain( value: any) {
        this._prevDomain = value;
    }

    get prevDomain() {
        return this._prevDomain;
    }


    set type( value: string ) {
        this._type = value;
    }

    get type() {
        return this._type;
    }

    set orient( value: string ) {
        this._orient = value;
    }

    get orient() {
        return this._orient;
    }

    set margin( value: any ) {
        this._margin = value;
    }

    get margin() {
        return this._margin;
    }

    set tickInfo( value: any ) {
        this._tickInfo = value;
    }

    get tickInfo() {
        return this._tickInfo;
    }

    set dataProvider( value: Array<any> ) {
        this._dataProvider = value;

        if ( !this.domain ) {
            this._createDefaultDomain();
        }
    }

    get dataProvider() {
        return this._dataProvider;
    }

    set isStacked(value: boolean) {
        this._isStacked = value;
    }

    get isStacked() {
        return this._isStacked;
    }

    protected _setupAxe() {
        this.scaleSetting();
        this.scaleToAxeSetting();
    }

    _setConditions(conditions: AxisConditions) {
        this.field = conditions.field;
        this.format = conditions.format;
        this.visible = conditions.visible;
        this.title = conditions.title;
        this.type = conditions.type;
        this.orient = conditions.orient;
        this.gridline = conditions.gridline;
        if (conditions.tickInfo) {
            this.tickInfo = conditions.tickInfo;
        }
    }

    _createContainer(axisTarget: any) {
        this._target = axisTarget.append('g').attr('class', `${this.type} ${this.orient}`);
        this.updateDisplay(this.width, this.height);
    }

    protected _updateContainerPosition(svgTarget: any) {
        let px = 0;
        let py = 0;
        switch (this.orient) {
            case 'bottom' :
                px = this.margin.left;
                py = this.height + this.margin.top;
            break;
            case 'top' :
                px = this.margin.left;
                py = this.margin.top;
            break;
            case 'right' :
                px = this.margin.left + this.width;
                py = this.margin.top;
            break;
            case 'left' :
                px = this.margin.left;
                py = this.margin.top;
            break;
            default :
                px = this.margin.left;
                py = this.margin.top;
            break;
        }
        svgTarget.attr('transform', `translate(${px}, ${py})`);
    }

    protected _createDefaultDomain() {
        const targetArray: Array<any> = this.field.split(',');
        const targetField: string = targetArray[0];
        this.domain = this.dataProvider.map( (d: any) => {
            return d[targetField];
        });
        if ( this.domain.length && _.isNumber(this.domain[0]) ) {
            // const tempDomain: Array<any> = [...this.domain];
            const tempDomain: Array<any> = this.domain;

            this.domain = [];
            let min: number = _.min(tempDomain);
            let max: number = _.max(tempDomain);
            // date type length 13
            if (min > 0 && min.toString().length !== 13) {
                min = 0;
                max = max + (max * 0.1);
            }
            this.domain.push(min);
            this.domain.push(max);
        }
        this.prevDomain = [...this.domain];
    }

    _drawGridLine() {
        if (this._target) {
            const rootSvg: any = d3.select(this.target[0][0].nearestViewportElement);
            const gridGroup: any = rootSvg.select(`.grid-line-${this.type}-${this.orient}`);
            if (!gridGroup[0][0]) {
                rootSvg.insert('g', '.background')
                        .attr('class', `grid-line-${this.type}-${this.orient}`)
                        .style('stroke', '#CCC');
            }
            if (this.gridline && this.axe.scaleToAxe) {
                let px = 0;
                let py = 0;
                switch (this.orient) {
                    case 'bottom' :
                        px = this.margin.left;
                        py = this.height + this.margin.top;
                    break;
                    case 'top' :
                        px = this.margin.left;
                        py = this.margin.top;
                    break;
                    case 'right' :
                        px = this.margin.left + this.width;
                        py = this.margin.top;
                    break;
                    case 'left' :
                        px = this.margin.left;
                        py = this.margin.top;
                    break;
                    default :
                        px = this.margin.left;
                        py = this.margin.top;
                    break;
                }
                gridGroup.attr('transform', `translate(${px}, ${py})`);
                const gridScale: any = d3.svg.axis()
                                    .scale(this._scale)
                                    .orient(this.orient);
                if (this.type === 'y') {
                    gridScale.tickSize(-(this.width), 0, 0)
                             .tickFormat('');
                    gridGroup.select('rect')
                                .attr('width', this.margin.left)
                                .attr('height', this.height);
                } else {
                    gridScale.innerTickSize(-(this.height))
                             .outerTickSize(0)
                             .tickFormat('');
                    gridGroup.select('rect')
                                .attr('width', this.width)
                                .attr('height', this.margin.bottom);
                }
                gridGroup.call(gridScale);
            }
        }
    }

    _drawAxisBackground() {
        if (this._target) {
            const gridBackground: any = this._target.select(`.grid-background-${this.type}-${this.orient}`);
            if (!gridBackground[0][0]) {
                this._target.insert('rect', ':first-child')
                .attr('class', `grid-background-${this.type}-${this.orient}`)
                .style('fill', '#fff')
                .style('fill-opacity', 0);
            }
        }

        switch(this.orient) {
            case 'left' :
                this._target.select(`.grid-background-${this.type}-${this.orient}`)
                            .attr('x', -this.margin.left)
                            .attr('y', 0)
                            .attr('width', this.margin.left)
                            .attr('height', this.height);
                break;
            case 'right' :
                this._target.select(`.grid-background-${this.type}-${this.orient}`)
                            .attr('x', 0)
                            .attr('y', 0)
                            .attr('width', this.margin.left)
                            .attr('height', this.height);
                break;
            case 'top' :
                this._target.select(`.grid-background-${this.type}-${this.orient}`)
                            .attr('x', 0)
                            .attr('y', -this.margin.top)
                            .attr('width', this.width)
                            .attr('height', this.margin.top);
                break;
            default :
                this._target.select(`.grid-background-${this.type}-${this.orient}`)
                            .attr('width', this.width)
                            .attr('height', this.margin.bottom);
                break;
        }
    }

    updateDisplay(width: number, height: number) {
        this.width = width;
        this.height = height;
        this._setupAxe();
        this._drawGridLine();
        this._updateContainerPosition(this.target);
        this.makeAxisLabel();
        this._drawAxisBackground();
    }

    setDomain(min: number, max: number) {}

    protected scaleToAxeSetting() { }

    protected scaleSetting() {
        this._range = [];
        if (this.type === 'x') {
            this._range.push(0);
            this._range.push(this.width);
        } else {
            this._range.push(this.height);
            this._range.push(0);
        }
    }

    protected makeAxisLabel() { }

}
