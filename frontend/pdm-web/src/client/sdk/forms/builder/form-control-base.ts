export class FormControlBase<T>{
  value: T;
  key: string;
  config: any;
  controlType: string;
  // label: string;
  // required: boolean;
  // order: number;

  constructor(options: {
      value?: T,
      key?: string,
      config?: any,
      controlType?: string
      // label?: string,
      // required?: boolean,
      // order?: number
    } = {}) {
    this.value = options.value;
    this.key = options.key || '';
    this.config = options.config || {};
    this.controlType = options.controlType || '';
    // this.label = options.label || '';
    // this.required = !!options.required;
    // this.order = options.order === undefined ? 1 : options.order;
  }
}