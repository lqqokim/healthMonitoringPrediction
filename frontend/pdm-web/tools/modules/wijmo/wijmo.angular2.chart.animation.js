System.register(["wijmo/wijmo.chart.animation", "@angular/core", "@angular/common", "wijmo/wijmo.angular2.directiveBase"], function (exports_1, context_1) {
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
    var wjcChartAnimation, core_1, core_2, core_3, common_1, wijmo_angular2_directiveBase_1, wjFlexChartAnimationMeta, WjFlexChartAnimation, moduleExports, WjChartAnimationModule;
    return {
        setters: [
            function (wjcChartAnimation_1) {
                wjcChartAnimation = wjcChartAnimation_1;
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
            exports_1("wjFlexChartAnimationMeta", wjFlexChartAnimationMeta = {
                selector: 'wj-flex-chart-animation',
                template: "",
                inputs: [
                    'wjProperty',
                    'animationMode',
                    'easing',
                    'duration',
                    'axisAnimation',
                ],
                outputs: [
                    'initialized',
                ],
                providers: []
            });
            /**
             * Angular 2 component for the @see:wijmo.chart.animation.ChartAnimation control.
             *
             * The <b>wj-flex-chart-animation</b> component must be
             * contained in one of the following components:
             * @see:wijmo/wijmo.angular2.chart.WjFlexChart
             * , @see:wijmo/wijmo.angular2.chart.WjFlexPie
             * , @see:wijmo/wijmo.angular2.chart.finance.WjFinancialChart
             *  or @see:wijmo/wijmo.angular2.chart.radar.WjFlexRadar.
             *
             * Use the <b>wj-flex-chart-animation</b> component to add <b>ChartAnimation</b> controls to your
             * Angular 2 applications. For details about Angular 2 markup syntax, see
             * <a href="static/angular2Markup.html">Angular 2 Markup</a>.
             *
             * The <b>WjFlexChartAnimation</b> component is derived from the <b>ChartAnimation</b> control and
             * inherits all its properties, events and methods.
            */
            WjFlexChartAnimation = (function (_super) {
                __extends(WjFlexChartAnimation, _super);
                function WjFlexChartAnimation(elRef, injector, parentCmp) {
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
                WjFlexChartAnimation.prototype.created = function () {
                };
                WjFlexChartAnimation.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjFlexChartAnimation.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjFlexChartAnimation.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                return WjFlexChartAnimation;
            }(wjcChartAnimation.ChartAnimation));
            WjFlexChartAnimation.meta = {
                outputs: wjFlexChartAnimationMeta.outputs,
            };
            WjFlexChartAnimation.decorators = [
                { type: core_1.Component, args: [{
                            selector: wjFlexChartAnimationMeta.selector,
                            template: wjFlexChartAnimationMeta.template,
                            inputs: wjFlexChartAnimationMeta.inputs,
                            outputs: wjFlexChartAnimationMeta.outputs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjFlexChartAnimation; }) }
                            ].concat(wjFlexChartAnimationMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjFlexChartAnimation.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
            ]; };
            exports_1("WjFlexChartAnimation", WjFlexChartAnimation);
            moduleExports = [
                WjFlexChartAnimation
            ];
            WjChartAnimationModule = (function () {
                function WjChartAnimationModule() {
                }
                return WjChartAnimationModule;
            }());
            WjChartAnimationModule.decorators = [
                { type: core_1.NgModule, args: [{
                            imports: [wijmo_angular2_directiveBase_1.WjDirectiveBaseModule, common_1.CommonModule],
                            declarations: moduleExports.slice(),
                            exports: moduleExports.slice(),
                        },] },
            ];
            /** @nocollapse */
            WjChartAnimationModule.ctorParameters = function () { return []; };
            exports_1("WjChartAnimationModule", WjChartAnimationModule);
        }
    };
});
//# sourceMappingURL=wijmo.angular2.chart.animation.js.map