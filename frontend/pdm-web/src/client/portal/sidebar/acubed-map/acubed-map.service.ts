import { Injectable } from '@angular/core';
import { MapModelService, SessionService, WorkspaceModelService } from '../../../common';

@Injectable()
export class AcubedMapService {

    constructor(
        private session: SessionService,
        private mapModel: MapModelService,
        private workspaceModel: WorkspaceModelService
    ) {}

    // workspacemap(userId: string) {
    //     if (this.session.getUserId() === userId) {
    //         return this.mapModel.getWorkspacemap(userId);
    //     } else {
    //         return this.mapModel.getSharedWorkspacemap();
    //     }
    // }

    getWorkspacemap(userId: string, filter: any, type: string = ''): any {
        if (type === '') {
            return this.mapModel.getWorkspacemap(userId, filter)
        } else if (type === 'shared') {
            return this.mapModel.getSharedWorkspacemap(userId)
        } else if (type === 'sharing') {
            return this.mapModel.getSharingWorkspacemap(userId)
        }
    }

    getTaskerWorkspacemap(workspaceId: number) {
        return this.mapModel.getTaskerWorkspacemap(workspaceId);
    }

    deleteWorkspace(workspaceId: any) {
        return this.workspaceModel.deleteWorkspace(workspaceId);
    }

    deleteTasker(workspaceId: any, taskerId: any) {
        return this.workspaceModel.deleteTasker(workspaceId, taskerId);
    }

    getVisMapData(response: any) {
        let data = this._parseVisMapData(response);
        let nodes = []; //[{id: 0, size: 30, nodeType: 'U', shape: 'circularImage', image: this.session.getUserImgPath()}];
        let edges = [];
        let style = this.getVisMapStyle();

        // user node
        nodes.push({id: 0, size: 30, nodeType: 'U', shape: 'circularImage', image: this.session.getUserImgPath()})
        
        data.forEach((d: any, i: number) => {
            nodes.push({
                id: d.id,
                label: d.label,
                hiddenLabel: d.label,
                nodeType: d.nodeType,
                workspaceId: d.workspaceId,
                taskerId: d.taskerId,
                parent: d.from,
                font: style.font.normal,
                size: d.nodeType === 'W' ? style.node.size.workspace : style.node.size.tasker,
                color: d.nodeType === 'W' ? style.node.color.workspace.default : style.node.color.tasker.default
            });
            edges.push({
                from: d.from,
                to: d.to
            });
        });

        return {
            nodes: new (<any>window)['vis'].DataSet(nodes),
            edges: new (<any>window)['vis'].DataSet(edges)
            // nodes: new vis.DataSet(nodes),
            // edges: new vis.DataSet(edges)
        };
    }

    private _parseVisMapData(data) {
        let result = [],
            maps = data.map;

        // TODO : 조회조건 적용되면 삭제
        //maps = maps ? maps.slice(0, 50) : [];

        maps.forEach(function(d,i){
            result.push({
                id: d.nodeType + d.id,
                label: d.nodeType === 'W' ? d.id + ' ' + d.title : d.title,
                nodeType: d.nodeType,
                from: d.parentId ? (d.parentId === d.workspaceId ? 'W' + d.parentId : 'T' + d.parentId) : 0,
                to: d.nodeType + d.id,
                workspaceId: d.workspaceId,
                taskerId: d.nodeType === 'T' ? d.id : null
            });
        })

        return result;
    }

    getVisMapStyle() {
        return {
            node: { 
                size: {
                    workspace: 18,
                    tasker: 14
                },
                color: {
                    workspace: {
                        default: {
                            border: '#2570a9',
                            background: '#47a6ef'
                        },
                        highlight: {
                            border: '#405e64',
                            background: '#69ddee'
                        },
                        hover: {
                            border: '#405e64',
                            background: '#69ddee'
                        },
                        darken: {
                            border: '#e6e6e6',
                            background: '#e6e6e6'
                        }
                    },
                    tasker: {
                        default: {
                            border: '#698090',
                            background: '#a3bdd0'
                        },
                        highlight: {
                            border: '#50676f',
                            background: '#a8d6e0'
                        },
                        hover: {
                            border: '#50676f',
                            background: '#a8d6e0'
                        },
                        darken: {
                            border: '#e6e6e6',
                            background: '#e6e6e6'
                        }
                    }
                }
            },
            font: {
                normal: {color: '#333333', size: 11, background: '#eee'},
                hover: {color: '#333333', size: 14, background: '#eee'},
                darken: {color: '#e6e6e6', border: '#e6e6e6', background:'#e6e6e6'}
            }
        }
    }

    getVisMapConfig() {
        let style = this.getVisMapStyle();
        return {
            nodes: {
                shape: 'dot',
                size: 11,
                borderWidth: 2,
            },
            edges: {
                hoverWidth: 1,
                color: {
                    inherit: 'to',
                    opacity: 0.5
                },
                selectionWidth: 1,
                width: 1
            },
            interaction: {
                hover: true,
                hoverConnectedEdges: false,
                selectConnectedEdges: false,
                hideEdgesOnDrag: true,
                hideNodesOnDrag: false
            }
        };
    }

    getTooltipOption(event: any) {
        return {
            type: A3_CONFIG.TOOLTIP.TYPE.MENU,
            event: event,
            options: {
                position: {
                    container: $('#acubedmap'),
                    target: [event.position.x, event.position.y]
                },
                show: {
                    event: 'none'
                },
                hide: {
                    event: 'none'
                }
            }
        }
    }

    /*
    getVisMapConfigOldVersion() {
        let style = this.getVisMapStyle();
        return {
            nodes: {
                shape: 'dot',
                size: 11,
                // font: {
                //     size: style.font.normal.size,
                //     color: style.font.normal.color
                // },
                borderWidth: 2,
                // color: {
                //     border: style.node.normal.border,
                //     background: style.node.normal.background,
                //     highlight: {
                //         border: style.node.hover.border,
                //         background: style.node.hover.background
                //     },
                //     hover: {
                //         border: style.node.hover.border,
                //         background: style.node.hover.background
                //     }
                // }
            },
            edges: {
                hoverWidth: 1,
                // smooth: {
                //     enabled: true,
                //     type: "dynamic",
                //     roundness: 0.5
                // },
                color: {
                    inherit: 'to',
                    opacity: 0.5
                },
                selectionWidth: 1,
                width: 1
            },
            interaction: {
                hover: true,
                hoverConnectedEdges: false,
                selectConnectedEdges: false,
                hideEdgesOnDrag: true,
                hideNodesOnDrag: false
            },
            physics: {
                // stabilization: false,
                // maxVelocity: 40,
                // minVelocity: 10,
                // barnesHut: {
                //     gravitationalConstant: -6000,
                //     centralGravity: 0.3,
                //     springLength: 95,
                //     springConstant: 0.04,
                //     damping: 0.09,
                //     avoidOverlap: 0
                // }
            }
        };
    }
    */

}
