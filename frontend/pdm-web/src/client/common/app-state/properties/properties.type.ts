import { WidgetModel } from '../dashboard/dashboard.type';
import { TaskerModel } from '../workspace/workspace.type';

export interface PropertiesModel {
    actionType: string;
    status: string;
    widget?: WidgetModel;
    tasker?: TaskerModel;
}