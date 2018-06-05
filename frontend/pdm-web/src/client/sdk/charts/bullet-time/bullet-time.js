(function (window, d3) {
    'use strict';

    var BulletTime = {
        // TODO set version (OPTION)
        version: "0.0.1",
        chart: {
            fn: Chart.prototype,
            internal: {
                fn: ChartInternal.prototype
            }
        }
    };

    var chart_fn = BulletTime.chart.fn,
        chart_internal_fn = BulletTime.chart.internal.fn;

    BulletTime.generate = function (config) {
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
            config = $$.config;

        // TODO your coding area (OPTION)
        // .... resize and draw
        config.size_width = size ? size.width : null;
        config.size_height = size ? size.height : null;
        $$.draw(config);

        _selectItem.call(this);
    };

    chart_fn.load = function (data) {
        var $$ = this.internal,
            config = $$.config;

        // TODO your coding area (OPTION)
        // .... load data and draw. It is option
        if (config.data_columns) {
            config.data_columns = data;
        } else if (config.data_rows) {
            config.data_rows = data;
        }

        $$.draw(config);

        _selectItem.call(this);
    };

    chart_fn.destroy = function () {
        var $$ = this.internal,
            config = $$.config;

        // TODO release memory (OPTION)
        // ....
        if(config.data) {
            config.data = undefined;
        }
        //d3.select(config.bindto).selectAll('svg').remove();
    };

    // internal fn : configuration, init
    chart_internal_fn.getDefaultConfig = function () {
        // TODO your coding area (OPTION)
        // you must set => <name>_<name>_<name>: value
        var config = {
            bindto: '#chart',
            data: undefined,
            data_rows: undefined,
            data_columns: undefined,
            data_columnAliases: undefined,
            size_width: 200,
            size_height: 100,
            // new options
            margin: {},
            axes: undefined,
            axes_xAxis: undefined,
            axes_xAxis_show: undefined,
            axes_xAxis_label: undefined,
            axes_xAxis_max: undefined,
            axes_xAxis_min: undefined,
            axes_xAxis_tick: undefined,
            axes_xAxis_tickFormat: undefined,
            axes_xAxis_tick_show: undefined,
            axes_yAxis: undefined,
            axes_yAxis_show: undefined,
            axes_yAxis_label: undefined,
            axes_yAxis_max: undefined,
            axes_yAxis_min: undefined,
            axes_yAxis_tick: undefined,
            axes_yAxis_tick_show: undefined,
            axes_yAxis_tick_formatter: undefined,
            color: undefined,
            color_ranges: undefined,
            color_measures: undefined,
            color_markers: undefined,
            color_range: undefined,  // callback for getting color of a range
            color_measure: undefined,  // callback for getting color of a measure
            color_marker: undefined,  // callback for getting color of a marker
            label: undefined,
            label_show: true,
            label_position: 'bottom',
            data_startDtts: data_startDtts,
            data_endDtts: data_endDtts,
            data_ranges: data_ranges,
            data_measures: data_measures,
            data_markers: data_markers,
            data_label: data_label,
            events: undefined,
            events_show: false,
            events_labelRotate: undefined,
            events_data: {},
            events_data_data: [],
            events_data_startField: undefined,
            events_data_endField: undefined,
            events_onselected: undefined,     // event area click function
            animation: true,
            // events
            // TODO implement
            data_selectable: true,
            data_onclick: function() {},
            data_onmouseover: function() {},
            data_onmouseout: function() {},
            data_onselected: function() {},     // done
            data_onunselected: function() {},
            tooltip_show: function() {},
            tooltip_hide: function() {},
            // enhance options
            overlay: true,     // true: overlay, false: new starting time = previous ending time
            // multiple select,
            data_selectOptions: undefined,
            data_selectOptions_multiple: false,
            data_selectOptions_multipleFilter: undefined,   // function returns - true: continue selection, false: new selection
            // size enhance
            sizeFactor: {
                measure: 1,
                marker: 1
            },
            sizeFactor_measure: 1,
            sizeFactor_marker: 1,
            zoom: false
        };

        return config;
    };

    chart_internal_fn.init = function () {
        var $$ = this,
            config = $$.config;
        $$.selectedItem = config.data_selectOptions_multiple ? [] : null;

        // TODO your coding area (OPTION)
        // ....
        $$.draw(config, true);
    };

    ///////////////////////////////
    // TODO your coding area (MUST)
    // .... LINE TEST CODE
    chart_internal_fn.draw = function (config, init) {
        var data = config.data_columns,
            $$ = this,
            that = {};

        if (!data || typeof data.length !== 'number' || data.length === 0) {
            // TODO handle exception
            d3.select(config.bindto).selectAll('svg').remove();
            return;
        }

        var len = data.length,
            orient = 'bottom',
            margin = {
                top: 20,
                right: 20,
                bottom: config.axes_xAxis_show ? 40 : 20,
                left: config.axes_yAxis_show ? 55 : 20
            },
            container = d3.select(config.bindto),
            width = config.size_width,
            height = config.size_height,
            xMin = d3.min(data, typeof config.data_startDtts === 'function' ? config.data_startDtts : data_startDtts),
            xMax = d3.max(data, typeof config.data_endDtts === 'function' ? config.data_endDtts : data_endDtts),
            tickInset = (xMax - xMin) * .1,
            yMax = d3.max(data, function(d) {
                return d3.max([d3.max(config.data_ranges(d)), d3.max(config.data_measures(d)), d3.max(config.data_markers(d) || [])]);
            });

        if (config.events_show && config.events_data) {
            xMin = d3.min([xMin, d3.min(config.events_data_data, function(d) {
                return d[config.events_data_startField];
            })]);

            xMax = d3.max([xMax, d3.max(config.events_data_data, function(d) {
                return d[config.events_data_endField];
            })]);
        }
        var containerWidth = $(config.bindto).width();
        var containerHeight = $(config.bindto).height();

        if( width < containerWidth ) {
            width = containerWidth;
        }

        if( height < containerHeight ) {
            height = containerHeight;
        }

/*
        if ( height === 0 ) {
            height = $(config.bindto).height();
        }
*/
        if( config.axes_xAxis_label ) {
            margin.bottom += 10;
        }

        margin = $.extend(true, margin, config.margin);
        
        width = width - (margin.left + margin.right);
        height = height - (margin.top + margin.bottom);
        xMin -= tickInset;
        xMax += tickInset;

        container
            .style({overflow: 'hidden'})
            .selectAll('svg')
                .remove();

        //background click var
        var isItemClick = false;

        var svg = container.append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
              .append("g")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .on('click', function() {
                    if( !isItemClick ) {
                        $$.unselected();
                    } else {
                        isItemClick = false;
                    }
                });
        var x = d3.time.scale()
            .range([0, width]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        that['chart'] = undefined;
        that['chartEl'] = svg;

        if(config.axes_xAxis_tickFormat) {
            xAxis.tickFormat(config.axes_xAxis_tickFormat);
            var tickitemWidth = 60,
                ticks = Math.round(width/tickitemWidth);
            xAxis.ticks(ticks);
        }

        if (!config.axes_xAxis_tick_show) {
            xAxis.ticks(0);
        }

        x.domain([xMin, xMax]);

        if (config.axes_xAxis_show) {
            svg.append("g")
                .attr("class", "x axis g_x_axis")
                .attr("transform", "translate(" + margin.left + "," + (height+margin.top) + ")")
                .call(xAxis);
            if( config.axes_xAxis_label ) {
                svg.append("text")
                    .attr('class', "x axis label")
                    .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
                    .attr("transform", "translate("+ ((width + margin.left + margin.right)/2) +","+((height + margin.top + margin.bottom)-10)+")")  // centre below axis
                    .text(config.axes_xAxis_label);
            }
        }

        var yaxisObj = {
                        size: {
                            width: +config.size_width,
                            height: +config.size_height
                        },
                        axisStyleName : 'g_y_axis',//nullable
                        data : {
                            content : null,
                            field : null,
                            max : yMax+Math.round(yMax*0.2),
                            min : 0
                        },//not null
                        axisType : 'y',//nullable  --default : 'x'
                        isTickVisible: true,//nullable
                        isTruncate: true,
                        tick : {
                            axisLabelClassName : 'bullet-yaxis-label',
                            tickFormat : typeof config.axes_yAxis_tick_formatter ? config.axes_yAxis_tick_formatter : d3.format(".2s"),
                            axisLabel : config.axes_yAxis_label
                        },//nullable
                        axisDomain : {
                            scaleType : 'number',
                            rangeType : 'range',
                            domain: [0, yMax+Math.round(yMax*0.2)],
                            range: [height, 0]
                        },//nullable
                        orient : 'left'
                    };

        //y axis setup
        yaxisObj.svg = svg,
        yaxisObj.margin = margin,
        yaxisObj.isTickVisible = config.axes_yAxis_show,
        yaxisObj.transform = "translate(" + margin.left + "," + margin.top + ")";
        yaxisObj.data.content = data;

        axisMaker.applyAxis(yaxisObj);
        var y = yaxisObj.scale,
            yAxis = yaxisObj.axis;

/*
        var y = d3.scale.linear()
            .range([height, 0]);
        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");
        if (!config.axes_yAxis_tick_show) {
            yAxis.ticks(0);
        }

        y.domain([0, yMax]);

        if (config.axes_yAxis_show) {
            svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(yAxis);
        }
*/

        that['axis'] = {
            x:xAxis,
            y:yAxis
        };
        that['axisClassName'] = {
            x:'g_x_axis',
            y:'g_y_axis'
        };

        var _bullettime = function(){
            that.chart = d3.bullettime()
                .svg(svg)
                .width(width)
                .height(height)
                .start(function(d) {
                    var startDtts = typeof config.data_startDtts === 'function' ? config.data_startDtts(d) : data_startDtts(d);
                    return (that.axis.x.scale().domain()[0] > startDtts) ? that.axis.x.scale().domain()[0] : startDtts;
                 })                
                .end(typeof config.data_endDtts === 'function' ? config.data_endDtts : data_endDtts)
                .ranges(function(d) {
                    var range = config.data_ranges(d);
                    return range.map(function(r) {
                                return that.axis.y.scale().domain()[0] > r ? that.axis.y.scale().domain()[0] : that.axis.y.scale().domain()[1] < r ? that.axis.y.scale().domain()[1] : r;
                            });
                 })
                .measures(config.data_measures)
                .markers(function(d) {
                    var marker = config.data_markers(d);
                    return _.filter(marker,function(m) {
                        return that.axis.y.scale().domain()[0] <= m;
                    });
                 })                
                .rangeColor(typeof config.color_range === 'function' ? config.color_range :
                    config.color_ranges ? color_range : undefined)
                .measureColor(typeof config.color_measure === 'function' ? config.color_measure :
                    config.color_measures ? color_measure : undefined)
                .markerColor(typeof config.color_marker === 'function' ? config.color_marker :
                    config.color_markers ? color_marker : undefined)
                .xAxis(that.axis.x.scale(), config.axes_xAxis_show && config.axes_xAxis_tick_show)
                .yAxis(that.axis.y.scale())
                .animation(init && config.animation)
                .overlay(config.overlay)
                .sizeFactor({
                    measure: config.sizeFactor_measure,
                    marker: config.sizeFactor_marker
                });

            if (config.label_show) {
                that.chart.labelPosition(config.label_position);
                that.chart.label(typeof config.data_label === 'function' ? config.data_label : data_label);
            }
        }

        var _draw = function(){
            if (config.events_show && config.events_data && target.node()) {
                _drawEventArea(config.events_data, config.events_onselected, d3.select(target.node().parentNode), width, height, x, margin, config.events_labelRotate);
            }

            target.selectAll('g').remove();

            target.selectAll('g')
                .data(data)
                .enter()
                .append('g')
                    .attr('id', function(d, i){
                        //z-index를 바꾸기 위함 인데 아직 사용하지 않음.
                        //return ( typeof config.data_label === 'function' ? config.data_label(d) : data_label(d) );
                        return 'bullet-item-'+i;
                    })
                    .attr('class', 'bullet selected')
                    .classed('selected', false)
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                    .on('click', function(d, i) {
                        if (config.data_selectable) {
                            isItemClick = true;
                            var selected = false;
                            if (config.data_selectOptions_multiple) {
                                var index = _.findIndex($$.selectedItem, {index: i});
                                if (index > -1) {
                                    selected = false;
                                } else {
                                    selected = true;
                                }
                            } else {
                                if ($$.selectedItem !== null && $$.selectedItem.data === d) {
                                    selected = false;
                                } else {
                                    selected = true;
                                }
                            }

                            $$.selected(d, i, selected);
                            if (typeof config.data_onselected === 'function') {
                                if (config.data_selectOptions_multiple) {
                                    config.data_onselected.call(this, $$.selectedItem, d, i, selected, d3.event);
                                } else {
                                    config.data_onselected.call(this, d, i, selected, d3.event);
                                }
                            }
                        }
                    })
                    .on('mouseover', function(d, i) {
                        if (typeof config.data_onmouseover === 'function') {
                            config.data_onmouseover.call(this, d3.event, d, i);
                        }
                    })
                    .on('mouseout', function(d, i) {
                        if (typeof config.data_onmouseout === 'function') {
                            config.data_onmouseout.call(this, d3.event, d, i);
                        }
                    })
                    .call(that.chart);

            if ($$.selectedItem && $$.selectedItem.length > 0 && config.data_selectOptions_multiple) {
                $$.selectedItem.forEach(function(item) {
                    $$.selected(item.data, item.index, true);
                }, this);                
            } else if ($$.selectedItem !== null && !config.data_selectOptions_multiple) {
                $$.selected($$.selectedItem.data, $$.selectedItem.index, true);
            }
        }

        _bullettime();

        var zoomTarget = that.chartEl.select('.zoom-wrapper');
        if( zoomTarget[0][0] === null ) {
            zoomTarget = that.chartEl.append('g')
                            .attr('class', 'zoom-wrapper')
                            .attr('width',width)
                            .attr('height',height)
                            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        }

        var target = svg.select('.bullet-wrapper');
        if( target[0][0] === null ) {
            target = svg.append('g').attr('class', 'bullet-wrapper');
        }

        _draw();

        if (config.zoom) {
            that['_draw'] = _draw;
            that['_bullettime'] = _bullettime;

            _applyZoom(zoomTarget);
        }

        function _applyZoom(zoomEl){
            var afterZoomFunction = function(actionMode){}
            var zoomFunction = function(el){
                that._bullettime();
                that._draw();
            }
            //TODO : zoom 내부에 들어갈 custom 평션을 만들어서 주기.
            var zoomConfig = {
                'chartEl' : that.chartEl,               //chart group Element
                'zoomEl' : zoomEl,               //chart group Element
                'xAxis' : that.axis.x,                  //xAxis
                'yAxis' : that.axis.y,                  //yAxis
                'xScale' : that.axis.x.scale(),               //xScale
                'yScale' : that.axis.y.scale(),               //yScale
                'xAxisClassName' : that.axisClassName.x,  //xAxis Class Name
                'yAxisClassName' : that.axisClassName.y,  //yAxis Class Name
                'ableScale' : 'both',                             // both , x, y
                'zoomFunction' : zoomFunction,                    //zoom 시 실행될 Function
                'afterZoomFunction' : afterZoomFunction           //zoom 종료후 실행될 Function                
            }
            window.d3Zoom.applyZoom(zoomConfig);
        }
    };


    chart_internal_fn.selected = function(d, i, selected) {
        var $$ = this,
            config = $$.config;

        if (config.data_selectable) {
            if (config.data_selectOptions_multiple) {
                if (selected && typeof config.data_selectOptions_multipleFilter === 'function' &&
                    !config.data_selectOptions_multipleFilter.call($$, $$.selectedItem, d, i, selected)) {
                     d3.select(config.bindto).selectAll('.selected').classed('selected', false);
                    $$.selectedItem = [];
                }
            } else {
                $$.unselected();
            }

            var node = d3.select(config.bindto).selectAll('g.bullet')[0][i];

            if (selected) {
                if (_.findIndex($$.selectedItem, { data:d }) < 0) {
                    var newSelectedItem = {
                        data: d,
                        index: i,
                        node: node
                    };
                    if (config.data_selectOptions_multiple) {
                        $$.selectedItem.push(newSelectedItem);
                    } else {
                        $$.selectedItem = newSelectedItem;
                    }

                    newSelectedItem = null;
                    if (config.overlay && !config.data_selectOptions_multiple) {
                        node.parentNode.appendChild(node);
                    }
                }
            } else {
                if (config.data_selectOptions_multiple) {
                    var index = _.findIndex($$.selectedItem, {index: i});
                    $$.selectedItem.splice(index, 1);
                } else {
                    $$.selectedItem = null;
                }
            }

            d3.select(node).classed('selected', selected);
        }
    };

    chart_internal_fn.unselected = function(d, i) {
        var $$ = this,
            config = $$.config;

        if (config.overlay && $$.selectedItem && !config.data_selectOptions_multiple && $$.selectedItem.index < d3.select(config.bindto).selectAll('g.bullet')[0].length - 1) {
            if ($$.selectedItem.node.parentNode != null) {
                var count = $$.selectedItem.index,
                    children = $$.selectedItem.node.parentNode.children;
                while(count < children.length - 1) {
                    $$.selectedItem.node.parentNode.appendChild(children[$$.selectedItem.index]);
                    count++;
                }
                children = null;    
            }
        }

        d3.select(config.bindto).selectAll('.selected')
            .classed('selected', false);
        $$.selectedItem = config.data_selectOptions_multiple ? [] : null;
    };

    chart_fn.select = function (item_or_index, selected) {
        var $$ = this.internal,
            config = $$.config,
            data = config.data_columns || config.data_rows;

        if (typeof item_or_index === 'number') {
            $$.selected(data[item_or_index], item_or_index, selected);
        } else if ($.isArray(item_or_index)) {
            item_or_index.forEach(function(item) {
                this.select(item, selected);
            });
        } else {
            var index = data.indexOf(item_or_index);

            if (index > -1) {
                $$.selected(item_or_index, index, selected);
            }
        }
    };

    chart_fn.unselect = function () {
        var $$ = this.internal;

        $$.unselected();
    };

    chart_fn.showEvents = function () {
        var $$ = this.internal,
            config = $$.config;

        config.events_show = true;
        $$.draw(config);

        _selectItem.call(this);
    };

    chart_fn.hideEvents = function() {
        var $$ = this.internal,
            config = $$.config;

        config.events_show = false;
        $$.draw(config);

        _selectItem.call(this);
    };

    function _selectItem() {
        var $$ = this.internal,
            config = $$.config;

        if (config.data_selectOptions_multiple) {
            $$.selectedItem.forEach(function(item) {
                this.select(item.index, true);
            }, this);
        } else if ($$.selectedItem !== null) {
            this.select($$.selectedItem.index, true);
        }
    }

    function _drawEventArea(eventData, clickFn, target, width, height, scale, margin, labelRotation) {//event area setup
        if( eventData && eventData.data && eventData.data.length > 0 ) {
            //var eventGroup = target.append('g')
            /*
            var eventGroup = target.insert('g',':first-child')//event area를 뒤로 보낼때.
                .attr('class', 'event-group')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
            */
            //var event_area = d3.eventArea().target(eventGroup);
            var event_area = d3.eventArea().target(target);

            target.call(event_area.height(height < 15 ? 15 : height)
                                           .width(width < 15 ? 15 : width)
                                           .xScale(scale)
                                           .margin(margin)
                                           .clickFn(clickFn)
                                           .labelRotation(labelRotation)
                                           .eventData(eventData));
        }
    }

    // data callbacks
    function data_startDtts(d) { return d.startDtts; }
    function data_endDtts(d) { return d.endDtts; }
    function data_ranges(d) { return d.ranges; }
    function data_measures(d) { return d.measures; }
    function data_markers(d) { return d.markers || []; }
    function data_label(d) { return d.label; }

    // color callbacks
    function color_range(d, i) { return config.color_ranges[i % config.color_ranges.length]; }
    function color_measure(d, i) { return config.color_measures[i % config.color_measures.length]; }
    function color_marker(d, i) { return config.color_markers[i % config.color_markers.length]; }

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
        define('BulletTime', ['d3'], BulletTime);
    } else if ('undefined' !== typeof exports && 'undefined' !== typeof module) {
        module.exports = BulletTime;
    } else {
        window.BulletTime = BulletTime;
    }

})(window, window.d3);
