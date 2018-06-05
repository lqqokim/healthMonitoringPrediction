System.register(["wijmo/wijmo", "wijmo/wijmo.chart", "wijmo/wijmo.chart.finance"], function (exports_1, context_1) {
    "use strict";
    var __extends = (this && this.__extends) || (function () {
        var extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var __moduleName = context_1 && context_1.id;
    function _trunc(value) {
        wjcCore.asNumber(value, true, false);
        return value > 0 ? Math.floor(value) : Math.ceil(value);
    }
    exports_1("_trunc", _trunc);
    function _sum(values) {
        if (arguments.length > 1) {
            values = Array.prototype.slice.call(arguments);
        }
        wjcCore.asArray(values, false);
        return values.reduce(function (prev, curr) { return prev + wjcCore.asNumber(curr); }, 0);
    }
    exports_1("_sum", _sum);
    function _average(values) {
        if (arguments.length > 1) {
            values = Array.prototype.slice.call(arguments);
        }
        wjcCore.asArray(values, false);
        return _sum(values) / values.length;
    }
    exports_1("_average", _average);
    function _minimum(values) {
        if (arguments.length > 1) {
            values = Array.prototype.slice.call(arguments);
        }
        wjcCore.asArray(values, false);
        return Math.min.apply(null, values);
    }
    exports_1("_minimum", _minimum);
    function _maximum(values) {
        if (arguments.length > 1) {
            values = Array.prototype.slice.call(arguments);
        }
        wjcCore.asArray(values, false);
        return Math.max.apply(null, values);
    }
    exports_1("_maximum", _maximum);
    function _variance(values) {
        if (arguments.length > 1) {
            values = Array.prototype.slice.call(arguments);
        }
        wjcCore.asArray(values, false);
        var mean = _average(values), diffs = values.map(function (value) { return Math.pow(value - mean, 2); });
        return _average(diffs);
    }
    exports_1("_variance", _variance);
    function _stdDeviation(values) {
        if (arguments.length > 1) {
            values = Array.prototype.slice.call(arguments);
        }
        wjcCore.asArray(values, false);
        return Math.sqrt(_variance(values));
    }
    exports_1("_stdDeviation", _stdDeviation);
    function _avgTrueRng(highs, lows, closes, period) {
        if (period === void 0) { period = 14; }
        wjcCore.asArray(highs, false);
        wjcCore.asArray(lows, false);
        wjcCore.asArray(closes, false);
        wjcCore.asInt(period, false, true);
        var trs = _trueRng(highs, lows, closes, period), len = Math.min(highs.length, lows.length, closes.length, trs.length), atrs = [];
        wjcCore.assert(len > period && period > 1, "Average True Range period must be an integer less than the length of the data and greater than one.");
        for (var i = 0; i < len; i++) {
            wjcCore.asNumber(highs[i], false);
            wjcCore.asNumber(lows[i], false);
            wjcCore.asNumber(closes[i], false);
            wjcCore.asNumber(trs[i], false);
            if ((i + 1) === period) {
                atrs.push(_average(trs.slice(0, period)));
            }
            else if ((i + 1) > period) {
                atrs.push(((period - 1) * atrs[atrs.length - 1] + trs[i]) / period);
            }
        }
        return atrs;
    }
    exports_1("_avgTrueRng", _avgTrueRng);
    function _trueRng(highs, lows, closes, period) {
        if (period === void 0) { period = 14; }
        wjcCore.asArray(highs, false);
        wjcCore.asArray(lows, false);
        wjcCore.asArray(closes, false);
        wjcCore.asInt(period, false, true);
        var len = Math.min(highs.length, lows.length, closes.length), trs = [];
        wjcCore.assert(len > period && period > 1, "True Range period must be an integer less than the length of the data and greater than one.");
        for (var i = 0; i < len; i++) {
            wjcCore.asNumber(highs[i], false);
            wjcCore.asNumber(lows[i], false);
            wjcCore.asNumber(closes[i], false);
            if (i === 0) {
                trs.push(highs[i] - lows[i]);
            }
            else {
                trs.push(Math.max(highs[i] - lows[i], Math.abs(highs[i] - closes[i - 1]), Math.abs(lows[i] - closes[i - 1])));
            }
        }
        return trs;
    }
    exports_1("_trueRng", _trueRng);
    function _sma(values, period) {
        wjcCore.asArray(values, false);
        wjcCore.asNumber(period, false, true);
        wjcCore.assert(values.length > period && period > 1, "Simple Moving Average period must be an integer less than the length of the data and greater than one.");
        var retval = [];
        for (var i = period; i <= values.length; i++) {
            retval.push(_average(values.slice(i - period, i)));
        }
        return retval;
    }
    exports_1("_sma", _sma);
    function _ema(values, period) {
        wjcCore.asArray(values, false);
        wjcCore.asNumber(period, false, true);
        wjcCore.assert(values.length > period && period > 1, "Exponential Moving Average period must be an integer less than the length of the data and greater than one.");
        var retval = [], multiplier = 2 / (period + 1), smas = _sma(values, period);
        values = values.slice(period - 1);
        for (var i = 0; i < values.length; i++) {
            if (i === 0) {
                retval.push(smas[0]);
            }
            else {
                retval.push((values[i] - retval[i - 1]) * multiplier + retval[i - 1]);
            }
        }
        return retval;
    }
    exports_1("_ema", _ema);
    function _range(begin, end, step) {
        if (step === void 0) { step = 1; }
        wjcCore.asNumber(begin, false);
        wjcCore.asNumber(end, false);
        wjcCore.asNumber(step, false);
        wjcCore.assert(begin < end, "begin argument must be less than end argument.");
        var retval = [];
        for (var i = begin; i <= end; i += step) {
            retval.push(i);
        }
        return retval;
    }
    exports_1("_range", _range);
    var wjcCore, wjcChart, wjcSelf, FinancialChartType, FinancialChart, FinancialSeries, _BaseCalculator, _HeikinAshiCalculator, _BaseRangeCalculator, _LineBreakCalculator, _KagiCalculator, _RenkoCalculator, _HeikinAshiPlotter, _BaseRangePlotter, DataFields, RangeMode, _LineBreakPlotter, _RenkoPlotter, _KagiPlotter;
    return {
        setters: [
            function (wjcCore_1) {
                wjcCore = wjcCore_1;
            },
            function (wjcChart_1) {
                wjcChart = wjcChart_1;
            },
            function (wjcSelf_1) {
                wjcSelf = wjcSelf_1;
            }
        ],
        execute: function () {
            window['wijmo'] = window['wijmo'] || {};
            window['wijmo']['chart'] = window['wijmo']['chart'] || {};
            window['wijmo']['chart']['finance'] = wjcSelf;
            "use strict";
            'use strict';
            (function (FinancialChartType) {
                FinancialChartType[FinancialChartType["Column"] = 0] = "Column";
                FinancialChartType[FinancialChartType["Scatter"] = 1] = "Scatter";
                FinancialChartType[FinancialChartType["Line"] = 2] = "Line";
                FinancialChartType[FinancialChartType["LineSymbols"] = 3] = "LineSymbols";
                FinancialChartType[FinancialChartType["Area"] = 4] = "Area";
                FinancialChartType[FinancialChartType["Candlestick"] = 5] = "Candlestick";
                FinancialChartType[FinancialChartType["HighLowOpenClose"] = 6] = "HighLowOpenClose";
                FinancialChartType[FinancialChartType["HeikinAshi"] = 7] = "HeikinAshi";
                FinancialChartType[FinancialChartType["LineBreak"] = 8] = "LineBreak";
                FinancialChartType[FinancialChartType["Renko"] = 9] = "Renko";
                FinancialChartType[FinancialChartType["Kagi"] = 10] = "Kagi";
                FinancialChartType[FinancialChartType["ColumnVolume"] = 11] = "ColumnVolume";
                FinancialChartType[FinancialChartType["EquiVolume"] = 12] = "EquiVolume";
                FinancialChartType[FinancialChartType["CandleVolume"] = 13] = "CandleVolume";
                FinancialChartType[FinancialChartType["ArmsCandleVolume"] = 14] = "ArmsCandleVolume";
            })(FinancialChartType || (FinancialChartType = {}));
            exports_1("FinancialChartType", FinancialChartType);
            FinancialChart = (function (_super) {
                __extends(FinancialChart, _super);
                function FinancialChart(element, options) {
                    var _this = _super.call(this, element, null) || this;
                    _this._chartType = FinancialChartType.Line;
                    _this.__heikinAshiPlotter = null;
                    _this.__lineBreakPlotter = null;
                    _this.__renkoPlotter = null;
                    _this.__kagiPlotter = null;
                    _this.initialize(options);
                    return _this;
                }
                Object.defineProperty(FinancialChart.prototype, "chartType", {
                    get: function () {
                        return this._chartType;
                    },
                    set: function (value) {
                        if (value != this._chartType) {
                            this._chartType = wjcCore.asEnum(value, FinancialChartType);
                            this.invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FinancialChart.prototype, "options", {
                    get: function () {
                        return this._options;
                    },
                    set: function (value) {
                        if (value != this._options) {
                            this._options = value;
                            this.invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FinancialChart.prototype, "_heikinAshiPlotter", {
                    get: function () {
                        if (this.__heikinAshiPlotter === null) {
                            this.__heikinAshiPlotter = new _HeikinAshiPlotter();
                            this._initPlotter(this.__heikinAshiPlotter);
                        }
                        return this.__heikinAshiPlotter;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FinancialChart.prototype, "_lineBreakPlotter", {
                    get: function () {
                        if (this.__lineBreakPlotter === null) {
                            this.__lineBreakPlotter = new _LineBreakPlotter();
                            this._initPlotter(this.__lineBreakPlotter);
                        }
                        return this.__lineBreakPlotter;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FinancialChart.prototype, "_renkoPlotter", {
                    get: function () {
                        if (this.__renkoPlotter === null) {
                            this.__renkoPlotter = new _RenkoPlotter();
                            this._initPlotter(this.__renkoPlotter);
                        }
                        return this.__renkoPlotter;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FinancialChart.prototype, "_kagiPlotter", {
                    get: function () {
                        if (this.__kagiPlotter === null) {
                            this.__kagiPlotter = new _KagiPlotter();
                            this._initPlotter(this.__kagiPlotter);
                        }
                        return this.__kagiPlotter;
                    },
                    enumerable: true,
                    configurable: true
                });
                FinancialChart.prototype._getChartType = function () {
                    var ct = null;
                    switch (this.chartType) {
                        case FinancialChartType.Area:
                            ct = wjcChart.ChartType.Area;
                            break;
                        case FinancialChartType.Line:
                        case FinancialChartType.Kagi:
                            ct = wjcChart.ChartType.Line;
                            break;
                        case FinancialChartType.Column:
                        case FinancialChartType.ColumnVolume:
                            ct = wjcChart.ChartType.Column;
                            break;
                        case FinancialChartType.LineSymbols:
                            ct = wjcChart.ChartType.LineSymbols;
                            break;
                        case FinancialChartType.Scatter:
                            ct = wjcChart.ChartType.Scatter;
                            break;
                        case FinancialChartType.Candlestick:
                        case FinancialChartType.Renko:
                        case FinancialChartType.HeikinAshi:
                        case FinancialChartType.LineBreak:
                        case FinancialChartType.EquiVolume:
                        case FinancialChartType.CandleVolume:
                        case FinancialChartType.ArmsCandleVolume:
                            ct = wjcChart.ChartType.Candlestick;
                            break;
                        case FinancialChartType.HighLowOpenClose:
                            ct = wjcChart.ChartType.HighLowOpenClose;
                            break;
                    }
                    return ct;
                };
                FinancialChart.prototype._getPlotter = function (series) {
                    var chartType = this.chartType, plotter = null, isSeries = false;
                    if (series) {
                        var stype = series.chartType;
                        if (stype && !wjcCore.isUndefined(stype) && stype != chartType) {
                            chartType = stype;
                            isSeries = true;
                        }
                    }
                    switch (chartType) {
                        case FinancialChartType.HeikinAshi:
                            plotter = this._heikinAshiPlotter;
                            break;
                        case FinancialChartType.LineBreak:
                            plotter = this._lineBreakPlotter;
                            break;
                        case FinancialChartType.Renko:
                            plotter = this._renkoPlotter;
                            break;
                        case FinancialChartType.Kagi:
                            plotter = this._kagiPlotter;
                            break;
                        case FinancialChartType.ColumnVolume:
                            plotter = _super.prototype._getPlotter.call(this, series);
                            plotter.isVolume = true;
                            plotter.width = 1;
                            break;
                        case FinancialChartType.EquiVolume:
                            plotter = _super.prototype._getPlotter.call(this, series);
                            plotter.isEqui = true;
                            plotter.isCandle = false;
                            plotter.isArms = false;
                            plotter.isVolume = true;
                            plotter.symbolWidth = "100%";
                            break;
                        case FinancialChartType.CandleVolume:
                            plotter = _super.prototype._getPlotter.call(this, series);
                            plotter.isEqui = false;
                            plotter.isCandle = true;
                            plotter.isArms = false;
                            plotter.isVolume = true;
                            plotter.symbolWidth = "100%";
                            break;
                        case FinancialChartType.ArmsCandleVolume:
                            plotter = _super.prototype._getPlotter.call(this, series);
                            plotter.isEqui = false;
                            plotter.isCandle = false;
                            plotter.isArms = true;
                            plotter.isVolume = true;
                            plotter.symbolWidth = "100%";
                            break;
                        default:
                            plotter = _super.prototype._getPlotter.call(this, series);
                            break;
                    }
                    return plotter;
                };
                FinancialChart.prototype._createSeries = function () {
                    return new FinancialSeries();
                };
                return FinancialChart;
            }(wjcChart.FlexChartCore));
            exports_1("FinancialChart", FinancialChart);
            'use strict';
            FinancialSeries = (function (_super) {
                __extends(FinancialSeries, _super);
                function FinancialSeries() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Object.defineProperty(FinancialSeries.prototype, "chartType", {
                    get: function () {
                        return this._finChartType;
                    },
                    set: function (value) {
                        if (value != this._finChartType) {
                            this._finChartType = wjcCore.asEnum(value, FinancialChartType, true);
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                FinancialSeries.prototype._getChartType = function () {
                    var ct = null;
                    switch (this.chartType) {
                        case FinancialChartType.Area:
                            ct = wjcChart.ChartType.Area;
                            break;
                        case FinancialChartType.Line:
                        case FinancialChartType.Kagi:
                            ct = wjcChart.ChartType.Line;
                            break;
                        case FinancialChartType.Column:
                        case FinancialChartType.ColumnVolume:
                            ct = wjcChart.ChartType.Column;
                            break;
                        case FinancialChartType.LineSymbols:
                            ct = wjcChart.ChartType.LineSymbols;
                            break;
                        case FinancialChartType.Scatter:
                            ct = wjcChart.ChartType.Scatter;
                            break;
                        case FinancialChartType.Candlestick:
                        case FinancialChartType.Renko:
                        case FinancialChartType.HeikinAshi:
                        case FinancialChartType.LineBreak:
                        case FinancialChartType.EquiVolume:
                        case FinancialChartType.CandleVolume:
                        case FinancialChartType.ArmsCandleVolume:
                            ct = wjcChart.ChartType.Candlestick;
                            break;
                        case FinancialChartType.HighLowOpenClose:
                            ct = wjcChart.ChartType.HighLowOpenClose;
                            break;
                    }
                    return ct;
                };
                return FinancialSeries;
            }(wjcChart.SeriesBase));
            exports_1("FinancialSeries", FinancialSeries);
            "use strict";
            _BaseCalculator = (function () {
                function _BaseCalculator(highs, lows, opens, closes) {
                    this.highs = highs;
                    this.lows = lows;
                    this.opens = opens;
                    this.closes = closes;
                }
                _BaseCalculator.prototype.calculate = function () { };
                return _BaseCalculator;
            }());
            exports_1("_BaseCalculator", _BaseCalculator);
            _HeikinAshiCalculator = (function (_super) {
                __extends(_HeikinAshiCalculator, _super);
                function _HeikinAshiCalculator(highs, lows, opens, closes) {
                    return _super.call(this, highs, lows, opens, closes) || this;
                }
                _HeikinAshiCalculator.prototype.calculate = function () {
                    var len = Math.min(this.highs.length, this.lows.length, this.opens.length, this.closes.length), haHigh, haLow, haOpen, haClose, retvals = [];
                    if (len <= 0) {
                        return retvals;
                    }
                    for (var i = 0; i < len; i++) {
                        haClose = _average(this.highs[i], this.lows[i], this.opens[i], this.closes[i]);
                        if (i === 0) {
                            haOpen = _average(this.opens[i], this.closes[i]);
                            haHigh = this.highs[i];
                            haLow = this.lows[i];
                        }
                        else {
                            haOpen = _average(retvals[i - 1].open, retvals[i - 1].close);
                            haHigh = Math.max(this.highs[i], haOpen, haClose);
                            haLow = Math.min(this.lows[i], haOpen, haClose);
                        }
                        retvals.push({
                            high: haHigh,
                            low: haLow,
                            close: haClose,
                            open: haOpen,
                            pointIndex: i,
                            x: null
                        });
                    }
                    return retvals;
                };
                return _HeikinAshiCalculator;
            }(_BaseCalculator));
            exports_1("_HeikinAshiCalculator", _HeikinAshiCalculator);
            _BaseRangeCalculator = (function (_super) {
                __extends(_BaseRangeCalculator, _super);
                function _BaseRangeCalculator(highs, lows, opens, closes, xs, size, unit, fields) {
                    var _this = _super.call(this, highs, lows, opens, closes) || this;
                    _this.xs = xs;
                    _this.size = size;
                    _this.unit = unit;
                    _this.fields = fields;
                    return _this;
                }
                _BaseRangeCalculator.prototype._getValues = function () {
                    var values = [], len = Math.min(this.highs.length, this.lows.length, this.opens.length, this.closes.length), i;
                    switch (this.fields) {
                        case DataFields.High: {
                            values = this.highs;
                            break;
                        }
                        case DataFields.Low: {
                            values = this.lows;
                            break;
                        }
                        case DataFields.Open: {
                            values = this.opens;
                            break;
                        }
                        case DataFields.HL2: {
                            for (i = 0; i < len; i++) {
                                values.push(_average(this.highs[i], this.lows[i]));
                            }
                            break;
                        }
                        case DataFields.HLC3: {
                            for (i = 0; i < len; i++) {
                                values.push(_average(this.highs[i], this.lows[i], this.closes[i]));
                            }
                            break;
                        }
                        case DataFields.HLOC4: {
                            for (i = 0; i < len; i++) {
                                values.push(_average(this.highs[i], this.lows[i], this.opens[i], this.closes[i]));
                            }
                            break;
                        }
                        case DataFields.Close:
                        default: {
                            values = this.closes;
                            break;
                        }
                    }
                    return values;
                };
                _BaseRangeCalculator.prototype._getSize = function () {
                    var atrs = this.unit === RangeMode.ATR ? _avgTrueRng(this.highs, this.lows, this.closes, this.size) : null;
                    return this.unit === RangeMode.ATR ? atrs[atrs.length - 1] : this.size;
                };
                return _BaseRangeCalculator;
            }(_BaseCalculator));
            exports_1("_BaseRangeCalculator", _BaseRangeCalculator);
            _LineBreakCalculator = (function (_super) {
                __extends(_LineBreakCalculator, _super);
                function _LineBreakCalculator(highs, lows, opens, closes, xs, size) {
                    return _super.call(this, highs, lows, opens, closes, xs, size) || this;
                }
                _LineBreakCalculator.prototype.calculate = function () {
                    var hasXs = this.xs !== null && this.xs.length > 0, len = this.closes.length, retvals = [], rangeValues = [[], []];
                    if (len <= 0) {
                        return retvals;
                    }
                    var tempRngs = [], basePrice, x, close, lbLen, lbIdx, max, min;
                    for (var i = 1; i < len; i++) {
                        lbLen = retvals.length;
                        lbIdx = lbLen - 1;
                        x = hasXs ? this.xs[i] : i;
                        close = this.closes[i];
                        if (lbIdx === -1) {
                            basePrice = this.closes[0];
                            if (basePrice === close) {
                                continue;
                            }
                        }
                        else {
                            if (this._trendExists(rangeValues) || this.size === 1) {
                                tempRngs = rangeValues[0].slice(-this.size).concat(rangeValues[1].slice(-this.size));
                            }
                            else {
                                tempRngs = rangeValues[0].slice(1 - this.size).concat(rangeValues[1].slice(1 - this.size));
                            }
                            max = Math.max.apply(null, tempRngs);
                            min = Math.min.apply(null, tempRngs);
                            if (close > max) {
                                basePrice = Math.max(rangeValues[0][lbIdx], rangeValues[1][lbIdx]);
                            }
                            else if (close < min) {
                                basePrice = Math.min(rangeValues[0][lbIdx], rangeValues[1][lbIdx]);
                            }
                            else {
                                continue;
                            }
                        }
                        rangeValues[0].push(basePrice);
                        rangeValues[1].push(close);
                        retvals.push({
                            high: Math.max(basePrice, close),
                            low: Math.min(basePrice, close),
                            open: basePrice,
                            close: close,
                            x: x,
                            pointIndex: i
                        });
                    }
                    return retvals;
                };
                _LineBreakCalculator.prototype._trendExists = function (vals) {
                    if (vals[1].length < this.size) {
                        return false;
                    }
                    var retval = false, t, temp = vals[1].slice(-this.size);
                    for (t = 1; t < this.size; t++) {
                        retval = temp[t] > temp[t - 1];
                        if (!retval) {
                            break;
                        }
                    }
                    if (!retval) {
                        for (t = 1; t < this.size; t++) {
                            retval = temp[t] < temp[t - 1];
                            if (!retval) {
                                break;
                            }
                        }
                    }
                    return retval;
                };
                return _LineBreakCalculator;
            }(_BaseRangeCalculator));
            exports_1("_LineBreakCalculator", _LineBreakCalculator);
            _KagiCalculator = (function (_super) {
                __extends(_KagiCalculator, _super);
                function _KagiCalculator(highs, lows, opens, closes, xs, size, unit, field) {
                    return _super.call(this, highs, lows, opens, closes, xs, size, unit, field) || this;
                }
                _KagiCalculator.prototype.calculate = function () {
                    var reversal = this._getSize(), len = Math.min(this.highs.length, this.lows.length, this.opens.length, this.closes.length), values = this._getValues(), hasXs = this.xs !== null && this.xs.length > 0, retvals = [], rangeValues = [[], []];
                    if (len <= 0) {
                        return retvals;
                    }
                    var basePrice, x, current, rLen, rIdx, min, max, diff, extend, pointIndex;
                    for (var i = 1; i < len; i++) {
                        rLen = retvals.length;
                        rIdx = rLen - 1;
                        x = hasXs ? this.xs[i] : i;
                        pointIndex = i;
                        extend = false;
                        if (this.fields === DataFields.HighLow) {
                            if (rIdx === -1) {
                                if (this.highs[i] > this.highs[0]) {
                                    current = this.highs[i];
                                }
                                else if (this.lows[i] < this.lows[0]) {
                                    current = this.lows[i];
                                }
                                else {
                                    continue;
                                }
                            }
                            else {
                                diff = rangeValues[1][rIdx] - rangeValues[0][rIdx];
                                if (diff > 0) {
                                    if (this.highs[i] > rangeValues[1][rIdx]) {
                                        current = this.highs[i];
                                    }
                                    else if (this.lows[i] < rangeValues[1][rIdx]) {
                                        current = this.lows[i];
                                    }
                                    else {
                                        continue;
                                    }
                                }
                                else {
                                    if (this.lows[i] < rangeValues[1][rIdx]) {
                                        current = this.lows[i];
                                    }
                                    else if (this.highs[i] > rangeValues[1][rIdx]) {
                                        current = this.highs[i];
                                    }
                                    else {
                                        continue;
                                    }
                                }
                            }
                        }
                        else {
                            current = values[i];
                        }
                        if (this.unit === RangeMode.Percentage) {
                            reversal = current * this.size;
                        }
                        if (rIdx === -1) {
                            x = hasXs ? this.xs[0] : 0;
                            pointIndex = 0;
                            if (this.fields === DataFields.HighLow) {
                                basePrice = this.highs[0];
                            }
                            else {
                                basePrice = values[0];
                            }
                            diff = Math.abs(basePrice - current);
                            if (diff < reversal) {
                                continue;
                            }
                        }
                        else {
                            diff = rangeValues[1][rIdx] - rangeValues[0][rIdx];
                            max = Math.max(rangeValues[0][rIdx], rangeValues[1][rIdx]);
                            min = Math.min(rangeValues[0][rIdx], rangeValues[1][rIdx]);
                            if (diff > 0) {
                                if (current > max) {
                                    extend = true;
                                }
                                else {
                                    diff = max - current;
                                    if (diff >= reversal) {
                                        basePrice = max;
                                    }
                                    else {
                                        continue;
                                    }
                                }
                            }
                            else {
                                if (current < min) {
                                    extend = true;
                                }
                                else {
                                    diff = current - min;
                                    if (diff >= reversal) {
                                        basePrice = min;
                                    }
                                    else {
                                        continue;
                                    }
                                }
                            }
                        }
                        if (extend) {
                            rangeValues[1][rIdx] = current;
                            retvals[rIdx].close = current;
                            retvals[rIdx].high = Math.max(retvals[rIdx].open, retvals[rIdx].close);
                            retvals[rIdx].low = Math.min(retvals[rIdx].open, retvals[rIdx].close);
                        }
                        else {
                            rangeValues[0].push(basePrice);
                            rangeValues[1].push(current);
                            retvals.push({
                                high: Math.max(basePrice, current),
                                low: Math.min(basePrice, current),
                                open: basePrice,
                                close: current,
                                x: x,
                                pointIndex: pointIndex
                            });
                        }
                    }
                    return retvals;
                };
                return _KagiCalculator;
            }(_BaseRangeCalculator));
            exports_1("_KagiCalculator", _KagiCalculator);
            _RenkoCalculator = (function (_super) {
                __extends(_RenkoCalculator, _super);
                function _RenkoCalculator(highs, lows, opens, closes, xs, size, unit, field, rounding) {
                    if (rounding === void 0) { rounding = false; }
                    var _this = _super.call(this, highs, lows, opens, closes, xs, size, unit, field) || this;
                    _this.rounding = rounding;
                    return _this;
                }
                _RenkoCalculator.prototype.calculate = function () {
                    var size = this._getSize(), len = Math.min(this.highs.length, this.lows.length, this.opens.length, this.closes.length), hasXs = this.xs !== null && this.xs.length > 0, values = this._getValues(), retvals = [], rangeValues = [[], []];
                    if (len <= 0) {
                        return retvals;
                    }
                    var basePrice, x, current, rLen, rIdx, min, max, diff;
                    for (var i = 1; i < len; i++) {
                        rLen = retvals.length;
                        rIdx = rLen - 1;
                        x = hasXs ? this.xs[i] : i;
                        if (this.fields === DataFields.HighLow) {
                            if (rIdx === -1) {
                                if (this.highs[i] - this.highs[0] > size) {
                                    basePrice = this.highs[0];
                                    current = this.highs[i];
                                }
                                else if (this.lows[0] - this.lows[i] > size) {
                                    basePrice = this.lows[0];
                                    current = this.lows[i];
                                }
                                else {
                                    continue;
                                }
                            }
                            else {
                                min = Math.min(rangeValues[0][rIdx], rangeValues[1][rIdx]);
                                max = Math.max(rangeValues[0][rIdx], rangeValues[1][rIdx]);
                                if ((this.highs[i] - max) > size) {
                                    basePrice = max;
                                    current = this.highs[i];
                                }
                                else if ((min - this.lows[i]) > size) {
                                    basePrice = min;
                                    current = this.lows[i];
                                }
                                else {
                                    continue;
                                }
                            }
                        }
                        else {
                            current = values[i];
                            if (rIdx === -1) {
                                basePrice = values[0];
                            }
                            else {
                                min = Math.min(rangeValues[0][rIdx], rangeValues[1][rIdx]);
                                max = Math.max(rangeValues[0][rIdx], rangeValues[1][rIdx]);
                                if (current > max) {
                                    basePrice = max;
                                }
                                else if (current < min) {
                                    basePrice = min;
                                }
                                else {
                                    continue;
                                }
                            }
                        }
                        diff = current - basePrice;
                        if (Math.abs(diff) < size) {
                            continue;
                        }
                        diff = _trunc(diff / size);
                        for (var j = 0; j < Math.abs(diff); j++) {
                            var rng = {};
                            if (this.rounding) {
                                basePrice = this._round(basePrice, size);
                            }
                            rangeValues[0].push(basePrice);
                            rng.open = basePrice;
                            basePrice = diff > 0 ? basePrice + size : basePrice - size;
                            rangeValues[1].push(basePrice);
                            rng.close = basePrice;
                            rng.x = x;
                            rng.pointIndex = i;
                            rng.high = Math.max(rng.open, rng.close);
                            rng.low = Math.min(rng.open, rng.close);
                            retvals.push(rng);
                        }
                    }
                    return retvals;
                };
                _RenkoCalculator.prototype._round = function (value, size) {
                    return Math.round(value / size) * size;
                };
                return _RenkoCalculator;
            }(_BaseRangeCalculator));
            exports_1("_RenkoCalculator", _RenkoCalculator);
            "use strict";
            _HeikinAshiPlotter = (function (_super) {
                __extends(_HeikinAshiPlotter, _super);
                function _HeikinAshiPlotter() {
                    var _this = _super.call(this) || this;
                    _this._symFactor = 0.7;
                    _this.clear();
                    return _this;
                }
                _HeikinAshiPlotter.prototype.clear = function () {
                    _super.prototype.clear.call(this);
                    this._haValues = null;
                    this._calculator = null;
                };
                _HeikinAshiPlotter.prototype.plotSeries = function (engine, ax, ay, series, palette, iser, nser) {
                    var _this = this;
                    this._calculate(series);
                    var ser = wjcCore.asType(series, wjcChart.SeriesBase), si = this.chart.series.indexOf(series), xs = series.getValues(1), sw = this._symFactor;
                    var len = this._haValues.length, hasXs = true;
                    if (!xs) {
                        xs = this.dataInfo.getXVals();
                    }
                    else {
                        var delta = this.dataInfo.getDeltaX();
                        if (delta > 0) {
                            sw *= delta;
                        }
                    }
                    if (!xs) {
                        hasXs = false;
                        xs = new Array(len);
                    }
                    else {
                        len = Math.min(len, xs.length);
                    }
                    var swidth = this._DEFAULT_WIDTH, fill = ser._getSymbolFill(si), altFill = ser._getAltSymbolFill(si) || "transparent", stroke = ser._getSymbolStroke(si), altStroke = ser._getAltSymbolStroke(si) || stroke, symSize = sw, dt = series.getDataType(1) || series.chart._xDataType;
                    engine.strokeWidth = swidth;
                    var xmin = ax.actualMin, xmax = ax.actualMax, itemIndex = 0, currentFill, currentStroke, x, dpt, hi, lo, open, close;
                    for (var i = 0; i < len; i++) {
                        x = hasXs ? xs[i] : i;
                        if (wjcChart._DataInfo.isValid(x) && xmin <= x && x <= xmax) {
                            hi = this._haValues[i].high;
                            lo = this._haValues[i].low;
                            open = this._haValues[i].open;
                            close = this._haValues[i].close;
                            currentFill = open < close ? altFill : fill;
                            currentStroke = open < close ? altStroke : stroke;
                            engine.fill = currentFill;
                            engine.stroke = currentStroke;
                            engine.startGroup();
                            dpt = this._getDataPoint(si, i, x, series);
                            if (this.chart.itemFormatter) {
                                var hti = new wjcChart.HitTestInfo(this.chart, new wjcCore.Point(ax.convert(x), ay.convert(hi)), wjcChart.ChartElement.SeriesSymbol);
                                hti._setData(ser, i);
                                hti._setDataPoint(dpt);
                                this.chart.itemFormatter(engine, hti, function () {
                                    _this._drawSymbol(engine, ax, ay, si, i, currentFill, symSize, x, hi, lo, open, close, dpt, dt);
                                });
                            }
                            else {
                                this._drawSymbol(engine, ax, ay, si, i, currentFill, symSize, x, hi, lo, open, close, dpt, dt);
                            }
                            engine.endGroup();
                            series._setPointIndex(i, itemIndex);
                            itemIndex++;
                        }
                    }
                };
                _HeikinAshiPlotter.prototype._drawSymbol = function (engine, ax, ay, si, pi, fill, w, x, hi, lo, open, close, dpt, dt) {
                    var area, y0 = null, y1 = null, x1 = null, x2 = null, half = dt === wjcCore.DataType.Date ? 43200000 : 0.5;
                    x1 = ax.convert(x - half * w);
                    x2 = ax.convert(x + half * w);
                    if (x1 > x2) {
                        var tmp = x1;
                        x1 = x2;
                        x2 = tmp;
                    }
                    x = ax.convert(x);
                    if (wjcChart._DataInfo.isValid(open) && wjcChart._DataInfo.isValid(close)) {
                        open = ay.convert(open);
                        close = ay.convert(close);
                        y0 = Math.min(open, close);
                        y1 = y0 + Math.abs(open - close);
                        engine.drawRect(x1, y0, x2 - x1, y1 - y0);
                        area = new wjcChart._RectArea(new wjcCore.Rect(x1, y0, x2 - x1, y1 - y0));
                        area.tag = dpt;
                        this.hitTester.add(area, si);
                    }
                    if (wjcChart._DataInfo.isValid(hi)) {
                        hi = ay.convert(hi);
                        if (y0 !== null) {
                            engine.drawLine(x, y0, x, hi);
                        }
                    }
                    if (wjcChart._DataInfo.isValid(lo)) {
                        lo = ay.convert(lo);
                        if (y1 !== null) {
                            engine.drawLine(x, y1, x, lo);
                        }
                    }
                };
                _HeikinAshiPlotter.prototype._getDataPoint = function (seriesIndex, pointIndex, x, series) {
                    var dpt = new wjcChart._DataPoint(seriesIndex, pointIndex, x, this._haValues[pointIndex].high), item = series._getItem(pointIndex), bndHigh = series._getBinding(0), bndLow = series._getBinding(1), bndOpen = series._getBinding(2), bndClose = series._getBinding(3), ay = series._getAxisY();
                    dpt["item"] = wjcChart._BasePlotter.cloneStyle(item, []);
                    dpt["item"][bndHigh] = this._haValues[pointIndex].high;
                    dpt["item"][bndLow] = this._haValues[pointIndex].low;
                    dpt["item"][bndOpen] = this._haValues[pointIndex].open;
                    dpt["item"][bndClose] = this._haValues[pointIndex].close;
                    dpt["y"] = this._haValues[pointIndex].high;
                    dpt["yfmt"] = ay._formatValue(this._haValues[pointIndex].high);
                    return dpt;
                };
                _HeikinAshiPlotter.prototype._calculate = function (series) {
                    var highs = series._getBindingValues(0), lows = series._getBindingValues(1), opens = series._getBindingValues(2), closes = series._getBindingValues(3);
                    this._calculator = new _HeikinAshiCalculator(highs, lows, opens, closes);
                    this._haValues = this._calculator.calculate();
                    if (this._haValues === null || wjcCore.isUndefined(this._haValues)) {
                        this._init();
                    }
                };
                _HeikinAshiPlotter.prototype._init = function () {
                    this._haValues = [];
                };
                return _HeikinAshiPlotter;
            }(wjcChart._FinancePlotter));
            exports_1("_HeikinAshiPlotter", _HeikinAshiPlotter);
            "use strict";
            _BaseRangePlotter = (function (_super) {
                __extends(_BaseRangePlotter, _super);
                function _BaseRangePlotter() {
                    var _this = _super.call(this) || this;
                    _this._symFactor = 0.7;
                    _this.clear();
                    return _this;
                }
                _BaseRangePlotter.prototype.clear = function () {
                    _super.prototype.clear.call(this);
                    this._rangeValues = null;
                    this._rangeXLabels = null;
                    this._calculator = null;
                };
                _BaseRangePlotter.prototype.unload = function () {
                    _super.prototype.unload.call(this);
                    var series, ax;
                    for (var i = 0; i < this.chart.series.length; i++) {
                        series = this.chart.series[i];
                        if (!series) {
                            continue;
                        }
                        ax = series._getAxisX();
                        if (ax && ax.itemsSource) {
                            ax.itemsSource = null;
                        }
                    }
                };
                _BaseRangePlotter.prototype.adjustLimits = function (dataInfo, plotRect) {
                    var series, arrTemp, xTemp, xmin = 0, xmax = 0, ymin = 0, ymax = 0, ax, padding = this.chart._xDataType === wjcCore.DataType.Date ? 0.5 : 0;
                    wjcCore.assert(this.chart.series.length <= 1, "Current FinancialChartType only supports a single series");
                    for (var i = 0; i < this.chart.series.length; i++) {
                        series = this.chart.series[i];
                        this._calculate(series);
                        if (this._rangeValues.length <= 0 || this._rangeXLabels.length <= 0) {
                            continue;
                        }
                        arrTemp = this._rangeValues.map(function (value) { return value.open; });
                        arrTemp.push.apply(arrTemp, this._rangeValues.map(function (value) { return value.close; }));
                        xTemp = this._rangeXLabels.map(function (current) { return current.value; });
                        ymin = Math.min.apply(null, arrTemp);
                        ymax = Math.max.apply(null, arrTemp);
                        xmin = Math.min.apply(null, xTemp);
                        xmax = Math.max.apply(null, xTemp);
                        ax = series._getAxisX();
                        ax.itemsSource = this._rangeXLabels;
                    }
                    xmin -= padding;
                    return new wjcCore.Rect(xmin, ymin, xmax - xmin + padding, ymax - ymin);
                };
                _BaseRangePlotter.prototype.plotSeries = function (engine, ax, ay, series, palette, iser, nser) {
                    var _this = this;
                    this._calculate(series);
                    var si = this.chart.series.indexOf(series), len = this._rangeValues.length, xmin = ax.actualMin, xmax = ax.actualMax, strWidth = this._DEFAULT_WIDTH, symSize = this._symFactor, fill = series._getSymbolFill(si), altFill = series._getAltSymbolFill(si) || "transparent", stroke = series._getSymbolStroke(si), altStroke = series._getAltSymbolStroke(si) || stroke;
                    engine.strokeWidth = strWidth;
                    var itemIndex = 0, x, start, end, dpt;
                    for (var i = 0; i < len; i++) {
                        x = i;
                        if (wjcChart._DataInfo.isValid(x) && xmin <= x && x <= xmax) {
                            start = this._rangeValues[i].open;
                            end = this._rangeValues[i].close;
                            engine.fill = start > end ? fill : altFill;
                            engine.stroke = start > end ? stroke : altStroke;
                            dpt = this._getDataPoint(si, i, series, Math.max(start, end));
                            engine.startGroup();
                            if (this.chart.itemFormatter) {
                                var hti = new wjcChart.HitTestInfo(this.chart, new wjcCore.Point(ax.convert(x), ay.convert(end)), wjcChart.ChartElement.SeriesSymbol);
                                hti._setData(series, i);
                                hti._setDataPoint(dpt);
                                this.chart.itemFormatter(engine, hti, function () {
                                    _this._drawSymbol(engine, ax, ay, si, itemIndex, symSize, x, start, end, dpt);
                                });
                            }
                            else {
                                this._drawSymbol(engine, ax, ay, si, itemIndex, symSize, x, start, end, dpt);
                            }
                            engine.endGroup();
                            series._setPointIndex(i, itemIndex);
                            itemIndex++;
                        }
                    }
                };
                _BaseRangePlotter.prototype._drawSymbol = function (engine, ax, ay, si, pi, w, x, start, end, dpt) {
                    var y0, y1, x1, x2, area;
                    x1 = ax.convert(x - 0.5 * w);
                    x2 = ax.convert(x + 0.5 * w);
                    if (x1 > x2) {
                        var tmp = x1;
                        x1 = x2;
                        x2 = tmp;
                    }
                    if (wjcChart._DataInfo.isValid(start) && wjcChart._DataInfo.isValid(end)) {
                        start = ay.convert(start);
                        end = ay.convert(end);
                        y0 = Math.min(start, end);
                        y1 = y0 + Math.abs(start - end);
                        engine.drawRect(x1, y0, x2 - x1, y1 - y0);
                        area = new wjcChart._RectArea(new wjcCore.Rect(x1, y0, x2 - x1, y1 - y0));
                        area.tag = dpt;
                        this.hitTester.add(area, si);
                    }
                };
                _BaseRangePlotter.prototype._getDataPoint = function (seriesIndex, pointIndex, series, dataY) {
                    var x = pointIndex, dpt = new wjcChart._DataPoint(seriesIndex, pointIndex, x, dataY), item = series._getItem(this._rangeValues[pointIndex].pointIndex), bndX = series.bindingX || this.chart.bindingX, bndHigh = series._getBinding(0), bndLow = series._getBinding(1), bndOpen = series._getBinding(2), bndClose = series._getBinding(3), ay = series._getAxisY();
                    dpt["item"] = wjcChart._BasePlotter.cloneStyle(item, []);
                    dpt["item"][bndHigh] = this._rangeValues[pointIndex].high;
                    dpt["item"][bndLow] = this._rangeValues[pointIndex].low;
                    dpt["item"][bndOpen] = this._rangeValues[pointIndex].open;
                    dpt["item"][bndClose] = this._rangeValues[pointIndex].close;
                    dpt["y"] = this._rangeValues[pointIndex].close;
                    dpt["yfmt"] = ay._formatValue(this._rangeValues[pointIndex].close);
                    dpt["x"] = dpt["item"][bndX];
                    dpt["xfmt"] = this._rangeXLabels[pointIndex]._text;
                    return dpt;
                };
                _BaseRangePlotter.prototype._init = function () {
                    this._rangeValues = [];
                    this._rangeXLabels = [];
                };
                _BaseRangePlotter.prototype._calculate = function (series) { };
                _BaseRangePlotter.prototype._generateXLabels = function (series) {
                    var _this = this;
                    var textVal, ax = series._getAxisX(), dataType = series.getDataType(1) || this.chart._xDataType;
                    this._rangeValues.forEach(function (value, index) {
                        var val = value.x;
                        if (dataType === wjcCore.DataType.Date) {
                            textVal = wjcCore.Globalize.format(wjcChart.FlexChart._fromOADate(val), ax.format || "d");
                        }
                        else if (dataType === wjcCore.DataType.Number) {
                            textVal = ax._formatValue(val);
                        }
                        else if ((dataType === null || dataType === wjcCore.DataType.String) && _this.chart._xlabels) {
                            textVal = _this.chart._xlabels[val];
                        }
                        else {
                            textVal = val.toString();
                        }
                        _this._rangeXLabels.push({ value: index, text: textVal, _text: textVal });
                    }, this);
                };
                _BaseRangePlotter.prototype.getOption = function (name, parent) {
                    var options = this.chart.options;
                    if (parent) {
                        options = options ? options[parent] : null;
                    }
                    if (options && !wjcCore.isUndefined(options[name]) && options[name] !== null) {
                        return options[name];
                    }
                    return undefined;
                };
                return _BaseRangePlotter;
            }(wjcChart._BasePlotter));
            exports_1("_BaseRangePlotter", _BaseRangePlotter);
            (function (DataFields) {
                DataFields[DataFields["Close"] = 0] = "Close";
                DataFields[DataFields["High"] = 1] = "High";
                DataFields[DataFields["Low"] = 2] = "Low";
                DataFields[DataFields["Open"] = 3] = "Open";
                DataFields[DataFields["HighLow"] = 4] = "HighLow";
                DataFields[DataFields["HL2"] = 5] = "HL2";
                DataFields[DataFields["HLC3"] = 6] = "HLC3";
                DataFields[DataFields["HLOC4"] = 7] = "HLOC4";
            })(DataFields || (DataFields = {}));
            exports_1("DataFields", DataFields);
            (function (RangeMode) {
                RangeMode[RangeMode["Fixed"] = 0] = "Fixed";
                RangeMode[RangeMode["ATR"] = 1] = "ATR";
                RangeMode[RangeMode["Percentage"] = 2] = "Percentage";
            })(RangeMode || (RangeMode = {}));
            exports_1("RangeMode", RangeMode);
            "use strict";
            _LineBreakPlotter = (function (_super) {
                __extends(_LineBreakPlotter, _super);
                function _LineBreakPlotter() {
                    return _super.call(this) || this;
                }
                _LineBreakPlotter.prototype.clear = function () {
                    _super.prototype.clear.call(this);
                    this._newLineBreaks = null;
                };
                _LineBreakPlotter.prototype._calculate = function (series) {
                    this._init();
                    var closes = series._getBindingValues(3), xs = series.getValues(1) || this.chart._xvals;
                    this._calculator = new _LineBreakCalculator(null, null, null, closes, xs, this._newLineBreaks);
                    this._rangeValues = this._calculator.calculate();
                    if (this._rangeValues === null || wjcCore.isUndefined(this._rangeValues)) {
                        this._rangeValues = [];
                    }
                    this._generateXLabels(series);
                };
                _LineBreakPlotter.prototype._init = function () {
                    _super.prototype._init.call(this);
                    this._newLineBreaks = wjcCore.asInt(this.getNumOption("newLineBreaks", "lineBreak"), true, true) || 3;
                    wjcCore.assert(this._newLineBreaks >= 1, "Value must be greater than 1");
                };
                return _LineBreakPlotter;
            }(_BaseRangePlotter));
            exports_1("_LineBreakPlotter", _LineBreakPlotter);
            "use strict";
            _RenkoPlotter = (function (_super) {
                __extends(_RenkoPlotter, _super);
                function _RenkoPlotter() {
                    return _super.call(this) || this;
                }
                _RenkoPlotter.prototype.clear = function () {
                    _super.prototype.clear.call(this);
                    this._boxSize = null;
                    this._rangeMode = null;
                };
                _RenkoPlotter.prototype._calculate = function (series) {
                    this._init();
                    var highs = series._getBindingValues(0), lows = series._getBindingValues(1), opens = series._getBindingValues(2), closes = series._getBindingValues(3), xs = series.getValues(1) || this.chart._xvals;
                    this._calculator = new _RenkoCalculator(highs, lows, opens, closes, xs, this._boxSize, this._rangeMode, this._fields, this._rounding);
                    this._rangeValues = this._calculator.calculate();
                    if (this._rangeValues === null || wjcCore.isUndefined(this._rangeValues)) {
                        this._rangeValues = [];
                    }
                    this._generateXLabels(series);
                };
                _RenkoPlotter.prototype._init = function () {
                    _super.prototype._init.call(this);
                    this._boxSize = this.getNumOption("boxSize", "renko") || 14;
                    this._rangeMode = this.getOption("rangeMode", "renko") || RangeMode.Fixed;
                    this._rangeMode = wjcCore.asEnum(this._rangeMode, RangeMode, true);
                    wjcCore.assert(this._rangeMode !== RangeMode.Percentage, "RangeMode.Percentage is not supported");
                    this._fields = this.getOption("fields", "renko") || DataFields.Close;
                    this._fields = wjcCore.asEnum(this._fields, DataFields, true);
                    wjcCore.assert(this._fields !== DataFields.HighLow, "DataFields.HighLow is not supported");
                    this._rounding = wjcCore.asBoolean(this.getOption("rounding", "renko"), true);
                };
                _RenkoPlotter.prototype._generateXLabels = function (series) {
                    var _this = this;
                    _super.prototype._generateXLabels.call(this, series);
                    this._rangeXLabels.forEach(function (value, index) {
                        if (index > 0 && _this._rangeXLabels[index - 1]._text === value.text) {
                            value.text = "";
                        }
                    }, this);
                };
                return _RenkoPlotter;
            }(_BaseRangePlotter));
            exports_1("_RenkoPlotter", _RenkoPlotter);
            "use strict";
            _KagiPlotter = (function (_super) {
                __extends(_KagiPlotter, _super);
                function _KagiPlotter() {
                    return _super.call(this) || this;
                }
                _KagiPlotter.prototype._calculate = function (series) {
                    this._init();
                    var highs = series._getBindingValues(0), lows = series._getBindingValues(1), opens = series._getBindingValues(2), closes = series._getBindingValues(3), xs = series.getValues(1) || this.chart._xvals;
                    this._calculator = new _KagiCalculator(highs, lows, opens, closes, xs, this._reversalAmount, this._rangeMode, this._fields);
                    this._rangeValues = this._calculator.calculate();
                    if (this._rangeValues === null || wjcCore.isUndefined(this._rangeValues)) {
                        this._rangeValues = [];
                    }
                    this._generateXLabels(series);
                };
                _KagiPlotter.prototype.plotSeries = function (engine, ax, ay, series, palette, iser, nser) {
                    this._calculate(series);
                    var si = this.chart.series.indexOf(series), len = this._rangeValues.length, xmin = ax.actualMin, xmax = ax.actualMax, strWidth = this._DEFAULT_WIDTH, stroke = series._getSymbolStroke(si), altStroke = series._getAltSymbolStroke(si) || stroke, dx = [], dy = [];
                    engine.stroke = stroke;
                    engine.strokeWidth = strWidth;
                    var itemIndex = 0, x, start, end, min, max, area, dpt;
                    engine.startGroup();
                    for (var i = 0; i < len; i++) {
                        x = i;
                        if (wjcChart._DataInfo.isValid(x) && xmin <= x && x <= xmax) {
                            start = this._rangeValues[i].open;
                            end = this._rangeValues[i].close;
                            if (i === 0) {
                                min = Math.min(start, end);
                                max = Math.max(start, end);
                                engine.strokeWidth = start > end ? strWidth : strWidth * 2;
                                engine.stroke = start > end ? stroke : altStroke;
                                engine.drawLine(ax.convert(x), ay.convert(start), ax.convert(x), ay.convert(end));
                                engine.drawLine(ax.convert(x - 1) - (engine.strokeWidth / 2), ay.convert(start), ax.convert(x) + (engine.strokeWidth / 2), ay.convert(start));
                            }
                            else if (engine.strokeWidth === strWidth) {
                                if (end > start) {
                                    if (end > max) {
                                        engine.drawLine(ax.convert(x), ay.convert(start), ax.convert(x), ay.convert(max));
                                        engine.strokeWidth = strWidth * 2;
                                        engine.stroke = altStroke;
                                        engine.drawLine(ax.convert(x), ay.convert(max), ax.convert(x), ay.convert(end));
                                        min = start;
                                    }
                                    else {
                                        engine.drawLine(ax.convert(x), ay.convert(start), ax.convert(x), ay.convert(end));
                                    }
                                    max = end;
                                }
                                else {
                                    engine.drawLine(ax.convert(x), ay.convert(start), ax.convert(x), ay.convert(end));
                                }
                            }
                            else if ((engine.strokeWidth / 2) === strWidth) {
                                if (end < start) {
                                    if (end < min) {
                                        engine.drawLine(ax.convert(x), ay.convert(start), ax.convert(x), ay.convert(min));
                                        engine.strokeWidth = strWidth;
                                        engine.stroke = stroke;
                                        engine.drawLine(ax.convert(x), ay.convert(min), ax.convert(x), ay.convert(end));
                                        max = start;
                                    }
                                    else {
                                        engine.drawLine(ax.convert(x), ay.convert(start), ax.convert(x), ay.convert(end));
                                    }
                                    min = end;
                                }
                                else {
                                    engine.drawLine(ax.convert(x), ay.convert(start), ax.convert(x), ay.convert(end));
                                }
                            }
                            if (i < (len - 1)) {
                                engine.drawLine(ax.convert(x) - (engine.strokeWidth / 2), ay.convert(end), ax.convert(x + 1) + (engine.strokeWidth / 2), ay.convert(end));
                            }
                            dpt = this._getDataPoint(si, i, series, end);
                            area = new wjcChart._CircleArea(new wjcCore.Point(ax.convert(x), ay.convert(end)), 0.5 * engine.strokeWidth);
                            area.tag = dpt;
                            this.hitTester.add(area, si);
                            series._setPointIndex(i, itemIndex);
                            itemIndex++;
                            dx.push(ax.convert(x));
                            dy.push(ay.convert(start));
                            dx.push(ax.convert(x));
                            dy.push(ay.convert(end));
                        }
                    }
                    engine.endGroup();
                    this.hitTester.add(new wjcChart._LinesArea(dx, dy), si);
                };
                _KagiPlotter.prototype._init = function () {
                    _super.prototype._init.call(this);
                    this._reversalAmount = this.getNumOption("reversalAmount", "kagi") || 14;
                    this._rangeMode = this.getOption("rangeMode", "kagi") || RangeMode.Fixed;
                    this._rangeMode = wjcCore.asEnum(this._rangeMode, RangeMode, true);
                    this._fields = this.getOption("fields", "kagi") || DataFields.Close;
                    this._fields = wjcCore.asEnum(this._fields, DataFields, true);
                };
                _KagiPlotter.prototype.clear = function () {
                    _super.prototype.clear.call(this);
                    this._reversalAmount = null;
                    this._rangeMode = null;
                };
                return _KagiPlotter;
            }(_BaseRangePlotter));
            exports_1("_KagiPlotter", _KagiPlotter);
        }
    };
});
//# sourceMappingURL=wijmo.chart.finance.js.map