(function (window, d3) {
    'use strict';

    var BulletBar = {
        // TODO set version (OPTION)
        version: '0.0.1',
        chart: {
            fn: Chart.prototype,
            internal: {
                fn: ChartInternal.prototype
            }
        }
    };

    var chart_fn = BulletBar.chart.fn,
        chart_internal_fn = BulletBar.chart.internal.fn;

    BulletBar.generate = function (config) {
        return new Chart(config);
    };

    function Chart(config) {
        var $$ = this.internal = new ChartInternal(this);
        $$.loadConfig(config);
        $$.init();

        // bind 'this' to nested API
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
        var $$ = this;
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
            // console.log('key =>', key, ', target =>', target);
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
            // console.log('CONFIG : ', key, read);
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
            orient: 'bottom',         // top, bottom for vertical || left, right for horizontal
            margin: {},
            maxWidth: 50,
            axis: {
                  show: false,
                  showType: 'label', // 'label' or 'axis
                  sync: true,
                  showTicks: false,
                  showDataOnly: true,
                  hidePath: true
              },
            axis_show: false,
            axis_showType: 'label',
            axis_sync: true,
            axis_showTicks: false,
            axis_showDataOnly: true,
            axis_hidePath: true,
            color: undefined,
            color_ranges: undefined,
            color_measures: undefined,
            color_markers: undefined,
            color_range: undefined,  // callback for getting color of a range
            color_measure: undefined,  // callback for getting color of a measure
            color_marker: undefined,  // callback for getting color of a marker
            label: undefined,
            label_show: true,
            animation: true,
            data_selectable: true,
            data_ranges: function(d) { return d.ranges; },
            data_measures: function(d) { return d.measures; },
            data_markers: function(d) { return d.markers || []; },
            data_label: function(d) { return d.label; },
            // events
            // TODO implement
            data_onclick: function() {},
            data_onmouseover: function() {},
            data_onmouseout: function() {},
            data_onselected: function() {},     // done
            data_onunselected: function() {},
            tooltip_show: function() {},
            tooltip_hide: function() {}
        };

        return config;
    };

    chart_internal_fn.init = function () {
        var $$ = this,
            config = $$.config;
        $$.selectedItem = null;

        // TODO your coding area (OPTION)
        // ....
        $$.draw(config, true);
    };

    ///////////////////////////////
    // TODO your coding area (MUST)
    // .... LINE TEST CODE
    chart_internal_fn.draw = function (config, init) {
        var data = config.data_columns || config.data_rows,
            $$ = this;
        if (!data.length) {
            // TODO handle no data
            return;
        }

        var len = data.length,
            orient = typeof config.orient === 'string' ? config.orient.toLowerCase() : '',
            vertical = orient == 'top' || orient == 'bottom',
            margin = vertical ?
                {
                    top: config.label_show && orient === 'top' ? 30 : 10,
                    right: 50 / len,
                    bottom: config.label_show && orient === 'bottom' ? 30 : 10,
                    left: config.axis_show ? 50 / len + 10 : 50 / len
                } :
                {
                    top: 50 / len,
                    right: config.label_show && orient === 'right' ? 50 : 40,
                    bottom: config.axis_show ? 50 / len + 15 : 50 / len,
                    left: config.label_show && orient === 'left' ? 50 : 40
                },
            container = d3.select(config.bindto),
            width = config.size_width,
            height = config.size_height,
            bulletWidth = 0,
            bulletHeight = 0;

            margin = $.extend(true, margin, config.margin);
            
            if (vertical) {
                width = width / len - margin.left - margin.right;
                height -= margin.top + margin.bottom;
                bulletWidth = width > config.maxWidth ? config.maxWidth : width;
                bulletHeight = height;
            } else {
                width -=  margin.left + margin.right;
                height = height / len - margin.top - margin.bottom;
                bulletWidth = width;
                bulletHeight = height > config.maxWidth ? config.maxWidth : height;
            }

        container
            .style({overflow: 'hidden', 'white-space': 'nowrap'})
            .selectAll('svg')
                .remove();

        var max = config.axis_sync ? d3.max(data, function(d) {
                return d3.max([d3.max(config.data_ranges(d)), d3.max(config.data_measures(d)), d3.max(config.data_markers(d) || [])]);
            }) : 0;

        var chart = d3.bulletbar()
            .orient(orient)
            .width(bulletWidth)
            .height(bulletHeight)
            .ranges(config.data_ranges)
            .measures(config.data_measures)
            .markers(config.data_markers)
            .rangeColor(typeof config.color_range === 'function' ? config.color_range :
                config.color_ranges ? function(d, i) { return config.color_ranges[i % config.color_ranges.length]; } : undefined)
            .measureColor(typeof config.color_measure === 'function' ? config.color_measure :
                config.color_measures ? function(d, i) { return config.color_measures[i % config.color_measures.length]; } : undefined)
            .markerColor(typeof config.color_marker === 'function' ? config.color_marker :
                config.color_markers ? function(d, i) { return config.color_markers[i % config.color_markers.length]; } : undefined)
            .maxValue(max)
            .margin(margin)
            .axisOption(config.axis)
            .parentWidth(vertical ? width : height)
            .animation(init && config.animation);

        var svg = container.append("svg")
                .attr("width", '100%')
                .attr("height", '100%')
                .attr('class', 'bullet-bar')
                .append("g");

        var target = svg.selectAll('g')
            .data(data)
            .enter().append('g')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .attr('class', 'bullet selected')
                .classed('selected', false)
                .on('click', function(d, i) {
                    if (config.data_selectable) {
                        if ($$.selectedItem !== null && $$.selectedItem.data === d) {
                            $$.selected(d, i, false);
                            config.data_onselected.call(this, d, i, false, d3.event);
                        } else if (typeof config.data_onselected === 'function') {
                            $$.selected(d, i, true);
                            config.data_onselected.call(this, d, i, true, d3.event);
                        }
                    }
                })
                .attr('transform', function(d, i) {
                    if (vertical) {
                        return 'translate(' + (margin.left + (margin.left + width + margin.right) * i) + ',' + margin.top + ')';
                    } else {
                        return 'translate(' + margin.left + ',' + (margin.top + (margin.top + height + margin.bottom) * i) + ')';
                    }
                })
                .call(chart);

        if (config.label_show) {
            switch (config.orient) {
                case 'bottom':
                    svg.append('g')
                        .append('line')
                        .attr('class', 'line')
                        .attr('x1', 0)
                        .attr('x2', config.size_width)
                        .attr('y1', height + margin.top)
                        .attr('y2', height + margin.top);
                break;
                case 'top':
                    svg.append('g')
                        .append('line')
                        .attr('class', 'line')
                        .attr('x1', 0)
                        .attr('x2', config.size_width)
                        .attr('y1', margin.top)
                        .attr('y2', margin.top);
                break;
                case 'left':
                    svg.append('g')
                        .append('line')
                        .attr('class', 'line')
                        .attr('x1', margin.left)
                        .attr('x2', margin.left)
                        .attr('y1', 0)
                        .attr('y2', config.size_height);
                break;
                case 'right':
                    svg.append('g')
                        .append('line')
                        .attr('class', 'line')
                        .attr('x1', config.size_width - margin.right)
                        .attr('x2', config.size_width - margin.right)
                        .attr('y1', 0)
                        .attr('y2', config.size_height);
                break;
            }


            var label = target.append('g')
                .style('text-anchor', 'middle')
                .attr('width', width);
            label.append('text')
                .attr('class', 'label')
                .attr('text-anchor', vertical ? 'middle' : config.orient === 'left' ? 'end' : 'start')
                .text(typeof config.data_label === 'function' ? config.data_label : function(d) { return d.label; });
            label.attr('transform', function() {
                    if (vertical) {
                        return 'translate(' + (width/2) + ',' + (config.orient === 'bottom' ? height + 20 : 0) + ')';
                    } else {
                        return 'translate(' + (config.orient === 'left' ? -10 : width + 10) + ',' + ((height + label.attr('height') + margin.top) / 2) + ')';
                    }
                });
        }
    };

    chart_internal_fn.selected = function(d, i, selected) {
        var $$ = this,
            config = $$.config;

        if (config.data_selectable) {
            d3.select(config.bindto).selectAll('.selected')
                .classed('selected', false);

            if (selected) {
                $$.selectedItem = {
                    data: d,
                    index: i
                };
                d3.select(d3.select(config.bindto).selectAll('.bullet')[0][i]).classed('selected', true);
            } else {
                $$.selectedItem = null;
            }
        }
    };

    chart_fn.select = function (item_or_index, selected) {
        var $$ = this.internal,
            config = $$.config,
            data = config.data_columns || config.data_rows;

        if (typeof item_or_index === 'number') {
            $$.selected(data[item_or_index], item_or_index, selected);
        } else {
            var index = data.indexOf(item_or_index);

            if (index > -1) {
                $$.selected(item_or_index, index, selected);
            }
        }
    };

    chart_fn.unselect = function () {
        var $$ = this.internal,
            config = $$.config;

        d3.select(config.bindto).selectAll('.selected')
            .classed('selected', false);
        $$.selectedItem = null;
    };
    
    function _selectItem() {
        var $$ = this.internal;
        
        if ($$.selectedItem !== null) {
            this.select($$.selectedItem.index, true);
        }
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
        define('BulletBar', ['d3'], BulletBar);
    } else if ('undefined' !== typeof exports && 'undefined' !== typeof module) {
        module.exports = BulletBar;
    } else {
        window.BulletBar = BulletBar;
    }

})(window, window.d3);
