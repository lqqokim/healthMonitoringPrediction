/**
 * get service instance 
 * let _http = InjectorUtil.getService(Http);
 */
import { Injector, Injectable } from '@angular/core';

@Injectable()
export class InjectorUtil {
  static instance: InjectorUtil;    
  static isCreating: Boolean = false;
  private _injector: Injector;

  constructor() {
    if(!InjectorUtil.isCreating) {
      throw new Error("You can't call new in Singleton instances!");
    }
  }

  static getInstance() {
    if(InjectorUtil.instance == null) {
      InjectorUtil.isCreating = true;
      InjectorUtil.instance = new InjectorUtil();
      InjectorUtil.isCreating = false;
    }

    return InjectorUtil.instance;
  }

  setInjector(injector: Injector) {
    this._injector = injector;
  }

  getInjector(): Injector {
    return this._injector;
  }

  static getService<T>(serviceName: any) {
     let injector: Injector = InjectorUtil.getInstance().getInjector();
     return injector.get(serviceName);
  }
}