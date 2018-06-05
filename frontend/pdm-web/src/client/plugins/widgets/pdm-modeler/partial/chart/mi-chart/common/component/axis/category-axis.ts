import { Axe, Axis  } from './../../axis/index';
import { AxisConfiguration } from './../../../model/index';

export class CategoryAxis extends Axis {

    constructor(axisConfig: AxisConfiguration) {
        super(axisConfig);
    }

    updateDisplay(width: number, height: number) {
        super.updateDisplay(width, height);
    }

    makeAxisLabel() {
        super.makeAxisLabel();
        this.target.transition().call(this.axe.scaleToAxe);
        if (this.tickInfo && this.tickInfo.rotate) {
            this._tickRotate();
        }
    }

    scaleSetting() {
        super.scaleSetting();
        this._scale = d3.scale.ordinal()
                                .domain(this.domain)
                                .rangeBands( this._range, .2 );
    }

    scaleToAxeSetting() {
        super.scaleToAxeSetting();
        if (!this.axe) {
            this.axe = new Axe();
        }
        this.axe.scale = this._scale;
        this.axe.scaleToAxe = d3.svg.axis()
                                .scale(this._scale)
                                .orient(this.orient);


        if (this.tickInfo && this.tickInfo.ticks) {
            const domain_length: number = this.axe.scale.domain().length;
            if ((domain_length / 2) < this.tickInfo.ticks) {
                return;
            } else {
                this._domainTruncate();
            }
        }
    }

    _domainTruncate() {
        let tickSize: number = Math.round(this.axe.scale.domain().length / this.tickInfo.ticks);
        if (this.tickInfo.ticks % 2) {
            tickSize = tickSize + 1;
        }
        const tempArray: Array<any> = this.axe.scale.domain().map((d: any, i: any) => {
            if (i === 0) {
                return d;
            } else {
                if (i % tickSize === 0) {
                    return d;
                } else {
                    return 0;
                }
            }
        });
        const tickArray: Array<any> = tempArray.filter( (d: any) =>  d !== 0 );
        this.axe.scaleToAxe.tickValues(tickArray);
    }

    _tickRotate() {
        this.target.selectAll('text').style('text-anchor', 'start')
                                     .attr('transform', () => {
                                       return 'rotate(45)';
                                      });
    }
}
