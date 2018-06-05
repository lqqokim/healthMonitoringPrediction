import { ContextMenuRequester } from '../../popup/context-menu/context-menu-requester';
import { ContextMenuType } from '../../../sdk';

export interface ContextMenuModel extends ContextMenuType {
    actionType?: string;
    id?: number,
    requester?: ContextMenuRequester;
}
