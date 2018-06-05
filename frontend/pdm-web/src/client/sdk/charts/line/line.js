(function(window, d3, chartAxis, chartStyleUtil) {
    'use strict';

    var Line = {
        // TODO set version (OPTION)
        version: "0.0.1",
        chart: {
            fn: Chart.prototype,
            internal: {
                fn: ChartInternal.prototype
            }
        }
    };

    var chart_fn = Line.chart.fn,
        chart_internal_fn = Line.chart.internal.fn;

    Line.generate = function (config) {
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
        $$.chart_internal_val = $$.getDefaultValues();
        // $$.data = {};
        // $$.cache = {};
    }

    chart_internal_fn.loadConfig = function (config) {
        var this_config = this.config,
            target, keys, read;

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
            config = $$.config,
            that = $$.chart_internal_val;
        // TODO your coding area (OPTION)
        // .... resize and draw

        if( !that.isCreation ) return;

        _status($$, '002');

        var parent_node = $(config.bindto);
        parent_node.css('width',size ? size.width : null);
        parent_node.css('height',size ? size.height : null);
        //config.size_height = size ? size.height : null;
        $$.draw($$);
    };

    chart_fn.reload = function (config) {
        var $$ = this.internal;

        _status($$, '002');

        // TODO your coding area (OPTION)
        // .... load data and draw. It is option
        $$.loadConfig(config);
        $$.dataSetting($$);
        $$.draw($$);
    };

    chart_fn.load = function (data) {
        var $$ = this.internal,
            config = $$.config;

        // TODO your coding area (OPTION)
        // .... load data and draw. It is option
        config.data = data;
        $$.draw($$);
    };

    chart_fn.destroy = function () {
        var $$ = this.internal,
            config = $$.config;

        // TODO release memory (OPTION)
        // ....
        if(config.data) {
            config.data = undefined;
        }
    };

    chart_fn.showSeries = function (seriesIndex, show) {
        var $$ = this.internal,
            config = $$.config;

        if (config.series[seriesIndex].show == show) return;

        $$.showSeriesIndex(seriesIndex, show);
    };

    chart_fn.appendSeries = function (data, s) {
        var $$ = this.internal,
            config = $$.config;

        _status($$, '002');

        $$.appendSeriesData(data, s);
    };

    chart_fn.removeSeries = function (seriesIndex) {
        var $$ = this.internal,
            config = $$.config;

        _status($$, '002');

        $$.removeSeriesIndex(seriesIndex);
        
        if ($$.config.data == null || $$.config.data.length == 0){
            _status($$, '001');
            return;
        };    
    };

    chart_fn.setStatusCallback = function (func) {
        var $$ = this.internal,
            that = $$.chart_internal_val,
            config = $$.config;

        
        that.statusCallback = func;
    };

    chart_fn.setOverlayObject = function (overlay) {
        var $$ = this.internal,
            that = $$.chart_internal_val,
            config = $$.config;

        
        _drawOverlayObject(overlay, $$);
    };

    // internal fn : configuration, init
    chart_internal_fn.getDefaultConfig = function () {
        // TODO your coding area (OPTION)
        // you must set => <name>_<name>_<name>: value
        var config = {
            bindto: '#chart',
            data: undefined,
            axies: undefined,
            series: undefined,
            dataRenderer: undefined,
            multiCanvas: false,
            data_onclick: function() {},
            data_onmouseover: function() {},
            data_onmouseout: function() {},
            data_onselected: function() {},
            data_onunselected: function() {},
            tooltip_show: function() {},
            tooltip_hide: function() {},
            overlays: undefined
        };

        return config;
    };

    // internal fn : configuration, init
    chart_internal_fn.getDefaultValues = function () {
        // TODO your coding area (OPTION)
        // you must set => <name>_<name>_<name>: value
        var values = {
            svg : null,                                         //svg영역
            canvas : null,
            margin : {top: 20, right: 50, bottom: 50, left: 50},//여백설정
            width : 0,                                   //여백과 axis를 제외한 series가 그려질 width
            height : 0,                                  //여백과 axis를 제외한 series가 그려질 height
            scales: [],
            axies: [],
            horizontalGridAxis : null,                          //가로 라인 설정
            data : [],                                        //parse 된 box data
            coordinates : {
                data:[],
                xaxisUnionDataTickPoints:[],
                xaxisUnionDataTicks:[]
            },                                        //parse 된 box data
            resizeCallback : null,                              //axis 반영시 word rap 기능을 활성화.
            isCreation : false,                                 //차트 생성여부
            isDataChange : false,                               //데이터 변경 여부
            styleSvgClass: 'canvas',                      //chart background style
            styleMainPanel: 'main-panel',                      //chart background style
            styleAxisClass: 'axis',          //axis style
            styleAxisLabelClass: 'axis-label',             //y axis label style
            styleGridLineGroupClass: 'grid-line-group',
            status: '000',   // 000: done, 001:no data, 002:loading, 003:error
            statusCallback: function() {}
        };

        return values;
    }

    chart_internal_fn.init = function () {
        var $$ = this,
            config = $$.config;

        // TODO your coding area (OPTION)
        // ....
        _status($$, '002');

        $$.dataSetting($$);
        $$.draw($$);
    };

    ///////////////////////////////
    // TODO your coding area (MUST)
    // .... LINE TEST CODE
    chart_internal_fn.draw = function (chart) {
        var $$ = chart;
        var that = $$.chart_internal_val;
        var config = $$.config;

        _canvasSetting($$);

        _scaleSetting($$);

        _panelSizeSetting($$);//,that.isCreation?undefined:true);

        _makeAxis($$);

        _drawLineSeries($$);

        _bindEvent($$);

        _drawOverlay($$);
        
        that.isCreation = true;

        _status($$, '000');
    };

    chart_internal_fn.dataSetting = function (chart) {
        var $$ = chart;
        var that = $$.chart_internal_val;
        var config = $$.config;

        if ($$.config.data.length !== _.compact($$.config.data).length){
            _status($$, '003');
            return;
        };

        if ($$.config.data == null || $$.config.data.length == 0 || _.flatten($$.config.data).length == 0){
            _status($$, '001');
            return;
        };

        if( config.dataRenderer != undefined ){
            that.data = config.dataRenderer( config.data );
        }else{
            that.data = config.data.concat([]);
        }
    };

    function _status(chart, code) {
        var $$ = chart;
        var that = $$.chart_internal_val;
        if (that.status === code) {
            return;
        }

        console.log('code:',code);
        that.status = code;

        (that.statusCallback)(code);
        //$$.target.trigger('chartStatus', $$);
        //$$.chart_internal_val = $.extend(false, {}, $$.chart_internal_val);
        //$$.chart_internal_val.status = code;

    };

    function _canvasSetting(chart) {
        var $$ = chart;
        var that = $$.chart_internal_val;
        var config = $$.config;

        var parent_node = $(config.bindto);

        if( parent_node.width() > 0 ) that.width = parent_node.width();
        if( parent_node.height() > 0 ) that.height = parent_node.height();

        if( that.canvas == null ){//svg create
            that.canvas = d3.select($$.config.bindto).append('div')
                    .attr('class', 'canvas');

            var top = that.canvas.append('div')
                    .attr('class', 'canvas-top');
            top.append('div')
                    .attr('class', 'center');

            var middle = that.canvas.append('div')
                    .attr('class', 'canvas-middle');
            middle.append('div')
                    .attr('class', 'left cell');
            middle.append('div')
                    .attr('class', 'center cell')
                    .append('g')
                    .attr('class', 'series')
                    .append('g')
                    .attr('class', 'effect');  
            middle.append('div')
                    .attr('class', 'right cell');

            var bottom = that.canvas.append('div')
                    .attr('class', 'canvas-bottom');
            bottom.append('div')
                    .attr('class', 'center ');
        } else {
            that.canvas.selectAll('canvas.series').remove();
            that.canvas.selectAll('canvas.effect').remove();
            that.canvas.selectAll('canvas.overlay').remove();
            that.canvas.selectAll('svg').remove();
        }

        var w = that.width - that.margin.left - that.margin.right,
            h = that.height - that.margin.top - that.margin.bottom;

        that.canvas.style({width:that.width, height:that.height});
        
        _getSelectionArea(that.canvas, 'top').style({width:that.width, height:that.margin.top});
        _getSelectionArea(that.canvas, 'bottom').style({width:that.width, height:that.margin.bottom});
        _getSelectionArea(that.canvas).style({width:w, height:h});
        _getSelectionArea(that.canvas, 'left').style({width:that.margin.left, height:h});
        _getSelectionArea(that.canvas, 'right').style({width:that.margin.right, height:h});
    };

    function _getSelectionArea(canvas, type) {
        var axisElements;
        switch (type) {
            case 'top' : 
                axisElements = d3.select(canvas)[0][0].select('div.canvas-top');
                break;
            case 'bottom' : 
                axisElements = d3.select(canvas)[0][0].select('div.canvas-bottom');
                break;
            case 'left' : 
                axisElements = d3.select(canvas)[0][0].select('div.canvas-middle .left');
                break;
            case 'right' : 
                axisElements = d3.select(canvas)[0][0].select('div.canvas-middle .right');
                break;
            default :  
                axisElements = d3.select(canvas)[0][0].select('div.canvas-middle .center');
        };   
        return axisElements;
    };

    function _scaleSetting(chart) {
        var $$ = chart;
        var that = $$.chart_internal_val;
        var config = $$.config;

        that.scales = [];

        config.axies.forEach(function(a){
            that.scales.push(_getScaleByType(a.scale.type));
        });

        _scaleDoaminSetting(chart);

        _scaleRangeSetting(chart);

        _applyScaleData(chart);

        function _getScaleByType(type) {
            var scale = undefined;
            switch (type) {
                case 'date' : 
                    scale = d3.time.scale();
                    break;
                case 'ordinal' : 
                    scale = d3.scale.ordinal();
                    break;
                default :  //'linear'
                    scale = d3.scale.linear();
            };
            return scale;
        };
    }

    function _scaleDoaminSetting(chart) {
        var $$ = chart;
        var that = $$.chart_internal_val;
        var config = $$.config;

        if (that.data == null || that.data.length == 0){
            return;
        };

        var data = that.data;
        var min, max;

        that.scales.forEach(function(scale, $index){
            var a = config.axies[$index];
            if (a.scale.min == undefined || a.scale.max == undefined) {
                min = d3.min(data, function (s) {
                        return d3.min(s, function (d) {
                            return d[a.field];
                        });
                    });
                max = d3.max(data, function (s) {
                        return d3.max(s, function (d) {
                            return d[a.field];
                        });
                    });
            } else {
                min = a.scale.min;
                max = a.scale.max;
            };

            var domainPadding = (max-min)/100*5;
            scale.domain([min-domainPadding, max+domainPadding]);
        });
    }

    function _scaleRangeSetting(chart) {
        var $$ = chart;
        var that = $$.chart_internal_val;
        var config = $$.config;

        var w = _getSelectionArea(that.canvas)[0][0].style.width.slice(0,-2),
            h = _getSelectionArea(that.canvas)[0][0].style.height.slice(0,-2);

        that.scales.forEach(function(scale, $index){
            var a = config.axies[$index];
            if (typeof scale.rangeRoundBands == "function") {
                scale.rangeRoundBands([0 , w], 0.3, 0.3);    
            };

            if (a.orient == 'top' || a.orient == 'bottom') {
                scale.range([0, w]);
            } else {
                scale.range([h, 0]);
            }
        });
    };

    function _applyScaleData(chart) {//series create           
        var $$ = chart;
        var that = $$.chart_internal_val;
        var config = $$.config;

        if (that.data == null || that.data.length == 0){
            return;
        };

        that.coordinates.data = [];
        var xScaleIndex, yScaleIndex;
        that.coordinates.data = that.data.map(function(seriesData, $index) {
            xScaleIndex = _.findIndex(config.axies, {id:config.series[$index].axies[0]});
            yScaleIndex = _.findIndex(config.axies, {id:config.series[$index].axies[1]});
            return seriesData.map(function(d) {
                return [
                        that.scales[xScaleIndex](d[config.axies[xScaleIndex].field]),
                        that.scales[yScaleIndex](d[config.axies[yScaleIndex].field])
                ];
            });
        });

        var seriesIndex, xScaleIndex, yScaleIndex,
            unionPointData = _.flatten(that.coordinates.data.map(function(s, $index) { 
                seriesIndex = $index;
                xScaleIndex = _.findIndex(config.axies, {id:config.series[seriesIndex].axies[0]});
                yScaleIndex = _.findIndex(config.axies, {id:config.series[seriesIndex].axies[1]});

                return s.map(function(d, $index) {
                    return {
                        seriesIndex: seriesIndex,
                        pointIndex: $index,
                        x: d[0],
                        y: d[1]
                    };
                });
            }));

        that.coordinates.xaxisUnionDataTickPoints = _.groupBy(unionPointData,function(d) { return d.x;});
        that.coordinates.xaxisUnionDataTicks = _.sortBy(_.keys(that.coordinates.xaxisUnionDataTickPoints).map(function(d) {return parseFloat(d); }));
    };

    function _panelSizeSetting(chart) {//chart background setting
        var $$ = chart;
        var that = $$.chart_internal_val;
        var config = $$.config;
    };

    function _makeAxis(chart) {//init은 생성 여부.
        var $$ = chart;
        var that = $$.chart_internal_val;
        var config = $$.config;

        if( that.resizeCallback == null ) {//x축 라벨에 word rapping resize function 적용.
            //that.resizeCallback = resize;
        }

        config.axies.forEach(function(a, $index){
            var axis = d3.svg.axis();

            if (that.scales[$index].domain()[0] === NaN || that.scales[$index].domain()[1] === NaN) {
                return;
            };

            axis.scale(that.scales[$index]).orient(a.orient);

            if (a.scale.format) {
                //that.scales[$index].tickFormat(a.scale.format);
                axis.tickFormat(function(val) {
                    return moment(val).format(a.scale.format);
                });
            };
           
            var axisElements = _getSelectionArea(that.canvas, a.orient);
            var svg;
            if ('top,bottom'.indexOf(axis.orient()) > -1) {
                axisElements = axisElements.append('svg').append('g')
                            .attr('transform', 'translate('+(that.margin.left-1)+',0)');
            } else {
                axisElements = axisElements.append('svg').append('g')
                            .attr('transform', 'translate('+(that.margin[axis.orient()]-1)+',0)');
            };

            axisElements.call(axis);

            if ('top,bottom'.indexOf(axis.orient()) > -1) {            
                var ticksWidth = 0, customTickSize = 0;
                axisElements.selectAll('text')[0].some(function(t, $index) {
                    ticksWidth += t.offsetWidth + 40;

                    if (ticksWidth > axisElements[0][0].parentNode.clientWidth) {
                        customTickSize = $index;

                        return true;
                    }
                });  

                if (customTickSize > 0) {
                    axis.ticks(customTickSize);
                    axisElements.call(axis);
                }
            }

            axisElements.attr('class', a.id+'-'+that.styleAxisClass);

            that.axies.push(axis);

            if( typeof that.scales[$index].rangeBand == "function" && that.resizeCallback ) {
                var texts = axis.selectAll('text')
                                 .call(chartAxis.wrap, that.scales[$index].rangeBand(), that.margin, that.resizeCallback);
            }
        });
    };

    function _drawLineSeries(chart) {//series create           
        var $$ = chart;
        var that = $$.chart_internal_val;
        var config = $$.config;

        if (that.data == null || that.data.length == 0){
            return;
        };

        config.series.forEach(function(s, $index) {
            //d3.timer(drawSeries($$, $index), 1000);
            drawSeries($$, $index);
        });
    };

    function appendData(chart,data) {
        var $$ = chart;
        var that = $$.chart_internal_val;
        var config = $$.config;

        config.data.push(data);

        if( config.dataRenderer != undefined ){
            that.data.push(config.dataRenderer(data));
        } else {
            that.data.push(data);
        }

        var seriesIndex = that.data.length-1,
            xScaleIndex = _.findIndex(config.axies, {id:config.series[seriesIndex].axies[0]}),
            yScaleIndex = _.findIndex(config.axies, {id:config.series[seriesIndex].axies[1]}),
            flagChange = false,
            x, y;
        that.coordinates.data.push(that.data[seriesIndex].map(function(d, $index) {
            x = that.scales[xScaleIndex](d[config.axies[xScaleIndex].field]);
            y = that.scales[yScaleIndex](d[config.axies[yScaleIndex].field]);
/*
            if (_.indexOf(that.coordinates.xaxisUnionDataTicks, x) > -1) {
                that.coordinates.xaxisUnionDataTickPoints[x].push({
                            seriesIndex: seriesIndex,
                            pointIndex: $index,
                            x: x,
                            y: y
                        });
            } else {
                flagChange = true;
                that.coordinates.xaxisUnionDataTickPoints = _.extend(that.coordinates.xaxisUnionDataTickPoints, {x:[{
                            seriesIndex: seriesIndex,
                            pointIndex: $index,
                            x: x,
                            y: y
                        }]});
            };
            */
            return [x,y];
        }));
        if (flagChange) {
            that.coordinates.xaxisUnionDataTicks = _.sortBy(_.keys(that.coordinates.xaxisUnionDataTickPoints).map(function(d) {return parseFloat(d); }));

        };

        var seriesIndex, xScaleIndex, yScaleIndex,
            unionPointData = _.compact(_.flatten(that.coordinates.data.map(function(s, $index) { 
                seriesIndex = $index;
                xScaleIndex = _.findIndex(config.axies, {id:config.series[seriesIndex].axies[0]});
                yScaleIndex = _.findIndex(config.axies, {id:config.series[seriesIndex].axies[1]});

                return s.map(function(d, $index) {
                    return {
                        seriesIndex: seriesIndex,
                        pointIndex: $index,
                        x: d[0],
                        y: d[1]
                    };
                });
            })));

        that.coordinates.xaxisUnionDataTickPoints = _.groupBy(unionPointData,function(d) { return d.x;});
        that.coordinates.xaxisUnionDataTicks = _.sortBy(_.keys(that.coordinates.xaxisUnionDataTickPoints).map(function(d) {return parseFloat(d); }));
    };

    function removeData(chart, index) {
        var $$ = chart;
        var that = $$.chart_internal_val;
        var config = $$.config;

        config.data.splice(index,1);
        that.data.splice(index,1);
        that.coordinates.data.splice(index,1);

        var seriesIndex, xScaleIndex, yScaleIndex,
            unionPointData = _.flatten(that.coordinates.data.map(function(s, $index) { 
                seriesIndex = $index;
                xScaleIndex = _.findIndex(config.axies, {id:config.series[seriesIndex].axies[0]});
                yScaleIndex = _.findIndex(config.axies, {id:config.series[seriesIndex].axies[1]});

                return s.map(function(d, $index) {
                    return {
                        seriesIndex: seriesIndex,
                        pointIndex: $index,
                        x: d[0],
                        y: d[1]
                    };
                });
            }));

        that.coordinates.xaxisUnionDataTickPoints = _.groupBy(unionPointData,function(d) { return d.x;});
        that.coordinates.xaxisUnionDataTicks = _.sortBy(_.keys(that.coordinates.xaxisUnionDataTickPoints).map(function(d) {return parseFloat(d); }));
    };

    function drawSeries(chart, seriesIndex) {
        var $$ = chart;
        var that = $$.chart_internal_val;
        var config = $$.config;
        var s = config.series[seriesIndex];

        var seriesElements = _getSelectionArea(that.canvas);      
        var canvas, context;
        if (config.multiCanvas) {
            canvas = appendCanvas(seriesElements, 'g.series', 1);
            context = canvas.getContext('2d');
            canvas.id = 'series_' + seriesIndex;
            canvas.style.visibility = s.show ? 'visible' : 'hidden';
            canvas.className = "series";
        } else {
            canvas = seriesElements.select('g').select('#series')[0][0];
            if (canvas === null) {
                canvas = appendCanvas(seriesElements, 'g.series', -1);
                canvas.id = 'series';
                canvas.className = "series";
            }
            context = canvas.getContext('2d');
        }
        if (s.renderer == 'line') { 
            if (s.show) {
                context.beginPath();
                that.coordinates.data[seriesIndex].forEach(function(d){
                    context.lineTo(d[0],d[1]);
                });
                context.strokeStyle = s.color;
                context.stroke();
            }
            if (s.lineRenderer.scatter.show) {
                //context.arc( data[i].x*xIncrement, canvas.height-(data[i].y * yIncrement), 10, 0, Math.PI * 2, false );
                var scatterSize = s.lineRenderer.scatter.size ? s.lineRenderer.scatter.size : 3;

                context.beginPath();
                that.coordinates.data[seriesIndex].forEach(function(d){
                    context.moveTo(d[0],d[1]);
                    context.arc(d[0],d[1], scatterSize, 0, Math.PI * 2, false );
                });

                if (s.lineRenderer.scatter.stroke) {
                    context.strokeStyle = s.lineRenderer.scatter.strokeStyle ? s.lineRenderer.scatter.strokeStyle : s.color;
                    context.stroke();
                };

                if (s.lineRenderer.scatter.fill) {
                    context.fillStyle = s.lineRenderer.scatter.fillStyle ? s.lineRenderer.scatter.fillStyle : s.color;
                    context.fill();
                };
            };
        };       
    };

    function appendCanvas(element) {
        var canvas = element.append('canvas')[0][0];

        canvas.width = element[0][0].style.width.slice(0,-2);
        canvas.height = element[0][0].style.height.slice(0,-2);
        canvas.style.position = "absolute";
        canvas.style.top = element[0][0].offsetTop + "px";
        canvas.style.left = element[0][0].offsetLeft + "px";   

        return canvas;
    }

    function appendCanvas(element, appendSelector, guide) {
        var canvas, series_g;
        if (guide < 0) {
            canvas = element.select(appendSelector).insert('canvas',':first-child')[0][0];   
        } else {
            canvas = element.select(appendSelector).insert('canvas',':last-child')[0][0];   
        }

        canvas.width = element[0][0].style.width.slice(0,-2);
        canvas.height = element[0][0].style.height.slice(0,-2);
        canvas.style.position = "absolute";
        canvas.style.top = element[0][0].offsetTop + "px";
        canvas.style.left = element[0][0].offsetLeft + "px";   

        return canvas;
    }

    function _drawOverlayObject(overlay, chart) {
        var $$ = chart;
        var that = $$.chart_internal_val;
        var config = $$.config;

        var idx = _.findIndex(config.overlays,{id:overlay.id});
        if (idx > -1) {
            config.overlays[idx] = overlay;
        } else {
            config.overlays.push(overlay);
        }

        _redrawOverlayObject(overlay.canvasId, chart);
    };

    function _redrawOverlayObject(canvasId, chart) {
        var $$ = chart;
        var that = $$.chart_internal_val;
        var config = $$.config;

        var seriesElements = _getSelectionArea(that.canvas);   
        var overlayCanvas = seriesElements.select('#'+canvasId)[0][0];
        if (overlayCanvas === null) {
            overlayCanvas = appendCanvas(seriesElements, 'g.effect', -1);
            overlayCanvas.id = canvasId;
            overlayCanvas.className = "overlay";
        }

        var context = overlayCanvas.getContext('2d'),
            xScaleIndex = undefined,
            yScaleIndex = undefined,
            x, y;

        context.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

        config.overlays.forEach(function(o) {
            if (o.canvasId === canvasId) {
                if (o.type === 'line') {
                    xScaleIndex = _.findIndex(config.axies, {id:o.axies[0]}),
                    yScaleIndex = _.findIndex(config.axies, {id:o.axies[1]}),

                    context.beginPath();

                    o.data.forEach(function(d, $index) {
                        if ('MIN,MAX'.indexOf(d[0]) > -1) {
                            x = getScaleByAxie(d[0], that.axies[xScaleIndex], overlayCanvas);
                        } else {
                            x = that.scales[xScaleIndex](d[0]);
                        };

                        if ('MIN,MAX'.indexOf(d[1]) > -1) {
                            y = getScaleByAxie(d[1], that.axies[yScaleIndex], overlayCanvas);
                        } else {
                            y = that.scales[yScaleIndex](d[1]);
                        };

                        if ($index === 0) {
                            context.moveTo(x, y);
                        } else {
                            context.lineTo(x, y);
                        }
                    });
                    if (o.style === 'dash') {
                        context.setLineDash([2,3]);
                    } else {
                        context.setLineDash([]);
                    }
                    if (o.fillColor !== undefined) {
                        context.fillStyle = o.fillColor;
                        context.fill();
                    }
                    if (o.color !== undefined) {
                        context.strokeStyle = o.color;
                        context.stroke();
                    }
                    context.closePath();

                };
            };
        });     

        function getScaleByAxie(constant, axies, canvas) {
            var value;
            if ('top,bottom'.indexOf(axies.orient()) > -1) {
                if (constant === 'MIN') {
                    value = 0;    
                } else if (constant === 'MAX') {
                    value = canvas.width;
                }
            } else if ('left,right'.indexOf(axies.orient()) > -1) {
                if (constant === 'MIN') {
                    value = canvas.height;   
                } else if (constant === 'MAX') {
                    value = 0;
                }
            }
            return value;
        };        
    };

    function _drawOverlay(chart) {
        var $$ = chart;
        var that = $$.chart_internal_val;
        var config = $$.config;

        if (that.coordinates.data == null || that.coordinates.data.length == 0){
            return;
        };

        if (config.overlays === undefined){
            return;
        };
        
        _.keys(_.groupBy(config.overlays,function(o) { return o.canvasId;})).map(function(id) {
            _redrawOverlayObject(id, chart);
        });
    };

    function _bindEvent(chart) {//series create    
        var $$ = chart;
        var that = $$.chart_internal_val;
        var config = $$.config;

        if (that.coordinates.data == null || that.coordinates.data.length == 0){
            return;
        };
        
        config.axies.forEach(function(a, $index) { 
            if (typeof a.click == "function") {
                if (a.orient == 'bottom') {
                    _getSelectionArea(that.canvas, a.orient).select('svg g')
                        .append("rect")
                        .attr('class', 'eventPanel')
                        .attr('width', _getSelectionArea(that.canvas, a.orient)[0][0].style.width)
                        .attr('height', 20)
                        .attr('stroke-opacity', 0.3)
                        .attr('opacity', 0)
                        .style('cursor', 'hand')
                        .on('click', function(e) {
                            var x = d3.mouse(this)[0];
                            a.click(that.scales[$index].invert(x));
                        })
                        .on('mousemove', function(e) {
                            var x = d3.mouse(this)[0];
                            if (isFunction(a.mousemove)) {
                                a.mousemove(that.scales[$index].invert(x));
                            }
                        });
                };
            };                
        });

        function getPointDatas(x, y) {
            var points = getCoordinateValues(x,y);

            if (points === undefined) {
                return;
            }

            return points;
        }


        function getCoordinateValues(x, y) {
            var pointIndex, st, ed;
            that.coordinates.xaxisUnionDataTicks.forEach(function(t,$index) {
                st = $index == 0 ? 0 : that.coordinates.xaxisUnionDataTicks[$index-1]+((t-that.coordinates.xaxisUnionDataTicks[$index-1])/2);
                ed = $index == that.coordinates.xaxisUnionDataTicks.length-1 ? that.width : t+((that.coordinates.xaxisUnionDataTicks[$index+1]-t)/2);
                
                if (st <= x && x < ed) {
                    pointIndex = t;
                    return;
                };
            });

            if (y == undefined) {
                return that.coordinates.xaxisUnionDataTickPoints[pointIndex].concat([]);
            } else {
                return [getPointByXaxis(that.coordinates.xaxisUnionDataTickPoints[pointIndex], y)];
            }
        }

        function getPointByXaxis(targetPostions, coordinate) {
            var point = {}, st, ed,
                yaxisRealTickValues = _.sortBy(_.pluck(targetPostions,'y'));

            yaxisRealTickValues.forEach(function(t,$index) {
                st = $index == 0 ? 0 : yaxisRealTickValues[$index-1]+((yaxisRealTickValues[$index-1]-t)/2);
                ed = $index == yaxisRealTickValues.length-1 ? that.height : t+((t-yaxisRealTickValues[$index+1])/2);

                if (st <= coordinate && coordinate < ed) {
                    point = targetPostions[_.findIndex(targetPostions,{y:yaxisRealTickValues[$index]})];
                    return;
                };
            });

            return point;
        }
        if (that.status == '002') {
            _status($$, '000');
        };        
    };

    chart_internal_fn.showSeriesIndex = function (seriesIndex, show) {
        var $$ = this;
        var that = $$.chart_internal_val;
        var config = $$.config;
        if (!that.isCreation){
            return;
        };

        var seriesElements = _getSelectionArea(that.canvas);

        //var svg = that.svg.select('.'+that.styleMainPanel);

        seriesElements.selectAll('#series_'+ seriesIndex)[0][0].style.visibility = (show) ? 'visible' : 'hidden';

        config.series[seriesIndex].show = show;
    }

    chart_internal_fn.appendSeriesData = function (data, s) {
        var $$ = this;
        var that = $$.chart_internal_val;
        var config = $$.config;
        if (!that.isCreation){
            return;
        };

        if (s == undefined) {
            s = config.series[config.series.length-1];
        }
        config.series.push(s);
        
        appendData($$,data);

        var xScaleIndex = _.findIndex(config.axies, {id:s.axies[0]}),
            yScaleIndex = _.findIndex(config.axies, {id:s.axies[1]}),
            dataIndex = config.data.length-1;

        var xScale = [
            d3.min(that.data[dataIndex], function (d) {
                return d[config.axies[xScaleIndex].field];
            }),
            d3.max(that.data[dataIndex], function (d) {
                return d[config.axies[xScaleIndex].field];
            })];
        var yScale = [
            d3.min(that.data[dataIndex], function (d) {
                return d[config.axies[yScaleIndex].field];
            }),
            d3.max(that.data[dataIndex], function (d) {
                return d[config.axies[yScaleIndex].field];
            })];


        if (that.scales[xScaleIndex].domain()[0] > xScale[0]
            || that.scales[xScaleIndex].domain()[1] < xScale[1]
            || that.scales[yScaleIndex].domain()[0] > yScale[0]
            || that.scales[yScaleIndex].domain()[1] < yScale[1]
            ) {
            $$.draw($$);
        } else {
            drawSeries($$, config.series.length-1);
        }
        
        _status($$, '000');
    }

    chart_internal_fn.removeSeriesIndex = function (seriesIndex) {
        var $$ = this;
        var that = $$.chart_internal_val;
        var config = $$.config;
        if (!that.isCreation){
            return;
        };

        config.series.splice(seriesIndex, 1);

        removeData($$,seriesIndex);

        var seriesElements = _getSelectionArea(that.canvas);
        setTimeout(function() {
            if (config.multiCanvas) {
                seriesElements.selectAll('#series_'+ seriesIndex).remove();
                _status($$, '000');
            } else {
                $$.draw($$);
            }
        },1000);
    }

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
        define('Line', ['d3'], Line);
    } else if ('undefined' !== typeof exports && 'undefined' !== typeof module) {
        module.exports = Line;
    } else {
        window.Line = Line;
    }

})(window, window.d3, window.chartAxis, window.chartStyleUtil);