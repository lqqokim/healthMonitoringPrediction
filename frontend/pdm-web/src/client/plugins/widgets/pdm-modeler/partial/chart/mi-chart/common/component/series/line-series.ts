import { Series } from '../../series/index';
import { SeriesConfiguration } from './../../../model/index';
import { Dragable } from '../../plugin/drag-selector/model/drag-model';
import { ChartEvent } from '../../event/chart-event.constant';

export class LineSeries extends Series {

    private _line: any;
    private _defs: any;
    private _filteredDataProvider: Array<any>;

    constructor( seriesParam: SeriesConfiguration ) {
        super( seriesParam );
        this.index = 0;
    }

    dataSetting() {
        super.dataSetting();
        if (this.dataProvider) {
            this._filteredDataProvider = this.filteringDataProvider(this.dataProvider);
            this.updateDisplay();
        }
    }

    generatePosition() {
        super.generatePosition();
        // tslint:disable-next-line:comment-format
        // setup x, y, width, height
        this._line = d3.svg.line()
            .x((d: any) => {
                return this.xAxe.itemDimensions  / 2 + this.xAxe.scale(d[this.xField]);
            })
            .y((d: any) => {
                return this.yAxe.scale(d[this.yField]);
            })
            .interpolate('interpolate');
    }

    updateDisplay() {
        this.generatePosition();

        let svgElement: any = this.target.select(`path`);
       if (!svgElement[0][0]) {
            svgElement = this.createItem();
        } else {
            svgElement.datum(this.dataProvider);
        }

        svgElement.attr('d', this._line);
        this._defs.select('rect').attr('width', this.width).attr('height', this.height);

        if (this.configuration.condition.circle) {
            this.target.selectAll('.dot').remove();
            this.target.selectAll('.dot')
                .data(this._filteredDataProvider)
                .enter().append('circle') // Uses the enter().append() method
                .attr('class', 'dot') // Assign a class for styling
                .attr('cx', (d: any) => { return this.xAxe.itemDimensions  / 2 + this.xAxe.scale(d[this.xField]); })
                .attr('cy', (d: any) => { return this.yAxe.scale(d[this.yField]); })
                .attr('r', 2)
                .attr('clip-path', `url(#${this._seriesName + this.index}-clip-path)`)
                .attr('stroke', this.color)
                .attr('fill', (d: any) => {
                    if (this.configuration.condition.circle) {
                        const baseData = d[this.configuration.condition.circle.fill.base];
                        const start = this.configuration.condition.circle.fill.start;
                        const end = this.configuration.condition.circle.fill.end;
                        if ( start <= baseData && baseData <= end) {
                            return this.color;
                        } else {
                            return 'white';
                        }
                    } else {
                        return 'white';
                    }
                });
        }
    }

    createItem() {
        this._defs = this.target.append('defs');
        this._defs.append('clipPath').attr('id', `${this._seriesName + this.index}-clip-path`).append('rect');

        return this.target.datum(this._filteredDataProvider)
                            .append('path')
                            .style('stroke', this.color)
                            .style('fill', 'none')
                            .attr('clip-path', `url(#${this._seriesName + this.index}-clip-path)`)
                            .attr('class', this._seriesName + this.index);
    }

    unselectAll() {
        // const circleArr: any = this.target.selectAll('.selected-circle');
        // circleArr.classed('selected-circle', false).attr('fill', 'white');
    }

    selectAll(event: Dragable) {
        const startXPos = new Date(this.xAxe.scale.invert(+event.startX)).getTime();
        const endXPos = new Date(this.xAxe.scale.invert(+event.endX)).getTime();
        const startYPos = this.yAxe.scale.invert(+event.startY);
        const endYPos = this.yAxe.scale.invert(+event.endY);
        const selectedObj: any = {};
        const selectedItem: Array<any> = [];

        this._filteredDataProvider.map((d: any) => {
            const dataX = d[this.xField];
            const dataY = d[this.yField];
            if ( ( startXPos < dataX && dataX < endXPos) && (endYPos < dataY && dataY < startYPos) ) {
                selectedItem.push(d);
            }
        });

        selectedObj[this.displayName] = selectedItem;
        const dispatchItems = {
            item: selectedObj,
            event: event.event
        };
        this.target[0][0].nearestViewportElement.dispatchEvent( new CustomEvent(ChartEvent.SELECT_ALL_ITEMS, {detail: dispatchItems}));
    }

}
