export class Timer {
    private _cb: Function;
    private _fps: number;
    private _t0: number;
    private _t1: number;
    private _is_play: boolean = false;

    constructor( callback: Function, framePerSeconds?: number ){
        this._cb = callback;
        this._fps = (framePerSeconds === undefined) ? (1000/60) : framePerSeconds;
    }

    private timer(p?: number): void {
        if( !this._is_play ){ return; }

        if( p === undefined ){
            this._t0 = performance.now();
            this._cb(0);
        } else {
            this._t1 = p;
            this._cb( Math.floor(this._t1 - this._t0)/1000 );
            this._t0 = performance.now();
        }

        setTimeout(()=>{ this.timer(performance.now()); }, this._fps );
    }

    public play(): void {
        this._is_play = true;
        this.timer();
    }

    public stop(): void {
        this._is_play = false;
    }

    public destory(): void {
        this._cb = null;   
    }
}