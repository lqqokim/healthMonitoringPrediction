
import { Dragable } from './model/drag-model';
import { Observable } from 'rxjs/Observable';
import { ChartEventData, ChartEvent } from '../../event/index';
import { ChartPlugin } from '../chart-plugin';

export class DragBase extends ChartPlugin {

    offsetX = 0; // start x
    offsetY = 0; // start y
    moveX = 0;
    moveY = 0;


    private marginLeft = 0;
    private marginTop = 0;

    private _direction = 'horizontal'; // default : horizontal, etc : vertical, both
    private _randomId: number;

    private mouseDowns: any;
    private mouseUps: any;
    private mouseMoves: any;
    private dragStart: any;
    private _callback: any;
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
            if (configuration.callback) {
                this._callback = configuration.callback;
                this._addListener();
            }
        }
        // get parent group element translate for setup margin
        const ytarget = this.target.select('g.background');
        const yposition = d3.transform(ytarget.attr('transform')).translate;
        this.marginTop = yposition[1];
        this.marginLeft = yposition[0];
        this._randomId = 0;
    }

    _addListener() {
        addEventListener(ChartEvent.CONCAT_SELECT_ITEMS, (event: CustomEvent) => {
            this._callback.call(this, event.detail.item, event.detail.event);
            // re call when mouse over on outlier brush.
            this.currentRect.on('mousemove', () => {
                this._callback.call(this, event.detail.item, d3.event);
            })
        });
    }

    _addEvent(target: any) {
        const mouseDowns = Observable.fromEvent(target[0][0], 'mousedown');
        const mouseUps = Observable.fromEvent(target[0][0], 'mouseup');
        const mouseMoves = Observable.fromEvent<MouseEvent>(target[0][0], 'mousemove');
        let dragStart: Observable<any>;

        this.mouseDowns = mouseDowns.subscribe(() => {
            this._randomId++;
            // target.select('.selection_box').remove();
        });

        dragStart = mouseDowns.flatMap(() =>
            this.mouseMoves = mouseMoves
                .filter(x => { return  x.movementX !== 0 || x.movementY !== 0; })
                .takeUntil(mouseUps)
                .take(1)
        );
        this.dragStart = dragStart.subscribe( (e: any) => {
            this.offsetX = e.offsetX + 1;
            this.offsetY = e.offsetY + 1;
            this.currentRect = target.append( 'rect')
                .attr('class', `selection_box${this._randomId}`)
                .attr('x', this.offsetX)
                .attr('y', this.offsetY)
                .attr('width', 0)
                .attr('height', 0)
                .style('fill', '#337ab7')
                .style('fill-opacity', 0.3);
        });

        dragStart.map( () => {
                return this.mouseMoves = mouseMoves.takeUntil(mouseUps);
            })
            .concatAll()
            .subscribe( (e: any) => {
                this.moveX = e.offsetX - this.offsetX;
                this.moveY = e.offsetY - this.offsetY;
                this.updateDisplay();
            });

        this.mouseUps = mouseUps.subscribe( (e: any) => {
            this.moveX = e.offsetX - 1;
            this.moveY = e.offsetY - 1;
            const s_box: any = this.target.select(`.selection_box${this._randomId}`);

            if (s_box[0][0]) {

                const targetBox = d3.select(s_box[0][0]);
                const startX = +targetBox.attr('x');
                const startY = +targetBox.attr('y');
                const moveX = startX + (+targetBox.attr('width'));
                const moveY = startY + (+targetBox.attr('height'));

                // minus margin position for original position
                const dragEvent: Dragable = new Dragable(e, startX - this.marginLeft,
                    startY - this.marginTop, moveX - this.marginLeft, moveY - this.marginTop);

                // send event to series component
                this.target[0][0].dispatchEvent(new CustomEvent(ChartEvent.DRAG_END, {detail: dragEvent}));
            }
        });
    }

    updateDisplay(width?: number, height?: number) {
        const s_box: any = this.target.select(`.selection_box${this._randomId}`);
        if ( !s_box.empty()) {
            const ytarget = this.target.select('g.background');
            const yposition = d3.transform(ytarget.attr('transform')).translate;
            const mX = (this.moveX < 0 ? 0 : this.moveX);
            const mY = (this.moveY < 0 ? 0 : this.moveY);
            const boundingRect: any = ytarget.node().getBoundingClientRect();
            if (this.direction === 'horizontal') {
                s_box.attr('y', this.marginTop);
                s_box.attr('height', boundingRect.height);
                s_box.attr('width', mX);
            } else if (this.direction === 'vertical') {
                s_box.attr('x', this.marginLeft);
                s_box.attr('width', boundingRect.width);
                s_box.attr('height', mY);
            } else {
                s_box.attr('width', mX);
                s_box.attr('height', mY);
            }
        }
    }

    _removeEvent() {
        if (this.mouseDowns) {
            this.mouseDowns.unsubscribe();
        }
        if (this.mouseUps) {
            this.mouseUps.unsubscribe();
        }
        if (this.mouseMoves) {
            this.mouseMoves = null;
        }
        if (this.dragStart) {
            this.dragStart.unsubscribe();
        }
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
        this._addEvent(this._target);
    }

    callbackCall(data: any) {
        // this._callback.call(this, data, window.event)
    }
}
