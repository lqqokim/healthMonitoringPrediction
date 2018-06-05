import { 
    Component, 
    Input, 
    ElementRef, 
    ChangeDetectionStrategy } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'a3w-chart-body',
    template: ` 
        <div class="a3-chart-body">
            <ng-content></ng-content> 
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetBodyComponent {

    @Input() cls: any;
    
    constructor(private element: ElementRef) {}

}