(function() {
    'use strict';
    // Inspired by http://informationandvisualization.de/blog/box-plot
    d3.box = function() {
        var width = 1,
            height = 1,
            padding = 0,
            duration = 500,
            classname = 'bistel-boxplot-box',
            domain = null,
            value = Number,
            whiskers = boxWhiskers,
            quartiles = boxQuartiles,
            colorfn = null,
            showLabels = true, // whether or not to show text labels
            numBars = 4,
            curBar = 1,
            minField = 'min',
            maxField = 'max',
            medianField = 'median',
            q1Field = 'quantile1',
            q3Field = 'quantile3',
            selectrect = 'highlight',
            tickFormat = null,
            selectedIndex = '-1',
            dataTotalLength = 0,
            maxWidth = 30;

        // For each small multiple…
        function box(g) {
            var durationCount = 0,
                isNoDraw = false;
            g.each(function(data, i) {
                //d = d.map(value).sort(d3.ascending);
                //var boxIndex = data[0];
                //var boxIndex = 1;
                //var d = data[1].sort(d3.ascending);
                var d = data;

                var g = d3.select(this),
                    //n = d.length,
                    n = 5,
                    min = d[minField],
                    max = d[maxField];

                if( Number.isNaN(data[medianField]) || data[medianField] === 'NaN' || data[medianField] === null ){
                    isNoDraw = true;
                    return;
                }

                if( Number.isNaN(data[minField]) || data[minField] === 'NaN' || data[medianField] === null ){
                    isNoDraw = true;
                    return;
                }

                if( Number.isNaN(data[maxField]) || data[maxField] === 'NaN' || data[medianField] === null ){
                    isNoDraw = true;
                    return;
                }
                isNoDraw = false;
                // Compute quartiles. Must return exactly 3 elements.
                var quartileData = d.quartiles = quartiles(d);

                // Compute whiskers. Must return exactly 2 elements, or null.
                //var whiskerIndices = whiskers && whiskers.call(this, d, i),
                var whiskerData = [ d[minField], d[maxField] ];

                // Compute outliers. If no whiskers are specified, all data are 'outliers'.
                // We compute the outliers as indices, so that we can join across transitions!

                // Compute the new x-scale.
                var x1 = d3.scale.linear()
                           .domain(domain && domain.call(this, d, i) || [min, max])
                           .range([height, 0]);

                // Retrieve the old x-scale, if this is an update.
                var x0 = this.__chart__ || d3.scale.linear()
                             .domain([0, Infinity])
                // .domain([0, max])
                             .range(x1.range());

                // Stash the new scale.
                this.__chart__ = x1;

                //duration을 시간차로 변경하기 위함
                var term = 100;
                durationCount++;
                //duration = ( dataTotalLength < 20?(durationCount*term):durationCount*7 );
                duration = 700;

                /*
                var backbox = g.selectAll('.'+selectrect)
                           .data(whiskerData ? [whiskerData] : []),
                           checkbackbox = g.selectAll('.'+selectrect);
                //이미 생성이 되었다면 append 하지 않는다.
                if( checkbackbox[0].length == 0 ){
                    backbox.enter().append('rect')
                           .attr('class', selectrect);
                }
                backbox.attr('x', 0)
                       .attr('y', function(d) {
                           var returnValue = x0(d[1]);
                           console.log('y : '+returnValue);
                           return returnValue; })
                       .attr('width', width)
                       .attr('height', function(d) {
                           var compare = x0(d[1]);
                           var returnValue = x1(d[1]);
                           console.log('height : '+returnValue);
                           return returnValue; })
                       .attr('selected', 'N');
                */

                // Note: the box, median, and box tick elements are fixed in number,
                // so we only have to handle enter and update. In contrast, the outliers
                // and other elements are variable, so we need to exit them! Variable
                // elements also fade in and out.

                // Update center line: the vertical line spanning the whiskers.
                //if( g.selectAll('line.center') )
                var boxwidth = width;

                var background = g.select('.box-background');
                if( background[0][0] == null ){
                    background = g.append('rect')
                    .attr('class','box-background')
                    .style('fill','#fff')
                    .style('opacity',0);
                }

                background.attr('width',width)
                          .attr('height',height);

                var addposition = 0;
                if( boxwidth > maxWidth ) {
                    boxwidth = maxWidth;
                }

                var center = g.selectAll('line.center')
                              .data(whiskerData ? [whiskerData] : []),
                    checkcenter = g.selectAll('.center');
                //이미 생성이 되었다면 append 하지 않는다.
                if( checkcenter[0].length == 0 ){
                    center.enter().insert('line', 'rect')
                                  .attr('class', 'center');
                }
                //vertical line
                center.attr('class', 'center')
                      .attr('x1', (width) / 2 )
                      .attr('y1', function(d) { return x0(d[0]); })
                      .attr('x2', (width) / 2 )
                      .attr('y2', function(d) { return x0(d[1]); })
                      .style('opacity', 1e-6)
                      .transition()
                      .duration(duration)
                      .style('opacity', 1)
                      .attr('y1', function(d) {
                          var returnvalue = x1(d[0]);
                          return returnvalue; })
                      .attr('y2', function(d) {
                          var returnvalue = x1(d[1]);
                          return returnvalue; });

                center.exit()
                      .transition()
                      .duration(duration)
                      .style('opacity', 1e-6)
                      .attr('y1', function(d) { return x1(d[0]); })
                      .attr('y2', function(d) { return x1(d[1]); })
                      .remove();

                // Update innerquartile box.
                var box = g.selectAll('rect.'+classname+'-rect')
                           .data([quartileData]),
                           checkbox = g.selectAll('.'+classname+'-rect'),
                           isReload = false;
                //이미 생성이 되었다면 append 하지 않는다.
                if( checkbox[0].length == 0 ){
                    isReload = true;
                    box.enter().append('rect')
                       .attr('class', classname+'-rect');
                }

                var boxpositionx = width/2 - boxwidth/2 + padding/2;

                box.attr('x', boxpositionx)
                   .attr('y', function(d) {
                       var returnValue = 0;
                       if( isReload ){
                           returnValue = x0(d[2]);
                       }else{
                           returnValue = d3.select(this).attr('y');
                       }
                       return returnValue; })
                   .attr('width', function(d){
                        var returnValue = boxwidth-padding;
                        //var returnValue = boxwidth;
                        if( returnValue < 0 ){
                            returnValue = 1;
                        }
                        return returnValue; })
                   .attr('height', function(d) {
                       var returnValue = 0;
                       if( isReload ){
                           returnValue = x0(d[0]) - x0(d[2]);
                       }else{
                           returnValue = d3.select(this).attr('height');
                       }
                       return returnValue; })
                   .transition()
                   .duration(duration)
                   .attr('y', function(d) { return x1(d[2]); })
                   .attr('height', function(d) {
                       var returnValue = x1(d[0]) - x1(d[2]);
                       return returnValue; })
                   .style('stroke-width', 1);
                if( colorfn ){//color function이 정의 되어 있다면 style의 fill을 지정해준다.
                    box.style('fill', function() {
                        /*
                        var fillColor = chartStyleUtil.getIndexColor(d['index']);
                        if( selectedIndex == d['index']+'' ){
                            fillColor = chartStyleUtil.colorLuminance( fillColor, -0.4 );
                        }
                        */
                        var fillColor = colorfn( data, i );
                        return fillColor;
                    });
                }

                /*
                box.transition()
                   .duration(duration)
                   .attr('y', function(d) { return x1(d[2]); })
                   .attr('height', function(d) { return x1(d[0]) - x1(d[2]); });
                */
                // Update median line.
                var medianLine = g.selectAll('line.median')
                                  .data([quartileData[1]]),
                                  checkmedianLine = g.selectAll('.median');
                //이미 생성이 되었다면 append 하지 않는다.
                if( checkmedianLine[0].length == 0 ){
                    medianLine.enter().append('line')
                              .attr('class', 'median');
                }
                //medianLine.attr('x1', (padding/2))
                medianLine.attr('x1', boxpositionx)
                          .attr('y1', x0)
                          .attr('x2', function(d){
                               //var returnValue = width-(padding/2);
                               var returnValue = boxpositionx + boxwidth - padding;
                               if( returnValue < 0 ){
                                   returnValue = 1;
                               }
                               return returnValue; })
                          .attr('y2', x0)
                          .transition()
                          .duration(duration)
                          .attr('y1', x1)
                          .attr('y2', x1);

                medianLine.transition()
                          .duration(duration)
                          .attr('y1', x1)
                          .attr('y2', x1);

                // Update whiskers.
                var whisker = g.selectAll('line.whisker')
                               .data(whiskerData || []),
                               checkwhisker = g.selectAll('.whisker');
                //이미 생성이 되었다면 append 하지 않는다.
                if( checkwhisker[0].length == 0 ){
                    whisker.enter().insert('line', 'circle, text')
                           .attr('class', 'whisker');
                }

                whisker.attr('x1', boxpositionx+padding)
                //whisker.attr('x1', (width/2)-(width/4))
                       .attr('y1', x0)
                       .attr('x2', function(d){
                            //var returnValue = width/2+(width/4);
                            var returnValue = boxpositionx+boxwidth-padding*2;
                            if( returnValue < 0 ){
                                returnValue = 1;
                            }
                            return returnValue; })
                       .attr('y2', x0)
                       .style('opacity', 1e-6)
                       .transition()
                       .duration(duration)
                       .attr('y1', x1)
                       .attr('y2', x1)
                       .style('opacity', function( d, i ){
                           var returnValue = 1;
                           if( width <= 6 ) {
                               returnValue = 0;
                           }
                           return returnValue;
                       });

                whisker.transition()
                       .duration(duration)
                       .attr('y1', x1)
                       .attr('y2', x1)
                       .style('opacity',  function( d, i ){
                           var returnValue = 1;
                           if( width <= 6 ) {
                               returnValue = 0;
                           }
                           return returnValue;
                       });

                whisker.exit()
                       .transition()
                       .duration(duration)
                       .attr('y1', x1)
                       .attr('y2', x1)
                       .style('opacity', 1e-6)
                       .remove();

                // Compute the tick format.
                //var format = tickFormat || x1.tickFormat(8);
                var format = tickFormat || x1.tickFormat(d3.format('.1f'));

                // Update box ticks.
                var boxTick = g.selectAll('text.'+classname)
                               .data(quartileData),
                               checkboxTick = g.selectAll('text.'+classname);
                if(showLabels == true) {
                    //이미 생성이 되었다면 append 하지 않는다.
                    if( checkboxTick[0].length == 0 ){
                        boxTick.enter().append('text')
                               .attr('class', classname);
                    }
                    boxTick.attr('dy', '.3em')
                           .attr('dx', function(d, i) { return i & 1 ? 6 : -6 })
                           .attr('x', function(d, i) { return i & 1 ?  + width : 0 })
                           .attr('y', x0)
                           .attr('text-anchor', function(d, i) { return i & 1 ? 'start' : 'end'; })
                           .text(format)
                           .transition()
                           .duration(duration)
                           .attr('y', x1);
                }

                boxTick.transition()
                       .duration(duration)
                       .text(format)
                       .attr('y', x1);

                // Update whisker ticks. These are handled separately from the box
                // ticks because they may or may not exist, and we want don't want
                // to join box ticks pre-transition with whisker ticks post-.
                var whiskerTick = g.selectAll('text.whisker')
                                   .data(whiskerData || []),
                                   checkwhiskerTick = g.selectAll('text.whisker');
                if(showLabels == true) {
                    //이미 생성이 되었다면 append 하지 않는다.
                    if( checkwhiskerTick[0].length == 0 ){
                        whiskerTick.enter().append('text')
                                   .attr('class', 'whisker');
                    }
                    whiskerTick.attr('dy', '.3em')
                               .attr('dx', 6)
                               .attr('x', width)
                               .attr('y', x0)
                               .text(format)
                               .style('opacity', 1e-6)
                               .transition()
                               .duration(duration)
                               .attr('y', x1)
                               .style('opacity', 1);
                }
                whiskerTick.transition()
                           .duration(duration)
                           .text(format)
                           .attr('y', x1)
                           .style('opacity', 1);

                whiskerTick.exit()
                           .transition()
                           .duration(duration)
                           .attr('y', x1)
                           .style('opacity', 1e-6)
                           .remove();
            });
            if( !isNoDraw ) {//그려지지 않으면 에러 발생.
                d3.timer.flush();
            }
        }

        box.width = function(x) {
            if (!arguments.length) return width;
            width = x;
            return box;
        };

        box.height = function(x) {
            if (!arguments.length) return height;
            height = x;
            return box;
        };

        box.padding = function(x) {
            if (!arguments.length) return padding;
            padding = x;
            return box;
        };

        box.tickFormat = function(x) {
            if (!arguments.length) return tickFormat;
            tickFormat = x;
            return box;
        };

        box.duration = function(x) {
            if (!arguments.length) return duration;
            duration = x;
            return box;
        };

        box.domain = function(x) {
            if (!arguments.length) return domain;
            domain = x == null ? x : d3.functor(x);
            return box;
        };

        box.value = function(x) {
            if (!arguments.length) return value;
            value = x;
            return box;
        };

        box.whiskers = function(x) {
            if (!arguments.length) return whiskers;
            whiskers = x;
            return box;
        };

        box.showLabels = function(x) {
            if (!arguments.length) return showLabels;
            showLabels = x;
            return box;
        };

        box.quartiles = function(x) {
            if (!arguments.length) return quartiles;
            quartiles = x;
            return box;
        };

        box.colorfn = function(x) {
            if (!arguments.length) return colorfn;
            colorfn = x;
            return box;
        };

        box.classname = function(x) {
            if (!arguments.length) return classname;
            classname = x;
            return box;
        };

        box.minField = function(x) {
            if (!arguments.length) return minField;
            minField = x;
            return box;
        };

        box.maxField = function(x) {
            if (!arguments.length) return maxField;
            maxField = x;
            return box;
        };

        box.medianField = function(x) {
            if (!arguments.length) return medianField;
            medianField = x;
            return box;
        };

        box.q1Field = function(x) {
            if (!arguments.length) return q1Field;
            q1Field = x;
            return box;
        };

        box.q3Field = function(x) {
            if (!arguments.length) return q3Field;
            q3Field = x;
            return box;
        };

        box.dataTotalLength = function(x) {
            if (!arguments.length) return dataTotalLength;
            dataTotalLength = x;
            return box;
        };

        box.maxWidth = function(x) {
            if (!arguments.length) return maxWidth;
            maxWidth = x;
            return box;
        };

        box.setHighlight = function( target ) {
            var g = target;

            var selected = target.attr('selected'),
                center = g.selectAll('line.center'),
                box = g.selectAll('rect.'+classname+'-rect'),
                medianLine = g.selectAll('line.median'),
                whisker = g.selectAll('line.whisker'),
                background = g.select('rect.box-background');
            if( selected == 'N' ){//선택 event
                var prevcolor = box.style('fill'),
                    newcolor = chartStyleUtil.colorLuminance( prevcolor, -0.4 );
                box.attr('prevfill', prevcolor);
                box.style('fill', newcolor);
                //background.style('fill', chartStyleUtil.getStatusColor('active'));
                background.style('fill', '#ccc');
                background.style('opacity', 0.5);
                selectedIndex = target.attr('index');
            }else{
                selectedIndex = '-1';
                var prevcolor = box.attr('prevfill');
                box.style('fill', prevcolor);
                background.style('fill', '#fff');
                background.style('opacity', 0);
            }
            target.attr('selected', selected == 'Y'?'N':'Y');
        }

        return box;
    };

    function boxWhiskers(d) {
        return [d['min'], d['max']];
    }

    function boxQuartiles(d) {
        var returnValue = [ d['quantile1'],
                            d['median'],
                            d['quantile3']
                            ];
        return returnValue;
    }

})();
