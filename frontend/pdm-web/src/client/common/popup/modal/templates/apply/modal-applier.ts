import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ModalApplier {

    private _requestNotifier = new Subject<any>();
    private _requestObservable$ = this._requestNotifier.asObservable();

    private _responseNotifier = new Subject<any>();
    private _responseObservable$ = this._responseNotifier.asObservable();

    /**
     *  modal window에 뜬 화면에서 apply가 성공했는지 modal window에서 기다린다.
     *  e.g) user-modal.component.ts
     */
    listenApplySuccess(): Observable<any> {
        return this._responseObservable$;
    }

    /**
     *  apply 버튼 클릭시 modal window에서 apply를 요청함
     *  e.g) user-modal.component.ts
     */
    requestApply() {
        this._requestNotifier.next({ type: 'APPLY' });
    }

    /**
     *  apply버튼이 클릭되는지를 기다림 컴포넌트가 해야할 일을 한다.
     *  e.g) user-modify.component.ts
     */
    listenApplyRequest(): Observable<any> {
        return this._requestObservable$;
    }

    /**
     *  apply가 성공했는지 기다리는 곳에 성공했음을 modal window에 알림
     *  e.g) user-modify.component.ts
     */
    appliedSuccess(data?: any) {
        this._responseNotifier.next({ type: 'APPLIED', data: data });
    }

    /**
     *  apply가 실패했음을 알림
     *  e.g) user-modify.component.ts
     */
    appliedFailed(err?: any) {
        this._responseNotifier.next({ type: 'FAILED', error: err });
    }

    /**
     *  make apply button enabled
     */
    enabledApplyButton() {
        this._responseNotifier.next({ type: 'ENABLED_APPLY_BUTTON' });
    }

    /**
     *  make apply button dsiabled
     */
    disabledApplyButton() {
        this._responseNotifier.next({ type: 'DISABLED_APPLY_BUTTON' });
    }
}
