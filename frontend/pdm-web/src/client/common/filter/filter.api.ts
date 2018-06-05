import { FilterRequester } from './filter-requester';

export class FilterApi {
    private _requester: FilterRequester;

    setRequester(requester: FilterRequester) {
        this._requester = requester;
    }

    get filters() {
        if (!this._requester.getModel().filters) {
            this._requester.getModel().filters = {};
        }
        return this._requester.getModel().filters;
    }

    setValidator(cb) {
        this._requester.setValidator(cb);
    }
}