import { Injectable } from '@angular/core';
import { WidgetConfigApi } from '../../../../common';

@Injectable()
export class PdmRadarChartConfig extends WidgetConfigApi {
    getHealthIndexChartConfig() {
        return {
            height: 100,
            legend: {
                show: false
            },
            axes: {
                xaxis: {
                    show: false,
                    showTicks: false,
                    showLable: false
                },
                yaxis: {
                    show: false,
                    showTicks: false,
                    showLable: false
                }
            },
            seriesDefaults: {
                showMarker: false
            },
            eventLine: {
                show: true,
                events: []
            },
            highlighter: {
                showTooltip: false
            }
        };
    }

    getHelathIndexSpecLines(alarm, warning) {
        return [
            {
                name: 'Warning',
                show: true,
                type: 'line',
                axis: 'yaxis',
                label: {
                    show: true,
                    position: 's'
                },
                line: {
                    width: .3,
                    color: '#ffa500',
                    show: true,
                    tooltip: {
                        show: false
                    },
                    label: {
                        show: true
                    },
                    value: warning,
                }
            }, {
                name: 'Alarm',
                show: true,
                type: 'line',
                axis: 'yaxis',
                label: {
                    show: true
                },
                line: {
                    width: .3,
                    color: '#ff5d43',
                    show: true,
                    tooltip: {
                        show: false
                    },
                    label: {
                        show: true
                    },
                    value: alarm,
                }
            }
        ];
    }

    getParamChartListConfig() {
        return {
            legend: {
                show: false
            },
            axes: {
                xaxis: {
                    show: false,
                    showTicks: false,
                    showLable: false
                },
                yaxis: {
                    show: false,
                    showTicks: false,
                    showLable: false
                }
            },
            seriesDefaults: {
                showMarker: false
            }
        };
    }

    getParamChartConfig() {
        return {
            legend: {
                show: false
            },
            seriesDefaults: {
                showMarker: false
            },
            axes: {
                yaxis: {
                    labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                    tickOptions: {
                        formatString: '%.2f',
                        showGridline: false
                    }
                },
                xaxis: {
                    rendererOptions: {
                        dataType: 'date'
                    },
                    tickOptions: {
                        formatter: function(formatString, val, plot) {
                            return moment(val).format('YYYY-MM-DD HH:mm:ss');
                        }
                    }
                }
            },
            eventLine: {
                show: true,
                events: []
            }
        };
    }

    getContourChartConfig() {
        return {};
    }
}
