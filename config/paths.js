const { resolve } = require('path');

module.exports = {
  srcRoot:resolve(__dirname,'../src'),
  pageDir:resolve(__dirname,'../src/page'),
  buildDir:resolve(__dirname,'../build'),
  publicDir:resolve(__dirname,'../public'),
  distDir:resolve(__dirname,'../dist'),
  staticDir:resolve(__dirname,'../src/static')
}

