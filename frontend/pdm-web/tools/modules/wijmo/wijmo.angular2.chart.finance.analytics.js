System.register(["wijmo/wijmo.chart.finance.analytics", "@angular/core", "@angular/common", "wijmo/wijmo.angular2.directiveBase"], function (exports_1, context_1) {
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
    var wjcChartFinanceAnalytics, core_1, core_2, core_3, common_1, wijmo_angular2_directiveBase_1, wjFlexChartFibonacciMeta, WjFlexChartFibonacci, wjFlexChartFibonacciArcsMeta, WjFlexChartFibonacciArcs, wjFlexChartFibonacciFansMeta, WjFlexChartFibonacciFans, wjFlexChartFibonacciTimeZonesMeta, WjFlexChartFibonacciTimeZones, wjFlexChartAtrMeta, WjFlexChartAtr, wjFlexChartCciMeta, WjFlexChartCci, wjFlexChartRsiMeta, WjFlexChartRsi, wjFlexChartWilliamsRMeta, WjFlexChartWilliamsR, wjFlexChartMacdMeta, WjFlexChartMacd, wjFlexChartMacdHistogramMeta, WjFlexChartMacdHistogram, wjFlexChartStochasticMeta, WjFlexChartStochastic, wjFlexChartBollingerBandsMeta, WjFlexChartBollingerBands, wjFlexChartEnvelopesMeta, WjFlexChartEnvelopes, moduleExports, WjChartFinanceAnalyticsModule;
    return {
        setters: [
            function (wjcChartFinanceAnalytics_1) {
                wjcChartFinanceAnalytics = wjcChartFinanceAnalytics_1;
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
            exports_1("wjFlexChartFibonacciMeta", wjFlexChartFibonacciMeta = {
                selector: 'wj-flex-chart-fibonacci',
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
                    'high',
                    'low',
                    'labelPosition',
                    'levels',
                    'minX',
                    'maxX',
                    'uptrend',
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
             * Angular 2 component for the @see:wijmo.chart.finance.analytics.Fibonacci control.
             *
             * The <b>wj-flex-chart-fibonacci</b> component must be
             * contained in a @see:wijmo/wijmo.angular2.chart.finance.WjFinancialChart component.
             *
             * Use the <b>wj-flex-chart-fibonacci</b> component to add <b>Fibonacci</b> controls to your
             * Angular 2 applications. For details about Angular 2 markup syntax, see
             * <a href="static/angular2Markup.html">Angular 2 Markup</a>.
             *
             * The <b>WjFlexChartFibonacci</b> component is derived from the <b>Fibonacci</b> control and
             * inherits all its properties, events and methods.
            */
            WjFlexChartFibonacci = (function (_super) {
                __extends(WjFlexChartFibonacci, _super);
                function WjFlexChartFibonacci(elRef, injector, parentCmp) {
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
                WjFlexChartFibonacci.prototype.created = function () {
                };
                WjFlexChartFibonacci.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjFlexChartFibonacci.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjFlexChartFibonacci.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                return WjFlexChartFibonacci;
            }(wjcChartFinanceAnalytics.Fibonacci));
            WjFlexChartFibonacci.meta = {
                outputs: wjFlexChartFibonacciMeta.outputs,
                changeEvents: {
                    'chart.seriesVisibilityChanged': ['visibility']
                },
                siblingId: 'series',
            };
            WjFlexChartFibonacci.decorators = [
                { type: core_1.Component, args: [{
                            selector: wjFlexChartFibonacciMeta.selector,
                            template: wjFlexChartFibonacciMeta.template,
                            inputs: wjFlexChartFibonacciMeta.inputs,
                            outputs: wjFlexChartFibonacciMeta.outputs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjFlexChartFibonacci; }) }
                            ].concat(wjFlexChartFibonacciMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjFlexChartFibonacci.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
            ]; };
            exports_1("WjFlexChartFibonacci", WjFlexChartFibonacci);
            exports_1("wjFlexChartFibonacciArcsMeta", wjFlexChartFibonacciArcsMeta = {
                selector: 'wj-flex-chart-fibonacci-arcs',
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
                    'start',
                    'end',
                    'labelPosition',
                    'levels',
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
             * Angular 2 component for the @see:wijmo.chart.finance.analytics.FibonacciArcs control.
             *
             * The <b>wj-flex-chart-fibonacci-arcs</b> component must be
             * contained in a @see:wijmo/wijmo.angular2.chart.finance.WjFinancialChart component.
             *
             * Use the <b>wj-flex-chart-fibonacci-arcs</b> component to add <b>FibonacciArcs</b> controls to your
             * Angular 2 applications. For details about Angular 2 markup syntax, see
             * <a href="static/angular2Markup.html">Angular 2 Markup</a>.
             *
             * The <b>WjFlexChartFibonacciArcs</b> component is derived from the <b>FibonacciArcs</b> control and
             * inherits all its properties, events and methods.
            */
            WjFlexChartFibonacciArcs = (function (_super) {
                __extends(WjFlexChartFibonacciArcs, _super);
                function WjFlexChartFibonacciArcs(elRef, injector, parentCmp) {
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
                WjFlexChartFibonacciArcs.prototype.created = function () {
                };
                WjFlexChartFibonacciArcs.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjFlexChartFibonacciArcs.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjFlexChartFibonacciArcs.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                return WjFlexChartFibonacciArcs;
            }(wjcChartFinanceAnalytics.FibonacciArcs));
            WjFlexChartFibonacciArcs.meta = {
                outputs: wjFlexChartFibonacciArcsMeta.outputs,
                changeEvents: {
                    'chart.seriesVisibilityChanged': ['visibility']
                },
                siblingId: 'series',
            };
            WjFlexChartFibonacciArcs.decorators = [
                { type: core_1.Component, args: [{
                            selector: wjFlexChartFibonacciArcsMeta.selector,
                            template: wjFlexChartFibonacciArcsMeta.template,
                            inputs: wjFlexChartFibonacciArcsMeta.inputs,
                            outputs: wjFlexChartFibonacciArcsMeta.outputs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjFlexChartFibonacciArcs; }) }
                            ].concat(wjFlexChartFibonacciArcsMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjFlexChartFibonacciArcs.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
            ]; };
            exports_1("WjFlexChartFibonacciArcs", WjFlexChartFibonacciArcs);
            exports_1("wjFlexChartFibonacciFansMeta", wjFlexChartFibonacciFansMeta = {
                selector: 'wj-flex-chart-fibonacci-fans',
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
                    'start',
                    'end',
                    'labelPosition',
                    'levels',
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
             * Angular 2 component for the @see:wijmo.chart.finance.analytics.FibonacciFans control.
             *
             * The <b>wj-flex-chart-fibonacci-fans</b> component must be
             * contained in a @see:wijmo/wijmo.angular2.chart.finance.WjFinancialChart component.
             *
             * Use the <b>wj-flex-chart-fibonacci-fans</b> component to add <b>FibonacciFans</b> controls to your
             * Angular 2 applications. For details about Angular 2 markup syntax, see
             * <a href="static/angular2Markup.html">Angular 2 Markup</a>.
             *
             * The <b>WjFlexChartFibonacciFans</b> component is derived from the <b>FibonacciFans</b> control and
             * inherits all its properties, events and methods.
            */
            WjFlexChartFibonacciFans = (function (_super) {
                __extends(WjFlexChartFibonacciFans, _super);
                function WjFlexChartFibonacciFans(elRef, injector, parentCmp) {
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
                WjFlexChartFibonacciFans.prototype.created = function () {
                };
                WjFlexChartFibonacciFans.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjFlexChartFibonacciFans.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjFlexChartFibonacciFans.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                return WjFlexChartFibonacciFans;
            }(wjcChartFinanceAnalytics.FibonacciFans));
            WjFlexChartFibonacciFans.meta = {
                outputs: wjFlexChartFibonacciFansMeta.outputs,
                changeEvents: {
                    'chart.seriesVisibilityChanged': ['visibility']
                },
                siblingId: 'series',
            };
            WjFlexChartFibonacciFans.decorators = [
                { type: core_1.Component, args: [{
                            selector: wjFlexChartFibonacciFansMeta.selector,
                            template: wjFlexChartFibonacciFansMeta.template,
                            inputs: wjFlexChartFibonacciFansMeta.inputs,
                            outputs: wjFlexChartFibonacciFansMeta.outputs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjFlexChartFibonacciFans; }) }
                            ].concat(wjFlexChartFibonacciFansMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjFlexChartFibonacciFans.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
            ]; };
            exports_1("WjFlexChartFibonacciFans", WjFlexChartFibonacciFans);
            exports_1("wjFlexChartFibonacciTimeZonesMeta", wjFlexChartFibonacciTimeZonesMeta = {
                selector: 'wj-flex-chart-fibonacci-time-zones',
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
                    'startX',
                    'endX',
                    'labelPosition',
                    'levels',
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
             * Angular 2 component for the @see:wijmo.chart.finance.analytics.FibonacciTimeZones control.
             *
             * The <b>wj-flex-chart-fibonacci-time-zones</b> component must be
             * contained in a @see:wijmo/wijmo.angular2.chart.finance.WjFinancialChart component.
             *
             * Use the <b>wj-flex-chart-fibonacci-time-zones</b> component to add <b>FibonacciTimeZones</b> controls to your
             * Angular 2 applications. For details about Angular 2 markup syntax, see
             * <a href="static/angular2Markup.html">Angular 2 Markup</a>.
             *
             * The <b>WjFlexChartFibonacciTimeZones</b> component is derived from the <b>FibonacciTimeZones</b> control and
             * inherits all its properties, events and methods.
            */
            WjFlexChartFibonacciTimeZones = (function (_super) {
                __extends(WjFlexChartFibonacciTimeZones, _super);
                function WjFlexChartFibonacciTimeZones(elRef, injector, parentCmp) {
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
                WjFlexChartFibonacciTimeZones.prototype.created = function () {
                };
                WjFlexChartFibonacciTimeZones.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjFlexChartFibonacciTimeZones.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjFlexChartFibonacciTimeZones.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                return WjFlexChartFibonacciTimeZones;
            }(wjcChartFinanceAnalytics.FibonacciTimeZones));
            WjFlexChartFibonacciTimeZones.meta = {
                outputs: wjFlexChartFibonacciTimeZonesMeta.outputs,
                changeEvents: {
                    'chart.seriesVisibilityChanged': ['visibility']
                },
                siblingId: 'series',
            };
            WjFlexChartFibonacciTimeZones.decorators = [
                { type: core_1.Component, args: [{
                            selector: wjFlexChartFibonacciTimeZonesMeta.selector,
                            template: wjFlexChartFibonacciTimeZonesMeta.template,
                            inputs: wjFlexChartFibonacciTimeZonesMeta.inputs,
                            outputs: wjFlexChartFibonacciTimeZonesMeta.outputs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjFlexChartFibonacciTimeZones; }) }
                            ].concat(wjFlexChartFibonacciTimeZonesMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjFlexChartFibonacciTimeZones.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
            ]; };
            exports_1("WjFlexChartFibonacciTimeZones", WjFlexChartFibonacciTimeZones);
            exports_1("wjFlexChartAtrMeta", wjFlexChartAtrMeta = {
                selector: 'wj-flex-chart-atr',
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
                    'period',
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
             * Angular 2 component for the @see:wijmo.chart.finance.analytics.ATR control.
             *
             * The <b>wj-flex-chart-atr</b> component must be
             * contained in a @see:wijmo/wijmo.angular2.chart.finance.WjFinancialChart component.
             *
             * Use the <b>wj-flex-chart-atr</b> component to add <b>ATR</b> controls to your
             * Angular 2 applications. For details about Angular 2 markup syntax, see
             * <a href="static/angular2Markup.html">Angular 2 Markup</a>.
             *
             * The <b>WjFlexChartAtr</b> component is derived from the <b>ATR</b> control and
             * inherits all its properties, events and methods.
            */
            WjFlexChartAtr = (function (_super) {
                __extends(WjFlexChartAtr, _super);
                function WjFlexChartAtr(elRef, injector, parentCmp) {
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
                WjFlexChartAtr.prototype.created = function () {
                };
                WjFlexChartAtr.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjFlexChartAtr.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjFlexChartAtr.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                return WjFlexChartAtr;
            }(wjcChartFinanceAnalytics.ATR));
            WjFlexChartAtr.meta = {
                outputs: wjFlexChartAtrMeta.outputs,
                changeEvents: {
                    'chart.seriesVisibilityChanged': ['visibility']
                },
                siblingId: 'series',
            };
            WjFlexChartAtr.decorators = [
                { type: core_1.Component, args: [{
                            selector: wjFlexChartAtrMeta.selector,
                            template: wjFlexChartAtrMeta.template,
                            inputs: wjFlexChartAtrMeta.inputs,
                            outputs: wjFlexChartAtrMeta.outputs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjFlexChartAtr; }) }
                            ].concat(wjFlexChartAtrMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjFlexChartAtr.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
            ]; };
            exports_1("WjFlexChartAtr", WjFlexChartAtr);
            exports_1("wjFlexChartCciMeta", wjFlexChartCciMeta = {
                selector: 'wj-flex-chart-cci',
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
                    'period',
                    'constant',
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
             * Angular 2 component for the @see:wijmo.chart.finance.analytics.CCI control.
             *
             * The <b>wj-flex-chart-cci</b> component must be
             * contained in a @see:wijmo/wijmo.angular2.chart.finance.WjFinancialChart component.
             *
             * Use the <b>wj-flex-chart-cci</b> component to add <b>CCI</b> controls to your
             * Angular 2 applications. For details about Angular 2 markup syntax, see
             * <a href="static/angular2Markup.html">Angular 2 Markup</a>.
             *
             * The <b>WjFlexChartCci</b> component is derived from the <b>CCI</b> control and
             * inherits all its properties, events and methods.
            */
            WjFlexChartCci = (function (_super) {
                __extends(WjFlexChartCci, _super);
                function WjFlexChartCci(elRef, injector, parentCmp) {
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
                WjFlexChartCci.prototype.created = function () {
                };
                WjFlexChartCci.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjFlexChartCci.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjFlexChartCci.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                return WjFlexChartCci;
            }(wjcChartFinanceAnalytics.CCI));
            WjFlexChartCci.meta = {
                outputs: wjFlexChartCciMeta.outputs,
                changeEvents: {
                    'chart.seriesVisibilityChanged': ['visibility']
                },
                siblingId: 'series',
            };
            WjFlexChartCci.decorators = [
                { type: core_1.Component, args: [{
                            selector: wjFlexChartCciMeta.selector,
                            template: wjFlexChartCciMeta.template,
                            inputs: wjFlexChartCciMeta.inputs,
                            outputs: wjFlexChartCciMeta.outputs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjFlexChartCci; }) }
                            ].concat(wjFlexChartCciMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjFlexChartCci.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
            ]; };
            exports_1("WjFlexChartCci", WjFlexChartCci);
            exports_1("wjFlexChartRsiMeta", wjFlexChartRsiMeta = {
                selector: 'wj-flex-chart-rsi',
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
                    'period',
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
             * Angular 2 component for the @see:wijmo.chart.finance.analytics.RSI control.
             *
             * The <b>wj-flex-chart-rsi</b> component must be
             * contained in a @see:wijmo/wijmo.angular2.chart.finance.WjFinancialChart component.
             *
             * Use the <b>wj-flex-chart-rsi</b> component to add <b>RSI</b> controls to your
             * Angular 2 applications. For details about Angular 2 markup syntax, see
             * <a href="static/angular2Markup.html">Angular 2 Markup</a>.
             *
             * The <b>WjFlexChartRsi</b> component is derived from the <b>RSI</b> control and
             * inherits all its properties, events and methods.
            */
            WjFlexChartRsi = (function (_super) {
                __extends(WjFlexChartRsi, _super);
                function WjFlexChartRsi(elRef, injector, parentCmp) {
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
                WjFlexChartRsi.prototype.created = function () {
                };
                WjFlexChartRsi.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjFlexChartRsi.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjFlexChartRsi.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                return WjFlexChartRsi;
            }(wjcChartFinanceAnalytics.RSI));
            WjFlexChartRsi.meta = {
                outputs: wjFlexChartRsiMeta.outputs,
                changeEvents: {
                    'chart.seriesVisibilityChanged': ['visibility']
                },
                siblingId: 'series',
            };
            WjFlexChartRsi.decorators = [
                { type: core_1.Component, args: [{
                            selector: wjFlexChartRsiMeta.selector,
                            template: wjFlexChartRsiMeta.template,
                            inputs: wjFlexChartRsiMeta.inputs,
                            outputs: wjFlexChartRsiMeta.outputs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjFlexChartRsi; }) }
                            ].concat(wjFlexChartRsiMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjFlexChartRsi.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
            ]; };
            exports_1("WjFlexChartRsi", WjFlexChartRsi);
            exports_1("wjFlexChartWilliamsRMeta", wjFlexChartWilliamsRMeta = {
                selector: 'wj-flex-chart-williams-r',
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
                    'period',
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
             * Angular 2 component for the @see:wijmo.chart.finance.analytics.WilliamsR control.
             *
             * The <b>wj-flex-chart-williams-r</b> component must be
             * contained in a @see:wijmo/wijmo.angular2.chart.finance.WjFinancialChart component.
             *
             * Use the <b>wj-flex-chart-williams-r</b> component to add <b>WilliamsR</b> controls to your
             * Angular 2 applications. For details about Angular 2 markup syntax, see
             * <a href="static/angular2Markup.html">Angular 2 Markup</a>.
             *
             * The <b>WjFlexChartWilliamsR</b> component is derived from the <b>WilliamsR</b> control and
             * inherits all its properties, events and methods.
            */
            WjFlexChartWilliamsR = (function (_super) {
                __extends(WjFlexChartWilliamsR, _super);
                function WjFlexChartWilliamsR(elRef, injector, parentCmp) {
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
                WjFlexChartWilliamsR.prototype.created = function () {
                };
                WjFlexChartWilliamsR.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjFlexChartWilliamsR.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjFlexChartWilliamsR.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                return WjFlexChartWilliamsR;
            }(wjcChartFinanceAnalytics.WilliamsR));
            WjFlexChartWilliamsR.meta = {
                outputs: wjFlexChartWilliamsRMeta.outputs,
                changeEvents: {
                    'chart.seriesVisibilityChanged': ['visibility']
                },
                siblingId: 'series',
            };
            WjFlexChartWilliamsR.decorators = [
                { type: core_1.Component, args: [{
                            selector: wjFlexChartWilliamsRMeta.selector,
                            template: wjFlexChartWilliamsRMeta.template,
                            inputs: wjFlexChartWilliamsRMeta.inputs,
                            outputs: wjFlexChartWilliamsRMeta.outputs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjFlexChartWilliamsR; }) }
                            ].concat(wjFlexChartWilliamsRMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjFlexChartWilliamsR.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
            ]; };
            exports_1("WjFlexChartWilliamsR", WjFlexChartWilliamsR);
            exports_1("wjFlexChartMacdMeta", wjFlexChartMacdMeta = {
                selector: 'wj-flex-chart-macd',
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
                    'fastPeriod',
                    'slowPeriod',
                    'smoothingPeriod',
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
             * Angular 2 component for the @see:wijmo.chart.finance.analytics.Macd control.
             *
             * The <b>wj-flex-chart-macd</b> component must be
             * contained in a @see:wijmo/wijmo.angular2.chart.finance.WjFinancialChart component.
             *
             * Use the <b>wj-flex-chart-macd</b> component to add <b>Macd</b> controls to your
             * Angular 2 applications. For details about Angular 2 markup syntax, see
             * <a href="static/angular2Markup.html">Angular 2 Markup</a>.
             *
             * The <b>WjFlexChartMacd</b> component is derived from the <b>Macd</b> control and
             * inherits all its properties, events and methods.
            */
            WjFlexChartMacd = (function (_super) {
                __extends(WjFlexChartMacd, _super);
                function WjFlexChartMacd(elRef, injector, parentCmp) {
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
                WjFlexChartMacd.prototype.created = function () {
                };
                WjFlexChartMacd.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjFlexChartMacd.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjFlexChartMacd.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                return WjFlexChartMacd;
            }(wjcChartFinanceAnalytics.Macd));
            WjFlexChartMacd.meta = {
                outputs: wjFlexChartMacdMeta.outputs,
                changeEvents: {
                    'chart.seriesVisibilityChanged': ['visibility']
                },
                siblingId: 'series',
            };
            WjFlexChartMacd.decorators = [
                { type: core_1.Component, args: [{
                            selector: wjFlexChartMacdMeta.selector,
                            template: wjFlexChartMacdMeta.template,
                            inputs: wjFlexChartMacdMeta.inputs,
                            outputs: wjFlexChartMacdMeta.outputs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjFlexChartMacd; }) }
                            ].concat(wjFlexChartMacdMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjFlexChartMacd.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
            ]; };
            exports_1("WjFlexChartMacd", WjFlexChartMacd);
            exports_1("wjFlexChartMacdHistogramMeta", wjFlexChartMacdHistogramMeta = {
                selector: 'wj-flex-chart-macd-histogram',
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
                    'fastPeriod',
                    'slowPeriod',
                    'smoothingPeriod',
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
             * Angular 2 component for the @see:wijmo.chart.finance.analytics.MacdHistogram control.
             *
             * The <b>wj-flex-chart-macd-histogram</b> component must be
             * contained in a @see:wijmo/wijmo.angular2.chart.finance.WjFinancialChart component.
             *
             * Use the <b>wj-flex-chart-macd-histogram</b> component to add <b>MacdHistogram</b> controls to your
             * Angular 2 applications. For details about Angular 2 markup syntax, see
             * <a href="static/angular2Markup.html">Angular 2 Markup</a>.
             *
             * The <b>WjFlexChartMacdHistogram</b> component is derived from the <b>MacdHistogram</b> control and
             * inherits all its properties, events and methods.
            */
            WjFlexChartMacdHistogram = (function (_super) {
                __extends(WjFlexChartMacdHistogram, _super);
                function WjFlexChartMacdHistogram(elRef, injector, parentCmp) {
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
                WjFlexChartMacdHistogram.prototype.created = function () {
                };
                WjFlexChartMacdHistogram.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjFlexChartMacdHistogram.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjFlexChartMacdHistogram.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                return WjFlexChartMacdHistogram;
            }(wjcChartFinanceAnalytics.MacdHistogram));
            WjFlexChartMacdHistogram.meta = {
                outputs: wjFlexChartMacdHistogramMeta.outputs,
                changeEvents: {
                    'chart.seriesVisibilityChanged': ['visibility']
                },
                siblingId: 'series',
            };
            WjFlexChartMacdHistogram.decorators = [
                { type: core_1.Component, args: [{
                            selector: wjFlexChartMacdHistogramMeta.selector,
                            template: wjFlexChartMacdHistogramMeta.template,
                            inputs: wjFlexChartMacdHistogramMeta.inputs,
                            outputs: wjFlexChartMacdHistogramMeta.outputs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjFlexChartMacdHistogram; }) }
                            ].concat(wjFlexChartMacdHistogramMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjFlexChartMacdHistogram.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
            ]; };
            exports_1("WjFlexChartMacdHistogram", WjFlexChartMacdHistogram);
            exports_1("wjFlexChartStochasticMeta", wjFlexChartStochasticMeta = {
                selector: 'wj-flex-chart-stochastic',
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
                    'dPeriod',
                    'kPeriod',
                    'smoothingPeriod',
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
             * Angular 2 component for the @see:wijmo.chart.finance.analytics.Stochastic control.
             *
             * The <b>wj-flex-chart-stochastic</b> component must be
             * contained in a @see:wijmo/wijmo.angular2.chart.finance.WjFinancialChart component.
             *
             * Use the <b>wj-flex-chart-stochastic</b> component to add <b>Stochastic</b> controls to your
             * Angular 2 applications. For details about Angular 2 markup syntax, see
             * <a href="static/angular2Markup.html">Angular 2 Markup</a>.
             *
             * The <b>WjFlexChartStochastic</b> component is derived from the <b>Stochastic</b> control and
             * inherits all its properties, events and methods.
            */
            WjFlexChartStochastic = (function (_super) {
                __extends(WjFlexChartStochastic, _super);
                function WjFlexChartStochastic(elRef, injector, parentCmp) {
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
                WjFlexChartStochastic.prototype.created = function () {
                };
                WjFlexChartStochastic.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjFlexChartStochastic.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjFlexChartStochastic.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                return WjFlexChartStochastic;
            }(wjcChartFinanceAnalytics.Stochastic));
            WjFlexChartStochastic.meta = {
                outputs: wjFlexChartStochasticMeta.outputs,
                changeEvents: {
                    'chart.seriesVisibilityChanged': ['visibility']
                },
                siblingId: 'series',
            };
            WjFlexChartStochastic.decorators = [
                { type: core_1.Component, args: [{
                            selector: wjFlexChartStochasticMeta.selector,
                            template: wjFlexChartStochasticMeta.template,
                            inputs: wjFlexChartStochasticMeta.inputs,
                            outputs: wjFlexChartStochasticMeta.outputs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjFlexChartStochastic; }) }
                            ].concat(wjFlexChartStochasticMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjFlexChartStochastic.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
            ]; };
            exports_1("WjFlexChartStochastic", WjFlexChartStochastic);
            exports_1("wjFlexChartBollingerBandsMeta", wjFlexChartBollingerBandsMeta = {
                selector: 'wj-flex-chart-bollinger-bands',
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
                    'period',
                    'multiplier',
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
             * Angular 2 component for the @see:wijmo.chart.finance.analytics.BollingerBands control.
             *
             * The <b>wj-flex-chart-bollinger-bands</b> component must be
             * contained in a @see:wijmo/wijmo.angular2.chart.finance.WjFinancialChart component.
             *
             * Use the <b>wj-flex-chart-bollinger-bands</b> component to add <b>BollingerBands</b> controls to your
             * Angular 2 applications. For details about Angular 2 markup syntax, see
             * <a href="static/angular2Markup.html">Angular 2 Markup</a>.
             *
             * The <b>WjFlexChartBollingerBands</b> component is derived from the <b>BollingerBands</b> control and
             * inherits all its properties, events and methods.
            */
            WjFlexChartBollingerBands = (function (_super) {
                __extends(WjFlexChartBollingerBands, _super);
                function WjFlexChartBollingerBands(elRef, injector, parentCmp) {
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
                WjFlexChartBollingerBands.prototype.created = function () {
                };
                WjFlexChartBollingerBands.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjFlexChartBollingerBands.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjFlexChartBollingerBands.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                return WjFlexChartBollingerBands;
            }(wjcChartFinanceAnalytics.BollingerBands));
            WjFlexChartBollingerBands.meta = {
                outputs: wjFlexChartBollingerBandsMeta.outputs,
                changeEvents: {
                    'chart.seriesVisibilityChanged': ['visibility']
                },
                siblingId: 'series',
            };
            WjFlexChartBollingerBands.decorators = [
                { type: core_1.Component, args: [{
                            selector: wjFlexChartBollingerBandsMeta.selector,
                            template: wjFlexChartBollingerBandsMeta.template,
                            inputs: wjFlexChartBollingerBandsMeta.inputs,
                            outputs: wjFlexChartBollingerBandsMeta.outputs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjFlexChartBollingerBands; }) }
                            ].concat(wjFlexChartBollingerBandsMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjFlexChartBollingerBands.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
            ]; };
            exports_1("WjFlexChartBollingerBands", WjFlexChartBollingerBands);
            exports_1("wjFlexChartEnvelopesMeta", wjFlexChartEnvelopesMeta = {
                selector: 'wj-flex-chart-envelopes',
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
                    'period',
                    'size',
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
             * Angular 2 component for the @see:wijmo.chart.finance.analytics.Envelopes control.
             *
             * The <b>wj-flex-chart-envelopes</b> component must be
             * contained in a @see:wijmo/wijmo.angular2.chart.finance.WjFinancialChart component.
             *
             * Use the <b>wj-flex-chart-envelopes</b> component to add <b>Envelopes</b> controls to your
             * Angular 2 applications. For details about Angular 2 markup syntax, see
             * <a href="static/angular2Markup.html">Angular 2 Markup</a>.
             *
             * The <b>WjFlexChartEnvelopes</b> component is derived from the <b>Envelopes</b> control and
             * inherits all its properties, events and methods.
            */
            WjFlexChartEnvelopes = (function (_super) {
                __extends(WjFlexChartEnvelopes, _super);
                function WjFlexChartEnvelopes(elRef, injector, parentCmp) {
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
                WjFlexChartEnvelopes.prototype.created = function () {
                };
                WjFlexChartEnvelopes.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjFlexChartEnvelopes.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjFlexChartEnvelopes.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                return WjFlexChartEnvelopes;
            }(wjcChartFinanceAnalytics.Envelopes));
            WjFlexChartEnvelopes.meta = {
                outputs: wjFlexChartEnvelopesMeta.outputs,
                changeEvents: {
                    'chart.seriesVisibilityChanged': ['visibility']
                },
                siblingId: 'series',
            };
            WjFlexChartEnvelopes.decorators = [
                { type: core_1.Component, args: [{
                            selector: wjFlexChartEnvelopesMeta.selector,
                            template: wjFlexChartEnvelopesMeta.template,
                            inputs: wjFlexChartEnvelopesMeta.inputs,
                            outputs: wjFlexChartEnvelopesMeta.outputs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjFlexChartEnvelopes; }) }
                            ].concat(wjFlexChartEnvelopesMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjFlexChartEnvelopes.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
            ]; };
            exports_1("WjFlexChartEnvelopes", WjFlexChartEnvelopes);
            moduleExports = [
                WjFlexChartFibonacci,
                WjFlexChartFibonacciArcs,
                WjFlexChartFibonacciFans,
                WjFlexChartFibonacciTimeZones,
                WjFlexChartAtr,
                WjFlexChartCci,
                WjFlexChartRsi,
                WjFlexChartWilliamsR,
                WjFlexChartMacd,
                WjFlexChartMacdHistogram,
                WjFlexChartStochastic,
                WjFlexChartBollingerBands,
                WjFlexChartEnvelopes
            ];
            WjChartFinanceAnalyticsModule = (function () {
                function WjChartFinanceAnalyticsModule() {
                }
                return WjChartFinanceAnalyticsModule;
            }());
            WjChartFinanceAnalyticsModule.decorators = [
                { type: core_1.NgModule, args: [{
                            imports: [wijmo_angular2_directiveBase_1.WjDirectiveBaseModule, common_1.CommonModule],
                            declarations: moduleExports.slice(),
                            exports: moduleExports.slice(),
                        },] },
            ];
            /** @nocollapse */
            WjChartFinanceAnalyticsModule.ctorParameters = function () { return []; };
            exports_1("WjChartFinanceAnalyticsModule", WjChartFinanceAnalyticsModule);
        }
    };
});
//# sourceMappingURL=wijmo.angular2.chart.finance.analytics.js.map