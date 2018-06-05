System.register(["wijmo/wijmo.chart", "@angular/core", "@angular/common", "@angular/forms", "wijmo/wijmo.angular2.directiveBase"], function (exports_1, context_1) {
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
    var wjcChart, core_1, core_2, core_3, common_1, forms_1, wijmo_angular2_directiveBase_1, wjFlexChartMeta, WjFlexChart, wjFlexPieMeta, WjFlexPie, wjFlexChartAxisMeta, WjFlexChartAxis, wjFlexChartLegendMeta, WjFlexChartLegend, wjFlexChartDataLabelMeta, WjFlexChartDataLabel, wjFlexPieDataLabelMeta, WjFlexPieDataLabel, wjFlexChartSeriesMeta, WjFlexChartSeries, wjFlexChartLineMarkerMeta, WjFlexChartLineMarker, wjFlexChartDataPointMeta, WjFlexChartDataPoint, wjFlexChartPlotAreaMeta, WjFlexChartPlotArea, moduleExports, WjChartModule;
    return {
        setters: [
            function (wjcChart_1) {
                wjcChart = wjcChart_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
                core_2 = core_1_1;
                core_3 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (forms_1_1) {
                forms_1 = forms_1_1;
            },
            function (wijmo_angular2_directiveBase_1_1) {
                wijmo_angular2_directiveBase_1 = wijmo_angular2_directiveBase_1_1;
            }
        ],
        execute: function () {
            exports_1("wjFlexChartMeta", wjFlexChartMeta = {
                selector: 'wj-flex-chart',
                template: "<div><ng-content></ng-content></div>",
                inputs: [
                    'wjModelProperty',
                    'isDisabled',
                    'binding',
                    'footer',
                    'header',
                    'selectionMode',
                    'palette',
                    'plotMargin',
                    'footerStyle',
                    'headerStyle',
                    'tooltipContent',
                    'itemsSource',
                    'bindingX',
                    'interpolateNulls',
                    'legendToggle',
                    'symbolSize',
                    'options',
                    'selection',
                    'itemFormatter',
                    'labelContent',
                    'chartType',
                    'rotated',
                    'stacking',
                ],
                outputs: [
                    'initialized',
                    'gotFocusNg: gotFocus',
                    'lostFocusNg: lostFocus',
                    'renderingNg: rendering',
                    'renderedNg: rendered',
                    'selectionChangedNg: selectionChanged',
                    'selectionChangePC: selectionChange',
                    'seriesVisibilityChangedNg: seriesVisibilityChanged',
                ],
                providers: [
                    {
                        provide: forms_1.NG_VALUE_ACCESSOR, useFactory: wijmo_angular2_directiveBase_1.WjValueAccessorFactory, multi: true,
                        deps: ['WjComponent']
                    }
                ]
            });
            /**
             * Angular 2 component for the @see:wijmo.chart.FlexChart control.
             *
             * Use the <b>wj-flex-chart</b> component to add <b>FlexChart</b> controls to your
             * Angular 2 applications. For details about Angular 2 markup syntax, see
             * <a href="static/angular2Markup.html">Angular 2 Markup</a>.
             *
             * The <b>WjFlexChart</b> component is derived from the <b>FlexChart</b> control and
             * inherits all its properties, events and methods.
             *
             * The <b>wj-flex-chart</b> component may contain the following child components:
             * @see:wijmo/wijmo.angular2.chart.analytics.WjFlexChartTrendLine
             * , @see:wijmo/wijmo.angular2.chart.analytics.WjFlexChartMovingAverage
             * , @see:wijmo/wijmo.angular2.chart.analytics.WjFlexChartYFunctionSeries
             * , @see:wijmo/wijmo.angular2.chart.analytics.WjFlexChartParametricFunctionSeries
             * , @see:wijmo/wijmo.angular2.chart.analytics.WjFlexChartWaterfall
             * , @see:wijmo/wijmo.angular2.chart.analytics.WjFlexChartBoxWhisker
             * , @see:wijmo/wijmo.angular2.chart.analytics.WjFlexChartErrorBar
             * , @see:wijmo/wijmo.angular2.chart.animation.WjFlexChartAnimation
             * , @see:wijmo/wijmo.angular2.chart.annotation.WjFlexChartAnnotationLayer
             * , @see:wijmo/wijmo.angular2.chart.interaction.WjFlexChartRangeSelector
             * , @see:wijmo/wijmo.angular2.chart.interaction.WjFlexChartGestures
             * , @see:wijmo/wijmo.angular2.chart.WjFlexChartAxis
             * , @see:wijmo/wijmo.angular2.chart.WjFlexChartLegend
             * , @see:wijmo/wijmo.angular2.chart.WjFlexChartDataLabel
             * , @see:wijmo/wijmo.angular2.chart.WjFlexChartSeries
             * , @see:wijmo/wijmo.angular2.chart.WjFlexChartLineMarker
             *  and @see:wijmo/wijmo.angular2.chart.WjFlexChartPlotArea.
            */
            WjFlexChart = (function (_super) {
                __extends(WjFlexChart, _super);
                function WjFlexChart(elRef, injector, parentCmp) {
                    var _this = _super.call(this, wijmo_angular2_directiveBase_1.WjDirectiveBehavior.getHostElement(elRef)) || this;
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
                     * Angular (EventEmitter) version of the Wijmo <b>gotFocus</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>gotFocus</b> Wijmo event name.
                     */
                    _this.gotFocusNg = new core_1.EventEmitter(false);
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>lostFocus</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>lostFocus</b> Wijmo event name.
                     */
                    _this.lostFocusNg = new core_1.EventEmitter(false);
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
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>selectionChanged</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>selectionChanged</b> Wijmo event name.
                     */
                    _this.selectionChangedNg = new core_1.EventEmitter(false);
                    _this.selectionChangePC = new core_1.EventEmitter(false);
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>seriesVisibilityChanged</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>seriesVisibilityChanged</b> Wijmo event name.
                     */
                    _this.seriesVisibilityChangedNg = new core_1.EventEmitter(false);
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
                WjFlexChart.prototype.created = function () {
                };
                WjFlexChart.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjFlexChart.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjFlexChart.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                Object.defineProperty(WjFlexChart.prototype, "tooltipContent", {
                    get: function () {
                        return this.tooltip.content;
                    },
                    set: function (value) {
                        this.tooltip.content = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(WjFlexChart.prototype, "labelContent", {
                    get: function () {
                        return this.dataLabel.content;
                    },
                    set: function (value) {
                        this.dataLabel.content = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                return WjFlexChart;
            }(wjcChart.FlexChart));
            WjFlexChart.meta = {
                outputs: wjFlexChartMeta.outputs,
                changeEvents: {
                    'selectionChanged': ['selection']
                },
            };
            WjFlexChart.decorators = [
                { type: core_1.Component, args: [{
                            selector: wjFlexChartMeta.selector,
                            template: wjFlexChartMeta.template,
                            inputs: wjFlexChartMeta.inputs,
                            outputs: wjFlexChartMeta.outputs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjFlexChart; }) }
                            ].concat(wjFlexChartMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjFlexChart.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
            ]; };
            exports_1("WjFlexChart", WjFlexChart);
            exports_1("wjFlexPieMeta", wjFlexPieMeta = {
                selector: 'wj-flex-pie',
                template: "<div><ng-content></ng-content></div>",
                inputs: [
                    'wjModelProperty',
                    'isDisabled',
                    'binding',
                    'footer',
                    'header',
                    'selectionMode',
                    'palette',
                    'plotMargin',
                    'footerStyle',
                    'headerStyle',
                    'tooltipContent',
                    'itemsSource',
                    'bindingName',
                    'innerRadius',
                    'isAnimated',
                    'offset',
                    'reversed',
                    'startAngle',
                    'selectedItemPosition',
                    'selectedItemOffset',
                    'itemFormatter',
                    'labelContent',
                ],
                outputs: [
                    'initialized',
                    'gotFocusNg: gotFocus',
                    'lostFocusNg: lostFocus',
                    'renderingNg: rendering',
                    'renderedNg: rendered',
                    'selectionChangedNg: selectionChanged',
                ],
                providers: [
                    {
                        provide: forms_1.NG_VALUE_ACCESSOR, useFactory: wijmo_angular2_directiveBase_1.WjValueAccessorFactory, multi: true,
                        deps: ['WjComponent']
                    }
                ]
            });
            /**
             * Angular 2 component for the @see:wijmo.chart.FlexPie control.
             *
             * Use the <b>wj-flex-pie</b> component to add <b>FlexPie</b> controls to your
             * Angular 2 applications. For details about Angular 2 markup syntax, see
             * <a href="static/angular2Markup.html">Angular 2 Markup</a>.
             *
             * The <b>WjFlexPie</b> component is derived from the <b>FlexPie</b> control and
             * inherits all its properties, events and methods.
             *
             * The <b>wj-flex-pie</b> component may contain the following child components:
             * @see:wijmo/wijmo.angular2.chart.animation.WjFlexChartAnimation
             * , @see:wijmo/wijmo.angular2.chart.WjFlexChartLegend
             *  and @see:wijmo/wijmo.angular2.chart.WjFlexPieDataLabel.
            */
            WjFlexPie = (function (_super) {
                __extends(WjFlexPie, _super);
                function WjFlexPie(elRef, injector, parentCmp) {
                    var _this = _super.call(this, wijmo_angular2_directiveBase_1.WjDirectiveBehavior.getHostElement(elRef)) || this;
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
                     * Angular (EventEmitter) version of the Wijmo <b>gotFocus</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>gotFocus</b> Wijmo event name.
                     */
                    _this.gotFocusNg = new core_1.EventEmitter(false);
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>lostFocus</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>lostFocus</b> Wijmo event name.
                     */
                    _this.lostFocusNg = new core_1.EventEmitter(false);
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
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>selectionChanged</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>selectionChanged</b> Wijmo event name.
                     */
                    _this.selectionChangedNg = new core_1.EventEmitter(false);
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
                WjFlexPie.prototype.created = function () {
                };
                WjFlexPie.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjFlexPie.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjFlexPie.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                Object.defineProperty(WjFlexPie.prototype, "tooltipContent", {
                    get: function () {
                        return this.tooltip.content;
                    },
                    set: function (value) {
                        this.tooltip.content = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(WjFlexPie.prototype, "labelContent", {
                    get: function () {
                        return this.dataLabel.content;
                    },
                    set: function (value) {
                        this.dataLabel.content = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                return WjFlexPie;
            }(wjcChart.FlexPie));
            WjFlexPie.meta = {
                outputs: wjFlexPieMeta.outputs,
            };
            WjFlexPie.decorators = [
                { type: core_1.Component, args: [{
                            selector: wjFlexPieMeta.selector,
                            template: wjFlexPieMeta.template,
                            inputs: wjFlexPieMeta.inputs,
                            outputs: wjFlexPieMeta.outputs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjFlexPie; }) }
                            ].concat(wjFlexPieMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjFlexPie.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
            ]; };
            exports_1("WjFlexPie", WjFlexPie);
            exports_1("wjFlexChartAxisMeta", wjFlexChartAxisMeta = {
                selector: 'wj-flex-chart-axis',
                template: "",
                inputs: [
                    'wjProperty',
                    'axisLine',
                    'format',
                    'labels',
                    'majorGrid',
                    'majorTickMarks',
                    'majorUnit',
                    'max',
                    'min',
                    'position',
                    'reversed',
                    'title',
                    'labelAngle',
                    'minorGrid',
                    'minorTickMarks',
                    'minorUnit',
                    'origin',
                    'logBase',
                    'plotArea',
                    'labelAlign',
                    'name',
                    'overlappingLabels',
                    'labelPadding',
                    'itemFormatter',
                    'itemsSource',
                    'binding',
                ],
                outputs: [
                    'initialized',
                    'rangeChangedNg: rangeChanged',
                ],
                providers: []
            });
            /**
             * Angular 2 component for the @see:wijmo.chart.Axis control.
             *
             * The <b>wj-flex-chart-axis</b> component must be
             * contained in one of the following components:
             * @see:wijmo/wijmo.angular2.chart.WjFlexChart
             * , @see:wijmo/wijmo.angular2.chart.WjFlexChartSeries
             * , @see:wijmo/wijmo.angular2.chart.finance.WjFinancialChart
             *  or @see:wijmo/wijmo.angular2.chart.finance.WjFinancialChartSeries.
             *
             * Use the <b>wj-flex-chart-axis</b> component to add <b>Axis</b> controls to your
             * Angular 2 applications. For details about Angular 2 markup syntax, see
             * <a href="static/angular2Markup.html">Angular 2 Markup</a>.
             *
             * The <b>WjFlexChartAxis</b> component is derived from the <b>Axis</b> control and
             * inherits all its properties, events and methods.
            */
            WjFlexChartAxis = (function (_super) {
                __extends(WjFlexChartAxis, _super);
                function WjFlexChartAxis(elRef, injector, parentCmp) {
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
                     * Default value is 'axes'.
                     */
                    _this.wjProperty = 'axes';
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>rangeChanged</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>rangeChanged</b> Wijmo event name.
                     */
                    _this.rangeChangedNg = new core_1.EventEmitter(false);
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
                WjFlexChartAxis.prototype.created = function () {
                };
                WjFlexChartAxis.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjFlexChartAxis.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjFlexChartAxis.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                return WjFlexChartAxis;
            }(wjcChart.Axis));
            WjFlexChartAxis.meta = {
                outputs: wjFlexChartAxisMeta.outputs,
            };
            WjFlexChartAxis.decorators = [
                { type: core_1.Component, args: [{
                            selector: wjFlexChartAxisMeta.selector,
                            template: wjFlexChartAxisMeta.template,
                            inputs: wjFlexChartAxisMeta.inputs,
                            outputs: wjFlexChartAxisMeta.outputs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjFlexChartAxis; }) }
                            ].concat(wjFlexChartAxisMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjFlexChartAxis.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
            ]; };
            exports_1("WjFlexChartAxis", WjFlexChartAxis);
            exports_1("wjFlexChartLegendMeta", wjFlexChartLegendMeta = {
                selector: 'wj-flex-chart-legend',
                template: "",
                inputs: [
                    'wjProperty',
                    'position',
                ],
                outputs: [
                    'initialized',
                ],
                providers: []
            });
            /**
             * Angular 2 component for the @see:wijmo.chart.Legend control.
             *
             * The <b>wj-flex-chart-legend</b> component must be
             * contained in one of the following components:
             * @see:wijmo/wijmo.angular2.chart.WjFlexChart
             * , @see:wijmo/wijmo.angular2.chart.WjFlexPie
             * , @see:wijmo/wijmo.angular2.chart.finance.WjFinancialChart
             * , @see:wijmo/wijmo.angular2.chart.radar.WjFlexRadar
             *  or @see:wijmo/wijmo.angular2.chart.hierarchical.WjSunburst.
             *
             * Use the <b>wj-flex-chart-legend</b> component to add <b>Legend</b> controls to your
             * Angular 2 applications. For details about Angular 2 markup syntax, see
             * <a href="static/angular2Markup.html">Angular 2 Markup</a>.
             *
             * The <b>WjFlexChartLegend</b> component is derived from the <b>Legend</b> control and
             * inherits all its properties, events and methods.
            */
            WjFlexChartLegend = (function (_super) {
                __extends(WjFlexChartLegend, _super);
                function WjFlexChartLegend(elRef, injector, parentCmp) {
                    var _this = _super.call(this, parentCmp) || this;
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
                     * Default value is 'legend'.
                     */
                    _this.wjProperty = 'legend';
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
                WjFlexChartLegend.prototype.created = function () {
                };
                WjFlexChartLegend.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjFlexChartLegend.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjFlexChartLegend.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                return WjFlexChartLegend;
            }(wjcChart.Legend));
            WjFlexChartLegend.meta = {
                outputs: wjFlexChartLegendMeta.outputs,
            };
            WjFlexChartLegend.decorators = [
                { type: core_1.Component, args: [{
                            selector: wjFlexChartLegendMeta.selector,
                            template: wjFlexChartLegendMeta.template,
                            inputs: wjFlexChartLegendMeta.inputs,
                            outputs: wjFlexChartLegendMeta.outputs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjFlexChartLegend; }) }
                            ].concat(wjFlexChartLegendMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjFlexChartLegend.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
            ]; };
            exports_1("WjFlexChartLegend", WjFlexChartLegend);
            exports_1("wjFlexChartDataLabelMeta", wjFlexChartDataLabelMeta = {
                selector: 'wj-flex-chart-data-label',
                template: "",
                inputs: [
                    'wjProperty',
                    'content',
                    'border',
                    'position',
                ],
                outputs: [
                    'initialized',
                ],
                providers: []
            });
            /**
             * Angular 2 component for the @see:wijmo.chart.DataLabel control.
             *
             * The <b>wj-flex-chart-data-label</b> component must be
             * contained in a @see:wijmo/wijmo.angular2.chart.WjFlexChart component.
             *
             * Use the <b>wj-flex-chart-data-label</b> component to add <b>DataLabel</b> controls to your
             * Angular 2 applications. For details about Angular 2 markup syntax, see
             * <a href="static/angular2Markup.html">Angular 2 Markup</a>.
             *
             * The <b>WjFlexChartDataLabel</b> component is derived from the <b>DataLabel</b> control and
             * inherits all its properties, events and methods.
            */
            WjFlexChartDataLabel = (function (_super) {
                __extends(WjFlexChartDataLabel, _super);
                function WjFlexChartDataLabel(elRef, injector, parentCmp) {
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
                     * Default value is 'dataLabel'.
                     */
                    _this.wjProperty = 'dataLabel';
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
                WjFlexChartDataLabel.prototype.created = function () {
                };
                WjFlexChartDataLabel.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjFlexChartDataLabel.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjFlexChartDataLabel.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                return WjFlexChartDataLabel;
            }(wjcChart.DataLabel));
            WjFlexChartDataLabel.meta = {
                outputs: wjFlexChartDataLabelMeta.outputs,
            };
            WjFlexChartDataLabel.decorators = [
                { type: core_1.Component, args: [{
                            selector: wjFlexChartDataLabelMeta.selector,
                            template: wjFlexChartDataLabelMeta.template,
                            inputs: wjFlexChartDataLabelMeta.inputs,
                            outputs: wjFlexChartDataLabelMeta.outputs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjFlexChartDataLabel; }) }
                            ].concat(wjFlexChartDataLabelMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjFlexChartDataLabel.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
            ]; };
            exports_1("WjFlexChartDataLabel", WjFlexChartDataLabel);
            exports_1("wjFlexPieDataLabelMeta", wjFlexPieDataLabelMeta = {
                selector: 'wj-flex-pie-data-label',
                template: "",
                inputs: [
                    'wjProperty',
                    'content',
                    'border',
                    'position',
                ],
                outputs: [
                    'initialized',
                ],
                providers: []
            });
            /**
             * Angular 2 component for the @see:wijmo.chart.PieDataLabel control.
             *
             * The <b>wj-flex-pie-data-label</b> component must be
             * contained in a @see:wijmo/wijmo.angular2.chart.WjFlexPie component.
             *
             * Use the <b>wj-flex-pie-data-label</b> component to add <b>PieDataLabel</b> controls to your
             * Angular 2 applications. For details about Angular 2 markup syntax, see
             * <a href="static/angular2Markup.html">Angular 2 Markup</a>.
             *
             * The <b>WjFlexPieDataLabel</b> component is derived from the <b>PieDataLabel</b> control and
             * inherits all its properties, events and methods.
            */
            WjFlexPieDataLabel = (function (_super) {
                __extends(WjFlexPieDataLabel, _super);
                function WjFlexPieDataLabel(elRef, injector, parentCmp) {
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
                     * Default value is 'dataLabel'.
                     */
                    _this.wjProperty = 'dataLabel';
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
                WjFlexPieDataLabel.prototype.created = function () {
                };
                WjFlexPieDataLabel.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjFlexPieDataLabel.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjFlexPieDataLabel.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                return WjFlexPieDataLabel;
            }(wjcChart.PieDataLabel));
            WjFlexPieDataLabel.meta = {
                outputs: wjFlexPieDataLabelMeta.outputs,
            };
            WjFlexPieDataLabel.decorators = [
                { type: core_1.Component, args: [{
                            selector: wjFlexPieDataLabelMeta.selector,
                            template: wjFlexPieDataLabelMeta.template,
                            inputs: wjFlexPieDataLabelMeta.inputs,
                            outputs: wjFlexPieDataLabelMeta.outputs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjFlexPieDataLabel; }) }
                            ].concat(wjFlexPieDataLabelMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjFlexPieDataLabel.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
            ]; };
            exports_1("WjFlexPieDataLabel", WjFlexPieDataLabel);
            exports_1("wjFlexChartSeriesMeta", wjFlexChartSeriesMeta = {
                selector: 'wj-flex-chart-series',
                template: "<div><ng-content></ng-content></div>",
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
             * Angular 2 component for the @see:wijmo.chart.Series control.
             *
             * The <b>wj-flex-chart-series</b> component must be
             * contained in a @see:wijmo/wijmo.angular2.chart.WjFlexChart component.
             *
             * Use the <b>wj-flex-chart-series</b> component to add <b>Series</b> controls to your
             * Angular 2 applications. For details about Angular 2 markup syntax, see
             * <a href="static/angular2Markup.html">Angular 2 Markup</a>.
             *
             * The <b>WjFlexChartSeries</b> component is derived from the <b>Series</b> control and
             * inherits all its properties, events and methods.
             *
             * The <b>wj-flex-chart-series</b> component may contain a @see:wijmo/wijmo.angular2.chart.WjFlexChartAxis child component.
            */
            WjFlexChartSeries = (function (_super) {
                __extends(WjFlexChartSeries, _super);
                function WjFlexChartSeries(elRef, injector, parentCmp) {
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
                WjFlexChartSeries.prototype.created = function () {
                };
                WjFlexChartSeries.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjFlexChartSeries.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjFlexChartSeries.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                return WjFlexChartSeries;
            }(wjcChart.Series));
            WjFlexChartSeries.meta = {
                outputs: wjFlexChartSeriesMeta.outputs,
                changeEvents: {
                    'chart.seriesVisibilityChanged': ['visibility']
                },
                siblingId: 'series',
            };
            WjFlexChartSeries.decorators = [
                { type: core_1.Component, args: [{
                            selector: wjFlexChartSeriesMeta.selector,
                            template: wjFlexChartSeriesMeta.template,
                            inputs: wjFlexChartSeriesMeta.inputs,
                            outputs: wjFlexChartSeriesMeta.outputs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjFlexChartSeries; }) }
                            ].concat(wjFlexChartSeriesMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjFlexChartSeries.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
            ]; };
            exports_1("WjFlexChartSeries", WjFlexChartSeries);
            exports_1("wjFlexChartLineMarkerMeta", wjFlexChartLineMarkerMeta = {
                selector: 'wj-flex-line-marker',
                template: "",
                inputs: [
                    'wjProperty',
                    'isVisible',
                    'seriesIndex',
                    'horizontalPosition',
                    'content',
                    'verticalPosition',
                    'alignment',
                    'lines',
                    'interaction',
                    'dragLines',
                    'dragThreshold',
                    'dragContent',
                ],
                outputs: [
                    'initialized',
                    'positionChangedNg: positionChanged',
                ],
                providers: []
            });
            /**
             * Angular 2 component for the @see:wijmo.chart.LineMarker control.
             *
             * The <b>wj-flex-line-marker</b> component must be
             * contained in one of the following components:
             * @see:wijmo/wijmo.angular2.chart.WjFlexChart
             *  or @see:wijmo/wijmo.angular2.chart.finance.WjFinancialChart.
             *
             * Use the <b>wj-flex-line-marker</b> component to add <b>LineMarker</b> controls to your
             * Angular 2 applications. For details about Angular 2 markup syntax, see
             * <a href="static/angular2Markup.html">Angular 2 Markup</a>.
             *
             * The <b>WjFlexChartLineMarker</b> component is derived from the <b>LineMarker</b> control and
             * inherits all its properties, events and methods.
            */
            WjFlexChartLineMarker = (function (_super) {
                __extends(WjFlexChartLineMarker, _super);
                function WjFlexChartLineMarker(elRef, injector, parentCmp) {
                    var _this = _super.call(this, parentCmp) || this;
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
                     * Angular (EventEmitter) version of the Wijmo <b>positionChanged</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>positionChanged</b> Wijmo event name.
                     */
                    _this.positionChangedNg = new core_1.EventEmitter(false);
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
                WjFlexChartLineMarker.prototype.created = function () {
                };
                WjFlexChartLineMarker.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjFlexChartLineMarker.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjFlexChartLineMarker.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                return WjFlexChartLineMarker;
            }(wjcChart.LineMarker));
            WjFlexChartLineMarker.meta = {
                outputs: wjFlexChartLineMarkerMeta.outputs,
            };
            WjFlexChartLineMarker.decorators = [
                { type: core_1.Component, args: [{
                            selector: wjFlexChartLineMarkerMeta.selector,
                            template: wjFlexChartLineMarkerMeta.template,
                            inputs: wjFlexChartLineMarkerMeta.inputs,
                            outputs: wjFlexChartLineMarkerMeta.outputs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjFlexChartLineMarker; }) }
                            ].concat(wjFlexChartLineMarkerMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjFlexChartLineMarker.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
            ]; };
            exports_1("WjFlexChartLineMarker", WjFlexChartLineMarker);
            exports_1("wjFlexChartDataPointMeta", wjFlexChartDataPointMeta = {
                selector: 'wj-flex-chart-data-point',
                template: "",
                inputs: [
                    'wjProperty',
                    'x',
                    'y',
                ],
                outputs: [
                    'initialized',
                ],
                providers: []
            });
            /**
             * Angular 2 component for the @see:wijmo.chart.DataPoint control.
             *
             * The <b>wj-flex-chart-data-point</b> component must be
             * contained in one of the following components:
             * @see:wijmo/wijmo.angular2.chart.annotation.WjFlexChartAnnotationText
             * , @see:wijmo/wijmo.angular2.chart.annotation.WjFlexChartAnnotationEllipse
             * , @see:wijmo/wijmo.angular2.chart.annotation.WjFlexChartAnnotationRectangle
             * , @see:wijmo/wijmo.angular2.chart.annotation.WjFlexChartAnnotationLine
             * , @see:wijmo/wijmo.angular2.chart.annotation.WjFlexChartAnnotationPolygon
             * , @see:wijmo/wijmo.angular2.chart.annotation.WjFlexChartAnnotationCircle
             * , @see:wijmo/wijmo.angular2.chart.annotation.WjFlexChartAnnotationSquare
             *  or @see:wijmo/wijmo.angular2.chart.annotation.WjFlexChartAnnotationImage.
             *
             * Use the <b>wj-flex-chart-data-point</b> component to add <b>DataPoint</b> controls to your
             * Angular 2 applications. For details about Angular 2 markup syntax, see
             * <a href="static/angular2Markup.html">Angular 2 Markup</a>.
             *
             * The <b>WjFlexChartDataPoint</b> component is derived from the <b>DataPoint</b> control and
             * inherits all its properties, events and methods.
            */
            WjFlexChartDataPoint = (function (_super) {
                __extends(WjFlexChartDataPoint, _super);
                function WjFlexChartDataPoint(elRef, injector, parentCmp) {
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
                     * Default value is ''.
                     */
                    _this.wjProperty = '';
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
                WjFlexChartDataPoint.prototype.created = function () {
                };
                WjFlexChartDataPoint.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjFlexChartDataPoint.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjFlexChartDataPoint.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                return WjFlexChartDataPoint;
            }(wjcChart.DataPoint));
            WjFlexChartDataPoint.meta = {
                outputs: wjFlexChartDataPointMeta.outputs,
            };
            WjFlexChartDataPoint.decorators = [
                { type: core_1.Component, args: [{
                            selector: wjFlexChartDataPointMeta.selector,
                            template: wjFlexChartDataPointMeta.template,
                            inputs: wjFlexChartDataPointMeta.inputs,
                            outputs: wjFlexChartDataPointMeta.outputs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjFlexChartDataPoint; }) }
                            ].concat(wjFlexChartDataPointMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjFlexChartDataPoint.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
            ]; };
            exports_1("WjFlexChartDataPoint", WjFlexChartDataPoint);
            exports_1("wjFlexChartPlotAreaMeta", wjFlexChartPlotAreaMeta = {
                selector: 'wj-flex-chart-plot-area',
                template: "",
                inputs: [
                    'wjProperty',
                    'column',
                    'height',
                    'name',
                    'row',
                    'style',
                    'width',
                ],
                outputs: [
                    'initialized',
                ],
                providers: []
            });
            /**
             * Angular 2 component for the @see:wijmo.chart.PlotArea control.
             *
             * The <b>wj-flex-chart-plot-area</b> component must be
             * contained in one of the following components:
             * @see:wijmo/wijmo.angular2.chart.WjFlexChart
             *  or @see:wijmo/wijmo.angular2.chart.finance.WjFinancialChart.
             *
             * Use the <b>wj-flex-chart-plot-area</b> component to add <b>PlotArea</b> controls to your
             * Angular 2 applications. For details about Angular 2 markup syntax, see
             * <a href="static/angular2Markup.html">Angular 2 Markup</a>.
             *
             * The <b>WjFlexChartPlotArea</b> component is derived from the <b>PlotArea</b> control and
             * inherits all its properties, events and methods.
            */
            WjFlexChartPlotArea = (function (_super) {
                __extends(WjFlexChartPlotArea, _super);
                function WjFlexChartPlotArea(elRef, injector, parentCmp) {
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
                     * Default value is 'plotAreas'.
                     */
                    _this.wjProperty = 'plotAreas';
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
                WjFlexChartPlotArea.prototype.created = function () {
                };
                WjFlexChartPlotArea.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjFlexChartPlotArea.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjFlexChartPlotArea.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                return WjFlexChartPlotArea;
            }(wjcChart.PlotArea));
            WjFlexChartPlotArea.meta = {
                outputs: wjFlexChartPlotAreaMeta.outputs,
            };
            WjFlexChartPlotArea.decorators = [
                { type: core_1.Component, args: [{
                            selector: wjFlexChartPlotAreaMeta.selector,
                            template: wjFlexChartPlotAreaMeta.template,
                            inputs: wjFlexChartPlotAreaMeta.inputs,
                            outputs: wjFlexChartPlotAreaMeta.outputs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjFlexChartPlotArea; }) }
                            ].concat(wjFlexChartPlotAreaMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjFlexChartPlotArea.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
            ]; };
            exports_1("WjFlexChartPlotArea", WjFlexChartPlotArea);
            moduleExports = [
                WjFlexChart,
                WjFlexPie,
                WjFlexChartAxis,
                WjFlexChartLegend,
                WjFlexChartDataLabel,
                WjFlexPieDataLabel,
                WjFlexChartSeries,
                WjFlexChartLineMarker,
                WjFlexChartDataPoint,
                WjFlexChartPlotArea
            ];
            WjChartModule = (function () {
                function WjChartModule() {
                }
                return WjChartModule;
            }());
            WjChartModule.decorators = [
                { type: core_1.NgModule, args: [{
                            imports: [wijmo_angular2_directiveBase_1.WjDirectiveBaseModule, common_1.CommonModule],
                            declarations: moduleExports.slice(),
                            exports: moduleExports.slice(),
                        },] },
            ];
            /** @nocollapse */
            WjChartModule.ctorParameters = function () { return []; };
            exports_1("WjChartModule", WjChartModule);
        }
    };
});
//# sourceMappingURL=wijmo.angular2.chart.js.map