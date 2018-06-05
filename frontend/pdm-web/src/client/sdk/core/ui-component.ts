import { AfterViewInit, ComponentRef, Input, OnChanges, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

export class UIComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

    element: HTMLElement;

    private _uuid: string;
    private _class: string;
    private _width: number;
    private _height: number;
    private _visible: boolean = true;
    private _disabled: boolean = false;
    private __subscriptions__: Subscription[] = [];
    private __cmps__: ComponentRef<any>[] = [];

    @Input()
    set uuid(value: string) {
        this._uuid = value;
        this._setIdAttribute();
    }
    get uuid(): string {
        return this._uuid;
    }

    @Input()
    set class(value: string) {
        this._class = value;
    }
    get class() {
        return this._class;
    }

    @Input()
    set width(value: number) {
        this._width = value;
    }
    get width() :number {
        return this._width;
    }

    @Input()
    set height(value: number) {
        this._height = value;
    }
    get height() :number {
        return this._height;
    }

    @Input()
    set visible(value: boolean) {
        this._visible = value;
    }
    get visible() :boolean {
        return this._visible;
    }

    @Input()
    set disabled(value: boolean) {
        this._disabled = value;
    }
    get disabled() :boolean {
        return this._disabled;
    }

    constructor() {
        this.createComponent();
    }

    protected set subscription(sub: Subscription) {
        this.__subscriptions__.push(sub);
    }

    // protected set component(cmp: ComponentRef<any>) {
    //     this.__cmps__.push(cmp);
    // }

    ngOnInit() {
        this.initUuid();
        this.initState();
    }

    ngAfterViewInit() {
        this.initComponent();
    }

    ngOnChanges(changes: any) {
        this.changeComponent(changes);
    }

    createComponent() {
        //empty
    }

    initComponent() {
        //empty
    }

    initState() {
        //empty
    }

    // ngOnChanges()
    changeComponent(changes: any): void { }

    ngOnDestroy() {
        if (this.__subscriptions__.length > 0) {
            this.__subscriptions__.forEach((subscription: Subscription) => {
                subscription.unsubscribe()
                subscription = undefined;
            });
            this.__subscriptions__ = [];
        }
        if (this.__cmps__.length > 0) {
            this.__cmps__.forEach((cmp: ComponentRef<any>) => {
                cmp.destroy();
                cmp = undefined;
            });
            this.__cmps__ = [];
        }
        this.destroyComponent();
    }

    destroyComponent() {
        //empty
    }

    initUuid(type: string = 'mi') {
        //this.uuid = `${type}__${UUIDUtil.new()}`;
    }

    _setIdAttribute() {
        if (!this.element.hasAttribute('id') || this.element.hasAttribute('id') === null) {
            this.element.setAttribute('id', this._uuid);
        }
    }
}
