import { ChartEventData, ChartEvent } from '../../event/index';
import { ChartPlugin } from '../chart-plugin';

export class MultiBrushPlugin extends ChartPlugin {

    offsetX = 0; // start x
    offsetY = 0; // start y
    moveX = 0;
    moveY = 0;
    i = 0;
    removedUid: number;
    removeUids: Array<number> = [];
    currentRectLength: number = 0;

    private marginLeft = 0;
    private marginTop = 0;
    private _direction: string = 'horizontal'; // default : horizontal, etc : vertical, both
    private _orient: string = 'bottom';
    private _callback: any;
    private _outerClickCallback: any;
    private isDragging: boolean = false;
    private isRemoved: boolean = false;
    private randomTempUid: number;
    private uid: number;
    private _count: number = 0;
    private mouseDowns: any;
    private mouseUps: any;
    private mouseMoves: any;
    private dragStart: any;
    private targetRect: any;
    private scale: any;
    private targetRectWidth: number;
    private targetRectHeight: number;
    private container: any;
    private containerRect: any;
    private currentRect: any;


    set direction(value: string) {
        this._direction = value;
    }

    get direction() {
        return this._direction;
    }

    get events() {
        return [ChartEvent.DRAG_START, ChartEvent.DRAG_MOVE, ChartEvent.DRAG_END ];
    }

    constructor(target: any, configuration?: any) {
        super(target, configuration);
        if (configuration) {
            this.direction = configuration.direction;
            this._orient = configuration.orient;
            this._callback = configuration.callback;
            if (configuration.count) {
                this._count = configuration.count;
            }
            if (configuration.outerClickCallback) {
                this._outerClickCallback = configuration.outerClickCallback;
            }
        }
        this._createContainer();
        // get parent group element translate for setup margin
        const ytarget = this.target.select('g.background');
        const yposition = d3.transform(ytarget.attr('transform')).translate;
        this.marginTop = yposition[1];
        this.marginLeft = yposition[0];
        this.targetRect = this.target.select('g.background').select('rect');

    }

    _createContainer() {
        this.container = this.target.append('g').attr('class', 'multibrush');
        this.containerRect = this.container.append('rect').style('fill-opacity', 0);
    }

    _getScale(width: number, height: number ) {
        const targetDomain = this.target.select(`.x.${this._orient}`)[0][0].__chart__.domain();
        this.scale = d3.time.scale()
                                .domain([targetDomain[0].getTime(), targetDomain[1].getTime()])
                                .range([0, width]);

        this._addDragRect();

    }


    _addDragRect() {
        this.containerRect
            .on('click', null)
            .on('mousedown', () => {
                // const brushes: any = d3.selectAll('*[class^=brush-]');
                this.randomTempUid = Math.round( Math.random() * 1000 );
                this.offsetX = d3.event.offsetX - this.marginLeft;
                this.currentRectLength += 1;
                this.currentRect = this.container.append('rect').attr('class', `brush-${this.randomTempUid}`).style('fill', '#337ab7')
                    .style('fill-opacity', 0.3).attr('x', this.offsetX).attr('y', 0);
                this.removeUids.push(this.randomTempUid);
                this.container.on('mousemove', () => {
                    this.moveX = d3.event.offsetX - 3 - this.marginLeft;
                    if (this.moveX - this.offsetX > 10 && (this._count === 0 || this.currentRectLength <= this._count)) {
                        this.uid = this.randomTempUid;
                        this.removedUid = this.uid;
                        const widthCompare: number = this.moveX - this.offsetX;
                        const containerRectWidth: number = +this.containerRect.attr('width')
                        const currentRectWidth: number = +this.currentRect.attr('width');
                        const currentRectX: number = +this.currentRect.attr('x');
                        if (currentRectWidth + currentRectX > containerRectWidth -10) {
                            this.currentRect.attr('width', containerRectWidth -10 - currentRectX ).attr('height', this.targetRectHeight);
                        } else {
                            this.currentRect.attr('width', widthCompare < 0 ? 0 : widthCompare ).attr('height', this.targetRectHeight);
                        }

                        this.isDragging = true;
                    } else {
                        this.isDragging = false;
                    }
                });
            })
            .on('mousemove', null)
            .on('mouseup', () => {
                this.container.on('mousemove', null);
                if (this.isDragging) {
                    const dates: Array<any> = [];
                    dates.push(this.scale.invert(this.offsetX));
                    dates.push(this.scale.invert(this.moveX));
                    this._callback.call(this, dates, d3.event, this.uid, this.removedUid);
                    this.isDragging = false;
                    this.container.on('click', null);
                    this.currentRect.on('mousemove', () => {
                        this._callback.call(this, dates, d3.event, this.uid, this.removedUid);
                    })
                } else {
                    if (!this.removedUid) {
                        this.container.on('click', () => {
                            this.currentRect.remove();
                            const brushes: any = d3.selectAll('*[class^=brush-]');
                            this.currentRectLength = brushes[0].length;
                        });
                    } else {
                        this.container.on('click', () => {
                            if (this._outerClickCallback) {
                                this._outerClickCallback.call();
                            }
                            this.container.select(`.brush-${this.removedUid}`).remove();
                            this.currentRect.remove();
                            this.removeUidInArray(this.removedUid);
                            this.removedUid = undefined;
                            const brushes: any = d3.selectAll('*[class^=brush-]');
                            this.currentRectLength = brushes[0].length;
                        });
                    }
                }
            });
    }

    removeUidInArray(uid: number) {
        var index = this.removeUids.indexOf(uid);
        if (index > -1) {
            this.removeUids.splice(index, 1);
        }
    }

    updateDisplay(width?: number, height?: number) {
        this.container.attr('transform', `translate(${this.marginLeft}, ${this.marginTop})`);
        this.targetRectWidth = +this.targetRect.attr('width');
        this.targetRectHeight = +this.targetRect.attr('height');
        // this.container.selectAll('rect').attr('height', this.targetRectHeight);
        this.containerRect.attr('width', this.targetRectWidth + 10).attr('height', this.targetRectHeight);
        this._getScale(this.targetRectWidth, this.targetRectHeight);
    }

    _removeEvent() {
        this.containerRect
            .on('mousemove', null)
            .on('mousedown', null)
            .on('mouseup', null)
            .on('click', null);
    }

    disabled() {
        super.disabled();
        if (this.currentRect) {
            this.currentRect.remove();
        }
        this._removeEvent();
    }

    enabled() {
        super.enabled();
        this._addDragRect();
    }
}
