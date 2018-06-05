import { FilterRequester } from '../../filter/filter-requester';

export interface FilterModel {
    status: string;
    size: string;
    model: any;
    requester: FilterRequester;
    isTasker: boolean;
}
