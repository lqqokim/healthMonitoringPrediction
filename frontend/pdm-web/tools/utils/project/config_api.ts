import * as util from 'gulp-util';
import { argv } from 'yargs';
import { join } from 'path';
// import { A3ConfigConstant } from '../../../src/client/a3-config';

const getConfig = (path: string, env: string): any => {
  const configPath = join(path, env);
  let config: any;
  try {
    config = require(configPath);
  } catch (e) {
    config = null;
    util.log(e.message);
  }

  return config;
};

// const a3Config = require(join(process.cwd(), 'src/client/assets/config', 'a3-config-runtime.json'));

// by ysyun
export function getAPI(configPath: string) {
  const configEnvName = argv['config-env'] || argv['env-config'] || 'dev';
  // const baseConfig = getConfig(configPath, 'base');
  const config = getConfig(configPath, configEnvName);
  console.log('>> Mode', configEnvName.toUpperCase(), ', app_base', config.API);
  return config.API;

  // not used APP_BASE
  // let base = argv['base'] || a3Config[configEnvName.toUpperCase()].API_CONTEXT;
  // return base;

  // if (configEnvName === 'dev') {
  //   console.log('>> Development Context:', A3ConfigConstant.URL.DEV_CONTEXT)
  //   return A3ConfigConstant.URL.DEV_CONTEXT;
  // } else {
  //   console.log('>> Production Context:', A3ConfigConstant.URL.PROD_CONTEXT)
  //   return A3ConfigConstant.URL.PROD_CONTEXT;
  // }
}

