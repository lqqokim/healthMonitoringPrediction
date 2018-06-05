System.register(["wijmo/wijmo.chart.radar", "@angular/core", "@angular/common", "@angular/forms", "wijmo/wijmo.angular2.directiveBase"], function (exports_1, context_1) {
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
    var wjcChartRadar, core_1, core_2, core_3, common_1, forms_1, wijmo_angular2_directiveBase_1, wjFlexRadarMeta, WjFlexRadar, wjFlexRadarAxisMeta, WjFlexRadarAxis, wjFlexRadarSeriesMeta, WjFlexRadarSeries, moduleExports, WjChartRadarModule;
    return {
        setters: [
            function (wjcChartRadar_1) {
                wjcChartRadar = wjcChartRadar_1;
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
            exports_1("wjFlexRadarMeta", wjFlexRadarMeta = {
                selector: 'wj-flex-radar',
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
                    'startAngle',
                    'totalAngle',
                    'reversed',
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
             * Angular 2 component for the @see:wijmo.chart.radar.FlexRadar control.
             *
             * Use the <b>wj-flex-radar</b> component to add <b>FlexRadar</b> controls to your
             * Angular 2 applications. For details about Angular 2 markup syntax, see
             * <a href="static/angular2Markup.html">Angular 2 Markup</a>.
             *
             * The <b>WjFlexRadar</b> component is derived from the <b>FlexRadar</b> control and
             * inherits all its properties, events and methods.
             *
             * The <b>wj-flex-radar</b> component may contain the following child components:
             * @see:wijmo/wijmo.angular2.chart.animation.WjFlexChartAnimation
             * , @see:wijmo/wijmo.angular2.chart.radar.WjFlexRadarAxis
             * , @see:wijmo/wijmo.angular2.chart.radar.WjFlexRadarSeries
             *  and @see:wijmo/wijmo.angular2.chart.WjFlexChartLegend.
            */
            WjFlexRadar = (function (_super) {
                __extends(WjFlexRadar, _super);
                function WjFlexRadar(elRef, injector, parentCmp) {
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
                WjFlexRadar.prototype.created = function () {
                };
                WjFlexRadar.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjFlexRadar.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjFlexRadar.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                Object.defineProperty(WjFlexRadar.prototype, "tooltipContent", {
                    get: function () {
                        return this.tooltip.content;
                    },
                    set: function (value) {
                        this.tooltip.content = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(WjFlexRadar.prototype, "labelContent", {
                    get: function () {
                        return this.dataLabel.content;
                    },
                    set: function (value) {
                        this.dataLabel.content = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                return WjFlexRadar;
            }(wjcChartRadar.FlexRadar));
            WjFlexRadar.meta = {
                outputs: wjFlexRadarMeta.outputs,
                changeEvents: {
                    'selectionChanged': ['selection']
                },
            };
            WjFlexRadar.decorators = [
                { type: core_1.Component, args: [{
                            selector: wjFlexRadarMeta.selector,
                            template: wjFlexRadarMeta.template,
                            inputs: wjFlexRadarMeta.inputs,
                            outputs: wjFlexRadarMeta.outputs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjFlexRadar; }) }
                            ].concat(wjFlexRadarMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjFlexRadar.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
            ]; };
            exports_1("WjFlexRadar", WjFlexRadar);
            exports_1("wjFlexRadarAxisMeta", wjFlexRadarAxisMeta = {
                selector: 'wj-flex-radar-axis',
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
             * Angular 2 component for the @see:wijmo.chart.radar.FlexRadarAxis control.
             *
             * The <b>wj-flex-radar-axis</b> component must be
             * contained in one of the following components:
             * @see:wijmo/wijmo.angular2.chart.radar.WjFlexRadar
             *  or @see:wijmo/wijmo.angular2.chart.radar.WjFlexRadarSeries.
             *
             * Use the <b>wj-flex-radar-axis</b> component to add <b>FlexRadarAxis</b> controls to your
             * Angular 2 applications. For details about Angular 2 markup syntax, see
             * <a href="static/angular2Markup.html">Angular 2 Markup</a>.
             *
             * The <b>WjFlexRadarAxis</b> component is derived from the <b>FlexRadarAxis</b> control and
             * inherits all its properties, events and methods.
            */
            WjFlexRadarAxis = (function (_super) {
                __extends(WjFlexRadarAxis, _super);
                function WjFlexRadarAxis(elRef, injector, parentCmp) {
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
                WjFlexRadarAxis.prototype.created = function () {
                };
                WjFlexRadarAxis.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjFlexRadarAxis.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjFlexRadarAxis.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                return WjFlexRadarAxis;
            }(wjcChartRadar.FlexRadarAxis));
            WjFlexRadarAxis.meta = {
                outputs: wjFlexRadarAxisMeta.outputs,
            };
            WjFlexRadarAxis.decorators = [
                { type: core_1.Component, args: [{
                            selector: wjFlexRadarAxisMeta.selector,
                            template: wjFlexRadarAxisMeta.template,
                            inputs: wjFlexRadarAxisMeta.inputs,
                            outputs: wjFlexRadarAxisMeta.outputs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjFlexRadarAxis; }) }
                            ].concat(wjFlexRadarAxisMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjFlexRadarAxis.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
            ]; };
            exports_1("WjFlexRadarAxis", WjFlexRadarAxis);
            exports_1("wjFlexRadarSeriesMeta", wjFlexRadarSeriesMeta = {
                selector: 'wj-flex-radar-series',
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
             * Angular 2 component for the @see:wijmo.chart.radar.FlexRadarSeries control.
             *
             * The <b>wj-flex-radar-series</b> component must be
             * contained in a @see:wijmo/wijmo.angular2.chart.radar.WjFlexRadar component.
             *
             * Use the <b>wj-flex-radar-series</b> component to add <b>FlexRadarSeries</b> controls to your
             * Angular 2 applications. For details about Angular 2 markup syntax, see
             * <a href="static/angular2Markup.html">Angular 2 Markup</a>.
             *
             * The <b>WjFlexRadarSeries</b> component is derived from the <b>FlexRadarSeries</b> control and
             * inherits all its properties, events and methods.
             *
             * The <b>wj-flex-radar-series</b> component may contain a @see:wijmo/wijmo.angular2.chart.radar.WjFlexRadarAxis child component.
            */
            WjFlexRadarSeries = (function (_super) {
                __extends(WjFlexRadarSeries, _super);
                function WjFlexRadarSeries(elRef, injector, parentCmp) {
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
                WjFlexRadarSeries.prototype.created = function () {
                };
                WjFlexRadarSeries.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjFlexRadarSeries.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjFlexRadarSeries.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                return WjFlexRadarSeries;
            }(wjcChartRadar.FlexRadarSeries));
            WjFlexRadarSeries.meta = {
                outputs: wjFlexRadarSeriesMeta.outputs,
                changeEvents: {
                    'chart.seriesVisibilityChanged': ['visibility']
                },
                siblingId: 'series',
            };
            WjFlexRadarSeries.decorators = [
                { type: core_1.Component, args: [{
                            selector: wjFlexRadarSeriesMeta.selector,
                            template: wjFlexRadarSeriesMeta.template,
                            inputs: wjFlexRadarSeriesMeta.inputs,
                            outputs: wjFlexRadarSeriesMeta.outputs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjFlexRadarSeries; }) }
                            ].concat(wjFlexRadarSeriesMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjFlexRadarSeries.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
            ]; };
            exports_1("WjFlexRadarSeries", WjFlexRadarSeries);
            moduleExports = [
                WjFlexRadar,
                WjFlexRadarAxis,
                WjFlexRadarSeries
            ];
            WjChartRadarModule = (function () {
                function WjChartRadarModule() {
                }
                return WjChartRadarModule;
            }());
            WjChartRadarModule.decorators = [
                { type: core_1.NgModule, args: [{
                            imports: [wijmo_angular2_directiveBase_1.WjDirectiveBaseModule, common_1.CommonModule],
                            declarations: moduleExports.slice(),
                            exports: moduleExports.slice(),
                        },] },
            ];
            /** @nocollapse */
            WjChartRadarModule.ctorParameters = function () { return []; };
            exports_1("WjChartRadarModule", WjChartRadarModule);
        }
    };
});
//# sourceMappingURL=wijmo.angular2.chart.radar.js.map