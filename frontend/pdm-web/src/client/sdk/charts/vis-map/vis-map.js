(function (window) {
    'use strict';

    var VisMap = {
        version: '0.0.1',
        chart: {
            fn: Chart.prototype,
            internal: {
                fn: ChartInternal.prototype
            }
        }
    };

    var chart_fn = VisMap.chart.fn,
        chart_internal_fn = VisMap.chart.internal.fn,
        chart_internal_val = null,
        chart_config = null;

    VisMap.generate = function (config) {
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
            canvas: null,           // canvas
            map: null,              // map
            nodes: null,            // nodes
            edges: null,            // edges
            drawingWidth: 0,        // cartesian 타입에서 width
            drawingHeight: 0,       // cartesian 타입에서 height
            isCreation: false,      // 차트 생성여부
            isDataChange: false,    // 데이터 변경 여부
            isResizeEnable: false,  // 리사이즈 사용가능 여부(최초에 resize()가 자동으로 실행되어서 최초에 resize() 실행 안되게 할 목적)
            isReset: false,         // reset flag
            isSelected: false,      // 선택된 노드 flag
            selectedNode: null,     // 선택된 노드
            tracenodes: [],         // 선택된 노드 배열
            traceedges: [],         // 선택된 엣지 배열
            rootNode: [0],          // Root 노드
            filterNodes: [],        // Filter 된 노드
            filterText: [],         // 검색 텍스트
            tmp: null
        };

        chart_config = $$.config;
        chart_internal_val = $$.chart_internal_val;
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

        _drawChart($$);
    };

    chart_fn.clear = function() {
        var $$ = this.internal
        _removeChart($$);
    };

    chart_fn.destroy = function () {
        var $$ = this.internal;
        _removeChart($$);
    };


    chart_fn.filterData = function (filterText) {
        var $$ = this.internal,
            that = $$.chart_internal_val;

        that.filterText = filterText;

        _filterData($$);
    };

    // internal fn : configuration, init
    chart_internal_fn.getDefaultConfig = function () {
        return {
            bindto: '#chart',
            chartDiameter: 1000,
            chartWidth: 1000,
            chartHeight: 2000,
            userImageSize: 50,              // User Image Size
            circleRadian: 5,                // Circle Radian
            data: [],                       // 최초 load 된 전체 데이터
            mapConfig: {},                  // mapConfig
            mapStyle: {},                   // mapConfig
            event: {}                       // event
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
        _init_chart_draw();
        // _init_draw_chart();

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
        }

        function _init_chart_val() {
            var parent_node = $($$.config.bindto);
            that.canvas = parent_node[0];
        }

        function _init_chart_draw() {
            if (!that.isCreation) {
                _append_chart();
                _bindEvent();
                that.isCreation = true;
            }
        }

        function _append_chart() {
            var canvas = that.canvas,
                data = $$.config.data,
                mapConfig = $$.config.mapConfig;

            that.map = new vis.Network(canvas, data, mapConfig);
            that.nodes = data.nodes;
            that.edges = data.edges;
        }

        function _bindEvent() {
            var map = that.map,
                event = $$.config.event;

            if (event.hasOwnProperty('click') && event.click.enable === true) {
                map.on("click", function (params) {
                    var node = params.nodes.length > 0 ? params.nodes[0] : undefined,
                        eventParam = node ? _getEventParam(node) : null;
                    if (node) {
                        that.isSelected = true;
                        event.click.callback(eventParam); //callback click function
                        traceBack(node);
                    } else {
                        that.isSelected = false;
                        event.click.callback(eventParam); //callback click function
                        resetProperties();
                    }
                });
            }

            if (event.hasOwnProperty('hoverNode') && event.hoverNode.enable === true) {
                map.on("hoverNode", function (params) {
                    if (!that.isSelected) {
                        traceBack(params.node);
                    }
                });
                map.on("blurNode", function () {
                    if (!that.isSelected) {
                        resetProperties();
                    }
                });
            }

            if (event.hasOwnProperty('afterDrawing') && event.afterDrawing.enable === true) {
                map.on("afterDrawing", function (canvas) {
                    event.afterDrawing.callback(canvas); //callback afterDrawing function
                });
            }
        }

        function _getEventParam(node) {
            var data = that.nodes.get(node),
                positions = that.map.getPositions(node),
                position = that.map.canvasToDOM(positions[node]);
            return {
                data: data,
                target: that.map,
                bindto: $$.config.bindto,
                position: position,
                isSelected: that.isSelected
            };
        }

        function _transition_chart() {
            var width = that.drawingWidth,
                height = that.drawingHeight;
        }
    }

    function _filterData(chart) {
        var $$ = chart;
        var that = $$.chart_internal_val;
        var filter = that.nodes.get({
            filter: function (item) {
                return (item.hiddenLabel ? item.hiddenLabel.toUpperCase().indexOf(that.filterText.toUpperCase())> -1 : false);
            }
        });
        var modNodeIds = _.uniq(getAllTraceBackNodes(filter));

        that.filterNodes = modNodeIds.map(function (i) {
            return that.nodes.get(i);
        });

        colorDarkenAllNodes();
        colorFilter(that.filterNodes);
    }

    function _removeChart(chart) {
        var $$ = chart;
        var that = $$.chart_internal_val;

        that.map = new vis.Network(that.canvas, {}, {});
        that.nodes = [];
        that.edges = [];
    }


    ///////////////////////////////////////////////////////////////////////////
    //
    // VIS function
    //
    ///////////////////////////////////////////////////////////////////////////

    //Highlight the path from a given node back to the central node.
    function traceBack(node) {
        var that = chart_internal_val;
        if (node != that.selectedNode) {
            that.selectedNode = node;
            resetProperties();
            that.tracenodes = getTraceBackNodes(node);
            that.traceedges = getTraceBackEdges(that.tracenodes);
            //Color nodes yellow
            var modnodes = that.tracenodes.map(function (i) {
                return that.nodes.get(i);
            });
            colorNodes(modnodes, true);
            //Widen edges
            var modedges = that.traceedges.map(function (i) {
                var e = that.edges.get(i);
                return e;
            });
        }
    }

    //Reset the color of all nodes, and width of all edges.
    function resetProperties() {
        var that = chart_internal_val;
        if (!that.isReset) {
            that.selectedNode = null;
            //Reset node color
            var modnodes = that.tracenodes.map(function (i) {
                return that.nodes.get(i);
            });
            colorNodes(modnodes, false);
            //Reset edge width and color
            var modedges = that.traceedges.map(function (i) {
                return that.edges.get(i);
            });
            that.tracenodes = [];
            that.traceedges = [];
        }
    }

    //Get all the nodes tracing back to the start node.
    function getTraceBackNodes(node) {
        var that = chart_internal_val;
        var finished = false;
        var path = [];
        while (!finished) { //Add parents of nodes until we reach the start
            path.push(node);
            if (that.rootNode.indexOf(node) !== -1) { //Check if we've reached the end
                finished = true;
            }
            // rootNode empty check
            if (that.rootNode.length === 0) {
                finished = true;
            }
            node = that.nodes.get(node).parent; //Keep exploring with the node above.
        }
        return path;
    }

    function getAllTraceBackNodes(nodes) {
        var path = [];
        nodes.forEach(function(d){
            path = path.concat(getTraceBackNodes(d.id));
        });
        return path;
    }

    //Get all the edges tracing back to the start node.
    function getTraceBackEdges(tbnodes) {
        var that = chart_internal_val;
        var path = [];
        tbnodes.reverse();
        for (var i = 0; i < tbnodes.length - 1; i++) { //Don't iterate through the last node
            path.push(getEdgeConnecting(tbnodes[i], tbnodes[i + 1]));
        }
        return path;
    }

    // Get the id of the edge connecting two nodes a and b
    function getEdgeConnecting(a, b) {
        var that = chart_internal_val;
        var edge = that.edges.get({
            filter: function (edge) {
                return edge.from === a && edge.to === b;
            }
        })[0];
        if (edge instanceof Object) {
            return edge.id;
        }
    }

    // Color nodes from a list based on their level. If color=1, highlight color will be used.
    function colorNodes(modNodes, isOver) {
        var mapStyle = chart_config.mapStyle;
        var that = chart_internal_val;
        var isFilter = that.filterNodes.length > 0;
        var font = isOver ? mapStyle.font.hover : mapStyle.font.normal;
        // var color = isOver ? mapStyle.node.hover : (isFilter ? mapStyle.node.darken : mapStyle.node.normal);
        var color_w = isOver
                    ? mapStyle.node.color.workspace.hover 
                    : (isFilter ? mapStyle.node.color.workspace.darken : mapStyle.node.color.workspace.default);

        var color_t = isOver
                    ? mapStyle.node.color.tasker.hover 
                    : (isFilter ? mapStyle.node.color.tasker.darken : mapStyle.node.color.tasker.default);

        for (var nodeId in modNodes) {
            modNodes[nodeId].color = modNodes[nodeId].nodeType === 'W' ? color_w : color_t;
            modNodes[nodeId].font = font;
            modNodes[nodeId].label = isOver ? modNodes[nodeId].hiddenLabel : (isFilter ? '' : modNodes[nodeId].label);
        }
        that.nodes.update(modNodes);
        that.isReset = false;
        if (isFilter && !isOver) colorFilter(that.filterNodes);
    }

    function colorFilter(modNodes) {
        var mapStyle = chart_config.mapStyle;
        var that = chart_internal_val;
        for (var nodeId in modNodes) {
            modNodes[nodeId].color = modNodes[nodeId].nodeType === 'W' ? mapStyle.node.color.workspace.default : mapStyle.node.color.tasker.default;
            modNodes[nodeId].label = modNodes[nodeId].hiddenLabel;
        }
        that.nodes.update(modNodes);
    }

    function colorDarkenAllNodes() {
        var mapStyle = chart_config.mapStyle;
        var that = chart_internal_val;
        var updateArray = [];
        var allNodes = that.nodes.get({returnType:"Object"});
        for (var nodeId in allNodes) {
            allNodes[nodeId].color = allNodes[nodeId].nodeType === 'W' ? mapStyle.node.color.workspace.darken : mapStyle.node.color.tasker.darken;
            allNodes[nodeId].label = undefined;
            updateArray.push(allNodes[nodeId]);
        }
        that.nodes.update(updateArray);
    }


    ///////////////////////////////////////////////////////////////////////////
    //
    // common function
    //
    ///////////////////////////////////////////////////////////////////////////
    var isDefined = chart_internal_fn.isDefined = function (v) {
        return typeof v !== 'undefined';
    };
    // Support AMD, CommonJS, window
    if (typeof define === 'function' && define.amd) {
        // only d3.js
        define('VisMap', ['d3'], VisMap);
    } else if ('undefined' !== typeof exports && 'undefined' !== typeof module) {
        module.exports = VisMap;
    } else {
        window.VisMap = VisMap;
    }

})(window);
