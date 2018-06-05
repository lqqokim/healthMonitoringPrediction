(function() {
    'use strict';
    d3.guideArea = function() {
        var width = 1,
            height = 1,
            index = 0,
            target = null,
            areaTarget = null,
            lineTarget = null,
            margin = null,
            xData = null,//['start','end','up:false or down:true','label']
            xScale = null,
            yData = null,//['start','end','up:false or down:true','label']
            yScale = null,
            padding = 0,//chart의 여백 설정이 있을시에 설정
            itemWidth = 0,//영역을 표시할 경우 rect의 width
            itemHeight = 0,//영역을 표시할 경우 rect의 height
            labelRotation = 0,
            clickFn = null,
            isArea = true;

        var areaWidth = 0,
            areaHeight = 0,
            areaX = 0,//x라인의 end, end가 없으면 x라인의 start
            areaY = 0,//y라인의 end, end가 없으면 y라인의 start
            isLowerX = false,//x 값의 하한 여부. (예 : < 17 이면 설졍된 x값보다 하위로 영역이 표시되어야 함.) default : false
            isLowerY = false;//y 값의 하한 여부. (예 : < 17 이면 설졍된 y값보다 하위로 영역이 표시되어야 함.) default : false

        // For each small multiple…
        function guideArea(g) {

            if( target === null || target === undefined ) {
                return;
            }

            areaTarget = target.select('.guide-area-group-'+index);
            //area group을 first child로 보내야 한다. 영역은 맨뒤로 보내야 차트 아이템을 click할 수 있음.
            if( areaTarget[0][0] === null ) {
                areaTarget = target.insert('g',':first-child').attr('class', 'guide-area-group-'+index);
            }
            areaTarget.attr('transform', 'translate(' + ( margin ? margin.left:0 ) + ',' + ( margin ? margin.top:0 ) + ')');

            lineTarget = target.select('.guide-line-group-'+index);
            //line group은 last child로 보내야 한다. 차트 아이템이 덮으면 라인을 볼 수 없음.
            if( lineTarget[0][0] === null ) {
                lineTarget = target.append('g').attr('class', 'guide-line-group-'+index);
            }
            lineTarget.attr('transform', 'translate(' + ( margin ? margin.left:0 ) + ',' + ( margin ? margin.top:0 ) + ')');

            if( xData !== null && xData !== undefined && xData.length > 0 ){
                drawLine( xData, xScale, 'x' );
            }

            if( yData !== null && yData !== undefined && yData.length > 0 ){
                drawLine( yData, yScale, 'y' );
            }

            function drawLine( data, scale, type ) {
                var positionTop = 0,
                    positionStart = undefined,
                    positionEnd = undefined,
                    label = undefined,
                    className = undefined;

                if( data !== undefined && data !== null ){
                    if( data[0] ) {
                        positionStart = scale( data[0] );
                        if( type === 'y' ){
                                if( data[2] ) {
                                    isLowerY = data[2];
                            }
                            /*
                            if( isLower ) {
                                areaY = positionStart;
                                areaHeight = height - areaY;
                            }
                            */
                              if( data[0] && data[1] ) {
                                    //isLowerY = false;
                                if( isLowerY === false ) {//상한 설정.
                                    areaY = positionStart;
                                    areaHeight = height - areaY;
                                } else {//하한 설정.
                                    areaY = height;
                                    areaHeight = height - areaY;
                                }
                              } else {
                                if( isLowerY === false ) {//상한 설정.
                                    areaY = 0;
                                    areaHeight = positionStart;
                                } else {
                                    areaY = positionStart;
                                    areaHeight = height - positionStart;
                                }
                              }
                        }
                        if( type === 'x' ){
                                if( data[2] ) {
                                    isLowerX = data[2];
                            }
                            if( data[0] && data[1] ) {//구간이 정해지면 false로
                                    isLowerX = false;
                            }
                            if( isLowerX === false ) {
                                    areaX = positionStart;//+1은 line을 보이게 하려고
                                    areaWidth = width - areaX;
                            } else {
                                    areaX = 0;//+1은 line을 보이게 하려고
                                    areaWidth = positionStart;//-1은 line을 보이게 하려고
                            }

                        }
                    }
                    if( data[1] !== undefined && data[1] !== null ) {
                        positionEnd = scale( data[1] );
                        if( type === 'y' ){
                                if( isLowerX === false ) {

                            } else {

                            }
                            areaY = positionEnd;
                            areaHeight = positionStart - positionEnd;
                        }
                        if( type === 'x' ){
                              areaWidth = positionEnd - positionStart;//-1은 line을 보이게 하려고
                        }
                    }
                    if( data[3] ) {
                        label = data[3];
                    }
                    if( data[4] ) {
                        className = data[4];
                    }
                }

                if( positionStart < 0 ) {
                    positionStart = 0;
                }

                //start
                var checkLine = lineTarget.select('#guide-'+type+'-start-line');
                if( checkLine[0][0] === null ) {
                    checkLine = lineTarget.append('line');
                }
                //type에 attr의 항목이 바뀜. x축과 y축의 좌표 때문.
                checkLine.attr('id','guide-'+type+'-start-line')
                         .attr('class', className ? className:'guide-'+type+'-start-line')
                         .attr('x1', function(){
                             var returnValue = ( type === 'x'?positionStart:positionTop );
                             if( type === 'x' && returnValue < 0 ) {
                                 returnValue = 0;
                             }
                             if( type === 'x' && returnValue > width ) {
                                 returnValue = width;
                             }
                             return returnValue;
                          })
                         .attr('y1', ( type === 'x'?positionTop:positionStart ))
                         .attr('x2', function(){
                             var returnValue = ( type === 'x'?positionStart:width );
                             if( type === 'x' && returnValue < 0 ) {
                                 returnValue = 0;
                             }
                             if( type === 'x' && returnValue > width ) {
                                 returnValue = width;
                             }
                             return returnValue;
                          })
                         .attr('y2', ( type === 'x'?height:positionStart ));
                         //.style('opacity', ( isVisible?1:0 ) );
                //end
                if( positionEnd ) {
                    checkLine = lineTarget.select('#guide-'+type+'-end-line');
                    if( checkLine[0][0] === null ) {
                        checkLine = lineTarget.append('line');

                    }
                    checkLine.attr('id','guide-'+type+'-end-line')
                             .attr('class', className ? className:'guide-'+type+'-end-line')
                             .attr('x1', function(){
                                var returnValue = ( type === 'x'? positionEnd:positionTop );
                                if( type === 'x' && returnValue > width ) {
                                    returnValue = width;
                                }
                                return returnValue;
                              })
                             .attr('y1', ( type === 'x'? positionTop:positionEnd ))
                             .attr('x2', function(){
                                var returnValue = ( type === 'x'? positionEnd:width );
                                if( type === 'x' && returnValue > width ) {
                                    returnValue = width;
                                }
                                return returnValue;
                              })
                             .attr('y2', ( type === 'x'? height:positionEnd ));
                             //.style('opacity', ( isVisible?1:0 ) );
                }

                if( isArea ) {
                   /*
                    if( areaWidth === 0 ) {//x축 설정이 되어 있지 않아 넓이가 0으로 되었을 시.
                        areaWidth = width;
                    }
                    if( areaWidth < 0 ) {//x축 설정이 되어 있지 않아 넓이가 0으로 되었을 시.
                        areaWidth = 0;
                    }
                    if( areaHeight < 0 ){
                        areaHeight = 0;
                    }
                    if( areaWidth > width ) {//x축 설정이 되어 있지 않아 넓이가 0으로 되었을 시.
                        areaWidth = width - ( areaX < 0? 0 : areaX);
                    }
                    if( areaHeight > height ) {
                        areaHeight = height;
                    }
                    if( isLowerX && areaHeight < scale(data[0]) ){//over 하는 범위 이므로 0
                        areaHeight = 0;
                    }

                    //area
                    var checkArea = areaTarget.select('#guide-area');
                    if( checkArea[0][0] === null ) {
                        checkArea = areaTarget.append('rect');
                    }
                    checkArea.attr('x', areaX < 0? 0:areaX )
                             .attr('y', areaY < 0? 0:areaY)
                             .attr('id','guide-area')
                             .attr('class', className ? className:'guide-area')
                             .attr('width', areaWidth)
                             .attr('height', areaHeight);
                    */
                    //console.log(type, '==>', data, '( scale data : ', scale(data[0]), ') , areaWidth : ', areaWidth, ', areaHeight : ', areaHeight, ', areaX : ', areaX, ', areaY : ', areaY);
                    if( areaWidth === 0 ) {//x축 설정이 되어 있지 않아 넓이가 0으로 되었을 시.
                        areaWidth = width;
                    }
                    if( areaHeight === 0 ) {//y축 설정이 되어 있지 않아 높이가 0으로 되었을 시.
                        areaHeight = height;
                    }
                    if( areaWidth < 0 ) {//x축 설정이 되어 있지 않아 넓이가 0으로 되었을 시.
                        areaWidth = 0;
                    }
                    if( areaHeight < 0 ){
                        areaHeight = 0;
                    }
                    if( areaWidth > width ) {//x축 설정이 되어 있지 않아 넓이가 0으로 되었을 시.
                        areaWidth = width - ( areaX < 0? 0 : areaX);
                    }
                    var isOver = false;
                    if( type === 'y' && areaX > width ){//over 하는 범위 이므로 0
                        areaHeight = 0;
                    }
                    if( type === 'y' && areaX === 0 && areaHeight > height ) {//over 하는 범위 이므로 0
                        //areaHeight = 0;
                        //console.log( 'xData : ', xScale(xData[0]) );
                        if( xData && xScale(xData[0]) < 0 ) {//over 하는 범위 이므로 0
                            areaHeight = 0;
                        }
                    }
                    if( areaHeight > height ) {
                        areaHeight = height;
                    }

                    //area
                    var checkArea = areaTarget.select('#guide-area');
                    if( checkArea[0][0] === null ) {
                        checkArea = areaTarget.append('rect');
                    }
                    checkArea.attr('x', areaX < 0? 0:areaX )
                             .attr('y', areaY < 0? 0:areaY)
                             .attr('id','guide-area')
                             .attr('class', className ? className:'guide-area')
                             .attr('width', areaWidth)
                             .attr('height', areaHeight);
                    //console.log('areaWidth : ', areaWidth, ', areaHeight : ', areaHeight);
                    //console.log('===================================================================================');
                }
            }

            d3.timer.flush();
        };

        guideArea.index = function(x) {
            if (!arguments.length) return index;
            index = x;
            return guideArea;
        };

        guideArea.width = function(x) {
            if (!arguments.length) return width;
            width = x;
            return guideArea;
        };

        guideArea.height = function(x) {
            if (!arguments.length) return height;
            height = x;
            return guideArea;
        };

        guideArea.target = function(x) {
            if (!arguments.length) return target;
            target = x;
            return guideArea;
        };

        guideArea.margin = function(x) {
            if (!arguments.length) return margin;
            margin = x;
            return guideArea;
        };

        guideArea.xData = function(x) {
            if (!arguments.length) return xData;
            xData = x;
            return guideArea;
        };

        guideArea.xScale = function(x) {
            if (!arguments.length) return xScale;
            xScale = x;
            return guideArea;
        };

        guideArea.yScale = function(x) {
            if (!arguments.length) return yScale;
            yScale = x;
            return guideArea;
        };

        guideArea.yData = function(x) {
            if (!arguments.length) return yData;
            yData = x;
            return guideArea;
        };

        guideArea.padding = function(x) {
            if (!arguments.length) return padding;
            padding = x;
            return guideArea;
        };

        guideArea.labelRotation = function(x) {
            if (!arguments.length) return labelRotation;
            labelRotation = x;
            return guideArea;
        };

        guideArea.clickFn = function(x) {
            if (!arguments.length) return clickFn;
            clickFn = x;
            return guideArea;
        }

        guideArea.isArea = function(x) {
            if (!arguments.length) return isArea;
            isArea = x;
            return guideArea;
        }

        return guideArea;
    };
})();
