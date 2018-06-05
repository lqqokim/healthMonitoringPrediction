import { watchPlugin, watchFiles, watchPath } from '../../utils';
import { argv } from 'yargs';
/**
 * Executes the build process, watching for file changes and rebuilding the development environment.
 */
// type
let pluginType = argv['type'];
if (pluginType === 'w') {
    pluginType = 'widgets';
} else if (pluginType === 't') {
    pluginType = 'taskers';
}
// name
const pluginName = argv['name'];
// config file path
const pluginConfig = argv['config'];
// path 
const pluginPath = argv['path'];

let watch;
if (pluginType && pluginName) {
    console.log(' > watch target:', 'plugins/' + pluginType + '/' + pluginName);
    watch = watchPlugin(pluginType, pluginName);
} else if (pluginConfig) {
    console.log(' > watch config:', pluginConfig);
    watch = watchFiles(pluginConfig);
} else if (pluginPath) {
    console.log(' > watch path:', pluginPath);
    watch = watchPath(pluginPath);
}

export = watch;