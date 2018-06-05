import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import * as contours from 'd3-contour';
import * as selection from 'd3-selection';
import * as scale from 'd3-scale';
import * as geo from 'd3-geo';
import * as scalec from 'd3-scale-chromatic';
import { extent } from 'd3-array';

@Component({
    moduleId: module.id,
    selector: 'contour-chart',
    templateUrl: 'contour-chart.component.html',
    styleUrls: ['contour-chart.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class ContourChartComponent implements OnInit {
    @ViewChild('contourContainer') contourContainer: ElementRef;
    contourChartData: any = [];
    contourChartOriginalData: any = [];
    width: number;
    height: number;
    contour_width: number;
    contour_height: number;
    target: any;
    margin = {
        top: 50, right: 50, bottom: 50, left: 50
    };
    constructor() {}

    ngOnInit() {}

    setData(type: string, data: any) {
        this.contourChartOriginalData = data;
        this._initChartInfos();
        this._parseData();
        this._drawContourChart();
    }

    _initChartInfos() {
        this.contourChartData = [];
    }

    _parseData() {
        const pc1Array: Array<any> = this.contourChartOriginalData.PC1;
        const pc2Array: Array<any> = this.contourChartOriginalData.PC2;
        const classArray: Array<any> = this.contourChartOriginalData.CLASS;

        for (let i = 0; i< classArray.length ; i++) {
            const tempObj = {
                PC1: pc1Array[i],
                PC2: pc2Array[i],
                CLASS: classArray[i]
            }
            this.contourChartData.push(tempObj);
        }
    }

    _drawContourChart() {

        this.width = this.contourContainer.nativeElement.offsetWidth;
        this.height = this.contourContainer.nativeElement.offsetHeight;
        this.target = selection.select('#contourBody').attr('width', this.width).attr('height', this.height);
        this.target.selectAll('g').remove();

        this.contour_width = this.width - (this.margin.left + this.margin.right);
        this.contour_height = this.height - (this.margin.top + this.margin.bottom);

        let xScale = scale.scaleLinear()
            .rangeRound([this.margin.left, this.contour_width]);
        let yScale = scale.scaleLinear()
            .rangeRound([this.contour_height, this.margin.top]);

        this.contourChartData.push({
            PC1: 0,
            PC2: 0,
            CLASS: 'temporary'
        });

        const PC1MinMax = extent(this.contourChartData, function(d) { return +d.PC1; });
        const PC2MinMax = extent(this.contourChartData, function(d) { return +d.PC2; });
        this.contourChartData.splice(-1, 1);

        xScale.domain(PC1MinMax).nice();
        yScale.domain(PC2MinMax).nice();

        const _zeroInX = this.target.append('g').attr('class', 'zeroX');
        _zeroInX.append('line');
        _zeroInX.attr('transform', `translate(${xScale(0)}, ${0})`);

        const _zeroInY = this.target.append('g').attr('class', 'zeroY');
        _zeroInY.append('line');
        _zeroInY.attr('transform', `translate(${0}, ${yScale(0)})`);

        this.drawXBaseLine(this.height, _zeroInX);
        this.drawYBaseLine(this.width, _zeroInY);

        this.target.append('g')
            .attr('stroke', 'white')
            .selectAll('circle')
            .data(this.contourChartData)
            .enter().append('circle')
            .attr('cx', function(d) { return xScale(+d.PC1); })
            .attr('cy', function(d) { return yScale(+d.PC2); })
            .attr('r', 2)
            .attr('fill',function(d){
                if(d.CLASS === 'ClassA') {
                    return 'red';
                }else {
                    return 'blue';
                }
            });

        this.makeLegend();
    }

    makeLegend() {
        const rectWidth = 10;
        const rectHeight = 10;
        const padding = 10;
        const items = [];
        const compareWidth = this.width - 50;

        let currentX = 0;
        let currentY = 5;
        let rowCnt = 0;

        const classes = [
            {
                displayName: 'Class A',
                color: 'red'
            },
            {
                displayName: 'Class B',
                color: 'blue'
            }
        ];
        const container = this.target.append('g');
        container.attr('class', 'legend-group')
            .attr('transform', 'translate(0, 0)');

        container.selectAll('*').remove();

        const row = container.append('g')
            .attr('class', 'legend-row')
            .attr('transform', `translate(0,0)`);


        classes.map((d, i) => {
            items[d.displayName] = {
                name: d.displayName,
                color: d.color
            };

            const item = row.append('g')
                .attr('class', 'legend-item')
                .attr('legend-name', d.displayName)
                .attr('transform', `translate(${currentX}, ${currentY})`);

            const rect = item.append('rect')
                .attr('width', rectWidth)
                .attr('height', rectHeight)
                .style('fill', items[d.displayName].color);

            const text = item.append('text')
                .attr('y', '0.8em')
                .attr('x', 12)
                .style('font-size', '12px')
                .text( d.displayName );

            item.append('rect')
                .attr('width', item.node().getBBox().width)
                .attr('height', item.node().getBBox().height)
                .style('fill', '#fff')
                .style('opacity', 0);

            item.attr('transform', `translate( ${currentX}, ${currentY} )` );
            currentX += item.node().getBBox().width + padding;

        });

        const group_width = container.node().getBBox().width;
        const repositionX = (this.width / 2) - (group_width / 2);
        container.attr('transform', `translate(${repositionX},${this.contour_height + this.margin.top + (this.margin.bottom / 2)})`);
    }

    drawXBaseLine(contour_height: number, zeroTarget: any) {
        const median: any = zeroTarget.select('line');
        console.log(median);
        median.attr('x1', 0)
                      .attr('y1', 0)
                      .attr('x2', 0)
                      .attr('y2', contour_height)
                      .attr('stroke-width', 1)
                      .attr('stroke', 'lightgrey');
    }

    drawYBaseLine(contour_width: number, zeroTarget: any) {
        var median = zeroTarget.select('line');
        median.attr('x1', 0)
                      .attr('y1', 0)
                      .attr('x2', contour_width)
                      .attr('y2', 0)
                      .attr('stroke-width', 1)
                      .attr('stroke', 'lightgrey');
    }

    clearChart() {
        if (this.target) {
            this.target.selectAll('g').remove();
        }
    }

}
