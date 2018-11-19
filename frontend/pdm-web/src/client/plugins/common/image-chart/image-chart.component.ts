import {
    Component,
    ViewEncapsulation,
    OnInit,
    AfterViewInit,
    Input,
    OnChanges,
    SimpleChanges,
    Output,
    EventEmitter,
    ViewChild,
    ElementRef
} from '@angular/core';

declare var d3;
declare var $;

@Component({
    moduleId: module.id,
    selector: 'image-chart',
    styleUrls: ['image-chart.component.css'],
    templateUrl: 'image-chart.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ImageChartComponent
    implements  AfterViewInit, OnChanges, OnInit {
    // @Input() data;
    @Input()
    chartInfo;
    // @Input()
    // image;
    @Output()
    zoomEvent: EventEmitter<any> = new EventEmitter<any>();
    @Output()
    seriesEvent: EventEmitter<any> = new EventEmitter<any>();
   
// chartInfo =
// {
//     "height": 428,
//     "width": 1615,
//     "id": "chart-2250c0965ef4433588fe74b682e61e59",
//     "image": "",
//   //   "noFileCount": null,
//     "seriesInfos": [ //우측 series Setting
//         {
//             "checked": true,
//             "color": "#1f77b4",
//             "name": "LOT180731-082159.542::Pump"
//         },
//         {
//             "checked": false,
//             "color": "#ff7f0e",
//             "name": "LOT180731-082159.542::Run"
//         },
//         {
//             "checked": true,
//             "color": "#2ca02c",
//             "name": "LOT180731-082159.542::Loaded"
//         },
//         {
//             "checked": true,
//             "color": "#d62728",
//             "name": "LOT180731-082159.542::Vent"
//         }
//     ],
//     "sessionId": "session-0dab9222bacf4fc8a6734fa6ac3b1924", // SessionId 각각 만들어 부여(서버)
//     "showProgress": false,    //프로그레스 true/false
  //   "status": "Process",      // "Process" / Done:끝 
  //   "totalCount": 23616,      
  //   "xLabels": [          //
  //       {
  //           "count": 103,
  //           "label": "Pump"
  //       },
  //       {
  //           "count": 689,
  //           "label": "Run"
  //       },
  //       {
  //           "count": 115,
  //           "label": "Vent"
  //       },
  //       {
  //           "count": 22709,
  //           "label": "Loaded"
  //       }
  //   ],
//     "xMax": 23615,
//     "xMin": 0,
//     "x_axis_type": "DateTime",  //LabelCount / DateTime
//     "yLabel": "Title",// Title
//     "yMax": 104.57874015748031,
//     "yMin": 49.63385826771655
// }
    // margin = {left: 50, right: 50, top: 10, bottom: 30};
    margin = {left: 50, right: 0, top: 10, bottom: 30};
    //   datas;
    id = this.uuidv4();
    lengenId;
    checkDatas;
    xScale;
    yScale;
    color;
    xAxisCall;
    yAxisCall;
    line;
    svg = null;
    brushGroup = null;
    brush = null;
    legend = null;
    chart;
    width;
    height;

    canvas;
    context;
    count = 0;
    ratio;

    xMinMax;
    yMinMax;
    condition = {};

    percentage = 0;
    intervalObj = null;

    legendSeries = false;
    // constructor() {
    // }

    ngOnInit() {
        
    }
    
    ngAfterViewInit() {
        console.warn('chartInfoAfter');
        console.warn(this.chartInfo);
        try {
            this.width = document.querySelector('#' + this.id).clientWidth;
            this.height = document.querySelector('#' + this.id).clientHeight;

            this.LineChart(this.id, this.id + '_legend');
            setTimeout(() => {
                this.drawChart();
            }, 1000);

        } catch (err) {
            console.log(err);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        console.warn('chartOnCha');
        console.warn(this.chartInfo);
        // if (changes['condition'] !== null) {
        // }
        if(this.chartInfo['showProgress'] == null){
            this.chartInfo['showProgress'] = false;
        }
        this.progress(this.chartInfo.showProgress);
        if(changes['chartInfo'] != null ){
            // this.updateWindow();
            let myNode = document.getElementById(this.id);
            if(myNode==null) return;
            myNode.innerHTML = '';
            
            this.LineChart(this.id, this.id + '_legend');
            setTimeout(() => {
                this.drawChart();
            }, 1000);
        }
        // console.log(changes);
    }

    progress(show) {
        if (this.intervalObj !== null) {
            clearInterval(this.intervalObj);
        }

        if (show) {
            this.intervalObj = setInterval(() => {
                this.percentage += 10;
                if (this.percentage > 100) {
                    this.percentage = 5;
                }
            }, 1000);
        }
    }

    uuidv4() {
        return (
            'a' +
            'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                const r = (Math.random() * 16) | 0,
                    v = c === 'x' ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            })
        );
    }

    reSizeChart() {
        try {
            const chartSelect = '#' + this.id;
            this.width = document.querySelector(chartSelect).clientWidth;
            this.height = document.querySelector(chartSelect).clientHeight;
            // this.ratio =  this.height / this.width;
            this.setScale();

            // this.svg
            //     .attr('width', this.width)
            //     .attr('height', this.height);
            $(chartSelect)
                .find('svg')
                .attr('width', this.width)
                .attr('height', this.height);
        } catch (err) {
            console.log(err);
        }
    }

    LineChart(id, legendId) {
        // this.datas = [];
        this.id = id;
        this.lengenId = legendId;

        this.checkDatas = {};
        if (
            this.chartInfo == null ||
            this.chartInfo['image'] == null ||
            this.chartInfo['image'].length === 0
        )
            return;

        const startSteps = [];

        if (this.chartInfo['x_axis_type'] === 'DateTime') {
            this.xScale = d3.time.scale();
            this.xAxisCall =d3.svg.axis().orient('bottom').scale(this.xScale); // d3.axisBottom(this.xScale);
            // .tickFormat(multiFormat)
            this.condition['xMin'] = this.chartInfo['xMin'];
            this.condition['xMax'] = this.chartInfo['xMax'];

            d3.selectAll('.x.axis>.tick')
                .append('title')
                .text(function (d) {
                    return d;
                });
        } else if (this.chartInfo['x_axis_type'] === 'Index') {
            this.xScale = d3.scale.linear();
            this.xAxisCall = d3.svg.axis().orient('bottom').scale(this.xScale); // d3.axisBottom(this.xScale);
            this.condition['xMin'] = this.chartInfo['xMin'];
            this.condition['xMax'] = this.chartInfo['xMax'];
        } else if (this.chartInfo['x_axis_type'] === 'LabelCount') {
            this.xScale = d3.scale.linear();
            const xLabels = this.chartInfo['xLabels'];
            const keyValueLabels = {};
            let index = 0;
            const indexes = [];
            for (let i = 0; i < xLabels.length; i++) {
                startSteps.push(index);
                for (let j = 0; j < xLabels[i].count; j++) {
                    indexes.push(index);
                    keyValueLabels[index] = {index: index++, label: xLabels[i].label};
                }
            }

            this.condition['indexes'] = indexes;
            this.condition['keyValueLabels'] = keyValueLabels;
            this.condition['xMin'] = 0;
            this.condition['xMax'] = index - 1;
            this.condition['startSteps'] = startSteps;

            // this.xAxisCall = d3.axisBottom(d3.scalePoint().domain(this.condition['keyValueLabels'].map((d)=>{
            //     return d.label;
            this.xAxisCall =d3.svg.axis().orient('bottom').scale(this.xScale);// d3.axisBottom(this.xScale);

            this.xScale
                .domain([indexes[0], indexes[indexes.length - 1]])
                .rangeRound([0, this.width - (this.margin.left + this.margin.right)]);
        }
        this.condition['yMin'] = this.chartInfo['yMin'];
        this.condition['yMax'] = this.chartInfo['yMax'];
        this.condition['image'] = this.chartInfo['image'];
        this.condition['yLabel'] = this.chartInfo['yLabel'];
        this.condition['seriesInfos'] = this.chartInfo['seriesInfos'];
        this.condition['x_axis_type'] = this.chartInfo['x_axis_type'];

        // this.xScale = d3.scale.linear();
        this.yScale = d3.scale.linear();

        this.color = d3.scale.ordinal(d3.schemeCategory10);

        // this.xAxisCall = d3.axisBottom(this.xScale);
        this.yAxisCall = d3.svg.axis().orient('left').scale(this.yScale); //d3.axisLeft(this.yScale);
        this.line = d3
            .svg
            .line()
            .x(d => {
                return this.xScale(d[0]);
            })
            .y(d => this.yScale(d[1]));

        this.svg = null;
        this.brushGroup = null;
        this.brush = null;
        this.legend = null;

        // this.datas = [[[new Date().getTime(), Math.random()]]];
        this.initAxis();

        for (let i = 0; i < startSteps.length; i++) {
            this.svg
                .append('line')
                .attr('x1', this.xScale(startSteps[i]))
                .attr('y1', this.height - this.margin.bottom)
                .attr('x2', this.xScale(startSteps[i]))
                .attr('y2', 0)
                .attr('class', 'vertical-line')
                .attr(
                    'transform',
                    'translate(' + [this.margin.left, this.margin.top] + ')'
                );

            this.svg
                .append('text')
                .attr(
                    'transform',
                    'translate(' + [this.margin.left, this.margin.top] + ')'
                )
                .attr('x', this.xScale(startSteps[i]))
                .attr('y', this.height - this.margin.bottom + 10)
                .attr('class', 'vertical-text')
                .text(this.condition['keyValueLabels'][startSteps[i]].label)
                .style('text-anchor', 'middle')
                .style('font-size', 11);
        }

        // d3.select(window).on('resize.updatesvg',()=>{this.updateWindow()} );
        $(window).resize(() => {
            this.updateWindow();
        });
    }

    initAxis() {
        const chartSelect = '#' + this.id;

        document.getElementById(this.id).addEventListener('dblclick', () => {
            this.restoreZoom();
        });

        this.width = document.querySelector(chartSelect).clientWidth;
        this.height = document.querySelector(chartSelect).clientHeight;

        // this.ratio =  this.height / this.width;

        this.setScale();

        this.canvas = d3.select(chartSelect).append('canvas');
        this.canvas.attr(
            'width',
            this.width - this.margin.left - this.margin.right
        );
        this.canvas.attr(
            'height',
            this.height - this.margin.top - this.margin.bottom
        );
        this.canvas.style('margin-left', this.margin.left + 'px');
        this.canvas.style('margin-top', this.margin.top + 'px');
        this.canvas.attr('class', 'canvas-plot');
        this.context = this.canvas.node().getContext('2d');

        this.svg = d3
            .select(chartSelect)
            .append('svg')
            .attr('class', 'svg-plot');

        this.svg
            // .attr('width', this.width - this.margin.right)
            .attr('width', this.width )
            .attr('height', this.height);

        // this.brush = d3.brushX().on('end', () => {
        //     this.brushended();
        // });
        this.brush = d3.svg.brush().x(this.xScale)
            .on('brushend',()=>{
                this.brushended();
            });
        // base x,y to d3.brush().on~~~

        const axisElements = this.svg
            .append('g')
            .append('g')
            .attr('class', 'x axis')
            .attr(
                'transform',
                'translate(' +
                [this.margin.left, this.height - this.margin.bottom] +
                ')'
            )
            .call(this.xAxisCall);

        if (this.condition['x_axis_type'] === 'LabelCount') {
            axisElements.selectAll('text').remove();
        }

        this.svg
            .append('g')
            .append('g')
            .attr('class', 'y axis')
            .attr(
                'transform',
                'translate(' + [this.margin.left, this.margin.top] + ')'
            )
            .call(this.yAxisCall);

        this.svg
            .append('g')
            .attr('class', 'brush')
            .attr(
                'transform',
                'translate(' + this.margin.left + ',' + this.margin.top + ')'
            )
            // .attr('height', this.height-this.margin.top-this.margin.bottom)
            // .attr('width', this.width-this.margin.left-this.margin.right)
            .call(this.brush)
            .selectAll('rect')
            .attr('height',this.height);

        this.svg
            .select('.overlay')
            .attr('height', this.height - this.margin.top - this.margin.bottom)
            .attr('width', this.width - this.margin.left - this.margin.right);
    }

    brushended() {
        if(this.brush.empty()){
            return;
        }
        const s = this.brush.empty() ?this.xScale.domain(): this.brush.extent();//  d3.event.selection;
        if (s) {
            if(s[0]==0) return;
            // let xData: any[] = [s[0], s[1]].map(this.xScale.invert, this.xScale);
            let xData = [s[0],s[1]];

            if (this.condition['x_axis_type'] === 'LabelCount') {
                const xStart = Math.floor(xData[0]);
                const xEnd = Math.ceil(xData[1]);

                const xLabels = this.chartInfo['xLabels'];
                const keyValueLabels = {};
                let index = 0;
                // for (let i = 0; i < xLabels.length; i++){
                //     for (let j = 0; j < xLabels[i].count; j++){
                //         keyValueLabels[index] = {index: index++, labelIndex: i};
                //     }
                // }
                // xData = [keyValueLabels[xStart].labelIndex, keyValueLabels[xEnd].labelIndex];
                for (let i = 0; i < xLabels.length; i++) {
                    for (let j = 0; j < xLabels[i].count; j++) {
                        keyValueLabels[index] = {index: index++, labelIndex: i, label: xLabels[i].label};
                    }
                }
                xData = [];
                for (let i = xStart; i < xEnd; i++) {
                    let stepName = keyValueLabels[i].label;
                    if (xData.indexOf(stepName) < 0) {
                        xData.push(stepName);
                    }
                }

            } else if (this.condition['x_axis_type'] === 'DateTime') {
                xData = [new Date(xData[0]).getTime(), new Date(xData[1]).getTime()];
            }
            // this.svg.select('.brush').call(this.brush.move, null);
            const zoomInfo = {
                type: 'Zoom',
                datas: xData,
                id: this.chartInfo['id'],
                sessionId: this.chartInfo['sessionId'],
                yLabel: this.chartInfo['yLabel'],
                series: this.chartInfo.seriesInfoList
            };
            console.log(zoomInfo);
            this.zoomEvent.emit(zoomInfo);
        }
    }

    dblclick(event) {
        console.log(event);
       
        for (let i = 0; i < this.chartInfo.seriesInfoList.length; i++) {
            this.chartInfo.seriesInfoList[i].checked = true;
        }
        this.zoomEvent.emit({
            type: 'Origin',
            datas: '',
            id: this.chartInfo['id'],
            sessionId: this.chartInfo['sessionId'],
            series: this.chartInfo.seriesInfoList,
            yLabel: this.chartInfo['yLabel']
        });
    }

    restoreZoom() {
        this.reSizeChart();
        this.updateAxis();
        this.updateLine();
    }

    setScale() {
        if (this.chartInfo['image'] == null  ) return;
        this.xMinMax = [this.condition['xMin'], this.condition['xMax']];
        this.yMinMax = [this.condition['yMin'], this.condition['yMax']];


        this.xScale
            .domain(this.xMinMax)
            .rangeRound([0, this.width - (this.margin.left + this.margin.right)]);
        this.yScale
            .domain(this.yMinMax)
            .rangeRound([this.height - (this.margin.top + this.margin.bottom), 0]);
    }

    setData() {
        // this.datas = datas;
        this.setScale();
        // this.color.domain([0, this.datas.length]);
        this.updateAxis();
        this.updateLine();
    }

    updateAxis() {
        if (this.chartInfo['image'] == null) return;

        // const t = d3.transition()
        //     .duration(500);

        this.svg
            .select('.x')
            .attr(
                'transform',
                'translate(' +
                [this.margin.left, this.height - this.margin.bottom] +
                ')'
            )
            .call(this.xAxisCall);

        this.svg
            .select('.y')
            // .transition(t)
            .attr(
                'transform',
                'translate(' + [this.margin.left, this.margin.top] + ')'
            )
            .call(this.yAxisCall);

        this.canvas.attr(
            'width',
            this.width - this.margin.left - this.margin.right
        );
        this.canvas.attr(
            'height',
            this.height - this.margin.top - this.margin.bottom
        );

        this.svg
            .attr('width', this.width )
            .attr('height', this.height);

        if (this.condition['x_axis_type'] === 'LabelCount') {
            this.svg
                .selectAll('.x')
                .selectAll('text')
                .remove();
        }

        if (this.condition['x_axis_type'] === 'LabelCount') {
            const startSteps = this.condition['startSteps'];
            this.svg.selectAll('.vertical-line').remove();
            this.svg.selectAll('.vertical-text').remove();
            for (let i = 0; i < startSteps.length; i++) {
                this.svg
                    .append('line')
                    .attr('x1', this.xScale(startSteps[i]))
                    .attr('y1', this.height - this.margin.bottom)
                    .attr('x2', this.xScale(startSteps[i]))
                    .attr('y2', 0)
                    .attr('class', 'vertical-line')
                    .attr(
                        'transform',
                        'translate(' + [this.margin.left, this.margin.top] + ')'
                    );

                this.svg
                    .append('text')
                    .attr(
                        'transform',
                        'translate(' + [this.margin.left, this.margin.top] + ')'
                    )
                    .attr('x', this.xScale(startSteps[i]))
                    .attr('y', this.height - this.margin.bottom + 10)
                    .attr('class', 'vertical-text')
                    .text(this.condition['keyValueLabels'][startSteps[i]].label)
                    .style('text-anchor', 'middle')
                    .style('font-size', 11);
            }
        }

        this.svg
            .select('.overlay')
            .attr('height', this.height - this.margin.top - this.margin.bottom)
            .attr('width', this.width - this.margin.left - this.margin.right);
    }

    updateLine() {
        if (this.chartInfo['image'] == null) return;

        // const t = d3.transition()
        //     .duration(500);

        this.count = 0;
        this.checkDatas = {};

        const ctx = this.context;
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(
                img,
                0,
                0,
                this.canvas.attr('width'),
                this.canvas.attr('height')
            ); // Or at whatever offset you like
        };
        // img.src = 'data:image/png;base64,' + this.image;
        img.src = this.chartInfo['image'];
    }

    getColor(r, g, b, alpha) {
        return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
    }

    drawChart() {
        this.setData();
    }

    updateWindow() {
        this.reSizeChart();
        this.updateAxis();
        this.updateLine();
    }

    getChartSize() {
        return {
            height: this.height - this.margin.top - this.margin.bottom,
            width: this.width - this.margin.left - this.margin.right
        };
    }

    changeCheck(item) {
        item.checked = !item.checked;
        let allFalse = true;
        this.chartInfo.seriesInfoList.map(d => {
            if (d.checked) {
                allFalse = true;
            }
        });
        for (let i = 0; i < this.chartInfo.seriesInfoList.length; i++) {
            if (this.chartInfo.seriesInfoList[i].checked) {
                allFalse = false;
                break;
            }
        }
        if (allFalse) {
            this.chartInfo.seriesInfoList.map(d => {
                d.checked = true;
            });
        }

        this.seriesEvent.emit({
            series: this.chartInfo.seriesInfoList,
            id: this.chartInfo['id'],
            sessionId: this.chartInfo['sessionId'],
            yLabel: this.chartInfo['yLabel']
        });
    }
}
