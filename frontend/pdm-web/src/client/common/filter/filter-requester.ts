import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

export class FilterRequester {
    private _filterNotifier = new Subject<any>();
    private _filterObservable$ = this._filterNotifier.asObservable();
    private _model: any;
    private _validator: any;

    getFilterObservable(): Observable<any> {
        // 오직 한번만 subscribe 하도록 강제한다. 
        return this._filterObservable$.first();
    }

    setModel(model: any) {
        this._model = model;
    }

    getModel() {
        return this._model;
    }

    applyFilter() {
        this._filterNotifier.next(this._model.filters);
    }

    setValidator(cb: any) {
        this._validator = cb;
    }

    getValidator() {
        return this._validator;
    }
}
