(function(manageInst, undefined) {
    /**
     * Title : Bar and Line chart Component
     * How to use : manageInst('barAndLineChart').barAndLineChart({ containEl : "#plotChart" });
     *                             ↑										↑
     *                  javascript instance name					chart config data
     * Required libraries : 
     * 						<script src="bower_components/jquery/dist/jquery.js">
     * 						<script src="bower_components/d3/d3.js">
     * 						<script src="scripts/lib/gridstack/jquery.resize.js">
     *     					<script src="scripts/lib/utils/manageInst.js">
     *   					<script src="scripts/lib/chart/barAndLineChart.js">
     *   
     * Description : 현재 bar multi는 구현이 안되어 있음. 하나만 됨. bar가 여러개가 추가 될 시에는 stacked, clusterd 형식으로 되어야 하기 때문.
     */

    var BarAndLineChart = function(options) {
        this._init(options);
    }

    BarAndLineChart.prototype = {
        _init: function(options) {
            var setObj = manageInst.setJqueryObj;
            //인자값 설정
            this.containEl = options.containEl || null; //chart가 그려질 컨테이너
            this.tooltipEl = options.tooltipEl || null; //tooltip을 출력할 경우 tooltip이 그려져야 하는 영역
            this.chartWidth = options.chartWidth || 800; //chart의 넓이
            this.chartHeight = options.chartHeight || 200; //chart의 높이
            this.backgroundColor = options.backgroundColor || "#fff"; //차트 배경색 지정
            this.lineColor = options.lineColor || "#ff0000"; //line색 지정
            this.barColor = options.barColor || "#ffff000"; //bar색 지정
            this.clickFn = options.clickFn || null; //item 클릭시 이벤트 desc : clickFn( selectedElement=선택한 객체, tipOptions=클릭 이벤트가 담긴 object );
            this.chartid = options.chartid || manageInst.newGuid(); //plotchart의 dot클릭시 unique아이디를 넘겨야 하기 때문에 생성
            this.backgroundClassName = options.backgroundClassName || "fdc-plus-background"; //차트 배경 스타일
            this.sClassName = options.sClassName || "fdc-plus"; //차트 전체의 스타일 명
            this.barClassName = options.barClassName || "fdc-plus-bar"; //bar의 스타일 명
            this.pointRadius = options.pointRadius || 2; //line item의 point radius
            this.pointPlusRadius = options.pointPlusRadius || 5; //마우스 오버시 line item의 point radius
            this.data = options.data || null; //차트의 데이터
            this.textClass = options.textClass || "fdc-plus-text";
            this.yaxisFontColor = options.yaxisFontColor || "#4d8fc7";
            this.yaxisFontColor2 = options.yaxisFontColor2 || that.yaxisFontColor2;
            this.xaxisTextClass = options.xaxisTextClass || "fdc-plus-xaxis-text"; //axis에 표현되는 text의 color
            this.yaxisTextClass = options.yaxisTextClass || "fdc-plus-yaxis-text"; //axis에 표현되는 text의 color
            this.yaxisTextClass2 = options.yaxisTextClass2 || "fdc-plus-yaxis2-text"; //axis에 표현되는 text의 color
            this.tooltipStyleName = options.tooltipStyleName || "fdc-plus-tooltip";
            this.isXAxisArrow = options.isXAxisArrow || false;
            this.isSampleData = options.isSampleData || false; //샘플 데이터 여부
            this.isGuideLine = options.isGuideLine || true; //guide line 여부
            this.isVerticalGrid = options.isVerticalGrid || false; //vertical grid line 여부
            this.isHorizontalGrid = options.isHorizontalGrid || true; //horizontal grid line 여부
            this.isEffect = options.isEffect || true; //effect 여부
            this.isDropShadow = options.isDropShadow || false; //shadow 여부
            this.xLabel = options.xLabel || "";
            this.yLabel = options.yLabel || "Fault";
            this.yLabel2 = options.yLabel2 || "OOC";
            //chart에 반영할 series 정보 
            this.seriesList = options.seriesList || [{ xField: "index", xLabelField: "label", xLabel: "Time", yField: "ocapCount", yLabel: "OCAP", type: "bar", style: "fdc-plus-bar", targetAxis: "left" },
                { xField: "index", xLabelField: "label", xLabel: "Time", yField: "faultCount", yLabel: "Fault", type: "line", style: "fdc-plus-line-fault", pointStyle: "fdc-plus-line-fault-point", targetAxis: "left" },
                { xField: "index", xLabelField: "label", xLabel: "Time", yField: "oocCount", yLabel: "OOC", type: "line", style: "fdc-plus-line-ooc", pointStyle: "fdc-plus-line-ooc-point", targetAxis: "right" }
            ];
            this.isSecondAxis = options.isSecondAxis || true; //second axis 여부
            this.tooltipHtml = options.tooltipHtml || null;
            //인자값이 아닌 차트 설정값.
            var that = this;
            //==============차트의 Axis를 컨트롤하기 위한 차트의 맴버변수 설정============//
            this.svg = null;
            this.axisLabelMargin = 13;
            this.axisLabelMarginX = 13; //axis 라벨 x 여백
            this.axisLabelMarginY = -15; //axis 라벨 y 여백
            this.margin = { top: 10, right: 45, bottom: 45, left: 45 };
            this.yaxisStyleName = options.yaxisStyleName || "fdc-plus-yaxis"; //y축 스타일 명 
            this.yaxisStyleName2 = options.yaxisStyleName2 || "fdc-plus-yaxis2"; //second y축 스타일명 
            this.xaxisStyleName = options.xaxisStyleName || "fdc-plus-xaxis"; //x축 스타일
            this.drawingWidth = this.chartWidth;
            this.drawingHeight = this.chartHeight;
            this.xScale = null;
            this.xAxis = null;
            this.yScale = null;
            this.yAxis = null;
            this.yAxisTicks = options.yAxisTicks || 3;
            this.yScale2 = null;
            this.yAxis2 = null;
            this.yAxisTicks2 = options.yAxisTicks2 || 3;
            this.horizontalGridAxis = null;
            this.verticalGridAxis = null;
            this.isChange = false; //change 여부
            this.guideLineY = 50; //guide line의 Y 좌표
            this.arrowX = 0; //x axis의 arrow x
            this.barPadding = 3; //bar series padding
            this.isAppend = false; //데이터 사이즈가 달라 데이터 추가 및 삭제 여부.
            this.guideSelectedIndex = -1;
            this.periodType = "SHIFT";
            this.isMinus = false;
            this.selectItemWidth = 100;
            this.selectItemHeight = 90;
            //==============차트의 Axis를 컨트롤하기 위한 차트의 맴버변수 설정============//
            this.removeView(); //내용 삭제.
            if (this.isSampleData) { //get sample Data
                this._setSampleData();
            }
            this._isCreation = false;
            this.removeView();
            this._bindEvent();
            this._drawChar();
            if (that.tooltipHtml) {
                $(that.tooltipEl).append(that.tooltipHtml);
            }
            //that.refresh(that);
        },
        _bindEvent: function() { //각각의 정의된 이벤트를 바인딩 한다.
            var that = this;
            //$(that.tooltipEl).resize( refreshChart );
            manageInst.timerForRefresh(that.tooltipEl, refreshChart); //resize이벤트를 등록
            //var lazyLayout = _.debounce(refreshChart, 200);
            //$(that.tooltipEl).resize(lazyLayout);
            var isFirst = true;

            function refreshChart() {
                //		    	console.log("refreshChart ==> isFirst : "+isFirst);
                //		    	if( isFirst ){
                //		    		isFirst = false;
                //		    		return;
                //		    	}
                that.refresh(that);
            }
        },
        _setSampleData: function() { //샘플 데이터 셋팅.

            function randomValue(numValue) {
                return Math.round(Math.random() * numValue);
            }
            var that = this;
            that.data = [
                { index: 0, label: 's1', faultCount: 12, oocCount: 15, ocapCount: 5, summaryId: "2015-07-01", from: 123456000, to: 123457000 }, { index: 1, label: 's2', faultCount: 13, oocCount: 17, ocapCount: 4, summaryId: "2015-07-02", from: 123456000, to: 123457000 }, { index: 2, label: 's3', faultCount: 14, oocCount: 19, ocapCount: 6, summaryId: "2015-07-03", from: 123456000, to: 123457000 }, { index: 3, label: 's4', faultCount: 15, oocCount: 21, ocapCount: 7, summaryId: "2015-07-04", from: 123456000, to: 123457000 }, { index: 4, label: 's5', faultCount: 18, oocCount: 19, ocapCount: 7, summaryId: "2015-07-05", from: 123456000, to: 123457000 }, { index: 5, label: 's6', faultCount: 10, oocCount: 12, ocapCount: 8, summaryId: "2015-07-06", from: 123456000, to: 123457000 }, { index: 6, label: 's7', faultCount: 9, oocCount: 11, ocapCount: 6, summaryId: "2015-07-07", from: 123456000, to: 123457000 }, { index: 7, label: 's8', faultCount: 7, oocCount: 8, ocapCount: 4, summaryId: "2015-07-08", from: 123456000, to: 123457000 }, { index: 8, label: 's9', faultCount: 5, oocCount: 7, ocapCount: 4, summaryId: "2015-07-09", from: 123456000, to: 123457000 }, { index: 9, label: 's10', faultCount: 4, oocCount: 6, ocapCount: 3, summaryId: "2015-07-10", from: 123456000, to: 123457000 }, { index: 10, label: 's11', faultCount: 6, oocCount: 5, ocapCount: 4, summaryId: "2015-07-11", from: 123456000, to: 123457000 }, { index: 11, label: 's12', faultCount: 2, oocCount: 4, ocapCount: 1, summaryId: "2015-07-12", from: 123456000, to: 123457000 }, { index: 12, label: 's13', faultCount: 14, oocCount: 19, ocapCount: 10, summaryId: "2015-07-13", from: 123456000, to: 123457000 }, { index: 13, label: 's14', faultCount: 15, oocCount: 21, ocapCount: 11, summaryId: "2015-07-14", from: 123456000, to: 123457000 }, { index: 14, label: 's15', faultCount: 18, oocCount: 19, ocapCount: 15, summaryId: "2015-07-15", from: 123456000, to: 123457000 }, { index: 15, label: 's16', faultCount: 10, oocCount: 12, ocapCount: 8, summaryId: "2015-07-16", from: 123456000, to: 123457000 }, { index: 16, label: 's17', faultCount: 9, oocCount: 11, ocapCount: 7, summaryId: "2015-07-17", from: 123456000, to: 123457000 }, { index: 17, label: 's18', faultCount: 7, oocCount: 8, ocapCount: 6, summaryId: "2015-07-18", from: 123456000, to: 123457000 }, { index: 18, label: 's19', faultCount: 5, oocCount: 7, ocapCount: 4, summaryId: "2015-07-19", from: 123456000, to: 123457000 }, { index: 19, label: 's20', faultCount: 4, oocCount: 6, ocapCount: 3, summaryId: "2015-07-20", from: 123456000, to: 123457000 }, { index: 20, label: 's21', faultCount: 6, oocCount: 5, ocapCount: 4, summaryId: "2015-07-21", from: 123456000, to: 123457000 }, { index: 21, label: 's22', faultCount: 2, oocCount: 4, ocapCount: 1, summaryId: "2015-07-22", from: 123456000, to: 123457000 }
            ];
        },
        refresh: function(target) { //해당 remove 하고 화면을 다시 그려준다. data는 가져오지 않는다.
            //console.log("refresh");
            var that = this;
            that.isChange = true;
            //size setting
            that._setSize();
            //axis scale size re setting
            that._makeAxis();
            var width = that.drawingWidth,
                height = that.drawingHeight,
                texts = null;
            //svg resize
            var svg = that.svg
                .attr("width", width + that.margin.left + that.margin.right)
                .attr("height", height + that.margin.top + that.margin.bottom);
            var backgroundGroup = svg.select("." + that.tooltipEl.replace("#", "") + "-background")
                .attr("transform", "translate(" + that.margin.left + "," + that.margin.top + ")");
            backgroundGroup.select("rect")
                .attr("width", width)
                .attr("height", height);
            // x-axis
            texts = svg.select("." + that.sClassName + ".x." + that.xaxisStyleName)
                .attr("transform", "translate(1," + height + ")")
                .call(that.xAxis)
                .selectAll("text")
                .data(that.data)
                .text(function(d) {
                    //시간단위로 출력시 labelRotate 이 0보다 크면 시간에 날짜를 더해서 출력한다.
                    var returnValue = d["label"];
                    var tempTxt = "" + d["summaryId"];
                    if (that.periodType == 'HOUR') {
                        returnValue = "" + d["summaryId"];
                        returnValue = returnValue.substring(4, 8) + " " + d["label"];
                    } else if (that.periodType == 'WEEK' || that.periodType == 'MONTH') {
                        returnValue = tempTxt.substring(0, 4) + " " + d["label"];
                    } else if (that.periodType == 'DAY') {
                        returnValue = tempTxt.substring(4, 6) + " " + d["label"];
                    } else {

                    }
                    return returnValue;
                })
                .call(that._wrap, that.xScale.rangeBand(), that.periodType);
            //						   .attr("x", that.xScale.rangeBand())
            //						   .attr("transform", function (d) {
            //							   return "rotate("+0+")";
            //					   	 	});
            svg.select("." + that.xaxisTextClass)
                .attr("x", width + 30)
                .attr("y", 30);
            // y-axis
            texts = svg.select("." + that.sClassName + ".y." + that.yaxisStyleName)
                .attr("transform", "translate(0,0)")
                .call(that.yAxis);
            that._lastLabelHidden(texts, that.yaxisFontColor);
            svg.select("." + that.yaxisTextClass)
                .attr("x", -1)
                .attr("y", -9);
            if (that.isSecondAxis) {
                // y-axis2
                texts = svg.select("." + that.sClassName + ".y." + that.yaxisStyleName2)
                    .attr("transform", "translate(" + (width) + ",0)")
                    .call(that.yAxis2);
                svg.select("." + that.yaxisTextClass2)
                    .attr("x", 26)
                    .attr("y", -9);
                that._lastLabelHidden(texts, that.yaxisFontColor2);
            }
            //guide line update
            svg.select(".line-guideline")
                .attr("x1", 0)
                .attr("y1", that.selectItemHeight - 5)
                .attr("x2", 0)
                .attr("y2", height)
                .style('opacity', 0);
            svg.select(".guide-circle-group")
                //.attr("transform", function(d){return "translate("+0+","+(that.guideLineY/2)+")"});
                .attr("transform", function(d) {
                    return "translate(" + 0 + "," + 15 + ")" });
            //grid line update
            var gridg = svg.select("g.grid-line-group");
            gridg.attr("transform", "translate(" + that.margin.left + "," + that.margin.top + ")");
            if (that.isHorizontalGrid) {
                that.horizontalGridAxis.scale(that.yScale).tickSize(-(that.drawingWidth), 0, 0);
                var hgridgroup = svg.select("." + that.sClassName + "-grid.horizontal")
                    .call(that.horizontalGridAxis);
                //첫번째 라인을 안보이게 한다.
                var firstTick = hgridgroup.selectAll("g.tick")[0][0];
                d3.select(firstTick).style("opacity", 0);
            }
            if (that.isVerticalGrid) {
                that.verticalGridAxis.scale(that.xScale).tickSize(-(that.drawingHeight - that.margin.top - that.margin.bottom), 0, 0);
                svg.select("." + that.sClassName + "-grid.vertical")
                    .attr("transform", "translate(0," + (that.drawingHeight) + ")")
                    .call(that.verticalGridAxis);
            }
            //position setting
            for (var i = 0; i < that.seriesList.length; i++) {
                if (that.seriesList[i].type == "line") {
                    lineReposition(that.seriesList[i]);
                } else {
                    barReposition(that.seriesList[i]);
                }
            }
            //bar update
            function barReposition(info) {
                svg.selectAll("." + info.style).call(barReposition);
                svg.selectAll("." + info.style + "-guide").call(guideBarReposition);

                function barReposition(bar) { //막대 차트 위치 수정.
                    var targetyScale = (info.targetAxis == "left" ? that.yScale : that.yScale2);
                    bar.attr("x", function(d, i) {
                            var xrange = that.xScale.range()[i];
                            var returnValue = that.barPadding + xrange;
                            if (isNaN(returnValue)) {
                                returnValue = 0;
                            }
                            return returnValue;
                        })
                        .attr("width", function(d, i) {
                            var returnValue = that.xScale.rangeBand() - that.barPadding;
                            if (isNaN(returnValue) || returnValue < 0) {
                                returnValue = 0;
                            }
                            return returnValue;
                        })
                        //.attr("y", function(d) { return targetyScale(d[info.yField])+that.margin.top-1; })
                        .attr("y", function(d) {
                            return targetyScale(d[info.yField]) + that.margin.top; })
                        .attr("height", function(d) {
                            return height - targetyScale(d[info.yField]); });
                }

                function guideBarReposition(bar) { //가이드 라인 위치 수정.
                    bar.attr("x", function(d, i) {
                            var xrange = that.xScale.range()[i];
                            var returnValue = that.barPadding + xrange;
                            if (isNaN(returnValue)) {
                                returnValue = 0;
                            }
                            if (that.guideSelectedIndex == i) {
                                var tempWidth = that.xScale.rangeBand() - that.barPadding;
                                var position = +returnValue + (tempWidth / 2);
                                selectGuideBarReposition(position);
                            }
                            return returnValue;
                        })
                        .attr("width", function(d, i) {
                            var returnValue = that.xScale.rangeBand() - that.barPadding;
                            if (isNaN(returnValue) || returnValue < 0) {
                                returnValue = 0;
                            }
                            return returnValue;
                        })
                        .attr("y", 0)
                        .attr("height", height);
                }

                function selectGuideBarReposition(position) { //선택된 툴팁 위치 수정.
                    svg.select(".select-line-guideline")
                        .attr("x1", position)
                        //.attr("y1", that.guideLineY)
                        .attr("y1", that.selectItemHeight - 5)
                        .attr("x2", position)
                        .attr("y2", height);
                    svg.select(".select-guide-circle-group")
                        .attr("transform", function(d) {
                            return "translate(" + position + "," + 15 + ")" });
                    //.attr("transform", function(d){return "translate("+position+","+(that.guideLineY/2)+")"});
                }
            }
            //line update
            function lineReposition(info) {
                var targetyScale = (info.targetAxis == "left" ? that.yScale : that.yScale2);
                var groupLeft = that.xScale.rangeBand() / 2;
                var line = d3.svg.line()
                    .x(function(d) {
                        var returnValue = that.xScale(d[info.xField]);
                        if (isNaN(returnValue)) {
                            returnValue = 0;
                        }
                        return returnValue;
                    })
                    .y(function(d) {
                        return targetyScale(d[info.yField]);
                    });
                var LineGroup = svg.select("." + info.style + "-group");
                LineGroup.attr("transform", "translate(" + (that.margin.left + groupLeft) + "," + that.margin.top + ")");
                LineGroup.select("path")
                    .attr("x", that.margin.left)
                    .attr("d", line);
                var xMap = function(d) {
                        return that.xScale(d[info.xField]); },
                    yMap = function(d) {
                        return targetyScale(d[info.yField]); }; // data -> display
                var dotGroup = svg.select("." + info.style + "-circle-group");
                dotGroup.attr("transform", "translate(" + (that.margin.left + groupLeft) + "," + that.margin.top + ")");
                dotGroup.selectAll("." + info.pointStyle)
                    .attr("cx", xMap)
                    .attr("cy", yMap);
            }
            if (that.isMinus) {
                that.isMinus = false;
                that.refresh();
            }
        },
        removeView: function() {
            var that = this;
            $(that.containEl).empty(); //내용 삭제.
            var tooltips = $(that.tooltipEl).find("div." + that.sClassName + ".tooltip");
            tooltips.remove();
        },
        setData: function(data) { //data를 인자로 받아 chart를 다시 그린다.
            var that = this;
            that.isAppend = false;
            if (that.isSampleData) {
                that._setSampleData();
            } else {
                if (that.data.length != data.length) {
                    isAppend = true;
                }
                that.data = data;
            }
            that._setSize();
            that._makeAxis();
            that._axisUpdate();
            var gridg = that.svg.select("g.grid-line-group");
            gridg.attr("transform", "translate(" + that.margin.left + "," + that.margin.top + ")");
            that._seriesUpdate();
        },
        _seriesUpdate: function() {
            var that = this;
            if (that.seriesList == null ||
                that.seriesList.length == 0) {
                //not update chart
                return;
            }
            //series list에 설정된 정보대로 series update
            for (var i = 0; i < that.seriesList.length; i++) {
                if (that.seriesList[i].type == "bar") {
                    that._drawBarSeries(that.seriesList[i]);
                } else if (that.seriesList[i].type == "line") {
                    that._drawLineSeries(that.seriesList[i]);
                }
            }
            if (that.isGuideLine) {
                that._guideLineBarUpdate();
            }
        },
        _axisUpdate: function() {
            var that = this;
            that.svg.select("g." + that.sClassName + ".x." + that.xaxisStyleName).remove();
            that.svg.select("g." + that.sClassName + ".y." + that.yaxisStyleName).remove();
            that.svg.select("g." + that.sClassName + ".y." + that.yaxisStyleName2).remove();
            that._drawAxis();
            //grid line update
            if (that.isHorizontalGrid) {
                that.horizontalGridAxis.scale(that.yScale).tickSize(-(that.drawingWidth), 0, 0);
                var hgridgroup = that.svg.select("." + that.sClassName + "-grid.horizontal")
                    .call(that.horizontalGridAxis);
                //첫번째 라인을 안보이게 한다.
                var firstTick = hgridgroup.selectAll("g.tick")[0][0];
                d3.select(firstTick).style("opacity", 0);
            }
            if (that.isVerticalGrid) {
                that.verticalGridAxis.scale(that.xScale).tickSize(-(that.drawingHeight - that.margin.top - that.margin.bottom), 0, 0);
                that.svg.select("." + that.sClassName + "-grid.vertical")
                    .attr("transform", "translate(0," + (that.drawingHeight) + ")")
                    .call(that.verticalGridAxis);
            }

            // x-axis
            var width = that.drawingWidth,
                height = that.drawingHeight,
                texts = null;
            var svg = that.svg
                .attr("width", width + that.margin.left + that.margin.right)
                .attr("height", height + that.margin.top + that.margin.bottom);
            var backgroundGroup = svg.select("." + that.tooltipEl.replace("#", "") + "-background")
                .attr("transform", "translate(" + that.margin.left + "," + that.margin.top + ")");
            backgroundGroup.select("rect")
                .attr("width", width)
                .attr("height", height);
            texts = svg.select("." + that.sClassName + ".x." + that.xaxisStyleName)
                .attr("transform", "translate(1," + height + ")")
                .call(that.xAxis)
                .selectAll("text")
                .data(that.data)
                .text(function(d) {
                    //시간단위로 출력시 labelRotate 이 0보다 크면 시간에 날짜를 더해서 출력한다.
                    var returnValue = d["label"];
                    var tempTxt = "" + d["summaryId"];
                    if (that.periodType == 'HOUR') {
                        returnValue = "" + d["summaryId"];
                        returnValue = returnValue.substring(4, 8) + " " + d["label"];
                    } else if (that.periodType == 'WEEK' || that.periodType == 'MONTH') {
                        returnValue = tempTxt.substring(0, 4) + " " + d["label"];
                    } else if (that.periodType == 'DAY') {
                        returnValue = tempTxt.substring(4, 6) + " " + d["label"];
                    } else {

                    }
                    return returnValue;
                })
                .call(that._wrap, that.xScale.rangeBand(), that.periodType);
            //					   .attr("x", that.xScale.rangeBand())
            //					   .attr("transform", function (d) {
            //						   return "rotate("+0+")";
            //				   	 	});
            svg.select("." + that.xaxisTextClass)
                .attr("x", width + 30)
                .attr("y", 30);
            // y-axis
            texts = svg.select("." + that.sClassName + ".y." + that.yaxisStyleName)
                .attr("transform", "translate(0,0)")
                .call(that.yAxis);
            that._lastLabelHidden(texts, that.yaxisFontColor);
            svg.select("." + that.yaxisTextClass)
                .attr("x", -1)
                .attr("y", -9);
            if (that.isSecondAxis) {
                // y-axis2
                texts = svg.select("." + that.sClassName + ".y." + that.yaxisStyleName2)
                    .attr("transform", "translate(" + (width) + ",0)")
                    .call(that.yAxis2);
                svg.select("." + that.yaxisTextClass2)
                    .attr("x", 26)
                    .attr("y", -9);
                that._lastLabelHidden(texts, that.yaxisFontColor2);
            }
        },
        _guideLineBarUpdate: function() {
            var that = this;
            that.svg.select(".guide-bar-group").remove();
            that._drawGuide();
        },
        _setSize: function() { //size setting
            //사이즈 설정
            var that = this;
            if ($(that.tooltipEl).width() <= 0) {

            } else {
                that.chartWidth = $(that.tooltipEl).width();
            }
            if ($(that.tooltipEl).height() <= 0) {

            } else {
                that.chartHeight = $(that.tooltipEl).height();
            }
            //console.log("width : "+that.chartWidth+"  , height : "+that.chartHeight);
            var compareField = that.seriesList[1].yField,
                maxValue = d3.max(that.data, function(d) {
                    return d[compareField]; }),
                marginLeft = that.margin.left,
                marginRight = that.margin.right;
            if (maxValue >= 10000) {
                marginLeft = (10 * maxValue.toString().length);
            }
            compareField = that.seriesList[2].yField;
            maxValue = d3.max(that.data, function(d) {
                return d[compareField]; });
            if (maxValue >= 10000) {
                marginRight = (10 * maxValue.toString().length);
            }
            that.periodType = that.data[0]["periodType"];
            that.margin.left = marginLeft; //수치에 따라 여백을 설정하기 위함.
            that.margin.right = marginRight;
            that.drawingWidth = that.chartWidth - that.margin.left - that.margin.right,
                that.drawingHeight = that.chartHeight - that.margin.top - that.margin.bottom;
        },
        _makeAxis: function(init) { //axis make
            var that = this;
            var width = that.drawingWidth,
                height = that.drawingHeight;
            // setup x
            if (that.xScale == null) {
                //that.xScale = d3.scale.linear();
                that.xScale = d3.scale.ordinal();
            }
            if (that.xAxis == null) {
                that.xAxis = d3.svg.axis();
            }
            //that.xScale.rangeRoundBands([0, width+that.arrowX], .15, 0);//, that.barPadding
            that.xScale.domain(d3.range(that.data.length)).rangeBands([0, width - 2 + that.arrowX]);
            //that.xScale.rangeRoundBands([0, width+that.arrowX]);//, that.barPadding
            if (init) {
                that.xAxis.scale(that.xScale).orient("bottom").tickPadding(2).innerTickSize(5).outerTickSize(0).ticks(0);
            } else {
                that.xAxis.scale(that.xScale);
            }
            // setup y
            if (that.yScale == null) {
                that.yScale = d3.scale.linear();
            }
            if (that.yAxis == null) {
                that.yAxis = d3.svg.axis();
            }
            that.yScale.range([height, 0]);
            if (init) {
                that.yAxis.scale(that.yScale).orient("left").outerTickSize(0).ticks(that.yAxisTicks); //.innerTickSize(-width)
            } else {
                that.yAxis.scale(that.yScale);
            }
            if (that.isSecondAxis) {
                if (that.yScale2 == null) {
                    that.yScale2 = d3.scale.linear();
                }
                if (that.yAxis2 == null) {
                    that.yAxis2 = d3.svg.axis();
                }
                that.yScale2.range([height, 0]);
                if (init) {
                    that.yAxis2.scale(that.yScale2).orient("right").outerTickSize(0).ticks(that.yAxisTicks2); //.innerTickSize(-width)
                } else {
                    that.yAxis2.scale(that.yScale2);
                }
            }
        },
        _drawDropShadow: function() {
            // filters go in defs element
            var that = this;
            var defs = that.svg.append("defs");

            // create filter with id #drop-shadow
            // height=130% so that the shadow is not clipped
            var filter = defs.append("filter")
                .attr("id", "fault-detail-drop-shadow")
                .attr("height", "130%");

            // SourceAlpha refers to opacity of graphic that this filter will be applied to
            // convolve that with a Gaussian with standard deviation 3 and store result
            // in blur
            filter.append("feGaussianBlur")
                .attr("in", "SourceAlpha")
                .attr("stdDeviation", 2)
                .attr("result", "blur");

            // translate output of Gaussian blur to the right and downwards with 2px
            // store result in offsetBlur
            filter.append("feOffset")
                .attr("in", "blur")
                .attr("dx", 2)
                .attr("dy", -2)
                .attr("result", "offsetBlur");

            // overlay original SourceGraphic over translated blurred opacity by using
            // feMerge filter. Order of specifying inputs is important!
            var feMerge = filter.append("feMerge");
            feMerge.append("feMergeNode")
                .attr("in", "offsetBlur")
            feMerge.append("feMergeNode")
                .attr("in", "SourceGraphic");
        },
        _lineDrawDropShadow: function() {
            // filters go in defs element
            var that = this;
            var defs = that.svg.append("defs");
            // create filter with id #drop-shadow
            // height=130% so that the shadow is not clipped
            var filter = defs.append("filter")
                .attr("id", "fault-detail-line-drop-shadow")
                .attr("height", "100%");
            // SourceAlpha refers to opacity of graphic that this filter will be applied to
            // convolve that with a Gaussian with standard deviation 3 and store result
            // in blur
            filter.append("feGaussianBlur")
                .attr("in", "SourceAlpha")
                .attr("stdDeviation", 2)
                .attr("result", "blur");

            // translate output of Gaussian blur to the right and downwards with 2px
            // store result in offsetBlur
            filter.append("feOffset")
                .attr("in", "blur")
                .attr("dx", 1)
                .attr("dy", 1)
                .attr("result", "offsetBlur");

            // overlay original SourceGraphic over translated blurred opacity by using
            // feMerge filter. Order of specifying inputs is important!
            var feMerge = filter.append("feMerge");
            feMerge.append("feMergeNode")
                .attr("in", "offsetBlur")
            feMerge.append("feMergeNode")
                .attr("in", "SourceGraphic");
        },
        _drawGridLine: function() {
            var that = this;
            var gridg = that.svg.select("g.grid-line-group");
            gridg.attr("transform", "translate(" + that.margin.left + "," + that.margin.top + ")");
            if (that.isVerticalGrid) {
                that.verticalGridAxis = d3.svg.axis().scale(that.xScale)
                    .orient("bottom")
                    .tickSize(-(that.drawingHeight - that.margin.top - that.margin.bottom), 0, 0)
                    .tickFormat("");
                gridg.insert("g")
                    .attr("class", that.sClassName + "-grid vertical")
                    .attr("transform", "translate(0," + (that.drawingHeight) + ")")
                    .call(that.verticalGridAxis);
            }
            if (that.isHorizontalGrid) {
                that.horizontalGridAxis = d3.svg.axis().scale(that.yScale)
                    .orient("left")
                    .ticks(that.yAxisTicks)
                    .tickSize(-(that.drawingWidth), 0, 0)
                    .tickFormat("");
                var hgridgroup = gridg.insert("g")
                    .attr("class", that.sClassName + "-grid horizontal")
                    .call(that.horizontalGridAxis);
                //첫번째 라인을 안보이게 한다.
                var firstTick = hgridgroup.selectAll("g.tick")[0][0];
                d3.select(firstTick).style("opacity", 0);
            }
        },
        _drawBarSeries: function(info, init) { //init은 그려져 있는지 여부 
            var that = this,
                width = that.drawingWidth,
                height = that.drawingHeight,
                barGroup = null,
                bars = null,
                barinfo = info;
            //실제 데이터를 표현하는 바를 그려준다.
            if (init) {
                barGroup = that.svg.append("g")
                    .attr("class", "fault-detail-sum-bars")
                    .attr("transform", "translate(" + (that.margin.left) + "," + 0 + ")");
            } else {
                barGroup = that.svg.select(".fault-detail-sum-bars")
                    .attr("transform", "translate(" + (that.margin.left) + "," + 0 + ")");
            }
            bars = barGroup.selectAll("." + info.style).data(that.data);
            bars.enter().append("rect")
                .attr("class", info.style)
                .attr("x", function(d, i) {
                    var xrange = that.xScale.range()[i];
                    var returnValue = that.barPadding + xrange;
                    if (isNaN(returnValue)) {
                        returnValue = 0;
                    }
                    return returnValue;
                })
                .attr("width", function() {
                    var returnValue = that.xScale.rangeBand() - that.barPadding;
                    if (isNaN(returnValue) || returnValue < 0) {
                        returnValue = 0;
                    }
                    return returnValue;
                })
                //.attr("y", height-1)
                .attr("y", height)
                .attr("height", 0)
                .attr("xField", info.yField)
                .attr("yField", info.yField)
                .attr("targetAxis", info.targetAxis)
                .attr("value", function(d) {
                    return d[info.yField]; });
            if (!init) {
                bars.exit().remove();
                //.transition().duration(100).ease("exp").attr("width", 0).attr("y", height).remove();
            }
            if (that.isDropShadow) {
                bars.style("filter", "url(#fault-detail-drop-shadow)");
            }

            setTimeout(effectStart, 500);

            //effect start
            function effectStart() {
                var targetScale = (barinfo.targetAxis == "left" ? that.yScale : that.yScale2);
                bars.transition().delay(function(d, i) {
                        var returnValue = 0; //100
                        //					if( init ){
                        //						returnValue = i * 20;
                        //					}
                        //					if( that.drawingWidth < 50 ){
                        //						returnValue = 0;
                        //					}
                        return returnValue;
                    }).duration(function(d) {
                        var returnValue = 100;
                        if (!init) {
                            returnValue = 500;
                        }
                        return returnValue;
                    })
                    .attr("x", function(d, i) {
                        var xrange = that.xScale.range()[i];
                        var returnValue = that.barPadding + xrange;
                        if (isNaN(returnValue)) {
                            returnValue = 0;
                        }
                        return returnValue;
                    })
                    .attr("width", function() {
                        var returnValue = that.xScale.rangeBand() - that.barPadding;
                        if (isNaN(returnValue) || returnValue < 0) {
                            returnValue = 0;
                        }
                        return returnValue;
                    })
                    .attr("y", function(d, i) {
                        //var returnValue = targetScale(d[barinfo.yField])+that.margin.top-1;
                        var returnValue = targetScale(d[barinfo.yField]) + that.margin.top;
                        return returnValue;
                    })
                    .attr("height", function(d, i) {
                        var returnValue = height - targetScale(d[barinfo.yField]);
                        //console.log("bar height : "+returnValue);
                        if (returnValue < 0) {
                            returnValue = 0;
                            that.isMinus = true;
                        } else {
                            that.isMinus = false;
                        }
                        return returnValue;
                    })
                    .call(function() {
                        //transition 마지막에 완료 여부 isCreation = true
                        //console.log("effect end");
                        that._isCreation = true;
                        if (that.isMinus) {
                            //console.log("isMinus : "+isMinus);
                            that.refresh();
                        }
                    });
            }
        },
        _drawLineSeries: function(info, init) { //line series create
            var that = this,
                lineLeft = 2,
                lineGroup = null,
                width = that.drawingWidth,
                height = that.drawingHeight,
                barWidth = that.xScale.rangeBand(),
                targetyScale = (info.targetAxis == "left" ? that.yScale : that.yScale2);
            if (barWidth < 0) {
                barWidth = 0;
            }
            //실제 데이터를 표현하는 라인 그려준다.
            if (init) {
                //line serise creation
                var line = d3.svg.line()
                    .x(function(d) {
                        return that.xScale(d[info.xField]); })
                    .y(function(d) {
                        return targetyScale(d[info.yField]); });
                lineGroup = that.svg.append("g")
                    .attr("class", info.style + "-group")
                    .attr("transform", "translate(" + (that.margin.left + (barWidth / 2)) + "," + that.margin.top + ")");
                lineGroup.append("path")
                    .datum(that.data)
                    .attr("class", info.style)
                    .attr("x", that.margin.left)
                    .attr("d", line);
            } else {
                lineGroup = that.svg.select("." + info.style + "-group")
                    .attr("transform", "translate(" + (that.margin.left + (barWidth / 2)) + "," + that.margin.top + ")");
                var prevLine = that.svg.select("." + info.style);
                if (that.isAppend) {
                    var linePadding = (that.xScale.rangeBand() - that.barPadding) / 2;
                    var zeroline = d3.svg.line()
                        .x(function(d, i) {
                            return that.barPadding + that.xScale.range()[i] - linePadding; })
                        .y(function(d) {
                            return height; });
                    prevLine.transition().duration(500).attr("d", zeroline).each("end", zeroEnd); //기존 라인의 데이터를 0으로 
                    function zeroEnd() {
                        prevLine.remove(); //0으로 된 후 지운다.
                        setTimeout(reDrawLine, 500);
                    }
                } else {
                    var endline = d3.svg.line()
                        .x(function(d) {
                            return that.xScale(d[info.xField]); })
                        .y(function(d) {
                            return targetyScale(d[info.yField]); });
                    prevLine.datum(that.data).transition().duration(500).attr("d", endline);
                }

                function reDrawLine() {
                    //line serise creation
                    var startline = d3.svg.line()
                        .x(function(d) {
                            return 0; })
                        .y(function(d) {
                            return 0; });
                    var endline = d3.svg.line()
                        .x(function(d) {
                            return that.xScale(d[info.xField]); })
                        .y(function(d) {
                            return targetyScale(d[info.yField]); });
                    lineGroup.append("path")
                        .datum(that.data)
                        .attr("class", info.style)
                        .attr("x", that.margin.left)
                        .attr("d", startline)
                        .transition().duration(500)
                        .attr("d", endline);
                }
            }

            if (that.isDropShadow) {
                lineGroup.style("filter", "url(#fault-detail-line-drop-shadow)");
            }
            //point make
            var xMap = function(d) {
                    return that.xScale(d[info.xField]); },
                yMap = function(d) {
                    return targetyScale(d[info.yField]); }; // data -> display
            var lineDotGroup = null;
            if (init) {
                lineDotGroup = that.svg.append("g")
                    .attr("class", info.style + "-circle-group")
                    .attr("transform", "translate(" + (that.margin.left + (barWidth / 2)) + "," + that.margin.top + ")");
            } else {
                lineDotGroup = that.svg.select("." + info.style + "-circle-group")
                    .attr("transform", "translate(" + (that.margin.left + (barWidth / 2)) + "," + that.margin.top + ")");;
                lineDotGroup.selectAll("." + info.pointStyle).remove();
            }
            lineDotGroup.selectAll("circle")
                .data(that.data)
                .enter().append("circle")
                .attr("class", info.pointStyle)
                .attr("r", that.pointRadius)
                .attr("cx", xMap)
                .attr("cy", yMap)
                .attr("value", function(d) {
                    return d[info.yField]; })
                .style("opacity", 0);
        },
        _drawGuide: function() { //guide line group make
            var that = this,
                width = that.drawingWidth,
                height = that.drawingHeight;
            //가이드 라인 바를 그려준다. 가이드 라인 바와 가이드 라인 그룹을 생성하여 그룹화 시킨다.
            var guideBarGroup = that.svg.append("g")
                .attr("class", "guide-bar-group")
                .attr("transform", "translate(" + (that.margin.left) + "," + that.margin.top + ")");

            //가이드 라인의 fault 라벨을 추가한다. mouse over 시 출력할 item과 click시 출 item
            var guideSelectedItem = guideBarGroup.append("g")
                .attr("class", "select-guide-circle-group")
                //.attr("transform", function(d){return "translate("+0+","+(that.guideLineY/2)+")"})
                .attr("transform", function(d) {
                    return "translate(" + 0 + "," + 15 + ")" })
                .style("opacity", 0);
            //				guideSelectedItem.append("circle")
            //								 .attr("class","select-guide-line-circle")
            //								 .attr("r", that.guideLineY/2 );
            //				guideSelectedItem.append("text")
            //						 	 	.attr("class","select-guide-label-faults")
            //						 	 	.attr("x", -6)
            //						 	 	.attr("y", -2)
            //						 	 	.text("0");
            //				guideSelectedItem.append("text")
            //						 	 	.attr("dx", -(that.guideLineY/2/2+3))
            //						 	 	.attr("y", that.guideLineY/6+2)
            //						 	 	.text("Faults");

            guideSelectedItem.append("svg:image")
                .attr("xlink:href", "/portal/assets/images/widgets/faultdetail/tooltip.svg")
                .attr("x", -(that.selectItemWidth / 2))
                .attr("y", -20)
                .attr("width", that.selectItemWidth)
                .attr("height", that.selectItemHeight);
            //				guideSelectedItem.append("text")
            //							 	 .attr("class","select-guide-label-total-faults")
            //							 	 .attr("x", -8)
            //							 	 .attr("y", 25)
            //							 	 .text("0");
            //				guideSelectedItem.append("text")
            //								 .attr("class","select-guide-label-trace-faults")
            //							 	 .attr("dx", -33)
            //							 	 .attr("y", 50)
            //							 	 .text("Fault: ");
            //				guideSelectedItem.append("text")
            //								 .attr("class","select-guide-label-trace-faults-label")
            //							 	 .attr("dx", 4)
            //							 	 .attr("y", 50)
            //							 	 .text("43");
            //				guideSelectedItem.append("text")
            //								 .attr("class","select-guide-label-ooc-faults")
            //							 	 .attr("dx", -33)
            //							 	 .attr("y", 65)
            //							 	 .text("OOC: ");
            //				guideSelectedItem.append("text")
            //								 .attr("class","select-guide-label-ooc-faults-label")
            //							 	 .attr("dx", 4)
            //							 	 .attr("y", 65)
            //							 	 .text("63");
            //				guideSelectedItem.append("text")
            //								 .attr("class","select-guide-label-ocap-faults")
            //							 	 .attr("dx", -33)
            //							 	 .attr("y", 80)
            //							 	 .text("OCAP: ");
            //				guideSelectedItem.append("text")
            //								 .attr("class","select-guide-label-ocap-faults-label")
            //							 	 .attr("dx", 4)
            //							 	 .attr("y", 79)
            //							 	 .text("23");
            guideSelectedItem.append("text")
                .attr("class", "select-guide-label-trace-faults-label")
                .attr("dx", 35)
                .attr("y", -2)
                .text("0");
            guideSelectedItem.append("text")
                .attr("class", "select-guide-label-ooc-faults-label")
                .attr("dx", 35)
                .attr("y", 13)
                .text("0");
            guideSelectedItem.append("text")
                .attr("class", "select-guide-label-ocap-faults-label")
                .attr("dx", 35)
                .attr("y", 27)
                .text("0");
            guideSelectedItem.append("text")
                .attr("class", "select-guide-label-total-faults")
                .attr("dx", 30)
                .attr("y", 57)
                .text("0");
            var guideItem = guideBarGroup.append("g")
                .attr("class", "guide-circle-group")
                //.attr("transform", function(d){return "translate("+0+","+(that.guideLineY/2)+")"})
                .attr("transform", function(d) {
                    return "translate(" + 0 + "," + 15 + ")" })
                .style("opacity", 0);
            //				guideItem.append("circle")
            //						 .attr("class","guide-line-circle")
            //					     .attr("r", that.guideLineY/2 );
            //				guideItem.append("text")
            //						 .attr("class","guide-label-faults")
            //					     .attr("x", -6)
            //					     .attr("y", -2)
            //					     .text("0");
            //				guideItem.append("text")
            //					     .attr("dx", -(that.guideLineY/2/2+3))
            //					     .attr("y", that.guideLineY/6+2)
            //					     .text("Faults");

            guideItem.append("svg:image")
                .attr("xlink:href", "/portal/assets/images/widgets/faultdetail/tooltip.svg")
                .attr("x", -(that.selectItemWidth / 2))
                .attr("y", -20)
                .attr("width", that.selectItemWidth)
                .attr("height", that.selectItemHeight);
            guideItem.append("text")
                .attr("class", "guide-label-trace-faults-label")
                .attr("dx", 35)
                .attr("y", -2)
                .text("0");
            guideItem.append("text")
                .attr("class", "guide-label-ooc-faults-label")
                .attr("dx", 35)
                .attr("y", 13)
                .text("0");
            guideItem.append("text")
                .attr("class", "guide-label-ocap-faults-label")
                .attr("dx", 35)
                .attr("y", 27)
                .text("0");
            guideItem.append("text")
                .attr("class", "guide-label-total-faults")
                .attr("dx", 30)
                .attr("y", 57)
                .text("0");
            //				guideItem.append("text")
            //						 	 .attr("class","guide-label-total-faults")
            //						 	 .attr("x", -8)
            //						 	 .attr("y", 25)
            //						 	 .text("0");
            //				guideItem.append("text")
            //							 .attr("class","guide-label-trace-faults")
            //						 	 .attr("dx", -33)
            //						 	 .attr("y", 50)
            //						 	 .text("Fault: ");
            //				guideItem.append("text")
            //							 .attr("class","guide-label-trace-faults-label")
            //						 	 .attr("dx", 4)
            //						 	 .attr("y", 50)
            //						 	 .text("43");
            //				guideItem.append("text")
            //							 .attr("class","guide-label-ooc-faults")
            //						 	 .attr("dx", -33)
            //						 	 .attr("y", 65)
            //						 	 .text("OOC: ");
            //				guideItem.append("text")
            //							 .attr("class","guide-label-ooc-faults-label")
            //						 	 .attr("dx", 4)
            //						 	 .attr("y", 65)
            //						 	 .text("63");
            //				guideItem.append("text")
            //							 .attr("class","guide-label-ocap-faults")
            //						 	 .attr("dx", -33)
            //						 	 .attr("y", 80)
            //						 	 .text("OCAP: ");
            //				guideItem.append("text")
            //							 .attr("class","guide-label-ocap-faults-label")
            //						 	 .attr("dx", 4)
            //						 	 .attr("y", 79)
            //						 	 .text("23");

            var guideSelectedLine = guideBarGroup.append("line")
                .attr("class", "select-line-guideline")
                .attr("x1", 0)
                //.attr("y1", that.guideLineY)
                .attr("y1", that.selectItemHeight - 5)
                .attr("x2", 0)
                .attr("y2", height)
                .style('opacity', 0);
            var guideLine = guideBarGroup.append("line")
                .attr("class", "line-guideline")
                .attr("x1", 0)
                //.attr("y1", that.guideLineY)
                .attr("y1", that.selectItemHeight - 5)
                .attr("x2", 0)
                .attr("y2", height)
                .style('opacity', 0);
            var temprange = that.xScale.rangeBand();
            guideBarGroup.selectAll("." + that.sClassName + "." + that.barClassName + "-guide")
                .data(that.data)
                .enter().append("rect")
                .attr("class", that.barClassName + "-guide")
                .attr("fill", "#fff")
                .style("opacity", 0.1)
                .attr("x", function(d, i) {
                    var returnValue = that.barPadding + that.xScale.range()[i]
                    if (i == that.data.length - 1) {
                        var position = returnValue + ((temprange - that.barPadding) / 2);
                        selectGuideLine(position, i);
                    }
                    return returnValue;
                })
                .attr("width", function() {
                    var returnValue = temprange - that.barPadding;
                    if (returnValue < 0) {
                        returnValue = 0;
                    }
                    return returnValue;
                })
                .attr("y", 0)
                .attr("height", height)
                .on("mouseover", function(d, i) {
                    var thatItem = d3.select(this);
                    var position = (+thatItem.attr("x")) + (thatItem.attr("width") / 2);
                    moveGuideLine(position, i);
                    isMouseOver = true;
                })
                .on("mouseout", function(d, i) {
                    isMouseOver = false;
                    setTimeout(hideGuideLine, 700, [i]);
                })
                .on("click", function(d, i) {
                    var thatItem = d3.select(this);
                    var position = (+thatItem.attr("x")) + (thatItem.attr("width") / 2);
                    selectGuideLine(position, i);
                })
                .call(function(ev) {
                    if (ev == null || ev.length == 0) {
                        return;
                    }
                    if (that.clickFn) {
                        var dom = null;
                        var list = ev[0];
                        for (var i = 0; i < list.length; i++) {
                            dom = $(list[i]);
                            dom.on('remove', function() {
                                this.unbind('click');
                            });
                            dom.bind('click', function(ev) {
                                var selectedElement = d3.select(this)[0][0].__data__;
                                var sendData = {
                                    event: ev,
                                    data: selectedElement
                                };
                                that.clickFn(sendData);
                                ev.stopPropagation();
                            });
                        }
                    }
                });

            //select item list effect
            var selectedIndex = -1;
            //mouse over item effect
            var mouseOverIndex = -1;

            function moveGuideLine(position, index) { //가이드 라인을 보여준다. bar, circle을 같이 선택하듯 표현한다.
                if (mouseOverIndex >= 0) {
                    hideGuideLine(mouseOverIndex);
                }
                mouseOverIndex = index;
                guideLine.attr("x1", position).attr("x2", position).style('opacity', 1); //guide line show
                guideItem.attr("transform", function(d) {
                    return "translate(" + position + "," + 15 + ")" }).style('opacity', 1);
                //guideItem.attr("transform", function(d){return "translate("+position+","+(that.guideLineY/2)+")"}).style('opacity', 1);
                var allFaults = 0,
                    plusField = "",
                    faultLabel = "",
                    oocLabel = "",
                    ocapLabel = "",
                    totalLabel = "";
                for (var i = 0; i < that.seriesList.length; i++) {
                    plusField = that.seriesList[i].yField;
                    allFaults += that.data[mouseOverIndex][plusField];
                    if (plusField == "faultCount") {
                        faultLabel = that.data[mouseOverIndex][plusField].format();
                    } else if (plusField == "oocCount") {
                        oocLabel = that.data[mouseOverIndex][plusField].format();
                    } else if (plusField == "ocapCount") {
                        ocapLabel = that.data[mouseOverIndex][plusField].format();
                    }
                    if (that.seriesList[i].type == "bar") {
                        d3.select(that.svg.selectAll("." + that.seriesList[i].style)[0][index]).style("opacity", 1);
                    } else {
                        d3.select(that.svg.selectAll("." + that.seriesList[i].pointStyle)[0][index])
                            .transition().duration(300).attr("r", that.pointRadius + that.pointPlusRadius).style("opacity", 0.7);
                    }
                }
                //guideSelectedItem.select(".select-guide-label-faults").text( allFaults ).attr("x", allFaults < 10?-4:-5+(-2*(allFaults+"").length));
                totalLabel = allFaults.format()
                var totalX = getX(totalLabel),
                    traceX = getX(faultLabel),
                    oocX = getX(oocLabel),
                    ocapX = getX(ocapLabel);

                function getX(text) {
                    var returnX = 0;
                    if (text.length == 1) {
                        returnX = -8;
                    } else if (text.length == 2) {
                        returnX = -11;
                    } else if (text.length == 3) {
                        returnX = -17;
                    } else if (text.length == 5) {
                        returnX = -27;
                    } else if (text.length == 6) {
                        returnX = -34;
                    }
                    return returnX;
                }

                guideItem.select(".guide-label-total-faults").text(totalLabel).attr("x", totalX);
                guideItem.select(".guide-label-trace-faults-label").text(faultLabel).attr("x", traceX);
                guideItem.select(".guide-label-ooc-faults-label").text(oocLabel).attr("x", oocX);
                guideItem.select(".guide-label-ocap-faults-label").text(ocapLabel).attr("x", ocapX);
            }

            function selectGuideLine(position, index) { //가이드 라인을 보여준다.
                if (selectedIndex >= 0) {
                    hideSelectGuideLine(selectedIndex);
                }
                selectedIndex = index;
                that.guideSelectedIndex = selectedIndex;
                guideSelectedLine.attr("x1", position).attr("x2", position).style('opacity', 1); //guide line show
                //guideSelectedItem.attr("transform", function(d){return "translate("+position+","+(that.guideLineY/2)+")"}).style('opacity', 1);
                guideSelectedItem.attr("transform", function(d) {
                    return "translate(" + position + "," + 15 + ")" }).style('opacity', 1);
                var allFaults = 0,
                    plusField = "",
                    faultLabel = "",
                    oocLabel = "",
                    ocapLabel = "",
                    totalLabel = "";
                for (var i = 0; i < that.seriesList.length; i++) {
                    plusField = that.seriesList[i].yField;
                    allFaults += that.data[selectedIndex][plusField];
                    if (plusField == "faultCount") {
                        faultLabel = that.data[selectedIndex][plusField].format();
                    } else if (plusField == "oocCount") {
                        oocLabel = that.data[selectedIndex][plusField].format();
                    } else if (plusField == "ocapCount") {
                        ocapLabel = that.data[selectedIndex][plusField].format();
                    }
                }
                //guideSelectedItem.select(".select-guide-label-faults").text( allFaults ).attr("x", allFaults < 10?-4:-5+(-2*(allFaults+"").length));
                totalLabel = allFaults.format()
                var totalX = getX(totalLabel),
                    traceX = getX(faultLabel),
                    oocX = getX(oocLabel),
                    ocapX = getX(ocapLabel);

                function getX(text) {
                    var returnX = 0;
                    if (text.length == 1) {
                        returnX = -8;
                    } else if (text.length == 2) {
                        returnX = -11;
                    } else if (text.length == 3) {
                        returnX = -17;
                    } else if (text.length == 5) {
                        returnX = -27;
                    } else if (text.length == 6) {
                        returnX = -34;
                    }
                    return returnX;
                }

                guideSelectedItem.select(".select-guide-label-total-faults").text(totalLabel).attr("x", totalX);
                guideSelectedItem.select(".select-guide-label-trace-faults-label").text(faultLabel).attr("x", traceX);
                guideSelectedItem.select(".select-guide-label-ooc-faults-label").text(oocLabel).attr("x", oocX);
                guideSelectedItem.select(".select-guide-label-ocap-faults-label").text(ocapLabel).attr("x", ocapX);
            }

            var isMouseOver = false;

            function hideSelectGuideLine(index) {
                guideSelectedLine.style('opacity', 0);
                guideSelectedItem.style('opacity', 0);
            }

            function hideGuideLine(index) { //가이드 라인을 숨긴다.
                if (!isMouseOver) {
                    guideLine.style('opacity', 0);
                    guideItem.style('opacity', 0);
                    for (var i = 0; i < that.seriesList.length; i++) {
                        if (that.seriesList[i].type == "bar") {
                            d3.select(that.svg.selectAll("." + that.seriesList[i].style)[0][index]);
                            //.style("opacity",0.6);
                        } else {
                            d3.select(that.svg.selectAll("." + that.seriesList[i].pointStyle)[0][index])
                                .transition().duration(300).attr("r", that.pointRadius).style("opacity", 0);
                        }
                    }
                }
            }
        },
        _ㅡmakeHTMLTooltip: function(x, text) {
            var that = this;
        },
        _drawSeries: function() { //series create
            var that = this;
            if (that.seriesList == null ||
                that.seriesList.length == 0) {
                //not create chart
                return;
            }
            //series list에 설정된 정보대로 series create
            for (var i = 0; i < that.seriesList.length; i++) {
                if (that.seriesList[i].type == "bar") {
                    that._drawBarSeries(that.seriesList[i], true);
                } else if (that.seriesList[i].type == "line") {
                    that._drawLineSeries(that.seriesList[i], true);
                }
            }
            if (that.isEffect) {
                var curtain = that.svg.append('rect')
                    .attr('x', -1 * (that.drawingWidth + that.margin.left))
                    .attr('y', -1 * that.drawingHeight - that.margin.top)
                    .attr('height', that.drawingHeight)
                    .attr('width', that.drawingWidth)
                    .attr('class', 'fdc-line-curtain')
                    .attr('transform', 'rotate(180)')
                    .style('fill', '#ffffff');
                var t = that.svg.transition()
                    .delay(850)
                    .duration(400)
                    .ease('linear')
                    .each('end', function() {
                        d3.select('line.fdc-line-guide')
                            .transition()
                            .style('opacity', 0)
                            .remove();
                    });
                t.select('rect.fdc-line-curtain').attr('width', 0);
                t.select('line.fdc-line-guide').attr('transform', 'translate(' + that.drawingWidth + ', 0)');
            }
            if (that.isGuideLine) {
                that._drawGuide();
            }
        },
        _drawAxis: function() {
            var that = this;
            var width = that.drawingWidth,
                height = that.drawingHeight,
                svg = that.svg.select("." + that.tooltipEl.replace("#", "") + "-background");
            //add axis area
            var tempLeftMax = 0,
                tempRightMax = 0,
                targetyField = "",
                leftMax = 0,
                rightMax = 0,
                xaxis = null;
            for (var i = 0; i < that.seriesList.length; i++) {
                targetyField = that.seriesList[i].yField;
                if (that.seriesList[i].targetAxis == "left") {
                    tempLeftMax = d3.max(that.data, function(d) {
                        return d[targetyField]; });
                    if (leftMax < tempLeftMax) {
                        leftMax = tempLeftMax;
                    }
                } else {
                    tempRightMax = d3.max(that.data, function(d) {
                        return d[targetyField]; });
                    if (rightMax < tempRightMax) {
                        rightMax = tempRightMax;
                    }
                }
            }
            //axis scale setting
            //that.xScale.domain(d3.range(that.data.length)).rangeBands([0, width+that.arrowX]);
            that.xScale.domain(
                that.data.map(function(d, i) {
                    var aa = d[that.seriesList[0].xField];
                    return aa;
                })
            ).rangeBands([0, width - 2 + that.arrowX]);
            that.yScale.domain([0, leftMax + (leftMax * 0.5)]);
            if (that.isSecondAxis) {
                that.yScale2.domain([0, rightMax + (rightMax * 0.5)]);
            }
            //var t = that.svg.transition().duration(500);
            // x-axis
            xaxis = svg.append("g")
                .attr("class", that.sClassName + " x " + that.xaxisStyleName)
                .attr("transform", "translate(1," + height + ")")
                .call(that.xAxis)
                .selectAll("text")
                .data(that.data)
                .text(function(d) {
                    //시간단위로 출력시 labelRotate 이 0보다 크면 시간에 날짜를 더해서 출력한다.
                    var returnValue = d["label"];
                    var tempTxt = "" + d["summaryId"];
                    if (that.periodType == 'HOUR') {
                        returnValue = "" + d["summaryId"];
                        returnValue = returnValue.substring(4, 8) + " " + d["label"];
                    } else if (that.periodType == 'WEEK' || that.periodType == 'MONTH') {
                        returnValue = tempTxt.substring(0, 4) + " " + d["label"];
                    } else if (that.periodType == 'DAY') {
                        returnValue = tempTxt.substring(4, 6) + " " + d["label"];
                    } else {

                    }
                    return returnValue;
                })
                .call(that._wrap, that.xScale.rangeBand(), that.periodType);
            //					   .attr("transform", function (d) {
            //						   return "rotate("+0+")";
            //					   	 });

            xaxis.append("text")
                .attr("class", that.xaxisTextClass)
                .attr("x", width + 30)
                .attr("y", 30)
                .style("text-anchor", "end")
                .text(that.xLabel);
            //arrow setting
            if (that.isXAxisArrow) {
                svg.append("svg:defs").append("svg:marker")
                    .attr("id", "arrowhead")
                    .attr("viewBox", "0 -5 10 10")
                    .attr("refX", 0)
                    .attr("refY", 1)
                    .attr("markerWidth", 13)
                    .attr("markerHeight", 9)
                    .attr("orient", "auto")
                    .append("svg:path")
                    .attr("d", "M0,-5L10,0L0,5");
                xaxis.select("path").attr("marker-end", "url(#arrowhead)");
            }
            // y-axis
            var texts = null;
            texts = svg.append("g")
                .attr("class", that.sClassName + " y " + that.yaxisStyleName)
                .attr("transform", "translate(0,0)")
                .call(that.yAxis);
            texts.append("text")
                .attr("class", that.yaxisTextClass)
                .attr("x", -1)
                .attr("y", -9)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text(that.yLabel);
            that._lastLabelHidden(texts, that.yaxisFontColor);
            //second y-axis
            texts = svg.append("g")
                .attr("class", that.sClassName + " y " + that.yaxisStyleName2)
                .attr("transform", "translate(" + (width + 2) + ",0)")
                .call(that.yAxis2);
            texts.append("text")
                .attr("class", that.yaxisTextClass2)
                .attr("x", 26)
                .attr("y", -9)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text(that.yLabel2);
            that._lastLabelHidden(texts, that.yaxisFontColor2);
        },
        _wrap: function(text, width, periodType) {
            var maxWidth = 27,
                compareWidth = width;
            if (maxWidth < compareWidth) {
                compareWidth = maxWidth;
            }
            text.each(function() {
                var text = d3.select(this),
                    //words = text.text().split(/\s+/).reverse(),
                    words = (periodType == 'SHIFT' ? text.text().split('').reverse() : text.text().split(' ').reverse()),
                    word,
                    line = [],
                    lineNumber = 0,
                    lineHeight = 1.1, // ems
                    y = text.attr("y"),
                    dy = parseFloat(text.attr("dy")),
                    tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
                while (word = words.pop()) {
                    line.push(word);
                    if (periodType == 'SHIFT' && (width > maxWidth)) {
                        tspan.text(line.join(" "));
                    } else {
                        if (periodType == 'DAY') {
                            tspan.text(line.join(" "));
                        } else {
                            tspan.text(line.join(""));
                        }
                    }
                    if (tspan.node().getComputedTextLength() > compareWidth) {
                        line.pop();
                        tspan.text(line.join(" "));
                        line = [word];
                        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                    }
                }
            });
        },
        _lastLabelHidden: function(texts, fill) {
            var lastChild = null,
                currenty = 0;
            var targetText = texts.select(".fdc-plus-yaxis-text")[0];
            var tickLabels = texts.selectAll(".tick").each(function(d, i) {
                lastChild = d3.select(this);
                if (fill) {
                    lastChild.style("fill", fill);
                }
            });
            if (lastChild) {
                currenty = d3.transform(lastChild.attr("transform")).translate[1];
                //마지막의 라벨이 y=8에 가까우면 보이지 않게 한다.
                if (currenty < 8) {
                    lastChild.style("opacity", 0);
                } else {
                    lastChild.style("opacity", 1);
                }
            }
        },
        _drawChar: function() {
            var that = this;
            that._setSize();
            that._makeAxis(true); //사이즈 및 axis를 먼저 설정한다.
            var width = that.drawingWidth,
                height = that.drawingHeight;

            // add the graph canvas to the body of the webpage
            if (that.svg == null) {
                that.svg = d3.select(that.containEl);
            }
            //add dropshadow
            if (that.isDropShadow) {
                that._drawDropShadow();
                that._lineDrawDropShadow();
            }
            var svg = that.svg.attr("width", width + that.margin.left + that.margin.right)
                .attr("height", height + that.margin.top + that.margin.bottom)
                .append("g")
                .attr("class", that.tooltipEl.replace("#", "") + "-background")
                .attr("transform", "translate(" + that.margin.left + "," + that.margin.top + ")");

            //Add a background rect.
            svg.append("rect")
                .attr("class", that.backgroundClassName)
                .attr("fill", that.backgroundColor)
                .attr("width", width)
                .attr("height", height);
            //Add a grid line g
            that.svg.append("g").attr("class", "grid-line-group");
            // add the tooltip area to the webpage
            if (that.isTooltip) {
                var tooltip = d3.select(that.tooltipEl)
                    .append("div")
                    .attr("class", that.sClassName + " tooltip")
                    .style("opacity", 0);
            }
            //draw axis
            that._drawAxis();
            //series creation
            that._drawSeries();
            //grid line creation
            that._drawGridLine();
            if (that.data == null || that.data.length == 0) { //no data label add
                svg.append("text")
                    .attr("class", "message-title")
                    .attr("x", (width / 2) - 20)
                    .attr("y", (height / 2))
                    .text("No Data");
            }
            return svg;
        }
            //		,_gradientRect : function(){
            //			var that = this;
            //			var svg = that.svg;
            //			var gradient = svg.append("svg:defs")
            //			  				  .append("svg:linearGradient")
            //			  				  .attr("id", "gradient")
            //			  				  .attr("x1", "0%")
            //			  				  .attr("y1", "0%")
            //			  				  .attr("x2", "100%")
            //			  				  .attr("y2", "100%")
            //			  				  .attr("spreadMethod", "pad");
            //
            //				gradient.append("svg:stop")
            //				    	.attr("offset", "0%")
            //				    	.attr("stop-color", "#0c0")
            //				    	.attr("stop-opacity", 1);
            //
            //				gradient.append("svg:stop")
            //				    	.attr("offset", "100%")
            //				    	.attr("stop-color", "#c00")
            //				    	.attr("stop-opacity", 1);
            //
            //			svg.append("svg:rect")
            //			    .attr("width", w)
            //			    .attr("height", h)
            //			    .style("fill", "url(#gradient)");
            //		}
    };

    manageInst.fn.extend({ barAndLineChart: BarAndLineChart });

})(manageInst);
