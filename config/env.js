// const argv = require('yargs-parser')(process.argv.slice(2));
const fs = require('fs');
const path = require('path');
const argv = require('yargs').argv;
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

const env = argv.env || argv.mode;
const ENV_FILE_PATH = path.resolve(__dirname, '../.env');

let dotenvFiles = [
  `${ENV_FILE_PATH}.${env}.local`,
  `${ENV_FILE_PATH}.${env}`,
  env !== 'test' && `${ENV_FILE_PATH}.local`,
  ENV_FILE_PATH
].filter(Boolean);

dotenvFiles.forEach((dotenvFile) => {
  if (fs.existsSync(dotenvFile)) {
    dotenvExpand(dotenv.config({
      path: dotenvFile
    }));
  }
});

const REACT_APP = /^REACT_APP_/i;

module.exports = function () {
  const raw = Object.keys(process.env)
    .filter(key => REACT_APP.test(key))
    .reduce(
      (env, key) => {
        env[key] = process.env[key];
        return env;
      },
      {
        NODE_ENV: argv.mode || 'production', //webpack在production模式下会自动启用一些配置
        APP_ENV: env,
      }
    );

  const stringified = {};
  Object.keys(raw).forEach((key, index) => {
    stringified['process.env.' + key] = JSON.stringify(raw[key]);
  });

  return { raw, stringified }
}
