import * as util from 'gulp-util';
import { argv } from 'yargs';
import { join } from 'path';

import Config from '../../config';

const getConfig = (path: string, env: string): any => {
    const configPath = join(path, env);
    let config: any;
    try {
        config = JSON.parse(JSON.stringify(require(configPath)));
    } catch (e) {
        config = null;
        util.log(e.message);
    }

    return config;
};

/**
 * Returns the project configuration (consisting of the base configuration provided by seed.config.ts and the additional
 * project specific overrides as defined in project.config.ts)
 */
export function templateLocals() {
    const configEnvName: string = argv['build-type'] || argv['config-env'] || argv['env-config'] || argv['env'] || 'dev';
    // const configPath = Config.getPluginConfig('environment-config');
    // const baseConfig = getConfig(configPath, 'base');
    // const config = getConfig(configPath, configEnvName);

    // Additional Arguments
    const tomcatUrl: string = argv['tomcat-url'];
    const buildNo: string = argv['build-no'] || 'local-dev';
    //@see http://stove99.tistory.com/46
    const d: Date = new Date();
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    let buildDate = year + '/' + month + '/' + day;

    let additionalConfig = Object.assign(Config, {
        TOMCAT_URL: tomcatUrl,
        BUILD_NO: buildNo,
        BUILD_DATE: buildDate
    });

    return Object.assign(additionalConfig, {
        ENV_CONFIG: JSON.stringify({
            ENV: configEnvName.toUpperCase()
        })
    });
}

