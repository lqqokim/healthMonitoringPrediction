(function (window, d3, jQuery) {
    'use strict';

    var Sankey2 = {
        version: "0.0.2",
        chart: {
            fn: Chart.prototype,
            internal: {
                fn: ChartInternal.prototype
            }
        }
    };

    var chart_fn = Sankey2.chart.fn,
        chart_internal_fn = Sankey2.chart.internal.fn;

    Sankey2.generate = function (config) {
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

        $$.chart_internal_val = {
            viewPortEl: undefined, //가로 스크롤 기능을 위한 변수.
            viewPortElHeight: 0, //가로 스크롤 기능을 위한 변수.
            viewPortElWidth: 0, //가로 스크롤 기능을 위한 변수.
            svg: undefined,
            xScale: undefined, //균등한 block 를 생성하기 위한 Scale
            yScale: undefined, //균등한 block 를 생성하기 위한 Scale
            svgWidth: 0, //svg width
            svgHeight: 0, //svg height
            sankey: undefined,
            nodes: undefined,
            links: undefined,
            toggleWaferId: undefined, //selected wafer, node, link
            toggleModuleId: undefined,
            isToggleModuleWarning: false,
            minValue: 0
        };
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

    chart_fn.resize = function (size, rate) {
        var $$ = this.internal,
            config = $$.config;

        // set width rate
        if(rate) {
            config.widthRate = rate;
        }
        config.size_width = size && size.width ? size.width : config.size_width;
        config.size_height = size && size.height ? size.height : config.size_height;
        $$.draw(config);
    };

    chart_fn.load = function (data) {
        var $$ = this.internal,
            config = $$.config;

        config.data = data;
        $$.draw(config);
    };

    chart_fn.destroy = function () {
        var $$ = this.internal,
            config = $$.config;

        if (config.data) {
            config.data = undefined;
        }
    };

    // internal fn : configuration, init
    chart_internal_fn.getDefaultConfig = function () {
        var config = {
            bindto: '#chart',
            data: undefined,

            outer_viewport: 'bistel-sankey2-outer-viewport',

            // default size
            size_width: 3000,
            size_height: 800,
            // limited min size
            size_min_width: 3000,
            size_min_height: 800,

            margin_top: 10,
            margin_bottom: 10,
            margin_left: 10,
            margin_right: 10,

            // Node
            node_width: 20,
            node_height: 10,
            node_padding_vertical: 10,
            node_padding_horizontal: 100,
            node_wafer_padding: 150,
            node_click: function () {},
            node_mouse_in: function () {},
            node_mouse_out: function () {},
            node_menu: function () {},
            node_warning_size: 1,
            node_style_clazz_wafer: 'wafer',
            node_style_clazz_module: 'module',
            node_style_color_wafer_normal: '#c1aa96',
            node_style_color_wafer_selected: '#9a8878',
            node_style_color_wafer_warning_normal: '#fef468',
            node_style_color_wafer_warning_selected: '#b2ab49',
            node_style_color_module_normal: '#8bb0ff',
            node_style_color_module_selected: '#3d7cff',
            node_style_color_module_warning_normal: '#999',
            node_style_color_module_warning_selected: '#555',
            node_style_opacity: '0.4',

            // Link
            link_click: function () {},
            link_mouse_in: function () {},
            link_mouse_out: function () {},
            link_menu: function () {},
            link_warning: function (value) {
                return value > 1 ? true : false;
            },
            link_style_clazz: 'link',
            link_style_color_normal: '#66d200',
            link_style_color_over: '#66d200',
            link_style_color_selected: '#66d200',
            link_style_color_warning: '#f22',
            link_style_color_oos: '#ff3d3d',
            link_style_color_ooc: '#ffd400',
            link_style_opacity_normal: '0.13',
            link_style_opacity_over: '0.6',
            link_style_opacity_selected: '1.1'
        };

        return config;
    };

    chart_internal_fn.init = function () {
        var $$ = this,
            config = $$.config;

        $$.draw(config);
    };

    ///////////////////////////////////////////////////////////////////////////
    //
    // Sankey2 - Wafer Traffic
    //
    // 1) node: wafer, unmanaged module using color
    // 2) link: flow show traffic jam using color
    //
    // references: https://bost.ocks.org/mike/sankey/
    //             http://bl.ocks.org/d3noob/5028304
    // sourc: https://github.com/d3/d3-plugins/tree/master/sankey
    //
    ///////////////////////////////////////////////////////////////////////////
    chart_fn.selectNode = function(moduleId, isUnmanaged) {
        var $$ = this.internal,
            config = $$.config,
            that = $$.chart_internal_val;
        // user have clicked node (module), must unselected
        if(that.toggleModuleId) {
            if (that.isToggleModuleWarning) {
                d3.select('#moduleId-' + that.toggleModuleId)
                    .attr('selected', null)
                    .style('fill', config.node_style_color_module_warning_normal);
            } else {
                d3.select('#moduleId-' + that.toggleModuleId)
                    .attr('selected', null)
                    .style('fill', config.node_style_color_module_normal);
            }
        }
        // select
        if (isUnmanaged) {
            d3.select('#moduleId-' + moduleId)
                .attr('selected', '')
                .style('fill', config.node_style_color_module_warning_selected);
        } else {
            d3.select('#moduleId-' + moduleId)
                .attr('selected', '')
                .style('fill', config.node_style_color_module_selected);
        }
    }

    chart_fn.unSelectNode = function(moduleId, isUnmanaged) {
        var $$ = this.internal,
            config = $$.config;
        if (isUnmanaged) {
            d3.select('#moduleId-' + moduleId).style('fill', config.node_style_color_module_warning_normal);
        } else {
            d3.select('#moduleId-' + moduleId).style('fill', config.node_style_color_module_normal);
        }
    }

    chart_fn.unSelectAll = function() {
        var $$ = this.internal,
            config = $$.config;
        var selecteds = d3.selectAll('[selected]')[0];
        selecteds.forEach(function (selected) {
            if(selected.nodeName === 'path') {
                // Link
                selected.style['cursor'] = '';
                selected.style['stroke-opacity'] = config.link_style_opacity_normal;
            } else if(selected.nodeName === 'circle') {
                // Wafer
                selected.style['fill'] = config.node_style_color_wafer_normal;
            } else if(selected.nodeName === 'rect') {
                // Module
                if(selected.__data__.warning) {
                    selected.style['fill'] = config.node_style_color_module_warning_normal;
                } else {
                    selected.style['fill'] = config.node_style_color_module_normal;
                }
            }
        });
    }

    chart_internal_fn.draw = function (config) {
        var $$ = this,
            that = $$.chart_internal_val,
            formatNumber = d3.format(',.0f'),
            format = function (d) {
                return formatNumber(d);
            };

        // 기본 수치값 계산
        _calcLayout();
        _calcSankey();
        // 그리기
        _drawOuterScrollLayout();
        _drawSankeyLayout();
        _drawLink();
        _drawWafer();
        _drawModule();
        _redrawSankeyLayoutHeight();

        function _calcLayout() {
            that.svgWidth = config.size_width - config.margin_left - config.margin_right,
                that.svgHeight = config.size_height - config.margin_top - config.margin_bottom,
                that.viewPortElHeight = config.size_height;
            // that.viewPortElWidth = config.size_width;

            // min size 보다 작으면 svg size를 재 계산함
            // if(config.size_min_width > that.svgWidth) {
            //     that.viewPortElWidth = config.size_min_width;
            //     that.svgWidth = config.size_min_width - config.margin_left - config.margin_right;
            // }
            if (config.size_min_height > that.svgHeight) {
                that.viewPortElHeight = config.size_min_height;
                that.svgHeight = config.size_min_height - config.margin_top - config.margin_bottom;
            }
        }

        function _calcSankey() {
            that.sankey = $$.sankey()
                .nodeWidth($$.config.node_width)
                .nodePadding($$.config.node_padding_vertical)
                .nodes(config.data.NODE)
                .links(config.data.LINK)
                .layout();
        }

        // 외부 Layout - 상화/좌우 스크롤링
        function _drawOuterScrollLayout() {
            if (!that.viewPortEl) {
                that.viewPortEl = d3.select(config.bindto).append('div')
                    .attr('class', config.outer_viewport)
                    .style('height', that.viewPortElHeight + 'px');
                // .style('width', that.viewPortElWidth + 'px')

            } else {
                that.viewPortEl
                    .style('height', that.viewPortElHeight + 'px');
                // .style('width', that.viewPortElWidth + 'px')
            }
        }

        // Sankey2 영역
        function _drawSankeyLayout() {
            if (!that.svg) {
                that.svg = that.viewPortEl.append('svg')
                    .attr('width', that.svgWidth + config.margin_left + config.margin_right + 70)
                    .attr('height', that.svgHeight + config.margin_top + config.margin_bottom)
                    .append('g')
                    .attr('transform', 'translate(0, 5)');
                // .attr('transform', 'translate(' + config.margin_left + ',' + config.margin_top + ')');
            } else {
                that.viewPortEl.select('svg')
                    .attr('width', that.svgWidth + config.margin_left + config.margin_right + 70)
                    .attr('height', that.svgHeight + config.margin_top + config.margin_bottom);
            }
        }

        function _redrawSankeyLayoutHeight() {
            if (that.minValue < 0) {
                var adjustValue = -that.minValue;

                that.viewPortEl
                    .style('height', (that.viewPortElHeight + + adjustValue) + 'px');
                that.viewPortEl.select('svg')
                    .attr('height', that.svgHeight + config.margin_top + config.margin_bottom + adjustValue);
                that.viewPortEl.select('g')
                    .attr('transform', 'translate(0,' + (adjustValue + 5) + ')');
            }
        }

        // Node for Wafer, Module, Unmanaged Module
        function _drawWafer() {
            if (!that.wafers) {
                that.wafers = that.svg.append('g').selectAll('.wafer')
                    .data(that.sankey.getWafers())
                    .enter().append('g')
                    .attr('class', config.node_style_clazz_wafer)
                    .attr('transform', function (d) {
                        return 'translate(' + d.x + ',' + d.y + ')';
                    });

                that.wafers.append('circle')
                    .attr('id', function (d) {
                        return 'waferId-' + d.node;
                    })
                    .attr('cx', function (d) {
                        return 8;
                    })
                    .attr('cy', function (d) {
                        return 8;
                    })
                    .attr('r', function (d) {
                        return 10;
                    })
                    .on('mouseover', function (d) {
                        if (typeof config.node_mouse_in === 'function') {
                            var evt = d3.event;

                            // 처음과 끝의 툴팁 위치는 틀리게 조정한다.
                            if(d.x === 0) {
                                d.qtip2_my_position = 'bottom left';
                            } else if( d.x > (config.size_width - (config.node_width*3))) {
                                d.qtip2_my_position = 'bottom right';
                            }

                            config.node_mouse_in(evt, d);
                        }
                    })
                    .on('mouseout', function (d) {
                        if (typeof config.node_mouse_out === 'function') {
                            var evt = d3.event;
                            config.node_mouse_out(evt, d);
                        }
                    })
                    .on('click', function (d) {
                        if (typeof config.node_click === 'function') {
                            var evt = d3.event;

                            // Multi Selection
                            var selected = evt.target.getAttribute('selected');
                            if(selected === undefined || selected === null) {
                                if (typeof config.node_menu === 'function') {
                                    config.node_menu(evt, d);
                                }
                                // first arguement: event object, second argument: data
                                if (typeof config.node_click === 'function') {
                                    config.node_click(evt, d);
                                }

                                if(d.type === 'module') {
                                    // only for module node
                                    evt.target.setAttribute('selected', '');
                                    if(d.warning) {
                                        d3.select(this).style('fill', config.node_style_color_module_warning_selected);
                                    } else {
                                        d3.select(this).style('fill', config.node_style_color_module_selected);
                                    }
                                } else {
                                    // for wafer node
                                    _selectWafer(d.node, true);
                                }
                            } else {
                                if(d.type === 'module') {
                                    evt.target.removeAttribute('selected');
                                    if(d.warning) {
                                        d3.select(this).style('fill', config.node_style_color_module_warning_normal);
                                    } else {
                                        d3.select(this).style('fill', config.node_style_color_module_normal);
                                    }
                                } else {
                                    _selectWafer(d.node, false);
                                }
                            }
                        }
                    })
                    .style('fill', function (d) {
                        if (d.warning) {
                            if (d.type === 'wafer') {
                                return d.color = config.node_style_color_wafer_warning_normal;
                            } else {
                                return d.color = config.node_style_color_module_warning_normal;
                            }
                        } else {
                            if (d.type === 'wafer') {
                                return d.color = config.node_style_color_wafer_normal;
                            } else {
                                return d.color = config.node_style_color_module_normal;
                            }
                        }
                    })
                    .style('stroke', function (d) {
                        return d3.rgb(d.color).darker(1);
                    });

                // 가로줄
                _drawWaferLine(0, 4, 16, 4);
                _drawWaferLine(-1, 8, 16, 8);
                _drawWaferLine(0, 12, 16, 12);
                // 세로줄
                _drawWaferLine(3, 0, 3, 16);
                _drawWaferLine(7, -1, 7, 16);
                _drawWaferLine(11, 0, 11, 16);

                // add in the title for the wafers
                that.wafers.append('text')
                    .style("font-size","11px")
                    .attr('x', -4)
                    .attr('y', function (d) {
                        return d.dy / 2;
                    })
                    .attr('dy', '.35em')
                    .attr('text-anchor', 'end')
                    .attr('transform', null)
                    .text(function (d) {
                        return d.name;
                    })
                    // .filter(function (d) {
                    //     return d.x < (config.size_width - (config.node_width*3));
                    // })
                    .filter(function (d) {
                        return d.x > (config.node_width + config.node_wafer_padding);
                    })
                    .attr('x', 4 + that.sankey.nodeWidth())
                    .attr('text-anchor', 'start');

            } else {
                // 새롭게 계산된 데이터를 넣어준다
                that.wafers.data(that.sankey.getWafers());

                d3.selectAll('.wafer')
                    .attr('transform', function (d) {
                        return 'translate(' + d.x + ',' + d.y + ')';
                    });
                d3.selectAll('.wafer circle')
                    .attr('cx', function (d) {
                        return 8;
                    })
                    .attr('cy', function (d) {
                        return 8;
                    })
                    .attr('r', function (d) {
                        return 10;
                    });
                d3.selectAll('.wafer text')
                    .attr('x', -4)
                    .attr('y', function (d) {
                        return d.dy / 2;
                    })
                    // .filter(function (d) {
                    //     return d.x < (config.size_width - (config.node_width*3));
                    // })
                    .filter(function (d) {
                        return d.x > (config.node_width + config.node_wafer_padding);
                    })
                    .attr('x', 4 + that.sankey.nodeWidth());
            }
        }

        function _drawWaferLine(x1, y1, x2, y2) {
            that.wafers.append('line')
                .attr('x1', x1)
                .attr('y1', y1)
                .attr('x2', x2)
                .attr('y2', y2)
                .style('stroke', function (d) {
                    return d3.rgb(d.color).brighter(0.4);
                });
        }

        function _drawModule() {
            if (!that.nodes) {
                that.nodes = that.svg.append('g').selectAll('.module')
                    .data(that.sankey.getModules())
                    .enter().append('g')
                    .attr('class', config.node_style_clazz_module)
                    .attr('transform', function (d) {
                        return 'translate(' + d.x + ',' + d.y + ')';
                    });

                // add the rectangles for the nodes
                that.nodes.append('rect')
                    .attr('id', function (d) {
                        return 'moduleId-' + d.node;
                    })
                    .attr('class', function (d) {
                        return 'moduleId-' + d.node;
                    })
                    .attr('height', function (d) {
                        return d.dy;
                    })
                    .attr('width', that.sankey.nodeWidth())
                    .on('mouseover', function (d) {
                        if (typeof config.node_mouse_in === 'function') {
                            var evt = d3.event;

                            // 처음과 끝의 툴팁 위치는 틀리게 조정한다.
                            if(d.x === 0) {
                                d.qtip2_my_position = 'bottom left';
                            } else if( d.x > (config.size_width - (config.node_width*3))) {
                                d.qtip2_my_position = 'bottom right';
                            }

                            config.node_mouse_in(evt, d);
                        }
                    })
                    .on('mouseout', function (d) {
                        if (typeof config.node_mouse_out === 'function') {
                            var evt = d3.event;
                            config.node_mouse_out(evt, d);
                        }
                    })
                    .on('click', function (d) {
                        if (typeof config.node_click === 'function') {
                            var evt = d3.event;

                            // Multi Selection
                            var selected = evt.target.getAttribute('selected');
                            if(selected === undefined || selected === null) {
                                if (typeof config.node_menu === 'function') {
                                    config.node_menu(evt, d);
                                }
                                // first arguement: event object, second argument: data
                                if (typeof config.node_click === 'function') {
                                    config.node_click(evt, d);
                                }

                                if(d.type === 'module') {
                                    // only for module node
                                    evt.target.setAttribute('selected', '');
                                    if(d.warning) {
                                        d3.select(this)
                                            .style('fill', function(d) {
                                                return d.color = config.node_style_color_module_warning_selected;
                                            })
                                            .style('stroke', function (d) {
                                                return d3.rgb(d.color).darker(0.8);
                                            });
                                    } else {
                                        d3.select(this)
                                            .style('fill', function(d) {
                                                return d.color = config.node_style_color_module_selected;
                                            })
                                            .style('stroke', function (d) {
                                                return d3.rgb(d.color).darker(0.8);
                                            });
                                    }
                                } else {
                                    // for wafer node
                                    _selectWafer(d.node, true);
                                }
                            } else {
                                if(d.type === 'module') {
                                    evt.target.removeAttribute('selected');
                                    if(d.warning) {
                                        d3.select(this)
                                            .style('fill', function(d) {
                                                return d.color = config.node_style_color_module_warning_normal;
                                            })
                                            .style('stroke', function (d) {
                                                return d3.rgb(d.color).darker(0.8);
                                            });
                                    } else {
                                        d3.select(this)
                                            .style('fill', function(d) {
                                                return d.color = config.node_style_color_module_normal;
                                            })
                                            .style('stroke', function (d) {
                                                return d3.rgb(d.color).darker(0.8);
                                            });
                                    }
                                } else {
                                    _selectWafer(d.node, false);
                                }
                            }
                        }
                    })
                    .style('fill', function (d) {
                        if (d.warning) {
                            return d.color = config.node_style_color_module_warning_normal;
                        } else {
                            return d.color = config.node_style_color_module_normal;
                        }
                    })
                    .style('stroke', function (d) {
                        return d3.rgb(d.color).darker(0.8);
                    })
                    .style('stroke-opacity', config.node_style_opacity)
                    .style('fill-opacity', config.node_style_opacity);

                // add in the title for the nodes
                that.nodes.append('text')
                    .style("font-size","11px")
                    .attr('x', -4)
                    .attr('y', function (d) {
                        return d.dy / 2;
                    })
                    .attr('dy', '.35em')
                    .attr('text-anchor', 'end')
                    .attr('transform', null)
                    .text(function (d) {
                        return d.name;
                    })
                    // .filter(function (d) {
                    //     return d.x < (config.size_width - (config.node_width*3));
                    // })
                    .filter(function (d) {
                        return d.x > (config.node_width + config.node_wafer_padding);
                    })
                    .attr('x', 4 + that.sankey.nodeWidth())
                    .attr('text-anchor', 'start');

            } else {
                // 새롭게 계산된 데이터를 넣어준다
                that.nodes.data(that.sankey.getModules());

                d3.selectAll('.module')
                    .attr('transform', function (d) {
                        return 'translate(' + d.x + ',' + d.y + ')';
                    });
                d3.selectAll('.module rect')
                    .attr('height', function (d) {
                        return d.dy;
                    })
                    .attr('width', that.sankey.nodeWidth());
                d3.selectAll('.module text')
                    .attr('x', -4)
                    .attr('y', function (d) {
                        return d.dy / 2;
                    })
                    // .filter(function (d) {
                    //     return d.x < (config.size_width - (config.node_width*3));
                    // })
                    .filter(function (d) {
                        return d.x > (config.node_width + config.node_wafer_padding);
                    })
                    .attr('x', 4 + that.sankey.nodeWidth());
            }
        }

        function _drawLink() {
            if (!that.links) {
                // This is important path info.
                var path = that.sankey.link();

                that.links = that.svg.append('g').selectAll('.link')
                    .data(that.sankey.getLinks())
                    .enter().append('path')
                    .attr('id', function (d) {
                        return 'waferId-' + d.wafer;
                    })
                    .attr('class', config.link_style_clazz)
                    .style('stroke', function (d) {
                        return _linkColor(d);
                    })
                    .style('stroke-width', function (d) {
                        return Math.max(1, d.dy-2);
                    })
                    .attr('d', path)
                    .sort(function (a, b) {
                        return b.dy - a.dy;
                    })
                    .on('mouseover', function (d) {
                        // mouseover/out only support desktop
                        var waferLinks = d3.selectAll('#waferId-' + d.wafer);
                        waferLinks[0].forEach(function (link) {
                            var dLink = d3.select(link);
                            if (dLink.style('stroke-opacity') === config.link_style_opacity_normal) {
                                dLink.style('stroke', function (d) {
                                    return _linkColor(d, true);
                                });
                                dLink.style('cursor', 'pointer');
                                dLink.style('stroke-opacity', config.link_style_opacity_over);
                            }
                        });

                        if (typeof config.link_mouse_in === 'function') {
                            var evt = d3.event;
                            config.link_mouse_in(evt, d);
                        }
                    })
                    .on('mouseout', function (d) {
                        var waferLinks = d3.selectAll('#waferId-' + d.wafer);
                        waferLinks[0].forEach(function (link) {
                            var dLink = d3.select(link);
                            if (dLink.style('stroke-opacity') === config.link_style_opacity_over) {
                                dLink.style('stroke', function (d) {
                                    return _linkColor(d);
                                });
                                dLink.style('cursor', '');
                                dLink.style('stroke-opacity', config.link_style_opacity_normal);
                            }
                        });

                        if (typeof config.link_mouse_out === 'function') {
                            var evt = d3.event;
                            config.link_mouse_out(evt, d);
                        }
                    })
                    .on('click', function (d) {
                        var evt = d3.event;

                        // Multi Selection
                        // show/hide tooltip using 'selected' attribute in link
                        var selected = evt.target.getAttribute('selected');
                        if(selected === undefined || selected === null) {
                            if(typeof config.link_tooltip === 'function') {
                                config.link_tooltip(evt, d);
                            }
                            _selectWafer(d.wafer, true);
                        } else {
                            _selectWafer(d.wafer, false);
                        }

                        if (typeof config.link_menu === 'function') {
                            config.link_menu(evt, d);
                        }

                        if (typeof config.link_click === 'function') {
                            // first arguement: event object, second argument: data
                            config.link_click(evt, d);
                        }

                        // Single Selection
                        // if(that.toggleWaferId) {
                        //     _selectWafer(that.toggleWaferId, false);
                        //
                        //     if(that.toggleWaferId === d.wafer) {
                        //         that.toggleWaferId = undefined;
                        //         return;
                        //     }
                        // }
                        //
                        // if(that.toggleWaferId !== d.wafer) {
                        //     _selectWafer(d.wafer, true);
                        //
                        //     if (typeof config.link_menu === 'function') {
                        //         config.link_menu(evt, d);
                        //     }
                        //
                        //     if (typeof config.link_click === 'function') {
                        //         // first arguement: event object, second argument: data
                        //         config.link_click(evt, d);
                        //     }
                        //
                        //     that.toggleWaferId = d.wafer;
                        // }
                    });
            } else {
                that.links.data(that.sankey.getLinks());

                // This is important path info.
                var path = that.sankey.link();

                d3.selectAll('.link')
                    .attr('id', function (d) {
                        return 'waferId-' + d.wafer;
                    })
                    .style('stroke-width', function (d) {
                        return Math.max(1, d.dy-2);
                    })
                    .attr('d', path)
                    .sort(function (a, b) {
                        return b.dy - a.dy;
                    });
            }
        }

        function _selectWafer(waferId, isSelected) {
            var wafers = d3.selectAll('#waferId-' + waferId);
            wafers[0].forEach(function (wafer) {
                var waferSelection = d3.select(wafer);
                var data = waferSelection[0][0].__data__;

                if (isSelected) {
                    // selected node or link
                    if (data.type === 'wafer') {
                        // wafer
                        waferSelection.style('fill', config.node_style_color_wafer_selected);
                    } else {
                        // link
                        waferSelection.style('stroke', function (d) {
                            return _linkColor(d, true);
                        });
                        waferSelection.style('cursor', 'pointer');
                        waferSelection.style('stroke-opacity', config.link_style_opacity_selected);
                    }

                    waferSelection[0][0].setAttribute('selected', '');
                } else {
                    // unselected node or link
                    if (data.type === 'wafer') {
                        // wafer
                        waferSelection.style('fill', config.node_style_color_wafer_normal);
                    } else {
                        // link
                        waferSelection.style('stroke', function (d) {
                            return _linkColor(d);
                        });
                        waferSelection.style('cursor', '');
                        waferSelection.style('stroke-opacity', config.link_style_opacity_normal);
                    }

                    waferSelection[0][0].removeAttribute('selected');
                }
            });
        }

        function _linkColor(d, isOverOrSelected) {
            if (d.warning) {
                if(d.warningType === 'OOC') {
                    return config.link_style_color_ooc;
                } else if(d.warningType === 'OOS'){
                    return config.link_style_color_oos;
                } else {
                    return config.link_style_color_warning;
                }
            } else {
                return isOverOrSelected ? config.link_style_color_over : config.link_style_color_normal;
            }
        }
    };


    ///////////////////////////////////////////////////////////////////////////
    //
    // Sankey Algorithm
    //
    // Usage)
    //    $$.sankey()
    //        .nodeWidth($$.config.node_width)
    //        .nodePadding($$.config.node_padding_vertical)
    //        .nodes(config.data.NODE)
    //        .links(config.data.LINK)
    //        .layout();
    //
    //  주의) layout(10) iteration은 최초 노드에 대한 정렬 수행. node가 많을 경우
    //                  iteration 값도 높아져야 하지만 성능 이슈가 존재함
    //
    ///////////////////////////////////////////////////////////////////////////

    chart_internal_fn.sankey = function () {
            var $$ = this,
                that = $$.chart_internal_val,
                config = $$.config,
                sankey = {},
                nodeWidth = 20,
                nodePadding = 10,
                // [width, height] not used
                size = [1, 1],
                nodes = [],
                links = [],
                x = 0,
                iteration_count = 0;

            sankey.init = function () {
                sankey = {},
                    nodeWidth = 20,
                    nodePadding = 10,
                    // [width, height] not used
                    size = [1, 1],
                    nodes = [],
                    links = [],
                    x = 0,
                    iteration_count = 0;
            }

            sankey.getNodes = function () {
                return nodes;
            }

            sankey.getWafers = function () {
                return nodes.filter(function(node) {
                    return node.type === 'wafer';
                })
            }

            sankey.getModules = function () {
                return nodes.filter(function(node) {
                    return node.type === 'module';
                })
            }

            sankey.getLinks = function () {
                return links;
            }

            sankey.nodeWidth = function (_) {
                if (!arguments.length) return nodeWidth;
                nodeWidth = +_;
                return sankey;
            };

            sankey.nodePadding = function (_) {
                if (!arguments.length) return nodePadding;
                nodePadding = +_;
                return sankey;
            };

            sankey.nodes = function (_) {
                if (!arguments.length) return nodes;

                // 기존 config 값을 복제해서 사용한다. cause resize 대응
                var clone = jQuery.extend(true, [], _);

                // 자료 구조를 변경. cause 이미 depth에 대한 정보가 node에 포함되어 들어와 있음
                clone.forEach(function (subArray) {
                    subArray.nodes.forEach(function (node) {
                        node.type = subArray.nodeType;
                        node.x = x,
                            node.dx = nodeWidth;

                        nodes.push(node);
                    });
                    x++;
                });

                // nodes = _; // original code
                return sankey;
            };

            sankey.links = function (_) {
                if (!arguments.length) return links;

                // 기존 config 값을 복제해서 사용한다. cause resize 대응
                links = jQuery.extend(true, [], _);

                return sankey;
            };

            sankey.size = function (_) {
                if (!arguments.length) return size;
                size = _;
                return sankey;
            };

            sankey.size = function (_) {
                if (!arguments.length) return size;
                size = _;
                return sankey;
            };

            // SVG path d 옵션 만들기
            // 참조: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d
            //      또는 http://hunjae.com/d3-js-sankey-diagram/
            //
            // Moveto(M,m), Lineto(L,l,H,V), Curveto(C,c), Arcto(A,a), ClosePath(Z,z)
            // spec: https://www.dashingd3js.com/svg-paths-and-d3js#svg-mini-language-div
            // 대문자는 absolute position, 소문자는 relative position, 음수는 윗쪽, 왼쪽이동
            // x/y: position, dx/dy: distance
            sankey.link = function () {
                var curvature = .5;

                // interpolation 보간법 이해: http://ceoyangsj.blog.me/100169531489
                // 점과 점 사이의 값이 필요할 경우 사용
                function link(d) {
                    var x0 = d.source.x + d.source.dx,
                        x1 = d.target.x,
                        xi = d3.interpolateNumber(x0, x1),
                        x2 = xi(curvature),
                        x3 = xi(1 - curvature),
                        y0 = d.source.y + d.sy + d.dy / 2,
                        y1 = d.target.y + d.ty + d.dy / 2;
                    return "M" + x0 + "," + y0 + "C" + x2 + "," + y0 + " " + x3 + "," + y1 + " " + x1 + "," + y1;
                }

                // 곡률
                link.curvature = function (_) {
                    if (!arguments.length) return curvature;
                    curvature = +_;
                    return link;
                };

                return link;
            };

            sankey.relayout = function () {
                // calc X 축 Width 분할
                computeNodeBreadths();
                // calc Y 축 Height 분할
                computeNodeDepths(iteration_count);
                // calc Node의 Height 분할
                computeLinkDepths();
                return sankey;
            };

            sankey.layout = function (iterations) {
                iteration_count = iterations;

                computeNodeLinks();
                computeNodeValues();

                // calc X 축 Width 분할
                computeNodeBreadths();
                // calc Y 축 Height 분할
                computeNodeDepths(iterations);
                // calc Node의 Height 분할
                computeLinkDepths();
                return sankey;
            };

            // 자료 구조 만들기
            function computeNodeLinks() {
                nodes.forEach(function (node) {
                    node.sourceLinks = [];
                    node.targetLinks = [];
                });

                // link를 돌면서 node에 연결된 source -> target 에 대한 link 객체를 배열화함
                links.forEach(function (link) {
                    var source = link.source,
                        target = link.target;

                    source = link.source = _.findWhere(nodes, {
                        'node': link.source
                    });
                    target = link.target = _.findWhere(nodes, {
                        'node': link.target
                    });

                    source.sourceLinks.push(link);
                    target.targetLinks.push(link);
                });
            }

            // Node의 height 사이즈와 관련이 있다. 노드의 in/out 중에서 큰 값을 취한다
            // Node.value
            function computeNodeValues() {
                // unmangedNode 값을 internal_chart_val에 넣어준다. wafer-traffic.directive.js 의 setChart에서 사용
                that.unmanagedNodes = [];
                nodes.forEach(function (node) {
                    node.value = Math.max(
                        d3.sum(node.sourceLinks, value),
                        d3.sum(node.targetLinks, value)
                    );

                    // unmanaged node에 대한 처리
                    // node.value가 0 이면 unmanaged node
                    if (node.value === 0) {
                        that.unmanagedNodes.push(node);
                        // link가 없는 노드에 대해서 value=1을 할당하고 warning = true를 준다. link.warning 도 존재함
                        node.value = $$.config.node_warning_size;
                        node.warning = true;
                    }
                });
            }

            function value(link) {
                // 무조건 1의 값을 갖는다.
                return 1;
                // return link.value;
            }

            // x position: Node depth별 x 위치값을 정함
            function computeNodeBreadths() {
                if(config.widthRate > 3) {
                    config.node_wafer_padding = 150 + (config.widthRate - 2) * 10;
                } else {
                    config.node_wafer_padding = 150;
                }
                // scaleNodeBreadths: node의 x 실제 위치값
                var kx = (that.svgWidth - nodeWidth - config.node_wafer_padding - 50) / (x - 1);

                nodes.forEach(function (node) {
                    if(node.type === 'module') {
                        node.x *= kx;
                        node.x += (50 + config.node_wafer_padding);
                    } else {
                        // 첫번째 node는 wafer 이다
                        node.x *= kx;
                        node.x += config.node_wafer_padding;
                    }
                });
            }

            // y position: Node y 위치값을 정함
            function computeNodeDepths(iterations) {
                // 참조: http://visualize.tistory.com/397, 데이터를 트리구조로 변환하고자 할 때 유용한 API
                // nest 테스트: http://bl.ocks.org/shancarter/raw/4748131/
                // x 의 위치를 key로 갖는 노드 배열(values)들
                var nodesByBreadth = d3.nest()
                    .key(function (d) {
                        return d.x;
                    })
                    .sortKeys(d3.ascending)
                    .entries(nodes)
                    .map(function (d) {
                        // entries를 호출하면 key는 x가되고 values는 x 동일
                        return d.values;
                    });

                initializeNodeDepth();
                resolveCollisions();
                for (var alpha = 1; iterations > 0; --iterations) {
                    relaxRightToLeft(alpha *= .99);
                    resolveCollisions();
                    relaxLeftToRight(alpha *= .99);
                    resolveCollisions();
                }

                function initializeNodeDepth() {
                    var ky = d3.min(nodesByBreadth, function (nodes) {
                        return (that.svgHeight - (nodes.length - 1) * nodePadding) / d3.sum(nodes, value);
                    });

                    // // max one link height is 10
                    if(ky > 15) {
                        ky = 15;
                    }

                    // Node.value는 link value의 sum에 대한 max 값으로 node의 Height을 갖는다.
                    nodesByBreadth.forEach(function (nodes) {
                        nodes.forEach(function (node, i) {
                            node.y = i;
                            node.dy = node.value * ky;
                            //console.log('node dy: ', node.dy);
                        });
                    });

                    // Link.value는 한개의 link value 이다.
                    links.forEach(function (link) {
                        // 무조건 1의 값을 갖는다.
                        link.dy = ky; // 1* ky;
                        // link.dy = link.value * ky;
                        // n 값을 넘으면 warning을 표현한다.
                        link.warning = $$.config.link_warning(link.value);
                        //console.log('link dy: ', link.dy);
                    });
                }

                function resolveCollisions() {
                    nodesByBreadth.forEach(function (nodes) {
                        var node,
                            dy,
                            y0 = 0,
                            n = nodes.length,
                            i;

                        // Push any overlapping nodes down.
                        nodes.sort(ascendingDepth);
                        for (i = 0; i < n; ++i) {
                            node = nodes[i];
                            dy = y0 - node.y;
                            if (dy > 0) node.y += dy;
                            y0 = node.y + node.dy + nodePadding;
                        }

                        // If the bottommost node goes outside the bounds, push it back up.
                        dy = y0 - nodePadding - that.svgHeight;
                        if (dy > 0) {
                            y0 = node.y -= dy;

                            // Push any overlapping nodes back up.
                            for (i = n - 2; i >= 0; --i) {
                                node = nodes[i];
                                dy = node.y + node.dy + nodePadding - y0;
                                if (dy > 0) node.y -= dy;
                                y0 = node.y;
                            }
                        }
                        if(node.y < 0) {
                            if(that.minValue > node.y) {
                                that.minValue = node.y;
                                //console.log('node y<0: ', node.y);
                            }
                        }
                    });
                }

                function ascendingDepth(a, b) {
                    return a.y - b.y;
                }

                // source에 대한 y 값 center
                function relaxRightToLeft(alpha) {
                    nodesByBreadth.slice().reverse().forEach(function (nodes) {
                        nodes.forEach(function (node) {
                            if (node.sourceLinks.length) {
                                var y = d3.sum(node.sourceLinks, weightedTarget) / d3.sum(node.sourceLinks, value);
                                node.y += (y - center(node)) * alpha;
                            }
                        });
                    });

                    function weightedTarget(link) {
                        return center(link.target); // * 1;
                        // return center(link.target) * link.value;
                    }
                }

                // target에 대한 y 값 center
                function relaxLeftToRight(alpha) {
                    nodesByBreadth.forEach(function (nodes, breadth) {
                        nodes.forEach(function (node) {
                            if (node.targetLinks.length) {
                                var y = d3.sum(node.targetLinks, weightedSource) / d3.sum(node.targetLinks, value);
                                node.y += (y - center(node)) * alpha;
                            }
                        });
                    });

                    function weightedSource(link) {
                        return center(link.source); // *1;
                        // return center(link.source) * link.value;
                    }
                }

                function center(node) {
                    return node.y + node.dy / 2;
                }

            } // END computeNodeDepths

            function computeLinkDepths() {
                nodes.forEach(function (node) {
                    node.sourceLinks.sort(ascendingTargetDepth);
                    node.targetLinks.sort(ascendingSourceDepth);
                });

                nodes.forEach(function (node) {
                    var sy = 0,
                        ty = 0;
                    node.sourceLinks.forEach(function (link) {
                        link.sy = sy; // source y of link
                        sy += link.dy;
                    });
                    node.targetLinks.forEach(function (link) {
                        link.ty = ty; // target y of link
                        ty += link.dy;
                    });
                });

                function ascendingSourceDepth(a, b) {
                    return a.source.y - b.source.y;
                }

                function ascendingTargetDepth(a, b) {
                    return a.target.y - b.target.y;
                }
            }

            return sankey;
        } // END sankey


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
        define('Sankey2', ['d3'], Sankey2);
    } else if ('undefined' !== typeof exports && 'undefined' !== typeof module) {
        module.exports = Sankey2;
    } else {
        window.Sankey2 = Sankey2;
    }

})(window, window.d3, window.$);
