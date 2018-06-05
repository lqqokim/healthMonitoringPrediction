import { AfterViewInit, Component, ElementRef, HostListener, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { LegendConfiguration } from '../../model/index';
import { Legend, SvgLegend } from '../../common/index';



@Component({
    moduleId: module.id,
    selector: 'legend',
    templateUrl: 'legend.component.html',
    encapsulation: ViewEncapsulation.None
})

export class LegendComponent implements OnChanges {
    @Input() config: LegendConfiguration;
    @ViewChild('legend') legend_div: ElementRef;
    legend: Legend = null;

    constructor() {}

    ngOnChanges(value: any) {
        if (value.config.currentValue) {
            if (this.legend) {
                this.legend.clear();
            }
            this._createLegend(value.config.currentValue);
            this._drawLegend(this.legend_div.nativeElement.offsetWidth, this.legend_div.nativeElement.offsetHeight);
        }
    }

    _createLegend(legendInfo: LegendConfiguration) {
        this.legend = new SvgLegend(legendInfo, legendInfo.chartSelector);
    }

    _drawLegend(width: number, height: number) {
        if (this.legend) {
            this.legend.updateDisplay(width, height);
        }
    }
}
