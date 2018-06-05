(function (window, d3) {
    'use strict';

    var AcubedMapChart = {
        // TODO set version (OPTION)
        version: '0.0.1',
        chart: {
            fn: Chart.prototype,
            internal: {
                fn: ChartInternal.prototype
            }
        }
    };

    var chart_fn = AcubedMapChart.chart.fn,
        chart_internal_fn = AcubedMapChart.chart.internal.fn,
        chart_internal_val = null;

    AcubedMapChart.generate = function (config) {
        return new Chart(config);
    };

    function Chart(config) {
        var $$ = this.internal = new ChartInternal(this);
        $$.loadConfig(config);

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
            svg: null,              // svg영역
            radialTree: null,       // radial tree layout
            radialCluster: null,    // radial cluster layout
            tree: null,             // tree layout
            cluster: null,          // cluster layout
            diagonal: null,         // diagonal for non-radial layout
            radialDiagonal: null,   // diagonal for radial layout
            canvas: null,           // canvas
            map: null,              // map
            minimap: null,          // minimap
            links: null,            // links
            nodes: null,            // nodes
            node: null,             // node
            group: null,            // group
            appendConfig: {},       // 차트를 추가할때 사용할 config
            transitionConfig: {},   // 차트를 변경할때 사용할 config
            drawingWidth: 0,        // cartesian 타입에서 width
            drawingHeight: 0,       // cartesian 타입에서 height
            drawingDiameter: 0,     // radial 타입에서 지름
            isCreation: false,      // 차트 생성여부
            isDataChange: false,    // 데이터 변경 여부
            isConfigChange: false,  // 설정 변경 여부
            transitionCount: 0,     // Transition 실행 갯수
            isResizeEnable: false,  // 리사이즈 사용가능 여부(최초에 resize()가 자동으로 실행되어서 최초에 resize() 실행 안되게 할 목적)
            targetUid: [],          // highlightDoms을 생성할 기준 ID
            highlightDoms: []       // Hight 되고있는 돔 배열
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
    chart_fn.resize = function (size) {
        var $$ = this.internal,
            config = $$.config,
            that = $$.chart_internal_val;

        if (!that.isCreation) return;

        if (!that.isResizeEnable) {
            that.isResizeEnable = true;
            return;
        }

        that.isConfigChange = true;

        _drawChart($$);
    };

    chart_fn.data = function() {
        var $$ = this.internal,
            config = $$.config;
        return config.data;
    };

    chart_fn.load = function (data) {
        var $$ = this.internal,
            config = $$.config,
            that = $$.chart_internal_val;

        if (data == null || data.length == 0) {
            return;
        }

        config.data = data;

        that.isCreation = false;

        _removeChart($$);

        _drawChart($$);
    };

    chart_fn.reload = function (data) {
        var $$ = this.internal,
            config = $$.config,
            that = $$.chart_internal_val;

        if (data == null || data.length == 0) {
            return;
        }

        config.data = data;

        that.isCreation = false;

        _removeChart($$);

        _drawChart($$);
    };

    chart_fn.clear = function() {
        var $$ = this.internal,
            that = $$.chart_internal_val;

        that.svg.remove();
        that.svg = null;
        that.isCreation = false;
    }

    chart_fn.destroy = function () {
        var $$ = this.internal,
            that = $$.chart_internal_val;

        _removeChart($$);

        // init variable
        that.isCreation = false;
        that.svg.remove();
        that.svg = undefined;
        AcubedMapChart.chart.config = undefined;
    };

    chart_fn.transitionChartType = function(chartType) {
        var $$ = this.internal,
            that = $$.chart_internal_val;

        $$.config.chartType = chartType;

        that.isConfigChange = true;

        _drawChart($$);
    };

    chart_fn.applyHighlight = function(uid) {
        var $$ = this.internal,
            that = $$.chart_internal_val;

        that.targetUid = uid;

        _applyHighlight($$);
    };

    // internal fn : configuration, init
    chart_internal_fn.getDefaultConfig = function () {
        return {
            bindto: '#chart',
            chartType: 'radialTree',
            chartDiameter: 1000,
            chartWidth: 1000,
            chartHeight: 2000,
            duration: 1500,
            userImageSize: 50,              // User Image Size
            userImagePath: '',              // User Image Path
            circleRadian: 5,                // Circle Radian
            textX: 8,                       // Text dx
            textY: 3,                       // Text dy
            redialGap: 50,                  // Redial chart padding
            treeLeftGap: 60,                // Tree chart left padding
            treeWidthGap: 180,              // Tree chart width padding
            treeHightGap: 40,               // Tree chart hight padding
            data: [],                       // 최초 load 된 전체 데이터
            callbackOpenTooltip: null,      // dom 선택시 툴팁을 생성하기 위한 callback function
            callbackRemoveHighlight: null   // highlight 제거시 실행하는 callback function
        };
    };

    chart_internal_fn.init = function () {
        var $$ = this,
            config = $$.config;

        _drawChart($$);
    };

    function _drawChart(chart) {
        var $$ = chart;
        var that = $$.chart_internal_val;

        if ($$.config.data == null || $$.config.data.length == 0) {
            return;
        }

        _init_chart_size();
        _init_chart_val();
        _init_canvas();
        _init_draw_chart();
        _init_minimap();

        function _init_chart_size() {
            var parent_node = $($$.config.bindto);
            if (parent_node.width() > 0) {
                $$.config.chartWidth = parent_node.width();
            }
            if (parent_node.height() > 0) {
                $$.config.chartHeight = parent_node.height();
            }
            if (parent_node.width() > 0 && parent_node.height() > 0) {
                $$.config.chartDiameter = Math.min(parent_node.width(), parent_node.height()) - 100;
            }
            that.drawingWidth = $$.config.chartWidth;
            that.drawingHeight = $$.config.chartHeight;
            that.drawingDiameter = $$.config.chartDiameter;
        }

        function _init_chart_val() {
            var diameter = that.drawingDiameter,
                width = that.drawingWidth,
                height = that.drawingHeight;

            // radialTree
            that.radialTree = d3.layout.tree()
                .size([360, diameter / 2 - $$.config.redialGap])
                .children(function(d) {
                    return d.descendants;
                })
                .separation(function(a, b) {
                    return (a.parent == b.parent ? 1 : 2) / (a.depth === 0 ? 1 : a.depth);
                });

            // radialCluster
            that.radialCluster = d3.layout.cluster()
                .size([360, diameter / 2 - $$.config.redialGap])
                .children(function(d) {
                    return d.descendants;
                })
                .separation(function(a, b) {
                    return (a.parent == b.parent ? 1 : 2) / a.depth;
                });

            // tree
            that.tree = d3.layout.tree()
                .children(function(d) {
                    return d.descendants;
                })
                .size([height-$$.config.treeHightGap*2, width-$$.config.treeWidthGap]);

            // cluster
            that.cluster = d3.layout.cluster()
                .children(function(d) {
                    return d.descendants;
                })
                .size([height-$$.config.treeHightGap*2, width-$$.config.treeWidthGap]);

            // diagonal
            that.diagonal = d3.svg.diagonal()
                .projection(function (d) {
                    return [d.y, d.x];
                });

            // radial diagonal
            that.radialDiagonal = d3.svg.diagonal.radial()
                .projection(function(d) {
                    return [d.y, d.x / 180 * Math.PI];
                });
        }

        function _init_canvas() {
            if (!that.isCreation) {
                that.canvas = _append_canvas();
                d3.select("#canvas").call(that.canvas);
            } else if (that.isConfigChange) {
                that.canvas = _transition_canvas();
                d3.select("#canvas").call(that.canvas);
            }
        }

        function _init_minimap() {
            that.canvas.renderMinimap();
        }

        function _init_draw_chart() {
            if (!that.isCreation) {
                _append_chart();
                that.isCreation = true;
            } else if (that.isConfigChange) {
                _transition_chart();
                that.isConfigChange = false;
            } else {
                console.log('error: Invalid state.');
            }
        }

        function _append_canvas() {
            var width           = that.drawingWidth,
                height          = that.drawingHeight,
                zoomEnabled     = true,
                dragEnabled     = true,
                scale           = 1,
                translation     = [0,0],
                scaleExtent     = [1,5],
                base            = null,
                wrapperBorder   = 1,
                minimap         = null,
                minimapPadding  = 20,
                minimapScale    = 0.15;

            function canvas(data) {
                var zoomHandler = function(newScale) {
                    if (!zoomEnabled) { return; }
                    if (d3.event) {
                        scale = d3.event.scale;
                    } else {
                        scale = newScale;
                    }
                    if (dragEnabled) {
                        var tbound = -height * scale,
                            bbound = height  * scale,
                            lbound = -width  * scale,
                            rbound = width   * scale;
                        // limit translation to thresholds
                        translation = d3.event ? d3.event.translate : [0,0];
                        translation = [
                            Math.max(Math.min(translation[0], rbound), lbound),
                            Math.max(Math.min(translation[1], bbound), tbound)
                        ];
                    }

                    that.map.attr("transform", "translate(" + translation + ")" + " scale(" + scale + ")");

                    that.minimap.scale(scale).render();
                };

                var xScale = d3.scale.linear()
                    .domain([0, width])
                    .range([0, width]);

                var yScale = d3.scale.linear()
                    .domain([0, height])
                    .range([height, 0]);

                var zoom = d3.behavior.zoom()
                    .x(xScale)
                    .y(yScale)
                    .scaleExtent(scaleExtent)
                    .on("zoom.map", zoomHandler);

                var svg = d3.select($$.config.bindto)
                    .append("svg")
                    .attr("class", "canvas")
                    .attr("width",  width)
                    .attr("height", height)
                    .attr("shape-rendering", "auto")
                    .on('click', function() {
                        _removeHighlight($$);
                    });

                var svgDefs = svg.append("defs");

                svgDefs.append("clipPath")
                    .attr("id", "wrapperClipPath")
                    .attr("class", "wrapper clipPath")
                    .append("rect")
                    .attr("class", "background")
                    .attr("width", width)
                    .attr("height", height);

                var outerWrapper = svg.append("g")
                    .attr("class", "wrapper outer")
                    .attr("transform", "translate(" + wrapperBorder + "," + wrapperBorder + ")");

                outerWrapper.append("rect")
                    .attr("class", "background")
                    .attr("width", width - wrapperBorder * 2)
                    .attr("height", height - wrapperBorder * 2);

                var innerWrapper = outerWrapper.append("g")
                    .attr("class", "wrapper inner")
                    //.attr("clip-path", "url(#wrapperClipPath)")
                    .attr("transform", "translate(0,0)")
                    .call(zoom);

                innerWrapper.append("rect")
                    .attr("class", "background")
                    .attr("width", width - wrapperBorder * 2)
                    .attr("height", height - wrapperBorder * 2);

                var map = innerWrapper.append("g")
                    .attr("class", "map")
                    .attr("width", width - wrapperBorder * 2)
                    .attr("height", height - wrapperBorder * 2);

                map.append("rect")
                    .attr("class", "background")
                    .attr("width", width - wrapperBorder * 2)
                    .attr("height", height - wrapperBorder * 2);

                that.minimap = _minimap()
                    .zoom(zoom)
                    .target(map)
                    .minimapScale(minimapScale)
                    .x(width - (width * minimapScale) - minimapPadding)
                    .y(minimapPadding);

                // svg, map setting
                that.svg = svg;
                that.map = map;

                svg.call(that.minimap);

                // zoom.scale(scale);
                zoomHandler(scale);
            }

            //============================================================
            // Accessors
            //============================================================

            canvas.renderMinimap = function() {
                that.minimap.render();
            };

            canvas.width = function(value) {
                if (!arguments.length) return width;
                width = parseInt(value, 10);
                return this;
            };

            canvas.height = function(value) {
                if (!arguments.length) return height;
                height = parseInt(value, 10);
                return this;
            };

            canvas.scale = function(value) {
                if (!arguments.length) { return scale; }
                scale = value;
                return this;
            };

            return canvas;
        }

        function _minimap() {
            var container       = null,
                frame           = null,
                zoom            = null,
                base            = null,
                target          = null,
                minimapScale    = 0,
                scale           = 0,
                width           = 0,
                height          = 0,
                x               = 0,
                y               = 0,
                frameX          = 0,
                frameY          = 0,
                textHeight      = 20,
                textGap         = 15;

            function minimap(selection) {
                base = selection;

                container = selection.append("g")
                    .attr("class", "minimap")
                    .call(zoom);

                minimap.node = container.node();

                frame = container.append("g")
                    .attr("class", "frame")

                frame.append("rect")
                    .attr("class", "background")
                    .attr("width", width)
                    .attr("height", height);

                var drag = d3.behavior.drag()
                    .on("dragstart.minimap", function() {
                        var frameTranslate = getXYFromTranslate(frame.attr("transform"));
                        frameX = frameTranslate[0];
                        frameY = frameTranslate[1];
                    })
                    .on("drag.minimap", function() {
                        d3.event.sourceEvent.stopImmediatePropagation();
                        frameX += d3.event.dx;
                        frameY += d3.event.dy;
                        frame.attr("transform", "translate(" + frameX + "," + frameY + ")");
                        var translate = [(-frameX*scale),(-frameY*scale)];
                        target.attr("transform", "translate(" + translate + ")scale(" + scale + ")");
                        zoom.translate(translate);
                    });

                frame.call(drag);
            }

            //============================================================
            // Accessors
            //============================================================

            // render
            minimap.render = function() {
                var node = target.node().cloneNode(true),
                    targetTransform = getXYFromTranslate(target.attr("transform"));

                container.attr("transform", "translate(" + [x,y] + ") scale(" + minimapScale + ")");

                base.selectAll(".minimap .map").remove();

                _convertText2Rect();

                minimap.node.appendChild(node);

                frame.attr("transform", "translate(" + [-targetTransform[0]/scale, -targetTransform[1]/scale] + ")");

                frame.select(".background")
                    .attr("width", width/scale)
                    .attr("height", height/scale);

                frame.node().parentNode.appendChild(frame.node());

                d3.select(node).attr("transform", "translate(1,1)");

                function _calcTextWidth(uid) {
                    var txt = $('text[uid='+uid+']');
                    if (txt) return txt.text().replace(/ /g, '').length * 5;
                    return 0;
                }

                function _calcTranslate(uid) {
                    var txt = $('text[uid='+uid+']'),
                        txtW = _calcTextWidth(uid),
                        txtX;
                    if ($$.config.chartType === 'radialTree' || $$.config.chartType === 'radialCluster') {
                        txtX = textGap;
                    } else {
                        txtX = txt.attr('text-anchor') === 'end' ? txtW * -1 - textGap : textGap;
                    }
                    return 'translate('+[txtX, textHeight/2*-1]+')';
                }

                function _convertText2Rect() {
                    if (!that.nodes) return;
                    d3.select(node).selectAll(".node")
                        .data(that.nodes)
                        .append('rect')
                        .attr("class", "minimap-text-rect")
                        .attr("width", function(d){
                            return _calcTextWidth(d.uid);
                        })
                        .attr("height", textHeight)
                        .attr('transform', function(d) {
                            return _calcTranslate(d.uid);
                        });
                    d3.select(node).selectAll("text").remove();
                }
            };

            minimap.width = function(value) {
                if (!arguments.length) return width;
                width = parseInt(value, 10);
                return this;
            };

            minimap.height = function(value) {
                if (!arguments.length) return height;
                height = parseInt(value, 10);
                return this;
            };

            minimap.x = function(value) {
                if (!arguments.length) return x;
                x = parseInt(value, 10);
                return this;
            };

            minimap.y = function(value) {
                if (!arguments.length) return y;
                y = parseInt(value, 10);
                return this;
            };

            minimap.scale = function(value) {
                if (!arguments.length) { return scale; }
                scale = value;
                return this;
            };

            minimap.minimapScale = function(value) {
                if (!arguments.length) { return minimapScale; }
                minimapScale = value;
                return this;
            };

            minimap.zoom = function(value) {
                if (!arguments.length) return zoom;
                zoom = value;
                return this;
            };

            minimap.target = function(value) {
                if (!arguments.length) { return target; }
                target = value;
                width  = parseInt(target.attr("width"),  10);
                height = parseInt(target.attr("height"), 10);
                return this;
            };

            return minimap;
        }

        function _transition_canvas() {
            var width           = that.drawingWidth,
                height          = that.drawingHeight,
                wrapperBorder   = 1,
                minimapPadding  = 20,
                minimapScale    = 0.15;

            function canvas(data) {
                that.svg
                    .attr("width",  width)
                    .attr("height", height);

                that.map
                    .attr("width", width - wrapperBorder * 2)
                    .attr("height", height - wrapperBorder * 2);

                d3.selectAll('.background')
                    .attr("width", width - wrapperBorder * 2)
                    .attr("height", height - wrapperBorder * 2);

                that.minimap
                    .target(that.map)
                    .x(width - (width * minimapScale) - minimapPadding)
                    .y(minimapPadding);
            }

            //============================================================
            // Accessors
            //============================================================

            canvas.renderMinimap = function() {
                that.minimap.render();
            };

            canvas.width = function(value) {
                if (!arguments.length) return width;
                width = parseInt(value, 10);
                return this;
            };

            canvas.height = function(value) {
                if (!arguments.length) return height;
                height = parseInt(value, 10);
                return this;
            };

            canvas.scale = function(value) {
                if (!arguments.length) { return scale; }
                scale = value;
                return this;
            };

            return canvas;
        }

        function _append_chart() {
            var width = that.drawingWidth,
                height = that.drawingHeight,
                config = _makeChartConfig();

            that.nodes = config.nodes;
            that.links = config.links;

            that.group = that.map
                .append("g")
                .attr("transform", config.groupTransform);

            // Path
            that.link = that.group.selectAll('.link')
                .data(that.links)
                .enter()
                .append('path')
                .attr('class', 'a3-map-link')
                .attr('uid', function (d) {
                    return d.target.uid;
                })
                .attr('d', config.linkD);

            // Node Group
            that.node = that.group.selectAll('.node')
                .data(that.nodes)
                .enter()
                .append('g')
                .attr('class', 'node')
                .attr('transform', config.nodeTransform);

            // Circle
            that.node.append('circle')
                .attr('uid', function (d) {
                    return d.uid;
                })
                .attr('class', 'a3-map-circle')
                .attr('r', function (d) {
                    return d.nodeType != 'U' ? $$.config.circleRadian : $$.config.userImageSize / 2;
                })
                .on('click', function() {
                    if (this.__data__.depth > 0) {
                        that.targetUid = $(this).attr('uid');
                        _applyHighlight(chart);
                    }
                    d3.event.stopPropagation();
                });

            // User ClipPath
            that.node
                .filter(function (d) {
                    return d.nodeType === 'U';
                })
                .append('clipPath')
                .attr('id', function (d) {
                    return 'clip' + d.uid;
                })
                .attr('transform', function(d) {
                    return 'translate('+$$.config.userImageSize/2+','+$$.config.userImageSize/2+')';
                })
                .append('circle')
                .attr('class', 'a3-map-circle')
                .attr('r', $$.config.userImageSize / 2);

            // User Image
            that.node
                .filter(function (d) {
                    return d.nodeType === 'U';
                })
                .append('image')
                .attr('uid', function (d) {
                    return d.uid;
                })
                .attr('width', $$.config.userImageSize)
                .attr('height', $$.config.userImageSize)
                .attr('xlink:href', $$.config.userImagePath)
                .attr('clip-path', function(d) {
                    return 'url(#clip' + d.uid + ')'
                })
                .attr('transform', config.imageTransform);

            // Text
            that.node.append('text')
                .attr('dx', config.textDx)
                .attr('dy', $$.config.textY)
                .attr('uid', function (d) {
                    return d.uid;
                })
                .attr('class', 'a3-map-text')
                .attr('text-anchor', config.textTextAnchor)
                .attr('transform', config.textTransform)
                .text(function(d) {
                    return d.nodeType === 'U' ? '' : (d.nodeType === 'W' ? d.id + ' ' + d.title : d.title);
                });
        }

        function _transition_chart() {
            var width = that.drawingWidth,
                height = that.drawingHeight,
                config = _makeChartConfig();

            that.nodes = config.nodes;
            that.links = config.links;

            that.group
                .transition()
                .duration($$.config.duration)
                .attr("transform", config.groupTransform);

            that.link
                .data(that.links)
                .transition()
                .duration($$.config.duration)
                .attr('d', config.linkD);

            that.node
                .data(that.nodes)
                .transition()
                .duration($$.config.duration)
                .attr('transform', config.nodeTransform);

            that.node.select('circle')
                .transition()
                .duration($$.config.duration);

            that.node.select('image')
                .transition()
                .duration($$.config.duration)
                .attr('transform', config.imageTransform);

            that.node.select('text')
                .transition()
                .duration($$.config.duration)
                .attr('dx', config.textDx)
                .attr('text-anchor', config.textTextAnchor)
                .attr('transform', config.textTransform)
                .each('start', _startTransition)
                .each('end', _endTransition);
        }

        function _startTransition() {
            that.transitionCount++;
        }

        function _endTransition() {
            if (--that.transitionCount === 0) {
                that.canvas.renderMinimap();
            }
        }

        function _makeChartConfig() {
            var vo = {},
                width = that.drawingWidth,
                height = that.drawingHeight;

            switch ($$.config.chartType) {
                case 'radialTree': return _setRadialTreelVo();
                case 'radialCluster': return _setRadialClusterVo();
                case 'tree': return _setTreeVo();
                case 'cluster': return _setClusterVo();
                default: return undefined;
            }

            function _setRadialTreelVo() {
                vo.nodes = that.radialTree.nodes($$.config.data);
                vo.links = that.radialTree.links(vo.nodes);
                vo.linkD = that.radialDiagonal;
                vo.groupTransform = function(d) {
                    return 'translate(' + (width/2) + ',' + (height/2) + ')';
                };
                vo.nodeTransform = function(d) {
                    return 'rotate('+(d.x-90)+') translate('+d.y+')';
                };
                vo.imageTransform = function(d) {
                    return 'rotate('+(d.x-90)*-1+') translate('+$$.config.userImageSize/2*-1+','+$$.config.userImageSize/2*-1+')';
                };
                vo.textDx = function(d) {
                    return d.x < 180 ? $$.config.textX : -$$.config.textX;
                };
                vo.textTextAnchor = function(d) {
                    return d.x < 180 ? 'start' : 'end';
                };
                vo.textTransform = function(d) {
                    return d.x < 180 ? 'rotate(0)' : 'rotate(180)';
                };
                return vo;
            }

            function _setRadialClusterVo() {
                vo.nodes = that.radialCluster.nodes($$.config.data);
                vo.links = that.radialCluster.links(vo.nodes);
                vo.linkD = that.radialDiagonal;
                vo.groupTransform = function(d) {
                    return 'translate(' + (width/2) + ',' + (height/2) + ')';
                };
                vo.nodeTransform = function(d) {
                    return 'rotate('+(d.x-90)+') translate('+d.y+')';
                };
                vo.imageTransform = function(d) {
                    return 'rotate('+(d.x-90)*-1+') translate('+$$.config.userImageSize/2*-1+','+$$.config.userImageSize/2*-1+')';
                };
                vo.textDx = function(d) {
                    return d.x < 180 ? $$.config.textX : -$$.config.textX;
                };
                vo.textTextAnchor = function(d) {
                    return d.x < 180 ? 'start' : 'end';
                };
                vo.textTransform = function(d) {
                    return d.x < 180 ? 'rotate(0)' : 'rotate(180)';
                };
                return vo;
            }

            function _setTreeVo() {
                vo.nodes = that.tree.nodes($$.config.data);
                vo.links = that.tree.links(vo.nodes);
                vo.linkD = that.diagonal;
                vo.groupTransform = function(d) {
                    return 'translate('+[$$.config.treeLeftGap, $$.config.treeHightGap]+')';
                };
                vo.nodeTransform = function(d) {
                    return 'translate(' + d.y + ',' + d.x + ')';
                };
                vo.imageTransform = function(d) {
                    return 'rotate(0) translate('+$$.config.userImageSize/2*-1+','+$$.config.userImageSize/2*-1+')';
                };
                vo.textDx = function(d) {
                    return d.children ? -$$.config.textX : $$.config.textX;
                };
                vo.textTextAnchor = function(d) {
                    return d.children ? 'end' : 'start';
                };
                vo.textTransform = function(d) {
                    return 'rotate(0)';
                };
                return vo;
            }

            function _setClusterVo() {
                vo.nodes = that.cluster.nodes($$.config.data);
                vo.links = that.cluster.links(vo.nodes);
                vo.linkD = that.diagonal;
                vo.groupTransform = function(d) {
                    return 'translate('+[$$.config.treeLeftGap, $$.config.treeHightGap]+')';
                };
                vo.nodeTransform = function(d) {
                    return 'translate(' + d.y + ',' + d.x + ')';
                };
                vo.imageTransform = function(d) {
                    return 'rotate(0) translate('+$$.config.userImageSize/2*-1+','+$$.config.userImageSize/2*-1+')';
                };
                vo.textDx = function(d) {
                    return d.children ? -$$.config.textX : $$.config.textX;
                };
                vo.textTextAnchor = function(d) {
                    return d.children ? 'end' : 'start';
                };
                vo.textTransform = function(d) {
                    return 'rotate(0)';
                };
                return vo;
            }
        }
    }

    function _applyHighlight(chart) {
        var $$ = chart,
            that = $$.chart_internal_val,
            parentDoms  = _getParentDoms(that.targetUid),
            childrenDoms = _getChildrenDoms(that.targetUid),
            target = null;

        _removeHighlight(chart);

        childrenDoms.forEach(function (item) {
            _addClass(item, 'highlight');
        });

        parentDoms.forEach(function (item) {
            _addClass(item, 'highlight');
            _addClass(item, 'parent');
        });

        that.highlightDoms = [];
        that.highlightDoms = that.highlightDoms.concat(parentDoms);
        that.highlightDoms = that.highlightDoms.concat(childrenDoms);

        // callback function
        target = $('circle[uid='+that.targetUid+'][class$=highlight]');
        if ($$.config.callbackOpenTooltip) {
            $$.config.callbackOpenTooltip(target);
        }
    }

    function _removeHighlight(chart) {
        var $$ = chart,
            that = $$.chart_internal_val;

        if (that.highlightDoms.length === 0) return;

        that.highlightDoms.forEach(function(item) {
            _removeClass(item, 'highlight');
            _removeClass(item, 'parent');
        });

        that.highlightDoms = [];

        // callback function
        if ($$.config.callbackRemoveHighlight) {
            $$.config.callbackRemoveHighlight();
        }
    }

    function _getParentDoms(uid) {
        var doms = [],
            path = $('path[uid='+uid+']'),
            circle = $('circle[uid='+uid+']'),
            text = $('text[uid='+uid+']');

        doms = doms.concat(_findParentDoms(path, [], true));
        doms = doms.concat(_findParentDoms(circle, [], true));
        doms = doms.concat(_findParentDoms(text, [], true));

        return doms;
    }

    function _getChildrenDoms(uid) {
        var doms = [],
            path = $('path[uid='+uid+']'),
            circle = $('circle[uid='+uid+']'),
            text = $('text[uid='+uid+']');

        doms = doms.concat(_findChildrenDoms(path));
        doms = doms.concat(_findChildrenDoms(circle));
        doms = doms.concat(_findChildrenDoms(text));

        return doms;
    }

    function _findParentDoms(node, result, isFirst) {
        result = result || [];
        if (node != undefined && node.length > 0) {
            node = node[0];
            if (isFirst === undefined) result.push(node);
            try {
                _findParentDoms(_getParentNode(node), result)
            } catch (exception) {}
        }
        return result;
    }

    function _findChildrenDoms(node, result) {
        result = result || [];
        if (node != undefined && node.length > 0) {
            node = node[0];
            result.push(node);
            try {
                _getChildren(node).forEach(function(item) {
                    _findChildrenDoms($(node.nodeName+'[uid='+item.uid+']'), result);
                });
            } catch (exception) {}
        }
        return result;
    }

    function _getParentNode(node) {
        switch (node.nodeName) {
            case 'path': return $(node.nodeName+'[uid='+node.__data__.target.parent.uid+']');
            case 'circle': return $(node.nodeName+'[uid='+node.__data__.parent.uid+']');
            case 'text': return $(node.nodeName+'[uid='+node.__data__.parent.uid+']');
            default: return undefined;
        }
    }

    function _getChildren(node) {
        switch (node.nodeName) {
            case 'path': return node.__data__.target.children;
            case 'circle': return node.__data__.children;
            case 'text': return node.__data__.children;
            default: return undefined;
        }
    }

    function _removeChart(chart) {
        var that = chart.chart_internal_val;
        if (that.svg) that.svg.remove();
    }

    function _hasClass(el, className) {
        if (el.classList) return el.classList.contains(className)
        else return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
    }

    function _addClass(el, className) {
        if (el.classList) el.classList.add(className)
        else if (!_hasClass(el, className)) el.className += ' ' + className
    }

    function _removeClass(el, className) {
        if (el.classList)
            el.classList.remove(className)
        else if (_hasClass(el, className)) {
            var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
            el.className=el.className.replace(reg, ' ')
        }
    }

    ///////////////////////////////////////////////////////////////////////////
    //
    // END: Define Area
    //
    ///////////////////////////////////////////////////////////////////////////

    var isDefined = chart_internal_fn.isDefined = function (v) {
            return typeof v !== 'undefined';
        };

    // Support AMD, CommonJS, window
    if (typeof define === 'function' && define.amd) {
        // only d3.js
        define('AcubedMapChart', ['d3'], AcubedMapChart);
    } else if ('undefined' !== typeof exports && 'undefined' !== typeof module) {
        module.exports = AcubedMapChart;
    } else {
        window.AcubedMapChart = AcubedMapChart;
    }

    var getXYFromTranslate = function(translateString) {
        var split = translateString.split(",");
        var x = split[0] ? ~~split[0].split("(")[1] : 0;
        var y = split[1] ? ~~split[1].split(")")[0] : 0;
        return [x, y];
    };

})(window, window.d3);
