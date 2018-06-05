(function (window, d3, chartStyleUtil, Promise) {
    'use strict';

    var Hitmap = {
        // TODO set version (OPTION)
        version: "0.0.1",
        chart: {
            fn: Chart.prototype,
            internal: {
                fn: ChartInternal.prototype
            }
        }
    };

    var chart_fn = Hitmap.chart.fn,
        chart_internal_fn = Hitmap.chart.internal.fn;

    Hitmap.generate = function (config) {
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
            config = $$.config;

        // TODO your coding area (OPTION)
        // .... resize and draw
        config.size_width = size ? size.width : null;
        config.size_height = size ? size.height : null;
        $$.resize(config);
    };

    chart_fn.load = function (data) {
        var $$ = this.internal,
            config = $$.config;

        // TODO your coding area (OPTION)
        // .... load data and draw. It is option
        config.data = data;
        $$.draw(config);
    };

    chart_fn.reload = function () {
        var $$ = this.internal,
            config = $$.config;

        // TODO your coding area (OPTION)
        // .... reload data and draw. It is option
        $$.draw(config);
    };

    chart_fn.highlight = function (xIndex, yIndex) {
        var $$ = this.internal,
            config = $$.config;

        // TODO release memory (OPTION)
        // ....
        $$.highlight(xIndex, yIndex);
    };

    chart_fn.destroy = function () {
        var $$ = this.internal,
            config = $$.config;

        // TODO release memory (OPTION)
        // ....
        if (config.data) {
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
            data_x: undefined,
            data_y: undefined,
            data_values: undefined,
            size_width: undefined,
            size_height: undefined,
            axis_x: undefined,
            axis_x_label: 'xLabel',
            axis_x_index: 0,
            axis_x_summaryType: undefined,
            axis_x_click: undefined,
            axis_y: undefined,
            axis_y_index: 1,
            axis_y_label: 'yLabel',
            axis_y_summaryType: undefined,
            axis_y_extend: false,
            margin_top: 50,
            margin_left: 100,
            margin_right: 0,
            margin_bottom: 0,
            block_size_width: undefined,
            block_size_height: undefined,
            block_color: undefined, //function() {},
            block_headColor: undefined, //function() {},
            block_style: undefined, //function() {},
            block_click: undefined, //function() {},
            block_mouseover: undefined, //function() {},
            block_mouseout: undefined, //function() {},
            axis_y_extendData: undefined, //function() {},
            data_onclick: function () { },
            data_onmouseover: function () { },
            data_onmouseout: function () { },
            data_onselected: function () { },
            data_onunselected: function () { },
            tooltip_show: function () { },
            tooltip_hide: function () { },
            blockColor: function () { },
            subblockColor: function () { },
            pivot_show: false,
            pivot_beforeHook: function () { },
            zoomstart: function () { }
        };

        return config;
    };

    chart_internal_fn.getDefaultValues = function () {
        // TODO your coding area (OPTION)
        // you must set => <name>_<name>_<name>: value
        var values = {
            mapSize: {
                width: 0,
                height: 0
            },
            maxBlockSize: {
                width: 100,
                height: 100
            },
            headerBlockFixSize: {
                width: 30,
                height: 30
            },
            extendImagePath: {
                plus: 'assets/images/taskers/icon-wqp-plus.svg',
                minus: 'assets/images/taskers/icon-wqp-minus.svg'
            },
            pivotImagePath: 'assets/images/taskers/icon-wqp-pivot-width.svg',
            extendImageSize: {
                width: 20,
                height: 20
            },
            fontSize: 12,
            fontScaleBaseSize: {
                width: 30,
                height: 14
            },
            axis_x_index: -1,
            axis_y_index: -1,
            zoom: undefined,
            scaleExtent: [1,10],
            blockDatas: {},
            extendDatas: {},
            extendBlockDatas: {},
            yAxisTickCountByExtend: 0,
            selection: {
                svg : null,
                container: {
                    b : null,
                    x : null,
                    y : null,
                    zoom : {
                        x: null,
                        y: null
                    },
                    shield : null
                },
                b: {
                    group: null,
                    block: null,
                    blockText: null
                },
                x: {
                    group: null,
                    block: null,
                    blockText: null,
                    label: null
                },
                y: {
                    group: null,
                    block: null,
                    blockText: null,
                    label: null,
                    bg: null,
                    image: null
                },
            }
        };

        return values;
    }

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

    chart_internal_fn.updateSize = function () {
        var $$ = this,
            config = $$.config,
            that = $$.chart_internal_val;

        that.mapSize = {
            width: 0, height: 0
        };
        config.size_width = (config.size_width) ? config.size_width : d3.select(config.bindto)[0][0].parentNode.offsetWidth;
        config.size_height = (config.size_height) ? config.size_height : d3.select(config.bindto)[0][0].parentNode.offsetHeight;
        that.mapSize.width = config.size_width - config.margin_left - config.margin_right;
        that.mapSize.height = config.size_height - config.margin_top - config.margin_bottom;

        var min, max = that.maxBlockSize.width;
        if (that.mapSize.width/config.data.x.length > that.mapSize.height/that.yAxisTickCountByExtend) {
            min = that.mapSize.height/that.yAxisTickCountByExtend;
        } else {
            min = that.mapSize.width/config.data.x.length;
        }

        that.scaleExtent[1] = Math.abs(max/min);
        
        that.xScale = d3.scale.linear()
            .domain([0, config.data.x.length])
            .range([0, config.data.x.length*min]);

        that.yScale = d3.scale.linear()
            .domain([0, that.yAxisTickCountByExtend])
            .range([0, that.yAxisTickCountByExtend*min]);   
    }

    chart_internal_fn.initEvent = function () {
        var $$ = this,
            config = $$.config,
            that = $$.chart_internal_val;

        $$.setScale();        
    }

    chart_internal_fn.setScale = function () {
        var $$ = this,
            config = $$.config,
            that = $$.chart_internal_val;

        that.zoom = d3.behavior.zoom()
            .x(that.xScale)
            .xExtent([0,config.data.x.length])
            .y(that.yScale)
            .yExtent([0,that.yAxisTickCountByExtend])
            .scaleExtent(that.scaleExtent)
            .size([that.mapSize.width, that.mapSize.height])
            .on("zoom", that.zoomed)
            .on("zoomstart", function() {
                config.zoomstart();
            });            

        that.zoomed = function() {
            $$.applyZoom();
        }

        that.selection.svg
            .call(that.zoom);
    }

    chart_internal_fn.initValue = function () {
        var $$ = this,
            config = $$.config,
            that = $$.chart_internal_val;

        that.blockDatas = {};
        that.extendDatas = {};
        that.extendBlockDatas = {};    

        if (that.axis_x_index === -1) { //first loader
            that.axis_x_index = config.axis_x_index;
            that.axis_y_index = config.axis_y_index;
        }        
    };

    chart_internal_fn.setChartData = function() {
        var $$ = this,
            config = $$.config,
            that = $$.chart_internal_val;

        var temp = config.data.values.map(function (v, $index) {
            return {
                x: v[config.axis_x_index],
                y: v[config.axis_y_index],
                value: v[2],
                spec: [v[3], v[4], v[5]]
            }
        });
        that.blockDatas = _.groupBy(temp, 'y');
        that.yAxisTickCountByExtend = config.data.y.length;
        if (!_.isEmpty(that.extendDatas)) {
            _.keys(that.extendDatas).forEach(function (rowIndex) {
                that.yAxisTickCountByExtend += that.extendDatas[rowIndex].y.length;
            });
        }   

    };

    chart_internal_fn.draw = function (config) {

        var $$ = this,
            config = $$.config,
            that = $$.chart_internal_val;

        if (that.selection.svg !== null) {
            d3.select(config.bindto).selectAll('svg').remove();
            that.selection.svg = null;
        }

        if (!config.data || !config.data.x || config.data.x.length === 0) {
            return;
        }

        $$.initValue();
        $$.redraw(config);
    };

    chart_internal_fn.redraw = function (config) {
        var $$ = this,
            config = $$.config,
            that = $$.chart_internal_val;

        $$.setChartData();

        $$.updateSize();
        $$.setContainer(); //
        $$.initEvent();

        $$.updateContainer();
       


        $$.genCrossing();
        $$.genXaxis();
        $$.genYaxis();
        $$.genBlocks();

        if (!_.isEmpty(that.extendDatas)) {
            _.keys(that.extendDatas).forEach(function (rowIndex) {
                $$.addExtendRows(parseInt(rowIndex));
            });
        }

        $$.applyStyle(); //
    };    

    chart_internal_fn.resize = function (config) {
        var $$ = this,
            config = $$.config,
            that = $$.chart_internal_val;

        $$.updateSize();
        $$.initEvent(); 
     
        $$.updateContainer();

     
        $$.genCrossing();
        
        $$.resizeXaxis();
        $$.resizeYaxis();
        $$.resizeBlocks();

        if (!_.isEmpty(that.extendDatas)) {
            _.keys(that.extendDatas).forEach(function (rowIndex) {
                $$.addExtendRows(parseInt(rowIndex));
            });
        }
    };        

    chart_internal_fn.applyStyle = function() {
        var $$ = this,
            config = $$.config,
            that = $$.chart_internal_val;

        // xAxis         
        if ($$.isFunction(config.block_style)) { 
            that.selection.x.group.selectAll(".head_block")
                .attr("class", function (d, i) { return d3.select(this).attr('class') + " " + config.block_style(d[1]); });
        };
        if ($$.isFunction(config.block_headColor)) {
            that.selection.x.group.selectAll("rect.head_block")
                .style("stroke", '#fff')
                .style("fill", function (d, i) {
                    return config.block_headColor(d[1]);
                });
        };      
        if ($$.isFunction(config.axis_x_click)) {
            that.selection.x.label
                .style("cursor", 'hand')
                .on('click', function (d, i) {
                    config.axis_x_click(d, i);
                });
        }; 

        // yAxis
        if ($$.isFunction(config.block_style)) {
            that.selection.y.group.selectAll(".head_block")
                .attr("class", function (d, i) { return d3.select(this).attr('class') + " " + config.block_style(d[1]); });
        };
        if ($$.isFunction(config.block_headColor)) {
            that.selection.y.group.selectAll("rect.head_block")
                .style("stroke", '#fff')
                .style("fill", function (d, i) {
                    return chartStyleUtil.colorLuminance(config.block_headColor(d[1]), d3.select(this).classed('sub') ? 0.2 : 0);
                });
        };     

        // blocks
        if ($$.isFunction(config.block_style)) {
            that.selection.b.group.selectAll(".block")
                .attr("class", function (d, i) { return d3.select(this).attr('class') + " " + config.block_style(d.value); });
        };
        if ($$.isFunction(config.block_color)) {
            that.selection.b.group.selectAll("rect.block")
                .style("stroke", '#fff')
                .style("fill", function (d, i) {
                    return chartStyleUtil.colorLuminance(config.block_color(d.value), d3.select(this).classed('sub') ? 0.03 : 0);
                });
        };
    }

    chart_internal_fn.setContainer = function() {
        var $$ = this,
            config = $$.config,
            that = $$.chart_internal_val;

        var w = that.mapSize.width + config.margin_left + config.margin_right,
            h = that.mapSize.height + config.margin_top + config.margin_bottom;

        if (that.selection.svg !== null) {
            that.selection.svg.selectAll("g").remove();
            that.selection.svg.selectAll("rect").remove();
            that.selection.svg.selectAll("defs").remove();

        } else {          
            that.selection.svg = d3.select(config.bindto).append("svg")
                .append("g");
        }

        var defs = that.selection.svg.append("defs");
            defs.append("clipPath")
                .attr("id","block-area")
                .append("rect");

            defs.append("clipPath")
                .attr("id","xAxis-area")
                .append("path");

            defs.append("clipPath")
                .attr("id","yAxis-area")
                .append("rect");

        that.selection.container.b = that.selection.svg.append("g")
            .attr("clip-path", "url(#block-area)")
            .attr("class", "blockArea");            

        that.selection.container.x = that.selection.svg.append("g")
            .attr("clip-path", "url(#xAxis-area)")
            .attr("class", "xAxisArea");

        that.selection.container.y = that.selection.svg.append("g")
            .attr("clip-path", "url(#yAxis-area)")
            .attr("class", "yAxisArea");
/*
        that.selection.container.zoom.x = that.selection.svg.append("rect")
            .attr("class", "xAxisArea")
            .attr("pointer-events", "all")
            .style("visibility", "hidden");

        that.selection.container.zoom.y = that.selection.svg.append("rect")
            .attr("class", "yAxisArea")
            .attr("pointer-events", "all")
            .style("visibility", "hidden");
*/
        that.selection.container.shield = that.selection.svg.append("rect")
            .attr("width", w)
            .attr("height", h)
            .attr("class", "shield bottom")
            .style("fill", "#fff");      
               
    };

    chart_internal_fn.updateContainer = function() {
        var $$ = this,
            config = $$.config,
            that = $$.chart_internal_val;

        var w = that.mapSize.width + config.margin_left + config.margin_right,
            h = that.mapSize.height + config.margin_top + config.margin_bottom;

        d3.select(config.bindto).select("svg")
            .attr("width", w)
            .attr("height", h);

        var defs = that.selection.svg.select("defs");
        defs.select("clipPath#block-area").select("rect")
            .attr("width", that.mapSize.width)
            .attr("height", that.mapSize.height);

        var r = 80,
            tPadding = config.margin_top - that.headerBlockFixSize.height -5;
        defs.select("clipPath#xAxis-area").select("path")
            .attr("d", "M0 " + (tPadding - 20)
                + " L " + r + " 0"
                + " L " + (that.mapSize.width + r) + " 0"
                + " L " + (that.mapSize.width) + " " + (tPadding - 10)
                + " L " + (that.mapSize.width) + " " + config.margin_top
                + " L 0 " + config.margin_top
                + " L 0 " + tPadding
            );

        defs.select("clipPath#yAxis-area").select("rect")
            .attr("width", config.margin_left)
            .attr("height", that.mapSize.height);

        that.selection.container.b
            .attr("transform", "translate(" + config.margin_left + "," + config.margin_top + ")");            

        that.selection.container.x
            .attr("transform", "translate(" + config.margin_left + ",0)");

        that.selection.container.y
            .attr("transform", "translate(0," + config.margin_top + ")");
/*
        that.selection.container.zoom.x
            .attr("width",that.mapSize.width)
            .attr("height",config.margin_top)
            .attr("transform", "translate(" + config.margin_left + ",0)");

        that.selection.container.zoom.y
            .attr("width",config.margin_left-that.extendImageSize.width)
            .attr("height",that.mapSize.height)
            .attr("transform", "translate("+that.extendImageSize.width+"," + config.margin_top + ")");
*/
        $$.genBottomShield();       
    };

    chart_internal_fn.genCrossing = function () {
        var $$ = this,
            config = $$.config,
            that = $$.chart_internal_val;

        if (config.pivot_show) {
            var pivotImg = that.selection.svg.select("image.pivotImage")
            if (pivotImg[0][0]) { 
                if (that.axis_x_index !== config.axis_x_index) {
                    pivotImg.transition().delay(0).duration(400)
                        .attr("transform", "translate(" + ((config.margin_left/2)+35) + "," + ((config.margin_top/2)) + ") rotate(90)");
                } else {
                    pivotImg.transition().delay(0).duration(400)
                        .attr("transform", "translate(" + (config.margin_left/2) + "," + (config.margin_top/2) + ") ");
                }
            } else {
                var transform = "translate(" + (config.margin_left / 2) + "," + (config.margin_top / 2) + ") ";
                that.selection.svg.append("svg:image")
                    .attr("xlink:href", that.pivotImagePath)
                    .attr("width", "35")
                    .attr("height", "35")
                    .attr("class", "pivotImage")
                    .attr("transform", transform)
                    .style("cursor", "hand")
                    .on('click', function (d, i) {
                        $$.pivot();
                    });            
            }        
        }
    };

    chart_internal_fn.genXaxis = function () {
        var $$ = this,
            config = $$.config,
            that = $$.chart_internal_val;

        var group = that.selection.container.x.selectAll(".x")
            .data(config.data.x).enter()
            .append("g")
            .attr("class", function (d, i) { return "x col" + i; });

        group.append("rect")
            .attr("class", function (d, i) { return "head_block"; });

        group.filter(function (d) { return d[1] !== null})             
            .append("text")               
            .text(function (d) { return d[1].toFixed(2); })
            .style("text-anchor", "middle")
            .attr("class", function (d, i) { return "head_block" });           

        group.append("text")
            .text(function (d) { return d[0]; })
            .attr("class", "xLabel")
            .append("svg:title")
            .text(function (d) { return d[0]; });

        that.selection.x.group = that.selection.container.x.selectAll(".x");
        that.selection.x.block = that.selection.x.group.selectAll("rect.head_block");
        that.selection.x.blockText = that.selection.x.group.selectAll("text.head_block");
        that.selection.x.label = that.selection.x.group.selectAll("text.xLabel");

        $$.resizeXaxis();
    };

    chart_internal_fn.resizeXaxis = function (dur) {
        var $$ = this,
            config = $$.config,
            that = $$.chart_internal_val;
        var ww = that.xScale(1)-that.xScale(0),
            hh = that.headerBlockFixSize.height,
            _dur = (dur === undefined) ? 0 : dur;

        var axisPadding = 5;
        var tPadding = config.margin_top - hh - axisPadding;
        var fontScale = (ww >= that.fontScaleBaseSize.width) ? 1 : ww / that.fontScaleBaseSize.width;

        that.selection.x.group.transition().delay(0).duration(_dur)
                    .attr("transform", function (d, i) { return "translate(" + that.xScale(i) + ", 0)"; });

        that.selection.x.block.transition().delay(0).duration(_dur)
            .attr("width", ww)
            .attr("height", hh)
            .attr("transform", "translate(0," + tPadding + ")");

        that.selection.x.blockText.transition().delay(0).duration(_dur)
            .attr("font-size", that.fontSize * fontScale)
            .attr("transform", "translate(" + (ww / 2) + "," + (tPadding + (hh / 1.5)) + ")");

        that.selection.x.label.transition().delay(0).duration(_dur)
            .attr("transform", "translate(" + (ww / 2) + "," + (tPadding - 5) + ") rotate(-30)")
            .attr("font-size", that.fontSize * fontScale);
    };

    chart_internal_fn.genYaxis = function (rowIndex) {
        var $$ = this,
            config = $$.config,
            that = $$.chart_internal_val;
        var group = null, addClassName = '';

        if (rowIndex === undefined) {
            group = that.selection.container.y.selectAll(".y.main")
                .data(config.data.y).enter()
                .append("g")
                .attr("class", function (d, i) { return "y main row" + i; });
        } else {
            addClassName = 'sub';
            group = that.selection.container.y.selectAll(".y.row" + rowIndex + ".sub")
                .data(that.extendDatas[rowIndex].y)
                .enter().insert("g", ".y.main.row" + (rowIndex+1))
                .attr("class", function (d, i) { return "y row" + rowIndex + " sub sub-row" + i; });
        }

        group.append("rect")
            .attr("width", config.margin_left)
            .attr("class", "bg")
            .style("fill", "#fff");

        if (config.axis_y_extend) {
            if (rowIndex === undefined) {
                group.append("svg:image")
                    .attr("xlink:href", function (d, i) { return that.extendDatas[i] === undefined ? that.extendImagePath.plus : that.extendImagePath.minus })
                    .attr("class", "yExtendImage")
                    .style("cursor", "hand")
                    .on('click', function (d, i) {
                        var thisObj = d3.select(this);
                        if (thisObj.attr("xlink:href") === that.extendImagePath.plus) {
                            thisObj.attr("xlink:href", that.extendImagePath.minus);
                            $$.extend(true, d[0], i);
                        } else {
                            thisObj.attr("xlink:href", that.extendImagePath.plus);
                            $$.extend(false, d[0], i);
                        }
                    });
            }
        }

        group.append("text")
            .text(function (d) { return d[0]; })
            .style("text-anchor", "")
            .attr("dy", ".35em")
            .attr("class", "yLabel")
            .attr('fill', 'black')
            .append("svg:title")
                .text(function (d) { return d[0]; });

        group.append("rect")
            .attr("class", "head_block " + addClassName);

        group.filter(function (d) { return d[1] !== null})   
            .append("text")
            .text(function (d) { return d[1].toFixed(2); })
            .style("text-anchor", "middle")
            .attr("dy", ".35em")
            .attr("class", "head_block");

        that.selection.y.group = that.selection.container.y.selectAll("g.y");
        that.selection.y.bg = that.selection.y.group.selectAll("rect.bg");
        that.selection.y.image = that.selection.y.group.selectAll("image");
        that.selection.y.block = that.selection.y.group.selectAll("rect.head_block");
        that.selection.y.blockText = that.selection.y.group.selectAll("text.head_block");
        that.selection.y.label = that.selection.y.group.selectAll("text.yLabel");

        $$.resizeYaxis();
    };

    chart_internal_fn.resizeYaxis = function (dur) {
        var $$ = this,
            config = $$.config,
            that = $$.chart_internal_val;

        var ww = that.headerBlockFixSize.width,
            hh = that.yScale(1)-that.yScale(0),
            _dur = (dur === undefined) ? 0 : dur;

        var extendImagePaddingWidth = 5;
        var axisPadding = 5;
        var yLabelWidth = config.margin_left - ww - axisPadding;//_.max(config.data.y.map(function(d) { return d[0].length; }))*10;
        var lPadding = 0;//config.margin_left-(yLabelWidth+config.block_size_width)-axisPadding;
        var fontScale = (hh >= that.fontScaleBaseSize.height) ? 1 : hh / that.fontScaleBaseSize.height;

        if (config.axis_y_extend) {
            var imgScale = (hh >= that.extendImageSize.height) ? 1 : hh / that.extendImageSize.height;
            lPadding = that.extendImageSize.width * imgScale + extendImagePaddingWidth;
            yLabelWidth -= that.extendImageSize.width * imgScale + extendImagePaddingWidth;
        }

        that.selection.y.group.each(function(d,i) { 
            d3.select(this).transition().delay(0).duration(_dur).attr("transform", "translate(0," + that.yScale(i) + ")");
        });

        that.selection.y.bg.transition().delay(0).duration(_dur)
            .attr("height", hh)
            .attr("height", hh);

        that.selection.y.image.transition().delay(0).duration(_dur)
            .attr("width", that.extendImageSize.width * imgScale)
            .attr("height", that.extendImageSize.height * imgScale)
            .attr("transform", "translate(0," + (hh / 2 - (that.extendImageSize.height * imgScale) / 2) + ")");            

        that.selection.y.block.transition().delay(0).duration(_dur)
            .attr("width", ww)
            .attr("height", hh)
            .attr("transform", "translate(" + (lPadding + yLabelWidth) + ",0)");

        that.selection.y.blockText.transition().delay(0).duration(_dur)
            .attr("transform", "translate(" + (lPadding + yLabelWidth + (ww / 2)) + "," + (hh / 2) + ")")
            .attr("font-size", that.fontSize * fontScale);     

        that.selection.y.label.transition().delay(0).duration(_dur)
            .attr("transform", "translate(" + lPadding + "," + (hh / 2) + ")")
            .attr("font-size", that.fontSize * fontScale);    
    };    

    chart_internal_fn.genBlocks = function (rowIndex) {
        var $$ = this,
            config = $$.config,
            that = $$.chart_internal_val;
        var rowLevelDatas = null,
            group = null, addClassName = '';

        if (rowIndex === undefined) {
            rowLevelDatas = that.blockDatas;
            group = that.selection.container.b.selectAll("g")
                .data(config.data.y)
                .enter().append("g")
                .attr("class", function (d, i) { return "main row" + i; });

        } else {
            addClassName = 'sub';
            rowLevelDatas = that.extendBlockDatas[rowIndex];
            
            group = that.selection.container.b.selectAll("g.sub.row" + rowIndex)
                .data(that.extendDatas[rowIndex].y)
                .enter().insert("g", ".main.row" + (rowIndex+1))
                .attr("class", function (d, i) { return "sub row" + rowIndex + " sub-row" + i; });
        }

        group.selectAll("rect")
            .data(function (d, i) { return rowLevelDatas[i]; })
            .enter().append("rect")
                .attr("class", function (d, i) { return "block row" + d.y + " col" + d.x + " " + addClassName })
                .style('cursor', 'hand')
                .on("click", function (d) {
                    that.selection.container.b.selectAll(".highlight").classed('highlight', false);
                    config.block_click(d, $$, d3.event);
                })                
                .on("mouseover", function (d) {
                    that.selection.container.x.selectAll("text.xLabel.highlight").classed('highlight', false);
                    that.selection.container.y.selectAll("text.yLabel.highlight").classed('highlight', false);
                    that.selection.container.b.selectAll(".highlight").classed('highlight', false);
                    
                    that.selection.container.x.selectAll("g.col" + d.x).select("text.xLabel").classed('highlight', true);
                    that.selection.container.y.selectAll("g." + d3.select(this)[0][0].parentNode.classList.toString().replace(/ /gi, "."))
                        .select("text.yLabel").classed('highlight', true);
                    that.selection.container.b.selectAll("text.block.col" + d.x + ".row" + d.y).classed('highlight', true);

                    config.block_mouseover(d, $$, d3.event);
                })
                .on("mouseout", function (e) {
                    config.block_mouseout(d3.event);
                });            

        group.selectAll("text")
            .data(function (d, i) { return _.filter(rowLevelDatas[i], function(n) { return n.value !== null }); })
            .enter().append("text")
                .text(function (d) { return d.value.toFixed(2); })
                .style("text-anchor", "middle")           
                .attr("class", function (d, i) { return "block row" + d.y + " col" + d.x });              

        that.selection.b.group = that.selection.container.b.selectAll("g");
        that.selection.b.block = that.selection.b.group.selectAll("rect");
        that.selection.b.blockText = that.selection.b.group.selectAll("text");    

        $$.resizeBlocks();         
    };

    chart_internal_fn.resizeBlocks = function (dur) {
        var $$ = this,
            config = $$.config,
            that = $$.chart_internal_val;

        var ww = that.xScale(1)-that.xScale(0),
            hh = that.yScale(1)-that.yScale(0),
            _dur = (dur === undefined) ? 0 : dur;      

        that.selection.b.group.each(function(d,i) { 
            d3.select(this).transition().delay(0).duration(_dur).attr("transform", "translate(0," + that.yScale(i) + ")");
        });

        that.selection.b.block.transition().delay(0).duration(_dur)
            .attr("x", function (d, i) { return that.xScale(i); })
            .attr("width", ww)
            .attr("height", hh);

        var widthScale = (hh >= that.fontScaleBaseSize.height) ? 1 : hh / that.fontScaleBaseSize.height,
            heightScale = (ww >= that.fontScaleBaseSize.width) ? 1 : ww / that.fontScaleBaseSize.width,
            fontScale = (heightScale < widthScale) ? heightScale : widthScale;

        if (fontScale < 0.7) { 
            if (that.selection.b.blockText) {
                that.selection.b.blockText.remove();
                that.selection.b.blockText = null;
            }
        } else {
            if (that.selection.b.blockText === null) {
                that.selection.container.b.selectAll("g.main").selectAll("text")
                    .data(function (d, i) { return _.filter(that.blockDatas[i], function(n) { return n.value !== null }); })
                    .enter().append("text")
                        .text(function (d) { return d.value.toFixed(2); })
                        .style("text-anchor", "middle")            
                        .attr("class", function (d, i) { return "block row" + d.y + " col" + d.x }); 

                if (!_.isEmpty(that.extendDatas)) {
                    _.keys(that.extendDatas).forEach(function (rowIndex) {

                        that.selection.container.b.selectAll("g.sub.row"+rowIndex).selectAll("text")
                            .data(function (d, i) { return _.filter(that.extendBlockDatas[rowIndex][i], function(n) { return n.value !== null }); })
                            .enter().append("text")
                                .text(function (d) { return d.value.toFixed(2); })
                                .style("text-anchor", "middle")            
                                .attr("class", function (d, i) { return "block row" + d.y + " col" + d.x });              
                    });
                }                 
                                    
                that.selection.b.blockText = that.selection.b.group.selectAll("text");                 
            }
            that.selection.b.blockText.transition().delay(0).duration(_dur)
                .attr("x", function (d, i) { return that.xScale(d.x); })
                .attr("transform", "translate(" + (ww / 2) + "," + (hh / 2) + ")")
                .attr("font-size", that.fontSize * fontScale)
                .attr("dy", ".35em");          
        }
          
    };

    chart_internal_fn.genBottomShield = function (yTrans, dur) {
        var $$ = this,
            config = $$.config,
            that = $$.chart_internal_val;

        var _dur = (dur === undefined) ? 0 : dur;
        var _yTrans = (yTrans === undefined) ? that.yScale(that.yAxisTickCountByExtend)+config.margin_top : yTrans;

        that.selection.container.shield.transition().delay(0).duration(_dur)
            .attr("transform", function (i) {
                return "translate(0," + _yTrans + ")";
            }); 
    };

    chart_internal_fn.applyZoom = function (dur) {
        var $$ = this,
            config = $$.config,
            that = $$.chart_internal_val;

        var _dur = (dur === undefined) ? 0 : dur;

        $$.resizeXaxis(_dur);
        $$.resizeYaxis(_dur);
        $$.resizeBlocks(_dur);    

        $$.genBottomShield(undefined, _dur);
    };

    chart_internal_fn.addExtendRows = function (rowIndex) {
        var $$ = this,
            config = $$.config,
            that = $$.chart_internal_val;

        for (var i = rowIndex + 1; i < config.data.y.length; i++) {
            that.selection.container.y.selectAll("g.row" + i)
                .attr("transform", "translate(0," + that.yScale(i+that.extendDatas[rowIndex].y.length) + ")");

            that.selection.container.b.selectAll("g.row" + i)
                .attr("transform", "translate(0," + that.yScale(i+that.extendDatas[rowIndex].y.length) + ")");
        }
        
        $$.genYaxis(rowIndex);

        $$.genBlocks(rowIndex);
    };

    chart_internal_fn.extend = function (isExtend, d, index) {
        var $$ = this,
            config = $$.config,
            that = $$.chart_internal_val;

        var promise = undefined;

        if (isExtend) {
            var extendDataSet = undefined;

            if (!$$.isFunction(config.axis_y_extendData)) {
                return;
            };

            promise = config.axis_y_extendData(d).then(function (result) {
                extendDataSet = result;

                if (extendDataSet.y.length === 0) {
                    return;
                }

                that.extendDatas[index] = extendDataSet;

                var temp = [];
                temp = extendDataSet.values.map(function (v, $index) {
                    return {
                        x: v[that.axis_x_index],
                        y: v[that.axis_y_index],
                        value: v[2],
                        parentIndex: index,
                        spec: [v[3], v[4], v[5]]
                    }
                });

                that.extendBlockDatas[index] = _.groupBy(temp, 'y');
            });

        } else {
            var minusLength = that.selection.container.y.selectAll("g.row" + index + ".sub")[0].length,
                st = _.indexOf(that.selection.y.group[0],that.selection.container.y.selectAll('g.main')[0][index+1]),
                ed = that.selection.y.group[0].length;

            if (st > -1) {
                for (var i = st; i < ed; i++) {
                    d3.select(that.selection.y.group[0][i]).transition().delay(0).duration(500)
                        .attr("transform", "translate(0," + that.yScale(i-minusLength) + ")");
                    d3.select(that.selection.b.group[0][i]).transition().delay(0).duration(500)
                        .attr("transform", "translate(0," + that.yScale(i-minusLength) + ")");
                }
            }

            $$.genBottomShield(that.yScale(that.yAxisTickCountByExtend-minusLength)+config.margin_top, 500);

            promise = new Promise((resolve, reject) => {
                delete that.extendDatas[index];
                delete that.extendBlockDatas[index];

                setTimeout(function () {
                    that.selection.container.y.selectAll("g.sub.row" + index).remove();
                    that.selection.container.b.selectAll("g.sub.row" + index).remove();

                    $$.genYaxis();
                    $$.genBlocks();

                    that.yAxisTickCountByExtend -= minusLength;
                    resolve();
                }, 1000);
            });
        }

        promise.then(function () {
            that.yAxisTickCountByExtend = that.selection.container.y.selectAll("g.y")[0].length;

            if (isExtend) {
               $$.redraw(config);

            } else {
                $$.updateSize();
                $$.initEvent();

                $$.applyZoom(500); 
            }
        });
    };

    chart_internal_fn.highlight = function (xIndex, yIndex) {
        var $$ = this,
            config = $$.config,
            that = $$.chart_internal_val;

        if (that.selection.container.b === null) return;

        if (yIndex === undefined) {
            
            that.selection.container.b.selectAll(".highlight").classed('highlight', false);
            that.selection.container.b.selectAll(".col" + xIndex).classed('highlight', true);
        }
    };

    chart_internal_fn.pivot = function () {
        var $$ = this,
            config = $$.config,
            that = $$.chart_internal_val;

        var pivotData = { x: [], y: [], values: [] };
        var xIndex = config.axis_x_index;
        var yIndex = config.axis_y_index;
        var xLabel = config.axis_x_label;
        var yLabel = config.axis_y_label;

        pivotData.x = config.data.y;
        pivotData.y = config.data.x;
        pivotData.values = config.data.values;

        config.axis_y_index = xIndex;
        config.axis_x_index = yIndex;
        config.axis_y_label = xLabel;
        config.axis_x_label = yLabel;

        config.data = pivotData;

        if ($$.isFunction(config.pivot_beforeHook)) {
            config.pivot_beforeHook($$);
        }

        that.extendDatas = {};
        that.extendBlockDatas = {};

        $$.redraw(config);
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
        define('Hitmap', ['d3'], Hitmap);
    } else if ('undefined' !== typeof exports && 'undefined' !== typeof module) {
        module.exports = Hitmap;
    } else {
        window.Hitmap = Hitmap;
    }

})(window, window.d3, window.chartStyleUtil, Promise);