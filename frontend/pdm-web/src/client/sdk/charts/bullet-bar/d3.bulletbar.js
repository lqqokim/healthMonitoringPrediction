(function() {
    // Chart design based on the recommendations of Stephen Few. Implementation
    // based on the work of Clint Ivy, Jamie Love, and Jason Davies.
    // http://projects.instantcognition.com/protovis/bulletchart/

    'use strict';

    d3.bulletbar = function() {
      var orient = 'left',
          reverse = false,
          vertical = false,
          ranges = bulletRanges,
          markers = bulletMarkers,
          measures = bulletMeasures,
          width = 380,
          height = 30,
          parentWidth = 50,
          xAxis = d3.svg.axis(),
          rangeColor = undefined,
          measureColor = undefined,
          markerColor = undefined,
          maxValue = 0,
          axisOption = {
              show: false,
              showType: 'label',
              sync: true,
              showTicks: false,
              showDataOnly: true,
              hidePath: true
          },
          labelFormat = d3.format(','),
          animation = false,
          axisObj = {
                          axisStyleName : 'bullet-axis',//nullable
                          data : {
                              content : null,
                              field : null,
                              max : null,
                              min : null
                          },//not null
                          axisType : 'x',//nullable  --default : 'x'
                          tick : {
                              axisLabelClassName : 'xaxis-label'
                          },//nullable
                          axisDomain : {
                              scaleType : 'number',
                              rangeType : 'range'
                          },//nullable
                          orient : 'bottom'
                     },
          margin = null;

        // For each small multiple…
        function bullet(g) {
            g.each(function(d, i) {

                var rangez = ranges.call(this, d, i).slice().sort(d3.descending),
                    markerz = (markers.call(this, d, i) || []).slice().sort(d3.descending),
                    measurez = measures.call(this, d, i).slice().sort(d3.descending),
                    g = d3.select(this),
                    extentX,
                    extentY,
                    axis,
                    verticalTopMargin = 0,
                    syncFactor = maxValue > 0 ? d3.max([d3.max(rangez), d3.max(measurez), d3.max(markerz)]) / maxValue : 1;

                var wrap = g.select('g.wrap');
                if (wrap.empty()) wrap = g.append('g').attr('class', 'wrap');

                if (vertical) {
                    extentX = height * syncFactor, extentY = width;
                    verticalTopMargin = height - extentX;
                    wrap.attr('transform', 'rotate(90)translate(' + verticalTopMargin + ',' + -((parentWidth + width) / 2) + ')');
                } else {
                    extentX = width * syncFactor, extentY = height;
                    wrap.attr('transform', 'translate('+ (orient === 'left' ? 0 : width - extentX) + ', ' + ((parentWidth - height) / 2) + ')')
                        .style(orient === 'left' ? 'left' : 'right', '0');
                }

                // Compute the new x-scale. 
                var x1 = d3.scale.linear()
                    .domain([0, Math.max(rangez[0], markerz.length ? markerz[0] : 0, measurez[0])])
                    .range(reverse ? [extentX, 0] : [0, extentX]);

                // Retrieve the old x-scale, if this is an update.
                var x0 = this.__chart__ || d3.scale.linear()
                    .domain([0, Infinity])
                    .range(x1.range()); 

                // Stash the new scale.
                this.__chart__ = x1;

                // Derive width-scales from the x-scales.
                var w0 = bulletWidth(x0),
                    w1 = bulletWidth(x1);

                // Update the range rects.
                var range = wrap.selectAll('rect.range')
                    .data(rangez);

                range.enter().append('rect')
                    .attr('class', function(d, i) { return 'range s' + i; })
                    .style('fill', typeof rangeColor === 'function' ? function(datum, i) { return rangeColor.call(this, datum, i, d); } : '')
                    .attr('width', w0)
                    .attr('height', function(d, i) { return d > 0 ? extentY : 0 })
                    .attr('x', reverse ? x0 : 0);

                (animation ? range.transition() : d3.transition(range))
                    .attr('x', reverse ? x1 : 0)
                    .attr('width', w1)
                    .attr('height', function(d, i) { return d > 0 ? extentY : 0 });

                // Update the measure rects.
                var measure = wrap.selectAll('rect.measure')
                    .data(measurez);

                measure.enter().append('rect')
                    .attr('class', function(d, i) { return 'measure s' + i; })
                    .style('fill', typeof measureColor === 'function' ? function(datum, i) { return measureColor.call(this, datum, i, d); } : '')
                    .attr('width', w0)
                    .attr('height', extentY / 2)
                    .attr('x', reverse ? x0 : 0)
                    .attr('y', extentY / 4);

                (animation ? measure.transition() : d3.transition(measure))
                    .attr('width', w1)
                    .attr('height', extentY / 2)
                    .attr('x', reverse ? x1 : 0)
                    .attr('y', extentY / 4);

                if (markerz && markerz.length) {
                    // Update the marker lines.
                    var marker = wrap.selectAll('line.marker')
                        .data(markerz);

                    marker.enter().append('line')
                        .attr('class', 'marker')
                        .style('stroke', typeof markerColor === 'function' ? function(datum, i) { return markerColor.call(this, datum, i, d); } : '')
                        .attr('x1', x0)
                        .attr('x2', x0)
                        .attr('y1', extentY / 6)
                        .attr('y2', extentY * 5 / 6);

                    (animation ? marker.transition() : d3.transition(marker))
                        .attr('x1', x1)
                        .attr('x2', x1)
                        .attr('y1', extentY / 6)
                        .attr('y2', extentY * 5 / 6);
                }

                if (axisOption.show) {
                    if (axisOption.showType === 'axis') {
                        //axis setup
                        var axis = g;
                        axisObj.svg = axis,
                        axisObj.isTickVisible = true,
                        //axisObj.axisStyleName = vertical ? 'yaxis' : 'xaxis',
                        axisObj.axisType = vertical ? 'y' : 'x',
                        axisObj.tick.axisLabelClassName = 'axis-label',
                        axisObj.orient = 'left',
                        axisObj.size = {
                            width : vertical ? height : width,
                            height : vertical ? width : height
                        },
                        axisObj.margin = margin,
                        axisObj.axisDomain.scaleType = 'number',
                        axisObj.axisDomain.domain = [0, Math.max(rangez[0], markerz.length ? markerz[0] : 0, measurez[0])],
                        axisObj.axisDomain.range = ( reverse ? [extentX, 0] : [0, extentX] );
                        axisObj.transform = ( vertical ? 'translate(' + ((parentWidth - width) / 2) + ',' + verticalTopMargin + ')' : 'translate(0,' + (extentY + height / 3 * 2) + ')' );

                        //xAxis.scale(x1);
                        if (axisOption.showDataOnly) {
                            axisObj.tick.tickValues = measurez.concat(rangez.concat(markerz)).sort(d3.ascending);
                            //xAxis.tickValues(measurez.concat(rangez.concat(markerz)).sort(d3.ascending));
                        }
                        if (!axisOption.showTicks) {
                            axisObj.tick.tickSize = 0;
                            //xAxis.tickSize(0, 0);
                        }

                        axisMaker.applyAxis(axisObj);
                        xAxis = axisObj.axis;

                        /*
                        var axis = g.selectAll('g.axis').data([0]);
                        axis.enter().append('g').attr('class', 'axis');
                        axis.attr('transform', vertical ? 'translate(' + ((parentWidth - width) / 2) + ',' + verticalTopMargin + ')' : 'translate(0,' + (extentY + height / 3 * 2) + ')')
                            .call(xAxis);
                        */
                        if (axisOption.hidePath) {
                            axis.select('path').style('display', 'none');
                        }
                    } else {    // showType === label
                        if (vertical) {
                            var axis = g.append('g')
                                .attr('class', 'bullet-axis y axis')
                                .attr('transform', 'translate(' + ((parentWidth + width) / 2 - width - 3) + ',' + (reverse ? height : 0) + ')')
                                .selectAll('g.bullet-axis')
                                .data(rangez);

                            var tick = axis.enter()
                                .append('g')
                                    .attr('class', 'tick')
                                    .append('text')
                                        .attr('text-anchor', 'end')
                                        .text(function(d, i) {
                                            var returnValue = d;
                                            if( labelFormat ){
                                                returnValue = labelFormat(d);
                                                if( returnValue === '0' ) {
                                                    returnValue = '';
                                                }
                                            }
                                            return returnValue;
                                        });
                            tick.attr('transform', function(d, i) {
                                var addition = i === 0 ? 0 : (i + 1 === rangez.length ? parseInt(d3.select(this).style('height'), 10) : parseInt(d3.select(this).style('height'), 10) / 2);
                                return 'translate(0,' + (-w1(d) + addition) + ')';
                            });

                            var measureLabel = g.append('g')
                                .attr('class', 'measure-label')
                                .attr('transform', 'translate(' + (parentWidth / 2) + ',' + (reverse ? height : 0) + ')')
                                .selectAll('g.measure-label')
                                .data(measurez)
                                .enter()
                                    .append('text')
                                    .attr('text-anchor', 'middle')
                                    .text(function(d) { return d; })
                                    .attr('transform', function(d, i) {
                                        return 'translate(0,' + (-w1(d) + parseInt(d3.select(this).style('height'), 10)) + ')';
                                    });
                        } else {
                            // TODO design in case of horizontal bullet
                        }
                    }
                }
            });
            d3.timer.flush();
        }

        // left, right, top, bottom
        bullet.orient = function(_) {
            if (!arguments.length) return orient;
            orient = _ + '';
            reverse = orient == 'right' || orient == 'bottom';
            xAxis.orient((vertical = orient == 'top' || orient == 'bottom') ? 'left' : 'bottom');
            return bullet;
        };

        // ranges (bad, satisfactory, good)
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

        bullet.maxValue = function(value) {
            if (!arguments.length) return maxValue;
            maxValue = value;
            return bullet;
        };

        bullet.axisOption = function(_) {
            if (!arguments.length) return axisOption;
            axisOption = $.extend(false, axisOption, _);
            return bullet;
        };

        bullet.animation = function(_) {
            if (!arguments.length) return animation;
            animation = _;
            return bullet;
        };

        bullet.margin = function(_) {
            if (!arguments.length) return margin;
            margin = _;
            return bullet;
        };

        bullet.parentWidth = function(_) {
            if (!arguments.length) return parentWidth;
            parentWidth = _;
            return bullet;
        };

        bullet.labelFormat = function(_) {
            if (!arguments.length) return labelFormat;
            labelFormat = _;
            return bullet;
        };

        return d3.rebind(bullet, xAxis, 'tickFormat');
    };

    function bulletRanges(d) {
        return d.ranges;
    }

    function bulletMarkers(d) {
        return d.markers || [];
    }

    function bulletMeasures(d) {
        return d.measures;
    }

    function bulletWidth(x) {
        var x0 = x(0);
        return function(d) {
            return Math.abs(x(d) - x0);
        };
    }

})();
