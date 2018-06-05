(function($) {
    'use strict';
    
    angular.module('bistel.chart', [])
    .directive('bistelChart', ['$rootScope', '$timeout', '$window', '$q', bistelChart])
    .service('$bistelChart', [bistelChartSvc]);
    
    $.jqplot.config = {
      enablePlugins:true,
      defaultHeight:300,
      defaultWidth:400,
      UTCAdjust:false,
      timezoneOffset: new Date(new Date().getTimezoneOffset() * 60000),
      errorMessage: '',
      errorBackground: '',
      errorBorder: '',
      errorFontFamily: '',
      errorFontSize: '',
      errorFontStyle: '',
      errorFontWeight: '',
      catchErrors: false,
      defaultTickFormatString: "%.1f",
      defaultColors: [ '#00ff00','#000080','#cccc00','#800080','#ffa500','#00ffff','#dc143c','#191970','#4682b4','#9400d3','#f0e68c','#1e90ff','#00ff7f','#ff1493','#708090','#fffacd','#ee82ee','#ffc0cb','#48d1cc','#adff2f','#f08080','#808080','#ff69b4','#cd5c5c','#ffa07a','#0000ff'],
      defaultNegativeColors: [ '#ff00ff','#ffff7f','#3434ff','#7fff7f','#005aff','#ff0000','#23ebc3','#e6e68f','#b97d4b','#6bff2c','#0f1973','#e16f00','#ff0080','#00eb6c','#8f7f6f','#000532','#117d11','#003f34','#b72e33','#5200d0','#0f7f7f','#7f7f7f','#00964b','#32a3a3','#005f85','#ffff00'],
      dashLength: 4,
      gapLength: 4,
      dotGapLength: 2.5,
      loaderTemplate: null
  };
   
    /**
     * jqPlot Default Options (Some custom options added.)
     * @static
     */
    function getDefaultPlotOption(option) {
        option = option || {};
        return $.extend(true, {
                defaultGridPadding: {top:10, right:10, bottom:23, left:10},
                title: '',
                data: [],
                captureRightClick: true,
                multiCanvas: false,
                copyData: false,
                stackSeries: false,
                showLoader: true,
                legend: {
                    renderer: $.jqplot.EnhancedLegendRenderer,
                    show: true,
                    showLabels: true,
                    showSwatch: true,
                    border: 0,
                    rendererOptions: {
                        numberColumns: 1,
                        seriesToggle: 'fast',
                        disableIEFading: false
                    },
                    placement: 'outsideGrid',
                    shrinkGrid: true,
                    location: 'e'
                },
                seriesDefaults: {
                    renderer: $.jqplot.LineRenderer,
                    rendererOptions: {
                        highlightMouseOver: false,
                        highlightMouseDown: false
                    },
                    shadow: false,
                    showLine: true,
                    showMarker: true,
                    lineWidth: 1,
                    isDragable: false,
                    stackSeries: false,
                    showHighlight: true,
                    xaxis: 'xaxis',
                    yaxis: 'yaxis',
                    strokeStyle: 'rgba(100,100,100,1)',
                    breakOnNull: true,
                    highlightMouseOver: false,
                    markerOptions: {
                        shadow: false,
                        style: 'filledCircle',
                        fillRect: false,
                        strokeRect: false,
                        lineWidth: 1,
                        stroke: true,
                        size: 7,
                        allowZero: true,
                        printSize: false
                    },
                    dragable: {
                        constrainTo: 'x'
                    },
                    trendline: {
                        show: false
                    },
                    pointLabels: {
                      show: false
                    }
                },
                series: [],
                sortData: false,
                canvasOverlay: {
                    show: true,
                    objects: []
                },
                grid: {
                    shadow: false,
                    marginLeft: '0',
                    borderWidth: 1,
                    gridLineWidth: 0,
                    background: '#fff',
                    borderAntiAliasing: true
                },
                axes: {
                    xaxis: {
                        renderer: $.jqplot.LinearAxisRenderer,
                        rendererOptions: {
                            tickInset: 0.1,
                            minorTicks: 3
                        },
                        drawMinorTickMarks: true,
                        showMinorTicks: true,
                        autoscale: true,
                        tickOptions: {
                            markSize: 6,
                            //formatter: function(format, val) {return val;},
                            fontSize: '8px'
                        }
                    },
                    yaxis: {
                        showMinorTicks: true,
                        renderer: $.jqplot.LinearAxisRenderer,
                        autoscale: true,
                        rendererOptions: {
                            //forceTickAt0: true,
                            minorTicks: 3
                        },
                        padMin: 1,
                        padMax: 1,
                        tickOptions: {
                            markSize: 4,
                            renderer: $.jqplot.CanvasAxisTickRenderer,
                            fontSize: '8px',
                            formatString: "%d"
                        },
                        useSeriesColor: false
                    }
                },
                noDataIndicator: {
                    show: true,
                    indicator: '',
                    axes: {
                        xaxis: {
                            showTicks: false
                        },
                        yaxis: {
                            showTicks: false
                        }
                    }
                },
                cursor: {
                    zoom: true,
                    style: 'auto',
                    showTooltip: false,
                    draggable: false,
                    dblClickReset: false
                },
                highlighter: {
                    show: true,
                    tooltipLocation: 'ne',
                    fadeTooltip: false,
                    tooltipContentEditor: null,
                    tooltipFormatString: '%s %s',
                    useAxesFormatters: false,
                    bringSeriesToFront: true,
                    contextMenu: true,
                    contextMenuSeriesOptions: {},
                    contextMenuBackgroundOptions: {},
                    clearTooltipOnClickOutside: false,
                    overTooltip: false,
                overTooltipOptions: {
                    showMarker: true,
                    showTooltip: false
                }
                },
                groupplot: {
                    show: false
                },
                pointLabels: {
                  show: false
                },
                canvasWindow: {
                  show: false
                },
                eventLine: {
                  show: false
                },
                multiSelect: {
                  show: true
                }
            }, option);
    };
    
  function bistelChart ($rootScope, $timeout, $window, $q) {
    return {
      restrict: 'A',
      template: '<div style="position:relative;"></div>',
      replace: true,
      scope: {
          chartOptions: '=',
          data: '=bistelChart',
          overlayObjects: '=',
          windowObjects: '=',
          specWindows: '=',
          chartEvents: '=',
          eventLines: '='
          
      },
      link: link
    };
    
    function link(scope, elem, attrs) {
        if (!elem.attr('id')) {
            elem.attr('id', 'bistelchart'+(Math.floor(Math.random()*100000)).toString()+_.uniqueId());
        }
        
        var timer, resizeTimer, drawTimeout, loader, plotVisible = false, dataChanged = false;
        var timeout = 200;
        
        //var objectStore = $rootScope.db.createObjectStore(elem.attr('id'),{keyPath: 'seriesIndex'});
        
        function renderChart() {
          var loaderElem;
          
          if (!angular.isArray(scope.data)) {
            hideLoader();
            return;
          }
          
          if (loader) {
            loader.detach();
          }
          
          dataChanged = false;
          
          var chartOptions = scope.chartOptions;
          var data = scope.data;
          var plot = elem.data('jqplot');
          if (plot) {
            plot.destroy();
          }
          elem.empty();
          elem.unbind();
          
          if (loader) {
            elem.append(loader);
          }
          
          var chartEvents = scope.chartEvents;
          
          if ($.isPlainObject(chartEvents)) {
            $.each(chartEvents, function(key, eventCallback) {
              elem.unbind(key);
              elem.bind(key, eventCallback);
            });
          }

          var opts = chartOptions ? chartOptions : {};
          opts = $.extend(true, {}, getDefaultPlotOption(), opts);

          elem.bind('jqplotLegendResize', function(ev, width, height) {
              scope.chartOptions.legend._width = width;
              scope.chartOptions.legend._height = height;
          });

          elem.bind('jqPlot.multiSelected', function(ev, selected, plot) {
              if (scope.chartOptions.multiSelect) {
                scope.chartOptions.multiSelect.selected = selected;
              }
          });

          try {
            elem.jqplot(data, opts);
            if (chartOptions) {
              chartOptions.plot = elem.data('jqplot');
            }
            hideLoader();
          } catch(e) {
            if (timer) {
              $timeout.cancel(timer);
            }
            timer = $timeout(function() {
              try {
                if (scope.data === data && elem.width() > 0 && elem.height() > 0) {
                  elem.jqplot(data, opts);
                  if (chartOptions) {
                    chartOptions.plot = elem.data('jqplot');
                  }
                }
              } catch(e) {
                //if ($rootScope.debug) {
                 console.log(e.stack);  // TODO: how to handle removed element
               //}
              } finally {
                hideLoader();
              }
            }, timeout);
            
            return timer;
          }
        };
        
        renderChart();
        
        scope.$on('$destroy', function() {
            var plot = elem.data('jqplot');
            if (plot) {
                try {
                    plot.destroy();
                } catch(e) {
                }
            }
        });
        
        function showLoader() {
          if (loader == null && scope.chartOptions.showLoader !== false && $.jqplot.config.loaderTemplate != null) {
            loader = angular.element($.jqplot.config.loaderTemplate);
            elem.append(loader);
          }
        }
        
        function hideLoader() {
          if (loader) {
            loader.remove();
            loader = null;
            if (elem.is(':visible')) {
              scope.$emit('BISTEL-CHART-RENDERED', elem.data('jqplot'));
            }
          }
        }
        
        function optionChange(options) {
            if (!elem.is(':visible')) return;
            
            var plot = elem.data('jqplot');
            
            if (plot && plot.target.find('canvas').length > 0) {
                plot.target.empty();
                if (plot.target.width() == 0 || plot.target.height() == 0) return;
                try {
                    plot.replot(options);
                } catch(e) {
                    console.log(e.stack);
                }
            }
            
            plot = null;
        }
        
        function drawCanvasOverlay(objects) {
            if (!elem.is(':visible')) return;
            
            var plot = elem.data('jqplot');
            
            if (plot && plot.options.canvasOverlay && $.isArray(objects)) {
                plot.options.canvasOverlay.objects = objects;
                
                var co = plot.plugins.canvasOverlay;
                
                co.setObjects(plot, objects);

                co = null;
            };
            
            plot = null;
        }
        
        function drawCanvasWindow(objects) {
            if (!elem.is(':visible')) return;
            
            var plot = elem.data('jqplot');
            
            if (plot && plot.options.canvasWindow && plot.options.canvasWindow.show && $.isArray(objects)) {
                
                plot.options.canvasWindow.objects = objects;
                
                var cw = plot.plugins.canvasWindow;
                
                cw.setObjects(plot, objects);

                cw = null;
            };
            
            plot = null;
        }
        
        function drawSpecWindow(data) {
            if (!elem.is(':visible')) return;
            
            var plot = elem.data('jqplot');
            
            if (plot && plot.data.length && plot.options.specWindow && plot.options.specWindow.show && plot.target.find('canvas').length && $.isArray(data)) {
                try {
                  plot.options.specWindow.data = data;
                  var axes = scope.chartOptions.axes;
                  
                  plot.target.empty();
                  if (plot.target.width() == 0 || plot.target.height() == 0) return;
                  
                  plot.replot({
                    resetAxes: true,
                    specWindow: {
                      data: data
                    }
                  });
                } catch(e) {
                  console.log(e.stack);
                }
            };
            
            plot = null;
        };
        
        function drawEventLine(events) {
            if (!elem.is(':visible')) return;
            
            var plot = elem.data('jqplot');
            
            if (plot && plot.options.eventLine && plot.options.eventLine.show && plot.target.find('canvas').length) {
                try {
                  plot.options.eventLine.events = events;
                  
                  var eventLine = plot.plugins.eventLine;
                  
                  eventLine.setEvents(events);
                
                  eventLine.draw(plot);

                  eventLine = null;
                } catch(e) {
                  console.log(e.stack);
                }
            };
            
            plot = null;
        }
        
        function changeSeries(newValue, oldValue) {
            var plot = elem.data('jqplot');
            
            if (plot && plot.data.length > 0 && plot.data.length !== newValue.length) {
              var addedSeries = _.difference(newValue, oldValue).filter(function(series) {
                  return angular.isArray(series.data) && series.data.length > 0;
              });
              var removedSeries = _.difference(oldValue, newValue);
              
              if (removedSeries.length) {
                removedSeries.forEach(function(series) {
                  var seriesIndex = oldValue.indexOf(series);
                  if (seriesIndex > -1) {
                    plot.data.splice(seriesIndex, 1);
                    plot.series.splice(seriesIndex, 1);
                    plot.seriesStack.splice(plot.series.length, 1);
                  }
                });
                plot.replot({resetAxes: getResetAxes(plot)});
              }
              if (addedSeries.length) {
                plot.addSeries(addedSeries, true);
              }
            } else if (angular.isArray(newValue)) {
              var hasData = false;
              newValue.forEach(function(series) {
                if (angular.isArray(series.data) && series.data.length > 0) {
                  scope.data.push(series.data);
                  hasData = true;
                }
              });
              
              if (hasData) {
                renderChart();
                //plot = elem.data('jqplot');
                //plot.replot({resetAxes: scope.chartOptions.axes});
              }
            }
            
            plot = null;
        }
        
        function getResetAxes(plot) {
          var newAxes = {};
          var chartOptions = $.extend(true, {}, getDefaultPlotOption(), scope.chartOptions);
          
          $.each(chartOptions.axes, function(axisName, ax) {
            if (ax == null) return;
            if (ax.show !== false) {
              newAxes[axisName] = {
                  min: ax.min,
                  max: ax.max
              };
            } else if (ax.autoscale) {
              newAxes[axisName] = true;
            } else {
              newAxes[axisName] = {
                min: ax.min,
                max: ax.max
              };
            }
          });
          
          return newAxes;
        }

        scope.$on('$destroy', scope.$watchCollection('[data, chartOptions]', function (newValues, oldValues) {
          if (newValues[0] != oldValues[0] || elem.data('jqplot') == null) {
            var newData = newValues[0], oldData = oldValues[0];
            try {
              if (elem.is(':visible')) {
                var plot = elem.data('jqplot');
                if (newData == null && (oldData == null || (angular.isArray(oldData) && oldData.length === 0))) {
                  return;
                } else {
                  elem.empty();
                  renderChart();
                }
              } else {
                dataChanged = true;
              }
            } catch(e) {
              renderChart();
              console.log(e.stack);
            }
          } else if (newValues[1] != oldValues[1]) {
            try {
              optionChange(newValues[1]);
            } catch(e) {
              renderChart();
            }
          }
        }));
        
        scope.$on('$destroy', scope.$watchCollection('chartOptions.series', function (newValue, oldValue) {
          if (angular.isArray(newValue) && angular.isArray(oldValue) && newValue.length != oldValue.length) {
            changeSeries(newValue, oldValue);
          }
        }));
        
        scope.$on('$destroy', scope.$watch('overlayObjects', function (newValue, oldValue) {
            if (newValue !== oldValue) {
                if (scope.chartOptions.canvasOverlay) scope.chartOptions.canvasOverlay.objects = newValue;
                drawCanvasOverlay(newValue);
            }
        }));
        
        scope.$on('$destroy', scope.$watchCollection('overlayObjects', function (newValue, oldValue) {
            if (newValue !== oldValue) {
                if (scope.chartOptions.canvasOverlay) scope.chartOptions.canvasOverlay.objects = newValue;
                var plot = elem.data('jqplot');
                drawCanvasOverlay(newValue);
            }
        }));
        
        scope.$on('$destroy', scope.$watch('windowObjects', function (newValue, oldValue) {
            if (newValue !== oldValue) {
                if (scope.chartOptions.canvasWindow) scope.chartOptions.canvasWindow.objects = newValue;
                drawCanvasWindow(newValue);
            }
        }));
        scope.$on('$destroy', scope.$watchCollection('windowObjects', function (newValue, oldValue) {
            if (newValue !== oldValue) {
                if (scope.chartOptions.canvasWindow) scope.chartOptions.canvasWindow.objects = newValue;
                drawCanvasWindow(newValue);
            }
        }));
        
        scope.$on('$destroy', scope.$watch('specWindows', function (newValue, oldValue) {
            if (newValue !== oldValue) {
                if (scope.chartOptions.specWindow) scope.chartOptions.specWindow.data = newValue;
                drawSpecWindow(newValue);
            }
        }));
        scope.$on('$destroy', scope.$watchCollection('specWindows', function (newValue, oldValue) {
            if (newValue !== oldValue) {
                if (scope.chartOptions.specWindow) scope.chartOptions.specWindow.data = newValue;
                drawSpecWindow(newValue);
            }
        }));
        
        scope.$on('$destroy', scope.$watch('eventLines', function (newValue, oldValue) {
            if (newValue !== oldValue) {
                if (scope.chartOptions.eventLine) scope.chartOptions.eventLine.events = newValue;
                drawEventLine(newValue);
            }
        }));
        scope.$on('$destroy', scope.$watchCollection('eventLines', function (newValue, oldValue) {
            if (newValue !== oldValue) {
                if (scope.chartOptions.eventLine) scope.chartOptions.eventLine.events = newValue;
                drawEventLine(newValue);
            }
        }));
        
        scope.$on('$destroy', scope.$watch(function() {
            return elem.is(':visible');
        }, function(newValue, oldValue) {
            if (newValue !== oldValue && newValue && !plotVisible) {
                var plot = elem.data('jqplot');
                if (plot == null || plot.target.find('canvas').length === 0 || dataChanged) {
                  showLoader();
                  
                  if (timer) $timeout.cancel(timer);
                  timer = $timeout(function() {
                    return $timeout(function() {
                      renderChart();
                    });
                  }, timeout);
                } else {
                    handleResize();
                }
                plot = null;
            }
            plotVisible = newValue;
        }));
        
        scope.$on('$destroy', scope.$watch(function() {
            return elem.width() + 'x' + elem.height();
        }, function(newSize, oldSize) {
            if (newSize !== oldSize) {
                handleResize();
            }
        }));
        
        scope.$on('$destroy', scope.$watch(function() {
            return elem.width() + 'x' + elem.height();
        }, function(newSize, oldSize) {
            if (newSize !== oldSize) {
                handleResize();
            }
        }));
        
        function handleResize(ev) {
          if (resizeTimer) $timeout.cancel(resizeTimer);
          resizeTimer = $timeout(function() {
            if (!elem.is(':visible') || elem.find('canvas').length === 0) {
              return;
            }
            var plot = elem.data('jqplot');
            try {
              if (plot && plot.target && plot.target.is(':visible') && plot.target.width() && plot.target.height()
                && (plot.target.width() !== plot.baseCanvas._elem.width() || plot.target.height() !== plot.baseCanvas._elem.height())) {
                if (plot.plugins.cursor && plot.plugins.cursor._zoom && plot.plugins.cursor._zoom.isZoomed) {
                  $.each(plot.axes, function(axisName, axis) {
                    if (axis != null && axis._options && axis._options.show !== false && axis.renderer.constructor === $.jqplot.LinearAxisRenderer) {
                      if (axis.tickInset) {
                        axis.min = axis.min + axis.tickInset * axis.tickInterval;
                        axis.max = axis.max - axis.tickInset * axis.tickInterval;
                      }
                      axis.ticks = [];
                      axis._ticks = [];
                      axis.tickInterval = null;
                      axis.numberTicks = null;
                    }
                  });
                  plot.replot();
                } else {
                  plot.replot({resetAxes: getResetAxes(plot)});
                }
              }
            } catch(e) {
              console.log('target removed');
            }
          }, timeout);
        }
        
        scope.$on('$destroy', scope.$on('elementresize', handleResize));
        angular.element($window).bind('resize', handleResize);
        
        $timeout(handleResize);
        
        scope.$on('$destroy', function() {
            angular.element($window).unbind('resize', handleResize);
        });
      }
  }
  
  function bistelChartSvc() {
      this.getDefaultOption = getDefaultPlotOption;
      this.replot = replot;

      function replot(plot) {
        if (plot.plugins.cursor && plot.plugins.cursor._zoom && plot.plugins.cursor._zoom.isZoomed) {
          $.each(plot.axes, function(axisName, axis) {
            if (axis != null && axis._options && axis._options.show !== false && axis.renderer.constructor === $.jqplot.LinearAxisRenderer) {
              if (axis.dataType === 'index') {
                axis.min = axis.__min;
                axis.max = axis.__max;
              } else if (axis.tickInset) {
                axis.min = axis.min + axis.tickInset * axis.tickInterval;
                axis.max = axis.max - axis.tickInset * axis.tickInterval;
              }
              axis.ticks = [];
              axis._ticks = [];
              axis.tickInterval = null;
              axis.numberTicks = null;
            }
          });
          plot.replot();
        } else {
          plot.replot({resetAxes: _getResetAxes(plot)});
        }
      }

      function _getResetAxes(plot) {
          var newAxes = {};
          var axes = plot.axes;
          
          $.each(plot.options.axes, function(axisName, ax) {
            if (ax == null) return;
            if (ax.rendererOptions && ax.rendererOptions.dataType === 'index') {
              axes[axisName].tempCalcMin = null;
              axes[axisName].tempCalcMax = null;
              axes[axisName].tempCalcResult_p2u = null;
              axes[axisName].tempCalcResult_u2p = null;
              axes[axisName].tempCalcResult_u2p = null;              

              newAxes[axisName] = {
                  min: ax.min,
                  max: ax.max
              };
            } else if (ax.show !== false) {

              newAxes[axisName] = {
                  min: ax.min,
                  max: ax.max
              };
            } else if (ax.autoscale) {
              newAxes[axisName] = true;
            } else {
              newAxes[axisName] = {
                min: ax.min,
                max: ax.max
              };
            }
          });
          
          return newAxes;
        }
      //TODO : Define options on a case by case
  }
})(jQuery);
