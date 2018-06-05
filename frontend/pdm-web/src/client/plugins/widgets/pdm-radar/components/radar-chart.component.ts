import { Component, OnInit, OnChanges, Input,Output, ViewEncapsulation, AfterViewInit, HostListener, 
        EventEmitter} from '@angular/core';

declare var radarchart: any;

@Component({
  moduleId: module.id,
  selector: 'radar-chart',
  templateUrl: './radar-chart.html',
  styleUrls: ['./radar-chart.css'],
  encapsulation: ViewEncapsulation.None
})
export class RadarChartComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() data: any;
  @Input() options: any;
  @Output() paramClick = new EventEmitter<any>();
  chartId = this.guid();

  w = 0;
  h = 0;

  @HostListener('window:resize') onResize() {
    // console.log(this.chartId);

    this.resizeAndDraw();
  }

  constructor() {

  }

  ngOnInit() {
    // this.chartId=this.guid();
    // console.log('data', this.data);
  }
  ngOnChanges(changes) {
    if (this.data != undefined) {
      this.resizeAndDraw();
    }
  }
  ngAfterViewInit() {
    this.resizeAndDraw();
  }
  timeObject = null;
  resizeAndDraw() {
    if (this.timeObject != null) {
      clearTimeout(this.timeObject);
    }
    this.timeObject = setTimeout(() => {
      this.calcSize();
      this.drawChart();
    })
  }
  calcSize() {
    let greatest = "H";
    let greatestValue = 0;

    this.w = $('#' + this.chartId).innerWidth();
    this.h = $('#' + this.chartId).innerHeight();
    
    let w = this.w;
    let h = this.h;

    if (this.w < this.h) {
      greatestValue = this.h;
      greatest = "H";
      this.h = this.w;
    } else {
      greatestValue = this.w;
      greatest = "W";
      this.w = this.h;

    }
    
    if(this.options.zoom==undefined){
      this.options.zoom = 1;
    }


    if (!this.options.ShowLabel) {
      // this.w = this.w -(this.w-this.w*this.options.zoom);
      // this.h = this.h -(this.h-this.h*this.options.zoom)- this.h*0.213;// 50;
      this.options.TranslateX =  this.w*0.2;// 50;
      this.options.TranslateY =  this.h*0.084;// 10;
      if(greatest=="W"){
        this.w = this.w - this.options.TranslateX*2 +this.h*0.2;
        this.h = this.h - this.options.TranslateY*2 ;
      }else{
        this.w = this.w - this.options.TranslateX*2 ;
        this.h = this.h - this.options.TranslateY*2 -this.h*0.2;
      }
      // this.options.ExtraWidthX = $('#' + this.chartId).innerWidth() - this.w  - this.options.TranslateX; // 100;
      this.options.ExtraWidthX = this.options.TranslateX*2;
      this.options.ExtraWidthY =this.options.TranslateY*2;// 25;

      if (greatest == "W") {
        $('#' + this.chartId).css('padding-left', (greatestValue - this.w) / 2 - this.options.TranslateX );
      } else {
        $('#' + this.chartId).css('padding-top', (greatestValue - this.h) / 2 - this.options.TranslateY );
      }
    } else {
      this.w = this.w -(this.w-this.w*this.options.zoom)-50;
      this.h = this.h -(this.h-this.h*this.options.zoom)-50;
      this.options.TranslateX = 80;
      this.options.TranslateY = 22;
      this.options.ExtraWidthX = 160;
      this.options.ExtraWidthY = 50;
      // this.h -= 30;
      // this.w -= 30;

      if (greatest == "W") {
        // this.options.TranslateX = (greatestValue - this.w)/2 ;
        $('#' + this.chartId).css('padding-left', (greatestValue - this.w) / 2 - this.options.TranslateX);
      } else {
        // this.options.TranslateY = (greatestValue - this.h)/2 ;
        $('#' + this.chartId).css('padding-top', (greatestValue - this.h) / 2 - this.options.TranslateY);
      }
    }
  }
  colorscale = d3.scale.category10();
  //Legend titles
  LegendOptions = ['Smartphone', 'Tablet'];
  //Data
  d = [
    [
      { axis: "Email", value: 1 },
      { axis: "Social Networks", value: 1 },
      { axis: "Internet Banking", value: 1 },
    ],
    [
      { axis: "Email", value: 0.8 },
      { axis: "Social Networks", value: 0.8 },
      { axis: "Internet Banking", value: 0.8 },
    ], [
      { axis: "Email", value: 0.59 },
      { axis: "Social Networks", value: 0.56 },
      { axis: "Internet Banking", value: 0.42 },
    ], [
      { axis: "Email", value: 0.48 },
      { axis: "Social Networks", value: 0.41 },
      { axis: "Internet Banking", value: 0.27 },
    ]
  ];

  //Options for the Radar chart, other than default

  drawChart() {
    let mycfg = {
      w: this.w,
      h: this.h,
      maxValue: 0.6,
      levels: 6,
      ExtraWidthX: 0,
      series: [{ fill: false, circle: false }, { fill: false, circle: false }],
      color: (i) => {
        let c = ['indianred', 'yellow', 'green', 'blue', 'olive', 'aqua'];
        return c[i];
      },
      ShowLabel: false

    }

    let options = this.objectUnion(mycfg, this.options);
    // console.log(options);
    let data = this.data;
    if (this.data == null) {
      data = this.objectUnion(this.d, this.data);
    }


    //Call function to draw the Radar chart
    //Will expect that data is in %'s
    //   RadarChart.draw("#"+this.chartId, this.d, mycfg);

    this.RadarChart.draw("#" + this.chartId, data, options);

    ////////////////////////////////////////////
    /////////// Initiate legend ////////////////
    ////////////////////////////////////////////

    var svg = d3.select('#' + this.chartId)
      .selectAll('svg')
      .append('svg')
      .attr("width", this.w)
      .attr("height", this.h)

    //Create the title for the legend
    var text = svg.append("text")
      .attr("class", "title")
      .attr('transform', 'translate(90,0)')
      .attr("x", this.w - 70)
      .attr("y", 10)
      .attr("font-size", "12px")
      .attr("fill", "#404040")
      .text("What % of owners use a specific service in a week");

    //Initiate Legend	
    //   var legend = svg.append("g")
    //       .attr("class", "legend")
    //       .attr("height", 100)
    //       .attr("width", 200)
    //       .attr('transform', 'translate(90,20)') 
    //       ;
    //       //Create colour squares
    //       legend.selectAll('rect')
    //         .data(this.LegendOptions)
    //         .enter()
    //         .append("rect")
    //         // .attr("x", this.w - 65)
    //         .attr("y", (d, i)=>{ return i * 20;})
    //         .attr("width", 10)
    //         .attr("height", 10)
    //         .style("fill", (d, i)=>{ return this.colorscale(i);})
    //         ;
    //       //Create text next to squares
    //       legend.selectAll('text')
    //         .data(this.LegendOptions)
    //         .enter()
    //         .append("text")
    //         // .attr("x", this.w - 52)
    //         .attr("y", (d, i)=>{ return i * 20 + 9;})
    //         .attr("font-size", "11px")
    //         .attr("fill", "#737373")
    //         .text((d)=> { return d; })
    //         ;	

  }
  guid() {
    return 'xxx'.replace(/[xy]/g, (c) => {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return "C" + v.toString(16);
    });
  }
  // Util
  objectUnion(obj1, obj2) {
    let tempParent = [];
    let newObj = this.objectUnionSub(obj1, obj2);
    newObj = this.assignFunctions(newObj, obj2);
    return newObj;

  }
  objectUnionSub(obj1, obj2) {

    let newObj = obj1;
    if (obj2 == undefined) {
      return newObj;
    }
    let keys = Object.keys(obj2);
    for (let i = 0; i < keys.length; i++) {
      if (obj1[keys[i]] == undefined) {
        if (typeof obj2[keys[i]] !== 'function') {
          newObj[keys[i]] = JSON.parse(JSON.stringify(obj2[keys[i]]));
          //   newObj[keys[i]] = obj2[keys[i]];
        } else {
          newObj[keys[i]] = obj2[keys[i]];
        }

      } else {
        if (typeof obj2[keys[i]] === 'object') {
          newObj[keys[i]] = this.objectUnionSub(obj1[keys[i]], obj2[keys[i]]);
        } else {
          newObj[keys[i]] = obj2[keys[i]];
        }

      }
    }
    return newObj;
  }
  assignFunctions(targetObj, obj) {
    if (obj == undefined) {
      return targetObj;
    }
    let keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      if (typeof obj[keys[i]] == 'function') {
        //parents.push({key:keys[i],value:obj[keys[i]]});
        targetObj[keys[i]] = obj[keys[i]];
      } else if (typeof obj[keys[i]] == 'object') {
        this.assignFunctions(targetObj[keys[i]], obj[keys[i]]);
      }
    }
    return targetObj;
  }




  RadarChart = {
    draw: (id, d, options)=> {
      var cfg: any = {
        radius: 6,
        w: 0,
        h: 0,
        factor: 1,
        factorLegend: .85,
        levels: 3,
        maxValue: 0,
        radians: 2 * Math.PI,
        opacityArea: 0.5,
        ToRight: 5,
        TranslateX: 0,
        TranslateY: 0,
        ExtraWidthX: 0,
        ExtraWidthY: 0,
        color: d3.scale.category10(),
        ShowLabel: true
      };

      if ('undefined' !== typeof options) {
        for (var i in options) {
          if ('undefined' !== typeof options[i]) {
            cfg[i] = options[i];
          }
        }
      }
      if(cfg.SelectLabel==undefined){
        //temp
        cfg.SelectLabel ="";
      }
      cfg.maxValue = Math.max(cfg.maxValue, d3.max(d, function (i) { return d3.max(i.map(function (o) { return o.value; })) }));
      var allAxis = (d[0].map(function (i, j) { return i.axis }));
      var total = allAxis.length;
      var radius = cfg.factor * Math.min(cfg.w / 2, cfg.h / 2);
      var Format = d3.format('%');
      d3.select(id).select("svg").remove();

      var g = d3.select(id)
        .append("svg")
        .attr("width", cfg.w + cfg.ExtraWidthX)
        .attr("height", cfg.h + cfg.ExtraWidthY)
        .append("g")
        .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");
      ;

      var tooltip;

      //Circular segments
      for (var j = 0; j < cfg.levels - 1; j++) {
        var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
        g.selectAll(".levels")
          .data(allAxis)
          .enter()
          .append("svg:line")
          .attr("x1", function (d, i) { return levelFactor * (1 - cfg.factor * Math.sin(i * cfg.radians / total)); })
          .attr("y1", function (d, i) { return levelFactor * (1 - cfg.factor * Math.cos(i * cfg.radians / total)); })
          .attr("x2", function (d, i) { return levelFactor * (1 - cfg.factor * Math.sin((i + 1) * cfg.radians / total)); })
          .attr("y2", function (d, i) { return levelFactor * (1 - cfg.factor * Math.cos((i + 1) * cfg.radians / total)); })
          .attr("class", "line")
          .style("stroke", "grey")
          .style("stroke-opacity", "0.75")
          .style("stroke-width", "0.3px")
          .attr("transform", "translate(" + (cfg.w / 2 - levelFactor) + ", " + (cfg.h / 2 - levelFactor) + ")");
      }

      //Text indicating at what % each level is
      for (var j = 0; j < cfg.levels; j++) {
        var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
        g.selectAll(".levels")
          .data([1]) //dummy data
          .enter()
          .append("svg:text")
          .attr("x", function (d) { return levelFactor * (1 - cfg.factor * Math.sin(0)); })
          .attr("y", function (d) { return levelFactor * (1 - cfg.factor * Math.cos(0)); })
          .attr("class", "legend")
          .style("font-family", "sans-serif")
          .style("font-size", "10px")
          .attr("transform", "translate(" + (cfg.w / 2 - levelFactor + cfg.ToRight) + ", " + (cfg.h / 2 - levelFactor) + ")")
          .attr("fill", "#737373")
          .text(Format((j + 1) * cfg.maxValue / cfg.levels));
      }

      let series = 0;

      var axis = g.selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "axis");

      axis.append("line")
        .attr("x1", cfg.w / 2)
        .attr("y1", cfg.h / 2)
        .attr("x2", function (d, i) { return cfg.w / 2 * (1 - cfg.factor * Math.sin(i * cfg.radians / total)); })
        .attr("y2", function (d, i) { return cfg.h / 2 * (1 - cfg.factor * Math.cos(i * cfg.radians / total)); })
        .attr("class", "line")
        .style("stroke", "grey")
        .style("stroke-width", "1px");

      if (cfg.ShowLabel) {
        axis.append("text")
          .attr("class", "legend")
          .text(function (d) { return d })
          .style("font-family", "sans-serif")
          .style("font-size", "11px")
          .attr("fill",function(d,i){
            if(cfg.SelectLabel==d){
              return  "red";
            }
            return "";
          })
          .attr("text-anchor", "middle")
          .attr("dy", "1.5em")
          .attr("transform", function (d, i) { return "translate(0, -10)" })
          .attr("x", function (d, i) { return cfg.w / 2 * (1 - cfg.factorLegend * Math.sin(i * cfg.radians / total)) - 50 * Math.sin(i * cfg.radians / total); })
          .attr("y", function (d, i) { return cfg.h / 2 * (1 - Math.cos(i * cfg.radians / total)) - 20 * Math.cos(i * cfg.radians / total); });
      }else if(cfg.SelectLabel.length>0){
        axis.append("text")
          .attr("class", "legend")
          .text(function (d) { 
            if(cfg.SelectLabel==d){
              return  d
            }else {
              return "" ;
            }
          })
          .attr("fill",function(d,i){
            if(cfg.SelectLabel==d){
              return  "red";
            }
            return "";
          })
          .style("font-family", "sans-serif")
          .style("font-size", "11px")
          .attr("text-anchor", "middle")
          .attr("dy", "1.5em")
          .attr("transform", function (d, i) { return "translate(0, -10)" })
          .attr("x", function (d, i) { return cfg.w / 2 * (1 - cfg.factorLegend * Math.sin(i * cfg.radians / total)) - 10 * Math.sin(i * cfg.radians / total); })
          .attr("y", function (d, i) { return cfg.h / 2 * (1 - Math.cos(i * cfg.radians / total)) - 5 * Math.cos(i * cfg.radians / total); });
          
      }

      let dataValues = []
      d.forEach( (y, x)=> {
        dataValues = [];
        g.selectAll(".nodes")
          .data(y, function (j, i) {
            dataValues.push([
              cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0).toString()) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
              cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0).toString()) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
            ]);
          });
        dataValues.push(dataValues[0]);
        g.selectAll(".area")
          .data([dataValues])
          .enter()
          .append("polygon")
          .attr("class", "radar-chart-serie" + series)
          .style("stroke-width", "2px")
          .style("stroke", cfg.color(series))
          .attr("points", function (d) {
            var str = "";
            for (var pti = 0; pti < d.length; pti++) {
              str = str + d[pti][0] + "," + d[pti][1] + " ";
            }
            return str;
          })
          .style("fill", function (j, i) { return cfg.color(series) })
          //  .style("fill-opacity", cfg.opacityArea)
          .style("fill-opacity", function (d) {
            if (cfg.series[series] != undefined && cfg.series[series]["fill"] != undefined && cfg.series[series]["fill"] == false) {
              return 0;
            }
            return cfg.opacityArea;
          })
          .on('mouseover', function (d) {
            let z = "polygon." + d3.select(this).attr("class");
            var seriezIndex = z.replace('polygon.radar-chart-serie', '');
            if (cfg.series[seriezIndex] != undefined && cfg.series[seriezIndex]["fill"] != undefined && cfg.series[seriezIndex]["fill"] == false) {
              return;
            }
            g.selectAll("polygon")
              .transition(200)
              .style("fill-opacity", function () {
                var seriezIndex = d3.select(this).attr('class').replace('radar-chart-serie', '');
                if (cfg.series[seriezIndex] != undefined && cfg.series[seriezIndex]["fill"] != undefined && cfg.series[seriezIndex]["fill"] == false) {
                  return 0;
                }

                return 0.1;
              });
            g.selectAll(z)
              .transition(200)
              .style("fill-opacity", function () {
                return .7;
              });
          })
          .on('mouseout', function () {
            g.selectAll("polygon")
              .transition(200)
              .style("fill-opacity", function () {
                var seriezIndex = d3.select(this).attr('class').replace('radar-chart-serie', '');
                if (cfg.series[seriezIndex] != undefined && cfg.series[seriezIndex]["fill"] != undefined && cfg.series[seriezIndex]["fill"] == false) {
                  return 0;
                }
                return cfg.opacityArea;
              });
          });
        series++;
      });
      series = 0;


      d.forEach( (y, x)=> {
        g.selectAll(".nodes")
          .data(y).enter()
          .append("svg:circle")
          .attr("class", "radar-chart-serie" + series)
          .attr('r', cfg.radius)
          .attr("alt", function (j) { return Math.max(j.value, 0) })
          .attr("cx", function (j, i) {
            dataValues.push([
              cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0).toString()) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
              cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0).toString()) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
            ]);
            return cfg.w / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total));
          })
          .attr("cy", function (j, i) {
            return cfg.h / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total));
          })
          .attr("data-id", function (j) { return j.axis })
          .style("fill", cfg.color(series)).style("fill-opacity", function (d) {
            var seriezIndex = d3.select(this).attr('class').replace('radar-chart-serie', '');
            if (cfg.series[seriezIndex] != undefined && cfg.series[seriezIndex]["circle"] != undefined && cfg.series[seriezIndex]["circle"] == false) {
              return 0;
            }
            return .9
          }

          )
          .on('mouseover', function (d) {
            d3.select(this).style("cursor","pointer");

            let newX = parseFloat(d3.select(this).attr('cx')) - 10;
            let newY = parseFloat(d3.select(this).attr('cy')) - 5;

            tooltip
              .attr('x', newX)
              .attr('y', newY)
              .text(Format(d.value))
              .transition(200)
              .style('opacity', 1)
              .style('display',"block");

            let z = "polygon." + d3.select(this).attr("class");
            // g.selectAll("polygon")
            //     .transition(200)
            //     .style("fill-opacity", 0.1); 
            // g.selectAll(z)
            //     .transition(200)
            //     .style("fill-opacity", .7);
          })
          .on('mouseout', function () {
            d3.select(this).style("cursor","default");

            tooltip
              .transition(200)
              .style('opacity', 0)
              .style('display',"none");
            g.selectAll("polygon")
              .transition(200)
            // .style("fill-opacity", cfg.opacityArea);
          })
          .on('click',(d)=>{
            // d3.select(this).attr("fill","yellow");
            this.click(d);
          })
          .append("svg:title")
          .text(function (j) { 
            return j.axis+":"+ Math.max(j.value, 0).toFixed(2) 
          }
          );

        series++;
      });
      //Tooltip
      tooltip = g.append('text')
        .style('opacity', 0)
        .style('font-family', 'sans-serif')
        .style('font-size', '13px');
    }
  };

  click(obj){
    this.paramClick.emit(obj);
  }
}