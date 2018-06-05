import { Series } from '../../series/index';
import { SeriesConfiguration } from './../../../model/index';
import { ChartException } from '../../error/index';

export class PieSeries extends Series {

    private _innerRadius: number;
    private _outerRadius: number;
    private _pie: any;
    private _radius: number;
    private _arc: any;
    private _pieColor: any;
    private _displayKey: string;
    private _pieData: Array<any>;

    constructor( seriesParam: SeriesConfiguration ) {
        super( seriesParam );
        this._pie = d3.layout.pie();
        this.index = 0;
        this.seriesIndex = 0;
        this.seriesCnt = 0;
    }

    set innerRadius(value: number) {
        this._innerRadius = value;
    }

    get innerRadius() {
        return this._innerRadius;
    }

    set outerRadius(value: number) {
        this._outerRadius = value;
    }

    get outerRadius() {
        return this._outerRadius;
    }

    set radius(value: number) {
        this._radius = value;
    }

    get radius() {
        return this._radius;
    }

    dataSetting() {
        super.dataSetting();
        if (this.dataProvider) {
            this._pieData = [];
            this.dataProvider.map(data => {
                this._pieData.push(data[this.xField]);
            });
            this.updateDisplay();
        }
    }

    generatePosition() {
        super.generatePosition();
        if (this.seriesCnt === 0) {
            this.radius = Math.min(this.width, this.height) / 2;
        }
        this._createArc();
        this.target.attr('height', this.height)
                   .attr('transform', `translate(${this.width / 2}, ${this.height / 2})`);
    }

    updateDisplay() {
        this.generatePosition();
        this._displayKey = this.configuration.condition.displayKey;
        if (!this._displayKey) {
            throw new ChartException(404, {message: 'do not displayKey of pieseries configuration'});
        }
        this._pieColor = d3.scale.category20();
        this.target.attr('data-legend', () => {
            return this.displayName;
        });
        const pieTarget: any = this.target.selectAll('path')
            .data(this._pie(this._pieData))
            .enter();
        pieTarget.append('path')
            .style('fill', (d: any, i: any) => {
                return this._pieColor(i);
            })
            .attr('class', (d: any, i: any) => {
                return this.dataProvider[i][this._displayKey];
            })
            .transition()
            .duration(500)
            .attrTween('d', (d: any) => {
                const i = d3.interpolate(d.startAngle+0.1, d.endAngle);
                return (t: any) => {
                    d.endAngle = i(t);
                    return this._arc(d);
                };
            });
        setTimeout(() => {
            this._drawLabel(pieTarget);
        }, 1000);

    }

    createItem() { }

    _createArc() {
        this.innerRadius = this.radius * this.seriesIndex;
        this.outerRadius = this.innerRadius + this.radius;
        this._arc = d3.svg.arc()
                          .innerRadius(this.innerRadius)
                          .outerRadius(this.outerRadius);
    }

    _createInnerLabel() {
        const label_position = (this.innerRadius + this.outerRadius) / 2;
        return d3.svg.arc()
                     .innerRadius(label_position)
                     .outerRadius(label_position);
    }

    _createOutsideLabel() {
        return d3.svg.arc()
                     .innerRadius(this.radius * 1.5)
                     .outerRadius(this.radius * 1.5);
    }

    _midAngle(data: any) {
        return data.startAngle + (data.endAngle - data.startAngle) / 2;
    }

    _drawLabel(pie_target: any) {
        if ( this.label.visible ) {
            if (this.label.side === 'in') {
                const label: any = this._createInnerLabel();
                pie_target.append('text')
                    .attr('transform', (d: any) => {
                        return `translate(${label.centroid(d)})`;
                    })
                    .attr('dy', '0.35em')
                    .text((d: any, i: any) => {
                        return d.value;
                    });
            } else {
                const outsideLabel: any = this._createOutsideLabel();
                this._createArc();

                pie_target.append('text')
                    .attr('text-anchor', 'middle')
                    .attr('transform', (d: any) => {
                        const pos: any = outsideLabel.centroid(d);
                        pos[0] = this.radius * 1.7 * (this._midAngle(d) < Math.PI ? 1.03 : -1.03);
                        return `translate(${pos})`;
                    })
                    .text((d: any, i: any) => {
                        return d.value;
                    });

                pie_target.append('g')
                    .append('polyline')
                    .attr('points', (d: any) => {
                        const pos = outsideLabel.centroid(d);
                        pos[0] = this.radius * 1.55 * (this._midAngle(d) < Math.PI ? 1 : -1);
                        return [this._arc.centroid(d), outsideLabel.centroid(d), pos];
                    })
                    .style('fill', 'none')
                    .style('stroke', 'black')
                    .style('stroke-width', '1px');

            }
        }
    }

}

