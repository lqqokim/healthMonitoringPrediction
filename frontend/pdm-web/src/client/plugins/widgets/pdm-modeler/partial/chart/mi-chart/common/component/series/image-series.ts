import { Series } from '../../series/index';
import { SeriesConfiguration } from './../../../model/index';
import { Dragable } from '../../plugin/drag-selector/model/drag-model';
import { ChartEvent } from '../../event/chart-event.constant';

export class ImageSeries extends Series {

    data: any;
    private _filteredDataProvider: Array<any>;

    constructor( seriesParam: SeriesConfiguration ) {
        super( seriesParam );
        this.index = 0;
    }

    dataSetting() {
        super.dataSetting();
        // if (this.dataProvider) {
        //     this.data = this.dataProvider;
        // } else {
        this.data = this.configuration.condition.imgData;
        this.updateDisplay();
    }

    generatePosition() {
        super.generatePosition();
    }


    updateDisplay() {
        this.generatePosition();
        let svgElement: any = this.target.select(`.${this.displayName + this.index}`);
        let imgElement: any = d3.select(this.target[0][0].parentElement).select('image');
        if (svgElement[0][0]) {
            svgElement.removeAll();
        }
        if (!imgElement[0][0]) {
            svgElement = this.createItem();
        }
    }

    createItem() {
        // const rectTarget = this.target.append('rect')
        //                             .attr('width', this.width)
        //                             .attr('height', this.height)
        //                             .style('fill', 'none')
        //                             .style('fill-opacity', 0);
        return this.target.insert('image')
                    .attr('width', this.width)
                    .attr('height', this.height)
                    .attr('preserveAspectRatio', 'none')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('xlink:href', this.data);
    }

    unselectAll() {
    }

    selectAll(event: Dragable) {
        const selectedItems: any = {
            startX: this.xAxe.scale.invert(event.startX),
            endX: this.xAxe.scale.invert(event.endX),
            startY: this.yAxe.scale.invert(event.endY),
            endY: this.yAxe.scale.invert(event.startY)
        }
        const dispatchItems = {
            item: selectedItems,
            event: event.event
        };
        this.target[0][0].nearestViewportElement.dispatchEvent( new CustomEvent(ChartEvent.SELECT_ALL_ITEMS, {detail: dispatchItems}));
    }

}
