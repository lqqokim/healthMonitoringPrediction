(function (manageInst, undefined) {
/**
 * Title : Bar and Line chart Component
 * How to use : manageInst('hierarchicalBarChart').hierarchicalBarChart({ containEl : "#plotChart" });
 *                             ↑										↑
 *                  javascript instance name					chart config data
 * Required libraries : 
 * 						<script src="bower_components/jquery/dist/jquery.js">
 * 						<script src="bower_components/d3/d3.js">
 * 						<script src="scripts/lib/gridstack/jquery.resize.js">
 *     					<script src="scripts/lib/utils/manageInst.js">
 *   					<script src="scripts/lib/hierarchicalbar-chart/hierarchicalBarChart.js">
 *   
 * Description : 현재 bar multi는 구현이 안되어 있음. 하나만 됨. bar가 여러개가 추가 될 시에는 stacked, clusterd 형식으로 되어야 하기 때문.
 */	
	
	var HierarchicalBarChart = function ( options ){
		this._init( options );
	}
	
	HierarchicalBarChart.prototype = {
		_init : function( options ){
			var setObj = manageInst.setJqueryObj;
			
			//인자값 설정
			this.containEl = options.containEl || null;				//chart가 그려질 컨테이너
			this.tooltipEl = options.tooltipEl || null;				//tooltip을 출력할 경우 tooltip이 그려져야 하는 영역
			// this.itemTooltipEl = null;
			// this.itemTooltipBgEl = null;
			this.leftTabsEl = options.leftTabsEl || null;
			this.isShowLog = options.isShowLog || false;
			this.selectBarJQueryEl = null;
			this.currentLeftTab = null;
			this.leftTabsDepth = null;
			this.isSvgDefs = options.isSvgDefs || false;
			this.svgDefs = null;
			this.isShowSvgBtn = options.isShowSvgBtn || false;
			this.chartWidth = options.chartWidth || 900;			//chart의 넓이
			this.chartHeight = options.chartHeight || 500;			//chart의 높이
			//this.backgroundColor = options.backgroundColor || "#fff";//차트 배경색 지정
			//this.lineColor = options.lineColor || "#ff0000";		//line색 지정
			//this.barColor = options.barColor || "#ffff000";			//bar색 지정
			this.rememberPositionClickFn = options.rememberPositionClickFn || null;					//item 클릭시 이벤트 desc : rememberPositionClickFn( selectedElement=선택한 객체, tipOptions=클릭 이벤트가 담긴 object );
			this.pieRefreshClickFn = options.pieRefreshClickFn || null;
			this.barMouseOverFn = options.barMouseOverFn || null;
			this.chartid = options.chartid || manageInst.newGuid();		//plotchart의 dot클릭시 unique아이디를 넘겨야 하기 때문에 생성
			this.pointRadius = options.pointRadius || 2;			//line item의 point radius
			this.pointPlusRadius = options.pointPlusRadius || 5;	//마우스 오버시 line item의 point radius
			this.chartData = options.baseChartData || null;						//차트의 데이터
			this.baseChartData = options.baseChartData || null;
			this.isXAxisArrow = options.isXAxisArrow || false;
			this.isSampleData = options.isSampleData || false;		//샘플 데이터 여부
			this.isGuideLine = options.isGuideLine || true;			//guide line 여부
			this.isVerticalGrid = options.isVerticalGrid || false;	//vertical grid line 여부
			this.isHorizontalGrid = options.isHorizontalGrid || true;//horizontal grid line 여부
			this.isEffect = options.isEffect || true;				//effect 여부
			this.selectBarItem = null;
			//chart에 반영할 series 정보 
			this.seriesList = options.seriesList || [];
			this.isSecondAxis = options.isSecondAxis || false;				//second axis 여부
			
			this.barColorList = options.barColorList || ["steelblue", "#ccc"];
			this.selectBarColor = "red";
			//CSS Setting    x axis-hierarchicalBar
			this.sClassName = options.sClassName || "fdc-plus-left";		//차트 전체의 스타일 명
			this.backgroundClassName = options.backgroundClassName || "fdc-plus-left-background";//차트 배경 스타일
			this.barClassName = options.barClassName || "fdc-plus-left-bar";		//bar의 스타일 명
			this.textClass = options.textClass || "fdc-plus-text";
			this.xaxisClassName = options.xaxisClassName || 'fdc-plus-left-xaxis';
			this.yaxisClassName = options.yaxisClassName || 'fdc-plus-left-yaxis';
			this.enterClassName = options.enterClassName || 'fdc-plus-left-enter';
			this.exitClassName = options.exitClassName || 'fdc-plus-left-exit';
			this.annotationBtnClassName = options.annotationBtnClassName || 'fdc-plus-left-annotation-btn';
			this.tooltipStyleName = options.tooltipStyleName || "fdc-plus-left-tooltip";
			this.mouseOverFn = options.mouseOverFn || null;
			
			//인자값이 아닌 차트 설정값.
			var that = this;
			//==============차트의 Axis를 컨트롤하기 위한 차트의 맴버변수 설정============//
			this.svg = null;
			this.axisLabelMarginX = 13;										//axis 라벨 x 여백
			this.axisLabelMarginY = -15;									//axis 라벨 y 여백
			this.barPadding = .2;											//bar 간
			this.margin = {top: 30, right: 50, bottom: 0, left: 80};
			this.yaxisStyleName = options.yaxisStyleName || "fdc-plus-bar-yaxis";//y축 스타일 명 
			this.xaxisStyleName = options.xaxisStyleName || "fdc-plus-bar-xaxis";//x축 스타일
			this.drawingWidth = this.chartWidth;
			this.drawingHeight = this.chartHeight;
			this.xScale = null;
			this.xAxis = null;
			this.yScale = null;
			this.yAxis = null;
			this.yAxisTicks = options.yAxisTicks || 4;
			this.yScale2 = null;
			this.yAxis2 = null;
			this.yAxisTicks2 = options.yAxisTicks2 || 4;
			this.isChange = false;										//change 여부
			this.guideLineY = 50;										//guide line의 Y 좌표
			this.arrowX = 0;											//x axis의 arrow x
			this.partition = d3.layout.partition().value(function(d){ return d.value; });
			this.duration = options.duration || 750;
			this.delay = options.delay || 25;
			this.barHeight = options.barHeight || 20;
			this.showBarHeight = options.barHeight || 20;
			// this.downClickFn = options.downClickFn || null;
			// this.upClickFn = options.upClickFn || null;
			//==============차트의 Axis를 컨트롤하기 위한 차트의 맴버변수 설정============//
			if(this.isShowLog){
				console.log('lib - _init');
			}
			this.removeView();											//내용 삭제.
			if( this.isSampleData ){//get sample Data
				this._setSampleData();
			}
			if(this.leftTabsEl !== null){
				this.currentLeftTab = $(that.leftTabsEl[0]);
				this.leftTabsDepth = 0;
			}
			this._isCreation = false;
			this._drawChar();
			this._bindEvent();
		}
		,_bindEvent : function(){	//각각의 정의된 이벤트를 바인딩 한다.
			var that = this;
			if(that.isShowLog){
				console.log('lib - _bindEvent');
			}
			manageInst.timerForRefresh( that.tooltipEl, refreshChart );//resize이벤트를 등록
			//d3.select(window).on('resize', refreshChart); 
			//$(that.tooltipEl).resize( refreshChart );
			function refreshChart(){
				that.refresh(that);
				// setTimeout( that.refresh, 1000 );
			}
			
			// if(that.leftTabsEl !== null){
				// that.leftTabsEl.bind('click', leftTabClick);
				// that.currentLeftTab = $(that.leftTabsEl[0]);
			// }
// 			
			// function leftTabClick(evt){
				// that.currentLeftTab.removeClass('active');
				// that.currentLeftTab = $(this);
				// that.currentLeftTab.addClass('active');
			// }
			
		}
		,_setSampleData : function(){//샘플 데이터 셋팅.
			
			function randomValue( numValue ){
				return Math.round( Math.random()*numValue );
			}
			var that = this;
			if(that.isShowLog){
				console.log('lib - _setSampleData');
			}
				that.baseChartData = {
					'name': 'chart',
					'children': [
					    {
					        "name": "TOOL_A",
					        "children": [
					            {
					                "name": "CH_A",
					                "children": [
					                    {
					                        "name": "PARAM01_LOT_MIN",
					                        "children": [
					                            { "name": "RCP1", "value": 7 },
					                            { "name": "RCP2", "value": 10 },
					                            { "name": "RCP3", "value": 5 },
					                            { "name": "RCP4", "value": 15 },
					                            { "name": "RCP5", "value": 19 },
					                            { "name": "RCP6", "value": 30 }
					                        ]
					                    },
					                    {
					                        "name": "PARAM02_LOT_MIN",
					                        "children": [
					                            { "name": "RCP1", "value": 7 },
					                            { "name": "RCP2", "value": 10 },
					                            { "name": "RCP3", "value": 5 },
					                            { "name": "RCP4", "value": 15 },
					                            { "name": "RCP5", "value": 19 }
					                        ]
					                    },
					                    {
					                        "name": "PARAM03_LOT_MIN",
					                        "children": [
					                            { "name": "RCP1", "value": 7 },
					                            { "name": "RCP2", "value": 10 }
					                        ]
					                    }
					                ]
					            },
					            {
					                "name": "CH_C",
					                "children": [
					                    {
					                        "name": "PARAM01_LOT_MIN",
					                        "children": [
					                            { "name": "RCP1", "value": 7 },
					                            { "name": "RCP2", "value": 10 },
					                            { "name": "RCP3", "value": 5 },
					                            { "name": "RCP4", "value": 15 },
					                            { "name": "RCP5", "value": 19 }
					                        ]
					                    },
					                    {
					                        "name": "PARAM02_LOT_MIN",
					                        "children": [
					                            { "name": "RCP1", "value": 7 },
					                            { "name": "RCP2", "value": 10 },
					                            { "name": "RCP3", "value": 5 },
					                            { "name": "RCP4", "value": 15 },
					                            { "name": "RCP5", "value": 19 }
					                        ]
					                    }
					                ]
					            },
					            {
					                "name": "CH_D",
					                "children": [
					                    {
					                        "name": "PARAM01_LOT_MIN",
					                        "children": [
					                            { "name": "RCP1", "value": 7 },
					                            { "name": "RCP2", "value": 10 },
					                            { "name": "RCP3", "value": 5 },
					                            { "name": "RCP4", "value": 15 },
					                            { "name": "RCP5", "value": 19 }
					                        ]
					                    },
					                    {
					                        "name": "PARAM02_LOT_MIN",
					                        "children": [
					                            { "name": "RCP1", "value": 7 },
					                            { "name": "RCP2", "value": 10 },
					                            { "name": "RCP3", "value": 5 },
					                            { "name": "RCP4", "value": 15 },
					                            { "name": "RCP5", "value": 19 }
					                        ]
					                    }
					                ]
					            }
					        ]
					    },
					    {
					        "name": "TOOL_B",
					        "children": [
					            {
					                "name": "CH_A",
					                "children": [
					                    {
					                        "name": "PARAM01_LOT_MIN",
					                        "children": [
					                            { "name": "RCP1", "value": 7 },
					                            { "name": "RCP2", "value": 10 },
					                            { "name": "RCP3", "value": 5 },
					                            { "name": "RCP4", "value": 15 },
					                            { "name": "RCP5", "value": 19 }
					                        ]
					                    },
					                    {
					                        "name": "PARAM02_LOT_MIN",
					                        "children": [
					                            { "name": "RCP1", "value": 7 },
					                            { "name": "RCP2", "value": 10 },
					                            { "name": "RCP3", "value": 5 },
					                            { "name": "RCP4", "value": 15 },
					                            { "name": "RCP5", "value": 19 }
					                        ]
					                    }
					                ]
					            },
					            {
					                "name": "CH_C",
					                "children": [
					                    {
					                        "name": "PARAM01_LOT_MIN",
					                        "children": [
					                            { "name": "RCP1", "value": 7 },
					                            { "name": "RCP2", "value": 10 },
					                            { "name": "RCP3", "value": 5 },
					                            { "name": "RCP4", "value": 15 },
					                            { "name": "RCP5", "value": 19 }
					                        ]
					                    },
					                    {
					                        "name": "PARAM02_LOT_MIN",
					                        "children": [
					                            { "name": "RCP1", "value": 7 },
					                            { "name": "RCP2", "value": 10 },
					                            { "name": "RCP3", "value": 5 },
					                            { "name": "RCP4", "value": 15 },
					                            { "name": "RCP5", "value": 19 }
					                        ]
					                    }
					                ]
					            },
					            {
					                "name": "CH_D",
					                "children": [
					                    {
					                        "name": "PARAM01_LOT_MIN",
					                        "children": [
					                            { "name": "RCP1", "value": 7 },
					                            { "name": "RCP2", "value": 10 },
					                            { "name": "RCP3", "value": 5 },
					                            { "name": "RCP4", "value": 15 },
					                            { "name": "RCP5", "value": 19 }
					                        ]
					                    },
					                    {
					                        "name": "PARAM02_LOT_MIN",
					                        "children": [
					                            { "name": "RCP1", "value": 7 },
					                            { "name": "RCP2", "value": 10 },
					                            { "name": "RCP3", "value": 5 },
					                            { "name": "RCP4", "value": 15 },
					                            { "name": "RCP5", "value": 19 }
					                        ]
					                    }
					                ]
					            }
					        ]
					    },
					    {
					        "name": "TOOL_C",
					        "children": [
					            {
					                "name": "CH_A",
					                "children": [
					                    {
					                        "name": "PARAM01_LOT_MIN",
					                        "children": [
					                            { "name": "RCP1", "value": 7 },
					                            { "name": "RCP2", "value": 10 },
					                            { "name": "RCP3", "value": 5 },
					                            { "name": "RCP4", "value": 15 },
					                            { "name": "RCP5", "value": 19 }
					                        ]
					                    },
					                    {
					                        "name": "PARAM02_LOT_MIN",
					                        "children": [
					                            { "name": "RCP1", "value": 7 },
					                            { "name": "RCP2", "value": 10 },
					                            { "name": "RCP3", "value": 5 },
					                            { "name": "RCP4", "value": 15 },
					                            { "name": "RCP5", "value": 19 }
					                        ]
					                    }
					                ]
					            },
					            {
					                "name": "CH_B",
					                "children": [
					                    {
					                        "name": "PARAM01_LOT_MIN",
					                        "children": [
					                            { "name": "RCP1", "value": 7 },
					                            { "name": "RCP2", "value": 10 },
					                            { "name": "RCP3", "value": 5 },
					                            { "name": "RCP4", "value": 15 },
					                            { "name": "RCP5", "value": 19 }
					                        ]
					                    },
					                    {
					                        "name": "PARAM02_LOT_MIN",
					                        "children": [
					                            { "name": "RCP1", "value": 7 },
					                            { "name": "RCP2", "value": 10 },
					                            { "name": "RCP3", "value": 5 },
					                            { "name": "RCP4", "value": 15 },
					                            { "name": "RCP5", "value": 19 }
					                        ]
					                    }
					                ]
					            }
					        ]
					    }
					]
				};
				that.chartData = that.baseChartData;
		}
		,refresh : function( obj ){//해당 remove 하고 화면을 다시 그려준다. data는 가져오지 않는다.
			var that = this;
			if(that.isShowLog){
				console.log('lib - refresh');
			}
			if( !that._isCreation ){
				return;
			}
			var changeWidth = 0,
				changeHeight = 0;
			if( $(that.tooltipEl).width() <= 0 ){
				changeWidth = that.chartWidth;
			}else{
				changeWidth = $(that.tooltipEl).width();
				that.chartWidth = changeWidth;
			}
			if( $(that.tooltipEl).height() <= 0 ){
				changeHeight = that.chartHeight;
			}else{
				changeHeight = $(that.tooltipEl).height();
				that.chartHeight = changeHeight;
			}
			that.isChange = true;
			
			that._setSize();
			//axis scale size re setting
			that._makeAxis();
			
			// that.drawingWidth = that.chartWidth - that.margin.left - that.margin.right;
// 			
			// if(that.drawingHeight < that.chartHeight - that.margin.top - that.margin.bottom){
				// that.drawingHeight = that.chartHeight - that.margin.top - that.margin.bottom;	
			// }else{
// 				
			// }
			
			
			
			//chart resize start
			var barPadding = 6;
			var width = that.drawingWidth,
				height = that.drawingHeight;
			//실제 데이터를 표현하는 바를 그려준다.
			
			// if(width <= 0 || height <= 0)
				// return;
			
			
			
			//svg resize
			var svg = that.svg.attr("width", width + that.margin.left + that.margin.right)
							  .attr("height", height + that.margin.top + that.margin.bottom);
							  
			that.xScale.range([0, width]);
			
			var bar = svg.selectAll('.'+that.enterClassName + ' rect');
			bar.attr('width', function(d){
				return that.xScale(d.value);
			}).attr('height', that.showBarHeight);
			
			if(bar[0].length * that.barHeight > height){
				svg.attr("height", bar[0].length * that.barHeight + that.margin.top + that.margin.bottom);
			}
			
			//change buts position
			var uses = svg.selectAll('use').attr("x", that.drawingWidth + 5);
			
			svg.select('.' + that.xaxisClassName).call(that.xAxis);
			
		}
		,removeView : function(){
			var that = this;
			if(that.isShowLog){
				console.log('lib - removeView');
			}
			
			if(that.isSvgDefs){
				if(that.svgDefs == null){
					var defs = $(that.containEl).children("defs");
					if(defs.length > 0){
						that.svgDefs = $(that.containEl).children("defs");
					}else{
						console.log("please check - defs tags");
					}
				}
			}
			 
			$(that.containEl).empty();//내용 삭제.
			var tooltips = $(that.tooltipEl).find("div."+that.sClassName+".tooltip");
				tooltips.remove();
		}
		,setData : function( data ){//data를 인자로 받아 chart를 다시 그린다.
			var that = this;
			if(that.isShowLog){
				console.log('lib - setData');
			}
			if( that.isSampleData ){
				that._setSampleData();
			}else{
				var templateChartData = {
					'name':'chart',
					'children': data
				};
				that.baseChartData = templateChartData;
				that.chartData = that.baseChartData;
			}
			//setting selectBarItem
			that.selectBarItem = null;
			that.removeView();//내용 삭제.
			that._drawChar();//차트 생성
		}
		,_setSize : function(){//size setting
			//사이즈 설정
			var that = this;
			if(that.isShowLog){
				console.log('lib - _setSize');
			}
			
			var changeWidth = 0,
				changeHeight = 0;
			if( $(that.tooltipEl).width() <= 0 ){
				changeWidth = that.chartWidth;
			}else{
				changeWidth = $(that.tooltipEl).width();
				that.chartWidth = changeWidth;
			}
			if( $(that.tooltipEl).height() <= 0 ){
				changeHeight = that.chartHeight;
			}else{
				changeHeight = $(that.tooltipEl).height();
				that.chartHeight = changeHeight;
			}
			
			// var bar = svg.select('g').append("g").attr("class", that.enterClassName).attr(
					// "transform", "translate(0,5)").selectAll("g").data(
					// d.children).enter().append("g").style("cursor",
					// function(d) {
						// return !d.children ? null : "pointer";
					// });
			if(that.svg != null){
				var barItemCount = $(that.svg.selectAll("."+that.enterClassName)[0]).children().length;
				
				var drawItemsHeight = barItemCount * that.barHeight * 1.2 + barItemCount * 0.6;
				that.showBarHeight = that.barHeight;
				
				if(drawItemsHeight > that.chartHeight - that.margin.top - that.margin.bottom){
					var svg = that.svg.attr("height", drawItemsHeight + that.margin.top + that.margin.bottom);
					that.drawingHeight = drawItemsHeight;
					var svgBg = that.svg.select("."+that.backgroundClassName).attr("height", drawItemsHeight);
				}else{
					var svg = that.svg.attr("height", that.chartHeight);
					that.drawingHeight = drawItemsHeight;
					var svgBg = that.svg.select("."+that.backgroundClassName).attr("height", that.chartHeight - that.margin.top - that.margin.bottom);
				}
			}
			
			
			if(that.isShowSvgBtn){
				that.drawingWidth = that.chartWidth - that.margin.left - that.margin.right;
			}else{
				that.drawingWidth = that.chartWidth - that.margin.left - that.margin.right + 20;
			}
			
			// if(that.drawingHeight <= that.chartHeight - that.margin.top - that.margin.bottom){
				// that.drawingHeight = that.chartHeight - that.margin.top - that.margin.bottom;
			// }else{
				// //that.drawingHeight = that.chartHeight - that.margin.top - that.margin.bottom;
			// }
			// that.drawingHeight = that.chartHeight - that.margin.top - that.margin.bottom;
		}
		,_makeAxis : function(){//axis make
			var that = this;
			var width = that.drawingWidth,
				height = that.drawingHeight;
			if(that.isShowLog){
				console.log('lib - _makeAxis');
			}
			// setup x
			if( that.xScale == null ){
				that.xScale = d3.scale.linear();
			}
			if( that.xAxis == null ){
				that.xAxis = d3.svg.axis();
			}
			that.xScale.range([0, width]);//, that.barPadding
			that.xAxis.scale(that.xScale).orient("top");
		}
		,_drawBarSeries : function( chartData ){
			if( chartData.children == null || chartData.children.length == 0 ){
				return;
			}
			var that = this;
			if(that.isShowLog){
				console.log('lib - _drawBarSeries');
			}
			var barPadding = 6;
			var width = that.drawingWidth,
				height = that.drawingHeight;
			that.color = d3.scale.ordinal().range(that.barColorList);
			//실제 데이터를 표현하는 바를 그려준다.
			
			that.partition.nodes(chartData);
			if(that.selectBarItem == null){
				that.selectBarItem = that.partition.nodes(chartData)[0].children[0];
			}
			that.xScale.domain([0, chartData.value]).nice();
			that._down(that, chartData, 0);	
			that._isCreation = true;
		}
		,_drawChar : function(){
			var that = this;
			if(that.isShowLog){
				console.log('lib - _drawChar');
			}	
				that._setSize();
				that._makeAxis();	//사이즈 및 axis를 먼저 설정한다.
			var width = that.drawingWidth,
				height = that.drawingHeight;
			
			// add the graph canvas to the body of the webpage
			if( that.svg == null ){
				that.svg = d3.select(that.containEl);
			}
			
			// if(width <= 0 || height <= 0)
				// return;
			
			var svg = that.svg.attr("width", width + that.margin.left + that.margin.right)
							  .attr("height", height + that.margin.top + that.margin.bottom)
							  .append("g")
			  				.attr("transform", "translate(" + that.margin.left + "," + that.margin.top + ")");
					  
			if(that.isSvgDefs){
				$(that.containEl).append(that.svgDefs);
			}
			
			if(that.leftTabsEl !== null){
				that.currentLeftTab.removeClass('active');
				this.currentLeftTab = $(that.leftTabsEl[0]);
				that.currentLeftTab.addClass('active');
				this.leftTabsDepth = 0;
			}
			
			
			
			// if(bar[0].length * that.barHeight > that.drawingHeight){
				// that.svg.attr("height", bar[0].length * that.barHeight + that.margin.top + that.margin.bottom);
			// }
			
			svg.append("rect").attr("class", that.backgroundClassName).attr("width", width)
				.attr("height", height).on('click', function(){
						that._up(that, arguments[0]);
					})
					.call(function(ev) {
						 if( ev == null || ev.length == 0 ){
							 return;
						 }
						 if( that.rememberPositionClickFn ){
							 var dom = null;
							 var list = ev[0];
							 for( var i = 0; i < list.length; i++ ){
								 dom = $(list[i]);
								 dom.on('remove', function(){ 
									 this.unbind('click'); 
								 });
								 dom.bind('click', function(ev) {
									var selectedElement = d3.select('.'+that.enterClassName)[0][0].children[0].__data__.parent;
									var sendData = {
											event: ev,
											data : selectedElement
										};
									that.rememberPositionClickFn(sendData);
									ev.stopPropagation();
								});
							 }
						 }
					  });
					
			svg.append("g").attr("class", that.xaxisClassName);
			svg.append("g").attr("class", that.yaxisClassName).append("line").attr("y1","100%");
			
			// that.itemTooltipBgEl = svg.append("rect").attr("class", "bar-detail-tooltip-bg").attr("x", 0).attr("y", 0).attr("rx", 4).attr("ry",4).attr("width", 100).attr("height", 16).attr("visibility", "hidden")
									// .style("fill", "white").style("stroke", "black").style("stroke-width", 1).style("opacity", 1);
			// that.itemTooltipEl = svg.append("text").attr("class", "bar-detail-tooltip").attr("x", 0).attr("y", 0).attr("visibility", "hidden").text("tooltip");
			
			that._drawBarSeries(that.baseChartData);
			
			return svg;
		}
		,_down:function(target, d, i){
			var that = target;
			var svg = that.svg;
			
			if(that.isShowLog){
				console.log('lib - _down');
			}
			if(svg == null){
				svg = d3.select(that.containEl);
			}
			
			if (!d.children || this.__transition__)
				return;
			var end = that.duration + d.children.length * that.delay;


			// Mark any currently-displayed bars as exiting.
			var exit = svg.selectAll("." + that.enterClassName).attr("class", that.exitClassName);

			// Entering nodes immediately obscure the clicked-on bar, so hide it.
			exit.selectAll("rect").filter(function(p) {
				return p === d;
			}).style("fill-opacity", 1e-6);
			
			
			// Enter the new bars for the clicked-on data.
			// Per above, entering bars are immediately visible.
			var enter = that._bar(d).attr("transform", that._stack(i)).style("opacity", 1);

			// Have the text fade-in, even though the bars are visible.
			// Color the bars as parents; they will fade to children if appropriate.
			enter.select("text").style("fill-opacity", 1e-6);
			enter.select("rect").style("fill", function(d){
				return that.color(true);
			});

			// Update the x-scale domain.
			that.xScale.domain([ 0, d3.max(d.children, function(d) {
				return d.value;
			}) ]).nice();


			// Update the x-axis-hierarchicalBar.
			svg.selectAll("."+that.xaxisClassName).transition().duration(that.duration)
					.call(that.xAxis);

			// Transition entering bars to their new position.
			var enterTransition = enter.transition().duration(that.duration).delay(
					function(d, i) {
						return i * that.delay;
					}).attr("transform", function(d, i) {
				return "translate(0," + that.showBarHeight * i * 1.2 + ")";
			});

			// Transition entering text.
			enterTransition.select("text").style("fill-opacity", 1);
			// Transition entering rects to the new x-scale.
			enterTransition.select("rect").attr("width", function(d) {
				return that.xScale(d.value);
			}).style("fill", function(d) {
				if(d == that.selectBarItem){
					return that._colorLuminance(that.color(true), -0.2);
				}else{
					return that.color(true);
				}
			});

			// Transition exiting bars to fade out.
			var exitTransition = exit.transition().duration(that.duration).style(
					"opacity", 1e-6).remove();


			// Transition exiting bars to the new x-scale.
			exitTransition.selectAll("rect").attr("width", function(d) {
				return that.xScale(d.value);
			});

			// Rebind the current node to the background.
			svg.select("." + that.backgroundClassName).datum(d).transition().duration(end);


			d.index = i;
		},
		_up: function(target, d){
			
			var that = target;
			var svg = that.svg;
			if(that.isShowLog){
				console.log('lib - _up');
			}
			
			if(svg == null){
				svg = d3.select(that.containEl);
			}
			
			if (!d.parent || this.__transition__)
				return;

			var end = that.duration + d.children.length * that.delay;

			// Mark any currently-displayed bars as exiting.
			var exit = svg.selectAll("." + that.enterClassName).attr("class", that.exitClassName);
			
			

			// Enter the new bars for the clicked-on data's parent.
			var enter = that._bar(d.parent).attr("transform", function(d, i) {
				return "translate(0," + that.showBarHeight * i * 1.2 + ")";
			}).style("opacity", 1e-6);

			// Color the bars as appropriate.
			// Exiting nodes will obscure the parent bar, so hide it.
			enter.select("rect").style("fill", function(d) {
				if(d == that.selectBarItem){
					return that._colorLuminance(that.color(true), -0.2);
				}else{
					return that.color(true);
				}
			}).filter(function(p) {
				return p === d;
			}).style("fill-opacity", 1e-6);

			// Update the x-scale domain.
			that.xScale.domain([ 0, d3.max(d.parent.children, function(d) {
				return d.value;
			}) ]).nice();


			// Update the x-axis-hierarchicalBar.
			svg.selectAll("." + that.xaxisClassName).transition().duration(that.duration)
					.call(that.xAxis);

			// Transition entering bars to fade in over the full duration.
			var enterTransition = enter.transition().duration(end).style(
					"opacity", 1);

			// Transition entering rects to the new x-scale.
			// When the entering parent rect is done, make it visible!
			enterTransition.select("rect").attr("width", function(d) {
				return that.xScale(d.value);
			}).each("end", function(p) {
				if (p === d)
					d3.select(this).style("fill-opacity", null);
			});

			// Transition exiting bars to the parent's position.
			var exitTransition = exit.selectAll("g").transition().duration(
					that.duration).delay(function(d, i) {
				return i * that.delay;
			}).attr("transform", that._stack(d.index));

			// Transition exiting text to fade out.
			exitTransition.select("text").style("fill-opacity", 1e-6);

			// Transition exiting rects to the new scale and fade to parent color.
			exitTransition.select("rect").attr("width", function(d) {
				return that.xScale(d.value);
			}).style("fill", function(d){
				return that.color(true);
			});

			// Remove exiting nodes when the last child has finished transitioning.
			exit.transition().duration(end).remove();

			// Rebind the current parent to the background.
			svg.select("." + that.backgroundClassName).datum(d.parent).transition()
					.duration(end);
		},
		_bar:function(d){
			var that = this;
			var	svg = this.svg;
			if(that.isShowLog){
				console.log('lib - _bar');
			}
				
			if(svg == null){
				svg = d3.select(that.containEl);
			}
			
			var bar = svg.select('g').append("g").attr("class", that.enterClassName).attr(
					"transform", "translate(0,5)").selectAll("g").data(
					d.children).enter().append("g").style("cursor",
					function(d) {
						return !d.children ? null : "pointer";
					});
					
			var drawItemsHeight = bar[0].length * that.barHeight * 1.2 + bar[0].length * 0.6;
			that.showBarHeight = that.barHeight;
			
			if(drawItemsHeight > that.chartHeight - that.margin.top - that.margin.bottom){
				var svg = that.svg.attr("height", drawItemsHeight + that.margin.top + that.margin.bottom);
				that.drawingHeight = drawItemsHeight;
				var svgBg = that.svg.select("."+that.backgroundClassName).attr("height", drawItemsHeight);
			}else{
				var svg = that.svg.attr("height", that.chartHeight);
				that.drawingHeight = drawItemsHeight;
				var svgBg = that.svg.select("."+that.backgroundClassName).attr("height", that.chartHeight - that.margin.top - that.margin.bottom);
			}
			
			
			
			bar.append("text").attr("x", -6).attr("y", function(d){
				return that.showBarHeight / 2;		
			})
			.attr("dy", ".35em")
			.style("text-anchor", "end")
			.text(
				function(d) {
					if(d.name.length > 10){
						var str = d.name.substring(0, 10) + "..";
						return str;
					}else{
						return d.name;
					}
				}
			);
			//text name 길이 조절
			// .attr("textLength", that.margin.left - 5);
			// .on("mouseover", mouseover)
			// .on("mouseout", mouseout);
			
			// function mouseover(item){
				// var ev = event;
				// console.log(ev.pageX, ev.pageY, ev.clientX, ev.clientY, ev.offsetX, ev.offsetY);
				// that.itemTooltipEl.attr("x", -70).attr("y", ev.offsetY - 35).attr("visibility", "visible").text(item.name);
				// that.itemTooltipBgEl.attr("x", -80).attr("y", ev.offsetY - 51).attr("visibility", "visible");
			// }
// 			
			// function mouseout( item ){
				// that.itemTooltipEl.attr("visibility", "hidden");
				// that.itemTooltipBgEl.attr("visibility", "hidden");
			// }
			
			bar.append("title")
				.text(function(d) { return d.name; });
			
					
			bar.append("rect").attr('x', 1).attr("width", function(d) {
				return that.xScale(d.value);
			}).attr("height", that.showBarHeight).attr("class", function(d){
				if(d == that.selectBarItem){
					return 'bar-active';
				}else{
					return 'bar';
				}
			})
			.on('click', function(){
						that._down(that, arguments[0], arguments[1]);
					})
					.call(function(ev) {
						 if( ev == null || ev.length == 0 ){
							 return;
						 }
						 if( that.rememberPositionClickFn ){
							 var dom = null;
							 var list = ev[0];
							 for( var i = 0; i < list.length; i++ ){
								 dom = $(list[i]);
								 dom.on('remove', function(){ 
									 this.unbind('click'); 
									 this.unbind('mouseover');
								 });
								 dom.bind('click', function(ev) {
									var selectedElement = d3.select(this)[0][0].__data__;
									var sendData = {
											event: ev,
											data : selectedElement
										};
									that.rememberPositionClickFn(sendData);
									ev.stopPropagation();
								});
								 
							 }
						 }
						 if ( that.mouseOverFn ){
						 	var dom = null;
							 var list = ev[0];
							 for( var i = 0; i < list.length; i++ ){
								 dom = $(list[i]);
								 dom.on('remove', function(){ 
									 this.unbind('mouseover');
								 });
								 dom.bind('mouseover', function(ev) {
									 var selectedElement = angular.element(this);
									var tipOptions = {
											event: ev,
											targetCtnWidth: that.chartWidth,
											targetCtnHeight: that.chartHeight,
											position: {
												my: 'left center',
												at: 'center right'
											}
										};
									var contextMenuWidth = 200,
										annatitionBtnWidth = 30;
										
									if(ev.offsetX + contextMenuWidth > that.chartWidth - annatitionBtnWidth){
										tipOptions = {
											event: ev,
											targetCtnWidth: that.chartWidth,
											targetCtnHeight: that.chartHeight,
											position: {
												my: 'right center',
												at: 'center left'
											}
										};
										tipOptions.event.pageX -= 10;	
									}else{
										tipOptions = {
											event: ev,
											targetCtnWidth: that.chartWidth,
											targetCtnHeight: that.chartHeight,
											position: {
												my: 'left center',
												at: 'center right'
											}
										};
										tipOptions.event.pageX += 10;
									}
									
									that.mouseOverFn(selectedElement, tipOptions);
									ev.stopPropagation();
								});
							 }
						 }
					  });
			
			//fault -> hide, ooc, ocap -> show
			if(that.isShowSvgBtn){
				bar.append("use")
					.attr("xlink:href", function(d) {
						if(d == that.selectBarItem){
							return "#piechart-detail-btn-active";
						}else{
							return "#piechart-detail-btn";
						}
					})
					.attr("x", that.drawingWidth + 5)
					.attr("y", 0)
					.attr("width", that.showBarHeight)
					.attr("height", that.showBarHeight)
					.on("click", function(d){
						//0. set selectItem
						//1. select bar fill color -> reset
						//2. and, replace bar-active -> bar
						//3. search Element and replage bar -> bar-active
						//4. bar fill color change -> selectColor
						var activeRectEl = that.svg.select('.bar-active'),
							applyRectEl = $(this).parent().children('rect');
						that.selectBarItem = d;
						activeRectEl.style("fill", that.color(true)).attr("class", "bar");	//svg 		select.element
						applyRectEl.attr("class", "bar-active").css("fill", that._colorLuminance(that.color(true), -0.2));	//jquery 	select.element
					})
					.call(function(ev) {
						 if( ev == null || ev.length == 0 ){
							 return;
						 }
						 if( that.pieRefreshClickFn ){
							 var dom = null;
							 var list = ev[0];
							 for( var i = 0; i < list.length; i++ ){
								 dom = $(list[i]);
								 dom.on('remove', function(){ 
									 this.unbind('click'); 
								 });
								 dom.bind('click', function(ev) {
								 	var useEls = that.svg.selectAll('use')[0];
								 	for(var i = 0; i < useEls.length; i++){
								 		d3.select(useEls[i]).attr("xlink:href", "#piechart-detail-btn");
								 	}
								 	d3.select(ev.target).attr("xlink:href", "#piechart-detail-btn-active");
									var selectedElement = d3.select(this)[0][0].__data__;
									that.selectBarItem = selectedElement;
									var sendData = {
											event: ev,
											data : selectedElement
										};
									that.pieRefreshClickFn(sendData);
									ev.stopPropagation();
								});
							 }
						 }
					  });
			}
			
			
			if(that.leftTabsEl !== null){
				that.currentLeftTab.removeClass('active');
				that.currentLeftTab = $(that.leftTabsEl[d.depth + that.leftTabsDepth]);
				that.currentLeftTab.addClass('active');
			}
			return bar;
		},
		_stack:function(i){
			var that = this;
			if(that.isShowLog){
				console.log('lib - _stack');
			}
			var x0 = 0;
			return function(d) {
				var tx = "translate(" + x0 + "," + that.showBarHeight * i * 1.2 + ")";	//change
				x0 += that.xScale(d.value);
				return tx;
			};
		},
		_colorLuminance: function(hex, lum) {
			var that = this;
			if(that.isShowLog){
				console.log('lib - _colorLuminance');
			}
			// validate hex string
			hex = String(hex).replace(/[^0-9a-f]/gi, '');
			if (hex.length < 6) {
				hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
			}
			lum = lum || 0;
		
			// convert to decimal and change luminosity
			var rgb = "#", c, i;
			for (i = 0; i < 3; i++) {
				c = parseInt(hex.substr(i*2,2), 16);
				c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
				rgb += ("00"+c).substr(c.length);
			}
		
			return rgb;
		},
		// _showTooltip: function(evt){
			// var that = this;
			// if(that.isShowLog){
				// console.log('lib - _showTooltip');
			// }
			// console.log(evt);
		// },
		// _hideTooltip: function(){
			// if(that.isShowLog){
				// console.log('lib - _hideTooltip');
			// }
			// console.log('hidetooltip');
		// },
		extractData:function(chartData, depth, data){
			var that = this;
			if(that.isShowLog){
				console.log('lib - extractData');
			}
			// if(data.children == undefined || data.length == undefined)
				// return chartData;
				
			var MAX_DEPTH = 4;
				
		    var count = 0,
		        target = null;

		    if(depth > MAX_DEPTH){
		        depth = MAX_DEPTH;
		    }

		    if(depth < 0) {
		        depth = 0;
		    }
		    
		    if(depth === 0)
		    {
		        chartData = this.mergeData(chartData, data);
		    }else{

		        if(data.name){
		            count = data.children.length;
		            target = data.children;
		        }else{
		            count = data.length;   
		            target = data;
		        }
		        
		        for(var i = 0 ; i < count; i++){
		             this.extractData(chartData, depth - 1, target[i]);   
		        }
		    }
		    return chartData;
		},
		mergeData: function(arr, data){
			var that = this;
			if(that.isShowLog){
				console.log('lib - mergeData');
			}
			if(arr.children.length === 0){
		        arr.children.push(data);
		        return;
		    }

		    var isArrName = function(el, idx, arr){
		        if(el.name == data.name){
		            return el;
		        }else{
		            return false;
		        }
		     };
		    var target = arr.children.filter(isArrName);

		    if(data.value){
		        if(target.length > 0){
		            target[0].value += data.value;
		        }else{
		            arr.children.push(data);
		        }return;
		    }

		    if(target.length > 0){
		        for(var i=0; i < data.children.length; i++){
		            this.mergeData(target[0], data.children[i]);    
		        }
		    }else{
		        arr.children.push(data);
		    }
		    
		    return arr;
		},
		loadingChartData:function(depth){
			var that = this;
			
			if(that.isShowLog){
				console.log('lib - loadingChartData');
			}
			if( !that._isCreation ){
				return;
			}
			
			var chartData = {
				name: 'chart',
				children: []
			};
			
			if(that.isSampleData){
				that._setSampleData();
			}else{
				
			}
			
			that.chartData = that.extractData(chartData, depth, that.baseChartData);
			
			// that._drawBarSeries(that.extractData(chartData, depth, that.data));
			that._drawBarSeries(that.chartData);
			
			if(that.leftTabsEl !== null){
				that.leftTabsDepth = depth - 1;
				that.currentLeftTab.removeClass('active');
				that.currentLeftTab = $(that.leftTabsEl[that.leftTabsDepth]);
				that.currentLeftTab.addClass('active');
			}
		}
	};
	
	manageInst.fn.extend({ hierarchicalBarChart : HierarchicalBarChart });

})(manageInst);