System.register(["wijmo/wijmo.chart.annotation", "@angular/core", "@angular/common", "wijmo/wijmo.angular2.directiveBase"], function (exports_1, context_1) {
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
    var wjcChartAnnotation, core_1, core_2, core_3, common_1, wijmo_angular2_directiveBase_1, wjFlexChartAnnotationLayerMeta, WjFlexChartAnnotationLayer, wjFlexChartAnnotationTextMeta, WjFlexChartAnnotationText, wjFlexChartAnnotationEllipseMeta, WjFlexChartAnnotationEllipse, wjFlexChartAnnotationRectangleMeta, WjFlexChartAnnotationRectangle, wjFlexChartAnnotationLineMeta, WjFlexChartAnnotationLine, wjFlexChartAnnotationPolygonMeta, WjFlexChartAnnotationPolygon, wjFlexChartAnnotationCircleMeta, WjFlexChartAnnotationCircle, wjFlexChartAnnotationSquareMeta, WjFlexChartAnnotationSquare, wjFlexChartAnnotationImageMeta, WjFlexChartAnnotationImage, moduleExports, WjChartAnnotationModule;
    return {
        setters: [
            function (wjcChartAnnotation_1) {
                wjcChartAnnotation = wjcChartAnnotation_1;
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
            exports_1("wjFlexChartAnnotationLayerMeta", wjFlexChartAnnotationLayerMeta = {
                selector: 'wj-flex-chart-annotation-layer',
                template: "<div><ng-content></ng-content></div>",
                inputs: [
                    'wjProperty',
                ],
                outputs: [
                    'initialized',
                ],
                providers: []
            });
            /**
             * Angular 2 component for the @see:wijmo.chart.annotation.AnnotationLayer control.
             *
             * The <b>wj-flex-chart-annotation-layer</b> component must be
             * contained in one of the following components:
             * @see:wijmo/wijmo.angular2.chart.WjFlexChart
             *  or @see:wijmo/wijmo.angular2.chart.finance.WjFinancialChart.
             *
             * Use the <b>wj-flex-chart-annotation-layer</b> component to add <b>AnnotationLayer</b> controls to your
             * Angular 2 applications. For details about Angular 2 markup syntax, see
             * <a href="static/angular2Markup.html">Angular 2 Markup</a>.
             ** The <b>WjFlexChartAnnotationLayer</b> component is derived from the <b>AnnotationLayer</b> control and
             * inherits all its properties, events and methods.
             *
             * The <b>wj-flex-chart-annotation-layer</b> component may contain the following child components:
             * @see:wijmo/wijmo.angular2.chart.annotation.WjFlexChartAnnotationText
             * , @see:wijmo/wijmo.angular2.chart.annotation.WjFlexChartAnnotationEllipse
             * , @see:wijmo/wijmo.angular2.chart.annotation.WjFlexChartAnnotationRectangle
             * , @see:wijmo/wijmo.angular2.chart.annotation.WjFlexChartAnnotationLine
             * , @see:wijmo/wijmo.angular2.chart.annotation.WjFlexChartAnnotationPolygon
             * , @see:wijmo/wijmo.angular2.chart.annotation.WjFlexChartAnnotationCircle
             * , @see:wijmo/wijmo.angular2.chart.annotation.WjFlexChartAnnotationSquare
             *  and @see:wijmo/wijmo.angular2.chart.annotation.WjFlexChartAnnotationImage.
            */
            WjFlexChartAnnotationLayer = (function (_super) {
                __extends(WjFlexChartAnnotationLayer, _super);
                function WjFlexChartAnnotationLayer(elRef, injector, parentCmp) {
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
                WjFlexChartAnnotationLayer.prototype.created = function () {
                };
                WjFlexChartAnnotationLayer.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjFlexChartAnnotationLayer.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjFlexChartAnnotationLayer.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                return WjFlexChartAnnotationLayer;
            }(wjcChartAnnotation.AnnotationLayer));
            WjFlexChartAnnotationLayer.meta = {
                outputs: wjFlexChartAnnotationLayerMeta.outputs,
            };
            WjFlexChartAnnotationLayer.decorators = [
                { type: core_1.Component, args: [{
                            selector: wjFlexChartAnnotationLayerMeta.selector,
                            template: wjFlexChartAnnotationLayerMeta.template,
                            inputs: wjFlexChartAnnotationLayerMeta.inputs,
                            outputs: wjFlexChartAnnotationLayerMeta.outputs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjFlexChartAnnotationLayer; }) }
                            ].concat(wjFlexChartAnnotationLayerMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjFlexChartAnnotationLayer.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
            ]; };
            exports_1("WjFlexChartAnnotationLayer", WjFlexChartAnnotationLayer);
            exports_1("wjFlexChartAnnotationTextMeta", wjFlexChartAnnotationTextMeta = {
                selector: 'wj-flex-chart-annotation-text',
                template: "<div><ng-content></ng-content></div>",
                inputs: [
                    'wjProperty',
                    'type',
                    'attachment',
                    'position',
                    'point',
                    'seriesIndex',
                    'pointIndex',
                    'offset',
                    'style',
                    'isVisible',
                    'tooltip',
                    'text',
                    'content',
                    'name',
                    'width',
                    'height',
                    'start',
                    'end',
                    'radius',
                    'length',
                    'href',
                ],
                outputs: [
                    'initialized',
                ],
                providers: []
            });
            /**
             * Angular 2 component for the @see:wijmo.chart.annotation.Text control.
             *
             * The <b>wj-flex-chart-annotation-text</b> component must be
             * contained in a @see:wijmo/wijmo.angular2.chart.annotation.WjFlexChartAnnotationLayer component.
             *
             * Use the <b>wj-flex-chart-annotation-text</b> component to add <b>Text</b> controls to your
             * Angular 2 applications. For details about Angular 2 markup syntax, see
             * <a href="static/angular2Markup.html">Angular 2 Markup</a>.
             ** The <b>WjFlexChartAnnotationText</b> component is derived from the <b>Text</b> control and
             * inherits all its properties, events and methods.
             *
             * The <b>wj-flex-chart-annotation-text</b> component may contain a @see:wijmo/wijmo.angular2.chart.WjFlexChartDataPoint child component.
            */
            WjFlexChartAnnotationText = (function (_super) {
                __extends(WjFlexChartAnnotationText, _super);
                function WjFlexChartAnnotationText(elRef, injector, parentCmp) {
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
                     * Default value is 'items'.
                     */
                    _this.wjProperty = 'items';
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
                WjFlexChartAnnotationText.prototype.created = function () {
                };
                WjFlexChartAnnotationText.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjFlexChartAnnotationText.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjFlexChartAnnotationText.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                return WjFlexChartAnnotationText;
            }(wjcChartAnnotation.Text));
            WjFlexChartAnnotationText.meta = {
                outputs: wjFlexChartAnnotationTextMeta.outputs,
            };
            WjFlexChartAnnotationText.decorators = [
                { type: core_1.Component, args: [{
                            selector: wjFlexChartAnnotationTextMeta.selector,
                            template: wjFlexChartAnnotationTextMeta.template,
                            inputs: wjFlexChartAnnotationTextMeta.inputs,
                            outputs: wjFlexChartAnnotationTextMeta.outputs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjFlexChartAnnotationText; }) }
                            ].concat(wjFlexChartAnnotationTextMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjFlexChartAnnotationText.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
            ]; };
            exports_1("WjFlexChartAnnotationText", WjFlexChartAnnotationText);
            exports_1("wjFlexChartAnnotationEllipseMeta", wjFlexChartAnnotationEllipseMeta = {
                selector: 'wj-flex-chart-annotation-ellipse',
                template: "<div><ng-content></ng-content></div>",
                inputs: [
                    'wjProperty',
                    'type',
                    'attachment',
                    'position',
                    'point',
                    'seriesIndex',
                    'pointIndex',
                    'offset',
                    'style',
                    'isVisible',
                    'tooltip',
                    'text',
                    'content',
                    'name',
                    'width',
                    'height',
                    'start',
                    'end',
                    'radius',
                    'length',
                    'href',
                ],
                outputs: [
                    'initialized',
                ],
                providers: []
            });
            /**
             * Angular 2 component for the @see:wijmo.chart.annotation.Ellipse control.
             *
             * The <b>wj-flex-chart-annotation-ellipse</b> component must be
             * contained in a @see:wijmo/wijmo.angular2.chart.annotation.WjFlexChartAnnotationLayer component.
             *
             * Use the <b>wj-flex-chart-annotation-ellipse</b> component to add <b>Ellipse</b> controls to your
             * Angular 2 applications. For details about Angular 2 markup syntax, see
             * <a href="static/angular2Markup.html">Angular 2 Markup</a>.
             ** The <b>WjFlexChartAnnotationEllipse</b> component is derived from the <b>Ellipse</b> control and
             * inherits all its properties, events and methods.
             *
             * The <b>wj-flex-chart-annotation-ellipse</b> component may contain a @see:wijmo/wijmo.angular2.chart.WjFlexChartDataPoint child component.
            */
            WjFlexChartAnnotationEllipse = (function (_super) {
                __extends(WjFlexChartAnnotationEllipse, _super);
                function WjFlexChartAnnotationEllipse(elRef, injector, parentCmp) {
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
                     * Default value is 'items'.
                     */
                    _this.wjProperty = 'items';
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
                WjFlexChartAnnotationEllipse.prototype.created = function () {
                };
                WjFlexChartAnnotationEllipse.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjFlexChartAnnotationEllipse.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjFlexChartAnnotationEllipse.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                return WjFlexChartAnnotationEllipse;
            }(wjcChartAnnotation.Ellipse));
            WjFlexChartAnnotationEllipse.meta = {
                outputs: wjFlexChartAnnotationEllipseMeta.outputs,
            };
            WjFlexChartAnnotationEllipse.decorators = [
                { type: core_1.Component, args: [{
                            selector: wjFlexChartAnnotationEllipseMeta.selector,
                            template: wjFlexChartAnnotationEllipseMeta.template,
                            inputs: wjFlexChartAnnotationEllipseMeta.inputs,
                            outputs: wjFlexChartAnnotationEllipseMeta.outputs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjFlexChartAnnotationEllipse; }) }
                            ].concat(wjFlexChartAnnotationEllipseMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjFlexChartAnnotationEllipse.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
            ]; };
            exports_1("WjFlexChartAnnotationEllipse", WjFlexChartAnnotationEllipse);
            exports_1("wjFlexChartAnnotationRectangleMeta", wjFlexChartAnnotationRectangleMeta = {
                selector: 'wj-flex-chart-annotation-rectangle',
                template: "<div><ng-content></ng-content></div>",
                inputs: [
                    'wjProperty',
                    'type',
                    'attachment',
                    'position',
                    'point',
                    'seriesIndex',
                    'pointIndex',
                    'offset',
                    'style',
                    'isVisible',
                    'tooltip',
                    'text',
                    'content',
                    'name',
                    'width',
                    'height',
                    'start',
                    'end',
                    'radius',
                    'length',
                    'href',
                ],
                outputs: [
                    'initialized',
                ],
                providers: []
            });
            /**
             * Angular 2 component for the @see:wijmo.chart.annotation.Rectangle control.
             *
             * The <b>wj-flex-chart-annotation-rectangle</b> component must be
             * contained in a @see:wijmo/wijmo.angular2.chart.annotation.WjFlexChartAnnotationLayer component.
             *
             * Use the <b>wj-flex-chart-annotation-rectangle</b> component to add <b>Rectangle</b> controls to your
             * Angular 2 applications. For details about Angular 2 markup syntax, see
             * <a href="static/angular2Markup.html">Angular 2 Markup</a>.
             ** The <b>WjFlexChartAnnotationRectangle</b> component is derived from the <b>Rectangle</b> control and
             * inherits all its properties, events and methods.
             *
             * The <b>wj-flex-chart-annotation-rectangle</b> component may contain a @see:wijmo/wijmo.angular2.chart.WjFlexChartDataPoint child component.
            */
            WjFlexChartAnnotationRectangle = (function (_super) {
                __extends(WjFlexChartAnnotationRectangle, _super);
                function WjFlexChartAnnotationRectangle(elRef, injector, parentCmp) {
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
                     * Default value is 'items'.
                     */
                    _this.wjProperty = 'items';
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
                WjFlexChartAnnotationRectangle.prototype.created = function () {
                };
                WjFlexChartAnnotationRectangle.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjFlexChartAnnotationRectangle.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjFlexChartAnnotationRectangle.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                return WjFlexChartAnnotationRectangle;
            }(wjcChartAnnotation.Rectangle));
            WjFlexChartAnnotationRectangle.meta = {
                outputs: wjFlexChartAnnotationRectangleMeta.outputs,
            };
            WjFlexChartAnnotationRectangle.decorators = [
                { type: core_1.Component, args: [{
                            selector: wjFlexChartAnnotationRectangleMeta.selector,
                            template: wjFlexChartAnnotationRectangleMeta.template,
                            inputs: wjFlexChartAnnotationRectangleMeta.inputs,
                            outputs: wjFlexChartAnnotationRectangleMeta.outputs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjFlexChartAnnotationRectangle; }) }
                            ].concat(wjFlexChartAnnotationRectangleMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjFlexChartAnnotationRectangle.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
            ]; };
            exports_1("WjFlexChartAnnotationRectangle", WjFlexChartAnnotationRectangle);
            exports_1("wjFlexChartAnnotationLineMeta", wjFlexChartAnnotationLineMeta = {
                selector: 'wj-flex-chart-annotation-line',
                template: "<div><ng-content></ng-content></div>",
                inputs: [
                    'wjProperty',
                    'type',
                    'attachment',
                    'position',
                    'point',
                    'seriesIndex',
                    'pointIndex',
                    'offset',
                    'style',
                    'isVisible',
                    'tooltip',
                    'text',
                    'content',
                    'name',
                    'width',
                    'height',
                    'start',
                    'end',
                    'radius',
                    'length',
                    'href',
                ],
                outputs: [
                    'initialized',
                ],
                providers: []
            });
            /**
             * Angular 2 component for the @see:wijmo.chart.annotation.Line control.
             *
             * The <b>wj-flex-chart-annotation-line</b> component must be
             * contained in a @see:wijmo/wijmo.angular2.chart.annotation.WjFlexChartAnnotationLayer component.
             *
             * Use the <b>wj-flex-chart-annotation-line</b> component to add <b>Line</b> controls to your
             * Angular 2 applications. For details about Angular 2 markup syntax, see
             * <a href="static/angular2Markup.html">Angular 2 Markup</a>.
             ** The <b>WjFlexChartAnnotationLine</b> component is derived from the <b>Line</b> control and
             * inherits all its properties, events and methods.
             *
             * The <b>wj-flex-chart-annotation-line</b> component may contain a @see:wijmo/wijmo.angular2.chart.WjFlexChartDataPoint child component.
            */
            WjFlexChartAnnotationLine = (function (_super) {
                __extends(WjFlexChartAnnotationLine, _super);
                function WjFlexChartAnnotationLine(elRef, injector, parentCmp) {
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
                     * Default value is 'items'.
                     */
                    _this.wjProperty = 'items';
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
                WjFlexChartAnnotationLine.prototype.created = function () {
                };
                WjFlexChartAnnotationLine.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjFlexChartAnnotationLine.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjFlexChartAnnotationLine.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                return WjFlexChartAnnotationLine;
            }(wjcChartAnnotation.Line));
            WjFlexChartAnnotationLine.meta = {
                outputs: wjFlexChartAnnotationLineMeta.outputs,
            };
            WjFlexChartAnnotationLine.decorators = [
                { type: core_1.Component, args: [{
                            selector: wjFlexChartAnnotationLineMeta.selector,
                            template: wjFlexChartAnnotationLineMeta.template,
                            inputs: wjFlexChartAnnotationLineMeta.inputs,
                            outputs: wjFlexChartAnnotationLineMeta.outputs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjFlexChartAnnotationLine; }) }
                            ].concat(wjFlexChartAnnotationLineMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjFlexChartAnnotationLine.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
            ]; };
            exports_1("WjFlexChartAnnotationLine", WjFlexChartAnnotationLine);
            exports_1("wjFlexChartAnnotationPolygonMeta", wjFlexChartAnnotationPolygonMeta = {
                selector: 'wj-flex-chart-annotation-polygon',
                template: "<div><ng-content></ng-content></div>",
                inputs: [
                    'wjProperty',
                    'type',
                    'attachment',
                    'position',
                    'point',
                    'seriesIndex',
                    'pointIndex',
                    'offset',
                    'style',
                    'isVisible',
                    'tooltip',
                    'text',
                    'content',
                    'name',
                    'width',
                    'height',
                    'start',
                    'end',
                    'radius',
                    'length',
                    'href',
                ],
                outputs: [
                    'initialized',
                ],
                providers: []
            });
            /**
             * Angular 2 component for the @see:wijmo.chart.annotation.Polygon control.
             *
             * The <b>wj-flex-chart-annotation-polygon</b> component must be
             * contained in a @see:wijmo/wijmo.angular2.chart.annotation.WjFlexChartAnnotationLayer component.
             *
             * Use the <b>wj-flex-chart-annotation-polygon</b> component to add <b>Polygon</b> controls to your
             * Angular 2 applications. For details about Angular 2 markup syntax, see
             * <a href="static/angular2Markup.html">Angular 2 Markup</a>.
             ** The <b>WjFlexChartAnnotationPolygon</b> component is derived from the <b>Polygon</b> control and
             * inherits all its properties, events and methods.
             *
             * The <b>wj-flex-chart-annotation-polygon</b> component may contain a @see:wijmo/wijmo.angular2.chart.WjFlexChartDataPoint child component.
            */
            WjFlexChartAnnotationPolygon = (function (_super) {
                __extends(WjFlexChartAnnotationPolygon, _super);
                function WjFlexChartAnnotationPolygon(elRef, injector, parentCmp) {
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
                     * Default value is 'items'.
                     */
                    _this.wjProperty = 'items';
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
                WjFlexChartAnnotationPolygon.prototype.created = function () {
                };
                WjFlexChartAnnotationPolygon.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjFlexChartAnnotationPolygon.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjFlexChartAnnotationPolygon.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                return WjFlexChartAnnotationPolygon;
            }(wjcChartAnnotation.Polygon));
            WjFlexChartAnnotationPolygon.meta = {
                outputs: wjFlexChartAnnotationPolygonMeta.outputs,
            };
            WjFlexChartAnnotationPolygon.decorators = [
                { type: core_1.Component, args: [{
                            selector: wjFlexChartAnnotationPolygonMeta.selector,
                            template: wjFlexChartAnnotationPolygonMeta.template,
                            inputs: wjFlexChartAnnotationPolygonMeta.inputs,
                            outputs: wjFlexChartAnnotationPolygonMeta.outputs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjFlexChartAnnotationPolygon; }) }
                            ].concat(wjFlexChartAnnotationPolygonMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjFlexChartAnnotationPolygon.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
            ]; };
            exports_1("WjFlexChartAnnotationPolygon", WjFlexChartAnnotationPolygon);
            exports_1("wjFlexChartAnnotationCircleMeta", wjFlexChartAnnotationCircleMeta = {
                selector: 'wj-flex-chart-annotation-circle',
                template: "<div><ng-content></ng-content></div>",
                inputs: [
                    'wjProperty',
                    'type',
                    'attachment',
                    'position',
                    'point',
                    'seriesIndex',
                    'pointIndex',
                    'offset',
                    'style',
                    'isVisible',
                    'tooltip',
                    'text',
                    'content',
                    'name',
                    'width',
                    'height',
                    'start',
                    'end',
                    'radius',
                    'length',
                    'href',
                ],
                outputs: [
                    'initialized',
                ],
                providers: []
            });
            /**
             * Angular 2 component for the @see:wijmo.chart.annotation.Circle control.
             *
             * The <b>wj-flex-chart-annotation-circle</b> component must be
             * contained in a @see:wijmo/wijmo.angular2.chart.annotation.WjFlexChartAnnotationLayer component.
             *
             * Use the <b>wj-flex-chart-annotation-circle</b> component to add <b>Circle</b> controls to your
             * Angular 2 applications. For details about Angular 2 markup syntax, see
             * <a href="static/angular2Markup.html">Angular 2 Markup</a>.
             ** The <b>WjFlexChartAnnotationCircle</b> component is derived from the <b>Circle</b> control and
             * inherits all its properties, events and methods.
             *
             * The <b>wj-flex-chart-annotation-circle</b> component may contain a @see:wijmo/wijmo.angular2.chart.WjFlexChartDataPoint child component.
            */
            WjFlexChartAnnotationCircle = (function (_super) {
                __extends(WjFlexChartAnnotationCircle, _super);
                function WjFlexChartAnnotationCircle(elRef, injector, parentCmp) {
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
                     * Default value is 'items'.
                     */
                    _this.wjProperty = 'items';
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
                WjFlexChartAnnotationCircle.prototype.created = function () {
                };
                WjFlexChartAnnotationCircle.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjFlexChartAnnotationCircle.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjFlexChartAnnotationCircle.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                return WjFlexChartAnnotationCircle;
            }(wjcChartAnnotation.Circle));
            WjFlexChartAnnotationCircle.meta = {
                outputs: wjFlexChartAnnotationCircleMeta.outputs,
            };
            WjFlexChartAnnotationCircle.decorators = [
                { type: core_1.Component, args: [{
                            selector: wjFlexChartAnnotationCircleMeta.selector,
                            template: wjFlexChartAnnotationCircleMeta.template,
                            inputs: wjFlexChartAnnotationCircleMeta.inputs,
                            outputs: wjFlexChartAnnotationCircleMeta.outputs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjFlexChartAnnotationCircle; }) }
                            ].concat(wjFlexChartAnnotationCircleMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjFlexChartAnnotationCircle.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
            ]; };
            exports_1("WjFlexChartAnnotationCircle", WjFlexChartAnnotationCircle);
            exports_1("wjFlexChartAnnotationSquareMeta", wjFlexChartAnnotationSquareMeta = {
                selector: 'wj-flex-chart-annotation-square',
                template: "<div><ng-content></ng-content></div>",
                inputs: [
                    'wjProperty',
                    'type',
                    'attachment',
                    'position',
                    'point',
                    'seriesIndex',
                    'pointIndex',
                    'offset',
                    'style',
                    'isVisible',
                    'tooltip',
                    'text',
                    'content',
                    'name',
                    'width',
                    'height',
                    'start',
                    'end',
                    'radius',
                    'length',
                    'href',
                ],
                outputs: [
                    'initialized',
                ],
                providers: []
            });
            /**
             * Angular 2 component for the @see:wijmo.chart.annotation.Square control.
             *
             * The <b>wj-flex-chart-annotation-square</b> component must be
             * contained in a @see:wijmo/wijmo.angular2.chart.annotation.WjFlexChartAnnotationLayer component.
             *
             * Use the <b>wj-flex-chart-annotation-square</b> component to add <b>Square</b> controls to your
             * Angular 2 applications. For details about Angular 2 markup syntax, see
             * <a href="static/angular2Markup.html">Angular 2 Markup</a>.
             ** The <b>WjFlexChartAnnotationSquare</b> component is derived from the <b>Square</b> control and
             * inherits all its properties, events and methods.
             *
             * The <b>wj-flex-chart-annotation-square</b> component may contain a @see:wijmo/wijmo.angular2.chart.WjFlexChartDataPoint child component.
            */
            WjFlexChartAnnotationSquare = (function (_super) {
                __extends(WjFlexChartAnnotationSquare, _super);
                function WjFlexChartAnnotationSquare(elRef, injector, parentCmp) {
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
                     * Default value is 'items'.
                     */
                    _this.wjProperty = 'items';
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
                WjFlexChartAnnotationSquare.prototype.created = function () {
                };
                WjFlexChartAnnotationSquare.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjFlexChartAnnotationSquare.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjFlexChartAnnotationSquare.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                return WjFlexChartAnnotationSquare;
            }(wjcChartAnnotation.Square));
            WjFlexChartAnnotationSquare.meta = {
                outputs: wjFlexChartAnnotationSquareMeta.outputs,
            };
            WjFlexChartAnnotationSquare.decorators = [
                { type: core_1.Component, args: [{
                            selector: wjFlexChartAnnotationSquareMeta.selector,
                            template: wjFlexChartAnnotationSquareMeta.template,
                            inputs: wjFlexChartAnnotationSquareMeta.inputs,
                            outputs: wjFlexChartAnnotationSquareMeta.outputs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjFlexChartAnnotationSquare; }) }
                            ].concat(wjFlexChartAnnotationSquareMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjFlexChartAnnotationSquare.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
            ]; };
            exports_1("WjFlexChartAnnotationSquare", WjFlexChartAnnotationSquare);
            exports_1("wjFlexChartAnnotationImageMeta", wjFlexChartAnnotationImageMeta = {
                selector: 'wj-flex-chart-annotation-image',
                template: "<div><ng-content></ng-content></div>",
                inputs: [
                    'wjProperty',
                    'type',
                    'attachment',
                    'position',
                    'point',
                    'seriesIndex',
                    'pointIndex',
                    'offset',
                    'style',
                    'isVisible',
                    'tooltip',
                    'text',
                    'content',
                    'name',
                    'width',
                    'height',
                    'start',
                    'end',
                    'radius',
                    'length',
                    'href',
                ],
                outputs: [
                    'initialized',
                ],
                providers: []
            });
            /**
             * Angular 2 component for the @see:wijmo.chart.annotation.Image control.
             *
             * The <b>wj-flex-chart-annotation-image</b> component must be
             * contained in a @see:wijmo/wijmo.angular2.chart.annotation.WjFlexChartAnnotationLayer component.
             *
             * Use the <b>wj-flex-chart-annotation-image</b> component to add <b>Image</b> controls to your
             * Angular 2 applications. For details about Angular 2 markup syntax, see
             * <a href="static/angular2Markup.html">Angular 2 Markup</a>.
             ** The <b>WjFlexChartAnnotationImage</b> component is derived from the <b>Image</b> control and
             * inherits all its properties, events and methods.
             *
             * The <b>wj-flex-chart-annotation-image</b> component may contain a @see:wijmo/wijmo.angular2.chart.WjFlexChartDataPoint child component.
            */
            WjFlexChartAnnotationImage = (function (_super) {
                __extends(WjFlexChartAnnotationImage, _super);
                function WjFlexChartAnnotationImage(elRef, injector, parentCmp) {
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
                     * Default value is 'items'.
                     */
                    _this.wjProperty = 'items';
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
                WjFlexChartAnnotationImage.prototype.created = function () {
                };
                WjFlexChartAnnotationImage.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjFlexChartAnnotationImage.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjFlexChartAnnotationImage.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                return WjFlexChartAnnotationImage;
            }(wjcChartAnnotation.Image));
            WjFlexChartAnnotationImage.meta = {
                outputs: wjFlexChartAnnotationImageMeta.outputs,
            };
            WjFlexChartAnnotationImage.decorators = [
                { type: core_1.Component, args: [{
                            selector: wjFlexChartAnnotationImageMeta.selector,
                            template: wjFlexChartAnnotationImageMeta.template,
                            inputs: wjFlexChartAnnotationImageMeta.inputs,
                            outputs: wjFlexChartAnnotationImageMeta.outputs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjFlexChartAnnotationImage; }) }
                            ].concat(wjFlexChartAnnotationImageMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjFlexChartAnnotationImage.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
            ]; };
            exports_1("WjFlexChartAnnotationImage", WjFlexChartAnnotationImage);
            moduleExports = [
                WjFlexChartAnnotationLayer,
                WjFlexChartAnnotationText,
                WjFlexChartAnnotationEllipse,
                WjFlexChartAnnotationRectangle,
                WjFlexChartAnnotationLine,
                WjFlexChartAnnotationPolygon,
                WjFlexChartAnnotationCircle,
                WjFlexChartAnnotationSquare,
                WjFlexChartAnnotationImage
            ];
            WjChartAnnotationModule = (function () {
                function WjChartAnnotationModule() {
                }
                return WjChartAnnotationModule;
            }());
            WjChartAnnotationModule.decorators = [
                { type: core_1.NgModule, args: [{
                            imports: [wijmo_angular2_directiveBase_1.WjDirectiveBaseModule, common_1.CommonModule],
                            declarations: moduleExports.slice(),
                            exports: moduleExports.slice(),
                        },] },
            ];
            /** @nocollapse */
            WjChartAnnotationModule.ctorParameters = function () { return []; };
            exports_1("WjChartAnnotationModule", WjChartAnnotationModule);
        }
    };
});
//# sourceMappingURL=wijmo.angular2.chart.annotation.js.map