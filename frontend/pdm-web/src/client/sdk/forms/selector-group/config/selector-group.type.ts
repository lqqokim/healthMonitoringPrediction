export interface SelectorGroupConfigType {
    key: string;
    title?: any;
    
    // locationTypes 
    initValue: any;

    // condition constants
    conditionConstant: any;

    isToolModelEnable: boolean;
    isToolsEnable: boolean;
    isExcludeParamsEnable: boolean;
    
    setItem: any;
    selectedValue?: any;
    transformItem?: any;
}