/**
 *
 */
(function(window, d3, axisMaker) {
    'use strict';

    var ColumnChart = {
        // TODO define your chart version
        version: '0.0.1',
        chart: {
            fn: Chart.prototype,
            internal: {
                fn: ChartInternal.prototype
            }
        }
    };

    var chart_fn = ColumnChart.chart.fn,
        chart_internal_fn = ColumnChart.chart.internal.fn;

    ColumnChart.generate = function(config) {
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
            margin: {top: 20, right: 20, bottom: 20, left: 40},//여백설정
            selectedItem: null,                                //선택 아이템
            width: 0,                                          //여백과 axis를 제외한 series가 그려질 width
            height: 0,                                         //여백과 axis를 제외한 series가 그려질 height
            selector: 'element-group',
            xScale: null,                                      //xscale 객체
            childxScale: null,                                 //group시 group 안에 rect를 그려주는 xscale 객체
            groupKeys: null,								   //group시 key를 추출해서 저장
            xAxis: null,                                       //x축 값 설정
            yScale: null,                                      //yscale 객체
            yAxis: null,                                       //y축 값 설정
            horizontalGridAxis: null,                          //가로 라인 설정
            rowMax: 0,                                         //데이터의 max
            rowMin: 0,                                         //데이터의 min
            resizeCallback: null,                              //axis 반영시 word rap 기능을 활성화.
            isCreation: false,                                 //차트 생성 여부
            isResize: false,                                   //사이즈 변경 여부.
            isDataChange: false                                //데이터 변경 여부
        };
    }

    chart_internal_fn.loadConfig = function(config) {
        var this_config = this.config, target, keys, read;
        function find() {
            var key = keys.shift();
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
        var $$ = this.internal;
        var that = $$.chart_internal_val;

        if( !that.isCreation ) return;

        that.isResize = true;

        $$.config.size_width = ( size.width === 0 || size.width === null ) ?$$.config.size_width:size.width;
        $$.config.size_height = ( size.height === 0 || size.height === null ) ?$$.config.size_height:size.height;

        // TODO your coding area
        // .... resize and draw
        _drawchart($$);

        that.isResize = false;
    };

    chart_fn.selectedItem = function() {
        var $$ = this.internal, config = $$.config, that = $$.chart_internal_val;
        return that.selectedItem;
    };

    chart_fn.unselectedItem = function() {
        var $$ = this.internal, config = $$.config, that = $$.chart_internal_val;
        that.column_series.setHighlight(that.selectedItem);
        that.selectedItem = null;
    };

    chart_fn.data = function() {
        var $$ = this.internal, config = $$.config;
        return config.data;
    }

    chart_fn.load = function(data) {
        var $$ = this.internal, config = $$.config, that = $$.chart_internal_val;
        config = $$.config;

        // TODO
        // .... load data and draw. It is option
        config.data = data;

        if( config.data == null || config.data.length == 0 ) {
            return;
        }

        that.isDataChange = true;
        _drawchart($$);
        that.isDataChange = false;
    }

    chart_fn.clear = function() {//only view clear
        var $$ = this.internal, config = $$.config, that = $$.chart_internal_val;
        if( that.svg ) {
            that.svg.remove();
            that.svg = null;
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
            bindto: '#chart',                                      //chart가 그려질 container
            size_width: 500,                                        //chart의 넓이
            size_height: 400,                                       //chart의 높이
            margin: null,                                           //여백설정
            style_backgroundClassName: 'column-chart-background',   //chart background style
            style_mainChartName: 'column-chart',                    //chart controll style
            dataRenderer: null,                                     //data rendering
            data: [],                                         		//chart data
            dataType: 'json',                                       //json or array
            eventData: [],											//event data
            guideData: null,										//guide data line
            standardData: null,                                     //standard data line
            series: {
                width: null,                                        //series width
                padding: 4,										    //시리즈간 여백
                clickFn: null,                                      //click event
                colorRenderer: null,							    //color 지정 function
                labels: false,                                      //label 출력 여부
                widthIsPersion: true                                //series의 넓이를 %로 주고 싶은경우.
            },
            legend: {
                isVisible: false,                                   //legend 출력여부.
                names: null                                         //isVisible이 true일 때 null이면 default로 yaxis의 field로 대체한다.
            },
            xaxis : {
                axisStyleName : 'column-chart-xaxis',//nullable
                    data : {
                       content : null,
                       field : 'State',
                       max : null,
                       min : null
                    },//not null
                    axisType : 'x',//nullable  --default : 'x'
                    tick : {
                        axisLabelClassName : 'xaxis-label'
                    },//nullable
                    scale : {
                        scaleType : 'ordinal',
                        rangeType : 'rangeBands'
                    },//nullable
                    orient : 'bottom',
                    isTickVisible: true
               },
            yaxis : {
                axisStyleName : 'column-chart-yaxis',//nullable
                data : {
                   content : null,
                   field : null,
                   max : null,
                   min : null
                },//not null
                axisType : 'y',//nullable  --default : 'x'
                tick : {
                   axisLabelClassName : 'yaxis-label',
                   axisLabel : 'Population'
                },//nullable
                scale : {
                   scaleType : 'number',
                   rangeType : 'range'
                },//nullable
                orient : 'left'
           },
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
            that = $$.chart_internal_val;
            //tooltip = $($$.config.bindto).find($$.config.bindto+'_tooltip');//tooltip selection.
        if( $$.config.data == null || $$.config.data.length == 0 ) {//data가 없으면 그릴 수 없다.
            return;
        }

        if( $$.config.margin !== undefined && $$.config.margin !== null ) {
            that.margin = $$.config.margin;
        }

        var xField = $$.config.xaxis.data.field,
            yField = $$.config.yaxis.data.field,
            groupField = $$.config.childyField,
            xaxisObj = $$.config.xaxis,
            yaxisObj = $$.config.yaxis,
            itemPadding = $$.config.series.padding? $$.config.series.padding:0,
            groupPadding = 0,
            itemWidth = 0,
            seriesWidth = $$.config.series.width? $$.config.series.width:0;

        if( yField === null || yField === undefined ) {
            return;
        }

        //사이즈 설정
        _sizeSetting();

        //dataType에 따른 data parse
        _dataTypeParse();

        //데이터 설정
        _dataSetting();

        //background 설정
        _drawBackground(that.isCreation?undefined:true);

        //axis 설정
        _makeAxis(that.isCreation?undefined:true);

        //background line 설정
        //_drawGridLine(that.isCreation?undefined:true);

        if( $$.config.xaxis.axisDomain.scaleType === 'date' && $$.config.eventData !== null ) {
            _drawEventArea(that.isCreation?undefined:true);
        }else{
            //var eventGroup = that.svg.select('.'+that.selector).select('.event-group');
            //eventGroup.remove();
        }

        //create series
        _drawSeries(that.isCreation?undefined:true);

        if( $$.config.guideData !== null ) {
            _drawGuideLine(that.isCreation?undefined:true);
        }

        if( $$.config.standardData !== null ) {
            _drawStandardLine(that.isCreation?undefined:true);
        }

        //다 그려진 완료 여부 true 설정.
        that.isCreation = true;

        function _sizeSetting() {//chart element's resize event
            /*
            var parent_node = $($$.config.bindto).parent();

            if( parent_node.width() > 0 ) $$.config.size_width = parent_node.width();
            if( parent_node.height() > 0 ) $$.config.size_height = parent_node.height();
            */
            that.width = $$.config.size_width,
            that.height = $$.config.size_height;
        }

        function _dataTypeParse() {//data parse
            if( $$.config.dataType !== 'json' ) {
                //json 타입이 아니고 array일 경우에는 chart data에 맞게 parse 한다.
            }
        }

        function _dataSetting() {//data setting
            // parse in the data
            if( $$.config.dataRenderer ) {
                that.data = $$.config.dataRenderer( $$.config.data );
            }else{
                that.data = $$.config.data;
            }

            if( $$.config.yaxis.data.min !== null && $$.config.yaxis.data.min !== undefined ){
                that.rowMin = +$$.config.yaxis.data.min;
            }

            if( $$.config.yaxis.data.max !== null && $$.config.yaxis.data.max !== undefined ){
                that.rowMax = +$$.config.yaxis.data.max;
            }

            if( that.rowMax > 0 ){
                return;
            }

            //min, max setting
            var maxvalue = -Infinity,
                minvalue = 0;

            for( var i = 0; i < that.data.length; i++ ) {
                var currentObj = null,
                    fieldCompare = 0,
                    obj = null,
                    key = null;

                currentObj = that.data[i];
                for( var j = 0; j < yField.length; j++ ) {
                    key = yField[j];
                    fieldCompare = currentObj[key];
                    maxvalue = Math.max(fieldCompare, maxvalue);
                    minvalue = Math.min(fieldCompare, minvalue);
                }
            }

            //차트 series가 상하에 붙어서 표현되는 것을 방지하기 위해 약간의 가중치를 준다.
            var compare = maxvalue - minvalue;
            that.rowMax = maxvalue+( Math.round( compare*0.1 ) );
            that.rowMin = minvalue;

            /*
            //수치에 따른 left or right padding re setup
            var marginLeft = that.margin.left;
            if( that.rowMax >= 1000 ){
                marginLeft = (8*that.rowMax.toString().length)+5;//+5 는 , 표시 때문에
                that.margin.left = marginLeft;
            }
            */
        }

        function _drawBackground(init) {//chart background setting
            var width = that.width - that.margin.left - that.margin.right,
                height = that.height - that.margin.top - that.margin.bottom,
                bgelement = null,
                defs = null,
                mask = null;
            if( that.svg == null ) {//svg create
                that.svg = d3.select($$.config.bindto).append('svg');
                that.svg.attr('class', $$.config.style_mainChartName);

                that.svg.append('g')//grid line group create
                        .attr('class','grid-line-group');
                that.svg.append('g')//other element group create
                        .attr('class', that.selector);
            }
            /*
            defs = that.svg.select($$.config.bindto+'-clip-path').select('rect')
                           .attr('width',width)
                           .attr('height',height);

            var maskRect = defs.select('.mask-group').select('.mask-rect');
                maskRect.attr('width', width)
                        .attr('height', height);//top여백을 제한 height
            */
            that.svg.attr('width', width + that.margin.left + that.margin.right)
                    .attr('height', height + that.margin.top + that.margin.bottom);//top여백을 제한 height

            that.svg.select('.'+that.selector)
                    .attr('transform', 'translate(' + that.margin.left + ',' + that.margin.top + ')');
        }

        function _makeAxis(init) {//init은 생성 여부.
            /*
            if( that.resizeCallback == null ) {//x축 라벨에 word rapping resize function 적용.
                that.resizeCallback = _resize;
            }
            */
            //x setup
            xaxisObj.svg = that.svg.select('g.'+that.selector),
            xaxisObj.size = {
                width : that.width,
                height : that.height
            },
            xaxisObj.margin = that.margin,
            xaxisObj.data.content = that.data;
            xaxisObj.resizeCallback = _resize;

            //y axis setup
            yaxisObj.svg = xaxisObj.svg,
            yaxisObj.size = xaxisObj.size,
            yaxisObj.axisDomain.domain = [that.rowMin, that.rowMax],
            yaxisObj.margin = that.margin,
            yaxisObj.data.content = that.data,
            yaxisObj.data.max = that.rowMax,
            yaxisObj.data.min =  that.rowMin;

            if( that.data !== null && that.data.length > 0 ) {
                axisMaker.applyAxis(xaxisObj);
                that.xScale = xaxisObj.scale;
                axisMaker.applyAxis(yaxisObj);
                that.yScale = yaxisObj.scale;
            }else{
                console.log('please insert data.');
            }

            if( that.xScale !== null ) {
                var fields = $$.config.yaxis.data.field;
                if( that.childxScale === null ) {
                    that.childxScale = d3.scale.ordinal();
                }

                if( fields === null || fields === undefined ) {//설정되지 않았다면 xField를 제외한 나머지 key를 가져와서 group의 key로 셋팅한다.
                    $$.config.yaxis.data.field = d3.keys(that.data[0]).filter(function(key) { return key !== $$.config.xaxis.data.field; });
                }else{
                    if( fields instanceof Array && fields.length > 0 ) {

                    }else{//array type이 아니면 array로 만든다.
                        fields = [fields];
                    }
                }

                //grouping axis setup
                //scale 이 time 일 경우에는 range, rangeRound 만 가능.
                if( $$.config.xaxis.axisDomain.scaleType !== 'date' ){
                    itemWidth = that.xScale.rangeBand();
                    that.childxScale.domain(fields).rangeBands([0, itemWidth], itemPadding*0.1, .2);
                }else{
                    var width = that.width - that.margin.left - that.margin.right;
                    var fields = $$.config.yaxis.data.field,
                        groupPadding = itemPadding*2;
                    //itemWidth = ( (width-itemPadding)/that.data.length );
                    itemWidth = ( (width-itemPadding*2)/that.data.length )-groupPadding;
                    //itemWidth = ( width/that.data.length );
                    //하나의 group만큼의 width를 가지고 scale을 setup 한다.
                    that.childxScale.domain(fields).rangeBands([0, itemWidth], itemPadding*0.1, .2);
                }
            }else{
                console.log('please configuration axis setup');
            }

        }

        function _resize() {//다시 그려주는 로직. update.....
            _sizeSetting();

            _dataSetting();

            _drawBackground();

            _makeAxis();
        }

        function _drawGridLine(init) {
            var gridg = that.svg.select('.grid-line-group'),
                hgridgroup = null,
                firstTick = null;
                gridg.attr('transform', 'translate(' + that.margin.left + ',' + that.margin.top + ')');
            if(init) {
                that.horizontalGridAxis = d3.svg.axis().scale(that.yScale)
                                            .orient('left')
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
        }

        function _drawSeries(init) {//series create
            var color = d3.scale.ordinal()
                                .range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00']),
                width = that.width - that.margin.left - that.margin.right,
                height = that.height - that.margin.top - that.margin.bottom;
            //series가 출력되는 group 생성.
            var seriesGroup = that.svg.select('.'+that.selector).select('.series-group');
            if( seriesGroup[0][0] == null ){
                seriesGroup = that.svg.select('.'+that.selector)
                                      .append('g')
                                      .attr('class', 'series-group');
            }

            seriesGroup.attr('transform', 'translate(' + 0 + ',' + 0 + ')');

            if( init ) {//series create
                var fields = $$.config.yaxis.data.field;
                that.column_series = d3.columnSeries()
                                       .classname('column-series')
                                       .width(itemWidth)
                                       .height(height)
                                       .groupField(fields)
                                       .colorfn(chartStyleUtil.getCommonColor);
            }

            //if( groupField !== undefined && groupField !== null && groupField !== '' ) {
                //series item을 생성한다.
                //click event binding
                if( $$.config.xaxis.axisDomain.scaleType === 'date' ) {
                    groupPadding = itemPadding;
                }else{
                    groupPadding = 0;
                }
                var itemGroup = seriesGroup.selectAll('.column-series')
                            .data(that.data);
                 var itemGroupEnter = itemGroup.enter()
                                               .append('g')
                                               .attr('class', 'column-series')
                                               .attr('selected','N');
                 itemGroup.attr('transform', function(d,i) {
                                                     return 'translate(' + ( that.xScale(d[xField]) + groupPadding  ) + ',0)';
                                             })
                                             .call(function(ev) {//dom이 다 그려지면 click event bind
                                              if( ev == null || ev.length == 0 ) {
                                                 return;
                                              }
                                              if( $$.config.series.clickFn ) {//config clickFn이 있다면 반영해준다.
                                                 var dom = null;
                                                 var list = ev;
                                                 for( var i = 0; i < list.length; i++ ) {
                                                     dom = $(list[i]);
                                                     dom.unbind('click');
                                                     dom.on('remove', function() {
                                                         dom.unbind('click');
                                                     });
                                                     dom.bind('click', function(ev) {
                                                        var index = i,
                                                            selectedElement = d3.select(this)[0][0].__data__,
                                                            sendData = null,
                                                            isOwner = false;

                                                        if( that.selectedItem ) {
                                                            //unselect set
                                                            that.column_series.setHighlight(that.selectedItem);
                                                            var prevData = that.selectedItem[0][0].__data__;
                                                            if( selectedElement[$$.config.xaxis.data.field[0]] == prevData[$$.config.xaxis.data.field[0]] ) {
                                                                isOwner = true;
                                                            }
                                                        }

                                                        if( isOwner ) {
                                                            that.selectedItem = null;
                                                            sendData = {
                                                                event: ev,
                                                                data : selectedElement,
                                                                target : d3.select(this)
                                                            };
                                                            $$.config.series.clickFn(sendData, false);
                                                            return;
                                                        }
                                                        //select set
                                                        that.column_series.setHighlight(d3.select(this));
                                                        sendData = {
                                                            event: ev,
                                                            data : selectedElement,
                                                            target : d3.select(this)
                                                        };
                                                        $$.config.series.clickFn(sendData, true);
                                                        that.selectedItem = d3.select(this);
                                                    });
                                                 }
                                              }
                                          })
                                          .attr('index',function(d,i){
                                              return i+'';
                                          });
                 //실제로 column series에 데이터를 반영하여 그리도록 한다.
                 itemGroup.call(that.column_series.height(height)
                                                  .width(itemWidth)
                                                  .seriesWidth( $$.config.series.widthIsPersion === true?null:seriesWidth )
                                                  .chartData(that.data)
                                                  .padding(itemPadding)
                                                  .isResize(that.isResize)
                                                  .xScale(that.childxScale)
                                                  .yScale(that.yScale));
                itemGroup.exit().remove();
            //}else{
                //single series

            //}
        }

        function _drawGuideLine(init) {//guide line setup
            var guideGroup = that.svg.select('.'+that.selector).select('.guide-group'),
                width = that.width - that.margin.left - that.margin.right,
                height = that.height - that.margin.top - that.margin.bottom;
            if( guideGroup[0][0] == null ){
                guideGroup = that.svg.select('.'+that.selector)
                                      .append('g')
                                      .attr('class', 'guide-group');
            }

            guideGroup.attr('transform', 'translate(' + 0 + ',' + 0 + ')');

            if( init ) {//event area create
                that.guide_line = d3.guideLine()
                                      .target(guideGroup);
            }

            guideGroup.call(that.guide_line.height(height)
                                               .width(width)
                                               .margin(that.margin)
                                               .yScale(that.yScale)
                                               .guideData($$.config.guideData));
        }

        function _drawStandardLine(init) {
            var standardGroup = that.svg.select('.'+that.selector).select('.standard-group'),
                width = that.width - that.margin.left - that.margin.right,
                height = that.height - that.margin.top - that.margin.bottom;
            if( standardGroup[0][0] == null ){
                standardGroup = that.svg.select('.'+that.selector)
                                    .append('g')
                                    .attr('class', 'standard-group');
            }

            standardGroup.attr('transform', 'translate(' + 0 + ',' + 0 + ')');

            if( init ) {//event area create
                that.standard_line = d3.guideLine()
                                    .target(standardGroup);
            }

            standardGroup.call(that.standard_line.height(height)
                                              .width(width)
                                              .margin(that.margin)
                                              .lineName('standard-line')
                                              .yScale(that.yScale)
                                              .guideData($$.config.standardData));
        }

        function _drawEventArea(init) {//event area setup
            var eventGroup = that.svg.select('.'+that.selector).select('.event-group'),
                width = that.width - that.margin.left - that.margin.right,
                height = that.height - that.margin.top - that.margin.bottom;
            if( eventGroup[0][0] == null ){
                eventGroup = that.svg.select('.'+that.selector)
                                     .append('g')
                                     .attr('class', 'event-group');
            }

            eventGroup.attr('transform', 'translate(' + 0 + ',' + 0 + ')');

            if( init ) {//event area create
                that.event_area = d3.eventArea()
                                    .target(eventGroup);
            }

            eventGroup.call(that.event_area.height(height)
                                           .width(width)
                                           .margin(that.margin)
                                           .padding(groupPadding + itemPadding)
                                           .itemWidth(itemWidth)
                                           .xScale(that.xScale)
                                           .eventData($$.config.eventData));
        }
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
        define('ColumnChart', ['d3'], ColumnChart);
    } else if('undefined' !== typeof exports && 'undefined' !== typeof module) {
        module.exports = ColumnChart;
    } else {
        window.ColumnChart = ColumnChart;
    }

})(window, window.d3, axisMaker);
