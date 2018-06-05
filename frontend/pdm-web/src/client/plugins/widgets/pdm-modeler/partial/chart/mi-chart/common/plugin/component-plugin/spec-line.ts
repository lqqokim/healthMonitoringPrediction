import { ChartPlugin } from '../chart-plugin';

export interface SpecLineConfig {
    pluginClass: string;
    value: any;
    color: string;
    orient: string;
    direction: string;
    axisKinds: string;
    name: string;
}

export class SpecLinePlugin extends ChartPlugin {

    _scale: any;
    _orient: string;
    _domain: Array<any> = [];
    _range: Array<any> = [];
    _direction: any;
    _displayName: string;

    constructor(target: any, configuration: SpecLineConfig) {
        super(target, configuration);
        this._orient = this.configuration.orient;
        this._direction = this.configuration.direction;
        this._displayName = this.configuration.displayName;
    }

    setScale(width?: number, height?: number) {
        this.rangeSetting();
        this.domainSetting();
        this.getScale();
        this.drawLine();
    }

    drawLine() {
        const lineGroup = this.target.append('g').attr('class', this._displayName);
        lineGroup.append('line');
        lineGroup
            .attr('transform', `translate(${this.configuration.margin.left}, ${this._scale(this.configuration.value) + this.configuration.margin.top})`);
        const median = lineGroup.select('line');
        if (this._direction === 'horizontal') {
            // horizontal line
            lineGroup
                .attr('transform', `translate(${this.configuration.margin.left}, ${this._scale(this.configuration.value) + this.configuration.margin.top})`);
            median.attr('x1', 0)
                .attr('y1', 0)
                .attr('x2', this.width)
                .attr('y2', 0)
                .attr('stroke-width', 1.5)
                .attr('stroke', this.configuration.color);
        } else {
            // vertical line
            lineGroup
                .attr('transform', `translate(${this._scale(this.configuration.value) + this.configuration.margin.left}, ${this.configuration.margin.top})`);
            median.attr('x1', 0)
                .attr('y1', 0)
                .attr('x2', 0)
                .attr('y2', this.height)
                .attr('stroke-width', 1.5)
                .attr('stroke', this.configuration.color);
        }
    }

    removeLine() {

    }

    updateDisplay(width?: number, height?: number) {
        if (width && height) {
            this.width = width;
            this.height = height;
        }
        this.setScale(this.width, this.height);
    }

    disabled() {
        super.disabled();
        // remove specline
        this.removeLine();
    }

    enabled() {
        super.enabled();
        // draw specline
        this.updateDisplay(this.width, this.height);
    }

    rangeSetting() {
        if (this._direction === 'vertical') {
            this._range.push(0);
            this._range.push(this.width);
        } else {
            this._range.push(this.height);
            this._range.push(0);
        }
    }

    domainSetting() {
        if (this._orient === 'bottom' || this._orient === 'top') {
            this._domain = this.target.select(`.x.${this._orient}`)[0][0].__chart__.domain();
        } else {
            this._domain = this.target.select(`.y.${this._orient}`)[0][0].__chart__.domain();
        }
    }

    getScale() {
        if (this.configuration.axisKinds === 'datetime') {
            // datetime
            this._scale = d3.time
                .scale()
                .domain(this._domain)
                .range(this._range);
        } else if (this.configuration.axisKinds === 'numeric') {
            // numeric
            this._scale = d3.scale
                .linear()
                .domain(this._domain)
                .range(this._range);
        } else {
            // category
            this._scale = d3.scale
                .ordinal()
                .domain(this._domain)
                .rangeBands( this._range, .2 );
        }
    }
}
