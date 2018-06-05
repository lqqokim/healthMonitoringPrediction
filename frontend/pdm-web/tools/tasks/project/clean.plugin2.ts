import Config from '../../config';
import { clean } from '../../utils';
import { argv } from 'yargs';
import { join } from 'path';

/**
 * Executes the build process, cleaning all files within the `/dist/dev` directory.
 */
// type
let watchType = argv['type'];
if (watchType === 'w') {
    watchType = 'widgets';
} else if (watchType === 't') {
    watchType = 'taskers';
}
// name
const watchName = argv['name'];
// config file path
const watchConfig = argv['config'];
// path 
const watchPath = argv['path'];

let filePath: any[] = [];
if (watchType && watchName) {
    filePath.push(join(Config.APP_DEST, 'plugins', watchType, watchName));
} else if (watchConfig) {
    let targetInfos = require(join(process.cwd(), watchConfig));
    targetInfos.forEach((wpath: string) => {
        filePath.push(join(Config.APP_DEST, wpath));
    });
} else if (watchPath) {
    const watchPaths = watchPath.split(':');
    watchPaths.forEach((wpath: string) => {
        filePath.push(join(Config.APP_DEST, wpath));
    });
}

export = clean(filePath);
