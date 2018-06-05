(function() {
    'use strict';
    d3.guideLine = function() {
        var width = 1,
            height = 1,
            target = null,
            guideData = null,
            margin = null,
            yScale = null,
            lineName = 'guide-line';//chart의 시리즈 넓이

        // For each small multiple…
        function guideLine(g) {

            if( target === null || target === undefined ) {
                return;
            }

            if( guideData !== null && guideData !== undefined ){
                drawLine( guideData );
            }

            function drawLine( data ) {
                var positionY = yScale( data['guide'] ),
                    positionStart = 0,
                    positionEnd = width;
                //line draw
                var checkLine = target.select('#'+lineName);
                if( checkLine[0][0] === null ) {
                    checkLine = target.append('line');
                }
                checkLine.attr('id',lineName)
                         .attr('x1', function(){
                              return positionStart;
                          })
                         .attr('y1', positionY)
                         .attr('x2', function(){
                              return positionEnd;
                          })
                         .attr('y2', positionY);
                /*
                var eventText = target.select('#guide-text');
                if( eventText[0][0] === null ) {
                    eventText = target.append('text')
                                      .attr('id', 'guide-text')
                                      .attr("dy", ".71em")
                                      .style('text-anchor', 'middle');
                }
                eventText.attr('x', positionStart+areaWidth/2)
                         .attr('y', positionTop-10)
                         .text(data['eventLabel']);
                */
            }

            d3.timer.flush();
        }

        guideLine.width = function(x) {
            if (!arguments.length) return width;
            width = x;
            return guideLine;
        };

        guideLine.height = function(x) {
            if (!arguments.length) return height;
            height = x;
            return guideLine;
        };

        guideLine.target = function(x) {
            if (!arguments.length) return target;
            target = x;
            return guideLine;
        };

        guideLine.guideData = function(x) {
            if (!arguments.length) return guideData;
            guideData = x;
            return guideLine;
        };

        guideLine.margin = function(x) {
            if (!arguments.length) return margin;
            margin = x;
            return guideLine;
        };

        guideLine.lineName = function(x) {
            if (!arguments.length) return lineName;
            lineName = x;
            return guideLine;
        };

        guideLine.yScale = function(x) {
            if (!arguments.length) return yScale;
            yScale = x;
            return guideLine;
        };

        return guideLine;
    };
})();
