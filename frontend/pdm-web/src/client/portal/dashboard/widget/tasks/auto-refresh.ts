import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

/**
 * widget-container.component 에서 상속받아 refresh를 구현한다 
 */
export abstract class AutoRefreshTask  {

    private _timer: Subscription;

    executeAutoRefresh(refreshMinutes) {
        // 기존에 있으면 제거한다. 
        this.stopAutoRefresh();

        this._timer = Observable
                        .interval(refreshMinutes * 60000)
                        .timeInterval()
                        .subscribe(
                            () => this.refresh(),
                            (err) => {
                                console.log('auto refresh error', err);
                                this._timer.unsubscribe();
                            }
                        );
    }

    stopAutoRefresh() {
        if (this._timer) {
            this._timer.unsubscribe();
        }
    }

    // widget-container.component에서 구현한다. JUST_REFRESH와 대응한다. 
    abstract refresh();
}