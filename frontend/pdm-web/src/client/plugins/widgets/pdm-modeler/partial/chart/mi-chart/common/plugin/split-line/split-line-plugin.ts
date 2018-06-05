import { ChartPlugin } from '../chart-plugin';

export interface SplitLineConfig {
    pluginClass: string;
    xField: SplitLineFieldConfig;
    yField: SplitLineFieldConfig;
    baseField: string;
    displayName: string;
    color: string;
}

export interface SplitLineFieldConfig {
    type: string;
    field: string;
    orient: string;
    direction: string;
    axisKinds: string;
}

export class SplitLinePlugin extends ChartPlugin {

    container: any;
    containerRect: any;
    xScale: any;
    yScale: any;
    marginTop: number;
    marginLeft: number;
    baseLineGroup: any;
    _callback: any;

    constructor(target: any, configuration: SplitLineConfig) {
        super(target, configuration);
        if (this.configuration.callback) {
            this._callback = this.configuration.callback;
        }
        const ytarget = this.target.select('g.background');
        const yposition = d3.transform(ytarget.attr('transform')).translate;
        this.marginTop = yposition[1];
        this.marginLeft = yposition[0];
        this._createContainer();
        this.xScale = this.setScale(this.configuration.xField, this.width, this.height);
        this.yScale = this.setScale(this.configuration.yField, this.width, this.height);
    }

    _createContainer() {
        this.container = this.target.append('g').attr('class', 'splitLine');
        this.containerRect = this.container.append('rect').style('fill-opacity', 0);
    }

    addEvent() {
        this.containerRect.on('click', () => {
            let offset: any;
            let currentSelectValue: any;
            if (this.configuration.baseField === 'x') {
                offset = d3.event.offsetX - this.marginLeft;
                currentSelectValue = this.xScale.invert(offset);
                if (this.baseLineGroup) {
                    this.baseLineGroup.remove();
                }
                this.baseLineGroup = this.target
                                            .insert('g', '.splitLine')
                                            .attr('class', 'base-line')
                                            .attr('transform', 'translate(' + (offset + this.marginLeft  + ',' + this.marginTop + ')'));
                this.baseLineGroup.append('line')
                    .attr('x1', 0)
                    .attr('y1', 0)
                    .attr('x2', 0)
                    .attr('y2', this.height)
                    .style('stroke', 'black')
                    .style('stroke-width', 1);
            } else {
                offset = d3.event.clientY - this.marginTop;
                currentSelectValue = this.yScale.invert(offset);
                this.baseLineGroup = this.target
                                            .append('g')
                                            .attr('class','base-line')
                                            .attr('transform', 'translate(' + (this.marginLeft + ',' + offset + ')'));
                this.baseLineGroup.append('line')
                    .attr('x1', 0)
                    .attr('y1', 0)
                    .attr('x2', this.width)
                    .attr('y2', 0)
                    .style('stroke', 'black')
                    .style('stroke-width', 1);
            }

            const allRectEl = d3.select(`.${this.configuration.displayName}`).selectAll('rect');
            const overRect: Array<any> = [];
            allRectEl[0].map((rect: any) => {
                if (rect.__data__[this.configuration.xField.field] >= currentSelectValue) {
                    overRect.push(rect);
                }
            });
            const outputData: Array<any> = [];
            if (this.configuration.baseField === 'x') {
                overRect.map((r: any) => {
                    const data = r.__data__[this.configuration.yField.field];
                    outputData.push(data);
                    const rect = d3.select(r);
                    const x = 0;
                    const y = this.yScale(data);
                    const rectWidth = rect.attr('width') - offset;
                    const rectHeight = rect.attr('height');
                    this.baseLineGroup.append('rect')
                                    .attr('x', x)
                                    .attr('y', y)
                                    .attr('width', rectWidth)
                                    .attr('height', rectHeight)
                                    .attr('fill', 'red')
                                    .attr('fill-opacity', 1);
                })
            } else {
                overRect.map((r: any) => {
                    const data = r.__data__[this.configuration.xField.field];
                    outputData.push(data);
                    const rect = d3.select(r);
                    const x = this.yScale(data);
                    const y = this.height - rect.attr('height');
                    const rectWidth = rect.attr('width');
                    const rectHeight = offset - y;
                    this.baseLineGroup.append('rect')
                                    .attr('x', x)
                                    .attr('y', y)
                                    .attr('width', rectWidth)
                                    .attr('height', rectHeight)
                                    .attr('fill', 'red')
                                    .attr('fill-opacity', 1);
                })
            }
            this._callback.call(this, outputData);

        })
    }

    removeEvent() {

    }

    updateDisplay(width?: number, height?: number) {
        console.log('split ', width, height);
        if (width && height) {
            this.width = width;
            this.height = height;
        }
        this.containerRect.attr('width', this.width).attr('height', this.height);
        this.container.attr('transform', `translate(${this.marginLeft}, ${this.marginTop})`);
        this.xScale = this.setScale(this.configuration.xField ,this.width, this.height);
        this.yScale = this.setScale(this.configuration.yField, this.width, this.height);
        this.addEvent();
    }

    disabled() {
        super.disabled();
        this.containerRect.on('click', null);
        this.container.remove();
        this.removeEvent();
    }

    enabled() {
        super.enabled();
        this._createContainer();
        this.updateDisplay(this.width, this.height);
    }

    rangeSetting(direction): Array<any> {
        let range = [];
        if (direction === 'vertical') {
            range.push(0);
            range.push(this.width);
        } else {
            range.push(this.height);
            range.push(0);
        }
        return range;
    }

    domainSetting(orient): Array<any> {
        let domain = [];
        if (orient === 'bottom' || orient === 'top') {
            domain = this.target.select(`.x.${orient}`)[0][0].__chart__.domain();
        } else {
            domain = this.target.select(`.y.${orient}`)[0][0].__chart__.domain();
        }
        return domain;
    }

    setScale(field: SplitLineFieldConfig, width?: number, height?: number): any {
        const range: Array<any> = this.rangeSetting(field.direction);
        const domain: Array<any> = this.domainSetting(field.orient);
        const scale = this.getScale(field.axisKinds, domain, range);
        return scale;
    }

    getScale(axis_kind: string, domain: Array<any>, range: Array<any>): any {
        let scale: any;
        console.log('domain', domain,'range', range);
        if (axis_kind === 'datetime') {
            // datetime
            scale = d3.time
                                .scale()
                                .domain(domain)
                                .range(range);
        } else if (axis_kind === 'numeric') {
            // numeric
            scale = d3.scale
                                .linear()
                                .domain(domain)
                                .range(range);
        } else {
            // category
            scale = d3.scale
                                .ordinal()
                                .domain(domain)
                                .rangeBands( range, .2 );
        }
        return scale;
    }

}
