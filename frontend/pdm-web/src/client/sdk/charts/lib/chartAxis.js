(function(window, d3) {
    'use strict';
    /*
    * Title : chart axis function
    * description : chart를 그리는 내부 변수중 필요한 변수를 지정해 주면 axis를 생성해준다.
    * parameter : axisConfig = { width = 넓이
                                 height = 높이
                                 svg = svg 객체
                                 config = chart를 구성하는 설정 정보 ( 에 : xField, style정보 - main selector를 나타내는 mainChartName, xaxisStyleName, yaxisStyleName )
                                 selector = axis가 그려져야 할 영역
                                 rowMax = max값
                                 rowMin = min값
                                 data = chart data
                                 xField = chart xField
                                 axisType = linear, ordinal, time
                                 resizeCallback = axis에 표현되는 데이터의 문자 길이가 길어서 margin에 설정 되어 있는 사이즈보다 커질 경우 word rap 기능 사용 후 resize 되어야 할 callback 지정.
    */

    var chartAxis = {
        applyAxisWithRangeBands : function ( chart ){//argument : chart의 internal 객체., zoom 이벤트가 없는 axis를 생성.
            var that = chart.chart_internal_val;
            var width = that.width - that.margin.left - that.margin.right,
                height = that.height - that.margin.top - that.margin.bottom,
                svg = that.svg.select('.'+that.selector),//기존에 만들어진 영역을 selection
                min = Infinity,
                max = -Infinity,
                xaxis = null,
                yaxis = null,
                boxwidth = width/that.data.length,
                labelPosition = 'normal';

            //min, max 설정.
            if (that.rowMax > max) max = that.rowMax;
            if (that.rowMin < min) min = that.rowMin;

            // setup x axis
            if( that.xScale == null || that.xScale == undefined ) that.xScale = d3.scale.ordinal();
            if( that.xAxis == null || that.xAxis == undefined ) that.xAxis = d3.svg.axis();

            //여기서 x축을 custom 가 rendering 해주려면 function을 받아서 처리 하게끔 한다.
            that.xScale.domain( that.data.map(function(d) { return d[chart.config.xField] } ) )
                       .rangeBands([0 , width], 0.1, 0.1);
                       //.rangeRoundBands([0 , width], 0.1, 0.1);
            that.xAxis.scale(that.xScale).orient('bottom');

            // setup y axis
            if( that.yScale == null || that.yScale == undefined ) that.yScale = d3.scale.linear();
            if( that.yAxis == null || that.yAxis == undefined ) that.yAxis = d3.svg.axis();

            that.yScale.domain([min, max])
                       .range([height + that.margin.top, 0 + that.margin.top]);
            that.yAxis.scale(that.yScale).orient('left');

            //draw axis
            //axis text setting
            xaxis = svg.select('g.'+chart.config.style_mainChartName+'.x.'+chart.config.style_xaxisStyleName);
            if( xaxis[0][0] == null ){//이미 설정이 되어 있다면 group을 생성하지 않는다.
                xaxis = svg.append('g')
                           .attr('class', chart.config.style_mainChartName+' x '+chart.config.style_xaxisStyleName)
                           .attr('transform', 'translate(0,' + (height  + that.margin.top + 10) + ')');
            }else{
                xaxis.attr('transform', 'translate(0,' + (height  + that.margin.top + 10) + ')');
            }
            xaxis.call(that.xAxis);

            //y axis text setting
            yaxis = svg.select('g.'+chart.config.style_mainChartName+'.x.'+chart.config.style_yaxisStyleName);
            if( yaxis[0][0] == null ){//이미 설정이 되어 있다면 group을 생성하지 않는다.
                yaxis = svg.append('g')
                           .attr('class', chart.config.style_mainChartName+' x '+chart.config.style_yaxisStyleName)
                           .attr('transform', 'translate(0,0)');
            }else{
                yaxis.attr('transform', 'translate(0,0)');
            }
            yaxis.call(that.yAxis);

            yaxis.append('text')
                 .attr('class', chart.config.style_yaxisTextClass)
                 .attr('x', 30)
                 .attr('y', 20)
                 .style('text-anchor', 'end')
                 .text(chart.config.yLabel);

            if( that.resizeCallback ) {
                var texts = xaxis.selectAll('text')
                                    .call(chartAxis.wrap, that.xScale.rangeBand(), that.margin, that.resizeCallback);
            }

            return chart;
        },
        applyAxisWithRangePoints : function ( chart, isTruncate ){//argument : chart의 internal 객체., zoom 이벤트가 없는 axis를 생성.
            var that = chart.chart_internal_val;
            var width = that.width - that.margin.left - that.margin.right,
                height = that.height - that.margin.top - that.margin.bottom,
                svg = that.svg.select('.'+that.selector),//기존에 만들어진 영역을 selection
                min = Infinity,
                max = -Infinity,
                xaxis = null,
                yaxis = null,
                boxwidth = width/that.data.length,
                formatValue = chart.config.yAxisFormat,//( chart.config.yAxisFormat ? chart.config.yAxisFormat : d3.format(".2s") ),
                labelPosition = 'normal';

            //min, max 설정.
            if (that.rowMax > max) max = that.rowMax;
            if (that.rowMin < min) min = that.rowMin;

            // setup x axis
            if( that.xScale == null || that.xScale == undefined ) that.xScale = d3.scale.ordinal();
            if( that.xAxis == null || that.xAxis == undefined ) that.xAxis = d3.svg.axis();

            //여기서 x축을 custom 가 rendering 해주려면 function을 받아서 처리 하게끔 한다.
            that.xScale.domain( that.data.map(function(d) { return d[that.xField] } ) )
                       .rangePoints([0 , width],1);
                       //.rangeRoundBands([0 , width], 0.1, 0.1);
            that.xAxis.scale(that.xScale).orient('bottom').innerTickSize(5).outerTickSize(5);

            // setup y axis
            if( that.yScale == null || that.yScale == undefined ) that.yScale = d3.scale.linear();
            if( that.yAxis == null || that.yAxis == undefined ) that.yAxis = d3.svg.axis();

            that.yScale.domain([min, max])
                       .range([height + that.margin.top, 0 + that.margin.top]);
            that.yAxis.scale(that.yScale).orient('left').tickFormat(function(d) { return formatValue? formatValue(d): d});

            //draw axis
            //axis text setting
            xaxis = svg.select('g.'+chart.config.style_mainChartName+'.x.'+chart.config.style_xaxisStyleName);
            if( xaxis[0][0] == null ){//이미 설정이 되어 있다면 group을 생성하지 않는다.
                xaxis = svg.append('g')
                           .attr('class', chart.config.style_mainChartName+' x '+chart.config.style_xaxisStyleName)
                           .attr('transform', 'translate(0,' + (height  + that.margin.top) + ')');
                svg.append("text")
                    .attr('class', chart.config.style_xaxisTextClass)
                    .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
                    .attr("transform", "translate("+ (width/2) +","+(that.height-that.margin.bottom+30)+")")  // centre below axis
                    .text(chart.config.xLabel ? chart.config.xLabel:'');
            }else{
                xaxis.attr('transform', 'translate(0,' + (height  + that.margin.top) + ')');
                svg.select('text.'+chart.config.style_xaxisTextClass)
                     .attr("transform", "translate("+ (width/2) +","+(that.height-that.margin.bottom+30)+")")  // centre below axis
            }

            xaxis.call(that.xAxis);
            //텍스트가 많아서 겹치는 경우에는 겹치는 텍스트는 출력을 안함.
            if( isTruncate ){
                var xAxisMaxWidth = 0,
                    xAxisTextCount = 0;
                //이때 aixs text의 최고 넓이를 설정해 준다. 안해주면 텍스트의 길이가 각기 다 다르므로 일정 넓이를 구할 수 없음.
                xaxis.selectAll('text').text(function ( d, i ) {
                    xAxisTextCount++;
                    var thisWidth = d3.select(this).node().getBoundingClientRect().width;
                    if( xAxisMaxWidth < thisWidth ) xAxisMaxWidth = thisWidth;
                    return d;
                });
               
                //라벨의 길이가 차트너비의 반을 넘어설 경우, 하나만 표시                
                if( xAxisMaxWidth > width / 2 ){
                    xaxis.selectAll('text')
                        .text(function( d, i ) {
                            var returnValue = d;
                            
                            if( i !== 0 ) returnValue = '';

                            return returnValue;
                        })
                        .style('text-anchor', function( d, i ){
                            if( i == 0 ) {
                                return 'start';
                            }
                        })

                    svg.select('text.'+chart.config.style_xaxisTextClass)
                     .attr("transform", "translate("+ (width/2) +","+(that.height-that.margin.bottom+30)+")")  // centre below axis

                }else {
                    xaxis.selectAll('text')
                        .text(function ( d, i ){
                            var returnValue = d;
                    if( xAxisMaxWidth-5 > boxwidth ) {//-5 최소 사이즈와 최대 사이즈의 오차 범위.
                        var compare = Math.ceil( xAxisMaxWidth/boxwidth );
                        if( i%compare == 0 ){
                            returnValue = d;
                        }else{
                            returnValue = '';
                        }
                    }
                    if( xAxisTextCount === i-1 ) {
                                returnValue = '';
                            }

                    return returnValue;
                })
                .call(chartAxis.wrap, boxwidth, that.margin, undefined, that.paddingBottom, undefined, ',');

                svg.select('text.'+chart.config.style_xaxisTextClass)
                    .attr("transform", "translate("+ (width/2) +","+(that.height-that.margin.bottom+40)+")")  // centre below axis


                }       
            }

            //y axis text setting
            yaxis = svg.select('g.'+chart.config.style_mainChartName+'.y.'+chart.config.style_yaxisStyleName);
            if( chart.config.yAxisLabelPostion ) {
                labelPosition = chart.config.yAxisLabelPostion;
            }
            var labelX = -that.margin.left,
                labelY = -5,
                rotate = 0;
            if( labelPosition === 'middle' ) {
                labelY = -that.margin.left;
                labelX = -1*(height/2)-that.margin.bottom;
                rotate = -90;
            }
            if( yaxis[0][0] == null ){//이미 설정이 되어 있다면 group을 생성하지 않는다.
                yaxis = svg.append('g')
                           .attr('class', chart.config.style_mainChartName+' y '+chart.config.style_yaxisStyleName)
                           .attr('transform', 'translate(0,0)');
                yaxis.append('text')
                    .attr('class', chart.config.style_yaxisTextClass)
                    .attr('x', labelX)
                    .attr('y', labelY)
                    .attr("dy", "1em")
                    .attr("transform", "rotate("+rotate+")")
                    .style('text-anchor', 'start')
                    .text(chart.config.yLabel ? chart.config.yLabel:'');
            }else{
                yaxis.attr('transform', 'translate(0,0)');
                yaxis.selectAll('text.'+chart.config.style_yaxisTextClass)
                     .attr('x', labelX)
                     .attr('y', labelY)
                     .attr("transform", "rotate("+rotate+")")
                     .attr('class', chart.config.style_yaxisTextClass);
                if( labelPosition === 'middle' ) {
                    yaxis.selectAll('text.'+chart.config.style_yaxisTextClass)
                         .attr("dy", "1em");
                }
            }
            yaxis.call(that.yAxis);

            //if( yaxis.select( 'text.'+chart.config.style_yaxisTextClass ) )


            /*
            if( that.resizeCallback ) {
                var texts = xaxis.selectAll('text')
                                    .call(chartAxis.wrap, boxwidth, that.margin, that.resizeCallback, that.paddingBottom);
            }
            */
            return chart;
        },
        wrap : function (text, width, margin, callback, paddingBottom, isTruncate, splitWord) {//text : xaxis의 text list, width : axis의 사이즈, margin : 여백 json, target, callback : size변경시 처리할 callback
            var maxWidth = 20,
                compareWidth = width,
                tspanHeight = 0,
                tspanCnt = 0,
                tempTspanHeight = 0,
                tempTspanCnt = 0,
                truncate = false;//나머지 텍스트를 잘라내기 위한 여부.

            if( !splitWord ){
                splitWord = '';
            }
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
                    words = text.text().split(splitWord).reverse(),
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
                        tspan = text.append('tspan').attr('x', 0).attr('y', y).attr('dy', (++lineNumber * lineHeight + dy - lineHeight) + 'em').text(word);
                        tempTspanHeight = text.node().getBoundingClientRect().height;
                        tempTspanCnt++;
                    }
                    if( truncate && tempTspanCnt > 0 ){
                        break;
                    }
                }
            });
            // if( tempTspanHeight > tspanHeight  ) tspanHeight = tempTspanHeight;
            // if( tempTspanCnt > tspanCnt  ) tspanCnt = tempTspanCnt;
            // if( !truncate && tspanCnt > 1 ){
            //     if( margin.bottom == ( paddingBottom ? paddingBottom:0 )+tspanHeight+25 ) return;
            //     margin.bottom = ( paddingBottom ? paddingBottom:0 )+tspanHeight+25;
            //     if( callback ){
            //         callback();
            //     }
            // }else{
            //     margin.bottom = ( paddingBottom ? paddingBottom:0 )+tspanHeight+25;
            //     if( callback ){
            //         callback();
            //     }
            // }
        }
    }

    window.chartAxis = chartAxis;

})(window, window.d3);
