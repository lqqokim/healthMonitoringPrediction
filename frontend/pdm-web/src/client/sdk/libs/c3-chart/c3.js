(function (window, c3) {
    'use strict';

    /*global define, module, exports, require */

    var c3Chart = { version: "0.4.11" };

    var c3_chart_fn,
        c3_chart_internal_fn,
        c3_chart_internal_axis_fn;

    // by jwhong
    function API(owner) {
        this.owner = owner;
    }

    c3Chart.generate = function(config) {
        return c3.generate(config);
    };

    c3_chart_fn = c3.chart.fn;
    c3_chart_internal_fn = c3.chart.internal.fn;
    c3_chart_internal_axis_fn = c3.chart.internal.axis.fn;

    var CLASS = c3_chart_internal_fn.CLASS;
    CLASS['zoomArea'] = 'c3-zoom-wrapper';
    CLASS['zoomAreaBand'] = 'c3-zoom-band';
    CLASS['zoomAreaOverlay'] = 'c3-zoom-overlay';

    //add config
    c3_chart_internal_fn.additionalConfig = {
        focus_line : true,
        data_selection_stroke: true,
        data_selection_strokeWidth: 2,
        data_selection_strokeStyle: '#555',
        data_empty_noData : false,
        data_empty_noDataTemplate : '',
        subchart_type : '',
        subchart_size_heightRate : '',
        customzoom_enabled : false,
        customzoom_ondrag: function () {},
        customzoom_ondragstart: function () {},
        customzoom_ondragend: function () {},
        customzoom_useHistory : false,
        updateText: undefined
    };

    c3_chart_internal_fn.showXGridFocus = function (selectedData) {
        var $$ = this, config = $$.config,
            dataToShow = selectedData.filter(function (d) { return d && isValue(d.value); }),
            focusEl = $$.main.selectAll('line.' + CLASS.xgridFocus),
            xx = $$.xx.bind($$);

        if (! config.focus_line) { return; } // add focus line
        // if (! config.tooltip_show) { return; }

        // Hide when scatter plot exists
        if ($$.hasType('scatter') || $$.hasArcType()) { return; }
        focusEl
            .style("visibility", "visible")
            .data([dataToShow[0]])
            .attr(config.axis_rotated ? 'y1' : 'x1', xx)
            .attr(config.axis_rotated ? 'y2' : 'x2', xx);
        $$.smoothLines(focusEl, 'grid');
    };

    // by jwhong
    c3_chart_internal_fn.redrawEventRect = function () {
        var $$ = this, //config = $$.config,
            eventRectUpdate, maxDataCountTarget,
            isMultipleX = $$.isMultipleX();

        if( $$.config.customzoom_enabled ){
            return;
        }

        // rects for mouseover
        var eventRects = $$.main.select('.' + CLASS.eventRects)
        // delete cursor style
        // .style('cursor', config.zoom_enabled ? config.axis_rotated ? 'ns-resize' : 'ew-resize' : null)
            .classed(CLASS.eventRectsMultiple, isMultipleX)
            .classed(CLASS.eventRectsSingle, !isMultipleX);

        // clear old rects
        eventRects.selectAll('.' + CLASS.eventRect).remove();

        // open as public variable
        $$.eventRect = eventRects.selectAll('.' + CLASS.eventRect);

        if (isMultipleX) {
            console.log('multiple redraw');
            eventRectUpdate = $$.eventRect.data([0]);
            // enter : only one rect will be added
            $$.generateEventRectsForMultipleXs(eventRectUpdate.enter());
            // update
            $$.updateEventRect(eventRectUpdate);
            // exit : not needed because always only one rect exists
        }
        else {
            console.log('single redraw');
            // Set data and update $$.eventRect
            maxDataCountTarget = $$.getMaxDataCountTarget($$.data.targets);
            eventRects.datum(maxDataCountTarget ? maxDataCountTarget.values : []);
            $$.eventRect = eventRects.selectAll('.' + CLASS.eventRect);
            eventRectUpdate = $$.eventRect.data(function (d) { return d; });
            // enter
            $$.generateEventRectsForSingleX(eventRectUpdate.enter());
            // update
            $$.updateEventRect(eventRectUpdate);
            // exit
            eventRectUpdate.exit().remove();
        }
    };

    // by jwhong
    c3_chart_internal_fn.updateEventRect = function (eventRectUpdate) {
        var $$ = this, config = $$.config,
            x, y, w, h, rectW, rectX;

        if( $$.config.customzoom_enabled ){
            return;
        }

        // set update selection if null
        eventRectUpdate = eventRectUpdate || $$.eventRect.data(function (d) { return d; });

        if ($$.isMultipleX()) {
            // TODO: rotated not supported yet
            x = 0;
            y = 0;
            w = $$.width;
            h = $$.height;
        }
        else {
            if (($$.isCustomX() || $$.isTimeSeries()) && !$$.isCategorized()) {

                // update index for x that is used by prevX and nextX
                $$.updateXs();

                rectW = function (d) {
                    var prevX = $$.getPrevX(d.index), nextX = $$.getNextX(d.index);

                    // if there this is a single data point make the eventRect full width (or height)
                    if (prevX === null && nextX === null) {
                        return config.axis_rotated ? $$.height : $$.width;
                    }

                    if (prevX === null) { prevX = $$.x.domain()[0]; }
                    if (nextX === null) { nextX = $$.x.domain()[1]; }

                    return Math.max(0, ($$.x(nextX) - $$.x(prevX)) / 2);
                };
                rectX = function (d) {
                    var prevX = $$.getPrevX(d.index), nextX = $$.getNextX(d.index),
                        thisX = $$.data.xs[d.id][d.index];

                    // if there this is a single data point position the eventRect at 0
                    if (prevX === null && nextX === null) {
                        return 0;
                    }

                    if (prevX === null) { prevX = $$.x.domain()[0]; }

                    return ($$.x(thisX) + $$.x(prevX)) / 2;
                };
            } else {
                rectW = $$.getEventRectWidth();
                rectX = function (d) {
                    return $$.x(d.x) - (rectW / 2);
                };
            }
            x = config.axis_rotated ? 0 : rectX;
            y = config.axis_rotated ? rectX : 0;
            w = config.axis_rotated ? $$.width : rectW;
            h = config.axis_rotated ? rectW : $$.height;
        }

        eventRectUpdate
            .attr('class', $$.classEvent.bind($$))
            .attr("x", x)
            .attr("y", y)
            .attr("width", w)
            .attr("height", h);
    };

    // Donut chart
    c3_chart_internal_fn.updateCircle = function () {
        var $$ = this, config = $$.config;
        $$.mainCircle = $$.main.selectAll('.' + CLASS.circles).selectAll('.' + CLASS.circle)
            .data($$.lineOrScatterData.bind($$));
        $$.mainCircle.enter().append("circle")
            .attr("class", $$.classCircle.bind($$))
            .attr("r", $$.pointR.bind($$))
            .style("fill", $$.color)
            .on('click', function(d) {

            })
        $$.mainCircle
            .style("opacity", $$.initialOpacityForCircle.bind($$));
        $$.mainCircle.exit().remove();

        if(config.circle_in_donut) {
            $$.drawCircleInDonut();
        }
    };

    // by ysyun
    c3_chart_internal_fn.updateTargetsForArc = function (targets) {
        var $$ = this, main = $$.main, config = $$.config,
            mainPieUpdate, mainPieEnter,
            classChartArc = $$.classChartArc.bind($$),
            classArcs = $$.classArcs.bind($$),
            classFocus = $$.classFocus.bind($$);
        mainPieUpdate = main.select('.' + CLASS.chartArcs).selectAll('.' + CLASS.chartArc)
            .data($$.pie(targets))
            .attr("class", function (d) { return classChartArc(d) + classFocus(d.data); });
        mainPieEnter = mainPieUpdate.enter().append("g")
            .attr("class", classChartArc);
        mainPieEnter.append('g')
            .attr('class', classArcs);
        mainPieEnter.append("text")
            .attr("dy", $$.hasType('gauge') ? "-.1em" : ".35em")
            .style("opacity", 0)
            .style("text-anchor", "middle")
            .style("pointer-events", "none");

        if(config.circle_in_donut) {
            $$.drawCircleInDonut();
        }
    };

    // by ysyun
    // to click event in title of Pie
    c3_chart_internal_fn.drawCircleInDonut = function () {
        var $$ = this, config = $$.config;

        var title = config.circle_in_donut['title'] ? config.circle_in_donut['title'] : 'ALL',
            style = config.circle_in_donut['style'] ? config.circle_in_donut['style'] : '',
            title_dx = config.circle_in_donut['title_dx'] ? config.circle_in_donut['title_dx'] : '0em',
            title_dy = config.circle_in_donut['title_dy'] ? config.circle_in_donut['title_dy'] : '-.3em',
            data_dx = config.circle_in_donut['data_dx'] ? config.circle_in_donut['data_dx'] : '0em',
            data_dy = config.circle_in_donut['data_dy'] ? config.circle_in_donut['data_dy'] : '.7em',
            fontSize = config.circle_in_donut['font_size'] ? config.circle_in_donut['font_size'] : '15',
            fontFillColor = config.circle_in_donut['font_fill_color'] ? config.circle_in_donut['font_fill_color'] : '#444444',
            fontStrokeColor = config.circle_in_donut['font_stroke_color'] ? config.circle_in_donut['font_stroke_color'] : '#444444';

        $$.main.selectAll('.' + CLASS.chart + ' > g > text')
            .data([title, config.circle_in_donut['data']])
            .text(function(d) { return d; })
            // if you set, don't fire event object. I don't know reason about it
            //.attr('class', style)
            .style('font-size', fontSize)
            .style('fill', fontFillColor)
            .style('stroke', fontStrokeColor)
            .attr('dy', function(d, i) { if(i==0) { return title_dy } else { return data_dy; } })
            .attr('dx', function(d, i) { if(i==0) { return title_dx } else { return data_dx; } })
            .on('click', function(d) {
                config.circle_in_donut['onclick'].call($$, d);
            })
            .on('mouseover', function() {
                d3.select(this)
                    .style('cursor', 'pointer');
                // .attr('class', CLASS.chartArcsTitleSelected);
            }, true)
            .on('mouseout',function () {
                d3.select(this)
                    .style('cursor', null);
                // .attr('class', CLASS.chartArcsTitle);
            }, true);

    };
    // end ysyun

    c3_chart_internal_fn.initArc = function () {
        // by ysyun
        var $$ = this, config = $$.config;
        // end ysyun

        $$.arcs = $$.main.select('.' + CLASS.chart).append("g")
            .attr("class", CLASS.chartArcs)
            .attr("transform", $$.getTranslate('arc'));
        $$.arcs.append('text')
            .attr('class', CLASS.chartArcsTitle)
            .style("text-anchor", "middle")
            .text($$.getArcTitle());

        // by ysyun
        // to use drawCircleInDonut()
        $$.arcs.append('text')
            .attr('class', CLASS.chartArcsTitle)
            .style("text-anchor", "middle")
            .text('');
        // end ysyun
    };

    // by hk_kim
    // throwing event object when click event avoked.
    c3_chart_internal_fn.generateEventRectsForSingleX = function (eventRectEnter) {
        var $$ = this, d3 = $$.d3, config = $$.config;
        var eventRectEvent = eventRectEnter.append("rect")
        // .attr("class", $$.classEvent.bind($$))
            .style("cursor", config.data_selection_enabled && config.data_selection_grouped ? "pointer" : null)
            .on('mouseover', function (d) {
                var index = d.index;

                if ($$.dragging || $$.flowing) { return; } // do nothing while dragging/flowing
                if ($$.hasArcType()) { return; }

                // Expand shapes for selection
                if (config.point_focus_expand_enabled) { $$.expandCircles(index, null, true); }
                $$.expandBars(index, null, true);

                // Call event handler
                $$.main.selectAll('.' + CLASS.shape + '-' + index).each(function (d) {
                    config.data_onmouseover.call($$.api, d);
                });
            })
            .on('mouseout', function (d) {
                var index = d.index;
                if (!$$.config) { return; } // chart is destroyed
                if ($$.hasArcType()) { return; }
                $$.hideXGridFocus();
                $$.hideTooltip();
                // Undo expanded shapes
                $$.unexpandCircles();
                $$.unexpandBars();
                // Call event handler
                $$.main.selectAll('.' + CLASS.shape + '-' + index).each(function (d) {
                    config.data_onmouseout.call($$.api, d);
                });
            })
            .on('mousemove', function (d) {
                var selectedData, index = d.index,
                    eventRect = $$.svg.select('.' + CLASS.eventRect + '-' + index);

                if ($$.dragging || $$.flowing) { return; } // do nothing while dragging/flowing
                if ($$.hasArcType()) { return; }

                if ($$.isStepType(d) && $$.config.line_step_type === 'step-after' && d3.mouse(this)[0] < $$.x($$.getXValue(d.id, index))) {
                    index -= 1;
                }

                // Show tooltip
                selectedData = $$.filterTargetsToShow($$.data.targets).map(function (t) {
                    return $$.addName($$.getValueOnIndex(t.values, index));
                });

                if (config.tooltip_grouped) {
                    $$.showTooltip(selectedData, this);
                    $$.showXGridFocus(selectedData);
                }

                if (config.tooltip_grouped && (!config.data_selection_enabled || config.data_selection_grouped)) {
                    return;
                }

                $$.main.selectAll('.' + CLASS.shape + '-' + index)
                    .each(function () {
                        d3.select(this).classed(CLASS.EXPANDED, true);
                        if (config.data_selection_enabled) {
                            eventRect.style('cursor', config.data_selection_grouped ? 'pointer' : null);
                        }
                        if (!config.tooltip_grouped) {
                            $$.hideXGridFocus();
                            $$.hideTooltip();
                            if (!config.data_selection_grouped) {
                                $$.unexpandCircles(index);
                                $$.unexpandBars(index);
                            }
                        }
                    })
                    .filter(function (d) {
                        return $$.isWithinShape(this, d);
                    })
                    .each(function (d) {
                        if (config.data_selection_enabled && (config.data_selection_grouped || config.data_selection_isselectable(d))) {
                            eventRect.style('cursor', 'pointer');
                        }
                        if (!config.tooltip_grouped) {
                            $$.showTooltip([d], this);
                            $$.showXGridFocus([d]);
                            if (config.point_focus_expand_enabled) { $$.expandCircles(index, d.id, true); }
                            $$.expandBars(index, d.id, true);
                        }
                    });
            })
            .on('click', function (d) {
                var index = d.index;
                if ($$.config.splitLine && $$.config.data_type === 'bar') {
                    var pos = d3.mouse(this);
                    $$.drawSplitLine(pos)
                }


                if ($$.hasArcType() || !$$.toggleShape) { return; }
                if ($$.cancelClick) {
                    $$.cancelClick = false;
                    return;
                }
                if ($$.isStepType(d) && config.line_step_type === 'step-after' && d3.mouse(this)[0] < $$.x($$.getXValue(d.id, index))) {
                    index -= 1;
                }
                $$.main.selectAll('.' + CLASS.shape + '-' + index).each(function (d) {
                    if (config.data_selection_grouped || $$.isWithinShape(this, d)) {
                        $$.toggleShape(this, d, index);
                        $$.config.data_onclick.call($$.api, d, this, event);
                    }
                });
            });
            eventRectEvent.call(
                config.data_selection_draggable && $$.drag ? (
                    d3.behavior.drag().origin(Object)
                        .on('drag', function () { $$.drag(d3.mouse(this)); })
                        .on('dragstart', function () { $$.dragstart(d3.mouse(this)); })
                        .on('dragend', function () { $$.dragend(); })
                ) : function () {}
            );
    };
    // end hk_kim

    // by hk_kim
    // bar chart colors are invalid when redraw.
    c3_chart_internal_fn.redrawBar = function (drawBar, withTransition) {
        var $$ = this, d3 = $$.d3, config = $$.config;
        return [
            (withTransition ? this.mainBar.transition(Math.random().toString()) : this.mainBar)
                .attr('d', drawBar)
                .style("fill", function(d) {
                    // by ywchoi add stroke option
                    if(!config.data_selection_stroke && d3.select(this).classed(CLASS.SELECTED)) {
                        return $$.d3.rgb($$.color(d)).darker(0.75);
                    } else {
                        return $$.color(d);
                    }
                })
                .style("opacity", 1)
        ];
    };
    // end hk_kim

    // by hk_kim : left padding value += 10
    // by srbae : add option subchart_size_heightRate
    c3_chart_internal_fn.updateSizes = function () {
        var $$ = this, config = $$.config;
        var legendHeight = $$.legend ? $$.getLegendHeight() : 0,
            legendWidth = $$.legend ? $$.getLegendWidth() : 0,
            legendHeightForBottom = $$.isLegendRight || $$.isLegendInset ? 0 : legendHeight,
            hasArc = $$.hasArcType(),
            xAxisHeight = config.axis_rotated || hasArc ? 0 : $$.getHorizontalAxisHeight('x'),
            subchartHeight = config.subchart_show && !hasArc ? (config.subchart_size_height + xAxisHeight) : 0;

        $$.currentWidth = $$.getCurrentWidth();
        $$.currentHeight = $$.getCurrentHeight();

        if (subchartHeight > 0 && config.subchart_size_heightRate) {
            subchartHeight = $$.currentHeight/100 * config.subchart_size_heightRate;

            if ($$.svg) {
                var brush = $$.svg.select(".c3-brush .background");
                if (brush.size()) {
                    brush.attr('height',subchartHeight-xAxisHeight);
                    $$.svg.select(".c3-brush .extent").attr('height',subchartHeight-xAxisHeight);
                }
            }
        }

        // for main
        $$.margin = config.axis_rotated ? {
            top: $$.getHorizontalAxisHeight('y2') + $$.getCurrentPaddingTop(),
            right: hasArc ? 0 : $$.getCurrentPaddingRight(),
            bottom: $$.getHorizontalAxisHeight('y') + legendHeightForBottom + $$.getCurrentPaddingBottom(),
            left: subchartHeight + (hasArc ? 0 : $$.getCurrentPaddingLeft()+10)
        } : {
            top: 4 + $$.getCurrentPaddingTop(), // for top tick text
            right: hasArc ? 0 : $$.getCurrentPaddingRight(),
            bottom: xAxisHeight + subchartHeight + legendHeightForBottom + $$.getCurrentPaddingBottom(),
            left: hasArc ? 0 : $$.getCurrentPaddingLeft()
        };

        // for subchart
        $$.margin2 = config.axis_rotated ? {
            top: $$.margin.top,
            right: NaN,
            bottom: 20 + legendHeightForBottom,
            left: $$.rotated_padding_left
        } : {
            top: $$.currentHeight - subchartHeight - legendHeightForBottom,
            right: NaN,
            bottom: xAxisHeight + legendHeightForBottom,
            left: $$.margin.left
        };

        // for legend
        $$.margin3 = {
            top: 0,
            right: NaN,
            bottom: 0,
            left: 0
        };
        if ($$.updateSizeForLegend) { $$.updateSizeForLegend(legendHeight, legendWidth); }

        $$.width = $$.currentWidth - $$.margin.left - $$.margin.right;
        $$.height = $$.currentHeight - $$.margin.top - $$.margin.bottom;
        if ($$.width < 0) { $$.width = 0; }
        if ($$.height < 0) { $$.height = 0; }

        $$.width2 = config.axis_rotated ? $$.margin.left - $$.rotated_padding_left - $$.rotated_padding_right : $$.width;
        $$.height2 = config.axis_rotated ? $$.height : $$.currentHeight - $$.margin2.top - $$.margin2.bottom;
        if ($$.width2 < 0) { $$.width2 = 0; }
        if ($$.height2 < 0) { $$.height2 = 0; }

        // for arc
        $$.arcWidth = $$.width - ($$.isLegendRight ? legendWidth + 10 : 0);
        $$.arcHeight = $$.height - ($$.isLegendRight ? 0 : 10);
        if ($$.hasType('gauge') && !config.gauge_fullCircle) {
            $$.arcHeight += $$.height - $$.getGaugeLabelHeight();
        }
        if ($$.updateRadius) { $$.updateRadius(); }

        if ($$.isLegendRight && hasArc) {
            $$.margin3.left = $$.arcWidth / 2 + $$.radiusExpanded * 1.1;
        }
    };
    // end hk_kim

    // by hk_kim
    // selecte color is darker not brighter
    // by ywchoi add stroke option
    c3_chart_internal_fn.selectPath = function (target, d) {
        var $$ = this;
        $$.config.data_onselected.call($$, d, target.node());
        if ($$.config.interaction_brighten) {
            // console.log($$.config.data_selection_stroke, 'selectPath');
            if($$.config.data_selection_stroke) {
                target.transition().duration(100)
                // .style("fill", function () { return $$.d3.rgb($$.color(d)).darker(0.75); });
                    .style("fill", function () { return $$.d3.rgb($$.color(d)); })
                    .style("stroke", function () { return $$.config.data_selection_strokeStyle; })
                    .style("stroke-width", function() {
                        if(d.value !== 0) {
                            return $$.config.data_selection_strokeWidth;
                        } else {
                            return 0;
                        }
                    });
            } else {
                target.transition().duration(100)
                    .style("fill", function () { return $$.d3.rgb($$.color(d)).darker(0.75); });
            }
        }
    };
    // end hk_kim

    // by ywchoi add stroke option to select
    c3_chart_internal_fn.unselectPath = function (target, d) {
        var $$ = this;
        $$.config.data_onunselected.call($$, d, target.node());
        if ($$.config.interaction_brighten) {
            // console.log($$.config.data_selection_stroke, 'unselectPath');
            if($$.config.data_selection_stroke) {
                target.transition().duration(100)
                    .style("fill", function () { return $$.color(d); })
                    .style("stroke-width", 0);
            } else {
                target.transition().duration(100)
                    .style("fill", function () { return $$.color(d); })
            }
        }
    };

    c3_chart_internal_fn.selectPoint = function (target, d, i) {
        var $$ = this, config = $$.config,
            cx = (config.axis_rotated ? $$.circleY : $$.circleX).bind($$),
            cy = (config.axis_rotated ? $$.circleX : $$.circleY).bind($$),
            r = $$.pointSelectR.bind($$);
        config.data_onselected.call($$.api, d, target.node());
        // add selected-circle on low layer g
        $$.main.select('.' + CLASS.selectedCircles + $$.getTargetSelectorSuffix(d.id)).selectAll('.' + CLASS.selectedCircle + '-' + i)
            .data([d])
            .enter().append('circle')
            .attr("class", function () { return $$.generateClass(CLASS.selectedCircle, i); })
            .attr("cx", cx)
            .attr("cy", cy)
            .attr("stroke", function () { return config.data_selection_strokeStyle; }) //$$.color(d); })
            .attr("r", function (d) { return $$.pointSelectR(d) * 1.4; })
            .transition().duration(100)
            .attr("r", r);
    };
    c3_chart_internal_fn.unselectPoint = function (target, d, i) {
        var $$ = this;
        $$.config.data_onunselected.call($$.api, d, target.node());
        // remove selected-circle from low layer g
        $$.main.select('.' + CLASS.selectedCircles + $$.getTargetSelectorSuffix(d.id)).selectAll('.' + CLASS.selectedCircle + '-' + i)
            .transition().duration(100).attr('r', 0)
            .remove();
    };

    c3_chart_internal_fn.pointSelectR = function (d) {
        var $$ = this, config = $$.config;
        return isFunction(config.point_select_r) ? config.point_select_r(d) : ((config.point_select_r) ? config.point_select_r : $$.pointR(d) * 1.5);
    }; //

    //by ywchoi
    c3_chart_fn.unload = function (args) {
        var $$ = this.internal;
        args = args || {};
        if (args instanceof Array) {
            args = {ids: args};
        } else if (typeof args === 'string') {
            args = {ids: [args]};
        }
        $$.unload($$.mapToTargetIds(args.ids), function () {
            if($$.data === null) { return; } // add data null check

            $$.redraw({withUpdateOrgXDomain: true, withUpdateXDomain: true, withLegend: true});

            //by jwhong
            // if( $$.config.customzoom_enabled ){
            //     $$.updateDragZoom();
            // }
            if (args.done) { args.done(); }
        });
    };

    // by ysyun. 2015.08.06
    c3_chart_fn.load = function (args, two_args) {
        var $$ = this.internal, config = $$.config;

        if(!args || !config) {
            return;
        }

        // update xs if specified
        if (args.xs) {
            $$.addXs(args.xs);
        }

        // update names if exists
        if ('names' in args) {
            c3_chart_fn.data.names.bind(this)(args.names);
        }

        // update classes if exists
        if ('classes' in args) {
            Object.keys(args.classes).forEach(function (id) {
                config.data_classes[id] = args.classes[id];
            });
        }
        // update categories if exists
        if ('categories' in args && $$.isCategorized()) {
            config.axis_x_categories = args.categories;
        }
        // update axes if exists
        if ('axes' in args) {
            Object.keys(args.axes).forEach(function (id) {
                config.data_axes[id] = args.axes[id];
            });
        }
        // update colors if exists
        if ('colors' in args) {
            Object.keys(args.colors).forEach(function (id) {
                config.data_colors[id] = args.colors[id];
            });
        }
        // use cache if exists
        if ('cacheIds' in args && $$.hasCaches(args.cacheIds)) {
            $$.load($$.getCaches(args.cacheIds), args.done);
            return;
        }
        // by ysyun
        if(two_args && 'circle_in_donut' in two_args) {
            config.circle_in_donut = {};

            Object.keys(two_args.circle_in_donut).forEach(function (id) {
                config.circle_in_donut[id] = two_args.circle_in_donut[id];
            });
        }

        // unload if needed
        if ('unload' in args) {
            // TODO: do not unload if target will load (included in url/rows/columns)
            $$.unload($$.mapToTargetIds((typeof args.unload === 'boolean' && args.unload) ? null : args.unload), function () {
                $$.loadFromArgs(args);
            });
        } else {
            $$.loadFromArgs(args);
        }
    };

    c3_chart_internal_fn.loadFromArgs = function (args) {
        var $$ = this, config = $$.config, main = $$.main;

        if (args.data) {
            $$.load($$.convertDataToTargets(args.data), args);
        }
        else if (args.url) {
            $$.convertUrlToData(args.url, args.mimeType, args.keys, function (data) {
                $$.load($$.convertDataToTargets(data), args);
            });
        }
        else if (args.json) {
            $$.load($$.convertDataToTargets($$.convertJsonToData(args.json, args.keys)), args);
        }
        else if (args.rows) {
            $$.load($$.convertDataToTargets($$.convertRowsToData(args.rows)), args);
        }
        else if (args.columns) {
            $$.load($$.convertDataToTargets($$.convertColumnsToData(args.columns)), args);
        }
        else {
            $$.load(null, args);
        }

        // by ywchoi : nodata template
        if(config.data_empty_noData) {
            // var targetsToShow = $$.filterTargetsToShow($$.data.targets);
            //if(targetsToShow.length === 0)
            if($$.data.targets.length === 0) {
                var template = config.data_empty_noDataTemplate;
                _appendNoData(main, template);
            } else {
                main.select('foreignObject.'+CLASS.empty)
                    .style('display', 'none');
            }
        }

        // by jwhong
        if( config.customzoom_enabled ){
            $$.updateDragZoom();
        }
    };

    // by ywchoi
    // At the time of the click,
    // the clickEvent does not proceed because the $$.cancelClick variable is not initialized.
    c3_chart_internal_fn.initZoom = function () {
        var $$ = this, d3 = $$.d3, config = $$.config, startEvent;

        $$.zoom = d3.behavior.zoom()
            .on("zoomstart", function () {
                startEvent = d3.event.sourceEvent;
                $$.zoom.altDomain = d3.event.sourceEvent.altKey ? $$.x.orgDomain() : null;
                config.zoom_onzoomstart.call($$.api, d3.event.sourceEvent);
            })
            .on("zoom", function () {
                $$.redrawForZoom.call($$);
            })
            .on('zoomend', function () {
                var event = d3.event.sourceEvent;
                // if click, do nothing. otherwise, click interaction will be canceled.
                if (event && startEvent.clientX === event.clientX && startEvent.clientY === event.clientY) {
                    $$.cancelClick = false; //If zoomend, $$.cancelClick reset
                    return;
                }
                $$.redrawEventRect();
                $$.updateZoom();
                config.zoom_onzoomend.call($$.api, $$.x.orgDomain());
            });
        $$.zoom.scale = function (scale) {
            return config.axis_rotated ? this.y(scale) : this.x(scale);
        };
        $$.zoom.orgScaleExtent = function () {
            var extent = config.zoom_extent ? config.zoom_extent : [1, 10];
            return [extent[0], Math.max($$.getMaxDataCount() / extent[1], extent[1])];
        };
        $$.zoom.updateScaleExtent = function () {
            var ratio = diffDomain($$.x.orgDomain()) / diffDomain($$.getZoomDomain()),
                extent = this.orgScaleExtent();
            this.scaleExtent([extent[0] * ratio, extent[1] * ratio]);
            return this;
        };
    };

    // by hk_kim
    // highlight ids & indices by modify "select func".
    c3_chart_fn.highlights = function (ids, indices, resetOther) {
        var $$ = this.internal, d3 = $$.d3, config = $$.config;
        if (! config.data_selection_enabled) { return; }
        $$.main.selectAll('.' + CLASS.shapes).selectAll('.' + CLASS.shape).each(function (d, i) {
            var shape = d3.select(this), id = d.data ? d.data.id : d.id,
                toggle = $$.getHighlightToggle(this, d).bind($$),
                isTargetId = config.data_selection_grouped || !ids || ids.indexOf(id) >= 0,
                isTargetIndex = !indices || indices.indexOf(i) >= 0,
                isSelected = shape.classed(CLASS.SELECTED);
            // line/area selection not supported yet
            if (shape.classed(CLASS.line) || shape.classed(CLASS.area)) {
                return;
            }
            if (isTargetId && isTargetIndex) {
                if (config.data_selection_isselectable(d)/* && !isSelected*/) {
                    toggle(true, shape.classed(CLASS.SELECTED, true), d, i);
                }
            } else if (typeof resetOther !== 'undefined' && resetOther) {
                if (isSelected) {
                    toggle(false, shape.classed(CLASS.SELECTED, false), d, i);
                }
            }
        });
    };

    c3_chart_internal_fn.getHighlightToggle = function (that, d) {
        var $$ = this, toggle;
        if (that.nodeName === 'circle') {
            if ($$.isStepType(d)) {
                // circle is hidden in step chart, so treat as within the click area
                toggle = function () {}; // TODO: how to select step chart?
            } else {
                toggle = $$.togglePointHighlight;
            }
        }
        else if (that.nodeName === 'path') {
            toggle = $$.togglePathHighlight;
        }
        return toggle;
    };

    c3_chart_internal_fn.togglePointHighlight = function (selected, target, d, i) {
        selected ? this.selectPointHighlight(target, d, i) : this.unselectPointHighlight(target, d, i);
    };
    c3_chart_internal_fn.togglePathHighlight = function (selected, target, d, i) {
        selected ? this.selectPathHighlight(target, d, i) : this.unselectPathHighlight(target, d, i);
    };

    //by ywchoi add stroke to select
    c3_chart_internal_fn.selectPointHighlight = function (target, d, i) {
        var $$ = this, config = $$.config,
            cx = (config.axis_rotated ? $$.circleY : $$.circleX).bind($$),
            cy = (config.axis_rotated ? $$.circleX : $$.circleY).bind($$),
            r = $$.pointSelectR.bind($$);
        // config.data_onselected.call($$.api, d, target.node());
        // add selected-circle on low layer g
        // $$.main.select('.' + CLASS.selectedCircles + $$.getTargetSelectorSuffix(d.id)).selectAll('.' + CLASS.selectedCircle + '-' + i)
        //     .data([d])
        //     .enter().append('circle')
        //     .attr("class", function () { return $$.generateClass(CLASS.selectedCircle, i); })
        //     .attr("cx", cx)
        //     .attr("cy", cy)
        //     .attr("stroke", function () { return $$.color(d); })
        //     .attr("r", function (d) { return $$.pointSelectR(d) * 1.4; })
        //     .transition().duration(100)
        //     .attr("r", r);
        $$.main.select('.' + CLASS.selectedCircles + $$.getTargetSelectorSuffix(d.id)).selectAll('.' + CLASS.selectedCircle + '-' + i)
            .data([d])
            .enter().append('circle')
            .attr("class", function () { return $$.generateClass(CLASS.selectedCircle, i); })
            .attr("cx", cx)
            .attr("cy", cy)
            .attr("stroke", function () { return config.data_selection_strokeStyle; })
            .attr("r", function (d) { return $$.pointSelectR(d) * 3; })
            .transition().duration(100)
            .attr("r", r);
    };
    c3_chart_internal_fn.unselectPointHighlight = function (target, d, i) {
        var $$ = this;
        // $$.config.data_onunselected.call($$.api, d, target.node());
        // remove selected-circle from low layer g
        $$.main.select('.' + CLASS.selectedCircles + $$.getTargetSelectorSuffix(d.id)).selectAll('.' + CLASS.selectedCircle + '-' + i)
            .transition().duration(100).attr('r', 0)
            .remove();
    };

    //by ywchoi add stroke option to select
    c3_chart_internal_fn.selectPathHighlight = function (target, d) {
        var $$ = this;
        // $$.config.data_onselected.call($$, d, target.node());
        if(!$$.config.data_selection_stroke) {
            target.transition().duration(100)
                .style("fill", function () { return $$.d3.rgb($$.color(d)).darker(0.75); });
        } else {
            target.transition().duration(100)
            // .style("fill", function () { return $$.d3.rgb($$.color(d)).darker(0.75); });
                .style("fill", function () { return $$.d3.rgb($$.color(d)); })
                .style("stroke", function () { return $$.config.data_selection_strokeStyle; })
                .style("stroke-width", function() {
                    if(d.value !== 0) {
                        return $$.config.data_selection_strokeWidth;
                    } else {
                        return 0;
                    }
                });
        }
    };
    c3_chart_internal_fn.unselectPathHighlight = function (target, d) {
        var $$ = this;
        // $$.config.data_onunselected.call($$, d, target.node());

        //by ywchoi add stroke option to select
        if(!$$.config.data_selection_stroke) {
            target.transition().duration(100)
                .style("fill", function () { return $$.color(d); })
        } else {
            target.transition().duration(100)
                .style("fill", function () { return $$.color(d); })
                .style("stroke-width", 0);
        }
    };
    // end hk_kim


    // by srbae
    // Add type option in the function subchart
    // The first feature is available only if the data type of the 'bar' and subchart type the 'line'.
    c3_chart_internal_fn.isSubchartLineType = function (d) {
        var config = this.config, id = (d['id']) ? d.id : d;
        config.subchart_type = (!config.subchart_type) ? config.data_types[id] : config.subchart_type;
        return !config.subchart_type || ['line', 'spline', 'area', 'area-spline', 'step', 'area-step'].indexOf(config.subchart_type) >= 0;
    };

    c3_chart_internal_fn.isSubchartBarType = function (d) {
        var config = this.config, id = (d['id']) ? d.id : d;
        config.subchart_type = (!config.subchart_type) ? config.data_types[id] : config.subchart_type;
        return config.subchart_type === 'bar';
    };

    c3_chart_internal_fn.isSubchartAreaType = function (d) {
        var config = this.config, id = (d['id']) ? d.id : d;
        config.subchart_type = (!config.subchart_type) ? config.data_types[id] : config.subchart_type;
        return ['area', 'area-spline', 'area-step'].indexOf(config.subchart_type) >= 0;
    };

    c3_chart_internal_fn.subchartLineData = function (d) {
        return this.isSubchartLineType(d) ? [d] : [];
    };

    c3_chart_internal_fn.subchartBarData = function (d) {
        return this.isSubchartBarType(d) ? d.values : [];
    };

    c3_chart_internal_fn.updateLineForSubchart = function (durationForExit) {
        var $$ = this;
        $$.contextLine = $$.context.selectAll('.' + CLASS.lines).selectAll('.' + CLASS.line)
            .data($$.subchartLineData.bind($$));
        $$.contextLine.enter().append('path')
            .attr('class', $$.classLine.bind($$))
            .style('stroke', $$.color);
        $$.contextLine
            .style("opacity", $$.initialOpacity.bind($$));
        $$.contextLine.exit().transition().duration(durationForExit)
            .style('opacity', 0)
            .remove();
    };

    c3_chart_internal_fn.updateBarForSubchart = function (durationForExit) {
        var $$ = this;
        $$.contextBar = $$.context.selectAll('.' + CLASS.bars).selectAll('.' + CLASS.bar)
            .data($$.subchartBarData.bind($$));
        $$.contextBar.enter().append('path')
            .attr("class", $$.classBar.bind($$))
            .style("stroke", 'none')
            .style("fill", $$.color);
        $$.contextBar
            .style("opacity", $$.initialOpacity.bind($$));
        $$.contextBar.exit().transition().duration(durationForExit)
            .style('opacity', 0)
            .remove();
    };

    c3_chart_internal_fn.updateAreaForSubchart = function (durationForExit) {
        var $$ = this, d3 = $$.d3;
        $$.contextArea = $$.context.selectAll('.' + CLASS.areas).selectAll('.' + CLASS.area)
            .data($$.subchartLineData.bind($$));
        $$.contextArea.enter().append('path')
            .attr("class", $$.classArea.bind($$))
            .style("fill", $$.color)
            .style("opacity", function () { $$.orgAreaOpacity = +d3.select(this).style('opacity'); return 0; });
        $$.contextArea
            .style("opacity", 0);
        $$.contextArea.exit().transition().duration(durationForExit)
            .style('opacity', 0)
            .remove();
    };

    c3_chart_internal_fn.generateDrawLine = function (lineIndices, isSub) {
        var $$ = this, config = $$.config,
            line = $$.d3.svg.line(),
            getPoints = $$.generateGetLinePoints(lineIndices, isSub),
            yScaleGetter = isSub ? $$.getSubYScale : $$.getYScale,
            xValue = function (d) { return (isSub ? $$.subxx : $$.xx).call($$, d); },
            yValue = function (d, i) {
                return config.data_groups.length > 0 ? getPoints(d, i)[0][1] : yScaleGetter.call($$, d.id)(d.value);
            };

        line = config.axis_rotated ? line.x(yValue).y(xValue) : line.x(xValue).y(yValue);
        if (!config.line_connectNull) { line = line.defined(function (d) { return d.value != null; }); }
        return function (d) {
            var values = config.line_connectNull ? $$.filterRemoveNull(d.values) : d.values,
                x = isSub ? $$.x : $$.subX, y = yScaleGetter.call($$, d.id), x0 = 0, y0 = 0, path;
            if ((isSub && $$.isSubchartLineType(d)) || (!isSub && $$.isLineType(d))) {
                if (config.data_regions[d.id]) {
                    path = $$.lineWithRegions(values, x, y, config.data_regions[d.id]);
                } else {
                    if ($$.isStepType(d)) { values = $$.convertValuesToStep(values); }
                    path = line.interpolate($$.getInterpolate(d))(values);
                }
            } else {
                if (values[0]) {
                    x0 = x(values[0].x);
                    y0 = y(values[0].value);
                }
                path = config.axis_rotated ? "M " + y0 + " " + x0 : "M " + x0 + " " + y0;
            }
            return path ? path : "M 0 0";
        };
    };

    c3_chart_internal_fn.generateDrawArea = function (areaIndices, isSub) {
        var $$ = this, config = $$.config, area = $$.d3.svg.area(),
            getPoints = $$.generateGetAreaPoints(areaIndices, isSub),
            yScaleGetter = isSub ? $$.getSubYScale : $$.getYScale,
            xValue = function (d) { return (isSub ? $$.subxx : $$.xx).call($$, d); },
            value0 = function (d, i) {
                return config.data_groups.length > 0 ? getPoints(d, i)[0][1] : yScaleGetter.call($$, d.id)($$.getAreaBaseValue(d.id));
            },
            value1 = function (d, i) {
                return config.data_groups.length > 0 ? getPoints(d, i)[1][1] : yScaleGetter.call($$, d.id)(d.value);
            };

        area = config.axis_rotated ? area.x0(value0).x1(value1).y(xValue) : area.x(xValue).y0(config.area_above ? 0 : value0).y1(value1);
        if (!config.line_connectNull) {
            area = area.defined(function (d) { return d.value !== null; });
        }

        return function (d) {
            var values = config.line_connectNull ? $$.filterRemoveNull(d.values) : d.values,
                x0 = 0, y0 = 0, path;
            if ((isSub && $$.isSubchartAreaType(d)) || (!isSub && $$.isAreaType(d))) {
                if ($$.isStepType(d)) { values = $$.convertValuesToStep(values); }
                path = area.interpolate($$.getInterpolate(d))(values);
            } else {
                if (values[0]) {
                    x0 = $$.x(values[0].x);
                    y0 = $$.getYScale(d.id)(values[0].value);
                }
                path = config.axis_rotated ? "M " + y0 + " " + x0 : "M " + x0 + " " + y0;
            }
            return path ? path : "M 0 0";
        };
    };

    // by srbae : subchart xAxis tick hidden
    c3_chart_internal_fn.redrawSubchart = function (withSubchart, transitions, duration, durationForExit, areaIndices, barIndices, lineIndices) {
        var $$ = this, d3 = $$.d3, config = $$.config,
            drawAreaOnSub, drawBarOnSub, drawLineOnSub;

        $$.context.style('visibility', config.subchart_show ? 'visible' : 'hidden');

        // subchart
        if (config.subchart_show) {
            // reflect main chart to extent on subchart if zoomed
            if (d3.event && d3.event.type === 'zoom') {
                $$.brush.extent($$.x.orgDomain()).update();
            }
            // update subchart elements if needed
            if (withSubchart) {

                // extent rect
                if (!$$.brush.empty()) {
                    $$.brush.extent($$.x.orgDomain()).update();
                }
                // setup drawer - MEMO: this must be called after axis updated
                drawAreaOnSub = $$.generateDrawArea(areaIndices, true);
                drawBarOnSub = $$.generateDrawBar(barIndices, true);
                drawLineOnSub = $$.generateDrawLine(lineIndices, true);

                $$.updateBarForSubchart(duration);

                $$.updateLineForSubchart(duration);
                $$.updateAreaForSubchart(duration);

                $$.redrawBarForSubchart(drawBarOnSub, duration, duration);
                $$.redrawLineForSubchart(drawLineOnSub, duration, duration);
                $$.redrawAreaForSubchart(drawAreaOnSub, duration, duration);
            }

            // subchart xAxis tick hidden
            d3.select($$.svg.selectAll('g.c3-axis-x')[0][1]).selectAll('.tick')
                    .style('visibility', 'hidden');
        }
    };

    // by jwhong customZoom
    c3_chart_internal_fn.initDragZoom = function () {
        var $$ = this, d3 = $$.d3, config = $$.config, startEvent;

        $$.dragZoom = d3.behavior.drag();

        $$.dragZoom.config = {
            bandPos : [-1, -1],
            beforePos : [],
            afterPos : [],
            xDomain: undefined,
            yDomain: undefined,
            zoomMiniSize : 3,
            zoomArea: {
                x1 : undefined,
                x2 : undefined,
                y1 : undefined,
                y2 : undefined,
            },
            ableScale : 'both',
            zoomHistory : [],
            rotated: $$.config.axis_rotated
        }

        $$.dragZoom.on("dragstart", function() {
            $$.dragZoom.config.beforePos = d3.mouse(this);
            //zoom apply
            // startEvent = d3.event.sourceEvent;
            // config.zoom_onzoomstart.call($$.api, d3.event.sourceEvent);
        })
            .on("drag", function() {
                d3.select(this).style('fill', '#ccc');
                var pos = d3.mouse(this);
                var dragZoomConfig = $$.dragZoom.config,
                    bandPos = dragZoomConfig.bandPos,
                    xDomain = dragZoomConfig.xDomain,
                    yDomain = dragZoomConfig.yDomain;

                var band = $$.main.select('.' + CLASS.zoomAreaBand);
                if (pos[0] < bandPos[0]) {
                    band.attr("transform", "translate(" + (pos[0]) + "," + bandPos[1] + ")");
                }
                if (pos[1] < bandPos[1]) {
                    band.attr("transform", "translate(" + (pos[0]) + "," + pos[1] + ")");
                }
                if (pos[1] < bandPos[1] && pos[0] > bandPos[0]) {
                    band.attr("transform", "translate(" + (bandPos[0]) + "," + pos[1] + ")");
                }

                //set new position of band when user initializes drag
                if (bandPos[0] == -1) {
                    if(xDomain == undefined){
                        pos[0] = 0;
                    }
                    if(yDomain == undefined){
                        pos[1] = 0;
                    }
                    bandPos = pos;
                    band.attr("transform", "translate(" + bandPos[0] + "," + bandPos[1] + ")");
                }

                if(xDomain !== undefined && yDomain !== undefined){
                    band.transition().duration(1)
                        .attr("width", Math.abs(bandPos[0] - pos[0]))
                        .attr("height", Math.abs(bandPos[1] - pos[1]));
                }else if( xDomain == undefined && yDomain !== undefined){
                    band.transition().duration(1)
                        .attr("width", d3.max(xScale.range()) + xScale.rangeBand())
                        .attr("height", Math.abs(bandPos[1] - pos[1]));
                }else if( xDomain !== undefined && yDomain == undefined){
                    band.transition().duration(1)
                        .attr("width", Math.abs(bandPos[0] - pos[0]))
                        .attr("height", d3.max(yScale.range()) + yScale.rangeBand());
                }else if( xDomain == undefined && yDomain == undefined){
                    return false;
                }
                dragZoomConfig.bandPos = bandPos;
                // $$.redrawForZoom.call($$);

            })
            .on("dragend", function() {
                d3.select(this).style('fill', 'none');

                var flagZoomOutX = false,
                    flagZoomOutY = false;

                var pos = d3.mouse(this),
                    x1, x2, y1, y2;

                var dragZoomConfig = $$.dragZoom.config,
                    afterPos = dragZoomConfig.afterPos,
                    beforePos = dragZoomConfig.beforePos,
                    zoomMiniSize = dragZoomConfig.zoomMiniSize,
                    bandPos = dragZoomConfig.bandPos,
                    zoomArea = dragZoomConfig.zoomArea,
                    xDomain = dragZoomConfig.xDomain,
                    yDomain = dragZoomConfig.yDomain;

                var xScale = $$.x,
                    yScale = $$.y;

                afterPos = Object.assign({}, pos);

                if( Math.abs(beforePos[0] - afterPos[0]) <= zoomMiniSize || Math.abs(beforePos[1] - afterPos[1]) <= zoomMiniSize ){
                    $$.dragZoom.config.bandPos = [-1, -1];
                    return;
                }

                if(xDomain !== undefined){
                    if( dragZoomConfig.rotated ){
                        x1 = xScale.invert(bandPos[1]);
                        x2 = xScale.invert(pos[1]);
                    }
                    else{
                        x1 = xScale.invert(bandPos[0]);
                        x2 = xScale.invert(pos[0]);
                    }

                    if( dragZoomConfig.rotated ){
                        if (x1 < x2) {
                            zoomArea.x1 = x1;
                            zoomArea.x2 = x2;
                        } else {
                            zoomArea.x1 = x2;
                            zoomArea.x2 = x1;
                            flagZoomOutX = true;
                        }
                    }else{
                        if (x1 < x2) {
                            zoomArea.x1 = x1;
                            zoomArea.x2 = x2;
                        } else {
                            zoomArea.x1 = x2;
                            zoomArea.x2 = x1;
                            flagZoomOutX = true;
                        }
                    }
                }

                if(yDomain !== undefined){
                    if( dragZoomConfig.rotated ){
                        y1 = yScale.invert(bandPos[0]);
                        y2 = yScale.invert(pos[0]);
                    }
                    else{
                        y1 = yScale.invert(bandPos[1]);
                        y2 = yScale.invert(pos[1]);
                    }

                    if( dragZoomConfig.rotated ){
                        if (y1 < y2) {
                            zoomArea.y1 = y1;
                            zoomArea.y2 = y2;
                        } else {
                            zoomArea.y1 = y2;
                            zoomArea.y2 = y1;
                            flagZoomOutY = true;
                        }
                    }else{
                        if (y1 > y2) {
                            zoomArea.y1 = y1;
                            zoomArea.y2 = y2;
                        } else {
                            zoomArea.y1 = y2;
                            zoomArea.y2 = y1;
                            flagZoomOutY = true;
                        }
                    }
                }

                $$.dragZoom.config.bandPos = [-1, -1];

                $$.main.select('.' + CLASS.zoomAreaBand).transition()
                    .attr("width", 0)
                    .attr("height", 0)
                    .attr("x", $$.dragZoom.config.bandPos[0])
                    .attr("y", $$.dragZoom.config.bandPos[1]);

                if(xDomain !== undefined && yDomain !== undefined){
                    if(flagZoomOutX && flagZoomOutY){
                        _zoomOutAction();
                    }else{
                        _zoomAction();
                    }
                }else if(xDomain == undefined && yDomain !== undefined){
                    if(flagZoomOutY){
                        _zoomOutAction();
                    }else{
                        _zoomAction();
                    }
                }else if(yDomain == undefined && xDomain !== undefined){
                    if(flagZoomOutX){
                        _zoomOutAction();
                    }else{
                        _zoomAction();
                    }
                }

                function _zoomAction(){
                    $$.dragZoom.zoomIn();
                }

                function _zoomOutAction(){
                    $$.dragZoom.zoomOut();
                }

                // $$.updateZoom();
                // config.zoom_onzoomend.call($$.api, $$.x.orgDomain());

                $$.redraw({
                    withUpdateYAxisByDragZoom: $$.config.customzoom_enabled
                    // withTransition: true,
                    // withY: true,
                    // withSubchart: true,
                    // withEventRect: true,
                    // withDimension: true
                });
            });

        $$.dragZoom.zoomIn = function () {
            var xDomain = this.config.xDomain,
                yDomain = this.config.yDomain,
                zoomArea = this.config.zoomArea;

            //recalculate domains
            if(xDomain !== undefined){
                if (zoomArea.x1 > zoomArea.x2) {
                    $$.x.domain([zoomArea.x2, zoomArea.x1]);
                } else {
                    $$.x.domain([zoomArea.x1, zoomArea.x2]);
                }
            }

            if(yDomain !== undefined){
                if (zoomArea.y1 > zoomArea.y2) {
                    $$.y.domain([zoomArea.y2, zoomArea.y1]);
                } else {
                    $$.y.domain([zoomArea.y1, zoomArea.y2]);
                }
            }

            if( $$.config.customzoom_useHistory ){
                this.config.zoomHistory.push(Object.assign({}, zoomArea));
            }
        };

        $$.dragZoom.zoomOut = function () {
            var xDomain = this.config.xDomain,
                yDomain = this.config.yDomain,
                zoomArea = this.config.zoomArea;

            if( !$$.config.customzoom_useHistory ){
                if(xDomain !== undefined){
                    $$.x.domain([xDomain.min, xDomain.max]);
                }
                if(yDomain !== undefined){
                    $$.y.domain([yDomain.min, yDomain.max]);
                }
            }else{
                this.config.zoomHistory.pop();
                if( this.config.zoomHistory.length == 0 ){
                    if(xDomain !== undefined){
                        $$.x.domain([xDomain.min, xDomain.max]);
                    }
                    if(yDomain !== undefined){
                        $$.y.domain([yDomain.min, yDomain.max]);
                    }
                }else{
                    zoomArea = this.config.zoomHistory[this.config.zoomHistory.length - 1];
                    if(xDomain !== undefined){
                        if (zoomArea.x1 > zoomArea.x2) {
                            $$.x.domain([zoomArea.x2, zoomArea.x1]);
                        } else {
                            $$.x.domain([zoomArea.x1, zoomArea.x2]);
                        }
                    }

                    if(yDomain !== undefined){
                        if (zoomArea.y1 > zoomArea.y2) {
                            $$.y.domain([zoomArea.y2, zoomArea.y1]);
                        } else {
                            $$.y.domain([zoomArea.y1, zoomArea.y2]);
                        }
                    }
                }
            }
        }
    };

    c3_chart_internal_fn.redraw = function (options, transitions) {
        var $$ = this, main = $$.main, d3 = $$.d3, config = $$.config;
        var areaIndices = $$.getShapeIndices($$.isAreaType), barIndices = $$.getShapeIndices($$.isBarType), lineIndices = $$.getShapeIndices($$.isLineType);
        var withY, withSubchart, withTransition, withTransitionForExit, withTransitionForAxis,
            withTransform, withUpdateXDomain, withUpdateOrgXDomain, withTrimXDomain, withLegend,
            withEventRect, withDimension, withUpdateXAxis;
        var withUpdateYAxisByDragZoom;
        var hideAxis = $$.hasArcType();
        var drawArea, drawBar, drawLine, xForText, yForText;
        var duration, durationForExit, durationForAxis;
        var waitForDraw, flow;
        var targetsToShow = $$.filterTargetsToShow($$.data.targets), tickValues, i, intervalForCulling, xDomainForZoom;
        var xv = $$.xv.bind($$), cx, cy;

        options = options || {};
        withY = getOption(options, "withY", true);
        withSubchart = getOption(options, "withSubchart", true);
        withTransition = getOption(options, "withTransition", true);
        withTransform = getOption(options, "withTransform", false);
        withUpdateXDomain = getOption(options, "withUpdateXDomain", false);
        withUpdateOrgXDomain = getOption(options, "withUpdateOrgXDomain", false);
        withTrimXDomain = getOption(options, "withTrimXDomain", true);
        withUpdateXAxis = getOption(options, "withUpdateXAxis", withUpdateXDomain);
        withLegend = getOption(options, "withLegend", false);
        withEventRect = getOption(options, "withEventRect", true);
        withDimension = getOption(options, "withDimension", true);
        withTransitionForExit = getOption(options, "withTransitionForExit", withTransition);
        withTransitionForAxis = getOption(options, "withTransitionForAxis", withTransition);
        //custom
        withUpdateYAxisByDragZoom = getOption(options, "withUpdateYAxisByDragZoom", false);

        duration = withTransition ? config.transition_duration : 0;
        durationForExit = withTransitionForExit ? duration : 0;
        durationForAxis = withTransitionForAxis ? duration : 0;

        transitions = transitions || $$.axis.generateTransitions(durationForAxis);

        // update legend and transform each g
        if (withLegend && config.legend_show) {
            $$.updateLegend($$.mapToIds($$.data.targets), options, transitions);
        } else if (withDimension) {
            // need to update dimension (e.g. axis.y.tick.values) because y tick values should change
            // no need to update axis in it because they will be updated in redraw()
            $$.updateDimension(true);
        }

        // MEMO: needed for grids calculation
        if ($$.isCategorized() && targetsToShow.length === 0) {
            $$.x.domain([0, $$.axes.x.selectAll('.tick').size()]);
        }

        if (targetsToShow.length) {
            $$.updateXDomain(targetsToShow, withUpdateXDomain, withUpdateOrgXDomain, withTrimXDomain);
            if (!config.axis_x_tick_values) {
                tickValues = $$.axis.updateXAxisTickValues(targetsToShow);
            }
        } else {
            $$.xAxis.tickValues([]);
            $$.subXAxis.tickValues([]);
        }

        if (config.zoom_rescale && !options.flow) {
            xDomainForZoom = $$.x.orgDomain();
        }

        if( !withUpdateYAxisByDragZoom ){
            $$.y.domain($$.getYDomain(targetsToShow, 'y', xDomainForZoom));
            $$.y2.domain($$.getYDomain(targetsToShow, 'y2', xDomainForZoom));
        }
        // else{
        //     console.log($$.y.domain(), $$.y2.domain());
        // }

        if (!config.axis_y_tick_values && config.axis_y_tick_count) {
            $$.yAxis.tickValues($$.axis.generateTickValues($$.y.domain(), config.axis_y_tick_count));
        }
        if (!config.axis_y2_tick_values && config.axis_y2_tick_count) {
            $$.y2Axis.tickValues($$.axis.generateTickValues($$.y2.domain(), config.axis_y2_tick_count));
        }

        // axes
        $$.axis.redraw(transitions, hideAxis);

        // Update axis label
        $$.axis.updateLabels(withTransition);

        // show/hide if manual culling needed
        if ((withUpdateXDomain || withUpdateXAxis) && targetsToShow.length) {
            if (config.axis_x_tick_culling && tickValues) {
                for (i = 1; i < tickValues.length; i++) {
                    if (tickValues.length / i < config.axis_x_tick_culling_max) {
                        intervalForCulling = i;
                        break;
                    }
                }
                $$.svg.selectAll('.' + CLASS.axisX + ' .tick text').each(function (e) {
                    var index = tickValues.indexOf(e);
                    if (index >= 0) {
                        d3.select(this).style('display', index % intervalForCulling ? 'none' : 'block');
                    }
                });
            } else {
                $$.svg.selectAll('.' + CLASS.axisX + ' .tick text').style('display', 'block');
            }
        }

        // setup drawer - MEMO: these must be called after axis updated
        drawArea = $$.generateDrawArea ? $$.generateDrawArea(areaIndices, false) : undefined;
        drawBar = $$.generateDrawBar ? $$.generateDrawBar(barIndices) : undefined;
        drawLine = $$.generateDrawLine ? $$.generateDrawLine(lineIndices, false) : undefined;
        xForText = $$.generateXYForText(areaIndices, barIndices, lineIndices, true);
        yForText = $$.generateXYForText(areaIndices, barIndices, lineIndices, false);

        // Update sub domain
        if (withY) {
            $$.subY.domain($$.getYDomain(targetsToShow, 'y'));
            $$.subY2.domain($$.getYDomain(targetsToShow, 'y2'));
        }

        // xgrid focus
        $$.updateXgridFocus();

        // Data empty label positioning and text.
        main.select("text." + CLASS.text + '.' + CLASS.empty)
            .attr("x", $$.width / 2)
            .attr("y", $$.height / 2)
            .text(config.data_empty_label_text)
            .transition()
            .style('opacity', targetsToShow.length ? 0 : 1);

        // grid
        $$.updateGrid(duration);

        // rect for regions
        $$.updateRegion(duration);

        // bars
        if( $$.config.customzoom_enabled ){
            $$.updateBarByDragZoom(durationForExit);
        }else{
            $$.updateBar(durationForExit);
        }

        // lines, areas and cricles
        $$.updateLine(durationForExit);
        $$.updateArea(durationForExit);
        if ( $$.config.customzoom_enabled ){
            $$.updateCircleByDragZoom();
        }else {
            $$.updateCircle();
        }

        // text
        if ($$.hasDataLabel()) {
            if( $$.config.customzoom_enabled ){
                $$.updateTextByDragZoom(durationForExit);
            }else{
                $$.updateText(durationForExit);
            }
        }

        // title
        if ($$.redrawTitle) { $$.redrawTitle(); }

        // arc
        if ($$.redrawArc) { $$.redrawArc(duration, durationForExit, withTransform); }

        // subchart
        if ($$.redrawSubchart) {
            $$.redrawSubchart(withSubchart, transitions, duration, durationForExit, areaIndices, barIndices, lineIndices);
        }

        // circles for select
        main.selectAll('.' + CLASS.selectedCircles)
            .filter($$.isBarType.bind($$))
            .selectAll('circle')
            .remove();

        // event rects will redrawn when flow called
        if (config.interaction_enabled && !options.flow && withEventRect) {
            $$.redrawEventRect();
            if ($$.updateZoom) { $$.updateZoom(); }
        }

        // update circleY based on updated parameters
        $$.updateCircleY();

        // generate circle x/y functions depending on updated params
        cx = ($$.config.axis_rotated ? $$.circleY : $$.circleX).bind($$);
        cy = ($$.config.axis_rotated ? $$.circleX : $$.circleY).bind($$);

        if (options.flow) {
            flow = $$.generateFlow({
                targets: targetsToShow,
                flow: options.flow,
                duration: options.flow.duration,
                drawBar: drawBar,
                drawLine: drawLine,
                drawArea: drawArea,
                cx: cx,
                cy: cy,
                xv: xv,
                xForText: xForText,
                yForText: yForText
            });
        }

        if ((duration || flow) && $$.isTabVisible()) { // Only use transition if tab visible. See #938.
            // transition should be derived from one transition
            d3.transition().duration(duration).each(function () {
                var transitionsToWait = [];

                // redraw and gather transitions
                [
                    $$.redrawBar(drawBar, true),
                    $$.redrawLine(drawLine, true),
                    $$.redrawArea(drawArea, true),
                    $$.redrawCircle(cx, cy, true),
                    $$.redrawText(xForText, yForText, options.flow, true),
                    $$.redrawRegion(true),
                    $$.redrawGrid(true),
                ].forEach(function (transitions) {
                    transitions.forEach(function (transition) {
                        transitionsToWait.push(transition);
                    });
                });

                // Wait for end of transitions to call flow and onrendered callback
                waitForDraw = $$.generateWait();
                transitionsToWait.forEach(function (t) {
                    waitForDraw.add(t);
                });
            })
                .call(waitForDraw, function () {
                    if (flow) {
                        flow();
                    }
                    if (config.onrendered) {
                        config.onrendered.call($$);
                    }
                });
        }
        else {
            $$.redrawBar(drawBar);
            $$.redrawLine(drawLine);
            $$.redrawArea(drawArea);
            $$.redrawCircle(cx, cy);
            $$.redrawText(xForText, yForText, options.flow);
            $$.redrawRegion();
            $$.redrawGrid();
            if (config.onrendered) {
                config.onrendered.call($$);
            }
        }

        // update fadein condition
        $$.mapToIds($$.data.targets).forEach(function (id) {
            $$.withoutFadeIn[id] = true;
        });
    };

    c3_chart_internal_fn.updateText = function (durationForExit) {
        var $$ = this, config = $$.config,
            barOrLineData = $$.barOrLineData.bind($$),
            classText = $$.classText.bind($$);
        $$.mainText = $$.main.selectAll('.' + CLASS.texts).selectAll('.' + CLASS.text)
            .data(barOrLineData);
        $$.mainText.enter().append('text')
            .attr("class", classText)
            .attr('text-anchor', function (d) { return config.axis_rotated ? (d.value < 0 ? 'end' : 'start') : 'middle'; })
            .style("stroke", 'none')
            .style("fill", function (d) { return $$.color(d); })
            .style("fill-opacity", 0)
            .style("pointer-events", "all");
        if(config.updateText) {
            config.updateText.call($$, $$);
        }else {
            $$.mainText
                .text(function (d, i, j) { return $$.dataLabelFormat(d.id)(d.value, d.id, i, j); })
                .append("svg:title")
                .text(function (d, i, j) { return $$.dataLabelFormat(d.id)(d.value, d.id, i, j); });
        }
        $$.mainText.exit()
            .transition().duration(durationForExit)
            .style('fill-opacity', 0)
            .remove();
    };

    //by jwhong
    c3_chart_internal_fn.updateTextByDragZoom = function (durationForExit) {
        var $$ = this, config = $$.config,
            barOrLineData = $$.barOrLineData.bind($$),
            classText = $$.classText.bind($$);

        //custom add
        function mouseout() {
            $$.svg.select('.' + CLASS.eventRect).style('cursor', null);
            $$.hideXGridFocus();
            $$.hideTooltip();
            $$.unexpandCircles();
            $$.unexpandBars();
        }

        $$.mainText = $$.main.selectAll('.' + CLASS.texts).selectAll('.' + CLASS.text)
            .data(barOrLineData);
        $$.mainText.enter().append('text')
            .attr("class", classText)
            .attr('text-anchor', function (d) { return config.axis_rotated ? (d.value < 0 ? 'end' : 'start') : 'middle'; })
            .style("stroke", 'none')
            .style("fill", function (d) { return $$.color(d); })
            .style("fill-opacity", 0)
            .attr("pointer-events", "all")
            .on('mouseenter', function(d) {
                if( $$.isMultipleX() ){
                    //not action..
                }else{
                    var index = d.index;

                    if ($$.dragging || $$.flowing) { return; } // do nothing while dragging/flowing
                    if ($$.hasArcType()) { return; }

                    // Expand shapes for selection
                    if (config.point_focus_expand_enabled) { $$.expandCircles(index, null, true); }
                    $$.expandBars(index, null, true);

                    // Call event handler
                    $$.main.selectAll('.' + CLASS.shape + '-' + index).each(function (d) {
                        config.data_onmouseover.call($$.api, d);
                    });
                }
            })
            .on('mousemove', function(d) {
                if( $$.isMultipleX() ){
                    var targetsToShow = $$.filterTargetsToShow($$.data.targets);
                    var mouse, closest, sameXData, selectedData;

                    if ($$.dragging) { return; } // do nothing when dragging
                    if ($$.hasArcType(targetsToShow)) { return; }

                    mouse = d3.mouse(this);
                    closest = $$.findClosestFromTargets(targetsToShow, mouse);

                    if ($$.mouseover && (!closest || closest.id !== $$.mouseover.id)) {
                        config.data_onmouseout.call($$.api, $$.mouseover);
                        $$.mouseover = undefined;
                    }

                    if (! closest) {
                        mouseout();
                        return;
                    }

                    if ($$.isScatterType(closest) || !config.tooltip_grouped) {
                        sameXData = [closest];
                    } else {
                        sameXData = $$.filterByX(targetsToShow, closest.x);
                    }

                    // show tooltip when cursor is close to some point
                    selectedData = sameXData.map(function (d) {
                        return $$.addName(d);
                    });
                    $$.showTooltip(selectedData, this);

                    // expand points
                    if (config.point_focus_expand_enabled) {
                        $$.expandCircles(closest.index, closest.id, true);
                    }
                    $$.expandBars(closest.index, closest.id, true);

                    // Show xgrid focus line
                    $$.showXGridFocus(selectedData);

                    // Show cursor as pointer if point is close to mouse position
                    if ($$.isBarType(closest.id) || $$.dist(closest, mouse) < config.point_sensitivity) {
                        $$.svg.select('.' + CLASS.eventRect).style('cursor', 'pointer');
                        if (!$$.mouseover) {
                            config.data_onmouseover.call($$.api, closest);
                            $$.mouseover = closest;
                        }
                    }
                }else {
                    var selectedData, index = d.index,
                        eventRect = $$.svg.select('.' + CLASS.eventRect + '-' + index);

                    if ($$.dragging || $$.flowing) { return; } // do nothing while dragging/flowing
                    if ($$.hasArcType()) { return; }
                    // if( $$.dragZoomDragging ){ return; }

                    if ($$.isStepType(d) && $$.config.line_step_type === 'step-after' && d3.mouse(this)[0] < $$.x($$.getXValue(d.id, index))) {
                        index -= 1;
                    }

                    // Show tooltip
                    selectedData = $$.filterTargetsToShow($$.data.targets).map(function (t) {
                        return $$.addName($$.getValueOnIndex(t.values, index));
                    });

                    if (config.tooltip_grouped) {
                        $$.showTooltip(selectedData, this);
                        $$.showXGridFocus(selectedData);
                    }

                    if (config.tooltip_grouped && (!config.data_selection_enabled || config.data_selection_grouped)) {
                        return;
                    }

                    $$.main.selectAll('.' + CLASS.shape + '-' + index)
                        .each(function () {
                            d3.select(this).classed(CLASS.EXPANDED, true);
                            if (config.data_selection_enabled) {
                                eventRect.style('cursor', config.data_selection_grouped ? 'pointer' : null);
                            }
                            if (!config.tooltip_grouped) {
                                $$.hideXGridFocus();
                                $$.hideTooltip();
                                if (!config.data_selection_grouped) {
                                    $$.unexpandCircles(index);
                                    $$.unexpandBars(index);
                                }
                            }
                        })
                        .filter(function (d) {
                            return $$.isWithinShape(this, d);
                        })
                        .each(function (d) {
                            if (config.data_selection_enabled && (config.data_selection_grouped || config.data_selection_isselectable(d))) {
                                eventRect.style('cursor', 'pointer');
                            }
                            if (!config.tooltip_grouped) {
                                $$.showTooltip([d], this);
                                $$.showXGridFocus([d]);
                                if (config.point_focus_expand_enabled) { $$.expandCircles(index, d.id, true); }
                                $$.expandBars(index, d.id, true);
                            }
                        });
                }
            })
            .on('mouseleave', function(d) {
                if( $$.isMultipleX() ){
                    if (!$$.config) { return; } // chart is destroyed
                    if ($$.hasArcType()) { return; }
                    mouseout();
                }else {
                    var index = d.index;
                    if (!$$.config) { return; } // chart is destroyed
                    if ($$.hasArcType()) { return; }
                    $$.hideXGridFocus();
                    $$.hideTooltip();
                    // Undo expanded shapes
                    $$.unexpandCircles();
                    $$.unexpandBars();
                    // Call event handler
                    $$.main.selectAll('.' + CLASS.shape + '-' + index).each(function (d) {
                        config.data_onmouseout.call($$.api, d);
                    });
                }
            })
            .on('click', function(d) {
                var index = d.index;
                if ($$.hasArcType() || !$$.toggleShape) { return; }
                if ($$.cancelClick) {
                    $$.cancelClick = false;
                    return;
                }
                if ($$.isStepType(d) && config.line_step_type === 'step-after' && d3.mouse(this)[0] < $$.x($$.getXValue(d.id, index))) {
                    index -= 1;
                }
                $$.main.selectAll('.' + CLASS.shape + '-' + index).each(function (d) {
                    if (config.data_selection_grouped || $$.isWithinShape(this, d)) {
                        $$.toggleShape(this, d, index);
                        $$.config.data_onclick.call($$.api, d, this);
                    }
                });
            });
        $$.mainText
            .text(function (d, i, j) { return $$.dataLabelFormat(d.id)(d.value, d.id, i, j); });
        $$.mainText.exit()
            .transition().duration(durationForExit)
            .style('fill-opacity', 0)
            .remove();
    };

    //by jwhong
    c3_chart_internal_fn.updateBarByDragZoom = function (durationForExit) {
        var $$ = this,
            barData = $$.barData.bind($$),
            classBar = $$.classBar.bind($$),
            initialOpacity = $$.initialOpacity.bind($$),
            color = function (d) { return $$.color(d.id); };

        var d3 = $$.d3, config = $$.config;

        $$.mainBar = $$.main.selectAll('.' + CLASS.bars).selectAll('.' + CLASS.bar)
            .data(barData);
        $$.mainBar.enter().append('path')
            .attr("class", classBar)
            .style("stroke", color)
            .style("fill", color)
            .attr("pointer-events", "all")
            .on("mouseenter", function(d) {
                if( $$.isMultipleX() ){
                    //not action..
                }else{
                    var index = d.index;

                    if ($$.dragging || $$.flowing) { return; } // do nothing while dragging/flowing
                    if ($$.hasArcType()) { return; }

                    // Expand shapes for selection
                    if (config.point_focus_expand_enabled) { $$.expandCircles(index, null, true); }
                    $$.expandBars(index, null, true);

                    // Call event handler
                    $$.main.selectAll('.' + CLASS.shape + '-' + index).each(function (d) {
                        config.data_onmouseover.call($$.api, d);
                    });
                }
            })
            .on("mousemove", function(d) {
                if( $$.isMultipleX() ){
                    var targetsToShow = $$.filterTargetsToShow($$.data.targets);
                    var mouse, closest, sameXData, selectedData;

                    if ($$.dragging) { return; } // do nothing when dragging
                    if ($$.hasArcType(targetsToShow)) { return; }

                    mouse = d3.mouse(this);
                    closest = $$.findClosestFromTargets(targetsToShow, mouse);

                    if ($$.mouseover && (!closest || closest.id !== $$.mouseover.id)) {
                        config.data_onmouseout.call($$.api, $$.mouseover);
                        $$.mouseover = undefined;
                    }

                    if (! closest) {
                        mouseout();
                        return;
                    }

                    if ($$.isScatterType(closest) || !config.tooltip_grouped) {
                        sameXData = [closest];
                    } else {
                        sameXData = $$.filterByX(targetsToShow, closest.x);
                    }

                    // show tooltip when cursor is close to some point
                    selectedData = sameXData.map(function (d) {
                        return $$.addName(d);
                    });
                    $$.showTooltip(selectedData, this);

                    // expand points
                    if (config.point_focus_expand_enabled) {
                        $$.expandCircles(closest.index, closest.id, true);
                    }
                    $$.expandBars(closest.index, closest.id, true);

                    // Show xgrid focus line
                    $$.showXGridFocus(selectedData);

                    // Show cursor as pointer if point is close to mouse position
                    if ($$.isBarType(closest.id) || $$.dist(closest, mouse) < config.point_sensitivity) {
                        $$.svg.select('.' + CLASS.eventRect).style('cursor', 'pointer');
                        if (!$$.mouseover) {
                            config.data_onmouseover.call($$.api, closest);
                            $$.mouseover = closest;
                        }
                    }
                }else {
                    var selectedData, index = d.index,
                        eventRect = $$.svg.select('.' + CLASS.eventRect + '-' + index);

                    if ($$.dragging || $$.flowing) { return; } // do nothing while dragging/flowing
                    if ($$.hasArcType()) { return; }

                    if ($$.isStepType(d) && $$.config.line_step_type === 'step-after' && d3.mouse(this)[0] < $$.x($$.getXValue(d.id, index))) {
                        index -= 1;
                    }

                    // Show tooltip
                    selectedData = $$.filterTargetsToShow($$.data.targets).map(function (t) {
                        return $$.addName($$.getValueOnIndex(t.values, index));
                    });

                    if (config.tooltip_grouped) {
                        $$.showTooltip(selectedData, this);
                        $$.showXGridFocus(selectedData);
                    }

                    if (config.tooltip_grouped && (!config.data_selection_enabled || config.data_selection_grouped)) {
                        return;
                    }

                    $$.main.selectAll('.' + CLASS.shape + '-' + index)
                        .each(function () {
                            d3.select(this).classed(CLASS.EXPANDED, true);
                            if (config.data_selection_enabled) {
                                eventRect.style('cursor', config.data_selection_grouped ? 'pointer' : null);
                            }
                            if (!config.tooltip_grouped) {
                                $$.hideXGridFocus();
                                $$.hideTooltip();
                                if (!config.data_selection_grouped) {
                                    $$.unexpandCircles(index);
                                    $$.unexpandBars(index);
                                }
                            }
                        })
                        .filter(function (d) {
                            return $$.isWithinShape(this, d);
                        })
                        .each(function (d) {
                            if (config.data_selection_enabled && (config.data_selection_grouped || config.data_selection_isselectable(d))) {
                                eventRect.style('cursor', 'pointer');
                            }
                            if (!config.tooltip_grouped) {
                                $$.showTooltip([d], this);
                                $$.showXGridFocus([d]);
                                if (config.point_focus_expand_enabled) { $$.expandCircles(index, d.id, true); }
                                $$.expandBars(index, d.id, true);
                            }
                        });
                }
            })
            .on("mouseleave", function(d) {
                if( $$.isMultipleX() ){
                    console.log('multi mouseout - ');
                    if (!$$.config) { return; } // chart is destroyed
                    if ($$.hasArcType()) { return; }
                    mouseout();
                }else {
                    var index = d.index;
                    if (!$$.config) { return; } // chart is destroyed
                    if ($$.hasArcType()) { return; }
                    $$.hideXGridFocus();
                    $$.hideTooltip();
                    // Undo expanded shapes
                    $$.unexpandCircles();
                    $$.unexpandBars();
                    // Call event handler
                    $$.main.selectAll('.' + CLASS.shape + '-' + index).each(function (d) {
                        config.data_onmouseout.call($$.api, d);
                    });
                }
            })
            .on('click', function(d) {
                var index = d.index;
                if ($$.hasArcType() || !$$.toggleShape) { return; }
                if ($$.cancelClick) {
                    $$.cancelClick = false;
                    return;
                }
                if ($$.isStepType(d) && config.line_step_type === 'step-after' && d3.mouse(this)[0] < $$.x($$.getXValue(d.id, index))) {
                    index -= 1;
                }
                $$.main.selectAll('.' + CLASS.shape + '-' + index).each(function (d) {
                    if (config.data_selection_grouped || $$.isWithinShape(this, d)) {
                        $$.toggleShape(this, d, index);
                        $$.config.data_onclick.call($$.api, d, this);
                    }
                });
            })
        $$.mainBar
            .style("opacity", initialOpacity);
        $$.mainBar.exit().transition().duration(durationForExit)
            .style('opacity', 0)
            .remove();
    };

    // by jwhong
    c3_chart_internal_fn.updateCircleByDragZoom = function () {
        var $$ = this, d3 = $$.d3, config = $$.config;

        //custom add
        function mouseout() {
            $$.svg.select('.' + CLASS.eventRect).style('cursor', null);
            $$.hideXGridFocus();
            $$.hideTooltip();
            $$.unexpandCircles();
            $$.unexpandBars();
        }

        $$.mainCircle = $$.main.selectAll('.' + CLASS.circles).selectAll('.' + CLASS.circle)
            .data($$.lineOrScatterData.bind($$));
        $$.mainCircle.enter().append("circle")
            .attr("class", $$.classCircle.bind($$))
            .attr("r", $$.pointR.bind($$))
            //custom
            .attr("pointer-events", "all")
            .style("fill", $$.color)
            .on('mouseenter', function(d) {
                if( $$.isMultipleX() ){
                    //not action..
                }else{
                    var index = d.index;

                    if ($$.dragging || $$.flowing) { return; } // do nothing while dragging/flowing
                    if ($$.hasArcType()) { return; }

                    // Expand shapes for selection
                    if (config.point_focus_expand_enabled) { $$.expandCircles(index, null, true); }
                    $$.expandBars(index, null, true);

                    // Call event handler
                    $$.main.selectAll('.' + CLASS.shape + '-' + index).each(function (d) {
                        config.data_onmouseover.call($$.api, d);
                    });
                }
            })
            .on('mousemove', function(d) {
                if( $$.isMultipleX() ){
                    var targetsToShow = $$.filterTargetsToShow($$.data.targets);
                    var mouse, closest, sameXData, selectedData;

                    if ($$.dragging) { return; } // do nothing when dragging
                    if ($$.hasArcType(targetsToShow)) { return; }

                    mouse = d3.mouse(this);
                    closest = $$.findClosestFromTargets(targetsToShow, mouse);

                    if ($$.mouseover && (!closest || closest.id !== $$.mouseover.id)) {
                        config.data_onmouseout.call($$.api, $$.mouseover);
                        $$.mouseover = undefined;
                    }

                    if (! closest) {
                        mouseout();
                        return;
                    }

                    if ($$.isScatterType(closest) || !config.tooltip_grouped) {
                        sameXData = [closest];
                    } else {
                        sameXData = $$.filterByX(targetsToShow, closest.x);
                    }

                    // show tooltip when cursor is close to some point
                    selectedData = sameXData.map(function (d) {
                        return $$.addName(d);
                    });
                    $$.showTooltip(selectedData, this);

                    // expand points
                    if (config.point_focus_expand_enabled) {
                        $$.expandCircles(closest.index, closest.id, true);
                    }
                    $$.expandBars(closest.index, closest.id, true);

                    // Show xgrid focus line
                    $$.showXGridFocus(selectedData);

                    // Show cursor as pointer if point is close to mouse position
                    if ($$.isBarType(closest.id) || $$.dist(closest, mouse) < config.point_sensitivity) {
                        $$.svg.select('.' + CLASS.eventRect).style('cursor', 'pointer');
                        if (!$$.mouseover) {
                            config.data_onmouseover.call($$.api, closest);
                            $$.mouseover = closest;
                        }
                    }
                }else {
                    var selectedData, index = d.index,
                        eventRect = $$.svg.select('.' + CLASS.eventRect + '-' + index);

                    if ($$.dragging || $$.flowing) { return; } // do nothing while dragging/flowing
                    if ($$.hasArcType()) { return; }
                    // if( $$.dragZoomDragging ){ return; }

                    if ($$.isStepType(d) && $$.config.line_step_type === 'step-after' && d3.mouse(this)[0] < $$.x($$.getXValue(d.id, index))) {
                        index -= 1;
                    }

                    // Show tooltip
                    selectedData = $$.filterTargetsToShow($$.data.targets).map(function (t) {
                        return $$.addName($$.getValueOnIndex(t.values, index));
                    });

                    if (config.tooltip_grouped) {
                        $$.showTooltip(selectedData, this);
                        $$.showXGridFocus(selectedData);
                    }

                    if (config.tooltip_grouped && (!config.data_selection_enabled || config.data_selection_grouped)) {
                        return;
                    }

                    $$.main.selectAll('.' + CLASS.shape + '-' + index)
                        .each(function () {
                            d3.select(this).classed(CLASS.EXPANDED, true);
                            if (config.data_selection_enabled) {
                                eventRect.style('cursor', config.data_selection_grouped ? 'pointer' : null);
                            }
                            if (!config.tooltip_grouped) {
                                $$.hideXGridFocus();
                                $$.hideTooltip();
                                if (!config.data_selection_grouped) {
                                    $$.unexpandCircles(index);
                                    $$.unexpandBars(index);
                                }
                            }
                        })
                        .filter(function (d) {
                            return $$.isWithinShape(this, d);
                        })
                        .each(function (d) {
                            if (config.data_selection_enabled && (config.data_selection_grouped || config.data_selection_isselectable(d))) {
                                eventRect.style('cursor', 'pointer');
                            }
                            if (!config.tooltip_grouped) {
                                $$.showTooltip([d], this);
                                $$.showXGridFocus([d]);
                                if (config.point_focus_expand_enabled) { $$.expandCircles(index, d.id, true); }
                                $$.expandBars(index, d.id, true);
                            }
                        });
                }
            })
            .on('mouseleave', function(d) {
                if( $$.isMultipleX() ){
                    if (!$$.config) { return; } // chart is destroyed
                    if ($$.hasArcType()) { return; }
                    mouseout();
                }else {
                    var index = d.index;
                    if (!$$.config) { return; } // chart is destroyed
                    if ($$.hasArcType()) { return; }
                    $$.hideXGridFocus();
                    $$.hideTooltip();
                    // Undo expanded shapes
                    $$.unexpandCircles();
                    $$.unexpandBars();
                    // Call event handler
                    $$.main.selectAll('.' + CLASS.shape + '-' + index).each(function (d) {
                        config.data_onmouseout.call($$.api, d);
                    });
                }
            })
            .on('click', function(d) {
                // console.log('check customzoom_enabled : click function ');
                var index = d.index;
                if ($$.hasArcType() || !$$.toggleShape) { return; }
                if ($$.cancelClick) {
                    $$.cancelClick = false;
                    return;
                }
                if ($$.isStepType(d) && config.line_step_type === 'step-after' && d3.mouse(this)[0] < $$.x($$.getXValue(d.id, index))) {
                    index -= 1;
                }
                $$.main.selectAll('.' + CLASS.shape + '-' + index).each(function (d) {
                    if (config.data_selection_grouped || $$.isWithinShape(this, d)) {
                        $$.toggleShape(this, d, index);
                        $$.config.data_onclick.call($$.api, d, this);
                    }
                });
            });
        $$.mainCircle
            .style("opacity", $$.initialOpacityForCircle.bind($$));
        $$.mainCircle.exit().remove();
    }

    // by jwhong
    c3_chart_internal_fn.initWithData = function (data) {
        var $$ = this, d3 = $$.d3, config = $$.config;
        var defs, main, binding = true;

        $$.axis = new Axis($$);

        if ($$.initPie) { $$.initPie(); }
        if ($$.initBrush) { $$.initBrush(); }
        if ($$.initZoom) { $$.initZoom(); }
        //custom by jwhong
        if ($$.initDragZoom) { $$.initDragZoom(); }

        if (!config.bindto) {
            $$.selectChart = d3.selectAll([]);
        }
        else if (typeof config.bindto.node === 'function') {
            $$.selectChart = config.bindto;
        }
        else {
            $$.selectChart = d3.select(config.bindto);
        }
        if ($$.selectChart.empty()) {
            $$.selectChart = d3.select(document.createElement('div')).style('opacity', 0);
            $$.observeInserted($$.selectChart);
            binding = false;
        }
        $$.selectChart.html("").classed("c3", true);

        // Init data as targets
        $$.data.xs = {};
        $$.data.targets = $$.convertDataToTargets(data);

        if (config.data_filter) {
            $$.data.targets = $$.data.targets.filter(config.data_filter);
        }

        // Set targets to hide if needed
        if (config.data_hide) {
            $$.addHiddenTargetIds(config.data_hide === true ? $$.mapToIds($$.data.targets) : config.data_hide);
        }
        if (config.legend_hide) {
            $$.addHiddenLegendIds(config.legend_hide === true ? $$.mapToIds($$.data.targets) : config.legend_hide);
        }

        // when gauge, hide legend // TODO: fix
        if ($$.hasType('gauge')) {
            config.legend_show = false;
        }

        // Init sizes and scales
        $$.updateSizes();
        $$.updateScales();

        // Set domains for each scale
        $$.x.domain(d3.extent($$.getXDomain($$.data.targets)));
        $$.y.domain($$.getYDomain($$.data.targets, 'y'));
        $$.y2.domain($$.getYDomain($$.data.targets, 'y2'));
        $$.subX.domain($$.x.domain());
        $$.subY.domain($$.y.domain());
        $$.subY2.domain($$.y2.domain());

        // Save original x domain for zoom update
        $$.orgXDomain = $$.x.domain();

        // Set initialized scales to brush and zoom
        if ($$.brush) { $$.brush.scale($$.subX); }
        if (config.zoom_enabled) { $$.zoom.scale($$.x); }

        /*-- Basic Elements --*/

        // Define svgs
        $$.svg = $$.selectChart.append("svg")
            .style("overflow", "hidden")
            .on('mouseenter', function () { return config.onmouseover.call($$); })
            .on('mouseleave', function () { return config.onmouseout.call($$); });

        if ($$.config.svg_classname) {
            $$.svg.attr('class', $$.config.svg_classname);
        }

        // Define defs
        defs = $$.svg.append("defs");
        $$.clipChart = $$.appendClip(defs, $$.clipId);
        $$.clipXAxis = $$.appendClip(defs, $$.clipIdForXAxis);
        $$.clipYAxis = $$.appendClip(defs, $$.clipIdForYAxis);
        $$.clipGrid = $$.appendClip(defs, $$.clipIdForGrid);
        $$.clipSubchart = $$.appendClip(defs, $$.clipIdForSubchart);
        $$.updateSvgSize();

        // Define regions
        main = $$.main = $$.svg.append("g").attr("transform", $$.getTranslate('main'));

        if ($$.initSubchart) { $$.initSubchart(); }
        if ($$.initTooltip) { $$.initTooltip(); }
        if ($$.initLegend) { $$.initLegend(); }
        if ($$.initTitle) { $$.initTitle(); }

        /*-- Main Region --*/

        // text when empty
        main.append("text")
            .attr("class", CLASS.text + ' ' + CLASS.empty)
            .attr("text-anchor", "middle") // horizontal centering of text at x position in all browsers.
            .attr("dominant-baseline", "middle"); // vertical centering of text at y position in all browsers, except IE.

        // Regions
        $$.initRegion();

        // Grids
        $$.initGrid();

        // Define g for chart area
        main.append('g')
            .attr("clip-path", $$.clipPath)
            .attr('class', CLASS.chart);

        // Grid lines
        if (config.grid_lines_front) { $$.initGridLines(); }

        //custom
        $$.initZoomArea();

        // Cover whole with rects for events
        if( !$$.config.customzoom_enabled ){
            $$.initEventRect();
        }

        // Define g for chart
        $$.initChartElements();

        // if zoom privileged, insert rect to forefront
        // TODO: is this needed?
        main.insert('rect', config.zoom_privileged ? null : 'g.' + CLASS.regions)
            .attr('class', CLASS.zoomRect)
            .attr('width', $$.width)
            .attr('height', $$.height)
            .style('opacity', 0)
            .on("dblclick.zoom", null);

        // Set default extent if defined
        if (config.axis_x_extent) { $$.brush.extent($$.getDefaultExtent()); }

        // Add Axis
        $$.axis.init();

        // Set targets
        $$.updateTargets($$.data.targets);
        $$.updateDragZoom();

        // Draw with targets
        if (binding) {
            $$.updateDimension();
            $$.config.oninit.call($$);
            $$.redraw({
                withTransition: false,
                withTransform: true,
                withUpdateXDomain: true,
                withUpdateOrgXDomain: true,
                withTransitionForAxis: false
            });
        }

        // Bind resize event
        $$.bindResize();

        // export element of the chart
        $$.api.element = $$.selectChart.node();
    };



/////////////////////////////splitline//////////////////////////////////////

    c3_chart_internal_fn.drawSplitLine = function(pos) {
        var $$ = this, config = $$.config, main = $$.main, d3 = $$.d3;

        if ($$.baseGroup) {
            $$.baseGroup.remove();
        }

        var categories = $$.config.axis_x_categories;
        var outputCategories = [];

        $$.baseGroup = main.select('.'+CLASS.chartBar)
            .append('g')
            .attr('class','base-line')
            .attr("transform", "translate(" + (pos[0] + "," + 0 + ")"));

        $$.baseGroup.append('line')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', $$.height)
            .style('stroke', 'grey')
            .style('stroke-width', 1);

        var rectsEl = $$.mainBar[0];
        rectsEl.map( function(r, i) {
            var rectSvg = d3.select(r);
            var pathArray = rectSvg.attr('d').split(' ');
            var xyArray = pathArray[2].split(',');
            var widthCompare = xyArray[0].replace(/\L/g,'');
            var compareArr = pathArray[4].split(',');
            var height = (+compareArr[1]) - (+xyArray[1]);
            var x = 0;
            var y = xyArray[1];
            var width = widthCompare - pos[0];
            if (width > 0) {
                outputCategories.push(categories[i]);
                $$.baseGroup.append('rect')
                    .attr('x', x)
                    .attr('y', y)
                    .attr('width', width)
                    .attr('height', height)
                    .attr('fill', 'red')
                    .attr('fill-opacity', 1);
            }
        })
        config.splitLineCallback.call($$, $$, outputCategories);
    };

/////////////////////////////splitline end ///////////////////////////////////

    // by jwhong
    c3_chart_internal_fn.updateDragZoom = function () {
        var $$ = this, d3 = $$.d3, config = $$.config;

        $$.dragZoom.config.xDomain = {
            min: d3.min($$.x.orgDomain()),
            max: d3.max($$.x.orgDomain())
        };

        $$.dragZoom.config.yDomain = {
            min: d3.min($$.y.domain()),
            max: d3.max($$.y.domain())
        }
        // console.log($$.x.domain(), $$.y.domain(), $$.x.orgDomain());
    }
    // by jwhong
    c3_chart_internal_fn.initZoomArea = function () {
        // var $$ = this, z = $$.config.zoom_enabled ? $$.zoom : function () {};
        var $$ = this, dz = $$.config.customzoom_enabled ? $$.dragZoom : function () {};

        var zoomWrafferEl = $$.main.select('.' + CLASS.chart).append("g")
            .attr("class", CLASS.zoomArea);

        zoomWrafferEl.append("rect")
            .attr("class", CLASS.zoomAreaOverlay)
            .call(dz);

        zoomWrafferEl.append("rect")
            .attr("class", CLASS.zoomAreaBand);
    }

    // by jwhong
    c3_chart_internal_fn.updateSvgSize = function () {
        var $$ = this,
            brush = $$.svg.select(".c3-brush .background");
        $$.svg.attr('width', $$.currentWidth).attr('height', $$.currentHeight);
        $$.svg.selectAll(['#' + $$.clipId, '#' + $$.clipIdForGrid]).select('rect')
            .attr('width', $$.width)
            .attr('height', $$.height);
        $$.svg.select('#' + $$.clipIdForXAxis).select('rect')
            .attr('x', $$.getXAxisClipX.bind($$))
            .attr('y', $$.getXAxisClipY.bind($$))
            .attr('width', $$.getXAxisClipWidth.bind($$))
            .attr('height', $$.getXAxisClipHeight.bind($$));
        $$.svg.select('#' + $$.clipIdForYAxis).select('rect')
            .attr('x', $$.getYAxisClipX.bind($$))
            .attr('y', $$.getYAxisClipY.bind($$))
            .attr('width', $$.getYAxisClipWidth.bind($$))
            .attr('height', $$.getYAxisClipHeight.bind($$));
        $$.svg.select('#' + $$.clipIdForSubchart).select('rect')
            .attr('width', $$.width)
            .attr('height', brush.size() ? brush.attr('height') : 0);
        $$.svg.select('.' + CLASS.zoomRect)
            .attr('width', $$.width)
            .attr('height', $$.height);
        //custom by jwhong
        $$.svg.select('.' + CLASS.zoomAreaOverlay)
            .attr('width', $$.width)
            .attr('height', $$.height);
        // MEMO: parent div's height will be bigger than svg when <!DOCTYPE html>
        $$.selectChart.style('max-height', $$.currentHeight + "px");
    };

    //by jwhong
    c3_chart_internal_fn.lineWithRegions = function (d, x, y, _regions) {
        var $$ = this, config = $$.config,
            prev = -1, i, j,
            s = "M", sWithRegion,
            xp, yp, dx, dy, dd, diff, diffx2,
            xOffset = $$.isCategorized() ? 0.5 : 0,
            xValue, yValue,
            regions = [];

        //custom by jwhong
        x = $$.x;
        y = $$.y;

        function isWithinRegions(x, regions) {
            var i;
            for (i = 0; i < regions.length; i++) {
                if (regions[i].start < x && x <= regions[i].end) { return true; }
            }
            return false;
        }

        // Check start/end of regions
        if (isDefined(_regions)) {
            for (i = 0; i < _regions.length; i++) {
                regions[i] = {};
                if (isUndefined(_regions[i].start)) {
                    regions[i].start = d[0].x;
                } else {
                    regions[i].start = $$.isTimeSeries() ? $$.parseDate(_regions[i].start) : _regions[i].start;
                }
                if (isUndefined(_regions[i].end)) {
                    regions[i].end = d[d.length - 1].x;
                } else {
                    regions[i].end = $$.isTimeSeries() ? $$.parseDate(_regions[i].end) : _regions[i].end;
                }
            }
        }

        // Set scales
        xValue = config.axis_rotated ? function (d) { return y(d.value); } : function (d) { return x(d.x); };
        yValue = config.axis_rotated ? function (d) { return x(d.x); } : function (d) { return y(d.value); };

        // Define svg generator function for region
        function generateM(points) {
            return 'M' + points[0][0] + ' ' + points[0][1] + ' ' + points[1][0] + ' ' + points[1][1];
        }
        if ($$.isTimeSeries()) {
            sWithRegion = function (d0, d1, j, diff) {
                var x0 = d0.x.getTime(), x_diff = d1.x - d0.x,
                    xv0 = new Date(x0 + x_diff * j),
                    xv1 = new Date(x0 + x_diff * (j + diff)),
                    points;
                if (config.axis_rotated) {
                    points = [[y(yp(j)), x(xv0)], [y(yp(j + diff)), x(xv1)]];
                } else {
                    points = [[x(xv0), y(yp(j))], [x(xv1), y(yp(j + diff))]];
                }
                return generateM(points);
            };
        } else {
            sWithRegion = function (d0, d1, j, diff) {
                var points;
                if (config.axis_rotated) {
                    points = [[y(yp(j), true), x(xp(j))], [y(yp(j + diff), true), x(xp(j + diff))]];
                } else {
                    points = [[$$.x(xp(j), true), y(yp(j))], [x(xp(j + diff), true), y(yp(j + diff))]];
                }
                return generateM(points);
            };
        }

        // Generate
        for (i = 0; i < d.length; i++) {

            // Draw as normal
            if (isUndefined(regions) || ! isWithinRegions(d[i].x, regions)) {
                s += " " + xValue(d[i]) + " " + yValue(d[i]);
            }
            // Draw with region // TODO: Fix for horizotal charts
            else {
                xp = $$.getScale(d[i - 1].x + xOffset, d[i].x + xOffset, $$.isTimeSeries());
                yp = $$.getScale(d[i - 1].value, d[i].value);

                dx = x(d[i].x) - x(d[i - 1].x);
                dy = y(d[i].value) - y(d[i - 1].value);
                dd = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
                diff = 2 / dd;
                diffx2 = diff * 2;

                for (j = diff; j <= 1; j += diffx2) {
                    s += sWithRegion(d[i - 1], d[i], j, diff);
                }
            }
            prev = d[i].x;
        }

        return s;
    };

    // by ywchoi
    var _appendNoData = function(main, template) {
        main.select("text." + CLASS.text + '.' + CLASS.empty)
            .style('display', 'none');

        var tempCount = main.selectAll('foreignObject.' + CLASS.empty);

        if(tempCount[0].length === 0) {
            main.append("foreignObject").html(template)
                .attr("class", CLASS.empty)
                .attr("width",  "100%")
                .attr("height", "100%");
        } else {
            main.select('foreignObject.' + CLASS.empty)
                .style('display', 'block');
        }
    };

    // by jwhong
    function Axis(owner) {
        API.call(this, owner);
    }

    Axis.prototype.init = function init() {

        var $$ = this.owner, config = $$.config, main = $$.main;
        $$.axes.x = main.append("g")
            .attr("class", CLASS.axis + ' ' + CLASS.axisX)
            .attr("clip-path", $$.clipPathForXAxis)
            .attr("transform", $$.getTranslate('x'))
            .style("visibility", config.axis_x_show ? 'visible' : 'hidden');
        $$.axes.x.append("text")
            .attr("class", CLASS.axisXLabel)
            .attr("transform", config.axis_rotated ? "rotate(-90)" : "")
            .style("text-anchor", this.textAnchorForXAxisLabel.bind(this));
        $$.axes.y = main.append("g")
            .attr("class", CLASS.axis + ' ' + CLASS.axisY)
            .attr("clip-path", config.axis_y_inner ? "" : $$.clipPathForYAxis)
            .attr("transform", $$.getTranslate('y'))
            .style("visibility", config.axis_y_show ? 'visible' : 'hidden');
        $$.axes.y.append("text")
            .attr("class", CLASS.axisYLabel)
            .attr("transform", config.axis_rotated ? "" : "rotate(-90)")
            .style("text-anchor", this.textAnchorForYAxisLabel.bind(this));

        $$.axes.y2 = main.append("g")
            .attr("class", CLASS.axis + ' ' + CLASS.axisY2)
            // clip-path?
            .attr("transform", $$.getTranslate('y2'))
            .style("visibility", config.axis_y2_show ? 'visible' : 'hidden');
        $$.axes.y2.append("text")
            .attr("class", CLASS.axisY2Label)
            .attr("transform", config.axis_rotated ? "" : "rotate(-90)")
            .style("text-anchor", this.textAnchorForY2AxisLabel.bind(this));
    };
    Axis.prototype.getXAxis = function getXAxis(scale, orient, tickFormat, tickValues, withOuterTick, withoutTransition, withoutRotateTickText) {
        var $$ = this.owner, config = $$.config,
            axisParams = {
                isCategory: $$.isCategorized(),
                withOuterTick: withOuterTick,
                tickMultiline: config.axis_x_tick_multiline,
                tickWidth: config.axis_x_tick_width,
                tickTextRotate: withoutRotateTickText ? 0 : config.axis_x_tick_rotate,
                withoutTransition: withoutTransition,
            },
            axis = c3_axis($$.d3, axisParams).scale(scale).orient(orient);

        if ($$.isTimeSeries() && tickValues && typeof tickValues !== "function") {
            tickValues = tickValues.map(function (v) { return $$.parseDate(v); });
        }

        // Set tick
        axis.tickFormat(tickFormat).tickValues(tickValues);
        if ($$.isCategorized()) {
            axis.tickCentered(config.axis_x_tick_centered);
            if (isEmpty(config.axis_x_tick_culling)) {
                config.axis_x_tick_culling = false;
            }
        }

        return axis;
    };
    Axis.prototype.updateXAxisTickValues = function updateXAxisTickValues(targets, axis) {
        var $$ = this.owner, config = $$.config, tickValues;
        if (config.axis_x_tick_fit || config.axis_x_tick_count) {
            tickValues = this.generateTickValues($$.mapTargetsToUniqueXs(targets), config.axis_x_tick_count, $$.isTimeSeries());
        }
        if (axis) {
            axis.tickValues(tickValues);
        } else {
            $$.xAxis.tickValues(tickValues);
            $$.subXAxis.tickValues(tickValues);
        }
        return tickValues;
    };
    Axis.prototype.getYAxis = function getYAxis(scale, orient, tickFormat, tickValues, withOuterTick, withoutTransition, withoutRotateTickText) {
        var $$ = this.owner, config = $$.config,
            axisParams = {
                withOuterTick: withOuterTick,
                withoutTransition: withoutTransition,
                tickTextRotate: withoutRotateTickText ? 0 : config.axis_y_tick_rotate
            },
            axis = c3_axis($$.d3, axisParams).scale(scale).orient(orient).tickFormat(tickFormat);
        if ($$.isTimeSeriesY()) {
            axis.ticks($$.d3.time[config.axis_y_tick_time_value], config.axis_y_tick_time_interval);
        } else {
            axis.tickValues(tickValues);
        }
        return axis;
    };
    Axis.prototype.getId = function getId(id) {
        var config = this.owner.config;
        return id in config.data_axes ? config.data_axes[id] : 'y';
    };
    Axis.prototype.getXAxisTickFormat = function getXAxisTickFormat() {
        var $$ = this.owner, config = $$.config,
            format = $$.isTimeSeries() ? $$.defaultAxisTimeFormat : $$.isCategorized() ? $$.categoryName : function (v) { return v < 0 ? v.toFixed(0) : v; };
        if (config.axis_x_tick_format) {
            if (isFunction(config.axis_x_tick_format)) {
                format = config.axis_x_tick_format;
            } else if ($$.isTimeSeries()) {
                format = function (date) {
                    return date ? $$.axisTimeFormat(config.axis_x_tick_format)(date) : "";
                };
            }
        }
        return isFunction(format) ? function (v) { return format.call($$, v); } : format;
    };
    Axis.prototype.getTickValues = function getTickValues(tickValues, axis) {
        return tickValues ? tickValues : axis ? axis.tickValues() : undefined;
    };
    Axis.prototype.getXAxisTickValues = function getXAxisTickValues() {
        return this.getTickValues(this.owner.config.axis_x_tick_values, this.owner.xAxis);
    };
    Axis.prototype.getYAxisTickValues = function getYAxisTickValues() {
        return this.getTickValues(this.owner.config.axis_y_tick_values, this.owner.yAxis);
    };
    Axis.prototype.getY2AxisTickValues = function getY2AxisTickValues() {
        return this.getTickValues(this.owner.config.axis_y2_tick_values, this.owner.y2Axis);
    };
    Axis.prototype.getLabelOptionByAxisId = function getLabelOptionByAxisId(axisId) {
        var $$ = this.owner, config = $$.config, option;
        if (axisId === 'y') {
            option = config.axis_y_label;
        } else if (axisId === 'y2') {
            option = config.axis_y2_label;
        } else if (axisId === 'x') {
            option = config.axis_x_label;
        }
        return option;
    };
    Axis.prototype.getLabelText = function getLabelText(axisId) {
        var option = this.getLabelOptionByAxisId(axisId);
        return isString(option) ? option : option ? option.text : null;
    };
    Axis.prototype.setLabelText = function setLabelText(axisId, text) {
        var $$ = this.owner, config = $$.config,
            option = this.getLabelOptionByAxisId(axisId);
        if (isString(option)) {
            if (axisId === 'y') {
                config.axis_y_label = text;
            } else if (axisId === 'y2') {
                config.axis_y2_label = text;
            } else if (axisId === 'x') {
                config.axis_x_label = text;
            }
        } else if (option) {
            option.text = text;
        }
    };
    Axis.prototype.getLabelPosition = function getLabelPosition(axisId, defaultPosition) {
        var option = this.getLabelOptionByAxisId(axisId),
            position = (option && typeof option === 'object' && option.position) ? option.position : defaultPosition;
        return {
            isInner: position.indexOf('inner') >= 0,
            isOuter: position.indexOf('outer') >= 0,
            isLeft: position.indexOf('left') >= 0,
            isCenter: position.indexOf('center') >= 0,
            isRight: position.indexOf('right') >= 0,
            isTop: position.indexOf('top') >= 0,
            isMiddle: position.indexOf('middle') >= 0,
            isBottom: position.indexOf('bottom') >= 0
        };
    };
    Axis.prototype.getXAxisLabelPosition = function getXAxisLabelPosition() {
        return this.getLabelPosition('x', this.owner.config.axis_rotated ? 'inner-top' : 'inner-right');
    };
    Axis.prototype.getYAxisLabelPosition = function getYAxisLabelPosition() {
        return this.getLabelPosition('y', this.owner.config.axis_rotated ? 'inner-right' : 'inner-top');
    };
    Axis.prototype.getY2AxisLabelPosition = function getY2AxisLabelPosition() {
        return this.getLabelPosition('y2', this.owner.config.axis_rotated ? 'inner-right' : 'inner-top');
    };
    Axis.prototype.getLabelPositionById = function getLabelPositionById(id) {
        return id === 'y2' ? this.getY2AxisLabelPosition() : id === 'y' ? this.getYAxisLabelPosition() : this.getXAxisLabelPosition();
    };
    Axis.prototype.textForXAxisLabel = function textForXAxisLabel() {
        return this.getLabelText('x');
    };
    Axis.prototype.textForYAxisLabel = function textForYAxisLabel() {
        return this.getLabelText('y');
    };
    Axis.prototype.textForY2AxisLabel = function textForY2AxisLabel() {
        return this.getLabelText('y2');
    };
    Axis.prototype.xForAxisLabel = function xForAxisLabel(forHorizontal, position) {
        var $$ = this.owner;
        if (forHorizontal) {
            return position.isLeft ? 0 : position.isCenter ? $$.width / 2 : $$.width;
        } else {
            return position.isBottom ? -$$.height : position.isMiddle ? -$$.height / 2 : 0;
        }
    };
    Axis.prototype.dxForAxisLabel = function dxForAxisLabel(forHorizontal, position) {
        if (forHorizontal) {
            return position.isLeft ? "0.5em" : position.isRight ? "-0.5em" : "0";
        } else {
            return position.isTop ? "-0.5em" : position.isBottom ? "0.5em" : "0";
        }
    };
    Axis.prototype.textAnchorForAxisLabel = function textAnchorForAxisLabel(forHorizontal, position) {
        if (forHorizontal) {
            return position.isLeft ? 'start' : position.isCenter ? 'middle' : 'end';
        } else {
            return position.isBottom ? 'start' : position.isMiddle ? 'middle' : 'end';
        }
    };
    Axis.prototype.xForXAxisLabel = function xForXAxisLabel() {
        return this.xForAxisLabel(!this.owner.config.axis_rotated, this.getXAxisLabelPosition());
    };
    Axis.prototype.xForYAxisLabel = function xForYAxisLabel() {
        return this.xForAxisLabel(this.owner.config.axis_rotated, this.getYAxisLabelPosition());
    };
    Axis.prototype.xForY2AxisLabel = function xForY2AxisLabel() {
        return this.xForAxisLabel(this.owner.config.axis_rotated, this.getY2AxisLabelPosition());
    };
    Axis.prototype.dxForXAxisLabel = function dxForXAxisLabel() {
        return this.dxForAxisLabel(!this.owner.config.axis_rotated, this.getXAxisLabelPosition());
    };
    Axis.prototype.dxForYAxisLabel = function dxForYAxisLabel() {
        return this.dxForAxisLabel(this.owner.config.axis_rotated, this.getYAxisLabelPosition());
    };
    Axis.prototype.dxForY2AxisLabel = function dxForY2AxisLabel() {
        return this.dxForAxisLabel(this.owner.config.axis_rotated, this.getY2AxisLabelPosition());
    };
    Axis.prototype.dyForXAxisLabel = function dyForXAxisLabel() {
        var $$ = this.owner, config = $$.config,
            position = this.getXAxisLabelPosition();
        if (config.axis_rotated) {
            return position.isInner ? "1.2em" : -25 - this.getMaxTickWidth('x');
        } else {
            return position.isInner ? "-0.5em" : config.axis_x_height ? config.axis_x_height - 10 : "3em";
        }
    };
    Axis.prototype.dyForYAxisLabel = function dyForYAxisLabel() {
        var $$ = this.owner,
            position = this.getYAxisLabelPosition();
        if ($$.config.axis_rotated) {
            return position.isInner ? "-0.5em" : "3em";
        } else {
            return position.isInner ? "1.2em" : -10 - ($$.config.axis_y_inner ? 0 : (this.getMaxTickWidth('y') + 10));
        }
    };
    Axis.prototype.dyForY2AxisLabel = function dyForY2AxisLabel() {
        var $$ = this.owner,
            position = this.getY2AxisLabelPosition();
        if ($$.config.axis_rotated) {
            return position.isInner ? "1.2em" : "-2.2em";
        } else {
            return position.isInner ? "-0.5em" : 15 + ($$.config.axis_y2_inner ? 0 : (this.getMaxTickWidth('y2') + 15));
        }
    };
    Axis.prototype.textAnchorForXAxisLabel = function textAnchorForXAxisLabel() {
        var $$ = this.owner;
        return this.textAnchorForAxisLabel(!$$.config.axis_rotated, this.getXAxisLabelPosition());
    };
    Axis.prototype.textAnchorForYAxisLabel = function textAnchorForYAxisLabel() {
        var $$ = this.owner;
        return this.textAnchorForAxisLabel($$.config.axis_rotated, this.getYAxisLabelPosition());
    };
    Axis.prototype.textAnchorForY2AxisLabel = function textAnchorForY2AxisLabel() {
        var $$ = this.owner;
        return this.textAnchorForAxisLabel($$.config.axis_rotated, this.getY2AxisLabelPosition());
    };
    Axis.prototype.getMaxTickWidth = function getMaxTickWidth(id, withoutRecompute) {
        var $$ = this.owner, config = $$.config,
            maxWidth = 0, targetsToShow, scale, axis, dummy, svg;
        if (withoutRecompute && $$.currentMaxTickWidths[id]) {
            return $$.currentMaxTickWidths[id];
        }
        if ($$.svg) {
            targetsToShow = $$.filterTargetsToShow($$.data.targets);
            if (id === 'y') {
                scale = $$.y.copy().domain($$.getYDomain(targetsToShow, 'y'));
                axis = this.getYAxis(scale, $$.yOrient, config.axis_y_tick_format, $$.yAxisTickValues, false, true, true);
            } else if (id === 'y2') {
                scale = $$.y2.copy().domain($$.getYDomain(targetsToShow, 'y2'));
                axis = this.getYAxis(scale, $$.y2Orient, config.axis_y2_tick_format, $$.y2AxisTickValues, false, true, true);
            } else {
                scale = $$.x.copy().domain($$.getXDomain(targetsToShow));
                axis = this.getXAxis(scale, $$.xOrient, $$.xAxisTickFormat, $$.xAxisTickValues, false, true, true);
                this.updateXAxisTickValues(targetsToShow, axis);
            }
            dummy = $$.d3.select('body').append('div').classed('c3', true);
            svg = dummy.append("svg").style('visibility', 'hidden').style('position', 'fixed').style('top', 0).style('left', 0),
                svg.append('g').call(axis).each(function () {
                    $$.d3.select(this).selectAll('text').each(function () {
                        var box = this.getBoundingClientRect();
                        if (maxWidth < box.width) { maxWidth = box.width; }
                    });
                    dummy.remove();
                });
        }
        $$.currentMaxTickWidths[id] = maxWidth <= 0 ? $$.currentMaxTickWidths[id] : maxWidth;
        return $$.currentMaxTickWidths[id];
    };

    Axis.prototype.updateLabels = function updateLabels(withTransition) {
        var $$ = this.owner;
        var axisXLabel = $$.main.select('.' + CLASS.axisX + ' .' + CLASS.axisXLabel),
            axisYLabel = $$.main.select('.' + CLASS.axisY + ' .' + CLASS.axisYLabel),
            axisY2Label = $$.main.select('.' + CLASS.axisY2 + ' .' + CLASS.axisY2Label);
        (withTransition ? axisXLabel.transition() : axisXLabel)
            .attr("x", this.xForXAxisLabel.bind(this))
            .attr("dx", this.dxForXAxisLabel.bind(this))
            .attr("dy", this.dyForXAxisLabel.bind(this))
            .text(this.textForXAxisLabel.bind(this));
        (withTransition ? axisYLabel.transition() : axisYLabel)
            .attr("x", this.xForYAxisLabel.bind(this))
            .attr("dx", this.dxForYAxisLabel.bind(this))
            .attr("dy", this.dyForYAxisLabel.bind(this))
            .text(this.textForYAxisLabel.bind(this));
        (withTransition ? axisY2Label.transition() : axisY2Label)
            .attr("x", this.xForY2AxisLabel.bind(this))
            .attr("dx", this.dxForY2AxisLabel.bind(this))
            .attr("dy", this.dyForY2AxisLabel.bind(this))
            .text(this.textForY2AxisLabel.bind(this));
    };
    Axis.prototype.getPadding = function getPadding(padding, key, defaultValue, domainLength) {
        var p = typeof padding === 'number' ? padding : padding[key];
        if (!isValue(p)) {
            return defaultValue;
        }
        if (padding.unit === 'ratio') {
            return padding[key] * domainLength;
        }
        // assume padding is pixels if unit is not specified
        return this.convertPixelsToAxisPadding(p, domainLength);
    };
    Axis.prototype.convertPixelsToAxisPadding = function convertPixelsToAxisPadding(pixels, domainLength) {
        var $$ = this.owner,
            length = $$.config.axis_rotated ? $$.width : $$.height;
        return domainLength * (pixels / length);
    };
    Axis.prototype.generateTickValues = function generateTickValues(values, tickCount, forTimeSeries) {
        var tickValues = values, targetCount, start, end, count, interval, i, tickValue;
        if (tickCount) {
            targetCount = isFunction(tickCount) ? tickCount() : tickCount;
            // compute ticks according to tickCount
            if (targetCount === 1) {
                tickValues = [values[0]];
            } else if (targetCount === 2) {
                tickValues = [values[0], values[values.length - 1]];
            } else if (targetCount > 2) {
                count = targetCount - 2;
                start = values[0];
                end = values[values.length - 1];
                interval = (end - start) / (count + 1);
                // re-construct unique values
                tickValues = [start];
                for (i = 0; i < count; i++) {
                    tickValue = +start + interval * (i + 1);
                    tickValues.push(forTimeSeries ? new Date(tickValue) : tickValue);
                }
                tickValues.push(end);
            }
        }
        if (!forTimeSeries) { tickValues = tickValues.sort(function (a, b) { return a - b; }); }
        return tickValues;
    };
    Axis.prototype.generateTransitions = function generateTransitions(duration) {
        var $$ = this.owner, axes = $$.axes;
        return {
            axisX: duration ? axes.x.transition().duration(duration) : axes.x,
            axisY: duration ? axes.y.transition().duration(duration) : axes.y,
            axisY2: duration ? axes.y2.transition().duration(duration) : axes.y2,
            axisSubX: duration ? axes.subx.transition().duration(duration) : axes.subx
        };
    };
    Axis.prototype.redraw = function redraw(transitions, isHidden) {
        var $$ = this.owner;
        $$.axes.x.style("opacity", isHidden ? 0 : 1);
        $$.axes.y.style("opacity", isHidden ? 0 : 1);
        $$.axes.y2.style("opacity", isHidden ? 0 : 1);
        $$.axes.subx.style("opacity", isHidden ? 0 : 1);
        transitions.axisX.call($$.xAxis);
        transitions.axisY.call($$.yAxis);
        transitions.axisY2.call($$.y2Axis);
        transitions.axisSubX.call($$.subXAxis);
    };


    // Features:
    // 1. category axis
    // 2. ceil values of translate/x/y to int for half pixel antialiasing
    // 3. multiline tick text
    var tickTextCharSize;
    function c3_axis(d3, params) {
        var scale = d3.scale.linear(), orient = "bottom", innerTickSize = 6, outerTickSize, tickPadding = 3, tickValues = null, tickFormat, tickArguments;

        var tickOffset = 0, tickCulling = true, tickCentered;

        params = params || {};
        outerTickSize = params.withOuterTick ? 6 : 0;

        function axisX(selection, x) {
            selection.attr("transform", function (d) {
                return "translate(" + Math.ceil(x(d) + tickOffset) + ", 0)";
            });
        }
        function axisY(selection, y) {
            selection.attr("transform", function (d) {
                return "translate(0," + Math.ceil(y(d)) + ")";
            });
        }
        function scaleExtent(domain) {
            var start = domain[0], stop = domain[domain.length - 1];
            return start < stop ? [ start, stop ] : [ stop, start ];
        }
        function generateTicks(scale) {
            var i, domain, ticks = [];
            if (scale.ticks) {
                return scale.ticks.apply(scale, tickArguments);
            }
            domain = scale.domain();
            for (i = Math.ceil(domain[0]); i < domain[1]; i++) {
                ticks.push(i);
            }
            if (ticks.length > 0 && ticks[0] > 0) {
                ticks.unshift(ticks[0] - (ticks[1] - ticks[0]));
            }
            return ticks;
        }
        function copyScale() {
            var newScale = scale.copy(), domain;
            if (params.isCategory) {
                domain = scale.domain();
                newScale.domain([domain[0], domain[1] - 1]);
            }
            return newScale;
        }
        function textFormatted(v) {
            var formatted = tickFormat ? tickFormat(v) : v;
            return typeof formatted !== 'undefined' ? formatted : '';
        }
        function getSizeFor1Char(tick) {
            if (tickTextCharSize) {
                return tickTextCharSize;
            }
            var size = {
                h: 11.5,
                w: 5.5
            };
            tick.select('text').text(textFormatted).each(function (d) {
                var box = this.getBoundingClientRect(),
                    text = textFormatted(d),
                    h = box.height,
                    w = text ? (box.width / text.length) : undefined;
                if (h && w) {
                    size.h = h;
                    size.w = w;
                }
            }).text('');
            tickTextCharSize = size;
            return size;
        }
        function transitionise(selection) {
            return params.withoutTransition ? selection : d3.transition(selection);
        }
        function axis(g) {
            g.each(function () {
                var g = axis.g = d3.select(this);

                var scale0 = this.__chart__ || scale, scale1 = this.__chart__ = copyScale();

                var ticks = tickValues ? tickValues : generateTicks(scale1),
                    tick = g.selectAll(".tick").data(ticks, scale1),
                    tickEnter = tick.enter().insert("g", ".domain").attr("class", "tick").style("opacity", 1e-6),
                    // MEMO: No exit transition. The reason is this transition affects max tick width calculation because old tick will be included in the ticks.
                    tickExit = tick.exit().remove(),
                    tickUpdate = transitionise(tick).style("opacity", 1),
                    tickTransform, tickX, tickY;

                var range = scale.rangeExtent ? scale.rangeExtent() : scaleExtent(scale.range()),
                    path = g.selectAll(".domain").data([ 0 ]),
                    pathUpdate = (path.enter().append("path").attr("class", "domain"), transitionise(path));
                tickEnter.append("line");
                tickEnter.append("text");

                var lineEnter = tickEnter.select("line"),
                    lineUpdate = tickUpdate.select("line"),
                    textEnter = tickEnter.select("text"),
                    textUpdate = tickUpdate.select("text");

                if (params.isCategory) {
                    tickOffset = Math.ceil((scale1(1) - scale1(0)) / 2);
                    tickX = tickCentered ? 0 : tickOffset;
                    tickY = tickCentered ? tickOffset : 0;
                } else {
                    tickOffset = tickX = 0;
                }

                var text, tspan, sizeFor1Char = getSizeFor1Char(g.select('.tick')), counts = [];
                var tickLength = Math.max(innerTickSize, 0) + tickPadding,
                    isVertical = orient === 'left' || orient === 'right';

                // this should be called only when category axis
                function splitTickText(d, maxWidth) {
                    var tickText = textFormatted(d),
                        subtext, spaceIndex, textWidth, splitted = [];

                    if (Object.prototype.toString.call(tickText) === "[object Array]") {
                        return tickText;
                    }

                    if (!maxWidth || maxWidth <= 0) {
                        maxWidth = isVertical ? 95 : params.isCategory ? (Math.ceil(scale1(ticks[1]) - scale1(ticks[0])) - 12) : 110;
                    }

                    function split(splitted, text) {
                        spaceIndex = undefined;
                        for (var i = 1; i < text.length; i++) {
                            if (text.charAt(i) === ' ') {
                                spaceIndex = i;
                            }
                            subtext = text.substr(0, i + 1);
                            textWidth = sizeFor1Char.w * subtext.length;
                            // if text width gets over tick width, split by space index or crrent index
                            if (maxWidth < textWidth) {
                                return split(
                                    splitted.concat(text.substr(0, spaceIndex ? spaceIndex : i)),
                                    text.slice(spaceIndex ? spaceIndex + 1 : i)
                                );
                            }
                        }
                        return splitted.concat(text);
                    }

                    return split(splitted, tickText + "");
                }

                function tspanDy(d, i) {
                    var dy = sizeFor1Char.h;
                    if (i === 0) {
                        if (orient === 'left' || orient === 'right') {
                            dy = -((counts[d.index] - 1) * (sizeFor1Char.h / 2) - 3);
                        } else {
                            dy = ".71em";
                        }
                    }
                    return dy;
                }

                function tickSize(d) {
                    var tickPosition = scale(d) + (tickCentered ? 0 : tickOffset);
                    return range[0] < tickPosition && tickPosition < range[1] ? innerTickSize : 0;
                }

                text = tick.select("text");
                text.append("svg:title")
                    .text(function (d) { return textFormatted(d); });
                tspan = text.selectAll('tspan')
                    .data(function (d, i) {
                        var splitted = params.tickMultiline ? splitTickText(d, params.tickWidth) : [].concat(textFormatted(d));
                        counts[i] = splitted.length;
                        return splitted.map(function (s) {
                            return { index: i, splitted: s };
                        });
                    });
                tspan.enter().append('tspan');
                tspan.exit().remove();
                tspan.text(function (d) { return d.splitted; });

                var rotate = params.tickTextRotate;

                function textAnchorForText(rotate) {
                    if (!rotate) {
                        return 'middle';
                    }
                    return rotate > 0 ? "start" : "end";
                }
                function textTransform(rotate) {
                    if (!rotate) {
                        return '';
                    }
                    return "rotate(" + rotate + ")";
                }
                function dxForText(rotate) {
                    if (!rotate) {
                        return 0;
                    }
                    return 8 * Math.sin(Math.PI * (rotate / 180));
                }
                function yForText(rotate) {
                    if (!rotate) {
                        return tickLength;
                    }
                    return 11.5 - 2.5 * (rotate / 15) * (rotate > 0 ? 1 : -1);
                }

                switch (orient) {
                    case "bottom":
                    {
                        tickTransform = axisX;
                        lineEnter.attr("y2", innerTickSize);
                        textEnter.attr("y", tickLength);
                        lineUpdate.attr("x1", tickX).attr("x2", tickX).attr("y2", tickSize);
                        textUpdate.attr("x", 0).attr("y", yForText(rotate))
                            .style("text-anchor", textAnchorForText(rotate))
                            .attr("transform", textTransform(rotate));
                        tspan.attr('x', 0).attr("dy", tspanDy).attr('dx', dxForText(rotate));
                        pathUpdate.attr("d", "M" + range[0] + "," + outerTickSize + "V0H" + range[1] + "V" + outerTickSize);
                        break;
                    }
                    case "top":
                    {
                        // TODO: rotated tick text
                        tickTransform = axisX;
                        lineEnter.attr("y2", -innerTickSize);
                        textEnter.attr("y", -tickLength);
                        lineUpdate.attr("x2", 0).attr("y2", -innerTickSize);
                        textUpdate.attr("x", 0).attr("y", -tickLength);
                        text.style("text-anchor", "middle");
                        tspan.attr('x', 0).attr("dy", "0em");
                        pathUpdate.attr("d", "M" + range[0] + "," + -outerTickSize + "V0H" + range[1] + "V" + -outerTickSize);
                        break;
                    }
                    case "left":
                    {
                        tickTransform = axisY;
                        lineEnter.attr("x2", -innerTickSize);
                        textEnter.attr("x", -tickLength);
                        lineUpdate.attr("x2", -innerTickSize).attr("y1", tickY).attr("y2", tickY);
                        textUpdate.attr("x", -tickLength).attr("y", tickOffset);
                        text.style("text-anchor", "end");
                        tspan.attr('x', -tickLength).attr("dy", tspanDy);
                        pathUpdate.attr("d", "M" + -outerTickSize + "," + range[0] + "H0V" + range[1] + "H" + -outerTickSize);
                        break;
                    }
                    case "right":
                    {
                        tickTransform = axisY;
                        lineEnter.attr("x2", innerTickSize);
                        textEnter.attr("x", tickLength);
                        lineUpdate.attr("x2", innerTickSize).attr("y2", 0);
                        textUpdate.attr("x", tickLength).attr("y", 0);
                        text.style("text-anchor", "start");
                        tspan.attr('x', tickLength).attr("dy", tspanDy);
                        pathUpdate.attr("d", "M" + outerTickSize + "," + range[0] + "H0V" + range[1] + "H" + outerTickSize);
                        break;
                    }
                }
                if (scale1.rangeBand) {
                    var x = scale1, dx = x.rangeBand() / 2;
                    scale0 = scale1 = function (d) {
                        return x(d) + dx;
                    };
                } else if (scale0.rangeBand) {
                    scale0 = scale1;
                } else {
                    tickExit.call(tickTransform, scale1);
                }
                tickEnter.call(tickTransform, scale0);
                tickUpdate.call(tickTransform, scale1);
            });
        }
        axis.scale = function (x) {
            if (!arguments.length) { return scale; }
            scale = x;
            return axis;
        };
        axis.orient = function (x) {
            if (!arguments.length) { return orient; }
            orient = x in {top: 1, right: 1, bottom: 1, left: 1} ? x + "" : "bottom";
            return axis;
        };
        axis.tickFormat = function (format) {
            if (!arguments.length) { return tickFormat; }
            tickFormat = format;
            return axis;
        };
        axis.tickCentered = function (isCentered) {
            if (!arguments.length) { return tickCentered; }
            tickCentered = isCentered;
            return axis;
        };
        axis.tickOffset = function () {
            return tickOffset;
        };
        axis.tickInterval = function () {
            var interval, length;
            if (params.isCategory) {
                interval = tickOffset * 2;
            }
            else {
                length = axis.g.select('path.domain').node().getTotalLength() - outerTickSize * 2;
                interval = length / axis.g.selectAll('line').size();
            }
            return interval === Infinity ? 0 : interval;
        };
        axis.ticks = function () {
            if (!arguments.length) { return tickArguments; }
            tickArguments = arguments;
            return axis;
        };
        axis.tickCulling = function (culling) {
            if (!arguments.length) { return tickCulling; }
            tickCulling = culling;
            return axis;
        };
        axis.tickValues = function (x) {
            if (typeof x === 'function') {
                tickValues = function () {
                    return x(scale.domain());
                };
            }
            else {
                if (!arguments.length) { return tickValues; }
                tickValues = x;
            }
            return axis;
        };
        return axis;
    }

    var isValue = c3_chart_internal_fn.isValue = function (v) {
            return v || v === 0;
        },
        isFunction = c3_chart_internal_fn.isFunction = function (o) {
            return typeof o === 'function';
        },
        isString = c3_chart_internal_fn.isString = function (o) {
            return typeof o === 'string';
        },
        isUndefined = c3_chart_internal_fn.isUndefined = function (v) {
            return typeof v === 'undefined';
        },
        isDefined = c3_chart_internal_fn.isDefined = function (v) {
            return typeof v !== 'undefined';
        },
        ceil10 = c3_chart_internal_fn.ceil10 = function (v) {
            return Math.ceil(v / 10) * 10;
        },
        asHalfPixel = c3_chart_internal_fn.asHalfPixel = function (n) {
            return Math.ceil(n) + 0.5;
        },
        diffDomain = c3_chart_internal_fn.diffDomain = function (d) {
            return d[1] - d[0];
        },
        isEmpty = c3_chart_internal_fn.isEmpty = function (o) {
            return typeof o === 'undefined' || o === null || (isString(o) && o.length === 0) || (typeof o === 'object' && Object.keys(o).length === 0);
        },
        notEmpty = c3_chart_internal_fn.notEmpty = function (o) {
            return !c3_chart_internal_fn.isEmpty(o);
        },
        getOption = c3_chart_internal_fn.getOption = function (options, key, defaultValue) {
            return isDefined(options[key]) ? options[key] : defaultValue;
        },
        hasValue = c3_chart_internal_fn.hasValue = function (dict, value) {
            var found = false;
            Object.keys(dict).forEach(function (key) {
                if (dict[key] === value) { found = true; }
            });
            return found;
        },
        sanitise = c3_chart_internal_fn.sanitise = function (str) {
            return typeof str === 'string' ? str.replace(/</g, '&lt;').replace(/>/g, '&gt;') : str;
        },
        getPathBox = c3_chart_internal_fn.getPathBox = function (path) {
            var box = path.getBoundingClientRect(),
                items = [path.pathSegList.getItem(0), path.pathSegList.getItem(1)],
                minX = items[0].x, minY = Math.min(items[0].y, items[1].y);
            return {x: minX, y: minY, width: box.width, height: box.height};
        };

    // Support AMD, CommonJS, window
    if (typeof define === 'function' && define.amd) {
        define('c3Chart', ['c3'], c3Chart);
    } else if ('undefined' !== typeof exports && 'undefined' !== typeof module) {
        module.exports = c3Chart;
    } else {
        window.c3Chart = c3Chart;
    }
})(window, window.c3);
