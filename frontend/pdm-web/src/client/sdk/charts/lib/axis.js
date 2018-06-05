/**
 *
 * Title : chart axis function
 * description : chart를 svg에 타입에 따라 group (<g></g>) 을 생성하여 axis를 생성해준다.
 * parameter : {
 * 				 svg : ( svg 객체 ), //not null
 * 				 size : {
 * 					width : ,
 * 				 	height :
 * 				 },//not null
 * 				 margin ( json type { top:, bottom: , left:, right: } ) : ,//not null
 * 				 data : {
 * 					content : ,
 * 					field : ,
 * 					max : ,
 * 					min :
 * 				 },//not null
 * 				 axisType : ( x or y ),//nullable  --default : 'x'
 * 				 axisStyleName  : ( selector ),//nullable
 * 				 isTickVisible: true ( axis의 tick과 label을 출력 여부 ),//nullable
 * 				 tick : {
 * 					axisLabelClassName : ,
 * 				 	axisLabel : ,
 * 					tickFormat : tick format,
                    tickValues : ,
                    tickSize :
 * 				 },//nullable
 * 				 axisDomain : {
 * 				 	scaleType : ( normal : ordinal, date : date, number : linear ),
 * 				 	rangeType : ( range : range, rangeBands : rangeBands, rangePoints : rangePoints ),
 * 					range : ( scale의 range를 강제로 적용할 경우 ),
 * 				 	domain : ( 강제로 domain을 셋팅해줄경우 )
 * 				 },//nullable
                 transform: null,
 * 				 orient : 'top', 'bottom', 'left', 'right',//nullable
 * 				 isTruncate : ( axis label이 많을시 잘라내기 여부 ),//nullable
 * 				 resizeCallback : ( resize시 수행해야할 callback function ),//nullable
 *       		}
 *
 * sample code :
 *  var max = d3.max(chartData, function(d) { return d3.max(d.ages, function(d) { return d.value; }); }),
        min = 0;
    var yaxisObj = { svg : svg,
        axisStyleName  : 'column-chart',
        axisLabelClassName : 'column-chart-label',
        axisLabel : 'Population',
        tickFormat : d3.format(".2s"),
        width : 560,
        height : 400,
        axisType : 'y',
        scaleType : 'linear',
        rangeType : 'range',
        domain : [min, max],
        margin : margin,
        data : chartData,
        field : null,
        dataMax : max,
        dataMin : 0,
        orient : 'left',
        isTruncate : false,
        resizeCallback : null,
        isTickVisible: true };

    axisMaker.applyAxis(yaxisObj);
    y = yaxisObj.scale;
 */
(function(window, d3) {
    'use strict';

    var axisMaker = {
        applyAxis : function ( config ){
            var that = config;
            var width = that.size.width - ( that.margin? that.margin.left - that.margin.right:0 ),		//axis group width
                height = that.size.height - ( that.margin? that.margin.top - that.margin.bottom:0 ) ,	//axis group height
                svg = that.svg,													//svg
                dataSize = ( that.data.content? that.data.content.length : 0 ),			//data의 사이즈
                min = Infinity,													//data의 minimum
                max = -Infinity,												//data의 maximum
                axisLabel = null,                                               //axis label
                axisLabelRotate = false,                                        //axis label rotate
                axisClassName = 'x axis',										//axis stylename
                orient = 'bottom',												//axis의 position
                axisGroup = null,												//axis group <g></g>
                axis = null,													//axis 객체
                scale = null,													//scale 객체
                range = [0 , width],											//축의 range 설정
                isTickVisible = ( config.isTickVisible === false?false:true ),
                domainList = null;												//축의 domain 설정

            //min, max 설정.
            if ( that.data.max && that.data.max > max) max = that.data.max;
            if ( that.data.min && that.data.min < min) min = that.data.min;

            // setup axis range
            if( that.axisType === 'y' ) {
                range = [height, 15];
            }

            // setup custom range
            if( that.axisDomain.range !== null && that.axisDomain.range !== undefined ) {
                range = that.axisDomain.range;
            }

            //axis selector 및 style 정의.
            if( that.axisStyleName !== null && that.axisStyleName !== undefined ) {
                axisClassName = that.axisStyleName+' '+that.axisType+' axis';//x or y 공통스타일로 정의.
            }else{
                axisClassName = that.axisType+' axis';
            }

            //setup scale domain
            if( that['scale'] ) {//scale 정보가 있다면 가져온다.
                scale = that['scale'];
            }

            //type에 따른 scale 생성.
            if( that.axisDomain.scaleType === 'number' ) {
                domainList = [min, max];
                if( scale === null || scale === undefined ){//없다면 생성한다.
                    scale = d3.scale.linear();
                }
            } else if ( that.axisDomain.scaleType === 'normal' ) {
                domainList = that.data.content.map( function(d) { return d[that.data.field] } );
                if( scale === null || scale === undefined ){//없다면 생성한다.
                    scale = d3.scale.ordinal();
                }
            } else if ( that.axisDomain.scaleType === 'date' ) {
                //date일 경우에는 range가 좀 다르다.
                //range = [width/dataSize/2, width-width/dataSize/2];
                //domainList = d3.extent(that.data, function(d) { return d[that.data.field]; });
                domainList = [new Date(that.data.content[0][that.data.field]),
                              d3.time.day.offset(new Date(that.data.content[dataSize - 1][that.data.field]), 1)];
                if( scale === null || scale === undefined ){//없다면 생성한다.
                    scale = d3.time.scale();
                }
            }

            //custom domain이 있다면 셋팅한다.
            if( that.axisDomain.domain !== null && that.axisDomain.domain !== undefined ) {
                domainList = that.axisDomain.domain;
            }
            
            if (typeof that.tick.axisLabel === 'string') {
                axisLabel = that.tick.axisLabel;
            } else if (that.tick.axisLabel instanceof Object) {
                axisLabel = that.tick.axisLabel.text;
                axisLabelRotate = that.tick.axisLabel.rotate;
            }

            //axis 생성.
            if( that['axis'] ) {
                axis = that['axis'];
            }else{
                axis = d3.svg.axis();
            }

            //range 설정.
            //date 일 경우에는 range와 rangeRound만 가능.
            if( that.axisDomain.scaleType === 'date' &&
                !( that.axisDomain.rangeType === 'rangeRound' || that.axisDomain.rangeType === 'range' ) ){
                console.log('scaleType이 date 일 경우에는 range와 rangeRound만 가능합니다.');
            }
            if( that.axisDomain.rangeType === 'range' ) {
                scale.domain(domainList)
                         .range(range);
            } else if( that.axisDomain.rangeType === 'rangeRound' ) {
                scale.domain(domainList)
                         .rangeRound(range);
            } else if( that.axisDomain.rangeType === 'rangeBands' ) {
                scale.domain(domainList)
                         .rangeBands(range, .2, .1);
            } else if( that.axisDomain.rangeType === 'rangePoints' ) {
                scale.domain(domainList)
                         .rangePoints(range, 1);
            }
            that.scale = scale;

            //axis에 scale적용 및 위치 설정.
            if( that.orient !== null && that.orient !== undefined && that.orient !== "" ) {
                orient = that.orient;
            }
            axis.scale(scale).orient(orient);

            that.axis = axis;

            if( that.axisDomain.scaleType === 'date' ) {
                axis.ticks(d3.time.days, 1);
            }

            if( that.tick.tickValues !== undefined && that.tick.tickValues !== null ) {
                axis.tickValues(that.tick.tickValues);
            }

            if( that.tick.tickSize !== undefined && that.tick.tickSize !== null ) {
                axis.tickSize(that.tick.tickSize, that.tick.tickSize);
            }

            //tick format setup
            if( that.tick.tickFormat !== null && that.tick.tickFormat !== undefined ) {
                axis.tickFormat(that.tick.tickFormat);
            }

            //draw axis tick
            //axis text setting
            var translate = 'translate(0,' + (height) + ')';
            if( that.axisType === 'y' ) {
                //orient에 따라 변경이 되어야 함.
                translate = 'translate(0,0)';
            }

            if( that.transform !== null && that.transform !== undefined ) {
                translate = that.transform;
            }

            axisGroup = svg.select('g.'+that.axisStyleName+'.'+that.axisType+'.axis');
            if( axisGroup[0][0] == null ){//이미 설정이 되어 있다면 group을 생성하지 않는다.
                axisGroup = svg.append('g')
                                  .attr('class', axisClassName)
                                  .attr('transform', translate );
            }else{
                axisGroup.attr('transform', translate);
            }
            
            if( isTickVisible && axisGroup[0][0] != null ) {
                axisGroup.call(axis);
                
                if( that.resizeCallback !== null && that.resizeCallback !== undefined ) {
                    var itemWidth = 0;
                    if( that.axisDomain.scaleType === 'date' ) {
                        itemWidth = width/dataSize;
                    }else{
                        itemWidth = that.scale.rangeBand();
                    }
                    /*
                    var texts = axisGroup.selectAll('text')
                                        .call(axisMaker.wrap, itemWidth, that.margin, that.resizeCallback);
                    */
                }

                //텍스트가 많아서 겹치는 경우에는 겹치는 텍스트는 출력을 안함.
                if( that.isTruncate === true ){
                    var xAxisMaxWidth = 0,
                        yAxisMaxHeight = 0,
                        yAxisCnt = 0;
                    //이때 aixs text의 최고 넓이를 설정해 준다. 안해주면 텍스트의 길이가 각기 다 다르므로 일정 넓이를 구할 수 없음.
                    axisGroup.selectAll('text').text(function ( d, i ) {
                        d = d3.select(this).text();
                        var thisWidth = d3.select(this).node().getBoundingClientRect().width;
                        if( xAxisMaxWidth < thisWidth ) xAxisMaxWidth = thisWidth;
                        yAxisMaxHeight = d3.select(this).node().getBoundingClientRect().height;
                        yAxisCnt++;
                        return d;
                    });
                    if ( that.axisType === 'x' ) {
                        axisGroup.selectAll('text').text(function ( d, i ){
                            d = d3.select(this).text();
                            
                            var returnValue = d,
                                boxwidth = width/dataSize;
                            if( xAxisMaxWidth-5 > boxwidth ) {//-5 최소 사이즈와 최대 사이즈의 오차 범위.
                                var compare = Math.ceil( xAxisMaxWidth/boxwidth );
                                if( i%compare == 0 ){
                                    returnValue = d;
                                }else{
                                    returnValue = '';
                                }
                            }
                            return returnValue;
                        });
                    }else{
                        axisGroup.selectAll('text').text(function ( d, i ){
                            d = d3.select(this).text();
                            
                            var returnValue = d,
                                boxheight = height/yAxisCnt;
                            if( yAxisMaxHeight > boxheight ) {//-5 최소 사이즈와 최대 사이즈의 오차 범위.
                                //var compare = Math.ceil( yAxisMaxHeight/boxheight );
                                if( i%2 == 0 ){
                                    returnValue = d;
                                }else{
                                    returnValue = '';
                                }
                            }
                            return returnValue;
                        });
                    }
                }
                
                if( axisLabel != null ) {
                    var label = axisGroup.append('text')
                        .attr('class', that.tick.axisLabelClassName)
                        .attr('x', (that.margin.left*-1)+5)
                        .attr('y', -20)
                        .attr("dy", ".71em")
                        .style('text-anchor', 'start')
                        .text(axisLabel);
                    if (axisLabelRotate && that.axisType === 'y') {
                        var top = axisGroup.node().getBoundingClientRect().height / 2 - label.node().getBoundingClientRect().width / 2;
                        var left = axisGroup.node().getBoundingClientRect().width - label.node().getBoundingClientRect().height * 2 - 10;
                        label.attr('transform', 'rotate(-90), translate(' + -top + ', ' + -left + ')')
                    }
                }
                
                if( that.axisDomain.scaleType === 'date' ){
                    //tick의 좌표를 한칸씩 옮긴다.
                    axisGroup.selectAll('g.tick')
                             .attr('transform', function(d,i){
                                 var transform = d3.transform(d3.select(this).attr("transform"));
                                 return "translate("+( +transform.translate[0]+(width/dataSize/2) )+", 0)";
                             } )
                             .style('opacity', function(d, i){//마지막 라벨을 보이지 않게 하기 위함.
                                 var returnAlpha = 1;
                                 if( i === dataSize ){
                                     returnAlpha = 0;
                                 }
                                 return returnAlpha;
                             });
                }
            }
        },
        wrap : function (text, width, margin, callback, paddingBottom, isTruncate) {//text : xaxis의 text list, width : axis의 사이즈, margin : 여백 json, target, callback : size변경시 처리할 callback
            var maxWidth = 20,
                compareWidth = width,
                tspanHeight = 0,
                tspanCnt = 0,
                tempTspanHeight = 0,
                tempTspanCnt = 0,
                truncate = false;//나머지 텍스트를 잘라내기 위한 여부.
            if( isTruncate ){
                truncate = true;
            }
            /*
            //wrap이 잘 되는지 test
            if( maxWidth < compareWidth ){
                compareWidth = maxWidth;
            }
            */
            text.each(function() {
                tempTspanCnt = 1;
                var text = d3.select(this),
                    //words = text.text().split(/\s+/).reverse(),
                    words = text.text().split('').reverse(),
                    word,
                    line = [],
                    lineNumber = 0,
                    lineHeight = 1.1, // ems
                    y = text.attr('y'),
                    dy = parseFloat(text.attr('dy')),
                    tspan = text.text(null).append('tspan').attr('x', 0).attr('y', y).attr('dy', dy + 'em');
                while (word = words.pop()) {
                    line.push(word);
                    tspan.text(line.join(''));
                    if (tspan.node().getComputedTextLength() > compareWidth) {
                        line.pop();
                        tspan.text(line.join(''));
                        line = [word];
                        tspan = text.append('tspan').attr('x', 0).attr('y', y).attr('dy', ++lineNumber * lineHeight + dy + 'em').text(word);
                        tempTspanHeight = text.node().getBoundingClientRect().height;
                        tempTspanCnt++;
                    }
                    if( truncate && tempTspanCnt > 0 ){
                        break;
                    }
                }
            });
            if( tempTspanHeight > tspanHeight  ) tspanHeight = tempTspanHeight;
            if( tempTspanCnt > tspanCnt  ) tspanCnt = tempTspanCnt;
            if( !truncate && tspanCnt > 1 ){
                if( margin.bottom == ( paddingBottom ? paddingBottom:0 )+tspanHeight+25 ) return;
                margin.bottom = ( paddingBottom ? paddingBottom:0 )+tspanHeight+25;
                callback();
            }else{
                margin.bottom = ( paddingBottom ? paddingBottom:0 )+tspanHeight+25;
                callback();
            }
        }
    }

    window.axisMaker = axisMaker;

})(window, window.d3);
