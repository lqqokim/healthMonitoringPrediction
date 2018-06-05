(function(window, d3) {
    'use strict';

    var d3Zoom = {
        //option중에 zoom 이나 multi selection 이냐 정보 받아서 처리.
        updateZoom : function(config){
            if(config.chartEl == undefined ||
                config.xAxis == undefined ||
                config.yAxis == undefined ||
                config.xScale == undefined ||
                config.yScale == undefined ||
                config.xAxisClassName == undefined ||
                config.yAxisClassName == undefined){
                    console.log('check config : ', config);
                    return;
                }
            var chartEl = config.chartEl,
                zoomEl = config.zoomEl === undefined ? chartEl : config.zoomEl,
                xAxis = config.xAxis,
                yAxis = config.yAxis,
                xScale = config.xScale,
                yScale = config.yScale,
                xAxisClassName = config.xAxisClassName,
                yAxisClassName = config.yAxisClassName,
                zoomFunction = config.zoomFunction,
                afterZoomFunction = config.afterZoomFunction;

                if(zoomEl.selectAll('.zoomOverlay')[0] !== undefined && zoomEl.selectAll('.zoomOverlay')[0].length == 0){
                    //TODO : update 하는 부분이므로, 제거해도 되는지 체크해볼 것.
                    zoomEl.insert("rect", ":first-child")
                    .attr("width", d3.max(xScale.range()))
                    .attr("height", d3.max(yScale.range()))
                    // .attr("class", "zoomOverlay")
                    // .call(drag);
                }else{
                    zoomEl.selectAll(".zoomOverlay")
                    .attr("width", d3.max(xScale.range()))
                    .attr("height", d3.max(yScale.range()))
                    // .attr("class", "zoomOverlay")
                    // .call(drag);
                }

                if(zoomEl.selectAll('.band')[0] !== undefined && zoomEl.selectAll('.band')[0].length == 0){
                    //TODO : update 하는 부분이므로, 제거해도 되는지 체크해볼 것.
                    zoomEl.append("rect")
                    .attr("width", 0)
                    .attr("height", 0)
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("class", "band");
                }else{
                    zoomEl.selectAll('.band')
                    .attr("width", 0)
                    .attr("height", 0)
                    .attr("x", 0)
                    .attr("y", 0);
                }

                zoomEl.selectAll('.band')
                .style("fill", '#fff')
                .style("stroke-width", '0px')
                .style("stroke", 'red');

                zoomEl.selectAll('.zoomOut')
                .style("fill", '#66a')
                .style("cursor", 'pointer');

                zoomEl.selectAll('.zoomOutText')
                .style("pointer-events", 'none')
                .style("fill", '#ccc');

                zoomEl.selectAll('.zoomOverlay')
                .style("pointer-events", 'all')
                .style("fill", 'transparent')
                .style('opacity',0.5);

                return chartEl;
        },
        applyZoom : function(config){

            if(config.chartEl == undefined ||
                config.xAxis == undefined ||
                config.yAxis == undefined ||
                config.xScale == undefined ||
                config.yScale == undefined ||
                config.xAxisClassName == undefined ||
                config.yAxisClassName == undefined){
                    console.log('check config : ', config);
                    return;
                }
            var chartEl = config.chartEl,
                zoomEl = config.zoomEl === undefined ? chartEl : config.zoomEl,
                xAxis = config.xAxis,
                yAxis = config.yAxis,
                xScale = config.xScale,
                yScale = config.yScale,
                xAxisClassName = config.xAxisClassName,
                yAxisClassName = config.yAxisClassName,
                zoomFunction = config.zoomFunction,
                afterZoomFunction = config.afterZoomFunction,
                zoomMiniSize = config.zoomMiniSize || 3;

            var bandPos = [-1, -1];
            var beforePos = [], afterPos = [];
            var xDomain = undefined,
                yDomain = undefined;

            if(config.ableScale == undefined){
                config.ableScale = 'none';
            }

            if(config.ableScale.toLowerCase() == 'x' || config.ableScale.toLowerCase() == 'both'){
                xDomain = {
                    min : d3.min(xScale.domain()),
                    max : d3.max(xScale.domain())
                };
            }

            if(config.ableScale.toLowerCase() == 'y' || config.ableScale.toLowerCase() == 'both'){
                yDomain = {
                    min : d3.min(yScale.domain()),
                    max : d3.max(yScale.domain())
                }
            }

            var zoomArea = {
                x1 : undefined,
                x2 : undefined,
                y1 : undefined,
                y2 : undefined
            }

            var drag = d3.behavior.drag();

            drag.on("dragend", function() {
                //drag 완료시 chart의 multi selection 효과를 주기위한 function 정보를 받아서 실행.
                d3.select(this).style('fill', 'none');

                var flagZoomOutX = false,
                    flagZoomOutY = false;

                var pos = d3.mouse(this),
                    x1, x2, y1, y2;

                afterPos = Object.assign({}, pos);

                if( Math.abs(beforePos[0] - afterPos[0]) <= zoomMiniSize || Math.abs(beforePos[1] - afterPos[1]) <= zoomMiniSize ){
                    bandPos = [-1, -1];
                    return;
                }

                if(xDomain !== undefined){
                    x1 = xScale.invert(bandPos[0]);
                    x2 = xScale.invert(pos[0]);

                    if (x1 < x2) {
                        zoomArea.x1 = x1;
                        zoomArea.x2 = x2;
                    } else {
                        zoomArea.x1 = x2;
                        zoomArea.x2 = x1;
                        flagZoomOutX = true;
                    }
                }

                if(yDomain !== undefined){
                    y1 = yScale.invert(pos[1]);
                    y2 = yScale.invert(bandPos[1]);

                    if (y1 < y2) {
                        zoomArea.y1 = y1;
                        zoomArea.y2 = y2;
                    } else {
                        zoomArea.y1 = y2;
                        zoomArea.y2 = y1;
                        flagZoomOutY = true;
                    }
                }

                bandPos = [-1, -1];

                zoomEl.select(".band").transition()
                .attr("width", 0)
                .attr("height", 0)
                .attr("x", bandPos[0])
                .attr("y", bandPos[1]);

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
                    zoom();
                    if(_.isFunction(afterZoomFunction)){
                        config.afterZoomFunction.call(this, 'zoomin');
                    }else{
                        console.log('please check afterZoomFunction : ', afterZoomFunction)
                    }
                }

                function _zoomOutAction(){
                    zoomOut();
                    if(_.isFunction(afterZoomFunction)){
                        config.afterZoomFunction.call(this, 'zoomout');
                    }else{
                        console.log('please check afterZoomFunction : ', afterZoomFunction)
                    }
                }

            });
            drag.on('dragstart', function(){
                beforePos = d3.mouse(this);
            })

            drag.on("drag", function() {
                //여기서 chart series에 적용될 function 정보를 받아서 실행.
                //ex) drag 영역 안에 포함되는 series bold 처리, 및 이미 선택된 아이템 bold2 처리
                d3.select(this).style('fill', '#ccc');
                var pos = d3.mouse(this);

                var band = zoomEl.select(".band");
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
            });

            function zoom() {
                //recalculate domains
                if(xDomain !== undefined){
                    if (zoomArea.x1 > zoomArea.x2) {
                        xScale.domain([zoomArea.x2, zoomArea.x1]);
                    } else {
                        xScale.domain([zoomArea.x1, zoomArea.x2]);
                    }
                }

                if(yDomain !== undefined){
                    if (zoomArea.y1 > zoomArea.y2) {
                        yScale.domain([zoomArea.y2, zoomArea.y1]);
                    } else {
                        yScale.domain([zoomArea.y1, zoomArea.y2]);
                    }
                }

                //update axis and redraw lines
                var t = chartEl.transition().duration(750);
                var xAxisEl = undefined,
                    yAxisEl = undefined;

                if(config.xAxisEl !== undefined){
                    xAxisEl = config.xAxisEl.transition().duration(750);
                }else{
                    xAxisEl = t;
                }

                if(config.yAxisEl !== undefined){
                    yAxisEl = config.yAxisEl.transition().duration(750);
                }else{
                    yAxisEl = t;
                }


                if(xDomain !== undefined){
                    xAxisEl.select("."+ xAxisClassName).call(xAxis);
                }
                if(yDomain !== undefined){
                    yAxisEl.select("."+ yAxisClassName).call(yAxis);
                }

                if(_.isFunction(zoomFunction)){
                    config.zoomFunction.call(this, t);
                }
            }

            var zoomOut = function() {
                if(xDomain !== undefined){
                    xScale.domain([xDomain.min, xDomain.max]);
                }
                if(yDomain !== undefined){
                    yScale.domain([yDomain.min, yDomain.max]);
                }

                var t = chartEl.transition().duration(750);
                var xAxisEl = undefined,
                    yAxisEl = undefined;

                if(config.xAxisEl !== undefined){
                    xAxisEl = config.xAxisEl.transition().duration(750);
                }else{
                    xAxisEl = t;
                }

                if(config.yAxisEl !== undefined){
                    yAxisEl = config.yAxisEl.transition().duration(750);
                }else{
                    yAxisEl = t;
                }


                if(xDomain !== undefined){
                    xAxisEl.select("."+ xAxisClassName).call(xAxis);
                }
                if(yDomain !== undefined){
                    yAxisEl.select("."+ yAxisClassName).call(yAxis);
                }

                if(_.isFunction(zoomFunction)){
                    config.zoomFunction.call(this, t);
                }else{
                    console.log()
                }
            }

            if(zoomEl.selectAll('.band')[0] !== undefined && zoomEl.selectAll('.band')[0].length == 0){
                zoomEl.insert("rect", ":first-child")
                // zoomEl.append("rect")
                .attr("width", 0)
                .attr("height", 0)
                .attr("x", 0)
                .attr("y", 0)
                .attr("class", "band");
            }else{
                zoomEl.selectAll('.band')
                .attr("width", 0)
                .attr("height", 0)
                .attr("x", 0)
                .attr("y", 0);
            }

            if(zoomEl.selectAll('.zoomOverlay')[0] !== undefined && zoomEl.selectAll('.zoomOverlay')[0].length == 0){
                zoomEl.insert("rect", ":first-child")
                .attr("width", d3.max(xScale.range()))
                .attr("height", d3.max(yScale.range()))
                .attr("class", "zoomOverlay")
                .call(drag);
            }else{
                zoomEl.selectAll(".zoomOverlay")
                .attr("width", d3.max(xScale.range()))
                .attr("height", d3.max(yScale.range()))
                .attr("class", "zoomOverlay")
                .call(drag);
            }

            zoomEl.selectAll('.band')
            .style("fill", '#fff')
            .style("stroke-width", '0px')
            .style("stroke", 'red');

            zoomEl.selectAll('.zoomOut')
            .style("fill", '#66a')
            .style("cursor", 'pointer');

            zoomEl.selectAll('.zoomOutText')
            .style("pointer-events", 'none')
            .style("fill", '#ccc');

            zoomEl.selectAll('.zoomOverlay')
            .style("pointer-events", 'all')
            .style("fill", 'none')
            .style('opacity',0.9);

            return chartEl;
        }
    }

    window.d3Zoom = d3Zoom ;

})(window, window.d3);
