(function (window, d3) {
    'use strict';

    var GaugeDonut = {
        // TODO set version (OPTION)
        version: "0.0.1",
        chart: {
            fn: Chart.prototype,
            internal: {
                fn: ChartInternal.prototype
            }
        }
    };

    var chart_fn = GaugeDonut.chart.fn,
        chart_internal_fn = GaugeDonut.chart.internal.fn;

    GaugeDonut.generate = function (config) {
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
        $$.values = $$.getDefaultValues();
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
        config.size_width = size.width;
        config.size_height = size.height;

        $$.draw(config, false);
    };

    chart_fn.load = function (data) {
        var $$ = this.internal,
            config = $$.config,
            that = $$.values;

        // TODO your coding area (OPTION)
        // .... load data and draw. It is option
        if (data == null) {
            return;
        }

        if (data[0] > data[1]) {
            //console.log('The value can not be greater than the goal');
            data[0] = data[1];
            // return;
        }
        if (data[0] === undefined) {
            //console.log('The value can not be undefined');
            return;
        }

        that.data = data;

        if (config.data_redrawing == 'start') {
            $$.draw(config, config.animate_on);
        } else {
            $$._setMarksData(that.data[0], that.data[1], that.data[2], config.animate_on);
        }
    }

    chart_fn.setStyle = function (targetClass, applyClass) {
        var $$ = this.internal,
            config = $$.config,
            that = $$.values;

        // TODO your coding area (OPTION)
        // .... resize and draw
        switch (targetClass) {
            case 'donut-marks-guideline':
                $(that.guideCircle.node).attr('class', applyClass);
                that.guideCircleStyle = applyClass;
                break;
            case 'donut-marks':
                $(that.marksCircle.node).attr('class', applyClass);
                that.marksCircleStyle = applyClass;
                break;
            case 'donut-marks-text':
                $(that.marksText.node).attr('class', applyClass);
                that.marksTextStyle = applyClass;
                break;
            default:
                console.log('Undefined target style');
                return;
        }
    }

    chart_fn.getStyle = function (targetClass) {
        var $$ = this.internal,
            config = $$.config,
            that = $$.values;

        // TODO your coding area (OPTION)
        var styleClass = '';

        switch (targetClass) {
            case 'donut-marks-guideline':
                styleClass = that.guideCircleStyle;
                break;
            case 'donut-marks':
                styleClass = that.marksCircleStyle;
                break;
            case 'donut-marks-text':
                styleClass = that.marksTextStyle;
                break;
            default:
                console.log('Undefined target style');
                return;
        }

        return styleClass;
    }

    chart_fn.selected = function () {
        var $$ = this.internal,
            config = $$.config,
            that = $$.values;

        // TODO release memory (OPTION)
        // ....
        return that.selected;
    }

    chart_fn.select = function () {
        var $$ = this.internal,
            config = $$.config,
            that = $$.values;

        // TODO release memory (OPTION)
        // set stroke Color and width
        var prevcolor = $(that.marksCircle.node).css('stroke'),
        newcolor = chartStyleUtil.colorLuminance( prevcolor, -0.2 );
        $(that.marksCircle.node).css('stroke', newcolor);
        $(that.marksCircle.node).attr('prevcolor', prevcolor);

        // set font style
        // $(that.marksText.node).children().css('fill', newcolor);
        $(that.marksText.node).children().css('font-weight', 'bold');

        // set background
        $(that.marksText.node).parent().css('background-color', '#eee');
        $(that.marksText.node).parent().css('border-radius', '50%');

        that.selected = true;

        // 재귀호출 무한루프 걸림..
        // (config.selector_onselected)(undefined, $$.api);
    }

    chart_fn.unselect = function () {
        var $$ = this.internal,
            config = $$.config,
            that = $$.values;

        // TODO release memory (OPTION)
        // set stroke Color and width
        var prevcolor = $(that.marksCircle.node).attr('prevcolor');
        $(that.marksCircle.node).css('stroke', prevcolor);

        // set font style
        $(that.marksText.node).children().css('fill', '#000000');
        $(that.marksText.node).children().css('font-weight', 'normal');

        // set background
        $(that.marksText.node).parent().css('background-color', '#fff');
        $(that.marksText.node).parent().css('border-radius', '');

        that.selected = false;

        // 재귀호출 무한루프 걸림..
        // (config.selector_onunselected)(undefined, $$.api);
    }

    chart_fn.destroy = function () {
        var $$ = this.internal,
            config = $$.config;

        // TODO release memory (OPTION)
        // ....
        if(config.data) {
            config.data = undefined;
        }
    }

    // internal fn : configuration, init
    chart_internal_fn.getDefaultConfig = function () {
        // TODO your coding area (OPTION)
        // you must set => <name>_<name>_<name>: value
        var config = {
            bindto: '#chart',
            size_width: '100%',
            size_height: '100%',
            animate_on: false,
            animate_timeToDrawPoints: 10,
            animate_completed: function() {},
            selector_on: false,
            selector_onselected: function() {},
            selector_onunselected: function() {},
            data_redrawing: 'start',
            data_onclick: function() {}
        };

        return config;
    }

    // internal fn : configuration, init
    chart_internal_fn.getDefaultValues = function () {
        // TODO your coding area (OPTION)
        // you must set => <name>_<name>_<name>: value
        var values = {
            data: null,
            paper: null,
            svg: null,
            width: 0,
            height: 0,
            radius: null,
            radius_padding: 10,
            xloc: null,
            yloc: null,
            guideCircle: null,
            marksCircle: null,
            marksText: null,
            chartLabel: null,
            guideCircleStyle: 'donut-marks-guideline',
            marksCircleStyle: 'donut-marks',
            marksTextStyle: 'donut-marks-text',
            selected: false
        };

        return values;
    }

    chart_internal_fn.init = function () {
        var $$ = this,
            config = $$.config;

        // TODO your coding area (OPTION)
        // ....
        $$.draw(config, config.animate_use);
    }

    ///////////////////////////////
    // TODO your coding area (MUST)
    // .... LINE TEST CODE
    chart_internal_fn.draw = function (config, animate) {
        var $$ = this,
            that = $$.values;

        $$._drawPaperSetting();

        var radius = (that.height < that.width) ? that.height/2 : that.width/2;

        that.xloc = radius;
        that.yloc = radius;
        that.radius = radius;
        that.radius_padding = radius/3;

        $$._drawGuideCircle();

        $$._drawMarksCircle();

        $$._drawMarksText();

        $$._drawLabel();

        $$._animateSetting();

        if (that.data != null) {
            $$._setMarksData(that.data[0], that.data[1], that.data[2], animate);
        }
    }

    chart_internal_fn._drawPaperSetting = function () {
        var $$ = this,
            config = $$.config,
            that = $$.values;

        if (that.svg) {
            that.svg.remove();
        }

        var diameter = (config.size_height < config.size_width) ? config.size_height : config.size_width;

        config.size_height = diameter;
        config.size_width = diameter;

        var paper = Raphael($(config.bindto).attr('id'), config.size_width, config.size_height);

        var svg = $(paper.canvas);

        that.paper = paper;
        that.svg = svg;
        that.width = svg.attr('width');
        that.height = svg.attr('height');

        paper.customAttributes.arc = function (xloc, yloc, value, total, R) {
            R -= that.radius_padding;

            var alpha = 360 / total * value,
                a = (90 - alpha) * Math.PI / 180,
                x = xloc + R * Math.cos(a),
                y = yloc - R * Math.sin(a),
                path;
            if (total == value) {
                path = [
                    ["M", xloc, yloc - R],
                    ["A", R, R, 0, 1, 1, xloc - 0.01, yloc - R]
                ];
            } else {
                path = [
                    ["M", xloc, yloc - R],
                    ["A", R, R, 0, +(alpha > 180), 1, x, y]
                ];
            }
            return {
                path: path
            };
        };
    }

    chart_internal_fn._drawGuideCircle = function () {
        var $$ = this,
            config = $$.config,
            that = $$.values;

        var guideCircle = that.paper.circle(that.xloc, that.yloc, that.radius-that.radius_padding);
        $(guideCircle.node).attr('class', that.guideCircleStyle);
        $(guideCircle.node).css('stroke-width', that.radius*(2/5)+'px');

        guideCircle.click(function(e) {
            chart_internal_fn.onclickSelector(e, $$);
        });

        that.guideCircle = guideCircle;
    }

    chart_internal_fn._drawMarksCircle = function () {
        var $$ = this,
            config = $$.config,
            that = $$.values;

        var marksCircle = that.paper.path().attr({
            arc: [that.xloc, that.yloc, 0, 100, that.radius]
        })
        $(marksCircle.node).attr('class', that.marksCircleStyle);
        $(marksCircle.node).css('stroke-width', that.radius*(2/5)+'px');
        //marksCircle.click(config.data_onclick);

        marksCircle.click(function(e) {
            chart_internal_fn.onclickSelector(e, $$);
        });

        that.marksCircle = marksCircle;
    }

    chart_internal_fn._drawMarksText = function () {
        var $$ = this,
            that = $$.values;

            //text in the middle
            var marksText = that.paper.text(that.xloc, that.yloc, "0%");
            // $(marksText.node).attr('class', that.marksTextStyle);
            $(marksText.node).css('font-size', that.radius*(3.5/10)+'px');

            that.marksText = marksText;
    }

    chart_internal_fn._drawLabel = function () {
        var $$ = this,
            that = $$.values;

            //text in the bottom
            var chartLabel = '';
            if($($$.config.bindto+' '+'.name').length > 0 ) {
               return;
            }
            that.chartLabel = chartLabel;
            $($$.config.bindto).append('<div class="name">'+that.chartLabel+'</div>');
    }

    chart_internal_fn._animateSetting = function () {
        var $$ = this,
            that = $$.values;

            //event fired on each animation frame
            eve.on("raphael.anim.frame.*", onAnimate);

            //on each animation frame we change the text in the middle
            function onAnimate() {
                var howMuch = that.marksCircle.attr("arc");
                that.marksText.attr("text", Math.floor(howMuch[2]) + "%");
            }
    }

    chart_internal_fn._setMarksData = function(_value, _goal, _name, animate) {
        var $$ = this,
            config = $$.config,
            that = $$.values;

        //the animated arc
        if (animate) {
            var delay = 0;
            if (config.data_redrawing == 'start') {
                delay = _value * config.animate_timeToDrawPoints;
            } else {
                delay = Math.abs(that.marksText.attr("text").slice(0,-1) - _value) * config.animate_timeToDrawPoints;
            }
            that.marksCircle.rotate(0, that.xloc, that.yloc).animate({
                arc: [that.xloc, that.yloc, _value, _goal, that.radius]
            }, delay, config.animate_completed);
        } else {
            that.marksCircle.attr({
                arc: [that.xloc, that.yloc, _value, 100, that.radius]
            });
            that.marksText.attr("text", Math.floor(_value) + "%");
            //하단 charName 적용
            that.chartLabel = _name;
            $(config.bindto+' .name').text(that.chartLabel);
        }

        if (that.selected) {    // 선택된 차트가 있으면 선택된 상태로 유지하기 위해 onselected api 호출
            (config.selector_onselected)(null, $$.api);
        }
    }

    chart_internal_fn.onclickSelector = function(e, $$) {
        var config = $$.config,
            that = $$.values;

        // (config.data_onclick)(e, this);

        if (config.selector_on) {
            that.selected = !that.selected;

            if (that.selected) {
                (config.selector_onselected)(e, $$.api);
            } else {
                (config.selector_onunselected)(e, $$.api);
            }
        }
        //‘stroke-opacity’
        //$(marksCircle.node).addClass('highlight');
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
        define('GaugeDonut', ['d3'], GaugeDonut);
    } else if ('undefined' !== typeof exports && 'undefined' !== typeof module) {
        module.exports = GaugeDonut;
    } else {
        window.GaugeDonut = GaugeDonut;
    }

})(window, window.d3);
