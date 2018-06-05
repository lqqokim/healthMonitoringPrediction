import { ModalRequester } from '../../popup/modal/modal-requester';

export interface ModalModel {
    actionType?: string;
    module?: any;
    info?: any;
    requester?: ModalRequester;
}
