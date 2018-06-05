import { Component, Input, OnInit, OnChanges, OnDestroy, SimpleChanges, ViewChild, ElementRef } from '@angular/core';

import { UUIDUtil } from '../../utils/uuid.util';

@Component({
    selector: '[refresh-clock]',
    template: `
      <div #clockGenerator></div>
    `
})
export class RefreshClockComponent implements OnInit, OnChanges, OnDestroy {

    private _isInitEl: boolean;
    private _clockEl: HTMLElement;
    private _uuid: string;
    @Input() refresh: any;

    /**
     * config value 
     */
    width: number = 14;
    height: number = 14;
    strokeWidth: number = 1;
    clockFillColor: string = "none";
    clockBorderColor: string = "#272727";
    clockHandColor: string = "#272727";
    clockCenterColor: string = "#272727";
    transitionEnabled: boolean = true;
    radius: number = this.width / 2;
    margin: number = 1;
    vis;
    clock;
    clockhand;
    hourPosition;
    minutePosition;
    minutePositionFinal;
    hourPositionFinal;
    hourPositionOffset;
    scaleMins;
    scaleHours;
    scaleBetweenHours;

    @ViewChild('clockGenerator') clockGeneratorEl: ElementRef;

    ngOnInit() {
        this._initEl();
    }

    ngOnChanges(changes: SimpleChanges) {
        const freshClock = changes['refresh'];
        if (freshClock && freshClock.currentValue) {
            this._initEl();
            this.drawClock(freshClock.currentValue);
        }
    }

    private _initClock() {
        this._makeScale();
        this._makeClock();
        this._makePosition();
    }

    private _makeScale() {
        // Set up Scales        
        // Map 60 minutes onto a radial 360 degree range.
        this.scaleMins = d3.scale.linear()
            .domain([0, 59 + 59 / 60])
            .range([0, 2 * Math.PI]);

        // Map 12 hours onto a radial 360 degree range.
        this.scaleHours = d3.scale.linear()
            .domain([0, 11 + 59 / 60])
            .range([0, 2 * Math.PI]);

        // Every hour, the minute hand rotates 360 degrees and the hour hand rotates 30 degrees.
        // To get the final, accurate hour hand position, the linear movement of the minute hand
        // is mapped to a 30 degree radial angle and the resulting angular offset
        // is added to the hour hand position (in scaleHours above).
        this.scaleBetweenHours = d3.scale.linear()
            .domain([0, 59 + 59 / 60])
            .range([0, Math.PI / 6]);
    }

    private _makeClock() {
        // Set up SVG
        this.vis = d3.select(`#${this._uuid}`)
            .append("svg:svg")
            .attr("class", "clock")
            .attr("width", (this.width + this.margin))
            .attr("height", (this.height + this.margin));

        this.clock = this.vis.append("svg:g")
            .attr("transform", "translate(" + this.radius + "," + this.radius + ")");

        // Clock face
        this.clock.append("svg:circle")
            .attr("class", "clockface")
            .attr("r", this.radius - this.strokeWidth)
            // .attr("r", this.radius - this.strokeWidth)
            .attr("fill", this.clockFillColor)
            .attr("stroke", this.clockBorderColor)
            .attr("stroke-width", 1);
        // .attr("stroke-width", this.strokeWidth + 1);

        // Add center dial
        // this.clock.append("svg:circle")
        //     .attr("class", "centerdot")
        //     .attr("r", this.strokeWidth)
        //     .attr("fill", this.clockCenterColor);
    }

    private _makePosition() {
        // When animating, set 12 o’clock as the clockhand animation start position
        this.minutePosition = d3.svg.arc()
            .innerRadius(0)
            .outerRadius((3 / 4) * (this.radius - 1))
            .startAngle(0)
            .endAngle(0);

        this.hourPosition = d3.svg.arc()
            .innerRadius(0)
            .outerRadius((1 / 2) * (this.radius))
            .startAngle(0)
            .endAngle(0);

        // When not animating, set the clockhand positions based on time
        this.minutePositionFinal = d3.svg.arc()
            .innerRadius(0)
            .outerRadius((2 / 3) * (this.radius - 1))
            .startAngle((d) => {
                return this.scaleMins(+d.value);
            })
            .endAngle((d) => {
                return this.scaleMins(+d.value);
            });

        this.hourPositionFinal = d3.svg.arc()
            .innerRadius(0)
            .outerRadius((1 / 2) * (this.radius))
            .startAngle((d) => {
                return (this.scaleHours(+d.value % 12) + this.scaleBetweenHours(this.hourPositionOffset));
            })
            .endAngle((d) => {
                return (this.scaleHours(+d.value % 12) + this.scaleBetweenHours(this.hourPositionOffset));
            });
    }

    drawClock(data: any) {

        // Add clockhands to the clockface
        if (this.clockhand) {
            this.clock.selectAll('.clockhand').remove();
        }

        this.clockhand = this.clock.selectAll(".clockhand")
            .data(data)
            .enter()
            .append("svg:path")
            .attr("class", "clockhand")
            .attr("stroke", this.clockHandColor)
            .attr("stroke-width", this.strokeWidth)
            .attr("stroke-linecap", "round")
            .attr("stroke-linejoin", "round")
            .attr("fill", "none");

        // Animate clockhands!    
        if (this.transitionEnabled) {
            this.clockhand
                .attr("d", (d) => {
                    if (d.unit === "minutes") {
                        this.hourPositionOffset = +d.value;
                        return this.minutePosition();
                    } else if (d.unit === "hours") {
                        return this.hourPosition();
                    }
                })
                .transition()
                .delay(333)
                .duration(555)
                .ease("elastic", 1, 4)
                .attrTween("transform", (d, i, a) => {
                    if (d.unit === "minutes") {
                        return d3.interpolate("rotate(0)", "rotate(" + (this.scaleMins(+d.value) * (180 / Math.PI)) + ")");
                    } else if (d.unit === "hours") {
                        return d3.interpolate("rotate(0)", "rotate(" + ((this.scaleHours(+d.value % 12) + this.scaleBetweenHours(this.hourPositionOffset)) * (180 / Math.PI)) + ")");
                    }
                });
        } else {
            this.clockhand.attr("d", (d) => {
                if (d.unit === "minutes") {
                    this.hourPositionOffset = +d.value;
                    return this.minutePositionFinal(d);
                } else if (d.unit === "hours") {
                    return this.hourPositionFinal(d);
                }
            });
        }
    }

    private _initEl() {
        if (!this._isInitEl) {
            this._isInitEl = true;
            this._clockEl = this.clockGeneratorEl.nativeElement;
            this._setIdAttribute();
        }
    }

    private _setIdAttribute() {
        if (!this._clockEl.hasAttribute('id') || this._clockEl.hasAttribute('id') === null) {
            this._uuid = `a3w_refresh_clock_${UUIDUtil.new()}`;
            this._clockEl.setAttribute('id', this._uuid);
            // initialize clock
            this._initClock();
        }
    }

    ngOnDestroy() { }
}

