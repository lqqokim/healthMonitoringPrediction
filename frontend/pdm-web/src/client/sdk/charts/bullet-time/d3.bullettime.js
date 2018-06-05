(function() {
    // Chart design based on the recommendations of Stephen Few. Implementation
    // based on the work of Clint Ivy, Jamie Love, and Jason Davies.
    // http://projects.instantcognition.com/protovis/bulletchart/
    'use strict';

    d3.bullettime = function() {
      var orient = 'bottom',
          reverse = true,
          vertical = true,
          ranges = _bulletRanges,
          markers = _bulletMarkers,
          measures = _bulletMeasures,
          width = 380,
          height = 30,
          sizeFactor = {
              measure: 1,
              marker: 1
          },
          xAxis = undefined,
          yAxis = undefined,
          start = _bulletStart,
          end = _bulletEnd,
          label = undefined,
          labelPosition = 'bottom',
          rangeColor = undefined,
          measureColor = undefined,
          markerColor = undefined,
          showTicks = false,
          animation = false,
          svg = null,
          overlay = true;

        // For each small multiple…
        function bullet(g) {
            var prevEndz = undefined;
            
            g.each(function(d, i) {
                var startz = xAxis(start.call(this, d, i));
                if (!overlay && prevEndz != null && prevEndz > startz) {
                    startz = prevEndz;
                }
                var endz = xAxis(end.call(this, d, i)),
                    rangez = ranges.call(this, d, i).slice().sort(d3.descending),
                    markerz = (markers.call(this, d, i) || []).slice().sort(d3.descending),
                    measurez = measures.call(this, d, i).slice().sort(d3.descending),
                    g = d3.select(this),
                    extentX,
                    extentY,
                    maxValue = yAxis.domain()[1],
                    timeRange = xAxis.domain(),
                    minTime = timeRange[0],
                    maxTime = timeRange[1],
                    x = startz,
                    y = yAxis(d3.max([d3.max(rangez), d3.max(measurez), d3.max(markerz)])),
                    widthz = endz - startz,
                    heightz = height - y;
                
                if (widthz < 0) {
                    return;
                }
                
                prevEndz = endz;

                var wrap = g.select('g.wrap');
                if (wrap.empty()) wrap = g.append('g').attr('class', 'wrap');

                extentY = yAxis(yAxis.domain()[0]) - y;
                extentX = startz;
                wrap.attr('width', endz - startz);
                wrap.attr('x', x);
                wrap.attr('y', y);

                // Update the range rects.
                var range = wrap.selectAll('rect.range')
                    .data(rangez);

                range.enter().append('rect')
                    .attr('class', function(d, i) { return 'range s' + i; })
                    .style('fill', typeof rangeColor === 'function' ? function(datum, i) { return rangeColor.call(this, datum, i, d); } : '')
                    .attr('width', widthz)
                    .attr('height', 0)
                    .attr('x', x)
                    .attr('y', height);

                (animation ? range.transition() : d3.transition(range))
                    .attr('y', _bulletY)
                    .attr('height', function(d, i) {
                        var yAxisValue = yAxis(d);
                        var returnValue = height - yAxisValue;
                        return returnValue; });

                // Update the measure rects.
                var measure = wrap.selectAll('rect.measure')
                    .data(measurez);

                measure.enter().append('rect')
                    .attr('class', function(d, i) { return 'measure s' + i; })
                    .style('fill', typeof measureColor === 'function' ? function(datum, i) { return measureColor.call(this, datum, i, d); } : '')
                    .attr('width', widthz / 3 * sizeFactor.measure)
                    .attr('height', 0)
                    .attr('x', startz + widthz / 3 * sizeFactor.measure)
                    .attr('y', height);

                (animation ? measure.transition() : d3.transition(measure))
                    .attr('height', function(d, i) {
                        var yAxisValue = yAxis(d);
                        var returnValue = height - yAxisValue;
                        return returnValue; })
                    .attr('y', _bulletY);

                if (markerz && markerz.length) {
                    // Update the marker lines.
                    var marker = wrap.selectAll('line.marker')
                        .data(markerz);

                    marker.enter().append('line')
                        .attr('class', 'marker')
                        .style('stroke', typeof markerColor === 'function' ? function(datum, i) { return markerColor.call(this, datum, i, d); } : '')
                        .attr('x1', startz + widthz / 6 * sizeFactor.marker)
                        .attr('x2', endz - widthz / 6 * sizeFactor.marker)
                        .attr('y1', height)
                        .attr('y2', height);

                    (animation ? marker.transition() : d3.transition(marker))
                        .attr('y1', _bulletY)
                        .attr('y2', _bulletY);
                }

                if (typeof label === 'function') {
                    var tooltip = d3.select("body").select('.d3-tooltip');
                    if( tooltip[0][0] === null ){
                        tooltip = d3.select("body")
                                    .append("div")
                                    .attr("class", "d3-tooltip")
                                    .style("position", "absolute")
                                    .style("z-index", "999")
                                    .style("visibility", "hidden")
                                    .text("a simple tooltip");
                    }

                    var labelTop;
                    switch(labelPosition) {
                        case 'middle':
                            labelTop = y + (height - y) / 2;
                            break;
                        case 'top'://TODO
                        case 'bottom':
                        default:
                            labelTop = height + (showTicks ? 35 : 20)
                            break;
                    }

                    var labelz = g.append('g')
                        .style('text-anchor', 'middle')
                        .attr('width', widthz)
                        .attr('transform', 'translate(' + (startz + widthz / 2) + ',' + labelTop + ')');

                    labelz.append('text')
                        .attr('class', 'label')
                        .text(label)
                        .on("mouseover", function(d){
                            var that = d3.select(this),
                                textNode = that.node(),
                                targetTxt = textNode.innerHTML;
                            if( targetTxt.lastIndexOf('...') === -1 ){
                                return;
                            }
                            tooltip.text(d.ppid);
                            return tooltip.style("visibility", "visible");})
                        .on("mousemove", function(d){
                            var pageX = d3.event.pageX-Math.round($(tooltip[0]).width()/2)+10;
                            if( $(document).width() < pageX ){
                                pageX = d3.event.pageX-Math.round($(tooltip[0]).width());
                            }
                            return tooltip.style("top", (d3.event.pageY+5)+"px").style("left",(pageX)+"px");})
                        .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

                    //text의 size가 길어서 다 표현이 안될시에 text box의 크기만큼 텍스트를 뿌려주고 나머지는 ...으로 표시한다.
                    var texts = labelz.selectAll('.label')
                                      .text(function(d){
                                          var that = d3.select(this),//현재 text가 출력되는 객체
                                              textWidth = Math.round(that.node().getBoundingClientRect().width),//text 박스의 넓이
                                              boxWidth = widthz,//chart 아이템의 넓이
                                              txt = label(d),//라벨
                                              oneCharWidth = Math.round(textWidth/txt.length);//text 하나당 길이
                                          if( boxWidth < textWidth ) {
                                              var textLength = Math.round(boxWidth/oneCharWidth)-2;
                                              if( textLength < 0 ){
                                                  textLength = 1;
                                              }
                                              txt = txt.substring(0,textLength)+'...';
                                              //txt = '';
                                          }
                                          return txt;
                                      });
                }
            });
            d3.timer.flush();
        }

        bullet.start = function(_) {
            if (!arguments.length) return start;
            start = _;
            return bullet;
        };

        bullet.end = function(_) {
            if (!arguments.length) return end;
            end = _;
            return bullet;
        };

        // ranges (bad, satissizeFactory, good)
        bullet.ranges = function(_) {
            if (!arguments.length) return ranges;
            ranges = _;
            return bullet;
        };

        // markers (previous, goal)
        bullet.markers = function(_) {
            if (!arguments.length) return markers;
            markers = _;
            return bullet;
        };

        // measures (actual, forecast)
        bullet.measures = function(_) {
            if (!arguments.length) return measures;
            measures = _;
            return bullet;
        };

        bullet.width = function(_) {
            if (!arguments.length) return width;
            width = _ < 0 ? 1 : +_;
            return bullet;
        };

        bullet.height = function(_) {
            if (!arguments.length) return height;
            height = _ < 0 ? 1 : +_;
            return bullet;
        };

        bullet.rangeColor = function(rColor) {
            if (!arguments.length) return rangeColor;
            if (!rColor) return bullet;
            rangeColor = rColor;
            return bullet;
        };

        bullet.measureColor = function(mColor) {
            if (!arguments.length) return measureColor;
            if (!mColor) return bullet;
            measureColor = mColor;
            return bullet;
        };

        bullet.markerColor = function(mColor) {
            if (!arguments.length) return markerColor;
            if (!mColor) return bullet;
            markerColor = mColor;
            return bullet;
        };

        bullet.xAxis = function(_, __) {
            if (!arguments.length) return xAxis;
            xAxis = _;
            showTicks = __;
            return bullet;
        };

        bullet.yAxis = function(_) {
            if (!arguments.length) return yAxis;
            yAxis = _;
            return bullet;
        };

        bullet.label = function(_) {
            if (!arguments.length) return label;
            label = _;
            return bullet;
        };

        bullet.labelPosition = function(_) {
            if (!arguments.length) return labelPosition;
            labelPosition = _;
            return bullet;
        }

        bullet.animation = function(_) {
            if (!arguments.length) return animation;
            animation = _;
            return bullet;
        };

        bullet.svg = function(_) {
            if (!arguments.length) return svg;
            svg = _;
            return bullet;
        };
        
        bullet.overlay = function(_) {
            if (!arguments.length) return overlay;
            overlay = _;
            return bullet;
        };
        
        bullet.sizeFactor = function(_) {
            if (!arguments.length) return sizeFactor;
            sizeFactor = _;
            return bullet;
        };

        function _bulletY(d) {
            return yAxis(d);
        }

        return d3.rebind(bullet);
    };

    function _bulletStart(d) {
        return d.start;
    }

    function _bulletEnd(d) {
        return d.end;
    }

    function _bulletRanges(d) {
        return d.ranges;
    }

    function _bulletMarkers(d) {
        return d.markers || [];
    }

    function _bulletMeasures(d) {
        return d.measures;
    }
})();
