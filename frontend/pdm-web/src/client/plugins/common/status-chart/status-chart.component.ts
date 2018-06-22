import { Component, ViewEncapsulation, OnInit, OnChanges, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { Translater } from './../../../sdk';
import { UUIDUtil } from './../../../sdk/utils/uuid.util';
import { connectableObservableDescriptor } from 'rxjs/observable/ConnectableObservable';
@Component({
    moduleId: module.id,
    selector: 'status-chart',
    templateUrl: './status-chart.html',
    styleUrls: ['./status-chart.css'],
    encapsulation: ViewEncapsulation.None
})
export class StatusChartComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {

    // @Input() colors: any;
    // @Input() datas: any[];

    id = "r" + UUIDUtil.new().replace(/-/g, '');

    colors={'run':'green','idle':'yellow','off-line':'gray'}
    datas=[];

    svg;

    xScale = d3.time.scale();

    xAxisCall = d3.svg.axis().orient("bottom").scale(this.xScale);



    randomRange(n1, n2) {
        return Math.floor( (Math.random() * (n2 - n1 + 1)) + n1 );
       }
       



    $dataGroup;
    $container;

    width;
    height;
    margin = { top: 10, left: 10, bottom: 10, right: 10,xAxis:20 }

    startX;
    endX;

    constructor(
        private translater: Translater,
    ) {

    }

    ngOnInit() {

    }

    ngOnChanges(changes: any) {

    }
    ngOnDestroy() {
    }
    public drawChart() {
                this.setScale()
                this.updateAxis()
                this.updateBar();
    }
  
    setScale() {
        this.xScale.domain([this.startX, this.endX]).rangeRound([0, this.width - (this.margin.left + this.margin.right)])
    }


    initAxis() {
        this.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(" + [this.margin.left, this.height - this.margin.bottom-this.margin.xAxis] + ")")

        
        this.$dataGroup = this.svg.append('g')
            .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
        
        this.$container = this.svg.append('g')
							.attr("transform", "translate("+[this.margin.left,this.margin.right]+")")
                            // .selectAll('rect')
							.append('rect')
							// .attr({'x':function(d){return xscale(d.start)},'y':height})
                            .style('fill','none')
                            .style('stroke-width',1)
                            .style('stroke','gray')



    }

    updateAxis() {
        let t = d3.transition()
            .duration(500)

        this.svg.select(".x")
            // .transition(t)
            .call(this.xAxisCall)
        
        this.$container
        .attr('height',this.height-this.margin.bottom*2 -this.margin.top -this.margin.xAxis)
        .attr("x",0)
        .attr("y",0)
        .attr('width', this.width-this.margin.left-this.margin.right)

        

    }
    updateBar() {
        let t = d3.transition()
            .duration(500)

        this.$dataGroup.datum(this.datas)
            // .transition(t)
            .selectAll('rect')
							.data(this.datas)
							.enter()
							.append('rect')
                            .attr('height',this.height-this.margin.bottom*2 -this.margin.top -this.margin.xAxis)
                            .attr("x",(d)=>{return this.xScale(d.start)})
                            .attr("y",0)
							// .attr({'x':function(d){return xscale(d.start)},'y':height})
							.style('fill',(d,i)=>{ return this.colors[ d.status]; })
							.attr('width',(d)=>{ return this.xScale(d.end)-this.xScale(d.start); });

    }
    
    ngAfterViewInit() {

        const chartSelect = '#' + this.id;
        this.svg = d3.select(chartSelect)
        this.width = document.querySelector(chartSelect).parentElement.clientWidth
        this.height = document.querySelector(chartSelect).parentElement.clientHeight


        var startDate = new Date().getTime()-2460*60*1000;
        var last = startDate;

        for(var i=0;i<5;i++){
            var index = this.randomRange(0,2);
            var start = last ;
            var end = start + this.randomRange(1,10)*60*60*1000;
            last = end;
            this.datas.push({status:Object.keys(this.colors)[i%3],start:start,end:end});
        }
 
        this.startX = this.datas[0].start;
        this.endX = this.datas[this.datas.length-1].end;


        this.initAxis();

        this.drawChart();



        // this.updateData = function (date, value) {
        //     datas.push({ date: date, value: value });
        // }
    }


}