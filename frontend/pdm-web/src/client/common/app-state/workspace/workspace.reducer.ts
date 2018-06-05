import { ActionReducer, Action } from '@ngrx/store';
import { WorkspaceModel, TaskerModel } from './workspace.type';

export const WorkspaceReducer: ActionReducer<WorkspaceModel[]> = (state: WorkspaceModel[], action: Action) => {

    if (typeof state === 'undefined') {
        state = [];
    }

    switch (action.type) {
        case ActionType.SET_WORKSPACES:
            return setWorkspaces(state, action.payload);
        case ActionType.ADD_WORKSPACE:
            return addWorkspace(state, action.payload);
        case ActionType.REMOVE_WORKSPACE:
            return removeWorkspace(state, action.payload);
        case ActionType.CLEAR_WORKSPACES:
            return clearWorkspaces(state, action.payload);

        case ActionType.SET_TASKERS:
            return setTaskers(state, action.payload);
        case ActionType.ADD_TASKER:
            return addTasker(state, action.payload);
        case ActionType.REMOVE_TASKER:
            return removeTasker(state, action.payload);
        case ActionType.UPDATE_TASKER:
            return updateTasker(state, action.payload);

        case ActionType.SELECT_TASKER_CHART_ITEM:
            return selectTaskerItems(state, action.payload);
        case ActionType.UNSELECT_TASKER_CHART_ITEM:
            return unselecteTaskerItems(state, action.payload);
        case ActionType.CLEAR_TASKER_CHART_ALL_ITEMS:
            return clearSelectedTaskerItems(state, action.payload);

        default:
            return state;
    }

    function setWorkspaces(state: WorkspaceModel[], payload: any) {
        // init array
        state = [];
        _.each(payload.workspaces, (workspace: WorkspaceModel) => {
            //workspace.taskers = [];

            // add initialization state in state model
            state.push(workspace);
        });
        return [...state];
    }

    function addWorkspace(state: WorkspaceModel[], payload: any) {
        payload.workspace.taskers = [];
        state.push(payload.workspace);
        return [...state];
    }

    function removeWorkspace(state: WorkspaceModel[], payload: any) {
        state = _.filter(state, (workspace: WorkspaceModel) => {
            if (workspace.workspaceId !== payload.workspaceId) {
                return true;
            }
            return false;
        });
        return [...state];
    }

    function clearWorkspaces(state: WorkspaceModel[], payload: any) {
        state = [];
        return state;
    }

    function setTaskers(state: WorkspaceModel[], action: any) {
        var workspace = _workspace(state, action.workspaceId);
        if (!workspace) {
            throw 'There is not workspace of ' + action.workspaceId;
        }

        // init array
        workspace.taskers = [];
        _.each(action.taskers, function (tasker: TaskerModel) {
            tasker.selected = false,
                tasker.selectedItems = [];
            workspace.taskers.push(tasker);
        });
        return [...state];
    }

    function addTasker(state: WorkspaceModel[], payload: any) {
        var workspace = _workspace(state, payload.workspaceId);

        if (!workspace) {
            throw 'workspace.handler._addTasker, There is not workspace of ' + payload.workspaceId;
        }

        // TODO Deliverable #2 temp code
        var tasker = {
            taskerId: payload.tasker.taskerId,
            workspaceId: payload.tasker.workspaceId,
            taskerTypeId: payload.tasker.taskerTypeId,
            taskerType: payload.tasker.taskerType,
            selected: false,
            selectedItems: <any>[]
        };

        workspace.taskers.push(tasker);
        return [...state];
    }

    function removeTasker(state: WorkspaceModel[], payload: any) {
        var workspace = _workspace(state, payload.workspaceId);
        if (!workspace) {
            throw 'workspace.handler._removeTasker, There is not workspace of ' + payload.workspaceId;
        }

        workspace.taskers = _.filter(workspace.taskers, (tasker: TaskerModel) => {
            if (tasker.taskerId !== payload.taskerId) {
                return true;
            }
            return false;
        });
        return [...state];
    }

    function updateTasker(state: WorkspaceModel[], payload: any) {
        var workspace = _workspace(state, payload.workspaceId);
        if (!workspace) {
            throw 'workspace.handler._updateTasker, There is not workspace of ' + payload.workspaceId;
        }

        workspace.taskers.map((tasker: TaskerModel) => {
            if (tasker.taskerId === payload.tasker.taskerId) {
                tasker = payload.tasker;
                tasker.selected = false,
                    tasker.selectedItems = [];
            }
            return tasker;
        });
        return [...state];
    }

    // tasker select & unselect items
    function selectTaskerItems(state: WorkspaceModel[], payload: any) {
        var workspace = _workspace(state, payload.workspaceId);
        if (!workspace) {
            throw 'workspace.handler._selectTaskerItems, There is not workspace of ' + payload.workspaceId;
        }

        workspace.taskers.map((tasker: TaskerModel) => {
            if (tasker.taskerId === payload.taskerId) {
                _.each(payload.items, (actionItem: any) => {
                    // 중복을 제거한다.
                    // item = {id: <id>, data: <data>};
                    if (tasker.selectedItems.length > 0) {
                        tasker.selectedItems = _.filter(tasker.selectedItems, (selectedItem: any) => {
                            if (selectedItem.id !== actionItem.id) {
                                return selectedItem;
                            }
                        });
                    }

                    tasker.selectedItems.push(actionItem);
                });

                if (tasker.selectedItems && tasker.selectedItems.length > 0) {
                    tasker.selected = true;
                }
            }
            return tasker;
        });

        return [...state];
    }

    function unselecteTaskerItems(state: WorkspaceModel[], payload: any) {
        var workspace = _workspace(state, payload.workspaceId);
        if (!workspace) {
            throw 'workspace.handler._unselectTaskerItems, There is not workspace of ' + payload.workspaceId;
        }

        workspace.taskers.map((tasker: TaskerModel) => {
            if (tasker.taskerId === payload.taskerId) {
                tasker.selectedItems = _.filter(tasker.selectedItems, (item: any) => {
                    if (item.id !== payload.items[0].id) {
                        return item;
                    }
                });

                if (tasker.selectedItems && tasker.selectedItems.length === 0) {
                    tasker.selected = false;
                }
            }
            return tasker;
        });

        return [...state];
    }

    function clearSelectedTaskerItems(state: WorkspaceModel[], payload: any) {
        _.each(state, (workspace: WorkspaceModel) => {
            _.each(workspace.taskers, (tasker: TaskerModel) => {
                if (payload.taskerId) {
                    if (payload.taskerId === tasker.taskerId) {
                        tasker.selectedItems = [];
                        return;
                    }
                } else {
                    tasker.selectedItems = [];
                }
            });
        });
        return [...state];
    }

    function _workspace(state: WorkspaceModel[], workspaceId: any) {
        return _.findWhere(state, {
            workspaceId: parseInt(workspaceId, 10)
        });
    }
    
};

