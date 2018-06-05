(function (window, d3, d3Zoom) {
    'use strict';

    var ScatterPlot = {
        // TODO set version (OPTION)
        version: "0.0.1",
        chart: {
            fn: Chart.prototype,
            internal: {
                fn: ChartInternal.prototype
            }
        }
    };

    var chart_fn = ScatterPlot.chart.fn,
        chart_internal_fn = ScatterPlot.chart.internal.fn;

    ScatterPlot.generate = function (config) {
        return new Chart(config);
    };

    function Chart(config) {
        var $$ = this.internal = new ChartInternal(this);
        $$.loadConfig(config);
        $$.init();

        // bind "this" to nested API
        (function bindThis(fn, target, argThis) {
            Object.keys(fn).forEach(function (key) {
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
        $$.data = {};
        // $$.cache = {};
        $$.isDebug = false;

        $$.chart_internal_val = {
            chart : {
                svg : null,
                chartAreaEl : null,
                guideGroup : null,
                guideXGroup : null,
                guideYGroup : null,
                axis : {
                    xAxis : null,
                    yAxis : null,
                },
                scale : {
                    xScale : null,
                    yScale : null,
                    colorScale : null,
                },
                data : {
                    node : null,
                    nodeGroup : null
                }
            }
        }
    }

    chart_internal_fn.loadConfig = function (config) {
        var this_config = this.config,
            target, keys, read;

        if(this.isDebug){
            console.log('========== loadConfig ==========',config);
        }

        function find() {
            var key = keys.shift();
            // console.log("key =>", key, ", target =>", target);
            if (key && target && typeof target === 'object' && key in target) {
                target = target[key];
                return find();
            } else if (!key) {
                return target;
            } else {
                return undefined;
            }
        }
        Object.keys(this_config).forEach(function (key) {
            target = config;
            keys = key.split('_');
            read = find();
            // console.log("CONFIG : ", key, read);
            if (isDefined(read)) {
                this_config[key] = read;
            }
        });
    };

    ///////////////////////////////////////////////////////////////////////////
    //
    // START: Define Area
    //
    ///////////////////////////////////////////////////////////////////////////
    // export API
    chart_fn.resize = function (size) {
        var $$ = this.internal,
            config = $$.config;

        if($$.isDebug){
            console.log('========== resize ==========');
        }

        // TODO your coding area (OPTION)
        // .... resize and draw
        config.size_width = size ? size.width : null;
        config.size_height = size ? size.height : null;

        if($$.isDebug){
            console.log('size_width : ', config.size_width, " // size_height", config.size_height);
        }

        $$.draw(config, true);
    };

    chart_fn.load = function (data) {
        var $$ = this.internal,
            config = $$.config;

        if($$.isDebug){
            console.log('========== load ==========');
        }

        // TODO your coding area (OPTION)
        // .... load data and draw. It is option
        config.data = data;

        if($$.isDebug){
            console.log('data : ', config.data);
        }

        $$.draw(config);
    };

    chart_fn.clear = function(){
        var $$ = this.internal,
            config = $$.config,
            that = $$.chart_internal_val;

        if( that.chart.svg ){
            that.chart.svg.remove();
            that.chart.svg = null;
        }
    }

    chart_fn.destroy = function () {
        var $$ = this.internal,
            config = $$.config,
            that = $$.chart_internal_val;

        // TODO release memory (OPTION)
        // ....
        if(config.data) {
            config.data = undefined;
        }

        if(that.chart.svg){
            that.chart.svg.remove();
            that.chart.svg = undefined;
        }

        that = undefined;

    };

    // internal fn : configuration, init
    chart_internal_fn.getDefaultConfig = function () {
        // TODO your coding area (OPTION)
        // you must set => <name>_<name>_<name>: value
        var config = {
            bindto: '#chart',
            data: undefined,
            // size_width: 200,
            // size_height: 100,
            isSampleData : false,
            chart_margins_bottom : 0,
            chart_margins_top : 0,
            chart_margins_left : 0,
            chart_margins_right : 0,
            chart_colorList : [],
            chart_isGuideLine_show : false,
            chart_isGuideLine_showXLine : false,
            chart_isGuideLine_showYLine : false,
            chart_isGuideLine_isShowLineOnXAxis : false,
            chart_isGuideLine_isShowLineOnYAxis : false,
            chart_isGuideLine_xLineColor : '#CCC',
            chart_isGuideLine_yLineColor : '#CCC',
            chart_isGuideLine_lineOpacity : '0.3',
            chart_xAxis_refVal : undefined,
            chart_xAxis_orient : 'buttom',
            chart_xAxis_tickPadding : 2,
            chart_xAxis_className : 'scatter-plot-xAxis',
            chart_xAxis_isShowLabel : true,
            chart_xAxis_labelName : '',
            chart_xAxis_labelClassName : 'scatter-plot-xAxis-label',
            chart_xAxis_show : true,
            chart_xAxis_customValues : undefined,
            chart_xAxis_tickFormat : undefined,
            chart_yAxis_refVal : undefined,
            chart_yAxis_baseWidthRefVal : undefined,
            chart_yAxis_baseWidthRefFormat : undefined,
            chart_yAxis_orient : 'left',
            chart_yAxis_tickPadding : 2,
            chart_yAxis_className : 'scatter-plot-yAxis',
            chart_yAxis_tickFormat : undefined,
            chart_yAxis_isShowLabel : true,
            chart_yAxis_labelName : '',
            chart_yAxis_labelClassName : 'scatter-plot-yAxis-label',
            chart_nodeItem_isShowNodeName : true,
            chart_nodeItem_titleRefVal : undefined,
            chart_nodeItem_colorRefVal : undefined,
            chart_nodeItem_dotSize : 5,
            chart_nodeItem_dotOpacity : 1,
            chart_nodeItem_nodeClassName : 'scatter-plot-node',
            chart_nodeItem_dotClassName : 'scatter-plot-dot',
            chart_nodeItem_clickFn : null,
            chart_nodeItem_mouseOverFn : null,
            chart_nodeItem_mouseOutFn : null,
            chart_nodeItem_colorFn : null,
            chart_areas_show : false,
            chart_areas_data : undefined,
        };

        return config;
    };

    chart_internal_fn.init = function () {
        var $$ = this,
            config = $$.config;

        // TODO your coding area (OPTION)
        // ....
        $$.draw(config);
    };

    ///////////////////////////////
    // TODO your coding area (MUST)
    // .... LINE TEST CODE
    chart_internal_fn.draw = function (config, isResize) {
        var $$ = this,
            config = $$.config,
            that = $$.chart_internal_val;

        if($$.isDebug){
            console.log('========== draw ==========');
        }

        if( isResize === undefined ){
            isResize = false;
        }

        var margin = {
                bottom : config.chart_margins_bottom,
                top : config.chart_margins_top,
                left : config.chart_margins_left,
                right : config.chart_margins_right
            },
            width = 0,
            height = 0,
            axisWidth = 0,
            axisHeight = 0,
            data = config.data;

        _sizeSetting();
        if(_makeScaleAndAxis(isResize)){
            _makeSvgLayout();
            _applyZoom(isResize);
            _applyGuideLine();
            _showChartItem(data)
            if( config.chart_areas_show === true ) {
                /*
                var xfocusData = null,
                    yfocusData = [Math.round(max/2), null, false, 'y guide', ''];
                var focusData = [
                       [xfocusData, yfocusData]
                ];
                */
                if(data === undefined){
                    return;
                }else{
                    if(Array.isArray(data) && data.length == 0){
                        return;
                    }
                }

                if( width <= 0 || height <= 0 ) {
                    return;
                }
                var focusData = config.chart_areas_data,
                    areaMargin = {
                        bottom : config.chart_margins_bottom,
                        top : 0,
                        left : 0,
                        right : config.chart_margins_right
                    };
                if( focusData ) {
                    for( var i = 0; i < focusData.length; i++ ){
                        _drawGuideArea(that.chart.chartAreaEl, i, areaMargin, axisWidth, axisHeight , that.chart.scale.xScale, that.chart.scale.yScale, focusData[i][0], focusData[i][1]);
                    }
                }
            }
            // zoom Function : start


            // window.d3Zoom.applyZoom(that.chart.chartAreaEl, that.chart.axis.xAxis, that.chart.axis.yAxis, that.chart.scale.xScale, that.chart.scale.yScale, customFunction, config.chart_xAxis_className, config.chart_yAxis_className, config.chart_nodeItem_nodeClassName);
            // applyZoomFunction(zoomConfig);
            //zoom Function : end


        }

        function _applyGuideLine(){

            if( !config.chart_isGuideLine_show ){
                return;
            }
            if( that.chart.guideGroup == null ){
                createGuideLine(that.chart.chartAreaEl);
            }

            updateGuideLine(that.chart.guideGroup);
        }



        function createGuideLine(target){
            var xScale = that.chart.scale.xScale;
            var yScale = that.chart.scale.yScale;

            that.chart.guideGroup = target.insert('g', ':first-child').attr('id', 'scatter_plot_guideGroup');

            if( config.chart_isGuideLine_showXLine ){
                that.chart.guideXGroup = that.chart.guideGroup.append('g').attr('id', 'guideXGroup').selectAll('scatter_plot_guideLine_x')
                .data(xScale.ticks())
                .enter()
                .append('line')
                .attr('id', function(d, idx) { return 'scatter_plot_guideLine_x_'+idx})
                .attr('class', 'scatter_plot_guideLine_x')
                .attr('x1', function(d) { return xScale(d); })
                .attr('x2', function(d) { return xScale(d); })
                .attr('y1', yScale(yScale.domain()[0]))
                .attr('y2', yScale(yScale.domain()[1]))
                .style('stroke', config.chart_isGuideLine_xLineColor)
                .style('opacity', function(d, idx){
                    if( idx == 0 ){
                        if( !config.chart_isGuideLine_isShowLineOnYAxis ) {
                            return 0;
                        }
                    }
                    return config.chart_isGuideLine_lineOpacity;
                })
                .style('shape-rendering', 'crispEdges');
            }

            if( config.chart_isGuideLine_showYLine ){
                that.chart.guideYGroup = that.chart.guideGroup.append('g').attr('id', 'guideYGroup').selectAll('scatter_plot_guideLine_y')
                .data(yScale.ticks())
                .enter()
                .append('line')
                .attr('id', function(d, idx) { return 'scatter_plot_guideLine_y_'+idx})
                .attr('class', 'scatter_plot_guideLine_y')
                .attr('x1', xScale(xScale.domain()[0]))
                .attr('x2', xScale(xScale.domain()[1]))
                .attr('y1', function(d) { return yScale(d); })
                .attr('y2', function(d) { return yScale(d); })
                .style('stroke', config.chart_isGuideLine_yLineColor)
                .style('opacity', function(d, idx){
                    if( idx == 0 ){
                        if( !config.chart_isGuideLine_isShowLineOnXAxis ) {
                            return 0;
                        }
                    }
                    return config.chart_isGuideLine_lineOpacity;
                })
                .style('shape-rendering', 'crispEdges');
            }


        }

        function updateGuideLine(){
            var xScale = that.chart.scale.xScale;
            var yScale = that.chart.scale.yScale;

            if( config.chart_isGuideLine_showXLine ){
                that.chart.guideXGroup = that.chart.guideXGroup
                    .data(xScale.ticks());

                // enter
                that.chart.guideXGroup.enter()
                    .append('line')
                    .attr('id', function(d, idx) { return 'scatter_plot_guideLine_x_'+idx})
                    .attr('class', 'scatter_plot_guideLine_x')
                    .attr('x1', function(d) { return xScale(d); })
                    .attr('x2', function(d) { return xScale(d); })
                    .attr('y1', yScale(yScale.domain()[0]))
                    .attr('y2', yScale(yScale.domain()[1]))
                    .style('stroke', config.chart_isGuideLine_xLineColor)
                    .style('opacity', function(d, idx){
                        if( idx == 0 ){
                            if( !config.chart_isGuideLine_isShowLineOnYAxis ) {
                                return 0;
                            }
                        }
                        return config.chart_isGuideLine_lineOpacity;
                    })
                    .style('shape-rendering', 'crispEdges');

                //update
                that.chart.guideXGroup.attr('x1', function(d) {
                    return xScale(d);
                })
                .attr('x2', function(d) {
                    return xScale(d);
                })
                .attr('y1', yScale(yScale.domain()[0]))
                .attr('y2', yScale(yScale.domain()[1]));


                //remove
                that.chart.guideXGroup.exit().remove();
            }

            if( config.chart_isGuideLine_showYLine ){
                that.chart.guideYGroup = that.chart.guideYGroup
                .data(yScale.ticks());
                // enter
                that.chart.guideYGroup.enter()
                    .append('line')
                    .attr('id', function(d, idx) { return 'scatter_plot_guideLine_y_'+idx})
                    .attr('class', 'scatter_plot_guideLine_y')
                    .attr('x1', xScale(xScale.domain()[0]))
                    .attr('x2', xScale(xScale.domain()[1]))
                    .attr('y1', function(d) { return yScale(d); })
                    .attr('y2', function(d) { return yScale(d); })
                    .style('stroke', config.chart_isGuideLine_yLineColor)
                    .style('opacity', function(d, idx){
                        if( idx == 0 ){
                            if( !config.chart_isGuideLine_isShowLineOnXAxis ) {
                                return 0;
                            }
                        }
                        return config.chart_isGuideLine_lineOpacity;
                    })
                    .style('shape-rendering', 'crispEdges');

                //update
                that.chart.guideYGroup.attr('x1', xScale(xScale.domain()[0]))
                .attr('x2', xScale(xScale.domain()[1]))
                .attr('y1', function(d) { return yScale(d); })
                .attr('y2', function(d) { return yScale(d); })

                //exit
                that.chart.guideYGroup.exit().remove();
            }

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

        // not use : 2016/8/3
        function _updateXAxis(){
            var tickCount = 0;
            if( that.chart.chartAreaEl.selectAll('.'+config.chart_xAxis_className).selectAll('g.tick')[0] ){
                tickCount = that.chart.chartAreaEl.selectAll('.'+config.chart_xAxis_className).selectAll('g.tick')[0].length;
            }

            if( tickCount > 0 ){
                that.chart.chartAreaEl.selectAll('.'+config.chart_xAxis_className).selectAll('g.tick')
                .style('opacity', function(d, idx){
                    var width = d3.select(this).node().getBBox().width * 2;
                    var count = tickCount;
                    var xAxisWidth = that.chart.chartAreaEl.selectAll('.'+config.chart_xAxis_className).node().getBBox().width+5;

                    var moc = parseInt(xAxisWidth / width) + 1;

                    if( moc > count ){
                        return 1;
                    }else{
                        if( (idx+1) == tickCount ){
                            return 0;
                        }
                        var flag = ((idx+1) % parseInt(count / moc) == 0)? true: false;
                        if( flag ){
                            return 1;
                        }else{
                            return 0;
                        }
                    }

                });
            }
        }

        function _applyZoom(isResize){

            var afterZoomFunction = function(actionMode){
                //actionMode : zoomout, zoomin 값으로 돌아옴.
                setTimeout(function(){
                    if( config.chart_areas_show === true ) {
                        if( data === undefined ){
                            return;
                        }else{
                            if(Array.isArray(data) && data.length == 0){
                                return;
                            }
                        }

                        if( width <= 0 || height <= 0 ) {
                            return;
                        }
                        var focusData = config.chart_areas_data,
                        areaMargin = {
                            bottom : config.chart_margins_bottom,
                            top : 0,
                            left : 0,
                            right : config.chart_margins_right
                        };

                        var elSize = that.chart.chartAreaEl.select('#scatter_plot_guideGroup').node().getBBox();
                        if( focusData ) {
                            for( var i = 0; i < focusData.length; i++ ){
                                _drawGuideArea(that.chart.chartAreaEl, i, areaMargin, elSize.width, elSize.height , that.chart.scale.xScale, that.chart.scale.yScale, focusData[i][0], focusData[i][1]);
                                //_drawGuideArea(that.chart.chartAreaEl, i, areaMargin, width, ( height - margin.top - margin.bottom), that.chart.scale.xScale, that.chart.scale.yScale, focusData[i][0], focusData[i][1]);
                            }
                        }
                    }
                }, 750);


            }

            var zoomFunction = function(el){
                //config 의 chartEl 이 반환되어져서 옴.
                el.selectAll('.' + config.chart_nodeItem_nodeClassName)
                    .attr('transform', function(d){
                        return "translate(" + that.chart.scale.xScale(d[config.chart_xAxis_refVal]) + "," + that.chart.scale.yScale(d[config.chart_yAxis_refVal]) + ")";
                    })
                    .style('opacity', function(d){
                        var xPos = that.chart.scale.xScale(d[config.chart_xAxis_refVal]);
                        var yPos = that.chart.scale.yScale(d[config.chart_yAxis_refVal]);
                        var checkWidthVal = width;
                        var checkHeightVal = height - margin.top - margin.bottom;

                        if( checkWidthVal <= 0 ) {
                            // checkWidthVal = config.size_width - margin.right - margin.left;
                            checkWidthVal = that.chart.scale.xScale.range()[1];
                        }

                        if( checkHeightVal <= 0 ) {
                            // checkHeightVal = config.size_height - margin.top - margin.bottom;
                            checkHeightVal = that.chart.scale.yScale.range()[0];
                        }

                        // console.log(checkWidthVal, checkHeightVal);

                        if(xPos >= 0 && xPos <= checkWidthVal && yPos >= 0 && yPos <= checkHeightVal){
                            return 1;
                        }else{
                            return 0;
                        }
                    })

                //2016/8/3 : update guideLine
                _applyGuideLine();

            }

            //TODO : zoom 내부에 들어갈 custom 평션을 만들어서 주기.
            var zoomConfig = {
                chartEl : that.chart.chartAreaEl,               //chart group Element
                xAxis : that.chart.axis.xAxis,                  //xAxis
                yAxis : that.chart.axis.yAxis,                  //yAxis
                xScale : that.chart.scale.xScale,               //xScale
                yScale : that.chart.scale.yScale,               //yScale
                xAxisClassName : config.chart_xAxis_className,  //xAxis Class Name
                yAxisClassName : config.chart_yAxis_className,  //yAxis Class Name
                ableScale : 'both',                             // both , x, y
                zoomFunction : zoomFunction,                    //zoom 시 실행될 Function
                afterZoomFunction : afterZoomFunction           //zoom 종료후 실행될 Function
            }

            if( isResize ){
                window.d3Zoom.updateZoom(zoomConfig);
            }else{
                window.d3Zoom.applyZoom(zoomConfig);
            }
        }

        function _sizeSetting(){
            //request : margin, width, height
            if($$.isDebug){
                console.log('==========  _sizeSetting  ========== ');
            }

            var xDomainTitleHeight = 0,
                yDomainTitleWidth= 0,
                yTickWidth = 0,
                xAxisHeight = 0;

            if(data !== undefined && Array.isArray(data) && data.length > 0){
                var checkWidthEl = d3.select('body').append('g').attr('class', 'checkWidth1').attr('opacity', 0).append('text').text(function(d){
                    return d3.extent(data, function(d){
                        if( config.chart_yAxis_baseWidthRefVal ){
                            if( config.chart_yAxis_baseWidthRefFormat ) {
                                return config.chart_yAxis_baseWidthRefFormat(d[config.chart_yAxis_baseWidthRefVal]);
                            }else{
                                return d[config.chart_yAxis_baseWidthRefVal];
                            }
                        }else{
                            if( config.chart_yAxis_tickFormat ) {
                                return config.chart_yAxis_tickFormat(d[config.chart_yAxis_refVal]);
                            }else{
                                return d[config.chart_yAxis_refVal];
                            }
                            // return ;
                        }
                    })[1];
                });

                yTickWidth = checkWidthEl.node().offsetWidth;
                d3.selectAll('.checkWidth1').remove()
                margin.left = config.chart_margins_left + yTickWidth;
            }

            if( config.chart_xAxis_show ){
                xAxisHeight = 20;
            }

            if( config.chart_yAxis_isShowLabel ){
                yDomainTitleWidth = 20;
            }

            if( config.chart_xAxis_isShowLabel ){
                xDomainTitleHeight = 20;
            }


            //차트가 표시되는 영역에 대한 처리.
            var parent_node = $($$.config.bindto).parent();
            
            if( parent_node.width() > 0 ) config.size_width = parent_node.width();
            if( parent_node.width() > 0 ) config.size_height = parent_node.height();
            
            width = config.size_width - margin.left - margin.right - yDomainTitleWidth;
            height = config.size_height - margin.top - margin.bottom - xDomainTitleHeight - xAxisHeight;

            axisWidth = width;
            axisHeight = height;

            if($$.isDebug){
                console.log('before ==========');
                console.log('width : ', width);
                console.log('height : ', height);
            }
            if(width < 0){
                width = 0;
            }
            if(height < 0){
                height = 0;
            }
            
            if($$.isDebug){
                console.log('after ==========');
                console.log('width : ', width);
                console.log('height : ', height);
            }
        }

        function _makeScaleAndAxis( isResize ){
            if($$.isDebug){
                console.log('==========  _makeScaleAndAxis  ========== ');
            }
            var retVal = true;

            if(config.chart_xAxis_refVal == undefined || config.chart_yAxis_refVal == undefined){
                console.log('please check refVal ( x : ', config.chart_xAxis_refVal, ' , ',config.chart_yAxis_refVal, ' )');
                return !retVal;
            }
            //TODO : config 에서 설정할 수 있게끔 변경해주기.
            var valList = {
                xUnitName : config.chart_xAxis_refVal,
                yUnitName : config.chart_yAxis_refVal,
                xAxisOrient : config.chart_xAxis_orient,
                yAxisOrient : config.chart_yAxis_orient,
                xAxisTickPadding : config.chart_xAxis_tickPadding,
                yAxisTickPadding : config.chart_yAxis_tickPadding
            };

            if($$.isDebug){
                console.log('before ==========');
                console.log('valList : ', valList);
                console.log('colorScale : ', that.chart.scale.colorScale);
                console.log('xScale : ', that.chart.scale.xScale);
                console.log('yScale : ', that.chart.scale.yScale);
                console.log('xAxis : ', that.chart.axis.xAxis);
                console.log('yAxis : ', that.chart.axis.yAxis);
            }

            //TODO : custom Color List 를 가져올 지도 모르기 때문에 그에 대한 로직도 만들어두기.
            that.chart.scale.colorScale = d3.scale.category10();

            if( data === undefined ){
                that.chart.scale.xScale = d3.scale.linear().range([0, axisWidth]);
                that.chart.scale.yScale = d3.scale.linear().range([axisHeight, 0]);
            }else{
                if(Array.isArray(data)){
                    if(data.length == 0){
                        that.chart.scale.xScale = d3.scale.linear().range([0, axisWidth]);
                        that.chart.scale.yScale = d3.scale.linear().range([axisHeight, 0]);
                    }else{
                        if( !isResize ){
                            //x축..
                            var xDataRange = d3.extent(data, function(d){
                                return d[valList.xUnitName];
                            });

                            var gapX = xDataRange[1] - xDataRange[0];

                            if( gapX == 0 ){
                                xDataRange[0] = xDataRange[0] - (xDataRange[0] / 10);
                                xDataRange[1] = xDataRange[1] + (xDataRange[1] / 10);
                            }else{
                                xDataRange[0] = xDataRange[0] - (gapX / 10);
                                xDataRange[1] = xDataRange[1] + (gapX / 10);
                            }

                            if( config.chart_xAxis_customValues ){
                                if( Array.isArray(config.chart_xAxis_customValues) && config.chart_xAxis_customValues.length == 2){
                                    xDataRange[0] = config.chart_xAxis_customValues[0];
                                    xDataRange[1] = config.chart_xAxis_customValues[1];
                                }else{
                                    console.log('please check to config.chart_xAxis_customValues..');
                                }
                            }

                            var yDataRange = d3.extent(data, function(d){
                                return d[valList.yUnitName];
                            });

                            var gapY = yDataRange[1] - yDataRange[0];

                            if( gapY == 0 ) {
                                yDataRange[0] = yDataRange[0] - (yDataRange[0] / 10);
                                yDataRange[1] = yDataRange[1] + (yDataRange[1] / 10);
                            } else {
                                yDataRange[0] = yDataRange[0] - (gapY / 10);
                                yDataRange[1] = yDataRange[1] + (gapY / 10);
                            }


                            that.chart.scale.xScale
                                .domain(xDataRange)
                                .nice()
                                .range([0, axisWidth]);

                            that.chart.scale.yScale
                                .domain(yDataRange)
                                .nice()
                                .range([axisHeight, 0]);

                        }
                        else{
                            that.chart.scale.xScale
                            .range([0, axisWidth]);

                            that.chart.scale.yScale
                            .range([axisHeight, 0]);
                        }
                    }
                }
            }

            that.chart.axis.xAxis = d3.svg.axis().scale(that.chart.scale.xScale).orient(valList.xAxisOrient).tickPadding(valList.xAxisTickPadding);
            if( config.chart_xAxis_tickFormat ) {
                that.chart.axis.xAxis.ticks(3).tickFormat( config.chart_xAxis_tickFormat );
            }
            that.chart.axis.yAxis = d3.svg.axis().scale(that.chart.scale.yScale).orient(valList.yAxisOrient).tickPadding(valList.yAxisTickPadding);
            if( config.chart_yAxis_tickFormat ) {
                that.chart.axis.yAxis.tickFormat( config.chart_yAxis_tickFormat );
            }

            if($$.isDebug){
                console.log('after ==========');
                console.log('valList : ', valList);
                console.log('colorScale : ', that.chart.scale.colorScale);
                console.log('xScale : ', that.chart.scale.xScale);
                console.log('yScale : ', that.chart.scale.yScale);
                console.log('xAxis : ', that.chart.axis.xAxis);
                console.log('yAxis : ', that.chart.axis.yAxis);
            }
            return retVal;
        }

        function _makeSvgLayout(){
            var y = that.chart.scale.yScale,
                x = that.chart.scale.xScale,
                yAxis = that.chart.axis.yAxis,
                xAxis = that.chart.axis.xAxis;

            if(that.chart.svg == null){
                that.chart.svg = d3.select(config.bindto)
                    .append("svg").attr("width", config.size_width).attr("height", config.size_height)
                    .style('width', config.size_width)
                    .style('height', config.size_height);

                that.chart.chartAreaEl = that.chart.svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                if(config.chart_xAxis_show){
                    that.chart.chartAreaEl.append("g").attr("class", config.chart_xAxis_className).attr("transform", "translate(0,"  + y.range()[0] + ")").call(xAxis);
                }

                that.chart.chartAreaEl.append("g").attr("class", config.chart_yAxis_className).call(yAxis);


                // that.chart.chartAreaEl.selectAll('.'+config.chart_xAxis_className).selectAll('g.tick')
                //          .attr('transform', 'rotate(-30)');


                //x축 타이틀 라빌..
                if(config.chart_xAxis_isShowLabel){
                    that.chart.chartAreaEl.append("text").attr("class", config.chart_xAxis_labelClassName)
                    .attr("fill", '#414241')
                    .attr('text-anchor', 'middle')
                    .attr('x', config.size_width / 2 - config.chart_margins_left)
                    .attr('y', config.size_height - (config.size_height * 0.051))
                    .text(config.chart_xAxis_labelName);
                }

                //y축 타이틀 라벨..
                if(config.chart_yAxis_isShowLabel){
                    that.chart.chartAreaEl.append("text").attr("class", config.chart_yAxis_labelClassName)
                    .attr("fill", '#414241')
                    .attr('text-anchor', 'middle')
                    .attr('x', -((config.size_height) / 2) + config.chart_margins_bottom + config.chart_margins_top)
                    .attr('y', -(config.chart_margins_left)+10)
                    .attr('transform', 'rotate(-90)')
                    .text(config.chart_yAxis_labelName);
                }

            }else{
                //svg 업데이트.
                that.chart.svg
                    .attr("width", config.size_width)
                    .attr("height", config.size_height)
                    .style('width', config.size_width)
                    .style('height', config.size_height);

                that.chart.chartAreaEl.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                if(config.chart_xAxis_show){
                    that.chart.chartAreaEl.select('.'+config.chart_xAxis_className).attr("transform", "translate(0," + y.range()[0] + ")").call(xAxis);
                }
                that.chart.chartAreaEl.select('.'+config.chart_yAxis_className).call(yAxis);

                if(config.chart_xAxis_isShowLabel){
                    that.chart.chartAreaEl.select('.'+config.chart_xAxis_labelClassName)
                    .attr('x', config.size_width / 2 - config.chart_margins_left)
                    .attr('y', config.size_height - 20)
                    .text(config.chart_xAxis_labelName);
                }

                if(config.chart_yAxis_isShowLabel){
                    that.chart.chartAreaEl.select('.'+config.chart_yAxis_labelClassName)
                    .attr('x', -((config.size_height) / 2) + config.chart_margins_bottom + config.chart_margins_top)
                    .attr('y', -(margin.left)+10)
                    .text(config.chart_yAxis_labelName);
                }
            }
        }

        function _showChartItem(jsonData){
            if($$.isDebug){
                console.log('==========  _showChartItem  ========== ');
            }

            if( jsonData === undefined ){
                return;
            }else{
                try{
                    JSON.stringify(jsonData);
                } catch(e){
                    return;
                }
            }

            if( Array.isArray(jsonData) ){
                if(jsonData.length == 0){
                    return;
                }
            }

            var valueList = {
                xUnitName : config.chart_xAxis_refVal,
                yUnitName : config.chart_yAxis_refVal,
                textPropertyName : config.chart_nodeItem_titleRefVal,
                colorUnitName : config.chart_nodeItem_colorRefVal,
                dotSize : config.chart_nodeItem_dotSize,
                dotOpacity : config.chart_nodeItem_dotOpacity,
                nodeGroupClassName : config.chart_nodeItem_nodeClassName,
                dotClassName : config.chart_nodeItem_dotClassName,
            }
            if($$.isDebug){
                console.log(valueList);
            }
            //check jsonData 가 json 파싱형태를 따르고 있는지 체크.
            that.chart.data.node = that.chart.chartAreaEl.selectAll("g."+valueList.nodeGroupClassName).data(jsonData, function(d){
                return d[valueList.textPropertyName];
            })

            //data enter
            var enterNode = that.chart.data.node.enter()
                .append("g").attr("class", valueList.nodeGroupClassName)
                .attr('transform', function(d) {
                    return "translate(" + that.chart.scale.xScale(d[valueList.xUnitName]) + "," + that.chart.scale.yScale(d[valueList.yUnitName]) + ")";
                });

            enterNode
                .append("circle").attr("r", valueList.dotSize).attr("class", valueList.dotClassName)
                .style('opacity', valueList.dotOpacity)
                .style("fill", config.chart_nodeItem_colorFn)
                // .style("fill", function (d) {
                //     return that.chart.scale.colorScale(d[valueList.colorUnitName]);
                // })
                .call(function(ev) {//dom이 다 그려지면 click event bind
                    if( ev == null || ev.length == 0 ) {
                       return;
                    }
                    try {
                        if( $$.config.chart_nodeItem_clickFn ) {//config legendClickFn이 있다면 반영해준다.
                            var dom = null;
                            var list = ev;
                            for( var i = 0; i < list.length; i++ ) {
                                dom = $(list[i]);
                                dom.on('remove', function() {
                                    this.unbind('click');
                                });
                                dom.bind('click', function(ev) {
                                   var index = i,
                                       selectedElement = d3.select(this)[0][0].__data__,
                                       sendData = null;

                                   sendData = {
                                       event: ev,
                                       data : selectedElement,
                                       target : d3.select(this)
                                   };
                                   $$.config.chart_nodeItem_clickFn(sendData);
                                   ev.stopPropagation();
                               });
                            }
                        }

                        if( $$.config.chart_nodeItem_mouseOutFn ) {//config legendClickFn이 있다면 반영해준다.
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
                                      sendData = null;

                                  sendData = {
                                      event: ev,
                                      data : selectedElement,
                                      target : d3.select(this)
                                  };
                                  $$.config.chart_nodeItem_mouseOutFn(sendData);
                                  ev.stopPropagation();
                              });
                           }
                        }

                    } catch( error ) {

                    }
                });

            if(config.chart_nodeItem_isShowNodeName){
                //node 라벨을 보여주도록 설정될 때, dot 밑에 표시되도록. 위치조절.
                enterNode
                .append("text").style("text-anchor", "middle").attr("dy", -(valueList.dotSize + 5))
                .text(function (d) {
                    // this shouldn't be a surprising statement.
                    return d[valueList.textPropertyName];
                });
            }

            var exitNode = that.chart.data.node.exit().remove();

            //data update
            var updateNode = that.chart.data.node
                .attr('transform', function(d) {
                    return "translate(" + that.chart.scale.xScale(d[valueList.xUnitName]) + "," + that.chart.scale.yScale(d[valueList.yUnitName]) + ")";
                });

            updateNode.selectAll('circle')
                .attr("r", valueList.dotSize).attr("class", valueList.dotClassName)
                .style('opacity', valueList.dotOpacity)
                .style("fill", config.chart_nodeItem_colorFn);
                // .style("fill", function (d) {
                //     return that.chart.scale.colorScale(d[valueList.colorUnitName]);
                // });

            updateNode.selectAll('text')
                .style("text-anchor", "middle").attr("dy", -(valueList.dotSize + 5))
                .text(function (d) {
                    // this shouldn't be a surprising statement.
                    return d[valueList.textPropertyName];
                });
        }
    };

    ///////////////////////////////////////////////////////////////////////////
    //
    // END: Define Area
    //
    ///////////////////////////////////////////////////////////////////////////

    // utils
    var isValue = chart_internal_fn.isValue = function (v) {
            return v || v === 0;
        },
        isFunction = chart_internal_fn.isFunction = function (o) {
            return typeof o === 'function';
        },
        isString = chart_internal_fn.isString = function (o) {
            return typeof o === 'string';
        },
        isUndefined = chart_internal_fn.isUndefined = function (v) {
            return typeof v === 'undefined';
        },
        isDefined = chart_internal_fn.isDefined = function (v) {
            return typeof v !== 'undefined';
        };

    // Support AMD, CommonJS, window
    if (typeof define === 'function' && define.amd) {
        // only d3.js
        define('ScatterPlot', ['d3'], ScatterPlot);
    } else if ('undefined' !== typeof exports && 'undefined' !== typeof module) {
        module.exports = ScatterPlot;
    } else {
        window.ScatterPlot = ScatterPlot;
    }

})(window, window.d3);
