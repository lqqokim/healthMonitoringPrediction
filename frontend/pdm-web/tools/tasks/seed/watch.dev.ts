import { watch } from '../../utils';

/**
 * Executes the build process, watching for file changes and rebuilding the development environment.
 */
import { argv } from 'yargs';
/**
 * Executes the build process, watching for file changes and rebuilding the development environment.
 */
let isExcludePlugin = argv['exclude-plugin'] || false;
if (isExcludePlugin === 'true') {
    isExcludePlugin = true;
}
export = watch('build.dev', isExcludePlugin);
