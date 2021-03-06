System.register(["wijmo/wijmo.chart.interaction", "@angular/core", "@angular/common", "wijmo/wijmo.angular2.directiveBase"], function (exports_1, context_1) {
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
    var wjcChartInteraction, core_1, core_2, core_3, common_1, wijmo_angular2_directiveBase_1, wjFlexChartRangeSelectorMeta, WjFlexChartRangeSelector, wjFlexChartGesturesMeta, WjFlexChartGestures, moduleExports, WjChartInteractionModule;
    return {
        setters: [
            function (wjcChartInteraction_1) {
                wjcChartInteraction = wjcChartInteraction_1;
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
            exports_1("wjFlexChartRangeSelectorMeta", wjFlexChartRangeSelectorMeta = {
                selector: 'wj-flex-chart-range-selector',
                template: "",
                inputs: [
                    'wjProperty',
                    'isVisible',
                    'min',
                    'max',
                    'orientation',
                    'seamless',
                    'minScale',
                    'maxScale',
                ],
                outputs: [
                    'initialized',
                    'rangeChangedNg: rangeChanged',
                ],
                providers: []
            });
            /**
             * Angular 2 component for the @see:wijmo.chart.interaction.RangeSelector control.
             *
             * The <b>wj-flex-chart-range-selector</b> component must be
             * contained in one of the following components:
             * @see:wijmo/wijmo.angular2.chart.WjFlexChart
             *  or @see:wijmo/wijmo.angular2.chart.finance.WjFinancialChart.
             *
             * Use the <b>wj-flex-chart-range-selector</b> component to add <b>RangeSelector</b> controls to your
             * Angular 2 applications. For details about Angular 2 markup syntax, see
             * <a href="static/angular2Markup.html">Angular 2 Markup</a>.
             *
             * The <b>WjFlexChartRangeSelector</b> component is derived from the <b>RangeSelector</b> control and
             * inherits all its properties, events and methods.
            */
            WjFlexChartRangeSelector = (function (_super) {
                __extends(WjFlexChartRangeSelector, _super);
                function WjFlexChartRangeSelector(elRef, injector, parentCmp) {
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
                WjFlexChartRangeSelector.prototype.created = function () {
                };
                WjFlexChartRangeSelector.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjFlexChartRangeSelector.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjFlexChartRangeSelector.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                return WjFlexChartRangeSelector;
            }(wjcChartInteraction.RangeSelector));
            WjFlexChartRangeSelector.meta = {
                outputs: wjFlexChartRangeSelectorMeta.outputs,
            };
            WjFlexChartRangeSelector.decorators = [
                { type: core_1.Component, args: [{
                            selector: wjFlexChartRangeSelectorMeta.selector,
                            template: wjFlexChartRangeSelectorMeta.template,
                            inputs: wjFlexChartRangeSelectorMeta.inputs,
                            outputs: wjFlexChartRangeSelectorMeta.outputs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjFlexChartRangeSelector; }) }
                            ].concat(wjFlexChartRangeSelectorMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjFlexChartRangeSelector.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
            ]; };
            exports_1("WjFlexChartRangeSelector", WjFlexChartRangeSelector);
            exports_1("wjFlexChartGesturesMeta", wjFlexChartGesturesMeta = {
                selector: 'wj-flex-chart-gestures',
                template: "",
                inputs: [
                    'wjProperty',
                    'mouseAction',
                    'interactiveAxes',
                    'enable',
                    'scaleX',
                    'scaleY',
                    'posX',
                    'posY',
                ],
                outputs: [
                    'initialized',
                ],
                providers: []
            });
            /**
             * Angular 2 component for the @see:wijmo.chart.interaction.ChartGestures control.
             *
             * The <b>wj-flex-chart-gestures</b> component must be
             * contained in one of the following components:
             * @see:wijmo/wijmo.angular2.chart.WjFlexChart
             *  or @see:wijmo/wijmo.angular2.chart.finance.WjFinancialChart.
             *
             * Use the <b>wj-flex-chart-gestures</b> component to add <b>ChartGestures</b> controls to your
             * Angular 2 applications. For details about Angular 2 markup syntax, see
             * <a href="static/angular2Markup.html">Angular 2 Markup</a>.
             *
             * The <b>WjFlexChartGestures</b> component is derived from the <b>ChartGestures</b> control and
             * inherits all its properties, events and methods.
            */
            WjFlexChartGestures = (function (_super) {
                __extends(WjFlexChartGestures, _super);
                function WjFlexChartGestures(elRef, injector, parentCmp) {
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
                WjFlexChartGestures.prototype.created = function () {
                };
                WjFlexChartGestures.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjFlexChartGestures.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjFlexChartGestures.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                return WjFlexChartGestures;
            }(wjcChartInteraction.ChartGestures));
            WjFlexChartGestures.meta = {
                outputs: wjFlexChartGesturesMeta.outputs,
            };
            WjFlexChartGestures.decorators = [
                { type: core_1.Component, args: [{
                            selector: wjFlexChartGesturesMeta.selector,
                            template: wjFlexChartGesturesMeta.template,
                            inputs: wjFlexChartGesturesMeta.inputs,
                            outputs: wjFlexChartGesturesMeta.outputs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjFlexChartGestures; }) }
                            ].concat(wjFlexChartGesturesMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjFlexChartGestures.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
            ]; };
            exports_1("WjFlexChartGestures", WjFlexChartGestures);
            moduleExports = [
                WjFlexChartRangeSelector,
                WjFlexChartGestures
            ];
            WjChartInteractionModule = (function () {
                function WjChartInteractionModule() {
                }
                return WjChartInteractionModule;
            }());
            WjChartInteractionModule.decorators = [
                { type: core_1.NgModule, args: [{
                            imports: [wijmo_angular2_directiveBase_1.WjDirectiveBaseModule, common_1.CommonModule],
                            declarations: moduleExports.slice(),
                            exports: moduleExports.slice(),
                        },] },
            ];
            /** @nocollapse */
            WjChartInteractionModule.ctorParameters = function () { return []; };
            exports_1("WjChartInteractionModule", WjChartInteractionModule);
        }
    };
});
//# sourceMappingURL=wijmo.angular2.chart.interaction.js.map