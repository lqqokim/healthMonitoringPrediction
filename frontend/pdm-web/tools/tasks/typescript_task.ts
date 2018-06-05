import { Task } from './task';

export abstract class TypeScriptTask extends Task {
  shallRun(files: String[]) {
    return files.reduce((a, f) => {
      // by ysyun
      // true에 들어가야 build 가 수행된다. 
      return a || f.endsWith('.ts') || f.endsWith('.html') || f.endsWith('.css');
    }, false);
  }
}
