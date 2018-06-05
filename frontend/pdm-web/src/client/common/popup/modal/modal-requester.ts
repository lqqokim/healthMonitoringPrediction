import { Injectable, ComponentRef } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ModalModel } from '../../app-state/modal/modal.type';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ModalRequester {

    private _modalNotifier = new Subject<any>();
    private _modalObservable$ = this._modalNotifier.asObservable();
    private _info: any;
    private _component: any;

    getObservable(): Observable<any> {
        // 오직 한번만 subscribe 하도록 강제한다. 
        return this._modalObservable$.first();
    }

    setAction(action: ModalModel) {
        this._info = action.info;
    }

    setComponent(component: ComponentRef<any>) {
        this._component = component;
    }

    execute() {
        this._modalNotifier.next({ type: 'OK', data: this._info });
    }

    /**
     * call apply.component
     */
    update(data: any) {
        this._modalNotifier.next({ type: 'OK', data: data });
    }

    cancel() {
        this._modalNotifier.next({ type: 'CANCEL', data: this._info });
    }

    destroy() {
        if (this._component) {
            this._component.destroy();
        }
    }
}
