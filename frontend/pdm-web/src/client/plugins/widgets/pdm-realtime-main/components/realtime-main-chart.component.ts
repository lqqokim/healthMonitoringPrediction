import { Component, ViewEncapsulation, OnInit, OnChanges, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { Translater } from '../../../../sdk';
import { UUIDUtil } from '../../../../sdk/utils/uuid.util';
@Component({
    moduleId: module.id,
    selector: 'realtime-main-chart',
    templateUrl: './realtime-main-chart.html',
    styleUrls: ['./realtime-main-chart.css'],
    encapsulation: ViewEncapsulation.None,
   
})
export class RealtimeMainChartComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {

    @Input() timeWindow: any;
    @Input() shiftTime: any;
    @Input() alarmSpec: any;
    @Input() warningSpec:any;
    @Input() datas: any[];

    id = "r" + UUIDUtil.new().replace(/-/g, '');


    svg;

    xScale = d3.time.scale();
    yScale = d3.scale.linear();

    xAxisCall = d3.svg.axis().orient("bottom").scale(this.xScale);
    yAxisCall = d3.svg.axis().orient("left").scale(this.yScale);
    line = d3.svg.line()
        .x((d) => { return this.xScale(d[0]); })
        .y((d) => { return this.yScale(d[1]); })
        .interpolate('linear');

    // datas = [];
    endX = new Date();
    startX = new Date(this.endX.getTime() - this.timeWindow);

    $data;
    $dataGroup;
    $alarm_spec;
    $warning_spec;

    width;
    height;
    margin = { top: 10, left: 50, bottom: 30, right: 10 }

    intervalInstant;

    constructor(
        private translater: Translater,
    ) {

    }

    ngOnInit() {
 
    }

    ngOnChanges(changes: any) {

    }
    ngOnDestroy() {
        this.stopRealTime();
    }
  
    public startRealTime() {
        this.endX = new Date();
        this.startX = new Date(this.endX.getTime() - this.timeWindow);

        this.setScale()
        this.initAxis()

        this.intervalInstant = setInterval(

            () => {
                this.endX = new Date();
                this.startX = new Date(this.endX.getTime() - this.timeWindow);

                this.dataShift();
                this.resize();
                this.setScale()
                this.updateAxis()
                this.updateLine();
            }, this.shiftTime)

            // d3.select(window).on('resize.updatesvg', this.updateWindow);    
    }
    public stopRealTime() {
        clearInterval(this.intervalInstant);
    }
    dataShift() {

        for (let i = 0; i < this.datas[0].length; i++) {
            if (this.datas[0][i][0] > this.startX) {
                this.datas[0].splice(0, i);
                break;
            }
        }
    }
    setScale() {
        let minmax = d3.extent(this.datas[0], (d) => { return d[1] });
        minmax.push(this.alarmSpec);
        minmax.push(this.warningSpec);
        this.xScale.domain([this.startX, this.endX]).rangeRound([0, this.width - (this.margin.left + this.margin.right)])
        this.yScale.domain(d3.extent(minmax)).rangeRound([this.height - (this.margin.top + this.margin.bottom), 0])
        // this.xAxisCall.scale(this.xScale)
        // this.yAxisCall.scale(this.yScale)
    }


    initAxis() {
        this.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(" + [this.margin.left, this.height - this.margin.bottom] + ")")
            // .call(this.xAxisCall)

        this.svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + [this.margin.left, this.margin.top] + ")")
            // .call(this.yAxisCall)

        this.$dataGroup = this.svg.append('g')
            .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
        this.$data = this.$dataGroup.append('path')
            .attr('class','line data')
            // .datum(data)
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-linejoin', 'round')
            .attr('stroke-linecap', 'round')
            .attr('stroke-width', 1.5)


        this.$alarm_spec = this.svg.append('g')
            .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
            .append('path')
            // .datum(data)
            .attr('fill', 'none')
            .attr('stroke', 'red')
            .attr('stroke-linejoin', 'round')
            .attr('stroke-linecap', 'round')
            .attr('stroke-width', 1.5)


        this.$warning_spec= this.svg.append('g')
        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
        .append('path')
        // .datum(data)
        .attr('fill', 'none')
        .attr('stroke', 'yellow')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('stroke-width', 1.5)


    }

    updateAxis() {
        let t = d3.transition()
            .duration(500)

        this.svg.select(".x")
            // .transition(t)
            .attr("transform", "translate(" + [this.margin.left, this.height - this.margin.bottom] + ")")
            .call(this.xAxisCall)

        this.svg.select(".y")
            .transition(t)
            .attr("transform", "translate(" + [this.margin.left, this.margin.top] + ")")
            .call(this.yAxisCall)

    }
    updateLine() {
        let t = d3.transition()
            .duration(500)

        this.$data.datum(this.datas[0])
            // .transition(t)
            .attr('d', this.line);

        let sepecData = [];
        let warningSepecData = [];
        if (this.datas[0].length > 0) {
            sepecData.push([  this.datas[0][0][0],  this.alarmSpec ]);
            sepecData.push([ this.datas[0][this.datas[0].length - 1][0], this.alarmSpec ]);
            warningSepecData.push([  this.datas[0][0][0],  this.warningSpec ]);
            warningSepecData.push([ this.datas[0][this.datas[0].length - 1][0], this.warningSpec ]);
        }



        this.$alarm_spec.datum(sepecData)
            .attr('d', this.line)

        this.$warning_spec.datum(warningSepecData)
            .attr('d', this.line)

        this.$dataGroup.selectAll('.point').remove();
        this.$dataGroup.selectAll('.point')
            .data(this.datas[0])
            .enter()
            .append("svg:circle")
            .attr("class", 'point')
            .attr("r", (d) => { if (d[1] > this.alarmSpec) { return 6 } else { return 2 } })
            .attr("cx", (d) => { return this.xScale(d[0]) })
            .attr("cy", (d) => { return this.yScale(d[1]) })
            .attr('fill', (d) => {
                if (d[1] > this.alarmSpec) { return 'red' } else { return 'blue' }
            })
            // .attr("cx", function(d, i) {return xScale(d.date)} )
            // .attr("cy", function(d,i) {return xScaye(d.value)})
            // .on('mouseover', () => { d3.select(this).attr('r', 8) })
            // .on('mouseout', () => { d3.select(this).attr('r', 4) })
        // .on('click', function(d, i) {console.log( d, i)})





    }
    resize(){
        const chartSelect = '#' + this.id;
        this.width = document.querySelector(chartSelect).parentElement.clientWidth
        this.height = document.querySelector(chartSelect).parentElement.clientHeight

    }
    ngAfterViewInit() {

        const chartSelect = '#' + this.id;
        this.svg = d3.select(chartSelect)
        this.width = document.querySelector(chartSelect).parentElement.clientWidth
        this.height = document.querySelector(chartSelect).parentElement.clientHeight



        this.initAxis();

        this.startRealTime();



        // this.updateData = function (date, value) {
        //     datas.push({ date: date, value: value });
        // }
    }

 
}