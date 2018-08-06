import { Injectable } from '@angular/core';

@Injectable()
export class ConfigurationMenuService {

    getUser(): Promise<any> {
        return Promise.resolve([
            {
                applicationId: 'user',
                name: 'User',
                menus: [
                    {
                        menuId: 'userProfile',
                        name: 'User Profile',
                        description: 'User Profile',
                        menus: <any>[]
                    },
                    {
                        menuId: 'userPassword',
                        name: 'User Password',
                        description: 'User Password',
                        menus: <any>[]
                    }
                ]
            }
        ]);
    }

    getPdmGlobals(): Promise<any> {
        return Promise.resolve([
            {
                applicationId: 'pdm',
                name: 'HMP Management',
                menus: [
                    // {
                    //     menuId: 'pdmArea',
                    //     name: 'Area',
                    //     description: 'Pdm Area',
                    //     menus: <any>[]
                    // },
                    // {
                    //     menuId: 'pdmEqp',
                    //     name: 'EQP',
                    //     description: 'Pdm EQP',
                    //     menus: <any>[]
                    // },
                    // {
                    //     menuId: 'pdmParameter',
                    //     name: 'Parameter',
                    //     description: 'Pdm Parameter',
                    //     menus: <any>[]
                    // },

                    // {
                    //     menuId: 'pdmPart',
                    //     name: 'Part',
                    //     description: 'Pdm Part',
                    //     menus: <any>[]
                    // },
                    {
                        menuId: 'pdmMasterInfo',
                        name: 'Master Info',
                        description: 'Pdm Master Info',
                        menus: <any>[]
                    },
                    {
                        menuId: 'pdmBearing',
                        name: 'Bearing',
                        description: 'Pdm Bearing',
                        menus: <any>[]
                    },
                    // {
                    //     menuId: 'pdmCategory',
                    //     name: 'Category',
                    //     description: 'Pdm Category Management',
                    //     menus: <any>[]
                    // },
                    {
                        menuId: 'pdmCode',
                        name: 'Code',
                        description: 'Pdm Code Management',
                        menus: <any>[]
                    },
                    {
                        menuId: 'pdmFilterAnalysis',
                        name: 'Filter Analysis',
                        description: 'Pdm Filter Analysis',
                        menus: <any>[]
                    },
                    {
                        menuId: 'pdmFabMonitoring',
                        name: 'Fab Monitoring',
                        description: 'Pdm Fab Monitoring',
                        menus: <any>[]
                    },
                    {
                        menuId: 'pdmModelSimulator',
                        name: 'Modeling Simulator',
                        description: 'Modeling Simulator',
                        menus: <any>[]
                    },
                    {
                        menuId: 'pdmEqupmentParameterTrend',
                        name: 'Equipment Parameter Trend',
                        description: 'Equipment Parameter Trend',
                        menus: <any>[]
                    },
                    {
                        menuId: 'pdmSummaryTrend',
                        name: 'Summary Trend',
                        description: 'Summary Trend',
                        menus: <any>[]
                    },

                    
                ]
            },
            {
                applicationId: 'recovery',
                name: 'Manual Data Recovery',
                menus: [
                    {
                        menuId: 'jobExecute',
                        name: 'Job Execute',
                        description: 'Job Execute',
                        menus: <any>[]
                    },
                    {
                        menuId: 'jobHistory',
                        name: 'Job History',
                        description: 'Job History',
                        menus: <any>[]
                    },
                    {
                        menuId: 'logSQLParser',
                        name: 'Log SQL Parser',
                        description: 'log SQL Parser',
                        menus: <any>[]
                    }
                ]
            },
            // {
            //     applicationId: 'modeling',
            //     name: 'Modeling',
            //     menus: [
            //         {
            //             menuId: 'pdmAutoModeling',
            //             name: 'Auto Modeling',
            //             description: 'Pdm Modeling',
            //             menus: <any>[]
            //         }
            //     ]
            // }
        ]);
    }

    getAllApplications(): Promise<any> {
        return Promise.resolve([
            // {
            //     applicationId: 'wqp',
            //     name: 'WQP',
            //     menus: [
            //         {
            //             menuId: 'fdcWqp',
            //             name: 'Product operation sequence',
            //             description: 'Product operation sequence',
            //             menus: <any>[]
            //         }
            //     ]
            // },
            {
                applicationId: 'authority',
                name: 'Authority',
                menus: [
                    {
                        menuId: 'userList',
                        name: 'User List',
                        description: 'User List',
                        menus: <any>[]
                    },
                    // {
                    //     menuId: 'groupList',
                    //     name: 'Group List',
                    //     description: 'Group List',
                    //     menus: <any>[]
                    // }
                    /*,
                    {
                        menuId: 'roleList',
                        name: 'Role List',
                        description: 'Role List',
                        menus: <any>[]
                    },
                      {
                        menuId: 'menuFunctionList',
                        name: 'Menu-Function List',
                        description: 'Menu-function List',
                        menus: <any>[]
                    }*/
                ]
            },
            //by ysun
            //TODO: 업무별로 configuration 을 틀리게 적용할 필요가 있다.  
            //  {
            //     applicationId: 'tools',
            //     name: 'Tools',
            //     menus: [
            //         {
            //             menuId: 'location',
            //             name: 'Location',
            //             description: 'Location',
            //             menus: <any>[]
            //         },
            //         {
            //             menuId: 'toolGroup',
            //             name: 'Tool Group',
            //             description: 'Tool Group',
            //             menus: <any>[]
            //         },
            //         {
            //             menuId: 'toolModel',
            //             name: 'Tool Model',
            //             description: 'Tool Model',
            //             menus: <any>[]
            //         },
            //         {
            //             menuId: 'inlineTool',
            //             name: 'Inline Tool',
            //             description: 'Inline Tool',
            //             menus: <any>[]
            //         },
            //         {
            //             menuId: 'inlineGroup',
            //             name: 'Inline Group',
            //             description: 'Inline Group',
            //             menus: <any>[]
            //         },
            //         {
            //             menuId: 'moduleGroup',
            //             name: 'Module Group',
            //             description: 'Module Group',
            //             menus: <any>[]
            //         },
            //         {
            //             menuId: 'moduleType',
            //             name: 'Module Type',
            //             description: 'Module Type',
            //             menus: <any>[]
            //         },
            //         {
            //             menuId: 'parameterCategory',
            //             name: 'Parameter Category',
            //             description: 'Parameter Category',
            //             menus: <any>[]
            //         },
            //     ]
            // },
            // {
            //     applicationId: 'fdc',
            //     name: 'FDC+',
            //     menus: [
            //         {
            //             menuId: 'parameterCategory',
            //             name: 'Parameter Categorization',
            //             description: 'Parameter Categorization',
            //             menus: <any>[]
            //         },
            //         {
            //             menuId: 'fdcFdta',
            //             name: 'DFD Configuration',
            //             description: 'DFD Configuration',
            //             menus: <any>[]
            //         },
            //         {
            //             menuId: 'fdcWqp',
            //             name: 'WQP Product Operation Sequence',
            //             description: 'WQP Product Operation Sequence',
            //             menus: <any>[]
            //         }
            //     ]
            // },
            {
                applicationId: 'pdm',
                name: 'PDM',
                menus: [
                    {
                        menuId: 'pdmArea',
                        name: 'Area Registration',
                        description: 'Pdm Area',
                        menus: <any>[]
                    },
                    {
                        menuId: 'pdmEqp',
                        name: 'EQP Registration',
                        description: 'Pdm EQP',
                        menus: <any>[]
                    },
                    {
                        menuId: 'pdmParameter',
                        name: 'Parameter Registration',
                        description: 'Pdm Parameter',
                        menus: <any>[]
                    },
                    {
                        menuId: 'pdmBearing',
                        name: 'Bearing Registration',
                        description: 'Pdm Bearing',
                        menus: <any>[]
                    },
                    {
                        menuId: 'pdmPart',
                        name: 'Part Registration',
                        description: 'Pdm Part',
                        menus: <any>[]
                    },
                    {
                        menuId: 'pdmAutoModeling',
                        name: 'Auto Modeling',
                        description: 'Pdm Modeling',
                        menus: <any>[]
                    }
                ]
            }
        ]);
    }

    getApplications(): Promise<any> {
        return Promise.resolve([
            // {
            //     applicationId: 'wqp',
            //     name: 'WQP',
            //     menus: [
            //         {
            //             menuId: 'fdcWqp',
            //             name: 'Product operation sequence',
            //             description: 'Product operation sequence',
            //             menus: <any>[]
            //         }
            //     ]
            // },
            {
                applicationId: 'authority',
                name: 'Authority',
                menus: [
                    {
                        menuId: 'userList',
                        name: 'User List',
                        description: 'User List',
                        menus: <any>[]
                    },
                    // {
                    //     menuId: 'groupList',
                    //     name: 'Group List',
                    //     description: 'Group List',
                    //     menus: <any>[]
                    // }
                    /*,
                    {
                        menuId: 'roleList',
                        name: 'Role List',
                        description: 'Role List',
                        menus: <any>[]
                    },
                      {
                        menuId: 'menuFunctionList',
                        name: 'Menu-Function List',
                        description: 'Menu-function List',
                        menus: <any>[]
                    }*/
                ]
            }
            //by ysun
            //TODO: 업무별로 configuration 을 틀리게 적용할 필요가 있다.  
            // , {
            //     applicationId: 'tools',
            //     name: 'Tools',
            //     menus: [
            //         {
            //             menuId: 'location',
            //             name: 'Location',
            //             description: 'Location',
            //             menus: <any>[]
            //         },
            //         {
            //             menuId: 'toolGroup',
            //             name: 'Tool Group',
            //             description: 'Tool Group',
            //             menus: <any>[]
            //         },
            //         {
            //             menuId: 'toolModel',
            //             name: 'Tool Model',
            //             description: 'Tool Model',
            //             menus: <any>[]
            //         },
            //         {
            //             menuId: 'inlineTool',
            //             name: 'Inline Tool',
            //             description: 'Inline Tool',
            //             menus: <any>[]
            //         },
            //         {
            //             menuId: 'inlineGroup',
            //             name: 'Inline Group',
            //             description: 'Inline Group',
            //             menus: <any>[]
            //         },
            //         {
            //             menuId: 'moduleGroup',
            //             name: 'Module Group',
            //             description: 'Module Group',
            //             menus: <any>[]
            //         },
            //         {
            //             menuId: 'moduleType',
            //             name: 'Module Type',
            //             description: 'Module Type',
            //             menus: <any>[]
            //         },
            //         {
            //             menuId: 'parameterCategory',
            //             name: 'Parameter Category',
            //             description: 'Parameter Category',
            //             menus: <any>[]
            //         },
            //     ]
            // },
            // {
            //     applicationId: 'fdc',
            //     name: 'FDC+',
            //     menus: [
            //         {
            //             menuId: 'parameterCategory',
            //             name: 'Parameter Categorization',
            //             description: 'Parameter Categorization',
            //             menus: <any>[]
            //         },
            //         {
            //             menuId: 'fdcFdta',
            //             name: 'DFD Configuration',
            //             description: 'DFD Configuration',
            //             menus: <any>[]
            //         },
            //         {
            //             menuId: 'fdcWqp',
            //             name: 'WQP Product Operation Sequence',
            //             description: 'WQP Product Operation Sequence',
            //             menus: <any>[]
            //         }
            //     ]
            // },
        ]);
    }

}
