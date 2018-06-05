export interface FormConfigType {
    key?: string;
    proxy?: {
        initValuePromise?: any;
        // selectedValuePromise?: any;
    };
    component?: any;
    // 컴포넌트별 타입에 대하여 | 조건으로 열거한다. 
    config?: any;
}
