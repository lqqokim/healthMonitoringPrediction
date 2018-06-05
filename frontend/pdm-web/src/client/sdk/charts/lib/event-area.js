(function() {
    'use strict';
    d3.eventArea = function() {
        var width = 1,
            height = 1,
            index = 0,
            target = null,
            areaTarget = null,
            lineTarget = null,
            eventData = null,
            margin = null,
            xScale = null,
            startField = null,
            endField = null,
            labelField = null,
            padding = 0,//chart의 여백 설정이 있을시에 설정
            showType = 'both',
            itemWidth = 0,
            labelRotation = 0,
            clickFn = undefined,
            overFn = undefined,
            outFn = undefined,
            textPositionFn = undefined;

        // For each small multiple…
        function eventArea(g) {

            if( target === null || target === undefined ) {
                return;
            }

            areaTarget = target.select('.event-area-group-'+index);
            //area group을 first child로 보내야 한다. 영역은 맨뒤로 보내야 차트 아이템을 click할 수 있음.
            if( areaTarget[0][0] === null ) {
                areaTarget = target.insert('g',':first-child').attr('class', 'event-area-group-'+index);
            }
            areaTarget.attr('transform', 'translate(' + ( margin ? margin.left:0 ) + ',' + ( margin ? margin.top:0 ) + ')');

            lineTarget = target.select('.event-line-group-'+index);
            //line group은 last child로 보내야 한다. 차트 아이템이 덮으면 라인을 볼 수 없음.
            if( lineTarget[0][0] === null ) {
                lineTarget = target.append('g').attr('class', 'event-line-group-'+index);
            }
            lineTarget.attr('transform', 'translate(' + ( margin ? margin.left:0 ) + ',' + ( margin ? margin.top:0 ) + ')');

            if( eventData !== null && eventData !== undefined ){
                if( eventData.data ) {
                    startField = eventData.startField;
                    endField = eventData.endField;
                    labelField = eventData.labelField;
                    for( var i = 0; i < eventData.data.length; i++ ) {
                        drawLine( i, eventData.data[i] );
                    }
                }
            }

            function drawLine( index, data ) {
                var positionTop = margin.top-5,
                    positionStart = 0,
                    positionEnd = 0,
                    //positionStart = xScale( data[startField] ) + padding,
                    //positionEnd = xScale( data[endField] ) + padding + itemWidth,
                    eventLabel = '';
                //data에 설정된 필드가 없다면 그리지 않는다.
                /*
                if( data[startField] === undefined || data[startField] === null ) {
                    return;
                }
                if( data[endField] === undefined || data[endField] === null ) {
                    return;
                }
                */
                if( labelRotation && labelRotation > 0 ) {
                    positionTop = 0;
                }
                var startData, endData;
                if( typeof startField === 'function' ) {//function field 중 우선순위는 function 이다.
                    startData = startField(data);
                }else{
                    startData = data[startField];
                }
                positionStart = xScale( startData ) + padding;

                //end가 없을 경우에는 start와 같은 값으로.
                if( endField ) {
                    if( typeof endField === 'function' ) {
                        endData = endField(data);
                    }else{
                        endData = data[endField];
                    }
                    positionEnd = xScale( endData ) + padding + itemWidth;
                }else{
                    positionEnd = positionStart;
                }

                if( typeof labelField === 'function' ) {
                    eventLabel = labelField(data);
                }else{
                    eventLabel = data[labelField];
                }
                if( positionStart < 0 ) {
                    positionStart = padding;
                }
                var areaWidth = ( positionEnd - positionStart ),
                    isVisible = true;
                if( areaWidth < 0 ) {
                    areaWidth = 0;
                    isVisible = false;
                }

                //start
                var checkLine = lineTarget.select('#start-line-'+index);
                if( checkLine[0][0] === null ) {
                    checkLine = lineTarget.append('line');
                }
                checkLine.attr('id','start-line-'+index)
                         .attr('class','start-line')
                         .attr('x1', function(){
                              return positionStart;
                          })
                         .attr('y1', positionTop)
                         .attr('x2', function(){
                              return positionStart;
                          })
                         .attr('y2', height)
                         .style('opacity', ( isVisible?1:0 ) );

                //area
                var checkArea = areaTarget.select('#area-'+index);
                if( checkArea[0][0] === null ) {
                    checkArea = areaTarget.append('rect');
                }
                checkArea.attr('x', positionStart)
                         .attr('y', positionTop)
                         .attr('id','area-'+index)
                         .attr('class','event-area')
                         .attr('width', areaWidth)
                         .attr('height', height-positionTop);

                var eventText = lineTarget.select('#event-'+index),
                    eventTextWidth = 0;
                if( eventText[0][0] === null ) {
                    eventText = lineTarget.append('text')
                                      .attr('class','event-text')
                                      .attr('id', 'event-'+index)
                                      .style('text-anchor', 'middle')
                                      .on('click', function(d, i) {
                                          if( clickFn ) {
                                             clickFn.call(this, data, index, true, d3.event);
                                          }
                                      });
                }
                var eventTextY = positionTop-10,
                    eventTextX = positionStart,
                    rotate = 0;
                if( labelRotation && labelRotation !== 0 ) {
                    eventTextY = -1*positionStart;
                    eventTextX = 0;//고정 값이 들어가야함.
                    rotate = labelRotation;
                }
                eventText.attr('x', eventTextX)
                         .attr('y', eventTextY)
                         .attr("transform", "rotate("+rotate+")")
                         .text(eventLabel)
                         .style('opacity', ( isVisible?1:0 ) );
                if( labelRotation && labelRotation > 0 ) {
                     eventText.style('text-anchor', 'start');
                }

                if( labelRotation && labelRotation > 0 ) {

                } else {
                     eventText.attr('x', positionStart+areaWidth/2);
                }

                var tooltip = d3.select("body").select('.d3-tooltip');
                if( tooltip[0][0] === null ){
                    tooltip = d3.select("body")
                                .append("div")
                                .attr("class", "d3-tooltip")
                                .style("position", "absolute")
                                .style("background-color", "#FFFFFF")
                                .style("z-index", "999")
                                .style("visibility", "hidden")
                                .text("a simple tooltip");
                }

                if ( isVisible ) {
                     if( areaWidth > 0 ) {
                         checkArea.on('click', function(d, i) {
                                      if( clickFn ) {
                                         clickFn.call(this, data, index, true, d3.event);
                                      }
                                  })
                                  .on("mouseover", function(d){
                                      if( overFn ){
                                          overFn.call(this, data, index, true, d3.event);
                                      }
                                  })
                                  .on("mouseout", function(){
                                      if( outFn ) {
                                          outFn.call(this, data, index, true, d3.event);
                                      }
                                      if( overFn ){
                                          return;
                                      }
                                      return tooltip.style("visibility", "hidden");});
                     }

                     eventText.on("mouseover", function(d){
                                     if( overFn ){
                                         overFn.call(this, data, index, true, d3.event);
                                         return;
                                     }
                                     tooltip.text(eventLabel);
                                     return tooltip.style("visibility", "visible");})
                              .on("mousemove", function(d){
                                     if( overFn ){
                                         overFn.call(this, data, index, true, d3.event);
                                         return;
                                     }
                                     var pageX = d3.event.pageX-Math.round($(tooltip[0]).width()/2)+10;
                                     if( $(document).width() < pageX ){
                                         pageX = d3.event.pageX-Math.round($(tooltip[0]).width());
                                     }
                                     return tooltip.style("top", (d3.event.pageY-25)+"px").style("left",(pageX)+"px");})
                              .on("mouseout", function(){
                                  if( outFn ) {
                                      outFn.call(this, data, index, true, d3.event);
                                  }
                                  if( overFn ){
                                      return;
                                  }
                                  return tooltip.style("visibility", "hidden");});
                }

                //start만 표시할 경우에는 나머지는 그리지 않는다.
                if( showType !== 'both' ){
                     return;
                }
                //end
                checkLine = lineTarget.select('#end-line-'+index);
                if( checkLine[0][0] === null ) {
                    checkLine = lineTarget.append('line');

                }
                checkLine.attr('id','end-line-'+index)
                         .attr('class','end-line')
                         .attr('x1', function(){
                              return positionEnd;
                          })
                         .attr('y1', positionTop)
                         .attr('x2', function(){
                              return positionEnd;
                          })
                         .attr('y2', height)
                         .style('opacity', ( isVisible?1:0 ) );
                if( areaWidth === 0 ) {
                    checkLine.on("mouseover", function(d){
                                     if( overFn ){
                                         overFn.call(this, data, index, true, d3.event);
                                         return;
                                     }
                                     tooltip.text(eventLabel);
                                     return tooltip.style("visibility", "visible");})
                              .on("mousemove", function(d){
                                     if( overFn ){
                                         return;
                                     }
                                     var pageX = d3.event.pageX-Math.round($(tooltip[0]).width()/2)+10;
                                     if( $(document).width() < pageX ){
                                         pageX = d3.event.pageX-Math.round($(tooltip[0]).width());
                                     }
                                     return tooltip.style("top", (d3.event.pageY-25)+"px").style("left",(pageX)+"px");})
                              .on("mouseout", function(){
                                  if( outFn ) {
                                      outFn.call(this, data, index, true, d3.event);
                                  }
                                  if( overFn ){
                                      return;
                                  }
                                  return tooltip.style("visibility", "hidden");});
                }
            }

            d3.timer.flush();
        }

        eventArea.width = function(x) {
            if (!arguments.length) return width;
            width = x;
            return eventArea;
        };

        eventArea.height = function(x) {
            if (!arguments.length) return height;
            height = x;
            return eventArea;
        };

        eventArea.target = function(x) {
            if (!arguments.length) return target;
            target = x;
            return eventArea;
        };

        eventArea.eventData = function(x) {
            if (!arguments.length) return eventData;
            eventData = x;
            return eventArea;
        };

        eventArea.margin = function(x) {
            if (!arguments.length) return margin;
            margin = x;
            return eventArea;
        };

        eventArea.xScale = function(x) {
            if (!arguments.length) return xScale;
            xScale = x;
            return eventArea;
        };

        eventArea.padding = function(x) {
            if (!arguments.length) return padding;
            padding = x;
            return eventArea;
        };

        eventArea.itemWidth = function(x) {
            if (!arguments.length) return itemWidth;
            itemWidth = x;
            return eventArea;
        };

        eventArea.labelRotation = function(x) {
            if (!arguments.length) return labelRotation;
            labelRotation = x;
            return eventArea;
        };

        eventArea.showType = function(x) {
            if (!arguments.length) return showType;
            showType = x;
            return eventArea;
        };

        eventArea.clickFn = function(x) {
            if (!arguments.length) return clickFn;
            clickFn = x;
            return eventArea;
        }

        eventArea.overFn = function(x) {
            if (!arguments.length) return overFn;
            overFn = x;
            return eventArea;
        }

        eventArea.outFn = function(x) {
            if (!arguments.length) return outFn;
            outFn = x;
            return eventArea;
        }

        eventArea.setTextPosition = function(e) {
            var scrollY = e.currentTarget.scrollTop;
            var eventText = lineTarget.select('#event-'+index),
                eventTextWidth = 0;
            if( eventText[0][0] === null ) {
                eventText = lineTarget.append('text')
                                  .attr('class','event-text')
                                  .attr('id', 'event-'+index)
                                  .style('text-anchor', 'middle')
                                  .on('click', function(d, i) {
                                      if( clickFn ) {
                                         clickFn.call(this, data, index, true, d3.event);
                                      }
                                  });
            }
            var eventTextY = positionTop-10+scrollY,
                eventTextX = positionStart,
                rotate = 0;
            if( labelRotation && labelRotation !== 0 ) {
                eventTextY = -1*positionStart;
                eventTextX = 0;//고정 값이 들어가야함.
                rotate = labelRotation;
            }
            eventText.attr('y', eventTextY);
        }

        return eventArea;
    };
})();
