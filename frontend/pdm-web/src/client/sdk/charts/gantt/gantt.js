(function (window, d3, chartAxis) {
    'use strict';

    var Gantt = {
        // TODO set version (OPTION)
        version: "0.0.2",
        chart: {
            fn: Chart.prototype,
            internal: {
                fn: ChartInternal.prototype
            }
        }
    };

    var chart_fn = Gantt.chart.fn,
        chart_internal_fn = Gantt.chart.internal.fn;

    Gantt.generate = function (config) {
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

        //
        $$.isDebug = false;

        $$.chart_internal_val = {
            svg : null,
            chartSvgWidth: 0,
            chartSvgHeight: 0,
            xScale : null,
            yScale : null,
            colorScale : null,
            xAxis : null,
            yAxis : null,
            ySubAxis : null,
            data: null,
            vakken : null,
            legend : null,
            isCreation : false,
            legendSelectItem : null,
            selectYDomainItem : null,
            isApplyYDomainEV : false,
            isApplyTargetYDomainEV : false,
            eventAlignTarget : null,
            eventMinTimeStamp : null,
            subBarStrokeWidth : 1,
            legendListInfo : [],
            minTimeStamp : null,
            maxTimeStamp : null,
            isHighlitging : false,
            eventAreaConfig : undefined,
        }
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
        $$.draw($$);
    };

    chart_fn.load = function (newConfigData) {
        var $$ = this.internal,
            config = $$.config;

        var tempSizeVal = {
            width : config.size_width,
            height : config.size_height
        };

        $$.chart_internal_val.legendSelectItem = null;
        $$.loadConfig(newConfigData);
        config.size_width = tempSizeVal.width;
        config.size_height = tempSizeVal.height;
        $$.dataSetting();
        $$.draw($$);
    };

    chart_fn.data = function(){
        var $$ = this.internal,
            config = $$.config;

        return config.data;
    }

    chart_fn.getYDomain = function(){
        var $$ = this.internal,
            config = $$.config;

        var returnArr = [];

        config.chart_domainY.forEach(function(item, idx, arr){
            var findLotBarItem = config.data.barDatas.find(function(lotItem){
                return lotItem.barId == item.barId;
            })
            var lotFrom = d3.min(findLotBarItem.subBarDatas.map(function(item){ return item.from; }));
            var lotTo = d3.max(findLotBarItem.subBarDatas.map(function(item){ return item.to; }));
            returnArr.push({"idx" : idx, "title": item.barId, "from" : lotFrom, "to" : lotTo });
        });

        return returnArr;
    }

    chart_fn.getLegendListInfo = function(){
        var $$ = this.internal,
            config = $$.config,
            that = $$.chart_internal_val;

        return that.legendListInfo;
    }

    chart_fn.changeBarColor = function(type){
        var $$ = this.internal,
            config = $$.config,
            that = $$.chart_internal_val;

        config.defaultType = type;
        $$.dataSetting();

        that.svg.selectAll('.bar').data(config.chart_data).selectAll('.subbarRect').data(function(d) { return d.boxes; })
        .style('fill', function(d) {
            if(d.color !== undefined){
                return d.color;
            }else{
                //lot information.
                return 'Green';
            }
        })
        .style('stroke', function(d){
            if(d.color !== undefined){
                return d.color;
            }else{
                //lot information.
                return 'Green';
            }
        })

        //check2
        if(config.innerRect !== null){
            that.svg.selectAll('.bar').selectAll('.barInnerRect').data(function(d) { return d.boxes; })
            .style('fill', function(d){
                return d.color;
            });
        }
    }

    chart_fn.applyUnitAlign = function ( item ) {
        var $$ = this.internal,
            config = $$.config;

        if($$.isDebug){
            console.log('Gantt - applyUnitAlign(start) : item -> ', item, ' legendSelectItem : ', $$.chart_internal_val.legendSelectItem, ' config.eventAlignTarget : ', config.eventAlignTarget);
        }

        $$.chart_internal_val.legendSelectItem = null;
        config.eventAlignTarget = item;
        $$.applyUnitAlign(config.eventAlignTarget, true);

        if($$.isDebug){
            console.log('Gantt - applyUnitAlign(end) : item -> ', item, ' legendSelectItem : ', $$.chart_internal_val.legendSelectItem, ' config.eventAlignTarget : ', config.eventAlignTarget);
        }
    }

    chart_fn.applyAlign = function ( alignType ) {
        var $$ = this.internal,
            config = $$.config;

        if($$.isDebug){
            console.log('Gantt - applyAlign(start) : alignType -> ', alignType, ' legendSelectItem : ', $$.chart_internal_val.legendSelectItem, ' config.eventAlignTarget : ', config.eventAlignTarget);
        }

        // TODO your coding area (OPTION)
        // .... load data and draw. It is option
        $$.chart_internal_val.legendSelectItem = null;
        config.eventAlignTarget = null;
        config.align = alignType;
        $$.dataSetting();
        $$.draw($$);
        $$.highlitingItem();
        $$.settingSubAxis();

    }

    chart_fn.viewEventArea = function(eventAreaConfig){
        var $$ = this.internal, config = $$.config, that = $$.chart_internal_val;

        if( _.isUndefined(eventAreaConfig)){
            return;
        }

        that.eventAreaConfig = eventAreaConfig;

        if (eventAreaConfig.data) {
            if( that.svg == null ){
                return;
            }
            var target = that.svg.select('.'+config.style_gridLineGroupStyleName);
            if(target.node()) {
                //width : that.chartSvgWidth , height : that.chartSvgHeight, x : that.xScale, margin : ( config.margin_bottom / config.margin_top / config.margin_right / config.margin_left )
                _drawEventArea([], eventAreaConfig.onselected, eventAreaConfig.onmouseover, eventAreaConfig.onmouseout, d3.select(target.node().parentNode), that.chartSvgWidth, that.chartSvgHeight, that.xScale, { top : config.margin_top, bottom: config.margin_bottom, right : config.margin_right, left : config.margin_left }, eventAreaConfig.labelRotate);
                setTimeout(function(){
                    _drawEventArea(eventAreaConfig.data, eventAreaConfig.onselected, eventAreaConfig.onmouseover, eventAreaConfig.onmouseout, d3.select(target.node().parentNode), that.chartSvgWidth, that.chartSvgHeight, that.xScale, { top : config.margin_top, bottom: config.margin_bottom, right : config.margin_right, left : config.margin_left }, eventAreaConfig.labelRotate);
                }, 100);
            }
        }
    }

    chart_fn.clear = function(){
        var $$ = this.internal, config = $$.config, that = $$.chart_internal_val;
        if(that.viewport){
            that.viewport.remove();
            that.viewport = null;
        }
        if( that.svg ) {
            that.svg.remove();
            that.svg = null;
        }
        if(that.xScaleViewArea){
            that.xScaleViewArea.remove();
            that.xScaleViewArea = null;
        }
        if(that.legendViewArea){
            that.legendViewArea.remove();
            that.legendViewArea = null;
        }
        if(that.xScale ) {
            that.xScale = null;
        }
        if(that.yScale){
            that.yScale = null;
        }
        if(that.colorScale){
            that.colorScale = null;
        }
        if(that.xAxis){
            that.xAxis = null;
        }
        if(that.yAxis){
            that.yAxis = null;
        }
        if(that.ySubAxis){
            that.ySubAxis = null;
        }
        if(that.data){
            that.data = null;
        }
        if(that.vakken){
            that.vakken = null;
        }
        if(that.legend){
            that.legend = null;
        }
        if(that.legendSelectItem){
            that.legendSelectItem = null;
        }
        if(that.selectYDomainItem){
            that.selectYDomainItem = null;
        }
        if(that.eventAlignTarget){
            that.eventAlignTarget = null;
        }
        if(that.eventMinTimeStamp){
            that.eventMinTimeStamp = null;
        }
        if(that.legendListInfo){
            that.legendListInfo = [];
        }

        if(that.isApplyYDomainEV){
            that.isApplyYDomainEV = false;
        }

        if(that.isApplyTargetYDomainEV){
            that.isApplyTargetYDomainEV = false;
        }

        that.isCreation = false;
        that.chartSvgHeight = 0;
        that.chartSvgWidth = 0;
    }

    chart_fn.destroy = function () {
        var $$ = this.internal,
            config = $$.config;

        // TODO release memory (OPTION)
        // ....
        if(config.data) {
            config.data = undefined;
        }
        $$.api.clear();
    };

    chart_fn.getChartTimeRange = function(){
        var $$ = this.internal,
            config = $$.config,
            that = $$.chart_internal_val;

        var returnObj = {
            min : that.minTimeStamp,
            max : that.maxTimeStamp
        };

        return returnObj;
    }

    // internal fn : configuration, init
    chart_internal_fn.getDefaultConfig = function () {
        // TODO your coding area (OPTION)
        // you must set => <name>_<name>_<name>: value
        var config = {
            //default
            bindto: '#chart',
            data: undefined,
            size_width: 200,
            size_height: 100,
            //custom
            align: 'normal',    //left, normal(default), event
            legendItemWidth : 60,
            legendItemHeight : 25,
            barDefaultHeight : 30,
            xAxisAreaHeight : 30,
            legendAreaHeight : 60,
            eventAlignTarget : null,
            legendboxSize : 18,
            yDomainCharLength : 8.5,
            //event
            barClickFn: null,
            yDomainClickFn: null,
            yDomainClickTarget : null,
            legendClickFn : null,
            backgroundClickFn : null,
            yDomainIconPath : null,
            yDomainIconCursor : 'pointer',
            //
            barOpacity : false,
            barOpacityVal : 0.7,
            isBackgroundClick : false,
            // yDomainClickActive : true,
            from: undefined,
            to: undefined,
            chart_data : [],
            chart_domainX_to : undefined,
            chart_domainX_from : undefined,
            chart_domainY : [],
            chart_colorDomain : [],
            chart_colorRange : [],
            viewport_height: 'parent',
            //style
            style_backgroundStyleName: 'bistel-gantt-background',
            style_xaxisStyleName : 'bistel-gantt-xaxis',
            style_yaxisStyleName : 'bistel-gantt-yaxis',
            style_ysubaxisStyleName : 'bistel-gantt-ysubaxis',
            style_gridLineGroupStyleName : 'bistel-gantt-gridlinegroup',
            style_legendStyleName : 'bistel-gantt-legendbox',
            style_barBackgroundStyleName : 'bistel-gantt-barBg',
            style_color_rectBg : '#f5f5f5',
            margin_top: 0,
            margin_bottom: 0,
            margin_right: 45,
            margin_left: 80,
            //innerRect setting
            innerRect : null,
            spinnerType : null,
            spinnerInitMessage : "No Data",
            //데이터 정렬 설졍 변수.
            dataAlign_baseValue : "yDomain",
            dataAlign_order : "desc",
            barColorList : null,
            moduleGroup : null,
            isShowBarGuideLine : false,
            isZoom : false,
            isShowBarBg : true,
        };

        return config;
    };

    chart_internal_fn.init = function () {
        var $$ = this,
            config = $$.config;
        if($$.isDebug){
            console.log('Gantt - init : ', config);
        }

        // TODO your coding area (OPTION)
        $$.chart_internal_val.isCreation = false;
        $$.dataSetting();
        $$.draw($$);
    };

    //unit 정렬시켜준다.
    //TODO : 하나의 unit 에 대한 정렬이 아닌 모둔 unit 에 대한 정렬이 필요함.. -> 추후 문의해보기.
    chart_internal_fn.applyUnitAlign = function ( item , transitionFlag ) {
        var $$ = this,
            config = $$.config,
            that = $$.chart_internal_val;

        if($$.isDebug){
            console.log('Gantt - applyUnitAlign : ', config);
        }

        //unit 정렬시켜줄 아이템이 없을 경우 return 시켜준다.
        if( item == "" ){
            return;
        }

        //search min timestamp : 정렬시켜줄 기준점.
        that.eventMinTimeStamp = d3.min(that.vakken.data(), function(obj){
            //yDomain 을 기준으로 정렬시켜줄 item 이 하나라도 있을 경우, min 값을 등록.
            obj.min = d3.min(obj.boxes, function(sd){
                if(item == sd.egName){
                    if(sd.x0 == undefined){
                        return;
                    }
                    return sd.x0;
                }
            })
            return obj.min;
        });
        that.vakken.data().forEach(function(data){
            if(data.min){
                data.gap = data.min - that.eventMinTimeStamp;
            }
        });

        //transition 시켜줄 지, 말지 판단.
        if(transitionFlag){
            that.vakken
                .selectAll('.subbarRect').transition()
                .style('fill', _applyUnitAlignFill)
                .style('opacity', _defaultUnitAlignOpacity)
                .attr('x', _subFuncPosX);

            that.vakken
                .selectAll('.barInnerRect').transition()
                .style('fill', _applyUnitAlignPatternFill)
                .style('opacity', _defaultUnitAlignOpacity)
                .attr('x', _subFuncPosX);


        }else if(transitionFlag == undefined || transitionFlag == false){
            that.vakken
                .selectAll('.subbarRect')
                .style('fill', _applyUnitAlignFill)
                .style('opacity', _defaultUnitAlignOpacity)
                .attr('x', _subFuncPosX);
            that.vakken
                .selectAll('.barInnerRect')
                .style('fill', _applyUnitAlignPatternFill)
                .style('opacity', _defaultUnitAlignOpacity)
                .attr('x', _subFuncPosX);
        }

        //unit Item 을 선택시 legendbox 내 해당 아이템의 글씨를 굵게 표시해준다.
        _applyUnitAlignLegendBold();
        _highlitingSubFuncYDomainBold();

        //legend box 의 글를 굵게 표시해준다.
        function _applyUnitAlignLegendBold(){
            if( that.legend !== null ){
                that.legend.selectAll('.legend text').transition()
                    .style('font-weight', function(d, xIdx, yIdx){
                        if(item == undefined){
                            return 'normal';
                        }

                        if(item == d){
                            return 'bold';
                        }else{
                            return 'normal';
                        }
                    });
            }
        }

        function _highlitingSubFuncYDomainBold(){
            d3.selectAll('.' + config.style_yaxisStyleName + ' .tick')
                .style('font-weight', function(d){
                    if(item == undefined){ return 'normal';}
                    if(item == d){
                        return 'bold'
                    }else{
                        return 'normal'
                    }
                });
        }

        //해당 subBar 의 fill 속성 설정.
        //d.show 값을 적용시켜준다. ==> ok.
        function _applyUnitAlignFill(d, xIdx, yIdx){
            //d.show 값 적용.
            if(that.vakken.data()[yIdx].min){
                d.show = true;
            }else{
                d.show = false;
            }

            return d.color;
        }

        function _applyUnitAlignPatternFill(d, xIdx, yIdx){
            if(that.vakken.data()[yIdx].min){
                d.show = true;
            }else{
                d.show = false;
            }

            var innerRectType = config.innerRect.type.toLowerCase();
            if(innerRectType === 'fill'){
                return d.color;
            }
            else if(innerRectType === 'pattern'){
                return 'url(#' + config.innerRect.pattern.urlId + ')';
            }
        }

        function _defaultUnitAlignOpacity(d, xIdx, yIdx){
            if(d.show){
                var elClassName = $(this).attr('class');
                if(elClassName == 'subbarRect'){
                    if(that.xScale(d.x0 - that.vakken.data()[yIdx].gap) < 1){
                        return 0;
                    }else{
                        if(config.barOpacity){
                            return config.barOpacityVal;
                        }else{
                            return 1;
                        }
                    }
                }
                else if(elClassName == 'barInnerRect'){
                    if(that.xScale(d.x0 - that.vakken.data()[yIdx].gap) < 1){
                        return 0;
                    }else{
                        return 1;
                    }
                }
            }else{
                return 0;
            }
        }

        function _subFuncPosX(d, xIdx, yIdx){
            if(d.x0 == undefined){
                return;
            }
            if(that.vakken.data()[yIdx].min){
                return that.xScale(d.x0 - that.vakken.data()[yIdx].gap);
            // }
            }else{
                return that.xScale(d.x0);
            }
        }

        if(that.eventMinTimeStamp == null){
            return;
        }
        $$.settingSubAxis(that.eventMinTimeStamp);
    }

    //하이라이트 기능은 fill 값이 아닌 주로 opacity 값을 통하여 표시해준다.
    chart_internal_fn.highlitingItem = function ( item ) {
        var $$ = this,
            config = $$.config,
            that = $$.chart_internal_val,
            findYDomainItem = undefined;


        if($$.isDebug){
            console.log('Gantt - highlitingItem : ', item, that.legendSelectItem, config.eventAlignTarget);
        }

        //item 값이 없을 경우, eventAlignTarget 의 여부에 따라 차트를 다시 그려준다.
        if(item == undefined){
            if(config.eventAlignTarget !== null){
                //item 값이 undefined (없음) 이고, unit정렬 상태일 경우.
                $$.applyUnitAlign(config.eventAlignTarget, true);
            }else{
                //item 값이 undefined (없음) 이고, unit정렬 상태가 아닐 경우.
                that.vakken
                    .selectAll('.subbarRect').transition()
                    .style('fill', _highlitingFill)
                    .style('opacity', _defaultHighlitingOpacity);

                that.vakken
                    .selectAll('.barInnerRect').transition()
                    .style('fill', _highlitingPatternFill)
                    .style('opacity', _defaultHighlitingOpacity);
                _highlitingSubFuncLegendBold();

            }
            _highlitingSubFuncYDomainBold();
            return;
        }

        //item 값이 있을 경우
        //1. 선택한 아이템이 yDomain 값일 경우
        //1-1.
        //1-final : 종료후 빠져나온다.
        //2. 선택한 아이팀이 yDomain 값이 아닐 경우
        //2-final : 기존 로직대로 돌리고 종료.
        if(findYDomainItem !== undefined){
            if(config.eventAlignTarget !== null){
                //item 값 있고, yDomain 값이며, unit 정렬상태일 경우.
                that.vakken[0].forEach(function(d){
                    if(d.__data__.y == item){
                        d3.select(d).selectAll('.subbarRect').transition()
                            .style('fill', function(d, xIdx, yIdx){
                                return d.color;
                            })
                            .style('opacity', _defaultHighlitingUnitAlignYOpacity);
                    }else{
                        d3.select(d).selectAll('.subbarRect').transition()
                            .style('fill', function(d){
                                return d.color;
                            })
                            .style('opacity', _defaultHighlitingUnitAlignYOpacity);
                    }
                })
            }else{
                //item 값 있고, yDomain 값이며, unit 정렬상태가 아닐 경우.
                that.vakken[0].forEach(function(d){
                    if(d.__data__.y == item){
                        d3.select(d).selectAll('.subbarRect').transition()
                        .style('fill', function(d){
                            d.show = true;
                            return d.color;
                        })
                        .style('opacity', _defaultHighlitingOpacity);
                        that.selectYDomainItem = item;
                    }else{
                        d3.select(d).selectAll('.subbarRect').transition()
                        .style('fill', function(d){
                            d.show = false;
                            return d.color;
                        })
                        .style('opacity', _defaultHighlitingOpacity);
                    }
                });
            }
            _highlitingSubFuncYDomainBold();
            _highlitingSubFuncLegendBold();
        }
        else{
            if(config.eventAlignTarget !== null){
                //item 값 있고, yDomain 값이 아니며, unit 정렬상태일 경우.
                that.vakken
                .selectAll('.subbarRect').transition()
                .style('fill', _highlitingUnitAlignFill)            //check ok -> 변경 금지.
                .style('opacity', _highlitingUnitAlignOpacity);     //check ok -> 변경 금지.

                if(config.innerRect !== null){
                    var innerRectType = config.innerRect.type.toLowerCase();
                    if(innerRectType == 'fill'){
                        that.vakken
                        .selectAll('.barInnerRect').transition()
                        .style('fill', function(d){ return d.color; })            //check ok -> 변경 금지.
                        .style('opacity', _highlitingUnitAlignOpacity);     //check ok -> 변경 금지.
                    }
                    else if(innerRectType == 'pattern'){
                        that.vakken
                        .selectAll('.barInnerRect').transition()
                        .style('fill', 'url(#' + config.innerRect.pattern.urlId + ')')            //check ok -> 변경 금지.
                        .style('opacity', _highlitingUnitAlignOpacity);     //check ok -> 변경 금지.

                    }
                }
                _highlitingSubFuncLegendBold();
            }else{
                //item 값 있고, yDomain 값이 아니며, unit 정렬상태가 아닐 경우.
                that.vakken
                    .selectAll('.subbarRect').transition()
                    .style('fill', _highlitingFill)
                    .style('opacity', _defaultHighlitingOpacity);

                that.vakken
                    .selectAll('.barInnerRect').transition()
                    .style('fill', _highlitingPatternFill)
                    .style('opacity', _defaultHighlitingOpacity);
                _highlitingSubFuncYDomainBold();
                _highlitingSubFuncLegendBold();
            }
        }

        return;

        function _highlitingSubFuncYDomainBold(){
            d3.selectAll('.' + config.style_yaxisStyleName + ' .tick')
                .style('font-weight', function(d){
                    if(item == undefined){ return 'normal';}
                    if(item == d){
                        return 'bold'
                    }else{
                        return 'normal'
                    }
                });
        }

        function _highlitingSubFuncLegendBold(){
            if( that.legend !== null ){
                that.legend.selectAll('.legend text').transition()
                    .style('font-weight', function(d, xIdx, yIdx){
                        if(item == undefined){
                            return 'normal';
                        }

                        if(item == d){
                            return 'bold';
                        }else{
                            return 'normal';
                        }
                    });
            }
        }

        //item 값이 undefined 혹은 있을 경우, 들어가지나, yDomain 값일경우에는 이 함수는 호출안함.
        function _highlitingFill(d, xIdx, yIdx){
            //item 이 undefined 일 경우와 아닐 경우에도 이 함수를 호출.
            if(item == undefined){
                d.show = true;
                return d.color;
            }

            if(item == d.egName){
                if(that.legendSelectItem == null){
                    that.legendSelectItem = d;
                }
                d.show = true;
            }else{
                d.show = false;
            }
            return d.color;
        }

        function _highlitingPatternFill(d, xIdx, yIdx){
            if(item == undefined){
                d.show = true;
                var innerRectType = config.innerRect.type.toLowerCase();
                if(innerRectType === 'fill'){
                    return d.color;
                }
                else if(innerRectType === 'pattern'){
                    return 'url(#' + config.innerRect.pattern.urlId + ')';
                }
            }
            if(item == d.egName){
                d.show = true;
                var innerRectType = config.innerRect.type.toLowerCase();
                if(innerRectType === 'fill'){
                    return d.color;
                }
                else if(innerRectType === 'pattern'){
                    return 'url(#' + config.innerRect.pattern.urlId + ')';
                }
            }
            else{
                d.show = false;
            }
            return d.color;
        }

        function _highlitingUnitAlignFill(d, xIdx, yIdx){
            //여기서는 d.show 속성값을 변경시키지 않는다. unitAlign 상태에선 d.show 속성이 정해져있는데,
            //그 값을 토대로 해서 정렬된 보여진 아이템 중에서 하이라이트 시켜줄 것을 판단시키기 위함임.
            return d.color;
        }

        //unit  정렬상태, yDomain 값이 아닌 item 값일 경우 호출. -> ok
        function _highlitingUnitAlignOpacity(d, xIdx, yIdx){
            if(d.show){
                if(d.egName == item){
                    if(d.x0 == undefined){
                        return 0;
                    }
                    if(that.xScale(d.x0 - that.vakken.data()[yIdx].gap) < 1){
                        return 0;
                    }else{
                        if(config.barOpacity){
                            return config.barOpacityVal;
                        }else{
                            return 1;
                        }
                    }
                }else{
                    return 0;
                }
            }else{
                return 0;
            }

        }

        function _defaultHighlitingUnitAlignYOpacity(d, xIdx, yIdx){
            if(d.show){
                var yDomainVal = d3.select($(this).parent().parent())[0][0][0].__data__.y;
                if(item == yDomainVal){
                    if(config.barOpacity){
                        return config.barOpacityVal;
                    }else{
                        return 0;
                    }
                }else{
                    return 0;
                }
            }else{
                return 0;
            }
        }
        //yDomain 값일 경우에는 호출 안함.
        //그외 값일 경우에는 호출 함.
        function _defaultHighlitingOpacity(d, xIdx, yIdx){
            if(d.show){
                var elClassName = $(this).attr('class');
                if(elClassName == 'subbarRect'){
                    if(d.x0 == undefined || d.x1 == undefined){
                        return 0;
                    }
                    if(that.xScale(d.x0 - that.vakken.data()[yIdx].gap) < 1){
                        if(that.xScale(d.x1) > 0){
                            return config.barOpacityVal;
                        }
                        return 0;
                    }else{
                        //that.vakken.data()[yIdx].gap) 값이 없을 경우 여기로 넘어오게 됨
                        if(that.xScale(d.x0) < 0){
                            if(that.xScale(d.x1) > 0){
                                if(config.barOpacity){
                                    return config.barOpacityVal;
                                }else{
                                    return 1;
                                }
                            }
                            return 0;
                        }

                        if(config.barOpacity){
                            return config.barOpacityVal;
                        }else{
                            return 1;
                        }
                    }
                }
                else if(elClassName == 'barInnerRect'){
                    if(d.x2 == undefined || d.x3 == undefined){
                        return 0;
                    }
                    if(that.xScale(d.x2 - that.vakken.data()[yIdx].gap) < 1){
                        if(that.xScale(d.x3) > 0){
                            return 1;
                        }
                        return 0;
                    }
                    else{
                        if(that.xScale(d.x2) < 0) {
                            if (that.xScale(d.x3) > 0) {
                                return 1;
                            }
                            return 0;
                        }

                        return 1;
                    }
                }
            }else{
                return 0;
            }
        }
    }

    chart_internal_fn.settingSubAxis = function ( timeStampPos ) {
        var $$ = this,
            config = $$.config,
            that = $$.chart_internal_val;

        if ( that.ySubAxis == null ) {
            that.ySubAxis = that.svg.select('.' + config.style_gridLineGroupStyleName)
                .append('g').attr('class', 'y subAxis').attr('transform', 'translate(' + (config.margin_left) + ', 0)')
                .append('line');

            that.svg.select('.y.subAxis line').attr("x1", that.xScale(config.chart_domainX_from))
                                        .attr("x2", that.xScale(config.chart_domainX_from))
                                        .attr("y2", that.chartSvgHeight - config.margin_bottom)
                                        .style('opacity', 0);

            that.svg.selectAll(".subAxis line")
                  .style("fill", "none")
                  .style("stroke", "#000")
                  .style("shape-rendering", "crispEdges")
        }

        //update resize ( y )
        that.ySubAxis.attr('y2', $(that.svg[0][0]).height());

        if(config.eventAlignTarget == "" || timeStampPos == undefined){
            that.ySubAxis.style('opacity', 0);
        }else{
            that.ySubAxis.style('opacity', 0.1)
                            .attr('x1', that.xScale(timeStampPos))
                            .attr('x2', that.xScale(timeStampPos));
        }
    }

    chart_internal_fn.dataSetting = function () {
        var $$ = this,
            config = $$.config,
            that = $$.chart_internal_val;

        if($$.isDebug){
            console.log('Gantt - _dataSetting');
        }

        if(Object.keys(config.data || {}).length == 0){
            return;
        }

        if( that.colorScale == null ) {
            that.colorScale = d3.scale.ordinal();
        }
        config.chart_domainY = [];
        config.chart_colorDomain = [];
        config.chart_colorRange = [];


        //check data
        if(config.data.barDatas == undefined){
            return;
        }
        var barDatas = config.data.barDatas;

        barDatas.forEach(function(d) {
            var barId = d.barId;
            if(barId == null || barId == undefined){
                return;
            }

            var filterYDomain = function(el) {
                // console.log(el, el == barId);
                return el == barId;
            };

            var minTime = d3.min(d.subBarDatas.map(function(d){
                return d.from;
            }));
            var maxTime = d3.max(d.subBarDatas.map(function(d){
                return d.to;
            }))
            d.minTime = minTime;
            d.maxTime = maxTime;

            if (!config.chart_domainY.map(function(sd){ return sd.barId; }).some(filterYDomain)) {
                var barObj = {
                    barId : barId,
                    minTime : minTime,
                    maxTime : maxTime
                }
                config.chart_domainY.push(barObj);
            };
        });

        //chart_domainY 정렬 필요..
        if(config.dataAlign_order == "desc"){
            config.chart_domainY.sort(naturalCompareForGantt).reverse();
        }else if(config.dataAlign_order == "asc"){
            config.chart_domainY.sort(naturalCompareForGantt);
        }else if(_.isArray(config.dataAlign_order)){
            // config.chart_domainY = config.dataAlign_order;

            var tempDomainY = _.clone(config.chart_domainY);
            config.chart_domainY = [];

            config.dataAlign_order.forEach(function(yItem){
                var findItem = tempDomainY.find(function(d){
                    return d.barId == yItem;
                })

                if(findItem){
                    config.chart_domainY.push(findItem);
                }else{
                    var barObj = {
                        barId : yItem,
                        minTime : undefined,
                        maxItem : undefined
                    }
                    config.chart_domainY.push(barObj);
                }
            })
        }else{

        }
        // else{
        //     console.log('check gantt chart option ( config.dataAlign.order ) -> ', config.dataAlign.order);
        // }

        config.chart_data = [];
        that.minTimeStamp = d3.min(barDatas, function(d){
            return d3.min(d.subBarDatas, function(x){
                return x.from;
            })
        });

        barDatas.forEach(function(d){
            if(config.align == 'normal'){
                d.gap = 0;
            }else if(config.align == 'left'){
                d.gap = d3.min(d.subBarDatas, function(eg){
                        return eg.from;
                    }) - that.minTimeStamp;
            }else if(config.align == 'event'){
                //selected item 이 없을 경우, normal 모드로 전환시킨다.
            }
        });

        that.maxTimeStamp = d3.max(barDatas, function(d){
            return d3.max(d.subBarDatas, function(x){
                return x.to;
            }) - d.gap;
        });

        if(config.align == 'normal'){
            if(config.from == undefined){
                config.chart_domainX_from = that.minTimeStamp - 100;
            }else{
                config.chart_domainX_from = config.from;
            }
            if(config.to == undefined){
                config.chart_domainX_to = that.maxTimeStamp + 100;
            }else{
                config.chart_domainX_to = config.to;
            }
        }else if(config.align == 'left'){
            if(config.from == undefined){
                config.chart_domainX_from = that.minTimeStamp;
            }else{
                config.chart_domainX_from = config.from;
            }

            if(config.to == undefined){
                config.chart_domainX_to = that.maxTimeStamp;
            }else{
                config.chart_domainX_to = config.to;
            }
        }

        //color 지정해준다.
        if(chartStyleUtil == undefined){
            console.err('chartStyleUitl is undefined!!');
        };

        barDatas.forEach(function(d) {
            var tempEgLotBoxes = {
                y : d.barId
            };

            tempEgLotBoxes.boxes = d.subBarDatas.map(function(eg) {
                //check noname
                if(eg.egName == null){
                    eg.egName = '( NoName )';
                }
                var filterColorDomain = function(el) {
                    return el == eg.egName;
                };

                //colorDomain 에 해당 도메인이 없을 경우
                if (!config.chart_colorDomain.some(filterColorDomain)) {
                    config.chart_colorDomain.push(eg.egName);

                    that.legendListInfo.push(eg);
                    eg.color = getCustomColor(config.chart_colorDomain.indexOf(eg.egName), eg.egName);
                    config.chart_colorRange.push(eg.color);
                }else{
                    eg.color = config.chart_colorRange[config.chart_colorDomain.indexOf(eg.egName)];
                }

                //경고, 위험 데이터 색상을 표시하기 위한 로직 추가..
                if(_.isArray(config.barColorList.special) && config.barColorList.special.length > 0){
                    config.barColorList.special.forEach(function(option){
                        var checkField = eg[option.checkField];

                        if(checkField == undefined){
                            //processStatus 값 없음.. -> 표시 x
                        }
                        else{
                            if(checkField == option.matchValue){
                                eg.color = option.color;
                                if(option.isBorder){
                                    eg.isBorder = true;
                                }
                                else{
                                    eg.isBorder = false;
                                }
                            }
                        }
                    })
                }

                if(eg.from == undefined || eg.to == undefined){
                    eg.x0 = undefined;
                    eg.x1 = undefined;
                }
                else{
                    eg.x0 = eg.from - d.gap;
                    eg.x1 = eg.to - d.gap;
                }
                if(eg.subFrom == undefined){
                    eg.x2 = undefined;
                }else{
                    eg.x2 = eg.subFrom - d.gap;
                }
                if(eg.subTo == undefined){
                    eg.x3 = undefined
                }else{
                    eg.x3 = eg.subTo - d.gap;
                }
                eg.isShow = true;

                return eg;
            });
            config.chart_data.push(tempEgLotBoxes);
        });

        var chartColor = sortChartColor();
        var range = chartColor.map(function(d){ return d.range;});
        var domain = chartColor.map(function(d){ return d.domain;});

        //TODO : 컬러 정의.
        that.colorScale.range(range)
                        .domain(domain);

        if($$.isDebug){
            console.log('Gantt - _dataSetting : chart_data : ', config.chart_data);
        }

        function sortChartColor(){
            var tempObj = [];

            config.chart_colorDomain.forEach(function(d, i){
                tempObj.push({ domain : d, range : config.chart_colorRange[config.chart_colorDomain.indexOf(d)] });
            })

            tempObj.sort(naturalCompareForGanttColor);

            return tempObj;
        }

        //default 정렬 : 올림차순.(asc)
        function naturalCompareForGantt(a, b) {
            var ax = [], bx = [];

            if(_.isObject(a) && _.isObject(b)){
                if(config.dataAlign_baseValue == "yDomain"){
                    if(_.isNumber(a['barId'])) {
                        a['barId'] = a['barId'].toString();
                    }
                    if(_.isNumber(b['barId'])) {
                        b['barId'] = b['barId'].toString();
                    }

                    a['barId'].replace(/(\d+)|(\D+)/g, function(_, $1, $2) { ax.push([$1 || Infinity, $2 || ""]) });
                    b['barId'].replace(/(\d+)|(\D+)/g, function(_, $1, $2) { bx.push([$1 || Infinity, $2 || ""]) });
                }
                else if(config.dataAlign_baseValue == "barItem"){
                    if(_.isNumber(a['minTime'])) {
                        a['minTime'] = a['minTime'].toString();
                    }
                    if(_.isNumber(b['minTime'])) {
                        b['minTime'] = b['minTime'].toString();
                    }

                    a['minTime'].replace(/(\d+)|(\D+)/g, function(_, $1, $2) { ax.push([$1 || Infinity, $2 || ""]) });
                    b['minTime'].replace(/(\d+)|(\D+)/g, function(_, $1, $2) { bx.push([$1 || Infinity, $2 || ""]) });
                }
                else{
                    a.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { ax.push([$1 || Infinity, $2 || ""]) });
                    b.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { bx.push([$1 || Infinity, $2 || ""]) });
                }
            }else if(_.isString(a) && _.isString(b)){
                a.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { ax.push([$1 || Infinity, $2 || ""]) });
                b.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { bx.push([$1 || Infinity, $2 || ""]) });
            }

            while(ax.length && bx.length) {
                var an = ax.shift();
                var bn = bx.shift();
                var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
                if(nn) return nn;
            }

            return ax.length - bx.length;
        }

        function naturalCompareForGanttColor(a, b) {
            var ax = [], bx = [];

            a.domain.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { ax.push([$1 || Infinity, $2 || ""]) });
            b.domain.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { bx.push([$1 || Infinity, $2 || ""]) });

            while(ax.length && bx.length) {
                var an = ax.shift();
                var bn = bx.shift();
                var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
                if(nn) return nn;
            }

            return ax.length - bx.length;
        }

        function getCustomColor( index , name ){
            if(!_.isObject(config.barColorList)){
                //배열값으로 지정해준다.
                config.barColorList = {
                    "typeList" : []
                }
            }

            //type 으로 지정된 배열의 갯수 파악.(?)
            if(config.barColorList.typeList.length == 0){
                //styleUtils 의 함수 가져다오기..
                console.log('no data ( config.barColorList.typeList ), use chartStyleUtil');
                return chartStyleUtil.getIndexColor(index);
            }
            else if(config.barColorList.typeList.length == 1){
                //type 으로 지정된게 하나밖에 없을 경우.
                var colorType = config.barColorList.typeList[0];
                if(colorType.isSpecifiedColor){
                    //이름을 통해서 컬러를 찾는다..
                    return _getSpecifiedColor(name, colorType);
                }
                else{
                    return _getIndexColor(index, colorType);
                }
            }
            else if(config.barColorList.typeList.length > 1){
                //type 으로 지정된 컬러리스트가 두개이상 있을 경우.
                //현재 적용된 type을 파악한다.
                //find type
                var findColorType = config.barColorList.typeList.find(function(d){
                    return d.name == config.barColorList.defaultType;
                });

                if(findColorType.isSpecifiedColor){
                    return _getSpecifiedColor(name, findColorType);
                }
                else{
                    return _getIndexColor(index, findColorType);
                }
            }

            function _getIndexColor ( index , options ){
                if(!_.isObject(options) && !_.isArray(options.list)){
                    //데이터 변환.
                }
                if(config.moduleGroup == null){
                    //순서대로의 색상 지정.
                    var colors = options.list;
                    var colorIndex = index > colors.length - 1 ? index%colors.length:index;
                    return colors[colorIndex];
                }
                else{
                    //모듈별 색상지정을 위함.
                    var colors = options.list;
                    var findModuleGroupIndex = config.moduleGroup.find(function(group, gIdx, gArr){
                        var findGroup = group.modules.find(function(module, mDdx, mArr){
                            return module.alias == config.chart_colorDomain[index];
                        });

                        if(findGroup !== undefined){
                            return true;
                        }
                        else{
                            return false;
                        }
                    });
                    if(findModuleGroupIndex == undefined){
                        return options.none;
                    }
                    var colorIndex = findModuleGroupIndex.index > colors.length - 1 ? findModuleGroupIndex.index%colors.length:findModuleGroupIndex.index;
                    return colors[colorIndex];
                }
            }

            function _getSpecifiedColor( name, options ){
                //list 의 각 아이템들이  object 형태인지 체크 필요.
                if(!_.isArray(options) && !_.isArray(options.list)){

                }
                var colors = options.list;
                var findColorObj = options.list.find(function(d){
                    return d.name.toLowerCase() == name.toLowerCase();
                });

                return findColorObj.color;
            }
        }
    }

    ///////////////////////////////
    // TODO your coding area (MUST)
    // .... LINE TEST CODE
    chart_internal_fn.draw = function ( chart ) {
        var $$ = chart,
            config = chart.config,
            that = $$.chart_internal_val;

        if($$.isDebug){
            console.log('Gantt - draw');
        }

        if(config.data === undefined || config.data === null || config.data.length === 0 ){
            console.log('gantt Lib : config.data is undefined or null or length is zero..');
            return;
        }

        if(config.data.barDatas == undefined || config.data.barDatas.length == 0){
            // angular.element(config.bindto).trigger('gantt-draw-completed');
            return;
        }

        _sizeSetting();             //require : 사이즈 셋팅
        // _drawBackground();      //require : svg 배경화면을 그려준다.
        _settingLayout();           //require : 레이아웃을 그려준다.(svg 포함)
        _makeLegend();              //options : legendbox 을 생성(svg 크기에 맞게 배열됨
        _makeAxis( $$ );            //require : 축을 생성해준다.

        var zoomFunction = function(el){
            _makeSeries();
        };

        var afterZoomFunction = function(el){
            //_makeSeries();
        }
        var zoomConfig = {
            chartEl : that.svg.select('.' + config.style_gridLineGroupStyleName),
            xAxisEl : d3.select(config.bindto),
            yAxisEl : that.svg.select('.' + config.style_gridLineGroupStyleName),
            xAxis : that.xAxis,
            yAxis : that.yAxis,
            xScale : that.xScale,
            yScale : that.yScale,
            ableScale : 'x',

            xAxisClassName : config.style_xaxisStyleName,
            yAxisClassName : config.style_yaxisStyleName,
            zoomFunction : zoomFunction,
            afterZoomFunction : afterZoomFunction
        }
        if(config.isZoom){
            window.d3Zoom.applyZoom(zoomConfig);
        }

        // d3.timer( function ( d ){
        //
        //     return true;
        // }, 400 );
        _makeSeries();              //require : 차트 바들을 생성해준다.
        //_drawSetYDomainEv();        //options : yDomainCickFn 을 적용시켜준다 ( 조건 : config.yDomainClickActive == true )


        $$.api.viewEventArea(that.eventAreaConfig);
        //transition on : true, off: false
        if( config.eventAlignTarget !== null ){
            $$.applyUnitAlign( config.eventAlignTarget , false);
        }

        that.isCreation = true;
        setTimeout(function(){
            // angular.element(config.bindto).trigger('gantt-draw-completed');
            $(config.bindto).trigger('gantt-draw-completed');
        }, 300);

        
        //svg 의 너비, 높이를 지정해준다.
        function _sizeSetting() {
            if($$.isDebug){
                console.log('Gantt - _sizeSetting - before : ( size_width / size_height / that.chartSvgWidth / that.chartSvgHeight ) : ', config.size_width, config.size_height, that.chartSvgWidth, that.chartSvgHeight);
            }

            var parent_node = $(config.bindto).parent();

            if( $(config.bindto).css('overflow-y') !== 'hidden' ){
                $(config.bindto).css('overflow-y', 'hidden');
            }

            if( parent_node.width() > 0 ) config.size_width = parent_node.width();
            if( parent_node.height() > 0 ) config.size_height = parent_node.height();

            // that.chartSvgWidth = config.size_width - config.margin_left - config.margin_right;
            that.chartSvgWidth = config.size_width;
            if(that.chartSvgWidth <= 0){
                that.chartSvgWidth = 0;
            }

            // that.chartSvgHeight : scroll 추가로 인해 _makeAxis 에서 결정.
            if(config.viewport_height == 'custom'){
                // that.chartSvgHeight = config.size_height - config.margin_top - config.margin_bottom;
            }

            if($$.isDebug){
                console.log('Gantt - _sizeSetting - after : ( size_width / size_height / that.chartSvgWidth / that.chartSvgHeight ) : ', config.size_width, config.size_height, that.chartSvgWidth, that.chartSvgHeight);
            }
        }

        function _settingLayout(){
            if($$.isDebug){
                console.log('Gantt - _settingLayout');
            }

            //1. viewport, xAxis, Legend area
            if ( that.viewport == null){
                that.viewport = d3.select(config.bindto).append('div');
                that.viewport.attr('class', 'gantt-viewport');
            }

            if ( that.svg == null ) {
                that.svg = that.viewport.append('svg');
                that.svg.attr('class', config.style_backgroundStyleName).append('g').attr('class', config.style_gridLineGroupStyleName);


                if(config.innerRect.pattern !== null){
                    that.svg.append('defs')
                    .append('pattern')
                    .attr('id', config.innerRect.pattern.urlId)
                    .attr('class', config.innerRect.pattern.class)
                    .attr('patternUnits', config.innerRect.pattern.patternUnits)
                    .attr('width', config.innerRect.pattern.width)
                    .attr('height', config.innerRect.pattern.height)
                    .append('path')
                    .attr('d', config.innerRect.pattern.path.d)
                    .attr('stroke', config.innerRect.pattern.path.stroke)
                    .attr('stroke_width', config.innerRect.pattern.path.strokeWidth)
                    .attr('shape-rendering', config.innerRect.pattern.path.shapeRendering);
                }

                that.svg.on('click', function ( d, xIdx, yIdx) {
                    if(config.isBackgroundClick){
                        that.legendSelectItem = null;
                        $$.highlitingItem();
                        d3.event.stopPropagation();
                    }
                })
                .call(function(ev) {//dom이 다 그려지면 click event bind
                    if( ev == null || ev.length == 0 ) {
                       return;
                    }
                    if( $$.config.backgroundClickFn ) {//config legendClickFn이 있다면 반영해준다.
                       var dom = null;
                       var list = ev;
                       for( var i = 0; i < list.length; i++ ) {
                           dom = $(list[i]);
                           dom.on('remove', function() {
                               this.unbind('click');
                           });
                           dom.bind('click', function(ev) {
                              var index = i,
                                //   selectedElement = d3.select(this)[0][0].__data__,
                                  selectedElement = that.legendSelectItem,
                                  sendData = null;

                              sendData = {
                                  event: ev,
                                  data : selectedElement,
                                  target : d3.select(this)
                              };
                              $$.config.backgroundClickFn(sendData);
                              ev.stopPropagation();
                          });
                       }
                    }
                });
            }

            if ( that.xScaleViewArea == null ) {
                that.xScaleViewArea = d3.select(config.bindto).append('svg');
                that.xScaleViewArea.attr('class', 'bistel-gantt-xaxis-svg');
            }

            if ( that.legendViewArea == null ) {
                that.legendViewArea = d3.select(config.bindto).append('svg');
                that.legendViewArea.attr('class', 'bistel-gantt-legendbox-svg');
            }

            //update ( resize Event )
            that.viewport.style('width', '100%')
                .style('overflow-y', 'auto')
                .style('overflow-x', 'hidden');

            that.svg.style('width', that.chartSvgWidth);            

            if(config.viewport_height == 'parent'){
                that.viewport.style('height', 'calc(100% - ' + (config.xAxisAreaHeight + config.legendAreaHeight) + 'px)')

            }else if(config.viewport_height == 'custom'){
                var customHeight = _drawCheckHeight() + + config.margin_top + config.margin_bottom;
                that.chartSvgHeight = customHeight;
                that.viewport.style('height', customHeight + (config.xAxisAreaHeight + config.legendAreaHeight) + 'px)');
            }

            function _drawCheckHeight(){
                return config.data.barDatas.length * config.barDefaultHeight;
            }
            
            that.xScaleViewArea
                .attr('width', that.chartSvgWidth)
                .attr('height', config.xAxisAreaHeight)
                .style('width', that.chartSvgWidth)
                .style('height', config.xAxisAreaHeight);
            
            that.legendViewArea
                .attr('width', that.chartSvgWidth)
                .attr('height', config.legendAreaHeight)
                .style('width', that.chartSvgWidth)
                .style('height', config.legendAreaHeight);

            if($$.isDebug){
                console.log('Gantt - _settingLayout : svg(height) : ', that.svg.attr('height'), 'svg(width) : ', that.svg.attr('width'));
                console.log('Gantt - _settingLayout : xScaleViewArea(height) : ', that.xScaleViewArea.attr('height'), 'xScaleViewArea(width) : ', that.xScaleViewArea.attr('width'));
                console.log('Gantt - _settingLayout : legendViewArea(height) : ', that.legendViewArea.attr('height'), 'legendViewArea(width) : ', that.legendViewArea.attr('width'));
            }
        }

        function _makeLegend() {
            if( $$.isDebug ){
                console.log('Gantt - _makeLegend');
            }
            var size =  config.legendboxSize;
            //레거시 박스
            if( that.legend == null ) {
                that.legend = that.legendViewArea.append('g').attr('class', config.style_legendStyleName);

                var legend = that.legend.selectAll('.legend')
                                    .data(that.colorScale.domain().slice())
                                    .enter()
                                    .append('g')
                                    .attr('class', 'legend');

                legend.append('rect').attr('x', 0).attr('width', size).attr('height', size).style('fill', that.colorScale);

                legend.append('text')
                        .attr('x', size + 4)
                        .attr('y', size / 2)
                        .attr('dy', '.35em')
                        .attr('pointer-events', 'all')
                        .style('text-anchor', 'begin')
                        .style('font', '10px sans-serif')
                        .style('cursor', 'default')
                        .text(function(d) {
                            return d;
                        });

                that.legend.selectAll('.legend')
                    .on('click', function(d, xIdx, yIdx){
                        var findInfo = that.legendListInfo.find(function(sd) {
                            //  console.log(sd);
                            if(d == sd.egName){
                                return sd;
                            }else{
                                return;
                            }
                        });
                        // console.log(findInfo);
                        if(that.legendSelectItem == null){
                            that.legendSelectItem = findInfo;
                            $$.highlitingItem( that.legendSelectItem.egName );
                        }
                        else if(that.legendSelectItem.egName == d){
                            that.legendSelectItem = null;
                            $$.highlitingItem();
                        }else if(that.legendSelectItem.egName !== d){
                            that.legendSelectItem = findInfo;
                            $$.highlitingItem( that.legendSelectItem.egName );
                        }
                        d3.event.stopPropagation();
                    })
                    .call(function(ev) {//dom이 다 그려지면 click event bind
                        if( ev == null || ev.length == 0 ) {
                           return;
                        }
                        if( $$.config.legendClickFn ) {//config legendClickFn이 있다면 반영해준다.
                           var dom = null;
                           var list = ev;
                           for( var i = 0; i < list.length; i++ ) {
                               dom = $(list[i]);
                               dom.on('remove', function() {
                                   this.unbind('click');
                               });
                               dom.bind('click', function(ev) {
                                  var index = i,
                                    //   selectedElement = d3.select(this)[0][0].__data__,
                                      selectedElement = that.legendSelectItem,
                                      sendData = null;

                                  sendData = {
                                      event: ev,
                                      data : selectedElement,
                                      target : d3.select(this)
                                  };
                                  $$.config.legendClickFn(sendData);
                                  ev.stopPropagation();
                              });
                           }
                        }
                    });
            }

            var remXPos = 0,
                remYPos = 0,
                remWidthGap = size - 3,
                remHeightGap = 5;

            that.legend.selectAll('.legend')
                        .data(that.colorScale.domain().slice())
                        .attr('transform', function(d, i) {
                            // var xPos = i * 60;
                            // var maxXPos = config.size_width / xPos;
                            var returnXPos = 0;

                            if(i == 0){
                                remXPos += this.getBBox().width + remWidthGap;
                                return 'translate(' + returnXPos + ',' + remYPos + ')';
                            }

                            if(remXPos + this.getBBox().width + remWidthGap > config.size_width){
                                remXPos = 0;
                                returnXPos = remXPos;
                                remYPos += this.getBBox().height + remHeightGap;
                                remXPos += this.getBBox().width + remWidthGap;
                            }else{
                                returnXPos = remXPos;
                                remXPos += this.getBBox().width + remWidthGap;
                            }

                            return 'translate(' + returnXPos + ',' + remYPos + ')';
                        });

            _fixLegendPos();
            _settingLayout();

            function _fixLegendPos(){
                try{
                    var legendBBoxInfo = that.legend.node().getBBox();
                    // Default - legendAreaHeight : 60
                    config.legendAreaHeight = legendBBoxInfo.height + 10;
                    var movesize = (config.size_width / 2) - (legendBBoxInfo.width / 2);
                    that.legendViewArea.select('.' + config.style_legendStyleName)
                    .attr('transform', 'translate(' + movesize +',0)')
                }catch(e){
                    console.log(e);
                }
            }
        }

        function _makeAxis() {
            if( $$.isDebug ){
                console.log('Gantt - _makeAxis');
            }

            if( that.svg == null ) {
                return;
            }
            if(that.xScale == null ) {
                that.xScale = d3.scale.linear();
            }
            if( that.yScale == null ) {
                that.yScale = d3.scale.ordinal();
            }
            if( that.colorScale == null ) {
                that.colorScale = d3.scale.ordinal();
            }
            if( that.xAxis == null ) {
                that.xAxis = d3.svg.axis();
                that.xScaleViewArea.append('g').attr('class', config.style_xaxisStyleName);
            }
            if( that.yAxis == null ) {
                that.yAxis = d3.svg.axis();
                that.svg.select('.' + config.style_gridLineGroupStyleName).append('g').attr('class', config.style_yaxisStyleName);
            }

            var autoTicksCount = that.chartSvgWidth / 130;

            that.xAxis.scale(that.xScale).orient('bottom')
                .tickFormat(
                    function(val) {

                        if(config.align.toLowerCase() == 'normal'){
                            return moment(val).format('MM-DD HH:mm:ss');
                        }
                        else if(config.align.toLowerCase() == 'left'){
                            var timeGap = val - that.minTimeStamp; //마이크로초
                            if(timeGap > 0){
                                var sec = parseInt(timeGap / 1000);
                                var secN = sec % 60;
                                var minunte = parseInt(sec / 60);
                                var minunteN = minunte % 60;
                                var hour = minunte / 60;
                                var hourN = hour % 60;

                                return "+" + _.string.sprintf("%d:%2d:%2d", hourN, minunteN, secN);
                            }
                            else{
                                var sec = Math.abs(parseInt(timeGap / 1000));
                                var secN = sec % 60;
                                var minunte = parseInt(sec / 60);
                                var minunteN = minunte % 60;
                                var hour = minunte / 60;
                                var hourN = hour % 60;
                                return "-" + _.string.sprintf("%d:%2d:%2d", hourN, minunteN, secN);
                            }
                        }
                    }
                )
                .ticks(autoTicksCount)

            // that.xAxis.scale()
            //     .tickValues(that.xScale.ticks(5).splice(0, 1).concat(that.minTimeStamp))


            that.yAxis.scale(that.yScale).orient('left');
            //ydomain 길이를 통한 margin_left 길이값 주기..
            var textMaxLength = 0;
            config.chart_data.forEach(function(d){
                var textLength = d.y.length;
                if( textMaxLength === 0 || textMaxLength < textLength ){
                    textMaxLength = textLength; //yDomain 값의 문자열길이를 기록.
                }
            });

            config.margin_left = textMaxLength * config.yDomainCharLength; 


            // if(config.align.toLowerCase() == 'normal'){
                that.xScale.rangeRound([0, that.chartSvgWidth - config.margin_left - config.margin_right])
                .domain([config.chart_domainX_from, config.chart_domainX_to])
                .nice();
            // }
            // else if(config.align.toLowerCase() == 'left'){
            //     that.xScale.rangeRound([0, that.chartSvgWidth])
            //     .domain([config.chart_domainX_from, config.chart_domainX_to]);
            // }

            var chartViewHeight = $(that.viewport.node()).height();

            if(config.viewport_height == 'parent'){
                //데이터 높이만큼.. 계산하기.
                if((config.barDefaultHeight) * config.chart_domainY.length > chartViewHeight){
                    var yScaleHeight = (config.barDefaultHeight) * config.chart_domainY.length;
                    that.chartSvgHeight = yScaleHeight;
                    that.yScale.rangeBands([0, yScaleHeight], .3);

                }else{
                    that.chartSvgHeight = chartViewHeight;
                    that.yScale.rangeBands([0, chartViewHeight], .3);
                }
            }
            else if(config.viewport_height == 'custom'){
                // that.chartSvgHeight = chartViewHeight;
                that.yScale.rangeBands([0, that.chartSvgHeight], .3);
            }
            that.yScale.domain(config.chart_domainY.map(function(d) { return d.barId; }));
            
            // axis 축 디스플레이.
            that.xScaleViewArea.select('.' + config.style_xaxisStyleName).attr('transform', 'translate(' + (config.margin_left) + ', 0)').call(that.xAxis);
            that.svg.select('.' + config.style_yaxisStyleName).attr('transform', 'translate(' + (config.margin_left) + ', 0)').call(that.yAxis);        //1573 줄 확인..



            // axis 축 반영 이후, 후속작업.
            that.svg.style('height', that.chartSvgHeight + config.margin_top + config.margin_bottom);
            //왼쪽 정렬
            if(config.yDomainClickTarget == null){
                d3.selectAll('.' + config.style_yaxisStyleName + ' .tick text').style('text-anchor', 'start').attr('x', 10 - config.margin_left);
            }else{
                d3.selectAll('.' + config.style_yaxisStyleName + ' .tick text').style('text-anchor', 'start').attr('x', 10 - config.margin_left + 18);
            }

            //add icon
            if(config.yDomainClickTarget !== null){
                var iconEl = that.svg.selectAll('.' + config.style_yaxisStyleName + ' .tick image');
                if(iconEl[0].length == 0){
                    that.svg.selectAll('.' + config.style_yaxisStyleName + ' .tick').insert('svg:image', ':first-child')
                    .attr('class', 'detail-view-icon')
                    .attr('xlink:href', config.yDomainIconPath)
                    .attr('x', 10 - config.margin_left)
                    .attr('y', function(d){
                        return 0 - (d3.select(this)[0][0].getBBox().height / 2);
                    })
                    .style('cursor', config.yDomainIconCursor);
                }else if(iconEl[0].length > 0){
                    iconEl.attr('x', 10 - config.margin_left)
                        .attr('y', function(d){
                            return 0 - (d3.select(this)[0][0].getBBox().height / 2);
                        });
                    // that.svg.selectAll('.' + config.style_yaxisStyleName + ' .tick span').remove();
                }
            }

            if( $$.isDebug ){
                console.log('Gantt - _makeAxis( result ) : xScale [ 0 , ', that.chartSvgWidth ,'] / yScale [ 0, ', that.chartSvgHeight,' ]');
            }
        }

        function noop() {}

        function _makeSeries() {
            if( $$.isDebug ){
                console.log('Gantt - _makeSeries');
            }

            var lineFunc = d3.svg.line().x(function(d) { return d.x; })
                                        .y(function(d) { return d.y; })
                                        .interpolate('linear');

            //first loading
            if(that.vakken == null) {
                that.vakken = that.svg.select('.' + config.style_gridLineGroupStyleName).selectAll('.question')
                                .data(config.chart_data)
                                .enter()
                                .append('g')
                                .attr('class', 'bar')
                                .attr('transform', function(d) {
                                    return 'translate(' + ($$.config.margin_left) + ',' + that.yScale(d.y) + ')';
                                });
                var bars = that.vakken.selectAll('rect')
                                .data(function(d) {
                                    return d.boxes;
                                })
                                .enter()
                                .append('g')
                                .attr('class', 'subbar');

                if(config.isShowBarGuideLine){
                    that.vakken.append('path')
                    .attr('class', 'barPathTop');

                    that.vakken.selectAll('path')[0][0].remove()
                }

                bars.append('rect')
                        .attr('class', 'subbarRect')
                        .on('click', function(d, xIdx, yIdx){
                            // console.log('subbarRect click', arguments, that.legendSelectItem);
                            if(that.legendSelectItem == null){
                                that.legendSelectItem = d;
                                $$.highlitingItem( that.legendSelectItem.egName );
                            }
                            else if(that.legendSelectItem.egName == d.egName){
                                that.legendSelectItem = null;
                                $$.highlitingItem();
                            }else if(that.legendSelectItem.egName !== d.egName){
                                that.legendSelectItem = null;
                                $$.highlitingItem();
                                // that.legendSelectItem = d;
                                // $$.highlitingItem( that.legendSelectItem.egName );
                            }
                            d3.event.stopPropagation();
                        })
                        .call(function(ev) {//dom이 다 그려지면 click event bind
                            if( ev == null || ev.length == 0 ) {
                               return;
                            }
                            if( $$.config.barClickFn ) {//config legendClickFn이 있다면 반영해준다.
                               var dom = null;
                               var list = ev;
                               for( var i = 0; i < list.length; i++ ) {
                                   dom = $(list[i]);
                                   dom.on('remove', function() {
                                       this.unbind('click');
                                   });
                                   dom.bind('click', function(ev) {
                                      var index = i,
                                        //   selectedElement = d3.select(this)[0][0].__data__,
                                          selectedElement = that.legendSelectItem,
                                          sendData = null;

                                      sendData = {
                                          event: ev,
                                          data : selectedElement,
                                          target : d3.select(this)
                                      };
                                      $$.config.barClickFn(sendData);
                                      ev.stopPropagation();
                                  });
                               }
                            }
                        });


                    if(config.innerRect !== null){
                        //check1
                        if(config.innerRect.use){
                            var innerRectType = config.innerRect.type.toLowerCase();

                            //공통적으로 적용되는 속성값을 지정해준다.
                            // insert('svg:image', ':first-child')
                            var innerBars = bars.insert('svg:rect', ':first-child')
                                .attr('class', 'barInnerRect')
                                .on('click', function(d, xIdx, yIdx){
                                    //innerRect click event. == rect click event
                                    // console.log('subbarRect click', arguments, that.legendSelectItem);
                                    if(that.legendSelectItem == null){
                                        that.legendSelectItem = d;
                                        $$.highlitingItem( that.legendSelectItem.egName );
                                    }
                                    else if(that.legendSelectItem.egName == d.egName){
                                        that.legendSelectItem = null;
                                        $$.highlitingItem();
                                    }else if(that.legendSelectItem.egName !== d.egName){
                                        that.legendSelectItem = null;
                                        $$.highlitingItem();
                                        // that.legendSelectItem = d;
                                        // $$.highlitingItem( that.legendSelectItem.egName );
                                    }
                                    d3.event.stopPropagation();
                                })
                                .call(function(ev) {//dom이 다 그려지면 click event bind
                                    if( ev == null || ev.length == 0 ) {
                                        return;
                                    }
                                    if( $$.config.barClickFn ) {//config legendClickFn이 있다면 반영해준다.
                                        var dom = null;
                                        var list = ev;
                                        for( var i = 0; i < list.length; i++ ) {
                                            dom = $(list[i]);
                                            dom.on('remove', function() {
                                                this.unbind('click');
                                            });
                                            dom.bind('click', function(ev) {
                                                var index = i,
                                                //   selectedElement = d3.select(this)[0][0].__data__,
                                                selectedElement = that.legendSelectItem,
                                                sendData = null;

                                                sendData = {
                                                    event: ev,
                                                    data : selectedElement,
                                                    target : d3.select(this)
                                                };
                                                $$.config.barClickFn(sendData);
                                                ev.stopPropagation();
                                            });
                                        }
                                    }
                                });

                            if(innerRectType === 'fill'){
                                innerBars
                                    .attr('fill', function(d){
                                        return d.color;
                                    });
                            }
                            else if(innerRectType === 'pattern'){
                                innerBars
                                    .attr('fill', 'url(#' + config.innerRect.pattern.urlId + ')')
                                    .attr('stroke', config.innerRect.pattern.path.stroke)
                                    .attr('stroke-width', config.innerRect.pattern.path.strokeWidth)
                                    .attr('shape-rendering', config.innerRect.pattern.path.shapeRendering);
                            }
                        }
                    }

                    if(config.isShowBarBg){
                        d3.timer( function(elapsed) {
                            that.vakken.insert('rect', ':first-child')
                                .attr('height', that.yScale.rangeBand())
                                .attr('x', '1')
                                .attr('width', that.chartSvgWidth)
                                // .style('fill', config.style_color_rectBg)
                                .style('fill', 'transparent')
                                .attr('class', function(d, index) {
                                    return index % 2 == 0 ? 'even rectBg' : 'uneven rectBg';
                                });
                        }, 100);
                    }
            }
            // console.log(config.chart_data.length);
            var dataSize = 0;
            config.chart_data.forEach(function(d){
                dataSize += d.boxes.length;
            });
            if( dataSize > 1000 ){
                dataSize = 130;
            }else{
                dataSize = 100;
            }
            // console.log(dataSize);
            // var dataSize = config.chart_data.length;

            d3.timer( function(elapsed) {
                //update series
                that.svg.selectAll('.bar')
                    .data(config.chart_data)
                    .attr('width', function ( d ){
                        var targetWidth = d3.select(this).attr('width');
                        if( targetWidth == that.chartSvgWidth ) {
                            return noop();
                        }
                        return that.chartSvgWidth;
                    })
                    .attr('height', function ( d ) {
                        var targetHeight = d3.select(this).attr('height');
                        if( targetHeight == that.yScale.rangeBand() ) {
                            return noop();
                        }
                        return that.yScale.rangeBand();
                    })
                    .attr('transform', function(d) {
                        return 'translate(' + (config.margin_left) + ',' + that.yScale(d.y) + ')';
                    });
                    return true;
            }, dataSize * 2);

            d3.timer( function(elapsed) {
                that.svg.selectAll('.rectBg')
                        .attr('width', function ( d ){
                            var targetWidth = d3.select(this).attr('width');
                            if( targetWidth == that.chartSvgWidth ) {
                                return noop();
                            }
                            return that.chartSvgWidth;
                        })
                        .attr('height', function ( d ) {
                            var targetHeight = d3.select(this).attr('height');
                            if( targetHeight == that.yScale.rangeBand() ) {
                                return noop();
                            }
                            return that.yScale.rangeBand();
                        });
                return true;
            }, dataSize * 4 );

            d3.timer( function(elapsed) {
                that.svg.selectAll('.bar')
                        .selectAll('.subbarRect')
                        .data(function(d) { return d.boxes; })
                        .transition()
                        .attr('x', function(d, x, y){
                            if(d.x0 == undefined || d.x1 == undefined){
                                return noop();
                            }
                            if(that.xScale(d.x0) < 0){
                                if(that.xScale(d.x1) > 0){
                                    return 0;
                                }
                            }
                            return that.xScale(d.x0);
                        }).attr('width', function(d) {
                            if(d.x0 == undefined || d.x1 == undefined){
                                return noop();
                            }
                            var x1_point = that.xScale(d.x1),
                                x0_point = that.xScale(d.x0),
                                resultValue = x1_point - x0_point,
                                targetWidth = d3.select(this).attr('width');
                            if(that.xScale(d.x0) < 0){
                                if(that.xScale(d.x1) > 0){
                                    x0_point = 0;
                                }
                            }else if(that.xScale(d.x0) >= d3.max(that.xScale.range())){
                                return targetWidth === 0 ? noop() : 0;
                            }

                            if(x1_point >= d3.max(that.xScale.range())){
                                x1_point = d3.max(that.xScale.range());
                            }
                            if( resultValue <= 0 ){
                                return targetWidth === 1 ? noop() : 1;
                            }else{
                                return resultValue;
                            }
                        })
                        .attr('height', function ( d ) {
                            var targetHeight = d3.select(this).attr('height');
                            if( targetHeight === that.yScale.rangeBand() ) {
                                return noop();
                            }
                            return that.yScale.rangeBand();
                        })
                        .attr('fill', function(d){
                            return d.color;
                        })
                        .style('opacity', function(d){
                            if(d.x0 == undefined || d.x1 == undefined){
                                return noop();
                            }
                            var targetOpacity = d3.select(this).style('opacity');
                            if(that.xScale(d.x0) < 0){
                                if(that.xScale(d.x1) <= 0){
                                    return targetOpacity === 0 ? noop() : 0;
                                }
                            }

                            if( config.barOpacity ){
                                return targetOpacity === config.barOpacityVal ? noop() : config.barOpacityVal;
                            }else{
                                return targetOpacity === 1 ? noop() : 1;
                            }
                        });
                return true;
            }, dataSize * 8 );



            //check2
            if(config.innerRect !== null){
                d3.timer( function(elapsed) {
                    that.svg.selectAll('.bar')
                            .selectAll('.barInnerRect')
                            .data(function(d) { return d.boxes; })
                            .transition()
                            .attr('x', function(d){
                                if(d.x2 == undefined || d.x3 == undefined){
                                    return noop();
                                }
                                var targetx = d3.select(this).attr('x');
                                if(that.xScale(d.x2) < 0){
                                    if(that.xScale(d.x3) > 0){
                                        return targetx === 0 ? noop() : 0;
                                    }
                                }
                                return that.xScale(d.x2);
                                // }
                            })
                            .attr('y', function(d){
                                var targetY = d3.select(this).attr('y');
                                if( targetY === config.innerRect.pattern.margin.top ) {
                                    return noop();
                                }
                                return config.innerRect.pattern.margin.top;
                            })
                            .attr('width', function(d){
                                if(d.x2 == undefined || d.x3 == undefined){
                                    return noop();
                                }
                                var x1_point = that.xScale(d.x3),
                                    x0_point = that.xScale(d.x2),
                                    resultValue = x1_point - x0_point,
                                    targetWidth = d3.select(this).attr('width');

                                if(that.xScale(d.x2) < 0){
                                    if(that.xScale(d.x3) > 0){
                                        x0_point = 0;
                                    }
                                }else if(that.xScale(d.x2) >= d3.max(that.xScale.range())){
                                    return 0;
                                }

                                if(x1_point >= d3.max(that.xScale.range())){
                                    x1_point = d3.max(that.xScale.range());
                                }
                                if( resultValue <= 0 ){
                                    return targetWidth === 1? noop() : 1;
                                }else{
                                    return targetWidth === resultValue ? noop() : resultValue;
                                }
                            })
                            .attr('height', function(d){
                                var targetHeight = d3.select(this).attr('height'),
                                    resultValue = that.yScale.rangeBand() - config.innerRect.pattern.margin.top - config.innerRect.pattern.margin.bottom;
                                if( targetHeight === resultValue ) {
                                    return noop();
                                }
                                return resultValue;
                            })
                            .style('opacity', function(d){
                                var targetOpacity = d3.select(this).style('opacity');
                                if(d.x2 == undefined || d.x3 == undefined){
                                    return targetOpacity === 1? noop() : 1;
                                }
                                if(that.xScale(d.x2) < 0){
                                    if(that.xScale(d.x3) <= 0){
                                        return targetOpacity === 0? noop() : 0;
                                    }
                                }
                                return targetOpacity === 1? noop() : 1;
                            });
                    return true;
                }, dataSize * 12 );

            }

            if(config.isShowBarGuideLine){
                var gapPathY = that.yScale.rangeBand() / 2 - (that.yScale(that.yScale.domain()[1]) - that.yScale(that.yScale.domain()[0])) / 2;

                that.svg.selectAll('.barPathTop')
                .attr('d', function(d){
                    // var basePoint = $(this).offset(); // path : top, left
                    var basePoint = $(d3.select($(this).parent()[0]).select('.rectBg')[0][0]).offset();
                    var parentPoint = $(this).offsetParent().offset(); // chart : top, left
                    //
                    var gapLeft = parentPoint.left - basePoint.left;
                    var pathWidth = $(this).parent().attr('width');
                    //

                    var lineData = [{"x": gapLeft , "y" : gapPathY }, {"x" : pathWidth , "y" : gapPathY}];
                    return lineFunc(lineData);
                });
            }
        }

        function _drawSetYDomainEv(){
            // if(!config.yDomainClickActive){
            //     return;
            // }
            var yDomainEls = null,
                targetYDomainEls = null;

            if(config.yDomainClickTarget != null){
                targetYDomainEls = d3.selectAll('.' + config.style_yaxisStyleName + ' .tick ' + config.yDomainClickTarget);
                yDomainEls = d3.selectAll('.' + config.style_yaxisStyleName + ' .tick text');
            }else{
                yDomainEls = d3.selectAll('.' + config.style_yaxisStyleName + ' .tick');
            }

            if(yDomainEls.length == 0){
                return;
            }

            yDomainEls.on('click', function(d){
                // if(that.selectYDomainItem == null){
                //     that.selectYDomainItem = d;
                //     $$.highlitingItem(d);
                // }else if(that.selectYDomainItem == d){
                //     that.selectYDomainItem = null;
                //     $$.highlitingItem();
                // }else if(that.selectYDomainItem !== d){
                //     that.selectYDomainItem = d;
                //     $$.highlitingItem(d);
                // }
                // if(typeof config.node_tooltip === 'function') {
                //     config.node_tooltip(evt, d);
                // }
                // d3.event.stopPropagation();
            })
            .call(function(ev) {//dom이 다 그려지면 click event bind
                if( ev == null || ev.length == 0 ) {
                   return;
                }
                if(that.isApplyYDomainEV){
                    return;
                }
                if( $$.config.yDomainClickFn ) {//config legendClickFn이 있다면 반영해준다.
                   var dom = null;
                   var list = ev[0];
                   for( var i = 0; i < list.length; i++ ) {
                       dom = $(list[i]);
                       dom.on('remove', function() {
                           this.unbind('click');
                       });
                       dom.bind('click', function(ev) {
                          var index = i,
                              selectedElement = d3.select(this)[0][0].__data__,
                            //   selectedElement = that.selectYDomainItem,
                              sendData = null;

                          sendData = {
                              event: ev,
                              data : selectedElement,
                              target : d3.select(this)
                          };
                          if($$.config.yDomainClickTarget == null){
                              $$.config.yDomainClickFn(sendData);
                          }
                          ev.stopPropagation();
                      });
                   }
                }
                that.isApplyYDomainEV = true;
            });

            if(targetYDomainEls !== null){
                targetYDomainEls.on('click', function(d){})
                .call(function(ev) {//dom이 다 그려지면 click event bind
                    if( ev == null || ev.length == 0 ) {
                        return;
                    }
                    if(that.isApplyTargetYDomainEV){
                        return;
                    }
                    if( $$.config.yDomainClickFn ) {//config legendClickFn이 있다면 반영해준다.
                        var dom = null;
                        var list = ev[0];
                        for( var i = 0; i < list.length; i++ ) {
                            dom = $(list[i]);
                            dom.on('remove', function() {
                                this.unbind('click');
                            });
                            dom.bind('click', function(ev) {
                                var index = i,
                                selectedElement = d3.select(this)[0][0].__data__,
                                //   selectedElement = that.selectYDomainItem,
                                sendData = null;

                                sendData = {
                                    event: ev,
                                    data : selectedElement,
                                    target : d3.select(this)
                                };
                                $$.config.yDomainClickFn(sendData);
                                ev.stopPropagation();
                            });
                        }
                    }
                    that.isApplyTargetYDomainEV = true;
                });
            }
        }
    };

    function _drawEventArea(eventData, clickFn, overFn, outFn, target, width, height, scale, margin, labelRotation) {//event area setup
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
                                           .overFn(overFn)
                                           .outFn(outFn)
                                           .margin(margin)
                                           .labelRotation(labelRotation)
                                           .eventData(eventData));
        }else{
            target.select('.event-area-group-0').remove();
            target.select('.event-line-group-0').remove();
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
        define('Gantt', ['d3'], Gantt);
    } else if ('undefined' !== typeof exports && 'undefined' !== typeof module) {
        module.exports = Gantt;
    } else {
        window.Gantt = Gantt;
    }



})(window, window.d3, window.chartAxis);
