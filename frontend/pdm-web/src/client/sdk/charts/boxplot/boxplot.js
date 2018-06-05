(function(window, d3, chartAxis) {
    'use strict';

    var Boxplot = {
        // TODO define your chart version
        version: '0.0.1',
        chart: {
            fn: Chart.prototype,
            internal: {
                fn: ChartInternal.prototype
            }
        }
    };

    var chart_fn = Boxplot.chart.fn,
        chart_internal_fn = Boxplot.chart.internal.fn;

    Boxplot.generate = function(config) {
        return new Chart(config);
    }

    function Chart(config) {
        var $$ = this.internal = new ChartInternal(this);
        $$.loadConfig(config);
        $$.init();

        // bind 'this' to nested API
        (function bindThis(fn, target, argThis) {
            Object.keys(fn).forEach(function(key) {
                target[key] = fn[key].bind(argThis);
                if (Object.keys(fn[key]).length > 0) {
                    bindThis(fn[key], target[key], argThis);
                }
            });
        })(chart_fn, this, this);
    }

    function ChartInternal(api) {
        var $$ = this;
        $$.api = api;
        $$.config = $$.getDefaultConfig();
        $$.chart_internal_val = {
            svg: null,                                         //svg영역
            selector: 'elements-group',                        //node group들이 그려질 영역
            box_chart: null,
            contextHeight: 0,
            margin: {top: 10, right: 10, bottom: 40, left: 30},//여백설정
            baseMarginLeft: 30,         //데이터가 로딩될 때마다, y축의 너비 측정을 위한 기본 값 설정.
            paddingBottom: 0,
            width: 0,                                   //여백과 axis를 제외한 series가 그려질 width
            height: 0,                                  //여백과 axis를 제외한 series가 그려질 height
            xScale: null,                                      //xscale 객체
            xAxis: null,                                       //x축 값 설정
            yScale: null,                                      //yscale 객체
            yAxis: null,                                       //y축 값 설정
            horizontalGridAxis: null,                          //가로 라인 설정
            rowMax: 0,                                         //데이터의 max
            rowMin: 0,                                         //데이터의 min
            data: null,                                        //parse 된 box data
            resizeCallback: null,                              //axis 반영시 word rap 기능을 활성화.
            isCreation: false,                                 //차트 생성 여부
            isContextCreation: false,                          //context 차트 생성 여부
            isResize: false,                                    //사이즈 변경 여부.
            isDataChange: false,                                //데이터 변경 여부
            firstFixYAxis : false                               ////y축 너비 측정을 위한 변수 변경 by jwhong 2016-08-24
        };
    }

    chart_internal_fn.loadConfig = function(config) {
        var this_config = this.config, target, keys, read;
        function find() {
            var key = keys.shift();
            // console.log('key =>', key, ', target =>', target);
            if (key && target && typeof target === 'object' && key in target) {
                target = target[key];
                return find();
            }
            else if (!key) {
                return target;
            }
            else {
                return undefined;
            }
        }
        Object.keys(this_config).forEach(function(key) {
            target = config;
            keys = key.split('_');
            read = find();
            // console.log('CONFIG : ', key, read);
            if (isDefined(read)) {
                this_config[key] = read;
            }
        });
    }

    ///////////////////////////////////////////////////////////////////////////
    //
    // START: Define Area
    //
    ///////////////////////////////////////////////////////////////////////////
    // export API
    chart_fn.resize = function( size ) {
        console.log('size : ', size);
        var $$ = this.internal;
        var that = $$.chart_internal_val;

        if( !that.isCreation ) return;

        that.isResize = true;

        // TODO your coding area
        // .... resize and draw
        _drawchart($$);

        that.isResize = false;
    };

    chart_fn.data = function() {
        var $$ = this.internal, config = $$.config;
        return config.data;
    }

    chart_fn.load = function(data) {
        var $$ = this.internal, config = $$.config, that = $$.chart_internal_val;
        // TODO
        // .... load data and draw. It is option
        if( !Array.isArray(data) ){
            config.data = [data];
        }else{
            config.data = data;
        }

        if( config.data == null || config.data.length == 0 ) {
            return;
        }

        that.isDataChange = true;
        that.firstFixYAxis = false;             //y축 너비 측정을 위한 변수 변경 by jwhong 2016-08-24
        _drawchart($$);
        that.isDataChange = false;
    }

    chart_fn.clear = function() {//only view clear
        var $$ = this.internal, config = $$.config, that = $$.chart_internal_val;
        if( that.svg ) {
            that.svg.remove();
            that.svg = null;
        }
        if( that.zoom ) {
            that.zoom = null;
        }
        that.isCreation = false;
        that.isContextCreation = false;
    }

    chart_fn.destroy = function() {//destory view
        var $$ = this.internal, config = $$.config, that = $$.chart_internal_val;

        // TODO
        // .... release memory. It is option
        that.isCreation = false;
        that.isContextCreation = false;
        if( that.zoom ) {
            that.zoom = null;
        }
        if( that.svg ) {
            that.svg.remove();
            that.svg = undefined;
        }
        that = undefined;
    }

    // internal fn : configuration, init
    chart_internal_fn.getDefaultConfig = function() {
        // TODO your coding area
        var config = {
            bindto: '#chart',                                //chart가 그려질 container
            size_width: 500,			                     //chart의 넓이
            size_height: 350,			                     //chart의 높이
            style_backgroundClassName: 'bistel-boxplot-background',//chart background style
            style_mainChartName: 'bistel-boxplot',                    //chart controll style
            style_boxstyleName: 'bistel-boxplot-box',              //boxplot의 style명
            style_xaxisStyleName: 'bistel-boxplot-xaxis',          //x axis style
            style_yaxisStyleName: 'bistel-boxplot-yaxis',          //y axis style
            style_xaxisTextClass: 'bistel-boxplot-xaxis-label',             //y axis label style
            style_yaxisTextClass: 'bistel-boxplot-yaxis-label',             //y axis label style
            xLabel: undefined,                                   //x axis label
            yLabel: undefined,                                   //y axis label
            xField: 'eqpAlias',                              //y field
            yAxisFormat: undefined,
            colorFn: undefined,                             //rect에 color 적용.
            yAxisLabelPostion: 'normal',                    //'normal', 'middle'
            clickFn: null,                                   //click event
            mouseOutFn : null,                              //mouseout event
            labels: true,                                    //label 출력 여부
            dataRenderer: null,                              //data rendering
            data: [],                                        //chart data
            zoomMinCount: 20,                                 //zoom이 되기 위한 최소 데이터 사이즈
            fixMinValue: undefined,                           //min값을 해당 값으로 고정
            fixMaxValue: undefined,                           //max값을 해당 값으로 고정
            areas: undefined,                                  // guide area 정의
            areas_show: false,
            areas_labelRotate: undefined,
            areas_data: [],
            areas_onselected: undefined,     // guide area click function
            event_onclick: function() {},
            event_onmouseover: function() {},
            event_onmouseout: function() {},
            event_onselected: function() {},
            event_onunselected: function() {},
            tooltip_show: function() {},
            tooltip_hide: function() {}
        };

        return config;
    }

    chart_internal_fn.init = function() {
        var $$ = this, config = $$.config;

        // TODO your coding area
        _drawchart($$);
    }

    // TODO your coding area
    // .... chart
    function _drawchart( chart ) {
        var $$ = chart,
            that = $$.chart_internal_val,
            itemSelectorName = 'boxplot-box',
            boxMaxWidth = 40;
            //tooltip = $($$.config.bindto).find($$.config.bindto+'_tooltip');//tooltip selection.
        if( $$.config.data == null || $$.config.data.length == 0 ) {//data가 없으면 그릴 수 없다.
            return;
        }
        //zoom을 위한 internal value에 xField와 axis class 설정
        //internal value에 xField 설정
        that.xField = $$.config.xField;
        //axis 설정
        that.xaxisSelector = $$.config.style_mainChartName+'.x.'+$$.config.style_xaxisStyleName;
        that.xaxisClass = $$.config.style_mainChartName+' x '+$$.config.style_xaxisStyleName;
        that.xaxisTextClass = $$.config.style_xaxisTextClass;
        that.yaxisSelector = $$.config.style_mainChartName+'.y.'+$$.config.style_yaxisStyleName;
        that.yaxisClass = $$.config.style_mainChartName+' y '+$$.config.style_yaxisStyleName;
        that.yaxisTextClass = $$.config.style_yaxisTextClass;
        that.yLabel = $$.config.yLabel;
        that.xLabel = $$.config.xLabel;
        //사이즈 설정
        _sizeSetting();

        //데이터 설정
        _dataSetting();

        if( !that.zoom ) {//zoom 기능에 대한 variable 정의
            that.zoom = {
                contextXscale: null,//zoom help chart의 xscale
                contextYscale: null,//zoom help chart의 yscale
                contextXaxis: null,//zoom help chart의 xaxis
                contextHeight: 0,//zoom help chart의 height
                selectedAxis: null,//zoom help chart에서 선택된 domain Array ( 해당 array가 실제 확대되어지는 domain으로 chart에 반영이 된다. )
                line: null,//zoom help chart의 line series
                brush: null,//brush 기능을 담당하는 객체
                boxwidth: 0,//zoom 기능시 box 하나의 넓이
                currentX: 0,//move 시 저장할 x좌표
                currentWidth: 70,//강제 구간 설정 시 넓이
                prevWidth: 0,
                prevX: 0,
                contextMargin: null//zoom help chart의 margin
            }
        }

        if( $$.config.data.length > $$.config.zoomMinCount ) {
            that.contextHeight = 50;
            that.paddingBottom = 50;
        } else {
            that.contextHeight = 0;
            that.paddingBottom = 0;
        }
        that.margin = { top: 10, right: 10, bottom: 50 + that.contextHeight, left: that.margin.left };//여백설정
        that.zoom.contextMargin = {top: that.height - that.contextHeight, right: 10, bottom: 20, left: that.margin.left};
        
        //zomm 기능을 활성화 하기 위한 객체 정의. brush 포함. 기본적으로 size 및 data 셋팅이 되어야 동작 가능.
        /*
        var contextXscale = null,//zoom help chart의 xscale
            contextYscale = null,//zoom help chart의 yscale
            contextXaxis = null,//zoom help chart의 xaxis
            contextHeight = 0,//zoom help chart의 height
            selectedAxis = null,//zoom help chart에서 선택된 domain Array ( 해당 array가 실제 확대되어지는 domain으로 chart에 반영이 된다. )
            line = null,//zoom help chart의 line series
            brush = null,//brush 기능을 담당하는 객체
            boxwidth = 0,//zoom 기능시 box 하나의 넓이
            contextMargin = {top: that.height-that.contextHeight, right: 10, bottom: 20, left: 30};//zoom help chart의 margin
        */
        //background 설정
        _drawBackground(that.isCreation?undefined:true);

        //axis 설정
        _makeAxis(that.isCreation?undefined:true);

        //background line 설정
        _drawGridLine(that.isCreation?undefined:true);

        //create series
        _drawSeries(that.isCreation?undefined:true);

        //zoom 기능 설정.
        if( $$.config.data.length > $$.config.zoomMinCount ) {
            _makeContextChart(that.isContextCreation?undefined:true);
        } else {
            _clearContext();
        }

        //다 그려진 완료 여부 true 설정.
        that.isCreation = true;

        function _sizeSetting() {//chart element's resize event
            var parent_node = $($$.config.bindto).parent();

            if( parent_node.width() > 0 ) $$.config.size_width = parent_node.width();
            if( parent_node.height() > 0 ) $$.config.size_height = parent_node.height();

            that.width = $$.config.size_width,
            that.height = $$.config.size_height;
        }

        function _dataSetting() {//box plot용 data setting
            // parse in the data
            if( $$.config.dataRenderer ) {
                that.data = $$.config.dataRenderer( $$.config.data );
            }else{
                that.data = $$.config.data;
            }
            //min, max setting
            var maxvalue = -Infinity,
                minvalue = that.data[0]['min'];

            for( var i = 0; i < that.data.length; i++ ) {
                var currentObj = null,
                    maxcompare = 0,
                    mincompare = minvalue,
                    obj = null;

                currentObj = that.data[i];
                maxcompare = currentObj['max'];
                mincompare = currentObj['min'];

                if( !isNaN(mincompare) && mincompare !== 0 ) {
                    if( isNaN(minvalue) ){
                        minvalue = mincompare;
                    }else{
                        minvalue = Math.min(mincompare, minvalue);
                    }
                }
                if( !isNaN(maxcompare) && maxcompare !== 0 ) {
                    if( isNaN(maxvalue) ){
                        maxvalue = maxcompare;
                    }else{
                        maxvalue = Math.max(maxcompare, maxvalue);
                    }
                }
                //maxvalue = Math.max(maxcompare, maxvalue);
            }
            //차트가 상하에 붙어서 표현되는 것을 방지하기 위해 약간의 가중치를 준다.
            var compare = maxvalue - minvalue;
            that.rowMax = maxvalue + ( Math.round( Math.abs( maxvalue ) * 0.05 ) );
            that.rowMin = minvalue - ( Math.round( Math.abs( minvalue ) * 0.05 ) );
            if( $$.config.fixMinValue !== undefined ) {
                that.rowMin = $$.config.fixMinValue;
            }
            if( $$.config.fixMaxValue !== undefined ) {
                that.rowMax = $$.config.fixMaxValue;
            }
            //that.rowMin = minvalue+10;
            /*
            that.rowMax = maxvalue+( Math.round( compare*0.1 ) );
            if( minvalue < 0 ) {//minus 일 경우에는 더한다.
                that.rowMin = minvalue + ( Math.round( minvalue*0.1 ) );
            }else{
                that.rowMin = minvalue - ( Math.round( minvalue*0.1 ) );
            }
            */
            if(!that.firstFixYAxis){
                //y축 너비 측정을 위한 변수 변경 by jwhong 2016-08-24
                var marginLeft = that.baseMarginLeft,
                    yMaxValue = $$.config.yAxisFormat? $$.config.yAxisFormat(that.rowMax):that.rowMax,
                    yMinValue = $$.config.yAxisFormat? $$.config.yAxisFormat(that.rowMin):that.rowMin,
                    compareYValue;

                if( yMaxValue.toString().length > yMinValue.toString().length ){
                    if( typeof yMinValue == "string" && yMaxValue.indexOf(',') > -1 ){
                        compareYValue = parseInt(yMaxValue.replace(/,/gi,""));
                    }else{
                        compareYValue = yMaxValue;
                    }
                }else {
                    if( typeof yMinValue == "string" && yMinValue.indexOf(',') > -1 ){
                        compareYValue = parseInt(yMinValue.replace(/,/gi,""));
                    }else{
                        compareYValue = yMinValue;
                    }
                }

                if( compareYValue >= 10000 ){
                    var commaSize = Math.round(compareYValue.toString().length/3);
                    marginLeft = (6*compareYValue.toString().length)+(commaSize*4);
                }

                if( compareYValue < 0 ) {//'-'가 붙기 때문에
                    marginLeft = marginLeft+10;
                }

                if( ( compareYValue+'' ).lastIndexOf('.') > 1 ) {//소수점이기 때문에
                    marginLeft = marginLeft+20;
                }

                if( $$.config.yLabel ) {//label 여백 가산.
                    marginLeft = marginLeft + 25; //15
                }

                if( $$.config.xLabel ) {//label 여백 가산.
                    that.margin.bottom = +that.margin.bottom+20;
                }

                that.margin.left = marginLeft;
                that.firstFixYAxis = true;
            }
        }

        function _drawBackground(init) {//chart background setting
            var width = that.width - that.margin.left - that.margin.right,
                height = that.height - that.margin.top - that.margin.bottom,
                bgelement = null,
                defs = null;
            //각 box의 사이즈를 설정한다.
            that.zoom.boxwidth = width/$$.config.data.length;
            if( that.svg == null ) {//svg create
                that.bindto = $$.config.bindto;
                that.svg = d3.select(that.bindto).append('svg');
                that.svg.attr('class', $$.config.style_mainChartName+'-box');
                that.svg.append('g')//other element group create
                        .attr('class', that.selector)
                        .append('rect')
                        .style('opacity', 0)
                    .attr('width',width) //Set the width of the clipping area
                    .attr('height',height);

                //scale 적용시 필요한 rect
                defs = that.svg.append('defs');
                defs.append('clipPath').attr('id',that.bindto.replace('#','')+'-clip-path').append('rect')
                    .attr('width',width) //Set the width of the clipping area
                    .attr('height',height); // set the height of the clipping area

                that.svg.append('g')//grid line group create
                        .attr('class','grid-line-group');

                //scale zoom chart group
                //summary 영역 차트 부분
                that.svg.append('g')
                        .attr('class', 'brush-context');
            }
            defs = that.svg.select(that.bindto+'-clip-path').select('rect')
                           .attr('width',width)
                           .attr('height',height);
            that.svg.attr('width', width + that.margin.left + that.margin.right)
                    .attr('height', height + that.margin.top + that.margin.bottom);//top여백을 제한 height

            that.svg.select('.'+that.selector)
                    .attr('transform', 'translate(' + that.margin.left + ',' + that.margin.top + ')');
            that.svg.select('.brush-context')
                    .attr('transform', 'translate(' + that.zoom.contextMargin.left + ',' + that.zoom.contextMargin.top + ')');
            //that.svg.select('.brush-context').empty();
        }

        function _makeAxis(init) {//init은 생성 여부.

            if( that.resizeCallback == null ) {//x축 라벨에 word rapping resize function 적용.
                that.resizeCallback = _resize;
            }
            chartAxis.applyAxisWithRangePoints( chart, true );
/*
            var yaxisObj = {
                            size: {
                                width: that.width,
                                height: that.height
                            },
                            axisStyleName : 'bistel-boxplot-xaxis',//nullable
                            data : {
                                content : null,
                                field : null,
                                max : that.rowMax,
                                min : that.rowMin
                            },//not null
                            axisType : 'y',//nullable  --default : 'x'
                            isTickVisible: true,//nullable
                            isTruncate: true,
                            tick : {
                                axisLabelClassName : 'bullet-yaxis-label',
                                tickFormat : $$.config.yAxisFormat,
                                axisLabel : $$.config.yLabel
                            },//nullable
                            axisDomain : {
                                scaleType : 'number',
                                rangeType : 'range',
                                domain: [that.rowMin, that.rowMax],
                                range: [that.height, 0]
                            },//nullable
                            orient : 'left'
                        };

            //y axis setup
            yaxisObj.svg = that.svg,
            yaxisObj.margin = that.margin,
            yaxisObj.isTickVisible = true,
            yaxisObj.transform = "translate(" + that.margin.left + "," + that.margin.top + ")";
            yaxisObj.data.content = that.data;

            axisMaker.applyAxis(yaxisObj);
            var y = yaxisObj.scale,
                yAxis = yaxisObj.axis;
*/
        }

        function _resize() {//다시 그려주는 로직. update.....
            _sizeSetting();

            _dataSetting();

            _drawBackground();

            _makeAxis();
        }

        function _clearContext() {
            that.svg.select('.brush-context').style('opacity',0);
        }

        function _makeContextChart(init) {//zoom 기능을 하는 chart 생성.  (brush 기능 활성화.)
            var isCreation = init,//생성 여부.
                contextXfield = $$.config.xField,//상위 차트의 xField로 설정한다.
                contextYfields = [ 'min', 'max', 'median' ],//line으로 표현할 field 정의.
                width = that.width - that.margin.left - that.margin.right,
                height = that.height - that.margin.top - that.margin.bottom,
                selectIndexArray = [],//선택된 도메인의 인덱스 정보 리스트
                scaleBarWidth = that.zoom.boxwidth,//scale 적용시 한 아이템의 넓이
                xAxisMaxWidth = 0;//Axis가 표현될 때 해당 텍스트의 최고 길이에 대한 넓이
            if( that.zoom.contextXscale == null ) {
                that.zoom.contextXscale = d3.scale.ordinal();
            }
            if( that.zoom.contextYscale == null ) {
                that.zoom.contextYscale = d3.scale.linear();
            }
            if( that.zoom.contextXaxis == null ) {
                that.zoom.contextXaxis = d3.svg.axis();
            }
            that.zoom.contextHeight = that.height - that.zoom.contextMargin.top - that.zoom.contextMargin.bottom;
            that.zoom.contextXscale.rangePoints([0 , width], 1),//여백을 아이템 하나 길이 만큼 준것.
            that.zoom.contextYscale.range([that.zoom.contextHeight, 0]);//yscale zoom 을 위한 설정.
            that.zoom.contextXaxis.scale(that.zoom.contextXscale).orient('bottom');
            that.zoom.contextXscale.domain( that.data.map(function(d) { return d[contextXfield] } ) );
            that.zoom.contextYscale.domain( that.yScale.domain() );

            //강제로 특정구간을 zoom 해준다.
            if( !that.zoom.brush ) {
                that.zoom.brush = d3.svg.brush();
            }
            if( that.isResize ) {//resize 시 scale정보를 가져와서 저장된 x, width를 다시 갱신해준다.
                var selectedDomain = that.zoom.selectedAxis,
                    endIndex = selectedDomain.length - 1,
                    startx = that.zoom.contextXscale(selectedDomain[0]),
                    endx = that.zoom.contextXscale(selectedDomain[endIndex]);
                that.zoom.currentX = startx;
                that.zoom.currentWidth = endx - startx;
            }
            that.zoom.brush.x(that.zoom.contextXscale).extent([that.zoom.currentX, that.zoom.currentX+that.zoom.currentWidth]).on('brush', brushed);//bind brush event
            //brush = d3.svg.brush().x(contextXscale).on('brush', brushed);//bind brush event

            //zoom 영역 chart 생성.
            drawContextLineSeries();

            function drawContextLineSeries() {
                var context = that.svg.select('.brush-context'),
                    backgrounds = null,
                    line,
                    yField = '';
                context.style('opacity',1);
                if( isCreation ) {
                    //line path 생성.
                    for( var idx = 0; idx < contextYfields.length; idx++ ) {
                        yField = contextYfields[idx];
                        context.append('path')
                            .datum(that.data)
                            .attr('class', 'brush-line-'+idx)
                            .style('stroke', chartStyleUtil.getIndexColor(idx) )
                            .style('fill-opacity',0.1)
                            .style('fill','#fff');
                    }

                    context.append('g')
                        .attr('class', 'x axis brush')
                        .attr('transform', 'translate( 0,' + that.zoom.contextHeight + ')')
                        .call(that.zoom.contextXaxis);

                    backgrounds = context.append('g')
                        .attr('class', 'x brush background')
                        .call(that.zoom.brush);
                    backgrounds.selectAll('rect')
                        .attr('y', -6)
                        .attr('height', that.zoom.contextHeight + 7);
                }
                //size가 변경될 시 brush 를 다시 설정해준다.
                var isBrush = false;
                if( that.isResize ) {
                    backgrounds = context.select('.x.brush.background').call(that.zoom.brush);
                    backgrounds.selectAll('rect.background')
                        .attr('width', width)
                        .attr('y', -6)
                        .attr('height', that.zoom.contextHeight + 7);
                    isBrush = true;
                }
                //해당 라인을 그려준다.
                //버그 : 가중치를 구해야함. 값 0 기준으로 yscale이 30이 안나오면 가중치를 구함.
                //console.log( 'zero scale : ', that.zoom.contextYscale( 0 ) );
                var yscaleZero = 0;
                if( that.zoom.contextYscale( 0 ) > 30 ) {
                    yscaleZero = that.zoom.contextYscale( 0 ) - 30;
                }
                for( var idx = 0; idx < contextYfields.length; idx++ ) {
                    yField = contextYfields[idx];
                    line = d3.svg.line()
                             .defined(function(d) {
                                 for( var prop in d ) {
                                     if( Number.isNaN(d[prop]) ){
                                         d[prop] = null;
                                     }
                                 }
                                 return d;
                              })
                             .x(function(d, i) {
                                 var returnvalue = that.zoom.contextXscale( d[contextXfield] );
                                //  console.log(returnvalue);
                                 return returnvalue; })
                             .y(function(d, i) {
                                 var returnvalue = that.zoom.contextYscale( d[yField] ) - yscaleZero;
                                //  console.log('y : ', returnvalue);
                                 return returnvalue; });
                    context.select('.brush-line-'+idx).datum(that.data).attr('d', line);
                }
                //text를 부분부분 사이즈에 맞게 뿌려준다.
                var txtLength = 0;
                context.select('.x.axis.brush').call(that.zoom.contextXaxis).selectAll('text').text(function ( d, i ) {
                    txtLength++;
                    var thisWidth = d3.select(this).node().getBoundingClientRect().width,
                        //compare = Math.round( width/thisWidth )-1,
                        compare = Math.ceil(that.data.length/5),
                        txt = d;//txt = '';
                    //첫번째와 마지막 라벨은 무조건 출력한다.
                    //if( ( i == 0 || i == that.data.length-1 ) || i%compare == 0 ) txt = d;
                    if( i == 0 || i%compare == 0 ) txt = d;
                    //이때 aixs text의 최고 넓이를 설정해 준다. 안해주면 텍스트의 길이가 각기 다 다르므로 일정 넓이를 구할 수 없음.
                    if( xAxisMaxWidth < thisWidth ) xAxisMaxWidth = thisWidth;
                    //if( i == that.data.length-1 ) txt = '';
                    return txt;
                })
                .style('text-anchor', function ( d, i ) {
                    var returnValue = 'middle';
                    if( i == 0 ) {
                        returnValue = 'start';
                    }else if( i == that.data.length-1 ) {
                        returnValue = 'end';
                    }
                    return returnValue;
                });

                if( width/2 < xAxisMaxWidth ) {//라벨이 전체 사이즈의 반 이상일때는 하나만 표현한다.
                    context.select('.x.axis.brush').selectAll('text').style( 'opacity', function( d, i ){
                        if( i === Math.round(txtLength/2) ) {
                            return 1;
                        } else {
                            return 0;
                        }
                    });
                } else {
                    context.select('.x.axis.brush').selectAll('text').style('opacity', function ( d, i ){
                        var returnOpacity = 0,
                            compare = Math.ceil(that.data.length/5);
                        if( i == 0 || i%compare == 0 ) returnOpacity = 1;
                        return returnOpacity;
                    })
                }

                //강제로 특정구간을 zoom을 했을시에는 강제로 이벤트를 발생시킨다.
                /*
                if( isBrush ) {
                    console.log('isBrush : true');
                    brushed();
                }
                */
                brushed();
                that.isContextCreation = true;
            }

            function brushed() {//brush event handler
                //console.log('brushed : '+that.zoom.brush.extent());
                that.zoom.currentX = that.zoom.brush.extent()[0];
                that.zoom.currentWidth = (+that.zoom.brush.extent()[1]) - (+that.zoom.brush.extent()[0]);
                selectIndexArray = [];//x domain의 선택한 인덱스를 저장.
                scaleBarWidth = that.zoom.boxwidth;//선택된 인덱스 만큼의 시리즈를 표현할 수 있는 width를 구한다.
                that.zoom.selectedAxis = that.zoom.contextXscale.domain().filter( function(d, i) {//context 영역의 domain중에서 선택된 인덱스만 가져오도록 filtering한다.
                    var isSelect = (that.zoom.brush.extent()[0] <= that.zoom.contextXscale(d)) && (that.zoom.contextXscale(d) <= that.zoom.brush.extent()[1]);
                    //console.log(i+'==>  d : '+d+'  , select : '+isSelect+'  , '+contextXscale(d));
                    if( isSelect ){
                        selectIndexArray.push(i);
                    }
                    return isSelect});//xscale 의 기준값을 summary 에서 잡아서 값을 가져오도록 한다. 원본이 변경이 되면 안됨.
                that.xScale.domain( that.zoom.brush.empty() ? that.zoom.contextXscale.domain() : that.zoom.selectedAxis );//드래그가 아닌 그냥 클릭시는 원상복귀
                scaleBarWidth = width/selectIndexArray.length;//that.width = 전체 차트의 사이즈고 width는 차트가 그려지는 사이즈다.
                if( scaleBarWidth <= that.zoom.boxwidth ) {
                    scaleBarWidth = that.zoom.boxwidth;
                }
                //y scale을 위한 min, max 값을 구한다.
                var maxvalue = -Infinity,
                    minvalue = -Infinity,
                    checkIndex = 0;
                if( selectIndexArray.length > 0 ) {//error 방지.
                    checkIndex = selectIndexArray[checkIndex];
                }
                if( that.zoom.brush.empty() ) {//brush 영역에서 클릭하여 전체 보기 시.
                    minvalue = that.rowMin;
                    maxvalue = that.rowMax;
                }else{//brush 영역 지정시.
                    minvalue = that.data[checkIndex]['min'];
                    for( var i = 0; i < selectIndexArray.length; i++ ) {
                        var currentObj = null,
                            maxcompare = 0,
                            mincompare = 0,
                            obj = null;
                        checkIndex = selectIndexArray[i];
                        currentObj = that.data[checkIndex];
                        maxcompare = currentObj['max'];
                        mincompare = currentObj['min'];

                        maxvalue = Math.max(maxcompare, maxvalue);
                        minvalue = Math.min(mincompare, minvalue);
                    }
                    
                    if( maxvalue == -Infinity || ( maxvalue === 0 && maxvalue === 0 ) ) {
                        //범위 내 데이터가 모두 값이 없을 경우.
                        //view 에서는 tick 값이 포맷팅 되어져서 나옴 ( 1000 으로 나눈 값 )
                        minvalue = 0;
                        maxvalue = 10000;
                    }else{
                        //약간의 가중치를 준다.
                        var compare = maxvalue-minvalue;
                        minvalue = minvalue-( compare*0.1 );
                        maxvalue = maxvalue+( compare*0.1 );
                    }
                }
                that.yScale.domain([minvalue, maxvalue]);//yscale을 설정한다.
                //axis update
                that.svg.select('g.'+($$.config.style_mainChartName+'.y.'+($$.config.style_yaxisStyleName))).call(that.yAxis);
                that.svg.select('g.'+($$.config.style_mainChartName+'.x.'+($$.config.style_xaxisStyleName))).call(that.xAxis)
                .selectAll('text')
                .text(function ( d, i ) {
                    var returnValue = d;
                    if( xAxisMaxWidth-5 > scaleBarWidth ) {//-5 최소 사이즈와 최대 사이즈의 오차 범위.
                        var compare = Math.ceil( xAxisMaxWidth/scaleBarWidth );
                        if( i%compare == 0 ){
                            returnValue = d;
                        }else{
                            returnValue = '';
                        }
                    }
                    return returnValue;
                })
                .style('opacity',1);//axis re make

                //bar 같이 객체를 하나씩 생성해서 만드는 경우에는 이런 로직을 넣어줘야함.
                //선택된 bar만 선택해서 값을 변경해주고 나머지는 안보이게 하거나 remove 시켜야 한다.
                _updateSeries( selectIndexArray, minvalue, maxvalue );
            }
        }

        function _updateSeries( selectIndexArray, minval, maxval ) {
            //tooltip.css('display','none');
            var selectBars = null,//선택된 box
                unSelectBars = null,//선택하지 않은 box
                width = that.width - that.margin.left - that.margin.right,
                height = that.height - that.margin.top - that.margin.bottom,
                scaleBarWidth = width/selectIndexArray.length;
            if( that.zoom.brush.empty() ) {//전체 보기시에는 하위 로직을 실행하지 않는다.
                _makeAxis();
                _drawSeries();
                return;
            }
            selectBars = that.svg.select('.'+itemSelectorName+'-group').selectAll('.'+itemSelectorName)
                                                  .filter(function( d, z ) {
                                                            var returnValue = false;
                                                                for( var i = 0; i < selectIndexArray.length; i++ ) {
                                                                    if( selectIndexArray[i] == z ) {
                                                                        returnValue = true;
                                                                        break;
                                                                    }
                                                                }
                                                            return returnValue; });
            unSelectBars = that.svg.select('.'+itemSelectorName+'-group').selectAll('.'+itemSelectorName)
                                                     .filter(function( d, z ) {
                                                            var returnValue = true;
                                                                for( var i = 0; i < selectIndexArray.length; i++ ) {
                                                                    if( selectIndexArray[i] == z ) {
                                                                        returnValue = false;
                                                                        break;
                                                                    }
                                                                }
                                                            return returnValue; });

            selectBars.attr('transform', function(d) {
                                             //roundpoints로 하면 좌표를 가중치를 빼주도록 한다.
                                             var xscale = that.xScale(d[$$.config.xField]) - scaleBarWidth/2;
                                             if( xscale < 0 ) xscale = 2;
                                            //  if( isNaN(xscale) ) xscale = 0;
                                             return 'translate(' +  xscale  + ',' + that.margin.top + ')'; } )
                      .style('opacity',1)
                      .call(that.box_chart.domain([minval, maxval]).height(height).width( scaleBarWidth ).dataTotalLength(selectBars[0].length));

            unSelectBars.attr('transform', 'translate( 0,' + that.height + ')')
                        .style('opacity',0);
            _drawGridLine();
        }

        function _drawGridLine(init) {
            var gridg = that.svg.select('g.grid-line-group'),
                hgridgroup = null,
                firstTick = null;
                gridg.attr('transform', 'translate(' + that.margin.left + ',' + that.margin.top + ')');
            if(init) {
                that.horizontalGridAxis = d3.svg.axis().scale(that.yScale)
                                            .orient('left')
                                            .ticks(that.yAxisTicks)
                                            .tickSize(-(that.width-that.margin.left-that.margin.right), 0, 0)
                                            .tickFormat('');
                hgridgroup = gridg.insert('g')
                                  .attr('class', $$.config.style_mainChartName+'-grid horizontal')
            }else{
                that.horizontalGridAxis.scale(that.yScale).tickSize(-(that.width-that.margin.left-that.margin.right), 0, 0);
                hgridgroup = that.svg.select('.'+$$.config.style_mainChartName+'-grid.horizontal');
            }
            hgridgroup.call(that.horizontalGridAxis);
            hgridgroup.style('opacity',0.5);
            //첫번째 라인을 안보이게 한다.(첫번째 라인으로 x axis 축이 진하게 보이는 현상을 제거하기 위함.)
            //firstTick = hgridgroup.selectAll('g.tick')[0][0];
            //d3.select(firstTick).style('opacity',0);
        }

        function _drawSeries(init) {//series create
            var svg = that.svg.select('.'+that.selector),
                labels = $$.config.labels,
                width = that.width - that.margin.left - that.margin.right,
                height = that.height - that.margin.top - that.margin.bottom,
                min = Infinity,
                max = -Infinity,
                boxgroup = null,
                bars = null,
                prevItem = null,
                isItemClick = false;

            if (that.rowMax > max) max = that.rowMax;
            if (that.rowMin < min) min = that.rowMin;

            var boxPadding = 4;

            if( that.zoom.boxwidth <= boxPadding ) {
                boxPadding = 2;
            }

            var minCount = +$$.config.zoomMinCount;

            if( that.zoom.boxwidth > Math.ceil(width/minCount) ) {
                that.zoom.boxwidth = Math.ceil(width/minCount);
            }

            if( that.zoom.boxwidth > 30 ) {
                that.zoom.boxwidth = 30;
            }

            if( init ) {//series create
                that.box_chart = d3.box()
                              .classname($$.config.style_boxstyleName)
                              .width(width)
                              .height(height)
                              .padding(boxPadding)
                              //.colorfn(chartStyleUtil.getIndexColor)
                              .domain([min, max])
                              .dataTotalLength(that.data.length)
                              .colorfn($$.config.colorFn)
                              .showLabels(labels);
                boxgroup = svg.append('g')//box group create
                              .attr('class', itemSelectorName+'-group');
                //background click event bind
                svg.on('click', function() {
                    if( !isItemClick ) {
                        if( prevItem ) {
                            that.box_chart.setHighlight(prevItem);
                            prevItem = null;
                        }
                    } else {
                        isItemClick = false;
                    }
                });
            }

            
            // draw the boxplots
            if( init ) {
                //box lib의 최상위 style 명을 부여한다. 틀리면 스타일 적용이 안됨.
                boxgroup = svg.select('.'+itemSelectorName+'-group');
                //boxgroup.attr('clip-path','url(#my-clip-path)');
                bars = boxgroup.selectAll('.'+$$.config.style_boxstyleName)
                              .data(that.data)
                              .enter().append('g')
                              .attr('class',itemSelectorName)
                              .attr('selected','N')
                              .attr('index', function(d,i) { return i+''; })
                              .call(function(ev) {//dom이 다 그려지면 click event bind
                                  if( ev == null || ev.length == 0 ) {
                                     return;
                                  }
                                  if( $$.config.clickFn ) {//config clickFn이 있다면 반영해준다.
                                  //if( $$.config.event.onclick ) {//config clickFn이 있다면 반영해준다.
                                     var dom = null;
                                     var list = ev;
                                     for( var i = 0; i < list.length; i++ ) {
                                         dom = $(list[i]);
                                         dom.on('remove', function() {
                                             this.unbind('click');
                                         });
                                         dom.bind('click', function(ev) {
                                            isItemClick = true;
                                            var index = i,
                                                selectedElement = d3.select(this)[0][0].__data__,
                                                sendData = null,
                                                isOwner = false;
                                            if( prevItem ) {
                                                that.box_chart.setHighlight(prevItem);
                                                var prevData = prevItem[0][0].__data__;
                                                if( selectedElement[$$.config.xField] == prevData[$$.config.xField] ) {
                                                    isOwner = true;
                                                }
                                            }

                                            if( isOwner ) {
                                                //tooltip.css('display','none');
                                                prevItem = null;
                                                sendData = {
                                                    event: ev,
                                                    data : selectedElement,
                                                    target : d3.select(this),
                                                    selected: d3.select(this).attr('selected')
                                                };
                                                $$.config.clickFn(sendData);
                                                return;
                                            }
                                            that.box_chart.setHighlight(d3.select(this));
                                            sendData = {
                                                event: ev,
                                                data : selectedElement,
                                                target : d3.select(this),
                                                selected: d3.select(this).attr('selected')
                                            };
                                            $$.config.clickFn(sendData);
                                            prevItem = d3.select(this);
                                        });
                                     }
                                  }

                                  if ( $$.config.mouseOutFn ) {
                                      var dom = null;
                                      var list = ev;
                                      for( var i = 0; i < list.length; i++ ) {
                                          dom = $(list[i]);
                                          dom.on('remove', function() {
                                              this.unbind('mouseout');
                                          });
                                          dom.bind('mouseout', function(ev) {

                                             var index = i,
                                                 selectedElement = d3.select(this)[0][0].__data__,
                                                 sendData = null,
                                                 isOwner = false;
                                             if( prevItem ) {
                                                 that.box_chart.setHighlight(prevItem);
                                                 var prevData = prevItem[0][0].__data__;
                                                 if( selectedElement[$$.config.xField] == prevData[$$.config.xField] ) {
                                                     isOwner = true;
                                                 }
                                             }

                                             if( isOwner ) {
                                                 //tooltip.css('display','none');
                                                 prevItem = null;
                                                 sendData = {
                                                     event: ev,
                                                     data : selectedElement,
                                                     target : d3.select(this),
                                                     selected: d3.select(this).attr('selected')
                                                 };
                                                 $$.config.mouseOutFn(sendData);
                                                 return;
                                             }
                                             that.box_chart.setHighlight(d3.select(this));
                                             sendData = {
                                                 event: ev,
                                                 data : selectedElement,
                                                 target : d3.select(this),
                                                 selected: d3.select(this).attr('selected')
                                             };
                                             $$.config.mouseOutFn(sendData);
                                             prevItem = d3.select(this);
                                         });
                                      }
                                  }
                              });
                }else{//box plot update
                    boxgroup = svg.select('.'+itemSelectorName+'-group');
                    bars = boxgroup.selectAll('.'+itemSelectorName).style('opacity',1);
                    if( that.isDataChange ) {
                        console.log('box plot DataChange');
                        //bars.data(that.data);
                        
                        //enter, exit 항목에 대해서 처리 로직 추가 2016/08/23 by jwhong
                        var enterItems = bars.data(that.data).enter();                        

                        //새로 들어가는 데이터가 있을 경우.. ( 설정을 안해주면, 표시가 안됨 )
                        if(enterItems[0].length > 0) {
                            that.box_chart = d3.box()
                              .classname($$.config.style_boxstyleName)
                              .width(width)
                              .height(height)
                              .padding(boxPadding)
                              //.colorfn(chartStyleUtil.getIndexColor)
                              .domain([min, max])
                              .dataTotalLength(that.data.length)
                              .colorfn($$.config.colorFn)
                              .showLabels(labels);
                        }

                        enterItems.append('g')
                            .attr('class',itemSelectorName)
                            .attr('selected','N')
                            .attr('index', function(d,i) { return i+''; })
                            .attr('transform', function(d) {
                                //roundpoints로 하면 좌표에 가중치를 빼주도록 한다.
                                //2016/08/23 좌표값을 지정해준다..
                                var xscale = that.xScale(d[$$.config.xField]) - that.zoom.boxwidth/2;
                                if( xscale < 0 ) xscale = 2;
                                return 'translate(' +  xscale  + ',' + that.margin.top + ')'; }
                            )
                            .call(function(ev){
                               if( ev == null || ev.length == 0 ) {
                                     return;
                                  }
                                if( $$.config.clickFn ) {//config clickFn이 있다면 반영해준다.
                                //if( $$.config.event.onclick ) {//config clickFn이 있다면 반영해준다.
                                    var dom = null;
                                    var list = ev;
                                    for( var i = 0; i < list.length; i++ ) {
                                        //ev 중에서 null 데이터가 존재할 경우, null 을 전부 삭제.
                                        list[i] = _.without(list[i], null);
                                        dom = $(list[i]);

                                        dom.on('remove', function() {
                                            this.unbind('click');
                                        });
                                        dom.bind('click', function(ev) {

                                        var index = i,
                                            selectedElement = d3.select(this)[0][0].__data__,
                                            sendData = null,
                                            isOwner = false;
                                        if( prevItem ) {
                                            that.box_chart.setHighlight(prevItem);
                                            var prevData = prevItem[0][0].__data__;
                                            if( selectedElement[$$.config.xField] == prevData[$$.config.xField] ) {
                                                isOwner = true;
                                            }
                                        }

                                        if( isOwner ) {
                                            //tooltip.css('display','none');
                                            prevItem = null;
                                            sendData = {
                                                event: ev,
                                                data : selectedElement,
                                                target : d3.select(this),
                                                selected: d3.select(this).attr('selected')
                                            };
                                            $$.config.clickFn(sendData);
                                            return;
                                        }
                                        that.box_chart.setHighlight(d3.select(this));
                                        sendData = {
                                            event: ev,
                                            data : selectedElement,
                                            target : d3.select(this),
                                            selected: d3.select(this).attr('selected')
                                        };
                                        $$.config.clickFn(sendData);
                                        prevItem = d3.select(this);
                                    });
                                    }
                                }

                                if ( $$.config.mouseOutFn ) {
                                    var dom = null;
                                    var list = ev;
                                    for( var i = 0; i < list.length; i++ ) {
                                        //ev 중에서 null 데이터가 존재할 경우, null 을 전부 삭제.
                                        list[i] = _.without(list[i], null);
                                        dom = $(list[i]);

                                        dom.on('remove', function() {
                                            this.unbind('mouseout');
                                        });
                                        dom.bind('mouseout', function(ev) {

                                            var index = i,
                                                selectedElement = d3.select(this)[0][0].__data__,
                                                sendData = null,
                                                isOwner = false;
                                            if( prevItem ) {
                                                that.box_chart.setHighlight(prevItem);
                                                var prevData = prevItem[0][0].__data__;
                                                if( selectedElement[$$.config.xField] == prevData[$$.config.xField] ) {
                                                    isOwner = true;
                                                }
                                            }

                                            if( isOwner ) {
                                                //tooltip.css('display','none');
                                                prevItem = null;
                                                sendData = {
                                                    event: ev,
                                                    data : selectedElement,
                                                    target : d3.select(this),
                                                    selected: d3.select(this).attr('selected')
                                                };
                                                $$.config.mouseOutFn(sendData);
                                                return;
                                            }
                                            that.box_chart.setHighlight(d3.select(this));
                                            sendData = {
                                                event: ev,
                                                data : selectedElement,
                                                target : d3.select(this),
                                                selected: d3.select(this).attr('selected')
                                            };
                                            $$.config.mouseOutFn(sendData);
                                            prevItem = d3.select(this);
                                        });
                                    }
                                }
                        })
                        .call(that.box_chart.height(height).maxWidth(boxMaxWidth).width(that.zoom.boxwidth).padding(boxPadding) //반영시켜줌으로서 표시가 되도록..
                             .domain([min, max])
                             .dataTotalLength(that.data.length));

                        var exitItems = bars.data(that.data).exit().remove();
                    }
                }

                //update
                bars.data(that.data).attr('transform', function(d) {
                                        //roundpoints로 하면 좌표에 가중치를 빼주도록 한다.
                                        var xscale = that.xScale(d[$$.config.xField]) - that.zoom.boxwidth/2;
                                        if( xscale < 0 ) xscale = 2;
                                        return 'translate(' +  xscale  + ',' + that.margin.top + ')'; } )
                    .call(that.box_chart.height(height).maxWidth(boxMaxWidth).width(that.zoom.boxwidth).padding(boxPadding)
                             .domain([min, max])
                             .dataTotalLength(that.data.length));
                //area test 위한 config 설정.
                /*
                $$.config.areas_show = true;
                $$.config.areas_data = [
                       [null, [Math.round(max/2), null, false, 'y guide', '']]
                ];
                */
                if( $$.config.areas_show === true ) {
                    /*
                    var xfocusData = null,
                        yfocusData = [Math.round(max/2), null, false, 'y guide', ''];
                    var focusData = [
                           [xfocusData, yfocusData]
                    ];
                    */
                    var focusData = $$.config.areas_data,
                        areaMargin = {
                            left: 0,
                            right: 0,
                            top: that.margin.top,
                            bottom: that.margin.bottom
                        };
                    if( focusData ) {
                        for( var i = 0; i < focusData.length; i++ ){
                            _drawGuideArea(svg, i, areaMargin, width, height, that.xScale, that.yScale, focusData[i][0], focusData[i][1]);
                        }
                    }
                }

            }
        }

        function _makeLegend(init) {//legend create
            var legend = that.svg.append("g")
                          .attr("class", "legend")
                          .attr("x", w - 65)
                          .attr("y", 25)
                          .attr("height", 100)
                          .attr("width", 100);

                        legend.selectAll('g').data(that.data)
                          .enter()
                          .append('g')
                          .each(function(d, i) {
                            var g = d3.select(this);
                            g.append("rect")
                              .attr("x", w - 65)
                              .attr("y", i*25)
                              .attr("width", 10)
                              .attr("height", 10)
                              .style("fill", color_hash[String(i)][1]);

                            g.append("text")
                              .attr("x", w - 50)
                              .attr("y", i * 25 + 8)
                              .attr("height",30)
                              .attr("width",100)
                              .style("fill", color_hash[String(i)][1])
                              .text(color_hash[String(i)][0]);

                          });
        }

        function _drawGuideArea( targetSvg, index, margin, width, height, xScale, yScale, xData, yData ) {
            var guide_area = d3.guideArea().target(targetSvg).index(index);
            targetSvg.call(guide_area.height(height < 15 ? 15 : height)
                                      .width(width < 15 ? 15 : width)
                                      .xScale(xScale)
                                      .xData(xData)
                                      .yScale(yScale)
                                      .yData(yData)
                                      .margin(margin));
        }

    ///////////////////////////////////////////////////////////////////////////
    //
    // END: Define Area
    //
    ///////////////////////////////////////////////////////////////////////////

    // utils
    var isValue = chart_internal_fn.isValue = function(v) {
        return v || v === 0;
    },
    isFunction = chart_internal_fn.isFunction = function(o) {
        return typeof o === 'function';
    },
    isString = chart_internal_fn.isString = function(o) {
        return typeof o === 'string';
    },
    isUndefined = chart_internal_fn.isUndefined = function(v) {
        return typeof v === 'undefined';
    },
    isDefined = chart_internal_fn.isDefined = function(v) {
        return typeof v !== 'undefined';
    };

    // Support AMD, CommonJS, window
    if(typeof define === 'function' && define.amd) {
        // only d3.js
        define('Boxplot', ['d3'], Boxplot);
    } else if('undefined' !== typeof exports && 'undefined' !== typeof module) {
        module.exports = Boxplot;
    } else {
        window.Boxplot = Boxplot;
    }

})(window, window.d3, window.chartAxis);
