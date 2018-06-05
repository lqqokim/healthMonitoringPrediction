(function (window, d3) {
    'use strict';

    var SingleColumn = {
        // TODO set version (OPTION)
        version: "0.0.1",
        chart: {
            fn: Chart.prototype,
            internal: {
                fn: ChartInternal.prototype
            }
        }
    };

    var chart_fn = SingleColumn.chart.fn,
        chart_internal_fn = SingleColumn.chart.internal.fn;

    SingleColumn.generate = function (config) {
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
        $$.chart_internal_val = {
                svg: null,
                width: 0,
                height: 0,
                margin: null,
                groups: null,
                xScale: null,
                yScale: null,
                selectItem: null,
                isResize: false,
                isApplyEv: false,
                isSelected: false
             }
    }

    chart_internal_fn.loadConfig = function (config) {
        var this_config = this.config,
            target, keys, read;

        function find() {
            var key = keys.shift();
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
    };

    chart_fn.load = function (data) {
        var $$ = this.internal,
            config = $$.config;

        // TODO your coding area (OPTION)
        // .... load data and draw. It is option
        config.data = data;
        $$.draw(config);
    };

    chart_fn.destroy = function () {
        var $$ = this.internal,
            config = $$.config,
            that = $$.chart_internal_val;
        // TODO release memory (OPTION)
        // ....
        if(config.data) {
            config.data = undefined;
        }
        /*
        if( that.svg ) {
            //  that.svg.destroy();
            //  that.svg.selectAll("*").remove();
            d3.select(config.bindto).select('svg').remove();
            that.svg = undefined;
         }
         that = undefined;*/
    };
    chart_fn.getSelectItems = function() {
        var $$ = this.internal,
        config = $$.config,
        that = $$.chart_internal_val;

        return that.selectItem;
     }

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
            margin: null,
            itemClickFn : null,
            data_onclick: function() {},
            data_onmouseover: function() {},
            data_onmouseout: function() {},
            data_onselected: function() {},
            data_onunselected: function() {},
            tooltip_show: function() {},
            tooltip_hide: function() {}
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
    chart_internal_fn.draw = function (config) {
        var $$ = this,
        that = $$.chart_internal_val;

        var  container = d3.select(config.bindto),
             w = config.size_width,
             h = config.size_height;

        container
            .style({overflow: 'hidden', 'white-space': 'nowrap'})
            .selectAll('svg')
            .remove();

        var data = config.data;
    /*    if (!that.svg) {
            that.svg = d3.select(config.bindto);
        }*/
//        d3.select("#single-column")
        d3.select(config.bindto)
          .datum(data)
            .call(columnChart()
              .width(w)
              .height(h)
              .x(function(d) { return d.name; })
              .y(function(d) { return d.share; }));

              function columnChart() {
                var margin = {top: 50, right: 10, bottom: 30, left: 30, text: 70, tick: 5},
                    width = w,
                    height = h,
                    xRoundBands = 0.7,
                    xValue = function(d) { return d.name; },
                    yValue = function(d) { return d.share; },
                    xScale = d3.scale.ordinal(),
                    yScale = d3.scale.linear(),
                    yAxis = d3.svg.axis().scale(yScale).orient("left").tickSize(-width),
                    xAxis = d3.svg.axis().scale(xScale);


                function _chart(selection) {
                  selection.each(function(data) {

                    // Convert data to standard representation greedily;
                    // this is needed for nondeterministic accessors.
                //    data = data.map(function(d, i) {
                //      return [xValue.call(data, d, i), yValue.call(data, d, i)];
                //    });
                    // min value
                    var minY = d3.min(data, function(d) {
                        return d.share;
                    });
                    // max value
                    var maxY = d3.max(data, function(d) {
                        return d.share;
                    });
                    // Update the x-scale.
                    xScale
                        .domain(data.map(function(d) { return d.name;} ))
                        .rangeRoundBands([0, width - margin.left - margin.right], xRoundBands);

                    // Update the y-scale.
                    yScale
                        //.domain(d3.extent(data.map(function(d) { return d.share;} )))
                        .domain(d3.extent(data.map(function(d) { return d.share< 0 ? d.share - margin.tick : d.share ;} )))
                        .range([height - margin.top - margin.bottom, 0])
                        .nice();

                    // Select the svg element, if it exists.
//                    var svg = d3.select(this).selectAll("svg").data([data]);
                    var svg = container.selectAll("svg").data([data]);

                    // Otherwise, create the skeletal chart.
                    var gEnter = svg.enter().append("svg").append("g");
                    gEnter.append("g").attr("class", "y single-axis");
                    gEnter.append("g").attr("class", "bars");
                    gEnter.append("g").attr("class", "x single-axis");
                    gEnter.append("g").attr("class", "x single-axis zero");
                    gEnter.append("g").attr("class", "single-text");

                    // Update the outer dimensions.
                    svg .attr("width", width)
                        .attr("height", height);

                    //title text
                    var title = svg.append("text")
                                    .attr({
                                            "font-size" : 15,
                                            "text-anchor" : "middle",
                                            "x" : w/2,
                                            "y" : 15})
                                    .attr("class","single-title");
                    //default title
                    title.text("Lost Time Category");

                    var text = svg.select(".single-text").selectAll(".single-text").data(data);
                    text.enter().append("text");
                    text.text(function(d){ return d.share; })
                        .attr({
                                  "x" : function(d){ return X(d) +xScale.rangeBand()/2; },
                                  "y" : function(d){ return d.share < 0 ? Y(d) +20 : Y(d) - 10; },
                                  "text-anchor" : "middle"
                              });

                    // Update the inner dimensions.
                    var g = svg.select("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                   // Update the bars.
                    var bar = svg.select(".bars").selectAll(".single-bar").data(data);
                    bar.enter().append("rect");
                    bar.on('click', function(d) {
                        title.text( d.name + " - Lot Lost Time");
                       var evt = d3.event;
                       d.selected = !d.selected;
                       if ( d.selected ) {
                          if ( that.isSelected ) {
                             bar.style('fill', function (d, i) {
                            //     return d3.select(this).attr('prevColor');
                                d.selected = false;
                            //    var fillColor = chartStyleUtil.getIndexColor(i);
                            //    return fillColor;
                             });
                          } else {
                             that.isSelected = true;
                          }
                          var prevColor = d3.select(this).style('fill'),
                              newcolor = chartStyleUtil.colorLuminance( prevColor, -0.25 ),
                              sendData = null,
                              selectedElement = d3.select(this)[0][0].__data__;

                          d3.select(this).attr('prevColor', prevColor);
                          d3.select(this).style('fill', newcolor);

                          sendData = {
                             event: evt,
                             data : selectedElement,
                             target : d3.select(this)
                          };
                          $$.config.itemClickFn(sendData);
                          d.selected = true;


                       } else {
                          d3.select(this).style('fill', d3.select(this).attr('prevColor'));
                          d3.select(this).attr('prevColor', null);
                          that.isSelected = false;
                       }
                   });
                    bar.exit().remove();
                    bar.attr("class", function(d) { return d.share < 0 ? "single-bar negative" : "single-bar positive"; })
                        .attr("x", function(d) { return X(d); })
                        .attr("y", height)
                        .attr("width", xScale.rangeBand())
                        .attr("height", 0)
                        .transition()
                        .duration(300)
                        .delay(function (d, i) {
                           return i * 50;
                        })
                        .attr("y", function(d) { return d.share < 0 ? Y0() : Y(d); })
                        .attr({
                         height :function(d) { return Math.abs( Y(d) - Y0());}
                     });


                  // x axis at the bottom of the chart
                   g.select(".x.single-axis")
                      .attr("transform", "translate(0," + (height - margin.top - margin.bottom) + ")")
                      .call(xAxis.orient("bottom"));

                  // zero line
                   g.select(".x.single-axis.zero")
                      .attr("transform", "translate(0," + Y0() + ")")
                      .call(xAxis.tickFormat("").tickSize(0));


                    // Update the y-axis.
                    g.select(".y.single-axis")
                    // .attr("transform", "translate(10, 0)")
                      .call(yAxis);

                  });
                }

              // The x-accessor for the path generator; xScale ∘ xValue.
                function X(d) {
                  return xScale(d.name);
                }

                function Y0() {
                  return yScale(0);
                }

                // The x-accessor for the path generator; yScale ∘ yValue.
                function Y(d) {
                  return yScale(d.share);
                }

                _chart.margin = function(_) {
                  if (!arguments.length) return margin;
                  margin = _;
                  return _chart;
                };

                _chart.width = function(_) {
                  if (!arguments.length) return width;
                  width = _;
                  return _chart;
                };

                _chart.height = function(_) {
                  if (!arguments.length) return height;
                  height = _;
                  return _chart;
                };

                _chart.x = function(_) {
                  if (!arguments.length) return xValue;
                  xValue = _;
                  return _chart;
                };

                _chart.y = function(_) {
                  if (!arguments.length) return yValue;
                  yValue = _;
                  return _chart;
                };

                return _chart;
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
        define('SingleColumn', ['d3'], SingleColumn);
    } else if ('undefined' !== typeof exports && 'undefined' !== typeof module) {
        module.exports = SingleColumn;
    } else {
        window.SingleColumn = SingleColumn;
    }

})(window, window.d3);
