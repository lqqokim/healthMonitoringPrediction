import { WidgetListService } from '../../widget-list/widget-list.service';
import { Component, HostBinding, OnDestroy, Input, OnInit } from '@angular/core';

import { CarouselComponent } from './carousel.component';
import { StateManager } from '../../../../common';

@Component({
    selector: 'div[dashboard-slide]',
    template: `
        <div [class.active]="active" class="item">
            <ul *ngFor="let widget of widgets" class="widget">
                <li class="widget-image">
                    <img src="assets/images/widgets/{{ getWidgetTypeName(widget.widgetTypeId) | a3CamelToDashed }}.png" />
                </li>
            </ul>
        </div>
    `
})
export class SlideComponent implements OnInit, OnDestroy {

    /** Is current slide active */
    @HostBinding('class.active')
    @Input() public active: boolean;

    /** Wraps element by appropriate CSS classes */
    @HostBinding('class.widgets')
    @HostBinding('class.item')
    @HostBinding('class.carousel-item')
    public addClass: boolean = true;

    @Input() public widgets: any;

    public constructor(
        protected carousel: CarouselComponent,
        private stateManager: StateManager
    ) {}

    /** Fires changes in container collection after adding a new slide instance */
    public ngOnInit(): void {
        this.carousel.addSlide(this);
    }

    /** Fires changes in container collection after removing of this slide instance */
    public ngOnDestroy(): void {
        this.carousel.removeSlide(this);
    }

    getWidgetTypeName(widgetTypeId: any) {
        const widgetType = this.stateManager.getWidgetType(widgetTypeId);
        return widgetType.name;
    }
}