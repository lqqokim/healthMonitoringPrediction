export interface IDisplay {
    target?: any;
    width: number;
    height: number;
    updateDisplay(width?: number, height?: number): void;
};
