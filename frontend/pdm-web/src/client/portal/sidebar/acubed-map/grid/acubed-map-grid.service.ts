import { Injectable } from '@angular/core';

import { WorkspaceModelService } from '../../../../common/model/platform/workspace-model.service';
import { Formatter } from '../../../../sdk';

@Injectable()
export class AcubedMapGridService {

    constructor( private workspaceModel: WorkspaceModelService ) {}

    getMyWorkspace(workspaceId: number) {
        return this.workspaceModel.getMyWorkspace(workspaceId).then((result: any) => {
            let data = result;
            let infoName = _.pluck(data.shareInfo, 'name');
            data['shareNames'] = infoName;
            data.createDtts = Formatter.Date.format(data.createDtts, 'MM/DD/YYYY HH:mm');
            data.updateDtts = Formatter.Date.format(data.updateDtts, 'MM/DD/YYYY HH:mm');

            return data;
        });
    }

    getMyWorkspaces() {
        return this.workspaceModel.getMyWorkspaces().then((result: any) => {
            let data = [];
            let infoName = [];
            for (var i = 0; i < result.length; i++) {
                let shareInfo = result[i].shareInfo;
                infoName = _.pluck(shareInfo, 'name');
                data.push ({
                    workspaceId: result[i].workspaceId,
                    title: result[i].title,
                    userId: result[i].userId,
                    description: result[i].description ? result[i].description : '',
                    userName: result[i].userName,
                    favorite: result[i].favorite,
                    shareInfo: result[i].shareInfo,
                    shareNames: infoName,
                    createDtts: Formatter.Date.format(result[i].createDtts, 'MM/DD/YYYY HH:mm'),
                    updateDtts: Formatter.Date.format(result[i].updateDtts, 'MM/DD/YYYY HH:mm')
                });
            };

            return data;
        });
    }

    getWorkspace(workspaceId: number) {
        return this.workspaceModel.getWorkspace(workspaceId);
    }

    updateWorkspace(workspace: any) {
        let data = workspace.data;
        let params = {
            workspaceId: data.workspaceId,
            title: data.title,
            favorite: data.favorite,
            description: data.description
        };

        return this.workspaceModel.updateWorkspace(data.workspaceId, params);
    }

    updateWorkspaceFavorite(workspaceId: number, param: any) {
        return this.workspaceModel.updateWorkspaceFavorite(workspaceId, param);
    }

    deleteWorkspace(workspaceId: number) {
        return this.workspaceModel.deleteWorkspace(workspaceId);
    }

    multiDeleteWorkspace(params: any) {
        return this.workspaceModel.deleteWorkspaces(params);
    }

    getGridMock() {
        let gridData = [
            { workspaceId: '1', title: 'myWorkspace1', description: 'test1', userName: 'user1',
            favorite : false,
            shareInfo: [
                {
                    id : 'yslee',
                    name : 'Davie Lee',
                    type : 'user'
                },
                {
                    id : 'eeeeeee',
                    name : 'wwwwww',
                    type : 'user'
                },
                {
                    id : 'eeeeeee',
                    name : ' workspace#',
                    type : 'user'
                },
                {
                    id : 'eeeeeee',
                    name : '#AVENGERS',
                    type : 'user'
                },
              ],
              createdDtts: '', updateDtts:''},
            { workspaceId: '2', title: 'myWorkspace2', description: 'test2', userName: 'user2', favorite : true, shareInfo: [{
                    id : 'eeeeeee',
                    name : 'wwwwww',
                    type : 'user'
                }], createdDtts: '', updateDtts:''},
            { workspaceId: '3', title: 'myWorkspace3', description: 'test3', userName: 'user3', favorite : true, shareInfo: [{
                    id : 'eeeeeee',
                    name : 'wwwwww',
                    type : 'user'
                }],  createdDtts: '', updateDtts:''},
            { workspaceId: '3', title: 'myWorkspace3', description: 'test3', userName: 'user3', favorite : false, shareInfo: [{
                    id : 'eeeeeee',
                    name : 'wwwwww',
                    type : 'user'
                }],  createdDtts: '', updateDtts:''},
            { workspaceId: '3', title: 'myWorkspace3', description: 'test3', userName: 'user3', favorite : false, shareInfo: [{
                    id : 'eeeeeee',
                    name : 'wwwwww',
                    type : 'user'
                }],  createdDtts: '', updateDtts:''}
        ];
        return this._makeAsync(gridData);
    }

    _makeAsync( data: Array<any> ) {
        let promise: any = new Promise((resolve, reject) => resolve());
            promise = promise.then(() => { return data; });
        return promise;
    }


}
