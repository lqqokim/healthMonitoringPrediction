(function() {
    'use strict';
    d3.columnArea = function() {
        var width = 1,
            height = 1,
            target = null,
            periodData = null,
            actualField = 'actual',
            safeField = 'safe',
            warnField = 'warn',
            margin = null,
            xScale = null,
            yScale = null,
            padding = 0,//chart의 여백 설정이 있을시에 설정
            itemWidth = 0;//chart의 시리즈 넓이

        // For each small multiple…
        function columnArea(g) {

            if( target === null || target === undefined ) {
                return;
            }

            if( periodData !== null && periodData !== undefined ){
                for( var i = 0; i < periodData.length; i++ ) {
                    drawArea( i, periodData[i] );
                }
            }

            function drawArea( index, data ) {
                var positionTop = margin.top-5,
                    positionStart = xScale( data['startDtts'] ),
                    positionEnd = xScale( data['endDtts'] ),
                    areaWidth = ( positionEnd - positionStart );

                var areaText = target.select('#area-'+index);
                if( areaText[0][0] === null ) {
                    areaText = target.append('text')
                                      .attr('class','area-text')
                                      .attr('id', 'area-'+index)
                                      .style('text-anchor', 'middle');
                }
                areaText.attr('x', positionStart+areaWidth/2);

                var checkArea = target.select('#area-'+index);
                if( checkArea[0][0] === null ) {
                    checkArea = target.append('rect');
                }
                checkArea.attr('x', positionStart)
                         .attr('y', positionTop)
                         .attr('id','column-area-'+index)
                         .attr('class','column-area')
                         .attr('width', areaWidth)
                         .attr('height', height-positionTop);
            }

            d3.timer.flush();
        }

        columnArea.width = function(x) {
            if (!arguments.length) return width;
            width = x;
            return columnArea;
        };

        columnArea.height = function(x) {
            if (!arguments.length) return height;
            height = x;
            return columnArea;
        };

        columnArea.target = function(x) {
            if (!arguments.length) return target;
            target = x;
            return columnArea;
        };

        columnArea.periodData = function(x) {
            if (!arguments.length) return periodData;
            periodData = x;
            return columnArea;
        };

        columnArea.margin = function(x) {
            if (!arguments.length) return margin;
            margin = x;
            return columnArea;
        };

        columnArea.xScale = function(x) {
            if (!arguments.length) return xScale;
            xScale = x;
            return columnArea;
        };

        columnArea.padding = function(x) {
            if (!arguments.length) return padding;
            padding = x;
            return columnArea;
        };

        columnArea.itemWidth = function(x) {
            if (!arguments.length) return itemWidth;
            itemWidth = x;
            return columnArea;
        };

        columnArea.showType = function(x) {
            if (!arguments.length) return showType;
            showType = x;
            return columnArea;
        };

        return columnArea;
    };
})();
