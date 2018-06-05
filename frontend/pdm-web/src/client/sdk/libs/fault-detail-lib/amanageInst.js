(function(window, undefined) {

    var document = window.document,
        location = window.location,
        navigator = window.navigator,

        manageInst = function(name, global) {
            manageInst.instanceName = name;

            var notGlobal = true;
            if (global == false) notGlobal = false;

            if (manageInst.insMap[name] && notGlobal == true) {
                return manageInst.insMap[name];
            } else {
                return manageInst.fn.initialize(name);
            }
        };

    manageInst.insMap = {};
    manageInst.instanceName = "";
    manageInst.version = "1.0.0";

    manageInst.eventMap = {};

    manageInst.removeMap = {};

    /*** 인스턴스 생성과 확장 ***/
    manageInst.fn = {
        initialize: function(name) {
            manageInst.insMap[name] = this;
            return manageInst.insMap[name];
        },
        extendInitialize: function(key, obj, options) {
            var name = manageInst.instanceName;
            manageInst.insMap[name] = new obj(options);
            manageInst.insMap[name][key] = function(options) { manageInst.fn.extendInitialize(key, obj, options); };
            manageInst.insMap[name].instanceName = manageInst.instanceName;
        },
        extend: function(arg) {
            for (var key in arg) {
                manageInst.fn[key] = function(options) {
                    manageInst.fn.extendInitialize(key, arg[key], options);
                };
            }
        },
        removeIns: function(name) {
            delete manageInst.insMap[name];
            manageInst.removeMap[name] = name;
        }
    };

    manageInst.getRemoveIns = function(name) {
        return manageInst.removeMap[name];
    }

    /***********  Observer 패턴   ***********/
    manageInst.observer = function() {
        //this.subscribers = {};			// 관찰자 명단
    };

    manageInst.observer.prototype = {
        subscribers: {},
        subscribe: function(obj) { // 관찰자 등록 함수 ( id : 구분자, fn : 실행명령 )
            this.subscribers[obj.id] = obj.fn;
        },
        publish: function(obj) { // 발행자 실행 함수 (관찰자 명단에 등록된 모든 명령어들을 실행한다.) 
            for (var key in this.subscribers) {
                this.subscribers[key](obj);
            }
        },
        unsubscribe: function(id) { // 특정 관찰자를 지운다.  
            delete this.subscribers[id];
        },
        unsubscribeAll: function() { // 모든 관찰자를 지운다.  
            this.subscribers = {};
        }
    };

    /**
     * Title : manageInst.random() 함수는 영문과 숫자를 랜덤하게 조합하여 반환한다.
     * ex) var a = manageInst.random(4,"eng"); //a = "Avbs";
     * 
     * max : 얻고자하는 랜덤 갯수
     * type : "eng"-영문만, 입력하지 않으면 : 숫자만 
     */
    manageInst.random = function(max, type) {
        var i = 0,
            str = "",
            alphaDigit = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

        for (; i < max; i++) {
            if (type == "eng") { //eng : 영문만 출력, num : 숫자만 출력
                str += alphaDigit.substr(Math.floor(Math.random() * 54), 1);
            } else {
                str += Math.floor(Math.random() * 9);
            }
        }
        return str;
    };

    // create GUID
    manageInst.s4 = function() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    manageInst.newGuid = function() {
        return manageInst.s4() + manageInst.s4() + '-' + manageInst.s4() + '-' + manageInst.s4() + '-' + manageInst.s4() + '-' + manageInst.s4() + manageInst.s4() + manageInst.s4();
    }

    manageInst.setJqueryObj = function(obj) {
        if (typeof obj == "string") {
            return $(obj);
        } else if (obj == undefined) {
            return null;
        } else if (obj.setEl == undefined) {
            return obj;
        } else if (typeof obj.setEl == 'string') {
            return $(obj.setEl);
        } else {
            return obj.setEl;
        }
    };

    manageInst.remove = function(insname) {
        manageInst.fn.removeIns(insname);
    }

    /**
     * Title : Fisheye function (normal version)
     * How to use : chart = fisheye가 적용될 차트 type : d3.selection
     * 				isMotion = effect 여부 type : true|false
     * 				elementName = dot의 class name type :  string
     * 				radiusScale = mouse over 시 dot의 scale 조정여부 type : true|false
     */
    manageInst.addNormalFisheyeEvent = function(chart, isMotion, elementName, radiusScale) { //plotchart의 경우 fisheye기능을 추가할 수 있다. 단, 차트에서 data, axis와 dot를 참조할 수 있어야 한다.
        //참조할 항목 : xAxisWidth, yAxisHeight, ( x, y = function ),  ( xValue, yValue = function ) why? dot들이 data를 참조하기 때문이다.
        var that = chart;
        //rangePoints
        var xScale = d3.fisheye.scale(d3.scale.linear).domain([0, d3.max(that.data, that.xValue) + 1]).range([0, that.xAxisWidth]),
            yScale = d3.fisheye.scale(d3.scale.linear).domain([0, that.data.length]).range([that.yAxisHeight, 0]),
            axisStyle = that.axisStyleName || "scatter-axis";

        //핵심 domain설정을 해줘야 작동됨.
        xScale.domain([0, d3.max(that.data, that.xValue) + 1]);
        yScale.domain([0, d3.max(that.data, that.yValue) + 1]);

        var isRadiusScale = radiusScale;

        var fisheye = d3.fisheye.circular().focus([360, 90]).radius(100);

        // Positions the bars based on data.
        function barPosition(bar) {
            bar.attr("x", function(d, i) {
                return xScale(i);
            });
            bar.attr("width", function(d, i) {
                return xScale(i + 1) - xScale(i);
            })
        }

        //Positions the dots based on data.
        function position(dot) {
            dot.attr("cx", function(d) {
                    return xScale(that.x(d)); })
                .attr("cy", function(d) {
                    return yScale(that.y(d)); })
                .attr("r", function(d) {
                    var dotRadius = that.plotRadius;
                    var compareX = Math.abs(mouse[0] - (+xScale(that.x(d))));
                    var compareY = Math.abs(mouse[1] - (+yScale(that.y(d))));
                    var yArea = Math.round(that.yAxisHeight / 2);
                    if (compareX > 50 && compareY > yArea) {
                        dotRadius = that.plotRadius;
                    } else if ((compareX < 30 && compareX >= 0) &&
                        (compareY < yArea && compareY >= 0)) {
                        dotRadius = Math.round(that.plotRadius * 3.5);
                    } else if ((compareX <= 50 && compareX >= 30) &&
                        (compareY < yArea && compareY >= 0)) {
                        dotRadius = Math.round(that.plotRadius * 2.5);
                    }
                    return dotRadius;
                });
        };

        var xdistortion = 3;
        var ydistortion = that.xAxisWidth / that.yAxisHeight;
        var svg = d3.select(that.containEl),
            dot = svg.selectAll("." + that.sClassName + "." + elementName);
        var xAxis = d3.svg.axis().scale(xScale).orient("bottom").innerTickSize(-that.yAxisHeight).outerTickSize(0).tickPadding(10),
            yAxis = d3.svg.axis().scale(yScale).orient("left").innerTickSize(-that.xAxisWidth).outerTickSize(0).tickPadding(10).ticks(5);
        svg.on("mousemove", function() {
            var mouse = d3.mouse(this);
            xScale.distortion(xdistortion).focus(mouse[0]);
            yScale.distortion(ydistortion).focus(mouse[1]);
            svg.select("." + that.sClassName + ".x." + axisStyle).call(xAxis);
            var yaxis = svg.select("." + that.sClassName + ".y." + axisStyle).call(yAxis),
                ticks = yaxis.selectAll(".tick"),
                line = $(ticks[0][0]).children()[0];
            $(line).css("opacity", 0); //0번째 tick의 위치가 살짝 움직임에 따라 tick이 2px로 보여지는 현상이 있어 opacity를 0으로 셋팅해줌. 
            dot.call(position); //현재 데이터가 달라서 에러남
        });

        if (isMotion) {
            var motion = setInterval(fisheyeMotion, 10);
            var motionValue = 0;

            function fisheyeMotion() {
                motionValue = motionValue + 30;
                if (motionValue >= that.xAxisWidth) {
                    clearInterval(motion);
                    that.motionValue = 0;
                    return;
                }
                xScale.distortion(xdistortion).focus(motionValue);
                yScale.distortion(ydistortion).focus((that.yAxisHeight - 50));
                svg.select("." + that.sClassName + ".x." + axisStyle).call(xAxis);
                svg.select("." + that.sClassName + ".y." + axisStyle).call(yAxis);
                dot.call(position); //현재 데이터가 달라서 에러남
            }
        } else {
            xScale.distortion(xdistortion).focus(that.xAxisWidth / 2);
            yScale.distortion(ydistortion).focus((that.yAxisHeight - 50));
            svg.select("." + that.sClassName + ".x." + axisStyle).call(xAxis);
            svg.select("." + that.sClassName + ".y." + axisStyle).call(yAxis);
            dot.call(position);
        }
    };

    /**
     * Title : Fisheye function
     * How to use : chart = fisheye가 적용될 차트 type : d3.selection
     * 				isMotion = effect 여부 type : true|false
     * 				elementName = dot의 class name type :  string
     * 				radiusScale = mouse over 시 dot의 scale 조정여부 type : true|false
     */
    manageInst.addFisheyeEvent = function(chart, isMotion, elementName, radiusScale) { //plotchart의 경우 fisheye기능을 추가할 수 있다. 단, 차트에서 data, axis와 dot를 참조할 수 있어야 한다.
        //참조할 항목 : xAxisWidth, yAxisHeight, ( x, y = function ),  ( xValue, yValue = function ) why? dot들이 data를 참조하기 때문이다.
        var that = chart,
            mouse = [0, 0],
            mouseX = 0,
            mouseY = 0;
        //rangePoints
        var xScale = d3.fisheye.scale(d3.scale.linear).domain([0, d3.max(that.data, that.xValue) + 1]).range([0, that.xAxisWidth]),
            yScale = d3.fisheye.scale(d3.scale.linear).domain([0, that.data.length]).range([that.yAxisHeight, 0]),
            axisStyle = that.axisStyleName || "scatter-axis";
        //핵심 domain설정을 해줘야 작동됨.
        xScale.domain([0, d3.max(that.data, that.xValue) + 1]);
        yScale.domain([0, d3.max(that.data, that.yValue) + 1]);

        var isRadiusScale = radiusScale;

        //var fisheye = d3.fisheye.circular().focus([360, 90]).radius(100);

        // Positions the bars based on data.
        function barPosition(bar) {
            bar.attr("x", function(d, i) {
                return xScale(i);
            });
            bar.attr("width", function(d, i) {
                return xScale(i + 1) - xScale(i);
            })
        }

        //Positions the dots based on data.
        function position(dot) {
            if (mousemoveMode == "x") {
                dot.attr("cx", function(d) {
                    return xScale(that.x(d)); });
                if (isRadiusScale) {
                    dot.attr("r", function(d) {
                        var dotRadius = that.plotRadius;
                        var compareX = Math.abs(mouseX - (+xScale(that.x(d))));
                        if (compareX > 50) {
                            dotRadius = that.plotRadius;
                        } else if ((compareX < 30 && compareX >= 0)) {
                            dotRadius = Math.round(that.plotRadius * 2.5);
                        } else if ((compareX <= 50 && compareX >= 30)) {
                            dotRadius = Math.round(that.plotRadius * 1.5);
                        }
                        return dotRadius;
                    });
                }
            } else if (mousemoveMode == "both") {
                dot.attr("cx", function(d) {
                        return xScale(that.x(d)); })
                    .attr("cy", function(d) {
                        return yScale(that.y(d)); });
                if (isRadiusScale) {
                    radiusScaleHandler(dot);
                }
            } else {
                dot.attr("cy", function(d) {
                    return yScale(that.y(d)); });
                if (isRadiusScale) {
                    radiusScaleHandler(dot);
                }
            }
        };

        function radiusScaleHandler(dot) {
            dot.attr("r", function(d) {
                var dotRadius = that.plotRadius;
                var compareX = Math.abs(mouseX - (+xScale(that.x(d))));
                var compareY = Math.abs(mouseY - (+yScale(that.y(d))));
                var yArea = Math.round(that.yAxisHeight / 2);
                if (compareX > 50 && compareY > yArea) {
                    dotRadius = that.plotRadius;
                } else if ((compareX < 30 && compareX >= 0) &&
                    (compareY < yArea && compareY >= 0)) {
                    dotRadius = Math.round(that.plotRadius * 2.5);
                } else if ((compareX <= 50 && compareX >= 30) &&
                    (compareY < yArea && compareY >= 0)) {
                    dotRadius = Math.round(that.plotRadius * 1.5);
                }
                return dotRadius;
            });
        }

        var xdistortion = 3;
        var ydistortion = that.xAxisWidth / that.yAxisHeight;
        var mousemoveMode = "x";
        var svg = d3.select(that.containEl),
            dot = svg.selectAll("." + that.sClassName + "." + elementName);
        var backgroundXEl = svg.select("." + that.containEl.replace("#", "") + "-xaxis"), //해당 컨테이너의 아이디 뒤에 -xaxis가 붙는 rect를 찾아 move이벤트를 걸어준다.
            backgroundYEl = svg.selectAll("." + that.containEl.replace("#", "") + "-yaxis"); //해당 컨테이너의 아이디 뒤에 -yaxis가 붙는 rect를 찾아 move이벤트를 걸어준다.
        var xAxis = d3.svg.axis().scale(xScale).orient("bottom").innerTickSize(-that.yAxisHeight).outerTickSize(0).tickPadding(10).ticks(5),
            yAxis = d3.svg.axis().scale(yScale).orient("left").innerTickSize(-that.xAxisWidth).outerTickSize(0).tickPadding(10).ticks(3);
        if (backgroundXEl[0] != null) {
            backgroundXEl.on("mousemove", function() {
                mousemoveMode = "x";
                mouse = d3.mouse(this);
                mouseX = mouse[0];
                if (that.hasOwnProperty("mouseX")) {
                    that.mouseX = mouseX;
                }
                xScale.distortion(xdistortion).focus(mouseX);
                svg.select("." + that.sClassName + ".x." + axisStyle).call(xAxis);
                dot.call(position); //현재 데이터가 달라서 에러남
            });
        }

        if (backgroundYEl != null) {
            backgroundYEl.on("mousemove", function() {
                mousemoveMode = "y";
                mouse = d3.mouse(this);
                mouseY = mouse[1];
                if (that.hasOwnProperty("mouseY")) {
                    that.mouseY = mouseY;
                }
                yScale.distortion(ydistortion).focus(mouseY);
                var yaxis = svg.select("." + that.sClassName + ".y." + axisStyle).call(yAxis),
                    ticks = yaxis.selectAll(".tick"),
                    line = $(ticks[0][0]).children()[0];
                $(line).css("opacity", 0); //0번째 tick의 위치가 살짝 움직임에 따라 tick이 2px로 보여지는 현상이 있어 opacity를 0으로 셋팅해줌. 
                dot.call(position); //현재 데이터가 달라서 에러남
            });
        }

        if (isMotion) {
            var motion = setInterval(fisheyeMotion, 10);
            var motionValue = 0;

            function fisheyeMotion() {
                motionValue = motionValue + 30;
                if (motionValue >= that.xAxisWidth) {
                    clearInterval(motion);
                    that.motionValue = 0;
                    return;
                }
                xScale.distortion(xdistortion).focus(motionValue);
                yScale.distortion(ydistortion).focus((that.yAxisHeight - 50));
                svg.select("." + that.sClassName + ".x." + axisStyle).call(xAxis);
                svg.select("." + that.sClassName + ".y." + axisStyle).call(yAxis);
                dot.call(position); //현재 데이터가 달라서 에러남
            }
        } else {
            if (that.hasOwnProperty("mouseX")) {
                mouseX = that.mouseX;
                if (that.xAxisWidth < mouseX) {
                    mouseX = that.xAxisWidth - 10;
                }
            }
            if (that.hasOwnProperty("mouseY")) {
                mouseY = that.mouseY;
                if (that.yAxisHeight < mouseY) {
                    mouseY = that.yAxisHeight - 10;
                }
            }
            mousemoveMode = "both";
            xScale.distortion(xdistortion).focus(mouseX);
            yScale.distortion(ydistortion).focus(mouseY);
            svg.select("." + that.sClassName + ".x." + axisStyle).call(xAxis);
            svg.select("." + that.sClassName + ".y." + axisStyle).call(yAxis);
            dot.call(position);
        }
    };

    manageInst.addEvent = function(type, callback) {
        //jquery
        //$.inArray(value, array)
        if (manageInst.eventMap[type] == null) {
            manageInst.eventMap[type] = [];
        }
        var funcList = manageInst.eventMap[type];
        if ($.inArray(callback, funcList) == -1) {
            console.log("addEvent");
            funcList.push(callback);
        }
    };

    manageInst.dispatchEvent = function(type, obj) {
        if (manageInst.eventMap[type] == null)
            return;

        var funcList = manageInst.eventMap[type];
        for (var i = 0; i < funcList.length; i++) {
            funcList[i](obj);
        }
        //manageInst.eventMap[type](obj);
    };

    manageInst.removeEvent = function(type) {
        delete manageInst.eventMap[type];
    };

    /**
     * Title : mouseUpForRefresh function
     * How to use : document에 mouseup 이벤트로 resize를 해야할 경우
     * 				manageInst.mouseUpForRefresh( ".chart-div", 		refreshChart );
     * 												↑					  ↑
     * 									 refresh할 element id  	  refresh할 function
     */
    manageInst.mouseUpForRefresh = function(targetEl, refreshFn) {
        $(targetEl).resize(refreshChart);
        var isMouse = false;

        function refreshChart() {
            if (isMouse) {
                return;
            }
            //mouseup 발생시 refreshFn을 실행시킨다.
            $(document).bind("mouseup", mouseup); //jquery-ui.js 952 line => this.document.bind("mouseup."+ .....);
            isMouse = true;
        }

        function mouseup() {
            isMouse = false;
            setTimeout(refreshFn, 300);
            $(document).unbind("mouseup", mouseup);
        }
    };

    /**
     * Title : timerForRefresh function
     * How to use : target element를 timer로 체크하여 resize 해야할 경우
     * 				manageInst.timerForRefresh( ".chart-div", 		refreshChart );
     * 											↑					  ↑
     * 									refresh할 element id  	refresh할 function
     */
    manageInst.timerForRefresh = function(targetEl, refreshFn) {
        $(targetEl).resize(refreshChart);
        var targetResize = null;
        var orgWidth = $(targetEl).width();
        var orgHeight = $(targetEl).height();

        function refreshChart() {
            if (targetResize == null) { //size를 체크하는 타이머를 생성한다.
                targetResize = setInterval(checkSize, 300);
            }

            function checkSize() {
                var isWidthChange = false,
                    isHeightChange = false,
                    newWidth = $(targetEl).width(),
                    newHeight = $(targetEl).height();
                orgWidth == newWidth ? isWidthChange = true : orgWidth = newWidth;
                orgHeight == newHeight ? isHeightChange = true : orgHeight = newHeight;
                //변경된 사이즈를 계속 업데이트 치다가 변경이 없다 싶으면 최종 저장된 사이즈로 resizing한다.
                if (isWidthChange || isHeightChange) {
                    isWidthChange = false;
                    isHeightChange = false;
                    clearInterval(targetResize);
                    targetResize = null;
                    refreshFn();
                }
            }
        };

    }

    // 숫자 타입에서 쓸 수 있도록 format() 함수 추가
    Number.prototype.format = function() {
        if (this == 0) return 0;

        var reg = /(^[+-]?\d+)(\d{3})/;
        var n = (this + '');

        while (reg.test(n)) n = n.replace(reg, '$1' + ',' + '$2');

        return n;
    };

    // 문자열 타입에서 쓸 수 있도록 format() 함수 추가
    String.prototype.format = function() {
        var num = parseFloat(this);
        if (isNaN(num)) return "0";

        return num.format();
    };

    window.manageInst = manageInst;

}(this));
