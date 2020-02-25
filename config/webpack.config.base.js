const path = require('path');
const { resolve } = path;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const { srcRoot, buildDir, pageDir, staticDir, publicDir } = require('./paths');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');
const InterpolateHtmlPlugin = require('interpolate-html-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');

const env = require('./env')();
module.exports = {
  mode: 'production',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.mjs', '.scss'],
    alias: {
      '@ant-design/icons/lib/dist$': path.resolve(__dirname, '../src/antd_fix/icon.ts')
    }
  },
  entry: {
    app: path.resolve(__dirname, '../src/index.tsx'),
    // category: path.resolve(__dirname, '../src/page/category/Index.jsx'),
    // 将 第三方依赖 单独打包
    // vendor: [
    //   'react',
    //   'react-dom',
    //   // 'antd',
    //   'react-redux',
    //   'react-router',
    //   'react-router-dom',
    //   'redux',
    //   'xlsx',
    //   // 'whatwg-fetch',
    //   // 'immutable'
    // ]
  },
  //提取公共模块
  optimization: {
    splitChunks: {
      minChunks: 2,
      maxInitialRequests: 5,
      cacheGroups: {
        common: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          name: 'common',
          minChunks: 2,
          maxInitialRequests: 5,
          minSize: 0,
        }
      }
    }
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'eslint-loader',
        options: {
          emitWarning: true, // 这个配置需要打开，才能在控制台输出warning信息
          emitError: true, // 这个配置需要打开，才能在控制台输出error信息
          fix: true // 是否自动修复，如果是，每次保存时会自动修复可以修复的部分
        }
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        include: srcRoot,
        loader: 'babel-loader',
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1
            }
          },
          // "postcss-loader",
          "sass-loader",
          {
            loader: 'sass-resources-loader',
            options: {
              resources: [
                resolve(srcRoot, '../src/common/common.scss'),
                resolve(srcRoot, '../src/common/icon.scss'),
              ]
            }
          }
        ]
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: require.resolve('url-loader'),
        options: {
          limit: 5000,
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
      {
        test: /\.(woff|woff2|svg|ttf|eot)($|\?)/i,
        loader: require.resolve('url-loader'),
        options: {
          limit: 5000,
          name: 'static/media/[name].[hash:8].[ext]',
        },
      } // 限制大小小于5k      
    ]
  },

  plugins: [
    new WebpackBuildNotifierPlugin({
      title: "My mt Project Webpack Build",
      // logo: path.resolve("./img/favicon.png"),
      suppressSuccess: true
    }),

    //调用autoprefixer插件，例如 display: flex
    require('autoprefixer'), 
    
    // app 模块
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../template/index.html'),
      filename: 'index.html',
      // chunks: ['common', 'app']
    }),

    new FriendlyErrorsPlugin(),
    // category 模块
    // new HtmlWebpackPlugin({
    //   template: path.resolve(__dirname, '../src/page/category/Category.html'),
    //   filename: 'category.html',
    //   chunks: ['common', 'category']
    // }),

    //插入环境变量   // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    new InterpolateHtmlPlugin(env.raw),

    // 在js代码中能够使用环境变量(demo: process.env.REACT_APP_ENV === 'dev')
    new webpack.DefinePlugin(env.stringified),

    new CopyPlugin([
      { from: publicDir, to: buildDir },
    ]),
  ]
}