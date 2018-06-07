
import { Component,ViewChild,ElementRef,OnInit,EventEmitter,Output, Input, OnChanges,AfterViewInit,ViewEncapsulation } from '@angular/core';
import { Observable }     from 'rxjs/Observable';

@Component({
  moduleId:module.id,
  selector: 'barchart',
  templateUrl: `barchart.component.html`,
  
  styleUrls: [`barchart.component.css`],
  encapsulation:ViewEncapsulation.None
})
export class BarchartComponent implements OnInit, OnChanges,AfterViewInit{

    @Input() data;

    chartId = this.guid();

    constructor(){ }


    ngOnInit(){ 
        
    }

    ngOnChanges() {
        
    }
    ngAfterViewInit(){
      var data = [
        {month: 'Jan', A: 20, B: 5, C: 10},
        {month: 'Feb', A: 30, B: 10, C: 20}
    ];
     
    var xData = ["A", "B", "C"];
     
    let tempWidth = $("#"+this.chartId).width();
    let tempHeight =$("#"+this.chartId).height();
    var margin = {top: 20, right: 50, bottom: 30, left: 50},
            width = tempWidth - margin.left - margin.right,
            height = tempHeight - margin.top - margin.bottom;
     
    var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .35);
     
    var y = d3.scale.linear()
            .rangeRound([height, 0]);
     
    // var color = d3.scale.category20();
    var color = function(i){
      const colors=['blue','yellow','red']
      return colors[i];
    };
     
    var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");
     
    var svg = d3.select("#"+this.chartId).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
     
    var dataIntermediate = xData.map(function (c) {
        return data.map(function (d) {
            return {x: d.month, y: d[c]};
        });
    });
     
    var dataStackLayout = d3.layout.stack()(dataIntermediate);
     
    x.domain(dataStackLayout[0].map(function (d) {
        return d.x;
    }));
     
    y.domain([0,
        d3.max(dataStackLayout[dataStackLayout.length - 1],
                function (d) { return d.y0 + d.y;})
        ])
      .nice();
     
    var layer = svg.selectAll(".stack")
            .data(dataStackLayout)
            .enter().append("g")
            .attr("class", "stack")
            .style("fill", function (d, i) {
                return color(i);
            });
     
    layer.selectAll("rect")
            .data(function (d) {
                return d;
            })
            .enter().append("rect")
            .attr("x", function (d) {
                return x(d.x);
            })
            .attr("y", function (d) {
                return y(d.y + d.y0);
            })
            .attr("height", function (d) {
                return y(d.y0) - y(d.y + d.y0);
            })
            .attr("width", x.rangeBand());
     
    // svg.append("g")
    //         .attr("class", "axis")
    //         .attr("transform", "translate(0," + height + ")")
    //         .call(xAxis);
        
    }

    guid() {
      return 'xxx'.replace(/[xy]/g, (c) => {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return "C" + v.toString(16);
      });
    }
}


