System.register(["wijmo/wijmo.chart.analytics", "@angular/core", "@angular/common", "wijmo/wijmo.angular2.directiveBase"], function (exports_1, context_1) {
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
    var wjcChartAnalytics, core_1, core_2, core_3, common_1, wijmo_angular2_directiveBase_1, wjFlexChartTrendLineMeta, WjFlexChartTrendLine, wjFlexChartMovingAverageMeta, WjFlexChartMovingAverage, wjFlexChartYFunctionSeriesMeta, WjFlexChartYFunctionSeries, wjFlexChartParametricFunctionSeriesMeta, WjFlexChartParametricFunctionSeries, wjFlexChartWaterfallMeta, WjFlexChartWaterfall, wjFlexChartBoxWhiskerMeta, WjFlexChartBoxWhisker, wjFlexChartErrorBarMeta, WjFlexChartErrorBar, moduleExports, WjChartAnalyticsModule;
    return {
        setters: [
            function (wjcChartAnalytics_1) {
                wjcChartAnalytics = wjcChartAnalytics_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
                core_2 = core_1_1;
                core_3 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (wijmo_angular2_directiveBase_1_1) {
                wijmo_angular2_directiveBase_1 = wijmo_angular2_directiveBase_1_1;
            }
        ],
        execute: function () {
            exports_1("wjFlexChartTrendLineMeta", wjFlexChartTrendLineMeta = {
                selector: 'wj-flex-chart-trend-line',
                template: "",
                inputs: [
                    'wjProperty',
                    'axisX',
                    'axisY',
                    'binding',
                    'bindingX',
                    'cssClass',
                    'name',
                    'style',
                    'altStyle',
                    'symbolMarker',
                    'symbolSize',
                    'symbolStyle',
                    'visibility',
                    'itemsSource',
                    'sampleCount',
                    'order',
                    'fitType',
                ],
                outputs: [
                    'initialized',
                    'renderingNg: rendering',
                    'renderedNg: rendered',
                    'visibilityChangePC: visibilityChange',
                ],
                providers: []
            });
            /**
             * Angular 2 component for the @see:wijmo.chart.analytics.TrendLine control.
             *
             * The <b>wj-flex-chart-trend-line</b> component must be
             * contained in one of the following components:
             * @see:wijmo/wijmo.angular2.chart.WjFlexChart
             *  or @see:wijmo/wijmo.angular2.chart.finance.WjFinancialChart.
             *
             * Use the <b>wj-flex-chart-trend-line</b> component to add <b>TrendLine</b> controls to your
             * Angular 2 applications. For details about Angular 2 markup syntax, see
             * <a href="static/angular2Markup.html">Angular 2 Markup</a>.
             *
             * The <b>WjFlexChartTrendLine</b> component is derived from the <b>TrendLine</b> control and
             * inherits all its properties, events and methods.
            */
            WjFlexChartTrendLine = (function (_super) {
                __extends(WjFlexChartTrendLine, _super);
                function WjFlexChartTrendLine(elRef, injector, parentCmp) {
                    var _this = _super.call(this) || this;
                    /**
                     * Indicates whether the component has been initialized by Angular.
                     * Changes its value from false to true right before triggering the <b>initialized</b> event.
                     */
                    _this.isInitialized = false;
                    /**
                     * This event is triggered after the component has been initialized by Angular, that is
                     * all bound properties have been assigned and child components (if any) have been initialized.
                     */
                    _this.initialized = new core_1.EventEmitter(true);
                    /**
                     * Gets or sets a name of a property that this component is assigned to.
                     * Default value is 'series'.
                     */
                    _this.wjProperty = 'series';
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>rendering</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>rendering</b> Wijmo event name.
                     */
                    _this.renderingNg = new core_1.EventEmitter(false);
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>rendered</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>rendered</b> Wijmo event name.
                     */
                    _this.renderedNg = new core_1.EventEmitter(false);
                    _this.visibilityChangePC = new core_1.EventEmitter(false);
                    var behavior = _this._wjBehaviour = wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(_this, elRef, injector, parentCmp);
                    _this.created();
                    return _this;
                }
                /**
                 * If you create a custom component inherited from a Wijmo component, you can override this
                 * method and perform necessary initializations that you usually do in a class constructor.
                 * This method is called in the last line of a Wijmo component constructor and allows you
                 * to not declare your custom component's constructor at all, thus preventing you from a necessity
                 * to maintain constructor parameters and keep them in synch with Wijmo component's constructor parameters.
                 */
                WjFlexChartTrendLine.prototype.created = function () {
                };
                WjFlexChartTrendLine.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjFlexChartTrendLine.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjFlexChartTrendLine.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                return WjFlexChartTrendLine;
            }(wjcChartAnalytics.TrendLine));
            WjFlexChartTrendLine.meta = {
                outputs: wjFlexChartTrendLineMeta.outputs,
                changeEvents: {
                    'chart.seriesVisibilityChanged': ['visibility']
                },
                siblingId: 'series',
            };
            WjFlexChartTrendLine.decorators = [
                { type: core_1.Component, args: [{
                            selector: wjFlexChartTrendLineMeta.selector,
                            template: wjFlexChartTrendLineMeta.template,
                            inputs: wjFlexChartTrendLineMeta.inputs,
                            outputs: wjFlexChartTrendLineMeta.outputs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjFlexChartTrendLine; }) }
                            ].concat(wjFlexChartTrendLineMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjFlexChartTrendLine.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
            ]; };
            exports_1("WjFlexChartTrendLine", WjFlexChartTrendLine);
            exports_1("wjFlexChartMovingAverageMeta", wjFlexChartMovingAverageMeta = {
                selector: 'wj-flex-chart-moving-average',
                template: "",
                inputs: [
                    'wjProperty',
                    'axisX',
                    'axisY',
                    'binding',
                    'bindingX',
                    'cssClass',
                    'name',
                    'style',
                    'altStyle',
                    'symbolMarker',
                    'symbolSize',
                    'symbolStyle',
                    'visibility',
                    'itemsSource',
                    'sampleCount',
                    'period',
                    'type',
                ],
                outputs: [
                    'initialized',
                    'renderingNg: rendering',
                    'renderedNg: rendered',
                    'visibilityChangePC: visibilityChange',
                ],
                providers: []
            });
            /**
             * Angular 2 component for the @see:wijmo.chart.analytics.MovingAverage control.
             *
             * The <b>wj-flex-chart-moving-average</b> component must be
             * contained in one of the following components:
             * @see:wijmo/wijmo.angular2.chart.WjFlexChart
             *  or @see:wijmo/wijmo.angular2.chart.finance.WjFinancialChart.
             *
             * Use the <b>wj-flex-chart-moving-average</b> component to add <b>MovingAverage</b> controls to your
             * Angular 2 applications. For details about Angular 2 markup syntax, see
             * <a href="static/angular2Markup.html">Angular 2 Markup</a>.
             *
             * The <b>WjFlexChartMovingAverage</b> component is derived from the <b>MovingAverage</b> control and
             * inherits all its properties, events and methods.
            */
            WjFlexChartMovingAverage = (function (_super) {
                __extends(WjFlexChartMovingAverage, _super);
                function WjFlexChartMovingAverage(elRef, injector, parentCmp) {
                    var _this = _super.call(this) || this;
                    /**
                     * Indicates whether the component has been initialized by Angular.
                     * Changes its value from false to true right before triggering the <b>initialized</b> event.
                     */
                    _this.isInitialized = false;
                    /**
                     * This event is triggered after the component has been initialized by Angular, that is
                     * all bound properties have been assigned and child components (if any) have been initialized.
                     */
                    _this.initialized = new core_1.EventEmitter(true);
                    /**
                     * Gets or sets a name of a property that this component is assigned to.
                     * Default value is 'series'.
                     */
                    _this.wjProperty = 'series';
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>rendering</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>rendering</b> Wijmo event name.
                     */
                    _this.renderingNg = new core_1.EventEmitter(false);
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>rendered</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>rendered</b> Wijmo event name.
                     */
                    _this.renderedNg = new core_1.EventEmitter(false);
                    _this.visibilityChangePC = new core_1.EventEmitter(false);
                    var behavior = _this._wjBehaviour = wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(_this, elRef, injector, parentCmp);
                    _this.created();
                    return _this;
                }
                /**
                 * If you create a custom component inherited from a Wijmo component, you can override this
                 * method and perform necessary initializations that you usually do in a class constructor.
                 * This method is called in the last line of a Wijmo component constructor and allows you
                 * to not declare your custom component's constructor at all, thus preventing you from a necessity
                 * to maintain constructor parameters and keep them in synch with Wijmo component's constructor parameters.
                 */
                WjFlexChartMovingAverage.prototype.created = function () {
                };
                WjFlexChartMovingAverage.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjFlexChartMovingAverage.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjFlexChartMovingAverage.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                return WjFlexChartMovingAverage;
            }(wjcChartAnalytics.MovingAverage));
            WjFlexChartMovingAverage.meta = {
                outputs: wjFlexChartMovingAverageMeta.outputs,
                changeEvents: {
                    'chart.seriesVisibilityChanged': ['visibility']
                },
                siblingId: 'series',
            };
            WjFlexChartMovingAverage.decorators = [
                { type: core_1.Component, args: [{
                            selector: wjFlexChartMovingAverageMeta.selector,
                            template: wjFlexChartMovingAverageMeta.template,
                            inputs: wjFlexChartMovingAverageMeta.inputs,
                            outputs: wjFlexChartMovingAverageMeta.outputs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjFlexChartMovingAverage; }) }
                            ].concat(wjFlexChartMovingAverageMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjFlexChartMovingAverage.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
            ]; };
            exports_1("WjFlexChartMovingAverage", WjFlexChartMovingAverage);
            exports_1("wjFlexChartYFunctionSeriesMeta", wjFlexChartYFunctionSeriesMeta = {
                selector: 'wj-flex-chart-y-function-series',
                template: "",
                inputs: [
                    'wjProperty',
                    'axisX',
                    'axisY',
                    'binding',
                    'bindingX',
                    'cssClass',
                    'name',
                    'style',
                    'altStyle',
                    'symbolMarker',
                    'symbolSize',
                    'symbolStyle',
                    'visibility',
                    'itemsSource',
                    'sampleCount',
                    'min',
                    'max',
                    'func',
                ],
                outputs: [
                    'initialized',
                    'renderingNg: rendering',
                    'renderedNg: rendered',
                    'visibilityChangePC: visibilityChange',
                ],
                providers: []
            });
            /**
             * Angular 2 component for the @see:wijmo.chart.analytics.YFunctionSeries control.
             *
             * The <b>wj-flex-chart-y-function-series</b> component must be
             * contained in one of the following components:
             * @see:wijmo/wijmo.angular2.chart.WjFlexChart
             *  or @see:wijmo/wijmo.angular2.chart.finance.WjFinancialChart.
             *
             * Use the <b>wj-flex-chart-y-function-series</b> component to add <b>YFunctionSeries</b> controls to your
             * Angular 2 applications. For details about Angular 2 markup syntax, see
             * <a href="static/angular2Markup.html">Angular 2 Markup</a>.
             *
             * The <b>WjFlexChartYFunctionSeries</b> component is derived from the <b>YFunctionSeries</b> control and
             * inherits all its properties, events and methods.
            */
            WjFlexChartYFunctionSeries = (function (_super) {
                __extends(WjFlexChartYFunctionSeries, _super);
                function WjFlexChartYFunctionSeries(elRef, injector, parentCmp) {
                    var _this = _super.call(this) || this;
                    /**
                     * Indicates whether the component has been initialized by Angular.
                     * Changes its value from false to true right before triggering the <b>initialized</b> event.
                     */
                    _this.isInitialized = false;
                    /**
                     * This event is triggered after the component has been initialized by Angular, that is
                     * all bound properties have been assigned and child components (if any) have been initialized.
                     */
                    _this.initialized = new core_1.EventEmitter(true);
                    /**
                     * Gets or sets a name of a property that this component is assigned to.
                     * Default value is 'series'.
                     */
                    _this.wjProperty = 'series';
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>rendering</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>rendering</b> Wijmo event name.
                     */
                    _this.renderingNg = new core_1.EventEmitter(false);
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>rendered</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>rendered</b> Wijmo event name.
                     */
                    _this.renderedNg = new core_1.EventEmitter(false);
                    _this.visibilityChangePC = new core_1.EventEmitter(false);
                    var behavior = _this._wjBehaviour = wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(_this, elRef, injector, parentCmp);
                    _this.created();
                    return _this;
                }
                /**
                 * If you create a custom component inherited from a Wijmo component, you can override this
                 * method and perform necessary initializations that you usually do in a class constructor.
                 * This method is called in the last line of a Wijmo component constructor and allows you
                 * to not declare your custom component's constructor at all, thus preventing you from a necessity
                 * to maintain constructor parameters and keep them in synch with Wijmo component's constructor parameters.
                 */
                WjFlexChartYFunctionSeries.prototype.created = function () {
                };
                WjFlexChartYFunctionSeries.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjFlexChartYFunctionSeries.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjFlexChartYFunctionSeries.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                return WjFlexChartYFunctionSeries;
            }(wjcChartAnalytics.YFunctionSeries));
            WjFlexChartYFunctionSeries.meta = {
                outputs: wjFlexChartYFunctionSeriesMeta.outputs,
                changeEvents: {
                    'chart.seriesVisibilityChanged': ['visibility']
                },
                siblingId: 'series',
            };
            WjFlexChartYFunctionSeries.decorators = [
                { type: core_1.Component, args: [{
                            selector: wjFlexChartYFunctionSeriesMeta.selector,
                            template: wjFlexChartYFunctionSeriesMeta.template,
                            inputs: wjFlexChartYFunctionSeriesMeta.inputs,
                            outputs: wjFlexChartYFunctionSeriesMeta.outputs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjFlexChartYFunctionSeries; }) }
                            ].concat(wjFlexChartYFunctionSeriesMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjFlexChartYFunctionSeries.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
            ]; };
            exports_1("WjFlexChartYFunctionSeries", WjFlexChartYFunctionSeries);
            exports_1("wjFlexChartParametricFunctionSeriesMeta", wjFlexChartParametricFunctionSeriesMeta = {
                selector: 'wj-flex-chart-parametric-function-series',
                template: "",
                inputs: [
                    'wjProperty',
                    'axisX',
                    'axisY',
                    'binding',
                    'bindingX',
                    'cssClass',
                    'name',
                    'style',
                    'altStyle',
                    'symbolMarker',
                    'symbolSize',
                    'symbolStyle',
                    'visibility',
                    'itemsSource',
                    'sampleCount',
                    'min',
                    'max',
                    'func',
                    'xFunc',
                    'yFunc',
                ],
                outputs: [
                    'initialized',
                    'renderingNg: rendering',
                    'renderedNg: rendered',
                    'visibilityChangePC: visibilityChange',
                ],
                providers: []
            });
            /**
             * Angular 2 component for the @see:wijmo.chart.analytics.ParametricFunctionSeries control.
             *
             * The <b>wj-flex-chart-parametric-function-series</b> component must be
             * contained in one of the following components:
             * @see:wijmo/wijmo.angular2.chart.WjFlexChart
             *  or @see:wijmo/wijmo.angular2.chart.finance.WjFinancialChart.
             *
             * Use the <b>wj-flex-chart-parametric-function-series</b> component to add <b>ParametricFunctionSeries</b> controls to your
             * Angular 2 applications. For details about Angular 2 markup syntax, see
             * <a href="static/angular2Markup.html">Angular 2 Markup</a>.
             *
             * The <b>WjFlexChartParametricFunctionSeries</b> component is derived from the <b>ParametricFunctionSeries</b> control and
             * inherits all its properties, events and methods.
            */
            WjFlexChartParametricFunctionSeries = (function (_super) {
                __extends(WjFlexChartParametricFunctionSeries, _super);
                function WjFlexChartParametricFunctionSeries(elRef, injector, parentCmp) {
                    var _this = _super.call(this) || this;
                    /**
                     * Indicates whether the component has been initialized by Angular.
                     * Changes its value from false to true right before triggering the <b>initialized</b> event.
                     */
                    _this.isInitialized = false;
                    /**
                     * This event is triggered after the component has been initialized by Angular, that is
                     * all bound properties have been assigned and child components (if any) have been initialized.
                     */
                    _this.initialized = new core_1.EventEmitter(true);
                    /**
                     * Gets or sets a name of a property that this component is assigned to.
                     * Default value is 'series'.
                     */
                    _this.wjProperty = 'series';
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>rendering</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>rendering</b> Wijmo event name.
                     */
                    _this.renderingNg = new core_1.EventEmitter(false);
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>rendered</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>rendered</b> Wijmo event name.
                     */
                    _this.renderedNg = new core_1.EventEmitter(false);
                    _this.visibilityChangePC = new core_1.EventEmitter(false);
                    var behavior = _this._wjBehaviour = wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(_this, elRef, injector, parentCmp);
                    _this.created();
                    return _this;
                }
                /**
                 * If you create a custom component inherited from a Wijmo component, you can override this
                 * method and perform necessary initializations that you usually do in a class constructor.
                 * This method is called in the last line of a Wijmo component constructor and allows you
                 * to not declare your custom component's constructor at all, thus preventing you from a necessity
                 * to maintain constructor parameters and keep them in synch with Wijmo component's constructor parameters.
                 */
                WjFlexChartParametricFunctionSeries.prototype.created = function () {
                };
                WjFlexChartParametricFunctionSeries.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjFlexChartParametricFunctionSeries.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjFlexChartParametricFunctionSeries.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                return WjFlexChartParametricFunctionSeries;
            }(wjcChartAnalytics.ParametricFunctionSeries));
            WjFlexChartParametricFunctionSeries.meta = {
                outputs: wjFlexChartParametricFunctionSeriesMeta.outputs,
                changeEvents: {
                    'chart.seriesVisibilityChanged': ['visibility']
                },
                siblingId: 'series',
            };
            WjFlexChartParametricFunctionSeries.decorators = [
                { type: core_1.Component, args: [{
                            selector: wjFlexChartParametricFunctionSeriesMeta.selector,
                            template: wjFlexChartParametricFunctionSeriesMeta.template,
                            inputs: wjFlexChartParametricFunctionSeriesMeta.inputs,
                            outputs: wjFlexChartParametricFunctionSeriesMeta.outputs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjFlexChartParametricFunctionSeries; }) }
                            ].concat(wjFlexChartParametricFunctionSeriesMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjFlexChartParametricFunctionSeries.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
            ]; };
            exports_1("WjFlexChartParametricFunctionSeries", WjFlexChartParametricFunctionSeries);
            exports_1("wjFlexChartWaterfallMeta", wjFlexChartWaterfallMeta = {
                selector: 'wj-flex-chart-waterfall',
                template: "",
                inputs: [
                    'wjProperty',
                    'axisX',
                    'axisY',
                    'binding',
                    'bindingX',
                    'cssClass',
                    'name',
                    'style',
                    'altStyle',
                    'symbolMarker',
                    'symbolSize',
                    'symbolStyle',
                    'visibility',
                    'itemsSource',
                    'relativeData',
                    'start',
                    'startLabel',
                    'showTotal',
                    'totalLabel',
                    'showIntermediateTotal',
                    'intermediateTotalPositions',
                    'intermediateTotalLabels',
                    'connectorLines',
                    'styles',
                ],
                outputs: [
                    'initialized',
                    'renderingNg: rendering',
                    'renderedNg: rendered',
                    'visibilityChangePC: visibilityChange',
                ],
                providers: []
            });
            /**
             * Angular 2 component for the @see:wijmo.chart.analytics.Waterfall control.
             *
             * The <b>wj-flex-chart-waterfall</b> component must be
             * contained in one of the following components:
             * @see:wijmo/wijmo.angular2.chart.WjFlexChart
             *  or @see:wijmo/wijmo.angular2.chart.finance.WjFinancialChart.
             *
             * Use the <b>wj-flex-chart-waterfall</b> component to add <b>Waterfall</b> controls to your
             * Angular 2 applications. For details about Angular 2 markup syntax, see
             * <a href="static/angular2Markup.html">Angular 2 Markup</a>.
             *
             * The <b>WjFlexChartWaterfall</b> component is derived from the <b>Waterfall</b> control and
             * inherits all its properties, events and methods.
            */
            WjFlexChartWaterfall = (function (_super) {
                __extends(WjFlexChartWaterfall, _super);
                function WjFlexChartWaterfall(elRef, injector, parentCmp) {
                    var _this = _super.call(this) || this;
                    /**
                     * Indicates whether the component has been initialized by Angular.
                     * Changes its value from false to true right before triggering the <b>initialized</b> event.
                     */
                    _this.isInitialized = false;
                    /**
                     * This event is triggered after the component has been initialized by Angular, that is
                     * all bound properties have been assigned and child components (if any) have been initialized.
                     */
                    _this.initialized = new core_1.EventEmitter(true);
                    /**
                     * Gets or sets a name of a property that this component is assigned to.
                     * Default value is 'series'.
                     */
                    _this.wjProperty = 'series';
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>rendering</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>rendering</b> Wijmo event name.
                     */
                    _this.renderingNg = new core_1.EventEmitter(false);
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>rendered</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>rendered</b> Wijmo event name.
                     */
                    _this.renderedNg = new core_1.EventEmitter(false);
                    _this.visibilityChangePC = new core_1.EventEmitter(false);
                    var behavior = _this._wjBehaviour = wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(_this, elRef, injector, parentCmp);
                    _this.created();
                    return _this;
                }
                /**
                 * If you create a custom component inherited from a Wijmo component, you can override this
                 * method and perform necessary initializations that you usually do in a class constructor.
                 * This method is called in the last line of a Wijmo component constructor and allows you
                 * to not declare your custom component's constructor at all, thus preventing you from a necessity
                 * to maintain constructor parameters and keep them in synch with Wijmo component's constructor parameters.
                 */
                WjFlexChartWaterfall.prototype.created = function () {
                };
                WjFlexChartWaterfall.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjFlexChartWaterfall.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjFlexChartWaterfall.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                return WjFlexChartWaterfall;
            }(wjcChartAnalytics.Waterfall));
            WjFlexChartWaterfall.meta = {
                outputs: wjFlexChartWaterfallMeta.outputs,
                changeEvents: {
                    'chart.seriesVisibilityChanged': ['visibility']
                },
                siblingId: 'series',
            };
            WjFlexChartWaterfall.decorators = [
                { type: core_1.Component, args: [{
                            selector: wjFlexChartWaterfallMeta.selector,
                            template: wjFlexChartWaterfallMeta.template,
                            inputs: wjFlexChartWaterfallMeta.inputs,
                            outputs: wjFlexChartWaterfallMeta.outputs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjFlexChartWaterfall; }) }
                            ].concat(wjFlexChartWaterfallMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjFlexChartWaterfall.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
            ]; };
            exports_1("WjFlexChartWaterfall", WjFlexChartWaterfall);
            exports_1("wjFlexChartBoxWhiskerMeta", wjFlexChartBoxWhiskerMeta = {
                selector: 'wj-flex-chart-box-whisker',
                template: "",
                inputs: [
                    'wjProperty',
                    'axisX',
                    'axisY',
                    'binding',
                    'bindingX',
                    'cssClass',
                    'name',
                    'style',
                    'altStyle',
                    'symbolMarker',
                    'symbolSize',
                    'symbolStyle',
                    'visibility',
                    'itemsSource',
                    'quartileCalculation',
                    'groupWidth',
                    'gapWidth',
                    'showMeanLine',
                    'meanLineStyle',
                    'showMeanMarker',
                    'meanMarkerStyle',
                    'showInnerPoints',
                    'showOutliers',
                ],
                outputs: [
                    'initialized',
                    'renderingNg: rendering',
                    'renderedNg: rendered',
                    'visibilityChangePC: visibilityChange',
                ],
                providers: []
            });
            /**
             * Angular 2 component for the @see:wijmo.chart.analytics.BoxWhisker control.
             *
             * The <b>wj-flex-chart-box-whisker</b> component must be
             * contained in one of the following components:
             * @see:wijmo/wijmo.angular2.chart.WjFlexChart
             *  or @see:wijmo/wijmo.angular2.chart.finance.WjFinancialChart.
             *
             * Use the <b>wj-flex-chart-box-whisker</b> component to add <b>BoxWhisker</b> controls to your
             * Angular 2 applications. For details about Angular 2 markup syntax, see
             * <a href="static/angular2Markup.html">Angular 2 Markup</a>.
             *
             * The <b>WjFlexChartBoxWhisker</b> component is derived from the <b>BoxWhisker</b> control and
             * inherits all its properties, events and methods.
            */
            WjFlexChartBoxWhisker = (function (_super) {
                __extends(WjFlexChartBoxWhisker, _super);
                function WjFlexChartBoxWhisker(elRef, injector, parentCmp) {
                    var _this = _super.call(this) || this;
                    /**
                     * Indicates whether the component has been initialized by Angular.
                     * Changes its value from false to true right before triggering the <b>initialized</b> event.
                     */
                    _this.isInitialized = false;
                    /**
                     * This event is triggered after the component has been initialized by Angular, that is
                     * all bound properties have been assigned and child components (if any) have been initialized.
                     */
                    _this.initialized = new core_1.EventEmitter(true);
                    /**
                     * Gets or sets a name of a property that this component is assigned to.
                     * Default value is 'series'.
                     */
                    _this.wjProperty = 'series';
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>rendering</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>rendering</b> Wijmo event name.
                     */
                    _this.renderingNg = new core_1.EventEmitter(false);
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>rendered</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>rendered</b> Wijmo event name.
                     */
                    _this.renderedNg = new core_1.EventEmitter(false);
                    _this.visibilityChangePC = new core_1.EventEmitter(false);
                    var behavior = _this._wjBehaviour = wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(_this, elRef, injector, parentCmp);
                    _this.created();
                    return _this;
                }
                /**
                 * If you create a custom component inherited from a Wijmo component, you can override this
                 * method and perform necessary initializations that you usually do in a class constructor.
                 * This method is called in the last line of a Wijmo component constructor and allows you
                 * to not declare your custom component's constructor at all, thus preventing you from a necessity
                 * to maintain constructor parameters and keep them in synch with Wijmo component's constructor parameters.
                 */
                WjFlexChartBoxWhisker.prototype.created = function () {
                };
                WjFlexChartBoxWhisker.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjFlexChartBoxWhisker.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjFlexChartBoxWhisker.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                return WjFlexChartBoxWhisker;
            }(wjcChartAnalytics.BoxWhisker));
            WjFlexChartBoxWhisker.meta = {
                outputs: wjFlexChartBoxWhiskerMeta.outputs,
                changeEvents: {
                    'chart.seriesVisibilityChanged': ['visibility']
                },
                siblingId: 'series',
            };
            WjFlexChartBoxWhisker.decorators = [
                { type: core_1.Component, args: [{
                            selector: wjFlexChartBoxWhiskerMeta.selector,
                            template: wjFlexChartBoxWhiskerMeta.template,
                            inputs: wjFlexChartBoxWhiskerMeta.inputs,
                            outputs: wjFlexChartBoxWhiskerMeta.outputs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjFlexChartBoxWhisker; }) }
                            ].concat(wjFlexChartBoxWhiskerMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjFlexChartBoxWhisker.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
            ]; };
            exports_1("WjFlexChartBoxWhisker", WjFlexChartBoxWhisker);
            exports_1("wjFlexChartErrorBarMeta", wjFlexChartErrorBarMeta = {
                selector: 'wj-flex-chart-error-bar',
                template: "",
                inputs: [
                    'wjProperty',
                    'axisX',
                    'axisY',
                    'binding',
                    'bindingX',
                    'cssClass',
                    'name',
                    'style',
                    'altStyle',
                    'symbolMarker',
                    'symbolSize',
                    'symbolStyle',
                    'visibility',
                    'itemsSource',
                    'chartType',
                    'errorBarStyle',
                    'value',
                    'errorAmount',
                    'endStyle',
                    'direction',
                ],
                outputs: [
                    'initialized',
                    'renderingNg: rendering',
                    'renderedNg: rendered',
                    'visibilityChangePC: visibilityChange',
                ],
                providers: []
            });
            /**
             * Angular 2 component for the @see:wijmo.chart.analytics.ErrorBar control.
             *
             * The <b>wj-flex-chart-error-bar</b> component must be
             * contained in a @see:wijmo/wijmo.angular2.chart.WjFlexChart component.
             *
             * Use the <b>wj-flex-chart-error-bar</b> component to add <b>ErrorBar</b> controls to your
             * Angular 2 applications. For details about Angular 2 markup syntax, see
             * <a href="static/angular2Markup.html">Angular 2 Markup</a>.
             *
             * The <b>WjFlexChartErrorBar</b> component is derived from the <b>ErrorBar</b> control and
             * inherits all its properties, events and methods.
            */
            WjFlexChartErrorBar = (function (_super) {
                __extends(WjFlexChartErrorBar, _super);
                function WjFlexChartErrorBar(elRef, injector, parentCmp) {
                    var _this = _super.call(this) || this;
                    /**
                     * Indicates whether the component has been initialized by Angular.
                     * Changes its value from false to true right before triggering the <b>initialized</b> event.
                     */
                    _this.isInitialized = false;
                    /**
                     * This event is triggered after the component has been initialized by Angular, that is
                     * all bound properties have been assigned and child components (if any) have been initialized.
                     */
                    _this.initialized = new core_1.EventEmitter(true);
                    /**
                     * Gets or sets a name of a property that this component is assigned to.
                     * Default value is 'series'.
                     */
                    _this.wjProperty = 'series';
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>rendering</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>rendering</b> Wijmo event name.
                     */
                    _this.renderingNg = new core_1.EventEmitter(false);
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>rendered</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>rendered</b> Wijmo event name.
                     */
                    _this.renderedNg = new core_1.EventEmitter(false);
                    _this.visibilityChangePC = new core_1.EventEmitter(false);
                    var behavior = _this._wjBehaviour = wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(_this, elRef, injector, parentCmp);
                    _this.created();
                    return _this;
                }
                /**
                 * If you create a custom component inherited from a Wijmo component, you can override this
                 * method and perform necessary initializations that you usually do in a class constructor.
                 * This method is called in the last line of a Wijmo component constructor and allows you
                 * to not declare your custom component's constructor at all, thus preventing you from a necessity
                 * to maintain constructor parameters and keep them in synch with Wijmo component's constructor parameters.
                 */
                WjFlexChartErrorBar.prototype.created = function () {
                };
                WjFlexChartErrorBar.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjFlexChartErrorBar.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjFlexChartErrorBar.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                return WjFlexChartErrorBar;
            }(wjcChartAnalytics.ErrorBar));
            WjFlexChartErrorBar.meta = {
                outputs: wjFlexChartErrorBarMeta.outputs,
                changeEvents: {
                    'chart.seriesVisibilityChanged': ['visibility']
                },
                siblingId: 'series',
            };
            WjFlexChartErrorBar.decorators = [
                { type: core_1.Component, args: [{
                            selector: wjFlexChartErrorBarMeta.selector,
                            template: wjFlexChartErrorBarMeta.template,
                            inputs: wjFlexChartErrorBarMeta.inputs,
                            outputs: wjFlexChartErrorBarMeta.outputs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjFlexChartErrorBar; }) }
                            ].concat(wjFlexChartErrorBarMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjFlexChartErrorBar.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
            ]; };
            exports_1("WjFlexChartErrorBar", WjFlexChartErrorBar);
            moduleExports = [
                WjFlexChartTrendLine,
                WjFlexChartMovingAverage,
                WjFlexChartYFunctionSeries,
                WjFlexChartParametricFunctionSeries,
                WjFlexChartWaterfall,
                WjFlexChartBoxWhisker,
                WjFlexChartErrorBar
            ];
            WjChartAnalyticsModule = (function () {
                function WjChartAnalyticsModule() {
                }
                return WjChartAnalyticsModule;
            }());
            WjChartAnalyticsModule.decorators = [
                { type: core_1.NgModule, args: [{
                            imports: [wijmo_angular2_directiveBase_1.WjDirectiveBaseModule, common_1.CommonModule],
                            declarations: moduleExports.slice(),
                            exports: moduleExports.slice(),
                        },] },
            ];
            /** @nocollapse */
            WjChartAnalyticsModule.ctorParameters = function () { return []; };
            exports_1("WjChartAnalyticsModule", WjChartAnalyticsModule);
        }
    };
});
//# sourceMappingURL=wijmo.angular2.chart.analytics.js.map