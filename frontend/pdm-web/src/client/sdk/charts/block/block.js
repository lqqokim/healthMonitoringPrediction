(function (window, d3) {
    'use strict';

    var Block = {
        // TODO set version (OPTION)
        version: "0.0.1",
        chart: {
            fn: Chart.prototype,
            internal: {
                fn: ChartInternal.prototype
            }
        }
    };

    var chart_fn = Block.chart.fn,
        chart_internal_fn = Block.chart.internal.fn;

    Block.generate = function (config) {
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

        //차트 내 쓰일 내부 변수 정의.
        $$.chart_internal_val = {
            viewPortEl : null,            //가로 스크롤 기능을 위한 변수.
            viewPortElHeight : 0,      //가로 스크롤 기능을 위한 변수.
            viewPortElWidth: 0,        //가로 스크롤 기능을 위한 변수.
            navEl: null,
            navElHeight : 20,
            navArrRightFlag : false,
            navArrLeftFlag : false,
            svg : null,
            xScale : null,              //균등한 block 를 생성하기 위한 Scale
            yScale : null,              //균등한 block 를 생성하기 위한 Scale
            types : null,
            blocks : null,
            titles : null,
            svgWidth : 0,                  //svg width
            svgHeight : 0,                 //svg height
            selectBlockItems : [],
            minWidth : 0,
            isResize : false,           //일정 사이즈이하로 작아질 경우 check 변수.
            isApplyCustomClickEv : false,           //event 중복 적용 방지
            isApplyCustomMouseOverEv : false,
            isApplyCustomMouseOutEv : false
        };
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
        config.size_width = size ? size.width : null;
        config.size_height = size ? size.height : null;
        //resize 될 경우, false 로 셋팅.
        that.isResize = false;
        $$.draw(config);
    };

    chart_fn.clear = function(){
        var $$ = this.internal,
            config = $$.config,
            that = $$.chart_internal_val;

        if( that.viewPortEl ){
            that.viewPortEl.remove();
            that.viewPortEl = null;
        }
        if( that.svg ){
            that.svg.remove();
            that.svg = null;
        }
        if( that.xScale ){
            that.xScale = null;
        }
        if( that.yScale ){
            that.yScale = null;
        }
        if( that.types ){
            that.types = null;
        }
        if( that.blocks ){
            that.blocks = null;
        }
        if( that.titles ){
            that.titles = null;
        }
        if( that.selectBlockItems ){
            that.selectBlockItems = [];
        }
        that.isResize = false;
        that.isApplyCustomClickEv = false;           //event 중복 적용 방지
        that.isApplyCustomMouseOverEv = false;
        that.isApplyCustomMouseOutEv = false;

    }
    //단순히 config 을 변경, 적용시킬 경우, load 호출.
    chart_fn.load = function (data) {
        if( !data || data.length === 0 ) chart_fn.clear();
        var $$ = this.internal,
            config = $$.config;
        var tempSizeVal = {
            width : config.size_width,
            height : config.size_height
        };

        // TODO your coding area (OPTION)
        // .... load data and draw. It is option
        //$$.loadConfig(data);
        config.data = data;
        config.size_width = tempSizeVal.width;
        config.size_height = tempSizeVal.height;

        if( config.size_height <= 0 ) {
            config.size_height = 300;
        }
        // config.data = data;
        $$.draw(config);
    };

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

    chart_fn.getSelectItems = function(){
        var $$ = this.internal,
            config = $$.config,
            that = $$.chart_internal_val;

        return that.selectBlockItems;
    }

    // internal fn : configuration, init
    chart_internal_fn.getDefaultConfig = function () {
        // TODO your coding area (OPTION)
        // you must set => <name>_<name>_<name>: value
        var config = {
            bindto: '#chart',
            data: undefined,
            //block mouseOver, click 에 따른 Fill 값
            /*fill — A color value. Just as with CSS, colors can be specified as
            named colors — orange
            hex values — #3388aa or #38a
            RGB values — rgb(10, 150, 20)
            RGB with alpha transparency — rgba(10, 150, 20, 0.5) */
            // itemSelectedColor: 'red', //'#fff', //'red'
            // itemSelectedMouseOverColor : '#ff8c00', //'orange',
            // itemMouseoverColor: 'yellow', //'yellow',
            showNavEl : false,
            //block Item  click 시 발생할 custom method
            itemClickFn: null,
            itemMouseOverFn : null,
            itemMouseOutFn: null,
            margin_top : 20,
            margin_bottom : 30,
            margin_left : 20,
            margin_right: 20,
            //custom -> block chart 디렉티브를 감씨는 div 같은 태그엔 height 속성이 설정되어 있지 않아야 됨.
            //parent -> block chart 디렉티브를 감싸는 div 같은 태그에는 height 속성이 반드시 지정되어 있어야 한다. (default 값)
            viewPort_height: 'parent',
            viewPort_width: 'parent',
            blockItemHeight : 60,
            //style
            style_viewPortClassName : 'bistel-block-viewPort',
            style_navStyleName : 'bistel-block-nav',
            style_navArrLeftStyleName : 'bistel-block-nav-arr-left',
            style_navArrRightStyleName : 'bistel-block-nav-arr-right',
            style_backgroundStyleName : 'bistel-block-background',
            style_blockListStyleName : 'bistel-block-blockList',
            style_blockItemStyleName : 'bistel-block-blockItem',
            style_blockTitleStyleName : 'bistel-block-blockTitle',
            size_width: 200,
            size_height: 100,
            //block item setting
            block_title_showEl : true,
            block_title_showCount : false,
            block_type_showCount : false,
            block_item_showCount : false,

            //block item : text set.
            showMaxLine : 2,
            //blockItemClassTypeList
            blockItemClassTypeList : [],
            showDefaultToolTip : true
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
            that = $$.chart_internal_val,
            data = config.data;

        if(data == undefined || (_.isObject(data) && !data.hasOwnProperty('items') && !data.hasOwnProperty('titles'))){
            return;
        }

        _drawSetCalcLayout();       //layout 을 구성하기 위한 값을 계산.
        _drawSetCreateLayoutEl();     //기본 LayoutEl 생성 및 설정.
        _drawSetScale();            //scale 설정
        _drawSetSVG();             //svg 그리기.
        _drawSetSeries();          //blockItems 그리기.
        _drawSetMouseEv();      //blockItems 에 event 걸기.
        _drawSetScrollEv();         //viewPort Scroll 생성에 따른 Event 추가

        function _drawSetCalcLayout(){
            var parent_node = $($$.config.bindto).parent();
            
            if( parent_node.width() > 0 ) config.size_width = parent_node.width();
            if( parent_node.height() > 0 ) config.size_height = parent_node.height();

            if(config.viewPort_width == 'parent'){
                that.svgWidth = config.size_width - config.margin_left - config.margin_right;
                if(that.svgWidth <= 0){
                    that.svgWidth = 0;
                }
                that.viewPortElWidth = config.size_width;
            }else if(config.viewPort_width == 'custom'){
                //check data
                var customWidth = _drawCheckWidth();
                that.svgWidth =  customWidth - config.margin_left - config.margin_right;
                that.viewPortElWidth = customWidth;
            }else{
                console.log('please check value - config.viewPort.width ');
            }

            if(config.viewPort_height == 'parent'){
                if(config.showNavEl){
                    that.svgHeight = config.size_height - config.margin_top - config.margin_bottom - that.navElHeight;
                    if(that.svgHeight <= 0){
                        that.svgHeight = 0;
                    }
                    that.viewPortElHeight = config.size_height - that.navElHeight;
                }else{
                    that.svgHeight = config.size_height - config.margin_top - config.margin_bottom;
                    that.viewPortElHeight = config.size_height;
                }
            }else if(config.viewPort_height == 'custom'){
                //check data
                var customHeight = _drawCheckHeight(data);
                if(config.showNavEl){
                    that.svgHeight =  customHeight - config.margin_top - config.margin_bottom - that.navElHeight;
                    that.viewPortElHeight = customHeight - that.navElHeight;
                }else{
                    that.svgHeight =  customHeight - config.margin_top - config.margin_bottom;
                    that.viewPortElHeight = customHeight;

                }


            }else{
                console.log('please check value - config.viewPort.height ');
            }

            function _drawCheckWidth(){
                if(data.length <= 0){
                    return config.size_width;
                }

                return config.blockItemWidth * data.length;
            }

            function _drawCheckHeight(arrData){
                if( !_.isArray(arrData.items) ){
                    return config.size_height;
                }
                // if(arrData == undefined || arrData.length === 0 || arrData.items.length <= 0){
                //     return config.size_height;
                // }

                return config.blockItemHeight * d3.max(arrData.items.map(function(d){ return d.subItems.length }));
                // return config.blockItemHeight * data.length;
            }
        }

        function _drawSetCreateLayoutEl(){
            if(config.showNavEl){
                if(that.navEl == null){
                    //create
                    that.navEl = d3.select(config.bindto).append('div')
                    .attr('class', config.style_navStyleName)
                    .style('width', that.viewPortElWidth + 'px')
                    .style('height', that.navElHeight + 'px');

                    //TODO : config 설정을 통한 이미지 셋팅이 가능하도록 수정.
                    that.navEl.append('button')
                    .attr('class', config.style_navArrLeftStyleName)
                    // .attr('disabled', 'true')
                    .text('<<')
                    .on('click', function(d){
                        var elem = $(that.viewPortEl[0]);

                        if(elem.scrollLeft() > 0){
                            elem.scrollLeft(elem.scrollLeft() - 10);
                        }
                    });

                    that.navEl.append('button')
                    .attr('class', config.style_navArrRightStyleName)
                    // .attr('disabled', 'true')
                    .text('>>')
                    .on('click', function(d){
                        var elem = $(that.viewPortEl[0]);

                        if(elem.scrollLeft() > 0){
                            elem.scrollLeft(elem.scrollLeft() - 10);
                        }
                    });
                }else{
                    //update
                    that.navEl.style('width', that.viewPortElWidth + 'px')
                    .style('height', that.navElHeight + 'px');
                }
            }
            if(that.viewPortEl == null){
                //create
                that.viewPortEl = d3.select(config.bindto).append('div')
                    .attr('class', config.style_viewPortClassName)
                    .style('width', that.viewPortElWidth + 'px')
                    .style('height', that.viewPortElHeight + 'px');
            }
            else{
                //update width, height of that.viewPortEl
                that.viewPortEl
                    .style('width', that.viewPortElWidth + 'px')
                    .style('height', that.viewPortElHeight + 'px');
            }
        }

        //scale 적용 ( block 들을 균일하게 배치하기 위함 )
        function _drawSetScale(){
            //requirement : xScale, yScale, width, height, data
            if(that.xScale == null){
                that.xScale = d3.scale.ordinal();
            }
            if(that.yScale == null){
                that.yScale = d3.scale.ordinal();
            }
            //title 을 기준으로
            that.xScale.rangeBands([0, that.svgWidth], .1)
                .domain(config.data.items.map(function(d) { return d.id; }));

            var arr = [];
            if(config.block_title_showEl){
                arr.push('title');
            }
            for(var i = 0; i < d3.max(config.data.items.map(function(d) { return d.subItems.length })); i++){
                arr.push(i);
            }
            that.yScale.rangeBands([0, that.svgHeight], .1)
                .domain(arr);
        }

        //width 을 건네줄 경우, 그 값을 svg 너비로 지정, 없을 경우, chart 내부의 값을 svg 너비로 지정.
        function _drawSetSVG(width){
            if(that.svg == null){
                that.svg = that.viewPortEl.append("svg")
                    .attr('class', config.style_backgroundStyleName)
                    .attr("width", that.svgWidth + config.margin_left + config.margin_right)
                    .attr("height", that.svgHeight + config.margin_top + config.margin_bottom)
                    .append("g")
                    .attr("transform", "translate(" + config.margin_left + "," + config.margin_top + ")");
            }else{
                if(width == undefined){
                    that.viewPortEl.select('svg').attr('width', that.svgWidth + config.margin_left + config.margin_right)
                        .attr('height', that.svgHeight + config.margin_top + config.margin_bottom);
                }else{
                    that.viewPortEl.select('svg').attr('width', width + config.margin_left + config.margin_right)
                        .attr('height', that.svgHeight + config.margin_top + config.margin_bottom);

                    // console.log(that.navEl);
                }
            }
        }

        function _enterTitleData(){
            that.titles = that.svg.selectAll('.title')
                .data(data.titles)
                .enter()
                .append('g')
                .attr('class', '' + config.style_blockTitleStyleName)
                .attr('transform', function(d, i){
                    return 'translate(' + that.xScale.range()[d.start] + ',0)';
                });

            that.titles.append('rect').attr('height', that.yScale.rangeBand())
                .attr('x', function(d, i){
                    return 0;
                })
                .attr('width', function(d, i){
                    var endPos = that.xScale.range()[d.end],
                        startPos = that.xScale.range()[d.start];
                    return endPos - startPos + that.xScale.rangeBand();
                });

            that.titles.append('text')
                .text(function(d) {
                    if(config.block_title_showCount){
                        return d.info.name + '('+ d.countValue +')';
                    }
                    else{
                        return d.info.name;
                    }
                })
                .attr('x', function(d, x, y){
                    //잘 안들어오는 구문.
                    return (d3.select($(this).parent()[0])[0][0].getBBox().width - d3.select(this)[0][0].getBBox().width) / 2;
                })
                .attr('y', function(d, i){
                    return that.yScale.rangeBand() / 2;
                })
                .attr('dy', '.35em')
                .attr('pointer-events', 'none');
        }

        function _enterTypeData(){
            that.types = that.svg.selectAll('.typeGroup')
            .data(data.items)
            .enter()
            .append('g')
            .attr('class', config.style_blockListStyleName)
            .attr('transform', function(d, i){
                return 'translate(' + that.xScale(d.id) + ',0)';
            });
        }

        //blockItems 을 생성한다.
        function _drawSetSeries(){
            //title 를 표시해줘야 될 경우.
            if(config.block_title_showEl){
                if(that.titles == null){
                    //타이틀이 없을 경우, 새로 만들어 준다.
                    _enterTitleData();
                }else{
                    if(that.titles.data().length > 0){
                        //d.start ~ d.end 구간으로 해서 title 를 표시해준다.
                        that.titles.data(data.titles)
                        .attr('transform', function(d, i){
                            return 'translate(' + that.xScale.range()[d.start] + ',0)';
                        });

                        that.titles.selectAll('.' + config.style_blockTitleStyleName + ' rect')
                        .attr('width', function(d, i){
                            var endPos = that.xScale.range()[d.end],
                                startPos = that.xScale.range()[d.start];
                            return endPos - startPos + that.xScale.rangeBand();
                        });

                        that.titles.selectAll('.' + config.style_blockTitleStyleName + ' text')
                        .attr('x', function(d, x, y){
                            //잘 안들어오는 구문.
                            return (d3.select($(this).parent()[0])[0][0].getBBox().width - d3.select(this)[0][0].getBBox().width) / 2;
                        })
                        .attr('y', function(d, i){
                            return that.yScale.rangeBand() / 2;
                        });
                    }else{
                        _enterTitleData();
                    }
                }
            }

            //type 표시.
            if(that.types == null){
                _enterTypeData();
            }else{
                if( that.types.length > 0 ){
                    //item 의 id 값에 따라서 x 축의 위치가 정해져있음. ( id 는 유니크한 값. )
                    //주의사항 : type 의 block Item 이 표시되는 로직이 아니라, 위치를 잡아주는 로직임.
                    //위치를 잡아주게 되면, blocks 에서 첫번째로 들어가는 block item 이 type 의 block Item 임.
                    that.types.data(data.items)
                        .attr('transform', function(d, i){
                            return 'translate(' + that.xScale(d.id) + ',0)';
                        });
                }else{
                    _enterTypeData();
                }
                // if(that.types.data().length > 0){
                //     //item 의 id 값에 따라서 x 축의 위치가 정해져있음. ( id 는 유니크한 값. )
                //     //주의사항 : type 의 block Item 이 표시되는 로직이 아니라, 위치를 잡아주는 로직임.
                //     //위치를 잡아주게 되면, blocks 에서 첫번째로 들어가는 block item 이 type 의 block Item 임.
                //     that.types.data(data.items)
                //         .attr('transform', function(d, i){
                //             return 'translate(' + that.xScale(d.id) + ',0)';
                //         });
                // }else{
                //     _enterTypeData();
                // }
            }

            if(that.blocks == null){
                //that.blocks  이 null 일경우.
                //block item class 설정.
                that.blocks = that.types.selectAll('rect')
                    .data(function(d){
                        return d.subItems;
                    })
                    .enter()
                    .append('g')
                    .attr('class', function(d, i){
                        //TODO : class 설정도 config 에서 할 수 있도록 수정할 것.
                        var processName = d.group.name.toLowerCase();

                        if(!_.isArray(config.blockItemClassTypeList)){
                            console.log('check config value ( config.blockItemClassTypeList is not Array )');
                        }
                        else{
                            if(i == 0){
                                return config.style_blockItemStyleName + ' ' + processName + ' main';
                            }
                            else{
                                var retClassName = config.style_blockItemStyleName + ' ' + processName;
                                try{
                                    config.blockItemClassTypeList.forEach(function(configItem){
                                        var value = d;
                                        configItem.checkField.split('.').forEach(function(prop){
                                            if(value[prop] == undefined){
                                                value = undefined;
                                                return;
                                            }
                                            else{
                                                value = value[prop];
                                            }
                                        })
                                        if(value == undefined){
                                            retClassName = config.style_blockItemStyleName + ' ' + processName;
                                        }
                                        else{
                                            if(configItem.operator == '>'){
                                                if(value > configItem.baseValue){
                                                    retClassName = config.style_blockItemStyleName + ' ' + processName + ' ' +configItem.addClassName;
                                                }
                                            }
                                            else if(configItem.operator == '>=' || configItem.operator == '=>'){
                                                if(value >= configItem.baseValue){
                                                    retClassName = config.style_blockItemStyleName + ' ' + processName + ' ' +configItem.addClassName;
                                                }
                                            }
                                            else if(configItem.operator == '<'){
                                                if(value < configItem.baseValue){
                                                    retClassName = config.style_blockItemStyleName + ' ' + processName + ' ' +configItem.addClassName;
                                                }
                                            }
                                            else if(configItem.operator == '<=' || configItem.operator == '=<'){
                                                if(value <= configItem.baseValue){
                                                    retClassName = config.style_blockItemStyleName + ' ' + processName + ' ' +configItem.addClassName;
                                                }
                                            }
                                            else if(configItem.operator == '=='){
                                                if(value == configItem.baseValue){
                                                    retClassName = config.style_blockItemStyleName + ' ' + processName + ' ' +configItem.addClassName;
                                                }
                                            }
                                        }
                                    })
                                }
                                catch(e){

                                }finally{
                                    return retClassName;
                                }
                            }
                        }
                        // var oosOption = config.blockItemClassTypeList.find(function(item){ return item.prepName == 'oosCount'; }),
                        // oocOption = config.blockItemClassTypeList.find(function(item){ return item.prepName == 'oocCount'; }),
                        // waferOption = config.blockItemClassTypeList.find(function(item){ return item.prepName == 'waferCount'; });
                        //
                        // if(i == 0){
                        //     return config.style_blockItemStyleName + ' ' + processName + ' main';
                        // }else{
                        //     if(d.throughput){
                        //         if(d.throughput.oosCount > 0){
                        //             // return oosOption.color;
                        //             return config.style_blockItemStyleName + ' ' + processName + ' oos';
                        //         }
                        //         if(d.throughput.oocCount > 0){
                        //             return config.style_blockItemStyleName + ' ' + processName + ' ooc';
                        //             // return oocOption.color;
                        //         }
                        //         if(d.throughput.waferCount == 0){
                        //             return config.style_blockItemStyleName + ' ' + processName + ' wafer';
                        //             // return waferOption.color;
                        //         }
                        //         return config.style_blockItemStyleName + ' ' + processName;
                        //     }else{
                        //         return config.style_blockItemStyleName + ' ' + processName;
                        //     }
                        // }
                    });
                    // .attr('class', config.style_blockItemStyleName);

                if(config.showDefaultToolTip){
                    that.blocks.append('title').text(function(d, idx){
                        if(idx <= 0){
                            if(config.block_type_showCount){
                                return d.title + ' (' + d.countValue + ')';
                            }else{
                                return d.title;
                            }
                        }
                        else{
                            if(config.block_item_showCount){
                                return d.title + ' (' + d.countValue + ')';
                            }else{
                                return d.title;
                            }
                        }
                    });
                }
                //block item 의 높이, 너비, y 위치 맞추기. ( x 는 types 셋팅에서 설정됨 )
                that.blocks.append('rect').attr('height', that.yScale.rangeBand())
                    .attr('y', function(d, i){
                        return that.yScale(i);
                    })
                    .attr('width', that.xScale.rangeBand());

                that.blocks.append('text')
                    .attr('x', function(d, x, y){
                        //잘 안들어오는 구문.
                        return (d3.select($(this).parent()[0])[0][0].getBBox().width - d3.select(this)[0][0].getBBox().width) / 2;
                    })
                    .attr('y', function(d, i){
                        return that.yScale(i) + (that.yScale.rangeBand() / 2);
                    })
                    .attr('dy', '.35em')
                    .attr('pointer-events', 'none')
                    .each(function(data, idx){
                        //countValue 붙여서 길이 계산, 너비 조절.
                        wrap(this, data, idx, that.xScale.rangeBand() - 10, 2);
                    })

            }else{
                //that.blocks 이 존재할 경우.
                if(that.blocks.length > 0){
                    //데이터가 있을 경우, update.
                    that.blocks.data(function(d){
                        return d.subItems;
                    });

                    that.blocks.select('.' + config.style_blockItemStyleName + ' rect')
                        .attr('y', function(d, i){
                            return that.yScale(i);
                        })
                        .attr('width', that.xScale.rangeBand())
                        .attr('height', that.yScale.rangeBand());

                    that.blocks.select('text')
                        .attr('x', function(d, x, y){
                            // console.log("1", d, x, y, that.xScale(that.xScale.domain()[y]), d3.select(this).node().getComputedTextLength(), d3.select(this)[0][0].getBBox().width);
                            // return that.xScale(that.xScale.domain()[y]);
                            // - d3.select(this).node().getComputedTextLength() / 2;
                            return (d3.select($(this).parent()[0])[0][0].getBBox().width - d3.select(this)[0][0].getBBox().width) / 2;
                        })
                        .attr('y', function(d, i){
                            return that.yScale(i) + (that.yScale.rangeBand() / 2);
                        })
                        .each(function(data, idx){
                            wrap(this, data, idx, that.xScale.rangeBand() - 10, 2);
                        });
                        // .attr('dx', that.xScale.rangeBand() - 5);
                        // .attr('textLength', that.xScale.rangeBand() - 10);
                }else{
                    //데이터가 없을 경우, 새로 생성.
                    that.blocks = that.types.selectAll('rect')
                        .data(function(d){
                            return d.subItems;
                        })
                        .enter()
                        .append('g')
                        .attr('class', config.style_blockItemStyleName);

                    that.blocks.append('rect').attr('height', that.yScale.rangeBand())
                        .attr('y', function(d, i){
                            return that.yScale(i);
                        })
                        .attr('width', that.xScale.rangeBand());

                    that.blocks.append('text')
                        // .append('tspan')
                        // .text(function(d) {
                        //     return d.title;
                        // })
                        .attr('x', function(d, x, y){
                            return (d3.select($(this).parent()[0])[0][0].getBBox().width - d3.select(this)[0][0].getBBox().width) / 2;
                        })
                        .attr('y', function(d, i){
                            return that.yScale(i) + (that.yScale.rangeBand() / 2);
                        })
                        .attr('dy', '.35em')
                        .attr('pointer-events', 'none')
                        .each(function(data, idx){
                            wrap(this, data, idx, that.xScale.rangeBand() - 10, 2);
                        });
                }
            }

            //blockItem 내 text 가 rect 범위를 벗어날 경우, svg 의 너비를 재지정, 다시 그려준다.
            // if(that.minWidth == 0){
            //     //초기 생성시 이 부분에 들어간다.
            //     if(that.xScale.rangeBand() == 0){
            //         return;
            //     }
            //     //blockItem 내 text 너비가 rect 너비보다 긴지 아닌지 체크.
            //     var rectWidth = d3.max(that.blocks.selectAll('text').map(function(d){
            //             return d[0].getBBox().width;
            //         }));
            //
            //     console.log('if - ', that.minWidth, that.xScale.rangeBand(), rectWidth, data);
            //     //text 너비에 10 px 을 더한 값이 rect 너비보다 길 경우, 최소 너비를 지정, 다시 차트를 그려준다.
            //     // if(that.xScale.rangeBand() < rectWidth + 10){
            //     //     //update
            //     //     //근접값을 보내주기..
            //     //     var gap = rectWidth - that.xScale.rangeBand() + 10;
            //     //     that.svgWidth += gap * data.length;
            //     //     that.minWidth = that.svgWidth;
            //     //     _reDrawChart(Math.round(that.minWidth));
            //     // }
            // }
            // //화면이 일정 너비 이상보다 작아질 경우,
            // else if(that.minWidth > that.svgWidth){
            //     //resize 한 이력이 있는지 체크.
            //     if(!that.isResize){
            //         _reDrawChart(Math.round(that.minWidth));
            //     }
            // }

            if(!that.isResize){
                _reDrawChart(Math.round(that.svgWidth));
            }

            //check
            function _reDrawChart(width){
                //scale 너비 리셋팅.
                that.xScale.rangeBands([0, width], .05);
                that.isResize = true;
                //svg 를 다시 그려줌.
                _drawSetSVG(width);
                _drawSetSeries();
            }

            function wrap(el, data, idx, width, padding){
                if(el == undefined){
                    return;
                }
                var countWords = '';
                //TODO : remove
                // if(el.__data__.throughput){
                //     countWords = "("+el.__data__.throughput.waferCount+")"
                // }
                if(idx <= 0){
                    if(config.block_type_showCount){
                        if(_.isNumber(data.countValue)){
                            countWords = "("+ data.countValue +")";
                        }else if(_.isString(data.countValue)){
                            countWords = "("+ parseInt(data.countValue.replace(',', '')) +")";
                        }else{
                            console.log('check data.countValue : ', data.countValue);
                        }
                        // if(data.countValue == 0){
                        // }
                        // else{
                        //     countWords = "("+ data.countValue.toString().split(0, 2) +"..)";
                        // }
                        // countWords = "("+ data.countValue +")";
                    }
                }
                else{
                    if(config.block_item_showCount){
                        if(_.isNumber(data.countValue)){
                            countWords = "("+ data.countValue +")";
                        }else if(_.isString(data.countValue)){
                            countWords = "("+ parseInt(data.countValue.replace(',', '')) +")";
                        }else{
                            console.log('check data.countValue : ', data.countValue);
                        }
                        // if(data.countValue == 0){
                            // countWords = "("+ data.countValue +")";
                        // }
                        // else{
                            // countWords = "("+ data.countValue.toString().split(0, 2) +"..)";
                        // }
                    }
                }

                var self = d3.select(el),
                    // words = el.__data__.title.split("").concat(countWords).reverse(),
                    words = data.title.concat(countWords).split("").reverse(),
                    word,
                    line = [],
                    lineNumber = 0,
                    lineHeight = 1.3,
                    y = self.attr('y'),
                    dy = parseFloat(self.attr('dy')),
                    tspan = self.text(null).append('tspan').attr('x', 0).attr('y', y).attr('dy', dy + 'em');

                //
                while (word = words.pop()) {
                    if(lineNumber < config.showMaxLine - 1){
                        line.push(word);
                        tspan.text(line.join(""));
                        if (tspan.node().getComputedTextLength() > width) {
                            line.pop();
                            tspan.text(line.join(""));
                            line = [word];
                            tspan = self.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);

                        }
                    }else{
                        line.push(word);
                        tspan.text(line.join(""));
                        var text = tspan.text();

                        if(tspan.node().getComputedTextLength() > width){
                            // debugger;
                            // console.log(el.__data__);
                            if(idx <= 0){
                                if(config.block_type_showCount){
                                    text = text.slice(0, -(countWords.length + 4));
                                    // tspan.text(text + ".." + "("+ el.__data__.throughput.waferCount +")");
                                    if(data.countValue == 0){
                                        tspan.text(text + ".." + "("+ data.countValue +")");
                                    }
                                    else{
                                        tspan.text(text + ".." + "("+ data.countValue.toString().slice(0, 1) +"..)");
                                    }
                                }
                                else{
                                    text = text.slice(0, -3);
                                    tspan.text(text + "..");
                                }
                                // if(el.__data__.throughput){
                                //     text = text.slice(0, -(countWords.length + 4));
                                //     tspan.text(text + ".." + "("+ el.__data__.throughput.waferCount +")");
                                // }else{
                                //     text = text.slice(0, -3);
                                //     tspan.text(text + "..");
                                // }

                            }
                            else{
                                if(config.block_item_showCount){
                                    text = text.slice(0, -(countWords.length + 4));
                                    if(data.countValue == 0){
                                        tspan.text(text + ".." + "("+ data.countValue +")");
                                    }else{
                                        tspan.text(text + ".." + "("+ data.countValue.toString().slice(0, 1) +"..)");
                                    }
                                }
                                else{
                                    text = text.slice(0, -3);
                                    tspan.text(text + "..");
                                }
                                // if(el.__data__.throughput){
                                //     text = text.slice(0, -(countWords.length + 4));
                                //     tspan.text(text + ".." + "("+ el.__data__.throughput.waferCount +")");
                                // }else{
                                //     text = text.slice(0, -3);
                                //     tspan.text(text + "..");
                                // }

                            }
                            break;
                        }
                    }
                }
                // self.append('title').text(data.title.concat(countWords));

                self.selectAll('tspan')
                    .attr('x', function(d){
                        return d3.select($(this).parent().parent()[0])[0][0].getBBox().width / 2 - d3.select(this).node().getComputedTextLength() / 2;
                    })
                    .attr('y', function(d){
                        var lineCount = $(this).parent().children().length;
                        if(lineCount <= 1){
                            return d3.select(this).attr('y');
                        }else if(lineCount > 1){
                            return d3.select(this).attr('y') - d3.select(this)[0][0].getBBox().height / 4;
                        }
                    });

                // self.text(el.__data__.title);
                // var textLength = self.node().getComputedTextLength(),
                //     text = el.__data__.title;
                //
                // while (textLength > (width - 2 * padding) && text.length > 0) {
                //     text = text.slice(0, -1);
                //     self.text(text + '...');
                //     textLength = self.node().getComputedTextLength();
                // }
            }
        }

        //scroll start, end  도달시에 대한 Event 셋팅
        function _drawSetScrollEv(){
            if(!config.showNavEl){
                return;
            }
            //check scrollLeft ( init )
            var elem = $(that.viewPortEl[0]),
                arrScrollLeftEl = that.navEl.select('.' + config.style_navArrLeftStyleName),
                arrScrollRightEl = that.navEl.select('.' + config.style_navArrRightStyleName);

            var isScrollEnd = elem[0].scrollWidth-elem.scrollLeft() <= elem.outerWidth(),
                isScrollStart = elem.scrollLeft() == 0;

            var scrollUnit = (elem[0].scrollWidth - elem.outerWidth()) / 2;

            var ACTIVE_SCROLL_LEFT = 0, ACTIVE_SCROLL_RIGTH = 1, ACTIVE_SCROLL_BOTH = 2, ACTIVE_SCROLL_NONE = -1;

            //apply scroll Start // scroll end
            arrScrollLeftEl.on('click', function(d){
                // if(isScrollStart){
                //     console.log('left return');
                //     return;
                // }
                if(elem.scrollLeft() - scrollUnit <= 10){
                    elem.scrollLeft(0);
                }else{
                    elem.scrollLeft(elem.scrollLeft() - scrollUnit);
                }
            });

            arrScrollRightEl.on('click', function(d){
                if(isScrollEnd){
                    console.log('right return');
                    return;
                }

                if(elem.scrollLeft() + scrollUnit >= elem[0].scrollWidth - elem.outerWidth()){
                    elem.scrollLeft(elem[0].scrollWidth - elem.outerWidth());
                }else{
                    elem.scrollLeft(elem.scrollLeft() + scrollUnit);
                }
            })

            if(that.minWidth > that.svgWidth){
                if (isScrollEnd){
                    _activeLeftEl(arrScrollLeftEl[0][0], arrScrollRightEl[0][0], ACTIVE_SCROLL_LEFT);
                }

                if( isScrollStart ){
                    _activeLeftEl(arrScrollLeftEl[0][0], arrScrollRightEl[0][0], ACTIVE_SCROLL_RIGTH);
                }

                if( !isScrollStart && !isScrollEnd ){
                    _activeLeftEl(arrScrollLeftEl[0][0], arrScrollRightEl[0][0], ACTIVE_SCROLL_BOTH);
                }
            }else{
                _activeLeftEl(arrScrollLeftEl[0][0], arrScrollRightEl[0][0], ACTIVE_SCROLL_NONE);
            }

            $(that.viewPortEl[0]).scroll( function() {
                isScrollEnd = elem.outerWidth() >= elem[0].scrollWidth-elem.scrollLeft();
                isScrollStart = elem.scrollLeft() == 0;
                // var elem = $(that.viewPortEl[0]);
                if (isScrollEnd){
                    _activeLeftEl(arrScrollLeftEl[0][0], arrScrollRightEl[0][0], ACTIVE_SCROLL_LEFT);
                }

                if( isScrollStart ){
                    _activeLeftEl(arrScrollLeftEl[0][0], arrScrollRightEl[0][0], ACTIVE_SCROLL_RIGTH);
                }

                if( !isScrollStart && !isScrollEnd ){
                    _activeLeftEl(arrScrollLeftEl[0][0], arrScrollRightEl[0][0], ACTIVE_SCROLL_BOTH);
                }
            });

            function _activeLeftEl(leftEl, rightEl, type){
                //ex)
                //leftEl = that.navEl.select('.arr_left')[0][0]
                //rightEl = that.navEl.select('.arr_right')[0][0]
                if(type == 0){
                    //ACTIVE_SCROLL_LEFT
                    leftEl.disabled = false; rightEl.disabled = true;
                }else if(type == 1){
                    //ACTIVE_SCROLL_RIGTH
                    leftEl.disabled = true; rightEl.disabled = false;
                }else if(type == 2){
                    //ACTIVE_SCROLL_BOTH
                    leftEl.disabled = false; rightEl.disabled = false;
                }else if(type == -1){
                    leftEl.disabled = true; rightEl.disabled = true;
                }

            }
        }

       function findItemIdx(findItem){
           var findItemIdx = that.selectBlockItems.findIndex(function(item){
               return item.moduleId == findItem.moduleId;
           });

           return findItemIdx;
       }

        //blockItems 에 이벤트를 걸어준다.
        function _drawSetMouseEv(){
            //걸어줄 대상이 null 일 경우 빠져나온다.
            if(that.blocks == null){
                return;
            }

            that.blocks.select('.' + config.style_blockItemStyleName + ' rect')
                .on('click', function(d, xIdx, yIdx){
                    return;

                    //선택시 선택표시를 나타내기 위한 class 작업.
                    //현재는 사용 안함. 2016-09-22 by jwhong
                    // var el = d3.select($(this).parent()[0]);
                    // el.classed('selected', !el.classed('selected'));
                    // d3.event.stopPropagation();

                    // var subItems = d3.select($(this).parent().parent()[0]).selectAll('.'+ config.style_blockItemStyleName);
                    // if(d.module == undefined){
                    //     //modyleType item click
                    //     if(el.classed('selected')){
                    //         subItems[0].forEach(function(item){
                    //             var data = d3.select(item)[0][0].__data__;
                    //             if(data.module != undefined){
                    //                 data.selected = true;
                    //                 var itemEl = d3.select($(item)[0]);
                    //                 itemEl.classed('selected', true);
                    //             }
                    //         });
                    //     }else{
                    //         subItems[0].forEach(function(item){
                    //             var data = d3.select(item)[0][0].__data__;
                    //             if(data.module != undefined){
                    //                 data.selected = false;
                    //                 var itemEl = d3.select($(item)[0]);
                    //                 itemEl.classed('selected', false);
                    //             }
                    //         })
                    //     }
                    // }else{
                    //     //module item click
                    //     var subItemCount = 0;
                    //     subItems[0].forEach(function(item){
                    //         var data = d3.select(item)[0][0].__data__;
                    //         if(data.module != undefined){
                    //             if(d3.select(item).classed('selected')){
                    //                 subItemCount++;
                    //             }
                    //         }
                    //     });
                    //     if(subItemCount + 1 >= subItems[0].length){
                    //         d3.select(subItems[0][0]).classed('selected', true);
                    //     }else{
                    //         d3.select(subItems[0][0]).classed('selected', false);
                    //     }

                    // }
                })

            //외부 custom event 을 걸었는지 체크.
            if(!that.isApplyCustomClickEv && !that.isApplyCustomMouseOverEv && !that.isApplyCustomMouseOutEv){
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
                                  selectedElData = d3.select(this)[0][0].__data__,
                                  sendData = null;

                              sendData = {
                                  event: ev,
                                  data : selectedElData,
                                  target : d3.select(this)
                              };

                              var items = d3.select($(this).parent().parent()[0]).selectAll('.'+config.style_blockItemStyleName);
                              if(selectedElData.module == undefined){
                                  //click moduleType
                                  if( selectedElData.selected == undefined || selectedElData.selected == false){
                                      items[0].forEach(function(item){
                                          var data = item.__data__;
                                          if(data.module != undefined){
                                              var isSelectedItem = that.selectBlockItems.find(function(d){
                                                  return d.moduleId == data.module.moduleId;
                                              });

                                              if(isSelectedItem == undefined){
                                                  that.selectBlockItems.push(data.module);
                                              }
                                          }
                                      })
                                      selectedElData.selected = true;

                                  }else if( selectedElData.selected == true ){
                                      items[0].forEach(function(item){
                                          var itemData = item.__data__;
                                          if(itemData.module !== undefined){
                                              that.selectBlockItems.splice(findItemIdx(itemData.module), 1);
                                          }
                                      })
                                      selectedElData.selected = false;
                                  }
                              }else{
                                  //click module
                                  if( selectedElData.selected == undefined || selectedElData.selected == false){
                                      that.selectBlockItems.push(selectedElData.module);
                                      selectedElData.selected = true;
                                  }else if( selectedElData.selected == true){
                                      that.selectBlockItems.splice(findItemIdx(selectedElData.module), 1);
                                      selectedElData.selected = false;
                                  }

                                  var subItemCount = 0;
                                  items[0].forEach(function(item){
                                      var data = item.__data__;
                                      if(data.module != undefined){
                                          if(data.selected){
                                              subItemCount++;
                                          }
                                      }
                                  });
                                  if(subItemCount + 1 >= items[0].length){
                                    //   d3.select(items[0][0]).classed('selected', true);
                                      items[0][0].__data__.selected = true;
                                  }else{
                                    //   d3.select(items[0][0]).classed('selected', false);
                                      items[0][0].__data__.selected = false;
                                  }
                              }
                              $$.config.itemClickFn(sendData);
                              ev.stopPropagation();
                          });
                       }
                       //이벤트를 걸어줬으므로, 다시 중복으로 걸지 않게 위해 flag 설정.
                       that.isApplyCustomClickEv = true;
                    }

                    if( $$.config.itemMouseOverFn ) {
                        var dom = null;
                        var list = ev;
                        for( var i = 0; i < list.length; i++ ) {
                            dom = $(list[i]);
                            dom.on('remove', function() {
                                this.unbind('mouseover');
                            });
                            dom.bind('mouseover', function(ev) {
                               var index = i,
                                   selectedElement = d3.select(this)[0][0].__data__,
                                   sendData = null;

                               sendData = {
                                   event: ev,
                                   data : selectedElement,
                                   target : d3.select(this)
                               };

                               $$.config.itemMouseOverFn(sendData);
                               ev.stopPropagation();
                           });
                       }
                       that.isApplyCustomMouseOverEv = true;
                   }

                   if( $$.config.itemMouseOutFn ) {
                       var dom = null;
                       var list = ev;
                       for( var i = 0; i < list.length; i++ ) {
                           dom = $(list[i]);
                           dom.on('remove', function() {
                               this.unbind('mouseout');
                           });
                           dom.bind('mouseout', function(ev) {
                              var index = i,
                                  selectedElement = d3.select(this)[0][0].__data__,
                                  sendData = null;

                              sendData = {
                                  event: ev,
                                  data : selectedElement,
                                  target : d3.select(this)
                              };

                              $$.config.itemMouseOutFn(sendData);
                              ev.stopPropagation();
                          });
                      }
                      that.isApplyCustomMouseOutEv = true;
                  }
               });

            }
        }

        function _utilRgb2hex(rgb){
            rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
            return (rgb && rgb.length === 4) ? "#" +
                ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
                ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
                ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
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
        define('Block', ['d3'], Block);
    } else if ('undefined' !== typeof exports && 'undefined' !== typeof module) {
        module.exports = Block;
    } else {
        window.Block = Block;
    }

})(window, window.d3);
