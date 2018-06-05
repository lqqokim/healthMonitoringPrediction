
export class ModalApi {

    private _modalState: any;
    private _isModal: boolean = false;

    set isModal(isModal: boolean) {
        this._isModal = isModal;
    }

    get isModal() {
        return this._isModal;
    }

    set modalState(state: any) {
        this._modalState = state;
    }

    get modalState() {
        return this._modalState;
    }
}