import { Series } from '../../series/index';
import { SeriesConfiguration } from './../../../model/index';
import { Dragable } from '../../plugin/index';
import { ChartEvent } from '../../event/chart-event.constant';

export class BarSeries extends Series {

    private _type: string;
    private _stackField: Array<string>;

    constructor( seriesParam: SeriesConfiguration ) {
        super( seriesParam );
        this.seriesIndex = 0;
        this.seriesCnt = 1;
        this.rectWidthDimensions = 0;
        this.rectHeightDimensions = 0;
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

        // tslint:disable-next-line:comment-format
        // setup x, y, width, height
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
    }

    updateDisplay() {
        super.updateDisplay();
        this.target.attr('data-legend', () => {
            return this.displayName;
        });
        let rectElement: any = this.target.select(`.${this.displayName + this.index}`);

        if (!rectElement[0][0]) {
            rectElement = this.createItem();
        } else {
            rectElement.datum(this.data);
        }
        rectElement.attr('y', this.y);
        rectElement.attr('height', this.height);

        if (this.configuration.condition.textLabel.show) {
            this.setTransition(rectElement, 500)
            .attr('x', this.x)
            .attr('y', this.y)
            .attr('width', this.width)
            .attr('height', this.height)
            .each('end', (d: any) => {
                super.createLabel('right', rectElement);
            });
        } else {
            rectElement
                .attr('x', this.x)
                .attr('y', this.y)
                .attr('width', this.width)
                .attr('height', this.height)
        }
        this.target.style('fill', this.color);
    }

    createItem() {
        const min: number = this.xAxe.scale.domain()[0];
        const thatElement: any = this.target.datum(this.data)
                            .append('rect')
                            .attr('x', this.xAxe.scale(min))
                            .attr('width', 0)
                            .attr('class', this.displayName + this.index)
                            .attr('value', this.data[this.xField]);
        this.addEvent(thatElement);
        return thatElement;
    }

    _normal() {
        if (this.xAxe) {
            const min: number = this.xAxe.scale.domain()[0];
            const targetValue: number = this.data[this.xField];
            if (min < 0) {
                if (targetValue < 0) {
                    this.x = this.xAxe.scale(this.data[this.xField]);
                    this.width = this.xAxe.scale(0) - this.xAxe.scale(targetValue);
                } else {
                    this.x = this.xAxe.scale(0);
                    this.width = this.xAxe.scale(targetValue + min);
                }

            } else {
                this.x = 0;
                this.width = this.xAxe.scale(this.data[this.xField]);
            }
        }
        if (this.yAxe) {
            this.y = this.yAxe.scale(this.data[this.yField]);
            this.height = this.yAxe.scale.rangeBand();
        }
    }

    _stacked() {
        if (this.xAxe) {
            const min: number = this.xAxe.scale.domain()[0];
            const targetValue: number = this.data[this.xField];
            let compareValue: number = 0;
            let currentField: string = '';
            if (targetValue < 0) {
                if (this.seriesIndex > 0) {
                    for (let i = 0; i < this.seriesIndex; i++) {
                        currentField = this.stackField[i];
                        const compareTmpValue = this.data[currentField];
                        if (compareTmpValue < 0) {
                            compareValue += compareTmpValue;
                        }
                    }
                }
                if ( compareValue !== 0) {
                    this.x = this.xAxe.scale(this.data[this.xField] + compareValue);
                } else {
                    this.x = this.xAxe.scale(this.data[this.xField]);
                }
                this.width = this.xAxe.scale(0) - this.xAxe.scale(targetValue);
            } else {
                if (this.seriesIndex > 0) {
                    for (let i = 0; i < this.seriesIndex; i++) {
                        currentField = this.stackField[i];
                        const compareTmpValue: number = this.data[currentField];
                        if ( compareTmpValue > 0) {
                            compareValue += compareTmpValue;
                        }
                    }
                }
                this.x = this.xAxe.scale.range()[0] + this.xAxe.scale(compareValue);
                this.width = this.xAxe.scale(targetValue + min);
            }

        }
        if (this.yAxe) {
            this.y = this.yAxe.scale(this.data[this.yField]);
            this.height = this.yAxe.scale.rangeBand();
        }
    }

    _group() {
        if (this.seriesCnt > 1) {// case : multi series
            this.rectHeightDimensions = (this.yAxe.itemDimensions / this.seriesCnt);
        }
        if (this.xAxe) {
            const min: number = this.xAxe.scale.domain()[0];
            const targetValue: number = this.data[this.xField];
            if (min < 0) {
                if (targetValue < 0) {
                    this.x = this.xAxe.scale(this.data[this.xField]);
                    this.width = this.xAxe.scale(0) - this.xAxe.scale(targetValue);
                } else {
                    this.x = this.xAxe.scale(0);
                    this.width = this.xAxe.scale(targetValue + min);
                }
            } else {
                this.x = 0;
                this.width = this.xAxe.scale(this.data[this.xField]);
            }
        }
        if (this.yAxe) {
            this.y = this.yAxe.scale(this.data[this.yField]) + this.seriesIndex * this.rectHeightDimensions;
            this.height = this.rectHeightDimensions;
        }
    }

    addEvent(element: any) {
        element
            .on('click', () => {
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
        const seriesEl: any = d3.select(this.target[0][0].parentElement);
        seriesEl.style('fill-opacity', 1);
        this.target.style('fill-opacity', 1);
    }

    selectAll(event: Dragable) {
        const targetElements: any = this.target.selectAll('rect');
        this._unselectedItem(this.target);
        const selectedItems: Array<any> = [];
        targetElements[0].map((rectTemp: any) => {
            const rect: any = d3.select(rectTemp);
            const rectY: number = rect.attr('y');
            const rectHeight: number = Math.round(rect.attr('height'));
            if (rectY > (event.startY - rectHeight) && rectY < event.endY) {
                this._selectedItem(rect);
                selectedItems.push(rect);
            }
        });
        this.target[0][0].nearestViewportElement.dispatchEvent( new CustomEvent(ChartEvent.SELECT_ALL_ITEMS, {detail: selectedItems}));
    }
}

