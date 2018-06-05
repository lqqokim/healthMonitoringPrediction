import { Axe, Axis  } from './../../axis/index';
import { AxisConfiguration } from './../../../model/index';

export class DateTimeAxis extends Axis {
    private _customTimeFormat: any;

    constructor(axisConfig: AxisConfiguration) {
        super(axisConfig);
        // make Axis
        this._customTimeFormat = d3.time.format.multi([
                ['.%L', function(d: any) { return d.getMilliseconds(); }],
                [':%S', function(d: any) { return d.getSeconds(); }],
                ['%H:%M', function(d: any) { return d.getMinutes(); }],
                ['%H:%M', function(d: any) { return d.getHours(); }],
                ['%a %d', function(d: any) { return d.getDay() && d.getDate() !== 1; }],
                ['%b %d', function(d: any) { return d.getDate() !== 1; }],
                ['%B', function(d: any) { return d.getMonth(); }],
                ['%Y', function() { return true; }]
             ]);
    }

    updateDisplay(width: number, height: number) {
        super.updateDisplay(width, height);
    }

    // 재정의
    makeAxisLabel() {
        super.makeAxisLabel();
        this.target.transition().call(this.axe.scaleToAxe);
        if (this.tickInfo && this.tickInfo.rotate) {
            this._tickRotate(this.tickInfo.rotate);
        }
    }

    setDomain(min: number, max: number) {
        this.domain[0] = min;
        this.domain[1] = max;
        this.updateDisplay(this.width, this.height);
    }

    scaleSetting() {
        super.scaleSetting();
        this._scale = d3.time.scale()
                                .domain(this.domain)
                                .range(this._range);
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
        if (this.tickInfo && this.tickInfo.format) {
            this.axe.scaleToAxe.tickFormat(d3.time.format(this.tickInfo.format));
        } else {
            this.axe.scaleToAxe.tickFormat(this._customTimeFormat);
        }
        if (this.tickInfo && this.tickInfo.ticks) {
            this.axe.scaleToAxe.ticks(this.tickInfo.ticks);
        }
    }

    _tickRotate(deg: number) {
        this.target.selectAll('text').style('text-anchor', 'start')
                                     .attr('dx', '.71em')
                                     .attr('dy', '.35em')
                                     .attr('transform', () => {
                                        return `rotate(${deg})`;
                                     });
    }
}
