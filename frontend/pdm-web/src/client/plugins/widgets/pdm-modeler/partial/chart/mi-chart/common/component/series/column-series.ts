import { Series } from '../../series/index';
import { SeriesConfiguration } from './../../../model/index';
import { ChartException } from '../../../common/error/index';
import { Dragable } from '../../plugin/index';
import { ChartEvent } from '../../event/chart-event.constant';

interface RectInfo {
    rect: any;
    data: any;
}

export class ColumnSeries extends Series {

    private _type: string;
    private _stackField: Array<string>;

    constructor( seriesParam: SeriesConfiguration ) {
        super( seriesParam );
        this.rectWidthDimensions = 0;
        this.rectHeightDimensions = 0;
        this.seriesIndex = 0;
        this.seriesCnt = 1;
    }

    set type(value: string) {
        this._type = value;
    }

    get type(): string {
        return this._type;
    }

    set stackField(value: Array<string>) {
        this._stackField = value;
    }

    get stackField() {
        return this._stackField;
    }

    dataSetting() {
        super.dataSetting();
        for (let j = 0; j < this.dataProvider.length; j++) {
            this.data = this.dataProvider[j];
            this.index = j;
            this.updateDisplay();

        }
    }

    generatePosition() {
        super.generatePosition();
        try {
            switch (this.type) {
                case 'stacked' :
                    this._stacked();
                break;
                case 'group' :
                    this._group();
                break;
                default :
                    this._normal();
                break;
            }
        } catch (e) {
             throw new ChartException(500, {message: 'column series generatePosition and Data parsing Error'});
        }
    }

    updateDisplay() {
        super.updateDisplay();
        this.target.attr('data-legend', () => {
            return this.displayName;
        });
        let rectElement: any = this.target.select(`.${this.displayName + this.index}`);
        // this.aniTarget = rectElement;
        if (!rectElement[0][0]) {
            rectElement = this.createItem();
        } else {
            rectElement.datum(this.data);
        }

        this.setTransition(rectElement, 500)
            .attr('x', this.x)
            .attr('y', this.y)
            .attr('width', this.width)
            .attr('height', this.height)
            .each('end', (d: any) => {
                this.createLabel('top', rectElement);
            });

        this.target.style('fill', this.color);
    }

    createItem(): any {
        const min: number = this.yAxe.scale.domain()[0];
        const thatElement: any = this.target.datum(this.data)
                                        .append('rect')
                                        .attr('y', this.yAxe.scale(min))
                                        .attr('height', 0)
                                        .attr('class', this.displayName + this.index)
                                        .attr('value', this.data[this.yField]);

        this.addEvent(thatElement);
        return thatElement;
    }

    _normal() {
        if (this.xAxe) {
            this.x = this.xAxe.scale(this.data[this.xField]) + this.seriesIndex * this.rectWidthDimensions;
            this.width = this.xAxe.itemDimensions;
        }
        if (this.yAxe) {

            const min: number = this.yAxe.scale.domain()[0];
            const max: number = this.yAxe.scale.domain()[1];
            const targetValue: number = this.data[this.yField];
            if (min < 0) {
                if (targetValue < 0) {
                    this.y = this.yAxe.scale(0);
                    this.height = this.yAxe.scale(targetValue + max);
                } else {
                    this.y = this.yAxe.scale(targetValue);
                    const compareValue: number = this.yAxe.scale(targetValue + min);
                    this.height = this.yAxe.scale.range()[0] - compareValue;
                }
            } else {
                this.y = this.yAxe.scale(targetValue);
                this.height = this.yAxe.scale.range()[0] - this.y;
            }
        }
    }

    _stacked() {
        if (this.xAxe) {
            this.x = this.xAxe.scale(this.data[this.xField]);
            this.width = this.xAxe.itemDimensions;
        }
        if (this.yAxe) {
            const min: number = this.yAxe.scale.domain()[0];
            const max: number = this.yAxe.scale.domain()[1];
            const targetValue: number = this.data[this.yField];
            let compareValue: number = 0;
            let currentField: string = '';
            if (targetValue < 0) {
                if (this.seriesIndex > 0) {
                    for (let i = 0; i < this.seriesIndex; i++) {
                        currentField = this.stackField[i];
                        const compareTmpValue: number = this.data[currentField];
                        if (compareTmpValue < 0) {
                            compareValue += compareTmpValue;
                        }
                    }
                }
                if (compareValue !== 0) {
                    this.y = this.yAxe.scale(compareValue);
                } else {
                    this.y = this.yAxe.scale(0);
                }
                this.height = this.yAxe.scale(targetValue + max);
            } else {
                if (this.seriesIndex > 0) {
                    for (let i = 0; i < this.seriesIndex; i++) {
                        currentField = this.stackField[i];
                        const compareTmpValue: number = this.data[currentField];
                        if (compareTmpValue > 0) {
                            compareValue += compareTmpValue;
                        }
                    }
                }
                this.y = this.yAxe.scale(targetValue + compareValue);
                const cmp: number = this.yAxe.scale(targetValue + min);
                this.height = this.yAxe.scale.range()[0] - cmp;
            }
        }
    }

    _group() {
        if (this.seriesCnt > 1) {// case : multi series
            this.rectWidthDimensions = (this.xAxe.itemDimensions / this.seriesCnt);
        }
        if (this.xAxe) {
            this.x = this.xAxe.scale(this.data[this.xField]) + this.seriesIndex * this.rectWidthDimensions;
            this.width = this.rectWidthDimensions;
        }
        if (this.yAxe) {
            const min: number = this.yAxe.scale.domain()[0];
            const max: number = this.yAxe.scale.domain()[1];
            const targetValue: number = this.data[this.yField];
            if (min < 0) {
                if (targetValue < 0) {
                    this.y = this.yAxe.scale(0);
                    this.height = this.yAxe.scale(targetValue + max);
                } else {
                    this.y = this.yAxe.scale(targetValue);
                    const compareValue: number = this.yAxe.scale(targetValue + min);
                    this.height = this.yAxe.scale.range()[0] - compareValue;
                }
            } else {
                this.y = this.yAxe.scale(targetValue);
                this.height = this.yAxe.scale.range()[0] - this.y;
            }
        }
    }

    addEvent(element: any) {
        element
            .on('click', () => {
                // manual 분기
                const targetEl: any = d3.select(d3.event.target);
                const parentEl: any = targetEl[0][0].parentElement;
                const seriesEl: any = d3.select(parentEl.parentElement);
                const gEl: any = seriesEl.selectAll('g');

                this._unselectedItem(seriesEl);
                gEl[0].map((g: any) => {
                    this._unselectedItem(d3.select(g));
                });
                this._selectedItem(targetEl);
            })
            .on('mousemove', () => {
                // const cX = (d3.event.offsetX);
                // const cY = (d3.event.offsetY);
                // console.log('element click ==> x :', cX, ' , y : ', cY);
            });
        // dispatchEvent(new Event('data_change'));
    }

    _selectedItem(target: any) {
        target.style('fill-opacity', 1);
        target.classed('selected', true);
    }

    _unselectedItem(target: any) {
        if (this.manual !== 'multiselection') {
            target.selectAll('.selected').style('fill-opacity', 0.3).classed('selected', false);
        }
        target.style('fill-opacity', 0.3);
    }

    unselectAll() {
        super.unselectAll();
        this.target.selectAll('rect').style('fill-opacity', null).classed('selected', false);
        const seriesEl = d3.select(this.target[0][0].parentElement);
        seriesEl.style('fill-opacity', 1);
        this.target.style('fill-opacity', 1);
    }

    selectAll(event: Dragable) {
        const targetElements: any = this.target.selectAll('rect');
        this._unselectedItem(this.target);
        const selectedItems: Array<any> = [];
        targetElements[0].map((rectTemp: any) => {
            const rect: any = d3.select(rectTemp);
            const rectX: number = rect.attr('x');
            const rectWidth: number = Math.round(rect.attr('width'));
            if (rectX > (event.startX - rectWidth) && rectX < event.endX) {
                this._selectedItem(rect);
                selectedItems.push(rect[0][0].__data__);
            }
        });
        this.target[0][0].nearestViewportElement.dispatchEvent( new CustomEvent(ChartEvent.SELECT_ALL_ITEMS, {detail: selectedItems}));
    }
}

