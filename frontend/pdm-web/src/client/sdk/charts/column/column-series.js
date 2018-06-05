(function() {
    'use strict';
    // Inspired by http://informationandvisualization.de/blog/box-plot
    d3.columnSeries = function() {
        var width = 1,
            height = 1,
            padding = 0,
            duration = 500,
            classname = 'column-series',
            colorfn = null,
            showLabels = true, // whether or not to show text labels
            selectrect = 'highlight',
            tickFormat = null,
            selectedIndex = '-1',
            seriesWidth = 0,
            xScale = null,
            yScale = null,
            xField = 'name',
            yField = 'value',
            groupField = null,
            isResize = false,
            chartData = null,
            columns = null;

        // For each small multiple…
        function columnSeries(g) {
            var sidePadding = 2;
            g.each( function(data, i) {
                var targetData = data,
                    g = d3.select(this);

                //cluster series 생성
                //groupField가 없으면 xField를 제외한 나머지 값의 number type의 값을 전부 셋팅한다.
                var clusterGroup = null;
                /*
                if( groupField === null || groupField === undefined ) {
                    clusterGroup = [];
                    for( var prop in targetData ){
                        if( !isNaN(+targetData[prop]) && !( targetData[prop] instanceof Date ) ){
                            clusterGroup.push(prop);//value가 number type만 골라낸다.
                        }
                        groupField = 'group';
                    }
                    //column group을 chart data에 생성한다.
                    if( chartData ) {
                        chartData.forEach(function(d) {
                            //child data parse
                            d['group'] = clusterGroup.map(function(name) {
                                var returnData = {};
                                    returnData[xField] = name,
                                    returnData[yField] = +d[name];
                                return returnData; });
                        });
                    }
                }
                */
                if( groupField === null || groupField === undefined ) {
                    groupField = [];
                    if( columns === null || columns.length === 0 ){
                        for( var prop in targetData ){
                            if( !isNaN(+targetData[prop]) && !( targetData[prop] instanceof Date ) ){
                                groupField.push(prop);//value가 number type만 골라낸다.
                            }
                        }
                    }else{
                        //data가 json 타입이 아닌 array 타입임.
                        for( var i = 0; i < columns.length; i++ ){//0번째는 category
                            groupField.push(columns[i]);//value가 number type만 골라낸다.
                        }
                    }

                }
                isResize = false;//효과를 주기 위해서 test로 false 로 해놓음.
                //var rectWidth = xScale.rangeBand()-padding-(sidePadding*2);//series 하나의 사이즈.
                var rectWidth = xScale.rangeBand(),
                    isCustomPostion = false;
                if( seriesWidth !== null && seriesWidth < rectWidth ){
                    rectWidth = seriesWidth;
                    isCustomPostion = true;
                }

                var rects = g.selectAll("rect.column-item")
                             .data(function(d) {
                                 var returnArray = [],
                                     returnObj = null,
                                     name = "";
                                 for( var i = 0; i < groupField.length; i++ ) {
                                     name = groupField[i];
                                     returnObj = {};
                                     returnObj[xField] = name,
                                     returnObj[yField] = +d[name];
                                     returnArray.push(returnObj);
                                 }
                                 return returnArray;
                             });
                rects.enter().append("rect");

                rects.attr("x", function(d,i) {
                                    var datavalue = d[xField],
                                        xscalevalue = xScale(d[xField]);
                                        if( isCustomPostion ){
                                            xscalevalue = xscalevalue + xScale.rangeBand()/2 - seriesWidth/2;
                                        }
                                        //xvalue = xscalevalue+(padding/2)+sidePadding;
                                    return xscalevalue;})
                    .attr("y", height)
                    .attr("width", 0)
                    .attr("height", 0);

                rects.transition()
                     .duration( isResize? 0:1000 )
                     .attr('class','column-item')
                     .attr("width", rectWidth)
                     .attr("x", function(d,i) {
                         var datavalue = d[xField],
                             xscalevalue = xScale(d[xField]);
                             if( isCustomPostion ){
                                 xscalevalue = xscalevalue + xScale.rangeBand()/2 - seriesWidth/2;
                             }
                             //xvalue = xscalevalue+(padding/2)+sidePadding;
                         return xscalevalue;})
                     .attr("y", function(d,i) { return yScale(d[yField]); })
                     .attr("height", function(d) {
                                         return height - yScale(d[yField])-1; });
                    /*
                     .style("fill", function(d, i) {
                                        var returnFill = '#000';
                                        if( colorfn !== undefined &&
                                            colorfn !== null ){
                                            returnFill = colorfn( d, i );
                                        }
                                        return returnFill;})
                     .style("stroke-width", 1)
                     .style("stroke", function(d, i) {
                                       var returnFill = '#000';
                                       if( colorfn !== undefined &&
                                           colorfn !== null ){
                                           returnFill = colorfn( d, i );
                                       }
                                       return returnFill;});
                    */
                rects.exit().remove();

                //해당 series의 영역을 클릭해도 클릭 이벤트가 일어나게 하기 위함.
                var background = g.select('.column-series-background');
                if( background[0][0] == null ){
                    background = g.append('rect')
                                  .attr('class','column-series-background');
                                  /*
                                  .style('fill','#fff')
                                  .style('opacity',0);
                                  */
                }
                background.attr('width', width)
                          .attr('height', height);

            });
            d3.timer.flush();
        }

        columnSeries.width = function(x) {
            if (!arguments.length) return width;
            width = x;
            return columnSeries;
        };

        columnSeries.height = function(x) {
            if (!arguments.length) return height;
            height = x;
            return columnSeries;
        };

        columnSeries.padding = function(x) {
            if (!arguments.length) return padding;
            padding = x;
            return columnSeries;
        };

        columnSeries.tickFormat = function(x) {
            if (!arguments.length) return tickFormat;
            tickFormat = x;
            return columnSeries;
        };

        columnSeries.groupField = function(x) {
            if (!arguments.length) return groupField;
            groupField = x;
            return columnSeries;
        };

        columnSeries.duration = function(x) {
            if (!arguments.length) return duration;
            duration = x;
            return columnSeries;
        };

        columnSeries.showLabels = function(x) {
            if (!arguments.length) return showLabels;
            showLabels = x;
            return columnSeries;
        };

        columnSeries.colorfn = function(x) {
            if (!arguments.length) return colorfn;
            colorfn = x;
            return columnSeries;
        };

        columnSeries.classname = function(x) {
            if (!arguments.length) return classname;
            classname = x;
            return columnSeries;
        };

        columnSeries.xScale = function(x) {
            if (!arguments.length) return xScale;
            xScale = x;
            return columnSeries;
        };

        columnSeries.yScale = function(x) {
            if (!arguments.length) return yScale;
            yScale = x;
            return columnSeries;
        };

        columnSeries.chartData = function(x) {
            if (!arguments.length) return chartData;
            chartData = x;
            return columnSeries;
        };

        columnSeries.seriesWidth = function(x) {
            if (!arguments.length) return seriesWidth;
            seriesWidth = x;
            return columnSeries;
        };

        columnSeries.columns = function(x) {
            if (!arguments.length) return columns;
            columns = x;
            return columnSeries;
        };

        columnSeries.isResize = function(x) {
            if (!arguments.length) return isResize;
            isResize = x;
            return columnSeries;
        };

        columnSeries.setHighlight = function( target ) {
            var g = target;

            var selected = target.attr('selected'),
                box = g.selectAll('rect.column-item'),
                background = g.select('rect.column-series-background');
            if( selected == 'N' ){//선택 event
                var prevcolor = box.style('fill'),
                    newcolor = chartStyleUtil.colorLuminance( prevcolor, -0.4 );
                box.attr('prevfill', prevcolor);
                box.style('fill', newcolor);
                background.classed('active', true);
                //background.style('fill', '#ccc');
                //background.style('opacity', 0.5);
                selectedIndex = target.attr('index');
            }else{
                selectedIndex = '-1';
                var prevcolor = box.attr('prevfill');
                box.style('fill', prevcolor);
                background.classed('active', false);
                //background.style('fill', '#fff');
                //background.style('opacity', 0);
            }
            target.attr('selected', selected == 'Y'?'N':'Y');
        }

        return columnSeries;
    };
})();
