(function(window, d3, axisMaker) {
    'use strict';

    var Bar = {
        // TODO set version (OPTION)
        version: "0.0.1",
        chart: {
            fn: Chart.prototype,
            internal: {
                fn: ChartInternal.prototype
            }
        }
    };

    var chart_fn = Bar.chart.fn,
        chart_internal_fn = Bar.chart.internal.fn;

    Bar.generate = function(config) {
        return new Chart(config);
    };

    function Chart(config) {
        var $$ = this.internal = new ChartInternal(this);
        $$.loadConfig(config);
        $$.init();

        // bind "this" to nested API
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

    chart_internal_fn.loadConfig = function(config) {
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
        Object.keys(this_config).forEach(function(key) {
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
    chart_fn.resize = function(size) {
        var $$ = this.internal,
            config = $$.config;

        // TODO your coding area (OPTION)
        // .... resize and draw
        config.size.width = size ? size.width : null;
        config.size.height = size ? size.height : null;
        config.isResize = true;

        $$.draw(config);
    };

    chart_fn.load = function(data) {
        var $$ = this.internal,
            config = $$.config;

        // TODO your coding area (OPTION)
        // .... load data and draw. It is option
        config.data = data;
        $$.draw(config);
    };

    chart_fn.destroy = function() {
        var $$ = this.internal,
            config = $$.config,
            that = $$.chart_internal_val;

        // TODO release memory (OPTION)
        // ....
        if (config.data) {
            config.data = undefined;
        }
        if (that.svg) {
            //  that.svg.destroy();
            //  that.svg.selectAll("*").remove();
            d3.select(config.bindto).select('svg').remove();
            that.svg = undefined;
        }
        that = undefined;
    };

    chart_fn.getSelectItems = function() {
        var $$ = this.internal,
            config = $$.config,
            that = $$.chart_internal_val;

        return that.selectItem;
    }

    // internal fn : configuration, init
    chart_internal_fn.getDefaultConfig = function() {
        // TODO your coding area (OPTION)
        // you must set => <name>_<name>_<name>: value
        var config = {
            bindto: '#chart',
            data: undefined,
            data_rows: undefined,
            data_columns: undefined,
            data_columnAliases: undefined,
            size: null,
            size_width: 0,
            size_height: 0,
            margin: null,
            margin_bottom: null,
            max: null,
            yaxis: {
                axisStyleName: 'bar-chart-yaxis', //nullable
                data: {
                    content: null,
                    field: null,
                    max: null,
                    min: null
                }, //not null
                axisType: 'y', //nullable  --default : 'x'
                tick: {
                    axisLabelClassName: 'yaxis-label',
                    axisLabel: 'Population'
                }, //nullable
                scale: {
                    scaleType: 'number',
                    rangeType: 'range'
                }, //nullable
                orient: 'left'
            },
            itemClickFn: null,
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

    chart_internal_fn.init = function() {
        var $$ = this,
            config = $$.config;

        // TODO your coding area (OPTION)
        // ....
        $$.draw(config);
    };

    ///////////////////////////////
    // TODO your coding area (MUST)
    // .... LINE TEST CODE
    chart_internal_fn.draw = function(config) {
        var $$ = this,
            that = $$.chart_internal_val;
        that.width = config.size.width;
        that.height = config.size.height;
        that.margin = config.margin;
        that.max_rect_height = config.max.rectHeight;

        var dataset = config.data;
        dataset = dataset.map(function(d) {
            return d.data.map(function(o, i) {
                // Structure it so that your numeric
                // axis (the stacked amount) is y
                return {
                    y: o.value,
                    x: o.alias,
                    toolId: o.toolId
                };
            });
        });

        var stack = d3.layout.stack();
        stack(dataset);

        dataset = dataset.map(function(d) {
            return d.map(function(d) {
                // Invert the x and y values, and y0 becomes x0
                return {
                    x: d.y,
                    y: d.x,
                    x0: d.y0,
                    toolId: d.toolId
                };
            });
        })

        // svg. 생성되어 있으면 업데이트만 한다.
        if (!that.svg) {
            that.svg = d3.select(config.bindto)
                .append('svg')
                .attr('width', that.width)
                .attr('height', that.height)
                .append('g')
                .attr('transform', 'translate(' + that.margin.left + ',' + that.margin.top + ')')
                .attr('id', 'g-main');
        } else {
            d3.select('svg')
                .attr('width', that.width)
                .attr('height', that.height);
        }

        var xMax = d3.max(dataset, function(group) {
                return d3.max(group, function(d) {
                    return d.x + d.x0;
                });
            }),
            min = 0,

            months = dataset[0].map(function(d) {
                return d.y;
            }),


            yAxisObj = {
                svg: that.svg, //not null
                size: {
                    width: that.width,
                    height: that.height
                }, //not null
                margin: that.margin, //not null
                data: {
                    content: dataset,
                    field: null,
                    max: null,
                    min: null
                }, //not null
                axisType: 'y', //nullable  --default : 'x'
                axisStyleName: 'bar-chart', //nullable
                isTickVisible: true, //nullable
                tick: {
                    axisLabelClassName: 'bar-chart-label',
                    axisLabel: 'Bar-Chart',
                    tickFormat: null
                }, //nullable
                axisDomain: {
                    scaleType: 'normal',
                    rangeType: 'rangeBands',
                    range: [0, that.height - that.margin.top - that.margin.bottom],
                    domain: months
                }, //nullable
                orient: 'left', //nullable
                isTruncate: false, //nullable
                resizeCallback: null, //nullable
            }

        axisMaker.applyAxis(yAxisObj);

        var yScale = yAxisObj.scale,
            xScale = d3.scale.linear()
            .domain([0, xMax])
            .range([0, that.width - that.margin.left - that.margin.right]);

        //bar group들. 생성되어 있으면 업데이트만 한다.
        if (!that.groups) {
            that.groups = that.svg.selectAll('#g-main')
                .data(dataset)
                .enter()
                .append('g')
                .attr('width', that.width)
                .attr('transform', 'translate(1,0)');

            var rects = that.groups.selectAll('rect')
                .data(function(d) {
                    return d;
                })
                .enter()
                .append('rect')
                .attr('x', function(d) {
                    return xScale(d.x0);
                })
                .attr('y', function(d, i) {
                    if (yScale.rangeBand() < that.max_rect_height) {
                        return yScale(d.y);
                    }
                    return (yScale(d.y) + ((yScale.rangeBand() - that.max_rect_height) / 2));
                })
                .attr('height', function(d) {
                    if (yScale.rangeBand() < that.max_rect_height) {
                        return yScale.rangeBand();
                    }
                    // return yScale.rangeBand();
                    return that.max_rect_height;
                })
                .style('fill', function(d, i) {
                    var calc = 0;
                    if (d.x0 != 0) {
                        calc = dataset[0].length;
                    }
                    /* opacity 적용한 Color */
                    // var idxColor = chartStyleUtil.getIndexColor(18);
                    // var r = chartStyleUtil.hex2rgb( idxColor ).r;
                    // var g = chartStyleUtil.hex2rgb( idxColor ).g;
                    // var b = chartStyleUtil.hex2rgb( idxColor ).b;
                    // var a = 1 - i / 10;
                    // var rgb = chartStyleUtil.rgba2rgb( r, g, b, a );
                    // var fillColor = chartStyleUtil.rgb2hex( rgb );

                    var fillColor = chartStyleUtil.getIndexColor(calc + i);
                    return fillColor;
                })
                .on('click', function(d) {
                    var evt = d3.event;
                    d.selected = !d.selected;
                    if (d.selected) {
                        if (that.isSelected) {
                            that.groups.selectAll('rect').style('fill', function(d, i) {
                                // return d3.select(this).attr('prevColor');
                                d.selected = false;

                                var fillColor = chartStyleUtil.getIndexColor(i);
                                return fillColor;
                            });
                        } else {
                            that.isSelected = true;
                        }
                        var prevColor = d3.select(this).style('fill'),
                            newcolor = chartStyleUtil.colorLuminance(prevColor, -0.25),
                            sendData = null,
                            selectedElement = d3.select(this)[0][0].__data__;

                        d3.select(this).attr('prevColor', prevColor);
                        d3.select(this).style('fill', newcolor);

                        sendData = {
                            event: evt,
                            data: selectedElement,
                            target: d3.select(this)
                        };
                        $$.config.itemClickFn(sendData);
                        d.selected = true;


                    } else {
                        d3.select(this).style('fill', d3.select(this).attr('prevColor'));
                        d3.select(this).attr('prevColor', null);
                        that.isSelected = false;
                    }
                })
                .attr('width', 0)
                .transition()
                .duration(500)
                .delay(function(d, i) {
                    return i * 50;
                })
                .attr('width', function(d) {
                    return xScale(d.x);
                });

            that.groups.selectAll("text")
                .data(function(d) {
                    return d;
                })
                .enter().append("text")
                .attr("class", "value")
                .attr("x", 0)
                .transition()
                .duration(500)
                .delay(function(d, i) {
                    return i * 50;
                })
                .attr("x", function(d) {
                    return xScale(d.x); })
                .attr("y", function(d, i) {
                    return yScale(d.y) + yScale.rangeBand() / 2;
                })
                .attr("dx", function(d) {
                    return 12; }) //value margin left
                .attr("dy", ".35em") //vertical align middle
                .text(function(d) {
                    return d.x + 'm';
                });
            // _setMouseEv();
        } else {
            var rects = that.groups.selectAll('rect')
                .attr('x', function(d) {
                    return xScale(d.x0);
                })
                .attr('y', function(d, i) {
                    if (yScale.rangeBand() < that.max_rect_height) {
                        return yScale(d.y);
                    }
                    return (yScale(d.y) + ((yScale.rangeBand() - that.max_rect_height) / 2));
                })
                .attr('height', function(d) {
                    if (yScale.rangeBand() < that.max_rect_height) {
                        return yScale.rangeBand();
                    }
                    // return yScale.rangeBand();
                    return that.max_rect_height;
                })
                // .attr('width', 0)
                .transition()
                .duration(!config.isResize ? 0 : 300)
                .delay(function(d, i) {
                    return i * 50;
                })
                .attr('width', function(d) {
                    return xScale(d.x);

                });

            that.groups.selectAll("text")
                // .attr("x", 0)
                .transition()
                .duration(!config.isResize ? 0 : 300)
                .delay(function(d, i) {
                    return i * 50;
                })
                .attr("x", function(d) {
                    return xScale(d.x); })
                .attr("y", function(d, i) {
                    return (yScale(d.y) + yScale.rangeBand() / 2);
                })
                .attr("dx", function(d) {
                    return 12; }) //value margin left
                .attr("dy", ".35em"); //vertical align middle
            config.isResize = false;
        }

        /*
        function _setMouseEv() {
           if(that.blocks == null) {
              return;
           }

           // .on('click', function(d, xIdx, yIdx){
           //     if(d.selected == undefined || d.selected == false){
           //         d3.select(this).style('fill', config.itemSelectedColor);
           //         d.selected = true;
           //         that.selectItems.push(d);
           //         console.log(that.selectItems);
           //     }else if(d.selected == true){
           //         d3.select(this).style('fill', config.itemMouseoverColor);
           //
           //         //remove selectItem
           //         var findItemIdx = that.selectItems.findIndex(function(item) { return item.title == d.title });
           //         that.selectItems.splice(findItemIdx, 1);
           //         d.selected = false;
           //         console.log(that.selectItems);
           //     }
           //     d3.event.stopPropagation();
           // })

           //외부 custom event 을 걸었는지 체크.
           if(!that.isApplyEv){
              that.blocks.selectAll('.' + config.style_blockItemStyleName + ' rect')
              .call(function(ev) {//dom이 다 그려지면 click event bind
                 if( ev == null || ev.length == 0 ) {
                    return;
                 }
                 if( $$.config.itemClickFn ) {//config legendClickFn이 있다면 반영해준다.
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
                          $$.config.itemClickFn(sendData);
                          ev.stopPropagation();
                       });
                    }
                 }
              });
              //이벤트를 걸어줬으므로, 다시 중복으로 걸지 않게 위해 flag 설정.
              that.isApplyEv = true;
           }

        }
        */
    };

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
    if (typeof define === 'function' && define.amd) {
        // only d3.js
        define('Bar', ['d3'], Bar);
    } else if ('undefined' !== typeof exports && 'undefined' !== typeof module) {
        module.exports = Bar;
    } else {
        window.Bar = Bar;
    }

})(window, window.d3, axisMaker);